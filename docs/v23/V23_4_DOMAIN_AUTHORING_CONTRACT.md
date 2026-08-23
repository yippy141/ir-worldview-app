# V23.4 domain authoring contract

Status: **binding schema-v1 authoring and release contract**

Prepared: 2026-08-21

## Purpose

V23.4 defines how a separate-domain module is authored, reviewed, released,
versioned, and registered. It does not implement V24. Security and Technology
remain the only registered Focus Area modules. A module result remains on its
own scale: no raw-score comparison, inferred alignment, Foundation rescoring,
or master score is permitted.

## Manifest release states

The exact release vocabulary is:

```text
template | candidate | public-beta | shipping
```

`template` and `candidate` records cannot enter the runtime registry.
`public-beta` and `shipping` require a structured release-decision reference:

```ts
{
  decisionId
  decisionPath
  approvedQuestionBankVersion
  approvedScoringVersion
  approvedResultCopyVersion
  approvedManifestVersion
  decisionStatus
  reviewDueAt
}
```

The reference must match a slug-bound record in the code registry and the
manifest tuple exactly. A Markdown file existing at `decisionPath` is not
approval. The decision must be recognized, unexpired, and backed by a real,
non-symlinked regular file inside the repository.

Current release records:

| Module | State | Manifest | Bank | Scorer | Result copy | Decision |
|---|---|---:|---:|---:|---:|---|
| Security | `public-beta` | 2 | 5 | 2 | 2 | `security-v5-public-beta-2026-08-21` |
| Technology | `public-beta` | 2 | 3 | 2 | 1 | `technology-v3-public-beta-2026-08-21` |

Both decisions are owner-authorized beta releases with deferred human gates.
Neither is a claim of validity, reliability, representativeness, population
evidence, cross-cultural equivalence, or expert endorsement. Tier 1 remains
off.

## Manifest origins and fingerprints

Every manifest declares:

```text
manifestOrigin: derived-legacy-adapter | authored-manifest
```

Security and Technology are `derived-legacy-adapter` records. Their axes,
lanes, and result copy are detached copies of existing runtime definitions.
Equality tests prove compatibility at the checked version; they do not provide
an independent source capable of detecting semantic drift in both copies.

A new V24 module begins as an `authored-manifest`. Registration remains a
separate explicit implementation step after release approval.

Each manifest carries a SHA-256 fingerprint over its schema, origin, release
state and decision, complete version tuple, axes, lanes, question and card
types, calibration claims, result copy, locale and evidence status, hook
records, relation policy, and bridge catalog. A checked-in fixture binds that
digest to the manifest and result-copy versions. Changing versioned claims
without the required version bump fails the registered authoring gate.

## Copy, evidence, and path gates

Locale authorship and evidence maturity are separate dimensions. The
source-language copy status is `authored-complete`, not the ambiguous
`source-complete`. Evidence uses its own status.

A `public-beta` or `shipping` manifest fails when:

- no recognized exact-tuple decision exists;
- the decision tuple or status differs from the manifest;
- the review date is invalid or overdue;
- result copy contains scaffold placeholders;
- calibration is `not-calibrated` or bound to another tuple;
- source-language copy is not `authored-complete`;
- evidence, review, or audit hooks are empty;
- decision, evidence, review, audit, or calibration paths are missing,
  absolute, outside the repository, symlinks, or not regular files; or
- the manifest fingerprint or canonical version fixture drifts.

All hook paths use `lstat` and `realpath` containment. Package-script IDs are
also resolved against `package.json`.

## Schema-v1 bridge policy

The semantic vocabulary remains available for internal authoring:

```text
reinforces | qualifies | pulls-against | not-comparable
```

Publication is categorically disabled:

```text
publicRelations: forbidden-in-schema-v1
```

All current manifests have `bridges: []`. `getPublishedDomainBridges` always
returns an empty list, `isDomainBridgePubliclyEligible` always returns false,
and `resolveDomainRelationRead` always returns a separate-domain read. Naming
an existing source or review file—even a file labeled HOLD—cannot create a
public relation. A later schema v2 may define structured publication approval;
schema v1 does not.

Internal bridge proposals separate dimensions that were previously
conflated:

```ts
authoringStatus: "draft" | "authored"
reviewStatus: "unreviewed" | "expert-reviewed"
evidenceStatus: "untested" | "pilot-supported"
publication: "internal"
```

No one field implies another. Every proposal binds:

- module manifest, question-bank, scoring, and result-copy versions;
- either a Foundation scorer/calibration tuple or named Foundation semantic
  contract;
- bridge content version; and
- review-due date.

Any module-axis or scorer semantic change invalidates that review context. No
bridge record may carry scores, thresholds, coefficients, normalization,
percentiles, deltas, or a master score.

## Scaffold filesystem boundary

The scaffold requires an explicitly supplied, already-existing, real output
root. It rejects a symlinked root, every symlinked existing component, an
existing target, and every unapproved location inside the repository. Approved
in-repository roots are:

```text
docs/module-authoring/
research/module-authoring/
```

An explicitly supplied real root outside the repository is allowed. After
verification, the command claims the target with non-recursive atomic
directory creation and writes files sequentially with exclusive `wx` flags.
On partial failure it reports every created file and leaves them visible for
inspection; it never overwrites an existing file.

The scaffold creates an `authored-manifest` template only. It adds no runtime
slug, route, question bank, scorer, locale surface, relation, or registration.

## AI and Foundation presentation

The AI surface hydrates the saved Foundation through its exact payload and
registered scorer. The primary baseline is the payload-resolved Foundation
archetype or legitimate blend. The closest modeled tradition is secondary
metadata. Cached family labels never reconstruct an identity, and an
unresolvable legacy record is labeled archived.

Without a bridge, the public status is:

```text
Separate reads — no reviewed bridge
```

The internal technical relation remains `not-comparable`. The app infers no
alignment and does not rescore the Foundation or create a master score.

## Current Case link metadata

Current Case content links use a separate, withheld vocabulary:

```text
exercises | illustrates | challenges | contextualizes | not-mapped
```

Factual case sources and construct-link reviews are separate fields:
`factualSourceIds` and `constructReviewIds`. The schema-v1 catalog is withheld
and empty, and the public selector always returns an empty list. Direct
Foundation targets, transitive module-to-Foundation inference, legacy Decision
Pattern inference, numeric fields, and public relations are forbidden.

## Compatibility and non-goals

Security v3 and v4 tuples, payloads, calibration, links, and replay remain
registered. Technology and AI question banks and scoring are unchanged.
Foundation scoring, questions, archetypes, calibration, and payloads are
unchanged. Worldview Map, Decision Patterns, Tier 1/Tier 2, databases,
external services, current public Chinese content, and dependencies are not
changed.

V24 is not implemented. The V24 guide contains process requirements only; it
does not define a public module, construct, axis, question, score, bridge, or
Current Case link.

## Required gates

`npm run validate:module-authoring` is part of `npm run validate` and checks
the registered tuple, decision, hooks, paths, bridge policy, fingerprints, and
empty Current Case catalog. Focused tests cover fake expert review citing HOLD
files, version-context drift, expired decisions, placeholders, digest drift,
symlink paths, scaffold partial writes, and AI exact-payload hydration.
