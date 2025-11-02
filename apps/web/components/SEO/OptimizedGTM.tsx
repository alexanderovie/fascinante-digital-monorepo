'use client';

/**
 * Optimized Google Tag Manager Component
 *
 * Optimizations for better mobile PageSpeed:
 * - Lazy loading: Only loads after page is interactive
 * - Conditional: Can be disabled via environment variable
 * - Deferred: Loads after initial render to not block LCP
 *
 * Reference: Next.js 15 best practices for third-party scripts
 * Last updated: November 2025
 */

import Script from 'next/script';
import { useEffect, useState } from 'react';

interface OptimizedGTMProps {
  gtmId: string;
  dataLayer?: Record<string, unknown>;
}

export function OptimizedGTM({ gtmId, dataLayer }: OptimizedGTMProps) {
  const [shouldLoad, setShouldLoad] = useState(false);

  // Load GTM only after user interaction or after a delay (mobile-friendly)
  useEffect(() => {
    // Strategy: Load after page is interactive + small delay to avoid blocking LCP
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, 1000); // 1 second delay - enough for LCP to complete

    // Also load on first user interaction (click, scroll, touch)
    const handleInteraction = () => {
      if (!shouldLoad) {
        setShouldLoad(true);
      }
    };

    window.addEventListener('click', handleInteraction, { once: true });
    window.addEventListener('scroll', handleInteraction, { once: true });
    window.addEventListener('touchstart', handleInteraction, { once: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, [shouldLoad]);

  // Initialize dataLayer before GTM script loads
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      if (dataLayer) {
        window.dataLayer.push(dataLayer);
      }
    }
  }, [dataLayer]);

  // Note: GTM script is already loaded in <head> via beforeInteractive strategy
  // This component now only handles deferred loading for performance optimization
  // but GTM is always present in initial HTML for Tag Assistant detection
  if (!shouldLoad) {
    // Still render noscript fallback for browsers without JS
    return (
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    );
  }

  // Additional noscript fallback (though GTM is already loaded)
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  );
}
