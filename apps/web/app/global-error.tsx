/**
 * Global Error Boundary for Next.js App Router
 *
 * This catches React rendering errors that occur in the root layout.
 * Must be a Client Component and include its own <html> and <body> tags.
 *
 * Reference: https://nextjs.org/docs/app/api-reference/file-conventions/error-handling
 * Last updated: November 2025
 */

'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Report error to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '2rem',
          fontFamily: 'system-ui, sans-serif',
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
            Algo salió mal
          </h1>
          <p style={{ marginBottom: '2rem', color: '#666', textAlign: 'center' }}>
            Hemos sido notificados del error y estamos trabajando para solucionarlo.
          </p>
          <button
            onClick={() => reset()}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Intentar de nuevo
          </button>
        </div>
      </body>
    </html>
  );
}
