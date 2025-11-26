const badges = [
  {
    icon: "✓",
    title: "Роспотребнадзор",
    description: "Официальная регистрация"
  },
  {
    icon: "✓",
    title: "СЭС",
    description: "Аккредитация службы"
  },
  {
    icon: "✓",
    title: "Экологичность",
    description: "Безопасные препараты"
  },
  {
    icon: "🛡️",
    title: "Гарантия 30 дней",
    description: "Или деньги назад"
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
              className="flex flex-col items-center text-center group hover-lift"
            >
              <div className="w-16 h-16 mb-3 rounded-full bg-success/10 flex items-center justify-center text-3xl group-hover:bg-success/20 transition-colors">
                {badge.icon}
              </div>
              <h3 className="font-bold text-sm md:text-base mb-1">{badge.title}</h3>
              <p className="text-xs text-muted-foreground">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
