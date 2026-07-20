# V19.1 public-copy implementation record

Date: 2026-07-18  
Status: implemented

## Decision

Public pages describe current reader-visible behavior. Release history, storage-schema names,
compatibility mechanics, retired collection contracts, and deployment controls remain in decision
records and code comments.

This editorial change does not alter scoring, IDs, result payloads, local storage, analytics event
or property allowlists, source ledgers, Current Case routes, or sharing behavior.

## Technical record retained outside public copy

- Research submit, event, and deletion endpoints remain body-blind tombstones. Environment changes
  cannot activate research collection. The full threat model and control rationale remain in
  [V19 privacy red-team response](./V19-privacy-red-team-response.md) and
  [V19 privacy red team](./v19-privacy-red-team.md).
- Foundation, Focus Area, AI, Perspective Run, Profile, and Current Case histories remain local to
  the browser unless the reader deliberately shares data.
- Product analytics still use the closed event/property allowlist, coarse categories, local
  opt-out, and excluded answer/profile/free-text fields documented in the privacy decisions.
- ProfileStore v4 still reads and migrates v1, v2, and v3 records. Profile Share V2 can carry AI and
  Perspective Run data, while the decoder continues to read Profile Share V1 and existing
  Foundation links.
- The retired answer-bearing Current Case challenge remains a `410` tombstone. Ordinary case
  invitations remain answer-free.
- The public Methods page no longer carries the v0.1–v0.4 product history, Phase labels, or beta
  heading. Those removals change presentation only; the repository history remains authoritative.

## Copy enforcement

Hard failures cover public release language, leaked implementation details, hard-coded stale
question counts, and banned contrastive templates. Advisory terms such as `pressure-test`, broad
metaphors, and abstract filler emit test diagnostics so editors can assess legitimate domain uses.

The exact `rather than` allowlist in `tests/atlas-copy-guardrails.test.mts` is limited to World Stage
sentences that distinguish legal status, alliance form, or the evidence basis for a coding choice.

