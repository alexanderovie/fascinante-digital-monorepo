import PortfolioListing from "@/components/Portfolio/PortfolioListing";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  const portfolioMetadata = dict.portfolio?.metadata as {
    title?: string;
    description?: string;
  } | undefined;

  return {
    title: portfolioMetadata?.title || `${dict.header?.portfolio || 'Portfolio'} | Fascinante Digital`,
    description: portfolioMetadata?.description || dict.portfolio?.subtitle || 'See the difference of working with an agency focused on real results',
  };
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <main>
      <PortfolioListing locale={locale} dict={dict} />
    </main>
  );
}
