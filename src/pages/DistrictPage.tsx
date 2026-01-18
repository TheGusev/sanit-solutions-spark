import { useParams, Navigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MapPin, Clock, Shield, Phone, Check, Building, Home, Utensils } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getDistrictById, districtPages } from '@/data/districtPages';

const DistrictPage = () => {
  const { districtId } = useParams<{ districtId: string }>();
  const district = districtId ? getDistrictById(districtId.replace("dezinfekciya-", "")) : undefined;

  if (!district) {
    return <Navigate to="/uslugi/po-okrugam-moskvy" replace />;
  }

  const breadcrumbItems = [
    { label: "Главная", href: "/" },
    { label: "Услуги", href: "/#services" },
    { label: "По округам", href: "/uslugi/po-okrugam-moskvy" },
    { label: district.name }
  ];

  const services = [
    { title: "Дезинфекция", href: "/uslugi/dezinfekciya", price: 1000 + district.surcharge },
    { title: "Дезинсекция", href: "/uslugi/dezinsekciya", price: 1200 + district.surcharge },
    { title: "Дератизация", href: "/uslugi/deratizaciya", price: 1400 + district.surcharge },
    { title: "Озонирование", href: "/uslugi/ozonirovanie", price: 1500 + district.surcharge },
  ];

  const otherDistricts = districtPages.filter(d => d.id !== district.id).slice(0, 4);

  return (
    <>
      <Helmet>
        <title>{district.metaTitle}</title>
        <meta name="description" content={district.metaDescription} />
        <link rel="canonical" href={`https://goruslugimsk.ru/uslugi/${district.slug}`} />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Санитарные Решения",
            "description": district.metaDescription,
            "areaServed": {
              "@type": "AdministrativeArea",
              "name": district.fullName + ", Москва"
            },
            "telephone": "+7-906-998-98-88",
            "priceRange": `от ${1000 + district.surcharge}₽`
          })}
        </script>
      </Helmet>

      <Header />

      <main className="min-h-screen pt-20">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs items={breadcrumbItems} />

          {/* Hero */}
          <section className="mb-12">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant="secondary" className="text-sm">
                <MapPin className="w-4 h-4 mr-1" />
                {district.name}
              </Badge>
              <Badge variant="outline" className="text-sm">
                <Clock className="w-4 h-4 mr-1" />
                {district.responseTime}
              </Badge>
              {district.surcharge === 0 && (
                <Badge className="bg-green-500 text-sm">Бесплатный выезд</Badge>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">{district.h1}</h1>
            
            <p className="text-lg text-muted-foreground max-w-3xl mb-6">
              {district.description.split('\n\n')[0]}
            </p>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <a href="tel:+79069989888">
                  <Phone className="w-5 h-5 mr-2" />
                  Вызвать в {district.name}
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="https://wa.me/79069989888" target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </Button>
            </div>
          </section>

          {/* Features */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Почему мы в {district.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {district.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Neighborhoods */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Районы {district.name}, которые мы обслуживаем</h2>
            <div className="flex flex-wrap gap-2">
              {district.neighborhoods.map((n, idx) => (
                <Badge key={idx} variant="secondary" className="text-sm py-1.5 px-3">
                  {n}
                </Badge>
              ))}
            </div>
          </section>

          {/* Services with prices */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Услуги в {district.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {services.map((service) => (
                <Link key={service.href} to={service.href}>
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardContent className="p-6 text-center">
                      <h3 className="font-bold text-lg mb-2">{service.title}</h3>
                      <p className="text-2xl font-bold text-primary">от {service.price}₽</p>
                      {district.surcharge > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">включая выезд</p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          {/* Popular objects */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Популярные объекты в {district.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {district.popularObjects.map((obj, idx) => (
                <Card key={idx}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {idx === 0 && <Home className="w-5 h-5 text-primary" />}
                      {idx === 1 && <Building className="w-5 h-5 text-primary" />}
                      {idx === 2 && <Utensils className="w-5 h-5 text-primary" />}
                      {obj.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {obj.items.map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Worked streets */}
          <section className="mb-12 bg-muted/30 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">Мы уже работали на этих улицах</h2>
            <p className="text-muted-foreground mb-4">
              Вот некоторые адреса в {district.name}, где мы успешно провели обработку:
            </p>
            <div className="flex flex-wrap gap-2">
              {district.workedStreets.map((street, idx) => (
                <Badge key={idx} variant="outline" className="text-sm">
                  {street}
                </Badge>
              ))}
            </div>
          </section>

          {/* Cases */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Реальные кейсы из {district.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {district.cases.map((c, idx) => (
                <Card key={idx} className="border-l-4 border-l-primary">
                  <CardContent className="p-6">
                    <h3 className="font-bold mb-2">{c.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      {c.location}
                    </p>
                    <p className="text-sm">
                      <Check className="w-4 h-4 inline mr-1 text-green-500" />
                      {c.result}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Частые вопросы про {district.name}</h2>
            <Accordion type="single" collapsible className="max-w-3xl">
              {district.faq.map((item, idx) => (
                <AccordionItem key={idx} value={`faq-${idx}`}>
                  <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* Other districts */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Другие округа Москвы</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {otherDistricts.map((d) => (
                <Link key={d.id} to={`/uslugi/${d.slug}`}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      <h3 className="font-bold text-primary">{d.name}</h3>
                      <p className="text-xs text-muted-foreground">{d.responseTime}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="text-center mt-4">
              <Link to="/uslugi/po-okrugam-moskvy" className="text-primary hover:underline">
                Все округа Москвы →
              </Link>
            </div>
          </section>

          {/* CTA */}
          <section className="bg-primary text-primary-foreground rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Закажите обработку в {district.name}</h2>
            <p className="opacity-90 mb-6">
              Выезд {district.responseTime}. {district.surcharge === 0 ? "Без доплаты за выезд." : `Доплата за выезд: ${district.surcharge}₽.`}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <a href="tel:+79069989888">
                  <Phone className="w-5 h-5 mr-2" />
                  +7 (906) 998-98-88
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <a href="https://wa.me/79069989888" target="_blank" rel="noopener noreferrer">
                  Написать в WhatsApp
                </a>
              </Button>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default DistrictPage;
