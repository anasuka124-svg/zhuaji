export type PetCategory = 
  | 'cat' 
  | 'dog' 
  | 'bird' 
  | 'reptile' 
  | 'small_mammal' 
  | 'aquatic' 
  | 'other';

export const PetCategoryLabels: Record<PetCategory, string> = {
  cat: '猫咪',
  dog: '狗狗',
  bird: '鸟类',
  reptile: '爬宠',
  small_mammal: '小型哺乳',
  aquatic: '水族',
  other: '其他异宠'
};

export type UserType = 'pet_owner' | 'non_pet_owner' | null;

export interface User {
  id: string;
  name: string;
  avatar: string;
  userType: UserType;
  verified: boolean;
  petPhotos?: string[];
  quizPassed?: boolean;
  favorites: string[];
  createdAt: string;
}

export interface Source {
  name: string;
  url?: string;
  type: 'official' | 'research' | 'expert' | 'community';
}

export interface Knowledge {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: PetCategory;
  tags: string[];
  source: Source;
  author: string;
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
  supplements: KnowledgeSupplement[];
  corrections: KnowledgeCorrection[];
}

export interface KnowledgeSupplement {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface KnowledgeCorrection {
  id: string;
  userId: string;
  userName: string;
  originalContent: string;
  correctedContent: string;
  reason: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface UncommonQuestion {
  id: string;
  title: string;
  description: string;
  solution: string;
  petType: string;
  petCategory: PetCategory;
  author: { id: string; name: string; avatar: string; };
  images: string[];
  likes: number;
  views: number;
  tags: string[];
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  author: { id: string; name: string; avatar: string; };
  images: string[];
  likes: number;
  comments: number;
  tags: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}
