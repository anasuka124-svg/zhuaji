'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store';
import { PET_CATEGORIES, PetCategory } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  ChevronLeft, 
  Heart, 
  Bookmark, 
  Search, 
  Plus,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function QuestionsPage() {
  const { 
    questions, 
    toggleQuestionLike, 
    toggleQuestionFavorite 
  } = useAppStore();
  
  const [selectedCategory, setSelectedCategory] = useState<PetCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState({ title: '', description: '', category: 'cat' as PetCategory });
  const [submitted, setSubmitted] = useState(false);

  // 过滤问题
  const filteredQuestions = questions.filter((q) => {
    const matchesCategory = selectedCategory === 'all' || q.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories: { key: PetCategory | 'all'; label: string; icon: string }[] = [
    { key: 'all', label: '全部', icon: '🌟' },
    ...Object.entries(PET_CATEGORIES).map(([key, value]) => ({
      key: key as PetCategory,
      label: value.label,
      icon: value.icon,
    })),
  ];

  const handleSubmitQuestion = () => {
    if (newQuestion.title.trim() && newQuestion.description.trim()) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setNewQuestion({ title: '', description: '', category: 'cat' });
      }, 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-6"
    >
      {/* 页面标题 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            非常见问题
          </h1>
        </div>

        {/* 提交问题按钮 */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              分享问题
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>分享你的非常见问题</DialogTitle>
              <DialogDescription>
                你遇到的特殊养宠情况可能会帮助到其他人！
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                  问题标题
                </label>
                <Input
                  value={newQuestion.title}
                  onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                  placeholder="简要描述你的问题..."
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                  宠物类型
                </label>
                <Select 
                  value={newQuestion.category} 
                  onValueChange={(v) => setNewQuestion({ ...newQuestion, category: v as PetCategory })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PET_CATEGORIES).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value.icon} {value.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                  详细描述
                </label>
                <Textarea
                  value={newQuestion.description}
                  onChange={(e) => setNewQuestion({ ...newQuestion, description: e.target.value })}
                  placeholder="详细描述你遇到的情况..."
                  className="min-h-32"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleSubmitQuestion}
                disabled={!newQuestion.title.trim() || !newQuestion.description.trim() || submitted}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {submitted ? '提交成功！等待审核' : '提交'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="搜索问题..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
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

      {/* 问题列表 */}
      <div className="space-y-4">
        {filteredQuestions.map((question, index) => (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={question.author.avatar} />
                      <AvatarFallback>{question.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">
                        {question.author.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {question.createdAt}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {PET_CATEGORIES[question.category].icon} {PET_CATEGORIES[question.category].label}
                  </Badge>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mt-2">
                  {question.title}
                </h3>
              </CardHeader>
              
              <CardContent className="p-4 pt-0">
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  {question.description}
                </p>

                {/* 展开/收起解答 */}
                <div className="border-t border-gray-100 dark:border-gray-800 pt-3">
                  <button
                    onClick={() => setExpandedId(expandedId === question.id ? null : question.id)}
                    className="flex items-center gap-1 text-orange-500 hover:text-orange-600 text-sm font-medium"
                  >
                    {expandedId === question.id ? (
                      <>
                        <ChevronUp className="h-4 w-4" />
                        收起解答
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4" />
                        查看解答
                      </>
                    )}
                  </button>
                  
                  {expandedId === question.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
                    >
                      <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                        💡 参考解答
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                        {question.solution}
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* 标签和操作 */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex flex-wrap gap-1">
                    {question.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={question.isLiked ? 'text-red-500' : ''}
                      onClick={() => toggleQuestionLike(question.id)}
                    >
                      <Heart className={`h-4 w-4 mr-1 ${question.isLiked ? 'fill-current' : ''}`} />
                      {question.likes}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={question.isFavorited ? 'text-orange-500' : ''}
                      onClick={() => toggleQuestionFavorite(question.id)}
                    >
                      <Bookmark className={`h-4 w-4 ${question.isFavorited ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredQuestions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            没有找到相关的问题
          </p>
        </div>
      )}
    </motion.div>
  );
}
