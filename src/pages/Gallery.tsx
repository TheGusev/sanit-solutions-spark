import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Gallery from "@/components/Gallery";
import FloatingButtons from "@/components/FloatingButtons";

const GalleryPage = () => {
  useEffect(() => {
    document.title = "Наши работы — До и После | Санитарные Решения";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24">
        {/* Hero секция */}
        <section className="bg-gradient-to-br from-primary/10 to-background py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Портфолио выполненных работ
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in">
              Более 500 успешно завершенных проектов по дезинфекции, дезинсекции и дератизации 
              в Москве и Московской области. Смотрите результаты нашей работы!
            </p>
          </div>
        </section>

        <Gallery />

        {/* CTA секция */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">
                Нужна профессиональная обработка?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Оставьте заявку прямо сейчас и получите бесплатную консультацию специалиста. 
                Рассчитаем стоимость за 5 минут!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/#calculator"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
                >
                  Рассчитать стоимость
                </a>
                <a
                  href="tel:+74951234567"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8"
                >
                  📞 Позвонить: +7 (495) 123-45-67
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default GalleryPage;
