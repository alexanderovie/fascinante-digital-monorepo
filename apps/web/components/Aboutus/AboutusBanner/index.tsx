import Image from 'next/image'
import Link from 'next/link'

const AboutusBanner = () => {
  return (
    <section>
      <div className="relative pt-24 lg:pt-32 bg-[#F5F6F6]">
        <div className="container">
          <div className='relative flex flex-col gap-10 lg:gap-16 xl:gap-20 pt-14 lg:pt-28 pb-14 z-10'>
            <div className='flex lg:flex-row flex-col items-center gap-5 lg:gap-10'>
              <div className='flex flex-col gap-3 lg:max-w-2xl w-full'>
                <div className="inline-flex items-center justify-start whitespace-nowrap text-sm font-medium border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:border-blue-300 dark:hover:border-blue-700 shadow-xs h-8 gap-1.5 px-3 rounded-full w-fit text-blue-800 dark:text-blue-200">
                  <p className="font-semibold text-current">Fascinante Digital</p>
                </div>
                <h2 className='text-secondary font-semibold'>Making automation accessible to everyone</h2>
              </div>
              <div>
                <p className='text-secondary text-lg lg:pl-9 xl:pl-20'>We&apos;ll create high-quality linkable content and build at least 40 high-authority links to each asset, paving the way for you to grow your ranking, improve brand.</p>
              </div>
            </div>
            <Link href="#whoweare" className='py-9 px-3 bg-primary hover:bg-darkPrimary border border-primary w-fit rounded-4xl cursor-pointer transition-all duration-300'>
              <Image src={"/images/aboutus/down-arrow.svg"} alt='down-arrow' width={24} height={24} className='' />
            </Link>
          </div>
        </div>
        <Image src={"/images/aboutus/about-ellipse-img.svg"} alt='ellipse-img' width={316} height={316} className='absolute right-0 bottom-0' />
      </div>
    </section>
  )
}

export default AboutusBanner
