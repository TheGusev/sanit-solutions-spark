import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface LLMSummaryProps {
  bottomLine: string;
  price?: string;
  guarantee?: string;
  legalBasis?: string;
  className?: string;
}

const LLMSummary = ({ bottomLine, price, guarantee, legalBasis, className }: LLMSummaryProps) => {
  return (
    <aside
      aria-label="Краткий вывод"
      className={cn(
        "my-6 md:my-8 mx-auto max-w-3xl border-l-4 border-emerald-500 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 rounded-r-lg p-5 md:p-6 shadow-sm",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <strong className="text-lg font-bold text-foreground">Главный вывод</strong>
      </div>
      <p className="text-base text-foreground leading-relaxed mb-4">{bottomLine}</p>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
        {price && (
          <div className="flex gap-2">
            <dt className="font-semibold text-muted-foreground whitespace-nowrap">Цена:</dt>
            <dd className="text-foreground">{price}</dd>
          </div>
        )}
        {guarantee && (
          <div className="flex gap-2">
            <dt className="font-semibold text-muted-foreground whitespace-nowrap">Гарантия:</dt>
            <dd className="text-foreground">{guarantee}</dd>
          </div>
        )}
        {legalBasis && (
          <div className="flex gap-2 sm:col-span-2">
            <dt className="font-semibold text-muted-foreground whitespace-nowrap">Основание:</dt>
            <dd className="text-foreground">{legalBasis}</dd>
          </div>
        )}
      </dl>
    </aside>
  );
};

export default LLMSummary;
