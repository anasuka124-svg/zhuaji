'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Menu, X, Sun, Moon, User, BookOpen, HelpCircle, Users } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useMounted } from '@/hooks/use-mounted';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export default function Home() {
  const router = useRouter();
  const { theme, setTheme, setSearchQuery, user, isLoggedIn } = useStore();
  const [localSearch, setLocalSearch] = useState('');
  const mounted = useMounted();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = () => {
    if (localSearch.trim()) {
      setSearchQuery(localSearch);
      router.push('/knowledge');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleTheme = () => {
    const themes: Array<'light' | 'dark' | 'warm' | 'fresh'> = ['light', 'dark', 'warm', 'fresh'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const themeStyles = {
    light: {
      background: 'bg-white',
      text: 'text-gray-800',
      accent: 'text-orange-500',
      shadow: 'shadow-gray-200/50',
      card: 'bg-gray-50',
      cardText: 'text-gray-600'
    },
    dark: {
      background: 'bg-gray-900',
      text: 'text-gray-100',
      accent: 'text-orange-400',
      shadow: 'shadow-gray-800/50',
      card: 'bg-gray-800',
      cardText: 'text-gray-300'
    },
    warm: {
      background: 'bg-orange-50',
      text: 'text-gray-800',
      accent: 'text-orange-600',
      shadow: 'shadow-orange-200/50',
      card: 'bg-orange-100/50',
      cardText: 'text-gray-600'
    },
    fresh: {
      background: 'bg-emerald-50',
      text: 'text-gray-800',
      accent: 'text-emerald-600',
      shadow: 'shadow-emerald-200/50',
      card: 'bg-emerald-100/50',
      cardText: 'text-gray-600'
    }
  };

  const currentTheme = themeStyles[theme];
  const themeNames = {
    light: '简约白',
    dark: '深色模式',
    warm: '暖橙',
    fresh: '清新绿'
  };

  if (!mounted) return null;

  return (
    <div className={`min-h-screen ${currentTheme.background} ${currentTheme.text} transition-colors duration-300`}>
      {/* 顶部导航 */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-xl ${currentTheme.card} shadow-lg flex items-center justify-center`}>
              <span className="text-xl">🐾</span>
            </div>
            <span className={`font-bold text-lg hidden sm:block ${currentTheme.text}`}>爪迹</span>
          </Link>

          {/* 右侧按钮 */}
          <div className="flex items-center gap-2">
            {/* 主题切换 */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className={`rounded-xl ${currentTheme.card} shadow-sm hover:shadow-md transition-all`}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            {/* 用户/登录 */}
            <Link href="/user">
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-xl ${currentTheme.card} shadow-sm hover:shadow-md transition-all`}
              >
                <User className="w-5 h-5" />
              </Button>
            </Link>

            {/* 菜单 */}
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-xl ${currentTheme.card} shadow-sm hover:shadow-md transition-all`}
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className={`${currentTheme.background} ${currentTheme.text} border-gray-200/20`}>
                <SheetHeader>
                  <SheetTitle className={currentTheme.text}>导航菜单</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-2 mt-6">
                  <Link
                    href="/knowledge"
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 p-3 rounded-xl ${currentTheme.card} hover:shadow-md transition-all`}
                  >
                    <BookOpen className={`w-5 h-5 ${currentTheme.accent}`} />
                    <span>知识库</span>
                  </Link>
                  <Link
                    href="/questions"
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 p-3 rounded-xl ${currentTheme.card} hover:shadow-md transition-all`}
                  >
                    <HelpCircle className={`w-5 h-5 ${currentTheme.accent}`} />
                    <span>非常见问题</span>
                  </Link>
                  <Link
                    href="/community"
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 p-3 rounded-xl ${currentTheme.card} hover:shadow-md transition-all`}
                  >
                    <Users className={`w-5 h-5 ${currentTheme.accent}`} />
                    <span>社区</span>
                  </Link>
                </div>

                {/* 用户状态 */}
                <div className={`mt-8 p-4 rounded-xl ${currentTheme.card}`}>
                  {isLoggedIn && user ? (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-200 flex items-center justify-center">
                        <User className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className={`text-sm ${currentTheme.cardText}`}>
                          {user.userType === 'pet_owner' ? '养宠人' : '爱宠人士'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className={`text-sm ${currentTheme.cardText} mb-3`}>登录以获取更多功能</p>
                      <Link href="/user/login" onClick={() => setMenuOpen(false)}>
                        <Button className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-white">
                          登录 / 注册
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* 主内容 */}
      <main className="min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-10">
        {/* 提示文字 */}
        <h1 className={`text-xl sm:text-2xl font-light mb-8 ${currentTheme.cardText}`}>
          今天想查点什么？
        </h1>

        {/* 官方形象图标 */}
        <div className={`relative mb-10 p-6 rounded-3xl ${currentTheme.card} shadow-xl ${currentTheme.shadow} transition-all duration-300 hover:shadow-2xl`}>
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-100/30 to-transparent pointer-events-none" />
          <img
            src="/pet-mascot.png"
            alt="爪迹图标"
            className="w-48 h-48 sm:w-64 sm:h-64 object-contain drop-shadow-lg"
          />
        </div>

        {/* 搜索栏 */}
        <div className="w-full max-w-xl px-4">
          <div className={`relative flex items-center gap-2 p-2 rounded-2xl ${currentTheme.card} shadow-lg ${currentTheme.shadow} transition-all duration-300 hover:shadow-xl focus-within:shadow-xl focus-within:ring-2 focus-within:ring-orange-300/50`}>
            <Input
              type="text"
              placeholder="搜索宠物养护知识..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`flex-1 border-0 bg-transparent ${currentTheme.text} placeholder:text-gray-400 focus:ring-0 focus:outline-none text-base`}
            />
            <Button
              onClick={handleSearch}
              className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 transition-all"
            >
              <Search className="w-5 h-5 mr-1" />
              搜索
            </Button>
          </div>
        </div>

        {/* 快捷入口 */}
        <div className="flex flex-wrap justify-center gap-3 mt-10 px-4">
          <Link
            href="/knowledge"
            className={`flex items-center gap-2 px-5 py-3 rounded-xl ${currentTheme.card} shadow-md ${currentTheme.shadow} hover:shadow-lg transition-all hover:-translate-y-0.5`}
          >
            <BookOpen className={`w-5 h-5 ${currentTheme.accent}`} />
            <span>知识库</span>
          </Link>
          <Link
            href="/questions"
            className={`flex items-center gap-2 px-5 py-3 rounded-xl ${currentTheme.card} shadow-md ${currentTheme.shadow} hover:shadow-lg transition-all hover:-translate-y-0.5`}
          >
            <HelpCircle className={`w-5 h-5 ${currentTheme.accent}`} />
            <span>非常见问题</span>
          </Link>
          <Link
            href="/community"
            className={`flex items-center gap-2 px-5 py-3 rounded-xl ${currentTheme.card} shadow-md ${currentTheme.shadow} hover:shadow-lg transition-all hover:-translate-y-0.5`}
          >
            <Users className={`w-5 h-5 ${currentTheme.accent}`} />
            <span>社区交流</span>
          </Link>
        </div>

        {/* 当前主题提示 */}
        <p className={`mt-10 text-sm ${currentTheme.cardText} opacity-60`}>
          当前主题：{themeNames[theme]}
        </p>
      </main>

      {/* 底部信息 */}
      <footer className={`py-6 text-center ${currentTheme.cardText} text-sm opacity-60`}>
        <p>爪迹 · 记录每一份爱宠之心</p>
      </footer>
    </div>
  );
}
