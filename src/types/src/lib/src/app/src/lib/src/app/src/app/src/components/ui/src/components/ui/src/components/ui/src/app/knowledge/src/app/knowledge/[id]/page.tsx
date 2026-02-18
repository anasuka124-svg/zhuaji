'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Eye, Heart, Clock, Share2, Flag, Edit3, User, Sun, Moon, Cat, Dog, Bird, Bug, Fish, Rabbit, PawPrint, AlertCircle } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PetCategoryLabels, PetCategory } from '@/types';

const categoryIcons: Record<PetCategory, React.ReactNode> = {
  cat: <Cat className="w-4 h-4" />, dog: <Dog className="w-4 h-4" />, bird: <Bird className="w-4 h-4" />,
  reptile: <Bug className="w-4 h-4" />, small_mammal: <Rabbit className="w-4 h-4" />,
  aquatic: <Fish className="w-4 h-4" />, other: <PawPrint className="w-4 h-4" />
};

export default function KnowledgeDetailPage() {
  const params = useParams();
  const { theme, setTheme, knowledge, user, isLoggedIn, toggleFavorite, addSupplement, addCorrection } = useStore();
  const [supplementContent, setSupplementContent] = useState('');
  const [showSupplement, setShowSupplement] = useState(false);

  const themeStyles: Record<string, any> = {
    light: { background: 'bg-white', text: 'text-gray-800', card: 'bg-gray-50', cardText: 'text-gray-600', border: 'border-gray-200' },
    dark: { background: 'bg-gray-900', text: 'text-gray-100', card: 'bg-gray-800', cardText: 'text-gray-300', border: 'border-gray-700' },
    warm: { background: 'bg-orange-50', text: 'text-gray-800', card: 'bg-orange-100/50', cardText: 'text-gray-600', border: 'border-orange-200' },
    fresh: { background: 'bg-emerald-50', text: 'text-gray-800', card: 'bg-emerald-100/50', cardText: 'text-gray-600', border: 'border-emerald-200' }
  };
  const currentTheme = themeStyles[theme];

  const currentKnowledge = knowledge.find(k => k.id === params.id);
  const isFavorited = user?.favorites?.includes(params.id as string);

  const toggleTheme = () => {
    const themes = ['light', 'dark', 'warm', 'fresh'] as const;
    setTheme(themes[(themes.indexOf(theme) + 1) % themes.length]);
  };

  const handleFavorite = () => {
    if (!isLoggedIn) {
      alert('请先登录');
      return;
    }
    toggleFavorite(params.id as string);
  };

  const handleSupplement = () => {
    if (!supplementContent.trim()) return;
    addSupplement(params.id as string, supplementContent);
    setSupplementContent('');
    setShowSupplement(false);
    alert('提交成功，等待审核');
  };

  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold mt-6 mb-3">{line.slice(3)}</h2>;
      if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-semibold mt-4 mb-2">{line.slice(4)}</h3>;
      if (line.startsWith('- ')) return <li key={i} className={`ml-4 ${currentTheme.cardText}`}>{line.slice(2)}</li>;
      if (line.match(/^\d+\. /)) return <li key={i} className={`ml-4 list-decimal ${currentTheme.cardText}`}>{line.replace(/^\d+\. /, '')}</li>;
      if (line.trim() === '') return <div key={i} className="h-2" />;
      return <p key={i} className={`mb-2 ${currentTheme.cardText}`}>{line}</p>;
    });
  };

  if (!currentKnowledge) {
    return (
      <div className={`min-h-screen ${currentTheme.background} ${currentTheme.text} flex items-center justify-center`}>
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg mb-2">知识不存在</p>
          <Link href="/knowledge"><Button className="mt-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl">返回知识库</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${currentTheme.background} ${currentTheme.text}`}>
      <header className={`sticky top-0 z-50 ${currentTheme.background} border-b ${currentTheme.border} px-4 py-3`}>
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/knowledge" className={`p-2 rounded-xl ${currentTheme.card}`}><ArrowLeft className="w-5 h-5" /></Link>
          <div className="flex-1 min-w-0">
            <p className={`text-sm ${currentTheme.cardText}`}>知识库</p>
            <h1 className="font-bold truncate">{currentKnowledge.title}</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme} className={`rounded-xl ${currentTheme.card}`}>
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className={`p-6 rounded-2xl ${currentTheme.card} shadow-sm mb-6`}>
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="rounded-lg">{categoryIcons[currentKnowledge.category]}<span className="ml-1">{PetCategoryLabels[currentKnowledge.category]}</span></Badge>
          </div>
          <h1 className="text-2xl font-bold mb-4">{currentKnowledge.title}</h1>
          <div className={`flex flex-wrap items-center gap-4 text-sm ${currentTheme.cardText}`}>
            <span>作者：{currentKnowledge.author}</span>
            <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{currentKnowledge.views}</span>
            <span className="flex items-center gap-1"><Heart className="w-4 h-4" />{currentKnowledge.likes}</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{currentKnowledge.createdAt}</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {currentKnowledge.tags.map(tag => <Badge key={tag} variant="secondary" className="rounded-lg">{tag}</Badge>)}
          </div>
        </div>

        <div className={`p-4 rounded-xl border ${currentTheme.border} mb-6 flex items-center justify-between`}>
          <div>
            <p className={`text-sm ${currentTheme.cardText}`}>信息来源</p>
            <p className="font-medium">{currentKnowledge.source.name}</p>
          </div>
        </div>

        <article className={`prose max-w-none p-6 rounded-2xl ${currentTheme.card} shadow-sm mb-6`}>
          {renderContent(currentKnowledge.content)}
        </article>

        <div className={`p-4 rounded-xl ${currentTheme.card} shadow-sm mb-6`}>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleFavorite} variant={isFavorited ? 'default' : 'outline'} className={`rounded-xl ${isFavorited ? 'bg-orange-500 hover:bg-orange-600' : ''}`}>
              <Heart className={`w-4 h-4 mr-2 ${isFavorited ? 'fill-current' : ''}`} />{isFavorited ? '已收藏' : '收藏'}
            </Button>
            <Button
