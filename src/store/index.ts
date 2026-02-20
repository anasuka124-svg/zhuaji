import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PageType, PetCategory, User, KnowledgeArticle, UncommonQuestion, CommunityPost } from '@/types';
import { mockUsers, mockKnowledgeArticles, mockUncommonQuestions, mockCommunityPosts } from '@/lib/mock-data';

interface AppState {
  // 页面状态
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  
  // 主题
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  
  // 用户状态
  isLoggedIn: boolean;
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;
  
  // 搜索
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // 知识库
  selectedCategory: PetCategory | 'all';
  setSelectedCategory: (category: PetCategory | 'all') => void;
  knowledgeArticles: KnowledgeArticle[];
  selectedKnowledge: KnowledgeArticle | null;
  setSelectedKnowledge: (knowledge: KnowledgeArticle | null) => void;
  
  // 非常见问题
  questions: UncommonQuestion[];
  setQuestions: (questions: UncommonQuestion[]) => void;
  toggleQuestionLike: (id: string) => void;
  toggleQuestionFavorite: (id: string) => void;
  
  // 社区
  posts: CommunityPost[];
  setPosts: (posts: CommunityPost[]) => void;
  togglePostLike: (id: string) => void;
  selectedPost: CommunityPost | null;
  setSelectedPost: (post: CommunityPost | null) => void;
  
  // 收藏
  favorites: string[];
  toggleFavorite: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // 页面状态
      currentPage: 'home',
      setCurrentPage: (page) => set({ currentPage: page }),
      
      // 主题
      isDarkMode: false,
      toggleDarkMode: () => {
        const newMode = !get().isDarkMode;
        if (newMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        set({ isDarkMode: newMode });
      },
      
      // 用户状态
      isLoggedIn: false,
      currentUser: null,
      login: (user) => set({ isLoggedIn: true, currentUser: user }),
      logout: () => set({ isLoggedIn: false, currentUser: null }),
      
      // 搜索
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      // 知识库
      selectedCategory: 'all',
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      knowledgeArticles: mockKnowledgeArticles,
      selectedKnowledge: null,
      setSelectedKnowledge: (knowledge) => set({ selectedKnowledge: knowledge }),
      
      // 非常见问题
      questions: mockUncommonQuestions,
      setQuestions: (questions) => set({ questions }),
      toggleQuestionLike: (id) => {
        const questions = get().questions.map(q => {
          if (q.id === id) {
            return {
              ...q,
              isLiked: !q.isLiked,
              likes: q.isLiked ? q.likes - 1 : q.likes + 1,
            };
          }
          return q;
        });
        set({ questions });
      },
      toggleQuestionFavorite: (id) => {
        const questions = get().questions.map(q => {
          if (q.id === id) {
            return { ...q, isFavorited: !q.isFavorited };
          }
          return q;
        });
        set({ questions });
      },
      
      // 社区
      posts: mockCommunityPosts,
      setPosts: (posts) => set({ posts }),
      togglePostLike: (id) => {
        const posts = get().posts.map(p => {
          if (p.id === id) {
            return {
              ...p,
              isLiked: !p.isLiked,
              likes: p.isLiked ? p.likes - 1 : p.likes + 1,
            };
          }
          return p;
        });
        set({ posts });
      },
      selectedPost: null,
      setSelectedPost: (post) => set({ selectedPost: post }),
      
      // 收藏
      favorites: [],
      toggleFavorite: (id) => {
        const favorites = get().favorites;
        if (favorites.includes(id)) {
          set({ favorites: favorites.filter(f => f !== id) });
        } else {
          set({ favorites: [...favorites, id] });
        }
      },
    }),
    {
      name: 'pet-knowledge-storage',
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        isLoggedIn: state.isLoggedIn,
        currentUser: state.currentUser,
        favorites: state.favorites,
      }),
    }
  )
);

// 模拟登录用户数据
export const mockLoginUsers = mockUsers;
