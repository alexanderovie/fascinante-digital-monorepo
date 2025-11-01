import Image from 'next/image'
import Link from 'next/link'

const AboutusBanner = () => {
  return (
    <section>
      <div className="relative pt-[105.6px] lg:pt-[176px] pb-8 bg-[#F5F6F6] dark:bg-[#121212] overflow-hidden">
        <div className="container">
          <div className='relative flex flex-col lg:flex-row gap-10 xl:gap-20 2xl:gap-32 pt-[88px] pb-20 items-center justify-between z-10'>
            {/* Columna izquierda - Contenido principal */}
            <div className='flex flex-col gap-3 w-full lg:max-w-2xl'>
              <div className="badge">
                <p className="text-current">Fascinante Digital</p>
              </div>
              <h2 className='text-secondary dark:text-white font-semibold'>Making automation accessible to everyone</h2>
              <p className='text-secondary dark:text-white/80 text-lg'>We&apos;ll create high-quality linkable content and build at least 40 high-authority links to each asset, paving the way for you to grow your ranking, improve brand.</p>
            </div>

            {/* Columna derecha - Botón con flecha */}
            <div className='flex flex-col items-center lg:items-start w-full lg:w-auto'>
              <Link href="#whoweare" className='py-9 px-3 bg-primary hover:bg-darkPrimary border border-primary w-fit rounded-4xl cursor-pointer transition-all duration-300'>
                <Image src={"/images/aboutus/down-arrow.svg"} alt='down-arrow' width={24} height={24} className='' />
              </Link>
            </div>
          </div>
        </div>
        <div className='absolute right-0 bottom-0 translate-x-[30%] translate-y-[30%] w-[325px] h-[325px] rounded-[163px] bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800' aria-hidden="true" />
      </div>
    </section>
  )
}

export default AboutusBanner
