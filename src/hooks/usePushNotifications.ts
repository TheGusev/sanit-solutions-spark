import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

// VAPID public key — это публичный ключ, хранить в коде безопасно
const VAPID_PUBLIC_KEY = 'BDl5Ji02s_G6xfDQmZRRaHpVdQ1zQbM7XrFr73k72Gl8lXuHH2txh2BtSfc1nPx4TcGMhw-2CASLhNEhN1DBIjY';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    const supported = 'serviceWorker' in navigator && 'PushManager' in window;
    setIsSupported(supported);

    // Check if running as installed PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || (navigator as any).standalone === true;
    setIsPWA(isStandalone);

    if (supported) {
      checkSubscription();
    }
  }, []);

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    } catch (err) {
      console.error('Error checking push subscription:', err);
    }
  };

  const subscribeToPush = useCallback(async () => {
    if (!isSupported) return false;
    setIsLoading(true);

    try {
      // Request permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('Push permission denied');
        setIsLoading(false);
        return false;
      }

      // Register SW if needed
      let registration = await navigator.serviceWorker.getRegistration('/sw.js');
      if (!registration) {
        registration = await navigator.serviceWorker.register('/sw.js');
        await navigator.serviceWorker.ready;
      }

      // Subscribe to push
      const appServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: appServerKey.buffer as ArrayBuffer,
      });

      const subJson = subscription.toJSON();

      // Save to backend
      const { error } = await supabase.functions.invoke('save-push-subscription', {
        body: {
          endpoint: subJson.endpoint,
          keys: {
            p256dh: subJson.keys?.p256dh,
            auth: subJson.keys?.auth,
          },
          userAgent: navigator.userAgent,
        },
      });

      if (error) {
        console.error('Error saving subscription:', error);
        setIsLoading(false);
        return false;
      }

      setIsSubscribed(true);
      localStorage.setItem('push_subscribed', 'true');
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error('Error subscribing to push:', err);
      setIsLoading(false);
      return false;
    }
  }, [isSupported]);

  const unsubscribeFromPush = useCallback(async () => {
    setIsLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        // Delete from backend
        await supabase.functions.invoke('save-push-subscription', {
          body: {
            endpoint: subscription.endpoint,
            action: 'unsubscribe',
          },
        });

        await subscription.unsubscribe();
      }

      setIsSubscribed(false);
      localStorage.removeItem('push_subscribed');
    } catch (err) {
      console.error('Error unsubscribing:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendTestPush = useCallback(async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.functions.invoke('send-push-notification', {
        body: { test: true },
      });
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error sending test push:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isSupported,
    isSubscribed,
    isPWA,
    isLoading,
    subscribeToPush,
    unsubscribeFromPush,
    sendTestPush,
  };
}
