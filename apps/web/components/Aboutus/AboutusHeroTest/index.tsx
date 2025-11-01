import type { Dictionary } from "@/app/[locale]/dictionaries";
import type { Locale } from "@/lib/i18n";
import { toTitleCase } from '@/lib/utils/text-formatting';
import { ChevronRight } from "lucide-react";
import Image from 'next/image';
import Link from "next/link";

interface AboutusHeroTestProps {
  locale: Locale;
  dict: Dictionary;
}

function AboutusHeroTest({ locale, dict }: AboutusHeroTestProps) {
  const heroDict = dict.hero || {};

  return (
    <section>
      <div className="relative pt-24 lg:pt-40 pb-8 bg-[#F5F6F6] dark:bg-[#121212] overflow-hidden">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-10 xl:gap-20 2xl:gap-32 py-20 items-center justify-between">

            {/* Columna izquierda - Badge, título y subtítulo */}
            <div className="flex flex-col gap-6 w-full">
              <div className="flex flex-col gap-3">
                <Link
                  href={`/${locale}/contact-us`}
                  className="badge"
                >
                  {heroDict.badge} →
                  <ChevronRight className="ml-1 size-4 text-current" aria-hidden="true" />
                </Link>
                <h1 className="text-secondary dark:text-white font-semibold min-w-[12ch]">
                  {toTitleCase(heroDict.title || '')}
                </h1>
              </div>

              <p className="text-secondary dark:text-white text-lg sm:text-xl">
                {heroDict.subtitle}
              </p>

              {/* Botón con flecha */}
              <div className="flex flex-col items-center lg:items-start w-full lg:w-auto mt-4">
                <Link href="#whoweare" className='py-9 px-3 bg-primary hover:bg-darkPrimary border border-primary w-fit rounded-4xl cursor-pointer transition-all duration-300'>
                  <Image src={"/images/aboutus/down-arrow.svg"} alt='down-arrow' width={24} height={24} className='' />
                </Link>
              </div>
            </div>

          </div>
        </div>
        <div className='absolute right-0 bottom-0 translate-x-[30%] translate-y-[30%] w-[325px] h-[325px] rounded-[163px] bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800' aria-hidden="true" />
      </div>
    </section>
  )
}

export default AboutusHeroTest
