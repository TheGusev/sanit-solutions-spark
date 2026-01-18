/**
 * === SEO DEV TOOLS ===
 * Компонент для отладки SEO в режиме разработки
 */

import { useEffect, useState } from 'react';
import { runSEOAudit, type SEOIssue } from '@/lib/seo';

export function SEODevTools() {
  const [issues, setIssues] = useState<SEOIssue[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    // Только в dev режиме
    if (import.meta.env.PROD) return;
    
    // Запуск аудита после загрузки страницы
    const timer = setTimeout(() => {
      const auditResults = runSEOAudit();
      setIssues(auditResults);
      
      // Лог в консоль
      console.group('🔍 SEO Audit:', window.location.pathname);
      auditResults.forEach(issue => {
        const icon = issue.type === 'error' ? '❌' : issue.type === 'warning' ? '⚠️' : '✅';
        const method = issue.type === 'error' ? 'error' : issue.type === 'warning' ? 'warn' : 'log';
        console[method](`${icon} ${issue.message}`);
      });
      console.groupEnd();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Не показывать в продакшене
  if (import.meta.env.PROD) return null;
  
  const errors = issues.filter(i => i.type === 'error').length;
  const warnings = issues.filter(i => i.type === 'warning').length;
  
  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      {/* Кнопка */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-2 rounded-lg text-sm font-medium shadow-lg ${
          errors > 0 
            ? 'bg-destructive text-destructive-foreground' 
            : warnings > 0 
              ? 'bg-yellow-500 text-white' 
              : 'bg-primary text-primary-foreground'
        }`}
      >
        🔍 SEO {errors > 0 ? `(${errors} ❌)` : warnings > 0 ? `(${warnings} ⚠️)` : '✓'}
      </button>
      
      {/* Панель */}
      {isOpen && (
        <div className="absolute bottom-12 right-0 w-80 bg-card border rounded-lg shadow-xl p-4 max-h-96 overflow-auto">
          <h4 className="font-bold mb-3">SEO Audit</h4>
          <div className="space-y-2">
            {issues.map((issue, idx) => (
              <div 
                key={idx}
                className={`text-sm p-2 rounded ${
                  issue.type === 'error' 
                    ? 'bg-destructive/10 text-destructive' 
                    : issue.type === 'warning' 
                      ? 'bg-yellow-500/10 text-yellow-700' 
                      : 'bg-primary/10 text-primary'
                }`}
              >
                {issue.type === 'error' ? '❌' : issue.type === 'warning' ? '⚠️' : '✅'} {issue.message}
              </div>
            ))}
            {issues.length === 0 && (
              <p className="text-muted-foreground text-sm">Загрузка...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SEODevTools;
