/**
 * Скрипт валидации маршрутов
 * Проверяет синхронность данных между источниками
 * 
 * Запуск: npx tsx scripts/validate-routes.ts
 */

import { getAllSSGRoutes } from '../src/lib/seoRoutes';
import { neighborhoodSlugs } from '../src/lib/seoRoutes';

interface ValidationResult {
  passed: boolean;
  totalRoutes: number;
  errors: string[];
  warnings: string[];
}

function validateRoutes(): ValidationResult {
  const result: ValidationResult = {
    passed: true,
    totalRoutes: 0,
    errors: [],
    warnings: []
  };

  try {
    // 1. Получаем все маршруты из единого источника
    const routes = getAllSSGRoutes();
    result.totalRoutes = routes.length;

    console.log(`📊 Найдено маршрутов: ${routes.length}`);

    // 2. Проверяем минимальное количество маршрутов
    const EXPECTED_MIN_ROUTES = 1500;
    if (routes.length < EXPECTED_MIN_ROUTES) {
      result.errors.push(
        `Количество маршрутов (${routes.length}) меньше ожидаемого минимума (${EXPECTED_MIN_ROUTES})`
      );
      result.passed = false;
    }

    // 2b. Проверяем запрещенные паттерны (каннибализация)
    const neighborhoodSet = new Set(neighborhoodSlugs);
    const forbiddenFound: string[] = [];
    
    for (const route of routes) {
      // Object+Geo leak
      if (/^\/uslugi\/[a-z-]+\/(?:kvartir|domov|ofisov|restoranov|skladov|proizvodstv|gostinic|detskih-sadov|hostela|magazinov|avtomobiley)\/[a-z-]+\/$/.test(route.path)) {
        forbiddenFound.push(`Object+Geo: ${route.path}`);
      }
      // Pest at service level
      if (/^\/uslugi\/(?:tarakany|klopy|muravyi|blohi|mol|komary|muhi|osy-shershni|cheshuynitsy|kleshchi|mokricy|krysy|myshi|kroty)\/$/.test(route.path)) {
        forbiddenFound.push(`Pest@service: ${route.path}`);
      }
      // Geo under /uslugi/dezinfekciya/
      const geoMatch = route.path.match(/^\/uslugi\/dezinfekciya\/([a-z-]+)\/$/);
      if (geoMatch && neighborhoodSet.has(geoMatch[1])) {
        forbiddenFound.push(`Geo@dezinfekciya: ${route.path}`);
      }
    }
    
    if (forbiddenFound.length > 0) {
      result.errors.push(`Запрещенные паттерны (${forbiddenFound.length}): ${forbiddenFound.slice(0, 5).join(', ')}`);
      result.passed = false;
    }

    // 3. Проверяем структуру маршрутов
    const routePaths = new Set<string>();
    const duplicates: string[] = [];

    for (const route of routes) {
      if (!route.path) {
        result.errors.push(`Маршрут без path: ${JSON.stringify(route)}`);
        result.passed = false;
        continue;
      }

      // Проверка на дубликаты
      if (routePaths.has(route.path)) {
        duplicates.push(route.path);
      } else {
        routePaths.add(route.path);
      }

      // Проверка формата path
      if (!route.path.startsWith('/')) {
        result.errors.push(`Маршрут должен начинаться с /: ${route.path}`);
        result.passed = false;
      }
    }

    if (duplicates.length > 0) {
      result.errors.push(`Найдены дубликаты маршрутов (${duplicates.length}): ${duplicates.slice(0, 5).join(', ')}...`);
      result.passed = false;
    }

    // 4. Проверяем категории маршрутов
    const categories = {
      static: routes.filter(r => ['/', '/contacts', '/blog', '/privacy', '/terms'].includes(r.path)).length,
      services: routes.filter(r => r.path.match(/^\/uslugi\/[a-z-]+$/)).length,
      servicePest: routes.filter(r => r.path.match(/^\/uslugi\/[a-z-]+\/[a-z-]+$/) && !r.path.includes('kvartir') && !r.path.includes('domov')).length,
      serviceObject: routes.filter(r => r.path.includes('kvartir') || r.path.includes('domov') || r.path.includes('ofisov')).length,
      blog: routes.filter(r => r.path.startsWith('/blog/')).length,
      districts: routes.filter(r => r.path.startsWith('/okrugi/')).length,
      neighborhoods: routes.filter(r => r.path.startsWith('/rajony/')).length
    };

    console.log('\n📁 Категории маршрутов:');
    Object.entries(categories).forEach(([key, count]) => {
      console.log(`   ${key}: ${count}`);
    });

    // 5. Предупреждения о потенциальных проблемах
    if (categories.blog < 100) {
      result.warnings.push(`Мало статей в блоге: ${categories.blog}`);
    }

    if (categories.services < 4) {
      result.warnings.push(`Мало основных услуг: ${categories.services}`);
    }

  } catch (error) {
    result.errors.push(`Ошибка при загрузке маршрутов: ${error instanceof Error ? error.message : String(error)}`);
    result.passed = false;
  }

  return result;
}

// Запуск валидации
console.log('🔍 Валидация маршрутов...\n');

const result = validateRoutes();

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

if (result.errors.length > 0) {
  console.log('\n❌ Ошибки:');
  result.errors.forEach(err => console.log(`   • ${err}`));
}

if (result.warnings.length > 0) {
  console.log('\n⚠️ Предупреждения:');
  result.warnings.forEach(warn => console.log(`   • ${warn}`));
}

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

if (result.passed) {
  console.log(`\n✅ Валидация пройдена! Всего маршрутов: ${result.totalRoutes}`);
  process.exit(0);
} else {
  console.log(`\n❌ Валидация не пройдена!`);
  process.exit(1);
}
