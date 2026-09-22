# Construct and Measurement Audit — Foundation v2 / AI Governance v3 / Module v2

## 0. Scope and epistemic framing

This is an audit of an **editorial reflection tool**, not a psychometric claim. The supplied source explicitly disclaims population calibration on the public-facing method page and in `posture-audit.md`. I distinguish throughout between:

- **(A) Empirical concerns** — resolvable only with human response data (reliability, factor structure, DIF, criterion validity, test-retest).
- **(B) Proven mathematical/structural defects** — defensible from the source alone (double rounding, rank-weight asymmetry, threshold/misclassification risk under the stated scorer).
- **(C) Design/construct concerns** — theory content, conflation, naming; arguable but not falsifiable from code alone.

I do not recommend altering frozen scores (`FOUNDATION_SCORING_VERSION = 2`, `archetypeProfiles` constants). Frozen artifacts are versioning assets. Any change should ship as v3.

---

## 1. Proven mathematical / structural findings

**M1. Double-rounding in the family-difference pipeline.** `lib/scoring/v2.ts:261` rounds each dimension to 2 dp; `scoreFamilies` (`:316`) rounds each family score to 2 dp; `decomposeFoundationFamilyDifference` (`lib/results/foundation-contributions.ts:124–127`) then subtracts the *displayed* rounded scores while its own rows sum from *unrounded* standardized terms. The `roundingResidual` field acknowledges this — good — but the naming of `rows` as "signedContribution" (line 33) risks an author reading them as an additive decomposition of `displayed.difference` when it is exact only for `unrounded.difference`. Not a defect; a documentation-latent hazard. Users of the chart that renders these rows should sum `signedContribution + roundingResidual/n` mentally or the residual must be shown.

**M2. Ranked-choice weight asymmetry is not a symmetric scalar.** `SECOND_CHOICE_WEIGHT = 0.45` on both sides (`lib/scoring/v2.ts:55`, `lib/modules/runtime-v2.ts:17`, `lib/ai-governance-scoring*.ts:152`). For a two-way ranked answer (P, S, P≠S), the denominator weight for a dimension appears twice when both options carry a signal (1 + 0.45 = 1.45); it appears once when only the primary carries it. That by itself is fine *if the respondent is genuinely expressing a primary preference*, but the resulting dimension average is not "weight of a signal" in any ratio-scale sense: it silently re-normalises within-question, so a primary with strong signal on D1 plus a secondary with strong signal on D2 pulls D1 toward its own value and D2 toward its own value with unequal denominators per dimension. This is a **modelling assumption**, not a defect, but it is undocumented and interacts with M1.

**M3. Neutral-centre inconsistency between full form and posture boundary.** `posture-audit.md` documents restraint null center 4.657735 vs boundary 4. `archetypes.ts:83, 109–116` uses 4 as the hard Hedger sign boundary. The methodology note is honest. But `analyzeScoreShape` (`lib/scoring/v2.ts:331`) computes `sharpDimensionCount` against 4, so the diagnostic and the router disagree about what "neutral" means, and this is not surfaced in the result object. **Proven**: for a respondent whose restraint is exactly 4.0, `Hedger` fires and `sharpDimensionCount` treats restraint as 0 distance from center even though the *full-form calibrated* center is 0.66 higher. This is a design tension, not a mathematical error — but it is deterministic and reproducible.

**M4. `resolveArchetype` tie-break depends on `orderedFamilies` order, but the pure/blend decision does not apply the tie-break consistently.** `lib/archetypes.ts:168` blends when `nearestFitGap < lowDifferentiationThreshold`. But `buildCanonicalFoundationResult` (`v2.ts:405`) sets `runnerUpKey` by "first key ≠ family", which after a stable sort depends on insertion order in `familyProfiles` (**realist, institutionalist, constructivist, criticalPoliticalEconomy**). Therefore exact top-two ties always produce a nonzero `nearestFitGap` of 0 and a deterministic runner-up, so a two-way tie produces a blend — as intended — but the *choice of runner-up* under a tie is order-dependent in a way not surfaced. **Proven** under the code's own sort comparator.

**M5. Targeted calibration selection requires a pre-existing pair.** `foundationScoringCalibrationForForm` (`v2-calibration.ts:236–249`) returns `null` if `targetedFamilyPair[0] === targetedFamilyPair[1]`. But the caller in the UI is not supplied here; the calibration can therefore be silently dropped to `extended` if a route supplies a duplicate pair. Downstream: the *same* answers scored under `extended` vs `targetedExtended:X|Y` will produce *different* dimension scores only through the family-score standardization step (dimension scores are stored at raw 1–7 and are calibration-invariant). **Check**: `computeCoreDimensionScores` and `computeDimensionAggregates` never consume `calibration`, so dimension scores are form-independent. Family scores and modifiers depend on calibration. Conclusion: a respondent completing the *same* answered items under different calibrations produces *different* family keys and modifiers but *identical* dimension scores. This is intended but is a subtle reconstruction risk for shared links.

**M6. Modifier threshold band widths are not comparable across calibrations.** Compare `extended`: strategy ∈ [4.56, 4.76), width 0.20 on 1–7; `targetedExtended:institutionalist|constructivist`: strategy ∈ [4.41, 4.80), width 0.39. Normative widths: `extended` 0.37; `realist|constructivist` 1.07; `institutionalist|constructivist` 0.56. **Proven**: identical restraint/order-justice inputs can produce different modifier labels under different calibrations and this cannot be summarized by the numeric value alone. Whether this is *appropriate* depends on whether the targeted forms genuinely have different conditional distributions — the file cites 127,474 eligible records — but the resulting labels are not interchangeable across forms, and the method page's "style outputs travel" language (`method/page.tsx:266–270`) may suggest more comparability than exists.

**M7. `AI_BACKUP_CHOICE_WEIGHT` applies to *scenario weights*, not to axis averages.** `lib/ai-governance-scoring*.ts:230` multiplies the *signal value* by 0.45 and adds it to an axis already clamped to [1,7]. That is a different aggregation logic from the Foundation scored-signal ratio. In the Foundation, a secondary answer "counts at 45 % of primary" in a *ratio* sense. In AI Governance, it is a 45 % *additive* perturbation to an axis point, and the axis is then clamped, so the marginal effect of a secondary depends on the primary-scaled axis baseline. **Proven**: the same nominal "0.45 second-choice weight" is not the same measurement operation across the two instruments. The method page (`method/page.tsx:82`) presents this as a single authored choice; it is two.

**M8. Foundation's `computeCoreDimensionScores` uses `getFoundationQuestions(mode)` from `v2.ts` — not `getFoundationQuestionsForSet`.** The form router (`quiz-schema.ts:127–171`) uses `getFoundationResultQuestions` which prepends `foundationCoreQuestions` to the targeted extension. **The two functions do not coordinate.** A request to score a targetedExtended form must actually supply `selectFoundationAnswersForSet(...)` output to `computeCoreDimensionScores` — nothing in `v2.ts` verifies this. **Risk**: if the caller accidentally passes raw answers including stale full-extended items, those items silently contribute (because `getFoundationQuestions("analyst")` includes all `standard ∪ analyst-only` — the *full* extended set). This is a real integration hazard: the scorer's internal "what is in scope" is *mode only*, not *form only*. Provide a targeted-form-aware scoring entry point or assert on answer IDs.

---

## 2. Construct validity and theory content

**C1. Normative vs explanatory are formally separated in the *dimension* list but recombined in the *family*.** `orderJustice` (normative) is projected through the same weight matrix as `securityCompetition` (explanatory) in `familyProfiles`. A family key is therefore a *joint* claim over explanatory priors and normative postures. The public text (`method/page.tsx:70–72`) calls these "style modifiers" that sit alongside — good — but the family *label* still moves with order-justice because the profile matrix uses it. `realist.orderJustice = 0.2278`, `institutionalist.orderJustice = −0.2537`, `constructivist.orderJustice = −0.0571`, `criticalPoliticalEconomy.orderJustice = −0.3667`. **Concern**: two respondents with identical explanatory answers and opposite order-justice answers can receive different family keys. Whether that is intended should be stated.

**C2. Omitted traditions.** The method page concedes feminist IR, postcolonial theory, and green IR are absent (`method/page.tsx:115–118`). This is honest but incomplete: the *dimension* set itself is invariant across the family projection, so a feminist-IR respondent who scores high on `domesticFilters` and `normsIdentity` will likely be labelled constructivist or institutionalist — the label carries a residual that omits the tradition's distinctive claim. **Empirical question**: whether the omission produces systematically *mis*-classified labels versus merely under-served ones is only decidable with human data.

**C3. Political-economy dimension is doubly-loaded.** `politicalEconomy` items include both salience ("markets matter") and critical-structure ("rules give strong states advantages"): `pe1` (chokepoints) vs `pe2` ("structural advantages"). Both flow into the same dimension. The method page acknowledges this (`method/page.tsx:104–106`) but the *dimension score* lumps them, and the criticalPoliticalEconomy family's `politicalEconomy` weight (0.7494) is nearly double its next-largest weight. **Empirical**: whether this scale separates "political-economy salience" from "critical-structural commitment" is a factor-analytic question.

**C4. Response-bias susceptibility and reverse-adjacency.** The core items are structured as `dimForward, dimReverse` pairs at the *dimension* level, but the **display order does not alternate reverse/forward**. Example in `foundation.v2.json`: `v21_sc_rev_02` (reverse) precedes `v21_sc_rev_05` (reverse) with no forward item between them. **Empirical concern**: acquiescent response patterns will not cancel across adjacent reverse items; the code's `comput eCoreDimensionScores` averages them with equal weight, so a strong acquiescent style drifts on dimensions with clustered reverses. This is a classic Balanced Inventory concern that cannot be resolved from code.

**C5. Presence of a validation block that is scored as ignored.** The bank contains 12 items with `scoringBlock: "validation"`. `scoreLikely`/`collectQuestionSignals` (`v2.ts:157`) short-circuits non-core. The method page treats them as a research-comparison battery (`method/page.tsx:287`). **Empirical**: they can be used for future construct-validity evidence at zero cost (e.g., correlate Kertzer `militantInternationalism` with realist family score). Currently unused.

**C6. AI Governance axes mix explanatory and normative.** `lib/ai-governance-scoring*.ts:38–89` — `legitimacy` and `humanFuture` are normative-evaluative; `riskHorizon` and `geopolitics` are empirical. The archetype projection sums across both. `aiAxisLabels` doesn't distinguish. Parallels C1.

**C7. Actor lenses and cards.** `lib/modules/runtime-v2.ts:71–73` excludes `actorLens` from the scored set, which is correct for own-judgment aggregation. But `buildCardTypeScores` (`:138–166`) reports scores for `actorLens` too, computed from the same axis signals. The method page (`method/page.tsx:262–264`) says "actor-lens judgments cannot establish a personal choice" — but the *cardTypeScores.actorLens* object is a scored record that can be mistaken for own judgment. **Label concern**.

---

## 3. Calibration provenance and thresholds

**P1. `CALIBRATION_SOURCE.respondentCount = 500_000`** (`scoring-calibration.ts:12`) for Foundation; **`respondentCount = 500`** (not 500k) for modules (`lib/modules/calibration.ts:20`). Module thresholds are therefore calibrated from a far smaller synthetic ensemble. `MODULE_CALIBRATION_SOURCE.percentileMethod = "linear interpolation at rank (N − 1) × p"` — this is fine at N=500 for 0.33/0.67 cuts, but the *standard deviation* of the tail (`.33` cut) has non-trivial sampling noise. **Proven** as a numeric scale statement; **empirical** whether it matters for label stability.

**P2. Seed reuse with different mechanisms.** Module calibration uses seed 20260728 for security and 20261729 for technology, but also records `instrumentSeed` per bank. Foundation calibration uses 20260728 for the full-form sample, targeted forms use 20260730–20260735. The methodology file claims byte-identical determinism, which is good practice. But you are stacking a large independent sample (500k) with targeted conditional samples (100k each) and combining them by assumption (neutral baseline unconditional; modifier cuts conditional). The file's stated justification (`v2-calibration.ts:81–93`) is coherent; it does not, however, rule out *conditional* biases in the neutral baseline for the top-two pair that were selected on the *unconditional* sample. **Empirical/stability question**.

**P3. `CORE_NEUTRAL_BASELINE.sd = sqrt(2)`** (`v2-calibration.ts:46–51`). The comment claims "core dimension is the mean of one forward and one reverse seven-point item under independent uniform responses; its neutral mean is 4 and SD is sqrt(2)." Let X ∈ {1..7} uniform, so Var(X) = (7²−1)/12 = 4. For the mean of two independent (forward, reverse), Var = 4/2 = 2, SD = √2. **Proven correct under the stated construction.** But this is arithmetic for *one* forward and *one* reverse — the core has **two** Likert items per dimension? No: the core has exactly one forward and one reverse Likert item per dimension in the *core* form (7 dimensions × 2 items = 14 items, consistent with `methodology.md`). Good.

**P4. Threshold bands vs `lowDifferentiationThreshold`.** `extended` uses 0.36, `core` uses 0.3675 (`v2-calibration.ts:215`). These are nearly identical as noted; they are stated to be from independent-null quartiles. Fine.

**P5. `SHARPLY_DIFFERENTIATED_THRESHOLD = 1.46`** (`v2-calibration.ts:79`) feeds `placement-firmness.ts`. But `placement-firmness.ts:82` *only* uses the passed state to determine the band; the *fraction* uses `nearestFitGap / sharplyDifferentiatedThreshold`. This means the bar saturates at gap = 1.46 even though the *band* is set from the narrative-state classifier, which may use a different rule. **Concern**: on the same page, the bar can hit 100 % while the band remains "moderate" if the narrative state derivation weighs dimension extremity differently. The docstring acknowledges this (`:61–68`) but visually inconsistent.

---

## 4. Reference-profile epistemics and archetype naming

**R1. `familyProfiles` values are authored, not derived.** The float precision (e.g., `0.9174195544554454`) suggests they were produced by some normalisation (likely correlation-derived from token counts), but no provenance is cited. The method page concedes they are editorial (`method/page.tsx:84–86`). Preserving them is right; adding a short provenance note in a research file would be honest.

**R2. Note the perfect mirror structure:** realist and institutionalist pair as `(0.917, −0.419)`, `(−0.597, 0.777)` on security/institutions; constructivist and cPE pair symmetrically on normsIdentity/politicalEconomy. `criticalPoliticalEconomy.restraint = −0.0319` and `orderJustice = −0.3667` — the sign of "restraint" on the cPE profile is *nearly zero*, so cPE is largely determined by politicalEconomy alone. **Concern**: a respondent scoring 6.5 on politicalEconomy (structural) and 4.0 on every other dimension will very likely land on cPE — because the 0.749 weight is applied to a standardized score of (6.5 − 4.9656)/0.3131 ≈ 4.90 × 0.749 ≈ 3.67, dwarfing all other contributions. **Proven arithmetic**: cPE dominates the politicalEconomy-tail region. This is exactly what the method page says it wants to prevent (`method/page.tsx:104–106`), but the profile matrix does not implement that prevention. The prevention is claimed as a design property without enforcement.

**R3. Archetype naming.** `PostureSign` from `restraint` and `NormativeModifier` from `orderJustice` produce 8 pure codes and by extension blends. The suffix `o/j/c` (`archetypes.ts:65–69`) never appears in the *archetype catalog*, only internally. Good: the pure code carries 2 dimensions of information, and the two are the *registered* ones. Fine.

**R4. Blend naming collapse.** `blendNamePart` (`archetypes.ts:205–207`) strips an "The " prefix but does not otherwise normalise. If two catalog names collide after stripping, the blend name is ambiguous. Not a defect for the current catalog but a fragility.

---

## 5. Short-form uncertainty, language, and forms

**S1. `baselineExtended` is scored identically to `fullExtended`** (`v2-calibration.ts:241`). The bank defines `foundationBaselineExtendedQuestions = foundationExtendedQuestions.filter(scoringBlock === "core")` (`quiz-schema.ts:102–104`). Because the *scored* questions are core-block only, the two forms produce identical family scores *when the same answers are present for the core items*. The method page acknowledges this: "Identical scored answers produce identical scores" (`method/page.tsx:288`). The comparison-status JSON `foundationBaselineForm.comparisonStatus = "common-item-only"` is good.

**S2. Bilingual equivalence is unaddressed by the code.** No language key appears in the calibration definitions. The method page mentions "language and wording edition" in the pair-comparison rules but there is no per-language calibration. **Concern**: shared links from different languages will be compared under the same numeric calibration.

**S3. Non-monotonic form coverage.** `getFoundationQuestions(mode)` in `v2.ts` and `getFoundationQuestions(mode)` in `quiz-schema.ts` are **different functions with the same name** in different modules. `v2.ts:224` is local and shadowed; `quiz-schema.ts:72` is exported. `v2.ts` imports nothing from `quiz-schema`, so the two never conflict at runtime, but a maintainer editing one will not know the other exists. Naming collision.

---

## 6. Concrete synthetic patterns for diagnostic probing

Precise answer patterns and the expected *directional* behaviour, given the code's arithmetic. Fields are illustrative of the *shape*, not enumerated item-by-item values. `L = Likert item value`, `FC = forced-choice option id`.

- **S1. Neutral full core.** All Likert = 4; FC = first-declared option. Expected: all dimension scores 4.00 (except where FC options declare signal ≠ 4 on some dimension, which they do); family scores near zero-modulo calibration offsets; strategy = Hedger; normative ≈ Conditional Solidarist.
- **S2. Acquiescent.** All Likert = 7. Expected: forward items push dimension to 7, reverse items also push to 7 pre-reversal, post-reversal `8 − 7 = 1`, so dimension averages settle mid-scale on dimensions with balanced forward/reverse; the *unbalanced* dimensions (if any) drift. Highlight the *direction* of that drift.
- **S3. Disacquiescent.** All Likert = 1.
- **S4. Alternating 1,7,1,7.** Under `computation`, alternating patterns behave like mid-scale means on balanced dimensions but interact with reverse clustering.
- **S5. Restraint-maximizing forced-choice manifold.** All FC = option with highest restraint signal; Likerts = 4. Should shift restraint, and therefore posture sign, rightward.
- **S6. Restraint-minimizing forced-choice manifold.** All FC = option with minimum restraint signal.
- **S7. Single-item sensitivity.** For each core Likert item, sweep values 1..7 with the others fixed at 4. Output the *total range of the top family score across the sweep* — a measure of per-item leverage on family ranking.
- **S8. Author-influence on orderJustice→family mapping.** Vary `oj1` and `oj2` from 1..7 with other dims at 4. Observe whether cPE↔realist ranking can be flipped by order-justice alone.

---

## 7. What belongs to editor vs psychometric research

Belongs to editorial judgement, no human data needed: family weights; the 0.45 second-choice weight; the method-page caveats; archetype glosses; threshold bands as display rules.

Needs psychometric evidence before any public claim: factor structure of the 7 dimensions; differential item functioning across the reverse-coding clusters; test-retest stability of family key and modifier labels; criterion analog vs external expert panel; the `respondentCount = 500_000` claim is not a validity claim but it is often misread — a footnote in `method/page.tsx` would help.

Needs *stability* evidence (deterministic and cheaper than validity): the `v23-6` robustness diagnostic already does this partly; extending it to bilingual and cross-calibration comparisons is high-value.

---

## 8. Diagnostic script

Self-contained Node `.mts`. Reads the actual banks and imports the actual exported scorers via relative paths (adjust the import block for your repo layout). No hardcoded expected outputs; prints observed numbers. Does not write to files. Assumes the repo has `tsx` or a TypeScript-aware runner.

```ts
#!/usr/bin/env -S npx tsx
/**
 * foundation-diagnostic.mts
 *
 * Read-only audit probe for the Foundation v2 scorer and bank.
 * Prints observed measurements; contains no expected values.
 *
 * Run from repo root:
 *   npx tsx scripts/foundation-diagnostic.mts
 *
 * The script (a) loads the actual foundation bank, (b) constructs
 * synthetic answer vectors via the bank schema alone, (c) calls the
 * exported v2 scorer, and (d) prints per-item and per-dimension
 * contributions. It never mutates any file and never asserts on any
 * numeric outcome.
 */

import foundationBankJson from "../content/instrument/foundation.v2.json" with { type: "json" }

import {
  computeCoreDimensionScores,
  computeCoreDimensionAudit,
  scoreFamilies,
  analyzeScoreShape,
  buildCanonicalFoundationResult,
  generateResult,
  FOUNDATION_SCORING_VERSION,
} from "../lib/scoring/v2.ts"

import {
  getFoundationQuestions,
  foundationCoreQuestions,
  foundationExtendedQuestions,
  getFoundationQuestionsForSet,
  getFoundationResultQuestions,
  questionCountsBySet,
  questionCountsByMode,
} from "../lib/quiz-schema.ts"

import type {
  Answers,
  AnswerValue,
  ChoiceQuestion,
  CoreLikertQuestion,
  DimensionKey,
  FamilyKey,
  Question,
  QuizMode,
  RankedChoiceAnswer,
} from "../lib/types.ts"

// ---------------------------------------------------------------------------
// Bank introspection
// ---------------------------------------------------------------------------

type BankItem = Question & { modes: QuizMode[] }
type DiscriminatorTable = Record<string, string[]>

const bankItems = foundationBankJson.items as unknown as BankItem[]
const discriminators = foundationBankJson.discriminators as DiscriminatorTable

const DIMENSIONS: DimensionKey[] = [
  "securityCompetition",
  "institutions",
  "domesticFilters",
  "normsIdentity",
  "politicalEconomy",
  "restraint",
  "orderJustice",
]

const FAMILIES: FamilyKey[] = [
  "realist",
  "institutionalist",
  "constructivist",
  "criticalPoliticalEconomy",
]

function section(title: string) {
  console.log("\n" + "=".repeat(78))
  console.log(title)
  console.log("=".repeat(78))
}

function fmt(n: number, dp = 4) {
  return Number.isFinite(n) ? n.toFixed(dp) : "NaN"
}

// ---------------------------------------------------------------------------
// 1. Scored-item coverage
// ---------------------------------------------------------------------------

section("1. Bank coverage")
console.log("instrumentVersion:", foundationBankJson.instrumentVersion)
console.log("scorer version:    ", FOUNDATION_SCORING_VERSION)
console.log("bank item count:   ", bankItems.length)

const counts: Record<string, number> = {
  coreLikert: 0,
  coreChoice: 0,
  validation: 0,
  other: 0,
  standard: 0,
  analystOnly: 0,
  bothModes: 0,
  analystTier: 0,
}

for (const item of bankItems) {
  const isStandard = item.modes.includes("standard")
  const isAnalyst = item.modes.includes("analyst")
  if (isStandard && isAnalyst) counts.bothModes += 1
  else if (isAnalyst) counts.analystOnly += 1
  else if (isStandard) counts.standard += 1

  if (item.tier === "analyst") counts.analystTier += 1

  const block = (item as { scoringBlock?: string }).scoringBlock
  if (block === "core") {
    if (item.kind === "likert") counts.coreLikert += 1
    else counts.coreChoice += 1
  } else if (block === "validation") counts.validation += 1
  else counts.other += 1
}

console.log(counts)

console.log("\nscored question counts, by exported helper:")
console.log(questionCountsBySet)
console.log(questionCountsByMode)

// ---------------------------------------------------------------------------
// 2. Signal coverage per dimension, per contribution source
// ---------------------------------------------------------------------------

section("2. Declared signal coverage per dimension")

const perDimension: Record<DimensionKey, {
  likert: number
  choiceContributed: number
  totalDenominatorWeight: number
  distinctValues: Set<number>
}> = Object.fromEntries(
  DIMENSIONS.map((d) => [
    d,
    { likert: 0, choiceContributed: 0, totalDenominatorWeight: 0, distinctValues: new Set() },
  ]),
) as never

for (const item of bankItems) {
  const block = (item as { scoringBlock?: string }).scoringBlock
  if (block !== "core") continue
  if (item.kind === "likert") {
    const q = item as CoreLikertQuestion
    const bucket = perDimension[q.dimension]
    if (bucket) bucket.likert += 1
  } else {
    const q = item as ChoiceQuestion
    for (const option of q.options) {
      for (const [dim, value] of Object.entries(option.signals ?? {})) {
        const d = dim as DimensionKey
        const bucket = perDimension[d]
        if (!bucket) continue
        bucket.choiceContributed += 1
        bucket.totalDenominatorWeight += 1
        bucket.distinctValues.add(Number(value))
      }
    }
  }
}

for (const d of DIMENSIONS) {
  const p = perDimension[d]
  const vals = [...p.distinctValues].sort((a, b) => a - b)
  console.log(
    d.padEnd(22),
    "likert:", String(p.likert).padStart(3),
    "choice-signals:", String(p.choiceContributed).padStart(3),
    "min/max signal:", vals.length ? `${vals[0]}..${vals[vals.length - 1]}` : "—",
    "mean-signal:",
    p.choiceContributed > 0
      ? fmt([...vals].reduce((s, v) => s + v, 0) / vals.length)
      : "—",
  )
}

// ---------------------------------------------------------------------------
// 3. Reverse-coding adjacency in the standard core sequence
// ---------------------------------------------------------------------------

section("3. Reverse/forward adjacency in the standard core block")

const standardCore = foundationCoreQuestions.filter(
  (q): q is CoreLikertQuestion => q.kind === "likert" && (q as any).scoringBlock === "core",
)
for (let i = 0; i < standardCore.length; i += 1) {
  const q = standardCore[i]
  const next = standardCore[i + 1]
  const flag =
    next &&
    (q as CoreLikertQuestion).dimension === (next as CoreLikertQuestion).dimension &&
    (q as CoreLikertQuestion).reverse === (next as CoreLikertQuestion).reverse
      ? "  <-- same-direction adjacent pair on same dimension"
      : ""
  console.log(
    String(i + 1).padStart(3),
    q.dimension.padEnd(20),
    String((q as CoreLikertQuestion).reverse ? "REV" : "FWD"),
    q.id,
    flag,
  )
}

// ---------------------------------------------------------------------------
// 4. Synthetic answer constructors
// ---------------------------------------------------------------------------

function bankItemById(id: string): BankItem | undefined {
  return bankItems.find((item) => item.id === id)
}

function makeFirstOptionAnswer(item: BankItem): AnswerValue {
  if (item.kind === "likert") return 4
  const first = (item as ChoiceQuestion).options[0]
  if (!first) return 4
  if (item.modes.includes("analyst") && (item as ChoiceQuestion).allowSecondChoiceInAnalyst) {
    const ranked: RankedChoiceAnswer = { primary: first.id }
    return ranked
  }
  return first.id
}

function makeAnswerVector(
  valueFor: (item: BankItem, index: number) => AnswerValue,
  mode: QuizMode,
): Answers {
  const out: Answers = {}
  const relevant = getFoundationQuestions(mode).map((q) =>
    bankItemById(q.id),
  ).filter((q): q is BankItem => Boolean(q))
  relevant.forEach((item, index) => {
    out[item.id] = valueFor(item, index)
  })
  return out
}

const allFour: AnswerValue = 4

// ---------------------------------------------------------------------------
// 5. Profile shapes
// ---------------------------------------------------------------------------

section("5. Dimension scores under canonical shapes (standard mode)")

function shapeTrace(label: string, maker: Parameters<typeof makeAnswerVector>[0]) {
  for (const mode of ["standard", "analyst"] as QuizMode[]) {
    const answers = makeAnswerVector(maker, mode)
    const dims = computeCoreDimensionScores(answers, mode)
    const audit = computeCoreDimensionAudit(answers, mode)
    const shape = analyzeScoreShape(dims, "extended")
    const canonical = buildCanonicalFoundationResult(dims, "extended")
    console.log(
      "\n" + label + "  [mode=" + mode + "]",
      "\n  dims:",
      DIMENSIONS.map((d) => `${d}=${dims[d]}`).join(" "),
      "\n  families:",
      FAMILIES.map((f) => `${f}=${shape.familyScores[f]}`).join(" "),
      "\n  top family:", canonical.familyKey,
      "| runner-up:", canonical.runnerUpKey,
      "| gap:", fmt(canonical.nearestFitGap),
      "| strategy:", canonical.strategyModifier,
      "| normative:", canonical.normativeModifier,
      "\n  avg|d-4|:", fmt(shape.averageDistanceFromCenter),
      "| max|d-4|:", fmt(shape.maxDistanceFromCenter),
      "| sharpCount:", shape.sharpDimensionCount,
      "\n  denominators:",
      DIMENSIONS.map((d) => `${d}=${audit.weights[d]}`).join(" "),
    )
  }
}

shapeTrace("all-4 baseline", () => allFour)

shapeTrace("all-1 floor", (item) =>
  item.kind === "likert" ? 1 : makeFirstOptionAnswer(item),
)

shapeTrace("all-7 ceiling", (item) =>
  item.kind === "likert" ? 7 : makeFirstOptionAnswer(item),
)

shapeTrace("alternating 1,7,1,7 on Likert index", (item, i) =>
  item.kind === "likert" ? (i % 2 === 0 ? 1 : 7) : makeFirstOptionAnswer(item),
)

shapeTrace("alternating 7,1,7,1 on Likert index", (item, i) =>
  item.kind === "likert" ? (i % 2 === 0 ? 7 : 1) : makeFirstOptionAnswer(item),
)

shapeTrace("monotone ramp 1..7 across Likert index mod 7", (item, i) =>
  item.kind === "likert" ? ((i % 7) + 1) : makeFirstOptionAnswer(item),
)

// ---------------------------------------------------------------------------
// 6. Per-item single-item sensitivity on family ranking
// ---------------------------------------------------------------------------

section("6. Per-item leverage on top family ranking (standard mode)")

const baselineAnswers = makeAnswerVector(() => allFour, "standard")
const baselineDims = computeCoreDimensionScores(baselineAnswers, "standard")
const baselineFamilies = scoreFamilies(baselineDims, "extended")
const baselineOrder = (Object.entries(baselineFamilies) as [FamilyKey, number][])
  .sort((a, b) => b[1] - a[1])
  .map(([f]) => f)
console.log("baseline order:", baselineOrder.join(" > "))
console.log("baseline family scores:", baselineFamilies)

for (const likertId of standardCore.map((q) => q.id)) {
  let flips = 0
  let maxSpread = 0
  const byValue: Record<number, FamilyKey> = {}
  for (let value = 1; value <= 7; value += 1) {
    const answers: Answers = { ...baselineAnswers, [likertId]: value }
    const dims = computeCoreDimensionScores(answers, "standard")
    const fam = scoreFamilies(dims, "extended")
    const ordered = (Object.entries(fam) as [FamilyKey, number][])
      .sort((a, b) => b[1] - a[1])
    byValue[value] = ordered[0][0]
    const spread = ordered[0][1] - ordered[ordered.length - 1][1]
    if (spread > maxSpread) maxSpread = spread
  }
  const distinctTop = new Set(Object.values(byValue))
  if (distinctTop.size > 1) flips = 1
  console.log(
    "  ", likertId.padEnd(22),
    "distinct top families over sweep:", distinctTop.size,
    "| max spread:", fmt(maxSpread),
    "| top-per-value:",
    Object.entries(byValue).map(([v, f]) => `${v}:${f}`).join(" "),
  )
}

// ---------------------------------------------------------------------------
// 7. Calibration sensitivity contrast
// ---------------------------------------------------------------------------

section("7. Calibration sensitivity (identical answers, several calibrations)")

const probeCalibrations = [
  "core",
  "extended",
  "targetedExtended:realist|institutionalist",
  "targetedExtended:institutionalist|constructivist",
  "targetedExtended:constructivist|criticalPoliticalEconomy",
] as const

const calibrationProbeAnswers = makeAnswerVector((item, i) => {
  if (item.kind === "likert") return ((i % 5) + 2) as number // 2..6
  return makeFirstOptionAnswer(item)
}, "standard")

const calibrationProbeDims = computeCoreDimensionScores(calibrationProbeAnswers, "standard")
console.log("dims (calibration-invariant by construction):", calibrationProbeDims)

for (const cal of probeCalibrations) {
  const fam = scoreFamilies(calibrationProbeDims, cal)
  const canonical = buildCanonicalFoundationResult(calibrationProbeDims, cal)
  console.log(
    "  ", cal,
    "\n     familyScores:", FAMILIES.map((f) => `${f}=${fam[f]}`).join(" "),
    "\n     top:", canonical.familyKey,
    "| strategy:", canonical.strategyModifier,
    "| normative:", canonical.normativeModifier,
    "| gap:", fmt(canonical.nearestFitGap),
  )
}

// ---------------------------------------------------------------------------
// 8. Targeted-form answer scoping sanity check
// ---------------------------------------------------------------------------

section("8. Answer-scoping probe (targeted vs full)")

const pair = ["realist", "institutionalist"] as const
const targetedQuestions = getFoundationQuestionsForSet("targetedExtended", pair)
const fullResultQuestions = getFoundationResultQuestions("targetedExtended", pair)
console.log("targeted extension item count:", targetedQuestions.length)
console.log("targeted full-result item count:", fullResultQuestions.length)
console.log("fullExtended item count:", foundationExtendedQuestions.length)
console.log(
  "targeted extension ids:",
  targetedQuestions.map((q) => q.id).join(", "),
)

// Confirm the scorer's internal scope is mode-only, not form-aware.
const allModeAnswered = makeAnswerVector((item, i) =>
  item.kind === "likert" ? ((i % 7) + 1) : makeFirstOptionAnswer(item),
  "analyst",
)
const fullSetScored = generateResult(allModeAnswered, "analyst", "extended")
console.log(
  "\nNOTE: generateResult() has no form parameter; it consumes every",
  "answer reachable through getFoundationQuestions(mode). Callers must",
  "pre-filter with selectFoundationAnswersForSet() before scoring if they",
  "want targeted-form semantics. Observed denom check below.",
)

const auditAll = computeCoreDimensionAudit(allModeAnswered, "analyst")
console.log("analyst-mode denominators:", auditAll.weights)

// ---------------------------------------------------------------------------
// 9. Reverse-adjacency leverage
// ---------------------------------------------------------------------------

section("9. Reverse-pair leverage: dimension response to forward-only vs reverse-only shift")

for (const d of DIMENSIONS) {
  const likertInDim = standardCore.filter((q) => q.dimension === d)
  const forwardIds = likertInDim.filter((q) => !q.reverse).map((q) => q.id)
  const reverseIds = likertInDim.filter((q) => q.reverse).map((q) => q.id)

  if (forwardIds.length === 0 || reverseIds.length === 0) {
    console.log(
      "  ", d.padEnd(22),
      "unbalanced on the standard core: forward=", forwardIds.length,
      "reverse=", reverseIds.length,
      "  (interpret undirected)",
    )
    continue
  }

  const variant = (idList: string[], value: number) => {
    const answers: Answers = { ...baselineAnswers }
    for (const id of idList) answers[id] = value
    return computeCoreDimensionScores(answers, "standard")[d]
  }

  const fUp = variant(forwardIds, 7)
  const fDown = variant(forwardIds, 1)
  const rUp = variant(reverseIds, 7)
  const rDown = variant(reverseIds, 1)
  console.log(
    "  ", d.padEnd(22),
    "delta on dim from (forward 1→7):", fmt(fUp - fDown),
    "| delta on dim from (reverse 1→7):", fmt(rUp - rDown),
  )
}

section("Diagnostic complete. No expectations were asserted and no files were modified.")
```

---

## 9. Closing remarks

**Highest-priority items for the supervisor to raise with the student, ranked:**

1. **M2 + M7** — the "45 %" weight is presented as a single authored choice on the public methods page but is two different operations in Foundation (ratio) and AI Governance (additive-with-clamp). Public language should not unify them.
2. **M8** — the v2 scorer does not enforce form-scoped answer filtering; this is a live integration hazard for the targeted forms.
3. **C1 + C2 + C3** — the family projection mixes explanatory and normative dimensions, and the political-economy dimension conflates salience with structural commitment. Both are stated as design intentions on the method page but are not enforced in the profile matrix.
4. **M6** — cross-calibration label comparability is weaker than the method page's "style outputs travel" line implies.
5. **S2 + S3** — no language key on the calibration registry; the two `getFoundationQuestions` symbols are separate.

Everything empirically testable — response bias, DIF, test-retest stability of family key, construct coverage of the omitted traditions, bilingual invariance — is out of reach of this codebase alone and belongs on the research roadmap, not the editorial backlog.
