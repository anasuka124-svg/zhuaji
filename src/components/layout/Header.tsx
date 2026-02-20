'use client';

import { useAppStore } from '@/store';
import { Sun, Moon, User, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const { isDarkMode, toggleDarkMode, isLoggedIn, currentUser, setCurrentPage, login, logout } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { key: 'home', label: '首页' },
    { key: 'knowledge', label: '知识库' },
    { key: 'questions', label: '非常见问题' },
    { key: 'community', label: '社区' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => setCurrentPage('home')}
        >
          <img 
            src="/pet-mascot.png" 
            alt="Pet Knowledge" 
            className="w-8 h-8 rounded-full"
          />
          <span className="font-semibold text-gray-800 dark:text-white hidden sm:block">
            宠物知识分享
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Button
              key={item.key}
              variant="ghost"
              className="text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400"
              onClick={() => setCurrentPage(item.key as 'home' | 'knowledge' | 'questions' | 'community')}
            >
              {item.label}
            </Button>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="text-gray-600 dark:text-gray-300"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* User Menu */}
          {isLoggedIn && currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                    <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{currentUser.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {currentUser.isPetOwner ? `已认证养宠人 (${currentUser.petCount}只)` : '已答题认证'}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setCurrentPage('user')}>
                  <User className="mr-2 h-4 w-4" />
                  个人中心
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="default"
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() => setCurrentPage('login')}
            >
              登录
            </Button>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
          <nav className="container mx-auto px-4 py-2 flex flex-col gap-1">
            {navItems.map((item) => (
              <Button
                key={item.key}
                variant="ghost"
                className="justify-start text-gray-600 dark:text-gray-300"
                onClick={() => {
                  setCurrentPage(item.key as 'home' | 'knowledge' | 'questions' | 'community');
                  setMobileMenuOpen(false);
                }}
              >
                {item.label}
              </Button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
