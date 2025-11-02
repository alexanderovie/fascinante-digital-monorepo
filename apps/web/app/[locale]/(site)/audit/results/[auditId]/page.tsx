"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AuditResult } from '@/types/audit';
import { API_ENDPOINTS } from '@/lib/api-config';
import { Loader2, Download, Share2 } from 'lucide-react';
import KeywordsRanking from '@/components/Audit/Results/KeywordsRanking';
import DomainAuthority from '@/components/Audit/Results/DomainAuthority';
import SEOOpportunities from '@/components/Audit/Results/SEOOpportunities';

interface AuditResultsPageProps {
  params: Promise<{ locale: string; auditId: string }>;
}

export default function AuditResultsPage({ params: paramsPromise }: AuditResultsPageProps) {
  const [params, setParams] = useState<{ locale: string; auditId: string } | null>(null);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    paramsPromise.then(setParams);
  }, [paramsPromise]);

  useEffect(() => {
    if (!params?.auditId) return;

    // Try to load from localStorage first (client-side storage)
    const storedAudit = localStorage.getItem(`audit_${params.auditId}`);
    if (storedAudit) {
      try {
        const parsed = JSON.parse(storedAudit) as AuditResult;
        setAuditResult(parsed);
        setIsLoading(false);
        return;
      } catch {
        // Invalid stored data, fetch fresh
      }
    }

    // Fetch from API
    fetch(API_ENDPOINTS.audit.results(params.auditId))
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setAuditResult(data);
          // Store in localStorage for later access
          localStorage.setItem(`audit_${params.auditId}`, JSON.stringify(data));
        }
      })
      .catch(() => {
        setError('Failed to load audit results');
      })
      .finally(() => setIsLoading(false));
  }, [params?.auditId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F6F6] dark:bg-secondary">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-dusty-gray dark:text-white/70">Cargando resultados...</p>
        </div>
      </div>
    );
  }

  if (error || !auditResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F6F6] dark:bg-secondary">
        <div className="flex flex-col items-center gap-4 text-center max-w-md px-4">
          <p className="text-red-500 font-semibold">Error al cargar resultados</p>
          <p className="text-dusty-gray dark:text-white/70">{error || 'No se encontraron resultados'}</p>
          <button
            onClick={() => router.push(`/${params?.locale || 'es'}/audit`)}
            className="px-6 py-3 bg-primary text-white rounded-sm hover:bg-primary/90 transition-colors"
          >
            Volver a Auditoría
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-[#F5F6F6] dark:bg-secondary min-h-screen">
      {/* Header */}
      <section className="bg-white dark:bg-secondary border-b border-gray-200 dark:border-gray-700">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="font-semibold text-secondary dark:text-white text-3xl mb-2">
                Resultados de Tu Auditoría
              </h1>
              <p className="text-dusty-gray dark:text-white/70">
                {auditResult.businessName} • {new Date(auditResult.generatedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-sm text-dusty-gray dark:text-white/70 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <Share2 className="size-4" />
                Compartir
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-sm hover:bg-primary/90 transition-colors">
                <Download className="size-4" />
                Descargar PDF
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Results Grid */}
      <section className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ranked Keywords */}
          {auditResult.rankedKeywords && (
            <KeywordsRanking data={auditResult.rankedKeywords} />
          )}

          {/* Domain Authority */}
          {auditResult.domainRank && (
            <DomainAuthority data={auditResult.domainRank} />
          )}

          {/* SEO Opportunities */}
          {auditResult.keywordOpportunities && (
            <SEOOpportunities data={auditResult.keywordOpportunities} />
          )}
        </div>
      </section>
    </main>
  );
}
