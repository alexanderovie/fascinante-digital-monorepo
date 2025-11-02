"use client";
import type { Dictionary } from "@/app/[locale]/dictionaries";
import { useI18n } from '@/app/[locale]/i18n-context';
import { useLocale } from '@/lib/hooks/use-locale';
import type { Locale } from "@/lib/i18n";
import Link from 'next/link';

interface FooterCopyrightProps {
  locale?: Locale;
  dict?: Dictionary;
}

const FooterCopyright = ({ locale: propLocale, dict: propDict }: FooterCopyrightProps = {}) => {
  // ✅ ALL HOOKS FIRST - per React Rules of Hooks
  // Call all hooks at the top level, before any conditional logic
  let contextDict, contextLocale;
  try {
    const context = useI18n();
    contextDict = context.dict;
    contextLocale = context.locale;
  } catch {
    contextDict = undefined;
    contextLocale = undefined;
  }

  // Fallback locale hook - must be called unconditionally
  const fallbackLocale = useLocale();

  // Now derive final values from hooks (pure logic, not hook calls)
  const dict = contextDict ?? propDict;
  const locale = contextLocale ?? propLocale ?? fallbackLocale;

  // ✅ CONDITIONAL RETURN AFTER ALL HOOKS
  if (!dict || !locale) return null;

  const footer = dict.footer as Record<string, string>;

  const copyrightLinks = [
    { name: footer.termsOfService, href: `/${locale}/terms-and-conditions` },
    { name: footer.privacyPolicy, href: `/${locale}/privacy-policy` },
  ];

  return (
    <div className='container'>
      <div className='py-4 md:py-6 flex flex-col md:flex-row gap-2 md:gap-5 justify-between items-center'>
        <p className='text-center md:text-left text-white/70'>{footer.copyright}</p>
        <div className='flex md:flex-nowrap flex-wrap row-gap-2 gap-x-5 justify-center'>
          {copyrightLinks.map((item, index) => {
            return (
              <Link href={item.href} key={index}>
                <p className='whitespace-nowrap text-white/70 hover:text-white'>{item.name}</p>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default FooterCopyright
