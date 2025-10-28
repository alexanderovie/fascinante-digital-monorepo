import type { Dictionary } from "@/app/[locale]/dictionaries";
import type { Locale } from "@/lib/i18n";
import FooterCopyright from './FooterCopyright';
import FooterInfo from './FooterInfo';
import Newsletter from './Newsletter';

interface FooterProps {
  locale?: Locale;
  dict?: Dictionary;
}

const Footer = ({ locale: propLocale, dict: propDict }: FooterProps = {}) => {
  return (
    <footer>
      <div className='relative z-10 pt-14 md:pt-28 bg-secondary'>
        <Newsletter locale={propLocale} dict={propDict} />
        <FooterInfo locale={propLocale} dict={propDict} />
        <FooterCopyright locale={propLocale} dict={propDict} />
      </div>
    </footer>
  )
}

export default Footer
