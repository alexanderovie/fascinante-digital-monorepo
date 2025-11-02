import PrivacyPolicy from "@/components/PrivacyPolicy";
import type { Locale } from "@/lib/i18n";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    en: "Privacy Policy - Data Protection & Privacy | Fascinante",
    es: "Política de Privacidad - Protección de Datos | Fascinante",
  };

  const descriptions = {
    en: "Learn how Fascinante Digital protects your privacy and handles personal data. Our privacy policy explains data collection, usage, and your rights regarding marketing services.",
    es: "Descubre cómo Fascinante Digital protege tu privacidad y maneja datos personales. Nuestra política explica la recopilación de datos, uso y tus derechos sobre servicios de marketing.",
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
  };
}

export default async function Page() {
  return (
    <main>
      <PrivacyPolicy />
    </main>
  );
}
