/**
 * Audit Types
 * TypeScript definitions for audit-related data structures
 * October 2025
 */

/**
 * DataForSEO API Response Types
 */
export interface RankedKeyword {
  keyword: string;
  position: number;
  search_volume?: number;
  difficulty?: number;
  url?: string;
  highlighted?: string[];
}

export interface RankedKeywordsResponse {
  keywords: RankedKeyword[];
  total_count: number;
}

export interface DomainRankResponse {
  domain_rank: number;
  domain_rank_category?: string;
  // Note: backlinks y referring_domains no incluidos - requieren suscripción link building
}

export interface KeywordOpportunity {
  keyword: string;
  search_volume: number;
  difficulty: number;
  cpc?: number;
  competition?: string;
  trend?: string;
}

export interface KeywordIdeasResponse {
  opportunities: KeywordOpportunity[];
  total_count: number;
}

export interface TechnicalAuditIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  element?: string;
  recommendation?: string;
}

export interface TechnicalAuditResponse {
  issues: TechnicalAuditIssue[];
  score: number;
  total_issues: number;
  critical_issues: number;
  warnings: number;
}

/**
 * Audit Request/Response Types
 */
export interface AuditRequest {
  businessName: string;
  email?: string;
  website?: string;
  placeId?: string;
}

export interface AuditResult {
  auditId: string;
  businessName: string;
  website?: string;
  generatedAt: string;
  status: 'processing' | 'completed' | 'failed';

  // DataForSEO Results
  rankedKeywords?: RankedKeywordsResponse;
  domainRank?: DomainRankResponse;
  keywordOpportunities?: KeywordIdeasResponse;
  technicalAudit?: TechnicalAuditResponse;

  // Google Places Data (if available)
  googlePlaces?: {
    rating?: number;
    reviewsCount?: number;
    address?: string;
    phone?: string;
    website?: string;
  };

  // Error handling
  error?: string;
}

export interface AuditGenerationResponse {
  success: boolean;
  auditId?: string;
  message?: string;
  error?: string;
}
