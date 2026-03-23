/**
 * Маппинг ответов квиза на ориентировочные цены.
 * Данные синхронизированы с servicePrices.ts и тарифами сервисов.
 */
export const quizPriceMaps: Record<string, { stepIndex: number; prices: Record<string, string> }> = {
  dezinfekciya: {
    stepIndex: 0,
    prices: {
      "Квартира": "от 1 000 ₽",
      "Офис": "от 1 800 ₽",
      "Склад / производство": "от 2 500 ₽",
      "Кафе / ресторан": "от 2 500 ₽",
      "Медучреждение": "от 3 500 ₽",
    },
  },
  dezinsekciya: {
    stepIndex: 1,
    prices: {
      "Квартира": "от 1 200 ₽",
      "Частный дом": "от 2 000 ₽",
      "Ресторан / кафе": "от 3 500 ₽",
      "Общежитие": "от 2 500 ₽",
      "Склад / производство": "от 3 000 ₽",
    },
  },
  deratizaciya: {
    stepIndex: 1,
    prices: {
      "Квартира": "от 1 400 ₽",
      "Частный дом": "от 2 000 ₽",
      "Подвал / чердак": "от 2 000 ₽",
      "Склад": "от 2 500 ₽",
      "Ресторан / кафе": "от 3 000 ₽",
    },
  },
  ozonirovanie: {
    stepIndex: 0,
    prices: {
      "Квартира": "от 1 500 ₽",
      "Офис": "от 2 000 ₽",
      "Кафе / ресторан": "от 2 500 ₽",
      "Склад / производство": "от 3 000 ₽",
    },
  },
  dezodoraciya: {
    stepIndex: 0,
    prices: {
      "Квартира": "от 1 200 ₽",
      "Офис": "от 1 800 ₽",
      "После пожара": "от 2 500 ₽",
    },
  },
  demerkurizaciya: {
    stepIndex: 0,
    prices: {
      "Квартира": "от 3 000 ₽",
      "Офис": "от 4 000 ₽",
    },
  },
  "obrabotka-uchastkov": {
    stepIndex: 1,
    prices: {
      "до 6 соток": "от 4 000 ₽",
      "6–10 соток": "от 5 500 ₽",
      "10–20 соток": "от 8 000 ₽",
      "более 20 соток": "от 12 000 ₽",
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
