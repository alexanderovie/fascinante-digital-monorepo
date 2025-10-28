import Image from 'next/image'
import Link from 'next/link'
import { FooterData } from './data'

const FooterInfo = () => {
  return (
    <div className="container">
      <div className='relative flex sm:flex-row flex-col justify-between gap-10 pt-9 md:pt-16 pb-20 md:pb-28 border-b border-white/15'>
        <div className='flex flex-col gap-6'>
          <h4 className='font-semibold max-w-[610px] text-white'>Your growth is just one click away — start your journey today.</h4>
          <Link href={"/contact-us"} className='w-fit bg-primary hover:bg-white hover:text-primary py-3.5 px-7 rounded-md font-semibold text-white transition-all duration-300'>
            Book Now
          </Link>
        </div>
        <div className='flex gap-10 md:gap-20 xl:gap-48 xl:pr-40'>
          <ul className='flex flex-col gap-4'>
            {FooterData.usefulLinks.map((item, index) => {
              return (
                <Link href={item.href} key={index}>
                  <li className='text-white/70 whitespace-nowrap hover:text-white'>{item.name}</li>
                </Link>
              )
            })}
          </ul>
          <ul className='flex flex-col gap-4'>
            {FooterData.privacyLink.map((item, index) => {
              return (
                <Link href={item.href} key={index}>
                  <li className='text-white/70 whitespace-nowrap hover:text-white'>{item.name}</li>
                </Link>
              )
            })}
          </ul>
        </div>
        <div className='absolute bottom-7 right-0'>
          <Image src="/images/footer/footer-bottom-icon.svg" alt="footer-icon" width={85} height={85} />
        </div>
      </div>
    </div>
  )
}

export default FooterInfo
