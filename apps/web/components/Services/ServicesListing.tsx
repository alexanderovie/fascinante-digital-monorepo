import { services } from '@/app/api/services'
import Image from 'next/image'
import Link from 'next/link'

const ServicesListing = () => {
  return (
    <section>
      <div className="relative pt-24 lg:pt-32 bg-[#F5F6F6]">
        <div className="container">
          <div className='relative flex flex-col gap-10 lg:gap-16 xl:gap-20 pt-14 lg:pt-28 pb-14 z-10'>
            <div className='flex lg:flex-row flex-col items-center gap-5 lg:gap-10'>
              <div className='flex flex-col gap-3 lg:max-w-2xl w-full'>
                <div className="badge">
                  <p className="font-semibold text-current">Fascinante Digital</p>
                </div>
                <h2 className='text-secondary font-semibold'>Services – Sparkling Clean Every Time</h2>
              </div>
              <div>
                <p className='text-secondary text-lg lg:pl-9 xl:pl-20'>Discover our full range of residential and commercial cleaning services. From deep cleaning to routine maintenance, our trusted team ensures your space is spotless and sanitized.</p>
              </div>
            </div>
            <Link href="#services-list" className='py-9 px-3 bg-primary hover:bg-darkPrimary border border-primary w-fit rounded-4xl cursor-pointer transition-all duration-300'>
              <Image src={"/images/aboutus/down-arrow.svg"} alt='down-arrow' width={24} height={24} className='' />
            </Link>
          </div>
        </div>
        <Image src={"/images/aboutus/about-ellipse-img.svg"} alt='ellipse-img' width={316} height={316} className='absolute right-0 bottom-0' />
      </div>
      <div className='dark:bg-dark-gray'>
        <div id="services-list" className='container'>
          <div className='grid grid-cols-3 gap-10 py-28'>
            {services.map((value, index) => {
              return (
                <div key={index} className='group border border-foggy-clay dark:border-natural-gray/20 rounded-md'>
                  <div className='w-full h-[300px] overflow-hidden rounded-t-md'>
                    <Link href={`/services/${value.slug}`}>
                      <Image src={value.thumbnail_img} alt='image' width={320} height={300} className='group-hover:scale-110 transition-all ease-in duration-300 w-full h-full object-cover rounded-t-md cursor-pointer' />
                    </Link>
                  </div>
                  <div className='p-3 flex justify-between items-center'>
                    <Link href={`/services/${value.slug}`}><h6 className='font-semibold dark:text-white cursor-pointer'>{value.service_title}</h6></Link>
                    <Link href={`/services/${value.slug}`}><p className='text-xl font-semibold text-primaryText cursor-pointer'>${value.price}.00</p></Link>
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

export default ServicesListing
