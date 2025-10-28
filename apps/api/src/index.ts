/**
 * Fascinante Digital API
 * REST API backend deployed on Cloudflare Workers
 * Con sistema de contexto automatizado élite
 */

import { render } from '@react-email/render';
import { Resend } from 'resend';
import { BusinessAuditService } from './services/business-audit';
import { ContextService } from './services/context-service';
import { emailAnalytics } from './services/EmailAnalytics';
import {
  buildSystemPrompt,
  getContext as getRealContext,
  isStale,
  json,
  refreshAndCache,
  textHeaders
} from './services/real-context-service';
import { ConfirmationEmail } from './templates/ConfirmationEmail';
import { ContactEmail } from './templates/ContactEmail';

// Initialize Resend (will be done in handler with env)

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Response helper
const jsonResponse = (data: any, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
};

// Main worker handler
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const { pathname, searchParams } = url;

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
      // Route handling
      switch (true) {
        case pathname === '/health':
          return handleHealth(request);

        case pathname === '/api/health':
          return handleHealth(request);

        // 🚀 RUTAS DE CONTEXTO AUTOMATIZADO (IMPLEMENTACIÓN REAL) - Sin Resend
        case pathname.startsWith('/api/context'):
          return handleRealContextRoutes(request, env);

        case pathname === '/api/contact':
          // Initialize Resend solo para rutas que lo necesitan
          if (env.RESEND_API_KEY) {
            const resend = new Resend(env.RESEND_API_KEY);
            return handleContact(request, resend);
          } else {
            return jsonResponse({ error: 'Email service not configured' }, 503);
          }

        case pathname === '/api/analytics/emails':
          return handleEmailAnalytics(request);

        case pathname === '/api/company':
          return handleCompanyInfo(request);

        case pathname === '/api/services':
          return handleServices(request);

        case pathname === '/api/audit/free':
          return handleFreeAudit(request, env);

        case pathname === '/':
          return handleRoot(request);

        default:
          return jsonResponse({ error: 'Endpoint not found' }, 404);
      }
    } catch (error) {
      console.error('API Error:', error);
      return jsonResponse({ error: 'Internal server error' }, 500);
    }
  },

  // 🚀 CRON TRIGGER para actualización automática de contexto (REAL)
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    console.log('🔄 Ejecutando actualización automática de contexto (REAL)...');

    try {
      await refreshAndCache(env);
      console.log('✅ Contexto actualizado automáticamente con datos REALES');
    } catch (error) {
      console.error('❌ Error en actualización automática de contexto:', error);
    }
  }
};

// Route handlers
async function handleRoot(request: Request) {
  return jsonResponse({
    name: 'Fascinante Digital API',
    version: '1.0.0',
    status: 'online',
    timestamp: new Date().toISOString(),
    endpoints: [
      '/health',
      '/api/health',
      '/api/contact',
      '/api/company',
      '/api/services'
    ]
  });
}

async function handleHealth(request: Request) {
  return jsonResponse({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: Date.now(),
    environment: 'production'
  });
}

async function handleContact(request: Request, resend: Resend) {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  try {
    const body = await request.json();
    const { name, email, message, service, phone } = body as {
      name: string;
      email: string;
      phone?: string;
      service?: string;
      message: string;
    };

    // Basic validation
    if (!name || !email || !message) {
      return jsonResponse({ error: 'Missing required fields: name, email, message' }, 400);
    }

    // Send emails using React Email templates (ELITE)
    try {
      // Track email analytics
      await emailAnalytics.trackEmailSent({
        type: 'contact',
        recipient: 'info@fascinantedigital.com',
        status: 'sent',
        metadata: {
          service: service || 'general',
          source: 'contact_form'
        }
      });

      // Render React Email templates
      const contactEmailHtml = await render(ContactEmail({
        name,
        email,
        phone,
        service,
        message
      }));

      const confirmationEmailHtml = await render(ConfirmationEmail({ name }));

      // Send contact email to company
      const contactResult = await resend.emails.send({
        from: 'Fascinante Digital <noreply@fascinantedigital.com>',
        to: ['info@fascinantedigital.com'],
        subject: `Nuevo mensaje de contacto - ${name}`,
        html: contactEmailHtml,
      });

      // Send confirmation email to client
      const confirmationResult = await resend.emails.send({
        from: 'Fascinante Digital <noreply@fascinantedigital.com>',
        to: [email],
        subject: 'Gracias por contactarnos - Fascinante Digital',
        html: confirmationEmailHtml,
      });

      // Track successful delivery
      await emailAnalytics.trackEmailSent({
        type: 'contact',
        recipient: 'info@fascinantedigital.com',
        status: 'delivered',
        metadata: {
          service: service || 'general',
          source: 'contact_form',
          campaign: 'contact_notification'
        }
      });

      await emailAnalytics.trackEmailSent({
        type: 'confirmation',
        recipient: email,
        status: 'delivered',
        metadata: {
          service: service || 'general',
          source: 'contact_form',
          campaign: 'confirmation_email'
        }
      });

      console.log('📧 Elite emails sent successfully:', {
        contactId: contactResult.data?.id,
        confirmationId: confirmationResult.data?.id,
        name,
        email,
        service
      });

      return jsonResponse({
        success: true,
        message: 'Mensaje enviado exitosamente. Te contactaremos pronto.',
        timestamp: new Date().toISOString(),
        emailIds: {
          contact: contactResult.data?.id,
          confirmation: confirmationResult.data?.id
        }
      });

    } catch (emailError) {
      console.error('❌ Elite email sending failed:', emailError);

      // Track failed email
      await emailAnalytics.trackEmailSent({
        type: 'contact',
        recipient: 'info@fascinantedigital.com',
        status: 'failed',
        metadata: {
          service: service || 'general',
          source: 'contact_form'
        }
      });

      return jsonResponse({
        error: 'Error enviando el email. Intenta de nuevo.'
      }, 500);
    }

  } catch (error) {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }
}

// Email Analytics Handler (ELITE)
async function handleEmailAnalytics(request: Request): Promise<Response> {
  if (request.method !== 'GET') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  try {
    const url = new URL(request.url);
    const timeframe = url.searchParams.get('timeframe') as 'day' | 'week' | 'month' || 'day';

    const metrics = await emailAnalytics.getMetrics(timeframe);
    const topServices = await emailAnalytics.getTopServices();

    return jsonResponse({
      success: true,
      timeframe,
      metrics,
      topServices,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Analytics error:', error);
    return jsonResponse({ error: 'Failed to fetch analytics' }, 500);
  }
}

async function handleCompanyInfo(request: Request) {
  return jsonResponse({
    company: 'Fascinante Digital',
    description: 'Agencia de marketing digital especializada en estrategias personalizadas',
    services: [
      'Marketing Digital',
      'Desarrollo Web',
      'SEO & SEM',
      'Social Media',
      'Automatización'
    ],
    contact: {
      website: 'https://fascinantedigital.com',
      email: 'info@fascinantedigital.com',
      phone: '(800) 886-4981'
    },
    social: {
      twitter: '@fascinantedig',
      linkedin: 'fascinante-digital',
      instagram: '@fascinantedigital'
    }
  });
}

async function handleFreeAudit(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  try {
    const body = await request.json();
    const { businessName } = body as { businessName: string };

    if (!businessName || businessName.trim().length < 2) {
      return jsonResponse({
        error: 'Business name is required (min 2 characters)'
      }, 400);
    }

    // Initialize audit service
    const auditService = new BusinessAuditService({
      placesApiKey: env.GOOGLE_PLACES_API_KEY || '',
      vertexAiEndpoint: env.VERTEX_AI_ENDPOINT,
      vertexAiApiKey: env.VERTEX_AI_API_KEY,
    });

    // Generate audit
    const audit = await auditService.generateAudit(businessName.trim());

    // Track audit generation (you can add analytics here)
    console.log('✅ Free audit generated:', {
      businessName: audit.business.name,
      score: audit.score,
      timestamp: audit.generatedAt,
    });

    return jsonResponse({
      success: true,
      audit,
      message: 'Auditoría generada exitosamente',
    });

  } catch (error: any) {
    console.error('❌ Audit generation error:', error);

    return jsonResponse({
      error: error.message || 'Error generating audit',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    }, 500);
  }
}

async function handleServices(request: Request) {
  return jsonResponse({
    services: [
      {
        id: 'marketing-digital',
        name: 'Marketing Digital',
        description: 'Estrategias integrales de marketing digital',
        price: 'Desde $500/mes',
        features: ['SEO', 'SEM', 'Social Media', 'Email Marketing']
      },
      {
        id: 'desarrollo-web',
        name: 'Desarrollo Web',
        description: 'Sitios web modernos y aplicaciones web',
        price: 'Desde $2000',
        features: ['Next.js', 'React', 'TypeScript', 'Responsive']
      },
      {
        id: 'automatizacion',
        name: 'Automatización',
        description: 'Workflows y procesos automatizados',
        price: 'Desde $300/mes',
        features: ['Zapier', 'Workflows', 'Integrations', 'APIs']
      }
    ]
  });
}

// 🚀 Handler para rutas de contexto automatizado (OLD - Mock)
async function handleContextRoutes(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const pathname = url.pathname;

  const contextService = new ContextService(env.CONTEXT_KV);

  try {
    // GET /api/context - Obtener contexto
    if (pathname === '/api/context' && request.method === 'GET') {
      const topics = url.searchParams.get('topics')?.split(',') || ['nextjs', 'supabase'];
      const forceRefresh = url.searchParams.get('forceRefresh') === 'true';

      const context = await contextService.getContext({
        topics,
        forceRefresh
      });

      return jsonResponse(context);
    }

    // POST /api/context/refresh - Refrescar todos los contextos
    if (pathname === '/api/context/refresh' && request.method === 'POST') {
      await contextService.refreshAllContexts();

      return jsonResponse({
        success: true,
        message: 'Todos los contextos han sido actualizados',
        timestamp: Date.now()
      });
    }

    // GET /api/context/stats - Estadísticas del caché
    if (pathname === '/api/context/stats' && request.method === 'GET') {
      const stats = await contextService.getCacheStats();

      return jsonResponse(stats);
    }

    // GET /api/context/prompt - Generar prompt con contexto
    if (pathname === '/api/context/prompt' && request.method === 'GET') {
      const topics = url.searchParams.get('topics')?.split(',') || ['nextjs', 'supabase'];
      const context = await contextService.getContext({ topics });

      const prompt = generateContextPrompt(context);

      return jsonResponse({ prompt });
    }

    return jsonResponse({ error: 'Context endpoint not found' }, 404);

  } catch (error) {
    console.error('Context API Error:', error);
    return jsonResponse({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    }, 500);
  }
}

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

// 🚀 Handler para rutas de contexto automatizado (NEW - REAL)
async function handleRealContextRoutes(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const { pathname } = url;

  try {
    // GET /api/context - Obtener contexto cacheado
    if (pathname === '/api/context' && request.method === 'GET') {
      const cached = await getRealContext(env);
      return json({
        md: cached?.md ?? "",
        meta: cached?.meta ?? null
      }, 200, request);
    }

    // POST /api/context/refresh - Refrescar contexto con datos reales
    if (pathname === '/api/context/refresh' && request.method === 'POST') {
      const res = await refreshAndCache(env);
      return json({
        ok: true,
        size: res.md.length,
        meta: res.meta
      }, 200, request);
    }

    // GET /api/context/stats - Estadísticas del cache
    if (pathname === '/api/context/stats' && request.method === 'GET') {
      const cached = await getRealContext(env);
      const size = cached?.md ? new TextEncoder().encode(cached.md).length : 0;
      return json({
        hasData: Boolean(cached?.md),
        sizeBytes: size,
        updatedAt: cached?.meta?.updatedAt ?? null,
        sources: cached?.meta?.sources ?? [],
        ttlMs: 6 * 60 * 60 * 1000,
        stale: isStale(cached?.meta?.updatedAt),
      }, 200, request);
    }

    // GET /api/context/prompt - Generar system prompt con contexto
    if (pathname === '/api/context/prompt' && request.method === 'GET') {
      const cached = await getRealContext(env);
      const md = cached?.md ?? "NO_CONTEXT_AVAILABLE";
      const prompt = buildSystemPrompt(md);
      return new Response(prompt, { status: 200, headers: textHeaders(request) });
    }

    // Default: devolver ayuda
    return json({
      ok: true,
      endpoints: [
        "GET  /api/context",
        "POST /api/context/refresh",
        "GET  /api/context/stats",
        "GET  /api/context/prompt",
      ],
    }, 200, request);

  } catch (error) {
    console.error('Real Context API Error:', error);
    return json({
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
}

// Environment interface
interface Env {
  RESEND_API_KEY?: string; // Opcional - solo necesario para endpoints de email
  CONTEXT_KV: KVNamespace;
  // Variables para contexto automatizado
  NEXTJS_RELEASES?: string;
  SUPABASE_RELEASES?: string;
  CLOUDFLARE_CHANGELOG_RSS?: string;
  GITHUB_TOKEN?: string;
  OPENAI_API_KEY?: string;
  OPENAI_MODEL?: string;
  // Business Audit Service
  GOOGLE_PLACES_API_KEY?: string;
  VERTEX_AI_ENDPOINT?: string;
  VERTEX_AI_API_KEY?: string;
  GCP_PROJECT_ID?: string;
  GCP_LOCATION?: string;
}
