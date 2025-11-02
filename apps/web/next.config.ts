import createMDX from '@next/mdx';
import type { NextConfig } from "next";
import { withBotId } from 'botid/next/config';

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
  images: {
    // Activamos la optimización de imágenes de Next.js
    unoptimized: false,
    // Preferimos WebP (rápido y con buen ratio). AVIF es más pequeño pero más lento de codificar.
    formats: ['image/webp'],
    // TTL mínimo de imágenes optimizadas en CDN (31 días)
    minimumCacheTTL: 2678400,
  },
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
// BotID configuration for bot protection (official Vercel solution)
// Reference: https://vercel.com/docs/botid/get-started
const configWithMDX = withMDX(nextConfig);

// Apply BotID wrapper last
export default withBotId(configWithMDX);
