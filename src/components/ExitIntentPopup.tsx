import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PrivacyPolicyModal from "@/components/PrivacyPolicyModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useTraffic } from "@/contexts/TrafficContext";
import { trackGoal } from "@/lib/analytics";
import { Gift, Clock, Phone } from "lucide-react";

const ExitIntentPopup = () => {
  const { context } = useTraffic();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [website, setWebsite] = useState(""); // Honeypot
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const showPopup = useCallback(() => {
    // Показываем только 1 раз за сессию
    if (sessionStorage.getItem("exitIntentShown")) return;
    
    // Не показываем если уже была отправлена заявка
    if (sessionStorage.getItem("leadSubmitted")) return;
    
    // Не показываем если на странице менее 5 секунд
    const pageLoadTime = parseInt(sessionStorage.getItem("pageLoadTime") || "0");
    if (Date.now() - pageLoadTime < 5000) return;
    
    sessionStorage.setItem("exitIntentShown", "true");
    setOpen(true);
    
    trackGoal('exit_intent_shown', {
      intent: context?.intent,
      variant: context?.variantId
    });
  }, [context]);

  useEffect(() => {
    // Сохраняем время загрузки страницы
    if (!sessionStorage.getItem("pageLoadTime")) {
      sessionStorage.setItem("pageLoadTime", Date.now().toString());
    }

    // Desktop: отслеживаем уход курсора вверх (к закрытию/навигации)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        showPopup();
      }
    };

    // Mobile: отслеживаем быстрый скролл вверх (попытка уйти)
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      scrollVelocity = lastScrollY - currentScrollY;
      
      // Если быстрый скролл вверх в верхней части страницы
      if (scrollVelocity > 50 && currentScrollY < 100) {
        showPopup();
      }
      
      lastScrollY = currentScrollY;
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [showPopup]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Введите ваше имя");
      return;
    }
    if (phone.length < 18) {
      toast.error("Введите корректный номер телефона");
      return;
    }
    if (!consent) {
      toast.error("Необходимо согласие с политикой конфиденциальности");
      return;
    }

    setIsSubmitting(true);

    try {
      const leadData = {
        name: name.trim(),
        phone,
        service: "exit_intent_callback",
        source: "exit_intent_popup",
        utm_source: context?.utm_source || null,
        utm_medium: context?.utm_medium || null,
        utm_campaign: context?.utm_campaign || null,
        utm_content: context?.utm_content || null,
        utm_term: context?.utm_term || null,
        keyword: context?.keyword || null,
        yclid: context?.yclid || null,
        gclid: context?.gclid || null,
        session_id: context?.sessionId || null,
        intent: context?.intent || 'default',
        variant_id: context?.variantId || null,
        device_type: context?.deviceType || null,
        first_landing_url: context?.firstLandingUrl || null,
        last_page_url: window.location.href,
        website, // honeypot
      };

      const { data, error } = await supabase.functions.invoke("handle-lead", {
        body: leadData,
      });

      if (error) throw error;

      if (data?.success) {
        trackGoal('exit_intent_submit', {
          intent: context?.intent,
          variant: context?.variantId
        });
        
        sessionStorage.setItem("leadSubmitted", "true");
        setSubmitted(true);
        toast.success("Заявка отправлена! Перезвоним через 5 минут");
      } else {
        throw new Error(data?.error || "Ошибка при отправке");
      }
    } catch (error) {
      console.error("Error submitting exit intent form:", error);
      toast.error("Не удалось отправить заявку");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md border-2 border-primary/20">
        <DialogHeader className="pt-2">
          <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            {!submitted ? (
              <>
                <Gift className="h-6 w-6 text-primary" />
                Подождите!
              </>
            ) : (
              "Отлично!"
            )}
          </DialogTitle>
        </DialogHeader>

        {!submitted ? (
          <>
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-2xl text-center mb-4">
              <p className="text-sm text-muted-foreground mb-2">Только сейчас</p>
              <p className="text-3xl font-bold text-primary mb-2">Скидка 15%</p>
              <p className="text-sm text-muted-foreground">при заказе в течение 24 часов</p>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 justify-center">
              <Clock className="h-4 w-4" />
              <span>Перезвоним через 5 минут</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot */}
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
                <Label htmlFor="exit-name">Ваше имя</Label>
                <Input
                  id="exit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Иван"
                  required
                />
              </div>

              <div>
                <Label htmlFor="exit-phone">Телефон</Label>
                <Input
                  id="exit-phone"
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="+7 (999) 123-45-67"
                  required
                />
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="exit-consent"
                  checked={consent}
                  onCheckedChange={(checked) => setConsent(checked as boolean)}
                />
                <label
                  htmlFor="exit-consent"
                  className="text-sm leading-none"
                >
                  Согласен с{" "}
                  <span
                    onClick={() => setPrivacyModalOpen(true)}
                    className="text-primary hover:underline cursor-pointer"
                  >
                    политикой
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full font-bold text-lg py-6 h-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Отправка..." : "Получить скидку 15%"}
              </Button>

              <button
                type="button"
                onClick={handleClose}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Нет, спасибо
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="text-5xl mb-4">🎉</div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Спасибо, {name}!</h3>
              <p className="text-muted-foreground">
                Перезвоним в течение 5 минут
              </p>
            </div>

            <div className="bg-muted p-4 rounded-lg flex items-center justify-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              <a
                href="tel:84950181817"
                className="font-bold text-primary hover:underline"
              >
                8-495-018-18-17
              </a>
            </div>

            <Button onClick={handleClose} className="w-full">
              Закрыть
            </Button>
          </div>
        )}

        <PrivacyPolicyModal
          open={privacyModalOpen}
          onOpenChange={setPrivacyModalOpen}
          onAccept={() => setConsent(true)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ExitIntentPopup;
