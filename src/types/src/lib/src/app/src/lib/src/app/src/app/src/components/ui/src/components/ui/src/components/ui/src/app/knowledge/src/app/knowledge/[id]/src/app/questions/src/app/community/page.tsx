'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Eye, Heart, MessageCircle, Clock, Plus, User, Sun, Moon, Send, AlertCircle, Check } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function CommunityPage() {
  const { theme, setTheme, posts, user, isLoggedIn, addPost } = useStore();
  const [showSubmit, setShowSubmit] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', tags: '' });

  const themeStyles: Record<string, any> = {
    light: { background: 'bg-white', text: 'text-gray-800', card: 'bg-gray-50', cardText: 'text-gray-600', border: 'border-gray-200' },
    dark: { background: 'bg-gray-900', text: 'text-gray-100', card: 'bg-gray-800', cardText: 'text-gray-300', border: 'border-gray-700' },
    warm: { background: 'bg-orange-50', text: 'text-gray-800', card: 'bg-orange-100/50', cardText: 'text-gray-600', border: 'border-orange-200' },
    fresh: { background: 'bg-emerald-50', text: 'text-gray-800', card: 'bg-emerald-100/50', cardText: 'text-gray-600', border: 'border-emerald-200' }
  };
  const currentTheme = themeStyles[theme];

  const approvedPosts = posts.filter(p => p.status === 'approved');

  const toggleTheme = () => {
    const themes = ['light', 'dark', 'warm', 'fresh'] as const;
    setTheme(themes[(themes.indexOf(theme) + 1) % themes.length]);
  };

  const handleSubmit = () => {
    if (!isLoggedIn) { alert('请先登录'); return; }
    if (!newPost.title || !newPost.content) { alert('请填写标题和内容'); return; }
    addPost({ title: newPost.title, content: newPost.content, images: [], tags: newPost.tags.split(',').map(t => t.trim()).filter(Boolean) });
    setNewPost({ title: '', content: '', tags: '' });
    setShowSubmit(false);
    alert('提交成功，等待审核');
  };

  return (
    <div className={`min-h-screen ${currentTheme.background} ${currentTheme.text}`}>
      <header className={`sticky top-0 z-50 ${currentTheme.background} border-b ${currentTheme.border} px-4 py-3`}>
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/" className={`p-2 rounded-xl ${currentTheme.card}`}><ArrowLeft className="w-5 h-5" /></Link>
          <div className="flex-1">
            <h1 className="font-bold text-lg">社区交流</h1>
            <p className={`text-xs ${currentTheme.cardText}`}>与养宠人分享交流</p>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme} className={`rounded-xl ${currentTheme.card}`}>
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          <Link href="/user"><Button variant="ghost" size="icon" className={`rounded-xl ${currentTheme.card}`}><User className="w-5 h-5" /></Button></Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <Button onClick={() => setShowSubmit(!showSubmit)} className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-white mb-6 py-6">
          <Plus className="w-5 h-5 mr-2" />发布新帖
        </Button>

        {showSubmit && (
          <div className={`p-6 rounded-2xl ${currentTheme.card} shadow-sm mb-6 space-y-4`}>
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">审核须知</p>
                  <p className="text-xs mt-1">禁止发布：黄赌毒、淫秽色情、与宠物无关的内容</p>
                </div>
              </div>
            </div>
            <input className={`w-full p-3 rounded-xl border ${currentTheme.border} bg-transparent`} placeholder="帖子标题" value={newPost.title} onChange={(e) => setNewPost({...newPost, title: e.target.value})} />
            <textarea className={`w-full p-3 rounded-xl border ${currentTheme.border} bg-transparent`} rows={6} placeholder="分享你的想法..." value={newPost.content} onChange={(e) => setNewPost({...newPost, content: e.target.value})} />
            <input className={`w-full p-3 rounded-xl border ${currentTheme.border} bg-transparent`} placeholder="标签（用逗号分隔）" value={newPost.tags} onChange={(e) => setNewPost({...newPost, tags: e.target.value})} />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowSubmit(false)}>取消</Button>
              <Button onClick={handleSubmit} className="bg-orange-500 hover:bg-orange-600 text-white"><Send className="w-4 h-4 mr-1" />提交审核</Button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {approvedPosts.map(post => (
            <div key={post.id} className={`p-5 rounded-2xl ${currentTheme.card} shadow-sm border border-gray-200/30 hover:shadow-md transition-all`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center"><User className="w-5 h-5 text-orange-500" /></div>
                <div>
                  <p className="font-medium">{post.author.name}</p>
                  <div className="flex items-center gap-2">
                    <Badge className="text-xs bg-green-100 text-green-700"><Check className="w-3 h-3 mr-0.5" />已认证</Badge>
                    <span className={`text-xs ${currentTheme.cardText}`}>{post.createdAt}</span>
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-base mb-2">{post.title}</h3>
              <p className={`text-sm ${currentTheme.cardText} line-clamp-3 whitespace-pre-line`}>{post.content}</p>
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {post.tags.map(tag => <Badge key={tag} variant="secondary" className="rounded-lg text-xs">#{tag}</Badge>)}
                </div>
              )}
              <div className={`flex items-center justify-between mt-4 pt-3 border-t ${currentTheme.border}`}>
                <div className="flex items-center gap-4">
                  <button className={`flex items-center gap-1 text-sm ${currentTheme.cardText} hover:text-orange-500`}><Heart className="w-4 h-4" />{post.likes}</button>
                  <button className={`flex items-center gap-1 text-sm ${currentTheme.cardText} hover:text-orange-500`}><MessageCircle className="w-4 h-4" />{post.comments}</button>
                </div>
                <span className={`text-xs ${currentTheme.cardText} opacity-60`}><Eye className="w-3.5 h-3.5 inline mr-1" />阅读</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
