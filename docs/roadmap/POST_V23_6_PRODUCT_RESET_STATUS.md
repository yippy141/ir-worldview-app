# Post-V23.6 Product Reset Status

Status: current repository and roadmap authority
Owner: Jinhua Yip
Verified: 2026-08-31

This file records what is true after PR #48 merged, and it pauses the
V23.5-to-V26 execution sequence pending a product re-foundation decision. It
does not make that decision.

## 1. Verified repository status

| Fact | Verified value |
| --- | --- |
| Repository | `yippy141/ir-worldview-app` |
| `origin/main` SHA | `6ae4ddbfb9dc6bd40b617f05cd03efa6a51ef80c` |
| Commit subject | `Merge pull request #48 from yippy141/v23-6-production-conversion` |
| Merge parent 1 | `68806043ea83fad425f0db8f3507704a4aad3f7d` (PR #47 evidence baseline) |
| Merge parent 2 | `f873a0a46e3f44dfff94b0071cffe4bb9ce6c0bc` (V23.6 branch head) |
| `origin/main` tree | `3ce17323b17886af682276dcba02db47bdc7ac02` |
| Commit time | 2026-08-30T16:36:13Z |
| Commits ahead of accepted V23.4 SHA `a80fe4d` | 63 |
| PR #48 | **Merged** into `main` at 2026-08-30T16:36:13Z, merge commit `6ae4ddb` |
| PR #46 | **Closed without merging**; study ref `e2a74c25c029bd5eda6d027d3679705586e54dd2` |

The PR #48 body records head `142c371f9ce0091ce5365e70a9c39d35fc05a548`. The
actual merged second parent is `f873a0a`, one later commit, `Fix V23.6 tablet
diptych overflow`. Cite `f873a0a` as the merged head.

### Four states that must not be collapsed

| State | V23.6 status | Evidence |
| --- | --- | --- |
| Merged into `main` | **Yes** | Merge commit `6ae4ddb`, PR #48 merged 2026-08-30 |
| Deployed to production | **Unknown** | Not verifiable here; see section 2 |
| Owner-accepted as a release | **No** | No owner acceptance record exists for V23.6 |
| Validated with human evidence | **No** | No participant research has been run |

Merging records integration. It is not acceptance, deployment, or validation.

## 2. Verified deployment status

| Fact | Value |
| --- | --- |
| Vercel project | `ir-worldview-app` |
| Production alias | `https://irworldview.jhyip.com` |
| Current production SHA | **unknown** |

Reason, recorded exactly: the 2026-08-31 verification environment has no Vercel
CLI installed, no `.vercel` project metadata and no `vercel.json` in the
repository, and no Vercel API credential or build log. No checked-in release
artifact binds a current production deployment ID to a commit.

The most recent checked-in binding is deployment `dpl_GQDHf5DJKEgcXWwfHsyovHnZKvBa`
at commit `a80fe4d`, recorded 2026-08-24. That record predates PR #45, PR #47,
and PR #48, so it cannot establish current production.

Production was not inferred from `main`, from page copy, or from the site
resembling PR #48. Retrieve the SHA from the Vercel deployment record or build
log before any release, rollback, or acceptance claim.

## 3. What V23.6 actually changed

- Replaced the production root with the five-destination editorial menu and a
  checked-in geographic globe, and moved the existing full Mapbox experience
  intact to `/world-stage`.
- Bundled Spectral and Libre Franklin locally under the OFL with
  Chinese-compatible fallbacks and no typography package.
- Rebuilt the Foundation result as a payoff-first scroll-led report with
  calibrated primary-versus-runner contribution math.
- Added versioned local-only decisive-choice evidence bound to the exact
  completed result tuple, with fail-closed mismatch states and deletion support.
- Reorganized Profile around the five locked questions, published the Foundation
  robustness diagnostic and posture audit, and added Simplified Chinese root,
  result, and Profile parity.

## 4. What V23.6 deliberately did not change

Verified empty diff across `6880604..6ae4ddb` for issued item banks, scorers,
calibrations, result payloads, payload codecs, share-link formats, stable IDs,
and legacy decoders. No package dependency, database behavior, analytics
activation, research collection, or public payload field was added. The
privacy posture is unchanged: no answer or evidence record is sent to a server.

## 5. Why the old roadmap is paused

`docs/roadmap/V23_5_V26_MASTER_ROADMAP.md` sequenced V23.5, then human evidence,
then AI v4, then Economic Statecraft, then Energy Transition. That sequence
assumed the current product framing was settled and that the next question was
which scored module to build next.

The owner is pausing that assumption before a product re-foundation. The
roadmap is retained in full as a historical record of decisions, gates, and
release boundaries. It is no longer the executable sequence for new work.

## 6. Current product concerns supplied by the owner

The old execution roadmap is paused ahead of a product re-foundation. The
concerns below are separated into the one decision to take now and the concerns
recorded for later sequencing.

### A. The single immediate product-re-foundation decision

1. **Product name.**
2. **Public information architecture.**
3. **First-use experience.**

### B. Active concerns recorded for later sequencing

These do not authorize implementation yet.

- World Stage currently behaves like a redundant second homepage rather than a
  clearly purposeful map or case surface.
- Futures is substantive editorial work but is too difficult to discover.
- The Foundation result and Profile remain over-explained, visually repetitive,
  and insufficiently authored.
- AI Governance has not received equivalent construct, scoring, naming, result,
  and content scrutiny.
- U.S.-specific external-validation items remain inside the ordinary extended
  Foundation journey.
- Typography and page grammar remain inconsistent across older and newer
  surfaces.
- Production deployment, Neon configuration, aggregate collection, analytics,
  and raw research-intake status need an operational verification after the
  product architecture is settled.

These concerns are recorded so they are not lost. They are not implementation
authorization. The immediate decision remains the product name, public
information architecture, and first-use experience.

## 7. Frozen assets worth preserving

- `docs/research/v23-6-foundation-robustness/`, the deterministic structural
  sensitivity diagnostic and posture audit. It supports structural-sensitivity
  statements only and makes no reliability, validity, or population claim.
- `docs/evidence/v23-6-production-conversion/`, the reviewed release evidence:
  screenshots, three-page print PDF, clean-root HARs, accessibility and
  read-order notes, and raw, gzip, Brotli, and browser-transfer measurements.
- PR #46, `v23-6-visual-authorship-study`, preserved on
  `origin/v23-6-visual-authorship-study` as a **non-shipping design study**. It
  is closed, never merged, and is not current production authority.
- The compatibility and privacy locks recorded in `BASELINE_AND_DECISIONS.md`.

## 8. Prohibited work before the new decision

No new product implementation is authorized until a product-re-foundation
decision is approved and recorded. Specifically, do not begin:

- AI v4 or any AI bank change;
- Economic Statecraft;
- Energy Transition;
- human participant recruitment or research sessions;
- another visual or typography pass;
- any scorer, bank, calibration, payload, codec, share-format, stable-ID, or
  legacy-decoder change;
- any dependency, environment-variable, analytics, or database change.

Documentation truth, evidence preservation, and the product-re-foundation
decision itself are the only authorized work.

## 9. The single next decision

One decision, taken by the owner, before any implementation resumes:

1. **Product name.**
2. **Public information architecture.**
3. **First-use experience.**

This file does not solve any of the three. Record the decision in a new
authority document, then re-derive an execution sequence from it.

## Appendix: status-claim classification

Sweep of the listed contradiction phrases across `origin/main` on 2026-08-31.

### Active authority, corrected in this patch

| Location | Claim | Correction |
| --- | --- | --- |
| `STATE.md` | "The V23.6 production candidate remains unmerged, unaccepted, and undeployed" | Merged; acceptance and deployment stated separately |
| `STATE.md` | Current repository head recorded as candidate branch on base `6880604` | Now `origin/main` `6ae4ddb` with parentage |
| `STATE.md` | "`v23-6-production-conversion` is a review candidate only" | Merged via PR #48 |
| `STATE.md` | PR #46 described without its closed state | Recorded as closed, non-shipping |
| `STATE.md` | "Start AI v4 only after the V23.5 human-evidence gate" | AI v4 unauthorized pending re-foundation |
| `BASELINE_AND_DECISIONS.md` | Header "V23.6 Production Conversion candidate" | Merged lineage |
| `BASELINE_AND_DECISIONS.md` | Lineage table current `main` `6880604` | Now `6ae4ddb` |
| `BASELINE_AND_DECISIONS.md` | "Production candidate `v23-6-production-conversion`" | Merged via PR #48 |
| `BASELINE_AND_DECISIONS.md` | "The release candidate under review is V23.6 Production Conversion" | Merged; acceptance still open |
| `BASELINE_AND_DECISIONS.md` | Fact "Local `main` and `origin/main` matched at `6880604`" | Superseded by 2026-08-31 verification |
| `V23_5_V26_MASTER_ROADMAP.md` | "Status: sole executable product roadmap" | Paused and superseded for new work |

### Accurate historical record, left intact

- `BASELINE_AND_DECISIONS.md` PR #45 and PR #47 paragraphs. Both correctly
  describe what those merges did at the time and correctly state that PR #47 did
  not accept or deploy V23.6.
- `BASELINE_AND_DECISIONS.md` baseline gate evidence table, already labeled
  historical evidence for the V23.4 SHA.
- `docs/evidence/v23-6-production-conversion/RELEASE_INDEX.md` and its README.
  These are the release evidence contract as reviewed, correctly scoped to the
  candidate at review time. Preserved verbatim.
- `docs/editorial/V23_6_ROOT_RESULT_COPY_LEDGER.md` "Implemented, owner review".
  Still accurate: implemented and merged, editorial approval still pending.
- `docs/roadmap/RELEASE_TEST_MATRIX.md` production baseline
  `dpl_GQDHf5DJKEgcXWwfHsyovHnZKvBa`. Accurate as the last recorded baseline.
- `BASELINE_AND_DECISIONS.md` note that the earlier unmerged V23.4 report came
  from a stale local clone.

### Archived material, deliberately untouched

- `docs/archive/2026-08-21-claude-v24-review/` in full, including the stale
  V23.4 unmerged report. Already marked superseded and non-executable.
- `docs/v22/V22_TIER1_NEON_STAGING_EVIDENCE_2026-08-05.md` and
  `docs/decisions/v22-tier1-activation.md`, including deployment
  `dpl_5UoegHRLPxZ3gYmQPT4Cqfns4svc`.
- `artifacts/screenshots/v23-5-production-baseline/README.md`.
- All V23.5-to-V26 roadmap body sections beyond the status header. Retained as
  the historical record of gates and boundaries.

### Repository hygiene finding, not corrected here

At verification time the local `main` branch in the primary checkout pointed at
`e2a74c2`, the head of closed PR #46, and could not fast-forward to
`origin/main`. No commit is at risk: those commits are preserved on
`origin/v23-6-visual-authorship-study`. This branch was created from
`origin/main` directly and left the local pointer untouched. The owner should
reconcile it before the next dispatch.
