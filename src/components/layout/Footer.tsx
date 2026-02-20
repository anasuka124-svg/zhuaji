'use client';

import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
            <img 
              src="/pet-mascot.png" 
              alt="Pet Knowledge" 
              className="w-6 h-6 rounded-full"
            />
            <span>宠物知识分享平台</span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <a href="#" className="hover:text-orange-500 transition-colors">关于我们</a>
            <a href="#" className="hover:text-orange-500 transition-colors">联系方式</a>
            <a href="#" className="hover:text-orange-500 transition-colors">隐私政策</a>
          </div>
          
          <div className="flex items-center gap-1 text-sm text-gray-400 dark:text-gray-500">
            <span>用</span>
            <Heart className="h-4 w-4 text-orange-500" />
            <span>制作</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
