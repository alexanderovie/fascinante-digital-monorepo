/**
 * Root Layout - Minimal layout for non-localized routes
 * All localized routes are handled by app/[locale]/layout.tsx
 * This layout is used for:
 * - API routes (handled separately)
 * - Static files (robots.ts, sitemap.ts, etc.)
 */
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
