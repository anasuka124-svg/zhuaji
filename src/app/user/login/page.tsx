'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Lock, Eye, EyeOff, PawPrint, Loader2 } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useMounted } from '@/hooks/use-mounted';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const router = useRouter();
  const { theme, login } = useStore();
  const { toast } = useToast();
  
  const mounted = useMounted();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const themeStyles = {
    light: { background: 'bg-white', text: 'text-gray-800', accent: 'text-orange-500', shadow: 'shadow-gray-200/50', card: 'bg-gray-50', cardText: 'text-gray-600', border: 'border-gray-200' },
    dark: { background: 'bg-gray-900', text: 'text-gray-100', accent: 'text-orange-400', shadow: 'shadow-gray-800/50', card: 'bg-gray-800', cardText: 'text-gray-300', border: 'border-gray-700' },
    warm: { background: 'bg-orange-50', text: 'text-gray-800', accent: 'text-orange-600', shadow: 'shadow-orange-200/50', card: 'bg-orange-100/50', cardText: 'text-gray-600', border: 'border-orange-200' },
    fresh: { background: 'bg-emerald-50', text: 'text-gray-800', accent: 'text-emerald-600', shadow: 'shadow-emerald-200/50', card: 'bg-emerald-100/50', cardText: 'text-gray-600', border: 'border-emerald-200' }
  };

  const currentTheme = themeStyles[theme];

  const handleLogin = async () => {
    if (!username || !password) {
      toast({ title: '请输入用户名和密码', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      if (response.ok) {
        login(data.user);
        toast({ title: '登录成功', description: `欢迎回来，${data.user.name}！` });
        router.push('/user');
      } else {
        toast({ title: data.error || '登录失败', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: '登录失败，请稍后重试', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className={`min-h-screen ${currentTheme.background} ${currentTheme.text} transition-colors duration-300`}>
      {/* 顶部导航 */}
      <header className={`sticky top-0 z-50 ${currentTheme.background} border-b ${currentTheme.border} px-4 py-3`}>
        <div className="max-w-md mx-auto flex items-center gap-4">
          <Link href="/user" className={`p-2 rounded-xl ${currentTheme.card} hover:shadow-md transition-all`}>
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-bold text-lg">登录</h1>
        </div>
      </header>

      {/* 主内容 */}
      <main className="max-w-md mx-auto px-4 py-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className={`w-20 h-20 rounded-2xl ${currentTheme.card} shadow-lg mx-auto flex items-center justify-center mb-4`}>
            <PawPrint className={`w-10 h-10 ${currentTheme.accent}`} />
          </div>
          <h2 className="text-xl font-bold">欢迎回到爪迹</h2>
          <p className={`${currentTheme.cardText} text-sm mt-1`}>登录您的账号</p>
        </div>

        {/* 登录表单 */}
        <div className={`p-6 rounded-2xl ${currentTheme.card} shadow-sm ${currentTheme.shadow}`}>
          <div className="space-y-4">
            <div>
              <Label>用户名</Label>
              <div className="relative">
                <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${currentTheme.cardText}`} />
                <Input
                  type="text"
                  placeholder="请输入用户名"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  className={`pl-10 rounded-xl`}
                />
              </div>
            </div>

            <div>
              <Label>密码</Label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${currentTheme.cardText}`} />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="请输入密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  className={`pl-10 pr-10 rounded-xl`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${currentTheme.cardText}`}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button 
              onClick={handleLogin}
              disabled={loading}
              className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-white py-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  登录中...
                </>
              ) : '登录'}
            </Button>
          </div>
        </div>

        {/* 注册链接 */}
        <p className={`text-center mt-6 ${currentTheme.cardText}`}>
          还没有账号？
          <Link href="/user/register" className={`${currentTheme.accent} font-medium ml-1`}>
            立即注册
          </Link>
        </p>
      </main>
    </div>
  );
}
