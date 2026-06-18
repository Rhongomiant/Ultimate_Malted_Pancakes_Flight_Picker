// Smoke test for the production server wrapper. Runs via `node --test`.
//
// Imports the Hono `app` (no port binding) and exercises the four behaviors the
// wrapper guarantees: HTTPS enforcement, the @psc/https version endpoint, the
// flapjacks->pancakes canonical redirect, and path-traversal rejection.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { app } from '../server.mjs';

// (a) Plain-HTTP request (X-Forwarded-Proto: http) is redirected to HTTPS.
// A Host header is required: the middleware builds the redirect target from it
// and defensively passes through when Host is absent (real edge traffic always
// sets Host). See @psc/https hono.ts step 3.
test('redirects HTTP to HTTPS (301)', async () => {
  const res = await app.fetch(
    new Request('http://localhost/', {
      headers: { 'X-Forwarded-Proto': 'http', host: 'pancakes.gallifreyans.com' },
    }),
  );
  assert.equal(res.status, 301);
  assert.equal(res.headers.get('location'), 'https://pancakes.gallifreyans.com/');
});

// (b) /__psc/version is served by @psc/https with the package identity.
test('serves /__psc/version with @psc/https identity', async () => {
  const res = await app.fetch(new Request('https://localhost/__psc/version'));
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.name, '@psc/https');
  assert.match(body.version, /^\d+\.\d+\.\d+/);
});

// (c) flapjacks host is redirected to pancakes, preserving path and query.
test('redirects flapjacks host to pancakes (301; path + query preserved)', async () => {
  const res = await app.fetch(
    new Request('https://flapjacks.gallifreyans.com/foo?bar=1', {
      headers: { 'X-Forwarded-Proto': 'https', host: 'flapjacks.gallifreyans.com' },
    }),
  );
  assert.equal(res.status, 301);
  assert.equal(res.headers.get('location'), 'https://pancakes.gallifreyans.com/foo?bar=1');
});

// (d) Parent-directory traversal must not resolve to a served file (no 200).
test('rejects path traversal (no 200)', async () => {
  const res = await app.fetch(new Request('https://localhost/../../etc/passwd'));
  assert.notEqual(res.status, 200);
});
