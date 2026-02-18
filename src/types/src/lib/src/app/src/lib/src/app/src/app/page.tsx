'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Menu, Sun, Moon, User, BookOpen, HelpCircle, Users } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Home() {
  const { theme, setTheme, isLoggedIn, user } = useStore();
  const [localSearch, setLocalSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const themeStyles: Record<string, any> = {
    light: { background: 'bg-white', text: 'text-gray-800', card: 'bg-gray-50', cardText: 'text-gray-600' },
    dark: { background: 'bg-gray-900', text: 'text-gray-100', card: 'bg-gray-800', cardText: 'text-gray-300' },
    warm: { background: 'bg-orange-50', text: 'text-gray-800', card: 'bg-orange-100/50', cardText: 'text-gray-600' },
    fresh: { background: 'bg-emerald-50', text: 'text-gray-800', card: 'bg-emerald-100/50', cardText: 'text-gray-600' }
  };

  const currentTheme = themeStyles[theme];

  const handleSearch = () => {
    if (localSearch.trim()) {
      window.location.href = `/knowledge?q=${encodeURIComponent(localSearch)}`;
    }
  };

  const toggleTheme = () => {
    const themes = ['light', 'dark', 'warm', 'fresh'] as const;
    const idx = themes.indexOf(theme);
    setTheme(themes[(idx + 1) % themes.length]);
  };

  return (
    <div className={`min-h-screen ${currentTheme.background} ${currentTheme.text}`}>
      {/* 顶部导航 */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-xl ${currentTheme.card} shadow-lg flex items-center justify-center`}>
              <span className="text-xl">🐾</span>
            </div>
            <span className={`font-bold text-lg hidden sm:block`}>爪迹</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className={`rounded-xl ${currentTheme.card}`}>
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Link href="/user">
              <Button variant="ghost" size="icon" className={`rounded-xl ${currentTheme.card}`}>
                <User className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 主内容 */}
      <main className="min-h-screen flex flex-col items-center justify-center px-4 pt-20">
        <h1 className={`text-xl sm:text-2xl font-light mb-8 ${currentTheme.cardText}`}>
          今天想查点什么？
        </h1>

        {/* 图标 */}
        <div className={`relative mb-10 p-6 rounded-3xl ${currentTheme.card} shadow-xl transition-all hover:shadow-2xl`}>
          <div className="text-8xl">🐾</div>
        </div>

        {/* 搜索栏 */}
        <div className="w-full max-w-xl px-4">
          <div className={`flex items-center gap-2 p-2 rounded-2xl ${currentTheme.card} shadow-lg`}>
            <Input
              type="text"
              placeholder="搜索宠物养护知识..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 border-0 bg-transparent focus:ring-0"
            />
            <Button onClick={handleSearch} className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white px-6">
              <Search className="w-5 h-5 mr-1" />搜索
            </Button>
          </div>
        </div>

        {/* 快捷入口 */}
        <div className="flex flex-wrap justify-center gap-3 mt-10 px-4">
          <Link href="/knowledge" className={`flex items-center gap-2 px-5 py-3 rounded-xl ${currentTheme.card} shadow-md hover:shadow-lg transition-all`}>
            <BookOpen className="w-5 h-5 text-orange-500" /><span>知识库</span>
          </Link>
          <Link href="/questions" className={`flex items-center gap-2 px-5 py-3 rounded-xl ${currentTheme.card} shadow-md hover:shadow-lg transition-all`}>
            <HelpCircle className="w-5 h-5 text-orange-500" /><span>非常见问题</span>
          </Link>
          <Link href="/community" className={`flex items-center gap-2 px-5 py-3 rounded-xl ${currentTheme.card} shadow-md hover:shadow-lg transition-all`}>
            <Users className="w-5 h-5 text-orange-500" /><span>社区交流</span>
          </Link>
        </div>
      </main>

      <footer className={`py-6 text-center ${currentTheme.cardText} text-sm opacity-60`}>
        <p>爪迹 · 记录每一份爱宠之心</p>
      </footer>
    </div>
  );
}
