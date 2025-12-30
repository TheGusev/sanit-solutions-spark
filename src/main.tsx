import { createRoot } from "react-dom/client";
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

createRoot(rootElement).render(<App />);
