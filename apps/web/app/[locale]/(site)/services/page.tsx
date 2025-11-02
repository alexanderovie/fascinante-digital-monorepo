import ServicesListing from "@/components/Services/ServicesListing";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    en: "Digital Marketing Services & Solutions | Fascinante Digital",
    es: "Servicios de Marketing Digital y Soluciones | Fascinante",
  };

  const descriptions = {
    en: "Comprehensive digital marketing services including SEO, Google & Meta ads, digital branding, web design, and automation. Data-driven strategies for measurable growth.",
    es: "Servicios completos de marketing digital incluyendo SEO, anuncios Google y Meta, branding digital, diseño web y automatización. Estrategias basadas en datos para crecimiento.",
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const homepageDict = dict.homepage as Record<string, unknown>;

  return (
    <main>
      <ServicesListing
        dict={homepageDict.serviceOfferings || {}}
        locale={locale}
      />
    </main>
  );
}
