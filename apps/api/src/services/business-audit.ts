/**
 * Business Audit Service
 * Generates free digital marketing audits using Google Places API + Vertex AI
 *
 * Stack:
 * - Google Places API (Text Search + Details)
 * - Vertex AI Gemini 2.0
 * - Cloudflare Workers compatible
 */

interface BusinessSearchResult {
  place_id: string;
  name: string;
  formatted_address: string;
  rating?: number;
  user_ratings_total?: number;
  types?: string[];
}

interface BusinessDetails {
  name: string;
  rating?: number;
  user_ratings_total?: number;
  reviews?: Array<{
    author_name: string;
    rating: number;
    text: string;
    time: number;
  }>;
  website?: string;
  formatted_phone_number?: string;
  business_status: string;
  opening_hours?: {
    weekday_text: string[];
  };
  types: string[];
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
}

interface AuditResult {
  business: {
    name: string;
    rating: number;
    totalReviews: number;
    website: string | null;
    phone: string | null;
    status: string;
    categories: string[];
  };
  score: number;
  insights: {
    seo: string[];
    reputation: string[];
    branding: string[];
  };
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    category: string;
    title: string;
    description: string;
    action: string;
  }>;
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  generatedAt: string;
}

export class BusinessAuditService {
  private placesApiKey: string;
  private vertexAiEndpoint?: string;
  private vertexAiApiKey?: string;

  constructor(options: {
    placesApiKey: string;
    vertexAiEndpoint?: string;
    vertexAiApiKey?: string;
  }) {
    this.placesApiKey = options.placesApiKey;
    this.vertexAiEndpoint = options.vertexAiEndpoint;
    this.vertexAiApiKey = options.vertexAiApiKey;
  }

  /**
   * Generate a free business audit
   */
  async generateAudit(businessName: string): Promise<AuditResult> {
    // Step 1: Search for business
    const searchResult = await this.searchBusiness(businessName);

    if (!searchResult) {
      throw new Error(`Business "${businessName}" not found`);
    }

    // Step 2: Get detailed information
    const details = await this.getBusinessDetails(searchResult.place_id);

    // Step 3: Analyze with AI
    const analysis = await this.analyzeWithAI(details);

    // Step 4: Structure audit result
    return {
      business: {
        name: details.name,
        rating: details.rating || 0,
        totalReviews: details.user_ratings_total || 0,
        website: details.website || null,
        phone: details.formatted_phone_number || null,
        status: details.business_status,
        categories: details.types || [],
      },
      score: analysis.score,
      insights: analysis.insights,
      recommendations: analysis.recommendations,
      sentiment: analysis.sentiment,
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Search for a business by name using Google Places API
   */
  private async searchBusiness(name: string): Promise<BusinessSearchResult | null> {
    const url = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
    url.searchParams.set('query', name);
    url.searchParams.set('key', this.placesApiKey);
    url.searchParams.set('language', 'es'); // Spanish results

    try {
      const response = await fetch(url.toString());
      const data = await response.json();

      if (data.status === 'OK' && data.results && data.results.length > 0) {
        return data.results[0] as BusinessSearchResult;
      }

      return null;
    } catch (error) {
      console.error('Error searching business:', error);
      throw new Error('Failed to search business');
    }
  }

  /**
   * Get detailed business information
   */
  private async getBusinessDetails(placeId: string): Promise<BusinessDetails> {
    const fields = [
      'name',
      'rating',
      'user_ratings_total',
      'reviews',
      'website',
      'formatted_phone_number',
      'business_status',
      'opening_hours',
      'types',
      'photos',
    ].join(',');

    const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
    url.searchParams.set('place_id', placeId);
    url.searchParams.set('fields', fields);
    url.searchParams.set('key', this.placesApiKey);
    url.searchParams.set('language', 'es');

    try {
      const response = await fetch(url.toString());
      const data = await response.json();

      if (data.status === 'OK' && data.result) {
        return data.result as BusinessDetails;
      }

      throw new Error(`Failed to get details: ${data.status}`);
    } catch (error) {
      console.error('Error getting business details:', error);
      throw new Error('Failed to get business details');
    }
  }

  /**
   * Analyze business data with Vertex AI Gemini 2.0
   *
   * Note: This is a simplified version. For production, use the official
   * @google-cloud/vertexai SDK in Cloud Functions, or call Vertex AI REST API
   */
  private async analyzeWithAI(details: BusinessDetails): Promise<{
    score: number;
    insights: {
      seo: string[];
      reputation: string[];
      branding: string[];
    };
    recommendations: Array<{
      priority: 'high' | 'medium' | 'low';
      category: string;
      title: string;
      description: string;
      action: string;
    }>;
    sentiment: {
      positive: number;
      neutral: number;
      negative: number;
    };
  }> {
    // If Vertex AI endpoint is configured, use it
    if (this.vertexAiEndpoint && this.vertexAiApiKey) {
      return await this.callVertexAI(details);
    }

    // Fallback: Simple heuristic-based analysis
    return this.heuristicAnalysis(details);
  }

  /**
   * Call Vertex AI REST API (for Cloudflare Workers)
   * For Node.js/Cloud Functions, use @google-cloud/vertexai SDK instead
   */
  private async callVertexAI(details: BusinessDetails) {
    const projectId = process.env.GCP_PROJECT_ID || 'your-project-id';
    const location = process.env.GCP_LOCATION || 'us-central1';
    const model = process.env.VERTEX_AI_MODEL || 'gemini-2.0-flash-exp';

    const reviewsText = details.reviews
      ?.slice(0, 5)
      .map(r => `- ${r.text} (${r.rating}/5)`)
      .join('\n') || 'Sin reviews disponibles';

    const prompt = `
Analiza el siguiente negocio y genera una auditoría de marketing digital completa en español:

NEGOCIO:
Nombre: ${details.name}
Rating: ${details.rating || 'N/A'}/5
Total Reviews: ${details.user_ratings_total || 0}
Website: ${details.website || 'No disponible'}
Teléfono: ${details.formatted_phone_number || 'No disponible'}
Estado: ${details.business_status}
Categorías: ${details.types?.join(', ') || 'N/A'}

REVIEWS RECIENTES:
${reviewsText}

GENERA UNA AUDITORÍA EN FORMATO JSON CON:
1. score: número del 0-100 (evaluación general)
2. insights: objeto con arrays de strings para:
   - seo: problemas/oportunidades SEO
   - reputation: análisis de reputación
   - branding: aspectos de branding digital
3. recommendations: array de objetos con:
   - priority: "high" | "medium" | "low"
   - category: categoría de la recomendación
   - title: título corto
   - description: descripción detallada
   - action: acción recomendada
4. sentiment: objeto con porcentajes:
   - positive: % de reviews positivos
   - neutral: % neutrales
   - negative: % negativos

Responde SOLO con JSON válido, sin markdown, sin explicaciones adicionales.
`;

    const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${model}:predict`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.vertexAiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instances: [{
            content: prompt,
          }],
          parameters: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        }),
      });

      const data = await response.json();

      // Parse AI response (format may vary based on Vertex AI version)
      const analysis = JSON.parse(data.predictions[0].content || '{}');

      return {
        score: analysis.score || this.calculateScore(details),
        insights: analysis.insights || { seo: [], reputation: [], branding: [] },
        recommendations: analysis.recommendations || [],
        sentiment: analysis.sentiment || this.calculateSentiment(details),
      };
    } catch (error) {
      console.error('Vertex AI error, using fallback:', error);
      return this.heuristicAnalysis(details);
    }
  }

  /**
   * Fallback heuristic analysis (when AI is not available)
   */
  private heuristicAnalysis(details: BusinessDetails) {
    const score = this.calculateScore(details);
    const sentiment = this.calculateSentiment(details);

    const insights = {
      seo: [] as string[],
      reputation: [] as string[],
      branding: [] as string[],
    };

    const recommendations: Array<{
      priority: 'high' | 'medium' | 'low';
      category: string;
      title: string;
      description: string;
      action: string;
    }> = [];

    // SEO insights
    if (!details.website) {
      insights.seo.push('No hay website visible en Google Business');
      recommendations.push({
        priority: 'high',
        category: 'SEO',
        title: 'Crear sitio web profesional',
        description: 'Un sitio web es fundamental para presencia digital',
        action: 'Desarrollar sitio web optimizado para SEO',
      });
    }

    if ((details.rating || 0) < 4.0) {
      insights.reputation.push('Rating por debajo del óptimo (4.5+)');
      recommendations.push({
        priority: 'high',
        category: 'Reputación',
        title: 'Mejorar calificación promedio',
        description: 'El rating actual puede estar afectando la conversión',
        action: 'Implementar estrategia de solicitud de reviews',
      });
    }

    if ((details.user_ratings_total || 0) < 10) {
      insights.reputation.push('Pocas reviews (menos de 10)');
      recommendations.push({
        priority: 'medium',
        category: 'Reputación',
        title: 'Aumentar número de reviews',
        description: 'Más reviews aumentan la credibilidad del negocio',
        action: 'Automatizar solicitud de reviews post-compra',
      });
    }

    if (details.business_status !== 'OPERATIONAL') {
      insights.branding.push(`Estado del negocio: ${details.business_status}`);
    }

    return {
      score,
      insights,
      recommendations,
      sentiment,
    };
  }

  /**
   * Calculate overall score (0-100)
   */
  private calculateScore(details: BusinessDetails): number {
    let score = 50; // Base score

    // Rating (0-30 points)
    if (details.rating) {
      score += (details.rating / 5) * 30;
    }

    // Reviews quantity (0-20 points)
    const reviewScore = Math.min((details.user_ratings_total || 0) / 10, 20);
    score += reviewScore;

    // Website presence (0-20 points)
    if (details.website) {
      score += 20;
    }

    // Phone number (0-10 points)
    if (details.formatted_phone_number) {
      score += 10;
    }

    // Business status (0-10 points)
    if (details.business_status === 'OPERATIONAL') {
      score += 10;
    }

    return Math.min(Math.round(score), 100);
  }

  /**
   * Calculate sentiment from reviews
   */
  private calculateSentiment(details: BusinessDetails): {
    positive: number;
    neutral: number;
    negative: number;
  } {
    if (!details.reviews || details.reviews.length === 0) {
      return { positive: 0, neutral: 100, negative: 0 };
    }

    let positive = 0;
    let neutral = 0;
    let negative = 0;

    details.reviews.forEach(review => {
      if (review.rating >= 4) {
        positive++;
      } else if (review.rating === 3) {
        neutral++;
      } else {
        negative++;
      }
    });

    const total = details.reviews.length;

    return {
      positive: Math.round((positive / total) * 100),
      neutral: Math.round((neutral / total) * 100),
      negative: Math.round((negative / total) * 100),
    };
  }
}
