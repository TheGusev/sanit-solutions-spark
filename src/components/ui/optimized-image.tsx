import { cn } from "@/lib/utils";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Source path to the image */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Additional CSS classes */
  className?: string;
  /** Loading strategy - eager for above-fold, lazy for below-fold */
  loading?: 'lazy' | 'eager';
  /** Image width for CLS prevention */
  width?: number;
  /** Image height for CLS prevention */
  height?: number;
  /** Whether to try WebP version first */
  enableWebP?: boolean;
}

/**
 * OptimizedImage component with WebP fallback support
 * 
 * Uses <picture> element to serve WebP to supporting browsers
 * while falling back to original format for older browsers.
 * 
 * @example
 * <OptimizedImage 
 *   src="/images/pests/cockroach.png" 
 *   alt="Таракан" 
 *   loading="lazy"
 * />
 */
export function OptimizedImage({ 
  src, 
  alt, 
  className, 
  loading = 'lazy',
  width,
  height,
  enableWebP = true,
  ...props
}: OptimizedImageProps) {
  // Generate WebP path from original
  const webpSrc = enableWebP 
    ? src.replace(/\.(jpg|jpeg|png)$/i, '.webp')
    : null;
  
  // Check if WebP conversion makes sense (not already WebP, not SVG)
  const shouldUseWebP = enableWebP && 
    webpSrc && 
    !src.endsWith('.webp') && 
    !src.endsWith('.svg') &&
    !src.startsWith('data:');

  if (shouldUseWebP) {
    return (
      <picture>
        <source 
          srcSet={webpSrc} 
          type="image/webp" 
        />
        <img 
          src={src} 
          alt={alt} 
          className={cn(className)}
          loading={loading}
          width={width}
          height={height}
          decoding="async"
          {...props}
        />
      </picture>
    );
  }

  // Fallback to regular img for non-convertible formats
  return (
    <img 
      src={src} 
      alt={alt} 
      className={cn(className)}
      loading={loading}
      width={width}
      height={height}
      decoding="async"
      {...props}
    />
  );
}

export default OptimizedImage;
