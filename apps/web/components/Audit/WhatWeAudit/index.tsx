"use client";

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Search, TrendingUp, Users, Code, Lightbulb } from 'lucide-react';
import { auditItems } from './data';

interface WhatWeAuditProps {
  dict: Record<string, any>;
}

const icons = [Search, TrendingUp, Users, Code, Lightbulb];

const WhatWeAudit = ({ dict }: WhatWeAuditProps) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const bottomAnimation = (index: number) => ({
    initial: { y: "5%", opacity: 0 },
    animate: inView ? { y: 0, opacity: 1 } : { y: "10%", opacity: 0 },
    transition: { duration: 0.4, delay: 0.1 + index * 0.1 },
  });

  const items = [
    dict.sections?.whatWeAudit?.items?.keywords || auditItems[0].title,
    dict.sections?.whatWeAudit?.items?.seo || auditItems[1].title,
    dict.sections?.whatWeAudit?.items?.competitors || auditItems[2].title,
    dict.sections?.whatWeAudit?.items?.technical || auditItems[3].title,
    dict.sections?.whatWeAudit?.items?.opportunities || auditItems[4].title,
  ];

  return (
    <section>
      <div ref={ref} className='bg-white dark:bg-secondary'>
        <div className="container">
          <div className='flex flex-col gap-10 sm:gap-16 border-t border-natural-gray dark:border-natural-gray/20 py-20 sm:py-28'>
            <div className="flex flex-col gap-3 items-center justify-center">
              <div className="inline-flex items-center justify-start whitespace-nowrap text-sm font-medium border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:border-blue-300 dark:hover:border-blue-700 shadow-xs h-8 gap-1.5 px-3 rounded-full w-fit text-blue-800 dark:text-blue-200">
                <p className="font-semibold text-current">{dict.sections?.whatWeAudit?.badge || "Qué Analizamos"}</p>
              </div>
              <h2 className='font-semibold text-secondary dark:text-white text-center'>
                {dict.sections?.whatWeAudit?.title || "Análisis Completo de Tu Presencia Digital"}
              </h2>
            </div>
            <div className='grid grid-cols-1 xsm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 xl:gap-10'>
              {items.map((item: string, index: number) => {
                const Icon = icons[index] || Search;
                return (
                  <motion.div
                    key={index}
                    className='flex flex-col gap-4 lg:gap-8'
                    {...bottomAnimation(index)}
                  >
                    <div className='py-2 px-2.5 bg-primary rounded-full w-fit'>
                      <Icon className='size-5 text-white' />
                    </div>
                    <p className='font-normal text-dusty-gray dark:text-white/70'>{item}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeAudit;

