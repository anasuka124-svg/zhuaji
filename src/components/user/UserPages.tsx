'use client';

import { motion } from 'framer-motion';
import { useAppStore, mockLoginUsers } from '@/store';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ChevronLeft, 
  User as UserIcon, 
  Settings, 
  Heart, 
  Bookmark,
  Award,
  Camera,
  Edit,
  LogOut,
  CheckCircle,
  FileQuestion
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';
import { mockKnowledgeArticles } from '@/lib/mock-data';

export function UserPage() {
  const { currentUser, isLoggedIn, logout, setCurrentPage, favorites } = useAppStore();

  if (!isLoggedIn || !currentUser) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-12 text-center"
      >
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 mx-auto mb-6 flex items-center justify-center">
            <UserIcon className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            还未登录
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            登录后可以查看个人中心、收藏内容等
          </p>
          <div className="flex gap-3 justify-center">
            <Button 
              className="bg-orange-500 hover:bg-orange-600"
              onClick={() => setCurrentPage('login')}
            >
              登录
            </Button>
            <Button 
              variant="outline"
              onClick={() => setCurrentPage('register')}
            >
              注册
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  // 获取收藏的文章
  const favoriteArticles = mockKnowledgeArticles.filter(a => favorites.includes(a.id));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-6 max-w-4xl"
    >
      {/* 页面标题 */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          个人中心
        </h1>
      </div>

      {/* 用户信息卡片 */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={currentUser.avatar} />
              <AvatarFallback className="text-2xl">{currentUser.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {currentUser.name}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {currentUser.bio || '这个人很懒，还没有填写简介~'}
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                {currentUser.isPetOwner ? (
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    已认证养宠人
                  </Badge>
                ) : (
                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    <Award className="h-3 w-3 mr-1" />
                    已答题认证
                  </Badge>
                )}
                <Badge variant="outline">
                  加入于 {currentUser.joinedAt}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-1" />
                编辑
              </Button>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* 已认证宠物 */}
          {currentUser.isPetOwner && currentUser.verifiedPets && currentUser.verifiedPets.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                已认证宠物 ({currentUser.verifiedPets.length})
              </h3>
              <div className="flex flex-wrap gap-3">
                {currentUser.verifiedPets.map((pet, index) => (
                  <div key={index} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                      {pet.type === 'cat' ? '🐱' : pet.type === 'dog' ? '🐕' : '🐾'}
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {pet.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 标签页 */}
      <Tabs defaultValue="favorites" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="favorites">
            <Heart className="h-4 w-4 mr-2" />
            收藏
          </TabsTrigger>
          <TabsTrigger value="posts">
            <FileQuestion className="h-4 w-4 mr-2" />
            我的提问
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            设置
          </TabsTrigger>
        </TabsList>

        <TabsContent value="favorites" className="mt-4">
          {favoriteArticles.length > 0 ? (
            <div className="space-y-3">
              {favoriteArticles.map((article) => (
                <Card key={article.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <h4 className="font-medium text-gray-800 dark:text-gray-200 hover:text-orange-500">
                    {article.title}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                    {article.summary}
                  </p>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Bookmark className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">还没有收藏任何内容</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="posts" className="mt-4">
          <div className="text-center py-8">
            <FileQuestion className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">暂无提问记录</p>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          <Card>
            <CardHeader className="p-4">
              <h3 className="font-medium text-gray-800 dark:text-gray-100">账号设置</h3>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">昵称</label>
                <Input defaultValue={currentUser.name} />
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">个人简介</label>
                <Input defaultValue={currentUser.bio} placeholder="介绍一下自己吧" />
              </div>
              <Button className="bg-orange-500 hover:bg-orange-600">保存修改</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

export function LoginPage() {
  const { setCurrentPage, login } = useAppStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    // 模拟登录 - 使用预置用户
    const user = mockLoginUsers.find(u => u.name.toLowerCase().includes(username.toLowerCase()));
    if (user && password.length >= 4) {
      login(user);
      setCurrentPage('home');
    } else {
      setError('用户名或密码错误（提示：可使用"小猫"或"爬宠"等名称登录）');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-12"
    >
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <img 
            src="/pet-mascot.png" 
            alt="Pet Knowledge" 
            className="w-16 h-16 rounded-full mx-auto mb-4 shadow-lg"
          />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            欢迎回来
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            登录以获取完整体验
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                  用户名
                </label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="输入用户名"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                  密码
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="输入密码"
                />
              </div>

              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              <Button 
                className="w-full bg-orange-500 hover:bg-orange-600"
                onClick={handleLogin}
              >
                登录
              </Button>

              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                还没有账号？{' '}
                <button 
                  className="text-orange-500 hover:underline"
                  onClick={() => setCurrentPage('register')}
                >
                  立即注册
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 提示信息 */}
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm text-gray-600 dark:text-gray-400">
          <p className="font-medium mb-2">🧪 测试账号提示：</p>
          <ul className="space-y-1">
            <li>• 用户名输入"小猫"，任意密码（4位以上）登录养宠人账号</li>
            <li>• 用户名输入"爬宠"，任意密码（4位以上）登录异宠爱好者账号</li>
            <li>• 用户名输入"新手"，任意密码（4位以上）登录非养宠人账号</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

export function RegisterPage() {
  const { setCurrentPage } = useAppStore();
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    confirmPassword: '',
    isPetOwner: false,
  });
  const [registered, setRegistered] = useState(false);

  const handleRegister = () => {
    if (formData.name.trim() && formData.password.length >= 4 && formData.password === formData.confirmPassword) {
      setRegistered(true);
      setTimeout(() => {
        setCurrentPage('login');
      }, 1500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-12"
    >
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <img 
            src="/pet-mascot.png" 
            alt="Pet Knowledge" 
            className="w-16 h-16 rounded-full mx-auto mb-4 shadow-lg"
          />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            创建账号
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            加入宠物知识分享社区
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                  昵称
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="你的昵称"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                  密码
                </label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="设置密码"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                  确认密码
                </label>
                <Input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="再次输入密码"
                />
              </div>

              {/* 身份选择 */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  选择你的身份
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setFormData({ ...formData, isPetOwner: true })}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      formData.isPetOwner 
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' 
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <Camera className="h-5 w-5 mx-auto mb-1 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-medium">养宠人</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      上传宠物照片认证
                    </p>
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, isPetOwner: false })}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      !formData.isPetOwner 
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' 
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <Award className="h-5 w-5 mx-auto mb-1 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-medium">爱宠人</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      完成答题认证
                    </p>
                  </button>
                </div>
              </div>

              <Button 
                className="w-full bg-orange-500 hover:bg-orange-600"
                onClick={handleRegister}
                disabled={!formData.name.trim() || formData.password.length < 4 || formData.password !== formData.confirmPassword}
              >
                {registered ? '注册成功！' : '注册'}
              </Button>

              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                已有账号？{' '}
                <button 
                  className="text-orange-500 hover:underline"
                  onClick={() => setCurrentPage('login')}
                >
                  立即登录
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
