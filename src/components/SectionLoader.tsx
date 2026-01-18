import { cn } from "@/lib/utils";

interface SectionLoaderProps {
  className?: string;
  variant?: "spinner" | "skeleton";
}

const SectionLoader = ({ className, variant = "spinner" }: SectionLoaderProps) => {
  if (variant === "skeleton") {
    return (
      <div className={cn("py-12 md:py-20", className)}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="skeleton h-8 w-48 mx-auto mb-3 rounded" />
            <div className="skeleton h-4 w-72 mx-auto rounded" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-64 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "py-12 flex items-center justify-center min-h-[200px]", 
        className
      )}
      role="status"
      aria-label="Загрузка"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="loading-spinner w-8 h-8 border-primary" />
        <span className="text-sm text-muted-foreground">Загрузка...</span>
      </div>
    </div>
  );
};

export default SectionLoader;