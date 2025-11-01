'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import CountUp from 'react-countup';

interface MetricsGridProps {
  metrics: Record<string, { before: number; after: number; unit: string }>;
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, threshold: 0.3 });

  const metricsArray = Object.entries(metrics).map(([key, value]) => ({
    id: key,
    label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
    before: value.before,
    after: value.after,
    unit: value.unit,
    percentage: Math.round(((value.after - value.before) / value.before) * 100),
  }));

  const animation = (index: number) => ({
    initial: { y: '20%', opacity: 0 },
    animate: inView ? { y: 0, opacity: 1 } : { y: '20%', opacity: 0 },
    transition: { duration: 0.6, delay: index * 0.1 },
  });

  return (
    <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-8">
      {metricsArray.map((metric, index) => (
        <motion.div
          key={metric.id}
          {...animation(index)}
          className="flex flex-col gap-4 bg-white dark:bg-secondary py-6 px-5 rounded-md shadow-sm border border-gray-100 dark:border-gray-800"
        >
          <div className="flex flex-col gap-2">
            <div className="badge w-fit">
              <p className="text-current">{metric.label}</p>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-secondary/60 dark:text-white/60 line-through">
                {metric.before.toLocaleString()}
              </span>
              <h3 className="text-3xl md:text-4xl font-black text-primaryText">
                {inView ? (
                  <CountUp start={metric.before} end={metric.after} duration={2.5} />
                ) : (
                  metric.before
                )}
                <span className="text-lg ml-1">{metric.unit}</span>
              </h3>
            </div>
            <p className="text-primary font-semibold text-lg">
              +{metric.percentage}% de crecimiento
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
