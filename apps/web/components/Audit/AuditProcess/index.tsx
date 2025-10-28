"use client";
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { auditProcessSteps } from './data';

interface AuditProcessProps {
  dict: Record<string, any>;
}

const AuditProcess = ({ dict }: AuditProcessProps) => {
  const ref = useRef(null);
  const inView = useInView(ref);

  const bottomAnimation = (index: number) => ({
    initial: { y: "5%", opacity: 0 },
    animate: inView ? { y: 0, opacity: 1 } : { y: "10%", opacity: 0 },
    transition: { duration: 0.4, delay: 0.4 + index * 0.3 },
  });

  const processDict = dict?.sections?.process || {};
  
  const steps = auditProcessSteps.map((step, index) => ({
    ...step,
    title: processDict.steps?.[`step${index + 1}`] || step.title,
    description: processDict.steps?.[`step${index + 1}Desc`] || '',
  }));

  return (
    <section>
      <div ref={ref} className='bg-[#F5F6F6] dark:bg-secondary'>
        <div className="container">
          <div className='flex flex-col gap-10 sm:gap-16 border-t border-natural-gray dark:border-natural-gray/20 py-20 sm:py-28'>
            <div className="flex flex-col gap-3 items-center justify-center">
              <div className="badge">
                <p className="text-current">{processDict.badge || "Proceso Simple"}</p>
              </div>
              <h2 className='font-semibold text-secondary dark:text-white'>{processDict.title || "Cómo Funciona"}</h2>
            </div>
            <div className='grid grid-cols-1 xsm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 xl:gap-10'>
              {steps.map((item, index) => {
                return (
                  <motion.div
                    key={index}
                    className='flex flex-col gap-4 lg:gap-8'
                    {...bottomAnimation(index)}
                  >
                    <div className='py-2 px-2.5 bg-primary rounded-full w-fit'>
                      <span className='font-bold text-white'>0{item.id}</span>
                    </div>
                    <div className='flex flex-col gap-2'>
                      <p className='font-semibold text-secondary dark:text-white'>{item.title}</p>
                      {item.description && (
                        <p className='font-normal text-dusty-gray dark:text-white/70'>{item.description}</p>
                      )}
                    </div>
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

export default AuditProcess

