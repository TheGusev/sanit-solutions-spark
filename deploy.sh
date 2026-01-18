#!/bin/bash
set -e

echo "🔄 Pulling latest changes..."
git pull origin main

echo "🐳 Building and starting container..."
docker compose up -d --build

echo "✅ Deployment complete!"
echo ""
docker compose ps

echo ""
echo "🧪 Testing HTTP responses..."

# Test 404
HTTP_404=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/abrakadabra)
if [ "$HTTP_404" = "404" ]; then
  echo "✅ /abrakadabra → 404 (correct)"
else
  echo "⚠️ /abrakadabra → $HTTP_404 (expected 404)"
fi

# Test 200
HTTP_200=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/)
if [ "$HTTP_200" = "200" ]; then
  echo "✅ / → 200 (correct)"
else
  echo "⚠️ / → $HTTP_200 (expected 200)"
fi

# Test 410
HTTP_410=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/wp-admin/)
if [ "$HTTP_410" = "410" ]; then
  echo "✅ /wp-admin/ → 410 (correct)"
else
  echo "⚠️ /wp-admin/ → $HTTP_410 (expected 410)"
fi
