# V23.4 Domain authoring and explicit bridge contract

Status: **binding authoring contract; non-shipping infrastructure**

Workstream: `CODEX V23.4 — DOMAIN AUTHORING AND EXPLICIT BRIDGE CONTRACT`

Branch: `v23-4-domain-authoring-contract`

Prepared: 2026-08-19

## 0. Purpose and authority

V23.4 creates a reusable authoring contract for domain modules and makes every
cross-domain relationship explicit. It does not add a public module or item
bank. Security and Technology remain the only public Focus Area modules.

This contract governs the manifest, scaffold, validator, relation vocabulary,
bridge records, Current Case relation metadata, compatibility migration, and
V24 authoring handoff. It does not supersede the V23.3 Security bank contract
or authorize changes while the separate V23.3 audit and red team are still in
progress.

The central boundary is simple: a domain result is valid on its own scale. It
remains a separate domain read unless an explicit, reviewed semantic bridge
authorizes a named relationship. A bridge never turns two scores into one.

## 1. Authorized scope

V23.4 implements exactly the following:

1. generic module manifest:
   - slug;
   - versions;
   - axes;
   - lanes;
   - question types;
   - card types;
   - calibration;
   - result copy;
   - locale status;
   - evidence/audit hooks.
2. module scaffold command that creates non-shipping templates.
3. validator and tests.
4. explicit domain relation vocabulary:
   - `reinforces`;
   - `qualifies`;
   - `pulls-against`;
   - `not-comparable`.
5. relation status:
   - `authored`;
   - `expert-reviewed`;
   - `pilot-supported`.
6. bridge definition includes:
   - module axis;
   - optional Foundation dimension;
   - rationale;
   - direction semantics;
   - status;
   - content version;
   - source/review IDs where needed.
7. no raw 1-7 score comparison.
8. no master score.
9. no automatic public relation unless an explicit reviewed bridge exists.
10. default is `not-comparable` / separate domain read.
11. migrate Security and Technology to the generic authoring contract with
    exact output and payload compatibility.
12. Current Case relation metadata contract using stable IDs; no inferred
    links or published relations.
13. authoring guide for V24 Economic Statecraft and Interdependence.
14. note that SAIS focus areas are curricular umbrellas, not validated latent
    scales.
15. preserve legacy overlay fields for decode only; do not reactivate them.

## 2. Explicit non-goals

V23.4 does not implement:

- Economic Statecraft questions;
- Energy/Resource questions;
- Foundation changes;
- Security v5;
- Technology rewrite;
- AI rewrite;
- Tier 1/Tier 2;
- Current Case automation.

It also does not register a placeholder public slug, add a sample item bank,
publish a bridge, infer a relation from existing responses, or revise any
issued payload.

## 3. Domain boundaries

The following terms have distinct jobs:

| Term | Meaning | Boundary |
|---|---|---|
| Domain module | A questionnaire and result scoped to one policy domain | It does not revise the Foundation. |
| Module manifest | Typed authoring metadata for a module and its registered versions | It is not an item bank, scorer, payload, or public-registration switch. |
| Relation | One of the four controlled semantic descriptions in section 7 | It is not calculated from scores. |
| Bridge | A versioned authored record that explains one semantic relation between a module axis and, when applicable, a Foundation dimension | It never supplies a numeric conversion. |
| Foundation dimension | One of the seven existing Foundation dimensions | V23.4 does not add, rename, or rescore one. |
| Current Case relation metadata | An authoring-only reference from a stable case record to a stable module axis | The V23.4 catalog is empty and nothing is public. |

The module manifest may describe a live module. Merely creating a manifest or
scaffold does not add that module to the public module registry, routes,
Profile, sitemap, localization catalog, calibration runtime, or evidence
report.

## 4. Generic module manifest

### 4.1 Required shape

The implementation may split this shape across typed records, but the complete
manifest must expose these fields and preserve their meaning:

```ts
type DomainModuleManifest = {
  schemaVersion: 1
  releaseState: "template" | "shipping"
  slug: string
  versions: {
    manifest: number
    questionBank: number
    scoring: number
    resultCopy: number
  }
  axes: Array<{
    key: string
    label: string
    lowLabel: string
    highLabel: string
  }>
  lanes: Array<{
    key: string
    label: string
    description: string
    scoreKey: string
    lowLabel: string
    highLabel: string
  }>
  questionTypes: Array<"case" | "synthesis">
  cardTypes: ChoiceCardType[]
  calibration: {
    status:
      | "not-calibrated"
      | "synthetic-diagnostic"
      | "pilot-calibrated"
    id: string
    questionBankVersion: number
    scoringVersion: number
    modes: QuizMode[]
    method: string
    artifactPath?: string
  }
  resultCopy: {
    defaultHeadline: string
    title: string
    shortTitle: string
    subtitle: string
    shorthand: string
    timeEstimate: Record<QuizMode, string>
    description: string
    measures: string[]
    doesNotClaim: string[]
  }
  localeStatus: {
    sourceLocale: string
    locales: Array<{
      locale: string
      status: "source-complete" | "reviewed" | "partial" | "not-authored"
      contentVersion?: number
      reviewIds?: string[]
    }>
  }
  evidenceAuditHooks: {
    evidence: Array<{ id: string; path: string }>
    reviews: Array<{ id: string; path: string }>
    audits: Array<{ id: string; packageScript: string }>
  }
  relationPolicy: typeof DEFAULT_DOMAIN_RELATION_POLICY
  bridges: DomainBridgeDefinition[]
}
```

The canonical implementation lives in
`lib/modules/authoring-contract.ts`. The notation above is abbreviated for the
document, but its keys and controlled values match that typed contract. The
implementation reuses canonical module, locale, version, card-type, quiz-mode,
and Foundation key types where they already exist.

Payload envelope version is deliberately not reassigned by this manifest.
Existing payload decoders and the historical module version registry remain
authoritative for issued links.

### 4.2 Ownership

- Engineering owns schema, stable keys, cross-reference validation, version
  dispatch, payload compatibility, and safe registration.
- Methodology owns construct definitions, calibration claims, axis direction,
  bridge rationale, and limitations.
- Editorial owns question and result prose.
- Research owns factual claims, source IDs, evidence windows, and review
  records.
- Localization owns locale status and source-content provenance.

### 4.3 Manifest invariants

Enforcement is split between the structural manifest validator, registered
module validation, and the compatibility and release gates. Together they
require all of the following:

1. The slug is stable, normalized, and unique.
2. The manifest question-bank and scoring versions match the current tuple for
   that slug.
3. Every historical tuple remains in the existing version registry and
   resolves to its frozen definition and runtime. The compatibility replay,
   rather than the manifest shape validator, enforces this historical rule.
4. Axis keys are unique; labels and endpoint semantics are complete.
5. Lane keys are unique and every lane `scoreKey` resolves to a declared axis.
6. Every question and card type used by the registered bank is declared, and
   the manifest does not claim unused types as measured coverage.
7. Calibration metadata is tied to the relevant version tuple and mode. A
   synthetic diagnostic is not described as respondent calibration.
8. Result copy is domain-qualified and carries an independent content version.
9. Each locale has an explicit status, and the source locale resolves to an
   authored record. The publication layer remains responsible for preventing
   silent long-form fallback from an unapproved locale.
10. Every declared bridge source and review ID resolves through the manifest's
    evidence or review hooks. For registered manifests, hook paths and package
    scripts must also exist.
11. A manifest cannot register a new public module by itself.
12. Unknown fields, duplicate IDs, unresolved references, placeholder review
    IDs, and malformed versions are blocking errors.

## 5. Non-shipping module scaffold

The module scaffold command creates authoring templates only. Its contract is:

```text
npm run module:scaffold -- <slug> --output <authoring-directory>
```

The output directory is required; the command has no implicit shipping
destination. It rejects any target nested under `app`, `components`,
`content/instrument`, `lib`, or `public`. The command must:

- validate the slug before writing;
- refuse to overwrite an existing directory or file;
- create deterministic template filenames and content;
- mark every generated record non-shipping and incomplete;
- create no route, bank import, calibration entry, sitemap entry, locale route,
  public catalog entry, bridge, or Current Case relation;
- contain no substantive questions, axes, scoring values, result claims, or
  inferred relationships; and
- add no dependency.

This illustrative invocation:

```text
npm run module:scaffold -- sample-domain --output authoring/modules
```

produces this authoring-only tree:

```text
authoring/modules/sample-domain/
├── README.md
├── module.manifest.json.template
├── questions.json.template
└── review-ledger.json.template
```

This is an output example, not a committed `sample-domain` module. A scaffold
may pass structural template checks, but it must fail every shipping or public
registration gate until real content, evidence, review, version, calibration,
and owner approval exist.

## 6. Validator and test contract

The module-authoring validator (`npm run validate:module-authoring`) belongs in
the normal `npm run validate` chain. It validates the two registered shipping
manifests and exposes `validateDomainModuleManifest` and
`validateModuleAuthoringRecord` as reusable pure boundaries.

Its blocking checks include:

- manifest structure and exact controlled vocabularies;
- unique and resolvable slugs, versions, axes, lanes, types, locales, sources,
  reviews, and audit hooks;
- current manifest tuple agreement with the version registry;
- bank-to-manifest question/card-type agreement;
- calibration-to-tuple agreement;
- relation and bridge schema validation;
- reviewed-bridge publication eligibility;
- rejection of numeric conversion, score-delta, percentile, and master-score
  fields;
- rejection of non-shipping manifests in the registered module records; and
- validation of the Current Case relation schema plus the exact V23.4
  `contentVersion: 1`, withheld, empty shipping catalog; and
- canonical agreement among authoring records, shipping slugs, and runtime
  module definitions.

The surrounding test suite exercises the negative and compatibility paths:
scaffold output and isolation, Current Case stable-ID and publication
mutations, no-relation fallback, AI fail-closed presentation, unsupported
historical tuples, and frozen compatibility fixtures. These checks live in
`tests/module-scaffold.test.mts`, `tests/current-case-relations.test.mts`,
`tests/domain-relations.test.mts`, and the compatibility tests. The first three
complement the registered authoring CLI; historical replay remains a separate
compatibility gate.

## 7. Relation vocabulary and status

### 7.1 Controlled relation vocabulary

No synonym may enter stored metadata.

| Value | Meaning |
|---|---|
| `reinforces` | The named domain-axis direction gives additional semantic support to the named Foundation-dimension direction under the bridge rationale. |
| `qualifies` | The domain result narrows, conditions, or adds a material exception to the named Foundation-dimension reading without reversing it. |
| `pulls-against` | The named domain-axis direction points against the named Foundation-dimension direction under the bridge rationale. It does not cancel or rescore the Foundation. |
| `not-comparable` | No reviewed semantic comparison has been established. Read the domain result separately. |

`not-comparable` is the default. It is a methodological boundary, not an
inference that two results disagree.

### 7.2 Controlled status vocabulary

| Value | Meaning | Public eligibility |
|---|---|---|
| `authored` | The rationale and direction semantics have been proposed but not recorded as reviewed. | Internal only. |
| `expert-reviewed` | The bridge carries the reviewed status and at least one stable review-hook ID. | Eligible only when every bridge field and both source and review IDs validate. |
| `pilot-supported` | The expert-reviewed bridge also has identified pilot evidence relevant to the semantic claim. | Eligible if review and pilot source IDs validate. It does not establish population validity or a numeric conversion. |

Status records editorial and evidentiary maturity. It is not a confidence
percentage. `pilot-supported` cannot be used to imply reliability, prevalence,
representativeness, cross-cultural equivalence, or a latent common scale.

## 8. Explicit bridge schema

### 8.1 Required record

```ts
type DomainRelation =
  | "reinforces"
  | "qualifies"
  | "pulls-against"
  | "not-comparable"

type DomainRelationStatus =
  | "authored"
  | "expert-reviewed"
  | "pilot-supported"

type DomainBridgeDefinition = {
  id: string
  moduleSlug: string
  moduleAxis: string
  foundationDimension?: DimensionKey
  relation: DomainRelation
  rationale: string
  direction: {
    modulePole: "low" | "high"
    foundationPole?: "low" | "high"
    semantics: string
  }
  status: DomainRelationStatus
  contentVersion: number
  sourceIds?: string[]
  reviewIds?: string[]
  publication: "internal" | "public"
}

type DomainBridgeSelector = {
  id: string
  contentVersion: number
  moduleAxis: string
  foundationDimension?: DimensionKey
}
```

Stable IDs and canonical key types must replace the illustrative `string`
types in implementation where a catalog already exists.

### 8.2 Direction semantics

The `direction.semantics` field names the endpoint meaning on each scale. It
does not map one raw score to another. For example, a bridge may explain what
the high pole of one authored module axis means relative to the high or low
pole of an existing Foundation dimension. It may not say that `5.4` in a
module equals, predicts, adds to, or subtracts from any Foundation value.

For `reinforces`, `qualifies`, or `pulls-against`, the Foundation dimension and
Foundation pole are required. A `not-comparable` bridge may omit the Foundation
dimension. If it names one, it must also name the Foundation pole and explain
why the records still remain separate. The module axis must always resolve
through the named module manifest.

### 8.3 Source and review requirements

- `authored` records use `publication: "internal"` and remain private.
- `expert-reviewed` records require at least one stable review ID that resolves
  through the manifest's review hooks.
- `pilot-supported` records require the expert review IDs plus stable source or
  evidence IDs that resolve through the manifest's evidence hooks.
- Public eligibility conservatively requires `publication: "public"`, a
  reviewed status, and non-empty stable source and review ID arrays.
- Any factual, historical, or current-policy claim in a rationale requires
  source IDs regardless of status.
- Free-form reviewer names, opaque citation markers, unresolved URLs, and
  placeholder IDs do not satisfy the contract.

The schema carries `contentVersion`, but a hook ID alone cannot prove what a
human reviewed. The referenced review ledger must identify the exact bridge ID
and content version; the validator checks stable-ID resolution, while the
review record supplies that semantic provenance.

### 8.4 Public relation gate

The registered authoring gate still requires a validator-clean manifest. The
runtime publication boundary then independently revalidates the selected
record rather than trusting a cast, decoded object, or status string alone:

1. `validateDomainModuleManifest` checks every authored bridge, including its
   ID, content version, axis, relation, direction, rationale, optional
   Foundation key, and evidence/review hook references.
2. `isDomainBridgePubliclyEligible(manifest, bridge)` rechecks the exact record
   shape, module and axis, relation and direction semantics, reviewed status,
   `public` state, positive content version, and stable source/review IDs that
   each resolve exactly once through the manifest hooks.
3. `resolveDomainRelationRead` requires a `DomainBridgeSelector` containing the
   bridge ID, content version, module axis, and exact optional Foundation
   dimension. Omission of the Foundation dimension matches only a bridge that
   also omits it.
4. The resolver returns a reviewed semantic relation only when exactly one
   record matches all selector fields and passes runtime eligibility.

`getPublishedDomainBridges` uses the same contextual eligibility check for
listing. Its list may contain multiple valid bridges on one axis; that is not
an ambiguity because the exact selector, not axis proximity or array order,
chooses the public read.

A malformed selector, zero or duplicate exact matches, or an ineligible record
returns the generic boundary:

```text
relation: not-comparable
presentation: separate domain read
```

Validator-rejected manifests cannot enter the registered publication path,
and the runtime boundary also rejects invalid or `authored` records. The
fallback may state that no reviewed bridge exists; it cannot guess which
relation is most likely or choose a different bridge merely because it shares
an axis.

The Security and Technology manifests each contain an exact empty `bridges`
array, so both continue to use the separate-domain fallback. The AI result
surface is also explicitly fail-closed: `components/ai/ai-project-bridge.tsx`
imports `DEFAULT_DOMAIN_RELATION_READ`, renders `not-comparable`, and does not
call the deprecated `getCrossModuleSynthesis` helper or publish its alignment
and tension prose. The deprecated helper remains only as legacy code; it is not
used by the public AI result. This changes bridge presentation, not the AI
instrument, scoring, payload, or result model.

No bridge may be generated from raw 1-7 scores, score differences, score bands,
closest traditions, archetypes, modifiers, Decision Pattern fingerprints,
Current Case choices, nationality, locale, or profile history.

## 9. No numeric bridge and no master score

The following are prohibited in authoring records, runtime relation logic, and
public copy:

- direct comparison of raw 1-7 module and Foundation values;
- subtraction, ratio, normalization, percentile conversion, shared z-score, or
  threshold matching across the two scales;
- an overlay vector treated as evidence of agreement or disagreement;
- averaging module axes with Foundation dimensions;
- a total, composite, coherence, consistency, or master score; and
- a categorical relation inferred from numerical proximity.

Calibration remains local to the instrument, version tuple, mode, axis, and
classification context for which it was authored. A reviewed bridge is a
semantic statement, not a calibration transform.

## 10. Security and Technology migration

Security and Technology migrate by describing their existing registered
contracts through the generic manifest. The manifest must reference canonical
definitions and version registries; it must not copy or reinterpret their
banks, axes, lanes, scoring callbacks, calibration cuts, or result prose.

The V23.4 manifest registry is:

| Module | Manifest | Question bank | Scorer | Result copy | Calibration status | Locale status | Bridges |
|---|---:|---:|---:|---:|---|---|---:|
| Security | 1 | 4 | 2 | 1 | `synthetic-diagnostic` | `en: source-complete`; `zh-Hans: not-authored` | 0 |
| Technology | 1 | 3 | 2 | 1 | `synthetic-diagnostic` | `en: source-complete`; `zh-Hans: not-authored` | 0 |

The following remain exact:

- Security supports its existing bank/scorer tuples, with `(4, 2)` current.
- Technology supports its existing bank/scorer tuples, with `(3, 2)` current.
- payload envelope versions, encoded links, answer IDs, option IDs, modes,
  second-choice rules, actor-lens treatment, rounding, classifications,
  headlines, summaries, lane reads, and card-type reads;
- frozen Security v2/v3 and Technology v2 definitions;
- Profile Store V1-V5 and Profile Share V1-V3 decoding; and
- graceful rejection of unsupported tuples and malformed payloads.

Migration is acceptable only when each `ModuleAuthoringRecord` points to the
same canonical definition, its current bank/scorer tuple matches the existing
version registry, and the unchanged runtime path produces byte-for-byte
compatible payloads and deep-equal result fields for every frozen fixture.
V23.4 does not issue a new bank, scorer, payload, calibration, or content
version merely to adopt the manifest.

## 11. Legacy overlay fields are decode-only

Legacy `overlayDeltas`, comparison prose, and lane-delta fields remain readable
where an old Profile Store, Profile Share, or module payload contains them.
Their compatibility types and decoder paths must not be removed.

Active V23.4 behavior is stricter:

- new active results do not render legacy overlay values;
- new active saves do not populate non-empty overlay values;
- a schema-required empty compatibility object may remain empty;
- bridge lookup never reads an overlay field;
- no overlay is converted into one of the four relations; and
- old non-empty values are historical display data, not evidence for a public
  bridge.

Preserving decode compatibility does not reactivate the former overlay model.

## 12. Current Case relation metadata

Current Case metadata uses stable catalog IDs only. The canonical implementation
lives in `lib/current-cases/relations.ts`. The authoring contract is:

```ts
type CurrentCaseRelationSubject =
  | { kind: "case" }
  | { kind: "decision-option"; optionId: string }
  | { kind: "reasoning-tag"; reasoningTagId: string }

type CurrentCaseRelationTarget = {
  kind: "module-axis"
  moduleSlug: string
  axisKey: string
}

type CurrentCaseRelationDefinition = {
  id: string
  caseRef: {
    caseId: string
    caseVersion: number
  }
  subject: CurrentCaseRelationSubject
  target: CurrentCaseRelationTarget
  relation: DomainRelation
  rationale: string
  status: DomainRelationStatus
  contentVersion: number
  sourceIds?: readonly string[]
  reviewIds?: readonly string[]
  publication: "internal" | "public"
}
```

The validator resolves `caseRef` through the Current Case catalog. An option or
reasoning-tag subject resolves only inside that exact case version; option and
tag IDs are not globally unique. The target module slug and axis resolve
through the registered module definition, which the authoring validator
separately checks against its manifest. Slugs used as display text, Decision
Pattern names, legacy `profileId` fields, route text, and similarity are not
relation IDs.

The exact V23.4 catalog root is withheld and empty:

```ts
{
  schemaVersion: 1,
  contentVersion: 1,
  publication: "withheld",
  relations: [],
}
```

The public selector returns an empty array. No sample relation, inferred link,
or published relation ships. Current Case JSON is not extended with guessed
links. Schema v1 rejects every relation whose publication field is `public`;
reviewed internal records would also require source IDs from the exact case
source ledger and review IDs from its editorial review. There is no direct
Current Case-to-Foundation target and no transitive
case-to-module-axis-to-Foundation inference. The existing Foundation
connection continues to return `unavailable / missing-authored-mapping`, and
the legacy Decision Pattern references remain Decision Pattern reading
references only.

## 13. Locale, evidence, and audit boundary

- V23.4 has no localized public bridge. A later release must not publish one in
  a locale until its exact rationale and direction semantics have the required
  locale review.
- A translated label cannot authorize an untranslated rationale.
- Locale status does not alter scoring, relation, or direction.
- Evidence hooks identify deterministic local checks and stable evidence
  records. They do not claim human validation.
- Generated evidence artifacts are updated only when a declared evidence input
  changes, using `npm run evidence:audit`; they are never hand-edited.
- Automated tests, AI review, and synthetic response runs are pretesting, not
  expert review or pilot support.

## 14. Compatibility replay

The compatibility replay for this sprint is the non-mutating frozen test path,
not the database-backed Foundation research replay command.

```text
node --experimental-strip-types \
  --import ./tests/register-alias-loader.mjs \
  --test \
  tests/instrument-version-compatibility.test.mts \
  tests/security-v4.test.mts \
  tests/v21-module-copy.test.mts \
  tests/v22-5-module-compatibility.test.mts \
  tests/profile-store.test.mts \
  tests/profile-share.test.mts \
  tests/module-framework.test.mts
```

The clean-main baseline for this targeted command before V23.4 was 63 passed,
0 failed; the same targeted command must retain all 63. The separate full
`npm run test` gate adds the V23.4 manifest, scaffold, bridge, AI fail-closed,
and Current Case contract tests. Existing golden fixture bytes must not be
rewritten to make a changed result pass.

## 15. Full command gate

Run in this order and stop at the first failure:

```text
git diff --check
npm run validate
npm run copy:audit:strict
npm run evidence:audit:check
npm run lint
npm run test
npm run typecheck
npm run build
CI=1 npm run test:e2e
git diff --check
```

If `evidence:audit:check` reports stale deterministic artifacts because a
declared source changed, run `npm run evidence:audit`, inspect the artifact
diff, and rerun the check. Do not change a scoring or response baseline merely
to silence drift.

## 16. Acceptance gate

V23.4 is complete only when:

1. the generic manifest, scaffold, validator, and tests are present;
2. no new public module, item bank, route, or relation is registered;
3. the four relation values and three statuses are exact and exhaustive;
4. no public semantic relation appears without a valid explicit reviewed
   bridge;
5. validator-rejected records cannot enter publication, while malformed or
   unmatched exact selectors, duplicate exact records, and `authored` records
   resolve to `not-comparable` / separate domain read;
6. no raw cross-scale comparison or master score exists;
7. Security and Technology output and payload compatibility replay passes;
8. legacy overlays remain decode-only;
9. the Current Case relation catalog is empty and the existing fail-closed
   Foundation connection survives;
10. the V24 guide contains no questions, axes, items, scoring, tier, or
    Foundation changes; and
11. every command gate passes with an auditable result table.
