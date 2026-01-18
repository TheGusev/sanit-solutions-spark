import { useEffect, useState } from "react";

/**
 * Screen reader announcer for dynamic content changes
 * Used for ARIA live regions
 */
const AccessibilityAnnouncer = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Listen for custom announcement events
    const handleAnnounce = (event: CustomEvent<string>) => {
      setMessage(event.detail);
      // Clear after announcement
      setTimeout(() => setMessage(""), 1000);
    };

    window.addEventListener("announce", handleAnnounce as EventListener);
    return () => {
      window.removeEventListener("announce", handleAnnounce as EventListener);
    };
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
};

// Helper function to announce messages
export const announce = (message: string) => {
  window.dispatchEvent(new CustomEvent("announce", { detail: message }));
};

export default AccessibilityAnnouncer;
