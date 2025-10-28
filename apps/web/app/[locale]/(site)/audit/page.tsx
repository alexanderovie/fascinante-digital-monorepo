import AuditHero from "@/components/Audit/Hero";
import WhatWeAudit from "@/components/Audit/WhatWeAudit";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return {
    title: `${dict.audit?.badge || 'Auditoría Gratuita'} | Fascinante Digital`,
    description: dict.audit?.subtitle || 'Analiza tu presencia digital en minutos',
    openGraph: {
      title: `${dict.audit?.badge || 'Auditoría Gratuita'} | Fascinante Digital`,
      description: dict.audit?.subtitle || 'Analiza tu presencia digital en minutos',
      type: 'website',
    },
  };
}

export default async function AuditPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  // Structured Data (Schema.org JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": dict.audit?.title || "Auditoría Digital Gratuita",
    "description": dict.audit?.subtitle || "Analiza tu presencia digital en minutos",
    "provider": {
      "@type": "Organization",
      "name": "Fascinante Digital",
      "url": "https://fascinantedigital.com",
    },
    "serviceType": "SEO Audit",
    "areaServed": {
      "@type": "Country",
      "name": ["US", "MX", "AR", "CL", "CO", "PE"],
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main>
        <AuditHero dict={dict} locale={locale} />
        <WhatWeAudit dict={dict.audit || {}} />
      </main>
    </>
  );
}
