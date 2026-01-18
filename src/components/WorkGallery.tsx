import AnimatedSection from "@/components/AnimatedSection";

const images = [
  { 
    src: "/images/work/bedroom-disinfection.png", 
    title: "Дезинсекция квартиры", 
    desc: "Обработка спальни от клопов" 
  },
  { 
    src: "/images/work/commercial-kitchen.png", 
    title: "Дезинфекция кухни", 
    desc: "Промышленное оборудование" 
  },
  { 
    src: "/images/work/plumbing-treatment.png", 
    title: "Герметизация", 
    desc: "Обработка коммуникаций" 
  },
  { 
    src: "/images/work/basement-work.png", 
    title: "Техпомещения", 
    desc: "Работа в подвалах" 
  },
];

const WorkGallery = () => {
  return (
    <section className="py-10 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <AnimatedSection animation="fade-up" className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
            Наши <span className="text-primary">работы</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Реальные фотографии с объектов наших клиентов
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {images.map((img, index) => (
            <AnimatedSection 
              key={index} 
              animation="fade-up" 
              delay={index * 100}
              className="relative rounded-xl overflow-hidden group aspect-[4/3] shadow-md"
            >
              <img 
                src={img.src} 
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 text-white">
                <p className="font-bold text-sm md:text-base">{img.title}</p>
                <p className="text-xs md:text-sm opacity-80">{img.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkGallery;
