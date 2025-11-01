import Image from 'next/image';

interface TestimonialSectionProps {
  testimonial: {
    quote: string;
    clientName: string;
    clientRole: string;
    clientImage?: string;
  };
}

export function TestimonialSection({ testimonial }: TestimonialSectionProps) {
  return (
    <section className="py-12">
      <div className="border border-natural-gray dark:border-natural-gray/40 flex flex-col gap-3 sm:gap-5 rounded-md p-5 xl:py-8 xl:px-6 bg-white dark:bg-secondary">
        <div className="flex items-center gap-4 mb-2">
          <Image
            src="/images/icon/home-icon.svg"
            alt="quote-icon"
            width={45}
            height={45}
          />
        </div>
        <blockquote className="text-secondary/80 dark:text-white/80 text-lg italic">
          &quot;{testimonial.quote}&quot;
        </blockquote>
        <div className="flex items-center gap-5 mt-4">
          {testimonial.clientImage && (
            <Image
              src={testimonial.clientImage}
              alt={testimonial.clientName}
              height={80}
              width={80}
              className="rounded-full"
            />
          )}
          <div>
            <h6 className="font-semibold text-secondary dark:text-white">
              {testimonial.clientName}
            </h6>
            <p className="text-secondary/80 dark:text-white/80">{testimonial.clientRole}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
