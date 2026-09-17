# Validation Plan

## Product hypothesis

Digital developer product: a planned Supabase multi-tenant SaaS starter with a security-verification layer.

Core positioning hypotheses:

- Variant A — Speed: reduce repeated foundation work when starting a multi-tenant SaaS.
- Variant B — Security: make defined tenant-isolation/RLS scenarios explicitly testable and documented.

The product itself remains intentionally unbuilt until the paid validation gate is closed.

## Offer hypothesis

- Early Access validation price: **$99 one-time**.
- Same product, price, and core offer across A/B.
- Ship-by commitment: **December 16, 2026**.
- If the stated ship-by commitment is not met, the Early Access promise is a full refund.

These are validation hypotheses/commitments and must be reflected in the final commercial terms before live paid traffic.

## Funnel

`qualified visitor → CTA click → checkout attempt → paid order`

Paid orders are the strongest validation signal. CTA and checkout activity are supporting signals.

## A/B variable

Only the primary value proposition changes:

- A: Speed / faster SaaS foundation setup.
- B: Security / explicit tenant-isolation verification.

Do not change price, offer structure, or core product scope during a clean comparison window.

## Traffic policy

Start with **$0 paid advertising**. Use organic channels first and tag every link with UTM parameters.

Recommended UTM shape:

`utm_source={channel}&utm_medium={organic|paid}&utm_campaign={phase}&utm_content=landing_{a|b}`

Examples:

- `utm_source=reddit&utm_medium=organic&utm_campaign=phase_1&utm_content=landing_a`
- `utm_source=twitter&utm_medium=organic&utm_campaign=phase_1&utm_content=landing_b`

## Evidence rules

Do not call a channel "dead" because exposure is low. Use **not tested yet / insufficient exposure** until a predefined exposure threshold is reached.

After sufficient exposure, evaluate:

- qualified visitors
- CTA rate
- checkout activity
- paid orders
- revenue
- buyer/objection feedback
- A/B attribution consistency

Low traffic is not a negative result by itself.

## Validation window

The primary validation window is **7 days**, starting only after the validation-ready gate passes.

Do not require an arbitrary visitor count. The decision must use the quality and quantity of evidence available at the end of the window.

## Gate

### Validation-ready gate

- Landing A and B polished and mobile-tested.
- Public hosting works.
- Plausible configured with required goals/properties.
- Lemon Squeezy live checkout configured.
- Variant + UTM custom-data attribution wired.
- Webhook signature validation verified.
- `checkout_paid` server-side event verified.
- Terms, Privacy, and Refund pages finalized with owner identity/contact details.
- Evidence log ready.

### Product-build gate

**BLOCKED** until the 7-day paid validation has been completed and the owner makes a decision from the evidence.

## Evidence interpretation

There is no single universal conversion benchmark for this product. Treat public benchmark data as contextual only; do not label an arbitrary internal threshold as a market standard.

A result can be:

- **Strong signal:** multiple real paid orders plus credible buyer feedback tied to the offer.
- **Mixed signal:** some paid demand or strong intent, but objections or insufficient A/B separation require repositioning/retest.
- **No/weak signal:** no meaningful paid demand after an adequately exposed, technically functioning test.
- **Insufficient evidence:** the traffic or integration quality was too low to support a reliable decision.

## Non-negotiable honesty rule

No fabricated screenshots, timestamps, transactions, webhook payloads, dashboard results, or PASS claims. Every external integration status must be supported by real evidence.
