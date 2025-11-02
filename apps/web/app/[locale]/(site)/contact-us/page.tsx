

import ContactBanner from "@/components/Contactus/ContactBanner";
import MapSection from "@/components/Contactus/MapSection";
import type { Locale } from "@/lib/i18n";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    en: "Contact Us - Get Your Free Marketing Audit | Fascinante",
    es: "Contáctanos - Solicita tu Auditoría Gratuita | Fascinante",
  };

  const descriptions = {
    en: "Get in touch with Fascinante Digital for a free marketing audit. Discover how our bilingual strategies can grow your business with SEO, ads, and automation.",
    es: "Contacta con Fascinante Digital para una auditoría de marketing gratuita. Descubre cómo nuestras estrategias bilingües pueden hacer crecer tu negocio con SEO, anuncios y automatización.",
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
  };
}

export default async function Page() {
  return (
    <main>
      <ContactBanner />
      <MapSection />
    </main>
  );
}
