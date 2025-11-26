import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Contact = () => {
  const handleCallRequest = () => {
    const phone = prompt("Введите ваш номер телефона:");
    if (phone) {
      toast.success("Спасибо! Мы перезвоним вам в течение 5 минут!", {
        description: "Наш специалист свяжется с вами для консультации",
      });
    }
  };

  return (
    <section id="contact" className="py-20 bg-pattern">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-card rounded-3xl shadow-xl p-8 md:p-12 text-center">
          <div className="text-6xl mb-6">📞</div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Готовы начать работу?
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Свяжитесь с нами для бесплатной консультации и расчёта стоимости
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <a 
              href="tel:+74951234567"
              className="text-3xl font-bold text-primary hover:text-primary-dark transition-colors"
            >
              +7 (495) 123-45-67
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

            <a href="https://wa.me/74951234567" target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                className="gradient-success hover:opacity-90 text-success-foreground font-bold text-lg px-8 py-6 h-auto w-full"
              >
                💬 Написать в WhatsApp
              </Button>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 text-left">
            <div className="flex items-start gap-3">
              <div className="text-2xl">📍</div>
              <div>
                <h4 className="font-bold mb-1">Адрес</h4>
                <p className="text-sm text-muted-foreground">Москва, Центральный округ</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="text-2xl">⏰</div>
              <div>
                <h4 className="font-bold mb-1">Режим работы</h4>
                <p className="text-sm text-muted-foreground">Круглосуточно, без выходных</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="text-2xl">📧</div>
              <div>
                <h4 className="font-bold mb-1">Email</h4>
                <p className="text-sm text-muted-foreground">info@sanresheniya.ru</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="text-2xl">🚗</div>
              <div>
                <h4 className="font-bold mb-1">Выезд</h4>
                <p className="text-sm text-muted-foreground">По всей Москве и МО</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
