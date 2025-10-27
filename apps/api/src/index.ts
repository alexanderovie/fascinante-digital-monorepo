/**
 * Fascinante Digital API
 * REST API backend deployed on Cloudflare Workers
 */

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

        case pathname === '/api/contact':
          return handleContact(request);

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

async function handleContact(request: Request) {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  try {
    const body = await request.json();
    const { name, email, message, service } = body;

    // Basic validation
    if (!name || !email || !message) {
      return jsonResponse({ error: 'Missing required fields: name, email, message' }, 400);
    }

    // TODO: Add email sending logic (Resend, SendGrid, etc.)
    console.log('Contact form submission:', { name, email, service });

    return jsonResponse({
      success: true,
      message: 'Mensaje enviado exitosamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
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
