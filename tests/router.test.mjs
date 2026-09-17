import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('A/B router exists and honors explicit UTM variant plus sticky storage', async () => {
  const html = await fs.readFile(path.join(root, 'landing', 'index.html'), 'utf8');
  assert.ok(html.includes("landing_b"), 'router should honor an explicit B UTM value');
  assert.ok(html.includes("landing_a"), 'router should honor an explicit A UTM value');
  assert.ok(html.includes("localStorage.getItem('saas_validation_variant')"));
  assert.ok(html.includes("localStorage.setItem('saas_validation_variant', variant)"));
  assert.ok(html.includes("Math.random() < 0.5 ? 'A' : 'B'"));
  assert.ok(html.includes("location.replace(`./${variant.toLowerCase()}/`"));
});
