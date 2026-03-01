import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import PrivacyPolicyModal from "@/components/PrivacyPolicyModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Loader2, Clock, Shield, Target } from "lucide-react";
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
  const [honeypot, setHoneypot] = useState("");
  const [consent, setConsent] = useState(true);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
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

    if (!consent) {
      newErrors.consent = "Необходимо согласие на обработку данных";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (honeypot) {
      console.log('🤖 Bot detected via honeypot');
      toast({
        title: "Заявка принята!",
        description: "Перезвоним в течение 15 минут",
      });
      onOpenChange(false);
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    if (!context || !context.initialized) {
      console.warn('⚠️ TrafficContext not initialized - lead may be missing tracking data');
    }

    try {

      const { data, error } = await supabase.functions.invoke("handle-lead", {
        body: {
          name: name.trim(),
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

      if (error || !data?.success) throw error || new Error("Failed to submit lead");

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

      setName("");
      setPhone("+7 ");
      setErrors({});

      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting lead:", error);
      toast({
        title: "Не удалось отправить заявку",
        description: "Позвоните нам: 8-495-018-18-17",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isNameValid = name.trim().length >= 2;
  const isPhoneValid = phone.length === 18;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" /> Оформить заявку
          </DialogTitle>
          <DialogDescription className="flex flex-col gap-1">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-success" />
              Перезвоним в течение 15 минут
            </span>
            <a 
              href="tel:84950181817" 
              className="text-primary font-bold hover:underline"
            >
              или позвоните: 8-495-018-18-17
            </a>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Honeypot field */}
          <input
            type="text"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            style={{ display: 'none' }}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />
          
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
                placeholder="Ваше имя"
                className={`h-12 ${errors.name ? "border-destructive" : isNameValid && name ? "border-success" : ""}`}
              />
              {isNameValid && name && (
                <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-success" />
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
                placeholder="+7 (___) ___-__-__"
                className={`h-12 text-base ${errors.phone ? "border-destructive" : isPhoneValid ? "border-success" : ""}`}
              />
              {isPhoneValid && (
                <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-success" />
              )}
            </div>
            {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
          </div>

          {/* Calculator summary */}
          <div className="bg-muted/50 p-3 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Площадь: {calculatorData.area} м²</p>
              {calculatorData.discount > 0 && (
                <p className="text-xs text-success">Скидка {calculatorData.discount}%</p>
              )}
            </div>
            <p className="text-2xl font-bold text-primary">
              {calculatorData.finalPrice.toLocaleString("ru-RU")}₽
            </p>
          </div>

          {/* Consent */}
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
              className="text-xs text-muted-foreground leading-tight"
            >
              Согласен с{" "}
              <span
                onClick={() => setPrivacyModalOpen(true)}
                className="text-primary hover:underline cursor-pointer"
              >
                политикой конфиденциальности
              </span>
            </label>
          </div>
          {errors.consent && <p className="text-sm text-destructive">{errors.consent}</p>}

          {/* Submit button */}
          <Button
            type="submit"
            className="w-full h-14 text-lg font-bold"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Отправка...
              </>
            ) : (
              "Отправить заявку"
            )}
          </Button>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
            <Shield className="w-3 h-3" />
            <span>Данные защищены</span>
            <span>•</span>
            <span>Без спама</span>
          </div>
        </form>

        <PrivacyPolicyModal
          open={privacyModalOpen}
          onOpenChange={setPrivacyModalOpen}
          onAccept={() => {
            setConsent(true);
            setErrors(prev => ({ ...prev, consent: "" }));
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
