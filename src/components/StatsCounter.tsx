import { useEffect, useRef, useState } from "react";
import { Users, Ruler, CheckCircle, type LucideIcon } from "lucide-react";

interface Stat {
  target: number;
  suffix: string;
  label: string;
  icon: LucideIcon;
}

const stats: Stat[] = [
  { target: 500, suffix: "+", label: "Довольных клиентов", icon: Users },
  { target: 5000, suffix: "+", label: "м² обработано", icon: Ruler },
  { target: 99.9, suffix: "%", label: "Гарантия результата", icon: CheckCircle }
];

const StatsCounter = () => {
  const [counts, setCounts] = useState<number[]>(stats.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCounters();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateCounters = () => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;

    stats.forEach((stat, index) => {
      let currentStep = 0;
      const increment = stat.target / steps;

      const timer = setInterval(() => {
        currentStep++;
        const value = Math.min(increment * currentStep, stat.target);
        
        setCounts(prev => {
          const newCounts = [...prev];
          newCounts[index] = value;
          return newCounts;
        });

        if (currentStep >= steps) {
          clearInterval(timer);
        }
      }, interval);
    });
  };

  return (
    <section ref={sectionRef} className="py-16 gradient-hero">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex items-center gap-3 md:flex-col md:text-center text-white drop-shadow-md animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 md:w-16 md:h-16 md:mx-auto md:mb-3 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <stat.icon className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div>
                <div className="text-3xl md:text-5xl lg:text-6xl font-bold mb-1 md:mb-2">
                  {stat.suffix === "%" 
                    ? counts[index].toFixed(1) 
                    : Math.floor(counts[index])}
                  {stat.suffix}
                </div>
                <div className="text-sm md:text-lg lg:text-xl text-white/90">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;
