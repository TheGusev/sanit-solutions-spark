import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { MapPin, Clock, Car, Shield, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { districtPages } from "@/data/districtPages";

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
    { title: "Сертификация", href: "/uslugi/sertifikaciya", price: "от 3000₽" },
  ];

  return (
    <>
      <Helmet>
        <title>Дезинфекция по округам Москвы — все районы | Санитарные Решения</title>
        <meta name="description" content="Профессиональная дезинфекция, дезинсекция и дератизация во всех округах Москвы: ЦАО, САО, СВАО, ВАО, ЮВАО, ЮАО, ЮЗАО, ЗАО, СЗАО. Выезд от 15 минут." />
        <link rel="canonical" href="https://goruslugimsk.ru/uslugi/po-okrugam-moskvy" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <Header />

      <main className="min-h-screen pt-20">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs items={breadcrumbItems} />

          {/* Hero */}
          <section className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Дезинфекция и дезинсекция по округам Москвы
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Работаем во всех 9 административных округах столицы. Выезд от 15 минут, 
              гарантия результата, доступные цены.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="text-sm py-2 px-4">
                <Clock className="w-4 h-4 mr-2" />
                Выезд от 15 минут
              </Badge>
              <Badge variant="secondary" className="text-sm py-2 px-4">
                <Shield className="w-4 h-4 mr-2" />
                Гарантия до 1 года
              </Badge>
              <Badge variant="secondary" className="text-sm py-2 px-4">
                <MapPin className="w-4 h-4 mr-2" />
                9 округов Москвы
              </Badge>
            </div>
          </section>

          {/* Districts Grid */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">Выберите ваш округ</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {districtPages.map((district) => (
                <Link key={district.id} to={`/uslugi/${district.slug}`}>
                  <Card className="h-full hover:shadow-lg hover:shadow-russia-red/15 transition-shadow cursor-pointer border-2 hover:border-russia-red">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-primary">{district.name}</h3>
                          <p className="text-sm text-muted-foreground">{district.fullName}</p>
                        </div>
                        <MapPin className="w-6 h-6 text-primary flex-shrink-0" />
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Car className="w-4 h-4 text-muted-foreground" />
                          <span>Выезд: {district.responseTime}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">
                            {district.surcharge === 0 ? "Бесплатный выезд" : `Доплата: ${district.surcharge}₽`}
                          </span>
                        </div>
                      </div>

                      <div className="text-sm text-muted-foreground mb-4">
                        Районы: {district.neighborhoods.slice(0, 4).join(", ")}
                        {district.neighborhoods.length > 4 && ` и ещё ${district.neighborhoods.length - 4}`}
                      </div>

                      <Button variant="outline" className="w-full">
                        Подробнее о {district.name}
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          {/* Services */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">Услуги во всех округах</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {services.map((service) => (
                <Link key={service.href} to={service.href}>
                  <Card className="h-full hover:shadow-md transition-shadow text-center">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-1">{service.title}</h3>
                      <p className="text-sm text-primary font-medium">{service.price}</p>
                    </CardContent>
                  </Card>
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
              <li>Гарантия результата до 1 года</li>
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
                <a href="tel:+79069989888">
                  <Phone className="w-5 h-5 mr-2" />
                  +7 (906) 998-98-88
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
