#!/bin/sh
set -e

# Убеждаемся что sw.js есть в html директории
if [ ! -f /usr/share/nginx/html/sw.js ]; then
  cat > /usr/share/nginx/html/sw.js << 'SWEOF'
self.addEventListener('push', e => {
  const d = e.data ? e.data.json() : {};
  e.waitUntil(self.registration.showNotification(d.title || 'Уведомление', {
    body: d.body || 'Новая заявка', icon: d.icon || '/favicon.ico', data: d.url || '/'
  }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow(e.notification.data || '/'));
});
SWEOF
  echo "[entrypoint] sw.js создан"
fi

# Убеждаемся что nginx location блоки есть
CONF=/etc/nginx/conf.d/default.conf
if ! grep -q "location = /sw.js" "$CONF"; then
  sed -i "s|location / {|location = /sw.js {\n        root /usr/share/nginx/html;\n        default_type application/javascript;\n        add_header Cache-Control \"no-cache\";\n    }\n\n    location /api/push/ {\n        proxy_pass http://push-server:3001;\n        proxy_set_header Host \$host;\n        proxy_set_header X-Real-IP \$remote_addr;\n    }\n\n    location / {|" "$CONF"
  echo "[entrypoint] nginx location блоки добавлены"
fi

echo "[entrypoint] запуск nginx..."
exec nginx -g 'daemon off;'
