import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { HelmetProvider } from "react-helmet-async";
import { TrafficProvider } from "@/contexts/TrafficContext";
import PageLoader from "@/components/PageLoader";
import ScrollToTop from "@/components/ScrollToTop";
import { CookieBanner } from "@/components/CookieBanner";

// Главная загружается сразу
import Index from "./pages/Index";

// Ленивые страницы
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const ServicePage = lazy(() => import("./pages/ServicePage"));
const ServiceRouteResolver = lazy(() => import("./pages/ServiceRouteResolver"));
const ThreeSegmentRouteResolver = lazy(
  () => import("./pages/ThreeSegmentRouteResolver")
);
const NchPage = lazy(() => import("./pages/NchPage"));
const Contacts = lazy(() => import("./pages/Contacts"));
const Team = lazy(() => import("./pages/Team"));
const DistrictsOverview = lazy(() => import("./pages/DistrictsOverview"));
const DistrictPage = lazy(() => import("./pages/DistrictPage"));
const NeighborhoodPage = lazy(() => import("./pages/NeighborhoodPage"));
const NeighborhoodsOverview = lazy(
  () => import("./pages/NeighborhoodsOverview")
);
const MoscowRegionOverview = lazy(
  () => import("./pages/MoscowRegionOverview")
);
const MoscowRegionCityPage = lazy(
  () => import("./pages/MoscowRegionCityPage")
);
const MoscowRegionServicePage = lazy(
  () => import("./pages/MoscowRegionServicePage")
);
const ServiceSESPage = lazy(() => import("./pages/ServiceSESPage"));
const ReviewsPage = lazy(() => import("./pages/ReviewsPage"));
const ServiceLandingUchastkiPage = lazy(() => import("./pages/ServiceLandingUchastkiPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Админка
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminSetup = lazy(() => import("./pages/admin/Setup"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminLeads = lazy(() => import("./pages/admin/Leads"));
const AdminReviews = lazy(() => import("./pages/admin/AdminReviews"));
const AdminAnalytics = lazy(() => import("./pages/admin/Analytics"));
const AdminMVT = lazy(() => import("./pages/admin/MVT"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));
const AdminTestLeads = lazy(() => import("./pages/admin/TestLeads"));

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <TrafficProvider>
              <ScrollToTop />
              <CookieBanner />
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Главная и статичные */}
                  <Route path="/" element={<Index />} />
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
                  {/* УДАЛЕНО: отдельный роут для округов - теперь обрабатывается в ServicePage */}
                  {/* <Route path="/uslugi/dezinfekciya-:districtId" element={<DistrictPage />} /> */}

                  {/* Районы Москвы */}
                  <Route path="/rajony" element={<NeighborhoodsOverview />} />
                  <Route path="/rajony/:slug" element={<NeighborhoodPage />} />

                  {/* Московская область */}
                  <Route path="/moscow-oblast" element={<MoscowRegionOverview />} />
                  <Route path="/moscow-oblast/:citySlug" element={<MoscowRegionCityPage />} />
                  <Route
                    path="/moscow-oblast/:citySlug/:serviceSlug"
                    element={<MoscowRegionServicePage />}
                  />

                  {/* Сложные маршруты услуг */}
                  <Route
                    path="/uslugi/:service/:segment2/:segment3"
                    element={<ThreeSegmentRouteResolver />}
                  />
                  <Route
                    path="/uslugi/:parentSlug/:subSlug"
                    element={<ServiceRouteResolver />}
                  />
                  <Route path="/uslugi/obrabotka-uchastkov" element={<ServiceLandingUchastkiPage />} />
                  {/* Универсальный роут для всех услуг и округов */}
                  <Route path="/uslugi/:slug" element={<ServicePage />} />

                  {/* Админка */}
                  <Route path="/admin/setup" element={<AdminSetup />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin" element={<AdminDashboard />}>
                    <Route index element={<AdminLeads />} />
                    <Route path="test-leads" element={<AdminTestLeads />} />
                    <Route path="reviews" element={<AdminReviews />} />
                    <Route path="analytics" element={<AdminAnalytics />} />
                    <Route path="mvt" element={<AdminMVT />} />
                    <Route path="settings" element={<AdminSettings />} />
                  </Route>

                  {/* 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </TrafficProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </HelmetProvider>
);

export default App;
