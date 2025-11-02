import TermsAndConditions from "@/components/TermsAndConditions";
import type { Locale } from "@/lib/i18n";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    en: "Terms & Conditions - Legal Information | Fascinante",
    es: "Términos y Condiciones - Información Legal | Fascinante",
  };

  const descriptions = {
    en: "Read the terms and conditions for using Fascinante Digital's services. Understand our policies, user responsibilities, and service agreements for marketing solutions.",
    es: "Lee los términos y condiciones para usar los servicios de Fascinante Digital. Entiende nuestras políticas, responsabilidades del usuario y acuerdos de servicio para soluciones.",
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
  };
}

export default async function Page() {
  return (
    <main>
      <TermsAndConditions />
    </main>
  );
}
