# Proposed sprint queue

29 September 2026. Recovery and assessment are complete; the implementation work below is proposed, not shipped. Use one bounded sprint per kickoff. Recheck the starting tree and skip already-resolved findings.

| Order / ID | Scope | Definition of done |
| --- | --- | --- |
| 0 / SECURITY | Check current advisories; upgrade existing Next.js and matching lint config to a verified patched compatible release; review lockfile changes and Node social-card input path | Fresh production/full audit reports; lint, tests, build, typecheck, all three Playwright configurations pass; card generation works; no unrelated dependency churn |
| 1 / TRUST | Complete Foundation save feedback and owner/recipient/unknown presentation; reuse PR-A selectively | Real completion saves exactly once; fresh marked and unmarked links write nothing; notices never claim personal identity from a URL or payload match; old/unknown records do not establish ownership; local/session-storage failures give truthful feedback; delete/revisit and navigation clear stale states; EN/ZH and server/hydrated views agree; legacy history unchanged |
| 2 / RESULTS | Correct flat and multiway-tied Foundation display across result, metadata, share text and card | Separate exact flat, multiway tie, broad low separation, and two-way close fixtures; no invented identity for an exact tie; no claim that all dimensions are flat unless they are; actual general-extension route/count; clear results retain their payoff; old payloads/scores unchanged |
| 3 / PERSPECTIVES | Remove forced stability and distinguish untested and clipped movement | All-shift case permits no stable dimension; uncovered dimensions are not evidence of stability; outward boundary signal is disclosed; stored payload compatibility and derived-result behavior explicitly tested |
| 4 / COPY | Trial a narrowed PR-B ratchet on one unscored catalogue/result surface | Existing editorial guide remains authoritative; instrument wording frozen; advisory-rule false positives recorded; baseline provenance and exceptions reviewable; factual and state-conditional copy; before/after passages; no storage/privacy/method disclosure lost |
| 5 / JOURNEY | Improve quiz intro and result reading order where runtime evidence confirms friction | Reversible controls and explicit Next/review retained; owner/recipient/unknown/flat paths inspected at phone and desktop sizes, EN/ZH, keyboard and text zoom; first action and payoff easy to find; no arbitrary fold requirement or score changes |
| Later / BANK | Review reverse pairs, scenario discrimination, clarification design and pilot evidence in a versioned methodology task | Explicit versioning, coverage, compatibility and recalibration plan; neutral clarifications; no silent current-bank edits |
| Later / BRAND | Evaluate Parallax / 格局 and marks | Owner naming decision, audience/linguistic and availability checks, legibility and asset review; no automatic replacement |

## Acceptance rules shared by every implementation sprint

- Reproduce the selected problem on the actual current base before editing. Record what would reverse the decision.
- Keep scoring, payload formats and administered wording stable unless the selected task explicitly authorizes a justified blocker fix.
- Run `npm run lint`, `npm run test`, and `npm run build`; stop and report if any fail, per AGENTS.md. Add typecheck and relevant existing browser configurations when those gates pass. Never update screenshots just to hide an unexpected result.
- Preserve complete fixtures. Claude's omitted-file failures cannot be treated as passes. Record exact command, revision, environment, result, and any exclusions.
- Use current CI scripts. `copy:ratchet` is not installed on the recovered base; require it only after its reviewed implementation exists.
- Maintain before/after passages for prose, and browser evidence for visual changes. Tests alone do not establish editorial quality or human validity.
- At closeout, mark implemented/tested/merged/deployed/accepted separately, link evidence, and update this queue instead of appending another competing current-sprint section.

## Decisions that remain with the owner

Public name/Chinese brand; substantive instrument redesign and pilot; intentional changes to contracted public disclosure. Ordinary engineering fixes within a dispatched sprint do not need repeated approval. Merge, deployment and data collection remain separate from this recovery.
