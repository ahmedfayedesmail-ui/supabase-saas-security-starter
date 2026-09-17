# Deployment

## GitHub Pages validation site

The repository contains a GitHub Actions workflow that publishes the two validation variants as:

- `/a/` — Landing A (Speed)
- `/b/` — Landing B (Security)

In the repository settings, set **Settings → Pages → Build and deployment → Source → GitHub Actions**. After the workflow succeeds, GitHub Pages exposes the published site URL.

This public site is for validation only. The landing pages still contain placeholders for the Plausible site domain and Lemon Squeezy checkout URL until those services are configured.

## External integration blockers

1. Configure the real Plausible site/domain.
2. Replace `YOURDOMAIN`, `YOURSTORE`, and `UUID` placeholders with the real validation values.
3. Deploy the webhook handler to a public serverless endpoint and configure `LS_WEBHOOK_SECRET`, `YOURDOMAIN`, and `PLAUSIBLE_DOMAIN` as secrets/environment variables.
4. Configure Lemon Squeezy Test Mode and the webhook endpoint.
5. Run the real browser and Test Mode transaction protocol.

Do not record an integration test as PASS without real browser/dashboard/webhook evidence.
