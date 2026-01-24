/**
 * Переиспользуемый компонент для фоновых изображений с blur-эффектом
 * Используется в Hero-секциях по всему сайту
 */

interface HeroBackgroundProps {
  image: string;
  blur?: number;
  opacity?: number;
  overlay?: 'light' | 'dark' | 'gradient' | 'none';
  altText?: string;
  className?: string;
}

const HeroBackground = ({ 
  image, 
  blur = 8, 
  opacity = 0.30,
  overlay = 'gradient',
  altText = 'Фоновое изображение',
  className = ''
}: HeroBackgroundProps) => {
  return (
    <>
      {/* Базовая цветовая подложка */}
      <div className={`absolute inset-0 bg-primary/5 ${className}`} aria-hidden="true" />
      
      {/* Фоновое изображение с blur */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
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
          <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-background/50 to-background/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/60" />
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
