/**
 * Helper para obtener contexto fresco desde el Worker de Cloudflare
 * Inyección automática de contexto en respuestas del modelo
 */

export async function getSystemPrompt(): Promise<string> {
  const base = process.env.CONTEXT_API_BASE || 'https://fascinante-api-gateway-prod.black-mountain-5a63.workers.dev';

  try {
    const response = await fetch(`${base}/api/context/prompt`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      console.warn('⚠️ No se pudo obtener contexto fresco, usando fallback');
      return getFallbackPrompt();
    }

    return await response.text();
  } catch (error) {
    console.error('Error obteniendo contexto fresco:', error);
    return getFallbackPrompt();
  }
}

function getFallbackPrompt(): string {
  return `Eres el asistente técnico de Fascinante Digital.
No hay contexto actualizado disponible ahora mismo. Responde con cautela y sugiere refrescar el contexto.`;
}

export async function ensureFreshContext(): Promise<void> {
  const base = process.env.CONTEXT_API_BASE || 'https://fascinante-api-gateway-prod.black-mountain-5a63.workers.dev';

  try {
    const stats = await fetch(`${base}/api/context/stats`, {
      cache: 'no-store'
    }).then(r => r.json());

    if (stats?.stale) {
      console.log('🔄 Contexto desactualizado, refrescando en background...');
      // Refrescar en background, no bloquea la respuesta al usuario
      fetch(`${base}/api/context/refresh`, { method: 'POST' }).catch(() => { });
    }
  } catch (error) {
    console.error('Error verificando contexto:', error);
  }
}

