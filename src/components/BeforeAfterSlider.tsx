import { useState, useRef, useEffect } from "react";
import type { LucideIcon } from "lucide-react";

interface BeforeAfterSliderProps {
  beforeEmoji: LucideIcon;
  afterEmoji: LucideIcon;
  beforeLabel?: string;
  afterLabel?: string;
}

const BeforeAfterSlider = ({ 
  beforeEmoji, 
  afterEmoji,
  beforeLabel = "ДО",
  afterLabel = "ПОСЛЕ"
}: BeforeAfterSliderProps) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    const bounded = Math.min(Math.max(percentage, 0), 100);
    setSliderPosition(bounded);
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-80 overflow-hidden rounded-lg select-none cursor-ew-resize bg-muted"
    >
      {/* После - полная ширина */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 flex flex-col items-center justify-center">
        {<afterEmoji className="w-32 h-32 mb-4 animate-fade-in text-green-600" />}
        <span className="bg-green-600 text-white px-4 py-2 rounded-full font-bold text-sm">
          {afterLabel}
        </span>
      </div>
      
      {/* До - обрезается по позиции слайдера */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 flex flex-col items-center justify-center"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        {<beforeEmoji className="w-32 h-32 mb-4 animate-fade-in text-red-600" />}
        <span className="bg-red-600 text-white px-4 py-2 rounded-full font-bold text-sm">
          {beforeLabel}
        </span>
      </div>
      
      {/* Divider */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize group"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform">
          <div className="flex gap-1">
            <div className="w-1 h-4 bg-primary"></div>
            <div className="w-1 h-4 bg-primary"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
