'use client';
import { motion, useInView } from "framer-motion";
import Image from 'next/image';
import { useRef } from 'react';

export function CleaningHighlightAnimated() {
  const ref = useRef(null);
  const inView = useInView(ref);

  const bottomAnimation = {
    initial: { y: "20%", opacity: 0 },
    animate: inView ? { y: 0, opacity: 1 } : { y: "10%", opacity: 0 },
    transition: { duration: 1, delay: 0.8 },
  };

  return (
    <motion.div ref={ref} {...bottomAnimation} className='relative'>
      <Image
        src={"/images/home/cleaninghighlight/highlight-banner-img.png"}
        alt="image"
        width={680}
        height={655}
        quality={70}
        sizes="(max-width: 768px) 90vw, 680px"
      />
    </motion.div>
  );
}

