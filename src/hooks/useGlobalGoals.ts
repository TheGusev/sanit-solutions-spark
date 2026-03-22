import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackGoal } from "@/lib/analytics";

const SCROLL_THRESHOLDS = [25, 50, 75, 100] as const;
const TIME_THRESHOLDS_MS = [30_000, 60_000, 120_000] as const;
const TIME_LABELS: Record<number, string> = {
  30_000: "time_30s",
  60_000: "time_60s",
  120_000: "time_2min",
};
const TICK_MS = 1_000;

/**
 * Глобальный хук микроконверсий — scroll, time, section visibility, phone copy.
 * Вызывается один раз в TrafficProvider, работает на всех страницах.
 */
export function useGlobalGoals() {
  const { pathname } = useLocation();

  const scrollFired = useRef<Set<number>>(new Set());
  const timeFired = useRef<Set<number>>(new Set());
  const sectionFired = useRef<Set<string>>(new Set());
  const activeMs = useRef(0);

  // Derive a short page label for goal params
  const pageLabel = useRef(pathname);
  pageLabel.current = pathname;

  // Reset counters on route change
  useEffect(() => {
    scrollFired.current.clear();
    timeFired.current.clear();
    sectionFired.current.clear();
    activeMs.current = 0;
  }, [pathname]);

  // ─── Scroll depth ────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      const pct = Math.round((window.scrollY / scrollHeight) * 100);

      SCROLL_THRESHOLDS.forEach((t) => {
        if (pct >= t && !scrollFired.current.has(t)) {
          scrollFired.current.add(t);
          trackGoal(`scroll_${t}`, { page: pageLabel.current });
        }
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  // ─── Active time on page ─────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        activeMs.current += TICK_MS;
        TIME_THRESHOLDS_MS.forEach((t) => {
          if (activeMs.current >= t && !timeFired.current.has(t)) {
            timeFired.current.add(t);
            trackGoal(TIME_LABELS[t], { page: pageLabel.current });
          }
        });
      }
    }, TICK_MS);
    return () => clearInterval(interval);
  }, [pathname]);

  // ─── Section visibility (data-section) ───────────────────
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute("data-section");
          if (!id || sectionFired.current.has(id)) return;
          sectionFired.current.add(id);
          trackGoal(`section_${id}`, { page: pageLabel.current });
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.3 }
    );

    // Defer to let DOM render after route change
    const timer = setTimeout(() => {
      document.querySelectorAll("[data-section]").forEach((el) => {
        const id = el.getAttribute("data-section");
        if (id && !sectionFired.current.has(id)) {
          observer.observe(el);
        }
      });
    }, 800);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [pathname]);

  // ─── Phone copy (global, once) ──────────────────────────
  useEffect(() => {
    const handleCopy = () => {
      const selection = document.getSelection()?.toString().trim() || "";
      // Match Russian phone patterns
      if (/(\+?7|8)[\s\-()]*\d{3}[\s\-()]*\d{3}[\s\-]*\d{2}[\s\-]*\d{2}/.test(selection)) {
        trackGoal("phone_copy", { phone: selection, page: pageLabel.current });
      }
    };
    document.addEventListener("copy", handleCopy);
    return () => document.removeEventListener("copy", handleCopy);
  }, []);
}
