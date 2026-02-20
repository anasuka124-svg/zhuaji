'use client';

import { motion } from 'framer-motion';

export function Mascot() {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative"
    >
      {/* 凸起嵌入式设计 */}
      <div className="relative w-32 h-32 sm:w-40 sm:h-40">
        {/* 外层阴影 - 凸起效果 */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 shadow-lg" />
        
        {/* 内层容器 */}
        <div className="absolute inset-2 rounded-2xl bg-white dark:bg-gray-900 shadow-inner flex items-center justify-center overflow-hidden">
          <motion.img
            src="/pet-mascot.png"
            alt="宠物知识吉祥物"
            className="w-24 h-24 sm:w-32 sm:h-32 object-contain"
            whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.3 }}
          />
        </div>
        
        {/* 高光效果 */}
        <div className="absolute inset-2 rounded-2xl bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />
      </div>
      
      {/* 装饰性圆点 */}
      <motion.div
        className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-orange-400"
        animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-1 -left-3 w-3 h-3 rounded-full bg-orange-300"
        animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
      />
    </motion.div>
  );
}
