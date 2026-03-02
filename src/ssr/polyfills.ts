/**
 * SSR Polyfills — MUST be imported FIRST in entry-server.tsx
 * 
 * ESM evaluates imports before module body, so these polyfills must live
 * in a separate module to guarantee they run before any other import
 * (e.g. Supabase SDK) touches browser globals like localStorage.
 */

if (typeof globalThis.localStorage === 'undefined') {
  Object.defineProperty(globalThis, 'localStorage', {
    value: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      key: () => null,
      length: 0
    },
    writable: true,
    configurable: true
  });
}

if (typeof globalThis.sessionStorage === 'undefined') {
  Object.defineProperty(globalThis, 'sessionStorage', {
    value: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      key: () => null,
      length: 0
    },
    writable: true,
    configurable: true
  });
}

if (typeof globalThis.window === 'undefined') {
  Object.defineProperty(globalThis, 'window', {
    value: {
      location: { href: '', pathname: '/', search: '', hash: '' },
      navigator: { userAgent: 'SSR' },
      matchMedia: () => ({ matches: false, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => false }),
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
      innerWidth: 1024,
      innerHeight: 768,
      scrollTo: () => {},
      scrollY: 0,
      scrollX: 0,
      pageYOffset: 0,
      pageXOffset: 0,
      getComputedStyle: () => ({}),
      requestAnimationFrame: (cb: () => void) => setTimeout(cb, 0),
      cancelAnimationFrame: () => {},
      IntersectionObserver: class { observe() {} unobserve() {} disconnect() {} },
      ResizeObserver: class { observe() {} unobserve() {} disconnect() {} },
      MutationObserver: class { observe() {} disconnect() {} takeRecords() { return []; } }
    },
    writable: true,
    configurable: true
  });
}

if (typeof globalThis.document === 'undefined') {
  Object.defineProperty(globalThis, 'document', {
    value: {
      createElement: (tag: string) => ({ 
        style: {}, 
        tagName: tag.toUpperCase(),
        setAttribute: () => {},
        getAttribute: () => null,
        appendChild: () => {},
        removeChild: () => {},
        classList: { add: () => {}, remove: () => {}, toggle: () => {}, contains: () => false }
      }),
      createTextNode: () => ({}),
      querySelector: () => null,
      querySelectorAll: () => [],
      getElementById: () => null,
      getElementsByTagName: () => [],
      getElementsByClassName: () => [],
      documentElement: { 
        style: {}, 
        classList: { add: () => {}, remove: () => {}, toggle: () => {}, contains: () => false },
        getAttribute: () => null,
        setAttribute: () => {}
      },
      head: { appendChild: () => {}, removeChild: () => {} },
      body: { appendChild: () => {}, removeChild: () => {}, style: {} },
      cookie: '',
      activeElement: null
    },
    writable: true,
    configurable: true
  });
}
