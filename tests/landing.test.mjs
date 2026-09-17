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
  assert.match(html, new RegExp(`const\\s+VARIANT\\s*=\\s*['\"]${variant}['\"]`));
  assert.match(html, /function\\s+fire\\(name,\\s*props=\\{\\}\\)/);
  assert.match(html, /window\\.plausible\\(name,\\s*\\{props\\}\\)/);
  assert.match(html, new RegExp(`fire\\(name,\\s*\\{variant:\\s*VARIANT\\}\\)`));
  assert.match(html, /u\\.searchParams\\.set\\('checkout\\[custom\\]\\[variant\\]',\\s*VARIANT\\)/);
  assert.match(html, /utm_source/);
  assert.match(html, /utm_medium/);
  assert.match(html, /utm_campaign/);
  assert.match(html, /utm_content/);
  assert.match(html, /data-event=\"cta_hero_click\"/);
  assert.match(html, /data-event=\"cta_final_click\"/);
  assert.match(html, /data-event=\"demo_click\"/);
  assert.match(html, /Concept preview only\\./);
  assert.equal((html.match(/addEventListener\\('click'/g) ?? []).length, 1);
}

test('Landing A has the expected variant attribution contract', async () => {
  assertCommonLandingContract(await readLanding('index-a.html'), 'A');
});

test('Landing B has the expected variant attribution contract', async () => {
  assertCommonLandingContract(await readLanding('index-b.html'), 'B');
});
