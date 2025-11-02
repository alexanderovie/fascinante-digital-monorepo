"use client";

import type { DomainRankResponse } from '@/types/audit';
import { Shield } from 'lucide-react';

interface DomainAuthorityProps {
  data: DomainRankResponse;
}

export default function DomainAuthority({ data }: DomainAuthorityProps) {
  const getRankCategory = (rank: number) => {
    if (rank >= 80) return { label: 'Excelente', color: 'text-green-600 dark:text-green-400' };
    if (rank >= 60) return { label: 'Bueno', color: 'text-blue-600 dark:text-blue-400' };
    if (rank >= 40) return { label: 'Regular', color: 'text-yellow-600 dark:text-yellow-400' };
    return { label: 'Bajo', color: 'text-red-600 dark:text-red-400' };
  };

  const category = getRankCategory(data.domain_rank);

  return (
    <div className="bg-white dark:bg-dark-gray rounded-md p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-secondary dark:text-white text-lg mb-1">
            Autoridad del Dominio
          </h3>
          <p className="text-sm text-dusty-gray dark:text-white/70">
            {data.domain_rank_category || 'Métrica de confianza'}
          </p>
        </div>
        <Shield className="size-6 text-primary" />
      </div>

      <div className="flex flex-col items-center justify-center py-8">
        <div className="relative w-48 h-48 mb-6">
          {/* Circular progress */}
          <svg className="transform -rotate-90 w-48 h-48">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${(data.domain_rank / 100) * 552} 552`}
              className="text-primary transition-all duration-500"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-bold text-secondary dark:text-white">
                {data.domain_rank}
              </div>
              <div className="text-sm text-dusty-gray dark:text-white/70">de 100</div>
            </div>
          </div>
        </div>

        <div className={`text-lg font-semibold ${category.color} mb-4`}>
          {category.label}
        </div>

        {/* Información adicional sobre Domain Authority */}
        <div className="text-center text-sm text-dusty-gray dark:text-white/70 max-w-xs">
          <p>
            La autoridad del dominio mide la relevancia y confianza de tu sitio web en los motores de búsqueda.
          </p>
        </div>
      </div>
    </div>
  );
}
