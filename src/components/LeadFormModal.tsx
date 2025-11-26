import { useState } from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Loader2 } from "lucide-react";
import { trackGoal } from "@/lib/analytics";
import { useTraffic } from "@/contexts/TrafficContext";

interface LeadFormModalProps {
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
  onSuccess?: () => void;
}

export function LeadFormModal({ open, onOpenChange, calculatorData, onSuccess }: LeadFormModalProps) {
  const { context } = useTraffic();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+7 ");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
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
    
    if (formatted.length === 18) {
      setErrors(prev => ({ ...prev, phone: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (name.trim().length < 2) {
      newErrors.name = "Имя должно содержать минимум 2 символа";
    }

    if (phone.length !== 18) {
      newErrors.phone = "Введите корректный номер телефона";
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Введите корректный email";
    }

    if (!consent) {
      newErrors.consent = "Необходимо согласие на обработку данных";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Call Edge Function to save lead and send notifications
      const { data, error } = await supabase.functions.invoke("handle-lead", {
        body: {
          name: name.trim(),
          phone,
          email: email.trim() || null,
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
          // Pass all context data for analytics
          session_id: context?.sessionId || null,
          intent: context?.intent || null,
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

      if (error || !data?.success) throw error || new Error("Failed to submit lead");

      // Трекаем цель в Яндекс.Метрике
      trackGoal('lead_submit', {
        intent: context?.intent,
        variant: context?.variantId,
        service_type: calculatorData.serviceType,
        price: calculatorData.finalPrice
      });

      toast({
        title: "Заявка принята!",
        description: "Перезвоним в течение 15 минут",
      });

      // Reset form
      setName("");
      setPhone("+7 ");
      setEmail("");
      setConsent(false);
      setErrors({});

      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting lead:", error);
      toast({
        title: "Не удалось отправить заявку",
        description: "Позвоните нам: +7 (906) 998-98-88",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isNameValid = name.trim().length >= 2;
  const isPhoneValid = phone.length === 18;
  const isEmailValid = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">🎯 Оформить заявку</DialogTitle>
          <DialogDescription>
            Перезвоним в течение 15 минут
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Name field */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Имя <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (e.target.value.trim().length >= 2) {
                    setErrors(prev => ({ ...prev, name: "" }));
                  }
                }}
                placeholder="Иван Иванов"
                className={errors.name ? "border-destructive" : isNameValid && name ? "border-green-500" : ""}
              />
              {isNameValid && name && (
                <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
              )}
            </div>
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          {/* Phone field */}
          <div className="space-y-2">
            <Label htmlFor="phone">
              Телефон <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="phone"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="+7 (906) 998-98-88"
                className={errors.phone ? "border-destructive" : isPhoneValid ? "border-green-500" : ""}
              />
              {isPhoneValid && (
                <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
              )}
            </div>
            {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
          </div>

          {/* Email field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email (необязательно)</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (!e.target.value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value)) {
                    setErrors(prev => ({ ...prev, email: "" }));
                  }
                }}
                placeholder="ivan@mail.ru"
                className={errors.email ? "border-destructive" : isEmailValid && email ? "border-green-500" : ""}
              />
              {isEmailValid && email && (
                <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
              )}
            </div>
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>

          {/* Consent checkbox */}
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="consent"
                checked={consent}
                onCheckedChange={(checked) => {
                  setConsent(checked as boolean);
                  if (checked) {
                    setErrors(prev => ({ ...prev, consent: "" }));
                  }
                }}
                className={errors.consent ? "border-destructive" : ""}
              />
              <label
                htmlFor="consent"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Согласен с{" "}
                <Link to="/privacy" className="text-primary hover:underline" target="_blank">
                  политикой конфиденциальности
                </Link>{" "}
                <span className="text-destructive">*</span>
              </label>
            </div>
            {errors.consent && <p className="text-sm text-destructive">{errors.consent}</p>}
          </div>

          {/* Calculator summary */}
          <div className="bg-muted p-4 rounded-lg space-y-1 text-sm">
            <p className="flex justify-between">
              <span className="text-muted-foreground">📐 Площадь:</span>
              <span className="font-medium">{calculatorData.area} м²</span>
            </p>
            <p className="flex justify-between">
              <span className="text-muted-foreground">💰 Итого:</span>
              <span className="font-medium text-lg">
                {calculatorData.finalPrice.toLocaleString("ru-RU")}₽
                {calculatorData.discount > 0 && (
                  <span className="text-green-600 ml-2">
                    (скидка {calculatorData.discount}%)
                  </span>
                )}
              </span>
            </p>
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Отправка...
              </>
            ) : (
              "Отправить заявку"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
