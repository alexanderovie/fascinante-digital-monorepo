import { fontVariables } from "@/lib/fonts";
import GoogleAnalyticsInit from "@/lib/ga";
import { cn } from "@/lib/utils";
import { FAVICON_CONFIG, generateMeta, generateOrganizationSchema, generateWebsiteSchema } from "@repo/seo-config";
import { ThemeProvider } from "next-themes";
import { cookies } from "next/headers";
import NextTopLoader from "nextjs-toploader";
import React from "react";

import "./globals.css";

import { ActiveThemeProvider } from "@/components/active-theme";
import { Toaster } from "@/components/ui/sonner";
import { DEFAULT_THEME } from "@/lib/themes";

export const metadata = generateMeta({
  title: "Dashboard",
  description: "Panel de control avanzado para gestión de marketing digital y automatización de procesos empresariales.",
  canonical: "/dashboard",
  keywords: ["dashboard", "panel control", "marketing digital", "automatización", "gestión empresarial"],
  type: "website"
}, 'app');

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const themeSettings = {
    preset: (cookieStore.get("theme_preset")?.value ?? DEFAULT_THEME.preset) as any,
    scale: (cookieStore.get("theme_scale")?.value ?? DEFAULT_THEME.scale) as any,
    radius: (cookieStore.get("theme_radius")?.value ?? DEFAULT_THEME.radius) as any,
    contentLayout: (cookieStore.get("theme_content_layout")?.value ??
      DEFAULT_THEME.contentLayout) as any
  };

  const bodyAttributes = Object.fromEntries(
    Object.entries(themeSettings)
      .filter(([_, value]) => value)
      .map(([key, value]) => [`data-theme-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`, value])
  );

  const organizationSchema = generateOrganizationSchema('app');
  const websiteSchema = generateWebsiteSchema('app');

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Favicon y iconos */}
        <link rel="icon" href={FAVICON_CONFIG.favicon} sizes="any" />
        <link rel="icon" href={FAVICON_CONFIG.icon16} type="image/png" sizes="16x16" />
        <link rel="icon" href={FAVICON_CONFIG.icon32} type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href={FAVICON_CONFIG.appleTouchIcon} />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#6366f1" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={cn("bg-background group/layout font-sans", fontVariables)}
        {...bodyAttributes}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange>
          <ActiveThemeProvider initialTheme={themeSettings}>
            {children}
            <Toaster position="top-center" richColors />
            <NextTopLoader color="var(--primary)" showSpinner={false} height={2} shadow-sm="none" />
            {process.env.NODE_ENV === "production" ? <GoogleAnalyticsInit /> : null}
          </ActiveThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
