const reviews = [
  {
    name: "Александр Петров",
    company: "ООО 'СтройКомплекс'",
    text: "Заказывали дезинфекцию офисных помещений площадью 300 м². Работу выполнили быстро и качественно, все документы предоставили в срок. Рекомендуем!",
    rating: 5
  },
  {
    name: "Мария Соколова",
    company: "Частное лицо",
    text: "Обратилась с проблемой насекомых в квартире. Приехали в день обращения, всё объяснили и обработали. Через неделю повторно проверили результат. Очень довольна!",
    rating: 5
  },
  {
    name: "Дмитрий Иванов",
    company: "ИП Иванов Д.С.",
    text: "Сотрудничаем на постоянной основе. Обрабатываем склад ежеквартально. Цены адекватные, качество на высоте. Всегда пунктуальны.",
    rating: 5
  },
  {
    name: "Елена Кузнецова",
    company: "Кафе 'Уют'",
    text: "Нужна была срочная обработка перед проверкой СЭС. Приехали в течение часа, все сделали профессионально. Спасибо за оперативность!",
    rating: 5
  }
];

const Reviews = () => {
  return (
    <section id="reviews" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-slide-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Отзывы наших <span className="text-primary">клиентов</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Более 1000 довольных клиентов по всей Москве
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-card p-8 rounded-2xl shadow-sm hover-lift animate-scale-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold">{review.name}</h4>
                  <p className="text-sm text-muted-foreground">{review.company}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400">⭐</span>
                ))}
              </div>

              <p className="text-muted-foreground leading-relaxed">{review.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
