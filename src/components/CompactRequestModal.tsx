import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTraffic } from "@/contexts/TrafficContext";
import { supabase } from "@/integrations/supabase/client";
import { trackGoal, getYmGoalId } from "@/lib/analytics";

interface CompactRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
}

export const CompactRequestModal = ({
  open,
  onOpenChange,
  calculatorData
}: CompactRequestModalProps) => {
  const { context } = useTraffic();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+7");
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreed) {
      toast.error("Пожалуйста, согласитесь с политикой конфиденциальности");
      return;
    }

    if (!phone || phone.length < 11) {
      toast.error("Введите корректный номер телефона");
      return;
    }

    setIsSubmitting(true);
    
    trackGoal('calc_submit', {
      intent: context?.intent,
      variant: context?.variantId,
      hasName: !!name.trim(),
      phoneLength: phone.length,
      finalPrice: calculatorData.finalPrice
    });
    
    try {
      const { data, error } = await supabase.functions.invoke("handle-lead", {
        body: {
          name: name.trim() || "Не указано",
          phone,
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
          source: 'calculator_compact_form',
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
        }
      });

      if (error || !data?.success) {
        throw error || new Error("Failed to submit lead");
      }

      toast.success("✅ Заявка отправлена! Мы перезвоним вам в течение 15 минут");

      const pageGoal = getYmGoalId(window.location.pathname);
      trackGoal(pageGoal, { source: 'calculator_compact', price: calculatorData.finalPrice });

      onOpenChange(false);
      
      setName("");
      setPhone("+7");
      setAgreed(false);
      
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("❌ Ошибка при отправке заявки. Попробуйте еще раз или позвоните нам: 8-495-018-18-17");
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl font-bold text-center">
            Оформить заявку
          </DialogTitle>
          <p className="text-center text-muted-foreground mt-2 text-sm">
            Перезвоним в течение 15 минут
            <br />
            или позвоните: 8-495-018-18-17
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 px-6">
          {/* Поля ввода */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium mb-2 block">
                Имя *
              </Label>
              <Input
                id="name"
                placeholder="Ваше имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm font-medium mb-2 block">
                Телефон *
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+7 (___) ___-__-__"
                value={phone}
                onChange={(e) => {
                  const formatted = formatPhone(e.target.value);
                  setPhone(formatted);
                }}
                className="h-12"
                required
              />
            </div>
          </div>

          {/* Информация о расчете */}
          <div className="bg-muted/30 p-4 rounded-xl space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Площадь:</span>
              <span className="font-semibold">{calculatorData.area} м²</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Скидка:</span>
              <span className="font-semibold text-success">{calculatorData.discount}%</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold pt-2 border-t border-border">
              <span>Итоговая цена:</span>
              <span className="text-primary text-xl">{calculatorData.finalPrice}₽</span>
            </div>
          </div>

          {/* Чекбокс согласия */}
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="agreement"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              required
              className="mt-1 h-4 w-4 rounded border-border"
            />
            <label htmlFor="agreement" className="text-sm text-muted-foreground leading-tight">
              Согласен с политикой конфиденциальности
            </label>
          </div>

          {/* Кнопки действий */}
          <div className="space-y-3 pb-6">
            <Button
              type="submit"
              disabled={isSubmitting || !agreed}
              className="w-full h-12 text-base font-semibold"
            >
              {isSubmitting ? "Отправка..." : "Отправить заявку"}
            </Button>
          </div>
        </form>

        {/* Футер с защитой данных */}
        <div className="bg-muted/20 px-6 py-4 border-t border-border">
          <p className="text-center text-xs text-muted-foreground">
            Данные защищены · Без спама
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
