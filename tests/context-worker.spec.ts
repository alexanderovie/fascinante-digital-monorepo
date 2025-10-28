/**
 * Tests de smoke para el Worker de contexto
 */

import { expect, test } from 'vitest';

const BASE = process.env.CONTEXT_API_BASE || 'https://fascinante-api-gateway-prod.black-mountain-5a63.workers.dev';

test('refresh → context → stats', async () => {
  // 1. Refrescar contexto
  const r1 = await fetch(`${BASE}/api/context/refresh`, { method: 'POST' });
  expect(r1.ok).toBe(true);
  const j1 = await r1.json();
  expect(j1.ok).toBe(true);
  expect(j1.size).toBeGreaterThan(2000);

  // 2. Leer contexto cacheado
  const r2 = await fetch(`${BASE}/api/context`);
  expect(r2.ok).toBe(true);
  const j2 = await r2.json();
  expect(j2.md.length).toBeGreaterThan(2000);
  expect(j2.meta).toBeDefined();

  // 3. Verificar stats
  const r3 = await fetch(`${BASE}/api/context/stats`);
  expect(r3.ok).toBe(true);
  const j3 = await r3.json();
  expect(j3.hasData).toBe(true);
  expect(j3.stale).toBeTypeOf('boolean');
  expect(j3.sources).toBeDefined();
});

test('context prompt generation', async () => {
  const response = await fetch(`${BASE}/api/context/prompt`);
  expect(response.ok).toBe(true);
  const text = await response.text();
  expect(text.length).toBeGreaterThan(100);
  expect(text).toContain('CONTEXTO');
});

