import CustomerFeedback from "@/components/Home/CustomerFeedback";
import HeroSection from "@/components/Home/Hero";
import Ourwork from "@/components/Home/OurWork";
import Promobar from "@/components/Home/Promobar";
import {
  CleaningHighlightLazy,
  ExcepServicesLazy,
  PricingLazy,
  ServiceOfferingsLazy,
  UserImpactLazy,
} from "@/components/Home/lazy-components";
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

  const baseUrl = 'https://fascinantedigital.com';

  return {
    title: metadata.title,
    description: metadata.description,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url: `${baseUrl}/${locale}`,
      siteName: 'Fascinante Digital',
      locale: locale === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
      images: [
        {
          url: '/opengraph-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Fascinante Digital - Marketing Digital',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.title,
      description: metadata.description,
      images: ['/opengraph-image.jpg'],
      site: '@fascinantedig',
      creator: '@fascinantedig',
    },
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

  // JSON-LD LocalBusiness Schema (Next.js 15 Official Method)
  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Fascinante Digital',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '2054 Vista Pkwy # 400',
      addressLocality: 'West Palm Beach',
      addressRegion: 'FL',
      postalCode: '33411',
      addressCountry: 'US',
    },
    telephone: '+18008864981',
    url: 'https://fascinantedigital.com',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '12',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 26.7153,
      longitude: -80.0534,
    },
  };

  return (
    <>
      {/* JSON-LD LocalBusiness Schema según recomendación oficial Next.js 15 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessJsonLd).replace(/</g, '\\u003c'),
        }}
      />
      {/* Above-fold: Critical for initial render - NO lazy load */}
      <HeroSection dict={dict.hero as Record<string, string>} locale={locale} />
      <Promobar dict={homepageDict.promobar} />

      {/* Below-fold: Lazy-loaded to reduce initial JS bundle */}
      <ServiceOfferingsLazy dict={homepageDict.serviceOfferings} />
      <CleaningHighlightLazy dict={homepageDict.transformation} />
      <ExcepServicesLazy dict={homepageDict.testimonials} />
      <CustomerFeedback dict={homepageDict.testimonials} />
      <PricingLazy dict={homepageDict.pricing} />
      <Ourwork dict={homepageDict.portfolio} />
      <UserImpactLazy dict={homepageDict.finalCta} />
    </>
  );
}
