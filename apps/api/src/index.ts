/**
 * Fascinante Digital API
 * REST API backend deployed on Cloudflare Workers
 */

import { render } from '@react-email/render';
import { Resend } from 'resend';
import { emailAnalytics } from './services/EmailAnalytics';
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
    // Initialize Resend with environment variable
    const resend = new Resend(env.RESEND_API_KEY);
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

        case pathname === '/api/contact':
          return handleContact(request, resend);

        case pathname === '/api/analytics/emails':
          return handleEmailAnalytics(request);

        case pathname === '/api/company':
          return handleCompanyInfo(request);

        case pathname === '/api/services':
          return handleServices(request);

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

// Environment interface
interface Env {
  // Add your environment variables here
}
