/**
 * Client-side BotID initialization
 * Next.js 15.3+ recommended approach per Vercel BotID official docs
 *
 * Reference: https://vercel.com/docs/botid/get-started
 * Last updated: November 2025
 */

import { initBotId } from 'botid/client/core';

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
