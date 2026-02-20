import { useState, useEffect, useRef } from 'react';

/**
 * 自定义 hook：跟踪组件是否已挂载
 * 避免在 useEffect 中直接调用 setState
 */
export function useMounted() {
  const mountedRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    mountedRef.current = true;
    // 使用 requestAnimationFrame 或 setTimeout 来延迟设置
    const timer = requestAnimationFrame(() => {
      if (mountedRef.current) {
        setMounted(true);
      }
    });
    return () => {
      mountedRef.current = false;
      cancelAnimationFrame(timer);
    };
  }, []);

  return mounted;
}
