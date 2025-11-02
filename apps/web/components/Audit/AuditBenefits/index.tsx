"use client";
import { motion, useInView } from "framer-motion";
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { auditBenefitsData } from './data';

interface AuditBenefitsProps {
  dict: Record<string, unknown>;
  locale: string;
}

function AuditBenefits({ dict, locale }: AuditBenefitsProps) {
  const ref = useRef(null);
  const inView = useInView(ref);
  const bottomAnimation = {
    initial: { y: "20%", opacity: 0 },
    animate: inView ? { y: 0, opacity: 1 } : { y: "10%", opacity: 0 },
    transition: { duration: 1, delay: 0.8 },
  };

  const sectionDict = dict?.sections?.benefits || {};
  const benefits = auditBenefitsData.map((item, index) => ({
    ...item,
    title: dict?.sections?.benefits?.items?.[`item${index + 1}`]?.title || item.title,
  }));

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
                      <p className="text-current">{sectionDict.badge || "Beneficios"}</p>
                    </div>
                    <h2 className='font-semibold text-secondary dark:text-white'>{sectionDict.title || "Qué Obtienes"}</h2>
                  </div>
                  <p className='text-xl text-dusty-gray dark:text-white/70'>
                    {sectionDict.description || "Obtén un análisis completo de tu presencia digital con insights accionables para impulsar tu crecimiento."}
                  </p>
                </div>
                <div className='grid grid-cols-1 xsm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-x-6 xxl:gap-x-10 gap-y-2 lg:gap-y-6'>
                  {benefits.map((item, index) => {
                    return (
                      <div key={index} className='flex items-center gap-4'>
                        <Image src={item.image} alt={item.title} width={48} height={48} />
                        <p className='font-semibold text-secondary dark:text-white/70'>{item.title}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
              <Link href={`/${locale}/audit`} className="w-fit group flex items-center py-3 px-6 bg-secondary hover:bg-primary dark:bg-white/25 dark:hover:bg-primary rounded-sm transition-all duration-300">
                <span className="text-base text-white group-hover:text-white font-bold">{dict?.formTitle || "Solicita Tu Auditoría Gratuita"}</span>
              </Link>
            </motion.div>
            <motion.div {...bottomAnimation} className='relative hidden md:block'>
              <Image src={"/images/home/cleaninghighlight/highlight-banner-img.png"} alt="Audit benefits" width={680} height={655} />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AuditBenefits
