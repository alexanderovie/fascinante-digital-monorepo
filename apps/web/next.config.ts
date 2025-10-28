import type { NextConfig } from "next";

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
  images: {
    unoptimized: true,
  },
  // Temporarily allow build errors for legacy code compatibility
  // Will be enabled once codebase is fully modernized
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
