153
/**
 * Шаблон хаб-страницы города Московской области
 * URL: /moscow-oblast/mytishchi
 * 
 * SEO: Дезинсекция и дератизация в Мытищах — от 1200₽, выезд 40 мин
 */

import { useParams, Link } from 'react-router-dom';
import NotFound from './NotFound';
import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import AnimatedSection from '@/components/AnimatedSection';
import InternalLinks from '@/components/InternalLinks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Clock, Shield, MapPin, Car, Building2 } from 'lucide-react';
import { getCityBySlug, moscowRegionCities, moscowRegionServices } from '@/data/moscowRegion';
import { servicePages } from '@/data/services';
import { SEO_CONFIG, generateSEOMeta } from '@/lib/seo';

export default function MoscowRegionCityPage() {
  const { citySlug } = useParams<{ citySlug: string }>();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [citySlug]);
  
  if (!citySlug) {
    return <NotFound />;
  }
  
  const city = getCityBySlug(citySlug);
  
  if (!city) {
    return <NotFound />;
  }
  
  // SEO
  const pageTitle = `Дезинсекция и дератизация ${city.prepositional} — от 1200₽ | ${SEO_CONFIG.companyName}`;
  const pageDescription = `Профессиональная дезинсекция, дератизация и дезинфекция ${city.prepositional} от 1200₽ • Выезд ${city.responseTime} • Гарантия 1 год • ${SEO_CONFIG.phone}`;
  const canonicalPath = `/moscow-oblast/${citySlug}`;
  const seoMeta = generateSEOMeta(canonicalPath, pageTitle, pageDescription);
  
  // Breadcrumbs
  const breadcrumbItems = [
    { label: 'Московская область', href: '/moscow-oblast' },
    { label: city.name }
  ];
  
  // Schema.org
  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `${SEO_CONFIG.companyName} ${city.prepositional}`,
    description: pageDescription,
    telephone: SEO_CONFIG.phone,
    url: seoMeta.canonical,
    address: {
      '@type': 'PostalAddress',
      addressLocality: city.name,
      addressRegion: 'Московская область',
      addressCountry: 'RU'
    },
    areaServed: {
      '@type': 'City',
      name: city.name
    },
    priceRange: 'от 1200₽'
  };
  
  // Услуги для отображения
  const availableServices = moscowRegionServices.map(slug => {
    const service = servicePages.find(s => s.slug === slug);
    return service ? {
      slug,
      title: service.title,
      priceFrom: service.priceFrom + city.surcharge,
      description: service.heroSubtitle
    } : null;
  }).filter(Boolean);
  
  // Другие города для перелинковки
  const otherCities = moscowRegionCities.filter(c => c.slug !== citySlug).slice(0, 4);
  
  return (
    <>
      <Helmet>
        <title>{seoMeta.title}</title>
        <meta name="description" content={seoMeta.description} />
        <meta name="robots" content={seoMeta.robots} />
        <link rel="canonical" href={seoMeta.canonical} />
        <link rel="alternate" hrefLang="ru" href={seoMeta.hreflangRu} />
        <link rel="alternate" hrefLang="x-default" href={seoMeta.hreflangDefault} />
        <meta property="og:title" content={seoMeta.ogTitle} />
        <meta property="og:description" content={seoMeta.ogDescription} />
        <meta property="og:url" content={seoMeta.canonical} />
        <meta property="og:image" content={seoMeta.ogImage} />
        <meta property="og:type" content={seoMeta.ogType} />
        <meta property="og:locale" content="ru_RU" />
        <meta property="og:site_name" content="Санитарные Решения" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoMeta.ogTitle} />
        <meta name="twitter:description" content={seoMeta.ogDescription} />
        <meta name="twitter:image" content={seoMeta.ogImage} />
        <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
      </Helmet>
      
      <Header />
      
      <main className="min-h-screen pt-16">
        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-12 md:py-16">
          <div className="container mx-auto px-4">
            <Breadcrumbs items={breadcrumbItems} />
            
            <div className="mt-6 max-w-4xl">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-primary/10 rounded-full text-sm font-medium">
                  Московская область
                </span>
                <span className="px-3 py-1 bg-success/10 text-success rounded-full text-sm font-medium">
                  {city.distance} км от МКАД
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Дезинсекция и дератизация {city.prepositional}
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-6">
                {city.description}
              </p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>Выезд {city.responseTime}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Car className="w-5 h-5 text-primary" />
                  <span>+{city.surcharge}₽ за выезд</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="w-5 h-5 text-primary" />
                  <span>Гарантия 1 год</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="w-5 h-5 text-primary" />
                  <span>{(city.population / 1000).toFixed(0)}k жителей</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="whitespace-normal">
                  <a href={`tel:${SEO_CONFIG.phoneClean}`}>
                    <Phone className="w-5 h-5 mr-2" />
                    {SEO_CONFIG.phone}
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild className="whitespace-normal">
                  <Link to="/#calculator">Рассчитать стоимость</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Services */}
        <AnimatedSection className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center">
              Наши услуги {city.prepositional}
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {availableServices.map((service) => service && (
                <Link
                  key={service.slug}
                to={`/uslugi/${service.slug}`}                  className="block"                >
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle>{service.title}</CardTitle>                    <CardContent>
                                            </CardHeader>
                      <div className="text-2xl font-bold text-primary mb-2">
                        от {service.priceFrom}₽
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {service.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </AnimatedSection>
        
        {/* About City */}
        <AnimatedSection className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">
                Санитарная обработка {city.prepositional}
              </h2>
              
              <div className="prose prose-sm">
                <p>
                  {city.name} — город в Московской области с населением около {(city.population / 1000).toFixed(0)} тысяч человек. 
                  Расстояние от МКАД составляет {city.distance} км, что позволяет нам оперативно приезжать на вызовы.
                </p>
                
                <h3 className="text-lg font-semibold mt-6 mb-3">Почему выбирают нас {city.prepositional}</h3>
                <ul className="space-y-2">
                  {city.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <h3 className="text-lg font-semibold mt-6 mb-3">Работаем рядом с</h3>
                <div className="flex flex-wrap gap-2">
                  {city.landmarks.map((landmark, index) => (
                    <span key={index} className="px-3 py-1 bg-background rounded-full text-sm">
                      {landmark}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
        
        {/* Other Cities */}
        <AnimatedSection className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Работаем в других городах МО
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
              {otherCities.map((otherCity) => (
                <Link
                  key={otherCity.slug}
                  to={`/moscow-oblast/${otherCity.slug}`}
                  className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors text-center"
                >
                  <div className="font-medium">{otherCity.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {otherCity.distance} км от МКАД
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="text-center mt-6">
              <Button variant="outline" asChild>
                <Link to="/moscow-oblast">Все города МО →</Link>
              </Button>
            </div>
          </div>
        </AnimatedSection>
        
        {/* CTA */}
        <AnimatedSection className="py-12 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Вызвать специалиста {city.prepositional}
            </h2>
            <p className="text-lg opacity-90 mb-6">
              Выезд {city.responseTime}. Работаем 24/7.
            </p>
            <Button size="lg" variant="secondary" asChild className="whitespace-normal">
              <a href={`tel:${SEO_CONFIG.phoneClean}`}>
                <Phone className="w-5 h-5 mr-2" />
                {SEO_CONFIG.phone}
              </a>
            </Button>
          </div>
        </AnimatedSection>
        
        {/* Internal Links */}
        <InternalLinks
          currentCity={citySlug}
          title="Услуги в Москве"
        />
      </main>
      
      <Footer />
    </>
  );
}
