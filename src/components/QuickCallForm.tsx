import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone, CheckCircle2, Loader2, MessageCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { trackGoal } from "@/lib/analytics";
import { useTraffic } from "@/contexts/TrafficContext";

interface QuickCallFormProps {
  calculatorData: {
    premiseType: string;
    area: number;
    serviceType: string;
    treatmentType: string;
    period: string;
    clientType: string;
    totalPrice: number;
    discount: number;
    discountAmount: number;
    finalPrice: number;
  };
  onSuccess?: () => void;
}

export function QuickCallForm({ calculatorData, onSuccess }: QuickCallFormProps) {
  const { context } = useTraffic();
  const [phone, setPhone] = useState("+7 ");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned) return "+7 ";
    
    const match = cleaned.match(/^(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/);
    if (!match) return value;
    
    const parts = [
      "+7",
      match[2] && ` (${match[2]}`,
      match[3] && `) ${match[3]}`,
      match[4] && `-${match[4]}`,
      match[5] && `-${match[5]}`
    ].filter(Boolean);
    
    return parts.join("");
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
    if (error && formatted.length === 18) {
      setError(null);
    }
  };

  const isPhoneValid = phone.length === 18;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPhoneValid) {
      setError("Введите корректный номер");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Track CTA click
      trackGoal('quick_call_submit', {
        intent: context?.intent,
        variant: context?.variantId,
        price: calculatorData.finalPrice
      });

      const { data, error: fnError } = await supabase.functions.invoke("handle-lead", {
        body: {
          name: "Быстрый звонок",
          phone,
          email: null,
          object_type: calculatorData.premiseType,
          area_m2: calculatorData.area,
          service: calculatorData.serviceType,
          method: calculatorData.treatmentType,
          frequency: calculatorData.period,
          client_type: calculatorData.clientType,
          base_price: calculatorData.totalPrice,
          discount_percent: calculatorData.discount,
          discount_amount: calculatorData.discountAmount,
          final_price: calculatorData.finalPrice,
          source: "quick_call",
          session_id: context?.sessionId || null,
          intent: context?.intent || 'default',
          variant_id: context?.variantId || null,
          device_type: context?.deviceType || null,
          first_landing_url: context?.firstLandingUrl || null,
          last_page_url: window.location.href,
          utm_source: context?.utm_source || null,
          utm_medium: context?.utm_medium || null,
          utm_campaign: context?.utm_campaign || null,
          utm_content: context?.utm_content || null,
          utm_term: context?.utm_term || null,
          keyword: context?.keyword || null,
          yclid: context?.yclid || null,
          gclid: context?.gclid || null,
        }
      });

      if (fnError || !data?.success) throw fnError || new Error("Failed");

      trackGoal('lead_submit', {
        intent: context?.intent,
        variant: context?.variantId,
        service_type: calculatorData.serviceType,
        price: calculatorData.finalPrice,
        source: 'quick_call'
      });

      setIsSuccess(true);
      toast({
        title: "Заявка принята!",
        description: "Перезвоним в течение 15 минут",
      });
      
      onSuccess?.();
    } catch (err) {
      console.error("Quick call error:", err);
      setError("Ошибка. Позвоните: +7 (993) 928-94-88");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    trackGoal('whatsapp_click', {
      intent: context?.intent,
      variant: context?.variantId,
      price: calculatorData.finalPrice
    });

    const message = `Здравствуйте! Хочу заказать обработку.
📐 Площадь: ${calculatorData.area} м²
💰 Цена: ${calculatorData.finalPrice}₽`;
    
    window.open(`https://wa.me/79939289488?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (isSuccess) {
    return (
      <div className="bg-success/10 border border-success/30 rounded-2xl p-4 text-center animate-in fade-in duration-300">
        <CheckCircle2 className="w-8 h-8 text-success mx-auto mb-2" />
        <p className="font-bold text-success">Заявка принята!</p>
        <p className="text-sm text-muted-foreground">Перезвоним за 15 минут</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Quick call form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <Input
            value={phone}
            onChange={handlePhoneChange}
            placeholder="+7 (___) ___-__-__"
            className={`flex-1 h-12 text-base ${error ? 'border-destructive' : isPhoneValid ? 'border-success' : ''}`}
          />
          <Button 
            type="submit" 
            size="lg"
            className="h-12 px-6 animate-pulse hover:animate-none"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Phone className="w-5 h-5 mr-2" />
                Позвоните мне
              </>
            )}
          </Button>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </form>

      {/* WhatsApp alternative */}
      <Button
        type="button"
        variant="outline"
        className="w-full h-11 text-success border-success/30 hover:bg-success/10"
        onClick={handleWhatsApp}
      >
        <MessageCircle className="w-5 h-5 mr-2" />
        Написать в WhatsApp
      </Button>

      {/* Social proof */}
      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Перезвоним за 15 мин
        </span>
        <span>•</span>
        <span>Сегодня уже 3 заявки</span>
      </div>
    </div>
  );
}
