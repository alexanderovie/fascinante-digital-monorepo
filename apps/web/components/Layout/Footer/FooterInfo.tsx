"use client";
import type { Dictionary } from "@/app/[locale]/dictionaries";
import { useI18n } from '@/app/[locale]/i18n-context';
import { useLocale } from '@/lib/hooks/use-locale';
import type { Locale } from "@/lib/i18n";
import Image from 'next/image';
import Link from 'next/link';

interface FooterInfoProps {
  locale?: Locale;
  dict?: Dictionary;
}

const FooterInfo = ({ locale: propLocale, dict: propDict }: FooterInfoProps = {}) => {
  // Try to use context, fallback to props (SSG-safe)
  let dict, locale;
  try {
    const context = useI18n();
    dict = context.dict;
    locale = context.locale;
  } catch {
    dict = propDict;
    locale = propLocale || useLocale();
  }

  if (!dict || !locale) return null;

  const footer = dict.footer as Record<string, string>;
  const nav = dict.navigation as Record<string, string>;

  const usefulLinks = [
    { name: nav.home, href: `/${locale}` },
    { name: nav.about, href: `/${locale}/about-us` },
    { name: footer.getQuote, href: `/${locale}` },
  ];

  const privacyLinks = [
    { name: footer.pricingPlans, href: `/${locale}#pricing` },
    { name: "404 Page", href: `/${locale}/not-found` },
  ];

  return (
    <div className="container">
      <div className='relative flex sm:flex-row flex-col justify-between gap-10 pt-9 md:pt-16 pb-20 md:pb-28 border-b border-white/15'>
        <div className='flex flex-col gap-6'>
          <h4 className='font-semibold max-w-[610px] text-white'>{footer.ctaTitle}</h4>
          <Link href={`/${locale}/contact-us`} className='w-fit bg-primary hover:bg-white hover:text-primary py-3.5 px-7 rounded-md font-semibold text-white transition-all duration-300'>
            {footer.ctaButton}
          </Link>
        </div>
        <div className='flex gap-10 md:gap-20 xl:gap-48 xl:pr-40'>
          <ul className='flex flex-col gap-4'>
            {usefulLinks.map((item, index) => {
              return (
                <Link href={item.href} key={index}>
                  <li className='text-white/70 whitespace-nowrap hover:text-white'>{item.name}</li>
                </Link>
              )
            })}
          </ul>
          <ul className='flex flex-col gap-4'>
            {privacyLinks.map((item, index) => {
              return (
                <Link href={item.href} key={index}>
                  <li className='text-white/70 whitespace-nowrap hover:text-white'>{item.name}</li>
                </Link>
              )
            })}
          </ul>
        </div>
        <div className='absolute bottom-7 right-0'>
          <Image src="/images/footer/footer-bottom-icon.svg" alt="footer-icon" width={85} height={85} />
        </div>
      </div>
    </div>
  )
}

export default FooterInfo
