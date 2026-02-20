'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store';
import { PET_CATEGORIES, PetCategory } from '@/types';
import { KnowledgeCard } from '@/components/knowledge/KnowledgeCard';
import { KnowledgeDetailPage } from './KnowledgeDetailPage';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, ChevronLeft } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function KnowledgePage() {
  const { 
    knowledgeArticles, 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery,
    selectedKnowledge,
    setSelectedKnowledge 
  } = useAppStore();
  
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  // 如果选中了知识文章，显示详情页
  if (selectedKnowledge) {
    return <KnowledgeDetailPage />;
  }

  // 过滤文章
  const filteredArticles = knowledgeArticles.filter((article) => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = !localSearch || 
      article.title.toLowerCase().includes(localSearch.toLowerCase()) ||
      article.summary.toLowerCase().includes(localSearch.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(localSearch.toLowerCase()));
    const matchesSource = sourceFilter === 'all' || article.source === sourceFilter;
    return matchesCategory && matchesSearch && matchesSource;
  });

  const categories: { key: PetCategory | 'all'; label: string; icon: string }[] = [
    { key: 'all', label: '全部', icon: '🌟' },
    ...Object.entries(PET_CATEGORIES).map(([key, value]) => ({
      key: key as PetCategory,
      label: value.label,
      icon: value.icon,
    })),
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-6"
    >
      {/* 页面标题 */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setSelectedCategory('all');
            setSearchQuery('');
          }}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          知识库
        </h1>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="搜索知识文章..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="来源筛选" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部来源</SelectItem>
            <SelectItem value="official">官方认证</SelectItem>
            <SelectItem value="expert">专家撰稿</SelectItem>
            <SelectItem value="community">社区精选</SelectItem>
            <SelectItem value="user">用户贡献</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 分类标签 */}
      <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <Button
            key={cat.key}
            variant={selectedCategory === cat.key ? 'default' : 'outline'}
            className={`rounded-full ${
              selectedCategory === cat.key 
                ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                : ''
            }`}
            onClick={() => setSelectedCategory(cat.key)}
          >
            {cat.icon} {cat.label}
          </Button>
        ))}
      </div>

      {/* 文章列表 */}
      {filteredArticles.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <KnowledgeCard
                article={article}
                onClick={() => setSelectedKnowledge(article)}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            没有找到相关的知识文章
          </p>
        </div>
      )}
    </motion.div>
  );
}
