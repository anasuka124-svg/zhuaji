import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, PetCategory, Knowledge, UncommonQuestion, CommunityPost } from '@/types';

type Theme = 'light' | 'dark' | 'warm' | 'fresh';

interface AppState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  user: User | null;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  knowledge: Knowledge[];
  selectedCategory: PetCategory | 'all';
  setSelectedCategory: (category: PetCategory | 'all') => void;
  questions: UncommonQuestion[];
  posts: CommunityPost[];
  toggleFavorite: (knowledgeId: string) => void;
  addSupplement: (knowledgeId: string, content: string) => void;
  addCorrection: (knowledgeId: string, original: string, corrected: string, reason: string) => void;
  addQuestion: (question: Omit<UncommonQuestion, 'id' | 'likes' | 'views' | 'createdAt'>) => void;
  addPost: (post: Omit<CommunityPost, 'id' | 'likes' | 'comments' | 'status' | 'createdAt'>) => void;
}

// 基础知识数据
const mockKnowledge: Knowledge[] = [
  {
    id: 'k001',
    title: '猫咪日常饮食指南：如何科学喂养',
    summary: '了解猫咪的营养需求，掌握正确的喂食方法。',
    content: '猫咪是专性肉食动物，需要高蛋白质饮食。主要营养需求包括蛋白质、牛磺酸和适量脂肪。建议定时定量喂食，保证新鲜水源。',
    category: 'cat',
    tags: ['饮食', '营养', '新手必读'],
    source: { name: '中国小动物保护协会', type: 'official' },
    author: '宠物营养专家 张医生',
    views: 12580,
    likes: 892,
    createdAt: '2024-01-15',
    updatedAt: '2024-03-20',
    supplements: [],
    corrections: []
  },
  {
    id: 'k002',
    title: '狗狗基础训练：从零开始',
    summary: '掌握狗狗基础训练技巧，培养听话乖巧的毛孩子。',
    content: '基础命令包括坐下、趴下、等待。训练原则：正向强化、一致性、耐心、短时多次。',
    category: 'dog',
    tags: ['训练', '基础', '新手必读'],
    source: { name: '国际训犬师协会', type: 'expert' },
    author: '专业训犬师 陈教练',
    views: 15680,
    likes: 1123,
    createdAt: '2024-02-12',
    updatedAt: '2024-03-18',
    supplements: [],
    corrections: []
  },
  {
    id: 'k003',
    title: '豹纹守宫饲养入门',
    summary: '豹纹守宫是最适合新手的爬宠之一。',
    content: '温度控制：热区30-32°C，冷区24-26°C。主食：蟋蟀、面包虫。需要补充钙粉。',
    category: 'reptile',
    tags: ['豹纹守宫', '爬宠', '新手必读'],
    source: { name: '爬宠协会', type: 'expert' },
    author: '爬宠专家 孙老师',
    views: 12340,
    likes: 876,
    createdAt: '2024-02-18',
    updatedAt: '2024-03-12',
    supplements: [],
    corrections: []
  }
];

const mockQuestions: UncommonQuestion[] = [
  {
    id: 'q001',
    title: '猫咪突然不吃猫粮只吃零食怎么办？',
    description: '我家猫咪最近挑食严重，不吃猫粮只吃零食。',
    solution: '逐渐减少零食，尝试加热猫粮增加香味，定时定量喂食。',
    petType: '英短蓝猫',
    petCategory: 'cat',
    author: { id: 'u001', name: '蓝猫铲屎官', avatar: '' },
    images: [],
    likes: 234,
    views: 1567,
    tags: ['挑食', '饮食问题'],
    createdAt: '2024-03-01'
  }
];

const mockPosts: CommunityPost[] = [
  {
    id: 'p001',
    title: '分享一下我家布偶猫的成长照片',
    content: '从小奶猫到现在一岁半，记录一下它的成长历程。',
    author: { id: 'u001', name: '布偶控', avatar: '' },
    images: [],
    likes: 567,
    comments: 45,
    tags: ['布偶猫', '成长记录'],
    status: 'approved',
    createdAt: '2024-03-15'
  }
];

const mockUser: User = {
  id: 'u001',
  name: '测试用户',
  avatar: '',
  userType: 'pet_owner',
  verified: true,
  petPhotos: [],
  favorites: [],
  createdAt: '2024-01-01'
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      user: null,
      isLoggedIn: false,
      login: (user) => set({ user, isLoggedIn: true }),
      logout: () => set({ user: null, isLoggedIn: false }),
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      knowledge: mockKnowledge,
      selectedCategory: 'all',
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      questions: mockQuestions,
      posts: mockPosts,
      toggleFavorite: (knowledgeId) => {
        const { user } = get();
        if (!user) return;
        const favorites = user.favorites || [];
        const newFavorites = favorites.includes(knowledgeId)
          ? favorites.filter(id => id !== knowledgeId)
          : [...favorites, knowledgeId];
        set({ user: { ...user, favorites: newFavorites } });
      },
      addSupplement: (knowledgeId, content) => {
        const { knowledge, user } = get();
        if (!user) return;
        const newSupplement = {
          id: `s${Date.now()}`,
          userId: user.id,
          userName: user.name,
          content,
          createdAt: new Date().toISOString().split('T')[0],
          status: 'pending' as const
        };
        set({
          knowledge: knowledge.map(k =>
            k.id === knowledgeId
              ? { ...k, supplements: [...k.supplements, newSupplement] }
              : k
          )
        });
      },
      addCorrection: (knowledgeId, original, corrected, reason) => {
        const { knowledge, user } = get();
        if (!user) return;
        const newCorrection = {
          id: `c${Date.now()}`,
          userId: user.id,
          userName: user.name,
          originalContent: original,
          correctedContent: corrected,
          reason,
          createdAt: new Date().toISOString().split('T')[0],
          status: 'pending' as const
        };
        set({
          knowledge: knowledge.map(k =>
            k.id === knowledgeId
              ? { ...k, corrections: [...k.corrections, newCorrection] }
              : k
          )
        });
      },
      addQuestion: (question) => {
        const { questions, user } = get();
        if (!user) return;
        const newQuestion: UncommonQuestion = {
          ...question,
          id: `q${Date.now()}`,
          author: { id: user.id, name: user.name, avatar: user.avatar },
          likes: 0,
          views: 0,
          createdAt: new Date().toISOString().split('T')[0]
        };
        set({ questions: [newQuestion, ...questions] });
      },
      addPost: (post) => {
        const { posts, user } = get();
        if (!user) return;
        const newPost: CommunityPost = {
          ...post,
          id: `p${Date.now()}`,
          author: { id: user.id, name: user.name, avatar: user.avatar },
          likes: 0,
          comments: 0,
          status: 'pending',
          createdAt: new Date().toISOString().split('T')[0]
        };
        set({ posts: [newPost, ...posts] });
      }
    }),
    { name: 'zhuaji-storage', partialize: (state) => ({ theme: state.theme, user: state.user, isLoggedIn: state.isLoggedIn }) }
  )
);

export const mockLogin = (userType: 'pet_owner' | 'non_pet_owner'): User => mockUser;
