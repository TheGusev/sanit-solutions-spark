import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useTraffic } from "@/contexts/TrafficContext";
import { trackGoal } from "@/lib/analytics";

interface DiscountPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const services = [
  { value: "disinfection", label: "Дезинфекция", icon: "🦠" },
  { value: "disinsection", label: "Дезинсекция", icon: "🐜" },
  { value: "deratization", label: "Дератизация", icon: "🐀" },
  { value: "ozonation", label: "Озонирование", icon: "💨" },
  { value: "complex", label: "Комплексная обработка", icon: "✨" }
];

const DiscountPopup = ({ open, onOpenChange }: DiscountPopupProps) => {
  const { context } = useTraffic();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // Honeypot field
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned) return "";
    
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
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Пожалуйста, введите ваше имя");
      return;
    }
    if (phone.length < 18) {
      toast.error("Пожалуйста, введите корректный номер телефона");
      return;
    }
    if (!consent) {
      toast.error("Необходимо согласие с политикой конфиденциальности");
      return;
    }
    setStep(2);
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) {
      toast.error("Пожалуйста, выберите услугу");
      return;
    }

    setIsSubmitting(true);

    try {
      const leadData = {
        name: name.trim(),
        phone,
        service: selectedService,
        source: "website_discount_popup",
        // Прокидываем все UTM и контекст
        utm_source: context?.utm_source || undefined,
        utm_medium: context?.utm_medium || undefined,
        utm_campaign: context?.utm_campaign || undefined,
        utm_content: context?.utm_content || undefined,
        utm_term: context?.utm_term || undefined,
        keyword: context?.keyword || undefined,
        yclid: context?.yclid || undefined,
        gclid: context?.gclid || undefined,
        session_id: context?.sessionId || undefined,
        intent: context?.intent || undefined,
        variant_id: context?.variantId || undefined,
        device_type: context?.deviceType || undefined,
        first_landing_url: context?.firstLandingUrl || undefined,
        last_page_url: window.location.href,
        website, // honeypot
      };

      const { data, error } = await supabase.functions.invoke("handle-lead", {
        body: leadData,
      });

      if (error) throw error;

      if (data?.success) {
        // Трекаем цель в Яндекс.Метрике
        trackGoal('popup_submit', {
          intent: context?.intent,
          variant: context?.variantId,
          service: selectedService
        });
        
        setStep(3);
        toast.success("Заявка успешно отправлена!");
      } else {
        throw new Error(data?.error || "Ошибка при отправке заявки");
      }
    } catch (error) {
      console.error("Error submitting discount popup form:", error);
      toast.error("Не удалось отправить заявку. Пожалуйста, попробуйте позже.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep(1);
      setName("");
      setPhone("");
      setSelectedService("");
      setConsent(false);
      setWebsite("");
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-muted rounded-t-lg overflow-hidden">
          <div
            className="h-full gradient-accent transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <DialogHeader className="pt-4">
          <DialogTitle className="text-2xl font-bold text-center">
            {step === 1 && "🎁 Получите скидку до 30%!"}
            {step === 2 && "Выберите услугу"}
            {step === 3 && "✅ Заявка принята!"}
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <>
            <div className="gradient-accent p-6 rounded-2xl text-accent-foreground text-center mb-4">
              <p className="text-3xl font-bold mb-2">До -30%</p>
              <p className="text-sm">на первый заказ при заявке сегодня</p>
            </div>

            <form onSubmit={handleStep1Submit} className="space-y-4">
              {/* Honeypot field - hidden from users */}
              <input
                type="text"
                name="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />

              <div>
                <Label htmlFor="popup-name">Ваше имя *</Label>
                <Input
                  id="popup-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Иван Иванов"
                  className={!name.trim() && name ? "border-destructive" : ""}
                  required
                />
              </div>

              <div>
                <Label htmlFor="popup-phone">Телефон *</Label>
                <Input
                  id="popup-phone"
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="+7 (999) 123-45-67"
                  className={phone && phone.length < 18 ? "border-destructive" : ""}
                  required
                />
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="popup-consent"
                  checked={consent}
                  onCheckedChange={(checked) => setConsent(checked as boolean)}
                />
                <label
                  htmlFor="popup-consent"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Согласен с{" "}
                  <Link to="/privacy" className="text-primary hover:underline" target="_blank">
                    политикой конфиденциальности
                  </Link>{" "}
                  <span className="text-destructive">*</span>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-primary-foreground font-bold text-lg py-6 h-auto"
              >
                Продолжить
              </Button>
            </form>
          </>
        )}

        {step === 2 && (
          <form onSubmit={handleStep2Submit} className="space-y-6">
            <RadioGroup value={selectedService} onValueChange={setSelectedService}>
              <div className="space-y-3">
                {services.map((service) => (
                  <div
                    key={service.value}
                    className={`flex items-center space-x-3 border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedService === service.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedService(service.value)}
                  >
                    <RadioGroupItem value={service.value} id={service.value} />
                    <Label
                      htmlFor={service.value}
                      className="flex items-center gap-3 cursor-pointer flex-1"
                    >
                      <span className="text-2xl">{service.icon}</span>
                      <span className="font-medium">{service.label}</span>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1"
              >
                Назад
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary-dark text-primary-foreground font-bold"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Отправка..." : "Отправить заявку"}
              </Button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="text-center py-6 space-y-6">
            <div className="text-6xl mb-4">🎉</div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Спасибо, {name}!</h3>
              <p className="text-muted-foreground">
                Ваша заявка успешно принята. Наш менеджер свяжется с вами в течение 15 минут.
              </p>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium mb-1">Наш телефон:</p>
              <a
                href="tel:+79069989888"
                className="text-xl font-bold text-primary hover:underline"
              >
                +7 (906) 998-98-88
              </a>
            </div>

            <Button
              onClick={handleClose}
              className="w-full bg-primary hover:bg-primary-dark text-primary-foreground font-bold py-6 h-auto"
            >
              Закрыть
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DiscountPopup;
