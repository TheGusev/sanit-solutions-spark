import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Target, DollarSign } from 'lucide-react';

interface ABTestStat {
  test_name: string;
  intent: string;
  variant_id: 'A' | 'B';
  sessions_count: number;
  conversions_count: number;
  revenue_sum: number;
  conversion_rate: number;
}

/**
 * Компонент для отображения статистики A/B тестирования
 * Только для админов
 */
export function ABTestStats() {
  const [stats, setStats] = useState<ABTestStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data, error: fetchError } = await supabase
          .from('ab_test_stats')
          .select('*')
          .order('test_name', { ascending: true })
          .order('intent', { ascending: true })
          .order('variant_id', { ascending: true });

        if (fetchError) {
          throw fetchError;
        }

        // Вычисляем conversion_rate для каждой записи
        const enrichedStats = (data || []).map(stat => ({
          test_name: stat.test_name,
          intent: stat.intent,
          variant_id: stat.variant_id as 'A' | 'B',
          sessions_count: stat.sessions_count,
          conversions_count: stat.conversions_count,
          revenue_sum: stat.revenue_sum,
          conversion_rate: stat.sessions_count > 0 
            ? (stat.conversions_count / stat.sessions_count) * 100 
            : 0
        }));

        setStats(enrichedStats);
      } catch (err) {
        console.error('Error fetching A/B stats:', err);
        setError(err instanceof Error ? err.message : 'Failed to load stats');
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>A/B Test Statistics</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>A/B Test Statistics</CardTitle>
          <CardDescription className="text-destructive">Error: {error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Группируем по test_name и intent
  const grouped = stats.reduce((acc, stat) => {
    const key = `${stat.test_name}_${stat.intent}`;
    if (!acc[key]) {
      acc[key] = { test_name: stat.test_name, intent: stat.intent, variants: [] };
    }
    acc[key].variants.push(stat);
    return acc;
  }, {} as Record<string, { test_name: string; intent: string; variants: ABTestStat[] }>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">A/B Test Statistics</h2>
          <p className="text-muted-foreground">Thompson Sampling optimization results</p>
        </div>
      </div>

      <div className="grid gap-4">
        {Object.values(grouped).map(({ test_name, intent, variants }) => {
          const variantA = variants.find(v => v.variant_id === 'A');
          const variantB = variants.find(v => v.variant_id === 'B');
          
          const totalSessions = (variantA?.sessions_count || 0) + (variantB?.sessions_count || 0);
          const totalConversions = (variantA?.conversions_count || 0) + (variantB?.conversions_count || 0);
          
          const winner = variantA && variantB
            ? variantA.conversion_rate > variantB.conversion_rate ? 'A' : 'B'
            : null;

          return (
            <Card key={`${test_name}_${intent}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{test_name}</CardTitle>
                    <CardDescription>Intent: {intent}</CardDescription>
                  </div>
                  <Badge variant={totalSessions >= 100 ? 'default' : 'secondary'}>
                    {totalSessions >= 100 ? 'Exploitation' : 'Exploration'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Variant A */}
                  {variantA && (
                    <div className={`p-4 rounded-lg border-2 ${winner === 'A' ? 'border-green-500 bg-green-50 dark:bg-green-950' : 'border-border'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-lg">Variant A</h4>
                        {winner === 'A' && <Badge variant="default">Winner</Badge>}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">Sessions: <strong>{variantA.sessions_count}</strong></span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">Conversions: <strong>{variantA.conversions_count}</strong></span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">Conv. Rate: <strong>{variantA.conversion_rate.toFixed(2)}%</strong></span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">Revenue: <strong>{variantA.revenue_sum.toLocaleString('ru-RU')} ₽</strong></span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Variant B */}
                  {variantB && (
                    <div className={`p-4 rounded-lg border-2 ${winner === 'B' ? 'border-green-500 bg-green-50 dark:bg-green-950' : 'border-border'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-lg">Variant B</h4>
                        {winner === 'B' && <Badge variant="default">Winner</Badge>}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">Sessions: <strong>{variantB.sessions_count}</strong></span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">Conversions: <strong>{variantB.conversions_count}</strong></span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">Conv. Rate: <strong>{variantB.conversion_rate.toFixed(2)}%</strong></span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">Revenue: <strong>{variantB.revenue_sum.toLocaleString('ru-RU')} ₽</strong></span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-sm text-muted-foreground pt-4 border-t">
                  <p>Total Sessions: <strong>{totalSessions}</strong> | Total Conversions: <strong>{totalConversions}</strong></p>
                  {totalSessions < 100 && (
                    <p className="text-amber-600 dark:text-amber-400 mt-1">
                      ⚠️ Still in exploration phase (need {100 - totalSessions} more sessions)
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {stats.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No A/B test data yet. Start sending traffic to see statistics.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}