"use client";
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ExcepServicesData } from './data';

interface ExcepServicesProps {
  dict: {
    badge: string;
    title: string;
    subtitle: string;
  };
}

const ExcepServices = ({ dict }: ExcepServicesProps) => {
  const ref = useRef(null);
  const inView = useInView(ref);

  const bottomAnimation = (index: number) => ({
    initial: { y: "5%", opacity: 0 },
    animate: inView ? { y: 0, opacity: 1 } : { y: "10%", opacity: 0 },
    transition: { duration: 0.4, delay: 0.4 + index * 0.3 },
  });
  return (
    <section>
      <div ref={ref} className='bg-[#F5F6F6]'>
        <div className="container">
          <div className='flex flex-col gap-10 sm:gap-16 border-t border-natural-gray dark:border-natural-gray/20 py-20 sm:py-28'>
            <div className="flex flex-col gap-3 items-center justify-center">
              <div className="badge">
                <p className="text-current">{dict.badge}</p>
              </div>
              <h2 className='font-semibold'>{dict.title}</h2>
            </div>
            <div className='grid grid-cols-1 xsm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 xl:gap-10'>
              {ExcepServicesData.map((item, index) => {
                return (
                  <motion.div
                    key={index}
                    className='flex flex-col gap-4 lg:gap-8'
                    {...bottomAnimation(index)}
                  >
                    <div className='py-2 px-2.5  bg-primary rounded-full w-fit'>
                      <span className='font-bold text-white'>0{item.id}</span>
                    </div>
                    <p className='font-normal text-dusty-gray dark:text-white/70'>{item.title}</p>
                  </motion.div>
                );
              })}

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ExcepServices
