import Footer from "@/components/Layout/Footer";
import Header from "@/components/Layout/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { locales, type Locale } from "@/lib/i18n";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "../globals.css";
import { getDictionary } from "./dictionaries";
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
  };

  const baseUrl = 'https://fascinantedigital.com';

  return {
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

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" enableSystem={false} defaultTheme="light">
          <I18nProvider locale={locale} dict={dict}>
            <Header locale={locale} dict={dict} />
            {children}
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
      </body>
    </html>
  );
}
