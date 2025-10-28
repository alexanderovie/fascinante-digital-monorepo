"use client";
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { OurImpactData } from './data';

const OurImpact = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });
  return (
    <section>
      <div className="bg-[url('/images/aboutus/our-impact/our-impact-bg.png')] bg-cover bg-no-repeat bg-center h-full flex justify-center items-center">
        <div className="container">
          <div className='flex flex-col gap-6 md:gap-14 py-20 md:py-28'>
            <div className='flex flex-col gap-3.5'>
              <div className="inline-flex items-center justify-start whitespace-nowrap text-sm font-medium border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:border-blue-300 dark:hover:border-blue-700 shadow-xs h-8 gap-1.5 px-3 rounded-full w-fit text-blue-800 dark:text-blue-200">
                <p className="font-semibold text-current">Who We Are</p>
              </div>
              <h2 className='font-semibold text-white'>Our impact</h2>
              <p className='text-white'>Unlock the power of our versatile pricing plans designed to meet your every need.</p>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-10'>
              {OurImpactData.map((item, index) => {
                return (
                  <div key={index} className='flex flex-col gap-4 bg-white dark:bg-secondary py-4 md:py-8 px-5 md:px-6 rounded-md'>
                    <h2 ref={ref} className="font-black text-primaryText">
                      {inView ? <CountUp start={0} end={item.count} duration={3} /> : "0"}
                      {item.postfix && item.postfix}
                    </h2>
                    <p className='dark:text-white/80'>{item.title}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default OurImpact
