/**
 * Умный роутер для 3-сегментных URL /uslugi/:service/:segment2/:segment3
 * 
 * Определяет тип страницы по второму сегменту:
 * - Если segment2 = вредитель (pest) → NchPage
 * - Если segment2 = объект (object) → ServiceObjectDistrictPage
 * 
 * Примеры:
 * /uslugi/dezinsekciya/tarakany/arbat → NchPage (tarakany = вредитель)
 * /uslugi/dezinsekciya/kvartir/arbat → ServiceObjectDistrictPage (kvartir = объект)
 */

import { useParams } from 'react-router-dom';
import { getPestBySlug } from '@/data/pests';
import { getObjectBySlug } from '@/data/objects';
import { neighborhoods } from '@/data/neighborhoods';

import NchPage from './NchPage';
import ServiceObjectDistrictPage from './ServiceObjectDistrictPage';
import NotFound from './NotFound';

export default function ThreeSegmentRouteResolver() {
  const { service, segment2, segment3 } = useParams<{ 
    service: string; 
    segment2: string; 
    segment3: string;
  }>();
  
  if (!service || !segment2 || !segment3) {
    return <NotFound />;
  }
  
  // Проверяем что третий сегмент - это район
  const neighborhood = neighborhoods.find(n => n.slug === segment3);
  if (!neighborhood) {
    return <NotFound />;
  }
  
  // 1. Проверяем вредителя → NchPage
  const pest = getPestBySlug(segment2);
  if (pest) {
    return <NchPage />;
  }
  
  // 2. Проверяем объект → ServiceObjectDistrictPage
  const objectType = getObjectBySlug(segment2);
  if (objectType) {
    return <ServiceObjectDistrictPage />;
  }
  
  // Ничего не найдено
  return <NotFound />;
}
