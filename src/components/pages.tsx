'use client';

import { motion } from 'framer-motion';
import { Mascot } from '@/components/home/Mascot';
import { SearchBar } from '@/components/home/SearchBar';
import { useAppStore } from '@/store';

export function HomePage() {
  const { setCurrentPage } = useAppStore();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-4"
    >
      {/* 问候语 */}
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-2xl sm:text-3xl font-semibold text-gray-700 dark:text-gray-200 mb-8 text-center"
      >
        今天想查点什么？
      </motion.h1>

      {/* 吉祥物 */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <Mascot />
      </motion.div>

      {/* 搜索栏 */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-2xl"
      >
        <SearchBar />
      </motion.div>

      {/* 快捷入口 */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        {[
          { label: '知识库', icon: '📚', page: 'knowledge' as const },
          { label: '非常见问题', icon: '❓', page: 'questions' as const },
          { label: '社区', icon: '💬', page: 'community' as const },
          { label: '个人中心', icon: '👤', page: 'user' as const },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => setCurrentPage(item.page)}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-sm text-gray-600 dark:text-gray-300">{item.label}</span>
          </button>
        ))}
      </motion.div>
    </motion.div>
  );
}
