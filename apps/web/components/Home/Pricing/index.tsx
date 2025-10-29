import { PricingCards } from './PricingCards';
import { PricingContent } from './PricingContent';

interface PricingProps {
  dict: {
    badge: string;
    title: string;
    starterGrowth: string;
    starterGrowthDesc: string;
    smartCampaigns: string;
    smartCampaignsDesc: string;
    bookService: string;
  };
}

const Pricing = ({ dict }: PricingProps) => {
  return (
    <section id='pricing'>
      <div className='bg-[#F5F6F6]'>
        <div className="container">
          <div className='py-20 sm:py-28 flex flex-col gap-9 sm:gap-16'>
            {/* Contenido estático - Server Component */}
            <PricingContent dict={dict} />

            {/* Cards con modal y animaciones - Client Component */}
            <PricingCards dict={dict} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Pricing
