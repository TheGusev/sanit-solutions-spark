import { cn } from "@/lib/utils";

interface SkeletonLoaderProps {
  variant?: "text" | "title" | "image" | "card" | "avatar" | "button";
  className?: string;
  lines?: number;
}

const SkeletonLoader = ({ 
  variant = "text", 
  className,
  lines = 1 
}: SkeletonLoaderProps) => {
  const baseStyles = "skeleton animate-pulse";
  
  const variants = {
    text: "h-4 rounded",
    title: "h-6 w-3/4 rounded",
    image: "h-48 w-full rounded-lg",
    card: "h-64 w-full rounded-xl",
    avatar: "h-12 w-12 rounded-full",
    button: "h-10 w-32 rounded-md"
  };

  if (lines > 1) {
    return (
      <div className={cn("space-y-2", className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div 
            key={i} 
            className={cn(baseStyles, variants.text, {
              "w-full": i < lines - 1,
              "w-2/3": i === lines - 1
            })}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={cn(baseStyles, variants[variant], className)} />
  );
};

// Card skeleton for service cards
export const CardSkeleton = ({ className }: { className?: string }) => (
  <div className={cn("p-6 rounded-xl bg-card border border-border", className)}>
    <SkeletonLoader variant="image" className="mb-4" />
    <SkeletonLoader variant="title" className="mb-3" />
    <SkeletonLoader lines={3} />
    <div className="flex gap-2 mt-4">
      <SkeletonLoader variant="button" />
      <SkeletonLoader variant="button" className="w-24" />
    </div>
  </div>
);

// Section skeleton for lazy loaded sections
export const SectionSkeleton = ({ className }: { className?: string }) => (
  <div className={cn("py-12 md:py-20", className)}>
    <div className="container mx-auto px-4">
      <div className="text-center mb-8">
        <SkeletonLoader variant="title" className="mx-auto mb-2 w-1/3" />
        <SkeletonLoader variant="text" className="mx-auto w-2/3" />
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  </div>
);

export default SkeletonLoader;
