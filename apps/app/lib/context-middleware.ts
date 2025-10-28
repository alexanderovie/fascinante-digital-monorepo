/**
 * Middleware de Contexto para Next.js
 * Automáticamente inyecta contexto fresco en cada request
 */

import { NextRequest, NextResponse } from 'next/server';

interface ContextData {
  source: string;
  data: any;
  timestamp: number;
  cached: boolean;
}

interface ContextResponse {
  contexts: ContextData[];
  cached: boolean;
  timestamp: number;
}

/**
 * Cliente para el servicio de contexto
 */
class ContextClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getContext(topics: string[] = ['nextjs', 'supabase'], forceRefresh = false): Promise<ContextResponse> {
    const params = new URLSearchParams({
      topics: topics.join(','),
      forceRefresh: forceRefresh.toString()
    });

    const response = await fetch(`${this.baseUrl}/api/context?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Context API error: ${response.status}`);
    }

    return response.json();
  }

  async getContextPrompt(topics: string[] = ['nextjs', 'supabase']): Promise<string> {
    const params = new URLSearchParams({
      topics: topics.join(',')
    });

    const response = await fetch(`${this.baseUrl}/api/context/prompt?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Context Prompt API error: ${response.status}`);
    }

    const data = await response.json();
    return data.prompt;
  }
}

/**
 * Middleware que inyecta contexto automáticamente
 */
export async function contextMiddleware(request: NextRequest): Promise<NextResponse> {
  const pathname = request.nextUrl.pathname;

  // Solo aplicar a rutas específicas (opcional)
  const contextRoutes = ['/api/chat', '/api/assistant', '/dashboard'];
  const shouldApplyContext = contextRoutes.some(route => pathname.startsWith(route));

  if (!shouldApplyContext) {
    return NextResponse.next();
  }

  try {
    const contextClient = new ContextClient(process.env.CONTEXT_API_URL || 'https://api.fascinantedigital.com');

    // Determinar temas basados en la ruta
    const topics = getTopicsFromPath(pathname);

    // Obtener contexto fresco
    const context = await contextClient.getContext(topics);

    // Crear headers con contexto
    const contextHeaders = new Headers();
    contextHeaders.set('X-Context-Fresh', 'true');
    contextHeaders.set('X-Context-Timestamp', context.timestamp.toString());
    contextHeaders.set('X-Context-Cached', context.cached.toString());
    contextHeaders.set('X-Context-Topics', topics.join(','));

    // Inyectar contexto en headers para que esté disponible en la aplicación
    const response = NextResponse.next();

    // Copiar headers de contexto
    contextHeaders.forEach((value, key) => {
      response.headers.set(key, value);
    });

    // También podemos inyectar el contexto como JSON en un header especial
    response.headers.set('X-Context-Data', JSON.stringify(context));

    return response;

  } catch (error) {
    console.error('Context middleware error:', error);
    // Continuar sin contexto si hay error
    return NextResponse.next();
  }
}

/**
 * Determina los temas relevantes basados en la ruta
 */
function getTopicsFromPath(pathname: string): string[] {
  const topics: string[] = [];

  if (pathname.includes('/api/chat') || pathname.includes('/dashboard')) {
    topics.push('nextjs', 'supabase');
  }

  if (pathname.includes('/api/workers') || pathname.includes('/cloudflare')) {
    topics.push('cloudflare');
  }

  if (pathname.includes('/context7') || pathname.includes('/ai')) {
    topics.push('context7');
  }

  // Default topics si no se detecta nada específico
  if (topics.length === 0) {
    topics.push('nextjs', 'supabase');
  }

  return topics;
}

/**
 * Hook para usar contexto en componentes
 */
export function useContext() {
  // Esta función se ejecutaría en el cliente
  // Para obtener contexto desde los headers o localStorage

  if (typeof window === 'undefined') {
    return null; // Server-side
  }

  // Obtener contexto desde localStorage o hacer fetch
  const contextData = localStorage.getItem('fresh-context');

  if (contextData) {
    try {
      return JSON.parse(contextData);
    } catch {
      return null;
    }
  }

  return null;
}

/**
 * Función para refrescar contexto manualmente
 */
export async function refreshContext(topics: string[] = ['nextjs', 'supabase']): Promise<ContextResponse> {
  const contextClient = new ContextClient(process.env.CONTEXT_API_URL || 'https://api.fascinantedigital.com');
  return contextClient.getContext(topics, true);
}

/**
 * Función para obtener prompt con contexto fresco
 */
export async function getContextPrompt(topics: string[] = ['nextjs', 'supabase']): Promise<string> {
  const contextClient = new ContextClient(process.env.CONTEXT_API_URL || 'https://api.fascinantedigital.com');
  return contextClient.getContextPrompt(topics);
}

