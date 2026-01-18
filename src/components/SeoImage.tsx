import { cn } from "@/lib/utils";

interface SeoImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  decoding?: 'async' | 'sync' | 'auto';
}

/**
 * SEO-оптимизированный компонент изображения.
 * Обязательно требует alt, width и height для предотвращения CLS и улучшения доступности.
 */
const SeoImage = ({ 
  src, 
  alt, 
  width, 
  height, 
  className,
  loading = 'lazy',
  fetchPriority,
  decoding = 'async'
}: SeoImageProps) => {
  return (
    <img 
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn(className)}
      loading={loading}
      fetchPriority={fetchPriority}
      decoding={decoding}
    />
  );
};

export default SeoImage;
