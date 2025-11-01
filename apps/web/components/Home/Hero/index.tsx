import type { Locale } from "@/lib/i18n";
import { HeroContent } from './HeroContent';
import { HeroForm } from './HeroForm';

interface HeroSectionProps {
  dict: Record<string, string>;
  locale: Locale;
}

function HeroSection({ dict, locale }: HeroSectionProps) {
  return (
    <section>
      <div className="relative pt-[105.6px] lg:pt-[176px] pb-8">
        <div className="bg-white dark:bg-[#121212] h-full flex justify-center items-start">
          <div className="container">
            <div className="flex flex-col lg:flex-row gap-10 xl:gap-20 2xl:gap-32 pt-[88px] pb-20 items-start justify-between">

              {/* Contenido estático - Server Component */}
              <HeroContent dict={dict} locale={locale} />

              {/* Formulario interactivo - Client Component */}
              <HeroForm dict={dict} locale={locale} />

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
