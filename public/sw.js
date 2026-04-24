// v3 — 2026-04-24 — push notifications with click-through to admin
self.addEventListener('push', e => {
  const d = e.data ? e.data.json() : {};
  e.waitUntil(self.registration.showNotification(d.title || 'Уведомление', {
    body: d.body || 'Новая заявка',
    icon: d.icon || '/favicon.ico',
    badge: '/favicon.ico',
    data: { url: d.url || '/admin/' },
    tag: d.tag || 'lead-notification',
    requireInteraction: false
  }));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const targetUrl = (e.notification.data && e.notification.data.url) || '/admin/';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      for (const client of windowClients) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});
