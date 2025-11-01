"use client";
import type { Locale } from '@/lib/i18n';
import Image from 'next/image';
import Link from 'next/link';
import { MDXContent } from './MDXContent';

interface CaseStudyMetadata {
  title?: string;
  client?: string;
  industry?: string;
  location?: string;
  duration?: string;
  heroImage?: string;
  metrics?: Record<string, { before: number; after: number; unit: string }>;
  testimonial?: {
    quote: string;
    clientName: string;
    clientRole: string;
    clientImage?: string;
  };
}

interface CaseStudyLayoutProps {
  locale: Locale;
  metadata: CaseStudyMetadata;
  content: React.ReactNode;
}

const CaseStudyLayout = ({ locale, metadata, content }: CaseStudyLayoutProps) => {
  // Extract first metric for sidebar highlight
  const firstMetric = metadata.metrics
    ? Object.entries(metadata.metrics)[0]
    : null;

  return (
    <section className='dark:bg-dark-gray'>
      <div className="container">
        <div className='pt-24 lg:pt-32'>
          <div className='py-12 xl:py-28 flex flex-col gap-6 sm:gap-10'>
            <div className='flex flex-col md:flex-row items-start md:items-end justify-between gap-5'>
              <div className='flex flex-col gap-2'>
                <div className='flex items-center gap-3'>
                  <Image src={"/images/icon/home-icon.svg"} alt='home-icon' width={28} height={28} />
                  <p className='font-semibold text-secondary/50 dark:text-white/50'><Link href={`/${locale}`} className='text-primaryText'>Home / </Link><Link href={`/${locale}/portfolio`} className='text-primaryText'>Portfolio / </Link>{metadata.client || 'Case Study'}</p>
                </div>
                <h2 className='font-semibold'>{metadata.title || 'Case Study'}</h2>
              </div>
              <div className='flex items-center'>
                {metadata.location && (
                  <div className='flex gap-2 pr-6 py-2 border-r border-gray/20'>
                    <Image src={"/images/icon/duration-icon.svg"} alt='duration-icon' width={25} height={25} />
                    <p className='text-base md:text-lg text-secondary/80 dark:text-white/80 font-medium'>{metadata.location}</p>
                  </div>
                )}
                {metadata.duration && (
                  <div className='flex gap-2 px-6 py-2'>
                    <Image src={"/images/icon/rating-star.svg"} alt='duration-icon' width={25} height={25} />
                    <p className='text-base md:text-lg text-secondary/80 dark:text-white/80 font-medium'>{metadata.duration}</p>
                  </div>
                )}
              </div>
            </div>
            <div className='relative flex flex-col lg:flex-row justify-between gap-6 xl:gap-10'>
              <div className='flex flex-col gap-5 sm:gap-8'>

                {metadata.heroImage &&
                  <div className='w-full h-[450px]'>
                    <Image src={metadata.heroImage} alt='Image' width={500} height={400} className='w-full h-full object-cover rounded-md' />
                  </div>
                }

                <MDXContent>{content}</MDXContent>
              </div>
              <div className='flex flex-col gap-4 sm:gap-8'>
                {firstMetric && (
                  <div className='relative bg-secondary shadow-xl p-5 xl:py-8 xl:px-6 max-w-3xl w-full h-fit rounded-md'>
                    <div className='relative z-10 flex flex-col gap-6 rounded-md'>
                      <div className='flex flex-col flex-wrap gap-2'>
                        <span className='text-white/80'><s>Antes: {firstMetric[1].before.toLocaleString()} {firstMetric[1].unit}</s></span>
                        <h4 className='text-white font-semibold'>Ahora: {firstMetric[1].after.toLocaleString()} {firstMetric[1].unit}</h4>
                      </div>
                      <ul className='relative  flex flex-col gap-2'>
                        {metadata.metrics &&
                          Object.entries(metadata.metrics).slice(0, 4).map(([key, value], index) => {
                            const percentage = Math.round(((value.after - value.before) / value.before) * 100);
                            return (
                              <li key={index} className='flex items-center gap-2'>
                                <Image src={"/images/icon/star-icon.svg"} alt='feature-icon' width={20} height={20} />
                                <p className='text-white'>+{percentage}% {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</p>
                              </li>
                            )
                          })}
                      </ul>
                      <Link href={`/${locale}/contact-us`} className='py-4 px-3 bg-primary rounded-md text-center cursor-pointer block'>
                        <span className='font-bold dark:text-secondary'>Solicitar Consultoría Gratis</span>
                      </Link>
                    </div>
                    <Image src={"/images/aboutus/about-ellipse-img.svg"} alt='image' width={150} height={150} className='absolute right-0 bottom-0 rounded-md' />
                  </div>
                )}
                {metadata.testimonial && (
                  <div className='border border-natural-gray dark:border-natural-gray/40 flex flex-col gap-3 sm:gap-5 rounded-md p-5 xl:py-8 xl:px-6'>
                    <Image src={"/images/icon/home-icon.svg"} alt='home-icon' width={45} height={45} />
                    <p className='text-secondary/80 dark:text-white/80'>{metadata.testimonial.quote}</p>
                    <div className='flex items-center gap-5'>
                      {metadata.testimonial.clientImage && (
                        <Image src={metadata.testimonial.clientImage} alt='customer-img' height={80} width={80} />
                      )}
                      <div>
                        <h6 className='font-semibold'>{metadata.testimonial.clientName}</h6>
                        <p className='text-secondary/80 dark:text-white/80'>{metadata.testimonial.clientRole}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CaseStudyLayout
