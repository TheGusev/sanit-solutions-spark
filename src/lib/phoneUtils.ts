/**
 * Russian phone number utilities — единый источник правды для всех форм заявок.
 * Маска: +7 (XXX) XXX-XX-XX (ровно 18 символов, 11 цифр).
 */

export const RU_PHONE_PLACEHOLDER = "+7 (___) ___-__-__";
export const RU_PHONE_INITIAL = "+7 ";
export const RU_PHONE_LENGTH = 18;

export function formatRuPhone(value: string): string {
  let digits = value.replace(/\D/g, "");
  if (digits.length === 0) return RU_PHONE_INITIAL;
  if (digits.startsWith("8")) digits = "7" + digits.slice(1);
  if (!digits.startsWith("7")) digits = "7" + digits;
  digits = digits.slice(0, 11);

  let formatted = "+7";
  if (digits.length > 1) formatted += ` (${digits.substring(1, 4)}`;
  if (digits.length >= 4) formatted += `)`;
  if (digits.length > 4) formatted += ` ${digits.substring(4, 7)}`;
  if (digits.length > 7) formatted += `-${digits.substring(7, 9)}`;
  if (digits.length > 9) formatted += `-${digits.substring(9, 11)}`;
  return formatted;
}

export function isValidRuPhone(value: string): boolean {
  return value.length === RU_PHONE_LENGTH;
}

/** SSR-safe текущий URL — для last_page_url. */
export function getCurrentPageUrl(): string | null {
  if (typeof window === "undefined") return null;
  return window.location.href;
}
