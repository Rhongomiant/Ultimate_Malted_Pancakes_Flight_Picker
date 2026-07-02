// Smoke test for the production server wrapper. Runs via `node --test`.
//
// Imports the Hono `app` (no port binding) and exercises the four behaviors the
// wrapper guarantees: HTTPS enforcement, the @psc/https version endpoint, the
// env-driven alias->canonical redirect (incl. fail-safe when CANONICAL_HOST is
// unset), and path-traversal rejection.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { app } from '../server.mjs';

// The canonical redirect reads CANONICAL_HOST + ALIAS_HOSTS from the environment
// per request (PSC apps-deploy sets both on the Railway service). Set them here
// so the alias-redirect tests exercise the real env-driven code path.
process.env.CANONICAL_HOST = 'pancakes.gallifreyans.com';
process.env.ALIAS_HOSTS = 'flapjacks.gallifreyans.com,flapjacks.gallifreyans.info';

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

// (c2) A multi-apex alias in ALIAS_HOSTS also redirects to the canonical host,
// proving the redirect is env-driven (not a single hardcoded host).
test('redirects an env-driven multi-apex alias (.info) to pancakes (301)', async () => {
  const res = await app.fetch(
    new Request('https://flapjacks.gallifreyans.info/x?y=2', {
      headers: { 'X-Forwarded-Proto': 'https', host: 'flapjacks.gallifreyans.info' },
    }),
  );
  assert.equal(res.status, 301);
  assert.equal(res.headers.get('location'), 'https://pancakes.gallifreyans.com/x?y=2');
});

// (c3) Fail-safe: with CANONICAL_HOST unset there is NO hardcoded fallback, so an
// alias host is NOT redirected (it degrades to plain serving, never a wrong-host loop).
test('does NOT redirect an alias when CANONICAL_HOST is unset (fail-safe)', async () => {
  const saved = process.env.CANONICAL_HOST;
  delete process.env.CANONICAL_HOST;
  try {
    const res = await app.fetch(
      new Request('https://flapjacks.gallifreyans.info/', {
        headers: { 'X-Forwarded-Proto': 'https', host: 'flapjacks.gallifreyans.info' },
      }),
    );
    assert.notEqual(res.status, 301);
  } finally {
    process.env.CANONICAL_HOST = saved;
  }
});

// (d) Parent-directory traversal must not resolve to a served file (no 200).
test('rejects path traversal (no 200)', async () => {
  const res = await app.fetch(new Request('https://localhost/../../etc/passwd'));
  assert.notEqual(res.status, 200);
});
