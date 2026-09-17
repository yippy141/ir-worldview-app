# Verification procedure and evidence

Run against the PR head. The PR description and GitHub checks report the final outcome and commit SHA; this file records the procedure so that results can be reproduced without changing the commit solely to record its own hash.

## Required checks

- `npm run validate`
- `npm run copy:audit:strict`
- `npm run evidence:audit:check`
- `npm run lint`
- `npm run test`
- `npm run typecheck`
- `npm run build`
- Production-server Playwright: `CI=1 E2E_BASE_URL=<local-origin> npm run test:e2e -- --retries=0`
- `DECISION_BASE_URL=<local-origin> npx playwright test -c playwright.decision-exercises.config.ts`
- `RESULT_BASE_URL=<local-origin> npx playwright test -c playwright.result-interpretation.config.ts`

For local browser evidence, set `DECISION_EVIDENCE_DIR`, `DECISION_REPAIR_DIR`, `ACCESS_EVIDENCE_DIR`, `RESULT_ROUTE_EVIDENCE_FILE` and Playwright `--output` to disposable paths outside the repository. `EDITORIAL_EVIDENCE_DIR` optionally saves the responsive sweep captures. Browser contexts contain only synthetic fixtures.

## Coverage added or amended

- 32 public routes at 320, 390, 768 and 1440px: heading punctuation, heading/body separation and horizontal overflow. Questionnaire statements are intentionally excluded from the editorial heading punctuation rule.
- Eight Thinkers entries; four new essays have working source citations, no invented scores and explicit Chinese translation fallback links.
- Decision Patterns: ten entries including four Institutionalist entries; no misleading tradition label inside the continuous plot.
- Saved work and a legacy remembered-menu flag no longer skip the bare homepage entrance. Enter still exposes saved status without changing the stored fixture. Library order is checked.
- Native globe animation retains its canvas, interruption and focus behavior at 650ms. Scene coverage requires fifteen complete, explicitly labeled arrangements and a 5500ms hold.
- Existing title and navigation expectations were updated for removed periods, AI Futures and the clearer map explanation. No assertions were removed to accommodate a failure. The 104-sentence content ledger was updated to match the requested copy revisions; its exact-text and pending-review checks remain.

## Evidence notes

- See `README.md` for paired screenshots and print PDFs. All content is public reading material; no owner result is captured.
- `home-assets.json` records root assets against the previous PR63 production build. Initial gzip JavaScript is 175,374 bytes versus 175,459 bytes (85 bytes smaller). Deferred gzip JavaScript is unchanged at 53,644 bytes. No new dependency, Mapbox request or font was introduced.
- The Impeccable scan found only three pre-existing Arial declarations used by Current Case print output. No screen font or color-token substitution was made.
- Instrument validation retains its two existing advisory scenario-compromise findings. The strict public-copy audit has no blocking findings; advisory copy signals are not a substitute for editorial reading.
