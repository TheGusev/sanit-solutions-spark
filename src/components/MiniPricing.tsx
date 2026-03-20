import { Microscope, Bug, Rat, Sparkles, Wind, AlertTriangle, Mountain, TreePine, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/ui/SectionHeading";

const services = [
  { icon: Microscope, title: "Дезинфекция квартиры", href: "/uslugi/dezinfekciya", bgImage: "/images/services/dezinfekciya-kvartiry-bg.jpg" },
  { icon: Bug, title: "Дезинсекция (тараканы, клопы)", href: "/uslugi/dezinsekciya" },
  { icon: Rat, title: "Дератизация", href: "/uslugi/deratizaciya", bgImage: "/images/services/deratizaciya-bg.jpg" },
  { icon: Sparkles, title: "Озонирование", href: "/uslugi/ozonirovanie" },
  { icon: Wind, title: "Удаление запахов", href: "/uslugi/dezodoraciya", bgImage: "/images/services/dezodoraciya-bg.jpg" },
  { icon: AlertTriangle, title: "Демеркуризация", href: "/uslugi/demerkurizaciya" },
  { icon: Mountain, title: "Борьба с кротами", href: "/uslugi/borba-s-krotami" },
  { icon: TreePine, title: "Обработка участков", href: "/uslugi/obrabotka-uchastkov" },
];

const MiniPricing = ({ citySlug }: { citySlug?: string }) => {
  const scrollToPricing = () => {
    const element = document.getElementById("pricing-by-area");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      className="relative py-10 md:py-16"
      style={{
        backgroundImage: "url('/images/services-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/35" />
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeading
          label="НАШИ УСЛУГИ"
          title="Основные услуги"
          subtitle="Профессиональная санитарная обработка любых объектов"
          className="text-white [&_p]:text-white/80 [&_span]:text-white/60"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Link
                key={index}
                to={citySlug ? `/goroda/${citySlug}${service.href}` : service.href}
                className="group"
              >
                <div
                  className={`rounded-xl p-4 text-center shadow-sm hover:shadow-lg transition-all relative overflow-hidden ${
                    service.bgImage
                      ? "bg-cover bg-center"
                      : "bg-white/20 backdrop-blur-md border border-white/30"
                  }`}
                  style={service.bgImage ? { backgroundImage: `url('${service.bgImage}')` } : undefined}
                >
                  {service.bgImage && <div className="absolute inset-0 bg-black/45" />}
                  <div className="relative z-10">
                    <h3 className="text-sm font-medium text-white mb-3 leading-tight min-h-[2.5rem]">
                      {service.title}
                    </h3>
                    <span className="text-xs text-white/70 flex items-center justify-center">
                      Подробнее
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="text-center">
          <Button
            onClick={scrollToPricing}
            variant="outline"
            size="lg"
            className="font-semibold border-white text-white bg-white/15 backdrop-blur-sm hover:bg-white/25"
          >
            Смотреть полный прайс
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MiniPricing;

