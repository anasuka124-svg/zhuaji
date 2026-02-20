'use client';

import { KnowledgeArticle, PET_CATEGORIES, SOURCE_TYPES } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Heart, Clock, ChevronRight } from 'lucide-react';

interface KnowledgeCardProps {
  article: KnowledgeArticle;
  onClick: () => void;
}

export function KnowledgeCard({ article, onClick }: KnowledgeCardProps) {
  const category = PET_CATEGORIES[article.category];
  const source = SOURCE_TYPES[article.source];

  return (
    <Card 
      className="group cursor-pointer hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden"
      onClick={onClick}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {category.icon} {category.label}
            </Badge>
            <Badge className={`text-xs ${source.color}`}>
              {source.label}
            </Badge>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mt-2 line-clamp-2 group-hover:text-orange-500 transition-colors">
          {article.title}
        </h3>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {article.summary}
        </p>
        <div className="flex flex-wrap gap-1 mt-3">
          {article.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs text-gray-500 dark:text-gray-400">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex items-center justify-between border-t border-gray-50 dark:border-gray-800 mt-2">
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            {article.views.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="h-3.5 w-3.5" />
            {article.likes}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {article.publishedAt}
          </span>
        </div>
        <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-600">
          阅读更多
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
}
