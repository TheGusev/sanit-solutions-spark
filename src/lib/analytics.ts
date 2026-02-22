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
    VK?: {
      Retargeting: {
        Init: (pixelId: string) => void;
        Hit: () => void;
        Event: (eventName: string) => void;
      };
    };
    _tmr?: Array<{id: string; type: string; goal?: string; [key: string]: unknown}>;
  }
}

const TOP_MAIL_RU_ID = '3728465';

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
  
  // VK Pixel - отправка конверсий
  if (window.VK?.Retargeting?.Event) {
    try {
      const vkEventMap: Record<string, string> = {
        'lead_submit': 'lead',
        'popup_submit': 'lead',
        'calc_open': 'view_content',
        'phone_click': 'contact',
        'telegram_click': 'contact'
      };
      
      const vkEvent = vkEventMap[goalName];
      if (vkEvent) {
        window.VK.Retargeting.Event(vkEvent);
        console.log(`VK event tracked: ${vkEvent}`);
      }
    } catch (err) {
      console.debug('VK Pixel error:', err);
    }
  }
  
  // Top.Mail.Ru - отправка конверсий
  if (window._tmr) {
    try {
      const tmrGoalMap: Record<string, string> = {
        'lead_submit': 'lead',
        'popup_submit': 'lead',
        'calc_open': 'view_content',
        'phone_click': 'contact',
        
        'telegram_click': 'contact'
      };
      
      const tmrGoal = tmrGoalMap[goalName];
      if (tmrGoal) {
        window._tmr.push({ id: TOP_MAIL_RU_ID, type: 'reachGoal', goal: tmrGoal });
        console.log(`Top.Mail.Ru goal tracked: ${tmrGoal}`);
      }
    } catch (err) {
      console.debug('Top.Mail.Ru error:', err);
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

// ─── AI Traffic Tracking ───────────────────────────────────────

const AI_DOMAINS = ['perplexity.ai', 'chatgpt.com', 'poe.com', 'claude.ai', 'you.com'];
const AI_UTM_KEYS = ['perplexity', 'chatgpt', 'poe', 'claude', 'you'];

/** Трекинг переходов из AI-ассистентов (referrer + UTM) */
export function trackAIReferral(): void {
  if (typeof window === 'undefined') return;

  const ref = document.referrer.toLowerCase();
  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = (urlParams.get('utm_source') || '').toLowerCase();

  const isAIReferrer = AI_DOMAINS.some(d => ref.includes(d));
  const isAIUtm = AI_UTM_KEYS.some(k => utmSource.includes(k));

  if (isAIReferrer || isAIUtm) {
    const source = isAIReferrer ? ref : utmSource;
    trackGoal('ai_referral', {
      source,
      landing_page: window.location.pathname,
    });
  }
}

/** Эвристика: Direct-трафик на глубокие /blog/ статьи = потенциальный AI-переход */
export function detectDarkAITraffic(): void {
  if (typeof window === 'undefined') return;

  const path = window.location.pathname;
  const ref = document.referrer;

  // Direct (без реферера) на глубокую статью блога (slug > 30 символов)
  const slugMatch = path.match(/^\/blog\/([^/]+)\/?$/);
  if (!slugMatch) return;

  const slug = slugMatch[1];
  if (ref || slug.length < 30) return;

  // Помечаем в Метрике
  if (window.ym && typeof window.ym === 'function') {
    try {
      window.ym(YANDEX_COUNTER_ID, 'params', {
        suspected_ai: true,
        landing_page: path,
      });
    } catch (err) {
      console.debug('Dark AI traffic detection error:', err);
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
