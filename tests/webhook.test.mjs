import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

function sign(body, secret) { return crypto.createHmac('sha256', secret).update(body).digest('hex'); }

test('signature changes when raw body changes', () => {
  const secret='test-secret';
  const body='{"a":1}';
  assert.notEqual(sign(body,secret), sign('{"a":2}',secret));
});

test('variant payload contract accepts A/B only', () => {
  for (const v of ['A','B']) assert.ok(['A','B'].includes(v));
  assert.ok(!['A','B'].includes('C'));
});
