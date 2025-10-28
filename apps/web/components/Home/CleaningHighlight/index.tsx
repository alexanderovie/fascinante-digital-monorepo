"use client";
import { motion, useInView } from "framer-motion";
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { cleaninghighlight } from './data';

interface CleaningHighlightProps {
  dict: {
    badge: string;
    title: string;
    subtitle: string;
    ctaButton: string;
  };
}

function CleaningHighlight({ dict }: CleaningHighlightProps) {
  const ref = useRef(null);
  const inView = useInView(ref);
  const bottomAnimation = {
    initial: { y: "20%", opacity: 0 },
    animate: inView ? { y: 0, opacity: 1 } : { y: "10%", opacity: 0 },
    transition: { duration: 1, delay: 0.8 },
  };
  return (
    <section>
      <div ref={ref} className='py-20 sm:py-28 bg-white dark:bg-dark-gray'>
        <div className="container">
          <div className='flex flex-col md:flex-row items-center justify-between gap-10'>
            <motion.div {...bottomAnimation} className="flex flex-col gap-10 max-w-2xl lg:pr-16">
              <div className='flex flex-col gap-8'>
                <div className='flex flex-col gap-4'>
                  <div className='flex flex-col gap-3'>
                    <div className="badge">
                      <p className="text-current">{dict.badge}</p>
                    </div>
                    <h2 className='font-semibold'>{dict.title}</h2>
                  </div>
                  <p className='text-xl dark:text-white/70'>{dict.subtitle}</p>
                </div>
                <div className='grid grid-cols-1 xsm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-x-6 xxl:gap-x-10 gap-y-2 lg:gap-y-6'>
                  {cleaninghighlight.map((item, index) => {
                    return (
                      <div key={index} className='flex items-center gap-4'>
                        <Image src={item.image} alt='image' width={48} height={48} />
                        <p className='font-semibold dark:text-white/70'>{item.title}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
              <Link href={"/contact-us"} className="w-fit group flex items-center py-3 px-6 bg-secondary hover:bg-primary dark:bg-white/25 dark:hover:bg-primary rounded-sm transition-all duration-300">
                <span className="text-base text-white group-hover:text-white font-bold">{dict.ctaButton}</span>
              </Link>
            </motion.div>
            <motion.div {...bottomAnimation} className='relative'>
              <Image src={"/images/home/cleaninghighlight/highlight-banner-img.png"} alt="image" width={680} height={655} />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CleaningHighlight
