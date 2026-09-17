import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function readLanding(name) {
  return fs.readFile(path.join(root, 'landing', name), 'utf8');
}

function assertCommonLandingContract(html, variant) {
  assert.ok(html.includes(`const VARIANT = '${variant}';`), `expected variant ${variant}`);
  assert.ok(html.includes('function fire(name, props={})'), 'expected fire() helper');
  assert.ok(html.includes('window.plausible(name, {props})'), 'expected Plausible props forwarding');
  assert.ok(html.includes('fire(name, {variant: VARIANT})'), 'expected variant propagation to event');
  assert.ok(html.includes("u.searchParams.set('checkout[custom][variant]', VARIANT)"), 'expected checkout variant propagation');
  for (const event of ['cta_hero_click', 'cta_pricing_click', 'cta_final_click', 'demo_click']) {
    assert.ok(html.includes(`data-event="${event}"`), `missing ${event}`);
  }
  assert.ok(html.includes('Concept preview only.'), 'missing concept preview disclosure');
  assert.equal((html.match(/addEventListener\('click'/g) ?? []).length, 1, 'expected one click listener registration');
}

test('Landing A has the expected variant attribution contract', async () => {
  assertCommonLandingContract(await readLanding('index-a.html'), 'A');
});

test('Landing B has the expected variant attribution contract', async () => {
  assertCommonLandingContract(await readLanding('index-b.html'), 'B');
});
