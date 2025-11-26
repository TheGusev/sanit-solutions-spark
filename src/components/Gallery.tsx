import { useState } from "react";
import { galleryItems, GalleryItem } from "@/data/galleryItems";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import BeforeAfterSlider from "./BeforeAfterSlider";
import { MapPin, Calendar, AlertCircle, CheckCircle2 } from "lucide-react";

const Gallery = () => {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("Все");

  const categories = ["Все", "Дезинфекция", "Дезинсекция", "Дератизация", "Озонирование"];

  const filteredItems = selectedCategory === "Все" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  const scrollToCalculator = () => {
    setSelectedItem(null);
    setTimeout(() => {
      const element = document.getElementById("calculator");
      element?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <section id="gallery" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Наши работы: <span className="text-primary">До и После</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Реальные результаты нашей работы. Каждый проект — это решенная проблема и довольный клиент
          </p>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto gap-2 bg-muted/50 p-2">
            {categories.map((category) => (
              <TabsTrigger 
                key={category} 
                value={category}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="group relative bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer animate-slide-in"
                >
                  {/* Визуальное сравнение */}
                  <div className="flex items-center justify-center p-12 bg-gradient-to-br from-muted/30 to-muted/10 relative">
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
                    <p className="text-sm text-muted-foreground mb-4">
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
                      Подробнее →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Модальное окно с деталями */}
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedItem && (
              <>
                <DialogHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <DialogTitle className="text-2xl mb-2">{selectedItem.title}</DialogTitle>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Badge variant="secondary">{selectedItem.category}</Badge>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {selectedItem.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {selectedItem.date}
                        </span>
                      </div>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                  {/* Интерактивный слайдер */}
                  <BeforeAfterSlider 
                    beforeEmoji={selectedItem.beforeEmoji}
                    afterEmoji={selectedItem.afterEmoji}
                  />

                  {/* Описание проблемы */}
                  <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-4 border border-red-200 dark:border-red-900">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold text-red-900 dark:text-red-100 mb-2">Проблема</h4>
                        <p className="text-sm text-red-800 dark:text-red-200">{selectedItem.problem}</p>
                      </div>
                    </div>
                  </div>

                  {/* Решение */}
                  <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4 border border-green-200 dark:border-green-900">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold text-green-900 dark:text-green-100 mb-2">Решение</h4>
                        <p className="text-sm text-green-800 dark:text-green-200">{selectedItem.solution}</p>
                      </div>
                    </div>
                  </div>

                  {/* CTA кнопка */}
                  <div className="bg-muted/50 rounded-lg p-6 text-center">
                    <p className="text-lg font-semibold mb-4">
                      Нужна такая же услуга?
                    </p>
                    <Button 
                      size="lg" 
                      onClick={scrollToCalculator}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Рассчитать стоимость
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default Gallery;
