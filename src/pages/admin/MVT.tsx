import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  RefreshCw, 
  Loader2, 
  Trophy,
  Eye,
  Target,
  TrendingUp
} from 'lucide-react';
import { copyMap } from '@/config/copyMap';

interface MVTArmParams {
  id: string;
  test_name: string;
  intent: string;
  variant_key: string;
  alpha: number;
  beta: number;
  impressions_count: number | null;
  conversions_count: number | null;
  revenue_sum: number | null;
}

interface MVTTestConfig {
  id: string;
  test_name: string;
  variants: string[];
  is_active: boolean | null;
  exploration_sessions_per_variant: number | null;
  confidence_threshold: number | null;
  winner_variant: string | null;
}

const AdminMVT = () => {
  const [armParams, setArmParams] = useState<MVTArmParams[]>([]);
  const [testConfigs, setTestConfigs] = useState<MVTTestConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIntent, setSelectedIntent] = useState<string>('default');
  const [previewVariant, setPreviewVariant] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [armsRes, configsRes] = await Promise.all([
        supabase.from('mvt_arm_params').select('*').order('variant_key'),
        supabase.from('mvt_test_config').select('*')
      ]);

      if (armsRes.error) throw armsRes.error;
      if (configsRes.error) throw configsRes.error;

      setArmParams(armsRes.data || []);
      setTestConfigs((configsRes.data || []).map(c => ({
        ...c,
        variants: Array.isArray(c.variants) ? c.variants : JSON.parse(c.variants as string)
      })));
    } catch (error: any) {
      console.error('Error fetching MVT data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Get unique intents
  const intents = [...new Set(armParams.map(a => a.intent))];
  
  // Filter arms by selected intent
  const filteredArms = armParams.filter(a => a.intent === selectedIntent);

  // Calculate stats
  const totalImpressions = filteredArms.reduce((sum, a) => sum + (a.impressions_count || 0), 0);
  const totalConversions = filteredArms.reduce((sum, a) => sum + (a.conversions_count || 0), 0);
  const totalRevenue = filteredArms.reduce((sum, a) => sum + (a.revenue_sum || 0), 0);

  // Find leader (highest conversion rate)
  const leaderVariant = filteredArms.reduce((leader, arm) => {
    const armCR = arm.impressions_count && arm.impressions_count > 0 
      ? (arm.conversions_count || 0) / arm.impressions_count 
      : 0;
    const leaderCR = leader && leader.impressions_count && leader.impressions_count > 0 
      ? (leader.conversions_count || 0) / leader.impressions_count 
      : 0;
    return armCR > leaderCR ? arm : leader;
  }, null as MVTArmParams | null);

  // Get copy preview
  const getCopyPreview = (variant: string) => {
    const heroCopy = copyMap.hero?.[selectedIntent]?.[variant] || copyMap.hero?.default?.[variant];
    if (!heroCopy) return null;
    return {
      title: heroCopy.title,
      highlight: heroCopy.highlight,
      subtitle: heroCopy.subtitle,
      cta_primary: heroCopy.cta_primary
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">A/B Тесты (MVT)</h1>
          <p className="text-muted-foreground">Thompson Sampling для оптимизации конверсии</p>
        </div>
        <Button variant="outline" onClick={fetchData} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Обновить
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Intent filter */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Интент:</label>
            <Select value={selectedIntent} onValueChange={setSelectedIntent}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {intents.map(intent => (
                  <SelectItem key={intent} value={intent}>
                    {intent}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Overall stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Показы</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalImpressions.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Конверсии</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalConversions}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">CR</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalImpressions > 0 ? ((totalConversions / totalImpressions) * 100).toFixed(2) : '0'}%
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Выручка</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalRevenue.toLocaleString()} ₽</div>
              </CardContent>
            </Card>
          </div>

          {/* Variants table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Варианты для интента: {selectedIntent}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Вариант</th>
                      <th className="text-right py-3 px-4 font-medium">Показы</th>
                      <th className="text-right py-3 px-4 font-medium">Конверсии</th>
                      <th className="text-right py-3 px-4 font-medium">CR%</th>
                      <th className="text-right py-3 px-4 font-medium">Выручка</th>
                      <th className="text-right py-3 px-4 font-medium">α / β</th>
                      <th className="text-center py-3 px-4 font-medium">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredArms.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-muted-foreground">
                          Нет данных для выбранного интента
                        </td>
                      </tr>
                    ) : (
                      filteredArms.map((arm) => {
                        const cr = arm.impressions_count && arm.impressions_count > 0
                          ? ((arm.conversions_count || 0) / arm.impressions_count * 100).toFixed(2)
                          : '0.00';
                        const isLeader = leaderVariant?.variant_key === arm.variant_key;

                        return (
                          <tr 
                            key={arm.id} 
                            className={`border-b ${isLeader ? 'bg-green-50 dark:bg-green-950/20' : ''}`}
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <Badge variant={isLeader ? 'default' : 'secondary'}>
                                  {arm.variant_key}
                                </Badge>
                                {isLeader && (
                                  <Trophy className="h-4 w-4 text-yellow-500" />
                                )}
                              </div>
                            </td>
                            <td className="text-right py-3 px-4">
                              {(arm.impressions_count || 0).toLocaleString()}
                            </td>
                            <td className="text-right py-3 px-4">
                              {arm.conversions_count || 0}
                            </td>
                            <td className="text-right py-3 px-4 font-medium">
                              {cr}%
                            </td>
                            <td className="text-right py-3 px-4">
                              {(arm.revenue_sum || 0).toLocaleString()} ₽
                            </td>
                            <td className="text-right py-3 px-4 text-sm text-muted-foreground">
                              {arm.alpha.toFixed(1)} / {arm.beta.toFixed(1)}
                            </td>
                            <td className="text-center py-3 px-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setPreviewVariant(
                                  previewVariant === arm.variant_key ? null : arm.variant_key
                                )}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Copy preview */}
          {previewVariant && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Превью копирайта: Вариант {previewVariant}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const preview = getCopyPreview(previewVariant);
                  if (!preview) {
                    return (
                      <p className="text-muted-foreground">
                        Копирайт не найден для этого варианта
                      </p>
                    );
                  }
                  return (
                    <div className="space-y-4 p-4 bg-muted rounded-lg">
                      <div>
                        <label className="text-xs text-muted-foreground">Заголовок:</label>
                        <p className="text-lg font-bold">
                          {preview.title} {preview.highlight && (
                            <span className="text-primary">{preview.highlight}</span>
                          )}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Подзаголовок:</label>
                        <p className="text-muted-foreground">{preview.subtitle}</p>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">CTA:</label>
                        <p className="font-medium">{preview.cta_primary}</p>
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}

          {/* Test configs */}
          {testConfigs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Конфигурация тестов</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {testConfigs.map((config) => (
                    <div 
                      key={config.id} 
                      className="flex items-center justify-between p-4 bg-muted rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{config.test_name}</p>
                        <p className="text-sm text-muted-foreground">
                          Варианты: {config.variants.join(', ')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={config.is_active ? 'default' : 'secondary'}>
                          {config.is_active ? 'Активен' : 'Неактивен'}
                        </Badge>
                        {config.winner_variant && (
                          <Badge variant="outline" className="text-green-600">
                            Победитель: {config.winner_variant}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default AdminMVT;
