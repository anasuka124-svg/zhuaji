// 宠物分类
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

// 用户类型
export type UserType = 'pet_owner' | 'non_pet_owner' | null;

// 用户状态
export interface User {
  id: string;
  name: string;
  avatar: string;
  userType: UserType;
  verified: boolean;
  petPhotos?: string[];  // 养宠人认证的宠物照片
  quizPassed?: boolean;  // 非养宠人答题认证
  favorites: string[];   // 收藏的知识ID
  createdAt: string;
}

// 知识文章来源
export interface Source {
  name: string;
  url?: string;
  type: 'official' | 'research' | 'expert' | 'community';
}

// 知识文章
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

// 知识补充
export interface KnowledgeSupplement {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

// 知识纠错
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

// 非常见问题
export interface UncommonQuestion {
  id: string;
  title: string;
  description: string;
  solution: string;
  petType: string;
  petCategory: PetCategory;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  images: string[];
  likes: number;
  views: number;
  tags: string[];
  createdAt: string;
}

// 社区帖子
export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  images: string[];
  likes: number;
  comments: number;
  tags: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

// 评论
export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  likes: number;
  createdAt: string;
}

// 搜索结果
export interface SearchResult {
  type: 'knowledge' | 'question' | 'post';
  id: string;
  title: string;
  summary: string;
  category?: PetCategory;
}
