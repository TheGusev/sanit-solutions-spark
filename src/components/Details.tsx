const details = [
  {
    icon: "🔬",
    title: "Профессиональная диагностика",
    description: "Выезд специалиста для оценки ситуации и составления плана работ. Определяем масштаб проблемы и подбираем оптимальное решение."
  },
  {
    icon: "💊",
    title: "Сертифицированные препараты",
    description: "Используем только профессиональные средства с подтверждёнными документами. Безопасно для людей и животных."
  },
  {
    icon: "📋",
    title: "Официальное оформление",
    description: "Предоставляем все необходимые документы: договор, акт выполненных работ, сертификаты на препараты."
  },
  {
    icon: "🛡️",
    title: "Гарантия качества",
    description: "Гарантируем результат на все виды услуг. При необходимости проводим повторную обработку бесплатно."
  },
  {
    icon: "💰",
    title: "Гибкая система скидок",
    description: "Скидки от площади помещения, постоянным клиентам, при заключении договоров на обслуживание."
  },
  {
    icon: "⚡",
    title: "Экстренный выезд",
    description: "Срочная обработка в течение 2-х часов по Москве. Работаем 24/7 без выходных и праздников."
  }
];

const Details = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-slide-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Почему <span className="text-primary">выбирают нас</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Надёжность, качество и профессионализм в каждой детали
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {details.map((detail, index) => (
            <div
              key={index}
              className="bg-card p-8 rounded-2xl shadow-sm hover-lift animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-5xl mb-4">{detail.icon}</div>
              <h3 className="text-xl font-bold mb-3">{detail.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{detail.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Details;
