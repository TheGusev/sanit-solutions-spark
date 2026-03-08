/**
 * Роутер для 3-сегментных URL /uslugi/:service/:segment2/:segment3
 * 
 * Проверяет что segment2 = вредитель (pest) и segment3 = район → NchPage
 * Пример: /uslugi/dezinsekciya/tarakany/arbat → NchPage
 */

import { useParams } from 'react-router-dom';
import { getPestBySlug } from '@/data/pests';
import { neighborhoods } from '@/data/neighborhoods';

import NchPage from './NchPage';
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
  
  // REMOVED: Object+Geo pages (thin content competing with /rajony/) — Issue #4
  
  // Ничего не найдено
  return <NotFound />;
}
