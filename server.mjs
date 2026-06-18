// server.mjs — production server wrapper for the Ultimate Malted Pancakes Flight Picker.
//
// The shipped artifact is a single static HTML file. This wrapper puts it behind:
//   1. HTTPS enforcement (HTTP->HTTPS 301 + HSTS) and the /__psc/version endpoint,
//      via the shared @psc/https middleware (mounted exactly once).
//   2. A /healthz endpoint for the platform health probe.
//   3. A flapjacks.gallifreyans.com -> pancakes.gallifreyans.com 301 (path + query preserved).
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

// 3. Canonical-host redirect: flapjacks -> pancakes, preserving path and query.
//    Lowercased compare is defensive against mixed-case Host headers; the
//    startsWith check strips an edge-appended :port from direct-IP probes.
app.use('*', async (c, next) => {
  const host = c.req.header('host')?.toLowerCase() ?? '';
  if (host === 'flapjacks.gallifreyans.com' || host.startsWith('flapjacks.gallifreyans.com:')) {
    const url = new URL(c.req.url);
    return c.redirect(`https://pancakes.gallifreyans.com${url.pathname}${url.search}`, 301);
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
