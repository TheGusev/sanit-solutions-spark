import { Link } from "react-router-dom";
import { galleryItems } from "@/data/galleryItems";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, ArrowRight } from "lucide-react";

const GalleryPreview = () => {
  // Показываем 3 последние работы
  const featuredItems = galleryItems.slice(0, 3);

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Наши работы: <span className="text-primary">До и После</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Убедитесь в качестве наших услуг на реальных примерах
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {featuredItems.map((item) => (
            <Link
              key={item.id}
              to="/gallery"
              className="group relative bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 animate-slide-in"
            >
              {/* Визуальное сравнение */}
              <div className="flex items-center justify-center p-12 bg-gradient-to-br from-muted/30 to-muted/10">
                <span className="text-6xl transition-transform group-hover:scale-110 duration-300">
                  {item.beforeEmoji}
                </span>
                <span className="mx-6 text-3xl text-primary font-bold">→</span>
                <span className="text-6xl transition-transform group-hover:scale-110 duration-300">
                  {item.afterEmoji}
                </span>
              </div>

              {/* Информация */}
              <div className="p-6">
                <Badge variant="secondary" className="mb-3">
                  {item.category}
                </Badge>
                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {item.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {item.date}
                  </span>
                </div>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  Смотреть все работы →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link to="/gallery">
            <Button size="lg" variant="outline" className="group">
              Смотреть все работы
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GalleryPreview;
