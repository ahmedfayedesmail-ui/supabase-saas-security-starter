import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function readLanding(name) {
  return fs.readFile(path.join(root, 'landing', name), 'utf8');
}

test('Landing A has the expected variant attribution contract', async () => {
  const html = await readLanding('index-a.html');
  assert.match(html, /const\s+VARIANT\s*=\s*['"]A['"]/);
  assert.match(html, /props:\s*\{\s*variant:\s*VARIANT\s*\}/);
  assert.match(html, /checkout%5Bcustom%5D%5Bvariant%5D=A/);
  assert.match(html, /data-event="cta_hero_click"/);
  assert.match(html, /data-event="cta_pricing_click"/);
  assert.match(html, /data-event="cta_final_click"/);
  assert.match(html, /data-event="demo_click"/);
  assert.match(html, /CONCEPT PREVIEW — NOT FINAL PRODUCT\./);
  assert.equal((html.match(/addEventListener\('click'/g) ?? []).length, 1);
});

test('Landing B has the expected variant attribution contract', async () => {
  const html = await readLanding('index-b.html');
  assert.match(html, /const\s+VARIANT\s*=\s*['"]B['"]/);
  assert.match(html, /props:\s*\{\s*variant:\s*VARIANT\s*\}/);
  assert.match(html, /checkout%5Bcustom%5D%5Bvariant%5D=B/);
  assert.match(html, /data-event="cta_hero_click"/);
  assert.match(html, /data-event="cta_pricing_click"/);
  assert.match(html, /data-event="cta_final_click"/);
  assert.match(html, /data-event="demo_click"/);
  assert.match(html, /CONCEPT PREVIEW — NOT FINAL PRODUCT\./);
  assert.equal((html.match(/addEventListener\('click'/g) ?? []).length, 1);
});
