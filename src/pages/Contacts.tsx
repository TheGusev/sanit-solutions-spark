import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const Contacts = () => {
  const handlePhoneClick = () => {
    window.location.href = "tel:+79069989888";
  };

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/79069989888", "_blank");
  };

  const handleTelegramClick = () => {
    window.open("https://t.me/The_Suppor_t", "_blank");
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
      "telephone": "+7 (906) 998-98-88",
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
        "https://wa.me/79069989888",
        "https://t.me/The_Suppor_t"
      ]
    }
  };

  return (
    <>
      <Helmet>
        <title>Контакты — ООО Санитарные Решения | Дезинфекция в Москве</title>
        <meta 
          name="description" 
          content="Контакты компании ООО Санитарные Решения. Профессиональная дезинфекция, дезинсекция, дератизация в Москве и Московской области. Звоните: +7 (906) 998-98-88"
        />
        <link rel="canonical" href="https://goruslugimsk.ru/contacts" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Контакты — ООО Санитарные Решения" />
        <meta property="og:description" content="Свяжитесь с нами для заказа услуг дезинфекции в Москве и МО" />
        <meta property="og:url" content="https://goruslugimsk.ru/contacts" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="ru_RU" />
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
                    <p className="text-lg font-medium text-foreground">+7 (906) 998-98-88</p>
                  </div>
                </button>

                <button
                  onClick={handleWhatsAppClick}
                  className="flex items-center gap-4 w-full p-3 rounded-lg hover:bg-muted transition-colors text-left"
                >
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">WhatsApp</p>
                    <p className="text-lg font-medium text-foreground">+7 (906) 998-98-88</p>
                  </div>
                </button>

                <button
                  onClick={handleTelegramClick}
                  className="flex items-center gap-4 w-full p-3 rounded-lg hover:bg-muted transition-colors text-left"
                >
                  <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <Send className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Telegram</p>
                    <p className="text-lg font-medium text-foreground">@The_Suppor_t</p>
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
