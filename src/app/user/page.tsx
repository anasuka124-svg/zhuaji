'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, User, Settings, Heart, BookOpen, MessageSquare, 
  Menu, Sun, Moon, LogOut, Shield, Award, Edit3, Camera, FileText,
  Loader2
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { useMounted } from '@/hooks/use-mounted';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export default function UserPage() {
  const { theme, setTheme, user, isLoggedIn, login, logout } = useStore();
  const { toast } = useToast();
  
  const mounted = useMounted();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  // 页面加载时从API获取用户信息
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        if (data.user) {
          login(data.user);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (mounted) {
      fetchUser();
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

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST'
      });
      
      if (response.ok) {
        logout();
        toast({ title: '已退出登录' });
      } else {
        toast({ title: '退出登录失败', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: '退出登录失败', variant: 'destructive' });
    } finally {
      setLoggingOut(false);
    }
  };

  if (!mounted) return null;

  // 加载中显示骨架屏
  if (loading) {
    return (
      <div className={`min-h-screen ${currentTheme.background} ${currentTheme.text} transition-colors duration-300`}>
        <header className={`sticky top-0 z-50 ${currentTheme.background} border-b ${currentTheme.border} px-4 py-3`}>
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <Link href="/" className={`p-2 rounded-xl ${currentTheme.card} hover:shadow-md transition-all`}>
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-bold text-lg flex-1">个人中心</h1>
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
          
          <h1 className="font-bold text-lg flex-1">个人中心</h1>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className={`rounded-xl ${currentTheme.card} shadow-sm`}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

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
                  <BookOpen className={`w-5 h-5 ${currentTheme.accent}`} /><span>知识库</span></Link>
                <Link href="/questions" onClick={() => setMenuOpen(false)} className={`flex items-center gap-3 p-3 rounded-xl ${currentTheme.card}`}>
                  <MessageSquare className={`w-5 h-5 ${currentTheme.accent}`} /><span>非常见问题</span></Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* 主内容 */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {isLoggedIn && user ? (
          // 已登录状态
          <>
            {/* 用户信息卡片 */}
            <div className={`p-6 rounded-2xl ${currentTheme.card} shadow-sm ${currentTheme.shadow} mb-6`}>
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-orange-100">
                    <User className="w-8 h-8 text-orange-500" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={`rounded-lg ${user.userType === 'pet_owner' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {user.userType === 'pet_owner' ? '养宠人' : '爱宠人士'}
                    </Badge>
                    {user.verified && (
                      <Badge className="rounded-lg bg-orange-100 text-orange-700">
                        <Shield className="w-3 h-3 mr-1" />
                        已认证
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* 认证信息 */}
              <div className={`p-4 rounded-xl border ${currentTheme.border}`}>
                {user.userType === 'pet_owner' ? (
                  <div className="flex items-center gap-3">
                    <Camera className={`w-5 h-5 ${currentTheme.accent}`} />
                    <div>
                      <p className="font-medium">宠物照片认证</p>
                      <p className={`text-sm ${currentTheme.cardText}`}>已提交 {user.petPhotos?.length || 0} 张宠物照片</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <FileText className={`w-5 h-5 ${currentTheme.accent}`} />
                    <div>
                      <p className="font-medium">答题认证</p>
                      <p className={`text-sm ${currentTheme.cardText}`}>已通过宠物安全知识测试</p>
                    </div>
                  </div>
                )}
              </div>

              {/* 统计 */}
              <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                <div className={`p-3 rounded-xl ${currentTheme.background}`}>
                  <p className="text-xl font-bold">{user.favorites?.length || 0}</p>
                  <p className={`text-xs ${currentTheme.cardText}`}>收藏</p>
                </div>
                <div className={`p-3 rounded-xl ${currentTheme.background}`}>
                  <p className="text-xl font-bold">0</p>
                  <p className={`text-xs ${currentTheme.cardText}`}>发帖</p>
                </div>
                <div className={`p-3 rounded-xl ${currentTheme.background}`}>
                  <p className="text-xl font-bold">0</p>
                  <p className={`text-xs ${currentTheme.cardText}`}>获赞</p>
                </div>
              </div>
            </div>

            {/* 功能菜单 */}
            <div className="space-y-3">
              <Link href="/user/favorites" className={`flex items-center justify-between p-4 rounded-xl ${currentTheme.card} shadow-sm hover:shadow-md transition-all`}>
                <div className="flex items-center gap-3">
                  <Heart className={`w-5 h-5 ${currentTheme.accent}`} />
                  <span>我的收藏</span>
                </div>
                <span className={`${currentTheme.cardText}`}>{user.favorites?.length || 0} 条</span>
              </Link>

              <Link href="/user/contributions" className={`flex items-center justify-between p-4 rounded-xl ${currentTheme.card} shadow-sm hover:shadow-md transition-all`}>
                <div className="flex items-center gap-3">
                  <Edit3 className={`w-5 h-5 ${currentTheme.accent}`} />
                  <span>我的贡献</span>
                </div>
                <span className={`${currentTheme.cardText}`}>补充 & 纠错</span>
              </Link>

              <Link href="/user/settings" className={`flex items-center justify-between p-4 rounded-xl ${currentTheme.card} shadow-sm hover:shadow-md transition-all`}>
                <div className="flex items-center gap-3">
                  <Settings className={`w-5 h-5 ${currentTheme.accent}`} />
                  <span>设置</span>
                </div>
              </Link>

              <button 
                onClick={handleLogout}
                disabled={loggingOut}
                className={`w-full flex items-center justify-between p-4 rounded-xl ${currentTheme.card} shadow-sm hover:shadow-md transition-all text-red-500 ${loggingOut ? 'opacity-50' : ''}`}
              >
                <div className="flex items-center gap-3">
                  {loggingOut ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5" />}
                  <span>{loggingOut ? '退出中...' : '退出登录'}</span>
                </div>
              </button>
            </div>
          </>
        ) : (
          // 未登录状态
          <div className="text-center py-16">
            <div className={`w-24 h-24 rounded-full ${currentTheme.card} mx-auto flex items-center justify-center mb-6`}>
              <User className={`w-12 h-12 ${currentTheme.accent}`} />
            </div>
            <h2 className="text-xl font-bold mb-2">欢迎来到爪迹</h2>
            <p className={`${currentTheme.cardText} mb-8`}>登录后可以收藏知识、分享经验</p>
            
            <div className="space-y-3 max-w-xs mx-auto">
              <Link href="/user/login" className="block">
                <Button className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-white py-6">
                  登录账号
                </Button>
              </Link>
              <Link href="/user/register" className="block">
                <Button variant="outline" className="w-full rounded-xl py-6">
                  注册新账号
                </Button>
              </Link>
            </div>

            {/* 认证说明 */}
            <div className={`mt-8 p-4 rounded-xl ${currentTheme.card} text-left max-w-xs mx-auto`}>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Award className={`w-5 h-5 ${currentTheme.accent}`} />
                认证说明
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex gap-2">
                  <Badge className="bg-green-100 text-green-700 shrink-0">养宠人</Badge>
                  <p className={currentTheme.cardText}>上传宠物照片完成认证</p>
                </div>
                <div className="flex gap-2">
                  <Badge className="bg-blue-100 text-blue-700 shrink-0">爱宠人士</Badge>
                  <p className={currentTheme.cardText}>回答宠物安全知识完成认证</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 底部间距 */}
      <div className="h-20" />
    </div>
  );
}
