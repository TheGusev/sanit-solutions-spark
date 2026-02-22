import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, ArrowRight } from "lucide-react";

interface ServiceLink {
  slug: string;
  title: string;
}

interface ServiceCTAProps {
  services: ServiceLink[];
}

// Mapping blog tags/categories to relevant services
const tagToServices: Record<string, ServiceLink[]> = {
  тараканы: [
    { slug: "dezinsekciya", title: "Дезинсекция" },
    { slug: "dezinfekciya", title: "Дезинфекция" },
  ],
  клопы: [
    { slug: "dezinsekciya", title: "Дезинсекция" },
    { slug: "dezodoraciya", title: "Дезодорация" },
  ],
  насекомые: [
    { slug: "dezinsekciya", title: "Дезинсекция" },
  ],
  блохи: [
    { slug: "dezinsekciya", title: "Дезинсекция" },
  ],
  грызуны: [
    { slug: "deratizaciya", title: "Дератизация" },
    { slug: "dezinfekciya", title: "Дезинфекция" },
  ],
  крысы: [
    { slug: "deratizaciya", title: "Дератизация" },
  ],
  мыши: [
    { slug: "deratizaciya", title: "Дератизация" },
  ],
  дезинфекция: [
    { slug: "dezinfekciya", title: "Дезинфекция" },
    { slug: "ozonirovanie", title: "Озонирование" },
  ],
  озонирование: [
    { slug: "ozonirovanie", title: "Озонирование" },
    { slug: "dezodoraciya", title: "Дезодорация" },
  ],
  запахи: [
    { slug: "dezodoraciya", title: "Дезодорация" },
    { slug: "ozonirovanie", title: "Озонирование" },
  ],
  плесень: [
    { slug: "dezinfekciya", title: "Дезинфекция" },
    { slug: "ozonirovanie", title: "Озонирование" },
  ],
  ртуть: [
    { slug: "demerkurizaciya", title: "Демеркуризация" },
  ],
  кроты: [
    { slug: "borba-s-krotami", title: "Борьба с кротами" },
  ],
};

export const getServicesForTags = (tags: string[]): ServiceLink[] => {
  const seen = new Set<string>();
  const result: ServiceLink[] = [];

  for (const tag of tags) {
    const lower = tag.toLowerCase();
    for (const [keyword, services] of Object.entries(tagToServices)) {
      if (lower.includes(keyword)) {
        for (const svc of services) {
          if (!seen.has(svc.slug)) {
            seen.add(svc.slug);
            result.push(svc);
          }
        }
      }
    }
  }

  return result.slice(0, 3);
};

const ServiceCTA = ({ services }: ServiceCTAProps) => {
  if (!services || services.length === 0) return null;

  return (
    <section className="py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4">Заказать услугу</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              {services.map((svc) => (
                <Button key={svc.slug} variant="outline" className="min-h-[48px]" asChild>
                  <Link to={`/uslugi/${svc.slug}`}>
                    {svc.title}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              ))}
              <Button className="min-h-[48px]" asChild>
                <a href="tel:+79069989888">
                  <Phone className="w-4 h-4 mr-2" />
                  Позвонить
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ServiceCTA;
