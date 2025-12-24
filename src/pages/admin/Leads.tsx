import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  Phone, 
  Mail, 
  Calendar, 
  Building2, 
  Loader2,
  RefreshCw,
  Key,
  Copy,
  CheckCircle2
} from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  object_type: string | null;
  service: string | null;
  area_m2: number | null;
  final_price: number | null;
  review_code: string | null;
  review_code_used: boolean | null;
  status: string | null;
  created_at: string | null;
  utm_source: string | null;
}

const statusColors: Record<string, string> = {
  new: 'bg-blue-500/10 text-blue-600 border-blue-200',
  in_progress: 'bg-yellow-500/10 text-yellow-600 border-yellow-200',
  completed: 'bg-green-500/10 text-green-600 border-green-200',
  cancelled: 'bg-red-500/10 text-red-600 border-red-200',
};

const statusLabels: Record<string, string> = {
  new: 'Новая',
  in_progress: 'В работе',
  completed: 'Завершена',
  cancelled: 'Отменена',
};

const AdminLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [generatingCode, setGeneratingCode] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setLeads((data || []) as unknown as Lead[]);
    } catch (error: any) {
      toast.error('Ошибка загрузки заявок');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [filter]);

  const updateStatus = async (leadId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus })
        .eq('id', leadId);

      if (error) throw error;

      setLeads(leads.map(lead => 
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      ));

      toast.success(`Статус изменён на "${statusLabels[newStatus]}"`);
    } catch (error: any) {
      toast.error('Ошибка обновления статуса');
    }
  };

  const generateReviewCode = async (lead: Lead) => {
    if (lead.review_code) {
      toast.info('Код уже сгенерирован');
      return;
    }

    setGeneratingCode(lead.id);
    try {
      const { data, error } = await supabase.functions.invoke('generate-review-code', {
        body: { lead_id: lead.id }
      });

      if (error) throw error;

      // Update local state
      setLeads(leads.map(l => 
        l.id === lead.id ? { ...l, review_code: data.code, status: 'completed' } : l
      ));

      toast.success(`Код отзыва: ${data.code}. Уведомление отправлено в Telegram`);
    } catch (error: any) {
      toast.error(error.message || 'Ошибка генерации кода');
    } finally {
      setGeneratingCode(null);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success('Код скопирован');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    in_progress: leads.filter(l => l.status === 'in_progress').length,
    completed: leads.filter(l => l.status === 'completed').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Заявки</h1>
          <p className="text-muted-foreground">Управление входящими заявками</p>
        </div>
        <Button variant="outline" onClick={fetchLeads} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Обновить
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-sm text-muted-foreground">Всего</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
            <p className="text-sm text-muted-foreground">Новые</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">{stats.in_progress}</div>
            <p className="text-sm text-muted-foreground">В работе</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-sm text-muted-foreground">Завершено</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Фильтр по статусу" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все заявки</SelectItem>
            <SelectItem value="new">Новые</SelectItem>
            <SelectItem value="in_progress">В работе</SelectItem>
            <SelectItem value="completed">Завершённые</SelectItem>
            <SelectItem value="cancelled">Отменённые</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Leads list */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : leads.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Заявки не найдены
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {leads.map((lead) => (
            <Card key={lead.id}>
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-lg">{lead.name}</CardTitle>
                    <Badge variant="outline" className={statusColors[lead.status || 'new']}>
                      {statusLabels[lead.status || 'new']}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={lead.status || 'new'}
                      onValueChange={(value) => updateStatus(lead.id, value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Новая</SelectItem>
                        <SelectItem value="in_progress">В работе</SelectItem>
                        <SelectItem value="completed">Завершена</SelectItem>
                        <SelectItem value="cancelled">Отменена</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${lead.phone}`} className="hover:text-primary">
                      {lead.phone}
                    </a>
                  </div>
                  {lead.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{lead.email}</span>
                    </div>
                  )}
                  {lead.object_type && (
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span>{lead.object_type}</span>
                    </div>
                  )}
                  {lead.created_at && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {format(new Date(lead.created_at), 'd MMMM, HH:mm', { locale: ru })}
                      </span>
                    </div>
                  )}
                </div>

                {lead.area_m2 && lead.final_price && (
                  <div className="flex items-center gap-4 text-sm">
                    <span>Площадь: {lead.area_m2} м²</span>
                    <span className="font-medium">Стоимость: {lead.final_price.toLocaleString()} ₽</span>
                  </div>
                )}

                {lead.utm_source && (
                  <div className="text-xs text-muted-foreground">
                    Источник: {lead.utm_source}
                  </div>
                )}

                {/* Review code section */}
                <div className="pt-3 border-t flex flex-wrap items-center gap-3">
                  {lead.review_code ? (
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="font-mono text-base px-3 py-1">
                        {lead.review_code}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyCode(lead.review_code!)}
                      >
                        {copiedCode === lead.review_code ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      {lead.review_code_used && (
                        <Badge variant="outline" className="text-green-600">
                          Использован
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateReviewCode(lead)}
                      disabled={generatingCode === lead.id}
                    >
                      {generatingCode === lead.id ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Key className="mr-2 h-4 w-4" />
                      )}
                      Сгенерировать код для отзыва
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminLeads;
