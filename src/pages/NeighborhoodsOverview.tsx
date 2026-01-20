import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MapPin, Clock, Phone, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { neighborhoods, getNeighborhoodsByDistrict } from '@/data/neighborhoods';
import { SEO_CONFIG } from '@/lib/seo';

// Group neighborhoods by district
const districtGroups = [
  { id: 'cao', name: 'ЦАО', fullName: 'Центральный округ' },
  { id: 'sao', name: 'САО', fullName: 'Северный округ' },
  { id: 'svao', name: 'СВАО', fullName: 'Северо-Восточный округ' },
  { id: 'vao', name: 'ВАО', fullName: 'Восточный округ' },
  { id: 'yuvao', name: 'ЮВАО', fullName: 'Юго-Восточный округ' },
  { id: 'yao', name: 'ЮАО', fullName: 'Южный округ' },
  { id: 'yzao', name: 'ЮЗАО', fullName: 'Юго-Западный округ' },
  { id: 'zao', name: 'ЗАО', fullName: 'Западный округ' },
  { id: 'szao', name: 'СЗАО', fullName: 'Северо-Западный округ' },
  { id: 'nao', name: 'НАО', fullName: 'Новомосковский округ' },
  { id: 'tao', name: 'ТАО', fullName: 'Троицкий округ' },
  { id: 'zelao', name: 'ЗелАО', fullName: 'Зеленоградский округ' },
];

const NeighborhoodsOverview = () => {
  const totalNeighborhoods = neighborhoods?.length || 0;

  // Fallback if data not loaded
  if (!neighborhoods || totalNeighborhoods === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Загрузка районов...</h1>
            <p className="text-muted-foreground">Пожалуйста, подождите</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Schema.org
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Районы Москвы — услуги дезинфекции",
    "description": `Профессиональная дезинфекция по ${totalNeighborhoods} районам Москвы. Выезд от 15 минут.`,
    "numberOfItems": totalNeighborhoods,
    "itemListElement": neighborhoods.slice(0, 20).map((n, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "url": `${SEO_CONFIG.baseUrl}/rajony/${n.slug}`,
      "name": `Дезинфекция в ${n.name}`
    }))
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Главная", "item": SEO_CONFIG.baseUrl },
      { "@type": "ListItem", "position": 2, "name": "Районы Москвы", "item": `${SEO_CONFIG.baseUrl}/rajony` }
    ]
  };

  const breadcrumbItems = [
    { label: "Районы Москвы" }
  ];

  return (
    <>
      <Helmet>
        <title>{`Дезинфекция по районам Москвы — ${totalNeighborhoods} районов | Санитарные Решения`}</title>
        <meta name="description" content={`Профессиональная дезинфекция, дезинсекция и дератизация по всем ${totalNeighborhoods} районам Москвы. Выезд от 15 минут. Гарантия 1 год. Звоните!`} />
        <link rel="canonical" href={`${SEO_CONFIG.baseUrl}/rajony`} />
        <link rel="alternate" hrefLang="ru" href={`${SEO_CONFIG.baseUrl}/rajony`} />
        <link rel="alternate" hrefLang="x-default" href={`${SEO_CONFIG.baseUrl}/rajony`} />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        
        {/* Open Graph */}
        <meta property="og:title" content={`Дезинфекция по районам Москвы — ${totalNeighborhoods} районов`} />
        <meta property="og:description" content={`Профессиональная дезинфекция по всем ${totalNeighborhoods} районам Москвы. Выезд от 15 минут.`} />
        <meta property="og:url" content={`${SEO_CONFIG.baseUrl}/rajony`} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={SEO_CONFIG.ogImage} />
        <meta property="og:locale" content={SEO_CONFIG.locale} />
        <meta property="og:site_name" content={SEO_CONFIG.companyName} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={SEO_CONFIG.ogImage} />
        
        {/* Schema.org */}
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <Header />

      <main className="min-h-screen pt-20">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        {/* Hero */}
        <section className="py-12 md:py-16 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Дезинфекция по районам Москвы
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-3xl">
              Работаем во всех {totalNeighborhoods} районах Москвы. 
              Выезд от 15 минут. Профессиональная обработка от насекомых и грызунов с гарантией.
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-4 mb-8">
              <Badge className="bg-primary text-primary-foreground py-2 px-4 text-base">
                <MapPin className="w-4 h-4 mr-2" />
                {totalNeighborhoods} районов
              </Badge>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 py-2 px-4 text-base">
                <Clock className="w-4 h-4 mr-2" />
                Выезд 15-60 мин
              </Badge>
              <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 py-2 px-4 text-base">
                от 1000₽
              </Badge>
            </div>

            <Button size="lg" asChild>
              <a href={`tel:${SEO_CONFIG.phoneClean}`}>
                <Phone className="w-5 h-5 mr-2" />
                {SEO_CONFIG.phone}
              </a>
            </Button>
          </div>
        </section>

        {/* Districts Grid */}
        {districtGroups.map((district) => {
          const districtNeighborhoods = getNeighborhoodsByDistrict(district.id);
          if (districtNeighborhoods.length === 0) return null;

          return (
            <section key={district.id} className="py-8 border-b border-border">
              <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                      {district.name}
                      <span className="text-muted-foreground font-normal text-base">
                        — {district.fullName}
                      </span>
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {districtNeighborhoods.length} районов
                    </p>
                  </div>
                  <Link 
                    to={`/uslugi/dezinfekciya-${district.id}`}
                    className="hidden sm:inline-flex items-center gap-1 text-primary hover:underline text-sm"
                  >
                    Весь округ <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {districtNeighborhoods.map((n) => (
                    <Link key={n.slug} to={`/rajony/${n.slug}`}>
                      <Card className="h-full hover:shadow-md transition-all hover:-translate-y-0.5 hover:border-primary/50">
                        <CardContent className="p-3 text-center">
                          <h3 className="font-medium text-sm">{n.name}</h3>
                          <p className="text-xs text-muted-foreground">{n.responseTime}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          );
        })}

        {/* SEO Text */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <h2 className="text-2xl font-bold mb-4">
                Дезинфекция, дезинсекция и дератизация по районам Москвы
              </h2>
              <div className="prose dark:prose-invert max-w-none text-muted-foreground">
                <p>
                  Компания «Санитарные Решения» оказывает услуги профессиональной дезинфекции, 
                  дезинсекции и дератизации во всех {totalNeighborhoods} районах Москвы. 
                  Независимо от того, в каком районе вы находитесь — в центре или на окраине — 
                  мы приедем и решим проблему с вредителями.
                </p>
                <p>
                  Мы работаем как с жилыми помещениями (квартиры, частные дома), 
                  так и с коммерческими объектами (рестораны, кафе, офисы, склады, производства). 
                  Для каждого района мы учитываем его специфику: тип застройки, 
                  состояние домов, типичные проблемы с вредителями.
                </p>
                <p>
                  Среднее время выезда в центральные районы — 15-30 минут, 
                  в отдалённые районы — до 60 минут. Работаем круглосуточно, 
                  без выходных и праздников. Даём гарантию на все виды работ.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Нужна дезинфекция в вашем районе?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Позвоните нам — приедем в любой район Москвы за 15-60 минут
            </p>
            <Button size="lg" variant="secondary" asChild>
              <a href={`tel:${SEO_CONFIG.phoneClean}`}>
                <Phone className="w-5 h-5 mr-2" />
                {SEO_CONFIG.phone}
              </a>
            </Button>
          </div>
        </section>

        {/* Link to Districts Overview */}
        <section className="py-8">
          <div className="container mx-auto px-4 text-center">
            <Link 
              to="/uslugi/po-okrugam-moskvy"
              className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
            >
              Смотреть услуги по округам Москвы →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default NeighborhoodsOverview;
