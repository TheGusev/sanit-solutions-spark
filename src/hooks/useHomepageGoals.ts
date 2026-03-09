import { useEffect, useRef } from "react";
import { trackGoal } from "@/lib/analytics";

const SCROLL_THRESHOLD = 75;
const TIME_THRESHOLD_MS = 120_000; // 2 minutes
const TICK_MS = 1_000;

export function useHomepageGoals() {
  const scrollFired = useRef(false);
  const timeFired = useRef(false);
  const activeMs = useRef(0);

  // Scroll 75%
  useEffect(() => {
    const handleScroll = () => {
      if (scrollFired.current) return;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      const pct = Math.round((window.scrollY / scrollHeight) * 100);
      if (pct >= SCROLL_THRESHOLD) {
        scrollFired.current = true;
        trackGoal("main_scroll_75");
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Active 2 min
  useEffect(() => {
    const interval = setInterval(() => {
      if (timeFired.current) return;
      if (document.visibilityState === "visible") {
        activeMs.current += TICK_MS;
        if (activeMs.current >= TIME_THRESHOLD_MS) {
          timeFired.current = true;
          trackGoal("main_time_2min");
        }
      }
    }, TICK_MS);
    return () => clearInterval(interval);
  }, []);
}
