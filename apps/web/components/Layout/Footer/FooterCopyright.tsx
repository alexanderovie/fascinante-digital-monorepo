"use client";
import Link from 'next/link'
import { useI18n } from '@/app/[locale]/i18n-context';
import { useLocale } from '@/lib/hooks/use-locale';

const FooterCopyright = () => {
  const { dict } = useI18n();
  const locale = useLocale();
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
