// Read-only proxy for the RapidAPI JustWatch API, used by the WatchGuide app.
// The RapidAPI key lives in this project's environment, never in the app.

const HOST = process.env.RAPIDAPI_JUSTWATCH_HOST || 'justwatch9.p.rapidapi.com';

export default {
  async fetch(request) {
    if (request.method !== 'GET') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }
    const key = process.env.RAPIDAPI_KEY;
    if (!key) return Response.json({ error: 'RAPIDAPI_KEY is not set' }, { status: 500 });

    const url = new URL(request.url);
    // Upstream paths are /api/justwatch/v1/*, the same as this route's.
    if (!url.pathname.startsWith('/api/justwatch/v1/') || url.pathname.includes('..')) {
      return Response.json({ error: 'Bad path' }, { status: 400 });
    }

    const upstream = await fetch(`https://${HOST}${url.pathname}${url.search}`, {
      headers: { 'x-rapidapi-key': key, 'x-rapidapi-host': HOST },
    });
    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        'Content-Type': upstream.headers.get('Content-Type') || 'application/json',
        'Cache-Control': upstream.ok ? 'public, max-age=300, s-maxage=3600' : 'no-store',
      },
    });
  },
};
