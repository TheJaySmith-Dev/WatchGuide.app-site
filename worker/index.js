// Cloudflare Worker for watchguide.app: serves the built site (static assets, SPA fallback) and
// the two proxies the WatchGuide app calls, ported from the Vercel functions in api/.
//
//   /api/justwatch/v1/...  read-only RapidAPI JustWatch proxy (key stays in the Worker env)
//   /api/poe               caching proxy in front of Poe chat completions
//
// Everything else falls through to the static assets (see wrangler.jsonc).

const JUSTWATCH_DEFAULT_HOST = 'justwatch9.p.rapidapi.com';

const POE_UPSTREAM = 'https://api.poe.com/v1/chat/completions';
const POE_TTL_SECONDS = 24 * 60 * 60;
const POE_MAX_REQUEST_BYTES = 256 * 1024;
const POE_MAX_CACHED_BYTES = 1_500_000;
// Bots whose answers depend on live data are never cached.
const POE_UNCACHED_MODELS = new Set(['Web-Search']);

const byteLength = (text) => new TextEncoder().encode(text).length;

async function sha256Hex(text) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function justwatch(request, env) {
  if (request.method !== 'GET') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }
  const key = env.RAPIDAPI_KEY;
  if (!key) return Response.json({ error: 'RAPIDAPI_KEY is not set' }, { status: 500 });
  const host = env.RAPIDAPI_JUSTWATCH_HOST || JUSTWATCH_DEFAULT_HOST;

  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/api\/justwatch\/?/, '');
  if (!path.startsWith('v1/') || path.includes('..')) {
    return Response.json({ error: 'Bad path' }, { status: 400 });
  }
  const search = url.searchParams.toString();

  const upstream = await fetch(`https://${host}/api/justwatch/${path}${search ? `?${search}` : ''}`, {
    headers: { 'x-rapidapi-key': key, 'x-rapidapi-host': host },
  });
  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      'Content-Type': upstream.headers.get('Content-Type') || 'application/json',
      'Cache-Control': upstream.ok ? 'public, max-age=300, s-maxage=3600' : 'no-store',
    },
  });
}

const poeError = (status, message) => Response.json({ error: { message } }, { status });

// Stable JSON so key order in the request body doesn't change the cache key.
function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') {
    const entries = Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`);
    return `{${entries.join(',')}}`;
  }
  return JSON.stringify(value);
}

// Only complete, useful answers are worth keeping.
function isCacheable(text, streaming) {
  if (!text || byteLength(text) > POE_MAX_CACHED_BYTES) return false;
  if (streaming) return text.includes('[DONE]');
  try {
    const content = JSON.parse(text)?.choices?.[0]?.message?.content;
    return typeof content === 'string' && content.length > 0;
  } catch {
    return false;
  }
}

async function poeStore(cache, cacheKey, stream, contentType, streaming) {
  try {
    const text = await new Response(stream).text();
    if (!isCacheable(text, streaming)) return;
    await cache.put(
      cacheKey,
      new Response(text, { headers: { 'content-type': contentType, 'cache-control': `public, max-age=${POE_TTL_SECONDS}` } }),
    );
  } catch (err) {
    console.error('poe cache write failed', err);
  }
}

async function poe(request, ctx) {
  if (request.method !== 'POST') return poeError(405, 'Use POST.');

  const authorization = request.headers.get('authorization') ?? '';
  if (!authorization.startsWith('Bearer ') || authorization.length < 20) {
    return poeError(401, 'Missing API key.');
  }

  const raw = await request.text();
  if (byteLength(raw) > POE_MAX_REQUEST_BYTES) return poeError(413, 'Request too large.');

  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return poeError(400, 'Body must be JSON.');
  }
  if (!body || typeof body.model !== 'string' || !Array.isArray(body.messages)) {
    return poeError(400, 'Body needs "model" and "messages".');
  }

  const streaming = body.stream === true;
  const cacheable = !POE_UNCACHED_MODELS.has(body.model);
  const hash = await sha256Hex(canonical(body));
  // The Cache API needs a URL-shaped key; this host is never fetched.
  const cacheKey = new Request(`https://poe-cache.watchguide.invalid/v1/${hash}`);
  const cache = caches.default;

  if (cacheable) {
    try {
      const hit = await cache.match(cacheKey);
      if (hit) {
        return new Response(hit.body, {
          headers: {
            'content-type': hit.headers.get('content-type') ?? 'application/json',
            'cache-control': 'no-store',
            'x-wg-cache': 'HIT',
          },
        });
      }
    } catch (err) {
      console.error('poe cache read failed', err);
    }
  }

  const upstream = await fetch(POE_UPSTREAM, {
    method: 'POST',
    headers: { authorization, 'content-type': 'application/json' },
    body: raw,
  });
  const contentType = upstream.headers.get('content-type') ?? 'application/json';
  const headers = { 'content-type': contentType, 'cache-control': 'no-store' };

  if (!upstream.ok || !cacheable || !upstream.body) {
    return new Response(upstream.body, { status: upstream.status, headers: { ...headers, 'x-wg-cache': 'BYPASS' } });
  }

  const [toClient, toCache] = upstream.body.tee();
  ctx.waitUntil(poeStore(cache, cacheKey, toCache, contentType, streaming));
  return new Response(toClient, { headers: { ...headers, 'x-wg-cache': 'MISS' } });
}

export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/justwatch' || pathname.startsWith('/api/justwatch/')) return justwatch(request, env);
    if (pathname === '/api/poe') return poe(request, ctx);
    if (pathname.startsWith('/api/')) return Response.json({ error: 'Not found' }, { status: 404 });
    return env.ASSETS.fetch(request);
  },
};
