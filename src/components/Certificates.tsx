import { useState } from "react";
import { certificates, Certificate } from "@/data/certificates";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";

const Certificates = () => {
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openCertificate = (cert: Certificate) => {
    setSelectedCertificate(cert);
    setIsOpen(true);
  };

  const navigateCertificate = (direction: "prev" | "next") => {
    if (!selectedCertificate) return;
    const currentIndex = certificates.findIndex(c => c.id === selectedCertificate.id);
    const newIndex = direction === "prev" 
      ? (currentIndex - 1 + certificates.length) % certificates.length
      : (currentIndex + 1) % certificates.length;
    setSelectedCertificate(certificates[newIndex]);
  };

  return (
    <section className="py-10 md:py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4">
            Лицензии и сертификаты
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Все документы подтверждают нашу квалификацию и право на оказание услуг
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {certificates.map((cert, index) => (
          <div
            key={cert.id}
            className="bg-card rounded-xl md:rounded-2xl p-4 md:p-6 hover-lift group cursor-pointer border border-border/50 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => openCertificate(cert)}
          >
            <div className="flex items-center gap-3 md:block mb-3 md:mb-0">
              <div className="flex-shrink-0 md:w-16 md:h-16 md:mb-4 md:rounded-xl md:bg-primary/10 flex items-center justify-center md:group-hover:bg-primary/20 transition-all md:group-hover:scale-110">
                {(() => {
                  const Icon = cert.icon;
                  return <Icon className="w-7 h-7 md:w-8 md:h-8 text-primary" />;
                })()}
              </div>
              <div>
                <Badge variant="secondary" className="mb-1 md:mb-3">
                  {cert.date}
                </Badge>
                <h3 className="font-bold text-base md:text-lg md:mb-2 group-hover:text-primary transition-colors">
                  {cert.title}
                </h3>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {cert.issuer}
            </p>
            <p className="text-xs text-primary font-mono mb-4">
              {cert.number}
            </p>
            <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="outline" size="sm" className="w-full">
                Смотреть документ →
              </Button>
            </div>
          </div>
          ))}
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          {selectedCertificate && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigateCertificate("prev")}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Badge variant="secondary" className="text-base px-4 py-1">
                  {selectedCertificate.date}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigateCertificate("next")}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>

              <div className="text-center py-12 bg-muted/30 rounded-xl">
                <div className="w-32 h-32 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                  {(() => {
                    const Icon = selectedCertificate.icon;
                    return <Icon className="w-20 h-20 text-primary" />;
                  })()}
                </div>
                <h2 className="text-3xl font-bold mb-2">
                  {selectedCertificate.title}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {selectedCertificate.issuer}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-sm text-muted-foreground mb-1">
                    Номер документа
                  </h3>
                  <p className="font-mono text-lg text-primary">
                    {selectedCertificate.number}
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-muted-foreground mb-1">
                    Описание
                  </h3>
                  <p className="text-foreground leading-relaxed">
                    {selectedCertificate.description}
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1" disabled>
                    <Download className="mr-2 h-4 w-4" />
                    Скачать копию
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      setIsOpen(false);
                      setTimeout(() => {
                        const calculatorElement = document.getElementById('calculator');
                        if (calculatorElement) {
                          calculatorElement.scrollIntoView({ behavior: 'smooth' });
                        }
                      }, 300);
                    }}
                  >
                    Заказать услугу
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Certificates;
