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

// Critical - loads immediately (main landing page)
import Index from "./pages/Index";

// Lazy loaded pages - load on demand
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Privacy = lazy(() => import("./pages/Privacy"));
const ServicePage = lazy(() => import("./pages/ServicePage"));
const Contacts = lazy(() => import("./pages/Contacts"));
const DistrictsOverview = lazy(() => import("./pages/DistrictsOverview"));
const DistrictPage = lazy(() => import("./pages/DistrictPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Admin pages - separate chunk, load on demand
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
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/uslugi/po-okrugam-moskvy" element={<DistrictsOverview />} />
                  <Route path="/uslugi/dezinfekciya-:districtId" element={<DistrictPage />} />
                  <Route path="/uslugi/:slug" element={<ServicePage />} />
                  <Route path="/contacts" element={<Contacts />} />
                  
                  {/* Admin routes */}
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
                  
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
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
