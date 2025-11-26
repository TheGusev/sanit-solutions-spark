// Хук для инициализации и работы с контекстом трафика

import { useEffect, useState } from 'react';
import {
  extractUrlParams,
  generateSessionId,
  getDeviceType,
  saveToStorage,
  loadFromStorage
} from '@/lib/trafficUtils';
import { detectIntent } from '@/lib/intentDetection';

export interface TrafficContext {
  sessionId: string;
  firstLandingUrl: string;
  referrer: string;
  deviceType: 'desktop' | 'tablet' | 'mobile';
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  keyword: string | null;
  yclid: string | null;
  gclid: string | null;
  intent: string | null;
  variantId: string;  // MVT: supports any variant (A, B, C, D, etc.)
  initialized: boolean;
}

const STORAGE_KEY = 'traffic_context';

/**
 * Инициализация контекста трафика при первом заходе
 * Теперь использует ab-optimize для получения оптимального варианта
 */
export async function initializeTrafficContext(): Promise<TrafficContext> {
  // Пытаемся загрузить существующий контекст
  const existing = loadFromStorage<TrafficContext>(STORAGE_KEY);
  
  if (existing && existing.sessionId) {
    // Проверяем, есть ли variantId в существующей сессии
    if (!existing.variantId) {
      // Присваиваем случайный вариант для старых сессий
      existing.variantId = Math.random() < 0.5 ? 'A' : 'B';
      saveToStorage(STORAGE_KEY, existing);
    }
    return { ...existing, initialized: true };
  }
  
  // Создаём новый контекст
  const params = extractUrlParams(window.location.href);
  const deviceType = getDeviceType();
  const intent = detectIntent(params, window.location.pathname);
  const sessionId = generateSessionId();
  
  // Получаем оптимальный вариант от MVT system
  let variantId: string = 'A'; // fallback
  
  try {
    // Динамический импорт supabase только при необходимости
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { data, error } = await supabase.functions.invoke('mvt-optimize', {
      body: {
        test_name: 'main_variant',
        intent: intent || 'default',
        session_id: sessionId
      }
    });
    
    if (!error && data && data.variant_id) {
      variantId = data.variant_id;
      console.log(`✅ MVT variant selected: ${variantId} (confidence: ${data.confidence?.toFixed(2) || 'N/A'}, total variants: ${data.total_variants || 'N/A'})`);
    } else {
      // Fallback на случайный выбор
      variantId = Math.random() < 0.5 ? 'A' : 'B';
      console.warn('⚠️ mvt-optimize unavailable, using random variant:', variantId);
    }
  } catch (err) {
    // Fallback на случайный выбор при ошибке
    variantId = Math.random() < 0.5 ? 'A' : 'B';
    console.error('❌ Error calling mvt-optimize, using random variant:', err);
  }
  
  const newContext: TrafficContext = {
    sessionId,
    firstLandingUrl: window.location.href,
    referrer: document.referrer || '',
    deviceType,
    utm_source: params.utm_source || null,
    utm_medium: params.utm_medium || null,
    utm_campaign: params.utm_campaign || null,
    utm_content: params.utm_content || null,
    utm_term: params.utm_term || null,
    keyword: params.keyword || null,
    yclid: params.yclid || null,
    gclid: params.gclid || null,
    intent,
    variantId,
    initialized: true
  };
  
  // Сохраняем в localStorage
  saveToStorage(STORAGE_KEY, newContext);
  
  return newContext;
}

/**
 * Хук для использования контекста трафика в компонентах
 */
export function useTrafficContext() {
  const [context, setContext] = useState<TrafficContext | null>(null);
  
  useEffect(() => {
    // Теперь initializeTrafficContext асинхронный
    initializeTrafficContext().then(trafficContext => {
      setContext(trafficContext);
    }).catch(error => {
      console.error('Failed to initialize traffic context:', error);
      // Создаём базовый контекст при ошибке
      const fallbackContext: TrafficContext = {
        sessionId: generateSessionId(),
        firstLandingUrl: window.location.href,
        referrer: document.referrer || '',
        deviceType: getDeviceType(),
        utm_source: null,
        utm_medium: null,
        utm_campaign: null,
        utm_content: null,
        utm_term: null,
        keyword: null,
        yclid: null,
        gclid: null,
        intent: null,
        variantId: 'A',
        initialized: true
      };
      setContext(fallbackContext);
    });
  }, []);
  
  return context;
}

/**
 * Сброс контекста (для отладки или после конверсии)
 */
export function resetTrafficContext(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error resetting traffic context:', error);
  }
}
