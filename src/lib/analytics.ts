// Обёртка для интеграции heatmap и session replay сервисов

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
}

declare global {
  interface Window {
    ym?: any;
    hj?: any;
    posthog?: any;
  }
}

let analyticsInitialized = false;

// Абстракция для смены провайдера без изменения кода
export function initAnalytics(config: AnalyticsConfig): void {
  if (analyticsInitialized) return;
  
  switch (config.provider) {
    case 'yandex_metrika':
      if (config.counterId) {
        loadYandexMetrika(config.counterId);
      }
      break;
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
      console.log('Analytics disabled');
      break;
  }
  
  analyticsInitialized = true;
}

export function setUserProperties(props: UserProperties): void {
  // Яндекс.Метрика
  if (window.ym && typeof window.ym === 'function') {
    try {
      window.ym('userParams', {
        session_id: props.session_id,
        intent: props.intent || 'unknown',
        variant: props.variant_id,
        utm_source: props.utm_source || 'direct',
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

// Lazy loading Яндекс.Метрики (не блокирует рендеринг)
function loadYandexMetrika(counterId: string): void {
  const script = document.createElement('script');
  script.async = true;
  script.defer = true;
  script.src = 'https://mc.yandex.ru/metrika/tag.js';
  
  script.onload = () => {
    try {
      window.ym = window.ym || function() { 
        (window.ym.a = window.ym.a || []).push(arguments); 
      };
      window.ym.l = Date.now();
      
      window.ym(counterId, 'init', {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true,
        trackHash: true
      });
      
      console.log('Yandex.Metrika initialized');
    } catch (err) {
      console.debug('Yandex.Metrika init error:', err);
    }
  };
  
  script.onerror = () => {
    console.debug('Failed to load Yandex.Metrika');
  };
  
  document.head.appendChild(script);
}

// Lazy loading Hotjar
function loadHotjar(siteId: string): void {
  const script = document.createElement('script');
  script.async = true;
  script.defer = true;
  
  script.innerHTML = `
    (function(h,o,t,j,a,r){
      h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
      h._hjSettings={hjid:${siteId},hjsv:6};
      a=o.getElementsByTagName('head')[0];
      r=o.createElement('script');r.async=1;
      r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
      a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
  `;
  
  script.onload = () => {
    console.log('Hotjar initialized');
  };
  
  script.onerror = () => {
    console.debug('Failed to load Hotjar');
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
