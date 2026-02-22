import { useState } from 'react';
import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useTraffic } from '@/contexts/TrafficContext';
import { trackGoal } from '@/lib/analytics';
import { Link } from 'react-router-dom';

interface HeroCallbackFormProps {
  serviceSlug: string;
}

const formatPhone = (value: string) => {
  let phone = value.replace(/\D/g, '');
  if (!phone.startsWith('7')) phone = '7' + phone;

  let formatted = '+7';
  if (phone.length > 1) formatted += ` (${phone.substring(1, 4)}`;
  if (phone.length > 4) formatted += `) ${phone.substring(4, 7)}`;
  if (phone.length > 7) formatted += `-${phone.substring(7, 9)}`;
  if (phone.length > 9) formatted += `-${phone.substring(9, 11)}`;

  return formatted;
};

export default function HeroCallbackForm({ serviceSlug }: HeroCallbackFormProps) {
  const { context } = useTraffic();
  const [phone, setPhone] = useState('+7');
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreed) {
      toast.error('Согласитесь с политикой конфиденциальности');
      return;
    }

    const digits = phone.replace(/\D/g, '');
    if (digits.length < 11) {
      toast.error('Введите корректный номер телефона');
      return;
    }

    setIsSubmitting(true);

    trackGoal('hero_callback_submit', {
      intent: context?.intent,
      service: serviceSlug,
    });

    try {
      const { data, error } = await supabase.functions.invoke('handle-lead', {
        body: {
          name: 'Обратный звонок',
          phone,
          source: 'hero_callback',
          service: serviceSlug,
          session_id: context?.sessionId || null,
          intent: context?.intent || 'default',
          variant_id: context?.variantId || null,
          device_type: context?.deviceType || null,
          last_page_url: window.location.href,
          utm_source: context?.utm_source || null,
          utm_medium: context?.utm_medium || null,
          utm_campaign: context?.utm_campaign || null,
          utm_content: context?.utm_content || null,
          utm_term: context?.utm_term || null,
        },
      });

      if (error || !data?.success) {
        throw error || new Error('Failed');
      }

      toast.success('✅ Заявка отправлена! Перезвоним в течение 15 минут');
      setPhone('+7');
      setAgreed(false);
    } catch {
      toast.error('Ошибка отправки. Позвоните: +7 (906) 998-98-88');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 bg-background/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-border/50 max-w-xl"
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          type="tel"
          placeholder="+7 (___) ___-__-__"
          value={phone}
          onChange={(e) => setPhone(formatPhone(e.target.value))}
          className="h-12 text-base flex-1"
          required
        />
        <Button
          type="submit"
          disabled={isSubmitting || !agreed}
          className="h-12 text-base font-semibold whitespace-nowrap px-6"
        >
          <Phone className="w-4 h-4 mr-2" />
          {isSubmitting ? 'Отправка...' : 'Перезвоните мне'}
        </Button>
      </div>
      <div className="flex items-start gap-2 mt-3">
        <input
          type="checkbox"
          id="hero-agree"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-border"
        />
        <label htmlFor="hero-agree" className="text-xs text-muted-foreground leading-tight">
          Согласен с{' '}
          <Link to="/privacy" className="underline hover:text-foreground">
            политикой конфиденциальности
          </Link>
        </label>
      </div>
    </form>
  );
}
