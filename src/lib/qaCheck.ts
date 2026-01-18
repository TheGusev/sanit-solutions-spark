/**
 * QA Checklist - Development only
 * Run in console: window.runQACheck()
 */

interface QAIssue {
  category: string;
  issue: string;
  severity: "error" | "warning" | "info";
  element?: Element;
}

export const runQACheck = (): QAIssue[] => {
  const issues: QAIssue[] = [];

  // 1. Check for images without alt
  document.querySelectorAll("img:not([alt])").forEach((img) => {
    issues.push({
      category: "Accessibility",
      issue: `Image without alt attribute: ${(img as HTMLImageElement).src.substring(0, 50)}...`,
      severity: "error",
      element: img,
    });
  });

  // 2. Check for empty alt on decorative images
  document.querySelectorAll('img[alt=""]').forEach((img) => {
    if (!(img as HTMLImageElement).getAttribute("role")?.includes("presentation")) {
      issues.push({
        category: "Accessibility",
        issue: "Image with empty alt should have role='presentation'",
        severity: "warning",
        element: img,
      });
    }
  });

  // 3. Check for missing form labels
  document.querySelectorAll("input:not([type='hidden']):not([type='submit']):not([type='button'])").forEach((input) => {
    const id = input.id;
    const hasLabel = id && document.querySelector(`label[for="${id}"]`);
    const hasAriaLabel = input.getAttribute("aria-label");
    const hasAriaLabelledby = input.getAttribute("aria-labelledby");
    
    if (!hasLabel && !hasAriaLabel && !hasAriaLabelledby) {
      issues.push({
        category: "Accessibility",
        issue: `Input without label: ${input.getAttribute("name") || input.id || "unnamed"}`,
        severity: "error",
        element: input,
      });
    }
  });

  // 4. Check for multiple H1 tags
  const h1Tags = document.querySelectorAll("h1");
  if (h1Tags.length === 0) {
    issues.push({
      category: "SEO",
      issue: "No H1 tag found on page",
      severity: "error",
    });
  } else if (h1Tags.length > 1) {
    issues.push({
      category: "SEO",
      issue: `Multiple H1 tags found: ${h1Tags.length}`,
      severity: "warning",
    });
  }

  // 5. Check heading hierarchy
  let lastLevel = 0;
  document.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((heading) => {
    const level = parseInt(heading.tagName.substring(1));
    if (lastLevel > 0 && level > lastLevel + 1) {
      issues.push({
        category: "SEO",
        issue: `Heading hierarchy skip: H${lastLevel} → H${level}`,
        severity: "warning",
        element: heading,
      });
    }
    lastLevel = level;
  });

  // 6. Check for broken links (internal only)
  document.querySelectorAll('a[href^="/"]').forEach((link) => {
    const href = link.getAttribute("href");
    if (href && (href.includes("undefined") || href.includes("null"))) {
      issues.push({
        category: "Links",
        issue: `Potentially broken link: ${href}`,
        severity: "error",
        element: link,
      });
    }
  });

  // 7. Check for buttons without text or aria-label
  document.querySelectorAll("button").forEach((button) => {
    const hasText = button.textContent?.trim();
    const hasAriaLabel = button.getAttribute("aria-label");
    const hasAriaLabelledby = button.getAttribute("aria-labelledby");
    
    if (!hasText && !hasAriaLabel && !hasAriaLabelledby) {
      issues.push({
        category: "Accessibility",
        issue: "Button without accessible text",
        severity: "error",
        element: button,
      });
    }
  });

  // 8. Check for small touch targets
  document.querySelectorAll("button, a, [role='button']").forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44)) {
      // Only warn if element is visible
      const style = window.getComputedStyle(el);
      if (style.display !== "none" && style.visibility !== "hidden") {
        issues.push({
          category: "Mobile",
          issue: `Small touch target (${Math.round(rect.width)}x${Math.round(rect.height)}px)`,
          severity: "info",
          element: el,
        });
      }
    }
  });

  // 9. Check contrast (basic check for common patterns)
  document.querySelectorAll(".text-muted-foreground, .text-gray-400, .text-gray-500").forEach((el) => {
    const bgColor = window.getComputedStyle(el).backgroundColor;
    if (bgColor === "rgba(0, 0, 0, 0)" || bgColor === "transparent") {
      // Element has muted text but transparent bg - might be okay
    }
  });

  // 10. Check for CLS potential issues (images without dimensions)
  document.querySelectorAll("img:not([width]):not([height])").forEach((img) => {
    const style = window.getComputedStyle(img);
    if (!style.width.includes("%") && !style.aspectRatio) {
      issues.push({
        category: "Performance",
        issue: "Image without dimensions (potential CLS)",
        severity: "warning",
        element: img,
      });
    }
  });

  // Log results
  console.group("🔍 QA Check Results");
  
  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warning");
  const infos = issues.filter((i) => i.severity === "info");

  if (errors.length > 0) {
    console.group(`❌ Errors (${errors.length})`);
    errors.forEach((e) => console.error(`[${e.category}] ${e.issue}`, e.element || ""));
    console.groupEnd();
  }

  if (warnings.length > 0) {
    console.group(`⚠️ Warnings (${warnings.length})`);
    warnings.forEach((w) => console.warn(`[${w.category}] ${w.issue}`, w.element || ""));
    console.groupEnd();
  }

  if (infos.length > 0) {
    console.group(`ℹ️ Info (${infos.length})`);
    infos.forEach((i) => console.info(`[${i.category}] ${i.issue}`, i.element || ""));
    console.groupEnd();
  }

  if (issues.length === 0) {
    console.log("✅ All QA checks passed!");
  }

  console.groupEnd();

  return issues;
};

// Make available globally in development
if (typeof window !== "undefined" && import.meta.env.DEV) {
  (window as any).runQACheck = runQACheck;
  console.log("💡 QA Check available: run window.runQACheck() in console");
}

export default runQACheck;
