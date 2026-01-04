// Polyfills for SSR environment
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
      matchMedia: () => ({ matches: false, addListener: () => {}, removeListener: () => {} }),
      addEventListener: () => {},
      removeEventListener: () => {},
      innerWidth: 1024,
      innerHeight: 768,
      scrollTo: () => {},
      getComputedStyle: () => ({})
    },
    writable: true,
    configurable: true
  });
}

if (typeof globalThis.document === 'undefined') {
  Object.defineProperty(globalThis, 'document', {
    value: {
      createElement: () => ({ style: {} }),
      querySelector: () => null,
      querySelectorAll: () => [],
      getElementById: () => null,
      documentElement: { style: {}, classList: { add: () => {}, remove: () => {} } },
      head: { appendChild: () => {} },
      body: { appendChild: () => {} }
    },
    writable: true,
    configurable: true
  });
}

import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import AppSSR from './AppSSR';

export interface RenderResult {
  html: string;
  helmet: {
    title: string;
    meta: string;
    link: string;
    script: string;
  };
}

export function render(url: string): RenderResult {
  const helmetContext: { helmet?: any } = {};
  
  const html = ReactDOMServer.renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <AppSSR />
      </StaticRouter>
    </HelmetProvider>
  );
  
  const { helmet } = helmetContext;
  
  return {
    html,
    helmet: {
      title: helmet?.title?.toString() || '',
      meta: helmet?.meta?.toString() || '',
      link: helmet?.link?.toString() || '',
      script: helmet?.script?.toString() || ''
    }
  };
}
