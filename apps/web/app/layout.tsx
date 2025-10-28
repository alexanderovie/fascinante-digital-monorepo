import Footer from "@/components/Layout/Footer";
import Header from "@/components/Layout/Header";
import ScrollToTop from "@/components/ScrollToTop";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fascinante Digital | Digital Growth for Ambitious Brands",
  description: "Bilingual marketing systems for visibility, credibility, and sustainable growth across the U.S. and Latin America.",
  keywords: ["digital marketing", "SEO", "SEM", "Google Ads", "Meta", "Next.js", "Fascinante Digital", "Tampa", "Florida"],
  icons: {
    icon: [
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  other: {
    "apple-mobile-web-app-title": "Fascinante",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" enableSystem={false} defaultTheme="light">
          <Header />
          {children}
          <Footer />
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
