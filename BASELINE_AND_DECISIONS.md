# V23.5 Baseline and Owner Decisions

Status: binding release record
Release: V23.5 Trust and Legibility
Last verified: 2026-08-24 14:23 CST

## Purpose

This file records the code and deployment lineage that V23.5 may build on. It also records owner decisions that implementation agents must not reopen without a written reason. It is a checkpoint, not a substitute for fresh Git and deployment checks.

## Authority

Apply repository instructions in this order:

1. `AGENTS.md` for trust, methodology, compatibility, and engineering guardrails.
2. `PRODUCT.md` for purpose, audience, and product boundaries.
3. `CONSTITUTION` for shared editorial and anti-slop principles.
4. `DESIGN.md` for this repository's Astrolabe visual implementation. It overrides only shared font, palette, token, and composition defaults.
5. `docs/roadmap/V23_5_V26_MASTER_ROADMAP.md` for release sequence, gates, and status.
6. The active task contract.
7. Tests and verified runtime behavior.

If two authorities conflict outside the narrow override granted to `DESIGN.md`, stop and return the conflict to the owner. Do not choose silently.

## Verified repository lineage

| Fact | Verified value |
| --- | --- |
| Accepted release lineage | V23.4 |
| Accepted code SHA | `a80fe4d02d818ae546672d15f64aa596a25b1ceb` |
| Commit subject | `Merge pull request #36 from yippy141/v23-4-domain-authoring-contract` |
| Merge parent 1 | `a76f97da302c12375c93672ad6076ef79fa8d830` |
| Merge parent 2 | `708713a57c3a7b1dd86bd84636920780875a2db8` |
| Accepted tree | `cd8f330bca536710a577092fbe91a2a591a45660` |
| V23.4 branch tree | `cd8f330bca536710a577092fbe91a2a591a45660` |
| Local branch at verification | `codex/v23-5-trust-legibility` |
| Upstream main at verification | `a80fe4d02d818ae546672d15f64aa596a25b1ceb` |
| Worktree at latest verification | Dirty with intentional uncommitted V23.5 implementation and canonical documentation |

The merge commit contains both the previous `main` lineage and the V23.4 branch. Its tree is byte-identical to the V23.4 branch tree. The earlier report that V23.4 was unmerged resulted from a stale local clone.

## Verified deployment

| Fact | Verified value |
| --- | --- |
| Vercel project | `ir-worldview-app` |
| Deployment ID | `dpl_GQDHf5DJKEgcXWwfHsyovHnZKvBa` |
| Deployment source | GitHub `main` |
| Deployment commit | `a80fe4d02d818ae546672d15f64aa596a25b1ceb` |
| Production alias | `https://irworldview.jhyip.com` |

The production build log records `Commit: a80fe4d`. Local `main`, `origin/main`, and production therefore identify the same accepted lineage at this checkpoint.

The latest Vercel check at 2026-08-24 14:23 CST still identified deployment `dpl_GQDHf5DJKEgcXWwfHsyovHnZKvBa` as the Ready production deployment and its build log still identified commit `a80fe4d`. The current implementation branch is intentionally ahead only in its working tree. Those changes are not an accepted release until the final diff and gates pass.

## Baseline gate evidence

All commands below passed on the reconciled baseline before V23.5 product changes:

| Check | Result |
| --- | --- |
| `npm run typecheck` | Pass |
| `npm run validate` | Pass, no blocking measurement failures |
| `npm run copy:audit:strict` | Pass, 0 blockers and 623 advisory signals |
| `npm run lint` | Pass |
| `npm run test` | Pass, 573 of 573 tests |
| `npm run build` | Pass, 150 generated routes |

The full test run took about 26 minutes because evidence reproduction tests are intentionally expensive. A passing baseline does not prove usability, visual correctness, accessibility conformance, or human comprehension.

## Verified feature and data boundaries

- Foundation cohort aggregation is controlled by `TIER1_AGGREGATES_ENABLED` and is off unless its value is exactly `true`.
- A database URL alone cannot enable cohort collection.
- Beta navigation is separately controlled by `V22_5_BETA_NAV_ENABLED`.
- The beta participation URL must be a credential-free HTTPS URL.
- Mapbox uses `NEXT_PUBLIC_MAPBOX_TOKEN`; a missing token leaves the local SVG fallback available.
- Current AI Governance content is bank v3. A future bank must be additive v4.
- Legacy Foundation, Security, Technology, AI, Perspective, Profile, and share payloads remain compatibility obligations.
- The reconciled baseline contains no authorized public percentile, prevalence, rarity, or population-ranking claim.

Deployment environment values were not inferred from source code. Each deployment task must verify the effective production configuration separately.

## Locked owner decisions

- The next release is **V23.5 Trust and Legibility**.
- Keep the current Astrolabe navy and brass identity.
- Preserve cohort infrastructure, tests, exact tuple matching, and minimum sample rules. Keep all cohort comparisons hidden.
- When no reviewed Current Case is live, promote Foundation and relabel the case destination as **Recent Cases**.
- Focus Area questionnaires show one case at a time.
- Any AI and Foundation comparison is an unscored research reflection only.
- Ban em dashes in authored English product prose. Exempt Chinese typography, quotations, proper names, and machine separators.
- The portfolio operating system belongs in a private control repository, not the public portfolio repository.
- Pilot DeepSeek through Cline only on public, non-sensitive work.
- No light theme is in scope.
- No new dependency is authorized for V23.5.
- V23.5 changes no scorer, bank, result payload, or share-link format.
- AI v4 is English-only until independently authored and tested.
- The owner remains final product and methodology authority.

## Facts, hypotheses, and open questions

### Facts

- Production, local `main`, and `origin/main` were reconciled to the exact V23.4 merge SHA above.
- AI Governance bank v3 already exists.
- Result payloads and ProfileStore snapshots do not provide a contract for retrieving exact completed item answers.
- Runtime-composed paragraphs exist and must be reviewed as rendered wholes.
- Tier 1 cohort statistics can describe real matching cohorts only when enabled and sufficiently populated.

### Hypotheses to test

- Foundation is the clearest stable first path for new visitors.
- One-case pagination will reduce mobile fatigue without changing responses or scorer input.
- A four-chapter Method page will improve reference lookup without removing substantive content.
- Instrument-subject sentences and duplicate block jobs are useful review routers for weak runtime copy.
- A research-only paired reflection can prompt useful comparison without being read as a consistency test.

### Open questions

- Which V23.5 issues recur in moderated sessions after the trust hotfixes?
- Which AI v3 axes survive ownership, discriminant, valence, and knowledge-load review?
- Can a paired reflection avoid implying match, mismatch, consistency, or moral evaluation?
- Does the current Mapbox path initialize on any entry route when its token is absent?
- Which component interfaces have three proven consumers before shared-kit extraction is reconsidered?

## Fresh verification commands

Run these before every implementation dispatch:

```bash
git status --short --branch
git rev-parse HEAD
git rev-parse origin/main
git log -1 --format='%H %P %s'
git diff --check
```

Use Vercel project metadata or build logs to retrieve the production deployment SHA. Do not infer a commit from visible copy.

For an integration checkpoint, run:

```bash
npm run typecheck
npm run validate
npm run copy:audit:strict
npm run lint
npm run test
npm run build
```

## Change rule

Update this file only when a fact is freshly reproduced or the owner records a new decision. Add a timestamp and evidence path for deployment changes. Do not rewrite a hypothesis as a fact after a code-only check.
