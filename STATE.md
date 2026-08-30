# STATE

Updated: 2026-08-31
Role: concise memory aid, never sole authority

Product status: the V23.5-to-V26 execution sequence is paused pending a
product-re-foundation decision. Read
`docs/roadmap/POST_V23_6_PRODUCT_RESET_STATUS.md` first.

## Current repository head

- `origin/main`: `6ae4ddbfb9dc6bd40b617f05cd03efa6a51ef80c`
- Subject: `Merge pull request #48 from yippy141/v23-6-production-conversion`
- Merge parents: `68806043ea83fad425f0db8f3507704a4aad3f7d` (PR #47 evidence
  baseline) and `f873a0a46e3f44dfff94b0071cffe4bb9ce6c0bc` (V23.6 branch head)
- Tree: `3ce17323b17886af682276dcba02db47bdc7ac02`
- Commits ahead of the last accepted V23.4 SHA: 63
- Verified 2026-08-31. Recheck `origin/main` before any dispatch; this record is
  not permission to overwrite newer work.

## PR #48 V23.6 production conversion

PR #48 merged `v23-6-production-conversion` into `main` at 2026-08-30T16:36:13Z
as merge commit `6ae4ddb`. V23.6 is on `main`.

Four states must not be collapsed:

- **Merged:** yes, merge commit `6ae4ddb`.
- **Deployed:** unknown. See the production deployment section below.
- **Owner-accepted as a release:** no. No acceptance record exists.
- **Validated with human evidence:** no. No participant research has been run.

Merging records integration only. It is not acceptance, deployment, or
validation.

## PR #47 evidence baseline

PR #47 merged `v23-6-evidence-baseline` into `main`. It preserves the accepted
Foundation robustness diagnostic and protected-file digests without changing
public runtime behavior. That merge is the first parent of the PR #48 merge and
was the exact base of the V23.6 production branch.

## Last accepted release lineage

- Accepted lineage: V23.4
- Accepted code SHA: `a80fe4d02d818ae546672d15f64aa596a25b1ceb`
- That SHA remains the last lineage the owner accepted. Nothing in this file
  promotes PR #45 to an accepted release.

## Production deployment

- Production SHA: **not verified**
- Reason: this working environment has no Vercel CLI, no Vercel API credential,
  and no build log for the current deployment. The production alias
  `https://irworldview.jhyip.com` answers 200 and exposes no commit identifier
  in its headers or markup.
- Last recorded deployment: `dpl_GQDHf5DJKEgcXWwfHsyovHnZKvBa` at commit
  `a80fe4d`, recorded 2026-08-24. That record predates PR #45, PR #47, and
  PR #48, and must not be treated as current.
- Do not infer the production SHA from `main`, from this file, or from visible
  copy. Retrieve it from the Vercel deployment record or build log.

## Release status

- V23.5 Trust and Legibility, the V23.6 evidence baseline, and the V23.6
  production conversion are all merged into `main`. None is promoted to an
  accepted release by this file.
- Pending gates include owner review of bilingual copy and visual evidence,
  deterministic evidence reproduction, full CI, and human research sessions.
- No deployment is authorized by this file.
- No new product implementation is authorized until a product-re-foundation
  decision is approved. See
  `docs/roadmap/POST_V23_6_PRODUCT_RESET_STATUS.md`.

## Current evidence work

- PR #47, `v23-6-evidence-baseline`, is merged into the verified base. It
  preserves a deterministic structural-sensitivity diagnostic and its accepted
  artifacts without changing public runtime behavior.
- The evidence makes no reliability, validity, prevalence, or population claim.
  Its synthetic ensembles are authored mechanical probes, and its descriptive
  bins are not pass/fail thresholds.
- This work does not accept or deploy V23.6 and does not authorize a bank,
  scorer, calibration, archetype, payload, or share-format change.

## Separate PR #46

- PR #46, `v23-6-visual-authorship-study`, was **closed without merging**. It is
  not contained by `main`. Its study ref is
  `e2a74c25c029bd5eda6d027d3679705586e54dd2`, preserved on
  `origin/v23-6-visual-authorship-study`.
- It is a bounded, non-shipping visual-authorship study with development-only
  prototype routes. It is preserved as a design study and is not current
  production authority.

## Current owner outcome

Review **V23.6 Production Conversion** as one compatibility-preserving
candidate. It moves the existing map experience to World Stage, establishes the
five-destination root, improves Foundation explanation and local evidence, and
keeps separate Profile records without changing scoring or payload contracts.

## Known divergence since the accepted SHA

- The V23.5 implementation and V23.6 evidence baseline are now on `main`.
  Current Case availability, destructive confirmations, keyed Focus Area drafts,
  one-question flow, accessibility and responsive repairs, homepage and module
  information architecture, Method and result hierarchy, and runtime-copy
  fixtures are all present there.
- The exact changed paths and current behavior must be verified from Git and
  runtime evidence before dispatch, review, or handoff.
- The Claude V24 review package is preserved at
  `docs/archive/2026-08-21-claude-v24-review/` for provenance but is superseded
  and non-executable.
- The private studio scaffold exists at
  `/Users/jinhuayip/Developer/jinhua-studio-control`. It is initialized locally,
  uncommitted, and has no remote. It is not yet an operating control plane.

## Locked decisions

- Keep the Astrolabe navy and brass design.
- Keep real-cohort infrastructure disabled and absent from public UI.
- Promote Foundation when no reviewed Current Case is live.
- Use one case at a time in Focus Area questionnaires.
- Treat AI and Foundation comparison as unscored research reflection only.
- Ban em dashes in authored English product prose, with the recorded exemptions.
- Add no V23.6 package dependency and change no scorer, bank, calibration,
  payload codec, stable ID, legacy decoder, or share format.
- Use Spectral for editorial roles and Libre Franklin for interface roles,
  bundled locally under their open licences.
- Keep the production root free of Mapbox and preserve the full map at
  `/world-stage`.
- AI v4 is not authorized. It was previously gated on the V23.5 human-evidence
  gate; it is now additionally blocked pending the product-re-foundation
  decision.

## Hypotheses

- Foundation is the best stable first path.
- One-case pagination improves mobile endurance without changing scorer input.
- Declared paragraph jobs and runtime fixtures will reduce repetitive, empty prose.
- The paired-reflection concept may still be read as a consistency judgment and requires research.

## Open questions

- Which V23.5 findings recur across two independent moderated sessions?
- Which AI v3 constructs belong to AI rather than Security or Technology?
- Can the verified tokenless Mapbox no-initialization boundary be turned into a durable CI network assertion?
- Which pending runtime-copy rows require revision after named human review in their complete surface context?
- Does merged V23.6 pass owner review of the bilingual copy, result explanation,
  print report, and evidence package? Merging did not settle this.
- What are the product's name, public information architecture, and first-use
  experience? This is the single next decision.

## Reproduce machine facts first

```bash
git status --short --branch
git rev-parse HEAD
git rev-parse origin/main
git log -1 --format='%H %P %s'
npm run typecheck
npm run validate
npm run copy:audit:strict
npm run lint
npm run test
npm run diagnose:foundation-robustness
npm run diagnose:foundation-robustness:check
npm run evidence:audit:check
npm run copy:render:runtime
npm run build
npm run test:e2e
```

Retrieve the production SHA from the current Vercel deployment record or build log. Never infer it from this file or from visible copy.

## Canonical detail

- Baseline and decisions: `BASELINE_AND_DECISIONS.md`
- Visual authority: `DESIGN.md`
- Current status and roadmap pause: `docs/roadmap/POST_V23_6_PRODUCT_RESET_STATUS.md`
- Master sequence, paused and historical: `docs/roadmap/V23_5_V26_MASTER_ROADMAP.md`
- Active implementation contracts: `docs/roadmap/V23_5_IMPLEMENTATION_PROMPT_PACK.md`
- Release checks: `docs/roadmap/RELEASE_TEST_MATRIX.md`
- Runtime-copy review: `docs/editorial/V23_5_RUNTIME_COPY_REVIEW_LEDGER.md`
- Operator steps: `docs/roadmap/OPERATOR_RUNBOOK.md`
