import { cn } from "@/lib/utils";

interface ComparisonTableProps {
  headers: string[];
  rows: Record<string, string>[];
  caption: string;
  className?: string;
}

const ComparisonTable = ({ headers, rows, caption, className }: ComparisonTableProps) => {
  if (!headers.length || !rows.length) return null;

  return (
    <figure className={cn("my-6 md:my-8 mx-auto max-w-3xl", className)}>
      <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
        <table className="w-full border-collapse text-sm md:text-base">
          <caption className="mb-3 text-left text-base font-semibold text-foreground">
            {caption}
          </caption>
          <thead>
            <tr className="border-b-2 border-border bg-muted/50">
              {headers.map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-3 py-2.5 text-left font-semibold text-foreground whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className="border-b border-border transition-colors hover:bg-muted/30"
              >
                {headers.map((header) => (
                  <td key={header} className="px-3 py-2.5 text-muted-foreground">
                    {row[header] ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
};

export default ComparisonTable;
