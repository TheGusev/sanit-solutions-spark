/**
 * Маппинг ответов квиза на ориентировочные цены.
 * Данные синхронизированы с servicePrices.ts и тарифами сервисов.
 */
export const quizPriceMaps: Record<string, { stepIndex: number; prices: Record<string, string> }> = {
  dezinfekciya: {
    stepIndex: 0,
    prices: {
      "Квартира": "1 000 ₽",
      "Офис": "1 800 ₽",
      "Склад / производство": "2 500 ₽",
      "Кафе / ресторан": "2 500 ₽",
      "Медучреждение": "3 500 ₽",
    },
  },
  dezinsekciya: {
    stepIndex: 1,
    prices: {
      "Квартира": "1 200 ₽",
      "Частный дом": "2 000 ₽",
      "Ресторан / кафе": "3 500 ₽",
      "Общежитие": "2 500 ₽",
      "Склад / производство": "3 000 ₽",
    },
  },
  deratizaciya: {
    stepIndex: 1,
    prices: {
      "Квартира": "1 400 ₽",
      "Частный дом": "2 000 ₽",
      "Подвал / чердак": "2 000 ₽",
      "Склад": "2 500 ₽",
      "Ресторан / кафе": "3 000 ₽",
    },
  },
  ozonirovanie: {
    stepIndex: 0,
    prices: {
      "Квартира": "1 500 ₽",
      "Офис": "2 000 ₽",
      "Кафе / ресторан": "2 500 ₽",
      "Склад / производство": "3 000 ₽",
    },
  },
  dezodoraciya: {
    stepIndex: 0,
    prices: {
      "Квартира": "1 200 ₽",
      "Офис": "1 800 ₽",
      "После пожара": "2 500 ₽",
    },
  },
  demerkurizaciya: {
    stepIndex: 0,
    prices: {
      "Квартира": "3 000 ₽",
      "Офис": "4 000 ₽",
    },
  },
  "obrabotka-uchastkov": {
    stepIndex: 1,
    prices: {
      "до 6 соток": "4 000 ₽",
      "6–10 соток": "5 500 ₽",
      "10–20 соток": "8 000 ₽",
      "более 20 соток": "12 000 ₽",
    },
  },
  "borba-s-krotami": {
    stepIndex: 0,
    prices: {
      "До 6 соток": "3 000 ₽",
      "6–15 соток": "5 000 ₽",
      "15–30 соток": "8 000 ₽",
      "Больше 30 соток": "по расчёту",
    },
  },
};

export function getServicePriceMap(slug: string) {
  const map = quizPriceMaps[slug];
  if (!map) return undefined;
  return map.prices;
}

export function getServicePriceStepIndex(slug: string): number {
  return quizPriceMaps[slug]?.stepIndex ?? 0;
}
