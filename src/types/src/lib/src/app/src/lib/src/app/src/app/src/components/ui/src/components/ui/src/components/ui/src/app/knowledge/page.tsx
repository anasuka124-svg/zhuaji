'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ArrowLeft, Eye, Heart, User, Sun, Moon, Cat, Dog, Bird, Bug, Fish, Rabbit, PawPrint } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PetCategoryLabels, PetCategory } from '@/types';

const categoryIcons: Record<PetCategory, React.ReactNode> = {
  cat: <Cat className="w-4 h-4" />,
  dog: <Dog className="w-4 h-4" />,
  bird: <Bird className="w-4 h-4" />,
  reptile: <Bug className="w-4 h-4" />,
  small_mammal: <Rabbit className="w-4 h-4" />,
  aquatic: <Fish className="w-4 h-4" />,
  other: <PawPrint className="w-4 h-4" />
};

export default function KnowledgePage() {
  const { theme, setTheme, knowledge, selectedCategory, setSelectedCategory } = useStore();
  const [localSearch, setLocalSearch] = useState('');

  const themeStyles: Record<string, any> = {
    light: { background: 'bg-white', text: 'text-gray-800', card: 'bg-gray-50', cardText: 'text-gray-600', border: 'border-gray-200' },
    dark: { background: 'bg-gray-900', text: 'text-gray-100', card: 'bg-gray-800', cardText: 'text-gray-300', border: 'border-gray-700' },
    warm: { background: 'bg-orange-50', text: 'text-gray-800', card: 'bg-orange-100/50', cardText: 'text-gray-600', border: 'border-orange-200' },
    fresh: { background: 'bg-emerald-50', text: 'text-gray-800', card: 'bg-emerald-100/50', cardText: 'text-gray-600', border: 'border-emerald-200' }
  };
  const currentTheme = themeStyles[theme];

  const filteredKnowledge = knowledge.filter(k => {
    const matchCategory = selectedCategory === 'all' || k.category === selectedCategory;
    const matchSearch = !localSearch.trim() || 
      k.title.toLowerCase().includes(localSearch.toLowerCase()) ||
      k.summary.toLowerCase().includes(localSearch.toLowerCase());
    return matchCategory && matchSearch;
  });

  const categoryCount = (cat: PetCategory) => knowledge.filter(k => k.category === cat).length;

  const toggleTheme = () => {
    const themes = ['light', 'dark', 'warm', 'fresh'] as const;
    const idx = themes.indexOf(theme);
    setTheme(themes[(idx + 1) % themes.length]);
  };

  return (
    <div className={`min-h-screen ${currentTheme.background} ${currentTheme.text}`}>
      <header className={`sticky top-0 z-50 ${currentTheme.background} border-b ${currentTheme.border} px-4 py-3`}>
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link href="/" className={`p-2 rounded-xl ${currentTheme.card}`}><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="font-bold text-lg flex-1">知识库</h1>
          <Button variant="ghost" size="icon" onClick={toggleTheme} className={`rounded-xl ${currentTheme.card}`}>
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          <Link href="/user"><Button variant="ghost" size="icon" className={`rounded-xl ${currentTheme.card}`}><User className="w-5 h-5" /></Button></Link>
        </div>
      </header>

      <div className="px-4 py-4 border-b border-gray-200/50">
        <div className="max-w-6xl mx-auto">
          <div className={`flex items-center gap-2 p-2 rounded-xl ${currentTheme.card} shadow-sm`}>
            <Input type="text" placeholder="搜索宠物知识..." value={localSearch} onChange={(e) => setLocalSearch(e.target.value)} className="flex-1 border-0 bg-transparent focus:ring-0" />
            <Button className="rounded-lg bg-orange-500 hover:bg-orange-600 text-white px-4"><Search className="w-4 h-4" /></Button>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 overflow-x-auto">
        <div className="max-w-6xl mx-auto flex gap-2 min-w-max">
          <Button onClick={() => setSelectedCategory('all')} variant={selectedCategory === 'all' ? 'default' : 'outline'} className={`rounded-xl ${selectedCategory === 'all' ? 'bg-orange-500 hover:bg-orange-600 text-white' : ''}`}>
            全部 ({knowledge.length})
          </Button>
          {(Object.keys(PetCategoryLabels) as PetCategory[]).map(cat => (
            <Button key={cat} onClick={() => setSelectedCategory(cat)} variant={selectedCategory === cat ? 'default' : 'outline'} className={`rounded-xl flex items-center gap-1.5 ${selectedCategory === cat ? 'bg-orange-500 hover:bg-orange-600 text-white' : ''}`}>
              {categoryIcons[cat]}{PetCategoryLabels[cat]} ({categoryCount(cat)})
            </Button>
          ))}
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredKnowledge.map((item) => (
            <Link key={item.id} href={`/knowledge/${item.id}`} className={`block p-5 rounded-2xl ${currentTheme.card} shadow-sm hover:shadow-lg transition-all border border-gray-200/30`}>
              <div className="flex items-center justify-between mb-3">
                <Badge variant="outline" className="rounded-lg">{categoryIcons[item.category]}<span className="ml-1">{PetCategoryLabels[item.category]}</span></Badge>
              </div>
              <h3 className="font-bold text-base mb-2 line-clamp-2">{item.title}</h3>
              <p className={`text-sm ${currentTheme.cardText} line-clamp-2 mb-3`}>{item.summary}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {item.tags.slice(0, 3).map(tag => <Badge key={tag} variant="secondary" className="rounded-lg text-xs">{tag}</Badge>)}
              </div>
              <div className={`flex items-center justify-between text-xs ${currentTheme.cardText} opacity-70`}>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{item.views}</span>
                  <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" />{item.likes}</span>
                </div>
                <span>来源：{item.source.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
