import { Zap } from "lucide-react";

interface TLDRBlockProps {
  items: string[];
}

const TLDRBlock = ({ items }: TLDRBlockProps) => {
  if (!items || items.length === 0) return null;

  return (
    <section className="my-6 md:my-8 mx-auto max-w-3xl">
      <div className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-400 rounded-r-lg p-5 md:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-bold text-foreground">Кратко</h2>
        </div>
        <div className="space-y-2">
          {items.map((item, i) => (
            <p key={i} className="text-muted-foreground text-base leading-relaxed">
              {item}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TLDRBlock;
