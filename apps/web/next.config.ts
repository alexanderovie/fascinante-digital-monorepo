import createMDX from '@next/mdx';
import type { NextConfig } from "next";
import { withBotId } from 'botid/next/config';
import { withSentryConfig } from '@sentry/nextjs';

/**
 * Next.js 15 Configuration (October 2025)
 * Modern configuration following Next.js 15 best practices
 *
 * TODO: Enable strict checks once legacy code issues are resolved
 * - Fix React Hooks rules violations in Layout components
 * - Clean up unused variables and imports
 * - Fix ESLint rule violations
 */
const nextConfig: NextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

  // Server External Packages - Dependencies that use Node.js native features
  // Sentry uses Node.js specific features, so we opt-out from bundling
  // Reference: https://nextjs.org/docs/app/api-reference/config/next-config-js/serverExternalPackages
  serverExternalPackages: [
    '@sentry/nextjs',
    '@sentry/node',
  ],
  images: {
    // Activamos la optimización de imágenes de Next.js
    unoptimized: false,
    // Preferimos WebP (rápido y con buen ratio). AVIF es más pequeño pero más lento de codificar.
    formats: ['image/webp'],
    // TTL mínimo de imágenes optimizadas en CDN (31 días)
    minimumCacheTTL: 2678400,
  },
  // Compiler configuration for modern JavaScript
  // Next.js 15 uses SWC by default (no swcMinify needed - it's always enabled)
  // Elite solution (Nov 2025): Force SWC, prevent Babel polyfills
  // Reference: https://nextjs.org/docs/app/api-reference/config/next-config-js/compiler
  compiler: {
    // Force SWC for all transpilation (prevents Babel from being used)
    // This eliminates polyfills for Array.at(), Object.hasOwn(), etc.
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'], // Keep errors and warnings in production
    } : false,
  },
  // Transpile Packages - Control which packages get transpiled
  // Elite solution (Nov 2025): Only transpile if absolutely necessary
  // MDX should use SWC, not Babel - if it's using Babel, we need to update it
  // Reference: https://nextjs.org/docs/app/api-reference/config/next-config-js/transpilePackages
  // Note: Currently empty - all packages should use SWC via browserslist
  transpilePackages: [],
  // ESLint configuration per Next.js 15 official documentation
  // Next.js fails production builds when ESLint errors are present by default
  // Reference: https://nextjs.org/docs/15/app/api-reference/config/next-config-js/eslint
  eslint: {
    ignoreDuringBuilds: false, // Build fails on errors (official default behavior)
    dirs: ['app', 'components', 'lib'],
  },
  // TypeScript errors still ignored temporarily until codebase is fully modernized
  typescript: {
    ignoreBuildErrors: true,
  },
  // Headers configuration (Next.js 15.5.6 Official)
  // Reference: https://nextjs.org/docs/app/api-reference/config/next-config-js/headers
  async headers() {
    return [
      {
        // Apply to all routes
        source: "/:path*",
        headers: [
          // Enable DNS prefetching for third-party domains
          // Reference: https://nextjs.org/docs/app/api-reference/config/next-config-js/headers#x-dns-prefetch-control
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
      {
        // Apply to static files (images, fonts, etc.)
        // Note: Next.js automatically sets Cache-Control for immutable assets with SHA-hash in filename
        // Reference: https://nextjs.org/docs/app/api-reference/config/next-config-js/headers#cache-control
        source: "/:path*.(png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|eot)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Apply to _next/static directory (Next.js static assets with hashed filenames)
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  // Example: remark-gfm for GitHub Flavored Markdown
  // options: {
  //   remarkPlugins: [],
  //   rehypePlugins: [],
  // },
});

// Merge MDX config with Next.js config
const configWithMDX = withMDX(nextConfig);

// Apply BotID wrapper for bot protection (official Vercel solution)
// Reference: https://vercel.com/docs/botid/get-started
const configWithBotId = withBotId(configWithMDX);

// Apply Sentry wrapper for error monitoring
// Reference: https://docs.sentry.io/platforms/javascript/guides/nextjs/
export default withSentryConfig(
  configWithBotId,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,

    org: "fascinante-digital",
    project: "javascript-nextjs",
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors.
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  }
);
