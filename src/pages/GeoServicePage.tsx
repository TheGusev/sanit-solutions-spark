/**
 * === GEO SERVICE PAGE ===
 * Универсальная страница услуги по округу Москвы с интегрированной SEO-системой
 */

import { useParams, Navigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { Phone, Clock, Star, CheckCircle, Building, Home, Utensils } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CalculatorModal } from '@/components/CalculatorModal';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SEO } from '@/components/SEO';
import RelatedPages from '@/components/SEO/RelatedPages';
import { getGeoPage, getGeoPageUrl } from '@/data/geoPages';

export default function GeoServicePage() {
  const { district } = useParams<{ district: string }>();
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  // Support all service types: dezinfekciya, dezinsekciya, deratizaciya
  const slugVariants = [
    `dezinfekciya-${district}`,
    `dezinsekciya-${district}`,
    `deratizaciya-${district}`
  ];
  
  const page = slugVariants.map(getGeoPage).find(p => p !== undefined);

  if (!page) {
    return <Navigate to="/404" replace />;
  }

  const pageUrl = getGeoPageUrl(page);
  const serviceNames: Record<string, string> = {
    dezinfekciya: 'Дезинфекция',
    dezinsekciya: 'Дезинсекция',
    deratizaciya: 'Дератизация'
  };
  const serviceName = serviceNames[page.serviceType] || 'Дезинфекция';

  // Breadcrumb items for SEO
  const breadcrumbItems = page.breadcrumbs.map(crumb => ({
    name: crumb.text,
    url: crumb.url
  }));

  return (
    <>
      {/* Unified SEO Components */}
      <SEO
        pageType="geo"
        path={pageUrl}
        data={{
          service: serviceName,
          district: page.districtInfo.name,
          price: page.serviceType === 'deratizaciya' ? 3000 : 2500
        }}
        customMeta={{
          title: page.seo.title,
          description: page.seo.description,
          keywords: page.seo.keywords.join(', ')
        }}
        includeOrganization
        breadcrumbs={breadcrumbItems}
        service={{
          name: page.seo.h1,
          description: page.seo.description,
          url: pageUrl,
          minPrice: 2000,
          maxPrice: 20000,
          areaServed: [page.districtInfo.fullName, "Москва"]
        }}
      />

      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative min-h-[50vh] flex items-center bg-gradient-to-br from-primary/90 to-accent/80">
          <div className="container mx-auto px-4 py-16 relative z-10">
            {/* Breadcrumbs */}
            <nav className="mb-6">
              <ol className="flex flex-wrap gap-2 text-sm text-white/80">
                {page.breadcrumbs.map((crumb, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    {idx > 0 && <span>/</span>}
                    {idx === page.breadcrumbs.length - 1 ? (
                      <span className="text-white">{crumb.text}</span>
                    ) : (
                      <Link to={crumb.url} className="hover:text-white transition-colors">{crumb.text}</Link>
                    )}
                  </li>
                ))}
              </ol>
            </nav>

            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{page.seo.h1}</h1>
            <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl">{page.hero.subtitle}</p>

            {/* USPs */}
            <div className="flex flex-wrap gap-3 mb-8">
              {page.hero.usps.map((usp, idx) => (
                <span key={idx} className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                  {usp}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              <Button size="lg" onClick={() => setIsCalculatorOpen(true)} className="bg-accent hover:bg-accent/90">
                Рассчитать стоимость
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <a href="tel:+79069989888">📞 Позвонить</a>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 text-white">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="font-bold">{page.stats.rating}</span>
                <span className="text-white/70">рейтинг</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span className="font-bold">{page.stats.avgArrival}</span>
                <span className="text-white/70">выезд</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                <span className="font-bold">{page.stats.objectsCount}</span>
                <span className="text-white/70">объектов</span>
              </div>
            </div>
          </div>
        </section>

        {/* Districts List */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Обслуживаем районы {page.districtInfo.name}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {page.districtInfo.districts.map((districtName, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm">
                  <CheckCircle className="w-4 h-4 text-accent shrink-0" />
                  <span className="text-sm">{districtName}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-2 text-primary font-medium">
              <Clock className="w-5 h-5" />
              <span>Среднее время выезда: {page.districtInfo.arrivalTime}</span>
            </div>
          </div>
        </section>

        {/* Specifics */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Особенности дезинфекции в {page.districtInfo.name}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {page.specifics.map((item, idx) => (
                <div key={idx} className="bg-muted/50 p-6 rounded-xl hover:shadow-lg transition-shadow">
                  <span className="text-4xl mb-4 block">{item.icon}</span>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Pages */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <RelatedPages currentSlug={`geo_${district}`} />
          </div>
        </section>

        {/* Pricing */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Цены на дезинфекцию в {page.districtInfo.name}</h2>
            <p className="text-accent font-medium mb-8">Фиксированные цены без доплат!</p>

            <Tabs defaultValue="apartments" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="apartments" className="gap-2"><Home className="w-4 h-4" /> Квартиры</TabsTrigger>
                <TabsTrigger value="offices" className="gap-2"><Building className="w-4 h-4" /> Офисы</TabsTrigger>
                <TabsTrigger value="restaurants" className="gap-2"><Utensils className="w-4 h-4" /> Кафе</TabsTrigger>
              </TabsList>

              <TabsContent value="apartments">
                <div className="overflow-x-auto">
                  <table className="w-full bg-white rounded-xl overflow-hidden shadow-sm">
                    <thead className="bg-primary text-white">
                      <tr>
                        <th className="p-4 text-left">Тип</th>
                        <th className="p-4 text-left">Площадь</th>
                        <th className="p-4 text-left">Цена</th>
                        <th className="p-4 text-left">Время</th>
                      </tr>
                    </thead>
                    <tbody>
                      {page.pricing.apartments.map((row, idx) => (
                        <tr key={idx} className="border-b border-border hover:bg-muted/30">
                          <td className="p-4">{row.type}</td>
                          <td className="p-4">{row.area}</td>
                          <td className="p-4 font-semibold text-accent">{row.price}</td>
                          <td className="p-4 text-muted-foreground">{row.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="offices">
                <div className="overflow-x-auto">
                  <table className="w-full bg-white rounded-xl overflow-hidden shadow-sm">
                    <thead className="bg-primary text-white">
                      <tr>
                        <th className="p-4 text-left">Площадь</th>
                        <th className="p-4 text-left">Цена</th>
                        <th className="p-4 text-left">Время</th>
                      </tr>
                    </thead>
                    <tbody>
                      {page.pricing.offices.map((row, idx) => (
                        <tr key={idx} className="border-b border-border hover:bg-muted/30">
                          <td className="p-4">{row.area}</td>
                          <td className="p-4 font-semibold text-accent">{row.price}</td>
                          <td className="p-4 text-muted-foreground">{row.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="restaurants">
                <div className="overflow-x-auto">
                  <table className="w-full bg-white rounded-xl overflow-hidden shadow-sm">
                    <thead className="bg-primary text-white">
                      <tr>
                        <th className="p-4 text-left">Тип</th>
                        <th className="p-4 text-left">Цена</th>
                        <th className="p-4 text-left">Периодичность</th>
                      </tr>
                    </thead>
                    <tbody>
                      {page.pricing.restaurants.map((row, idx) => (
                        <tr key={idx} className="border-b border-border hover:bg-muted/30">
                          <td className="p-4">{row.type}</td>
                          <td className="p-4 font-semibold text-accent">{row.price}</td>
                          <td className="p-4 text-muted-foreground">{row.frequency}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-8 text-center">
              <Button size="lg" onClick={() => setIsCalculatorOpen(true)}>
                Рассчитать точную стоимость
              </Button>
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Отзывы клиентов из {page.districtInfo.name}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {page.reviews.map((review, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">{review.district}</span>
                  </div>
                  <p className="text-sm mb-4 italic">"{review.text}"</p>
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium">{review.author}</p>
                      <p className="text-muted-foreground text-xs">{review.role}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{review.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-gradient-to-br from-primary to-accent text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Закажите дезинфекцию в {page.districtInfo.name} прямо сейчас</h2>
            <p className="text-white/90 mb-8">⚡ Приедем за {page.districtInfo.arrivalTime} в любую точку округа</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary" asChild>
                <a href="tel:+79069989888" className="gap-2">
                  <Phone className="w-5 h-5" /> +7 (906) 998-98-88
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" onClick={() => setIsCalculatorOpen(true)}>
                Заказать звонок
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <CalculatorModal open={isCalculatorOpen} onOpenChange={setIsCalculatorOpen} />
    </>
  );
}
