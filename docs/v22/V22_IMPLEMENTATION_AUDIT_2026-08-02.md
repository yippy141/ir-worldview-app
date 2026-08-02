# V22 implementation audit and project-manager response

Prepared: 2026-08-02

Branch: `codex/v22-measurement-resolution`

Base: `6ab5704` (`origin/main`, completed V21)

Checkpoint: `checkpoint/v21-completed-20260802`

## Executive verdict

V22 identified a real and serious module measurement problem. Both shipped
modules are compressed and strongly biased toward their default result copy.
That finding is now reproducible in a deterministic diagnostic for both
Standard and Advanced mode.

The supplied AI Compass explanation is not reproducible. Advanced-mode AI
results are biased toward Democratic Guardrailist, especially through
oversight and legitimacy, but every Advanced scenario axis can move in both
directions and every final axis straddles the midpoint in the seeded runtime
results. Standard mode has a different, materially healthier distribution.
The original analysis mixed Standard and Advanced option sets and treated
omitted deltas inconsistently with the runtime scorer.

The safe V22 slice is implemented: diagnostics, reporting-only measurement
checks, removal of the explicit module `/7` denominator and AI clarity claim,
local Tier 1 privacy/failure gates, a sourced World Stage semiconductor layer,
and detailed preflight records for the item-bank and core-form work. Production
item rewrites and the core reshape are on hold because the proposed item-level
rule is not a valid construct contract and because both changes require an explicit
compatibility/versioning decision. Archetype v2 and the sigil-led result-page
redesign are also held: the former requires owner-authored names and a decision
about the existing three-state norm model, while the latter is explicitly
sequenced after final archetype semantics and supplied design assets.

Tier 1 remains off. Three of the reduced four activation gates now have local
evidence. The live staging migration, catalog inspection, and end-to-end
increment gate cannot be completed without a staging Postgres environment and
deployment authority.

## Work completed

### A. Module and AI measurement

The diagnostic now reports, separately for Standard and Advanced:

- 500 deterministic primary-only synthetic respondents;
- exact uniform-choice expectations beside the seeded results;
- exact module attainable ranges produced through the runtime scorer;
- per-card signal minima, maxima, spans, and midpoint straddles;
- module headline and lane-summary distributions;
- AI scenario extrema, exact final means, seeded final ranges,
  floor/ceiling saturation, reverse-coding ratios, and archetype
  distributions.

The validator now prints the current literal per-option span/straddle and
reverse-ratio failures without blocking the build. The proposed bank/mode
range, centering, concentration, saturation, and typed discriminating-axis
gates are not yet implemented. The existing checks remain deliberately
reporting-only until the item-axis contract is corrected and the banks are
repaired.

The result surfaces no longer append an explicit `/7` denominator to module
scores. They still use the existing 1–7 coordinate and pole labels; removing
or replacing that deeper scale contract belongs with the versioned bank
repair. Profile mini-bars now map the coordinate endpoints to 0–100%
correctly. The unvalidated AI `clarity` value has been removed, and the nearest
modeled alternative is no longer hidden behind a made-up clarity threshold.

Full evidence and caveats are in
`docs/decisions/v22-module-measurement-baseline.md`.

### B. Tier 1 activation

The activation contract is reduced to the four specified gates.

1. **Staging migration and live increment:** blocked; no staging credentials
   or configured `DATABASE_URL` were available.
2. **Exact aggregate-only writes:** locally evidenced through the real route
   handler with exact-set equality for every inserted column.
3. **Silent failure:** result-write handling is locally unit-tested for
   unavailable storage, a malformed URL, and an injected timeout; completion
   handling is tested for unavailable storage; and the browser path is tested
   for opt-out and rejected fetch. Valid aggregate writes now remain a
   client-silent `202 { ok: true }` when counter storage fails, while the server
   still logs the failure. A real Neon `AbortSignal.timeout` path remains part
   of the staging-backed gate.
4. **Server-side small-cell suppression:** locally evidenced at `n = 99`
   through the server stats reader.

No external service was provisioned, no migration was executed, and no
feature flag was enabled. The operator runbook is in
`docs/decisions/v22-tier1-activation.md`.

### C. Core-form preflight

The proposed case-led core is directionally right, but changing item tier is a
form migration, not a local presentation change. The analysis records:

- the unconstrained projection ranking;
- the six highest-separation Standard-compatible non-Likert items: four
  tradeoffs and two cases;
- a proposed 20-item order with concrete cases first and a discriminating
  tradeoff last;
- calibration effects on core and all six targeted forms;
- legacy link, draft, aggregate-cohort, and exact-form migration requirements;
- a standardized resolution-gate recommendation;
- the post-reshape stability runs that must gate presentation.

The proposed order deliberately closes on the highest-separation tradeoff, so
it is a preflight candidate rather than compliance with Prompt C's literal
case-last requirement. Final editorial ordering remains an owner decision.

The analysis is in `docs/decisions/v22-core-reshape-analysis.md`.

### A (continued). Item editorial preflight

The exact hard-ban scan found four copy hits. It also records twelve
within-bank and cross-instrument similarity candidates—some high-priority,
some likely distinct—with a substantive removal gate. No production item was
deleted or rescored before a versioned bank and a defensible item-axis contract
exist.

The audit is in `docs/decisions/v22-item-editorial-audit.md`.

### D. Archetype v2 gate

The existing stability diagnostic clears Prompt D's narrow stop condition:
the normative modifier changes for 5.8% of synthetic respondents after two
answer changes, below the specified 20% threshold. That does not make the rest
of D implementable without editorial decisions. The runtime has three norm
states, not the proposed two; the prompt reserves several replacement strings
for the owner; and the existing map projection does not use restraint, so its
plus/minus archetype pairs would occupy identical coordinates. No names,
analogue claims, scoring logic, routes, or map geometry were changed.

### E. Result page and sigils

The full redesign was not started. Prompt E requires a separate design pass,
final sigil assets, and settled archetype semantics from D. None was supplied,
and inventing culturally specific marks or owner-reserved names would create
throwaway work and an editorial-appropriation risk. The only result-page edits
in this slice are the measurement-trust corrections described in A: removing
the explicit `/7` denominator and the unvalidated AI clarity claim.

### F. World Stage integrity

The semiconductor role schema now supports the closed vocabulary `fab`,
`design`, `sme`, `materials`, `packaging`, and `eda`. The current scene
instantiates `fab`, `sme`, `materials`, and `packaging`; it does not render
empty Design or EDA filters. It adds the requested Tokyo Electron, Applied
Materials, Lam Research, KLA, ZEISS SMT, Shin-Etsu, SUMCO, JSR, and Tokyo Ohka
nodes alongside the existing ASML node. Tooltip copy distinguishes a company
headquarters from a verified manufacturing site where that distinction
matters; the compact pin labels remain company/place names.

Visible semiconductor and frontier-AI infrastructure flows now use the closed
relation vocabulary, with relation colors, a legend, and independent node and
relation filters. The established centralized source ledger remains the source
of truth: every visible node and edge resolves to a record with a URL and a
date field, and a pinned map disclosure surfaces title, publisher, link, and
date. The AWS Global Infrastructure source is honestly marked `n.d.` rather
than assigned a fabricated publication date. The Chinese mirror retains the
canonical geometry and source identity while translating the new UI and
editorial node/flow copy.

Two edges were removed because the claimed bilateral relation was not directly
sourceable: Hsinchu–Penang backend manufacturing and Korean memory–U.S. cloud.
A directly sourced ZEISS-to-ASML optics-supply edge was added. The previously
omitted U.S.–U.K. governance edge remains omitted and is not counted among the
two V22 deletions.

The six supplied relation types do not describe treaty, basing, coercive, or
military-posture flows honestly. They are therefore required for the chip and
AI-infrastructure scenes, not retrofitted onto legacy security scenes. This is
a deliberate accuracy exception, not a missing implementation.

Desktop and 390px interaction review found two defects not visible in the data
tests: pointer movement could unpin a citation panel, and the mobile map label
could intercept its close button. Both are fixed. The responsive test now
selects Materials and Supply, opens a real JSR source disclosure, closes it,
and proves the page remains within the viewport.

## Reproduced measurement findings

### Modules

| Instrument and mode | Most compressed axis span | Default headline share |
|---|---:|---:|
| Security Standard | 1.60 | 91.8% |
| Security Advanced | 1.57 | 97.4% |
| Technology Standard | 1.37 | 99.6% |
| Technology Advanced | 1.19 | 100.0% |

Every module mode-axis combination except Security Standard activism has an
exact uniform-choice mean more than 0.3 away from the nominal midpoint of
4.0. This is strong evidence of structural compression and directional bias.
It does not establish individual-response unreliability or population noise.

### AI Governance

| Measure | Standard | Advanced |
|---|---:|---:|
| Modal archetype | Strategic Competitor, 27.8% | Democratic Guardrailist, 53.4% |
| Oversight exact random mean | 5.236 | 6.050 |
| Oversight ceiling saturation | 12.4% | 24.8% |
| Legitimacy exact random mean | 4.659 | 5.609 |
| Legitimacy ceiling saturation | 8.0% | 16.6% |

Standard has one forward and one reverse Likert item on every axis. Advanced
adds forward-heavy Likert items and fails the 40% reverse-coding rule on seven
of eight axes. Advanced requires at least one rewrite on each of those seven
independently scored axes; “roughly four new and two rewrites” cannot satisfy
that contract.

The Advanced scenario-bank deltas are:

| Axis | Minimum | Maximum |
|---|---:|---:|
| Risk horizon | -0.5 | +1.9 |
| Deployment pace | -4.1 | +3.7 |
| Oversight | -1.2 | +5.6 |
| Geopolitics | -1.5 | +3.7 |
| Openness | -2.6 | +1.4 |
| Military role | -0.8 | +1.9 |
| Legitimacy | -1.0 | +5.6 |
| Human future | -0.6 | +0.8 |

All eight cross zero. The problem is skew and saturation, not unreachable
negative poles in Advanced mode. Standard oversight is the one scenario bank
that is directionally one-sided, at +0.1 to +2.7, although the combined final
score can still reach below the midpoint.

## Corrections and pushback for the project manager

### 1. Preserve the headline module diagnosis; withdraw the stated AI math

The module diagnosis is robust. The AI attainable-range calculation is not.
It appears to use Standard options for analyst cards, omit zero weights rather
than applying the scorer's zero delta, and drop scenarios without a signal on
the axis. Replace the “three axes cannot produce a negative score” claim with
the mode-specific skew and saturation findings above.

### 2. Do not call a respondent's proximity to a random expectation “noise”

A uniform-random simulation diagnoses the instrument's structure. It is not a
respondent error model, a test-retest study, or a reliability estimate. A
saved score near that expectation may be substantively real. The defensible
claim is that the bank is poorly centered and insufficiently discriminating,
not that the person was “at or below noise.” The supplied table also contains
three, not four, deltas at or below the stated threshold.

### 3. Replace the literal every-item/every-axis rule

Module options carry dense four-axis cross-loadings. Requiring every card to
span all four axes would turn every scene into four simultaneous bipolar
mini-scales, inviting implausible options and construct contamination. AI uses
sparse incidental deltas, where a missing weight is deliberately zero.

Add typed `discriminatingAxes` (or `primaryAxes`) metadata to each item. Make
item-level span and minimum spread blocking only for those declared axes. Keep
bank-and-mode-level gates blocking for every scored axis:

- attainable range and access to both sides of the true midpoint;
- exact random-choice centering;
- result/headline or archetype concentration;
- floor/ceiling saturation;
- reverse coding by mode.

The geometric compromise detector should create a review finding, not prove
that the middle option is editorially empty.

### 4. Version the repaired banks before changing answers or signals

Module and AI share payloads encode answer IDs. Rewriting signals or removing
options under the same active bank can change the meaning of an old link.
Freeze the V21 bank/scorer tuple, introduce the repaired V22 tuple, and dispatch
legacy payloads through the frozen version. Do not treat graceful invalid-link
handling as compatibility.

### 5. The stability diagnostic was already implemented

`--stability` predates this sprint. The current 68-item Advanced run changes
family for 9.0%, strategy for 6.6%, norm for 5.8%, full three-part label for
20.4%, and narrative differentiation state for 18.4% after two answer changes.
That run is useful but cannot substitute for the required two-of-20 core run
after the form is reshaped.

### 6. Resolve the core-form contradictions before implementation

“Promote” 4–6 extended cases while leaving the extended set unchanged is
ambiguous because the bank has one tier field. The safe interpretation is to
make the promoted cases part of core and not ask them again later, preserving
the 68-item full form. That changes every targeted form and requires new
discriminator selections and calibration contracts.

V5 result decoding currently accepts only the active provenance tuple. A new
core shipped under the old tuple silently reinterprets history; accepting only
the new tuple breaks V21 links. A supported-version registry and frozen V21
tuple are prerequisites.

Count unresolved dimensions using standardized distance from the exact form's
calibration center, not a raw ±0.25 across dimensions. Apply suppression to
the page, metadata, Open Graph, Profile sync/share/history, and rarity copy,
not only the visible headline.

### 7. The proposed 16-output archetype logic is not yet specified

The product already has three normative states, including Conditional
Solidarist, rather than a binary plus/minus split. Reducing this to two states
or mapping the middle state requires an owner decision. Several final names
and glosses are explicitly owner-owned. Do not implement an eight-by-two
system until those semantics and strings are final.

Eight distinct archetype positions also cannot be inferred from the existing
map projection: restraint does not affect its geometry, so plus/minus pairs
coincide. A visual separation would be invented precision unless the map
model is changed and justified.

### 8. Tier 1's reduced gate is reasonable, but rate limiting still protects
measurement integrity

Rate limiting need not block a staging activation, and it was correctly kept
out of this change. It is not merely uptime work, however. An unauthenticated
counter endpoint can be polluted, so rate limiting or equivalent abuse
controls should remain a near-term research-integrity issue before public
percentiles are treated as evidence.

Also note that migrations `001` through `003` create dormant respondent-level
replay tables in migration `002`. Their presence must not be described as Tier
2 activation; the Tier 1 route remains aggregate-only.

### 9. Do not force the new relation vocabulary onto unlike legacy flows

The six approved relation values are useful for production and governance
networks. They do not include treaty obligation, basing access, security
assistance, military posture, or coercion. Typing every legacy World Stage line
as ownership, supply, capital, research, standards, or export-control
jurisdiction would replace ambiguity with false semantics. Either approve a
separate security-relation vocabulary in a later version or leave those legacy
flows outside this filter contract.

## Owner decisions required before the next production slice

1. Approve a repaired-bank compatibility contract and new V22 bank/scoring
   tuple for modules and AI.
2. Approve typed per-item discriminating axes and the bank-level acceptance
   gates above in place of the literal all-cross-loading span rule.
3. Approve the reshaped Foundation as a new structural/item-bank/scoring tuple
   with frozen V21 decoding and explicit draft migration.
4. Decide whether the normative middle state remains a first-class archetype
   outcome, and provide final owner strings before archetype remapping.
5. Provide or authorize a disposable staging Postgres environment for the
   remaining Tier 1 migration/catalog/end-to-end gate.

## Recommended next sequence

1. Record the version and typed-axis decisions.
2. Rewrite module items in batches of five, running both mode diagnostics after
   each batch and recording every option-ID/signal change.
3. Repair Advanced AI valence on all seven failing axes, then rebalance
   scenario skew and saturation separately by mode.
4. Turn the corrected validator gates blocking only after the new banks pass.
5. Ship the versioned 20-item core, regenerate core and all targeted-form
   calibrations, and rerun exact-form stability.
6. Gate archetype remapping on that core stability result and final owner copy.
7. Apply the result-page density pass only after the presentation contract is
   settled; do not use visual polish to conceal unresolved measurement.

## Verification record

- `npm run lint`: pass.
- `npm run validate`: pass with the intentional V22 A2 reporting-only failure
  list; 135 unique instrument items validated.
- `npm run test`: 312/312 pass.
- `npm run build`: pass; TypeScript and 146 generated static pages complete.
- Focused 390px World Stage interaction: pass, including type/relation filters,
  pinned source disclosure, close behavior, and horizontal-overflow check.
- `npm run diagnose -- --modules --ai`: ran successfully; failure output is
  recorded in the measurement baseline.
- `npm run diagnose -- --stability`: ran successfully; perturbation output is
  recorded in the measurement baseline.
- Full `npm run test:e2e`: 47/47 runnable tests pass; the one existing
  non-CI cache-header test is intentionally skipped by its own guard.
