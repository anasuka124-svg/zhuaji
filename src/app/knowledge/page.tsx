'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, ArrowLeft, Eye, Heart, Clock, 
  BookOpen, Cat, Dog, Bird, Bug, Fish, Rabbit, PawPrint,
  User, Menu, Sun, Moon, Loader2
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { useMounted } from '@/hooks/use-mounted';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PetCategory, PetCategoryLabels, Knowledge } from '@/types';
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
  official: { label: '官方', color: 'bg-blue-100 text-blue-700' },
  research: { label: '研究', color: 'bg-purple-100 text-purple-700' },
  expert: { label: '专家', color: 'bg-green-100 text-green-700' },
  community: { label: '社区', color: 'bg-orange-100 text-orange-700' }
};

export default function KnowledgePage() {
  const { theme, setTheme, selectedCategory, setSelectedCategory, login } = useStore();
  
  const mounted = useMounted();
  const [localSearch, setLocalSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [knowledge, setKnowledge] = useState<Knowledge[]>([]);
  const [loading, setLoading] = useState(true);

  // 页面加载时获取数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 获取用户信息
        const userResponse = await fetch('/api/auth/me');
        const userData = await userResponse.json();
        if (userData.user) {
          login(userData.user);
        }

        // 获取知识库数据
        const knowledgeResponse = await fetch('/api/knowledge');
        const knowledgeData = await knowledgeResponse.json();
        if (knowledgeData.knowledge) {
          setKnowledge(knowledgeData.knowledge);
        } else {
          // 如果数据库为空，尝试初始化
          await fetch('/api/init', { method: 'POST' });
          // 重新获取
          const retryResponse = await fetch('/api/knowledge');
          const retryData = await retryResponse.json();
          if (retryData.knowledge) {
            setKnowledge(retryData.knowledge);
          }
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

  // 过滤知识
  const filteredKnowledge = knowledge.filter(k => {
    const matchCategory = selectedCategory === 'all' || k.category === selectedCategory;
    const matchSearch = !localSearch.trim() || 
      k.title.toLowerCase().includes(localSearch.toLowerCase()) ||
      k.summary.toLowerCase().includes(localSearch.toLowerCase()) ||
      k.tags.some(t => t.toLowerCase().includes(localSearch.toLowerCase()));
    return matchCategory && matchSearch;
  });

  // 按分类统计
  const categoryCount = (cat: PetCategory) => 
    knowledge.filter(k => k.category === cat).length;

  const handleSearch = () => {
    // 搜索已在本地过滤中实现
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <div className={`min-h-screen ${currentTheme.background} ${currentTheme.text} transition-colors duration-300`}>
        <header className={`sticky top-0 z-50 ${currentTheme.background} border-b ${currentTheme.border} px-4 py-3`}>
          <div className="max-w-6xl mx-auto flex items-center gap-4">
            <Link href="/" className={`p-2 rounded-xl ${currentTheme.card} hover:shadow-md transition-all`}>
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-bold text-lg flex-1">知识库</h1>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </main>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${currentTheme.background} ${currentTheme.text} transition-colors duration-300`}>
      {/* 顶部导航 */}
      <header className={`sticky top-0 z-50 ${currentTheme.background} border-b ${currentTheme.border} px-4 py-3`}>
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link href="/" className={`p-2 rounded-xl ${currentTheme.card} hover:shadow-md transition-all`}>
            <ArrowLeft className="w-5 h-5" />
          </Link>
          
          <h1 className="font-bold text-lg flex-1">知识库</h1>

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
              <SheetHeader>
                <SheetTitle className={currentTheme.text}>导航菜单</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2 mt-6">
                <Link href="/knowledge" onClick={() => setMenuOpen(false)} 
                  className={`flex items-center gap-3 p-3 rounded-xl ${currentTheme.card}`}>
                  <BookOpen className={`w-5 h-5 ${currentTheme.accent}`} />
                  <span>知识库</span>
                </Link>
                <Link href="/questions" onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-xl ${currentTheme.card}`}>
                  <PawPrint className={`w-5 h-5 ${currentTheme.accent}`} />
                  <span>非常见问题</span>
                </Link>
                <Link href="/community" onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-xl ${currentTheme.card}`}>
                  <User className={`w-5 h-5 ${currentTheme.accent}`} />
                  <span>社区</span>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* 搜索栏 */}
      <div className="px-4 py-4 border-b border-gray-200/50">
        <div className="max-w-6xl mx-auto">
          <div className={`flex items-center gap-2 p-2 rounded-xl ${currentTheme.card} shadow-sm`}>
            <Input
              type="text"
              placeholder="搜索宠物知识..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`flex-1 border-0 bg-transparent focus:ring-0`}
            />
            <Button onClick={handleSearch} className="rounded-lg bg-orange-500 hover:bg-orange-600 text-white px-4">
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 分类筛选 */}
      <div className="px-4 py-3 overflow-x-auto">
        <div className="max-w-6xl mx-auto flex gap-2 min-w-max">
          <Button
            onClick={() => setSelectedCategory('all')}
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            className={`rounded-xl ${selectedCategory === 'all' ? 'bg-orange-500 hover:bg-orange-600 text-white' : ''}`}
          >
            全部 ({knowledge.length})
          </Button>
          {(Object.keys(PetCategoryLabels) as PetCategory[]).map(cat => {
            const count = categoryCount(cat);
            if (count === 0) return null;
            return (
              <Button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                className={`rounded-xl flex items-center gap-1.5 ${selectedCategory === cat ? 'bg-orange-500 hover:bg-orange-600 text-white' : ''}`}
              >
                {categoryIcons[cat]}
                {PetCategoryLabels[cat]} ({count})
              </Button>
            );
          })}
        </div>
      </div>

      {/* 知识列表 */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {filteredKnowledge.length === 0 && knowledge.length === 0 ? (
          <div className={`text-center py-20 ${currentTheme.cardText}`}>
            <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg mb-2">知识库为空</p>
            <p className="text-sm opacity-60 mb-4">点击下方按钮初始化数据</p>
            <Button 
              onClick={async () => {
                const response = await fetch('/api/init', { method: 'POST' });
                const data = await response.json();
                if (data.success) {
                  const retryResponse = await fetch('/api/knowledge');
                  const retryData = await retryResponse.json();
                  if (retryData.knowledge) {
                    setKnowledge(retryData.knowledge);
                  }
                }
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              初始化知识库
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredKnowledge.map((item) => (
              <KnowledgeCard key={item.id} knowledge={item} theme={currentTheme} />
            ))}
          </div>
        )}

        {filteredKnowledge.length === 0 && knowledge.length > 0 && (
          <div className={`text-center py-20 ${currentTheme.cardText}`}>
            <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg mb-2">没有找到相关知识</p>
            <p className="text-sm opacity-60">试试其他关键词或分类</p>
          </div>
        )}
      </main>

      {/* 底部间距 */}
      <div className="h-20" />
    </div>
  );
}

// 知识卡片组件
function KnowledgeCard({ knowledge, theme }: { knowledge: Knowledge; theme: any }) {
  return (
    <Link
      href={`/knowledge/${knowledge.id}`}
      className={`block p-5 rounded-2xl ${theme.card} shadow-sm ${theme.shadow} hover:shadow-lg transition-all hover:-translate-y-0.5 border border-gray-200/30`}
    >
      {/* 分类和来源 */}
      <div className="flex items-center justify-between mb-3">
        <Badge variant="outline" className="rounded-lg">
          {categoryIcons[knowledge.category]}
          <span className="ml-1">{PetCategoryLabels[knowledge.category]}</span>
        </Badge>
        <Badge className={`rounded-lg text-xs ${sourceTypeLabels[knowledge.source.type].color}`}>
          {sourceTypeLabels[knowledge.source.type].label}
        </Badge>
      </div>

      {/* 标题 */}
      <h3 className="font-bold text-base mb-2 line-clamp-2">{knowledge.title}</h3>

      {/* 摘要 */}
      <p className={`text-sm ${theme.cardText} line-clamp-2 mb-3`}>{knowledge.summary}</p>

      {/* 标签 */}
      <div className="flex flex-wrap gap-1 mb-3">
        {knowledge.tags.slice(0, 3).map(tag => (
          <Badge key={tag} variant="secondary" className="rounded-lg text-xs">
            {tag}
          </Badge>
        ))}
      </div>

      {/* 底部信息 */}
      <div className={`flex items-center justify-between text-xs ${theme.cardText} opacity-70`}>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            {knowledge.views}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5" />
            {knowledge.likes}
          </span>
        </div>
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {knowledge.createdAt}
        </span>
      </div>

      {/* 来源 */}
      <div className={`mt-3 pt-3 border-t border-gray-200/30 text-xs ${theme.cardText} opacity-60`}>
        来源：{knowledge.source.name}
      </div>
    </Link>
  );
}
