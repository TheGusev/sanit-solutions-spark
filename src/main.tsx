import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { logCopyMapWarnings } from "./lib/validateCopyMap";

// Validate copyMap on startup (development only)
if (import.meta.env.DEV) {
  logCopyMapWarnings();
}

const rootElement = document.getElementById("root")!;

// Отмечаем загрузку React — SSR fallback контент становится видимым
rootElement.classList.add('app-loaded');

createRoot(rootElement).render(<App />);
