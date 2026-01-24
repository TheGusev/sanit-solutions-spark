import { Link } from 'react-router-dom';
import { getMainPests } from '@/data/pestImages';
import AnimatedSection from '@/components/AnimatedSection';

export default function PestGallery() {
  const mainPests = getMainPests();

  // Определяем тип услуги по slug вредителя
  const getServiceType = (slug: string): string => {
    return ['krysy', 'myshi', 'kroty'].includes(slug) ? 'deratizaciya' : 'dezinsekciya';
  };

  return (
    <AnimatedSection className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          С какими вредителями мы боремся
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {mainPests.map((pest) => (
            <Link 
              key={pest.slug}
              to={`/uslugi/${getServiceType(pest.slug)}/${pest.slug}`}
              className="group"
            >
              <div className="relative rounded-xl overflow-hidden aspect-square bg-background shadow-md hover:shadow-xl transition-all">
                <img 
                  src={pest.image}
                  alt={pest.altText}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                  width="200"
                  height="200"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <span className="text-white font-semibold text-sm md:text-base block text-center">
                    {pest.name}
                  </span>
                  <span className="text-white/70 text-xs block text-center">
                    Подробнее →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
