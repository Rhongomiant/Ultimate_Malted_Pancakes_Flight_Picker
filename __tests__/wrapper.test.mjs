// Smoke test for the managed-app server wrapper. Runs via `node --test`.
//
// Sets the env vars FIRST, then imports the Hono `app` via a top-level-await
// dynamic import (no port binding): STATIC_INDEX is captured ONCE at module
// load, so it MUST be in the environment before `server.mjs` is evaluated.
// The suite exercises the behaviors the wrapper guarantees: HTTPS
// enforcement, the @psc/https version endpoint, the env-driven
// alias->canonical redirect (incl. the fail-safe when CANONICAL_HOST is
// unset), path-traversal rejection, and env-driven static entry serving.
import { test } from 'node:test';
import assert from 'node:assert/strict';

// CANONICAL_HOST + ALIAS_HOSTS are read per request (the control plane sets
// both on every deploy), but STATIC_INDEX is a module-load const — all three
// go into the environment before the import below.
process.env.CANONICAL_HOST = 'canonical.example.com';
process.env.ALIAS_HOSTS = 'alias.example.com,alias.example.net';
process.env.STATIC_INDEX = '__tests__/fixture.html';
const { app } = await import('../server.mjs');

// (a) Plain-HTTP request (X-Forwarded-Proto: http) is redirected to HTTPS.
// A Host header is required: the middleware builds the redirect target from it
// and defensively passes through when Host is absent (real edge traffic always
// sets Host). See @psc/https hono.ts step 3.
test('redirects HTTP to HTTPS (301)', async () => {
  const res = await app.fetch(
    new Request('http://localhost/', {
      headers: { 'X-Forwarded-Proto': 'http', host: 'canonical.example.com' },
    }),
  );
  assert.equal(res.status, 301);
  assert.equal(res.headers.get('location'), 'https://canonical.example.com/');
});

// (b) /__psc/version is served by @psc/https with the package identity.
test('serves /__psc/version with @psc/https identity', async () => {
  const res = await app.fetch(new Request('https://localhost/__psc/version'));
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.name, '@psc/https');
  assert.match(body.version, /^\d+\.\d+\.\d+/);
});

// (c) An alias host is redirected to the canonical host, preserving path and
// query.
test('redirects an alias host to the canonical host (301; path + query preserved)', async () => {
  const res = await app.fetch(
    new Request('https://alias.example.com/foo?bar=1', {
      headers: { 'X-Forwarded-Proto': 'https', host: 'alias.example.com' },
    }),
  );
  assert.equal(res.status, 301);
  assert.equal(
    res.headers.get('location'),
    'https://canonical.example.com/foo?bar=1',
  );
});

// (c2) The second alias in ALIAS_HOSTS also redirects to the canonical host,
// proving the redirect is env-driven (not a single hardcoded host).
test('redirects the second env-driven alias (.net) to the canonical host (301)', async () => {
  const res = await app.fetch(
    new Request('https://alias.example.net/x?y=2', {
      headers: { 'X-Forwarded-Proto': 'https', host: 'alias.example.net' },
    }),
  );
  assert.equal(res.status, 301);
  assert.equal(
    res.headers.get('location'),
    'https://canonical.example.com/x?y=2',
  );
});

// (c3) Fail-safe: with CANONICAL_HOST unset there is NO hardcoded fallback, so an
// alias host is NOT redirected (it degrades to plain serving, never a wrong-host loop).
test('does NOT redirect an alias when CANONICAL_HOST is unset (fail-safe)', async () => {
  const saved = process.env.CANONICAL_HOST;
  delete process.env.CANONICAL_HOST;
  try {
    const res = await app.fetch(
      new Request('https://alias.example.net/', {
        headers: { 'X-Forwarded-Proto': 'https', host: 'alias.example.net' },
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

// (e) The root path serves the STATIC_INDEX-named entry (env-driven end to
// end: the preamble points it at the fixture, and the body proves the rewrite
// resolved that exact file).
test('serves the STATIC_INDEX-named entry at the root path (env-driven)', async () => {
  const res = await app.fetch(
    new Request('https://canonical.example.com/', {
      headers: { 'X-Forwarded-Proto': 'https', host: 'canonical.example.com' },
    }),
  );
  assert.equal(res.status, 200);
  const body = await res.text();
  assert.match(body, /managed-app-template-fixture/);
});
