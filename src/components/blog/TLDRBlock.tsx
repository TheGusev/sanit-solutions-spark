import { Zap } from "lucide-react";

interface TLDRBlockProps {
  items: string[];
}

const TLDRBlock = ({ items }: TLDRBlockProps) => {
  if (!items || items.length === 0) return null;

  return (
    <section className="my-6 md:my-8 mx-auto max-w-3xl">
      <div className="border-l-4 border-primary bg-muted/50 rounded-r-lg p-5 md:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Кратко</h2>
        </div>
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-muted-foreground text-base leading-relaxed">
              <span className="text-primary mt-1.5 text-xs">●</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default TLDRBlock;
