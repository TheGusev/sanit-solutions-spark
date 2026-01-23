/**
 * Обзорная страница городов Московской области
 * URL: /moscow-oblast
 * 
 * SEO: Дезинсекция и дератизация в Московской области — от 1200₽
 */

import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import AnimatedSection from '@/components/AnimatedSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, MapPin, Clock, Car } from 'lucide-react';
import { moscowRegionCities } from '@/data/moscowRegion';
import { SEO_CONFIG, generateSEOMeta } from '@/lib/seo';

export default function MoscowRegionOverview() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // SEO
  const pageTitle = `Дезинсекция и дератизация в Московской области — от 1200₽ | ${SEO_CONFIG.companyName}`;
  const pageDescription = `Профессиональная дезинсекция, дератизация и дезинфекция в городах Московской области от 1200₽ ⚡ Выезд от 30 мин ✅ Гарантия 1 год ☎️ ${SEO_CONFIG.phone}`;
  const canonicalPath = '/moscow-oblast';
  const seoMeta = generateSEOMeta(canonicalPath, pageTitle, pageDescription);
  
  // Breadcrumbs
  const breadcrumbItems = [
    { label: 'Московская область' }
  ];
  
  // Schema.org
  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: SEO_CONFIG.companyName,
    description: pageDescription,
    telephone: SEO_CONFIG.phone,
    url: seoMeta.canonical,
    areaServed: moscowRegionCities.map(city => ({
      '@type': 'City',
      name: city.name
    }))
  };
  
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
        <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
      </Helmet>
      
      <Header />
      
      <main className="min-h-screen">
        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-12 md:py-16">
          <div className="container mx-auto px-4">
            <Breadcrumbs items={breadcrumbItems} />
            
            <div className="mt-6 max-w-4xl">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Дезинсекция и дератизация в Московской области
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-6">
                Профессиональное уничтожение насекомых и грызунов в городах Подмосковья. 
                Выезжаем за МКАД, работаем оперативно.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>{moscowRegionCities.length} городов</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>Выезд от 30 мин</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Car className="w-5 h-5 text-primary" />
                  <span>До 25 км от МКАД</span>
                </div>
              </div>
              
              <Button size="lg" asChild className="whitespace-normal">
                <a href={`tel:${SEO_CONFIG.phoneClean}`}>
                  <Phone className="w-5 h-5 mr-2" />
                  {SEO_CONFIG.phone}
                </a>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Cities Grid */}
        <AnimatedSection className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center">
              Города, в которых мы работаем
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {moscowRegionCities.map((city) => (
                <Link key={city.slug} to={`/moscow-oblast/${city.slug}`}>
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center justify-between">
                        {city.name}
                        <span className="text-sm font-normal text-muted-foreground">
                          {city.distance} км
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {city.responseTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Car className="w-4 h-4" />
                          +{city.surcharge}₽
                        </span>
                      </div>
                      <p className="text-sm line-clamp-2">{city.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </AnimatedSection>
        
        {/* CTA */}
        <AnimatedSection className="py-12 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Работаем по всей Московской области
            </h2>
            <p className="text-lg opacity-90 mb-6">
              Позвоните, и мы приедем в ваш город!
            </p>
            <Button size="lg" variant="secondary" asChild className="whitespace-normal">
              <a href={`tel:${SEO_CONFIG.phoneClean}`}>
                <Phone className="w-5 h-5 mr-2" />
                {SEO_CONFIG.phone}
              </a>
            </Button>
          </div>
        </AnimatedSection>
      </main>
      
      <Footer />
    </>
  );
}
