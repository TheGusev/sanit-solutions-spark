// Mock TrafficProvider для SSR (без клиентских API)

import React, { createContext, useContext } from 'react';
import type { TrafficContext as TrafficContextType } from '@/hooks/useTrafficContext';

interface TrafficContextValue {
  context: TrafficContextType | null;
  isLoading: boolean;
}

// Создаём контекст с SSR-безопасными значениями
const TrafficContextSSR = createContext<TrafficContextValue>({
  context: {
    sessionId: 'ssr-session',
    firstLandingUrl: '/',
    deviceType: 'desktop',
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
    initialized: false,
    referrer: null
  },
  isLoading: false
});

/**
 * SSR-версия TrafficProvider - возвращает статический контекст без side-effects
 */
export function TrafficProviderSSR({ children }: { children: React.ReactNode }) {
  const mockContext: TrafficContextValue = {
    context: {
      sessionId: 'ssr-session',
      firstLandingUrl: '/',
      deviceType: 'desktop',
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
      initialized: false,
      referrer: null
    },
    isLoading: false
  };

  return (
    <TrafficContextSSR.Provider value={mockContext}>
      {children}
    </TrafficContextSSR.Provider>
  );
}

/**
 * SSR-версия useTraffic hook
 */
export function useTrafficSSR() {
  return useContext(TrafficContextSSR);
}

export { TrafficContextSSR };
