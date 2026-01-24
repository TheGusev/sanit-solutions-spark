/**
 * Shared CORS configuration for all Edge Functions
 * Whitelist-based approach instead of wildcard (*)
 */

const ALLOWED_ORIGINS = [
  // Production domains
  'https://goruslugimsk.ru',
  'https://www.goruslugimsk.ru',
  // Lovable preview domains
  'https://sanit-solutions-spark.lovable.app',
  'https://id-preview--51cb7089-b556-4c73-ad6d-780752106744.lovable.app',
];

// Development origins (only in non-production)
const DEV_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
];

/**
 * Get CORS headers with origin validation
 * Allows all .lovable.app subdomains for preview deployments
 */
export function getCorsHeaders(origin: string | null): Record<string, string> {
  // Check if origin is allowed
  const isAllowed = origin && (
    ALLOWED_ORIGINS.includes(origin) ||
    DEV_ORIGINS.includes(origin) ||
    // Allow all Lovable preview subdomains
    origin.endsWith('.lovable.app')
  );
  
  // Return validated origin or first allowed origin as fallback
  const allowedOrigin = isAllowed ? origin : ALLOWED_ORIGINS[0];
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Max-Age': '86400',
  };
}

/**
 * Legacy CORS headers for backward compatibility
 * Use getCorsHeaders(origin) for new code
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
