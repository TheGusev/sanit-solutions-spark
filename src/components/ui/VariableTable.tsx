import { getPageVariation, tableStyles } from '@/lib/contentVariations';

interface Column {
  header: string;
  key: string;
}

interface VariableTableProps {
  slug: string;
  columns: Column[];
  data: Record<string, any>[];
  className?: string;
}

export function VariableTable({ slug, columns, data, className = '' }: VariableTableProps) {
  const variation = getPageVariation(slug);
  const styles = tableStyles[variation.tableStyle];
  
  return (
    <div className={`${styles.wrapper} ${className}`}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={styles.th}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              {columns.map((col) => (
                <td key={col.key} className={styles.td}>{row[col.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
