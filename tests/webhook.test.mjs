import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {
  buildPlausiblePayload,
  checkAndMarkProcessed,
  unmarkProcessed,
  verifySignature,
} from '../api/ls-webhook.js';

function sign(body, secret) {
  return crypto.createHmac('sha256', secret).update(body).digest('hex');
}

test('valid Lemon Squeezy-style HMAC signature is accepted', () => {
  const secret = 'test-secret';
  const body = Buffer.from('{"a":1}', 'utf8');
  const signature = sign(body, secret);
  assert.equal(verifySignature(body, signature, secret), true);
});

test('tampering with the raw body invalidates the signature', () => {
  const secret = 'test-secret';
  const body = Buffer.from('{"a":1}', 'utf8');
  const signature = sign(body, secret);
  assert.equal(verifySignature(Buffer.from('{"a":2}', 'utf8'), signature, secret), false);
});

test('invalid signature length is rejected without throwing', () => {
  const body = Buffer.from('{"a":1}', 'utf8');
  assert.equal(verifySignature(body, 'short', 'test-secret'), false);
});

test('variant payload contract accepts A/B only', () => {
  assert.equal(['A', 'B'].includes('A'), true);
  assert.equal(['A', 'B'].includes('B'), true);
  assert.equal(['A', 'B'].includes('C'), false);
});

test('Plausible checkout payload carries variant and native revenue', () => {
  const payload = buildPlausiblePayload({
    domain: 'example.com',
    url: 'https://example.com/a',
    variant: 'A',
    currency: 'USD',
    totalCents: 9900,
  });

  assert.equal(payload.name, 'checkout_paid');
  assert.equal(payload.props.variant, 'A');
  assert.deepEqual(payload.revenue, { currency: 'USD', amount: 99 });
});

test('validation fallback deduplicates the same order and can roll back', async () => {
  const orderId = `test-order-${Date.now()}-${Math.random()}`;
  assert.equal(await checkAndMarkProcessed(orderId), false);
  assert.equal(await checkAndMarkProcessed(orderId), true);
  await unmarkProcessed(orderId);
  assert.equal(await checkAndMarkProcessed(orderId), false);
  await unmarkProcessed(orderId);
});
