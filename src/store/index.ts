import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PageType, PetCategory, User, KnowledgeArticle, UncommonQuestion, CommunityPost } from '@/types';
import { mockUsers, mockKnowledgeArticles, mockUncommonQuestions, mockCommunityPosts } from '@/lib/mock-data';

interface AppState {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isLoggedIn: boolean;
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: PetCategory | 'all';
  setSelectedCategory: (category: PetCategory | 'all') => void;
  knowledgeArticles: KnowledgeArticle[];
  selectedKnowledge: KnowledgeArticle | null;
  setSelectedKnowledge: (knowledge: KnowledgeArticle | null) => void;
  questions: UncommonQuestion[];
  setQuestions: (questions: UncommonQuestion[]) => void;
  toggleQuestionLike: (id: string) => void;
  posts: CommunityPost[];
  setPosts: (posts: CommunityPost[]) => void;
  togglePostLike: (id: string) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentPage: 'home',
      setCurrentPage: (page) => set({ currentPage: page }),
      isDarkMode: false,
      toggleDarkMode: () => {
        const newMode = !get().isDarkMode;
        if (newMode) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
        set({ isDarkMode: newMode });
      },
      isLoggedIn: false,
      currentUser: null,
      login: (user) => set({ isLoggedIn: true, currentUser: user }),
      logout: () => set({ isLoggedIn: false, currentUser: null }),
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      selectedCategory: 'all',
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      knowledgeArticles: mockKnowledgeArticles,
      selectedKnowledge: null,
      setSelectedKnowledge: (knowledge) => set({ selectedKnowledge: knowledge }),
      questions: mockUncommonQuestions,
      setQuestions: (questions) => set({ questions }),
      toggleQuestionLike: (id) => {
        const questions = get().questions.map(q => {
          if (q.id === id) return { ...q, isLiked: !q.isLiked, likes: q.isLiked ? q.likes - 1 : q.likes + 1 };
          return q;
        });
        set({ questions });
      },
      posts: mockCommunityPosts,
      setPosts: (posts) => set({ posts }),
      togglePostLike: (id) => {
        const posts = get().posts.map(p => {
          if (p.id === id) return { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 };
          return p;
        });
        set({ posts });
      },
      favorites: [],
      toggleFavorite: (id) => {
        const favorites = get().favorites;
        if (favorites.includes(id)) set({ favorites: favorites.filter(f => f !== id) });
        else set({ favorites: [...favorites, id] });
      },
    }),
    { name: 'pet-knowledge-storage', partialize: (state) => ({ isDarkMode: state.isDarkMode, isLoggedIn: state.isLoggedIn, currentUser: state.currentUser, favorites: state.favorites }) }
  )
);

export const mockLoginUsers = mockUsers;
