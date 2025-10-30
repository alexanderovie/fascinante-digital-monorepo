import Footer from "@/components/Layout/Footer";
import Header from "@/components/Layout/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { getDictionary } from "@/lib/dictionaries";
import { locales, type Locale } from "@/lib/i18n";
import { GoogleTagManager } from "@next/third-parties/google";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "../globals.css";
import { I18nProvider } from "./i18n-context";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial"],
});

/**
 * Generate static params for all locales
 * This enables static generation for /en and /es routes
 */
export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * Generate metadata for each locale
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const metadata = dict.metadata as {
    title: string;
    description: string;
    keywords: string;
    ogTitle?: string;
    ogDescription?: string;
  };

  const baseUrl = 'https://fascinantedigital.com';
  const ogTitle = metadata.ogTitle || metadata.title;
  const ogDescription = metadata.ogDescription || metadata.description;

  return {
    metadataBase: new URL(baseUrl),
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords.split(',').map(k => k.trim()),
    icons: {
      icon: [
        { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
        { url: '/favicon.svg', type: 'image/svg+xml' }
      ],
      shortcut: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: `${baseUrl}/${locale}`,
      siteName: 'Fascinante Digital',
      locale: locale === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
      images: [
        {
          url: locale === 'en' ? '/opengraph-image-en.jpg' : '/opengraph-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Fascinante Digital - Marketing Digital',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: [locale === 'en' ? '/opengraph-image-en.jpg' : '/opengraph-image.jpg'],
      site: '@fascinantedig',
      creator: '@fascinantedig',
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        'en': `${baseUrl}/en`,
        'es': `${baseUrl}/es`,
        'x-default': `${baseUrl}/en`,
      },
    },
    other: {
      "apple-mobile-web-app-title": "Fascinante",
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}>) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  // JSON-LD Organization Schema (Next.js 15 Official Method)
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Fascinante Digital',
    url: 'https://fascinantedigital.com',
    logo: 'https://fascinantedigital.com/logo.png',
    sameAs: [
      'https://www.facebook.com/fascinantedigital',
      'https://twitter.com/fascinantedig',
      'https://www.instagram.com/fascinantedigital',
      'https://www.linkedin.com/company/fascinante-digital',
      'https://www.youtube.com/@fascinantedigital',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-800-886-4981',
      contactType: 'customer service',
      areaServed: ['US', 'MX', 'AR', 'CO'],
      availableLanguage: ['Spanish', 'English'],
    },
  };

  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-T7SZM386';

  return (
    <html lang={locale} suppressHydrationWarning>
      <GoogleTagManager gtmId={gtmId} dataLayer={{ page_type: 'marketing_site' }} />
      <body className={inter.className}>
        {/* Local lite-youtube-embed CSS */}
        <link rel="stylesheet" href="/vendor/lite-yt-embed.css" />
        {/* JSON-LD Organization Schema según recomendación oficial Next.js 15 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replace(/</g, '\\u003c'),
          }}
        />
        <QueryProvider>
          <ThemeProvider attribute="class" enableSystem={false} defaultTheme="light">
            <I18nProvider locale={locale} dict={dict}>
              <Header locale={locale} dict={dict} />
              <main>{children}</main>
              <Footer locale={locale} dict={dict} />
            </I18nProvider>
            <ScrollToTop />
            <Toaster
              position="top-center"
              richColors
              closeButton
              duration={5000}
            />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
