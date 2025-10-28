/**
 * Servicio de Contexto Automatizado
 * Implementa el patrón élite de carga automática de contexto
 */

export interface ContextSource {
  name: string;
  url: string;
  cacheKey: string;
  ttl: number; // Time to live en segundos
}

export interface ContextData {
  source: string;
  data: any;
  timestamp: number;
  ttl: number;
}

export interface ContextRequest {
  topics: string[];
  forceRefresh?: boolean;
}

export interface ContextResponse {
  contexts: ContextData[];
  cached: boolean;
  timestamp: number;
}

// Fuentes de contexto configuradas
const CONTEXT_SOURCES: Record<string, ContextSource> = {
  nextjs: {
    name: 'Next.js Documentation',
    url: 'https://nextjs.org/docs',
    cacheKey: 'context:nextjs',
    ttl: 21600 // 6 horas
  },
  supabase: {
    name: 'Supabase Documentation',
    url: 'https://supabase.com/docs',
    cacheKey: 'context:supabase',
    ttl: 21600
  },
  cloudflare: {
    name: 'Cloudflare Workers',
    url: 'https://developers.cloudflare.com/workers',
    cacheKey: 'context:cloudflare',
    ttl: 21600
  },
  context7: {
    name: 'Context7 Latest',
    url: 'https://context7.ai',
    cacheKey: 'context:context7',
    ttl: 3600 // 1 hora
  }
};

export class ContextService {
  private kv: KVNamespace;

  constructor(kv: KVNamespace) {
    this.kv = kv;
  }

  /**
   * Obtiene contexto fresco para los temas solicitados
   */
  async getContext(request: ContextRequest): Promise<ContextResponse> {
    const { topics, forceRefresh = false } = request;
    const contexts: ContextData[] = [];
    let allCached = true;

    for (const topic of topics) {
      const source = CONTEXT_SOURCES[topic];
      if (!source) continue;

      try {
        const context = await this.getOrFetchContext(source, forceRefresh);
        contexts.push(context);

        if (!context.cached) {
          allCached = false;
        }
      } catch (error) {
        console.error(`Error fetching context for ${topic}:`, error);
        // Continuar con otros temas aunque uno falle
      }
    }

    return {
      contexts,
      cached: allCached,
      timestamp: Date.now()
    };
  }

  /**
   * Obtiene contexto desde caché o lo fetcha si es necesario
   */
  private async getOrFetchContext(
    source: ContextSource,
    forceRefresh: boolean
  ): Promise<ContextData> {
    const cacheKey = source.cacheKey;

    if (!forceRefresh) {
      const cached = await this.kv.get(cacheKey, 'json') as ContextData | null;
      if (cached && this.isCacheValid(cached)) {
        return { ...cached, cached: true };
      }
    }

    // Fetch fresh data
    const freshData = await this.fetchContextData(source);
    const contextData: ContextData = {
      source: source.name,
      data: freshData,
      timestamp: Date.now(),
      ttl: source.ttl,
      cached: false
    };

    // Store in cache
    await this.kv.put(cacheKey, JSON.stringify(contextData), {
      expirationTtl: source.ttl
    });

    return contextData;
  }

  /**
   * Verifica si el caché es válido
   */
  private isCacheValid(context: ContextData): boolean {
    const now = Date.now();
    const age = now - context.timestamp;
    return age < (context.ttl * 1000);
  }

  /**
   * Fetcha datos frescos desde la fuente
   */
  private async fetchContextData(source: ContextSource): Promise<any> {
    switch (source.name) {
      case 'Next.js Documentation':
        return await this.fetchNextJSDocs();
      case 'Supabase Documentation':
        return await this.fetchSupabaseDocs();
      case 'Cloudflare Workers':
        return await this.fetchCloudflareDocs();
      case 'Context7 Latest':
        return await this.fetchContext7Data();
      default:
        return { url: source.url, fetched: Date.now() };
    }
  }

  /**
   * Fetch específico para Next.js docs
   */
  private async fetchNextJSDocs(): Promise<any> {
    const response = await fetch('https://nextjs.org/docs/api-reference');
    const html = await response.text();

    // Extraer información relevante (simplificado)
    return {
      version: '15.x',
      lastUpdated: new Date().toISOString(),
      features: ['App Router', 'Server Components', 'Middleware'],
      url: 'https://nextjs.org/docs'
    };
  }

  /**
   * Fetch específico para Supabase docs
   */
  private async fetchSupabaseDocs(): Promise<any> {
    const response = await fetch('https://supabase.com/docs/guides/api');
    const html = await response.text();

    return {
      version: '2.x',
      lastUpdated: new Date().toISOString(),
      features: ['Auth', 'Database', 'Storage', 'Edge Functions'],
      url: 'https://supabase.com/docs'
    };
  }

  /**
   * Fetch específico para Cloudflare Workers
   */
  private async fetchCloudflareDocs(): Promise<any> {
    const response = await fetch('https://developers.cloudflare.com/workers/api');
    const html = await response.text();

    return {
      version: '4.x',
      lastUpdated: new Date().toISOString(),
      features: ['Workers', 'KV', 'Durable Objects', 'R2'],
      url: 'https://developers.cloudflare.com/workers'
    };
  }

  /**
   * Fetch específico para Context7
   */
  private async fetchContext7Data(): Promise<any> {
    // Aquí integrarías con la API de Context7
    // Por ahora retornamos datos mock
    return {
      lastUpdated: new Date().toISOString(),
      topics: ['nextjs', 'supabase', 'cloudflare'],
      url: 'https://context7.ai'
    };
  }

  /**
   * Actualiza todos los contextos (para cron jobs)
   */
  async refreshAllContexts(): Promise<void> {
    const sources = Object.values(CONTEXT_SOURCES);

    for (const source of sources) {
      try {
        await this.getOrFetchContext(source, true);
        console.log(`✅ Refreshed context: ${source.name}`);
      } catch (error) {
        console.error(`❌ Failed to refresh ${source.name}:`, error);
      }
    }
  }

  /**
   * Obtiene estadísticas del caché
   */
  async getCacheStats(): Promise<any> {
    const stats = {
      totalSources: Object.keys(CONTEXT_SOURCES).length,
      lastRefresh: Date.now(),
      sources: {}
    };

    for (const [key, source] of Object.entries(CONTEXT_SOURCES)) {
      const cached = await this.kv.get(source.cacheKey, 'json') as ContextData | null;
      stats.sources[key] = {
        cached: !!cached,
        age: cached ? Date.now() - cached.timestamp : null,
        valid: cached ? this.isCacheValid(cached) : false
      };
    }

    return stats;
  }
}
