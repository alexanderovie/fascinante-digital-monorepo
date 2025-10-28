import CleaningHighlight from "@/components/Home/CleaningHighlight";
import CustomerFeedback from "@/components/Home/CustomerFeedback";
import ExcepServices from "@/components/Home/ExcepServices";
import HeroSection from "@/components/Home/Hero";
import Ourwork from "@/components/Home/OurWork";
import Pricing from "@/components/Home/Pricing";
import Promobar from "@/components/Home/Promobar";
import ServiceOfferings from "@/components/Home/ServiceOfferings";
import UserImpact from "@/components/UserImpact";
import type { Locale } from "@/lib/i18n";
import type { Metadata } from "next";
import { getDictionary } from "./dictionaries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const metadata = dict.metadata as {
    title: string;
    description: string;
  };

  return {
    title: metadata.title,
    description: metadata.description,
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <>
      <HeroSection dict={dict.hero as Record<string, string>} locale={locale} />
      <Promobar />
      <ServiceOfferings />
      <CleaningHighlight />
      <ExcepServices />
      <CustomerFeedback />
      <Pricing />
      <Ourwork />
      <UserImpact />
    </>
  );
}
