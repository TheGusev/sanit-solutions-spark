import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Phone, MessageCircle, MapPin, Clock, Mail, Car } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { useParallax } from "@/hooks/useParallax";

const Contact = () => {
  const parallaxOffset = useParallax(0.2);

  const handleCallRequest = () => {
    const phone = prompt("Введите ваш номер телефона:");
    if (phone) {
      toast.success("Спасибо! Мы перезвоним вам в течение 5 минут!", {
        description: "Наш специалист свяжется с вами для консультации",
      });
    }
  };

  return (
    <section id="contact" className="py-20 bg-pattern relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-pattern parallax-bg"
        style={{ transform: `translateY(${parallaxOffset}px)` }}
      />
      <div className="container mx-auto px-4 relative z-10">
        <AnimatedSection animation="scale" className="max-w-4xl mx-auto bg-card rounded-3xl shadow-xl p-8 md:p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Phone className="w-10 h-10 text-primary" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Готовы начать работу?
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Свяжитесь с нами для бесплатной консультации и расчёта стоимости
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <a 
              href="tel:+79069989888"
              className="text-3xl font-bold text-primary hover:text-primary-dark transition-colors"
            >
              +7 (906) 998-98-88
            </a>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              onClick={handleCallRequest}
              size="lg"
              className="bg-primary hover:bg-primary-dark text-primary-foreground font-bold text-lg px-8 py-6 h-auto"
            >
              Заказать звонок
            </Button>

            <a href="https://wa.me/79069989888" target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                className="gradient-success hover:opacity-90 text-success-foreground font-bold text-lg px-8 py-6 h-auto w-full"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Написать в WhatsApp
              </Button>
            </a>

            <a href="https://t.me/The_Suppor_t" target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                className="bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold text-lg px-8 py-6 h-auto w-full"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Написать в Telegram
              </Button>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 text-left">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-bold mb-1">Адрес</h4>
                <p className="text-sm text-muted-foreground">Москва, Центральный округ</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-bold mb-1">Режим работы</h4>
                <p className="text-sm text-muted-foreground">Круглосуточно, без выходных</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-bold mb-1">Email</h4>
                <a href="mailto:west-centro@mail.ru" className="text-sm text-muted-foreground hover:text-primary">
                  west-centro@mail.ru
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Car className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-bold mb-1">Выезд</h4>
                <p className="text-sm text-muted-foreground">По всей Москве и МО</p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default Contact;
