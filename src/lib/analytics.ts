// Обёртка для интеграции heatmap и session replay сервисов

const YANDEX_COUNTER_ID = 105828040;

interface AnalyticsConfig {
  provider: 'yandex_metrika' | 'hotjar' | 'posthog' | 'none';
  counterId?: string;
  apiKey?: string;
}

interface UserProperties {
  session_id: string;
  intent: string | null;
  variant_id: string;
  utm_source: string | null;
  utm_campaign: string | null;
  device_type: string;
  ml_segment?: string;
  p_conv?: number;
}

declare global {
  interface Window {
    ym?: (...args: unknown[]) => void;
    hj?: ((...args: unknown[]) => void) & { q?: unknown[][] };
    posthog?: {
      init: (apiKey: string, config: Record<string, unknown>) => void;
      identify: (id: string, props: Record<string, unknown>) => void;
    };
    _hjSettings?: { hjid: number; hjsv: number };
  }
}



let analyticsInitialized = false;

// Абстракция для смены провайдера без изменения кода
// Яндекс.Метрика загружается напрямую из index.html
export function initAnalytics(config: AnalyticsConfig): void {
  if (analyticsInitialized) return;
  
  switch (config.provider) {
    case 'hotjar':
      if (config.apiKey) {
        loadHotjar(config.apiKey);
      }
      break;
    case 'posthog':
      if (config.apiKey) {
        loadPostHog(config.apiKey);
      }
      break;
    case 'none':
    case 'yandex_metrika':
      // Яндекс.Метрика загружена в index.html, никаких действий не требуется
      console.log('Analytics ready');
      break;
  }
  
  analyticsInitialized = true;
}

export function setUserProperties(props: UserProperties): void {
  // Яндекс.Метрика
  if (window.ym && typeof window.ym === 'function') {
    try {
      window.ym(YANDEX_COUNTER_ID, 'userParams', {
        session_id: props.session_id,
        intent: props.intent || 'unknown',
        variant: props.variant_id,
        ml_segment: props.ml_segment || 'unknown',
        p_conv: props.p_conv || 0,
        utm_source: props.utm_source || 'direct',
        utm_campaign: props.utm_campaign || 'none',
        device: props.device_type
      });
    } catch (err) {
      console.debug('Yandex.Metrika error:', err);
    }
  }
  
  // Hotjar
  if (window.hj && typeof window.hj === 'function') {
    try {
      window.hj('identify', props.session_id, {
        intent: props.intent,
        variant: props.variant_id,
        utm_source: props.utm_source
      });
    } catch (err) {
      console.debug('Hotjar error:', err);
    }
  }
  
  // PostHog
  if (window.posthog) {
    try {
      window.posthog.identify(props.session_id, {
        intent: props.intent,
        variant: props.variant_id,
        utm_source: props.utm_source,
        device_type: props.device_type
      });
    } catch (err) {
      console.debug('PostHog error:', err);
    }
  }
}

// ─── URL → slug mapping для pest-specific целей ───────────────
const PATHNAME_SLUG_MAP: Record<string, string> = {
  '/uslugi/dezinsekciya/klopy': 'klopy',
  '/uslugi/dezinsekciya/tarakany': 'tarakany',
  '/uslugi/dezinsekciya/muravyi': 'muravyi',
  '/uslugi/dezinsekciya/blohi': 'blohi',
  '/uslugi/dezinsekciya/kleshchi': 'kleshchi',
  '/uslugi/dezinsekciya/komary': 'komary',
  '/uslugi/dezinsekciya/muhi': 'muhi',
  '/uslugi/dezinsekciya/mol': 'mol',
  '/uslugi/deratizaciya/krysy': 'krysy',
  '/uslugi/deratizaciya/myshi': 'myshi',
  '/uslugi/deratizaciya/kroty': 'kroty',
  '/uslugi/borba-s-krotami': 'kroty',
  '/uslugi/dezinsekciya': 'dezinsekciya',
  '/uslugi/deratizaciya': 'deratizaciya',
  '/uslugi/dezinfekciya': 'dezinfekciya',
  '/uslugi/dezodoraciya': 'dezodoraciya',
  '/uslugi/ozonirovanie': 'ozonirovanie',
  
  '/uslugi/obrabotka-uchastkov': 'uchastki',
  '/sluzhba-dezinsekcii': 'ses',
};

/**
 * Возвращает slug (префикс) на основе текущего URL.
 * Пример: на /uslugi/dezinsekciya/klopy → 'klopy'
 */
export function getYmGoalPrefix(): string {
  if (typeof window === 'undefined') return 'general';

  const pathname = window.location.pathname.replace(/\/$/, '') || '/';

  if (PATHNAME_SLUG_MAP[pathname]) return PATHNAME_SLUG_MAP[pathname];
  if (pathname === '/') return 'main';

  for (const [pattern, slug] of Object.entries(PATHNAME_SLUG_MAP)) {
    if (pathname.startsWith(pattern + '/') || pathname.startsWith(pattern + '?')) {
      return slug;
    }
  }

  return 'general';
}

/**
 * Возвращает pest-specific goal ID на основе текущего URL.
 * Пример: getYmGoalId('lead') на /uslugi/dezinsekciya/klopy → 'lead_klopy'
 */
export function getYmGoalId(actionType: string): string {
  return `${actionType}_${getYmGoalPrefix()}`;
}

// Трекинг целей (конверсий)
export function trackGoal(goalName: string, params?: Record<string, any>): void {
  // Яндекс.Метрика
  if (window.ym && typeof window.ym === 'function') {
    try {
      window.ym(YANDEX_COUNTER_ID, 'reachGoal', goalName, params);
      console.log(`Goal tracked: ${goalName}`, params);
    } catch (err) {
      console.debug('Yandex.Metrika goal error:', err);
    }
  }
  
  // Составная цель all_conversions — срабатывает при любой конверсии
  const ALL_CONV_GOALS = new Set([
    'final_cta_call',
    'calc_calculate', 'service_sticky_call',
    'lead_submit', 'hero_callback_submit', 'phone_click',
    'telegram_click', 'messenger_click'
  ]);

  const isConversion = ALL_CONV_GOALS.has(goalName) ||
    goalName.startsWith('quiz_lead_') ||
    goalName.startsWith('calc_lead_');

  if (isConversion && goalName !== 'all_conversions') {
    if (window.ym && typeof window.ym === 'function') {
      try {
        window.ym(YANDEX_COUNTER_ID, 'reachGoal', 'all_conversions', params);
        console.log('Composite goal tracked: all_conversions');
      } catch (err) {
        console.debug('all_conversions error:', err);
      }
    }
  }
  
}

// Трекинг просмотров страниц с параметрами
export function trackPageView(url: string, params?: Record<string, any>): void {
  if (window.ym && typeof window.ym === 'function') {
    try {
      window.ym(YANDEX_COUNTER_ID, 'hit', url, { params });
    } catch (err) {
      console.debug('Yandex.Metrika hit error:', err);
    }
  }
}


// Lazy loading Hotjar (безопасный метод без innerHTML)
function loadHotjar(siteId: string): void {
  // Валидация siteId - только цифры
  if (!siteId || !/^\d+$/.test(siteId)) {
    console.warn('[Analytics] Invalid Hotjar site ID:', siteId);
    return;
  }

  // Проверка на повторную загрузку
  if (window.hj) {
    console.debug('[Analytics] Hotjar already loaded');
    return;
  }

  // Инициализация через window object (без innerHTML)
  window.hj = function(...args: unknown[]) {
    (window.hj!.q = window.hj!.q || []).push(args);
  };
  window._hjSettings = { hjid: parseInt(siteId, 10), hjsv: 6 };

  // Загрузка внешнего скрипта
  const script = document.createElement('script');
  script.src = `https://static.hotjar.com/c/hotjar-${siteId}.js?sv=6`;
  script.async = true;
  script.defer = true;
  
  script.onload = () => {
    console.debug('[Analytics] Hotjar loaded successfully');
  };
  
  script.onerror = () => {
    console.debug('[Analytics] Failed to load Hotjar');
  };

  document.head.appendChild(script);
}

// Lazy loading PostHog
function loadPostHog(apiKey: string): void {
  const script = document.createElement('script');
  script.async = true;
  script.defer = true;
  script.src = 'https://app.posthog.com/static/array.js';
  
  script.onload = () => {
    try {
      if (window.posthog) {
        window.posthog.init(apiKey, {
          api_host: 'https://app.posthog.com',
          capture_pageview: true,
          capture_pageleave: true
        });
        console.log('PostHog initialized');
      }
    } catch (err) {
      console.debug('PostHog init error:', err);
    }
  };
  
  script.onerror = () => {
    console.debug('Failed to load PostHog');
  };
  
  document.head.appendChild(script);
}
