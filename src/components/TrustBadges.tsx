import { CheckCircle, Shield } from "lucide-react";

const badges = [
  {
    icon: CheckCircle,
    title: "Роспотребнадзор",
    description: "Официальная регистрация",
    color: "text-success"
  },
  {
    icon: CheckCircle,
    title: "СЭС",
    description: "Аккредитация службы",
    color: "text-success"
  },
  {
    icon: CheckCircle,
    title: "Экологичность",
    description: "Безопасные препараты",
    color: "text-success"
  },
  {
    icon: Shield,
    title: "Гарантия 30 дней",
    description: "Или деньги назад",
    color: "text-primary"
  }
];

const TrustBadges = () => {
  return (
    <section className="py-12 bg-background border-y border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {badges.map((badge, index) => (
          <div
            key={index}
            className="flex items-center gap-3 md:flex-col md:text-center group hover-lift"
          >
            <div className="flex-shrink-0 md:w-16 md:h-16 md:mb-3 md:rounded-full md:bg-success/10 flex items-center justify-center md:group-hover:bg-success/20 transition-colors">
              <badge.icon className={`w-5 h-5 md:w-8 md:h-8 ${badge.color}`} />
            </div>
            <div>
              <h3 className="font-bold text-sm md:text-base md:mb-1">{badge.title}</h3>
              <p className="text-xs text-muted-foreground">{badge.description}</p>
            </div>
          </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
