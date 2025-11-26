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
  initialized: boolean;
}

const STORAGE_KEY = 'traffic_context';

/**
 * Инициализация контекста трафика при первом заходе
 */
export function initializeTrafficContext(): TrafficContext {
  // Пытаемся загрузить существующий контекст
  const existing = loadFromStorage<TrafficContext>(STORAGE_KEY);
  
  if (existing && existing.sessionId) {
    return { ...existing, initialized: true };
  }
  
  // Создаём новый контекст
  const params = extractUrlParams(window.location.href);
  const deviceType = getDeviceType();
  const intent = detectIntent(params, window.location.pathname);
  
  const newContext: TrafficContext = {
    sessionId: generateSessionId(),
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
    const trafficContext = initializeTrafficContext();
    setContext(trafficContext);
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
