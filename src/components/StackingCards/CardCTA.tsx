import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const CardCTA = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
    website: '', // honeypot
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 1) return digits.startsWith('7') ? '+7' : digits;
    if (digits.length <= 4) return `+7 (${digits.slice(1)}`;
    if (digits.length <= 7) return `+7 (${digits.slice(1, 4)}) ${digits.slice(4)}`;
    if (digits.length <= 9) return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData(prev => ({ ...prev, phone: formatted }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Honeypot check
    if (formData.website) return;
    
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast.error('Заполните имя и телефон');
      return;
    }

    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length !== 11) {
      toast.error('Введите корректный номер телефона');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('handle-lead', {
        body: {
          name: formData.name,
          phone: formData.phone,
          source: 'contact_form',
          method: 'form',
        },
      });

      if (error) throw error;

      toast.success('Заявка отправлена! Мы свяжемся с вами в течение 15 минут.');
      setFormData({ name: '', phone: '', message: '', website: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Ошибка отправки. Попробуйте позвонить нам.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/79069989888?text=Здравствуйте! Хочу узнать подробнее об услугах.', '_blank');
  };

  const handleTelegram = () => {
    window.open('https://t.me/+79069989888', '_blank');
  };

  return (
    <section
      id="contact"
      className="stacking-card bg-muted/30"
    >
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-8 md:mb-12 text-center">
          Остались вопросы?
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-muted/30 rounded-2xl p-6 md:p-8">
            <h3 className="text-lg font-semibold text-foreground mb-6">
              Заказать обратный звонок
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot */}
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Ваше имя
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Как к вам обращаться?"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Телефон
                </label>
                <Input
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="+7 (___) ___-__-__"
                  type="tel"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Сообщение (необязательно)
                </label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Опишите вашу ситуацию..."
                  rows={3}
                />
              </div>
              
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-accent hover:bg-accent/90"
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Отправка...' : 'Заказать звонок'}
              </Button>
            </form>
          </div>
          
          {/* Contacts */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">
              Контакты
            </h3>
            
            <div className="space-y-4">
              <a
                href="tel:+79069989888"
                className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Телефон</p>
                  <p className="font-semibold text-foreground">+7 (906) 998-98-88</p>
                </div>
              </a>
              
              <a
                href="mailto:info@goruslugimsk.ru"
                className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-semibold text-foreground">info@goruslugimsk.ru</p>
                </div>
              </a>
              
              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Адрес</p>
                  <p className="font-semibold text-foreground">Москва и Московская область</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">График работы</p>
                  <p className="font-semibold text-foreground">Круглосуточно, без выходных</p>
                </div>
              </div>
            </div>
            
            {/* Messenger buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleWhatsApp}
                variant="outline"
                className="flex-1 border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
              
              <Button
                onClick={handleTelegram}
                variant="outline"
                className="flex-1 border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
              >
                <Send className="w-4 h-4 mr-2" />
                Telegram
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CardCTA;
