# V23.5 Baseline and Owner Decisions

Status: binding release record
Release: V23.5 Trust and Legibility
Last repository checkpoint: 2026-08-29

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
| Current `main` SHA | `e1728b30478cb666cb26082a1cf07f0da8290462` |
| Commit subject | `Merge pull request #45 from yippy141/integration/v23-5-1` |
| Merge parent 1 | `adf2181ea09413591b3b16a6fc44f908005f7021` |
| Merge parent 2 | `a52fd862437f9b392ea9e0cd35b92f804981bf1a` |
| Current `main` tree | `1c69f9f48b74ce021c9514521ddeccb6d6b90e14` |
| `origin/main` at verification | `e1728b30478cb666cb26082a1cf07f0da8290462` |
| Commits ahead of the accepted V23.4 SHA | 54 |
| Last accepted release lineage | V23.4 |
| Accepted code SHA | `a80fe4d02d818ae546672d15f64aa596a25b1ceb` |
| Accepted commit subject | `Merge pull request #36 from yippy141/v23-4-domain-authoring-contract` |
| Accepted tree | `cd8f330bca536710a577092fbe91a2a591a45660` |
| Active branch | `v23-6-visual-authorship-study` |

PR #45 merged `integration/v23-5-1` into `main` on 2026-08-29. That branch
carried the seven partitioned V23.5 commits together with the reconciled
integration merge of `codex/v23-5-trust-legibility-prs`. The V23.5 candidate is
now the content of `main` rather than a separate branch, and the earlier
candidate SHA `77ce296619ab3287f8656667b77363488e617c97` is superseded.

Merging to `main` records integration only. V23.4 remains the last lineage the
owner accepted. Nothing here promotes PR #45 to an accepted release.

The V23.4 merge commit contains both the previous `main` lineage and the V23.4
branch. Its tree is byte-identical to the V23.4 branch tree. The earlier report
that V23.4 was unmerged resulted from a stale local clone.

## Deployment

| Fact | Value |
| --- | --- |
| Vercel project | `ir-worldview-app` |
| Production alias | `https://irworldview.jhyip.com` |
| Current production SHA | **not verified** |
| Last recorded deployment | `dpl_GQDHf5DJKEgcXWwfHsyovHnZKvBa` at commit `a80fe4d`, recorded 2026-08-24 |

The current production SHA could not be verified at this checkpoint. The
working environment used for the 2026-08-29 verification has no Vercel CLI, no
Vercel API credential, and no build log for the live deployment. The production
alias answers 200 and exposes no commit identifier in its response headers or
markup.

The last recorded deployment predates PR #45. Do not treat it as the current
production deployment, and do not infer production from `main` or from visible
copy. Retrieve the SHA from the Vercel deployment record or build log before any
release claim.

## Baseline gate evidence

All commands below passed on the reconciled V23.4 baseline before V23.5
product changes. They are historical evidence for that SHA, not a checkpoint for
current `main`:

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

- Local `main` and `origin/main` matched at `e1728b3` on 2026-08-29. The production SHA was not verified at that check, so the three are not known to be reconciled.
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
