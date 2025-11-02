import { fetchWithTimeout } from '@/lib/fetch-with-timeout';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';
import type { AuditGenerationResponse, AuditRequest, AuditResult } from '@/types/audit';
import { NextRequest, NextResponse } from 'next/server';

const DATAFORSEO_BASE_URL = 'https://data.fascinantedigital.com/v3';

/**
 * Extract domain from website URL
 */
function extractDomain(website?: string): string | null {
  if (!website) return null;

  try {
    const url = website.startsWith('http') ? new URL(website) : new URL(`https://${website}`);
    return url.hostname.replace('www.', '');
  } catch {
    // If invalid URL, try to extract domain manually
    const cleaned = website.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
    return cleaned || null;
  }
}

/**
 * Call DataForSEO API through proxy
 * Note: El proxy maneja la autenticación, no necesitamos pasar credenciales
 * Includes timeout protection (15 seconds - these queries can take longer)
 */
async function callDataForSEO(endpoint: string, payload: unknown) {
  const response = await fetchWithTimeout(
    `${DATAFORSEO_BASE_URL}${endpoint}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // No Authorization header - el proxy maneja las credenciales
      },
      body: JSON.stringify([payload]),
    },
    15000 // 15 seconds timeout (DataForSEO can be slower)
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`DataForSEO API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data[0]?.result?.[0] || null;
}

/**
 * Generate audit ID (simple UUID-like)
 */
function generateAuditId(): string {
  return `audit_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * POST /api/audit/generate
 * Generate a new audit by querying DataForSEO APIs
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 3 requests per hour per IP (expensive operation)
    const clientIP = getClientIP(request);
    const rateLimit = checkRateLimit(clientIP, 3, 3600000); // 3 req/hour

    if (rateLimit.rateLimited) {
      return NextResponse.json<AuditGenerationResponse>(
        {
          success: false,
          error: 'Rate limit exceeded',
          message: 'Too many audit requests. Please try again later.',
          resetTime: rateLimit.resetTime,
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': '3',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimit.resetTime.toString(),
          },
        }
      );
    }

    // Validate content-type and size
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json<AuditGenerationResponse>(
        { success: false, error: 'Content-Type must be application/json' },
        { status: 400 }
      );
    }

    const body: AuditRequest = await request.json();

    // Validate payload size (max 10KB)
    const bodyString = JSON.stringify(body);
    if (bodyString.length > 10 * 1024) {
      return NextResponse.json<AuditGenerationResponse>(
        { success: false, error: 'Request body too large (max 10KB)' },
        { status: 413 }
      );
    }

    // Sanitize and validate inputs
    const sanitizeInput = (input: string, maxLength: number = 200): string => {
      return input
        .trim()
        .replace(/[<>]/g, '') // Remove dangerous characters
        .substring(0, maxLength);
    };

    // Validation
    if (!body.businessName || body.businessName.trim().length < 2) {
      return NextResponse.json<AuditGenerationResponse>(
        { success: false, error: 'Business name is required (min 2 characters)' },
        { status: 400 }
      );
    }

    // Sanitize business name
    const sanitizedBusinessName = sanitizeInput(body.businessName, 200);

    // Category is REQUIRED for DataForSEO queries
    if (!body.category || !body.category.trim()) {
      return NextResponse.json<AuditGenerationResponse>(
        { success: false, error: 'Business category is required' },
        { status: 400 }
      );
    }

    // Sanitize category (stored for future use)
    sanitizeInput(body.category, 100);

    // Extract domain if website provided
    const domain = extractDomain(body.website);

    // Generate audit ID
    const auditId = generateAuditId();

    // Prepare audit result object
    const auditResult: Partial<AuditResult> = {
      auditId,
      businessName: sanitizedBusinessName,
      website: body.website || domain || undefined,
      generatedAt: new Date().toISOString(),
      status: 'processing',
    };

    // Call DataForSEO endpoints in parallel (modern pattern)
    // 1. Google Business Info (si tenemos nombre del negocio)
    // 2. Ranked Keywords (si tenemos dominio)
    // 3. Keyword Overview/Ideas (para volumen de búsqueda)
    // 4. Domain Rank (sin backlinks - no tenemos suscripción link building)
    // 5. On-page SEO (si tenemos dominio)

    const promises: Promise<unknown>[] = [
      // Google Business Info - siempre intentamos si tenemos nombre
      callDataForSEO('/business_data/google/my_business_info/live.ai', {
        keyword: sanitizedBusinessName,
        location_name: 'United States',
        language_name: 'English',
      }).catch(() => null),
    ];

    if (domain) {
      // Solo hacer estas consultas si tenemos dominio
      promises.push(
        // Ranked Keywords - Keywords posicionadas del sitio
        callDataForSEO('/dataforseo_labs/google/ranked_keywords/live.ai', {
          target: domain,
          location_code: 2840, // US
          language_code: 'en',
          limit: 100,
        }).catch(() => null),

        // Domain Rank (sin backlinks - solo autoridad)
        callDataForSEO('/dataforseo_labs/google/domain_rank_overview/live.ai', {
          target: domain,
        }).catch(() => null),

        // Keyword Ideas - Oportunidades SEO basadas en el negocio
        callDataForSEO('/dataforseo_labs/google/keyword_ideas/live.ai', {
          keyword: sanitizedBusinessName,
          location_code: 2840,
          language_code: 'en',
          include_serp_info: true,
          limit: 20,
        }).catch(() => null),

        // Keyword Overview - Volumen de búsqueda de keywords relevantes
        callDataForSEO('/dataforseo_labs/google/keyword_overview/live.ai', {
          keyword: sanitizedBusinessName,
          location_code: 2840,
          language_code: 'en',
        }).catch(() => null)
      );
    }

    const results = await Promise.allSettled(promises);

    // Process Google Business Info
    const [googleBusinessRes, ...otherResults] = results;
    if (googleBusinessRes.status === 'fulfilled' && googleBusinessRes.value) {
      const data = googleBusinessRes.value as {
        rating?: number;
        reviews_count?: number;
        address?: string;
        phone?: string;
        website?: string;
      };
      auditResult.googlePlaces = {
        rating: data.rating || undefined,
        reviewsCount: data.reviews_count || undefined,
        address: data.address || undefined,
        phone: data.phone || undefined,
        website: data.website || domain || undefined,
      };
    }

    // Process other results (ranked keywords, domain rank, etc.) if domain exists
    if (domain && otherResults.length > 0) {
      const [rankedKeywordsRes, domainRankRes, keywordIdeasRes, keywordOverviewRes] = otherResults;

      // Process Ranked Keywords
      if (rankedKeywordsRes.status === 'fulfilled' && rankedKeywordsRes.value) {
        const data = rankedKeywordsRes.value as {
          items?: Array<{
            keyword?: string;
            rank_group?: number;
            rank_absolute?: number;
            search_volume?: number;
            keyword_difficulty?: number;
            url?: string;
          }>;
        };
        auditResult.rankedKeywords = {
          keywords: (data.items || []).map((item) => ({
            keyword: item.keyword || '',
            position: item.rank_group || item.rank_absolute || 0,
            search_volume: item.search_volume || undefined,
            difficulty: item.keyword_difficulty || undefined,
            url: item.url || undefined,
          })),
          total_count: data.items?.length || 0,
        };
      }

      // Process Domain Rank (SIN backlinks - no tenemos suscripción link building)
      if (domainRankRes.status === 'fulfilled' && domainRankRes.value) {
        const data = domainRankRes.value as {
          domain_rank?: number;
        };
        auditResult.domainRank = {
          domain_rank: data.domain_rank || 0,
          // NO incluir backlinks ni referring_domains - no tenemos suscripción
        };
      }

      // Process Keyword Ideas
      if (keywordIdeasRes.status === 'fulfilled' && keywordIdeasRes.value) {
        const data = keywordIdeasRes.value as {
          items?: Array<{
            keyword?: string;
            search_volume?: number;
            keyword_difficulty?: number;
            bid?: number;
          }>;
        };
        auditResult.keywordOpportunities = {
          opportunities: (data.items || []).map((item) => ({
            keyword: item.keyword || '',
            search_volume: item.search_volume || 0,
            difficulty: item.keyword_difficulty || 0,
            cpc: item.bid || undefined,
          })),
          total_count: data.items?.length || 0,
        };
      }

      // Process Keyword Overview (volumen de búsqueda de keyword principal)
      if (keywordOverviewRes?.status === 'fulfilled' && keywordOverviewRes.value) {
        const data = keywordOverviewRes.value as {
          search_volume?: number;
          keyword_difficulty?: number;
          bid?: number;
        };
        // Si no tenemos oportunidades aún, crear una con la keyword principal
        if (!auditResult.keywordOpportunities || auditResult.keywordOpportunities.opportunities.length === 0) {
          auditResult.keywordOpportunities = {
            opportunities: [{
              keyword: sanitizedBusinessName,
              search_volume: data.search_volume || 0,
              difficulty: data.keyword_difficulty || 0,
              cpc: data.bid || undefined,
            }],
            total_count: 1,
          };
        }
      }
    }

    // Mark as completed
    auditResult.status = 'completed';

    // Store audit result (in production, use database/Redis)
    // For now, we'll return it directly - client should store in localStorage or call results endpoint

    return NextResponse.json<AuditGenerationResponse>(
      {
        success: true,
        auditId,
        message: 'Audit completed successfully',
      },
      {
        headers: {
          'X-RateLimit-Limit': '3',
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': rateLimit.resetTime.toString(),
          'Cache-Control': 'no-store',
        },
      }
    );

  } catch (error) {
    // Handle timeout errors specifically
    if (error instanceof Error && error.message.includes('timeout')) {
      return NextResponse.json<AuditGenerationResponse>(
        {
          success: false,
          error: 'Request timeout - DataForSEO API took too long to respond',
        },
        { status: 504 }
      );
    }

    // Generic error for client
    return NextResponse.json<AuditGenerationResponse>(
      {
        success: false,
        error: error instanceof Error && error.message.includes('validation')
          ? error.message
          : 'Failed to generate audit',
      },
      { status: 500 }
    );
  }
}
