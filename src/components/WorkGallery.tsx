import { useState } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

type MediaItem = {
  type: "video" | "image";
  src: string;
  title: string;
  desc: string;
};

const mediaItems: MediaItem[] = [
  { type: "video", src: "/images/work/work-video.mov", title: "Процесс обработки", desc: "Видео с объекта" },
  { type: "image", src: "/images/work/bedroom-disinfection.png", title: "Дезинсекция квартиры", desc: "Обработка спальни от клопов" },
  { type: "image", src: "/images/work/commercial-kitchen.png", title: "Дезинфекция кухни", desc: "Промышленное оборудование" },
  { type: "image", src: "/images/work/plumbing-treatment.png", title: "Герметизация", desc: "Обработка коммуникаций" },
  { type: "image", src: "/images/work/basement-work.png", title: "Техпомещения", desc: "Работа в подвалах" },
  { type: "video", src: "/images/work/fog-treatment-video.mp4", title: "Холодный туман", desc: "Обработка помещения" },
  { type: "video", src: "/images/work/site-work-video.mp4", title: "Работа на объекте", desc: "Реальный выезд" },
  { type: "image", src: "/images/work/fog-generator.jpg", title: "Генератор тумана", desc: "Профессиональное оборудование" },
  { type: "image", src: "/images/work/clean-room.jpg", title: "Результат работы", desc: "Помещение после обработки" },
  { type: "image", src: "/images/work/professional-chemicals.jpg", title: "Препараты", desc: "Сертифицированная химия" },
  { type: "image", src: "/images/work/specialist-documents.jpg", title: "Оформление документов", desc: "Договор и акт" },
  { type: "image", src: "/images/work/pipes-treatment.jpg", title: "Обработка труб", desc: "Работа с коммуникациями" },
  { type: "image", src: "/images/work/corridor-treatment.jpg", title: "Обработка подъезда", desc: "Дезинфекция мест общего пользования" },
  { type: "image", src: "/images/work/specialist-closeup.jpg", title: "Работа специалиста", desc: "Обработка стен и потолков" },
  { type: "image", src: "/images/work/baseboard-treatment.jpg", title: "Обработка плинтусов", desc: "Точечная дезинсекция в квартире" },
  { type: "image", src: "/images/work/kitchen-treatment.jpg", title: "Обработка кухни", desc: "Дезинсекция кухонной зоны" },
  { type: "image", src: "/images/front/restaurant-evening.png", title: "Обработка ресторана", desc: "Дезинсекция общепита" },
];

const INITIAL_COUNT = 8;

const WorkGallery = () => {
  const [showAll, setShowAll] = useState(false);
  const visibleItems = showAll ? mediaItems : mediaItems.slice(0, INITIAL_COUNT);

  return (
    <section className="py-10 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <AnimatedSection animation="fade-up" className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
            Наши <span className="text-primary">работы</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Реальные фото и видео с объектов наших клиентов
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {visibleItems.map((item, index) => (
            <AnimatedSection 
              key={index} 
              animation="fade-up" 
              delay={index * 100}
              className="relative rounded-xl overflow-hidden group aspect-[4/3] shadow-md"
            >
              {item.type === "video" ? (
                <video 
                  src={item.src}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  muted
                  loop
                  playsInline
                  preload="none"
                  onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                  onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                />
              ) : (
                <img 
                  src={item.src} 
                  alt={`${item.title} — ${item.desc}. Санитарные Решения`}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 text-white">
                <p className="font-bold text-sm md:text-base">{item.title}</p>
                <p className="text-xs md:text-sm opacity-80">{item.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {!showAll && mediaItems.length > INITIAL_COUNT && (
          <div className="text-center mt-6">
            <Button
              variant="outline"
              onClick={() => setShowAll(true)}
              className="gap-2"
            >
              Показать все работы ({mediaItems.length})
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default WorkGallery;
