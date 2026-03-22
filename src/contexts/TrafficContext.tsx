// React Context для трафика и интент-архитектуры

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { initializeTrafficContext, TrafficContext as TrafficContextType } from '@/hooks/useTrafficContext';
import { supabase } from '@/lib/supabaseClient';
import { setUserProperties, trackPageView } from '@/lib/analytics';
import { useGlobalGoals } from '@/hooks/useGlobalGoals';

interface TrafficContextValue {
  context: TrafficContextType | null;
  isLoading: boolean;
}

const TrafficContext = createContext<TrafficContextValue>({
  context: null,
  isLoading: true
});

/**
 * Provider для контекста трафика
 */
export function TrafficProvider({ children }: { children: React.ReactNode }) {
  const [context, setContext] = useState<TrafficContextType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const lastLoggedPath = useRef<string | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Инициализация контекста при первой загрузке
  useEffect(() => {
    initializeTrafficContext().then(trafficContext => {
      setContext(trafficContext);
      setIsLoading(false);
    }).catch(error => {
      console.error('Failed to initialize traffic context:', error);
      setIsLoading(false);
    });
  }, []);
  
  // Передача параметров в аналитику при готовности контекста
  useEffect(() => {
    if (context && context.initialized) {
      setUserProperties({
        session_id: context.sessionId,
        intent: context.intent,
        variant_id: context.variantId,
        utm_source: context.utm_source,
        utm_campaign: context.utm_campaign,
        device_type: context.deviceType
      });
    }
  }, [context?.initialized]);

  // Логирование page_view при каждой смене роута (с debounce)
  useEffect(() => {
    if (!context || !context.initialized) return;
    
    // Предотвращаем дублирование логов для того же пути
    if (lastLoggedPath.current === location.pathname) return;

    // Debounce для предотвращения множественных вызовов
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      lastLoggedPath.current = location.pathname;
      
      // Передаём page_view в Яндекс.Метрику с параметрами
      trackPageView(window.location.href, {
        intent: context.intent,
        variant: context.variantId,
        device: context.deviceType
      });
      
      // Используем sendBeacon для неблокирующей отправки
      const eventData = {
        session_id: context.sessionId,
        page_url: window.location.href,
        referrer: context.referrer,
        utm_source: context.utm_source,
        utm_medium: context.utm_medium,
        utm_campaign: context.utm_campaign,
        utm_content: context.utm_content,
        utm_term: context.utm_term,
        keyword_raw: context.keyword,
        yclid: context.yclid,
        gclid: context.gclid,
        intent: context.intent,
        variant_id: context.variantId,
        device_type: context.deviceType,
        event_type: 'page_view',
        event_data: {
          path: location.pathname,
          timestamp: new Date().toISOString()
        }
      };

      // Fire and forget - не блокируем UI
      supabase.functions.invoke('log-traffic-event', { body: eventData })
        .catch(() => {}); // Silent fail
    }, 100);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [location.pathname, context]);

  return (
    <TrafficContext.Provider value={{ context, isLoading }}>
      {children}
    </TrafficContext.Provider>
  );
}

/**
 * Хук для получения контекста трафика в компонентах
 * SSR-safe: возвращает fallback вместо ошибки если контекст недоступен
 */
export function useTraffic(): TrafficContextValue {
  const value = useContext(TrafficContext);
  
  // SSR fallback - возвращаем пустой контекст вместо ошибки
  if (!value) {
    return {
      context: null,
      isLoading: true
    };
  }
  
  return value;
}
