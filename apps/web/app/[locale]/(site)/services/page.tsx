import ServicesListing from "@/components/Services/ServicesListing";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  return {
    title: "Services | Fascinante Digital",
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const homepageDict = dict.homepage as Record<string, any>;

  return (
    <main>
      <ServicesListing
        dict={homepageDict.serviceOfferings || {}}
        locale={locale}
      />
    </main>
  );
}
