/**
 * Real Context Service - Implementación ÉLITE con APIs reales
 * Basado en la implementación de ChatGPT para octubre 2025
 */

export interface Env {
  CONTEXT_KV: KVNamespace;
  NEXTJS_RELEASES: string;
  SUPABASE_RELEASES: string;
  CLOUDFLARE_CHANGELOG_RSS: string;
  GITHUB_TOKEN?: string;
  OPENAI_API_KEY?: string;
  OPENAI_MODEL?: string;
}

const KV_KEY = "ctx:fresh:latest";
const TTL_MS = 1000 * 60 * 60 * 6; // 6h

// ----------------- CORS & Response Helpers -----------------

function corsHeaders(request?: Request) {
  // Whitelist de orígenes permitidos
  const allowedOrigins = [
    "https://fascinantedigital.com",
    "https://www.fascinantedigital.com",
    "https://app.fascinantedigital.com"
  ];

  // Detectar origin del request
  const origin = request?.headers.get("origin") || "";
  const allowedOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

  return new Headers({
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Max-Age": "86400" // 24 horas
  });
}

function json(data: any, status = 200, request?: Request): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: new Headers({
      "content-type": "application/json; charset=utf-8",
      ...Object.fromEntries(corsHeaders(request)),
    }),
  });
}

function textHeaders(request?: Request) {
  return new Headers({
    "content-type": "text/plain; charset=utf-8",
    ...Object.fromEntries(corsHeaders(request)),
  });
}

function isStale(updatedAt?: string | null): boolean {
  if (!updatedAt) return true;
  const t = new Date(updatedAt).getTime();
  return Date.now() - t > TTL_MS;
}

// ----------------- KV Operations -----------------

async function getContext(env: Env): Promise<{ md: string; meta: any } | null> {
  const raw = await env.CONTEXT_KV.get(KV_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function putContext(env: Env, md: string, sources: string[]) {
  const payload = JSON.stringify({
    md,
    meta: { sources, updatedAt: new Date().toISOString() },
  });
  await env.CONTEXT_KV.put(KV_KEY, payload, { expirationTtl: TTL_MS / 1000 });
}

function buildSystemPrompt(md: string) {
  return `
Eres el asistente técnico de Fascinante Digital.
Antes de responder sobre Next.js, Supabase, Cloudflare o Vercel:
1) Usa el siguiente CONTEXTO ACTUALIZADO (TTL 6h).
2) Prioriza release notes oficiales, breaking changes y migración.
3) Cita fechas y enlaces clave.
4) Si detectas huecos, sugiere refrescar contexto.

-----
${md}
-----
`.trim();
}

// ----------------- Refresh & Cache -----------------

async function refreshAndCache(env: Env) {
  const items: any[] = [];
  const sources: string[] = [];

  // Next.js: solo GitHub releases (no hay RSS oficial del blog)
  const nextReleases = await fetchGithubReleases(env.NEXTJS_RELEASES, env);
  if (nextReleases.length) {
    items.push(...nextReleases);
    sources.push("nextjs:releases");
  }

  // Supabase: GitHub releases
  const supaReleases = await fetchGithubReleases(env.SUPABASE_RELEASES, env);
  if (supaReleases.length) {
    items.push(...supaReleases);
    sources.push("supabase:releases");
  }

  // Cloudflare: RSS oficial del Changelog
  const cfRss = await fetchRSS(env.CLOUDFLARE_CHANGELOG_RSS, 10);
  if (cfRss.length) {
    items.push(...cfRss.map(x => ({ product: "cloudflare", type: "rss", ...x })));
    sources.push("cloudflare:changelog:rss");
  }

  // Build MD (con resumen si hay OPENAI_API_KEY)
  const md = await buildMarkdown(items, env);
  await putContext(env, md, sources);

  return { md, meta: { sources, updatedAt: new Date().toISOString() } };
}

// ----------------- Fetchers (REALES) -----------------

async function fetchGithubReleases(url: string, env: Env, limit = 5) {
  const headers: Record<string, string> = { "User-Agent": "fascinante-context-worker" };
  if (env.GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${env.GITHUB_TOKEN}`;
  }

  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`GitHub fetch failed ${res.status}`);
  const data: any[] = await res.json();

  return (data || []).slice(0, limit).map(r => ({
    product: detectProductFromRepoUrl(url), // "nextjs" | "supabase"
    type: "github_release",
    name: r.name || r.tag_name,
    tag: r.tag_name,
    published_at: r.published_at || r.created_at,
    url: r.html_url,
    body: typeof r.body === "string" ? r.body.slice(0, 4000) : "",
  }));
}

function detectProductFromRepoUrl(url: string): string {
  if (url.includes("vercel/next.js")) return "nextjs";
  if (url.includes("supabase/supabase")) return "supabase";
  return "unknown";
}

async function fetchRSS(rssUrl: string, limit = 5) {
  const res = await fetch(rssUrl, { headers: { "User-Agent": "fascinante-context-worker" } });
  if (!res.ok) throw new Error(`RSS fetch failed ${res.status}`);
  const xml = await res.text();

  // Parsing RSS simple (sin DOMParser, compatible con Workers)
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, limit).map(m => m[1]);
  return items.map(raw => ({
    title: match1(raw, /<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/),
    link: match1(raw, /<link>(.*?)<\/link>/),
    pubDate: match1(raw, /<pubDate>(.*?)<\/pubDate>/),
    description: (match1(raw, /<description><!\[CDATA\[(.*?)\]\]><\/description>|<description>([\s\S]*?)<\/description>/) || "")
      .replace(/<[^>]+>/g, "")
      .trim()
      .slice(0, 600),
  }));
}

function match1(s: string, re: RegExp) {
  const m = s.match(re);
  if (!m) return "";
  return m[1] || m[2] || "";
}

// ----------------- Markdown / Resumen -----------------

async function buildMarkdown(items: any[], env: Env): Promise<string> {
  // Normaliza por producto
  const groups: Record<string, any[]> = {};
  for (const it of items) {
    const key = it.product || "general";
    groups[key] = groups[key] || [];
    groups[key].push(it);
  }

  const rawMd = [
    "# Contexto Técnico (últimas 6–8 entradas por fuente)",
    "",
    `Actualizado: **${new Date().toISOString()}**`,
    "",
    ...Object.entries(groups).map(([product, arr]) => sectionForProduct(product, arr as any[])).flat(),
    "",
    "## Enlaces verificados",
    ...items
      .map(i => i.url || i.link)
      .filter(Boolean)
      .slice(0, 30)
      .map(u => `- ${u}`),
  ].join("\n");

  if (!env.OPENAI_API_KEY) {
    // Sin OpenAI → devolvemos el rawMd (ya es útil)
    return rawMd;
  }

  // Con OpenAI → pedimos resumen estructurado
  const prompt = `
Resume las novedades por producto (Next.js, Supabase, Cloudflare) destacando:
- Breaking changes (con fecha)
- Guías de migración y compatibilidad (Node/Edge runtimes)
- Impacto práctico para un stack: Next.js + Supabase + Cloudflare Workers + Stripe + Inngest
- Lista de enlaces oficiales
Devuelve Markdown claro (~1000-1200 tokens).

Datos:
${JSON.stringify(items).slice(0, 20000)}
`.trim();

  try {
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.2,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!resp.ok) {
      const errTxt = await resp.text();
      console.warn("OpenAI error:", errTxt);
      return rawMd;
    }
    const data = await resp.json();
    const md = data?.choices?.[0]?.message?.content?.trim();
    if (!md) return rawMd;

    // Anexamos enlaces verificados al final
    return `${md}\n\n---\n### Enlaces verificados\n${items
      .map(i => i.url || i.link)
      .filter(Boolean)
      .slice(0, 30)
      .map(u => `- ${u}`)
      .join("\n")}`;
  } catch (e) {
    console.warn("OpenAI fetch exception:", e);
    return rawMd;
  }
}

function sectionForProduct(product: string, arr: any[]) {
  const title = product === "nextjs" ? "## Next.js" :
    product === "supabase" ? "## Supabase" :
      product === "cloudflare" ? "## Cloudflare" :
        "## General";

  const lines: string[] = [title, ""];
  for (const it of arr.slice(0, 6)) {
    if (it.type === "github_release") {
      lines.push(`- **${it.name || it.tag}** — ${it.published_at ? formatDate(it.published_at) : ""}`);
      if (it.url) lines.push(`  - ${it.url}`);
      if (it.body) lines.push(`  - ${clip(it.body, 300)}`);
    } else if (it.type === "rss") {
      lines.push(`- **${it.title || "(sin título)"}** — ${it.pubDate ? formatDate(it.pubDate) : ""}`);
      if (it.link) lines.push(`  - ${it.link}`);
      if (it.description) lines.push(`  - ${clip(it.description, 280)}`);
    } else {
      lines.push(`- ${JSON.stringify(it).slice(0, 200)}`);
    }
  }
  lines.push("");
  return lines;
}

function clip(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

function formatDate(d: string) {
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return d;
  return dt.toISOString().split("T")[0];
}

// ----------------- Export Functions -----------------

export {
  buildSystemPrompt,
  getContext,
  isStale,
  json,
  putContext,
  refreshAndCache,
  textHeaders
};
