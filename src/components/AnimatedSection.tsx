import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useParallax } from "@/hooks/useParallax";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: "fade-up" | "fade-left" | "fade-right" | "scale" | "none";
  parallax?: boolean;
  parallaxSpeed?: number;
  delay?: number;
}

const AnimatedSection = ({
  children,
  className,
  animation = "fade-up",
  parallax = false,
  parallaxSpeed = 0.1,
  delay = 0
}: AnimatedSectionProps) => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const parallaxOffset = useParallax(parallaxSpeed);

  const animationClasses = {
    "fade-up": "translate-y-10 opacity-0",
    "fade-left": "-translate-x-10 opacity-0",
    "fade-right": "translate-x-10 opacity-0",
    "scale": "scale-95 opacity-0",
    "none": ""
  };

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        !isVisible && animationClasses[animation],
        isVisible && "translate-y-0 translate-x-0 scale-100 opacity-100",
        className
      )}
      style={{
        transitionDelay: `${delay}ms`,
        ...(parallax && { transform: `translateY(${parallaxOffset}px)` })
      }}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
