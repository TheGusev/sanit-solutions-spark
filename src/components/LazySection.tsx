import { useRef, useState, useEffect, type ReactNode } from 'react';

// Detect SSR via Vite's built-in flag (polyfills in entry-server.tsx make typeof window unreliable)
const isSSR = !!(import.meta as any).env?.SSR;

interface LazySectionProps {
  children: ReactNode;
  rootMargin?: string;
  className?: string;
  minHeight?: string;
}

export default function LazySection({ children, rootMargin = '200px', className, minHeight = '100px' }: LazySectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  // During SSR, render children immediately for full content in pre-rendered HTML
  const [visible, setVisible] = useState(isSSR);

  useEffect(() => {
    if (isSSR || visible) return;
    
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, visible]);

  return (
    <div ref={ref} className={className} style={visible ? undefined : { minHeight }}>
      {visible ? children : null}
    </div>
  );
}
