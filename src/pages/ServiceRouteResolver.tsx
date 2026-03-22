/**
 * Умный роутер для 2-сегментных URL /uslugi/:parentSlug/:subSlug
 * Определяет тип страницы и рендерит соответствующий компонент:
 * - ServiceSubpage (SEO-подстраницы из serviceSubpages.ts)
 * - ServicePestPage (вредители: tarakany, klopy, krysy)
 * - ServiceObjectPage (объекты: kvartir, domov, ofisov)
 * - ServiceDistrictPage (районы Москвы: arbat, tverskoy)
 */

import { useParams, Navigate } from 'react-router-dom';
import { getSubpageByPath } from '@/data/serviceSubpages';
import { getPestBySlug } from '@/data/pests';
import { getObjectBySlug } from '@/data/objects';
import { neighborhoods } from '@/data/neighborhoods';

import ServiceSubpage from './ServiceSubpage';
import ServicePestPage from './ServicePestPage';
import ServiceObjectPage from './ServiceObjectPage';
import NotFound from './NotFound';

export default function ServiceRouteResolver() {
  const { parentSlug, subSlug } = useParams<{ 
    parentSlug: string; 
    subSlug: string 
  }>();
  
  if (!parentSlug || !subSlug) {
    return <NotFound />;
  }
  
  // 1. SEO-подстраницы из serviceSubpages.ts (напр. /dezinfekciya/kvartir как SEO страница)
  const subpage = getSubpageByPath(parentSlug, subSlug);
  if (subpage) {
    return <ServiceSubpage />;
  }
  
  // 2. Вредители (tarakany, klopy, krysy, myshi, blohi, muravyi, mol)
  const pest = getPestBySlug(subSlug);
  if (pest) {
    return <ServicePestPage />;
  }
  
  // 3. Объекты (kvartir, domov, ofisov, skladov, restoranov, proizvodstv)
  const objectType = getObjectBySlug(subSlug);
  if (objectType) {
    return <ServiceObjectPage />;
  }
  
  // 4. Район → редирект на /rajony/
  const neighborhood = neighborhoods.find(n => n.slug === subSlug);
  if (neighborhood) {
    return <Navigate to={`/rajony/${subSlug}/`} replace />;
  }
  
  // Ничего не найдено → 404
  return <NotFound />;
}
