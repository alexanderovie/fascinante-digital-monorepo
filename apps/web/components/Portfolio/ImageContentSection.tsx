import Image from 'next/image';

interface ImageContentSectionProps {
  image: string;
  imageAlt: string;
  badge?: string;
  title: string;
  content: string;
  reverse?: boolean;
}

export function ImageContentSection({
  image,
  imageAlt,
  badge,
  title,
  content,
  reverse = false,
}: ImageContentSectionProps) {
  return (
    <section className="py-20 md:py-28 dark:bg-dark-gray">
      <div className="container">
        <div
          className={`grid grid-cols-1 md:grid-cols-2 ${reverse ? 'md:grid-flow-dense' : ''
            }`}
        >
          <div
            className={`w-full h-full ${reverse ? 'md:col-start-2' : ''
              }`}
          >
            <Image
              src={image}
              alt={imageAlt}
              width={680}
              height={512}
              className="w-full h-full object-cover rounded-l-md md:rounded-r-md"
            />
          </div>
          <div
            className={`flex flex-col justify-center rounded-r-md gap-6 bg-offwhite-warm dark:bg-secondary px-10 lg:px-14 py-12 lg:py-20 ${reverse ? 'md:col-start-1 md:row-start-1 rounded-r-none md:rounded-l-md' : ''
              }`}
          >
            {badge && (
              <div className="badge">
                <p className="text-current">{badge}</p>
              </div>
            )}
            <h2 className="font-semibold text-secondary dark:text-white">{title}</h2>
            <p className="text-secondary dark:text-white/70 leading-relaxed">{content}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
