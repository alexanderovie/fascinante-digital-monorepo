import AuditHero from "@/components/Audit/Hero";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import type { Metadata } from "next";
import dynamic from "next/dynamic";

// Lazy load components with framer-motion (below-fold on audit page)
// Note: These are Client Components internally, Next.js handles code splitting automatically
const AuditBenefitsLazy = dynamic(() => import("@/components/Audit/AuditBenefits"));
const AuditProcessLazy = dynamic(() => import("@/components/Audit/AuditProcess"));
const WhatWeAuditLazy = dynamic(() => import("@/components/Audit/WhatWeAudit"));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  const auditMetadata = dict.audit?.metadata as {
    title?: string;
    description?: string;
  } | undefined;

  return {
    title: auditMetadata?.title || `${dict.audit?.badge || 'Auditoría Gratuita'} | Fascinante Digital`,
    description: auditMetadata?.description || dict.audit?.subtitle || 'Analiza tu presencia digital en minutos',
    openGraph: {
      title: auditMetadata?.title || `${dict.audit?.badge || 'Auditoría Gratuita'} | Fascinante Digital`,
      description: auditMetadata?.description || dict.audit?.subtitle || 'Analiza tu presencia digital en minutos',
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
        {/* Above-fold: Critical for initial render */}
        <AuditHero dict={dict} locale={locale} />

        {/* Below-fold: Lazy-loaded to reduce initial JS bundle */}
        <WhatWeAuditLazy dict={dict.audit || {}} />
        <AuditProcessLazy dict={dict.audit || {}} />
        <AuditBenefitsLazy dict={dict.audit || {}} locale={locale} />
      </main>
    </>
  );
}
