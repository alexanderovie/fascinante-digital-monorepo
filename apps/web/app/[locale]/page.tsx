import CleaningHighlight from "@/components/Home/CleaningHighlight";
import CustomerFeedback from "@/components/Home/CustomerFeedback";
import ExcepServices from "@/components/Home/ExcepServices";
import HeroSection from "@/components/Home/Hero";
import Ourwork from "@/components/Home/OurWork";
import Pricing from "@/components/Home/Pricing";
import Promobar from "@/components/Home/Promobar";
import ServiceOfferings from "@/components/Home/ServiceOfferings";
import UserImpact from "@/components/UserImpact";
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

  const homepageDict = dict.homepage as Record<string, any>;

  return (
    <>
      <HeroSection dict={dict.hero as Record<string, string>} locale={locale} />
      <Promobar dict={homepageDict.promobar} />
      <ServiceOfferings dict={homepageDict.serviceOfferings} />
      <CleaningHighlight dict={homepageDict.transformation} />
      <ExcepServices dict={homepageDict.testimonials} />
      <CustomerFeedback dict={homepageDict.testimonials} />
      <Pricing dict={homepageDict.pricing} />
      <Ourwork dict={homepageDict.portfolio} />
      <UserImpact dict={homepageDict.finalCta} />
    </>
  );
}
