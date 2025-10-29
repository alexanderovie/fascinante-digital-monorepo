'use client';
import { YouTubeEmbed } from '@next/third-parties/google';
import Image from 'next/image';
import { useState } from 'react';
import { videos } from './data';

interface VideoPlayerProps {
  dict: {
    subtitle: string;
    clientName: string;
  };
}

export function VideoPlayer({ dict }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className='grid grid-cols-1 xl:grid-cols-2 gap-10'>
      {/* Video principal con testimonio */}
      <div className='relative w-full h-[442px] xl:h-full'>
        {isPlaying ? (
          <YouTubeEmbed
            videoid="ak0dX_uszNQ"
            height={442}
            params="controls=1&autoplay=1&modestbranding=1"
            className="w-full h-full rounded-md"
          />
        ) : (
          <>
            <Image
              src="/images/home/testimonial/testimonial-img-1.png"
              alt="Video thumbnail"
              fill
              className="object-cover rounded-md"
            />
            <div
              className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/20"
              onClick={() => setIsPlaying(true)}
            >
              <Image
                src="/images/home/testimonial/video-playicon.svg"
                alt="Play icon"
                width={64}
                height={64}
              />
              <div className="absolute bottom-0 left-0 w-full py-7 px-9">
                <h5 className='dark:text-secondary text-white font-medium'>"{dict.subtitle}"</h5>
                <p className='text-white/80 font-bold mt-1.5 xl:mt-4'>{dict.clientName}</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Videos secundarios con quotes */}
      <div className='grid grid-rows-2 gap-8'>
        {videos.map((item) => (
          <div key={item.id} className='flex flex-col sm:flex-row items-center gap-6 h-full relative'>
            <div className='relative w-full sm:w-[328px] h-[205px] shrink-0'>
              <YouTubeEmbed
                videoid={item.videoId}
                height={205}
                params="controls=1&autoplay=0&modestbranding=1&rel=0"
                className="w-full h-full rounded"
              />
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
