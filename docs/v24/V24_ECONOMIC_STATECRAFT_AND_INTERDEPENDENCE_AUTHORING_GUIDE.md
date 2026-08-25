# V24 Economic Statecraft and Interdependence authoring guide

Status: **historical research input; superseded as execution authority; authoring-only; non-shipping; no item bank**

Current treatment: Economic Statecraft is V25 and remains blocked until the AI v4 authoring, pilot, compatibility, and release process is proven. See `docs/roadmap/V23_5_V26_MASTER_ROADMAP.md`.

Depends on: `docs/v23/V23_4_DOMAIN_AUTHORING_CONTRACT.md`

Prepared: 2026-08-19

## 1. Purpose

This guide describes how a later V24 design process may research and author an
Economic Statecraft and Interdependence domain module under the V23.4
contract. It does not approve a module, define its constructs, or create public
content.

V24 begins with a domain question and an evidence plan. It does not begin with
a desired result label, a Foundation comparison, or a list of scores to
combine.

## 2. Scope boundary

This guide may support later work on:

- a complete authoring manifest;
- construct and coverage research;
- source and review ledgers;
- scenario commissioning and cognitive-testing plans;
- calibration and pilot plans;
- locale readiness;
- explicit semantic bridge proposals after module axes exist; and
- release gates for a separately authorized V24 implementation.

This guide does not implement:

- Economic Statecraft questions;
- Energy/Resource questions;
- Foundation changes;
- another Security bank;
- Technology rewrite;
- AI rewrite;
- Tier 1/Tier 2;
- Current Case automation.

It defines no axes, lanes, items, options, signals, weights, result families,
headlines, calibration cuts, payloads, public routes, Current Case links, or
bridges. Those decisions require their own evidence and review.

## 3. Why this is a separate domain

Economic statecraft and interdependence may create policy judgments that are
more concrete than the Foundation prompts. A future module should explain
those judgments on their own domain terms. It must not present them as a more
accurate Foundation result or as extra points on a shared worldview scale.

The design question for V24 is therefore:

> Which distinct, reviewable constructs are needed to explain how a respondent
> reasons within this domain, and what item coverage would be required to
> measure them without moral, expert, or middle-option cues?

The answer remains open. This guide does not pre-author it.

## 4. SAIS curricular-umbrella note

The official Johns Hopkins SAIS MAIR page presents Focus Areas as a way to
organize coursework. Students self-design ten remaining courses through
functional and regional areas and complete minimum credits in one functional
and one regional area. See the [Johns Hopkins SAIS MAIR
curriculum](https://sais.jhu.edu/academics/degrees-programs/master-degrees/master-arts-international-relations-mair).

That source supports a curricular description only. It does not describe the
areas as psychometric constructs. This project borrows the broad organizing
idea: SAIS focus areas are curricular umbrellas, not validated latent scales.
They do not establish axes, item validity, score comparability, or a master
score for this inventory. This independent project does not imply SAIS
affiliation or endorsement.

## 5. Authoring sequence

### Phase A: define the decision domain

Before writing any item, produce a short scope memo that states:

- which decisions and explanatory disputes belong in the domain;
- which adjacent subjects are outside it;
- what a result should help a reader understand;
- what the module will explicitly decline to claim; and
- where construct overlap could create double-counting or false breadth.

The memo must use plain language. A broad topic list is not yet a construct
model.

### Phase B: build the evidence map

Create a source ledger before a question bank. Distinguish:

- primary policy and institutional records;
- peer-reviewed construct and measurement research;
- authoritative historical or legal references;
- current-policy claims with an evidence window and review date; and
- authored interpretations that require review but not external factual
  support.

Every source receives a stable ID. Opaque exported citation markers and
unresolved URLs do not qualify. Current claims require dates, scope,
qualification, and a review-due date.

### Phase C: propose constructs without freezing them

A future methodology memo may propose candidate axes and lanes. For each
candidate it must state:

- the construct in one sentence;
- the low and high directions without good/bad ordering;
- what evidence would distinguish it from neighboring constructs;
- likely social-desirability and knowledge-load risks;
- required item coverage in each mode; and
- what would cause the team to merge, split, rename, or reject it.

No candidate becomes a scored axis because it sounds important or resembles a
curriculum heading. It becomes eligible only after coverage review and explicit
owner approval.

### Phase D: commission scenarios

Only after the construct memo is approved may a later workstream commission
questions. That workstream must follow the repository's scenario rules:

- options represent distinct causal, institutional, or decision logics;
- options are not low/middle/high intensity points;
- each option names its instrument or explanation and accepted cost;
- the scene contains the knowledge needed to answer;
- clarification is short, collapsed, and non-leading;
- actor perspective is not endorsement;
- nationality, citizenship, or culture never changes scoring; and
- Standard and Analyst are tested separately.

This V23.4 handoff contains no such questions or options.

### Phase E: review, diagnose, and pilot

Before any shipping proposal, a later V24 workstream must complete:

1. construct review;
2. item-level editorial and evidence review;
3. declared-axis and actual-signal coverage checks;
4. attainable-range, centering, saturation, and option-order diagnostics;
5. cognitive interviews for comprehension, mechanism distinction, moral cue,
   expert cue, and middle-option attraction;
6. separate Standard and Analyst pilot plans;
7. locale-specific review; and
8. owner approval of the bank, scorer, calibration, result copy, and public
   claims.

Synthetic responses are engineering diagnostics. They are not pilot evidence,
respondent norms, population percentiles, reliability evidence, or validation.

## 6. Manifest checklist

A future V24 proposal must complete every V23.4 manifest field:

- stable slug;
- `manifestOrigin: authored-manifest`;
- manifest, question-bank, scoring, and result-copy versions, plus a separate
  historical compatibility plan;
- reviewed axes and endpoint semantics;
- lanes and score-key references;
- exact question-type and card-type vocabularies;
- tuple- and mode-specific calibration status;
- domain-qualified, versioned result copy;
- explicit locale status for every proposed locale; and
- stable evidence, review, artifact, and validator hooks.

Any public-beta or shipping proposal also requires a recognized structured
release decision bound to that exact tuple, an unexpired review date, and a
canonical manifest fingerprint fixture. A Markdown decision memo existing on
disk is not approval.

Creating or validating that manifest does not publish the module. A separate
implementation must deliberately register the approved bank, tuple, routes,
and locale surfaces.

## 7. Scaffold workflow

Use the non-shipping V23.4 command only after the scope memo has an approved
slug:

```text
npm run module:scaffold -- <approved-slug> --output docs/module-authoring
```

Inside the repository, the explicit output must be an existing approved
authoring root such as `docs/module-authoring/` or
`research/module-authoring/`, never `content/instrument`. A real output root
outside the repository may also be supplied explicitly.
Keep every template marked non-shipping. Do not add substantive placeholders
merely to make the tree look complete. Missing constructs, questions, sources,
reviews, and translations remain explicitly incomplete.

The scaffold must not be imported by the app, added to the public registry, or
used to create a route. Delete test output created outside the repository; do
not use `tmp/` as a source or import path.

## 8. Result and calibration rules

A future result must answer the reader's domain question before presenting
methods or caveats. It must use the module's own named axes and lanes. It must
also say what the result does not establish.

The following remain prohibited:

- percentiles without an appropriate population basis;
- a score described as certainty, sophistication, or correctness;
- a result family without adequate discriminating item coverage;
- calibration cuts borrowed from Security, Technology, AI, or the Foundation;
- raw 1-7 comparison with another instrument;
- an overlay presented as movement on the Foundation; and
- a master score.

Calibration is version-, mode-, axis-, and context-specific. A new bank cannot
inherit another module's cuts because its JSON shape or numeric range looks
similar.

## 9. Bridge-authoring rules

Bridge work starts only after the module axis and its direction semantics are
stable. The default before that point is:

```text
relation: not-comparable
presentation: separate domain read
```

A proposed bridge must use one of:

- `reinforces`;
- `qualifies`;
- `pulls-against`; or
- `not-comparable`.

It must name the module axis, optionally name an existing Foundation dimension,
state the module pole meaning and, when a Foundation dimension is named, its
Foundation pole meaning, give a rationale, carry a content version, and cite
stable source and review IDs where required.

Schema v1 does not publish bridges. Authorship, review, and evidence are
separate internal fields: `draft | authored`, `unreviewed | expert-reviewed`,
and `untested | pilot-supported`. Every proposal remains `publication:
internal`, must bind the exact module tuple plus a Foundation semantic or
scorer/calibration context, and carries its own content version and review-due
date. Pilot support does not authorize numeric conversion or a validity claim.

A later schema v2 would need a separate structured publication decision bound
to exact module and Foundation versions. Do not create that publication system
in V24 authoring by inference.

No bridge may use raw score proximity, deltas, regression, rank, shared bands,
closest traditions, archetype labels, or a respondent's Current Case answer to
infer a relationship. No reviewed bridge means no public relation.

## 10. Current Case boundary

V24 may later propose stable metadata connecting an exact Current Case ID and
version to an exact module axis. Its subject may be the case, one decision
option, or one reasoning tag. Option and reasoning-tag IDs are resolved only
within that exact case version because they are not globally unique.

The withheld relation vocabulary is `exercises | illustrates | challenges |
contextualizes | not-mapped`. Factual case source IDs and construct-link review
IDs remain separate. V23.4 ships an empty Current Case relation catalog. V24 authoring must not
infer a link from category, slug, route label, reasoning tag text, Decision
Pattern `profileId`, or semantic similarity. It must not publish a relation or
alter the existing `unavailable / missing-authored-mapping` Foundation
connection without a separate reviewed implementation contract.

There is no direct Current Case-to-Foundation target and no transitive
case-to-module-axis-to-Foundation inference.

Current Case automation remains out of scope.

## 11. Legacy compatibility boundary

A future V24 implementation must leave existing Security and Technology
payloads and Profile histories readable. Legacy module overlay fields remain
decode-only. They cannot seed V24 axes, classify a respondent, or supply bridge
evidence.

V24 must add its own version tuple and migration contract if it reaches
implementation. It cannot reuse another module's slug, bank version, scorer
version, payload meaning, or calibration by analogy.

## 12. Locale and review readiness

For each proposed public locale, the authoring ledger should record:

- whether the bank, instructions, result copy, and bridge rationale are
  authored-complete, reviewed, partial, or not authored;
- the source content version;
- the localization review IDs; and
- any field withheld from publication.

The manifest then summarizes that evidence in one explicit locale status
record with its content version and review IDs where applicable.

A translated title does not make an untranslated instrument available. Long
English fallback copy cannot silently appear on an unapproved localized route.
Locale never changes scoring or relation semantics.

## 13. V24 implementation entry gate

A later implementation prompt is eligible only when all of the following are
available and approved:

1. bounded scope and non-claim memo;
2. construct memo with coverage requirements and rejection criteria;
3. complete source and review ledgers;
4. reviewed bank proposal with no morally or technically privileged option;
5. validator-clean manifest;
6. separate calibration and pilot plans for each mode;
7. version, payload, migration, and replay plan;
8. locale status for every proposed surface;
9. explicit decision on whether any bridge work is warranted; and
10. owner authorization for a new public module and item bank.

Until then, the correct state is a non-shipping authoring packet with no public
module, no item bank, no bridge, and no inferred Current Case relation.
