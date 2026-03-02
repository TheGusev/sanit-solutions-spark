/**
 * SSR-safe Supabase client wrapper.
 * During SSR (import.meta.env.SSR === true), exports a full no-op stub
 * so that any component importing supabase won't crash during static generation.
 * On the client side, re-exports the real Supabase client.
 */

// Build a recursive no-op proxy that returns itself for any property access
// and returns resolved promises for any function call
const createNoopProxy = (): any => {
  const handler: ProxyHandler<any> = {
    get: (_target, prop) => {
      // Common promise-returning methods
      if (prop === 'select' || prop === 'insert' || prop === 'update' || prop === 'delete' || prop === 'upsert') {
        return (..._args: any[]) => createNoopProxy();
      }
      if (prop === 'invoke') {
        return (..._args: any[]) => Promise.resolve({ data: null, error: null });
      }
      if (prop === 'then') {
        // Make the proxy thenable so await works
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
      // Return the proxy for any other property access
      return createNoopProxy();
    },
    apply: () => createNoopProxy(),
  };
  return new Proxy(function() {}, handler);
};

const noopClient = {
  from: () => createNoopProxy(),
  functions: { 
    invoke: () => Promise.resolve({ data: null, error: null }) 
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

let supabase: any;

if (import.meta.env.SSR) {
  supabase = noopClient;
} else {
  // Dynamic import is NOT used here — we do a static re-export so tree-shaking works.
  // The SSR branch above ensures the real client is never loaded during SSG.
  // This file is only imported by components, and the SSR build will use the noopClient.
  const mod = await import('@/integrations/supabase/client');
  supabase = mod.supabase;
}

export { supabase };
