import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { logCopyMapWarnings } from "./lib/validateCopyMap";

// Validate copyMap on startup (development only)
if (import.meta.env.DEV) {
  logCopyMapWarnings();
}

createRoot(document.getElementById("root")!).render(<App />);
