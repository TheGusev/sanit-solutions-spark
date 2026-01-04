/**
 * Simplified App component for SSR (Static Site Generation)
 * This version excludes client-side only providers:
 * - QueryClientProvider (no data fetching during SSG)
 * - TrafficProvider (client-side analytics)
 * - TooltipProvider (client interactions)
 * - Toaster components (client-side notifications)
 */

import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";

// Import pages directly for SSR (no lazy loading)
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Privacy from "./pages/Privacy";
import ServicePage from "./pages/ServicePage";
import Contacts from "./pages/Contacts";
import NotFound from "./pages/NotFound";

const AppSSR = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/uslugi/:slug" element={<ServicePage />} />
      <Route path="/contacts" element={<Contacts />} />
      
      {/* Admin routes are excluded from SSG - they're behind auth */}
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  </ThemeProvider>
);

export default AppSSR;
