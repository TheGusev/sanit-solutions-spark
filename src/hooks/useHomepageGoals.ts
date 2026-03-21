import { useEffect, useRef } from "react";
import { trackGoal } from "@/lib/analytics";

const SCROLL_THRESHOLDS = [25, 50, 75] as const;
const TIME_THRESHOLDS_MS = [30_000, 60_000, 120_000] as const;
const TIME_LABELS: Record<number, string> = {
  30_000: "main_time_30s",
  60_000: "main_time_60s",
  120_000: "main_time_2min",
};
const TICK_MS = 1_000;

const SECTION_IDS = [
  { id: "pricing", goal: "main_section_pricing" },
  { id: "reviews", goal: "main_section_reviews" },
  { id: "faq", goal: "main_section_faq" },
  { id: "gallery", goal: "main_section_gallery" },
  { id: "work-process", goal: "main_section_process" },
] as const;

export function useHomepageGoals() {
  const scrollFired = useRef<Set<number>>(new Set());
  const timeFired = useRef<Set<number>>(new Set());
  const activeMs = useRef(0);
  const sectionFired = useRef<Set<string>>(new Set());

  // Scroll thresholds 25/50/75
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      const pct = Math.round((window.scrollY / scrollHeight) * 100);

      SCROLL_THRESHOLDS.forEach((threshold) => {
        if (pct >= threshold && !scrollFired.current.has(threshold)) {
          scrollFired.current.add(threshold);
          trackGoal(`main_scroll_${threshold}`);
        }
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Active time 30s / 60s / 2min
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        activeMs.current += TICK_MS;
        TIME_THRESHOLDS_MS.forEach((threshold) => {
          if (activeMs.current >= threshold && !timeFired.current.has(threshold)) {
            timeFired.current.add(threshold);
            trackGoal(TIME_LABELS[threshold]);
          }
        });
      }
    }, TICK_MS);
    return () => clearInterval(interval);
  }, []);

  // Section visibility via IntersectionObserver
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute("data-section");
          if (!id || sectionFired.current.has(id)) return;
          sectionFired.current.add(id);
          const section = SECTION_IDS.find((s) => s.id === id);
          if (section) trackGoal(section.goal);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.3 }
    );

    // Defer observation to let DOM render
    const timer = setTimeout(() => {
      SECTION_IDS.forEach(({ id }) => {
        const el = document.querySelector(`[data-section="${id}"]`);
        if (el) observer.observe(el);
      });
    }, 1000);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);
}
