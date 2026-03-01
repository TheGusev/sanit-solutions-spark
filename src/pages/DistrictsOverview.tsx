import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { MapPin, Clock, Car, Shield, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { districtPages } from "@/data/districtPages";
import { getDistrictImage } from "@/data/districtImages";
import SectionHeading from "@/components/ui/SectionHeading";

const DistrictsOverview = () => {
  const breadcrumbItems = [
    { label: "Услуги", href: "/#services" },
    { label: "По округам Москвы" }
  ];

  const services = [
    { title: "Дезинфекция", href: "/uslugi/dezinfekciya", price: "от 1000₽" },
    { title: "Дезинсекция", href: "/uslugi/dezinsekciya", price: "от 1200₽" },
    { title: "Дератизация", href: "/uslugi/deratizaciya", price: "от 1400₽" },
    { title: "Озонирование", href: "/uslugi/ozonirovanie", price: "от 1500₽" },
    { title: "Дезодорация", href: "/uslugi/dezodoraciya", price: "от 1000₽" },
    { title: "Демеркуризация", href: "/uslugi/demerkurizaciya", price: "от 3000₽" },
  ];

  return (
    <>
      <Helmet>
        <title>Дезинфекция по округам Москвы — все районы | Санитарные Решения</title>
        <meta name="description" content="Профессиональная дезинфекция, дезинсекция и дератизация во всех округах Москвы: ЦАО, САО, СВАО, ВАО, ЮВАО, ЮАО, ЮЗАО, ЗАО, СЗАО. Выезд от 15 минут." />
        <link rel="canonical" href="https://goruslugimsk.ru/uslugi/po-okrugam-moskvy/" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <Header />

      <main className="min-h-screen pt-20">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs items={breadcrumbItems} />

          {/* Hero */}
          <section className="text-center mb-12">
            <SectionHeading label="ОКРУГА МОСКВЫ" title="Дезинфекция и дезинсекция по округам Москвы" subtitle="Работаем во всех 9 административных округах столицы. Выезд от 15 минут, гарантия результата, доступные цены." />
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="text-sm py-2 px-4">
                <Clock className="w-4 h-4 mr-2" />
                Выезд от 15 минут
              </Badge>
              <Badge variant="secondary" className="text-sm py-2 px-4">
                <Shield className="w-4 h-4 mr-2" />
                Гарантия до 3 лет
              </Badge>
              <Badge variant="secondary" className="text-sm py-2 px-4">
                <MapPin className="w-4 h-4 mr-2" />
                9 округов Москвы
              </Badge>
            </div>
          </section>

          {/* Districts Grid */}
          <section className="mb-16">
            <SectionHeading label="ОКРУГА" title="Выберите ваш округ" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {districtPages.map((district) => {
                const bgImage = getDistrictImage(district.id);
                return (
                  <Link key={district.id} to={`/uslugi/${district.slug}`}>
                    <div 
                      className="relative h-56 rounded-xl overflow-hidden group cursor-pointer"
                      style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                    >
                      {/* Dark gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10 group-hover:from-black/85 transition-all duration-300" />
                      
                      {/* Content */}
                      <div className="relative h-full flex flex-col justify-end p-5 text-white">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-bold">{district.name}</h3>
                          <MapPin className="w-5 h-5 opacity-80" />
                        </div>
                        <p className="text-sm text-white/80 mb-2">{district.fullName}</p>
                        <div className="flex items-center gap-4 text-sm text-white/90">
                          <span className="flex items-center gap-1">
                            <Car className="w-4 h-4" />
                            {district.responseTime}
                          </span>
                          <span className="font-medium">
                            {district.surcharge === 0 ? "Бесплатный выезд" : `+${district.surcharge}₽`}
                          </span>
                        </div>
                        <div className="text-xs text-white/70 mt-2 line-clamp-1">
                          {district.neighborhoods.slice(0, 4).join(", ")}
                          {district.neighborhoods.length > 4 && ` и ещё ${district.neighborhoods.length - 4}`}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Services */}
          <section className="mb-16">
            <SectionHeading label="НАШИ УСЛУГИ" title="Услуги во всех округах" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {services.map((service) => (
                <Link key={service.href} to={service.href}>
                  <div className="h-full rounded-lg border bg-card p-4 text-center hover:shadow-md transition-shadow">
                    <h3 className="font-semibold mb-1">{service.title}</h3>
                    <p className="text-sm text-primary font-medium">{service.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* SEO Text */}
          <section className="prose prose-lg max-w-4xl mx-auto mb-16">
            <h2>Профессиональная дезинфекция во всех округах Москвы</h2>
            <p>
              Компания «Санитарные Решения» предоставляет полный спектр санитарных услуг 
              во всех административных округах Москвы. Наша команда специалистов оперативно 
              выезжает в любой район столицы — от центра до окраин.
            </p>
            <p>
              Мы понимаем, что каждый округ имеет свою специфику: в ЦАО важна работа в ночное 
              время для ресторанов, в спальных районах — доступные цены для жителей, 
              в промышленных зонах — комплексная дератизация.
            </p>
            <h3>Почему выбирают нас?</h3>
            <ul>
              <li>Выезд от 15 минут в центральные районы</li>
              <li>Фиксированные цены без скрытых доплат</li>
              <li>Гарантия результата до 3 лет</li>
              <li>Работа круглосуточно, без выходных</li>
              <li>Сертифицированные препараты</li>
            </ul>
          </section>

          {/* CTA */}
          <section className="bg-primary/10 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Закажите обработку в вашем округе</h2>
            <p className="text-muted-foreground mb-6">
              Позвоните нам или оставьте заявку — мы перезвоним в течение 5 минут
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="tel:84950181817">
                  <Phone className="w-5 h-5 mr-2" />
                  8-495-018-18-17
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contacts">Оставить заявку</Link>
              </Button>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default DistrictsOverview;
