/**
 * Server-side instrumentation for Next.js 15.5.6
 *
 * This file runs once when the server starts and is used to initialize
 * server-side services like Sentry error monitoring.
 *
 * Reference: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 * Last updated: November 2025
 */

export async function register() {
  // Only run on server-side (not in Edge Runtime)
  if (typeof window === 'undefined') {
    const Sentry = await import('@sentry/nextjs');

    Sentry.init({
      dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,

      // Adjust this value in production, or use tracesSampler for greater control
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

      // Setting this option to true will print useful information to the console while you're setting up Sentry.
      debug: false,

      // Set the environment
      environment: process.env.NODE_ENV || 'development',

      // Set release version
      release: process.env.SENTRY_RELEASE || process.env.NEXT_PUBLIC_SENTRY_RELEASE,
    });
  }
}

/**
 * Capture request errors from nested React Server Components
 *
 * This hook is called when Next.js encounters an error during request processing,
 * including errors from React Server Components that are not caught by error boundaries.
 *
 * Reference: https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#errors-from-nested-react-server-components
 */
export async function onRequestError(
  err: Error,
  request: { url?: string; method?: string; headers?: Headers },
  context: Record<string, unknown>
) {
  const Sentry = await import('@sentry/nextjs');

  Sentry.captureRequestError(err, {
    request,
    context,
  });
}
