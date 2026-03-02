// Хук для получения ML-предсказания конверсии

import { useEffect, useState } from 'react';
import { useTraffic } from '@/contexts/TrafficContext';
import { supabase } from '@/lib/supabaseClient';

export interface MLPrediction {
  p_conv: number;
  segment: 'low' | 'mid' | 'high';
  model_version: string;
}

export function useMLPrediction() {
  const [prediction, setPrediction] = useState<MLPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { context } = useTraffic();
  
  useEffect(() => {
    if (!context || !context.initialized) return;
    
    const fetchPrediction = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase.functions.invoke('ml-predict', {
          body: {
            session_id: context.sessionId,
            intent: context.intent,
            utm_source: context.utm_source,
            utm_medium: context.utm_medium,
            utm_campaign: context.utm_campaign,
            device_type: context.deviceType,
            referrer: context.referrer
          }
        });
        
        if (error) throw error;
        
        setPrediction(data as MLPrediction);
        
        // Логируем предсказание для анализа
        await supabase.functions.invoke('log-traffic-event', {
          body: {
            session_id: context.sessionId,
            page_url: window.location.href,
            event_type: 'ml_prediction',
            event_data: {
              p_conv: data.p_conv,
              segment: data.segment,
              model_version: data.model_version
            },
            ...context
          }
        });
        
      } catch (err) {
        console.debug('ML prediction failed, using fallback:', err);
        // Fallback на mid сегмент при ошибке
        setPrediction({ 
          p_conv: 0.25, 
          segment: 'mid', 
          model_version: 'fallback' 
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPrediction();
  }, [context?.sessionId]);
  
  return { prediction, isLoading };
}
