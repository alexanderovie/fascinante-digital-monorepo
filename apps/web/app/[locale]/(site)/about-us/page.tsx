import OurCareer from "@/components/Aboutus/OurCareer";
import OurCustomers from "@/components/Aboutus/OurCustomers";
import OurImpact from "@/components/Aboutus/OurImpact";
import Quotes from "@/components/Aboutus/Quotes";
import WhoWeAre from "@/components/Aboutus/WhoWeAre";
import ServicesHero from "@/components/Services/ServicesHero";
import type { Locale } from "@/lib/i18n";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    en: "About Us - Bilingual Digital Marketing Agency | Fascinante",
    es: "Nosotros - Agencia Marketing Digital Bilingüe | Fascinante",
  };

  const descriptions = {
    en: "Learn about Fascinante Digital, a bilingual marketing agency helping businesses grow with data-driven strategies. Over 500 businesses empowered with SEO, ads, and automation.",
    es: "Conoce Fascinante Digital, una agencia de marketing bilingüe que ayuda a las empresas a crecer con estrategias basadas en datos. Más de 500 negocios impulsados con SEO, anuncios y automatización.",
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
  };
}

export default async function Page() {
  return (
    <main>
      <ServicesHero anchorLink="#whoweare" />
      <WhoWeAre />
      <OurCustomers />
      <OurImpact />
      <Quotes />
      <OurCareer />
    </main>
  );
};
