"use client";

import type { KeywordIdeasResponse } from '@/types/audit';
import { Lightbulb, TrendingUp, DollarSign } from 'lucide-react';

interface SEOOpportunitiesProps {
  data: KeywordIdeasResponse;
}

export default function SEOOpportunities({ data }: SEOOpportunitiesProps) {
  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 30) return 'text-green-600 dark:text-green-400';
    if (difficulty <= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="bg-white dark:bg-dark-gray rounded-md p-6 shadow-sm border border-gray-200 dark:border-gray-700 lg:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-secondary dark:text-white text-lg mb-1">
            Oportunidades SEO
          </h3>
          <p className="text-sm text-dusty-gray dark:text-white/70">
            {data.total_count} keywords con potencial de crecimiento
          </p>
        </div>
        <Lightbulb className="size-6 text-primary" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto">
        {data.opportunities && data.opportunities.length > 0 ? (
          data.opportunities.slice(0, 12).map((opportunity, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-medium text-secondary dark:text-white text-sm flex-1">
                  {opportunity.keyword}
                </h4>
                <TrendingUp className="size-4 text-primary flex-shrink-0 mt-0.5" />
              </div>

              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="text-dusty-gray dark:text-white/50 mb-1">Volumen</div>
                  <div className="font-semibold text-secondary dark:text-white">
                    {opportunity.search_volume.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-dusty-gray dark:text-white/50 mb-1">Dificultad</div>
                  <div className={`font-semibold ${getDifficultyColor(opportunity.difficulty)}`}>
                    {opportunity.difficulty}/100
                  </div>
                </div>
                {opportunity.cpc !== undefined && (
                  <div>
                    <div className="text-dusty-gray dark:text-white/50 mb-1">CPC</div>
                    <div className="font-semibold text-secondary dark:text-white flex items-center gap-1">
                      <DollarSign className="size-3" />
                      {opportunity.cpc.toFixed(2)}
                    </div>
                  </div>
                )}
              </div>

              {opportunity.competition && (
                <div className="text-xs text-dusty-gray dark:text-white/70">
                  Competencia: <span className="font-medium">{opportunity.competition}</span>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center text-dusty-gray dark:text-white/70 py-8">
            No se encontraron oportunidades SEO
          </div>
        )}
      </div>
    </div>
  );
}

