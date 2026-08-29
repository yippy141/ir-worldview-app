# Methodology

## Question

How often does the deterministic current Foundation result change when one
answer is moved by the smallest permitted amount, one forced choice is
replaced, or one core item is omitted or neutralized?

The diagnostic measures scorer and resolver behavior under constructed
inputs. It does not measure test-retest reliability, content validity,
construct validity, population frequency, or human response quality.

## Frozen contracts exercised

The script imports the live Foundation v2 bank and registry rather than
copying item or scoring data. It evaluates all currently registered result
forms with their exact calibration:

| Form | Exact content | Calibration |
| --- | ---: | --- |
| Core | 14 Likert items | `core` |
| Six targeted forms | 14 core Likert + the registered five forced-choice discriminators | the matching `targetedExtended:*` calibration |
| Full extended | 46 Likert + 22 forced-choice items, 68 total | `extended` |

The full form includes 12 validation-scale Likert items that production
scoring intentionally ignores. Their zero influence is retained in the item
table because it verifies that the scoring block boundary remains intact.

The result snapshot is resolved through `generateResult`,
`getV2ScoringCalibration`, `assessFoundationNarrative`, and
`resolveArchetype`. A full-archetype flip means the resolver's archetype code
changed, including its pure/blend lens identity and posture sign. The
normative suffix is preserved in fixtures as `readingCode` but is not counted
as part of the requested full-archetype transition.

## Ensembles

Each vector answers every item in its exact form. The total is 3,372 base
vectors.

| Ensemble | Core | Six targeted forms | Full | Total |
| --- | ---: | ---: | ---: | ---: |
| Uniform | 300 | 160 each / 960 | 160 | 1,420 |
| Calibrated synthetic | 240 | 120 each / 720 | 160 | 1,120 |
| Boundary-focused | 64 | 64 each / 384 | 64 | 512 |
| Canonical | 16 | 16 each / 96 | 16 | 128 |
| Response-style stress | 24 | 24 each / 144 | 24 | 192 |

### Uniform

Seed `20260728`, offset deterministically by exact form. Each Likert response
is sampled independently and uniformly from integers 1–7. Each forced-choice
primary is sampled uniformly from its four semantic options. Where the item
permits an Advanced-mode second choice, the generator samples uniformly from
no second choice and each of the three distinct alternatives. This ensemble
extends the repository's independent-null calibration process to every exact
form and actual response space.

### Calibrated synthetic

Seed `2026082901`, offset by form. The four existing scorer-test profiles in
`tests/scoring.test.mts` supply the latent tradition-directed dimension
profiles. Families are represented equally. Each record receives a shared
response-style deviation, dimension-specific Gaussian noise, and item-specific
noise. Reverse items are mapped back to raw responses after the latent scored
position is set. Forced choices are ranked by mean squared distance between an
option's declared signal vector and the latent profile, with deterministic
jitter; eligible second choices are retained for 72% of noisy records.

This produces within-dimension correlation and cross-dimension family shape.
It is a mechanical persona ensemble, not an estimated response model. The
calibration registry is used to score each form; the ensemble is not fitted to
human data.

### Boundary-focused

Seed `2026082902`, offset by form. The diagnostic creates deterministic
uniform candidate pools and selects complete, distinct vectors nearest to:

- a family tie;
- the form's pure/blend threshold;
- the hard posture midpoint of 4;
- exact or nearest available top-two ties.

Each category contributes up to 16 records. Targeted-form candidates must
also reproduce the live route: their core result must fall below the core
extension threshold and its top-two family pair must match the exact targeted
form. This is the only ensemble deliberately conditioned on targeted-route
eligibility.

### Canonical

Seed `2026082903`. The same four existing synthetic tradition profiles are
converted without noise into complete item-space answers. Each is crossed
with applying-advantage/restraint and order-first/justice-first dimension
variants, producing 16 archetype-directed records per form.

### Response-style stress

Seed `2026082904`. Each form contains midpoint-heavy, acquiescent,
disacquiescent, high-extremity, alternating, and low-differentiation patterns.
The first five are direct deterministic response styles with four variants.
Low-differentiation records are the four smallest-gap results from 2,000
uniform candidates for the form.

## Perturbations

Every base vector receives every applicable perturbation:

1. Every Likert item moves one raw response step down when the response is
   above 1 and one step up when it is below 7.
2. Every forced-choice primary is replaced in turn by all three alternatives.
   If the new primary was the second choice, the old primary becomes second so
   the answer stays valid.
3. Each of the 14 core items is omitted once.
4. Each of the 14 core items is separately neutralized to raw response 4.
5. The already scored restraint dimension is separately moved by −0.01 and
   +0.01. These direct posture probes are reported outside the ordinary answer
   perturbation denominator.

The final run contains 266,177 answer perturbations and 6,744 direct posture
dimension probes.

## Metrics

- **Primary-family flip:** leading family key changes.
- **Posture flip:** the archetype sign changes.
- **Pure/blend transition:** resolver routing changes between a pure and
  blended result.
- **Full-archetype flip:** the resolver code changes.
- **Item influence:** full-archetype flip rate among answer perturbations
  attributed to that item. The median and maximum use item rates, not counts.
- **Family boundary distance:** top-two family-score gap.
- **Blend boundary distance:** absolute distance between that gap and the
  form-specific low-differentiation threshold.
- **Posture boundary distance:** absolute distance between restraint and 4.

`boundary-analysis.csv` divides each ensemble/form distance distribution into
descriptive quintiles and reports transition probability within each bin.
These bins are sample descriptions, not validation gates or proposed public
thresholds.

Concentration by item counts full-archetype flip events. Concentration by
dimension attributes a flip to every dimension whose displayed score changed;
therefore multi-dimension forced choices can receive more than one dimension
attribution.

**Masked family flip** means the leading family changed but the canonical
blend code did not. **Amplified archetype flip** means family stayed constant
while pure/blend routing or posture changed the archetype code.

## Determinism and compatibility

The generator uses a fixed LCG and stable form-specific seed offsets. Output
contains no timestamp or measured runtime. Two complete runs were compared
recursively and were byte-identical. `current-run.json` records SHA-256
digests for every data artifact and for the protected bank, scoring,
calibration, archetype, payload, and share files.

The script also checks directionality. Across the final run, there were zero
violations of declared Likert scoring direction and zero cases where increasing
the scored restraint dimension moved a restraint posture toward applying
advantage (or the reverse).

## Limitations

- No ensemble is a representative population sample.
- The correlated personas are authored mechanical probes. Their noise model
  is not estimated from people.
- Uniform targeted records are valid form vectors but are not conditioned on
  the UI's targeted-route eligibility. The boundary-focused targeted ensemble
  is conditioned and should be used for live-boundary interpretation.
- One-step response perturbations do not estimate whether a person would in
  fact change that answer.
- Omission is evaluated through the scorer's existing missing-signal behavior;
  production submission still requires a complete form.
- Direct ±0.01 posture probes operate on the rounded dimension score to expose
  the hard resolver cut. They are not possible raw-answer changes in every
  form.
- Item influence rates pool mutation types with different response spaces:
  a forced choice has three alternative replacements, while a Likert response
  has one or two permitted one-step moves plus core omission/neutralization.
- Ties use the production scorer's stable ordering. The diagnostic describes
  that deterministic behavior but does not treat the tie-break as substantive
  evidence.
