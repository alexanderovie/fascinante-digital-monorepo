import { toTitleCase } from '@/lib/utils/text-formatting';

interface PricingContentProps {
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

export function PricingContent({ dict }: PricingContentProps) {
  return (
    <div className="flex flex-col gap-3 items-center justify-center">
      <div className="badge">
        <p className="text-current">{dict.badge}</p>
      </div>
      <h2 className='font-semibold max-w-2xl text-center'>{toTitleCase(dict.title)}</h2>
    </div>
  );
}

