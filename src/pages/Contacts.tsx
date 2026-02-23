import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Phone, Mail, MapPin, Clock, MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Administrative districts
const adminDistricts = [
  { slug: 'dezinfekciya-cao', name: 'ЦАО', fullName: 'Центральный административный округ' },
  { slug: 'dezinfekciya-sao', name: 'САО', fullName: 'Северный административный округ' },
  { slug: 'dezinfekciya-svao', name: 'СВАО', fullName: 'Северо-Восточный административный округ' },
  { slug: 'dezinfekciya-vao', name: 'ВАО', fullName: 'Восточный административный округ' },
  { slug: 'dezinfekciya-yuvao', name: 'ЮВАО', fullName: 'Юго-Восточный административный округ' },
  { slug: 'dezinfekciya-yao', name: 'ЮАО', fullName: 'Южный административный округ' },
  { slug: 'dezinfekciya-yzao', name: 'ЮЗАО', fullName: 'Юго-Западный административный округ' },
  { slug: 'dezinfekciya-zao', name: 'ЗАО', fullName: 'Западный административный округ' },
  { slug: 'dezinfekciya-szao', name: 'СЗАО', fullName: 'Северо-Западный административный округ' },
  { slug: 'dezinfekciya-nao', name: 'НАО', fullName: 'Новомосковский административный округ' },
  { slug: 'dezinfekciya-tao', name: 'ТАО', fullName: 'Троицкий административный округ' },
  { slug: 'dezinfekciya-zelao', name: 'ЗелАО', fullName: 'Зеленоградский административный округ' },
];

// Popular neighborhoods
const popularNeighborhoods = [
  { slug: 'arbat', name: 'Арбат' },
  { slug: 'tverskoy', name: 'Тверской' },
  { slug: 'khamovniki', name: 'Хамовники' },
  { slug: 'maryino', name: 'Марьино' },
  { slug: 'izmaylovo', name: 'Измайлово' },
  { slug: 'sokol', name: 'Сокол' },
  { slug: 'kuntsevo', name: 'Кунцево' },
  { slug: 'yasenevo', name: 'Ясенево' },
  { slug: 'tekstilshchiki', name: 'Текстильщики' },
  { slug: 'perovo', name: 'Перово' },
];
const Contacts = () => {
  const handlePhoneClick = () => {
    window.location.href = "tel:84950181817";
  };

  const handleMaxClick = () => {
    window.open("https://max.ru/u/f9LHodD0cOLnq-s7zesBNQy44zFsmKRWA0ggLQyxcSygnjU6MTchzhcEMBo", "_blank");
  };

  const handleEmailClick = () => {
    window.location.href = "mailto:west-centro@mail.ru";
  };

  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Контакты — ООО Санитарные Решения",
    "description": "Контактная информация компании ООО Санитарные Решения. Дезинфекция, дезинсекция, дератизация в Москве и Московской области.",
    "url": "https://goruslugimsk.ru/contacts",
    "mainEntity": {
      "@type": "LocalBusiness",
      "@id": "https://goruslugimsk.ru/#organization",
      "name": "ООО Санитарные Решения",
      "description": "Профессиональные услуги дезинфекции, дезинсекции и дератизации для бизнеса и частных лиц в Москве и Московской области",
      "url": "https://goruslugimsk.ru",
      "telephone": "8-495-018-18-17",
      "email": "west-centro@mail.ru",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Центральный округ",
        "addressLocality": "Москва",
        "addressRegion": "Московская область",
        "postalCode": "101000",
        "addressCountry": "RU"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "55.7558",
        "longitude": "37.6173"
      },
      "areaServed": [
        {
          "@type": "City",
          "name": "Москва"
        },
        {
          "@type": "State",
          "name": "Московская область"
        }
      ],
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
        ],
        "opens": "00:00",
        "closes": "23:59"
      },
      "priceRange": "₽₽",
      "image": "https://goruslugimsk.ru/og-image.jpg",
      "sameAs": [
        "https://max.ru/u/f9LHodD0cOLnq-s7zesBNQy44zFsmKRWA0ggLQyxcSygnjU6MTchzhcEMBo"
      ]
    }
  };

  return (
    <>
      <Helmet>
        <title>Контакты — ООО Санитарные Решения | Дезинфекция в Москве</title>
        <meta 
          name="description" 
          content="Контакты компании ООО Санитарные Решения. Профессиональная дезинфекция, дезинсекция, дератизация в Москве и Московской области. Звоните: 8-495-018-18-17"
        />
        <link rel="canonical" href="https://goruslugimsk.ru/contacts/" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Контакты — ООО Санитарные Решения" />
        <meta property="og:description" content="Свяжитесь с нами для заказа услуг дезинфекции в Москве и МО" />
        <meta property="og:url" content="https://goruslugimsk.ru/contacts/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://goruslugimsk.ru/og-image.jpg" />
        <meta property="og:locale" content="ru_RU" />
        <meta property="og:site_name" content="Санитарные Решения" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Контакты — ООО Санитарные Решения" />
        <meta name="twitter:description" content="Свяжитесь с нами для заказа услуг дезинфекции в Москве и МО" />
        <meta name="twitter:image" content="https://goruslugimsk.ru/og-image.jpg" />
        <link rel="alternate" hrefLang="ru" href="https://goruslugimsk.ru/contacts/" />
        <link rel="alternate" hrefLang="x-default" href="https://goruslugimsk.ru/contacts/" />
        <meta name="geo.region" content="RU-MOW" />
        <meta name="geo.placename" content="Москва" />
        <meta name="geo.position" content="55.7558;37.6173" />
        <meta name="ICBM" content="55.7558, 37.6173" />
        <script type="application/ld+json">
          {JSON.stringify(contactPageSchema)}
        </script>
      </Helmet>

      <Header />
      
      <main className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-12">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <Breadcrumbs items={[{ label: "Контакты" }]} />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
            Контакты и реквизиты
          </h1>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Contact Information */}
            <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Свяжитесь с нами
              </h2>
              
              <div className="space-y-4">
                <button
                  onClick={handlePhoneClick}
                  className="flex items-center gap-4 w-full p-3 rounded-lg hover:bg-muted transition-colors text-left"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Телефон</p>
                    <p className="text-lg font-medium text-foreground">8-495-018-18-17</p>
                  </div>
                </button>

                <button
                  onClick={handleMaxClick}
                  className="flex items-center gap-4 w-full p-3 rounded-lg hover:bg-muted transition-colors text-left"
                >
                  <div className="w-12 h-12 bg-[#168DE2]/10 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-[#168DE2]" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">MAX</p>
                    <p className="text-lg font-medium text-foreground">Написать</p>
                  </div>
                </button>

                <button
                  onClick={handleEmailClick}
                  className="flex items-center gap-4 w-full p-3 rounded-lg hover:bg-muted transition-colors text-left"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-lg font-medium text-foreground">west-centro@mail.ru</p>
                  </div>
                </button>

                <div className="flex items-center gap-4 p-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Режим работы</p>
                    <p className="text-lg font-medium text-foreground">Круглосуточно, без выходных</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Address and Legal Info */}
            <div className="space-y-6">
              <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Адрес
                </h2>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-foreground font-medium">г. Москва, Центральный округ</p>
                    <p className="text-muted-foreground mt-1">Выезд по всей Москве и Московской области</p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Юридическая информация
                </h2>
                <div className="space-y-3 text-foreground">
                  <p><span className="text-muted-foreground">Компания:</span> ООО «Санитарные Решения»</p>
                  <p><span className="text-muted-foreground">ИНН:</span> 5410169338</p>
                  <p><span className="text-muted-foreground">ОГРН:</span> 1255400030555</p>
                </div>
              </div>

              <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Регион обслуживания
                </h2>
                <div className="space-y-2 text-foreground">
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    Москва (все районы)
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    Московская область
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Districts Section */}
          <div className="mt-12 max-w-5xl mx-auto">
            <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
              <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Районы обслуживания
              </h2>
              
              {/* Administrative Districts */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Административные округа Москвы:</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {adminDistricts.map((district) => (
                    <Link 
                      key={district.slug} 
                      to={`/uslugi/${district.slug}`}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      <span className="text-sm font-medium">{district.name}</span>
                      <span className="text-xs text-muted-foreground hidden sm:inline">({district.fullName.split(' ')[0]})</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Popular Neighborhoods */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Популярные районы:</h3>
                <div className="flex flex-wrap gap-2">
                  {popularNeighborhoods.map((n) => (
                    <Link key={n.slug} to={`/rajony/${n.slug}`}>
                      <Badge variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                        {n.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Link to all districts */}
              <div className="text-center pt-4 border-t">
                <Link 
                  to="/rajony" 
                  className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                >
                  Все 130 районов Москвы
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12 text-center">
            <Button 
              size="lg" 
              onClick={handlePhoneClick}
              className="text-lg px-8 py-6"
            >
              <Phone className="w-5 h-5 mr-2" />
              Заказать обратный звонок
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Contacts;
