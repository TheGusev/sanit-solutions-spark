import { useEffect, useState, useCallback } from "react";

export const useParallax = (speed: number = 0.5, enabled: boolean = true) => {
  const [offset, setOffset] = useState(0);

  const handleScroll = useCallback(() => {
    if (typeof window !== 'undefined') {
      setOffset(window.scrollY * speed);
    }
  }, [speed]);

  useEffect(() => {
    // SSR guard: no window/scroll in Node.js
    if (import.meta.env.SSR || !enabled || typeof window === 'undefined') return;
    
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [enabled, handleScroll]);

  return enabled ? offset : 0;
};
