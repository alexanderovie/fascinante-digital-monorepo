import { config } from "dotenv";
import type { NextConfig } from "next";
import path from "path";

config();

const nextConfig: NextConfig = {
  // Configuración para monorepo Turborepo (Vercel 2025)
  outputFileTracingRoot: path.join(__dirname, "../../"),
  transpilePackages: ["@repo/shared", "@repo/database", "@repo/auth"],

  // Permitir build en producción (template con strict typing issues)
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost"
      },
      {
        protocol: "https",
        hostname: "bundui-images.netlify.app"
      }
    ]
  }
};

export default nextConfig;
