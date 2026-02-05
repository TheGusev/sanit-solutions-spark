/**
 * Переиспользуемый компонент для фоновых изображений с blur-эффектом
 * Используется в Hero-секциях по всему сайту
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
  blur = 8, 
  blurMobile,
  opacity = 0.30,
  opacityMobile,
  overlay = 'gradient',
  altText = 'Фоновое изображение',
  className = ''
}: HeroBackgroundProps) => {
  // Мобильные значения: по умолчанию более яркие
  const mobileBlur = blurMobile ?? Math.max(blur - 2, 3);
  const mobileOpacity = opacityMobile ?? Math.min(opacity + 0.15, 0.70);

  return (
    <>
      {/* Базовая цветовая подложка */}
      <div className={`absolute inset-0 bg-primary/5 ${className}`} aria-hidden="true" />
      
      {/* Мобильная версия: более яркий и менее размытый фон */}
      <div 
        className="absolute inset-0 bg-cover bg-center md:hidden"
        style={{ 
          backgroundImage: `url('${image}')`,
          filter: `blur(${mobileBlur}px)`,
          transform: 'scale(1.1)',
          opacity: mobileOpacity
        }}
        role="img"
        aria-label={altText}
      />
      
      {/* Desktop версия */}
      <div 
        className="absolute inset-0 bg-cover bg-center hidden md:block"
        style={{ 
          backgroundImage: `url('${image}')`,
          filter: `blur(${blur}px)`,
          transform: 'scale(1.1)',
          opacity
        }}
        role="img"
        aria-label={altText}
      />
      
      {/* Overlay варианты */}
      {overlay === 'gradient' && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-background/40 to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/50" />
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
