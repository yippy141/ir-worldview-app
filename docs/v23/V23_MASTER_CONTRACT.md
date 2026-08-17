# V23 Master Contract

Status: binding architecture/content contract with V23.1 owner decisions recorded

Scope: V23 Foundation archetype presentation, Explore ontology, and V23.2 Map handoff

Repository baseline: `v23-1-archetype-explore` at `f95cc7c1629e7e608910b2413b5d01bbf0fc974d`

Prepared: 2026-08-12

## 0. Purpose and authority

This document reconciles the V23 brief with the implementation and the V22/V22.5 decision record. It is a presentation and content contract. It does not authorize scoring, instrument, calibration, payload, storage, domain-classifier, Tier 1, or Map implementation changes.

Where the current repository and the V23 brief differ, this document records the incompatibility and either freezes the compatible behavior or marks an owner decision. The later V22.5 Foundation identity migration supersedes older V22 wording where those records conflict.

The V23 interpretation stack is:

1. The **Foundation archetype** supplies the headline Foundation reading.
2. A legitimate two-lens **blend** may supply that Foundation result when the existing resolver returns one.
3. **Normative state** and **strategic posture** are modifiers, not additional results.
4. **Closest modeled tradition** is supporting evidence, not a second Foundation result.
5. **Decision Patterns** are authored decision logics and are never calculated, matched, or assigned.
6. Security, Technology, and AI Governance results are separate domain records.
7. Perspective Runs, Current Case judgments, and evidence-coded public positions are contextual records.

### 0.1 Frozen archetype set

V23 keeps exactly four lenses, two posture signs, and these eight pure outcomes:

| Lens | Applying-advantage posture `+` | Restraint posture `-` |
|---|---|---|
| `P` | `P+` Kairos | `P-` Shi (勢) |
| `R` | `R+` Grotian | `R-` Concert |
| `M` | `M+` Satyagraha | `M-` Musyawarah |
| `S` | `S+` Dirigisme | `S-` Dependencia |

The V23 brief abbreviates `P-` as “Shi.” The current content, V22 naming decision, and compatibility tests lock the display name as **Shi (勢)**. V23.1 must preserve `Shi (勢)` unless the owner explicitly approves a presentation-only rename and its test/copy migration. No code, lens, posture, family, or payload meaning may change.

There is no ninth scored archetype in V23. New archetype codes require new dimensions, item coverage, a scoring version, calibration, and a separate product decision; presentation work cannot create them.

### 0.2 Frozen methodological boundaries

- Do not describe any score as a population percentile unless a representative population basis exists.
- Do not imply that archetype distance, blend frequency, Map density, or neighboring marks are empirically validated.
- Do not use nationality, citizenship, culture, or saved contextual records to adjust a Foundation result.
- Do not describe automated tests, screenshots, AI review, or the cognitive-interview protocol as human validation.
- No completed human usability round exists as of 2026-08-12. No reliability, validity, representativeness, or cross-cultural-equivalence claim is available.
- Tier 1 remains off by default and outside V23.1. The historical Preview activation record does not authorize Production or recruitment.

## A. Current ontology audit

“Versioned” below distinguishes scored/persisted format versioning from editorial content versioning. A versioned payload does not make its currently rendered prose historically frozen.

| Public object | Code owner | Content owner | Public route(s) | May be assigned to a user? | In Profile? | On Worldview Map? | Versioned? | Current naming conflict | Migration requirement |
|---|---|---|---|---|---|---|---|---|---|
| **Foundation archetype** | `lib/archetypes.ts`, using Foundation output from `lib/scoring.ts`, `lib/scoring/v2.ts`, and `lib/share.ts` | `content/archetypes.json`; historical comparison in `content/archetype-evidence.json` | `/results/[payload]`, `/profile`, `/profile/share/[payload]`, `/archetypes/[slug]` | **Yes. The headline Foundation reading.** | Yes, resolved from the exact Foundation payload | Only as an unnamed continuous baseline point today | Foundation payload/scorer/calibration are versioned; base copy is not; evidence file is v1 | `Shi` versus current `Shi (勢)`; content split across two records | Freeze resolver and eight codes. Add a versioned presentation-content contract and enrich the existing detail URLs in place. Never infer the result from cached family fields. |
| **Blend** | Runtime construction in `lib/archetypes.ts`; threshold supplied by registered calibration | No authored catalog today | No detail route; rendered in result/Profile | **Yes**, when the existing resolver returns a low-differentiation two-lens result | Yes | Only the same continuous baseline point today | Indirectly scorer/payload/calibration-versioned; no content version | All 6 lens pairs at both signs are mechanically possible, but “common” or empirically distinct blends are not established | Preserve resolver behavior. Separate mechanically valid composite output from a reviewed `commonBlends` editorial list. Never invent a hybrid historical analogue. |
| **Normative modifier** | `lib/types.ts`, `lib/scoring/v2.ts`, suffix mapping in `lib/archetypes.ts` | Current glosses in `lib/copy/glosses.ts` and result/Profile copy | `/results/[payload]`, `/profile`, share views | Yes, **only as a modifier** | Yes | Not explicit; `orderJustice` contributes to the secondary projection | Foundation payload/scorer-versioned | Persisted `Pluralist / Conditional Solidarist / Universalist` versus proposed `order-first / conditional / justice-first` | Keep persisted enums and `o/c/j` suffixes. Add owner-approved neutral display aliases; never present a ranked scale or second archetype. |
| **Strategic posture** | `lib/types.ts`, `lib/scoring/v2.ts`, `postureFromStrategyModifier` in `lib/archetypes.ts` | Result/Profile explanatory copy | `/results/[payload]`, `/profile` | Yes, as supporting modifier and archetype sign | Yes | Not represented by the current projection because `restraint` is omitted | Foundation payload/scorer-versioned | Three-state `Restrainer / Hedger / Maximizer` is not one-to-one with two signs; `Hedger` resolves to `+` at raw restraint `<= 4` and `-` above `4` | Preserve all thresholds and the `Hedger` split. Explain `+` as applying advantage and `-` as restraint, not good/bad, more/less, or a direct rename of the three-state modifier. |
| **Closest modeled tradition** | Family calculation in `lib/scoring/v2.ts`; canonical labels/slugs in `lib/worldview-config.ts` | Long-form tradition copy in `lib/explore-content.ts` | `/explore/[tradition]`, result/Profile support sections | Calculated, but **never a second Foundation result** | Yes, subordinate to the archetype | Four authored anchors and family facets | Family result is payload/scorer-versioned; editorial copy is not | Frozen scorer labels use adjective/person forms while public tradition pages use noun forms | Retain four routes. Keep frozen scorer labels, add one canonical public tradition-noun mapping, and stop introducing duplicate labels/slugs. Do not refactor frozen scoring in V23.1. |
| **Decision Pattern** | Stable IDs, fingerprints, and compatibility contract in `lib/atlas-lite.ts` | English copy in `lib/atlas-lite.ts`; approved zh subset in `content/locales/zh-Hans/worldview-profiles.ts`; cases/mental models in separate content libraries | `/explore/atlas/[id]` and `/zh/explore/atlas/[id]`; collection is the Map route `/explore/atlas` | **Never** | Only a collapsed browse link, never a selected Pattern | Yes; `atlas-patterns` is currently on by default | No explicit catalog/content version | Internals still use `AtlasLitePattern`, `WorldviewProfile`, `profileId`, legacy `name`, and public `publicName`, competing with user Profile terminology | Freeze all ten IDs, order, URLs, technical names, fingerprints, neighbor links, and query key. Publicly say “Decision Pattern.” V23.2 makes it an optional overlay; do not revive matchers. |
| **Module headline** | `lib/modules/types.ts`, Security/Technology definitions, bank/scorer version registries | Domain module content | `/modules/[slug]/results/[payload]` | Yes, **within its named domain only** | Yes, as a separate Security or Technology record | No | Bank/scorer/payload-versioned | An unqualified headline can sound like a Foundation result | Always qualify as “Security read” or “Technology read.” No semantic or code migration in V23.1. |
| **AI Governance archetype** | `lib/ai-governance-types.ts`, scorer and version registries | AI result and atlas content | `/ai/results/[payload]`, `/ai/atlas/[id]` | Yes, **within AI Governance only** | Yes, separately | No on the IR Map; AI-scoped reference records are list-only | Bank/scorer/payload-versioned | The public word “archetype” competes with the Foundation archetype | Preserve internal keys, types, payloads, routes, and existing labels. In shared IA use “AI Governance result” or fully qualified “AI Governance archetype,” never an unqualified identity. |
| **Perspective Run** | `lib/perspectives/types.ts`, `catalog.ts`, `scoring.ts`, and `share.ts` | Perspective catalog and route copy | `/perspectives/[perspectiveId]/result/[payload]` | User-generated contextual result, **not an identity** | Yes | Yes, latest saved run per Perspective ID | Payload v1 plus `scenarioSetVersion`, locale/copy provenance | “Profile shift” could be read as a replacement result | Frame as a role-conditioned comparison to a stable baseline. Preserve all six Perspective IDs and issued payloads. |
| **Reference thinker/public position** | `lib/reference-profiles/types.ts`, `validation.ts`, `catalog.ts` | Evidence-coded catalog with source, date, scope, qualification, reviewers, and status | `/explore/reference`, `/explore/reference/[id]`, approved zh counterparts | **Never** | No | Yes when the reviewed seven-dimension evidence is complete; otherwise list-only | Schema v1, catalog v2, record/history/review/evidence-window versioning | Sixteen unsourced “Associated thinkers” in tradition content compete with the four evidence-coded public records | The reference-profile contract is authoritative. Link only reviewed records as positions. Recast unsourced names as reading-list associations or withhold them; never auto-code a person into an archetype. |
| **Current Case reading** | `lib/current-cases/types.ts`, validation/catalog; stable Pattern references in case JSON | `content/current-cases/*.json` | `/cases/[slug]` and source/correction routes | **Never** | The user’s saved judgment may appear; the reading itself is not a classification | No | Case schema v2 and per-case version/review/freshness | Legacy `profileId` names a Decision Pattern; related-archetype links do not exist | Freeze the legacy field and Pattern IDs. Keep `missing-authored-mapping` fail-closed. Any archetype relation must be a new reviewed editorial association with rationale, never inferred through a Pattern. |

### A.1 Conceptual-slot collisions and binding resolution

| Collision | Binding resolution |
|---|---|
| Foundation archetype vs closest tradition | Archetype answers “what is my Foundation result?” Tradition explains the nearest modeled family. Archetype is always visually and verbally primary. |
| Foundation archetype vs Decision Pattern | Only the archetype supplies the headline Foundation reading. “Decision Pattern” is the sole public term for the ten editorial logics. Legacy `profile` identifiers remain internal compatibility details. |
| Foundation archetype vs AI Governance archetype | Qualify the AI object by domain in every shared surface. It cannot replace, revise, or numerically feed the Foundation. |
| Two-sign posture vs three-state Strategy modifier | Display both only with an explanation that the sign is a presentation derivation and that `Hedger` can fall on either side. Do not collapse or rename persisted states. |
| Evidence-coded public positions vs “Associated thinkers” | Only reference-profile records may be presented as dated positions. Unsourced associations are reading guidance, not a profile, resonance score, or archetype assignment. |
| Current Case reading vs saved user judgment | The case contains authored readings; Profile stores the user’s judgment. Neither is a Foundation classification. |
| Continuous Map position vs archetype matrix | The 4×2 matrix is the primary categorical explanation in V23.2. The continuous projection survives as a secondary, explicitly limited view. |
| `/explore/atlas` Map vs `/explore/atlas/[id]` Pattern pages | Preserve both namespaces. Navigation labels distinguish “Worldview Map” from “Decision Pattern detail”; no route rename is required. |
| Module headline vs Foundation result | Every module label carries its domain. Profile keeps domain records below and separate from the Foundation payoff. |

## C. Canonical archetype content contract

### C.1 Ownership and versioning

The canonical V23 presentation catalog is an editorial record layered over the frozen resolver. It must not be encoded into Foundation payloads.

- **Engineering owner:** codes, slugs, schema, validation, relation integrity, rendering safety.
- **Methodology owner:** claims about what the result means, limitations, blend/modifier interpretation.
- **Editorial owner:** glosses, instincts, tradeoffs, objections, questions, and page structure.
- **Research owner:** historical and current claims, source ledger, evidence windows, qualifications, and review state.
- **Localization owner:** approved field-level adaptations and source-copy version.

The catalog carries `schemaVersion` for structural compatibility and `contentVersion` for editorial provenance. A prose revision increments `contentVersion`; it does not alter the score or payload. Old payloads continue to resolve through their registered scorer/calibration and render the current compatible presentation record. Code, slug, lens, posture, and family mapping are frozen for V23.

### C.2 Proposed typed contract

The notation below specifies the future data shape; it is not implementation code for this Prompt 0 PR.

```ts
import type {
  Archetype,
  BlendArchetype,
  LensCode,
  PostureSign,
} from "@/lib/archetypes";
import type { ModuleSlug } from "@/lib/modules/types";
import type { FamilyKey } from "@/lib/types";

type PureArchetypeCode = Archetype["code"];
type BlendCode = BlendArchetype["code"];
type ArchetypeSlug =
  | "p-plus" | "p-minus"
  | "r-plus" | "r-minus"
  | "m-plus" | "m-minus"
  | "s-plus" | "s-minus";

// Created only by successful lookup in the surviving validated catalogs.
type CurrentCaseId = string & { readonly __catalog: "CurrentCaseId" };
type DecisionPatternId = string & { readonly __catalog: "DecisionPatternId" };
type FocusAreaId = ModuleSlug;

type ClaimKind =
  | "authored-interpretation"
  | "historical-fact"
  | "scholarly-interpretation"
  | "current-policy-claim";

type ReviewId = string & { readonly __catalog: "ReviewId" };
type SourceId = string & { readonly __catalog: "SourceId" };

type FieldState<T> =
  | { status: "reviewed"; value: T; qualification: null; reviewIds: ReviewId[] }
  | { status: "partial"; value: T; qualification: string; reviewIds: ReviewId[] }
  | {
      status: "research-required" | "withheld";
      value: null;
      qualification: string | null;
      reviewIds: ReviewId[];
    };

type ClaimValue = {
  id: string;
  kind: ClaimKind;
  text: string;
  sourceIds: SourceId[];
  scope: string | null;
  asOf: string | null;
  evidenceWindow: { start: string; end: string } | null;
  reviewDue: string | null;
};

type Claim = FieldState<ClaimValue>;

type SourceRecord = {
  id: SourceId;
  title: string;
  authorOrInstitution: string | null;
  publisher: string | null;
  href: string;
  publishedAt: string | null;
  accessedAt: string | null;
  sourceKind: "primary" | "scholarly" | "reference" | "current-official";
  metadataStatus: "complete" | "legacy-minimal" | "research-required";
  status: "reviewed" | "provisional" | "superseded";
};

type AuthoredRelation<Target extends string> = {
  targetId: Target;
  rationale: Claim;
};

type NormativeVariant = {
  state: "o" | "c" | "j";
  publicLabel: "order-first" | "conditional" | "justice-first";
  interpretation: Claim;
};

type Neighbor = {
  code: PureArchetypeCode;
  separatingQuestion: Claim;
};

type BlendPresentation = {
  withLens: LensCode;
  posture: PostureSign;
  sharedPremise: Claim;
  unresolvedDisagreement: Claim;
  separatingCase: Claim;
  testingFocusAreaId: FocusAreaId | null;
};

type DomainExpression = {
  domain: "security" | "technology" | "ai-governance";
  hypothesis: Claim;
  disclaimer: "editorial-hypothesis-not-domain-result";
};

type ArchetypeContentRecord = {
  code: PureArchetypeCode;
  slug: ArchetypeSlug;
  canonicalName: string;
  plainLanguageGloss: Claim;
  lens: LensCode;
  posture: PostureSign;
  familyKey: FamilyKey;
  noticesFirst: FieldState<Claim[]>;
  likelyPolicyInstincts: FieldState<Claim[]>;
  acceptedTradeoff: Claim;
  strongestCaseForReading: Claim;
  strongestObjection: Claim;
  commonFailureMode: Claim;
  evidenceThatWouldWeakenFit: FieldState<Claim[]>;
  nearestNeighbors: FieldState<Neighbor[]>;
  normativeVariants: [NormativeVariant, NormativeVariant, NormativeVariant];
  commonBlends: FieldState<BlendPresentation[]>;
  likelyDomainExpressions: FieldState<DomainExpression[]>;
  historicalAnalogue: {
    label: string;
    displayDate: string;
    normalizedDate: { startYear: number | null; endYear: number | null } | null;
    overviewHref: string;
    whyItFits: Claim;
    whereItBreaks: Claim;
    nameNote: Claim | null;
  };
  evidenceStatus:
    | "reviewed"
    | "partial"
    | "legacy-v1-provisional"
    | "research-required";
  relatedCurrentCases: FieldState<AuthoredRelation<CurrentCaseId>[]>;
  relatedDecisionPatterns: FieldState<AuthoredRelation<DecisionPatternId>[]>;
  publicationState: "draft" | "published" | "withheld";
  recordReviewIds: ReviewId[];
};

type ArchetypeContentCatalog = {
  schemaVersion: 1;
  contentVersion: string;
  evidenceCatalogVersion: string;
  locale: "en";
  records: ArchetypeContentRecord[]; // exactly eight, one per frozen code
};

type ArchetypeEvidenceCatalog = {
  schemaVersion: 2;
  evidenceCatalogVersion: string;
  sources: SourceRecord[];
  reviews: Array<{
    id: ReviewId;
    subjectIds: string[];
    contentVersion: string | null;
    evidenceCatalogVersion: string;
    reviewerId: string;
    reviewedAt: string;
    reviewerRole: "editorial" | "research" | "methodology" | "localization";
    outcome: "approved" | "changes-required" | "blocked";
    note: string;
  }>;
};
```

`familyKey` is the single closest-tradition key; selectors expose the display phrase “closest modeled tradition” without storing a duplicate field. The catalog owns every stable slug. `lib/archetype-evidence.ts` may parse, validate, and build paths from those values but must not own a second table.

Renderability is strict: `reviewed` renders normally; `partial` renders its value with the required visible qualification; `research-required` and `withheld` render no value and at most one bounded section-status notice. `publicationState="published"` is required for a public record. The bibliography is derived from the `sourceIds` referenced by renderable claims; the public “reviewed sources” selector returns only referenced records with `status="reviewed"`, while provisional sources appear in a separately labeled ledger. There is no separate `reviewedSourceIds` list to drift. The renderer must never fill a missing field with generated prose, a person assignment, or another locale’s long-form copy.

### C.3 Claim-class rules

| Claim class | What it covers | Required evidence and display treatment |
|---|---|---|
| `authored-interpretation` | What the archetype notices, likely instincts, tradeoff, objection, failure mode, separating questions | Sources optional; editorial and methodology `ReviewId` records tied to the content version are required. Must be phrased as an interpretation, not observed population behavior. |
| `historical-fact` | Dates, events, institutions, biographies, named texts | At least one reviewed source; scope and qualification where contested. Historical analogy is comparison, never assignment. |
| `scholarly-interpretation` | A scholar’s argument, a tradition reading, or contested historiography | Reviewed scholarly source required; attribute the interpretation and state material disagreement. |
| `current-policy-claim` | Current government, party, movement, institutional, or policy position | Primary/authoritative source required plus `asOf`, evidence window, scope, qualification, review date, and review due date. No timeless actor label. |

**V23.1 bounded-beta supersession:** the owner-authorized root publication
record permits the 104 AI-assisted English `authored-interpretation` sentences
to render only as visibly qualified `partial` copy while human editorial review
is pending. It does not create sentence-level editorial or methodology
`ReviewId` records, change any claim to `reviewed`, provide external-expert
review, or make a validation claim. The normal `ReviewId` rule above continues
to govern any claim represented as `reviewed` and any later reviewed revision.

The existing psychometric evidence audit does not review these historical or policy claims. V23.1 needs focused schema, source-integrity, and publication-status tests; it must not relabel those tests as validity evidence.

Migration must not fabricate bibliography metadata. Existing `{label, href}` sources migrate losslessly to `title` and `href`; unknown author, publisher, publication date, and access date remain `null`, with `metadataStatus="legacy-minimal"` and `status="provisional"`. The currently public `whyItFits` and `whereItBreaks` claims may remain visible only as `partial` under the explicit record-level `legacy-v1-provisional` status and a visible source-metadata qualification. This grandfather rule applies only to those existing v1 claims. New historical, scholarly, or current-policy claims cannot publish until the normal source rule passes. An owner must approve this binding path before either schema migration; engineering must not infer missing metadata or browse for it in the implementation PR.

### C.4 Reuse, migration, and research ledger

| Field/source | Treatment |
|---|---|
| Eight `code`, `name`, `gloss`, `familyKey`, and analogue label/display-date/link values in `content/archetypes.json` | Reuse losslessly. Preserve exact codes, current owner-locked names, and date strings. Move atomically only if Plan A is approved. |
| `whyItFits`, `whereItBreaks`, optional P-/R+ `nameNote`, and source URLs in `content/archetype-evidence.json` | Reuse as migration inputs. Move public prose into the canonical English catalog as typed claims; move the source ledger and review history into the evidence catalog. Do not retain duplicate prose in both files. Existing links alone do not satisfy all new source metadata. |
| `lens`, `posture`, and slug | Currently derived. The owner-selected canonical identity record becomes their single editor-facing manifest under either Plan A or B; validate them against the code and expose them through the frozen identity accessor. Do not define a second slug table. |
| Foundation family payoff and tradition copy | May seed editorial research, but cannot be copied mechanically into posture-specific archetypes. |
| Notices, policy instincts, accepted tradeoff, strongest case/objection, failure mode, weakening evidence | New authored interpretation. V23.1 uses the bounded owner-authorized `partial` exception above; a `reviewed` state still requires editorial and methodology review. |
| Neighbors and separating questions | New authored relations. Validate that every code resolves and no item points to itself. |
| Normative variants | New presentation copy over frozen `o/c/j` states. It does not alter scoring. |
| Common blends | New, curated presentation relations. “Common” means editor-selected for explanation, not measured prevalence. |
| Likely domain expressions | New editorial hypotheses only; must be visibly separate from actual Security, Technology, and AI records. |
| Related Current Cases and Decision Patterns | Later reviewed editorial relations with rationales. Use `FieldState` so a reviewed empty array and a research-required field are distinguishable; no automatic family-to-Pattern or Pattern-to-case bridge. |
| Thinker, leader, government, party, movement, or organization resonance | Use the reference-profile evidence model. Requires date, scope, sources, qualification, and partial/strong support coding. Never an archetype assignment. If an existing historical analogue names a person, compare a dated argument, work, or decision—not the person as a type. |

The analogue’s `whyItFits` is not the archetype’s `strongestCaseForReading`; the former defends a historical comparison, while the latter explains the user-facing interpretation. They must remain distinct fields.

## D. Variant and blend presentation

### D.1 Normative variants

The public aliases proposed for owner approval are:

| Persisted state | Suffix | Public alias | Neutral explanation |
|---|---:|---|---|
| `Pluralist` | `o` | **Order-first** | Starts by protecting coexistence, continuity, and limits on imposed agreement. |
| `Conditional Solidarist` | `c` | **Conditional** | Treats order and justice claims as conditional on the case, authority, and likely consequences. |
| `Universalist` | `j` | **Justice-first** | Starts by asking what protection or obligation is owed beyond settled order. |

These are display aliases only. The persisted enums, score thresholds, and suffixes do not change.

Presentation rules:

- Use equal type size, weight, space, and neutral color for all three.
- Display in semantic state order `o / c / j`, but explicitly state that sequence is an orientation, not a moral ladder.
- Do not use “low/high,” progress bars, medals, green/red, or a central state styled as the sensible compromise.
- Each archetype detail uses the same slots for all three variants. No state receives longer or more favorable copy by default.
- On a user result, show only the resolved modifier first; make the other variants available as comparison, not alternative diagnoses.

### D.2 Blends

The existing resolver may return any two distinct lenses at the same posture. V23 preserves that output without claiming that all twelve mathematical pairs are distinct empirical types.

A **reviewed pair-specific** blend presentation must show:

1. both active lens codes and names at equal visual weight;
2. the shared premise that makes the pair coherent;
3. the unresolved disagreement between the lenses;
4. one kind of case that could separate them;
5. one Focus Area that could test the tension, if an authored link exists;
6. the shared posture sign and the separate normative modifier;
7. a statement that the result is a family of nearby profiles, not a new natural kind.

The code uses canonical lens order `P / R / M / S` for stable display; that order must not imply a primary and secondary result. If future presentation needs to describe which family scored first, it may expose a presentation-only `leadingLens` from the already-decoded result, but must not change the blend code or give the two names unequal headline status.

An unreviewed pair preserves the existing compatibility label/gloss, shows the two reviewed archetype names/glosses, shared sign, and resolved normative modifier, then says that a pair-specific interpretation has not been editorially reviewed. It does **not** synthesize a shared premise, disagreement, separating case, or Focus Area at runtime. Only reviewed entries in `commonBlends` receive those deeper slots. “Common” is editorial shorthand and must not be presented as observed prevalence. Blends never receive invented hybrid analogues, unique sigils, new codes, or separate population claims. The product must not be marketed as “60 types.”

## G. V23.2 Worldview Map handoff contract

V23.1 documents this interface but does not implement the Map redesign.

### G.1 Primary and secondary views

- **Primary:** a categorical 4 × 2 archetype matrix.
- **Columns:** `P`, `R`, `M`, `S` in canonical order.
- **Top row:** applying-advantage posture `+`.
- **Bottom row:** restraint posture `-`.
- **Cells:** exactly one pure archetype each; no ninth cell and no empty “center type.”
- **Secondary:** the existing continuous two-axis projection, still identified by `FIELD_PROJECTION_VERSION = 1` until a separately reviewed change.

The continuous projection cannot separate `+/-` pairs because restraint is not in its weights. It therefore cannot be used to manufacture a posture position or validate the matrix. Its axes, synthetic normalization, and limits remain visible in Methods.

### G.2 Data contract

```ts
import type {
  Archetype,
  BlendArchetype,
  LensCode,
  PostureSign,
} from "@/lib/archetypes";
import type { FoundationScoringCalibration } from "@/lib/scoring";
import type { FoundationCompletionRecord } from "@/lib/share";
import type { DimensionScores, NormativeModifier, SharePayload } from "@/lib/types";

type PureArchetypeCode = Archetype["code"];
type BlendCode = BlendArchetype["code"];

type ArchetypeMatrixCell = {
  lens: LensCode;
  posture: PostureSign;
  archetypeCode: PureArchetypeCode;
};

type NormativeStatePresentation = {
  persistedState: NormativeModifier;
  suffix: "o" | "c" | "j";
  publicLabel: "order-first" | "conditional" | "justice-first";
};

type BlendPlacement = {
  archetypeCode: BlendCode;
  posture: PostureSign;
  activeCells: [PureArchetypeCode, PureArchetypeCode];
  connectorKind: "shared-result";
};

type WorldviewMapBaseline = {
  source: "exact-foundation-payload";
  payloadVersion: SharePayload["v"];
  scoringCalibration: FoundationScoringCalibration;
  provenance: FoundationCompletionRecord;
  resolvedArchetype: Archetype | BlendArchetype;
  normativeState: NormativeStatePresentation;
  dimensionScores: DimensionScores;
  continuousProjection: {
    version: 1;
    x: number;
    y: number;
    limitation: "posture-not-represented";
  };
};
```

For a pure result, highlight one cell. For a blend, highlight the two same-row cells and connect them; do not create a midpoint, ninth cell, weighted ghost, or fabricated average. The normative modifier appears as adjacent text/chip annotation and in details, never as a third spatial axis, cell, color rank, or second archetype.

The baseline must be resolved from the exact decoded Foundation payload through the registered compatibility path. `scoringCalibration` and `provenance` are resolver outputs, not new fields claimed to exist in issued payloads. V2-V4 retain the current legacy reconstruction/default provenance conventions and preserved encoded identity; the Map must not imply that their original form/calibration was recorded when it was not. Do not store a new archetype ID in Profile and do not reconstruct identity from cached `familyKey` fields.

### G.3 State, defaults, and empty state

- The eight-cell matrix is reference structure and always renders; it is not a toggleable data layer.
- An exactly reconstructable Foundation result highlights one cell or two blend cells. A missing, invalid, or legacy-unreconstructable Foundation shows no highlight, explains that no baseline is available, and offers the existing Foundation CTA. It never selects a family, Pattern, module, or cached identity instead.
- New navigation starts with no contextual overlay selected. The baseline highlight is independent of the overlay set.
- Preserve `view=map|list` with its current meaning. V23.2 introduces `projection=matrix|continuous`; a bare/invalid value normalizes to `matrix`.
- To preserve old deep links, an URL with no `projection` but with legacy contextual `layers` or `sel` query data enters `continuous` compatibility mode. A bare `/explore/atlas` enters `matrix`. Canonical serialization writes `projection` explicitly after the user changes view.
- The complete semantic list is available from either projection and states which items have no eligible spatial position.

### G.4 Layers and overlap

- Decision Patterns are optional, off-by-default editorial overlays. Preserve all ten IDs, routes, fingerprints, and the opaque `atlas-patterns` compatibility key.
- Reference positions are dated, scoped, qualified evidence snapshots. Only records satisfying the existing review/completeness contract may receive continuous coordinates; incomplete and AI-only records stay in the semantic list.
- Perspective Runs remain user-owned contextual shifts, not identities.
- Focus Area and Current Case links may appear in details, but do not become scored Map objects without a separate contract.
- Only the exact-payload Foundation baseline may highlight matrix cells. Decision Patterns, reference positions, and Perspective Runs may plot only in the secondary continuous view and appear in the semantic list/details. They cannot be placed in an archetype cell unless a later, separately reviewed, explicitly non-assigning categorical relation contract authorizes it.
- Preserve the current opaque layer identities `my-profile`, `atlas-patterns`, `perspective-runs`, and `reference-profiles` through query compatibility. `friends` and `commons` remain dormant and must not be activated by the redesign.
- Exact coordinate collisions form one accessible cluster at the canonical coordinate.
- Near-collisions may use deterministic stacking, leader lines, or temporary fan-out as an interaction affordance. Every item retains its source coordinate and a semantic list entry.
- Never jitter, randomize, or permanently displace a source position to imply difference.
- Every visual layer has semantic-list parity, keyboard access, non-color encoding, visible focus, and a text label.
- Print renders a static 4×2 matrix plus the complete semantic list, expands interpretation-critical details, and hides query controls, fixed drawers, and transient fan-out state.

### G.5 Responsive, interaction, and print acceptance

- At 390px/400% reflow, group the matrix by lens with two posture rows in semantic order; understanding must not depend on horizontal scrolling.
- Interactive controls and marker hit areas are at least 44×44px. This applies to controls, disclosure summaries, and linked rows—not ordinary inline prose links.
- The toolbar uses an appropriate navigation/group landmark and accessible name, not only an `aria-label` on a plain `div`.
- The fixed mobile detail sheet is modal: it uses dialog semantics, moves and contains focus, makes the obscured background inert, closes on Escape, and restores focus. The desktop detail rail remains a non-modal complementary region.
- Non-color shape/text encoding, semantic-list parity, visible focus, and deterministic keyboard order survive both projections.
- Print is independent of query/open state: hide controls, fixed sheets, drawers, and fan-out; print all eight cells, the selected baseline’s textual explanation when available, and the complete semantic list.
- V23.2 must add Map-specific print rules; the current global print stylesheet is not sufficient.

### G.6 V23.2 migration surface

The Map PR will need to inspect and, where required, migrate:

- `app/explore/atlas/page.tsx`
- `app/explore/atlas/page.module.css`
- `app/[locale]/explore/atlas/page.tsx`
- all files under `components/field/`
- all files under `lib/field/`
- `lib/results/position.ts`
- `lib/results/map-layout.ts`
- compact position consumers in Results, Quiz, Profile Perspective Runs, Perspective result, and reference detail routes
- `lib/atlas-lite.ts` only through a compatibility adapter if overlay data moves
- `content/locales/zh-Hans/worldview-map.ts`
- `tests/field.test.mts`, `tests/field-items.test.mts`, `tests/map-layout.test.mts`, `tests/position.test.mts`, reference tests, i18n tests, and Map E2E coverage

V23.2 must preserve legacy Map query keys such as `layers`, `sel`, and `view`, or provide a documented compatibility parser. It must also remove the structural possibility of unapproved zh long-form fallback in `lib/field/items.ts`; missing localized long copy fails closed to a translated availability notice.

## H. Route and compatibility contract

### H.1 Frozen routes and formats

| Surface | Frozen compatibility requirement |
|---|---|
| Foundation results | Preserve `/results/[payload]` and `/zh/results/[payload]`; Foundation payload V2-V5 continue to decode through registered compatibility paths. |
| Profile share | Preserve `/profile/share/[payload]`, `/zh/profile/share/[payload]`, and Profile Share V1-V3. Preserve Profile Store V1-V5. |
| Profile comparison | Preserve `/compare?left=<Profile Share>&right=<Profile Share>` and resolve both Foundation identities through their compatible payloads. |
| Archetype detail/history | Preserve `/archetypes/p-plus`, `/archetypes/p-minus`, `/archetypes/r-plus`, `/archetypes/r-minus`, `/archetypes/m-plus`, `/archetypes/m-minus`, `/archetypes/s-plus`, and `/archetypes/s-minus`. Enrich these pages in place. Preserve the safe `?from=/results/<opaque>` return-path allowlist. |
| Tradition detail | Preserve `/explore/realism`, `/institutionalism`, `/constructivism`, and `/critical-political-economy`. |
| Decision Patterns | Preserve all ten `/explore/atlas/[id]` routes and their `/zh` counterparts, IDs, order, legacy names, fingerprints, neighbors, and public names. |
| Worldview Map | Preserve `/explore/atlas`, `/zh/explore/atlas`, opaque layer ID `atlas-patterns`, and existing valid query links. |
| Reference positions | Preserve `/explore/reference`, `/explore/reference/[id]`, `/zh/explore/reference`, and `/zh/explore/reference/[id]`, plus IDs, evidence windows, and list-only behavior. |
| Domain/context routes | Preserve module routes; `/ai/results/[payload]`, `/ai/atlas`, and `/ai/atlas/[id]`; Perspective routes; Current Case routes; and every associated payload/version registry. |
| Locale model | English stays unprefixed; Simplified Chinese stays under `/zh`; locale detection and cookie behavior do not change. |

The ten frozen Decision Pattern IDs are:

`broad-spectrum-bridge-builder`, `constraint-first-realist`, `competitive-balancer`, `coalition-pragmatist`, `institution-builder`, `legitimacy-attuned-reader`, `justice-forward-solidarist`, `structural-inequality-critic`, `development-sovereignty-builder`, and `cross-pressured-synthesizer`.

### H.2 New routes, canonical URLs, and redirects

- Add **English** `/archetypes` as the collection index.
- `/explore` keeps its URL and becomes the ontology hub.
- The existing code slugs remain the canonical archetype detail URLs. Do not introduce name-based aliases in V23.1.
- Add the new index, all eight archetype details, and all four tradition details to the English sitemap.
- Do not create zh `hreflang` alternates, sitemap entries, or approved-route declarations for unapproved routes. Retain the explicit status page’s user-controlled link to the English source route.
- **V23.1 redirect set: empty.** No existing route moves, and no new alias needs a redirect.

### H.3 Simplified Chinese contract

V23.1 long form is English-only.

- `/zh/explore` and `/zh/archetypes*` continue to render the explicit translation-status surface through the locale catch-all.
- Do not add those paths to `approvedChinesePaths` or the approved dynamic route patterns.
- Existing zh Foundation result/Profile behavior follows V22.5: show the locale-neutral canonical name/code plus a visible translation-review notice; omit unapproved English gloss, analogue, evidence, objection, and domain-expression prose.
- `/zh/explore/atlas`, Decision Pattern details, and reference routes retain their current separately approved content contracts.
- A missing zh record must never use `?? englishLongForm`. It returns an approved local notice, locale-neutral code/ID where declared, or no public field.
- Any future Chinese archetype file must name its `sourceCopyVersion`, approved fields, omissions, reviewer, and status before the route becomes approved.

### H.4 Invalid and legacy states

Invalid Foundation payloads continue to fail closed with the existing recovery path. A Profile whose exact Foundation result cannot be reconstructed keeps subordinate records but marks the Foundation unavailable; it must not fall back to a cached tradition, Decision Pattern, or module result. No V23 content version is added to old payloads.

## Repository contradictions and planned disposition

| Current contradiction | Disposition |
|---|---|
| V23 brief says `Shi`; repository content/tests say `Shi (勢)` | Preserve repository value pending the explicit owner call below. |
| Older V22 Chinese naming note said to omit the archetype; V22.5 and current code show canonical name/code plus a notice | V22.5 supersedes the older note. Keep canonical name/code and omit unapproved long form. |
| `/explore` is currently a tradition-led essay and does not explain the assigned-archetype ontology | Recompose in V23.1 under the nine-section IA in the implementation plan. |
| `/archetypes` index is absent; the eight detail routes currently contain only historical comparison evidence | Add the index and enrich the same eight routes in V23.1; do not replace or redirect them. |
| Current Map is a continuous projection with Decision Patterns on by default; it cannot represent posture because restraint is absent | Do not patch around it in V23.1. Implement the 4×2 primary matrix and optional overlays in V23.2; preserve projection v1 as secondary. |
| Tradition pages publish sixteen unsourced “Associated thinkers” cards that do not meet the dated evidence-coded position contract | Remove those public position cards in V23.1; link only reviewed reference records or clearly identified reading associations. |
| All twelve two-lens/same-sign combinations are mechanically resolvable, while empirical distinctness/commonness is unestablished | Preserve compatibility, show the two owner-authorized-beta component readings plus a pair-review notice, and reserve relational prose for a future human-editorially-reviewed list. |
| Foundation sign has two states while Strategy modifier has three | Explain both and preserve the Hedger split; do not merge or rename scoring states. |
| Decision Pattern internals use `profile` terminology and AI uses the unqualified type name `archetype` | Freeze internal compatibility names; disambiguate public copy as “Decision Pattern” and “AI Governance result/archetype.” |
| Archetype presentation copy is split, largely unversioned, and partially outside public-copy audit coverage | Use one canonical accessor and expand audit roots in V23.1. Prefer smaller in-place Plan B for this one PR unless the owner explicitly accepts Plan A’s migration surface; never add parallel identity records. |
| `lib/field/items.ts` structurally permits an English fallback for a missing zh Pattern/Perspective record | Current ten approved Pattern records are complete; V23.2 must make the builder fail closed before new records/layers ship. |
| `AGENTS.md` still labels V22 as the current sprint | The V23.1 implementation PR must replace that section rather than append another sprint history. Prompt 0 cannot edit it. |
| No human usability round has been completed | Keep all release language at pretesting/integration status; schedule the consolidated round separately and do not call it validation. |

## Contract decisions that are already settled

1. Keep eight pure archetypes and existing resolver-produced blends; add no scored code.
2. Keep the Foundation archetype as the headline Foundation reading.
3. Preserve all payloads, stores, routes, IDs, slugs, and locale boundaries listed above.
4. Enrich the eight existing archetype URLs rather than replacing the historical pages.
5. Make the 4×2 matrix primary only in V23.2; retain the continuous projection as secondary.
6. Use evidence-coded reference profiles for public positions; do not assign people or organizations to archetypes.
7. Treat human/automated evidence honestly; no human-validation claim exists.

## V23.1 owner decisions recorded on 2026-08-18

1. **P- display name:** `Shi (勢)` is the canonical public name and retains its qualification.
2. **Normative aliases:** `Order-first / Conditional / Justice-first` are the canonical public aliases; persisted enums and suffixes remain frozen.
3. **Blend editorial set:** no pair-specific prose is published in V23.1. Resolver outputs remain compatible and never receive a new mark or analogue.
4. **Publication completeness:** the 104 authored interpretation sentences remain qualified `partial` records. The owner authorizes the AI-assisted English copy for editorial beta publication while human editorial review remains pending. No external-expert review or validation is claimed.
5. **Related content:** Current Case and Decision Pattern relations ship as reviewed empty arrays; no automatic bridge is permitted.
6. **Source standard:** existing historical comparison copy remains qualified and provisional with unresolved research recorded explicitly. Missing metadata is not inferred.
7. **Associated thinkers:** the sixteen unsourced position cards are removed from public rendering; evidence-coded reference records remain authoritative.
8. **Editorial marks:** the old four-base/two-transform geometry is blocked history. The exact eight `v23-system-a-derived-1` marks in `assets/V23_SYSTEM_A_DERIVED_SIGILS_MANIFEST.json` are owner-selected for beta after automated collision review. The owner accepts bounded residual cultural risk; this is not universal cultural clearance. Production uses 112px hero, 48px directory, and code-only rendering below 32px. Blends use Diptych/Hallmark composition without a new mark.
9. **Chinese scope:** V23.1 long form remains English-only; unapproved Chinese routes continue to fail closed.
10. **Content migration:** Plan B is selected. The two root JSON files remain the canonical records behind one typed accessor.
11. **Social cards:** System A marks are not added to share cards in this pass; no platform-preview claim is made.

Human-testing timing is not open: the recorded consolidated usability round follows the next major user-facing integration and precedes broader promotion or controlled Tier 1 recruitment. It remains usability evidence, not psychometric validation.
