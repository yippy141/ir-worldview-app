# Security bank v5 public-beta release decision

Decision ID: `security-v5-public-beta-2026-08-21`

Decision status: **public-beta approved once the exact-head automated gates in
this record pass**

Decision date: 2026-08-21

Review due: 2026-11-21T00:00:00Z

## Historical status and supersession

The Security v4 design contract, source ledger, and item review originally and
correctly said `HOLD`, `non-shipping`, and `NO-GO`. They are not rewritten into
a shipping approval. Bank v4 remains a frozen historical bank for exact payload
replay. Bank v5 supersedes v4 only for new completions.

## Approved current tuple

| Contract field | Approved value |
|---|---|
| Module manifest schema | 1 |
| Manifest version | 2 |
| Manifest origin | `derived-legacy-adapter` |
| Release state | `public-beta` |
| Question bank | 5 |
| Scorer | 2 |
| Calibration ID | `v23.4-security-bank5-technology-bank3-scorer2-uniform-primary-2026-08-21` |
| Calibration SHA-256 | `97bf80cbd1cb4af2c202e1b70efbd25ec7b262e88250c6558cd80f090442e9be` |
| Result-copy version | 2 |
| Bank SHA-256 | `2fe8fadc4ab0189b4a5a57d36e0351e7f7cdc0dc1845114b6a12988b85fe383b` |
| Balance-ledger SHA-256 | `2733efb6698e906012daf8bd41550a1db4fe00d6a451cf7d8df9ae3e990fafd9` |

Scorer v2 is retained because the scoring algorithm, weights, actor-lens
exclusion, aggregation, rounding, and classification ordering do not change.
Every main-scored v4 item ID, option ID, and signal is unchanged in v5. A fresh
tuple-specific calibration run therefore reproduces the v4 numeric cuts; the
v5 tuple and calibration checksum are nevertheless separately registered and
gated.

## Exact evidence and review records

Source/provenance records:

- `docs/v23/security/V23_3_SECURITY_V5_SOURCE_LEDGER.md`;
- `docs/v23/security/V23_3_SECURITY_V5_ACTOR_BALANCE_LEDGER.csv`;
- frozen source register `docs/v23/security/V23_3_SECURITY_SOURCE_LEDGER.md`
  for exact source descriptions and URLs only, never as release approval.

Review/decision records:

- `docs/v23/security/V23_3_SECURITY_V5_ITEM_REVIEW.md`;
- this structured owner decision;
- automated validators `validate:security-v4`, `validate:security-v5`,
  `calibrate:modules -- --check`, and `diagnose:security-v5`.

The historical v4 `HOLD` documents are negative controls. Their existence or
their hook IDs do not constitute approval.

## Source and provenance blockers closed in v5

- The blocked Tehran lens is replaced without `I11` or `I13`.
- No v5 setup claim uses the likely-match `T04`, archive-pending `T06` or `U07`,
  mutable unsnapshotted `I04`, or unresolved Iranian half of `I07`.
- The Tehran scene explicitly does not close Hormuz or another strait and does
  not attribute an attack to Tehran.
- Every non-hypothetical setup binding resolves to an exact usable source ID in
  the approved ledger; every invented condition is visible on the card as a
  scenario assumption.
- The v5 bank, balance ledger, source allowlist, and specialist-term bindings
  are checksum- and regression-gated.

## Deferred gates and owner decision

The following remain unperformed: regional and country SME review; legal
review; bilingual review; cognitive interviews; blinded social-desirability
review; timing and comprehension testing; pilot data collection; reliability
analysis; item-behavior analysis on respondents; representative sampling; and
cross-cultural-equivalence testing.

The owner explicitly allows Security bank v5 to run as a **public beta** despite
those deferred human gates, provided every exact-head automated gate in PR #36
passes. This is a bounded editorial release decision, not a finding that the
deferred gates passed.

No validity, reliability, representativeness, population-percentile,
cross-cultural-equivalence, legal-endorsement, policy-endorsement, or actor-
endorsement claim is made. Tier 1 remains off.

## Rollback

Rollback sets new completions to the frozen tuple below while preserving all
issued v3, v4, and v5 links through their registered decoders:

| Field | Rollback value |
|---|---|
| Question bank | 4 |
| Scorer | 2 |
| Calibration ID | `v23.3-security-bank4-scorer2-uniform-primary-2026-08-19` |
| Result-copy version | 1 |
| Manifest version | 1 |

Rollback does not relabel v4 as approved. It is an operational compatibility
fallback while the public beta is withdrawn and the release decision is
revisited.
