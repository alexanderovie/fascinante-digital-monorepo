
import ServicesDetail from "@/components/Services/ServicesDetail";
import type { Locale } from "@/lib/i18n";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;

  // Map slug to service names
  const serviceNames: Record<string, { en: string; es: string }> = {
    'digital-branding': { en: 'Digital Branding', es: 'Branding Digital' },
    'seo-optimization': { en: 'SEO Optimization', es: 'Optimización SEO' },
    'google-meta-ads': { en: 'Google & Meta Ads', es: 'Anuncios Google y Meta' },
    'web-design': { en: 'Web Design', es: 'Diseño Web' },
    'brand-identity': { en: 'Brand Identity', es: 'Identidad de Marca' },
    'marketing-automation': { en: 'Marketing Automation', es: 'Automatización de Marketing' },
  };

  const serviceName = serviceNames[slug]?.[locale] || serviceNames[slug]?.en || 'Service';

  const titles = {
    en: `${serviceName} Services - Digital Marketing Solutions | Fascinante`,
    es: `Servicios de ${serviceName} - Soluciones Marketing Digital | Fascinante`,
  };

  const descriptions = {
    en: `Discover our ${serviceName.toLowerCase()} services designed to grow your business. Data-driven strategies, proven results, and bilingual support for Florida businesses.`,
    es: `Descubre nuestros servicios de ${serviceName.toLowerCase()} diseñados para hacer crecer tu negocio. Estrategias basadas en datos, resultados comprobados y soporte bilingüe para Florida.`,
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
  };
}

export default async function Details() {
  return (
    <>
      <ServicesDetail />
    </>
  );
}
