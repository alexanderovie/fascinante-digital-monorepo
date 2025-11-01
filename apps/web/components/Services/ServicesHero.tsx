import Image from 'next/image';
import Link from 'next/link';

interface ServicesHeroProps {
  anchorLink?: string; // Link del botón de flecha (por defecto #services-list)
  badge?: string;
  title?: string;
  subtitle?: string;
}

const ServicesHero = ({
  anchorLink = "#services-list",
  badge = "Fascinante Digital",
  title = "Services – Sparkling Clean Every Time",
  subtitle = "Discover our full range of residential and commercial cleaning services. From deep cleaning to routine maintenance, our trusted team ensures your space is spotless and sanitized."
}: ServicesHeroProps = {}) => {
  return (
    <section>
      <div className="relative pt-[105.6px] lg:pt-[176px] bg-[#F5F6F6] dark:bg-[#121212] overflow-hidden">
        <div className="container">
          <div className='relative flex flex-col gap-10 lg:gap-16 xl:gap-20 pt-[88px] pb-20 z-10'>
            <div className='flex lg:flex-row flex-col items-center gap-5 lg:gap-10'>
              <div className='flex flex-col gap-3 lg:max-w-2xl w-full'>
                <div className="badge">
                  <p className="text-current">{badge}</p>
                </div>
                <h2 className='text-secondary dark:text-white font-semibold'>{title}</h2>
              </div>
              <div>
                <p className='text-secondary dark:text-white/80 text-lg lg:pl-9 xl:pl-20'>{subtitle}</p>
              </div>
            </div>
            <Link href={anchorLink} className='py-9 px-3 bg-primary hover:bg-darkPrimary border border-primary w-fit rounded-4xl cursor-pointer transition-all duration-300'>
              <Image src={"/images/aboutus/down-arrow.svg"} alt='down-arrow' width={24} height={24} className='' />
            </Link>
          </div>
        </div>
        <div className='absolute right-0 bottom-0 translate-x-[30%] translate-y-[30%] w-[325px] h-[325px] rounded-[163px] bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800' aria-hidden="true" />
      </div>
    </section>
  )
}

export default ServicesHero
