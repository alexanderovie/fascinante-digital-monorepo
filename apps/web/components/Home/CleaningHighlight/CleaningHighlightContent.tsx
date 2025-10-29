import { toTitleCase } from '@/lib/utils/text-formatting';
import Image from 'next/image';
import Link from 'next/link';
import { cleaninghighlight } from './data';

interface CleaningHighlightContentProps {
  dict: {
    badge: string;
    title: string;
    subtitle: string;
    ctaButton: string;
  };
}

export function CleaningHighlightContent({ dict }: CleaningHighlightContentProps) {
  return (
    <div className="flex flex-col gap-10 max-w-2xl lg:pr-16">
      <div className='flex flex-col gap-8'>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-3'>
            <div className="badge">
              <p className="text-current">{dict.badge}</p>
            </div>
            <h2 className='font-semibold'>{toTitleCase(dict.title)}</h2>
          </div>
          <p className='text-xl dark:text-white/70'>{toTitleCase(dict.subtitle)}</p>
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
    </div>
  );
}

