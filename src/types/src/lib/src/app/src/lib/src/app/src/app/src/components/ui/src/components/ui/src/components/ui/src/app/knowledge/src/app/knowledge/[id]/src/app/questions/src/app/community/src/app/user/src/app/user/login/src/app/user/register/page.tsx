'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Lock, Eye, EyeOff, PawPrint, Camera, FileText, Check } from 'lucide-react';
import { useStore, mockLogin } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function RegisterPage() {
  const router = useRouter();
  const { theme, login } = useStore();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<'pet_owner' | 'non_pet_owner' | null>(null);
  const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [petPhotos, setPetPhotos] = useState<string[]>([]);
  const [quizPassed, setQuizPassed] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);

  const questions = [
    { q: '猫咪不能吃以下哪种食物？', options: ['煮熟的鸡肉', '洋葱', '南瓜'], ans: 1 },
    { q: '狗狗中暑时应该如何处理？', options: ['立即用冷水冲', '用湿毛巾擦拭并通风', '给它喝冰水'], ans: 1 },
    { q: '以下哪种行为对宠物有害？', options: ['定期驱虫', '给狗狗吃巧克力', '每天散步'], ans: 1 },
  ];

  const themeStyles: Record<string, any> = {
    light: { background: 'bg-white', text: 'text-gray-800', card: 'bg-gray-50', cardText: 'text-gray-600', border: 'border-gray-200' },
    dark: { background: 'bg-gray-900', text: 'text-gray-100', card: 'bg-gray-800', cardText: 'text-gray-300', border: 'border-gray-700' },
    warm: { background: 'bg-orange-50', text: 'text-gray-800', card: 'bg-orange-100/50', cardText: 'text-gray-600', border: 'border-orange-200' },
    fresh: { background: 'bg-emerald-50', text: 'text-gray-800', card: 'bg-emerald-100/50', cardText: 'text-gray-600', border: 'border-emerald-200' }
  };
  const currentTheme = themeStyles[theme];

  const handleRegister = () => {
    if (userType === 'pet_owner' && petPhotos.length === 0) { alert('请上传至少一张宠物照片'); return; }
    if (userType === 'non_pet_owner' && !quizPassed) { alert('请先通过安全知识测试'); return; }
    const user = mockLogin(userType!);
    login(user);
    alert('注册成功，欢迎加入爪迹！');
    router.push('/user');
  };

  const handleAnswer = (idx: number) => {
    if (idx === questions[currentQ].ans && currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else if (idx === questions[currentQ].ans && currentQ === questions.length - 1) {
      setQuizPassed(true);
      setShowQuiz(false);
    } else if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setShowQuiz(false);
    }
  };

  return (
    <div className={`min-h-screen ${currentTheme.background} ${currentTheme.text}`}>
      <header className={`sticky top-0 z-50 ${currentTheme.background} border-b ${currentTheme.border} px-4 py-3`}>
        <div className="max-w-md mx-auto flex items-center gap-4">
          <button onClick={() => step > 1 ? setStep(step - 1) : null} className={`p-2 rounded-xl ${currentTheme.card} ${step === 1 ? 'invisible' : ''}`}><ArrowLeft className="w-5 h-5" /></button>
          <h1 className="font-bold text-lg">注册</h1>
          <div className="flex-1 text-right"><span className={`text-sm ${currentTheme.cardText}`}>步骤 {step}/3</span></div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-8">
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className={`w-20 h-20 rounded-2xl ${currentTheme.card} shadow-lg mx-auto flex items-center justify-center mb-4`}><PawPrint className="w-10 h-10 text-orange-500" /></div>
              <h2 className="text-xl font-bold">选择您的身份</h2>
              <p className={`${currentTheme.cardText} text-sm mt-1`}>我们需要验证您的身份以确保社区安全</p>
            </div>
            <div className="space-y-4">
              <button onClick={() => setUserType('pet_owner')} className={`w-full p-5 rounded-2xl border-2 transition-all text-left ${userType === 'pet_owner' ? 'border-orange-500 bg-orange-50' : `${currentTheme.card} ${currentTheme.border}`}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${userType === 'pet_owner' ? 'bg-orange-100' : currentTheme.card}`}><Camera className={`w-6 h-6 ${userType === 'pet_owner' ? 'text-orange-500' : 'text-orange-500'}`} /></div>
                  <div><p className="font-bold">我是养宠人</p><p className={`text-sm ${currentTheme.cardText}`}>上传宠物照片完成认证</p></div>
                  {userType === 'pet_owner' && <Check className="w-6 h-6 text-orange-500 ml-auto" />}
                </div>
              </button>
              <button onClick={() => setUserType('non_pet_owner')} className={`w-full p-5 rounded-2xl border-2 transition-all text-left ${userType === 'non_pet_owner' ? 'border-orange-500 bg-orange-50' : `${currentTheme.card} ${currentTheme.border}`}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${userType === 'non_pet_owner' ? 'bg-orange-100' : currentTheme.card}`}><FileText className={`w-6 h-6 ${userType === 'non_pet_owner' ? 'text-orange-500' : 'text-orange-500'}`} /></div>
                  <div><p className="font-bold">我是爱宠人士</p><p className={`text-sm ${currentTheme.cardText}`}>回答宠物安全问题认证</p></div>
                  {userType === 'non_pet_owner' && <Check className="w-6 h-6 text-orange-500 ml-auto" />}
                </div>
              </button>
            </div>
            <Button onClick={() => userType && setStep(2)} disabled={!userType} className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-white py-6 mt-8">下一步</Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold">基本信息</h2>
              <p className={`${currentTheme.cardText} text-sm mt-1`}>设置您的账号信息</p>
            </div>
            <div className={`p-6 rounded-2xl ${currentTheme.card} shadow-sm space-y-4`}>
              <div>
                <label className="text-sm font-medium">用户名</label>
                <div className="relative mt-1">
                  <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${currentTheme.cardText}`} />
                  <Input placeholder="请输入用户名" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} className="pl-10 rounded-xl" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">密码</label>
                <div className="relative mt-1">
                  <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${currentTheme.cardText}`} />
                  <Input type={showPassword ? 'text' : 'password'} placeholder="请输入密码" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="pl-10 pr-10 rounded-xl" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute right-3 top-1/2 -translate-y-1/2 ${currentTheme.cardText}`}>{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">确认密码</label>
                <div className="relative mt-1">
                  <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${currentTheme.cardText}`} />
                  <Input type="password" placeholder="请再次输入密码" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} className="pl-10 rounded-xl" />
                </div>
              </div>
            </div>
            <Button onClick={() => setStep(3)} className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-white py-6">下一步</Button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold">身份认证</h2>
              <p className={`${currentTheme.cardText} text-sm mt-1`}>{userType === 'pet_owner' ? '请上传您的宠物照片' : '请完成宠物安全知识测试'}</p>
            </div>
            {userType === 'pet_owner' ? (
              <div className={`p-6 rounded-2xl ${currentTheme.card} shadow-sm`}>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {petPhotos.map((_, idx) => (
                    <div key={idx} className={`aspect-square rounded-xl ${currentTheme.background} flex items-center justify-center`}><Check className="w-8 h-8 text-orange-500" /></div>
                  ))}
                  {petPhotos.length < 3 && (
                    <button onClick={() => setPetPhotos([...petPhotos, 'photo'])} className={`aspect-square rounded-xl border-2 border-dashed ${currentTheme.border} flex flex-col items-center justify-center hover:border-orange-500`}>
                      <Camera className={`w-6 h-6 ${currentTheme.cardText}`} />
                      <span className={`text-xs ${currentTheme.cardText} mt-1`}>上传</span>
                    </button>
                  )}
                </div>
                {petPhotos.length > 0 && <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2"><Check className="w-4 h-4" />已上传 {petPhotos.length} 张照片</div>}
              </div>
            ) : (
              <div className={`p-6 rounded-2xl ${currentTheme.card} shadow-sm`}>
                {!quizPassed ? (
                  <Button onClick={() => setShowQuiz(true)} className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-white">开始测试</Button>
                ) : (
                  <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2"><Check className="w-4 h-4" />恭喜！您已通过测试</div>
                )}
              </div>
            )}
            <Button onClick={handleRegister} disabled={userType === 'pet_owner' ? petPhotos.length === 0 : !quizPassed} className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-white py-6">完成注册</Button>
          </div>
        )}

        <p className={`text-center mt-6 ${currentTheme.cardText}`}>
          已有账号？<Link href="/user/login" className="text-orange-500 font-medium ml-1">立即登录</Link>
        </p>
      </main>

      {showQuiz && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${currentTheme.card} rounded-2xl p-6 max-w-sm w-full`}>
            <p className="text-sm mb-2"><Badge variant="outline">问题 {currentQ + 1}/{questions.length}</Badge></p>
            <p className="font-medium mb-4">{questions[currentQ].q}</p>
            <div className="space-y-2">
              {questions[currentQ].options.map((opt, idx) => (
                <Button key={idx} variant="outline" className="w-full justify-start rounded-xl" onClick={() => handleAnswer(idx)}>{String.fromCharCode(65 + idx)}. {opt}</Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
