'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Lock, Eye, EyeOff, PawPrint, Camera, FileText, Check, Loader2 } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useMounted } from '@/hooks/use-mounted';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// 模拟宠物安全知识问题
const safetyQuestions = [
  {
    question: '猫咪不能吃以下哪种食物？',
    options: ['煮熟的鸡肉', '洋葱', '南瓜', '胡萝卜'],
    answer: 1
  },
  {
    question: '狗狗中暑时应该如何处理？',
    options: ['立即用冷水冲', '给它喝冰水', '用湿毛巾擦拭并通风', '让它继续运动'],
    answer: 2
  },
  {
    question: '以下哪种行为对宠物有害？',
    options: ['定期驱虫', '给狗狗吃巧克力', '每天散步', '定期洗澡'],
    answer: 1
  },
  {
    question: '养仓鼠需要注意什么？',
    options: ['多只一起养', '用水洗澡', '独居，避免合笼', '喂食大量水果'],
    answer: 2
  },
  {
    question: '兔子最需要的主食是？',
    options: ['胡萝卜', '提摩西草', '兔粮', '蔬菜'],
    answer: 1
  }
];

export default function RegisterPage() {
  const router = useRouter();
  const { theme, login } = useStore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const mounted = useMounted();
  const [step, setStep] = useState(1); // 1: 选择身份, 2: 基本信息, 3: 认证
  const [userType, setUserType] = useState<'pet_owner' | 'non_pet_owner' | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // 养宠人认证
  const [petPhotos, setPetPhotos] = useState<string[]>([]);
  const [petDescription, setPetDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifiedPets, setVerifiedPets] = useState<{url: string, type: string}[]>([]);
  
  // 非养宠人认证
  const [quizDialogOpen, setQuizDialogOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [quizPassed, setQuizPassed] = useState(false);

  const themeStyles = {
    light: { background: 'bg-white', text: 'text-gray-800', accent: 'text-orange-500', shadow: 'shadow-gray-200/50', card: 'bg-gray-50', cardText: 'text-gray-600', border: 'border-gray-200' },
    dark: { background: 'bg-gray-900', text: 'text-gray-100', accent: 'text-orange-400', shadow: 'shadow-gray-800/50', card: 'bg-gray-800', cardText: 'text-gray-300', border: 'border-gray-700' },
    warm: { background: 'bg-orange-50', text: 'text-gray-800', accent: 'text-orange-600', shadow: 'shadow-orange-200/50', card: 'bg-orange-100/50', cardText: 'text-gray-600', border: 'border-orange-200' },
    fresh: { background: 'bg-emerald-50', text: 'text-gray-800', accent: 'text-emerald-600', shadow: 'shadow-emerald-200/50', card: 'bg-emerald-100/50', cardText: 'text-gray-600', border: 'border-emerald-200' }
  };

  const currentTheme = themeStyles[theme];

  const handleNext = () => {
    if (step === 1 && !userType) {
      toast({ title: '请选择您的身份', variant: 'destructive' });
      return;
    }
    if (step === 2) {
      if (!formData.username || !formData.password) {
        toast({ title: '请填写完整信息', variant: 'destructive' });
        return;
      }
      if (formData.username.length < 2 || formData.username.length > 20) {
        toast({ title: '用户名长度应为2-20个字符', variant: 'destructive' });
        return;
      }
      if (formData.password.length < 6) {
        toast({ title: '密码长度至少6个字符', variant: 'destructive' });
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast({ title: '两次密码不一致', variant: 'destructive' });
        return;
      }
    }
    setStep(step + 1);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
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
        // 上传成功后验证是否为宠物图片
        setVerifying(true);
        toast({ title: '正在验证图片...' });
        
        try {
          const verifyResponse = await fetch('/api/verify-pet', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: data.url })
          });
          
          const verifyData = await verifyResponse.json();
          
          if (verifyResponse.ok && verifyData.success) {
            if (verifyData.isPet) {
              setPetPhotos([...petPhotos, data.url]);
              setVerifiedPets([...verifiedPets, { url: data.url, type: verifyData.petType || '宠物' }]);
              toast({ 
                title: '验证通过！', 
                description: verifyData.petType ? `检测到：${verifyData.petType}` : '已识别为宠物照片'
              });
            } else {
              toast({ 
                title: '验证未通过', 
                description: verifyData.reason || '未能在图片中识别到宠物，请上传清晰的宠物照片',
                variant: 'destructive' 
              });
            }
          } else {
            // 验证API出错，仍然允许上传（降级处理）
            setPetPhotos([...petPhotos, data.url]);
            toast({ title: '照片上传成功（验证服务暂时不可用）' });
          }
        } catch (verifyError) {
          // 验证失败，仍然允许上传（降级处理）
          console.error('Verify error:', verifyError);
          setPetPhotos([...petPhotos, data.url]);
          toast({ title: '照片上传成功' });
        } finally {
          setVerifying(false);
        }
      } else {
        toast({ title: data.error || '上传失败', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: '上传失败', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
    
    // 清空input以允许重复选择同一文件
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleStartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setQuizDialogOpen(true);
  };

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);
    
    if (currentQuestion < safetyQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // 计算得分
      let correct = 0;
      newAnswers.forEach((ans, idx) => {
        if (ans === safetyQuestions[idx].answer) correct++;
      });
      
      setQuizDialogOpen(false);
      
      if (correct >= 4) {
        setQuizPassed(true);
        toast({ title: '恭喜！认证通过', description: `您答对了 ${correct}/${safetyQuestions.length} 道题` });
      } else {
        toast({ title: '认证未通过', description: `需要答对4题以上，您答对了 ${correct}/${safetyQuestions.length} 道`, variant: 'destructive' });
      }
    }
  };

  const handleRegister = async () => {
    if (userType === 'pet_owner' && petPhotos.length === 0) {
      toast({ title: '请上传至少一张宠物照片', variant: 'destructive' });
      return;
    }
    if (userType === 'non_pet_owner' && !quizPassed) {
      toast({ title: '请先通过安全知识测试', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          userType,
          petPhotos: userType === 'pet_owner' ? petPhotos : undefined,
          quizPassed: userType === 'non_pet_owner' ? quizPassed : undefined
        })
      });

      const data = await response.json();
      if (response.ok) {
        login(data.user);
        toast({ title: '注册成功', description: '欢迎加入爪迹！' });
        router.push('/user');
      } else {
        toast({ title: data.error || '注册失败', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: '注册失败，请稍后重试', variant: 'destructive' });
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
          <button 
            onClick={() => step > 1 ? setStep(step - 1) : router.push('/user')}
            className={`p-2 rounded-xl ${currentTheme.card} hover:shadow-md transition-all ${step === 1 ? 'invisible' : ''}`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-lg">注册</h1>
          <div className="flex-1 text-right">
            <span className={`text-sm ${currentTheme.cardText}`}>步骤 {step}/3</span>
          </div>
        </div>
      </header>

      {/* 主内容 */}
      <main className="max-w-md mx-auto px-4 py-8">
        {/* 步骤 1: 选择身份 */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className={`w-20 h-20 rounded-2xl ${currentTheme.card} shadow-lg mx-auto flex items-center justify-center mb-4`}>
                <PawPrint className={`w-10 h-10 ${currentTheme.accent}`} />
              </div>
              <h2 className="text-xl font-bold">选择您的身份</h2>
              <p className={`${currentTheme.cardText} text-sm mt-1`}>我们需要验证您的身份以确保社区安全</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setUserType('pet_owner')}
                className={`w-full p-5 rounded-2xl border-2 transition-all text-left ${
                  userType === 'pet_owner' 
                    ? 'border-orange-500 bg-orange-50' 
                    : `${currentTheme.card} ${currentTheme.border}`
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${userType === 'pet_owner' ? 'bg-orange-100' : currentTheme.card} flex items-center justify-center`}>
                    <Camera className={`w-6 h-6 ${userType === 'pet_owner' ? 'text-orange-500' : currentTheme.accent}`} />
                  </div>
                  <div>
                    <p className="font-bold">我是养宠人</p>
                    <p className={`text-sm ${currentTheme.cardText}`}>上传宠物照片完成认证</p>
                  </div>
                  {userType === 'pet_owner' && (
                    <Check className="w-6 h-6 text-orange-500 ml-auto" />
                  )}
                </div>
              </button>

              <button
                onClick={() => setUserType('non_pet_owner')}
                className={`w-full p-5 rounded-2xl border-2 transition-all text-left ${
                  userType === 'non_pet_owner' 
                    ? 'border-orange-500 bg-orange-50' 
                    : `${currentTheme.card} ${currentTheme.border}`
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${userType === 'non_pet_owner' ? 'bg-orange-100' : currentTheme.card} flex items-center justify-center`}>
                    <FileText className={`w-6 h-6 ${userType === 'non_pet_owner' ? 'text-orange-500' : currentTheme.accent}`} />
                  </div>
                  <div>
                    <p className="font-bold">我是爱宠人士</p>
                    <p className={`text-sm ${currentTheme.cardText}`}>回答宠物安全问题完成认证</p>
                  </div>
                  {userType === 'non_pet_owner' && (
                    <Check className="w-6 h-6 text-orange-500 ml-auto" />
                  )}
                </div>
              </button>
            </div>

            <Button 
              onClick={handleNext}
              className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-white py-6 mt-8"
              disabled={!userType}
            >
              下一步
            </Button>
          </div>
        )}

        {/* 步骤 2: 基本信息 */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold">基本信息</h2>
              <p className={`${currentTheme.cardText} text-sm mt-1`}>设置您的账号信息</p>
            </div>

            <div className={`p-6 rounded-2xl ${currentTheme.card} shadow-sm ${currentTheme.shadow} space-y-4`}>
              <div>
                <Label>用户名</Label>
                <div className="relative">
                  <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${currentTheme.cardText}`} />
                  <Input
                    type="text"
                    placeholder="请输入用户名"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="pl-10 rounded-xl"
                    maxLength={20}
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
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="pl-10 pr-10 rounded-xl"
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

              <div>
                <Label>确认密码</Label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${currentTheme.cardText}`} />
                  <Input
                    type="password"
                    placeholder="请再次输入密码"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="pl-10 rounded-xl"
                  />
                </div>
              </div>
            </div>

            <Button 
              onClick={handleNext}
              className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-white py-6"
            >
              下一步
            </Button>
          </div>
        )}

        {/* 步骤 3: 认证 */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold">身份认证</h2>
              <p className={`${currentTheme.cardText} text-sm mt-1`}>
                {userType === 'pet_owner' ? '请上传您的宠物照片' : '请完成宠物安全知识测试'}
              </p>
            </div>

            {userType === 'pet_owner' ? (
              // 养宠人认证
              <div className={`p-6 rounded-2xl ${currentTheme.card} shadow-sm ${currentTheme.shadow}`}>
                <div className="mb-4">
                  <p className="font-medium mb-2">上传宠物照片</p>
                  <p className={`text-sm ${currentTheme.cardText}`}>
                    请上传1-3张您的宠物照片，用于身份认证
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  {petPhotos.map((photo, idx) => (
                    <div key={idx} className={`aspect-square rounded-xl overflow-hidden ${currentTheme.background}`}>
                      <img src={photo} alt={`宠物照片${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {petPhotos.length < 3 && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading || verifying}
                      className={`aspect-square rounded-xl border-2 border-dashed ${currentTheme.border} flex flex-col items-center justify-center hover:border-orange-500 transition-colors ${uploading || verifying ? 'opacity-50' : ''}`}
                    >
                      {uploading || verifying ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                          <span className={`text-xs ${currentTheme.cardText} mt-1`}>{verifying ? '验证中' : '上传中'}</span>
                        </>
                      ) : (
                        <>
                          <Camera className={`w-6 h-6 ${currentTheme.cardText}`} />
                          <span className={`text-xs ${currentTheme.cardText} mt-1`}>上传</span>
                        </>
                      )}
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                <div>
                  <Label>宠物简介</Label>
                  <Textarea
                    placeholder="介绍一下您的宠物..."
                    value={petDescription}
                    onChange={(e) => setPetDescription(e.target.value)}
                    className="rounded-xl"
                    rows={3}
                  />
                </div>

                {petPhotos.length > 0 && (
                  <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Check className="w-4 h-4" />
                      已上传 {petPhotos.length} 张照片，可以完成注册
                    </div>
                    {verifiedPets.length > 0 && (
                      <div className="text-xs text-green-600">
                        检测到的宠物：{verifiedPets.map(p => p.type).filter(Boolean).join('、') || '宠物'}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              // 非养宠人认证
              <div className={`p-6 rounded-2xl ${currentTheme.card} shadow-sm ${currentTheme.shadow}`}>
                <div className="mb-4">
                  <p className="font-medium mb-2">宠物安全知识测试</p>
                  <p className={`text-sm ${currentTheme.cardText}`}>
                    回答5道关于宠物安全的问题，答对4题以上即可通过
                  </p>
                </div>

                {!quizPassed ? (
                  <Button
                    onClick={handleStartQuiz}
                    className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    开始测试
                  </Button>
                ) : (
                  <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    恭喜！您已通过测试，可以完成注册
                  </div>
                )}

                {/* 测试弹窗 */}
                <Dialog open={quizDialogOpen} onOpenChange={setQuizDialogOpen}>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>宠物安全知识测试</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">
                          问题 {currentQuestion + 1}/{safetyQuestions.length}
                        </Badge>
                      </div>
                      
                      <p className="font-medium">{safetyQuestions[currentQuestion].question}</p>
                      
                      <div className="space-y-2">
                        {safetyQuestions[currentQuestion].options.map((option, idx) => (
                          <Button
                            key={idx}
                            variant="outline"
                            className="w-full justify-start rounded-xl"
                            onClick={() => handleAnswer(idx)}
                          >
                            {String.fromCharCode(65 + idx)}. {option}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}

            <Button 
              onClick={handleRegister}
              disabled={loading || (userType === 'pet_owner' ? petPhotos.length === 0 : !quizPassed)}
              className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-white py-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  注册中...
                </>
              ) : '完成注册'}
            </Button>
          </div>
        )}

        {/* 已有账号 */}
        <p className={`text-center mt-6 ${currentTheme.cardText}`}>
          已有账号？
          <Link href="/user/login" className={`${currentTheme.accent} font-medium ml-1`}>
            立即登录
          </Link>
        </p>
      </main>
    </div>
  );
}
