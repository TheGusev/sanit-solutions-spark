import { useRef, useState, useEffect, type ReactNode } from 'react';

// Detect SSR: no window.IntersectionObserver or no document
const isSSR = typeof window === 'undefined' || typeof document === 'undefined';

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
