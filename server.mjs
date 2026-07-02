// server.mjs — managed-app server wrapper for a static/SPA app.
//
// Part of the managed-app template kit: this file is copied verbatim into the
// app repo and NEVER edited per-app. Everything app-specific is parameterized
// by env vars — STATIC_INDEX (served entry), CANONICAL_HOST + ALIAS_HOSTS
// (alias redirect), PORT (bind port), RAILWAY_SERVICE_NAME (startup log name).
// The wrapper puts the app's static entry behind:
//   1. HTTPS enforcement (HTTP->HTTPS 301 + HSTS) and the /__psc/version endpoint,
//      via the shared @psc/https middleware (mounted exactly once).
//   2. A /healthz endpoint for the platform health probe.
//   3. An env-driven alias -> canonical 301 (ALIAS_HOSTS -> CANONICAL_HOST, path + query preserved).
//   4. Static serving of the STATIC_INDEX-named entry file at the site root.
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
//    path + query preserved). Fully env-driven, NO hardcoded domain: CANONICAL_HOST
//    and the comma-separated ALIAS_HOSTS are supplied by the environment (the
//    control plane's deploy pipeline derives both from the app config). Fail-safe —
//    if CANONICAL_HOST is unset (or ALIAS_HOSTS empty) nothing is redirected, so a
//    missing var degrades to plain serving rather than a wrong-host loop. Read per
//    request so tests can drive it via the environment. Lowercased compare defends
//    against mixed-case Host headers; the split strips an edge-appended :port.
app.use('*', async (c, next) => {
  const canonical = process.env.CANONICAL_HOST;
  const aliases = (process.env.ALIAS_HOSTS ?? '')
    .split(',')
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);
  const host = (c.req.header('host') ?? '').toLowerCase().split(':')[0];
  if (canonical && host && aliases.includes(host)) {
    const url = new URL(c.req.url);
    return c.redirect(`https://${canonical}${url.pathname}${url.search}`, 301);
  }
  await next();
});

// 4. Serve the static entry. The root path maps to the STATIC_INDEX-named file
//    (env-driven, set by the control plane from the app config; defaults to
//    index.html when unset); serveStatic normalizes paths and refuses
//    parent-directory traversal.
const STATIC_INDEX = process.env.STATIC_INDEX ?? 'index.html';
app.use('*', serveStatic({
  root: './',
  rewriteRequestPath: (path) => (path === '/' ? `/${STATIC_INDEX}` : path),
}));

export { app };

// Bind a port only when run directly, not when imported by tests.
if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.env.PORT ?? 3000);
  const name = process.env.RAILWAY_SERVICE_NAME ?? 'app';
  serve({ fetch: app.fetch, port, hostname: '0.0.0.0' }, (info) => {
    console.log(`${name} listening on ${info.address}:${info.port}`);
  });
}
