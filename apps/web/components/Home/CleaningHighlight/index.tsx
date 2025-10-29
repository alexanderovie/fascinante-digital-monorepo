import { CleaningHighlightAnimated } from './CleaningHighlightAnimated';
import { CleaningHighlightContent } from './CleaningHighlightContent';

interface CleaningHighlightProps {
  dict: {
    badge: string;
    title: string;
    subtitle: string;
    ctaButton: string;
  };
}

function CleaningHighlight({ dict }: CleaningHighlightProps) {
  return (
    <section>
      <div className='py-20 sm:py-28 bg-white dark:bg-dark-gray'>
        <div className="container">
          <div className='flex flex-col md:flex-row items-center justify-between gap-10'>
            {/* Contenido estático - Server Component */}
            <CleaningHighlightContent dict={dict} />

            {/* Solo la parte animada - Client Component */}
            <CleaningHighlightAnimated />
          </div>
        </div>
      </div>
    </section>
  )
}

export default CleaningHighlight
