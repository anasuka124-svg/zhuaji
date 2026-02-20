'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store';

export function SearchBar() {
  const { searchQuery, setSearchQuery, setCurrentPage } = useAppStore();
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setCurrentPage('knowledge');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div 
        className={`
          relative flex items-center gap-2 p-2 
          bg-white dark:bg-gray-800 
          rounded-2xl 
          transition-all duration-300
          ${isFocused 
            ? 'shadow-lg ring-2 ring-orange-200 dark:ring-orange-800' 
            : 'shadow-md hover:shadow-lg'
          }
        `}
      >
        <Search className="h-5 w-5 text-gray-400 ml-2" />
        <Input
          type="text"
          placeholder="搜索宠物知识..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          className="flex-1 border-0 bg-transparent focus:ring-0 focus:outline-none text-gray-700 dark:text-gray-200 placeholder:text-gray-400"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-gray-600"
            onClick={() => setSearchQuery('')}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-6"
          onClick={handleSearch}
        >
          搜索
        </Button>
      </div>
      
      {/* 热门搜索 */}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <span className="text-sm text-gray-400">热门搜索：</span>
        {['猫咪饲养', '狗狗训练', '新手养鱼', '鹦鹉说话', '仓鼠'].map((tag) => (
          <button
            key={tag}
            onClick={() => {
              setSearchQuery(tag);
              setCurrentPage('knowledge');
            }}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
