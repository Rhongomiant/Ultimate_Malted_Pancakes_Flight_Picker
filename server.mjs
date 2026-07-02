// server.mjs — production server wrapper for the Ultimate Malted Pancakes Flight Picker.
//
// The shipped artifact is a single static HTML file. This wrapper puts it behind:
//   1. HTTPS enforcement (HTTP->HTTPS 301 + HSTS) and the /__psc/version endpoint,
//      via the shared @psc/https middleware (mounted exactly once).
//   2. A /healthz endpoint for the platform health probe.
//   3. An env-driven alias -> canonical 301 (ALIAS_HOSTS -> CANONICAL_HOST, path + query preserved).
//   4. Static file serving for the picker at the site root.
//
// Exported `app` is importable by the smoke test without binding a port; the
// server only listens when this module is run directly (`node server.mjs`).
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { pscHttpsHono, defaultHstsOptions } from '@psc/https';

const app = new Hono();

// 1. HTTPS enforcement FIRST so it can short-circuit /__psc/version and bypass
//    /healthz before any later middleware runs. Mount once (v0.1.x limitation).
app.use('*', pscHttpsHono({ hsts: defaultHstsOptions }));

// 2. Health probe. @psc/https bypasses /healthz, so plain-HTTP platform checks
//    from inside the deploy network still receive a 200.
app.get('/healthz', (c) => c.json({ ok: true, data: { db: 'up' } }));

// 3. Canonical-host redirect: any host in ALIAS_HOSTS -> CANONICAL_HOST (301,
//    path + query preserved). Env-driven so the redirect set tracks every alias
//    the platform provisions instead of hardcoding one. CANONICAL_HOST and the
//    comma-separated ALIAS_HOSTS are supplied by the environment; a missing
//    CANONICAL_HOST falls back to the primary host, and an empty ALIAS_HOSTS
//    redirects nothing. Read per request so tests can drive it via the
//    environment. Lowercased compare defends against mixed-case Host headers;
//    the split strips an edge-appended :port.
app.use('*', async (c, next) => {
  const canonical = process.env.CANONICAL_HOST ?? 'pancakes.gallifreyans.com';
  const aliases = (process.env.ALIAS_HOSTS ?? '')
    .split(',')
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);
  const host = (c.req.header('host') ?? '').toLowerCase().split(':')[0];
  if (host && aliases.includes(host)) {
    const url = new URL(c.req.url);
    return c.redirect(`https://${canonical}${url.pathname}${url.search}`, 301);
  }
  await next();
});

// 4. Serve the static picker. The root path maps to the single HTML artifact;
//    serveStatic normalizes paths and refuses parent-directory traversal.
app.use('*', serveStatic({
  root: './',
  rewriteRequestPath: (path) => (path === '/' ? '/Ultimate_Malted_Pancakes_Flight_Picker.html' : path),
}));

export { app };

// Bind a port only when run directly, not when imported by tests.
if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.env.PORT ?? 3000);
  serve({ fetch: app.fetch, port, hostname: '0.0.0.0' }, (info) => {
    console.log(`pancakes listening on ${info.address}:${info.port}`);
  });
}
