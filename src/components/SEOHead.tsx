/**
 * React компонент для SEO метаданных с автоматической валидацией
 */

import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import type { PageMetadata } from '@/lib/metadata';
import { validateMetadataInDev } from '@/lib/metadata';
import { generateHelmetProps } from '@/lib/head';

interface SEOHeadProps {
  metadata: PageMetadata;
  pagePath?: string;
}

/**
 * Универсальный компонент для управления <head>
 * Автоматически валидирует метаданные в dev-режиме
 */
export const SEOHead: React.FC<SEOHeadProps> = ({ metadata, pagePath }) => {
  // Валидация в dev-режиме
  useEffect(() => {
    if (import.meta.env.DEV && pagePath) {
      validateMetadataInDev(metadata, pagePath);
    }
  }, [metadata, pagePath]);

  const helmetProps = generateHelmetProps(metadata);

  return (
    <Helmet>
      <title>{helmetProps.title}</title>
      
      {helmetProps.meta.map((meta, idx) => {
        if ('name' in meta) {
          return <meta key={idx} name={meta.name} content={meta.content} />;
        } else if ('property' in meta) {
          return <meta key={idx} property={meta.property} content={meta.content} />;
        }
        return null;
      })}

      {helmetProps.link.map((link, idx) => (
        <link
          key={idx}
          rel={link.rel}
          href={link.href}
          {...(link.hrefLang && { hrefLang: link.hrefLang })}
        />
      ))}

      {/* Schema.org JSON-LD */}
      {metadata.schema && (
        Array.isArray(metadata.schema) 
          ? metadata.schema.map((s, idx) => (
              <script key={idx} type="application/ld+json">
                {JSON.stringify(s)}
              </script>
            ))
          : (
              <script type="application/ld+json">
                {JSON.stringify(metadata.schema)}
              </script>
            )
      )}
    </Helmet>
  );
};

export default SEOHead;
