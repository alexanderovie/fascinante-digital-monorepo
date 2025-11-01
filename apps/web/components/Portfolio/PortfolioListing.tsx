import type { Locale } from '@/lib/i18n';
import Image from 'next/image';
import Link from 'next/link';

interface PortfolioListingProps {
  locale: Locale;
}

/**
 * Get all available case studies
 * In a production app, this could read from a CMS or file system
 */
const getCaseStudies = () => {
  // List of case studies - could be dynamically loaded
  return [
    {
      slug: 'restaurante-tampa',
      thumbnail_img: '/images/home/ourwork/work-img-1.png',
      title: 'Restaurante en Tampa logra +250% crecimiento en leads',
      client: 'Restaurante XYZ',
      industry: 'Restaurantes',
      location: 'Tampa, FL',
    },
    // Add more case studies as they're created
  ];
};

const PortfolioListing = ({ locale }: PortfolioListingProps) => {
  const caseStudies = getCaseStudies();

  return (
    <section>
      <div className="relative pt-[105.6px] lg:pt-[176px] bg-[#F5F6F6] dark:bg-[#121212] overflow-hidden">
        <div className="container">
          <div className='relative flex flex-col gap-10 lg:gap-16 xl:gap-20 pt-[88px] pb-20 z-10'>
            <div className='flex lg:flex-row flex-col items-center gap-5 lg:gap-10'>
              <div className='flex flex-col gap-3 lg:max-w-2xl w-full'>
                <div className="badge">
                  <p className="text-current">Fascinante Digital</p>
                </div>
                <h2 className='text-secondary font-semibold'>Portfolio – Casos de Éxito Reales</h2>
              </div>
              <div>
                <p className='text-secondary text-lg lg:pl-9 xl:pl-20'>Descubre cómo transformamos negocios locales en marcas líderes con estrategias de marketing digital comprobadas y resultados medibles.</p>
              </div>
            </div>
            <Link href="#portfolio-list" className='py-9 px-3 bg-primary hover:bg-darkPrimary border border-primary w-fit rounded-4xl cursor-pointer transition-all duration-300'>
              <Image src={"/images/aboutus/down-arrow.svg"} alt='down-arrow' width={24} height={24} className='' />
            </Link>
          </div>
        </div>
        <div className='absolute right-0 bottom-0 translate-x-[30%] translate-y-[30%] w-[325px] h-[325px] rounded-[163px] bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800' aria-hidden="true" />
      </div>
      <div className='dark:bg-dark-gray'>
        <div id="portfolio-list" className='container'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 py-28'>
            {caseStudies.map((caseStudy, index) => {
              return (
                <div key={index} className='group border border-foggy-clay dark:border-natural-gray/20 rounded-md'>
                  <div className='w-full h-[300px] overflow-hidden rounded-t-md'>
                    <Link href={`/${locale}/portfolio/${caseStudy.slug}`}>
                      <Image src={caseStudy.thumbnail_img} alt='image' width={320} height={300} className='group-hover:scale-110 transition-all ease-in duration-300 w-full h-full object-cover rounded-t-md cursor-pointer' />
                    </Link>
                  </div>
                  <div className='p-3 flex justify-between items-center'>
                    <Link href={`/${locale}/portfolio/${caseStudy.slug}`}>
                      <h6 className='font-semibold dark:text-white cursor-pointer'>{caseStudy.title}</h6>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default PortfolioListing
