/**
 * Wrapper del modelo con inyección automática de contexto
 * Siempre inyecta contexto fresco antes de responder
 */

import { ensureFreshContext, getSystemPrompt } from './context';

// Para usar con OpenAI (descomentar si tienes la key configurada)
// import OpenAI from 'openai';
// const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
// const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

export async function answer(
  messages: { role: 'user' | 'assistant' | 'system'; content: string }[]
): Promise<string> {
  // 1) Verificar y refrescar contexto si está stale
  await ensureFreshContext();

  // 2) Obtener prompt con contexto fresco
  const system = await getSystemPrompt();

  // 3) Construir mensajes con contexto inyectado
  const finalMessages = [
    { role: 'system' as const, content: system },
    ...messages
  ];

  // 4) Llamar al modelo (implementar con tu proveedor)
  // Por ahora retornamos un ejemplo
  console.log('📝 Sistema inyectando contexto fresco automáticamente');
  console.log('💬 Mensajes finales:', finalMessages.length);

  // TODO: Implementar llamada real al modelo
  // const response = await client.chat.completions.create({
  //   model: MODEL,
  //   temperature: 0.2,
  //   messages: finalMessages
  // });
  // return response.choices[0]?.message?.content ?? '';

  return 'Respuesta con contexto fresco inyectado automáticamente.';
}

