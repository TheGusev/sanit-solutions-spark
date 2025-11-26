import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ABStats {
  sessions: number;
  conversions: number;
  conversion_rate: number;
}

export interface ABTestResult {
  variant: 'A' | 'B';
  confidence: number;
  winner_declared: boolean;
  stats: {
    A: ABStats;
    B: ABStats;
  };
}

/**
 * Хук для получения оптимального варианта A/B теста
 * Использует Thompson Sampling через ab-optimize Edge Function
 */
export function useABVariant(
  testName: string,
  intent: string | null,
  sessionId: string | null
) {
  const [result, setResult] = useState<ABTestResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Проверяем localStorage на существующий вариант для этой сессии
    const storageKey = `ab_variant_${testName}_${sessionId}`;
    const cached = sessionId ? localStorage.getItem(storageKey) : null;
    
    if (cached) {
      try {
        const cachedResult = JSON.parse(cached) as ABTestResult;
        setResult(cachedResult);
        setIsLoading(false);
        return;
      } catch (e) {
        console.warn('Failed to parse cached AB variant:', e);
      }
    }

    // Запрашиваем оптимальный вариант от ab-optimize
    async function fetchOptimalVariant() {
      try {
        const { data, error: invokeError } = await supabase.functions.invoke('ab-optimize', {
          body: {
            test_name: testName,
            intent: intent || 'default',
            session_id: sessionId
          }
        });

        if (invokeError) {
          throw invokeError;
        }

        if (!data) {
          throw new Error('No data returned from ab-optimize');
        }

        const abResult: ABTestResult = {
          variant: data.variant_id,
          confidence: data.confidence,
          winner_declared: data.winner_declared,
          stats: data.stats
        };

        setResult(abResult);
        
        // Сохраняем в localStorage для consistency в рамках сессии
        if (sessionId) {
          try {
            localStorage.setItem(storageKey, JSON.stringify(abResult));
          } catch (e) {
            console.warn('Failed to cache AB variant:', e);
          }
        }
      } catch (err) {
        console.error('Error fetching AB variant:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        
        // Fallback: случайный вариант при ошибке
        const fallbackResult: ABTestResult = {
          variant: Math.random() < 0.5 ? 'A' : 'B',
          confidence: 0.5,
          winner_declared: false,
          stats: {
            A: { sessions: 0, conversions: 0, conversion_rate: 0 },
            B: { sessions: 0, conversions: 0, conversion_rate: 0 }
          }
        };
        setResult(fallbackResult);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOptimalVariant();
  }, [testName, intent, sessionId]);

  return { result, isLoading, error };
}