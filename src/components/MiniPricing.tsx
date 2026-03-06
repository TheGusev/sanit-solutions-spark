import { Microscope, Bug, Rat, Sparkles, Wind, AlertTriangle, Mountain, TreePine, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/ui/SectionHeading";

const services = [
  { icon: Microscope, title: "Дезинфекция квартиры", href: "/uslugi/dezinfekciya" },
  { icon: Bug, title: "Дезинсекция (тараканы, клопы)", href: "/uslugi/dezinsekciya" },
  { icon: Rat, title: "Дератизация", href: "/uslugi/deratizaciya" },
  { icon: Sparkles, title: "Озонирование", href: "/uslugi/ozonirovanie" },
  { icon: Wind, title: "Удаление запахов", href: "/uslugi/dezodoraciya" },
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
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/65 via-slate-900/45 to-slate-900/35 dark:from-slate-950/70 dark:via-slate-950/55 dark:to-slate-950/40" />
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeading
          label="НАШИ УСЛУГИ"
          title="Основные услуги"
          subtitle="Профессиональная санитарная обработка любых объектов"
          className="text-white [&_p]:text-white/80 [&_span]:text-white/60 [&_.tricolor-underline]:hidden"
        />
        <div className="h-[2px] w-24 mx-auto rounded-full bg-gradient-to-r from-sky-400/80 via-cyan-400/80 to-emerald-400/80 -mt-4 mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Link
                key={index}
                to={citySlug ? `/goroda/${citySlug}${service.href}` : service.href}
                className="group"
              >
                <div className="rounded-2xl border border-white/50 bg-white/35 backdrop-blur-xl shadow-[0_18px_40px_rgba(15,23,42,0.25)] p-4 text-center transition hover:border-white/80 hover:bg-white/45 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(15,23,42,0.35)] dark:border-white/25 dark:bg-slate-900/35 dark:hover:bg-slate-900/45">
                  <h3 className="text-sm font-medium text-white mb-3 leading-tight min-h-[2.5rem]">
                    {service.title}
                  </h3>
                  <span className="text-xs text-white/70 flex items-center justify-center">
                    Подробнее
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
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

