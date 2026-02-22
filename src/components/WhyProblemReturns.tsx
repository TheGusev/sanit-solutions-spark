import { AlertTriangle, Bug, Home, Trash2, DoorOpen, Egg, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import AnimatedSection from "@/components/AnimatedSection";

interface ReturnReason {
  icon: string;
  title: string;
  description: string;
}

interface WhyProblemReturnsProps {
  returnReasons: ReturnReason[];
  serviceTitle: string;
}

const iconMap: Record<string, React.ElementType> = {
  Egg,
  Users,
  Bug,
  Trash2,
  Home,
  DoorOpen,
  AlertTriangle,
};

const WhyProblemReturns = ({ returnReasons, serviceTitle }: WhyProblemReturnsProps) => {
  if (!returnReasons || returnReasons.length === 0) return null;

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <AnimatedSection animation="fade-up" className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            Почему проблема возвращается
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Самостоятельная борьба и разовые обработки часто не дают стойкого результата
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {returnReasons.map((reason, idx) => {
            const Icon = iconMap[reason.icon] || AlertTriangle;
            return (
              <AnimatedSection key={idx} animation="fade-up" delay={idx * 100}>
                <Card className="h-full border-l-4 border-l-destructive/60 hover:shadow-lg transition-shadow">
                  <CardContent className="p-5">
                    <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5 text-destructive" />
                    </div>
                    <h3 className="text-base font-bold mb-2">{reason.title}</h3>
                    <p className="text-sm text-muted-foreground">{reason.description}</p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyProblemReturns;
