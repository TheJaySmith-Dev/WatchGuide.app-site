// Caching proxy in front of Poe's chat completions API, used by the WatchGuide app.
//
// The app sends the same request it would send to Poe, including its own key.
// Identical requests within the TTL are answered from Vercel's Runtime Cache, so
// they never reach Poe and cost no points. Everything else is passed through.

import { createHash } from 'node:crypto';
import { getCache, waitUntil } from '@vercel/functions';

const UPSTREAM = 'https://api.poe.com/v1/chat/completions';
const TTL_SECONDS = 24 * 60 * 60;
const MAX_REQUEST_BYTES = 256 * 1024;
// Runtime Cache refuses items over 2 MB; stay well under it.
const MAX_CACHED_BYTES = 1_500_000;
// Bots whose answers depend on live data are never cached.
const UNCACHED_MODELS = new Set(['Web-Search']);

function error(status, message) {
  return Response.json({ error: { message } }, { status });
}

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
  if (!text || Buffer.byteLength(text) > MAX_CACHED_BYTES) return false;
  if (streaming) return text.includes('[DONE]');
  try {
    const content = JSON.parse(text)?.choices?.[0]?.message?.content;
    return typeof content === 'string' && content.length > 0;
  } catch {
    return false;
  }
}

async function store(cache, key, stream, contentType, streaming) {
  try {
    const text = await new Response(stream).text();
    if (!isCacheable(text, streaming)) return;
    await cache.set(key, { body: text, contentType }, { ttl: TTL_SECONDS, name: 'poe-completion' });
  } catch (err) {
    console.error('poe cache write failed', err);
  }
}

export default {
  async fetch(request) {
    if (request.method !== 'POST') return error(405, 'Use POST.');

    const authorization = request.headers.get('authorization') ?? '';
    if (!authorization.startsWith('Bearer ') || authorization.length < 20) {
      return error(401, 'Missing API key.');
    }

    const raw = await request.text();
    if (Buffer.byteLength(raw) > MAX_REQUEST_BYTES) return error(413, 'Request too large.');

    let body;
    try {
      body = JSON.parse(raw);
    } catch {
      return error(400, 'Body must be JSON.');
    }
    if (!body || typeof body.model !== 'string' || !Array.isArray(body.messages)) {
      return error(400, 'Body needs "model" and "messages".');
    }

    const streaming = body.stream === true;
    const cacheable = !UNCACHED_MODELS.has(body.model);
    const key = createHash('sha256').update(canonical(body)).digest('hex');
    const cache = getCache({ namespace: 'poe-v1' });

    if (cacheable) {
      try {
        const hit = await cache.get(key);
        if (hit?.body) {
          return new Response(hit.body, {
            headers: {
              'content-type': hit.contentType,
              'cache-control': 'no-store',
              'x-wg-cache': 'HIT',
            },
          });
        }
      } catch (err) {
        console.error('poe cache read failed', err);
      }
    }

    const upstream = await fetch(UPSTREAM, {
      method: 'POST',
      headers: { authorization, 'content-type': 'application/json' },
      body: raw,
    });
    const contentType = upstream.headers.get('content-type') ?? 'application/json';
    const headers = { 'content-type': contentType, 'cache-control': 'no-store' };

    if (!upstream.ok || !cacheable || !upstream.body) {
      return new Response(upstream.body, {
        status: upstream.status,
        headers: { ...headers, 'x-wg-cache': 'BYPASS' },
      });
    }

    const [toClient, toCache] = upstream.body.tee();
    waitUntil(store(cache, key, toCache, contentType, streaming));
    return new Response(toClient, { headers: { ...headers, 'x-wg-cache': 'MISS' } });
  },
};
