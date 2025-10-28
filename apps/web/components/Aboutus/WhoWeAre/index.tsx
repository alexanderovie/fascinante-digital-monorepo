import Image from 'next/image'
import Link from 'next/link'

const WhoWeAre = () => {
  return (
    <section id="whoweare">
      <div className='py-20 md:py-28 dark:bg-dark-gray'>
        <div className="container">
          <div className='grid grid-cols-1 md:grid-cols-2'>
            <div className='w-full h-full'>
              <Image src="/images/aboutus/who-we-are-img.png" alt='image' width={680} height={512} className='w-full h-full object-cover rounded-l-md' />
            </div>
            <div className='flex flex-col justify-center rounded-r-md gap-6 bg-offwhite-warm dark:bg-secondary px-10 lg:px-14 py-12 lg:py-20'>
              <div className='flex flex-col gap-3'>
                <div className="badge">
                  <p className="text-current">Who We Are</p>
                </div>
                <h2 className='font-semibold'>More time to live, work and have game</h2>
              </div>
              <p className='dark:text-white/70'>Maecenas sapien nisl, eleifend eu bibendum sit amet, pharetra a orci. Vivamus euismod vehicula tortor, in sollicitudin dui consectetur in. Nam dolor justo, venenatis nec luctus in, ullamcorper ac turpis. Donec elementum accumsan placerat. Proin facilisis, diam sit amet.</p>
              <Link href={"/"} className='w-fit text-secondary dark:text-white border-b-2 border-primaryText hover:text-primaryText'>
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhoWeAre
