/**
 * Умный роутер для 2-сегментных URL /uslugi/:parentSlug/:subSlug
 * Определяет тип страницы и рендерит соответствующий компонент:
 * - ServiceSubpage (SEO-подстраницы из serviceSubpages.ts)
 * - ServicePestPage (вредители: tarakany, klopy, krysy)
 * - ServiceObjectPage (объекты: kvartir, domov, ofisov)
 * - ServiceDistrictPage (районы Москвы: arbat, tverskoy)
 */

import { useParams } from 'react-router-dom';
import { getSubpageByPath } from '@/data/serviceSubpages';
import { getPestBySlug } from '@/data/pests';
import { getObjectBySlug } from '@/data/objects';
// neighborhoods import removed — geo pages now at /rajony/ only

import ServiceSubpage from './ServiceSubpage';
import ServicePestPage from './ServicePestPage';
import ServiceObjectPage from './ServiceObjectPage';
import ServiceDistrictPage from './ServiceDistrictPage';
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
  
  // REMOVED: Neighborhoods no longer matched here — all geo pages at /rajony/[slug]/ (Issue #1)
  
  // Ничего не найдено → 404
  return <NotFound />;
}
