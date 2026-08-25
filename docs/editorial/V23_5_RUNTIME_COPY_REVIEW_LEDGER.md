# V23.5 Runtime Copy Review Ledger

Status: **Pending**
Release effect: **Human-only Phase 3 release blocker**
Candidate source binding: `77ce296619ab3287f8656667b77363488e617c97`
Prepared: 2026-08-25

## 1. Gate decision

This ledger records no editorial acceptance. The runtime-copy source is bound
to the committed candidate SHA above, but no named human reviewer has accepted
the complete reader-visible blocks in surface context. Every surface and every
generated row therefore remains `pending`.

Phase 3 remains active and unaccepted. V23.5 must not release until a named
human reviewer has reviewed the exact reader-visible blocks from a committed
candidate and every live row is `accepted`. A structural pass, an audit pass,
an inventory count, a model classification, or a model recommendation is not
editorial approval.

## 2. Surface gate

The state below is a surface-level gate summary, not a row-level disposition.
It is `pending` because the bound rows have not yet received named human review.

| Ledger surface | Runtime manifest surface | Human review scope | State | Condition to close |
| --- | --- | --- | --- | --- |
| `COPY-FND-EN` | `foundation-result:en` | Complete English Foundation result blocks and their occurrence contexts | `pending` | Every live row accepted for the bound candidate |
| `COPY-FND-ZH` | `foundation-result:zh-Hans` | Complete Simplified Chinese Foundation narrative blocks and their occurrence contexts | `pending` | Every live row accepted by a human able to review Simplified Chinese |
| `COPY-FND-OG-EN` | `foundation-open-graph:en` | Valid-result English title and description | `pending` | Every live row accepted for the bound candidate |
| `COPY-FND-OG-ZH` | `foundation-open-graph:zh-Hans` | Valid-result Simplified Chinese title and description | `pending` | Every live row accepted by a human able to review Simplified Chinese |
| `COPY-FND-CARD-EN` | `foundation-share-card:en` | Generated reading code, name, and gloss drawn on the English card | `pending` | Every live row accepted in card context |
| `COPY-SEC` | `module-result:security` | Security Standard and Analyst result prose found by the bounded branch oracle | `pending` | Every live row accepted for both modes |
| `COPY-TECH` | `module-result:technology` | Technology Standard and Analyst result prose found by the bounded branch oracle | `pending` | Every live row accepted for both modes |
| `COPY-AI-RESULT` | `ai-governance-result:en` | AI v3 result, payoff, comparison, tension, axis, and evidence-shift blocks | `pending` | Every live row accepted for the bound candidate |
| `COPY-AI-OG` | `ai-governance-open-graph:en` | Valid-result AI title and description | `pending` | Every live row accepted for the bound candidate |
| `COPY-AI-SHARE` | `ai-governance-share:en` | Title and text passed to the native share action | `pending` | Every live row accepted for the bound candidate |
| `COPY-PROFILE` | `profile:en` | Canonical Foundation, module, and AI strings reused by Profile | `pending` | Every reused live row accepted in Profile context |
| `COPY-PROFILE-OG` | `profile-open-graph:en` | Valid-profile title and description | `pending` | Every live row accepted for the bound candidate |

The fixture declares no Simplified Chinese Foundation share-card surface. That
absence is an inventory boundary, not an editorial decision and not a
`not-live` disposition.

## 3. Candidate binding and allowed row states

A row disposition is valid only when it records all of these fields:

- ledger surface ID and runtime manifest surface;
- runtime row ID;
- text hash, recorded separately from the `runtime-copy-` row-ID prefix;
- full 40-character candidate commit SHA;
- one allowed state;
- named human reviewer;
- ISO review date in `YYYY-MM-DD` form;
- a nonempty rationale tied to the block's declared job and reader context.

The only allowed states are:

| State | Meaning | Release effect |
| --- | --- | --- |
| `pending` | The exact row and surface context have not received a complete human decision for the bound candidate. | Blocks release |
| `accepted` | A named human read the exact block in its surface context and found that it performs its declared job clearly and without unnecessary repetition or defensive framing. | Passes this row only for the recorded candidate SHA |
| `revise` | A named human identified a reader-facing problem and recorded what must change. | Blocks release; the revised committed candidate must be rendered again |
| `not-live` | A named human verified that the generated row is not reader-visible on the candidate and cited the route, state, or reachability proof. | Excluded only for the recorded candidate SHA and rationale |

Do not infer approval across surfaces when one deduplicated row lists several
surfaces. Context must be reviewed and recorded separately. A text change
changes the hash and invalidates the old disposition. A candidate SHA change
also requires a new bound record. Unchanged decisions may be carried forward
only when a human verifies the same row ID and text and records that decision
against the new candidate SHA.

No row-level records appear below because named human review has not started.
Add one record per row and surface context as decisions are made.

| Ledger surface | Runtime surface | Row ID | Text hash | Candidate SHA | State | Reviewer | Review date | Rationale |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

## 4. Render and inspect the inventory

Run these commands from the repository root. The first two commands establish
the binding. Stop if `git status --short` prints any path, because the resulting
inventory would not be fully represented by the printed SHA.

```bash
git rev-parse HEAD
git status --short
npm run copy:render:runtime > /tmp/v23-5-runtime-copy-inventory.json
jq -e '.manifestValidation.passes == true and .validation.passes == true and .validation.editorialApproval.status == "not-recorded"' /tmp/v23-5-runtime-copy-inventory.json
jq '{occurrenceCount, uniqueTextCount, reviewState, manifestValidation, validation}' /tmp/v23-5-runtime-copy-inventory.json
```

Inspect the declared scope and exclusions before reading rows:

```bash
jq '.surfaceManifest[] | {surface, blocks, coverageScope, exclusions}' /tmp/v23-5-runtime-copy-inventory.json
```

To inspect one surface, replace the example surface value with another value
from the surface table:

```bash
jq -c --arg surface 'foundation-result:en' '.rows[] | select(.surfaces | index($surface)) | {id, text_hash:(.id | sub("^runtime-copy-"; "")), text, blocks, jobs, occurrences:[.occurrences[] | select(.surface == $surface)]}' /tmp/v23-5-runtime-copy-inventory.json
```

After review or revision, rerun the deterministic copy gate:

```bash
npm run copy:audit:strict
git diff --check
```

The JSON in `/tmp` is a disposable rendering aid. Do not treat it as accepted
evidence, and do not copy model output or participant material into this
ledger.

## 5. What the inventory proves and does not prove

The statements in this section follow the scope and exclusions declared in
`lib/narrative/runtime-fixtures.ts` and
`scripts/render-runtime-copy.mts`.

### Structural proof only

- A passing manifest proves that every declared block was observed, no
  undeclared block was observed, and no manifest surface was duplicated.
- A passing module oracle proves only coverage of the exposed headline and
  lane callback branches. It is not exhaustive coverage of module answer
  space, decisive calls, card types, page states, or static copy.
- A generated row proves that source code emitted a nonempty exact text block
  with provenance. It does not prove editorial quality, reader
  comprehensibility, route reachability, layout, adjacency, or release
  readiness.
- Rows are deduplicated by exact text and retain their occurrences. Reviewers
  must still inspect every surface context in which shared text appears.

### Surface limitations and exclusions

- English Foundation coverage includes computed narrative, payoff, modifier,
  driver, dimension, runner-up, and pressure-test helper output. Page-local
  interface text, reading lists, invalid-result copy, and core-versus-extended
  actions are excluded. Synthetic branch probes are not proof that every row
  is reachable from a valid scored payload.
- Simplified Chinese Foundation coverage includes the narrative returned by
  the localized narrative builder. Localized page chrome, static methodology,
  invalid-result copy, and reading lists are excluded.
- Foundation Open Graph coverage excludes invalid-result metadata. The
  Foundation share-card inventory excludes static brand and method labels.
- Security and Technology use deterministic answer witnesses for every
  headline and lane branch found by the public calibration oracle. Frozen
  question and option banks, static result chrome, score captions, links, and
  research-status copy are excluded. Security coverage is not exhaustive for
  decisive-call combinations. Technology coverage is not exhaustive for
  card-type or decisive-call combinations.
- AI result coverage spans declared archetypes, axis endpoint pairs,
  modifiers, payoff debates, tensions, comparisons, and evidence-shift
  helpers. It does not prove every axis ordering or simultaneous multi-axis
  configuration. Static page chrome, reading lists, and invalid-result copy
  are excluded. AI Open Graph coverage excludes invalid-result metadata, and
  native browser or operating-system share UI is outside the repository.
- Profile coverage inventories canonical saved-layer strings reused by the
  component. It instantiates no Profile state combinations and makes no claim
  of new cross-layer prose. Static empty, unavailable, history, action, and
  explanatory copy require separate component and human review. Frozen-bank
  evidence-log text is excluded. Profile Open Graph coverage excludes invalid
  or unavailable metadata.

These exclusions remain work for the relevant source-copy, component,
route-state, screenshot, accessibility, or frozen-bank gates. They must not be
silently treated as `accepted` or `not-live` in this ledger.

## 6. Staged human review workflow

### Stage 0: bind the candidate

1. Commit the complete candidate intended for review.
2. Confirm that `git status --short` is empty.
3. Record the full SHA returned by `git rev-parse HEAD`.
4. If any source changes after rendering, stop and return to this stage.

### Stage 1: check the renderer

1. Render the JSON inventory with the commands above.
2. Confirm both validation objects pass and editorial approval remains
   `not-recorded`.
3. Read every manifest scope and exclusion before reviewing copy.
4. Stop if a blocking gap appears. Do not review around an incomplete
   manifest.

### Stage 2: learn the record on small surfaces

1. Start with Foundation Open Graph, Foundation share card, AI Open Graph, AI
   share, and Profile Open Graph.
2. For each row, read the text, declared job, block name, input provenance, and
   occurrence context.
3. Record the row ID, text hash, candidate SHA, human reviewer, date, state,
   and rationale.
4. Use this small pass to check that the record format is consistent before
   moving to larger result surfaces.

### Stage 3: review complete result prose

1. Review English Foundation, then Simplified Chinese Foundation with a human
   able to judge that locale.
2. Review Security and Technology in both Standard and Analyst occurrence
   contexts.
3. Review AI v3 result rows across the declared archetype, modifier, and axis
   contexts.
4. Read complete user-visible blocks. Consult source fragments only to trace a
   defect, not as a substitute for reading the rendered result.

### Stage 4: review Profile reuse

1. Review every canonical saved-layer string again in Profile context.
2. Do not infer Profile acceptance from acceptance on its source result page.
3. Route excluded static and state-dependent Profile copy to its separate
   component review instead of giving it a ledger state here.

### Stage 5: revise and rerender

1. A `revise` row remains a release blocker.
2. Make the authorized copy change outside this ledger, commit the candidate,
   and rerender.
3. Treat new row IDs as `pending`. Preserve superseded decisions only as
   history and never as approval for the new SHA.
4. Rerun the strict copy audit and the relevant route, component, and visual
   checks.

### Stage 6: close the gate

1. Confirm every generated row has a disposition for every surface context.
2. Confirm every live row is `accepted` and every `not-live` row has specific
   human reachability evidence.
3. Confirm no `pending` or `revise` row remains.
4. Have the human release owner sign off on the surface summary and keep Phase
   3 active and unaccepted until that sign-off is recorded.

## 7. Privacy and approval boundary

This is an editorial review ledger, not a participant-research record. Do not
enter participant names, contact details, quotations, response data, session
notes, or participant-level issue histories. Route human-research material to
the restricted workflow defined by the cognitive interview pack.

Models and automated tools may render, classify, count, and route candidate
text. They may not populate the reviewer field, choose `accepted` or
`not-live`, approve a rationale, or sign off the release. Only a named human
reviewer may make a ledger disposition.
