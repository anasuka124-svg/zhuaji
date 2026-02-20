'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Eye, Heart, MessageCircle, Clock, Plus, 
  User, Menu, Sun, Moon, Users, Send, Check, Loader2,
  Cat, Dog, Bird, Bug, Fish, Rabbit, PawPrint, Camera, X
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { useMounted } from '@/hooks/use-mounted';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PetCategory, PetCategoryLabels } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
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

const categoryIcons: Record<PetCategory, React.ReactNode> = {
  cat: <Cat className="w-4 h-4" />,
  dog: <Dog className="w-4 h-4" />,
  bird: <Bird className="w-4 h-4" />,
  reptile: <Bug className="w-4 h-4" />,
  small_mammal: <Rabbit className="w-4 h-4" />,
  aquatic: <Fish className="w-4 h-4" />,
  other: <PawPrint className="w-4 h-4" />
};

export default function CommunityPage() {
  const { theme, setTheme, user, isLoggedIn, login } = useStore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const mounted = useMounted();
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: '',
    tags: '',
    images: [] as string[]
  });

  // 页面加载时获取用户信息和帖子
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 获取用户信息
        const userResponse = await fetch('/api/auth/me');
        const userData = await userResponse.json();
        if (userData.user) {
          login(userData.user);
        }

        // 获取帖子列表
        const postsResponse = await fetch('/api/posts');
        const postsData = await postsResponse.json();
        if (postsData.posts) {
          setPosts(postsData.posts);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (mounted) {
      fetchData();
    }
  }, [mounted, login]);

  const toggleTheme = () => {
    const themes: Array<'light' | 'dark' | 'warm' | 'fresh'> = ['light', 'dark', 'warm', 'fresh'];
    const currentIndex = themes.indexOf(theme);
    setTheme(themes[(currentIndex + 1) % themes.length]);
  };

  const themeStyles = {
    light: { background: 'bg-white', text: 'text-gray-800', accent: 'text-orange-500', shadow: 'shadow-gray-200/50', card: 'bg-gray-50', cardText: 'text-gray-600', border: 'border-gray-200' },
    dark: { background: 'bg-gray-900', text: 'text-gray-100', accent: 'text-orange-400', shadow: 'shadow-gray-800/50', card: 'bg-gray-800', cardText: 'text-gray-300', border: 'border-gray-700' },
    warm: { background: 'bg-orange-50', text: 'text-gray-800', accent: 'text-orange-600', shadow: 'shadow-orange-200/50', card: 'bg-orange-100/50', cardText: 'text-gray-600', border: 'border-orange-200' },
    fresh: { background: 'bg-emerald-50', text: 'text-gray-800', accent: 'text-emerald-600', shadow: 'shadow-emerald-200/50', card: 'bg-emerald-100/50', cardText: 'text-gray-600', border: 'border-emerald-200' }
  };

  const currentTheme = themeStyles[theme];

  // 按分类过滤帖子
  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(p => p.category === selectedCategory);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    if (!file.type.startsWith('image/')) {
      toast({ title: '请选择图片文件', variant: 'destructive' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: '图片大小不能超过5MB', variant: 'destructive' });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (response.ok) {
        setNewPost({ ...newPost, images: [...newPost.images, data.url] });
        toast({ title: '图片上传成功' });
      } else {
        toast({ title: data.error || '上传失败', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: '上传失败', variant: 'destructive' });
    } finally {
      setUploading(false);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setNewPost({ ...newPost, images: newPost.images.filter((_, i) => i !== index) });
  };

  const handleSubmit = async () => {
    if (!isLoggedIn) {
      toast({ title: '请先登录', description: '登录后才能发帖', variant: 'destructive' });
      return;
    }

    if (!newPost.title || !newPost.content) {
      toast({ title: '请填写标题和内容', variant: 'destructive' });
      return;
    }

    if (!newPost.category) {
      toast({ title: '请选择宠物分类', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newPost.title,
          content: newPost.content,
          category: newPost.category,
          tags: newPost.tags.split(',').map(t => t.trim()).filter(Boolean),
          images: newPost.images
        })
      });

      const data = await response.json();
      if (response.ok) {
        // 将新帖子添加到列表顶部
        setPosts([data.post, ...posts]);
        setNewPost({ title: '', content: '', category: '', tags: '', images: [] });
        setSubmitDialogOpen(false);
        toast({ title: '发布成功', description: '您的帖子已发布' });
      } else {
        toast({ title: data.error || '发布失败', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: '发布失败，请稍后重试', variant: 'destructive' });
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
        // 更新帖子列表
        setPosts(posts.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              likes: data.likes,
              isLiked: data.liked
            };
          }
          return p;
        }));
      }
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <div className={`min-h-screen ${currentTheme.background} ${currentTheme.text} transition-colors duration-300`}>
        <header className={`sticky top-0 z-50 ${currentTheme.background} border-b ${currentTheme.border} px-4 py-3`}>
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <Link href="/" className={`p-2 rounded-xl ${currentTheme.card} hover:shadow-md transition-all`}>
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex-1">
              <h1 className="font-bold text-lg">社区交流</h1>
              <p className={`text-xs ${currentTheme.cardText}`}>与养宠人分享交流</p>
            </div>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </main>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${currentTheme.background} ${currentTheme.text} transition-colors duration-300`}>
      {/* 顶部导航 */}
      <header className={`sticky top-0 z-50 ${currentTheme.background} border-b ${currentTheme.border} px-4 py-3`}>
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/" className={`p-2 rounded-xl ${currentTheme.card} hover:shadow-md transition-all`}>
            <ArrowLeft className="w-5 h-5" />
          </Link>
          
          <div className="flex-1">
            <h1 className="font-bold text-lg">社区交流</h1>
            <p className={`text-xs ${currentTheme.cardText}`}>与养宠人分享交流</p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className={`rounded-xl ${currentTheme.card} shadow-sm`}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          <Link href="/user">
            <Button variant="ghost" size="icon" className={`rounded-xl ${currentTheme.card} shadow-sm`}>
              <User className="w-5 h-5" />
            </Button>
          </Link>

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className={`rounded-xl ${currentTheme.card} shadow-sm`}>
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className={`${currentTheme.background} ${currentTheme.text}`}>
              <SheetHeader><SheetTitle className={currentTheme.text}>导航</SheetTitle></SheetHeader>
              <div className="flex flex-col gap-2 mt-6">
                <Link href="/knowledge" onClick={() => setMenuOpen(false)} className={`flex items-center gap-3 p-3 rounded-xl ${currentTheme.card}`}>
                  <Users className={`w-5 h-5 ${currentTheme.accent}`} /><span>知识库</span></Link>
                <Link href="/questions" onClick={() => setMenuOpen(false)} className={`flex items-center gap-3 p-3 rounded-xl ${currentTheme.card}`}>
                  <MessageCircle className={`w-5 h-5 ${currentTheme.accent}`} /><span>非常见问题</span></Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* 主内容 */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* 发帖按钮 */}
        <Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-white mb-6 py-6">
              <Plus className="w-5 h-5 mr-2" />
              发布新帖
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>发布新帖</DialogTitle>
              <DialogDescription>
                分享你的养宠经验、提问或交流
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label>标题 *</Label>
                <Input
                  placeholder="请输入帖子标题..."
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                />
              </div>
              
              <div>
                <Label>宠物分类 *</Label>
                <Select value={newPost.category} onValueChange={(value) => setNewPost({...newPost, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择宠物分类" />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(PetCategoryLabels) as PetCategory[]).map(cat => (
                      <SelectItem key={cat} value={cat}>
                        <div className="flex items-center gap-2">
                          {categoryIcons[cat]}
                          {PetCategoryLabels[cat]}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>内容 *</Label>
                <Textarea
                  placeholder="分享你的想法..."
                  rows={6}
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                />
              </div>

              <div>
                <Label>标签（用逗号分隔）</Label>
                <Input
                  placeholder="如：猫咪, 日常, 新手"
                  value={newPost.tags}
                  onChange={(e) => setNewPost({...newPost, tags: e.target.value})}
                />
              </div>

              <div>
                <Label>图片（最多3张）</Label>
                <div className="flex gap-2 flex-wrap mt-2">
                  {newPost.images.map((img, idx) => (
                    <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden">
                      <img src={img} alt={`图片${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {newPost.images.length < 3 && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className={`w-20 h-20 rounded-lg border-2 border-dashed ${currentTheme.border} flex flex-col items-center justify-center hover:border-orange-500 transition-colors ${uploading ? 'opacity-50' : ''}`}
                    >
                      {uploading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
                      ) : (
                        <Camera className={`w-5 h-5 ${currentTheme.cardText}`} />
                      )}
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setSubmitDialogOpen(false)}>取消</Button>
                <Button 
                  className="bg-orange-500 hover:bg-orange-600" 
                  onClick={handleSubmit}
                  disabled={submitting || !newPost.title || !newPost.content || !newPost.category}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      发布中...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-1" />
                      发布
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 分类筛选 */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
          <Button
            onClick={() => setSelectedCategory('all')}
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            className={`rounded-xl shrink-0 ${selectedCategory === 'all' ? 'bg-orange-500 hover:bg-orange-600 text-white' : ''}`}
          >
            全部 ({posts.length})
          </Button>
          {(Object.keys(PetCategoryLabels) as PetCategory[]).map(cat => {
            const count = posts.filter(p => p.category === cat).length;
            if (count === 0) return null;
            return (
              <Button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                className={`rounded-xl shrink-0 flex items-center gap-1.5 ${selectedCategory === cat ? 'bg-orange-500 hover:bg-orange-600 text-white' : ''}`}
              >
                {categoryIcons[cat]}
                {PetCategoryLabels[cat]} ({count})
              </Button>
            );
          })}
        </div>

        {/* 帖子列表 */}
        <div className="space-y-4">
          {filteredPosts.map(post => (
            <PostCard 
              key={post.id} 
              post={post} 
              theme={currentTheme} 
              onLike={handleLike}
              isLoggedIn={isLoggedIn}
            />
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className={`text-center py-20 ${currentTheme.cardText}`}>
            <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg mb-2">暂无帖子</p>
            <p className="text-sm opacity-60">成为第一个发帖的人吧！</p>
          </div>
        )}
      </main>

      {/* 底部间距 */}
      <div className="h-20" />
    </div>
  );
}

// 帖子卡片组件
function PostCard({ post, theme, onLike, isLoggedIn }: { 
  post: Post; 
  theme: any; 
  onLike: (postId: string) => void;
  isLoggedIn: boolean;
}) {
  const categoryIcon = categoryIcons[post.category as PetCategory] || <PawPrint className="w-4 h-4" />;
  const categoryName = PetCategoryLabels[post.category as PetCategory] || post.category;

  return (
    <div className={`p-5 rounded-2xl ${theme.card} shadow-sm ${theme.shadow} border border-gray-200/30 hover:shadow-md transition-all`}>
      {/* 作者信息 */}
      <div className="flex items-center gap-3 mb-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={post.author.avatar} />
          <AvatarFallback className="bg-orange-100">
            <User className="w-5 h-5 text-orange-500" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-medium">{post.author.name}</p>
          <div className="flex items-center gap-2">
            <Badge className="text-xs bg-green-100 text-green-700 border-green-200">
              <Check className="w-3 h-3 mr-0.5" />
              已认证
            </Badge>
            <span className={`text-xs ${theme.cardText}`}>{post.createdAt}</span>
          </div>
        </div>
        <Badge variant="outline" className="rounded-lg shrink-0">
          {categoryIcon}
          <span className="ml-1">{categoryName}</span>
        </Badge>
      </div>

      {/* 标题和内容 */}
      <h3 className="font-bold text-base mb-2">{post.title}</h3>
      <p className={`text-sm ${theme.cardText} line-clamp-3 whitespace-pre-line`}>{post.content}</p>

      {/* 图片 */}
      {post.images && post.images.length > 0 && (
        <div className={`grid gap-2 mt-3 ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {post.images.slice(0, 4).map((img, idx) => (
            <div key={idx} className="rounded-lg overflow-hidden">
              <img src={img} alt={`图片${idx + 1}`} className="w-full h-32 object-cover" />
            </div>
          ))}
        </div>
      )}

      {/* 标签 */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {post.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="rounded-lg text-xs">#{tag}</Badge>
          ))}
        </div>
      )}

      {/* 底部统计 */}
      <div className={`flex items-center justify-between mt-4 pt-3 border-t ${theme.border}`}>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onLike(post.id)}
            className={`flex items-center gap-1 text-sm transition-colors ${post.isLiked ? 'text-red-500' : `${theme.cardText} hover:text-red-500`}`}
          >
            <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
            {post.likes}
          </button>
          <button className={`flex items-center gap-1 text-sm ${theme.cardText} hover:text-orange-500 transition-colors`}>
            <MessageCircle className="w-4 h-4" />
            {post.comments}
          </button>
        </div>
        <span className={`text-xs ${theme.cardText} opacity-60`}>
          <Eye className="w-3.5 h-3.5 inline mr-1" />
          阅读更多
        </span>
      </div>
    </div>
  );
}
