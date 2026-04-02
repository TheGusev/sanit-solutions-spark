// Service Worker for Web Push Notifications
// Minimal SW — only push handling, no caching (to not break preview)

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  
  const title = data.title || '🔔 Новая заявка!';
  const options = {
    body: data.body || 'Поступила новая заявка',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: 'new-lead-' + (data.leadId || Date.now()),
    renotify: true,
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/admin/',
      leadId: data.leadId
    },
    actions: [
      { action: 'open', title: '📋 Открыть' },
      { action: 'close', title: 'Закрыть' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') return;

  const urlToOpen = event.notification.data?.url || '/admin/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focus existing admin tab if open
      for (const client of clientList) {
        if (client.url.includes('/admin') && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open new window
      return clients.openWindow(urlToOpen);
    })
  );
});

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
