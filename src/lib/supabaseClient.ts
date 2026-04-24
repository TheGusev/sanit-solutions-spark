/**
 * SSR-safe Supabase client wrapper.
 * 
 * On the client side: re-exports the real Supabase client via STATIC import
 * (no top-level await — required for iOS Safari < 15 and reliability on flaky mobile networks).
 * 
 * During SSR (import.meta.env.SSR === true): exports a no-op stub so that components
 * importing supabase don't crash during static generation.
 */

import { supabase as realClient } from '@/integrations/supabase/client';

// Build a recursive no-op proxy that returns itself for any property access
// and returns resolved promises for any function call
const createNoopProxy = (): any => {
  const handler: ProxyHandler<any> = {
    get: (_target, prop) => {
      if (prop === 'select' || prop === 'insert' || prop === 'update' || prop === 'delete' || prop === 'upsert') {
        return (..._args: any[]) => createNoopProxy();
      }
      if (prop === 'invoke') {
        return (..._args: any[]) => Promise.resolve({ data: null, error: null });
      }
      if (prop === 'then') {
        return (resolve: any) => resolve({ data: [], error: null });
      }
      if (prop === 'eq' || prop === 'neq' || prop === 'gt' || prop === 'lt' ||
          prop === 'gte' || prop === 'lte' || prop === 'like' || prop === 'ilike' ||
          prop === 'in' || prop === 'is' || prop === 'order' || prop === 'limit' ||
          prop === 'range' || prop === 'single' || prop === 'maybeSingle' ||
          prop === 'filter' || prop === 'match' || prop === 'not' || prop === 'or' ||
          prop === 'contains' || prop === 'containedBy' || prop === 'textSearch') {
        return (..._args: any[]) => createNoopProxy();
      }
      return createNoopProxy();
    },
    apply: () => createNoopProxy(),
  };
  return new Proxy(function () {}, handler);
};

const noopClient = {
  from: () => createNoopProxy(),
  functions: {
    invoke: () => Promise.resolve({ data: null, error: null }),
  },
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signUp: () => Promise.resolve({ data: null, error: null }),
    signInWithPassword: () => Promise.resolve({ data: null, error: null }),
    signOut: () => Promise.resolve({ error: null }),
  },
  channel: () => ({
    on: () => ({ subscribe: () => ({}) }),
    subscribe: () => ({}),
    unsubscribe: () => {},
  }),
  rpc: () => Promise.resolve({ data: null, error: null }),
  storage: {
    from: () => createNoopProxy(),
  },
};

// SSR check is evaluated at build time → Vite tree-shakes the unused branch.
// On the client, `realClient` is available synchronously (no async chunk, no top-level await).
const supabase: any = import.meta.env.SSR ? noopClient : realClient;

export { supabase };
