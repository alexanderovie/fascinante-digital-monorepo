/**
 * Tests de inyección automática de contexto
 */

import { ensureFreshContext, getSystemPrompt } from '@/src/lib/ai/context';
import { beforeEach, expect, test, vi } from 'vitest';

beforeEach(() => {
  vi.clearAllMocks();
});

test('getSystemPrompt returns content', async () => {
  global.fetch = vi.fn(async (url: string) => {
    if (url.includes('/api/context/prompt')) {
      return new Response('SYSTEM OK - CONTEXTO FRESCO', { status: 200 });
    }
    return new Response('', { status: 404 });
  }) as any;

  const prompt = await getSystemPrompt();
  expect(prompt).toContain('CONTEXTO');
});

test('getSystemPrompt returns fallback on error', async () => {
  global.fetch = vi.fn(async () => {
    return new Response('Error', { status: 500 });
  }) as any;

  const prompt = await getSystemPrompt();
  expect(prompt).toContain('Eres el asistente técnico de Fascinante Digital');
});

test('ensureFreshContext refreshes when stale', async () => {
  global.fetch = vi.fn(async (url: string) => {
    if (url.includes('/api/context/stats')) {
      return new Response(JSON.stringify({ stale: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    if (url.includes('/api/context/refresh')) {
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }
    return new Response('', { status: 404 });
  }) as any;

  await ensureFreshContext();

  expect(global.fetch).toHaveBeenCalledWith(
    expect.stringContaining('/api/context/stats'),
    expect.any(Object)
  );
});

