/**
 * Переиспользуемый компонент для фоновых изображений с blur-эффектом
 * Оптимизирован: один div вместо дублированных mobile/desktop
 */

interface HeroBackgroundProps {
  image: string;
  blur?: number;
  blurMobile?: number;
  opacity?: number;
  opacityMobile?: number;
  overlay?: 'light' | 'dark' | 'gradient' | 'none';
  altText?: string;
  className?: string;
}

const HeroBackground = ({ 
  image, 
  blur = 4, 
  blurMobile,
  opacity = 0.55,
  opacityMobile,
  overlay = 'gradient',
  altText = 'Фоновое изображение',
  className = ''
}: HeroBackgroundProps) => {
  const mobileBlur = blurMobile ?? Math.max(blur - 1, 2);
  const mobileOpacity = opacityMobile ?? Math.min(opacity + 0.10, 0.75);

  // Unique ID for scoped CSS
  const styleId = `hero-bg-${blur}-${mobileBlur}`;

  return (
    <>
      {/* Базовая цветовая подложка */}
      <div className={`absolute inset-0 bg-primary/5 ${className}`} aria-hidden="true" />
      
      {/* Scoped responsive styles — single element, no duplication */}
      <style dangerouslySetInnerHTML={{ __html: `
        .${styleId} {
          filter: blur(${mobileBlur}px);
          opacity: ${mobileOpacity};
        }
        @media (min-width: 768px) {
          .${styleId} {
            filter: blur(${blur}px);
            opacity: ${opacity};
          }
        }
      `}} />
      
      {/* Single background div — responsive via CSS */}
      <div 
        className={`absolute inset-0 bg-cover bg-center ${styleId}`}
        style={{ 
          backgroundImage: `url('${image}')`,
        }}
        role="img"
        aria-label={altText}
      />
      
      {/* Overlay варианты */}
      {overlay === 'gradient' && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-background/20 to-background/15" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-transparent to-background/30" />
        </>
      )}
      
      {overlay === 'light' && (
        <div className="absolute inset-0 bg-background/50" />
      )}
      
      {overlay === 'dark' && (
        <div className="absolute inset-0 bg-background/70" />
      )}
    </>
  );
};

export default HeroBackground;
