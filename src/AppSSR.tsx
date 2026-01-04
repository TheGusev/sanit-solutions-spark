/**
 * Simplified App component for SSR (Static Site Generation)
 * This version excludes client-side only providers and uses SSR-safe components.
 * 
 * Differences from client App:
 * - Uses TrafficProviderSSR (mock context, no side-effects)
 * - Uses IndexSSR (no lazy loading, no client hooks)
 * - No QueryClientProvider, TooltipProvider, Toaster
 */

import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { TrafficProviderSSR } from "./contexts/TrafficContextSSR";

// Import SSR-optimized pages directly (no lazy loading)
import IndexSSR from "./pages/IndexSSR";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Privacy from "./pages/Privacy";
import ServicePage from "./pages/ServicePage";
import Contacts from "./pages/Contacts";
import NotFound from "./pages/NotFound";

const AppSSR = () => (
  <TrafficProviderSSR>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <Routes>
        <Route path="/" element={<IndexSSR />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/uslugi/:slug" element={<ServicePage />} />
        <Route path="/contacts" element={<Contacts />} />
        
        {/* Admin routes are excluded from SSG - they're behind auth */}
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  </TrafficProviderSSR>
);

export default AppSSR;
