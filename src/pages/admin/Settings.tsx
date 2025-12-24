import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  RefreshCw, 
  Loader2, 
  Database,
  Users,
  ClipboardList,
  MessageSquare,
  Activity,
  Info
} from 'lucide-react';
import { toast } from 'sonner';

interface DBStats {
  leads: number;
  reviews: number;
  traffic_events: number;
  mvt_impressions: number;
  mvt_arm_params: number;
}

const AdminSettings = () => {
  const [stats, setStats] = useState<DBStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const [leadsRes, reviewsRes, eventsRes, impressionsRes, armsRes] = await Promise.all([
        supabase.from('leads').select('id', { count: 'exact', head: true }),
        supabase.from('reviews' as any).select('id', { count: 'exact', head: true }),
        supabase.from('traffic_events').select('id', { count: 'exact', head: true }),
        supabase.from('mvt_impressions').select('id', { count: 'exact', head: true }),
        supabase.from('mvt_arm_params').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        leads: leadsRes.count || 0,
        reviews: reviewsRes.count || 0,
        traffic_events: eventsRes.count || 0,
        mvt_impressions: impressionsRes.count || 0,
        mvt_arm_params: armsRes.count || 0,
      });
    } catch (error: any) {
      console.error('Error fetching stats:', error);
      toast.error('Ошибка загрузки статистики');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleClearCache = () => {
    localStorage.clear();
    sessionStorage.clear();
    toast.success('Локальный кэш очищен');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Настройки</h1>
          <p className="text-muted-foreground">Информация о системе и быстрые действия</p>
        </div>
        <Button variant="outline" onClick={fetchStats} disabled={isLoading}>
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
          {/* Database stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Статистика базы данных
              </CardTitle>
              <CardDescription>
                Количество записей в основных таблицах
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="p-4 bg-muted rounded-lg text-center">
                  <ClipboardList className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <div className="text-2xl font-bold">{stats?.leads || 0}</div>
                  <p className="text-sm text-muted-foreground">Заявки</p>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <MessageSquare className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <div className="text-2xl font-bold">{stats?.reviews || 0}</div>
                  <p className="text-sm text-muted-foreground">Отзывы</p>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <Activity className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <div className="text-2xl font-bold">{stats?.traffic_events || 0}</div>
                  <p className="text-sm text-muted-foreground">Трафик</p>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <Users className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <div className="text-2xl font-bold">{stats?.mvt_impressions || 0}</div>
                  <p className="text-sm text-muted-foreground">Показы MVT</p>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <Database className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <div className="text-2xl font-bold">{stats?.mvt_arm_params || 0}</div>
                  <p className="text-sm text-muted-foreground">Arm Params</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card>
            <CardHeader>
              <CardTitle>Быстрые действия</CardTitle>
              <CardDescription>
                Утилиты для администрирования
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Очистить локальный кэш</p>
                  <p className="text-sm text-muted-foreground">
                    Удаляет данные localStorage и sessionStorage браузера
                  </p>
                </div>
                <Button variant="outline" onClick={handleClearCache}>
                  Очистить
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* System info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Информация о системе
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Версия</span>
                  <span className="font-mono">1.0.0</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">MVT алгоритм</span>
                  <span className="font-mono">Thompson Sampling</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Варианты A/B</span>
                  <span className="font-mono">A, B, C, D, E, F</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Хранение данных</span>
                  <span className="font-mono">90 дней (auto-cleanup)</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Уведомления</span>
                  <span className="font-mono">Telegram Bot</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default AdminSettings;
