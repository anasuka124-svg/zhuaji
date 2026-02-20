'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { PET_CATEGORIES, PetCategory } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  ChevronLeft, 
  Heart, 
  MessageCircle, 
  Search, 
  Plus,
  Send,
  Loader2
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface Post {
  id: string;
  title: string;
  content: string;
  category: PetCategory;
  tags: string[];
  images: string[];
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  likes: number;
  comments: number;
  isLiked: boolean;
  status: string;
  createdAt: string;
}

interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  createdAt: string;
}

export function CommunityPage() {
  const { isLoggedIn, user } = useStore();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<PetCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'cat' as PetCategory });
  const [submitting, setSubmitting] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [commentText, setCommentText] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  // 加载帖子列表
  const loadPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      
      const response = await fetch(`/api/posts?${params.toString()}`);
      const data = await response.json();
      if (response.ok) {
        setPosts(data.posts);
        
        // 如果URL中有post参数，自动打开该帖子
        const postId = searchParams.get('post');
        if (postId) {
          const post = data.posts.find((p: Post) => p.id === postId);
          if (post) {
            setSelectedPost(post);
          }
        }
      }
    } catch (error) {
      console.error('Load posts error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [selectedCategory, searchQuery]);

  const categories: { key: PetCategory | 'all'; label: string; icon: string }[] = [
    { key: 'all', label: '全部', icon: '🌟' },
    ...Object.entries(PET_CATEGORIES).map(([key, value]) => ({
      key: key as PetCategory,
      label: value.label,
      icon: value.icon,
    })),
  ];

  const handleSubmitPost = async () => {
    if (!isLoggedIn) {
      toast({ title: '请先登录', variant: 'destructive' });
      return;
    }

    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast({ title: '请填写完整信息', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newPost.title.trim(),
          content: newPost.content.trim(),
          category: newPost.category,
          tags: []
        })
      });

      const data = await response.json();
      if (response.ok) {
        setPosts([data.post, ...posts]);
        setNewPost({ title: '', content: '', category: 'cat' });
        setDialogOpen(false);
        toast({ title: '发布成功！' });
      } else {
        toast({ title: data.error || '发布失败', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: '发布失败', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!isLoggedIn) {
      toast({ title: '请先登录', variant: 'destructive' });
      return;
    }

    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST'
      });

      const data = await response.json();
      if (response.ok) {
        setPosts(posts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              isLiked: data.liked,
              likes: data.likes
            };
          }
          return post;
        }));
        
        if (selectedPost?.id === postId) {
          setSelectedPost({
            ...selectedPost,
            isLiked: data.liked,
            likes: data.likes
          });
        }
      }
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  // 加载评论
  const loadComments = async (postId: string) => {
    setLoadingComments(true);
    try {
      const response = await fetch(`/api/posts/${postId}/comments`);
      const data = await response.json();
      if (response.ok) {
        setComments(data.comments);
      }
    } catch (error) {
      console.error('Load comments error:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  // 发表评论
  const handleCommentSubmit = async () => {
    if (!isLoggedIn) {
      toast({ title: '请先登录', variant: 'destructive' });
      return;
    }

    if (!commentText.trim()) {
      return;
    }

    setSubmittingComment(true);
    try {
      const response = await fetch(`/api/posts/${selectedPost?.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: commentText.trim() })
      });

      const data = await response.json();
      if (response.ok) {
        setComments([...comments, data.comment]);
        setCommentText('');
        setSelectedPost({
          ...selectedPost!,
          comments: selectedPost!.comments + 1
        });
        toast({ title: '评论成功！' });
      } else {
        toast({ title: data.error || '评论失败', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: '评论失败', variant: 'destructive' });
    } finally {
      setSubmittingComment(false);
    }
  };

  // 进入帖子详情时加载评论
  useEffect(() => {
    if (selectedPost) {
      loadComments(selectedPost.id);
      setComments([]);
    }
  }, [selectedPost?.id]);

  // 帖子详情
  if (selectedPost) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-6 max-w-3xl"
      >
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => {
            setSelectedPost(null);
            router.push('/community');
          }}
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          返回列表
        </Button>

        <Card>
          <CardHeader className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Avatar>
                <AvatarImage src={selectedPost.author.avatar} />
                <AvatarFallback>{selectedPost.author.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  {selectedPost.author.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedPost.createdAt}
                </p>
              </div>
              <Badge variant="secondary" className="ml-auto">
                {PET_CATEGORIES[selectedPost.category].icon} {PET_CATEGORIES[selectedPost.category].label}
              </Badge>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {selectedPost.title}
            </h1>
          </CardHeader>

          <CardContent className="p-6 pt-0">
            <div className="prose dark:prose-invert max-w-none mb-6">
              <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                {selectedPost.content}
              </p>
            </div>

            {/* 标签和互动 */}
            <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4">
              <div className="flex flex-wrap gap-1">
                {selectedPost.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
              <Button
                variant="ghost"
                className={selectedPost.isLiked ? 'text-red-500' : ''}
                onClick={() => handleLike(selectedPost.id)}
              >
                <Heart className={`h-5 w-5 mr-1 ${selectedPost.isLiked ? 'fill-current' : ''}`} />
                {selectedPost.likes}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 评论区域 */}
        <Card className="mt-4">
          <CardHeader className="p-4">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              评论 ({selectedPost.comments})
            </h3>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {loadingComments ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                暂无评论，快来发表第一条评论吧~
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.author.avatar} />
                      <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-gray-800 dark:text-gray-200">
                          {comment.author.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString('zh-CN')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 发表评论 */}
            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <Input
                placeholder="写下你的评论..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && commentText.trim() && !submittingComment) {
                    handleCommentSubmit();
                  }
                }}
              />
              <Button 
                size="icon"
                className="bg-orange-500 hover:bg-orange-600"
                disabled={!commentText.trim() || !isLoggedIn || submittingComment}
                onClick={handleCommentSubmit}
              >
                {submittingComment ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-6"
    >
      {/* 页面标题 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            社区
          </h1>
        </div>

        {/* 发帖按钮 */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              发帖
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>发布新帖子</DialogTitle>
              <DialogDescription>
                分享你的养宠经验或提问，帮助更多宠物爱好者！
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                  标题
                </label>
                <Input
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  placeholder="帖子标题..."
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                  分类
                </label>
                <Select 
                  value={newPost.category} 
                  onValueChange={(v) => setNewPost({ ...newPost, category: v as PetCategory })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PET_CATEGORIES).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value.icon} {value.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                  内容
                </label>
                <Textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  placeholder="分享你的故事、经验或问题..."
                  className="min-h-32"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleSubmitPost}
                disabled={!newPost.title.trim() || !newPost.content.trim() || submitting}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    发布中...
                  </>
                ) : '发布'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="搜索帖子..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* 分类标签 */}
      <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <Button
            key={cat.key}
            variant={selectedCategory === cat.key ? 'default' : 'outline'}
            className={`rounded-full ${
              selectedCategory === cat.key 
                ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                : ''
            }`}
            onClick={() => setSelectedCategory(cat.key)}
          >
            {cat.icon} {cat.label}
          </Button>
        ))}
      </div>

      {/* 帖子列表 */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card 
                className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedPost(post)}
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={post.author.avatar} />
                      <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">
                        {post.author.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {post.createdAt}
                      </p>
                    </div>
                    <Badge variant="secondary" className="ml-auto">
                      {PET_CATEGORIES[post.category].icon} {PET_CATEGORIES[post.category].label}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mt-2 hover:text-orange-500">
                    {post.title}
                  </h3>
                </CardHeader>
                
                <CardContent className="p-4 pt-0">
                  <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-3">
                    {post.content}
                  </p>

                  {/* 标签和互动 */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <button 
                        className={`flex items-center gap-1 ${post.isLiked ? 'text-red-500' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(post.id);
                        }}
                      >
                        <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                        {post.likes}
                      </button>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {post.comments}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {posts.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            没有找到相关的帖子
          </p>
        </div>
      )}
    </motion.div>
  );
}
