"use client";

import type { RankedKeywordsResponse } from '@/types/audit';
import { TrendingUp, ExternalLink } from 'lucide-react';

interface KeywordsRankingProps {
  data: RankedKeywordsResponse;
}

export default function KeywordsRanking({ data }: KeywordsRankingProps) {
  return (
    <div className="bg-white dark:bg-dark-gray rounded-md p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-secondary dark:text-white text-lg mb-1">
            Keywords Posicionadas
          </h3>
          <p className="text-sm text-dusty-gray dark:text-white/70">
            {data.total_count} keywords encontradas
          </p>
        </div>
        <TrendingUp className="size-6 text-primary" />
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {data.keywords && data.keywords.length > 0 ? (
          data.keywords.slice(0, 20).map((keyword, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-dusty-gray dark:text-white/50 min-w-[24px]">
                    #{index + 1}
                  </span>
                  <span className="font-medium text-secondary dark:text-white truncate">
                    {keyword.keyword}
                  </span>
                </div>
                {keyword.url && (
                  <a
                    href={keyword.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1 ml-7"
                  >
                    {new URL(keyword.url).hostname}
                    <ExternalLink className="size-3" />
                  </a>
                )}
              </div>
              <div className="flex items-center gap-4 ml-4">
                {keyword.search_volume !== undefined && (
                  <div className="text-right">
                    <div className="text-xs text-dusty-gray dark:text-white/50">Volumen</div>
                    <div className="font-semibold text-secondary dark:text-white">
                      {keyword.search_volume.toLocaleString()}
                    </div>
                  </div>
                )}
                <div className="text-right min-w-[60px]">
                  <div className="text-xs text-dusty-gray dark:text-white/50">Posición</div>
                  <div className="font-semibold text-primary">
                    {keyword.position > 0 ? keyword.position : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-dusty-gray dark:text-white/70 py-8">
            No se encontraron keywords posicionadas
          </p>
        )}
      </div>
    </div>
  );
}

