// React Context для трафика и интент-архитектуры

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { initializeTrafficContext, TrafficContext as TrafficContextType } from '@/hooks/useTrafficContext';
import { supabase } from '@/integrations/supabase/client';

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

  // Инициализация контекста при первой загрузке
  useEffect(() => {
    const trafficContext = initializeTrafficContext();
    setContext(trafficContext);
    setIsLoading(false);
  }, []);

  // Логирование page_view при каждой смене роута
  useEffect(() => {
    if (!context || !context.initialized) return;

    const logPageView = async () => {
      try {
        await supabase.functions.invoke('log-traffic-event', {
          body: {
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
            device_type: context.deviceType,
            event_type: 'page_view',
            event_data: {
              path: location.pathname,
              timestamp: new Date().toISOString()
            }
          }
        });
      } catch (error) {
        // Не показываем ошибку пользователю, только логируем
        console.debug('Traffic event logging failed:', error);
      }
    };

    logPageView();
  }, [location.pathname, context]);

  return (
    <TrafficContext.Provider value={{ context, isLoading }}>
      {children}
    </TrafficContext.Provider>
  );
}

/**
 * Хук для получения контекста трафика в компонентах
 */
export function useTraffic() {
  const value = useContext(TrafficContext);
  
  if (!value) {
    throw new Error('useTraffic must be used within TrafficProvider');
  }
  
  return value;
}
