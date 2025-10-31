"use client";
import { motion, useInView } from "framer-motion";
import Link from 'next/link';
import { useRef } from 'react';

interface UserImpactProps {
  dict: {
    title: string;
    subtitle: string;
    description: string;
    button: string;
  };
}

const UserImpact = ({ dict }: UserImpactProps) => {
  const ref = useRef(null);
  const inView = useInView(ref);
  const bottomAnimation = {
    initial: { y: "20%", opacity: 0 },
    animate: inView ? { y: 0, opacity: 1 } : { y: "10%", opacity: 0 },
    transition: { duration: 1, delay: 0.8 },
  };
  return (
    <section>
      <div ref={ref} className='relative'>
        <div className="bg-[#F5F6F6] dark:bg-dark-gray xxl:bg-[url('/images/home/userimpact/userimpact-bg.png')] bg-cover bg-no-repeat bg-center h-full flex justify-center items-center">
          <div className="container">
            <div className='grid grid-cols-1 xxl:grid-cols-2'>
              <div></div>
              <motion.div {...bottomAnimation} className='flex flex-col gap-5 py-20 xxl:py-52 xxl:items-start items-center text-center xxl:text-left'>
                <h2 className='text-secondary dark:text-white'>{dict.title}</h2>
                <div className='flex flex-col gap-4'>
                  <h3 className='font-semibold text-secondary dark:text-white'>
                    {dict.subtitle}
                  </h3>
                  <p className="text-secondary dark:text-white/80">{dict.description}</p>
                </div>
                <Link href={"/contact-us"} className='py-3.5 px-6 w-fit bg-primary hover:bg-darkPrimary rounded-md '>
                  <span className="font-semibold text-white">{dict.button}</span>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default UserImpact
