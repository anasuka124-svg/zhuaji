'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/store';
import { PET_CATEGORIES, SOURCE_TYPES } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ChevronLeft, 
  Eye, 
  Heart, 
  Clock, 
  User, 
  ExternalLink,
  MessageSquarePlus,
  AlertCircle,
  ThumbsUp
} from 'lucide-react';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function KnowledgeDetailPage() {
  const { selectedKnowledge, setSelectedKnowledge, knowledgeArticles, currentUser } = useAppStore();
  const [submitType, setSubmitType] = useState<'supplement' | 'correction'>('supplement');
  const [submitContent, setSubmitContent] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!selectedKnowledge) return null;

  const category = PET_CATEGORIES[selectedKnowledge.category];
  const source = SOURCE_TYPES[selectedKnowledge.source];

  // 相关推荐
  const relatedArticles = knowledgeArticles
    .filter(a => a.id !== selectedKnowledge.id && a.category === selectedKnowledge.category)
    .slice(0, 3);

  const handleSubmit = () => {
    if (submitContent.trim()) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setSubmitContent('');
      }, 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-6 max-w-4xl"
    >
      {/* 返回按钮 */}
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => setSelectedKnowledge(null)}
      >
        <ChevronLeft className="h-5 w-5 mr-1" />
        返回列表
      </Button>

      <article>
        {/* 文章头部 */}
        <header className="mb-6">
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="secondary">
              {category.icon} {category.label}
            </Badge>
            <Badge className={source.color}>
              {source.label}
            </Badge>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            {selectedKnowledge.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {selectedKnowledge.author}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {selectedKnowledge.publishedAt}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {selectedKnowledge.views.toLocaleString()} 阅读
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              {selectedKnowledge.likes} 点赞
            </span>
          </div>

          {/* 标签 */}
          <div className="flex flex-wrap gap-1 mt-4">
            {selectedKnowledge.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </header>

        {/* 文章内容 */}
        <Card className="mb-6">
          <CardContent className="prose dark:prose-invert max-w-none p-6">
            <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
              {selectedKnowledge.content}
            </div>
          </CardContent>
        </Card>

        {/* 来源链接 */}
        {selectedKnowledge.sourceUrl && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">来源</p>
                  <p className="font-medium text-gray-700 dark:text-gray-300">
                    {selectedKnowledge.sourceName}
                  </p>
                </div>
                <a
                  href={selectedKnowledge.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-500 hover:text-orange-600 flex items-center gap-1"
                >
                  查看原文
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 补充/纠错提交 */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">
              发现问题或有补充？
            </h3>
            <div className="flex flex-wrap gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <MessageSquarePlus className="h-4 w-4" />
                    补充内容
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>补充内容</DialogTitle>
                    <DialogDescription>
                      你要补充的内容将经过审核后显示。
                    </DialogDescription>
                  </DialogHeader>
                  <Textarea
                    value={submitContent}
                    onChange={(e) => setSubmitContent(e.target.value)}
                    placeholder="请输入你要补充的内容..."
                    className="min-h-32"
                  />
                  <DialogFooter>
                    <Button 
                      onClick={handleSubmit}
                      disabled={!submitContent.trim() || submitted}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      {submitted ? '提交成功！' : '提交'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    纠错
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>提交纠错</DialogTitle>
                    <DialogDescription>
                      感谢你的反馈！我们会认真审核并修正。
                    </DialogDescription>
                  </DialogHeader>
                  <Textarea
                    value={submitContent}
                    onChange={(e) => setSubmitContent(e.target.value)}
                    placeholder="请描述需要纠错的内容..."
                    className="min-h-32"
                  />
                  <DialogFooter>
                    <Button 
                      onClick={handleSubmit}
                      disabled={!submitContent.trim() || submitted}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      {submitted ? '提交成功！' : '提交'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* 相关推荐 */}
        {relatedArticles.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">
              相关推荐
            </h3>
            <div className="grid gap-4 sm:grid-cols-3">
              {relatedArticles.map((article) => (
                <Card 
                  key={article.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedKnowledge(article)}
                >
                  <CardContent className="p-4">
                    <h4 className="font-medium text-gray-700 dark:text-gray-200 line-clamp-2 hover:text-orange-500">
                      {article.title}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                      {article.summary}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </article>
    </motion.div>
  );
}
