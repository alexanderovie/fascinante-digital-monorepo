'use client';
import BookServicesModal from '@/components/Layout/Header/BookServicesModal';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { PricingData } from './data';

interface PricingCardsProps {
  dict: {
    starterGrowthDesc: string;
    smartCampaignsDesc: string;
    bookService: string;
  };
}

export function PricingCards({ dict }: PricingCardsProps) {
  const ref = useRef(null);
  const inView = useInView(ref);
  const [modalOpen, setModalOpen] = useState(false);

  const bottomAnimation = (index: number) => ({
    initial: { y: "5%", opacity: 0 },
    animate: inView ? { y: 0, opacity: 1 } : { y: "10%", opacity: 0 },
    transition: { duration: 0.4, delay: 0.4 + index * 0.3 },
  });

  return (
    <div ref={ref} className='flex flex-col gap-6'>
      {PricingData.map((item, index) => {
        // Map titles to dict descriptions
        const getDescription = (title: string) => {
          if (title === "Starter Growth") return dict.starterGrowthDesc;
          if (title === "Smart Campaigns") return dict.smartCampaignsDesc;
          return item.descp; // Fallback to original
        };

        return (
          <motion.div {...bottomAnimation(index)} key={index} className='group dark:bg-dusty-gray/40 border border-natural-gray dark:border-natural-gray/20 shadow-xl py-6 px-4 rounded-md hover:bg-primary dark:hover:bg-dusty-gray hover:border-secondary transition-all duration-500 ease-in-out'>
            <div className='flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6 text-center md:text-left'>
              <div className='flex items-center gap-2.5 lg:gap-6 w-fit'>
                <Image src={item.icon} alt={`${item.title} icon`} width={48} height={48} />
                <h3 className='font-medium group-hover:text-white'>{item.title}</h3>
              </div>
              <div className='lg:max-w-sm'>
                <p className='text-secondary/80 dark:text-white/80 group-hover:text-white/90'>{getDescription(item.title)}</p>
              </div>
              <h4 className='font-medium group-hover:text-white'>${item.price}{item.duration && '/mo'}</h4>
              <div onClick={() => setModalOpen(true)} className="whitespace-nowrap font-bold bg-natural-gray dark:bg-secondary group-hover:bg-white group-hover:text-primary py-3 px-4 rounded-md transition-all duration-500 ease-in-out cursor-pointer">
                {dict.bookService}
              </div>
            </div>
          </motion.div>
        )
      })}
      {modalOpen && (
        <BookServicesModal isOpen={modalOpen} closeModal={() => setModalOpen(false)} />
      )}
    </div>
  );
}
