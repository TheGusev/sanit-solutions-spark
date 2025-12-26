import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate heavy charting library
          'charts': ['recharts'],
          // Supabase in separate chunk
          'supabase': ['@supabase/supabase-js'],
          // Heavy UI components in separate chunk
          'ui-heavy': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-accordion',
            '@radix-ui/react-tabs',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
          ],
        },
      },
    },
    // Enable source maps for production debugging
    sourcemap: false,
    // Minification settings
    minify: 'esbuild',
    // Target modern browsers for smaller bundle
    target: 'es2020',
  },
}));
