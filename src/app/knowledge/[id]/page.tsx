'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, Eye, Heart, Clock, Share2, Flag, Edit3, 
  MessageSquare, ExternalLink, User, Menu, Sun, Moon, ChevronRight,
  Cat, Dog, Bird, Bug, Fish, Rabbit, PawPrint, AlertCircle, Loader2
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { useMounted } from '@/hooks/use-mounted';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PetCategoryLabels, PetCategory, Knowledge } from '@/types';
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const categoryIcons: Record<PetCategory, React.ReactNode> = {
  cat: <Cat className="w-4 h-4" />,
  dog: <Dog className="w-4 h-4" />,
  bird: <Bird className="w-4 h-4" />,
  reptile: <Bug className="w-4 h-4" />,
  small_mammal: <Rabbit className="w-4 h-4" />,
  aquatic: <Fish className="w-4 h-4" />,
  other: <PawPrint className="w-4 h-4" />
};

const sourceTypeLabels = {
  official: { label: '官方认证', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  research: { label: '学术研究', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  expert: { label: '专家撰写', color: 'bg-green-100 text-green-700 border-green-200' },
  community: { label: '社区贡献', color: 'bg-orange-100 text-orange-700 border-orange-200' }
};

export default function KnowledgeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { theme, setTheme, user, isLoggedIn, login, toggleFavorite } = useStore();
  
  const mounted = useMounted();
  const [menuOpen, setMenuOpen] = useState(false);
  const [supplementDialogOpen, setSupplementDialogOpen] = useState(false);
  const [correctionDialogOpen, setCorrectionDialogOpen] = useState(false);
  const [supplementContent, setSupplementContent] = useState('');
  const [correctionData, setCorrectionData] = useState({ original: '', corrected: '', reason: '' });
  const [currentKnowledge, setCurrentKnowledge] = useState<Knowledge | null>(null);
  const [relatedKnowledge, setRelatedKnowledge] = useState<Knowledge[]>([]);
  const [loading, setLoading] = useState(true);

  const knowledgeId = params.id as string;

  // 获取知识详情
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 获取用户信息
        const userResponse = await fetch('/api/auth/me');
        const userData = await userResponse.json();
        if (userData.user) {
          login(userData.user);
        }

        // 获取知识详情
        const detailResponse = await fetch(`/api/knowledge/${knowledgeId}`);
        if (detailResponse.ok) {
          const detailData = await detailResponse.json();
          setCurrentKnowledge(detailData.knowledge);

          // 获取相关知识
          const listResponse = await fetch('/api/knowledge?category=' + detailData.knowledge.category);
          const listData = await listResponse.json();
          if (listData.knowledge) {
            setRelatedKnowledge(
              listData.knowledge
                .filter((k: Knowledge) => k.id !== knowledgeId)
                .slice(0, 3)
            );
          }
        }
      } catch (error) {
        console.error('Failed to fetch knowledge:', error);
      } finally {
        setLoading(false);
      }
    };

    if (mounted) {
      fetchData();
    }
  }, [mounted, knowledgeId, login]);

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

  const isFavorited = user?.favorites?.includes(knowledgeId);

  const handleFavorite = () => {
    if (!isLoggedIn) {
      toast({
        title: '请先登录',
        description: '登录后才能收藏知识',
        variant: 'destructive'
      });
      return;
    }
    toggleFavorite(knowledgeId);
    toast({
      title: isFavorited ? '已取消收藏' : '收藏成功',
      description: isFavorited ? '该知识已从收藏中移除' : '该知识已添加到收藏'
    });
  };

  const handleSupplement = () => {
    if (!isLoggedIn) {
      toast({ title: '请先登录', variant: 'destructive' });
      return;
    }
    if (!supplementContent.trim()) {
      toast({ title: '请输入补充内容', variant: 'destructive' });
      return;
    }
    // TODO: 调用补充API
    setSupplementContent('');
    setSupplementDialogOpen(false);
    toast({ title: '提交成功', description: '您的补充已提交，等待审核' });
  };

  const handleCorrection = () => {
    if (!isLoggedIn) {
      toast({ title: '请先登录', variant: 'destructive' });
      return;
    }
    if (!correctionData.original || !correctionData.corrected || !correctionData.reason) {
      toast({ title: '请填写完整信息', variant: 'destructive' });
      return;
    }
    // TODO: 调用纠错API
    setCorrectionData({ original: '', corrected: '', reason: '' });
    setCorrectionDialogOpen(false);
    toast({ title: '提交成功', description: '您的纠错已提交，等待审核' });
  };

  // Markdown 简单渲染
  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('## ')) {
        return <h2 key={i} className="text-xl font-bold mt-6 mb-3">{line.slice(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={i} className="text-lg font-semibold mt-4 mb-2">{line.slice(4)}</h3>;
      }
      if (line.startsWith('- ')) {
        return <li key={i} className={`ml-4 ${currentTheme.cardText}`}>{line.slice(2)}</li>;
      }
      if (line.match(/^\d+\. /)) {
        return <li key={i} className={`ml-4 list-decimal ${currentTheme.cardText}`}>{line.replace(/^\d+\. /, '')}</li>;
      }
      if (line.trim() === '') {
        return <div key={i} className="h-2" />;
      }
      return <p key={i} className={`mb-2 ${currentTheme.cardText}`}>{line}</p>;
    });
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <div className={`min-h-screen ${currentTheme.background} ${currentTheme.text} transition-colors duration-300`}>
        <header className={`sticky top-0 z-50 ${currentTheme.background} border-b ${currentTheme.border} px-4 py-3`}>
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <Link href="/knowledge" className={`p-2 rounded-xl ${currentTheme.card} hover:shadow-md transition-all`}>
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex-1">
              <p className={`text-sm ${currentTheme.cardText}`}>知识库</p>
            </div>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </main>
      </div>
    );
  }

  if (!currentKnowledge) {
    return (
      <div className={`min-h-screen ${currentTheme.background} ${currentTheme.text} flex items-center justify-center`}>
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg mb-2">知识不存在</p>
          <Link href="/knowledge">
            <Button className="mt-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl">
              返回知识库
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${currentTheme.background} ${currentTheme.text} transition-colors duration-300`}>
      {/* 顶部导航 */}
      <header className={`sticky top-0 z-50 ${currentTheme.background} border-b ${currentTheme.border} px-4 py-3`}>
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/knowledge" className={`p-2 rounded-xl ${currentTheme.card} hover:shadow-md transition-all`}>
            <ArrowLeft className="w-5 h-5" />
          </Link>
          
          <div className="flex-1 min-w-0">
            <p className={`text-sm ${currentTheme.cardText}`}>知识库</p>
            <h1 className="font-bold truncate">{currentKnowledge.title}</h1>
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
                  <PawPrint className={`w-5 h-5 ${currentTheme.accent}`} /><span>知识库</span></Link>
                <Link href="/questions" onClick={() => setMenuOpen(false)} className={`flex items-center gap-3 p-3 rounded-xl ${currentTheme.card}`}>
                  <MessageSquare className={`w-5 h-5 ${currentTheme.accent}`} /><span>非常见问题</span></Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* 文章主体 */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* 标题区 */}
        <div className={`p-6 rounded-2xl ${currentTheme.card} shadow-sm ${currentTheme.shadow} mb-6`}>
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="rounded-lg">
              {categoryIcons[currentKnowledge.category]}
              <span className="ml-1">{PetCategoryLabels[currentKnowledge.category]}</span>
            </Badge>
            <Badge className={`rounded-lg ${sourceTypeLabels[currentKnowledge.source.type].color}`}>
              {sourceTypeLabels[currentKnowledge.source.type].label}
            </Badge>
          </div>

          <h1 className="text-2xl font-bold mb-4">{currentKnowledge.title}</h1>

          <div className={`flex flex-wrap items-center gap-4 text-sm ${currentTheme.cardText}`}>
            <span>作者：{currentKnowledge.author}</span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />{currentKnowledge.views}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />{currentKnowledge.likes}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />{currentKnowledge.createdAt}
            </span>
          </div>

          {/* 标签 */}
          <div className="flex flex-wrap gap-2 mt-4">
            {currentKnowledge.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="rounded-lg">{tag}</Badge>
            ))}
          </div>
        </div>

        {/* 来源信息 */}
        <div className={`p-4 rounded-xl border ${currentTheme.border} mb-6 flex items-center justify-between`}>
          <div>
            <p className={`text-sm ${currentTheme.cardText}`}>信息来源</p>
            <p className="font-medium">{currentKnowledge.source.name}</p>
          </div>
          {currentKnowledge.source.url && (
            <a 
              href={currentKnowledge.source.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-orange-500 hover:text-orange-600"
            >
              查看原文 <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* 文章内容 */}
        <article className={`prose max-w-none p-6 rounded-2xl ${currentTheme.card} shadow-sm ${currentTheme.shadow} mb-6`}>
          {renderContent(currentKnowledge.content)}
        </article>

        {/* 操作按钮 */}
        <div className={`p-4 rounded-xl ${currentTheme.card} shadow-sm ${currentTheme.shadow} mb-6`}>
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={handleFavorite}
              variant={isFavorited ? 'default' : 'outline'}
              className={`rounded-xl ${isFavorited ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
            >
              <Heart className={`w-4 h-4 mr-2 ${isFavorited ? 'fill-current' : ''}`} />
              {isFavorited ? '已收藏' : '收藏'}
            </Button>

            <Dialog open={supplementDialogOpen} onOpenChange={setSupplementDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="rounded-xl">
                  <Edit3 className="w-4 h-4 mr-2" />补充内容
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>补充知识内容</DialogTitle>
                  <DialogDescription>
                    您可以补充这篇文章的内容，提交后将由管理员审核。
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Textarea
                    placeholder="请输入您想补充的内容..."
                    value={supplementContent}
                    onChange={(e) => setSupplementContent(e.target.value)}
                    rows={5}
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setSupplementDialogOpen(false)}>取消</Button>
                    <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleSupplement}>提交</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={correctionDialogOpen} onOpenChange={setCorrectionDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="rounded-xl">
                  <Flag className="w-4 h-4 mr-2" />内容纠错
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>内容纠错</DialogTitle>
                  <DialogDescription>
                    发现内容有误？请告诉我们，提交后将由管理员审核。
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>原文内容</Label>
                    <Textarea
                      placeholder="请引用原文中有误的内容..."
                      value={correctionData.original}
                      onChange={(e) => setCorrectionData({...correctionData, original: e.target.value})}
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label>正确内容</Label>
                    <Textarea
                      placeholder="请填写正确的内容..."
                      value={correctionData.corrected}
                      onChange={(e) => setCorrectionData({...correctionData, corrected: e.target.value})}
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label>纠错理由</Label>
                    <Input
                      placeholder="请说明纠错理由或提供参考来源..."
                      value={correctionData.reason}
                      onChange={(e) => setCorrectionData({...correctionData, reason: e.target.value})}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setCorrectionDialogOpen(false)}>取消</Button>
                    <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleCorrection}>提交</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" className="rounded-xl">
              <Share2 className="w-4 h-4 mr-2" />分享
            </Button>
          </div>
        </div>

        {/* 用户补充和纠错 */}
        {(currentKnowledge.supplements.length > 0 || currentKnowledge.corrections.length > 0) && (
          <div className={`p-4 rounded-xl ${currentTheme.card} shadow-sm ${currentTheme.shadow} mb-6`}>
            <h3 className="font-bold mb-4">用户贡献</h3>
            
            {currentKnowledge.supplements.filter(s => s.status === 'approved').map(s => (
              <div key={s.id} className={`p-3 rounded-lg border ${currentTheme.border} mb-3`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{s.userName}</span>
                  <span className={`text-xs ${currentTheme.cardText}`}>{s.createdAt}</span>
                </div>
                <p className={`text-sm ${currentTheme.cardText}`}>{s.content}</p>
              </div>
            ))}
          </div>
        )}

        {/* 相关推荐 */}
        {relatedKnowledge.length > 0 && (
          <div className="mt-8">
            <h3 className="font-bold mb-4">相关知识</h3>
            <div className="grid gap-3">
              {relatedKnowledge.map(k => (
                <Link
                  key={k.id}
                  href={`/knowledge/${k.id}`}
                  className={`flex items-center justify-between p-4 rounded-xl ${currentTheme.card} shadow-sm hover:shadow-md transition-all`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{k.title}</p>
                    <p className={`text-sm ${currentTheme.cardText}`}>{PetCategoryLabels[k.category]}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 opacity-50" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* 底部间距 */}
      <div className="h-20" />
    </div>
  );
}
