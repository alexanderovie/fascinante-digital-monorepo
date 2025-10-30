'use client';
import Image from 'next/image';
import { videos } from './data';

interface VideoPlayerProps {
  dict: {
    subtitle: string;
    clientName: string;
  };
}

export function VideoPlayer({ dict }: VideoPlayerProps) {
  return (
    <div className='grid grid-cols-1 xl:grid-cols-2 gap-10'>
      {/* Tarjeta principal con imagen (placeholder) y testimonio */}
      <div className='relative w-full h-[442px] xl:h-full'>
        <Image
          src="/images/home/testimonial/testimonial-img-1.png"
          alt="Testimonial"
          fill
          className="object-cover rounded-md"
          priority
        />
        <div className="absolute inset-0 bg-black/20 rounded-md" />
        <div className="absolute bottom-0 left-0 w-full py-7 px-9">
          <h5 className='dark:text-secondary text-white font-medium'>"{dict.subtitle}"</h5>
          <p className='text-white/80 font-bold mt-1.5 xl:mt-4'>{dict.clientName}</p>
        </div>
      </div>

      {/* Tarjetas secundarias con imagen (placeholder) y quotes */}
      <div className='grid grid-rows-2 gap-8'>
        {videos.map((item) => (
          <div key={item.id} className='flex flex-col sm:flex-row items-center gap-6 h-full relative'>
            <div className='relative w-full sm:w-[328px] h-[205px] shrink-0'>
              <Image
                src="/images/home/testimonial/testimonial-img-1.png"
                alt="Testimonial"
                fill
                className="object-cover rounded"
              />
              <div className='absolute inset-0 rounded bg-black/10' />
            </div>
            <div className='flex flex-col gap-4'>
              <p className='text-secondary'>{item.quote}</p>
              <p className='text-secondary font-semibold'>{item.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
