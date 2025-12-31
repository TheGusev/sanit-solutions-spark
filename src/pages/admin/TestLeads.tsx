import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  Plus,
  Loader2,
  RefreshCw,
  Trash2,
  Zap,
  Phone,
  Mail,
  Building2,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface TestLead {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  object_type: string | null;
  service: string | null;
  area_m2: number | null;
  final_price: number | null;
  status: string | null;
  created_at: string | null;
  is_test: boolean | null;
}

const objectTypes = [
  { value: 'flat', label: 'Квартира' },
  { value: 'house', label: 'Дом' },
  { value: 'office', label: 'Офис' },
  { value: 'warehouse', label: 'Склад' },
  { value: 'restaurant', label: 'Ресторан' },
  { value: 'production', label: 'Производство' },
];

const services = [
  { value: 'dezinsection', label: 'Дезинсекция' },
  { value: 'deratization', label: 'Дератизация' },
  { value: 'disinfection', label: 'Дезинфекция' },
  { value: 'fumigation', label: 'Фумигация' },
];

const AdminTestLeads = () => {
  const [leads, setLeads] = useState<TestLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    object_type: '',
    service: '',
    area_m2: '',
    final_price: '',
  });

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('is_test', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error: any) {
      toast.error('Ошибка загрузки тестовых заявок');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const createTestLead = async (quick = false) => {
    const leadData = quick
      ? {
          name: `Тест ${Date.now().toString().slice(-4)}`,
          phone: '+7900' + Math.random().toString().slice(2, 9),
        }
      : {
          name: formData.name,
          phone: formData.phone,
          email: formData.email || undefined,
          object_type: formData.object_type || undefined,
          service: formData.service || undefined,
          area_m2: formData.area_m2 ? parseInt(formData.area_m2) : undefined,
          final_price: formData.final_price ? parseInt(formData.final_price) : undefined,
        };

    if (!quick && (!leadData.name || !leadData.phone)) {
      toast.error('Заполните имя и телефон');
      return;
    }

    setIsCreating(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      
      const { data, error } = await supabase.functions.invoke('create-test-lead', {
        body: leadData,
        headers: {
          Authorization: `Bearer ${session.session?.access_token}`,
        },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      toast.success('Тестовая заявка создана');
      setFormData({
        name: '',
        phone: '',
        email: '',
        object_type: '',
        service: '',
        area_m2: '',
        final_price: '',
      });
      setShowForm(false);
      fetchLeads();
    } catch (error: any) {
      toast.error(error.message || 'Ошибка создания заявки');
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  const deleteLead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id)
        .eq('is_test', true);

      if (error) throw error;
      
      setLeads(leads.filter(l => l.id !== id));
      toast.success('Заявка удалена');
    } catch (error: any) {
      toast.error('Ошибка удаления');
    }
  };

  const convertToReal = async (id: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ is_test: false, source: 'converted_from_test' })
        .eq('id', id);

      if (error) throw error;
      
      setLeads(leads.filter(l => l.id !== id));
      toast.success('Заявка конвертирована в реальную');
    } catch (error: any) {
      toast.error('Ошибка конвертации');
    }
  };

  const statusLabels: Record<string, string> = {
    new: 'Новая',
    in_progress: 'В работе',
    completed: 'Завершена',
    cancelled: 'Отменена',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Тестовые заявки</h1>
          <p className="text-muted-foreground">
            Заявки для тестирования, не учитываются в аналитике
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchLeads} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Обновить
          </Button>
          <Button
            variant="secondary"
            onClick={() => createTestLead(true)}
            disabled={isCreating}
          >
            <Zap className="mr-2 h-4 w-4" />
            Быстрая заявка
          </Button>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" />
            Создать
          </Button>
        </div>
      </div>

      {/* Create form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Новая тестовая заявка</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Имя *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Иван Иванов"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Телефон *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+7 900 123-45-67"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Тип объекта</Label>
                <Select
                  value={formData.object_type}
                  onValueChange={(v) => setFormData({ ...formData, object_type: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип" />
                  </SelectTrigger>
                  <SelectContent>
                    {objectTypes.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Услуга</Label>
                <Select
                  value={formData.service}
                  onValueChange={(v) => setFormData({ ...formData, service: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите услугу" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">Площадь (м²)</Label>
                <Input
                  id="area"
                  type="number"
                  value={formData.area_m2}
                  onChange={(e) => setFormData({ ...formData, area_m2: e.target.value })}
                  placeholder="50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Стоимость (₽)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.final_price}
                  onChange={(e) => setFormData({ ...formData, final_price: e.target.value })}
                  placeholder="5000"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Отмена
              </Button>
              <Button onClick={() => createTestLead(false)} disabled={isCreating}>
                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Создать заявку
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{leads.length}</div>
            <p className="text-sm text-muted-foreground">Тестовых заявок</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {leads.filter((l) => l.status === 'new').length}
            </div>
            <p className="text-sm text-muted-foreground">Новые</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {leads.filter((l) => l.status === 'completed').length}
            </div>
            <p className="text-sm text-muted-foreground">Завершённые</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {leads.reduce((sum, l) => sum + (l.final_price || 0), 0).toLocaleString()} ₽
            </div>
            <p className="text-sm text-muted-foreground">Сумма</p>
          </CardContent>
        </Card>
      </div>

      {/* Leads list */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : leads.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Тестовых заявок нет. Создайте первую!
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {leads.map((lead) => (
            <Card key={lead.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{lead.name}</span>
                      <Badge variant="outline" className="text-orange-600 border-orange-200">
                        Тест
                      </Badge>
                      <Badge variant="secondary">
                        {statusLabels[lead.status || 'new']}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {lead.phone}
                      </div>
                      {lead.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {lead.email}
                        </div>
                      )}
                      {lead.object_type && (
                        <div className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          {objectTypes.find((t) => t.value === lead.object_type)?.label ||
                            lead.object_type}
                        </div>
                      )}
                      {lead.created_at && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(lead.created_at), 'd MMM, HH:mm', { locale: ru })}
                        </div>
                      )}
                    </div>
                    {lead.final_price && (
                      <div className="text-sm font-medium">
                        {lead.area_m2 && `${lead.area_m2} м² — `}
                        {lead.final_price.toLocaleString()} ₽
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => convertToReal(lead.id)}
                      title="Конвертировать в реальную"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteLead(lead.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTestLeads;
