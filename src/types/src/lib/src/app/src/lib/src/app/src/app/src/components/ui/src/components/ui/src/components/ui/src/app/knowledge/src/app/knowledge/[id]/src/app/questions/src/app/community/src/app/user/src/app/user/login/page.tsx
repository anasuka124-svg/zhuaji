'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Lock, Eye, EyeOff, PawPrint } from 'lucide-react';
import { useStore, mockLogin } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const router = useRouter();
  const { theme, login } = useStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const themeStyles: Record<string, any> = {
    light: { background: 'bg-white', text: 'text-gray-800', card: 'bg-gray-50', cardText: 'text-gray-600', border: 'border-gray-200' },
    dark: { background: 'bg-gray-900', text: 'text-gray-100', card: 'bg-gray-800', cardText: 'text-gray-300', border: 'border-gray-700' },
    warm: { background: 'bg-orange-50', text: 'text-gray-800', card: 'bg-orange-100/50', cardText: 'text-gray-600', border: 'border-orange-200' },
    fresh: { background: 'bg-emerald-50', text: 'text-gray-800', card: 'bg-emerald-100/50', cardText: 'text-gray-600', border: 'border-emerald-200' }
  };
  const currentTheme = themeStyles[theme];

  const handleLogin = (type?: 'pet_owner' | 'non_pet_owner') => {
    const user = mockLogin(type || 'pet_owner');
    login(user);
    alert(`欢迎回来，${user.name}！`);
    router.push('/user');
  };

  return (
    <div className={`min-h-screen ${currentTheme.background} ${currentTheme.text}`}>
      <header className={`sticky top-0 z-50 ${currentTheme.background} border-b ${currentTheme.border} px-4 py-3`}>
        <div className="max-w-md mx-auto flex items-center gap-4">
          <Link href="/user" className={`p-2 rounded-xl ${currentTheme.card}`}><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="font-bold text-lg">登录</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className={`w-20 h-20 rounded-2xl ${currentTheme.card} shadow-lg mx-auto flex items-center justify-center mb-4`}>
            <PawPrint className="w-10 h-10 text-orange-500" />
          </div>
          <h2 className="text-xl font-bold">欢迎回到爪迹</h2>
          <p className={`${currentTheme.cardText} text-sm mt-1`}>登录您的账号</p>
        </div>

        <div className={`p-6 rounded-2xl ${currentTheme.card} shadow-sm space-y-4`}>
          <div>
            <label className="text-sm font-medium">用户名</label>
            <div className="relative mt-1">
              <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${currentTheme.cardText}`} />
              <Input type="text" placeholder="请输入用户名" value={username} onChange={(e) => setUsername(e.target.value)} className="pl-10 rounded-xl" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">密码</label>
            <div className="relative mt-1">
              <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${currentTheme.cardText}`} />
              <Input type={showPassword ? 'text' : 'password'} placeholder="请输入密码" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10 rounded-xl" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute right-3 top-1/2 -translate-y-1/2 ${currentTheme.cardText}`}>
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <Button onClick={() => handleLogin()} className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-white py-6">登录</Button>
        </div>

        <div className="flex items-center gap-4 my-6">
          <div className={`flex-1 h-px ${currentTheme.border}`} />
          <span className={`${currentTheme.cardText} text-sm`}>快速登录（演示）</span>
          <div className={`flex-1 h-px ${currentTheme.border}`} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={() => handleLogin('pet_owner')} className="rounded-xl py-5">养宠人登录</Button>
          <Button variant="outline" onClick={() => handleLogin('non_pet_owner')} className="rounded-xl py-5">爱宠人士登录</Button>
        </div>

        <p className={`text-center mt-6 ${currentTheme.cardText}`}>
          还没有账号？<Link href="/user/register" className="text-orange-500 font-medium ml-1">立即注册</Link>
        </p>
      </main>
    </div>
  );
}
