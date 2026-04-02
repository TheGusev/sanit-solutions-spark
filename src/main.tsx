import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { logCopyMapWarnings } from "./lib/validateCopyMap";

// Validate copyMap on startup (development only)
if (import.meta.env.DEV) {
  logCopyMapWarnings();
}

const rootElement = document.getElementById("root")!;

// Удаляем SSR fallback контент перед рендером React
const ssrFallback = rootElement.querySelector('.ssr-fallback');
if (ssrFallback) {
  ssrFallback.remove();
}

// Check if we have SSG-rendered content to hydrate
const hasSSGContent = rootElement.innerHTML.trim() && 
  !rootElement.innerHTML.includes('<!--app-html-->') &&
  !rootElement.querySelector('.ssr-fallback');

if (hasSSGContent) {
  // SSG mode - hydrate the pre-rendered content
  hydrateRoot(rootElement, <App />);
} else {
  // CSR fallback - standard client-side rendering
  createRoot(rootElement).render(<App />);
}

// Register Service Worker for push notifications (production only, not in iframe/preview)
if ('serviceWorker' in navigator) {
  const isInIframe = (() => {
    try { return window.self !== window.top; } catch { return true; }
  })();
  const isPreviewHost =
    window.location.hostname.includes('id-preview--') ||
    window.location.hostname.includes('lovableproject.com');

  if (!isInIframe && !isPreviewHost) {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('SW registration failed:', err);
    });
  } else {
    // Unregister any existing SW in preview/iframe contexts
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((r) => r.unregister());
    });
  }
}
