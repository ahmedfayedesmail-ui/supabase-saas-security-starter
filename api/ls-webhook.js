import crypto from 'node:crypto';

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const rawBody = await readRawBody(req);
  const signature = req.headers['x-signature'];
  if (!verifySignature(rawBody, signature, process.env.LS_WEBHOOK_SECRET)) {
    return res.status(401).json({ error: 'invalid_signature' });
  }

  let event;
  try { event = JSON.parse(rawBody.toString('utf8')); }
  catch { return res.status(400).json({ error: 'invalid_json' }); }

  if (event?.meta?.event_name !== 'order_created') {
    return res.status(200).json({ skipped: true, event: event?.meta?.event_name });
  }

  const variant = event?.meta?.custom_data?.variant;
  if (!['A', 'B'].includes(variant)) return res.status(400).json({ error: 'missing_variant' });

  const orderId = event?.data?.id;
  if (!orderId) return res.status(400).json({ error: 'missing_order_id' });

  // Validation-only fallback. Replace with persistent Postgres/Supabase/Redis before live launch.
  const alreadyProcessed = await checkAndMarkProcessed(orderId);
  if (alreadyProcessed) return res.status(200).json({ ok: true, deduped: true, orderId });

  const total = event?.data?.attributes?.total;
  const currency = event?.data?.attributes?.currency || 'USD';
  if (typeof total !== 'number') {
    await unmarkProcessed(orderId);
    return res.status(400).json({ error: 'missing_total' });
  }

  const domain = process.env.PLAUSIBLE_DOMAIN;
  const siteDomain = process.env.YOURDOMAIN;
  if (!domain || !siteDomain) {
    await unmarkProcessed(orderId);
    return res.status(500).json({ error: 'missing_plausible_config' });
  }

  const url = `https://${siteDomain}/${variant.toLowerCase()}`;
  const plausiblePayload = buildPlausiblePayload({ domain, url, variant, currency, totalCents: total });

  const response = await fetch('https://plausible.io/api/event', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': req.headers['user-agent'] || 'ls-webhook'
    },
    body: JSON.stringify(plausiblePayload)
  });

  if (!response.ok) {
    await unmarkProcessed(orderId);
    return res.status(500).json({ error: 'plausible_failed' });
  }

  return res.status(200).json({ ok: true, variant, orderId });
}

export function buildPlausiblePayload({ domain, url, variant, currency, totalCents }) {
  return {
    name: 'checkout_paid',
    domain,
    url,
    props: { variant },
    revenue: { currency, amount: totalCents / 100 }
  };
}

export async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks);
}

export function verifySignature(rawBody, signature, secret) {
  if (!signature || !secret) return false;
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(signature, 'utf8');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

const processedOrders = new Set();
export async function checkAndMarkProcessed(orderId) {
  if (processedOrders.has(orderId)) return true;
  processedOrders.add(orderId);
  return false;
}

export async function unmarkProcessed(orderId) {
  processedOrders.delete(orderId);
}
