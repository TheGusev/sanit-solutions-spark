// Утилиты для работы с трафиком и параметрами

const ALLOWED_CHARS_REGEX = /[^a-zA-Z0-9а-яА-ЯёЁ\-_.+%=\s]/g;
const MAX_PARAM_LENGTH = 255;

/**
 * Очистка и валидация URL параметра
 */
export function sanitizeParam(value: string | null | undefined): string | null {
  if (!value || typeof value !== 'string') return null;
  
  // Обрезаем до максимальной длины
  let cleaned = value.trim().substring(0, MAX_PARAM_LENGTH);
  
  // Удаляем опасные символы
  cleaned = cleaned.replace(ALLOWED_CHARS_REGEX, '_');
  
  return cleaned || null;
}

/**
 * Определение типа устройства
 */
export function getDeviceType(): 'desktop' | 'tablet' | 'mobile' {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

/**
 * Генерация уникального идентификатора сессии
 */
export function generateSessionId(): string {
  // Используем crypto API для генерации UUID
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback для старых браузеров
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Извлечение UTM и других параметров из URL
 */
export function extractUrlParams(url: string): Record<string, string | null> {
  try {
    const urlObj = new URL(url);
    const params = urlObj.searchParams;
    
    return {
      utm_source: sanitizeParam(params.get('utm_source')),
      utm_medium: sanitizeParam(params.get('utm_medium')),
      utm_campaign: sanitizeParam(params.get('utm_campaign')),
      utm_content: sanitizeParam(params.get('utm_content')),
      utm_term: sanitizeParam(params.get('utm_term')),
      keyword: sanitizeParam(params.get('keyword') || params.get('{keyword}')),
      yclid: sanitizeParam(params.get('yclid')),
      gclid: sanitizeParam(params.get('gclid')),
    };
  } catch (error) {
    console.error('Error extracting URL params:', error);
    return {};
  }
}

/**
 * Сохранение данных в localStorage с обработкой ошибок
 */
export function saveToStorage(key: string, data: any): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
}

/**
 * Чтение данных из localStorage с обработкой ошибок
 */
export function loadFromStorage<T>(key: string): T | null {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
}
