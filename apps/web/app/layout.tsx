import Footer from "@/components/Layout/Footer";
import Header from "@/components/Layout/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { FAVICON_CONFIG, generateMeta, generateOrganizationSchema, generateWebsiteSchema } from "@repo/seo-config";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = generateMeta({
  title: "Inicio",
  description: "Agencia de marketing digital especializada en estrategias personalizadas que generan resultados reales. SEO, SEM, Social Media y más.",
  canonical: "/",
  keywords: ["marketing digital", "SEO", "SEM", "social media", "agencia digital", "Tampa", "Florida"],
  type: "website"
}, 'web');

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = generateOrganizationSchema('web');
  const websiteSchema = generateWebsiteSchema('web');

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Favicon y iconos */}
        <link rel="icon" href={FAVICON_CONFIG.favicon} sizes="any" />
        <link rel="icon" href={FAVICON_CONFIG.icon16} type="image/png" sizes="16x16" />
        <link rel="icon" href={FAVICON_CONFIG.icon32} type="image/png" sizes="32x32" />
        <link rel="icon" href={FAVICON_CONFIG.icon96} type="image/png" sizes="96x96" />

        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href={FAVICON_CONFIG.appleTouchIcon} />
        <link rel="apple-touch-icon" sizes="57x57" href={FAVICON_CONFIG.appleTouchIcon57} />
        <link rel="apple-touch-icon" sizes="60x60" href={FAVICON_CONFIG.appleTouchIcon60} />
        <link rel="apple-touch-icon" sizes="72x72" href={FAVICON_CONFIG.appleTouchIcon72} />
        <link rel="apple-touch-icon" sizes="76x76" href={FAVICON_CONFIG.appleTouchIcon76} />
        <link rel="apple-touch-icon" sizes="114x114" href={FAVICON_CONFIG.appleTouchIcon114} />
        <link rel="apple-touch-icon" sizes="120x120" href={FAVICON_CONFIG.appleTouchIcon120} />
        <link rel="apple-touch-icon" sizes="144x144" href={FAVICON_CONFIG.appleTouchIcon144} />
        <link rel="apple-touch-icon" sizes="152x152" href={FAVICON_CONFIG.appleTouchIcon152} />
        <link rel="apple-touch-icon" sizes="180x180" href={FAVICON_CONFIG.appleTouchIcon180} />

        {/* Safari Pinned Tab */}
        <link rel="mask-icon" href={FAVICON_CONFIG.safariPinnedTab} color={FAVICON_CONFIG.safariPinnedTabColor} />

        {/* Microsoft Tiles */}
        <meta name="msapplication-TileColor" content={FAVICON_CONFIG.msTileColor} />
        <meta name="msapplication-TileImage" content={FAVICON_CONFIG.msTileImage} />

        {/* PWA */}
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
      <body className={inter.className}>
        <ThemeProvider attribute="class" enableSystem={false} defaultTheme="light">
          <Header />
          {children}
          <Footer />
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
