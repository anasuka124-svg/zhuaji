'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Eye, Heart, Clock, Plus, AlertTriangle, 
  User, Menu, Sun, Moon, MessageSquare, HelpCircle, ChevronDown, ChevronUp,
  Cat, Dog, Bird, Bug, Fish, Rabbit, PawPrint, Search
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { useMounted } from '@/hooks/use-mounted';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PetCategoryLabels, PetCategory, UncommonQuestion } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const categoryIcons: Record<PetCategory, React.ReactNode> = {
  cat: <Cat className="w-4 h-4" />,
  dog: <Dog className="w-4 h-4" />,
  bird: <Bird className="w-4 h-4" />,
  reptile: <Bug className="w-4 h-4" />,
  small_mammal: <Rabbit className="w-4 h-4" />,
  aquatic: <Fish className="w-4 h-4" />,
  other: <PawPrint className="w-4 h-4" />
};

export default function QuestionsPage() {
  const { theme, setTheme, questions, user, isLoggedIn, addQuestion } = useStore();
  const { toast } = useToast();
  
  const mounted = useMounted();
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PetCategory | 'all'>('all');
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    description: '',
    solution: '',
    petType: '',
    petCategory: 'cat' as PetCategory,
    tags: ''
  });

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

  // 过滤问题
  const filteredQuestions = questions.filter(q => {
    const matchCategory = selectedCategory === 'all' || q.petCategory === selectedCategory;
    const matchSearch = !searchQuery.trim() || 
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleSubmit = () => {
    if (!isLoggedIn) {
      toast({ title: '请先登录', description: '登录后才能分享问题', variant: 'destructive' });
      return;
    }

    if (!newQuestion.title || !newQuestion.description || !newQuestion.solution || !newQuestion.petType) {
      toast({ title: '请填写完整信息', variant: 'destructive' });
      return;
    }

    addQuestion({
      title: newQuestion.title,
      description: newQuestion.description,
      solution: newQuestion.solution,
      petType: newQuestion.petType,
      petCategory: newQuestion.petCategory,
      images: [],
      tags: newQuestion.tags.split(',').map(t => t.trim()).filter(Boolean)
    });

    setNewQuestion({
      title: '',
      description: '',
      solution: '',
      petType: '',
      petCategory: 'cat',
      tags: ''
    });
    setSubmitDialogOpen(false);
    toast({ title: '分享成功', description: '感谢您分享宝贵的经验！' });
  };

  if (!mounted) return null;

  return (
    <div className={`min-h-screen ${currentTheme.background} ${currentTheme.text} transition-colors duration-300`}>
      {/* 顶部导航 */}
      <header className={`sticky top-0 z-50 ${currentTheme.background} border-b ${currentTheme.border} px-4 py-3`}>
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/" className={`p-2 rounded-xl ${currentTheme.card} hover:shadow-md transition-all`}>
            <ArrowLeft className="w-5 h-5" />
          </Link>
          
          <div className="flex-1">
            <h1 className="font-bold text-lg">非常见问题</h1>
            <p className={`text-xs ${currentTheme.cardText}`}>分享你遇到的特殊情况</p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className={`rounded-xl ${currentTheme.card} shadow-sm`}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          <Link href="/user">
            <Button variant="ghost" size="icon" className={`rounded-xl ${currentTheme.card} shadow-sm`}>
              <User className="w-5 h-5" />
            </Button>
          </Link>

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
                  <HelpCircle className={`w-5 h-5 ${currentTheme.accent}`} /><span>知识库</span></Link>
                <Link href="/questions" onClick={() => setMenuOpen(false)} className={`flex items-center gap-3 p-3 rounded-xl ${currentTheme.card}`}>
                  <MessageSquare className={`w-5 h-5 ${currentTheme.accent}`} /><span>非常见问题</span></Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* 搜索和筛选 */}
      <div className="px-4 py-4 border-b border-gray-200/50">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className={`flex items-center gap-2 p-2 rounded-xl ${currentTheme.card} shadow-sm`}>
            <Input
              type="text"
              placeholder="搜索问题..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-0 bg-transparent focus:ring-0"
            />
            <Button className="rounded-lg bg-orange-500 hover:bg-orange-600 text-white px-4">
              <Search className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            <Button
              onClick={() => setSelectedCategory('all')}
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              className={`rounded-xl whitespace-nowrap ${selectedCategory === 'all' ? 'bg-orange-500 hover:bg-orange-600 text-white' : ''}`}
            >
              全部
            </Button>
            {(Object.keys(PetCategoryLabels) as PetCategory[]).map(cat => (
              <Button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                size="sm"
                className={`rounded-xl whitespace-nowrap flex items-center gap-1 ${selectedCategory === cat ? 'bg-orange-500 hover:bg-orange-600 text-white' : ''}`}
              >
                {categoryIcons[cat]}
                {PetCategoryLabels[cat]}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* 问题列表 */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* 提交按钮 */}
        <Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-white mb-6 py-6">
              <Plus className="w-5 h-5 mr-2" />
              分享我遇到的特殊情况
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>分享非常见问题</DialogTitle>
              <DialogDescription>
                遇到了什么特殊情况？分享你的经验和解决方案，帮助其他养宠人。
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>问题标题 *</Label>
                <Input
                  placeholder="简短描述问题..."
                  value={newQuestion.title}
                  onChange={(e) => setNewQuestion({...newQuestion, title: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>宠物类型 *</Label>
                  <Input
                    placeholder="如：英短蓝猫"
                    value={newQuestion.petType}
                    onChange={(e) => setNewQuestion({...newQuestion, petType: e.target.value})}
                  />
                </div>
                <div>
                  <Label>宠物分类 *</Label>
                  <Select value={newQuestion.petCategory} onValueChange={(v) => setNewQuestion({...newQuestion, petCategory: v as PetCategory})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(PetCategoryLabels) as PetCategory[]).map(cat => (
                        <SelectItem key={cat} value={cat}>{PetCategoryLabels[cat]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>问题描述 *</Label>
                <Textarea
                  placeholder="详细描述你遇到的问题..."
                  rows={3}
                  value={newQuestion.description}
                  onChange={(e) => setNewQuestion({...newQuestion, description: e.target.value})}
                />
              </div>
              <div>
                <Label>解决方案 *</Label>
                <Textarea
                  placeholder="你是如何解决的？分享你的经验..."
                  rows={4}
                  value={newQuestion.solution}
                  onChange={(e) => setNewQuestion({...newQuestion, solution: e.target.value})}
                />
              </div>
              <div>
                <Label>标签（用逗号分隔）</Label>
                <Input
                  placeholder="如：紧急, 行为, 饮食"
                  value={newQuestion.tags}
                  onChange={(e) => setNewQuestion({...newQuestion, tags: e.target.value})}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setSubmitDialogOpen(false)}>取消</Button>
                <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleSubmit}>提交分享</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 问题卡片列表 */}
        <div className="space-y-4">
          {filteredQuestions.map(question => (
            <QuestionCard
              key={question.id}
              question={question}
              theme={currentTheme}
              isExpanded={expandedId === question.id}
              onToggle={() => setExpandedId(expandedId === question.id ? null : question.id)}
            />
          ))}
        </div>

        {filteredQuestions.length === 0 && (
          <div className={`text-center py-20 ${currentTheme.cardText}`}>
            <AlertTriangle className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg mb-2">暂无相关问题</p>
            <p className="text-sm opacity-60">成为第一个分享特殊情况的人吧！</p>
          </div>
        )}
      </main>

      {/* 底部间距 */}
      <div className="h-20" />
    </div>
  );
}

// 问题卡片组件
function QuestionCard({ 
  question, 
  theme, 
  isExpanded, 
  onToggle 
}: { 
  question: UncommonQuestion; 
  theme: any; 
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`rounded-2xl ${theme.card} shadow-sm ${theme.shadow} border border-gray-200/30 overflow-hidden`}>
      {/* 标题区 */}
      <div className="p-5 cursor-pointer" onClick={onToggle}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="rounded-lg">
              {categoryIcons[question.petCategory]}
              <span className="ml-1">{PetCategoryLabels[question.petCategory]}</span>
            </Badge>
            <span className={`text-sm ${theme.cardText}`}>{question.petType}</span>
          </div>
          {isExpanded ? <ChevronUp className="w-5 h-5 opacity-50" /> : <ChevronDown className="w-5 h-5 opacity-50" />}
        </div>

        <h3 className="font-bold text-base mb-2">{question.title}</h3>
        
        <p className={`text-sm ${theme.cardText} line-clamp-2`}>{question.description}</p>

        <div className="flex items-center justify-between mt-3">
          <div className="flex flex-wrap gap-1">
            {question.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="rounded-lg text-xs">{tag}</Badge>
            ))}
          </div>
          <div className={`flex items-center gap-3 text-xs ${theme.cardText} opacity-70`}>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />{question.views}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5" />{question.likes}
            </span>
          </div>
        </div>
      </div>

      {/* 展开的解决方案 */}
      {isExpanded && (
        <div className={`px-5 pb-5 pt-0 border-t ${theme.border}`}>
          <div className="pt-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <MessageSquare className={`w-4 h-4 ${theme.accent}`} />
              解决方案
            </h4>
            <div className={`text-sm ${theme.cardText} whitespace-pre-line leading-relaxed`}>
              {question.solution}
            </div>

            {/* 作者信息 */}
            <div className={`mt-4 pt-4 border-t ${theme.border} flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                  <User className="w-4 h-4 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">{question.author.name}</p>
                  <p className={`text-xs ${theme.cardText}`}>{question.createdAt}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="rounded-lg">
                <Heart className="w-4 h-4 mr-1" />
                有帮助
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
