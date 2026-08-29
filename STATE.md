# STATE

Updated: 2026-08-29
Role: concise memory aid, never sole authority

## Current repository head

- Branch under review: `main`
- Main SHA: `e1728b30478cb666cb26082a1cf07f0da8290462`
- Commit subject: `Merge pull request #45 from yippy141/integration/v23-5-1`
- Merge parents: `adf2181ea09413591b3b16a6fc44f908005f7021` and `a52fd862437f9b392ea9e0cd35b92f804981bf1a`
- Tree: `1c69f9f48b74ce021c9514521ddeccb6d6b90e14`
- Commits ahead of the last accepted V23.4 SHA: 54
- `origin/main` matched local `main` at this verification.

## PR #45 integration

PR #45 merged the `integration/v23-5-1` branch into `main` on 2026-08-29. That
branch carried the seven partitioned V23.5 commits plus the reconciled
integration merge of `codex/v23-5-trust-legibility-prs`. The V23.5 candidate is
therefore no longer a side branch. It is the content of `main`.

Merging to `main` records integration, not acceptance. The human and evidence
gates listed under release status remain open.

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
  `a80fe4d`, recorded 2026-08-24. That record predates PR #45 and must not be
  treated as current.
- Do not infer the production SHA from `main`, from this file, or from visible
  copy. Retrieve it from the Vercel deployment record or build log.

## Release status

- V23.5 Trust and Legibility is integrated into `main` and not accepted.
- The pending gates are runtime-copy editorial approval, deterministic evidence
  reproduction, manual visual review, and human research sessions.
- No deployment is authorized by this file.

## Active branch

- `v23-6-visual-authorship-study`, a bounded non-shipping visual-authorship
  study. It adds development-only prototype routes that fail closed in
  production. It changes no item bank, scorer, calibration, archetype
  resolution, payload format, Profile storage contract, bridge publication
  status, feature flag, dependency, or approved Chinese copy.

## Current owner outcome

Ship **V23.5 Trust and Legibility** before any new scored module. Protect user
work, correct Current Case availability, repair mobile and accessibility
defects, simplify the information hierarchy, and review runtime-composed copy
without changing scoring or payload contracts.

## Known divergence since the accepted SHA

- The V23.5 implementation is now on `main` rather than on a candidate branch.
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
- Add no V23.5 dependency and change no scorer, bank, payload, or share format.
- Start AI v4 only after the V23.5 human-evidence gate.

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
- Which root direction does the owner choose after the V23.6 visual-authorship study?

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
npm run evidence:audit:check
npm run copy:render:runtime
npm run build
npm run test:e2e
```

Retrieve the production SHA from the current Vercel deployment record or build log. Never infer it from this file or from visible copy.

## Canonical detail

- Baseline and decisions: `BASELINE_AND_DECISIONS.md`
- Visual authority: `DESIGN.md`
- Master sequence: `docs/roadmap/V23_5_V26_MASTER_ROADMAP.md`
- Active implementation contracts: `docs/roadmap/V23_5_IMPLEMENTATION_PROMPT_PACK.md`
- Release checks: `docs/roadmap/RELEASE_TEST_MATRIX.md`
- Runtime-copy review: `docs/editorial/V23_5_RUNTIME_COPY_REVIEW_LEDGER.md`
- Operator steps: `docs/roadmap/OPERATOR_RUNBOOK.md`
