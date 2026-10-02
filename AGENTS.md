# Trip Line — agent entry point

Read `docs/AI_HANDOFF.md` first, then `docs/FRONTEND_DELIVERY.md` and `docs/FRONTEND_IMPLEMENTATION_PLAN.md`. These describe the implementation as of 2 October 2026. The current user's instructions take precedence.

## Workspace boundaries

- `frontend-v2/` is the active Türkiye-focused public frontend. Follow its additional `AGENTS.md`, including reading the bundled Next.js documentation before changing framework behavior.
- `frontend/` is the preserved V1 demo. `backend/` is existing, unfinished backend work. Do not overwrite either while working on V2.
- `docs/NEW_CHAT_PROJECT_HANDOFF.md` is historical design context, not current task status. Its design-only pause and ten-country-first direction were superseded by the approved implementation and Türkiye-first client update.
- Public Vercel demo URLs in older documents show earlier revisions. Do not assume the current code is deployed or relink V2 to the V1 deployment project.

## Product constraints

Keep all twelve requested Turkish destinations, the nine source-based services, three locales, Arabic RTL, actual stacked logo, geographic atlas and teal/sand/bronze design. Preserve meaningful video, animation and scroll-driven 3D, including accessible static fallbacks. Do not invent prices, tour inventory, reviews or company claims. Inquiry currently prepares WhatsApp/email messages; do not claim server-side submission exists.

## Verification and handoff discipline

Run commands from `frontend-v2/`: `pnpm typecheck`, `pnpm lint`, `pnpm build`. Use `node scripts/verify-public.mjs` against a running production preview (default port 3003; `QA_URL` overrides it) when changing public flows. Browser binaries may need `pnpm exec playwright install chromium` on a fresh machine. Generated evidence belongs in ignored `tmp/frontend-qa/`; durable baseline reports are in `docs/qa/2026-10-02/`.

Update the handoff and phase plan when scope or completion status changes. Never commit secrets, `.env.local`, dependency folders, build output, or temporary downloads. Publication still needs approved legal wording, current claim/partner/media confirmation and deployment setup. Keep noindex defaults until publication is explicitly authorized.
