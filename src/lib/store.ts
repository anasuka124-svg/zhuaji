import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, PetCategory, Knowledge, UncommonQuestion, CommunityPost } from '@/types';
import { mockKnowledge, mockQuestions, mockPosts, mockUsers } from './mock-data';

// 主题类型
type Theme = 'light' | 'dark' | 'warm' | 'fresh';

// 全局状态接口
interface AppState {
  // 主题
  theme: Theme;
  setTheme: (theme: Theme) => void;

  // 用户状态
  user: User | null;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;

  // 搜索
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // 知识数据
  knowledge: Knowledge[];
  selectedCategory: PetCategory | 'all';
  setSelectedCategory: (category: PetCategory | 'all') => void;
  
  // 非常见问题数据
  questions: UncommonQuestion[];
  
  // 社区帖子数据
  posts: CommunityPost[];

  // 收藏功能
  toggleFavorite: (knowledgeId: string) => void;

  // 补充纠错
  addSupplement: (knowledgeId: string, content: string) => void;
  addCorrection: (knowledgeId: string, original: string, corrected: string, reason: string) => void;

  // 添加非常见问题
  addQuestion: (question: Omit<UncommonQuestion, 'id' | 'likes' | 'views' | 'createdAt'>) => void;

  // 添加社区帖子
  addPost: (post: Omit<CommunityPost, 'id' | 'likes' | 'comments' | 'status' | 'createdAt'>) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // 主题
      theme: 'light',
      setTheme: (theme) => set({ theme }),

      // 用户状态
      user: null,
      isLoggedIn: false,
      login: (user) => set({ user, isLoggedIn: true }),
      logout: () => set({ user: null, isLoggedIn: false }),

      // 搜索
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),

      // 知识数据
      knowledge: mockKnowledge,
      selectedCategory: 'all',
      setSelectedCategory: (category) => set({ selectedCategory: category }),

      // 非常见问题数据
      questions: mockQuestions,

      // 社区帖子数据
      posts: mockPosts,

      // 收藏功能
      toggleFavorite: (knowledgeId) => {
        const { user } = get();
        if (!user) return;

        const favorites = user.favorites || [];
        const newFavorites = favorites.includes(knowledgeId)
          ? favorites.filter(id => id !== knowledgeId)
          : [...favorites, knowledgeId];

        set({
          user: { ...user, favorites: newFavorites }
        });
      },

      // 补充知识
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

      // 纠错知识
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

      // 添加非常见问题
      addQuestion: (question) => {
        const { questions, user } = get();
        if (!user) return;

        const newQuestion: UncommonQuestion = {
          ...question,
          id: `q${Date.now()}`,
          author: {
            id: user.id,
            name: user.name,
            avatar: user.avatar
          },
          likes: 0,
          views: 0,
          createdAt: new Date().toISOString().split('T')[0]
        };

        set({ questions: [newQuestion, ...questions] });
      },

      // 添加社区帖子
      addPost: (post) => {
        const { posts, user } = get();
        if (!user) return;

        const newPost: CommunityPost = {
          ...post,
          id: `p${Date.now()}`,
          author: {
            id: user.id,
            name: user.name,
            avatar: user.avatar
          },
          likes: 0,
          comments: 0,
          status: 'pending',
          createdAt: new Date().toISOString().split('T')[0]
        };

        set({ posts: [newPost, ...posts] });
      }
    }),
    {
      name: 'zhua-ji-storage',
      partialize: (state) => ({
        theme: state.theme,
        user: state.user,
        isLoggedIn: state.isLoggedIn
      })
    }
  )
);

// 模拟登录函数
export const mockLogin = (userType: 'pet_owner' | 'non_pet_owner'): User => {
  const mockUser = mockUsers.find(u => u.userType === userType) || mockUsers[0];
  return mockUser;
};
