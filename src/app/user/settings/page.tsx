'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Camera, Save, Loader2 } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useMounted } from '@/hooks/use-mounted';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function SettingsPage() {
  const router = useRouter();
  const { theme, user, login } = useStore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const mounted = useMounted();
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // 页面加载时从 API 获取用户信息
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        if (data.user) {
          login(data.user);
          setName(data.user.name);
          setAvatar(data.user.avatar || '');
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setPageLoading(false);
      }
    };

    if (mounted) {
      fetchUser();
    }
  }, [mounted, login]);

  // 当 user 状态更新时同步表单
  useEffect(() => {
    if (user) {
      setName(user.name);
      setAvatar(user.avatar || '');
    }
  }, [user]);

  const themeStyles = {
    light: { background: 'bg-white', text: 'text-gray-800', accent: 'text-orange-500', shadow: 'shadow-gray-200/50', card: 'bg-gray-50', cardText: 'text-gray-600', border: 'border-gray-200' },
    dark: { background: 'bg-gray-900', text: 'text-gray-100', accent: 'text-orange-400', shadow: 'shadow-gray-800/50', card: 'bg-gray-800', cardText: 'text-gray-300', border: 'border-gray-700' },
    warm: { background: 'bg-orange-50', text: 'text-gray-800', accent: 'text-orange-600', shadow: 'shadow-orange-200/50', card: 'bg-orange-100/50', cardText: 'text-gray-600', border: 'border-orange-200' },
    fresh: { background: 'bg-emerald-50', text: 'text-gray-800', accent: 'text-emerald-600', shadow: 'shadow-emerald-200/50', card: 'bg-emerald-100/50', cardText: 'text-gray-600', border: 'border-emerald-200' }
  };

  const currentTheme = themeStyles[theme];

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      toast({ title: '请选择图片文件', variant: 'destructive' });
      return;
    }

    // 检查文件大小
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
        setAvatar(data.url);
        toast({ title: '头像上传成功' });
      } else {
        toast({ title: data.error || '上传失败', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: '上传失败', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast({ title: '用户名不能为空', variant: 'destructive' });
      return;
    }

    if (name.length < 2 || name.length > 20) {
      toast({ title: '用户名长度应为2-20个字符', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), avatar })
      });

      const data = await response.json();
      if (response.ok) {
        login(data.user); // 更新本地状态
        toast({ title: '保存成功' });
        router.push('/user');
      } else {
        toast({ title: data.error || '保存失败', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: '保存失败', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  // 加载中显示骨架屏
  if (pageLoading) {
    return (
      <div className={`min-h-screen ${currentTheme.background} ${currentTheme.text} transition-colors duration-300`}>
        <header className={`sticky top-0 z-50 ${currentTheme.background} border-b ${currentTheme.border} px-4 py-3`}>
          <div className="max-w-md mx-auto flex items-center gap-4">
            <Link href="/user" className={`p-2 rounded-xl ${currentTheme.card} hover:shadow-md transition-all`}>
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-bold text-lg">设置</h1>
          </div>
        </header>
        <main className="max-w-md mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`min-h-screen ${currentTheme.background} ${currentTheme.text} transition-colors duration-300`}>
        <header className={`sticky top-0 z-50 ${currentTheme.background} border-b ${currentTheme.border} px-4 py-3`}>
          <div className="max-w-md mx-auto flex items-center gap-4">
            <Link href="/user" className={`p-2 rounded-xl ${currentTheme.card} hover:shadow-md transition-all`}>
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-bold text-lg">设置</h1>
          </div>
        </header>
        <main className="max-w-md mx-auto px-4 py-8 text-center">
          <p className={currentTheme.cardText}>请先登录</p>
          <Link href="/user/login">
            <Button className="mt-4 bg-orange-500 hover:bg-orange-600 text-white">去登录</Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${currentTheme.background} ${currentTheme.text} transition-colors duration-300`}>
      {/* 顶部导航 */}
      <header className={`sticky top-0 z-50 ${currentTheme.background} border-b ${currentTheme.border} px-4 py-3`}>
        <div className="max-w-md mx-auto flex items-center gap-4">
          <Link href="/user" className={`p-2 rounded-xl ${currentTheme.card} hover:shadow-md transition-all`}>
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-bold text-lg">设置</h1>
        </div>
      </header>

      {/* 主内容 */}
      <main className="max-w-md mx-auto px-4 py-8">
        {/* 头像设置 */}
        <div className={`p-6 rounded-2xl ${currentTheme.card} shadow-sm ${currentTheme.shadow} mb-6`}>
          <Label className="mb-3 block">头像</Label>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="w-20 h-20">
                <AvatarImage src={avatar} />
                <AvatarFallback className="bg-orange-100">
                  <User className="w-10 h-10 text-orange-500" />
                </AvatarFallback>
              </Avatar>
              <button
                onClick={handleAvatarClick}
                disabled={uploading}
                className={`absolute bottom-0 right-0 w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-md hover:bg-orange-600 transition-colors ${uploading ? 'opacity-50' : ''}`}
              >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">点击相机图标更换头像</p>
              <p className={`text-xs ${currentTheme.cardText} mt-1`}>支持 JPG、PNG 格式，最大 5MB</p>
            </div>
          </div>
        </div>

        {/* 用户名设置 */}
        <div className={`p-6 rounded-2xl ${currentTheme.card} shadow-sm ${currentTheme.shadow} mb-6`}>
          <Label className="mb-3 block">用户名</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="请输入用户名"
            className="rounded-xl"
            maxLength={20}
          />
          <p className={`text-xs ${currentTheme.cardText} mt-2`}>2-20个字符</p>
        </div>

        {/* 账号信息 */}
        <div className={`p-6 rounded-2xl ${currentTheme.card} shadow-sm ${currentTheme.shadow} mb-6`}>
          <Label className="mb-3 block">账号信息</Label>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className={currentTheme.cardText}>用户类型</span>
              <span>{user.userType === 'pet_owner' ? '养宠人' : '爱宠人士'}</span>
            </div>
            <div className="flex justify-between">
              <span className={currentTheme.cardText}>认证状态</span>
              <span className={user.verified ? 'text-green-500' : 'text-orange-500'}>
                {user.verified ? '已认证' : '未认证'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={currentTheme.cardText}>注册时间</span>
              <span>{user.createdAt?.split('T')[0] || '-'}</span>
            </div>
          </div>
        </div>

        {/* 保存按钮 */}
        <Button
          onClick={handleSave}
          disabled={loading}
          className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-white py-6"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              保存中...
            </>
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              保存修改
            </>
          )}
        </Button>
      </main>
    </div>
  );
}
