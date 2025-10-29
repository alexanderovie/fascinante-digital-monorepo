import { toTitleCase } from '@/lib/utils/text-formatting';

interface CustomerFeedbackHeaderProps {
  dict: {
    sectionTitle: string;
    title: string;
    sectionSubtitle: string;
  };
}

export function CustomerFeedbackHeader({ dict }: CustomerFeedbackHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
      <div className="flex flex-col gap-4 max-w-xl">
        <div className="badge">
          <p className="text-current">{dict.sectionTitle}</p>
        </div>
        <h2 className="font-semibold text-secondary">{toTitleCase(dict.title)}</h2>
      </div>
      <div className="flex flex-col gap-8 max-w-sm">
        <p className="text-secondary">{dict.sectionSubtitle}</p>
      </div>
    </div>
  );
}

