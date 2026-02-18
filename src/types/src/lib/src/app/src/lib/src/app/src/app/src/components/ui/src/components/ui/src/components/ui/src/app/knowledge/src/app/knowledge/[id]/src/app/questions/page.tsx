'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Eye, Heart, Clock, Plus, AlertTriangle, User, Sun, Moon, ChevronDown, ChevronUp, Cat, Dog, Bird, Bug, Fish, Rabbit, PawPrint, Search } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PetCategoryLabels, PetCategory, UncommonQuestion } from '@/types';

const categoryIcons: Record<PetCategory, React.ReactNode> = {
  cat: <Cat className="w-4 h-4" />, dog: <Dog className="w-4 h-4" />, bird: <Bird className="w-4 h-4" />,
  reptile: <Bug className="w-4 h-4" />, small_mammal: <Rabbit className="w-4 h-4" />,
  aquatic: <Fish className="w-4 h-4" />, other: <PawPrint className="w-4 h-4" />
};

export default function QuestionsPage() {
  const { theme, setTheme, questions, user, isLoggedIn, addQuestion } = useStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PetCategory | 'all'>('all');
  const [showSubmit, setShowSubmit] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ title: '', description: '', solution: '', petType: '', petCategory: 'cat' as PetCategory, tags: '' });

  const themeStyles: Record<string, any> = {
    light: { background: 'bg-white', text: 'text-gray-800', card: 'bg-gray-50', cardText: 'text-gray-600', border: 'border-gray-200' },
    dark: { background: 'bg-gray-900', text: 'text-gray-100', card: 'bg-gray-800', cardText: 'text-gray-300', border: 'border-gray-700' },
    warm: { background: 'bg-orange-50', text: 'text-gray-800', card: 'bg-orange-100/50', cardText: 'text-gray-600', border: 'border-orange-200' },
    fresh: { background: 'bg-emerald-50', text: 'text-gray-800', card: 'bg-emerald-100/50', cardText: 'text-gray-600', border: 'border-emerald-200' }
  };
  const currentTheme = themeStyles[theme];

  const filteredQuestions = questions.filter(q => {
    const matchCategory = selectedCategory === 'all' || q.petCategory === selectedCategory;
    const matchSearch = !searchQuery.trim() || q.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const toggleTheme = () => {
    const themes = ['light', 'dark', 'warm', 'fresh'] as const;
    setTheme(themes[(themes.indexOf(theme) + 1) % themes.length]);
  };

  const handleSubmit = () => {
    if (!isLoggedIn) { alert('请先登录'); return; }
    if (!newQuestion.title || !newQuestion.description || !newQuestion.solution || !newQuestion.petType) {
      alert('请填写完整信息'); return;
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
    setNewQuestion({ title: '', description: '', solution: '', petType: '', petCategory: 'cat', tags: '' });
    setShowSubmit(false);
    alert('分享成功！');
  };

  return (
    <div className={`min-h-screen ${currentTheme.background} ${currentTheme.text}`}>
      <header className={`sticky top-0 z-50 ${currentTheme.background} border-b ${currentTheme.border} px-4 py-3`}>
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/" className={`p-2 rounded-xl ${currentTheme.card}`}><ArrowLeft className="w-5 h-5" /></Link>
          <div className="flex-1">
            <h1 className="font-bold text-lg">非常见问题</h1>
            <p className={`text-xs ${currentTheme.cardText}`}>分享你遇到的特殊情况</p>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme} className={`rounded-xl ${currentTheme.card}`}>
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          <Link href="/user"><Button variant="ghost" size="icon" className={`rounded-xl ${currentTheme.card}`}><User className="w-5 h-5" /></Button></Link>
        </div>
      </header>

      <div className="px-4 py-4 border-b border-gray-200/50">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className={`flex items-center gap-2 p-2 rounded-xl ${currentTheme.card} shadow-sm`}>
            <Input type="text" placeholder="搜索问题..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 border-0 bg-transparent focus:ring-0" />
            <Button className="rounded-lg bg-orange-500 hover:bg-orange-600 text-white px-4"><Search className="w-4 h-4" /></Button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            <Button onClick={() => setSelectedCategory('all')} variant={selectedCategory === 'all' ? 'default' : 'outline'} size="sm" className={`rounded-xl ${selectedCategory === 'all' ? 'bg-orange-500 hover:bg-orange-600 text-white' : ''}`}>全部</Button>
            {(Object.keys(PetCategoryLabels) as PetCategory[]).map(cat => (
              <Button key={cat} onClick={() => setSelectedCategory(cat)} variant={selectedCategory === cat ? 'default' : 'outline'} size="sm" className={`rounded-xl ${selectedCategory === cat ? 'bg-orange-500 hover:bg-orange-600 text-white' : ''}`}>
                {categoryIcons[cat]}<span className="ml-1">{PetCategoryLabels[cat]}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <Button onClick={() => setShowSubmit(!showSubmit)} className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-white mb-6 py-6">
          <Plus className="w-5 h-5 mr-2" />分享我遇到的特殊情况
        </Button>

        {showSubmit && (
          <div className={`p-6 rounded-2xl ${currentTheme.card} shadow-sm mb-6 space-y-4`}>
            <input className={`w-full p-3 rounded-xl border ${currentTheme.border} bg-transparent`} placeholder="问题标题" value={newQuestion.title} onChange={(e) => setNewQuestion({...newQuestion, title: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
              <input className={`p-3 rounded-xl border ${currentTheme.border} bg-transparent`} placeholder="宠物类型（如：英短蓝猫）" value={newQuestion.petType} onChange={(e) => setNewQuestion({...newQuestion, petType: e.target.value})} />
              <select className={`p-3 rounded-xl border ${currentTheme.border} bg-transparent`} value={newQuestion.petCategory} onChange={(e) => setNewQuestion({...newQuestion, petCategory: e.target.value as PetCategory})}>
                {(Object.keys(PetCategoryLabels) as PetCategory[]).map(cat => <option key={cat} value={cat}>{PetCategoryLabels[cat]}</option>)}
              </select>
            </div>
            <textarea className={`w-full p-3 rounded-xl border ${currentTheme.border} bg-transparent`} rows={3} placeholder="问题描述..." value={newQuestion.description} onChange={(e) => setNewQuestion({...newQuestion, description: e.target.value})} />
            <textarea className={`w-full p-3 rounded-xl border ${currentTheme.border} bg-transparent`} rows={4} placeholder="解决方案..." value={newQuestion.solution} onChange={(e) => setNewQuestion({...newQuestion, solution: e.target.value})} />
            <input className={`w-full p-3 rounded-xl border ${currentTheme.border} bg-transparent`} placeholder="标签（用逗号分隔）" value={newQuestion.tags} onChange={(e) => setNewQuestion({...newQuestion, tags: e.target.value})} />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowSubmit(false)}>取消</Button>
              <Button onClick={handleSubmit} className="bg-orange-500 hover:bg-orange-600 text-white">提交分享</Button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {filteredQuestions.map(q => (
            <div key={q.id} className={`rounded-2xl ${currentTheme.card} shadow-sm border border-gray-200/30 overflow-hidden`}>
              <div className="p-5 cursor-pointer" onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="rounded-lg">{categoryIcons[q.petCategory]}<span className="ml-1">{PetCategoryLabels[q.petCategory]}</span></Badge>
                    <span className={`text-sm ${currentTheme.cardText}`}>{q.petType}</span>
                  </div>
                  {expandedId === q.id ? <ChevronUp className="w-5 h-5 opacity-50" /> : <ChevronDown className="w-5 h-5 opacity-50" />}
                </div>
                <h3 className="font-bold text-base mb-2">{q.title}</h3>
                <p className={`text-sm ${currentTheme.cardText} line-clamp-2`}>{q.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex flex-wrap gap-1">
                    {q.tags.slice(0, 3).map(tag => <Badge key={tag} variant="secondary" className="rounded-lg text-xs">{tag}</Badge>)}
                  </div>
                  <div className={`flex items-center gap-3 text-xs ${currentTheme.cardText} opacity-70`}>
                    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{q.views}</span>
                    <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" />{q.likes}</span>
                  </div>
                </div>
              </div>
              {expandedId === q.id && (
                <div className={`px-5 pb-5 pt-0 border-t ${currentTheme.border}`}>
                  <div className="pt-4">
                    <h4 className="font-semibold mb-2">解决方案</h4>
                    <p className={`text-sm ${currentTheme.cardText} whitespace-pre-line`}>{q.solution}</p>
                    <div className={`mt-4 pt-4 border-t ${currentTheme.border} flex items-center justify-between`}>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center"><User className="w-4 h-4 text-orange-500" /></div>
                        <div>
                          <p className="text-sm font-medium">{q.author.name}</p>
                          <p className={`text-xs ${currentTheme.cardText}`}>{q.createdAt}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-lg"><Heart className="w-4 h-4 mr-1" />有帮助</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
