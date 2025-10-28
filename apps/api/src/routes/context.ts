/**
 * API Endpoint para Contexto Automatizado
 * GET /api/context?topics=nextjs,supabase&forceRefresh=false
 */

import { ContextService } from '../services/context-service.js';

export interface Env {
  CONTEXT_KV: KVNamespace;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
      const contextService = new ContextService(env.CONTEXT_KV);

      // Route: GET /api/context
      if (path === '/api/context' && request.method === 'GET') {
        const topics = url.searchParams.get('topics')?.split(',') || ['nextjs', 'supabase'];
        const forceRefresh = url.searchParams.get('forceRefresh') === 'true';

        const context = await contextService.getContext({
          topics,
          forceRefresh
        });

        return new Response(JSON.stringify(context), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }

      // Route: POST /api/context/refresh
      if (path === '/api/context/refresh' && request.method === 'POST') {
        await contextService.refreshAllContexts();

        return new Response(JSON.stringify({
          success: true,
          message: 'All contexts refreshed',
          timestamp: Date.now()
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }

      // Route: GET /api/context/stats
      if (path === '/api/context/stats' && request.method === 'GET') {
        const stats = await contextService.getCacheStats();

        return new Response(JSON.stringify(stats), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }

      // Route: GET /api/context/prompt
      if (path === '/api/context/prompt' && request.method === 'GET') {
        const topics = url.searchParams.get('topics')?.split(',') || ['nextjs', 'supabase'];
        const context = await contextService.getContext({ topics });

        // Generar prompt con contexto fresco
        const prompt = generateContextPrompt(context);

        return new Response(JSON.stringify({ prompt }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }

      return new Response('Not Found', { status: 404 });

    } catch (error) {
      console.error('Context API Error:', error);
      return new Response(JSON.stringify({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  }
};

/**
 * Genera un prompt con contexto fresco para inyectar en el modelo
 */
function generateContextPrompt(context: any): string {
  const contexts = context.contexts || [];

  let prompt = `# CONTEXTO FRESCO AUTOMATIZADO\n\n`;
  prompt += `**Última actualización:** ${new Date().toLocaleString()}\n\n`;

  contexts.forEach((ctx: any) => {
    prompt += `## ${ctx.source}\n`;
    prompt += `- **Versión:** ${ctx.data.version || 'N/A'}\n`;
    prompt += `- **Última actualización:** ${ctx.data.lastUpdated || 'N/A'}\n`;
    prompt += `- **Características:** ${ctx.data.features?.join(', ') || 'N/A'}\n`;
    prompt += `- **URL:** ${ctx.data.url || 'N/A'}\n\n`;
  });

  prompt += `**INSTRUCCIONES:** Usa esta información fresca para responder. Prioriza estos datos sobre cualquier conocimiento base que puedas tener.\n\n`;

  return prompt;
}

