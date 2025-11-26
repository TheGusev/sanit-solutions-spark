import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface VariantStats {
  variant_id: string;
  sessions: number;
  conversions: number;
  conversion_rate: number;
}

export interface MVTTestResult {
  variant: string;
  confidence: number;
  winner_declared: boolean;
  total_variants: number;
  stats: Record<string, VariantStats>;
}

/**
 * Hook for Multi-Variant Testing (MVT)
 * Uses Thompson Sampling via mvt-optimize Edge Function
 * Supports 2+ variants (not limited to A/B)
 */
export function useMVTVariant(
  testName: string,
  intent: string | null,
  sessionId: string | null
) {
  const [result, setResult] = useState<MVTTestResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Check localStorage for existing variant for this session
    const storageKey = `mvt_variant_${testName}_${sessionId}`;
    const cached = sessionId ? localStorage.getItem(storageKey) : null;
    
    if (cached) {
      try {
        const cachedResult = JSON.parse(cached) as MVTTestResult;
        setResult(cachedResult);
        setIsLoading(false);
        return;
      } catch (e) {
        console.warn('Failed to parse cached MVT variant:', e);
      }
    }

    // Request optimal variant from mvt-optimize
    async function fetchOptimalVariant() {
      try {
        const { data, error: invokeError } = await supabase.functions.invoke('mvt-optimize', {
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
          throw new Error('No data returned from mvt-optimize');
        }

        const mvtResult: MVTTestResult = {
          variant: data.variant_id,
          confidence: data.confidence,
          winner_declared: data.winner_declared,
          total_variants: data.total_variants,
          stats: data.stats
        };

        setResult(mvtResult);
        
        // Cache in localStorage for session consistency
        if (sessionId) {
          try {
            localStorage.setItem(storageKey, JSON.stringify(mvtResult));
          } catch (e) {
            console.warn('Failed to cache MVT variant:', e);
          }
        }
      } catch (err) {
        console.error('Error fetching MVT variant:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        
        // Fallback: random variant
        const fallbackResult: MVTTestResult = {
          variant: Math.random() < 0.5 ? 'A' : 'B',
          confidence: 0.5,
          winner_declared: false,
          total_variants: 2,
          stats: {}
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
