import Footer from "@/components/Layout/Footer";
import Header from "@/components/Layout/Header";
import ScrollToTop from "@/components/ScrollToTop";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fascinante Digital | Agencia de Marketing Digital", 
  description: "Agencia de marketing digital especializada en estrategias personalizadas que generan resultados reales. SEO, SEM, Social Media y más.",
  keywords: ["marketing digital", "SEO", "SEM", "social media", "agencia digital", "Tampa", "Florida"],
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
    <html lang="es" suppressHydrationWarning>
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
