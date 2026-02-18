'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, Settings, Heart, BookOpen, MessageSquare, Menu, Sun, Moon, LogOut, Shield, Award, Edit3, Camera, FileText } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function UserPage() {
  const { theme, setTheme, user, isLoggedIn, logout } = useStore();

  const themeStyles: Record<string, any> = {
    light: { background: 'bg-white', text: 'text-gray-800', card: 'bg-gray-50', cardText: 'text-gray-600', border: 'border-gray-200' },
    dark: { background: 'bg-gray-900', text: 'text-gray-100', card: 'bg-gray-800', cardText: 'text-gray-300', border: 'border-gray-700' },
    warm: { background: 'bg-orange-50', text: 'text-gray-800', card: 'bg-orange-100/50', cardText: 'text-gray-600', border: 'border-orange-200' },
    fresh: { background: 'bg-emerald-50', text: 'text-gray-800', card: 'bg-emerald-100/50', cardText: 'text-gray-600', border: 'border-emerald-200' }
  };
  const currentTheme = themeStyles[theme];

  const toggleTheme = () => {
    const themes = ['light', 'dark', 'warm', 'fresh'] as const;
    setTheme(themes[(themes.indexOf(theme) + 1) % themes.length]);
  };

  const handleLogout = () => {
    logout();
    alert('已退出登录');
  };

  return (
    <div className={`min-h-screen ${currentTheme.background} ${currentTheme.text}`}>
      <header className={`sticky top-0 z-50 ${currentTheme.background} border-b ${currentTheme.border} px-4 py-3`}>
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/" className={`p-2 rounded-xl ${currentTheme.card}`}><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="font-bold text-lg flex-1">个人中心</h1>
          <Button variant="ghost" size="icon" onClick={toggleTheme} className={`rounded-xl ${currentTheme.card}`}>
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {isLoggedIn && user ? (
          <>
            <div className={`p-6 rounded-2xl ${currentTheme.card} shadow-sm mb-6`}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center"><User className="w-8 h-8 text-orange-500" /></div>
                <div>
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={user.userType === 'pet_owner' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}>
                      {user.userType === 'pet_owner' ? '养宠人' : '爱宠人士'}
                    </Badge>
                    {user.verified && <Badge className="bg-orange-100 text-orange-700"><Shield className="w-3 h-3 mr-1" />已认证</Badge>}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                <div className={`p-3 rounded-xl ${currentTheme.background}`}><p className="text-xl font-bold">{user.favorites?.length || 0}</p><p className={`text-xs ${currentTheme.cardText}`}>收藏</p></div>
                <div className={`p-3 rounded-xl ${currentTheme.background}`}><p className="text-xl font-bold">0</p><p className={`text-xs ${currentTheme.cardText}`}>发帖</p></div>
                <div className={`p-3 rounded-xl ${currentTheme.background}`}><p className="text-xl font-bold">0</p><p className={`text-xs ${currentTheme.cardText}`}>获赞</p></div>
              </div>
            </div>

            <div className="space-y-3">
              <button onClick={handleLogout} className={`w-full flex items-center justify-between p-4 rounded-xl ${currentTheme.card} shadow-sm hover:shadow-md text-red-500`}>
                <div className="flex items-center gap-3"><LogOut className="w-5 h-5" /><span>退出登录</span></div>
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className={`w-24 h-24 rounded-full ${currentTheme.card} mx-auto flex items-center justify-center mb-6`}>
              <User className={`w-12 h-12 text-orange-500`} />
            </div>
            <h2 className="text-xl font-bold mb-2">欢迎来到爪迹</h2>
            <p className={`${currentTheme.cardText} mb-8`}>登录后可以收藏知识、分享经验</p>
            <div className="space-y-3 max-w-xs mx-auto">
              <Link href="/user/login" className="block"><Button className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-white py-6">登录账号</Button></Link>
              <Link href="/user/register" className="block"><Button variant="outline" className="w-full rounded-xl py-6">注册新账号</Button></Link>
            </div>
            <div className={`mt-8 p-4 rounded-xl ${currentTheme.card} text-left max-w-xs mx-auto`}>
              <h3 className="font-semibold mb-3 flex items-center gap-2"><Award className="text-orange-500" />认证说明</h3>
              <div className="space-y-3 text-sm">
                <div className="flex gap-2"><Badge className="bg-green-100 text-green-700 shrink-0">养宠人</Badge><p className={currentTheme.cardText}>上传宠物照片完成认证</p></div>
                <div className="flex gap-2"><Badge className="bg-blue-100 text-blue-700 shrink-0">爱宠人士</Badge><p className={currentTheme.cardText}>回答宠物安全问题认证</p></div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
