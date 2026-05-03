import { useState } from 'react';
import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';
import { useTraffic } from '@/contexts/TrafficContext';
import { trackGoal } from '@/lib/analytics';
import { Link } from 'react-router-dom';
import { formatRuPhone, isValidRuPhone, RU_PHONE_INITIAL, getCurrentPageUrl } from '@/lib/phoneUtils';

interface HeroCallbackFormProps {
  serviceSlug: string;
}

export default function HeroCallbackForm({ serviceSlug }: HeroCallbackFormProps) {
  const { context } = useTraffic();
  const [phone, setPhone] = useState(RU_PHONE_INITIAL);
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isPhoneValid = isValidRuPhone(phone);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreed) {
      toast.error('Согласитесь с политикой конфиденциальности');
      return;
    }

    if (!isPhoneValid) {
      toast.error('Введите корректный номер в формате +7 (XXX) XXX-XX-XX');
      return;
    }

    setIsSubmitting(true);

    trackGoal('hero_callback_submit', {
      intent: context?.intent,
      service: serviceSlug,
    });

    const leadBody = {
      name: 'Обратный звонок',
      phone,
      source: 'hero_callback',
      service: serviceSlug,
      session_id: context?.sessionId || null,
      intent: context?.intent || 'default',
      variant_id: context?.variantId || null,
      device_type: context?.deviceType || null,
      last_page_url: getCurrentPageUrl(),
      utm_source: context?.utm_source || null,
      utm_medium: context?.utm_medium || null,
      utm_campaign: context?.utm_campaign || null,
      utm_content: context?.utm_content || null,
      utm_term: context?.utm_term || null,
    };

    const sendDirect = async () => {
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
      const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
      const resp = await fetch(`${SUPABASE_URL}/functions/v1/handle-lead`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: ANON_KEY,
          Authorization: `Bearer ${ANON_KEY}`,
        },
        body: JSON.stringify(leadBody),
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      return await resp.json();
    };

    try {
      let result: { success?: boolean; error?: string } | null = null;

      if (supabase?.functions?.invoke) {
        try {
          const { data, error } = await supabase.functions.invoke('handle-lead', { body: leadBody });
          if (error) throw error;
          result = data;
        } catch (sdkErr) {
          console.warn('supabase.functions.invoke failed, falling back to fetch:', sdkErr);
          result = await sendDirect();
        }
      } else {
        result = await sendDirect();
      }

      if (!result || result.success === false) {
        throw new Error(result?.error || 'Failed');
      }

      toast.success('✅ Заявка отправлена! Перезвоним в течение 15 минут');
      setPhone('+7');
      setAgreed(false);
    } catch {
      toast.error('Ошибка отправки. Позвоните: 8-495-018-18-17');
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
          inputMode="tel"
          placeholder="+7 (___) ___-__-__"
          value={phone}
          onChange={(e) => setPhone(formatRuPhone(e.target.value))}
          className={`h-12 text-base flex-1 ${
            phone.length > 4 && !isPhoneValid ? 'border-destructive' : isPhoneValid ? 'border-success' : ''
          }`}
          aria-invalid={phone.length > 4 && !isPhoneValid}
          required
        />
        <Button
          type="submit"
          disabled={isSubmitting}
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
