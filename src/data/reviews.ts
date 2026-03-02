/**
 * Static reviews data for SSR rendering.
 * Used as initial state in Reviews component.
 * On the client, reviews can be refreshed from the database.
 */
export interface StaticReview {
  id: string;
  display_name: string;
  text: string;
  rating: number;
  object_type: string | null;
  created_at: string | null;
}

export const staticReviews: StaticReview[] = [
  {
    id: '1',
    display_name: 'Алексей',
    text: 'Вызывали для обработки квартиры от клопов. Приехали через 30 минут, всё обработали за час. Уже месяц никаких проблем. Спасибо за оперативность!',
    rating: 5,
    object_type: 'Квартира',
    created_at: '2025-01-15T10:00:00Z',
  },
  {
    id: '2',
    display_name: 'Мария',
    text: 'Заказывали дезинфекцию офиса после ремонта. Работали аккуратно, без лишнего шума. Все сертификаты предоставили. Рекомендую!',
    rating: 5,
    object_type: 'Офис',
    created_at: '2025-01-10T14:30:00Z',
  },
  {
    id: '3',
    display_name: 'Дмитрий',
    text: 'Боролись с тараканами в ресторане. Другие компании не помогали, а эти справились с первого раза. Гарантию дали на 2 года.',
    rating: 5,
    object_type: 'Ресторан',
    created_at: '2024-12-20T09:00:00Z',
  },
  {
    id: '4',
    display_name: 'Елена',
    text: 'Обработка от блох в частном доме. Мастер объяснил всю процедуру, дал рекомендации. Результат отличный, блохи исчезли полностью.',
    rating: 5,
    object_type: 'Частный дом',
    created_at: '2024-12-15T11:00:00Z',
  },
  {
    id: '5',
    display_name: 'Сергей',
    text: 'Дератизация склада. Крысы были серьёзной проблемой. После обработки — ни одного грызуна. Обслуживание на высоте.',
    rating: 4,
    object_type: 'Склад',
    created_at: '2024-12-01T16:00:00Z',
  },
  {
    id: '6',
    display_name: 'Ольга',
    text: 'Вызывала для уничтожения моли в квартире. Приехали в тот же день, обработали все шкафы и ковры. Очень довольна результатом!',
    rating: 5,
    object_type: 'Квартира',
    created_at: '2024-11-25T13:00:00Z',
  },
];
