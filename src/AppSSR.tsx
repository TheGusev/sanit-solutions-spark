/**
 * Simplified App component for SSR (Static Site Generation)
 * This version excludes client-side only providers and uses SSR-safe components.
 * 
 * IMPORTANT: All public routes from App.tsx MUST be mirrored here.
 * Otherwise SSG will render NotFound and skip the page → 404 on production.
 */

import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { TrafficProviderSSR } from "./contexts/TrafficContextSSR";

// Import all public pages directly (no lazy loading for SSR)
import IndexSSR from "./pages/IndexSSR";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import ServicePage from "./pages/ServicePage";
import ServiceRouteResolver from "./pages/ServiceRouteResolver";
import ThreeSegmentRouteResolver from "./pages/ThreeSegmentRouteResolver";
import ServiceLandingUchastkiPage from "./pages/ServiceLandingUchastkiPage";
import Contacts from "./pages/Contacts";
import Team from "./pages/Team";
import DistrictsOverview from "./pages/DistrictsOverview";
import DistrictPage from "./pages/DistrictPage";
import NeighborhoodPage from "./pages/NeighborhoodPage";
import NeighborhoodsOverview from "./pages/NeighborhoodsOverview";
import MoscowRegionOverview from "./pages/MoscowRegionOverview";
import MoscowRegionCityPage from "./pages/MoscowRegionCityPage";
import MoscowRegionServicePage from "./pages/MoscowRegionServicePage";
import ServiceSESPage from "./pages/ServiceSESPage";
import ReviewsPage from "./pages/ReviewsPage";
import NotFound from "./pages/NotFound";

const AppSSR = () => (
  <TrafficProviderSSR>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <Routes>
        {/* Главная и статичные */}
        <Route path="/" element={<IndexSSR />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/team" element={<Team />} />
        <Route path="/sluzhba-dezinsekcii" element={<ServiceSESPage />} />
        <Route path="/otzyvy" element={<ReviewsPage />} />

        {/* Округа Москвы */}
        <Route path="/uslugi/po-okrugam-moskvy" element={<DistrictsOverview />} />

        {/* Районы Москвы */}
        <Route path="/rajony" element={<NeighborhoodsOverview />} />
        <Route path="/rajony/:slug" element={<NeighborhoodPage />} />

        {/* Московская область */}
        <Route path="/moscow-oblast" element={<MoscowRegionOverview />} />
        <Route path="/moscow-oblast/:citySlug" element={<MoscowRegionCityPage />} />
        <Route path="/moscow-oblast/:citySlug/:serviceSlug" element={<MoscowRegionServicePage />} />

        {/* Сложные маршруты услуг — статические ПЕРЕД параметрическими */}
        <Route path="/uslugi/obrabotka-uchastkov" element={<ServiceLandingUchastkiPage />} />
        <Route path="/uslugi/:service/:segment2/:segment3" element={<ThreeSegmentRouteResolver />} />
        <Route path="/uslugi/:parentSlug/:subSlug" element={<ServiceRouteResolver />} />
        {/* Универсальный роут для всех услуг и округов */}
        <Route path="/uslugi/:slug" element={<ServicePage />} />

        {/* Admin routes excluded from SSG — behind auth */}

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  </TrafficProviderSSR>
);

export default AppSSR;
