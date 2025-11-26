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
    <section ref={sectionRef} className="py-16 bg-gradient-hero">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center text-white drop-shadow-md animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-white/20 flex items-center justify-center">
                <stat.icon className="w-8 h-8" />
              </div>
              <div className="text-5xl md:text-6xl font-bold mb-2">
                {stat.suffix === "%" 
                  ? counts[index].toFixed(1) 
                  : Math.floor(counts[index])}
                {stat.suffix}
              </div>
              <div className="text-lg md:text-xl text-white/90">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;
