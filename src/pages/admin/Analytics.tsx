import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Users, 
  ClipboardList, 
  TrendingUp, 
  DollarSign,
  RefreshCw,
  Loader2,
  CalendarIcon
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { format, subDays, startOfDay, endOfDay, differenceInDays } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface TrafficEvent {
  id: string;
  session_id: string;
  event_type: string;
  device_type: string | null;
  utm_source: string | null;
  timestamp: string;
}

interface Lead {
  id: string;
  created_at: string | null;
  final_price: number | null;
  status: string | null;
  device_type: string | null;
  utm_source: string | null;
  is_test: boolean | null;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', '#10b981', '#f59e0b', '#ef4444'];

const AdminAnalytics = () => {
  const [events, setEvents] = useState<TrafficEvent[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState<Date>(subDays(new Date(), 30));
  const [dateTo, setDateTo] = useState<Date>(new Date());

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [eventsRes, leadsRes] = await Promise.all([
        supabase
          .from('traffic_events')
          .select('id, session_id, event_type, device_type, utm_source, timestamp')
          .gte('timestamp', startOfDay(dateFrom).toISOString())
          .lte('timestamp', endOfDay(dateTo).toISOString())
          .order('timestamp', { ascending: false }),
        supabase
          .from('leads')
          .select('id, created_at, final_price, status, device_type, utm_source, is_test')
          .eq('is_test', false)
          .gte('created_at', startOfDay(dateFrom).toISOString())
          .lte('created_at', endOfDay(dateTo).toISOString())
          .order('created_at', { ascending: false })
      ]);

      if (eventsRes.error) throw eventsRes.error;
      if (leadsRes.error) throw leadsRes.error;

      setEvents(eventsRes.data || []);
      setLeads(leadsRes.data || []);
    } catch (error: any) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateFrom, dateTo]);

  const setQuickPeriod = (days: number | null) => {
    if (days === null) {
      setDateFrom(new Date(2024, 0, 1));
      setDateTo(new Date());
    } else {
      setDateFrom(subDays(new Date(), days));
      setDateTo(new Date());
    }
  };

  // Calculate metrics
  const uniqueSessions = new Set(events.map(e => e.session_id)).size;
  const totalLeads = leads.length;
  const conversionRate = uniqueSessions > 0 ? ((totalLeads / uniqueSessions) * 100).toFixed(1) : '0';
  const totalRevenue = leads.reduce((sum, l) => sum + (l.final_price || 0), 0);

  // Leads by day for chart - dynamic based on selected period
  const daysDiff = Math.max(1, differenceInDays(dateTo, dateFrom) + 1);
  const chartDays = Math.min(daysDiff, 30);
  
  const leadsByDay = Array.from({ length: chartDays }, (_, i) => {
    const date = subDays(dateTo, chartDays - 1 - i);
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);
    const count = leads.filter(l => {
      if (!l.created_at) return false;
      const created = new Date(l.created_at);
      return created >= dayStart && created <= dayEnd;
    }).length;
    return {
      date: format(date, 'd MMM', { locale: ru }),
      leads: count
    };
  });

  // Device distribution
  const deviceCounts = events.reduce((acc, e) => {
    const device = e.device_type || 'unknown';
    acc[device] = (acc[device] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const deviceData = Object.entries(deviceCounts).map(([name, value]) => ({
    name: name === 'mobile' ? 'Мобильные' : name === 'desktop' ? 'Десктоп' : name === 'tablet' ? 'Планшеты' : 'Неизвестно',
    value
  }));

  // UTM sources
  const utmCounts = leads.reduce((acc, l) => {
    const source = l.utm_source || 'direct';
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const utmData = Object.entries(utmCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));

  // Funnel data
  const pageViews = events.filter(e => e.event_type === 'page_view').length;
  const calcOpens = events.filter(e => e.event_type === 'calculator_open').length;
  const leadSubmits = leads.length;

  const funnelData = [
    { name: 'Визиты', value: pageViews },
    { name: 'Калькулятор', value: calcOpens },
    { name: 'Заявки', value: leadSubmits }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Аналитика</h1>
            <p className="text-muted-foreground">
              {format(dateFrom, 'd MMM yyyy', { locale: ru })} — {format(dateTo, 'd MMM yyyy', { locale: ru })}
            </p>
          </div>
          <Button variant="outline" onClick={fetchData} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Обновить
          </Button>
        </div>

        {/* Date filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex gap-1">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setQuickPeriod(7)}
              className={daysDiff === 7 ? 'bg-primary text-primary-foreground' : ''}
            >
              7 дней
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setQuickPeriod(30)}
              className={daysDiff === 30 ? 'bg-primary text-primary-foreground' : ''}
            >
              30 дней
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setQuickPeriod(90)}
              className={daysDiff === 90 ? 'bg-primary text-primary-foreground' : ''}
            >
              90 дней
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setQuickPeriod(null)}
            >
              Всё время
            </Button>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="w-[140px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(dateFrom, 'dd.MM.yyyy')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateFrom}
                  onSelect={(date) => date && setDateFrom(date)}
                  disabled={(date) => date > dateTo || date > new Date()}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            <span className="text-muted-foreground">—</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="w-[140px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(dateTo, 'dd.MM.yyyy')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={dateTo}
                  onSelect={(date) => date && setDateTo(date)}
                  disabled={(date) => date < dateFrom || date > new Date()}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Key metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Сессии</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{uniqueSessions.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Уникальных посетителей</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Заявки</CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalLeads}</div>
                <p className="text-xs text-muted-foreground">Реальных заявок</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Конверсия</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{conversionRate}%</div>
                <p className="text-xs text-muted-foreground">Заявок / сессий</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Выручка</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalRevenue.toLocaleString()} ₽</div>
                <p className="text-xs text-muted-foreground">По калькулятору</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Leads by day */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Заявки по дням</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={leadsByDay}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="date" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="leads" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--primary))' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Devices */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Устройства</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {deviceData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* UTM sources */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Источники трафика</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={utmData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" className="text-xs" />
                      <YAxis dataKey="name" type="category" width={80} className="text-xs" />
                      <Tooltip />
                      <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Funnel */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Воронка конверсии</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {funnelData.map((item, index) => {
                    const prevValue = index > 0 ? funnelData[index - 1].value : item.value;
                    const dropoff = prevValue > 0 ? ((prevValue - item.value) / prevValue * 100).toFixed(0) : 0;
                    const width = funnelData[0].value > 0 ? (item.value / funnelData[0].value * 100) : 0;
                    
                    return (
                      <div key={item.name} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{item.name}</span>
                          <span className="font-medium">{item.value.toLocaleString()}</span>
                        </div>
                        <div className="h-8 bg-muted rounded-lg overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all"
                            style={{ width: `${width}%` }}
                          />
                        </div>
                        {index > 0 && (
                          <p className="text-xs text-muted-foreground">
                            Отвал: {dropoff}%
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminAnalytics;
