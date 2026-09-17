# Supabase SaaS Security Starter

Validation-stage assets for a Supabase multi-tenant SaaS starter with security-verification positioning.

## Scope
- Landing A (Speed)
- Landing B (Security)
- Lemon Squeezy webhook handler template with raw-body HMAC verification
- Plausible `checkout_paid` event with variant + native revenue
- Local contract tests for webhook and landing attribution logic
- GitHub Actions CI for Node 20/22/24
- GitHub Pages workflow for a public A/B validation site

## Local checks

```bash
npm install
npm test
```

The local suite validates code contracts only. It does not replace browser, Lemon Squeezy, webhook, or Plausible integration evidence.

## Validation status
End-to-end third-party integration remains blocked until a real public site, Lemon Squeezy Test Mode checkout, receiving webhook endpoint, and Plausible site are connected and verified with real evidence.

Product build remains intentionally blocked until the paid validation gate is passed.
