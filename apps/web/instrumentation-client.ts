/**
 * Client-side initialization for Next.js 15.3+
 *
 * This file is automatically executed on the client-side before the app renders.
 * Used for initializing monitoring, analytics, and security services.
 *
 * References:
 * - BotID: https://vercel.com/docs/botid/get-started
 * - Sentry: https://docs.sentry.io/platforms/javascript/guides/nextjs/
 * Last updated: November 2025
 */

import { initBotId } from 'botid/client/core';
import * as Sentry from '@sentry/nextjs';

/**
 * Initialize BotID protection for form endpoints
 * This runs automatically on client-side in Next.js 15.3+
 */
initBotId({
  protect: [
    {
      path: '/api/contact',
      method: 'POST',
    },
    // Add other protected endpoints here as needed
    // {
    //   path: '/api/newsletter',
    //   method: 'POST',
    // },
  ],
});

/**
 * Initialize Sentry Client-side
 * Next.js 15.5.6 official method via instrumentation-client.ts
 * This replaces the deprecated sentry.client.config.ts approach
 *
 * Reference: https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
 */
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  replaysOnErrorSampleRate: 1.0,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // You can remove this option if you're not planning to use the Sentry Session Replay feature:
  integrations: [
    Sentry.replayIntegration({
      // Additional Replay configuration goes in here, for example:
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Set the environment
  environment: process.env.NODE_ENV || 'development',

  // Set release version (useful for tracking deployments)
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
});

/**
 * Track router transitions for better error context
 * This helps Sentry understand navigation patterns when errors occur
 *
 * Reference: https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#track-navigations
 */
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
