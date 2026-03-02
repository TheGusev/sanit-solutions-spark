import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Target } from 'lucide-react';

interface MVTStat {
  test_name: string;
  intent: string;
  variant_id: string;
  sessions_count: number;
  conversions_count: number;
  revenue_sum: number;
  conversion_rate: number;
}

/**
 * Component for displaying Multi-Variant Test (MVT) statistics
 * Shows conversion rates, sessions, and revenue for all variants
 * Supports 2+ variants dynamically
 * Intended for admin use only
 */
export function ABTestStats() {
  const [stats, setStats] = useState<MVTStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data, error: fetchError } = await supabase
          .from('ab_test_stats')
          .select('*')
          .order('test_name', { ascending: true })
          .order('intent', { ascending: true })
          .order('variant_id', { ascending: true });

        if (fetchError) throw fetchError;

        // Calculate conversion rate
        const statsWithRate = (data || []).map(stat => ({
          ...stat,
          conversion_rate: stat.sessions_count > 0 
            ? stat.conversions_count / stat.sessions_count 
            : 0
        }));

        setStats(statsWithRate);
      } catch (err) {
        console.error('Error fetching MVT stats:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Multi-Variant Test Statistics</CardTitle>
            <CardDescription>Loading test results...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Multi-Variant Test Statistics</CardTitle>
            <CardDescription className="text-destructive">
              Error loading stats: {error.message}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Group stats by test_name and intent
  const groupedStats = stats.reduce((acc, stat) => {
    const key = `${stat.test_name}_${stat.intent}`;
    if (!acc[key]) {
      acc[key] = {
        test_name: stat.test_name,
        intent: stat.intent,
        variants: []
      };
    }
    acc[key].variants.push(stat);
    return acc;
  }, {} as Record<string, { test_name: string; intent: string; variants: MVTStat[] }>);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            Multi-Variant Test Statistics
          </CardTitle>
          <CardDescription>
            Real-time performance metrics for all active tests (supports 2+ variants)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {Object.values(groupedStats).length === 0 ? (
            <p className="text-muted-foreground">No test data available yet.</p>
          ) : (
            <div className="space-y-8">
              {Object.values(groupedStats).map(group => {
                const totalSessions = group.variants.reduce((sum, v) => sum + v.sessions_count, 0);
                const explorationThreshold = 50 * group.variants.length;
                const isExplorationPhase = totalSessions < explorationThreshold;
                
                // Find leader by conversion rate
                const sortedByRate = [...group.variants].sort((a, b) => 
                  b.conversion_rate - a.conversion_rate
                );
                const leader = sortedByRate[0];

                return (
                  <Card key={`${group.test_name}_${group.intent}`} className="border-2">
                    <CardHeader>
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Target className="h-5 w-5" />
                            {group.test_name}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <Users className="h-4 w-4" />
                            Intent: <span className="font-medium">{group.intent}</span>
                            <span className="text-muted-foreground">
                              • {group.variants.length} variants
                            </span>
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant={isExplorationPhase ? "secondary" : "default"}>
                            {isExplorationPhase 
                              ? `Exploration (${totalSessions}/${explorationThreshold})` 
                              : 'Exploitation'}
                          </Badge>
                          <Badge variant="outline">
                            {totalSessions} total sessions
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {sortedByRate.map((variant, index) => {
                          const isLeader = index === 0;
                          const rank = index + 1;
                          
                          return (
                            <Card 
                              key={variant.variant_id} 
                              className={isLeader ? 'border-primary border-2' : ''}
                            >
                              <CardHeader>
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-base">
                                    Variant {variant.variant_id}
                                  </CardTitle>
                                  {isLeader && (
                                    <Badge variant="default">🏆 Leader</Badge>
                                  )}
                                  {rank === 2 && (
                                    <Badge variant="secondary">2nd</Badge>
                                  )}
                                  {rank === 3 && (
                                    <Badge variant="outline">3rd</Badge>
                                  )}
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Sessions:</span>
                                  <span className="font-medium">{variant.sessions_count}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Conversions:</span>
                                  <span className="font-medium">{variant.conversions_count}</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold">
                                  <span className="text-muted-foreground">Conv. Rate:</span>
                                  <span className={isLeader ? 'text-primary' : ''}>
                                    {(variant.conversion_rate * 100).toFixed(2)}%
                                  </span>
                                </div>
                                {variant.revenue_sum > 0 && (
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Revenue:</span>
                                    <span className="font-medium">
                                      {variant.revenue_sum.toLocaleString('ru-RU')} ₽
                                    </span>
                                  </div>
                                )}
                                {/* Relative performance bar */}
                                {leader.conversion_rate > 0 && (
                                  <div className="mt-3">
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                      <div 
                                        className={`h-full ${isLeader ? 'bg-primary' : 'bg-muted-foreground'}`}
                                        style={{ 
                                          width: `${(variant.conversion_rate / leader.conversion_rate) * 100}%` 
                                        }}
                                      />
                                    </div>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
