import { CustomerFeedbackHeader } from './CustomerFeedbackHeader';
import { VideoPlayer } from './VideoPlayer';

interface CustomerFeedbackProps {
  dict: {
    badge: string;
    title: string;
    subtitle: string;
    clientName: string;
    sectionTitle: string;
    sectionSubtitle: string;
  };
}

const CustomerFeedback = ({ dict }: CustomerFeedbackProps) => {
  return (
    <section>
      <div className='bg-white dark:bg-dark-gray py-20 sm:py-28'>
        <div className="container">
          <div className='flex flex-col gap-16'>
            {/* Header estático - Server Component */}
            <CustomerFeedbackHeader dict={dict} />

            {/* Video player interactivo - Client Component */}
            <VideoPlayer dict={dict} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default CustomerFeedback
