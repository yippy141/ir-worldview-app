# V23.1 Archetype and Explore Plan

Status: implementation plan; no product code is changed by this document

Depends on: `docs/v23/V23_MASTER_CONTRACT.md`

Repository baseline audited: `v23-1-archetype-explore` at `f95cc7c1629e7e608910b2413b5d01bbf0fc974d`

Prepared: 2026-08-12

## 1. V23.1 outcome and PR boundary

V23.1 makes the existing Foundation identity legible without changing how it is produced. The PR should deliver:

- one clear ontology hub at `/explore`;
- an English `/archetypes` index for exactly eight pure archetypes;
- expanded canonical content on the eight existing `/archetypes/[slug]` URLs;
- one versioned, owner-editable archetype content contract;
- a bounded, owner-editable Explore hub record;
- a deterministic, abstract, static sigil grammar for the eight pure codes;
- explicit support/modifier/domain/context hierarchy;
- preserved routes, payloads, stores, scoring, calibration, locale boundaries, and historical evidence;
- schema, compatibility, copy, accessibility, responsive, and print gates.

V23.1 does **not** redesign the Worldview Map, add a scored type, edit instruments, alter resolution, assign Decision Patterns, publish unsourced person profiles, localize unreviewed long form, activate Tier 1, or claim human validation.

Recommended V23.1 boundary: owner-select **Plan B**, for **25 core paths and no more than 27 when both evidence summaries regenerate, with 1,800-2,800 net hand-authored lines**. The optional atomic Plan A move raises the surface to about 28 core/30 generated-inclusive paths and should be chosen only if the owner accepts that larger review. If source-backed eight-record copy exceeds the selected ceiling, ship reviewed fields and explicit `research-required` statuses; do not inflate the PR or manufacture prose.

## B. Target information architecture

### B.1 Global hierarchy

Every affected surface should express the same order:

```text
Foundation result
  archetype OR legitimate two-lens blend          assigned general identity
  + strategic posture                            supporting modifier/sign
  + normative state                              supporting modifier
  + closest modeled tradition                    supporting evidence

Separate records
  Security / Technology / AI Governance          domain reads
  Perspective Runs                               role-conditioned comparisons
  Current Case judgments                         user decisions in a case
  Decision Patterns                              editorial reading aids, never assigned
  reference positions                            dated, sourced, partial public positions
```

This compact hierarchy appears near the top of `/explore`, in plain language. It should not be presented as a dashboard, taxonomy tree with dozens of badges, or a personality-type catalog.

### B.2 `/explore`: ontology hub

#### First viewport

The first viewport answers two questions before discussing method:

1. “What label is my result?” — a Foundation archetype or legitimate blend.
2. “How do the other labels relate to it?” — modifiers and closest tradition support the result; domain and contextual records remain separate.

It contains:

- one H1 and a two-sentence payoff;
- the compact hierarchy above;
- a primary link to `/archetypes` and a secondary link to `/profile` or the Foundation quiz;
- one short boundary sentence: Decision Patterns and public positions are reading aids, not assigned identities.

Do not put the full methodology caveat, human-testing status, or long canon discussion in the hero. Those belong below the first payoff.

#### Section contract

| Order | Section | Visible by default | Progressive disclosure and links | Presentation form |
|---:|---|---|---|---|
| 1 | **How the labels fit together** | Identity/support/context hierarchy and short definitions | One “How scoring and evidence differ” disclosure; `/method` | A semantic ordered list, not nested cards |
| 2 | **Eight Foundation archetypes** | All eight names, codes, glosses, and links | `/archetypes`; each stable `/archetypes/[slug]` | Four lens bands, each with `+/-` rows; restrained separators rather than eight identical floating cards |
| 3 | **Variants and blends** | Three normative aliases and sign explanation; a blend example only if its pair interpretation is reviewed | Comparison details collapsed; links to relevant archetype pages | Compact comparison rows; no type-count marketing or synthesized pair claims |
| 4 | **Four modeled traditions** | Four names, one-line scopes, and “supporting evidence” label | Existing `/explore/[tradition]` pages | Text-led link list or two-column editorial index |
| 5 | **Seven Foundation dimensions** | All seven dimension names and one-line definitions | Scoring/attainable-range detail collapsed; `/method` | Semantic definition list; no decorative radar chart |
| 6 | **Decision Patterns** | Definition, never-assigned boundary, and Map link | Ten names may sit in one collapsed directory; existing detail URLs | Editorial list, visually distinct from archetypes |
| 7 | **Thinkers and public positions** | What evidence-coded partial resonance means; published record count derived at render from the validated visible reference catalog | `/explore/reference`; evidence/review explanation | Dated/source-status rows only; no unsourced “person as type” cards and no authored count literal |
| 8 | **Focus Areas and contextual records** | Separate rows for Security, Technology, AI Governance, Perspective Runs, and Current Cases | Existing module, AI, Perspective, and case routes | Differentiated rows with explicit object type; not a uniform card grid |
| 9 | **Coverage gaps and methods** | A short visible statement that four modeled traditions are not the field | Longer coverage/canon/method notes collapsed; `/method`, research status | Prose with readable line length and source links |

The page should use a compact jump navigation on desktop only if it remains helpful after composition. Do not reproduce the current long undifferentiated essay or stack nine near-identical card grids.

#### Cross-links

- Archetype rows link to the eight existing code-slug detail URLs.
- Each tradition links to its two associated pure archetypes as presentation support, not as a claim that all members of the tradition fit one posture.
- Decision Patterns link to `/explore/atlas` and existing Pattern details; no “find your Pattern” CTA.
- Reference-position copy links only to published records in `/explore/reference`.
- Domain/context rows point to their own entry surfaces and explicitly say they do not revise the Foundation.
- Coverage and dimension sections link to `/method`; methodology does not displace payoff copy.

### B.3 `/archetypes`: English index

The new index is a concise directory, not another results page.

Visible by default:

- H1 and a short statement that archetypes summarize continuous profiles;
- four lenses in canonical `P / R / M / S` order;
- two posture entries per lens with sigil, code, canonical name, plain gloss, and detail link;
- one equal-weight explanation of `+` applying advantage and `-` restraint;
- one brief normative-modifier row and, only when a reviewed pair record exists, one blend example;
- a route to `/explore` for the full ontology and `/method` for limitations.

Collapsed or delegated:

- long objections, sources, domain expressions, and historical discussion belong on detail pages;
- full blend comparison belongs in the detail context, not a twelve-combination index;
- no population distribution, prevalence, percentile, confidence, or “type count.”

Group entries by lens so the relationship is legible without relying on a desktop 4×2 layout. At 390px, each lens becomes a heading followed by two full-width link rows.

### B.4 `/archetypes/[slug]`: canonical detail plus historical evidence

The existing eight code-slug URLs become the canonical detail pages. The historical analogue page is not discarded; its content becomes a lower section of the expanded page.

Order:

1. **Payoff hero:** sigil, code, canonical name, gloss, lens/posture, closest modeled tradition as supporting evidence.
2. **What this reading notices:** notices first, policy instincts, and accepted tradeoff.
3. **Case for and pressure on the reading:** strongest case, strongest objection, common failure mode, and evidence that would weaken the fit.
4. **Neighbors:** named neighbors plus one separating question each.
5. **Normative variants:** equal-weight order-first, conditional, and justice-first presentations.
6. **Blends:** reviewed examples only; both active lenses, shared premise, unresolved disagreement, separating case, and testing Focus Area.
7. **Domain expressions:** clearly labeled editorial hypotheses, followed by links to the user’s actual domain records where applicable.
8. **Historical comparison:** preserve “Why this comparison fits,” “Where the comparison breaks,” P-/R+ name notes, analogue link, and source ledger.
9. **Related reading:** reviewed Decision Pattern and Current Case relations only; otherwise omit.
10. **Method and status:** content version, evidence status, review date, scope limits, and no-human-validation boundary.

Core interpretation, objection, and where-the-analogue-breaks copy are visible. Supplementary source metadata, all three variant comparisons, and long relation lists may use accessible disclosures. Print expands every disclosure needed to interpret a standalone page.

Preserve the current `?from=/results/<opaque>` back link and its strict allowlist. A non-result `from` value remains ignored.

### B.5 `/explore/[tradition]`

Keep the four existing routes and long-form scholarship. Make only bounded V23.1 changes:

- put “supporting tradition, not assigned identity” near the first payoff;
- link to that tradition’s `+/-` archetype pair with posture caveats;
- keep the existing claims, subtraditions, issue readings, neighbors, and reading lists;
- remove the sixteen unsourced “Associated thinkers” position cards from public rendering;
- replace them with a link to the evidence-coded reference directory and, where a reviewed relation exists, a dated/scoped reference-profile row;
- do not infer a person’s archetype from the family page.

The sticky table of contents stays desktop-only. On mobile it becomes a compact disclosure or is omitted in favor of normal document flow.

### B.6 `/explore/atlas`

V23.1 does not change Map code, layers, projection, or queries. The hub may link to the existing Map with accurate copy: it is currently a continuous editorial projection with the user baseline, saved Perspective Runs, Decision Pattern marks (on by default today), and eligible reference-position overlays. The 4×2 default matrix, baseline/blend encoding, off-by-default contextual overlays, and print repair belong to V23.2.

The target V23.2 hierarchy is:

1. matrix and user baseline;
2. normative modifier annotation;
3. optional Decision Pattern/reference/context overlays;
4. secondary continuous projection with explicit limitations;
5. complete semantic list.

### B.7 `/results/[payload]`

Keep the current payoff-first hierarchy:

- archetype or blend name/code first;
- closest modeled tradition as support;
- strategy and norm modifiers below;
- seven dimensions and methods later;
- historical analogue only for a pure archetype;
- invalid payload recovery unchanged.

A link from the result to the canonical archetype detail is **optional V23.1**. A sigil may accompany the visible code if it is decorative beside the same name/code. Do not change payload decoding, result resolution, metadata identity, score display, or blend construction.

### B.8 `/profile`

Keep the current Profile hierarchy:

- exact-payload Foundation archetype first;
- closest tradition as support;
- Security, Technology, and AI records in separate domain sections;
- Perspective Runs and Current judgments as contextual records;
- Decision Patterns as a collapsed browse-only aid.

An archetype-detail link and decorative sigil are optional. Do not cache or persist a new archetype identifier, promote a Decision Pattern, or derive identity from a cached family value.

### B.9 Responsive, print, and locale behavior

#### Mobile

- Acceptance viewport is 390px wide; no horizontal matrix is required to understand the index or hub.
- Use one-column lens groups and document order matching visual order.
- Keep prose near 65-72 characters on wide screens and naturally full width on mobile.
- Controls, disclosure summaries, and linked card/row surfaces have at least a 44×44px target. Ordinary inline prose links are exempt from the box size but retain spacing, visible focus, keyboard access, and readable line height.
- No fixed side navigation, hover-only explanation, clipped long name, or color-only code distinction.
- Preserve visible focus and logical keyboard order.

#### Print

- White background, black/gray `currentColor`, no shadows or fixed controls.
- Expand essential disclosures, retain source labels/URLs, and show evidence/status metadata.
- Avoid page breaks inside compact index rows; allow long detail sections to break normally.
- Do not clip sigils, long names, objections, or “where it breaks” copy.
- `/explore` prints the hierarchy and all section definitions without interactive controls.

#### English and Simplified Chinese

- English receives the full V23.1 hub, index, and detail content.
- `/zh/explore` and `/zh/archetypes*` remain explicit translation-status pages.
- Do not add a zh `hreflang` alternate, sitemap entry, or approved-route declaration for these unapproved routes. Retain the status page’s visible user-controlled link to the English source route.
- Existing zh result/Profile continues to show canonical name/code plus a review notice, with no English long-form fallback.
- Existing approved zh Map, Decision Pattern, and reference routes are regression-tested and otherwise unchanged in V23.1.

### B.10 Visual-system constraint

Use the existing editorial Astrolabe system: restrained navy/brass neutrals, serif display hierarchy, legible sans text, rules, spacing, and document rhythm. Prefer bands, definition lists, and link rows over a wall of identical cards. Do not introduce gradients, neon, glass effects, oversized shadows, dashboard widgets, decorative charts, or a separate color identity for each archetype. Sigils and visible codes carry identity; color remains supplementary.

`components/archetypes/archetypes.module.css` owns index/detail layout and sigil contexts. `app/explore/explore.module.css` owns the hub and bounded tradition-page additions. Both include scoped mobile and print rules: print expands essential `<details>`, hides controls/CTAs, exposes source URLs, and prevents row/sigil clipping. Do not solve the redesign with additional inline style objects or broad global spillover.

## E. Sigil system

### E.1 Semantic grammar

The sigils are code-derived identifiers, not cultural emblems. They do not depict historical analogues, national traditions, religious objects, named people, or policy domains.

Common construction rules:

- normalized `0 0 24 24` view box with a nominal safe area from 3 to 21;
- monochrome `fill="none"`, `stroke="currentColor"`, nominal 1.75-unit stroke;
- simple lines and paths with no text, embedded image, mask, filter, gradient, external reference, or animation;
- no arrowheads, chevrons, stars, shields, flags, crests, crowns, weapons, crosses, crescents, runes, seals, or letterform tracing;
- one upright orientation; do not rotate marks to create additional meanings;
- visible code/name remains adjacent at 24px; the mark is never the sole encoding.

Four lens bases:

| Lens | Abstract base topology | Distinguishing feature |
|---|---|---|
| `P` | Two separated vertical supports joined by one off-center horizontal bridge | Open top and bottom; asymmetry comes from bridge placement, not a literal letter P |
| `R` | Two horizontal rails with short alternating orthogonal returns at opposite ends | Open frame; no closed badge or shield silhouette |
| `M` | Two mirrored open curves facing a central gap | Curved topology; no enclosing circle, eye, or religious mandorla |
| `S` | Three separated horizontal strata crossed by one off-center vertical spine, with small gaps at every crossing | Layered structure without a stepped, rotational, woven, letterform, cross, or closed-insignia silhouette |

Each base declares two posture anchors and an outward vector. One transformation is applied mechanically to both anchors:

- **Applying advantage `+` — `project`:** append a short collinear segment away from the center at both anchors. Endpoints stay blunt/round; there are no arrows or rays.
- **Restraint `-` — `contain`:** append a short orthogonal return toward the center at both anchors, ending before the centerline. The returns never join into a box, cross, or lock.

This yields exactly eight deterministic marks. The transformation changes terminal behavior, not the lens topology. It must be legible at 24, 48, and 96px and at watermark scale.

These descriptions are a construction contract, not final art. Geometry cannot ship until the collision review in E.5 passes.

### E.2 Definition type

```ts
type SigilPoint = readonly [x: number, y: number];

type SigilPrimitive =
  | { kind: "line"; from: SigilPoint; to: SigilPoint }
  | { kind: "path"; d: string };

type PostureAnchor = {
  point: SigilPoint;
  outward: SigilPoint;
};

type LensSigilBase = {
  lens: LensCode;
  viewBox: "0 0 24 24";
  primitives: readonly SigilPrimitive[];
  postureAnchors: readonly [PostureAnchor, PostureAnchor];
};

type PostureTransform = {
  posture: PostureSign;
  operation: "project" | "contain";
  extension: number;
};

type SigilDefinition = {
  code: PureArchetypeCode;
  lens: LensCode;
  posture: PostureSign;
  viewBox: "0 0 24 24";
  strokeWidth: 1.75;
  primitives: readonly SigilPrimitive[];
};
```

The implementation derives the eight `SigilDefinition` records from exactly four `LensSigilBase` records and exactly two `PostureTransform` records. It must not hand-author eight unrelated SVG files.

### E.3 Manifest and rendering ownership

- `lib/archetype-sigils.ts` owns typed base geometry, posture operations, deterministic generation, and the exact eight-definition manifest.
- Engineering owns determinism, view box, rendering safety, and type/code coverage.
- Product design owns optical balance at required sizes.
- Editorial/methodology owns the posture-label wording.
- The owner signs the cultural/visual collision record before public use.

`components/archetypes/archetype-sigil.tsx` is a server-safe component with no client boundary:

```ts
type ArchetypeSigilProps = {
  code: PureArchetypeCode;
  size: 24 | 48 | 96 | number;
  className?: string;
  decorative?: boolean;
  label?: string;
};
```

- `decorative=true`: SVG receives `aria-hidden="true"` and `focusable="false"`.
- meaningful: SVG receives `role="img"` and a route-locale label supplied from the canonical content record, such as “Kairos archetype sigil, P plus.” Geometry never owns human-language copy.
- If the adjacent link already announces the same name/code, the sigil is decorative to prevent duplicate speech.
- On approved zh surfaces, a sigil remains decorative until localization explicitly approves its meaningful accessible name; an English manifest label must never leak.
- The component inherits `currentColor`; it accepts no arbitrary fill palette.
- Static SVG is the baseline. V23.1 adds no animation, transition, stroke-dash behavior, or motion dependency.

### E.4 Required and optional uses

Required V23.1:

- `/archetypes` index rows;
- `/archetypes/[slug]` hero and compact relation rows;
- print versions of those surfaces.

Optional V23.1, only after the core PR remains within bounds:

- pure Foundation result and Profile hero;
- 1200×630 share card;
- small Explore archetype directory rows.

Blends display the two pure sigils with a textual connector; they never receive a ninth/twelfth hybrid mark. Domain records and Decision Patterns do not reuse Foundation sigils.

### E.5 Cultural and visual collision review

Before merge, create `docs/v23/V23_1_SIGIL_COLLISION_REVIEW.md` for the exact rendered geometry. The record contains the geometry/version digest, component commit, render-artifact name and digest, 24/48/96px and watermark render matrix, reviewer IDs/roles/dates, categories checked, per-mark findings, requested changes, and an explicit `approved` or `blocked` outcome. The grammar may receive owner approval before implementation; final approval applies only after all eight exact marks have rendered. Two reviewers must independently check:

- religious, national, ethnic, occult, and culturally proprietary resemblance;
- political-party, military, police, extremist, and state-security insignia;
- major corporate/product logos and common certification marks;
- accidental letter, number, punctuation, or literal `+/-` dominance;
- collisions between the eight marks at small size;
- misleading resemblance created by cropping, dark mode, print, or 200% zoom.

A flagged collision blocks that geometry. The base or transform is revised, the digest changes, and all eight derived marks are re-rendered and re-reviewed. The review does not claim universal cultural clearance; it records the categories and reviewers checked. The E2E render matrix is retained as a named CI/PR artifact rather than adding image snapshots to the repository; the checked-in review record binds approval to its digest.

### E.6 Tests

- exactly four bases, two transforms, and eight output definitions;
- exact one-to-one coverage of the frozen pure codes and no blend definition;
- eight unique serialized geometries;
- deterministic output across calls and build environments;
- `viewBox="0 0 24 24"`, `currentColor`, allowed primitive set, and bounded coordinates;
- no `text`, `image`, `use`, external `href`, filter, mask, gradient, animation, script, or generated random ID;
- deterministic inline SSR snapshots/serialization assertions for decorative and meaningful accessibility modes in `tests/v23-archetype-sigils.test.mts`;
- a browser-rendered artifact at 24/48/96px and watermark scale in default dark, black-on-white, white-on-black, and print contexts;
- adjacent visible code/name and non-color distinction;
- static behavior under `prefers-reduced-motion`;
- no clipping at 200% zoom and in print.

## F. Copy ownership and content migration

### F.1 Bounded target structure

The owner must select one path before implementation. **Plan B is recommended for V23.1** because it provides owner-editable JSON and one canonical accessor with less path churn. Plan A is the cleaner eventual directory layout:

```text
content/
  archetypes/
    catalog.en.json
    evidence.json
  explore/
    hub.en.json
    traditions.en.json          # optional mechanical move in V23.1
  locales/
    zh-Hans/
      manifest.ts               # existing; long form remains excluded
```

The two root JSON files and the proposed directory can technically coexist; the reason for an atomic delete/add is semantic, not a filesystem constraint. Plan A deletes the two root files in the same change that adds the two directory files and updates every import, so there is never more than one live canonical code/name/gloss record.

**Plan B** keeps and expands `content/archetypes.json` and `content/archetype-evidence.json`, then exposes one joined typed accessor. It does not add `content/archetypes/catalog.en.json` or `content/archetypes/evidence.json`. The schema and ownership rules below apply to whichever two physical files the owner selects. Do not add a third archetype catalog beside them.

### F.2 Proposed-file contract

| File | Owner | Schema and validation | Copy-audit coverage | Source fields | Translation status | Fallback behavior |
|---|---|---|---|---|---|---|
| `content/archetypes/catalog.en.json` | Editorial + methodology; engineering owns keys/schema | `ArchetypeContentCatalog` schema v1; exactly eight unique frozen codes/slugs; lens/posture/family consistency; complete required field wrappers; all relations resolve | Required recursive scan; strict public-copy checks | Claim-level `kind`, `sourceIds`, date/scope/qualification/review/status; shared source IDs resolve in evidence ledger | English source record with `contentVersion`; canonical names/codes may be separately declared locale-neutral | Missing/unreviewed text is `research-required` or `withheld`; renderer never generates or borrows another locale |
| `content/archetypes/evidence.json` | Research editor | Evidence schema v2 after migration; stable source IDs, HTTPS, source kinds, review state, catalog-version link, and review history. Public `whyItFits`/`whereItBreaks` prose lives only in `catalog.en.json` | Required recursive scan for public source titles/labels; separate source-integrity tests | Full source ledger with author/institution, title, publisher, dates, URL, kind, status | Locale-neutral metadata plus source-language titles; translated summaries require separate approval | Missing evidence blocks publication of the linked claim, not the resolver or unrelated reviewed fields |
| `content/explore/hub.en.json` | Product editorial + methodology | Section IDs/order locked to the nine-section IA; valid internal route IDs; high-value prose only; published reference counts are runtime-derived | Required recursive scan | Source IDs optional only for authored product/ontology explanation; historical, scholarly, and current-policy claims follow the mandatory Master Contract source rules | English only, versioned | No zh import. `/zh/explore` remains the status page |
| `content/explore/traditions.en.json` | Research/editorial | Existing four family keys and canonical slugs only; structured claims/readings; no unsourced position card | Required recursive scan | Existing readings plus claim/source metadata as migrated | English only | If optional move is deferred, `lib/explore-content.ts` remains owner for one PR; it must still remove public unsourced thinker cards |
| `content/locales/zh-Hans/manifest.ts` | Localization owner | Existing approved/excluded deck contract and source-copy version checks | Already scanned | Translation provenance, reviewer/status; no invented source claims | `archetype-layer` and ontology long form remain excluded in V23.1 | Explicit unavailable/review notice; never English long-form fallback |

Under Plan B, the first two rows map respectively to the existing `content/archetypes.json` and `content/archetype-evidence.json`; no directory archetype files are created. Existing source labels/URLs migrate with null unknown metadata and `legacy-minimal`/`provisional` status under the Master Contract’s narrow grandfather rule. Engineering never infers bibliographic fields.

### F.3 Runtime adapters

- `lib/archetypes.ts` remains the resolver/identity compatibility API. It reads and validates only the frozen identity projection—code, canonical name, slug, gloss, family, and analogue display values—from the owner-selected canonical file. It never imports `lib/archetype-content.ts`, so malformed rich research fields cannot break Results, Profile, comparison, or legacy links.
- `lib/archetype-content.ts` uses type-only imports from `lib/archetypes.ts`, validates and joins rich catalog/evidence fields, and fails closed per field/publication state on the index/detail surfaces. A bad claim blocks that claim or page build, never Foundation identity resolution.
- The canonical catalog is the sole slug-value owner. `lib/archetype-evidence.ts` owns only route parsing, path construction, static-param selection, and the safe result return-path allowlist; it validates/delegates to the canonical values instead of defining a slug table.
- `lib/explore-content.ts` validates the nine-section hub record and keeps its four-tradition compatibility API during V23.1. If `traditions.en.json` moves in the same PR, it becomes a typed compatibility adapter; if not, that move is optional follow-up.

### F.4 Copy that moves and copy that stays

Move out of TSX or large engineering records:

- Explore hero payoff, ontology definitions, section introductions, modifier/blend explanation, domain/context boundary, and coverage summary;
- archetype gloss, notices, instincts, tradeoff, case, objection, failure mode, weakening evidence, neighbors/questions, variant/blend/domain copy, historical comparison, evidence status, and relations;
- substantive “tradition versus archetype” explanations;
- sourced/reviewed historical and current claims.

Keep close to components:

- generic navigation labels, button verbs, disclosure mechanics, form errors, loading/empty states, aria instructions, and route-specific invalid-payload recovery;
- short layout labels such as “Back,” “Sources,” or “Open details” where no editorial claim is involved.

Do not move every string into JSON. The test is whether an editorial owner should be able to revise the prose without changing a React component.

### F.5 Audit implications

`scripts/audit-public-copy.mjs` currently scans `content/archetypes.json` but not `content/archetype-evidence.json` and will not discover future directories automatically. V23.1 must:

1. scan the selected canonical archetype files (the `content/archetypes/` directory under Plan A, or both root JSON files under Plan B) and `content/explore/` recursively;
2. update the locked target assertions in `tests/public-copy-audit.test.mts`;
3. keep prevalence/assignment/validation-language guardrails over the migrated content;
4. add focused content/source validation without calling it psychometric evidence;
5. run `npm run evidence:audit:check` after the audit-root change;
6. if stale, regenerate `artifacts/evidence/current-summary.md` and `.json` with `npm run evidence:audit` and include only deterministic output. Never hand-edit those artifacts.

## I. V23.1 implementation sequence

### I.1 Required work

1. **Reconfirm baseline and update sprint authority.** Verify branch/HEAD/clean tree; read both V23 contracts and frozen tests. Replace, rather than append to, the stale V22 “Current sprint” section in `AGENTS.md` with V23.1 boundaries.
2. **Add the typed content layer.** Execute owner-selected Plan A (atomic move) or Plan B (in-place expansion), add schema/content versions and publication wrappers, separate frozen identity validation from rich publication validation, and lock exactly eight records. Preserve all existing values and evidence-page behavior before adding prose.
3. **Migrate approved prose.** Reuse current gloss/analogue/fit/break/name-note/source content under the explicit legacy-source rule; add only owner-reviewed V23 fields. Mark unavailable fields `research-required` or `withheld`. Do not invent bibliography metadata, actor assignments, pair relations, or related links.
4. **Implement and review static sigils.** Begin only after the owner approves the construction grammar. Add four bases, two transforms, the derived manifest, server component, and tests; render all eight; then complete the two-reviewer collision record against the exact geometry digest. A blocked or incomplete record stops merge.
5. **Add the archetype index.** Build `/archetypes` as a static English page with four lens groups and eight stable detail links.
6. **Expand detail pages in place.** Preserve all static params, historical sections, source links, name notes, and safe `from` behavior while adding the canonical content hierarchy.
7. **Recompose `/explore`.** Consume the owner-editable nine-section record; use editorial bands/lists rather than a card wall; retain existing route and link to all subordinate systems accurately.
8. **Clarify tradition pages.** Add support-role and archetype-pair links. Remove public unsourced thinker-position cards and point to evidence-coded references.
9. **Preserve locale boundary and routes.** Add English sitemap entries only. Keep `/zh/explore` and `/zh/archetypes*` on the explicit status surface. Do not create redirects.
10. **Expand audits and tests.** Add schema/source/sigil/route/content language coverage and visual/accessibility/print smoke tests. Regenerate evidence summaries only if the check proves them stale.
11. **Run all gates.** Stop at the first failure and report it; do not waive measurement or compatibility failures for presentation work.

### I.2 Exact required file surface

The required list below assumes recommended **Plan B**.

#### Add (10)

- `app/archetypes/page.tsx`
- `components/archetypes/archetype-sigil.tsx`
- `components/archetypes/archetypes.module.css`
- `app/explore/explore.module.css`
- `content/explore/hub.en.json`
- `lib/archetype-content.ts`
- `lib/archetype-sigils.ts`
- `tests/v23-archetype-content.test.mts`
- `tests/v23-archetype-sigils.test.mts`
- `docs/v23/V23_1_SIGIL_COLLISION_REVIEW.md`

#### Edit (15)

- `AGENTS.md`
- `content/archetypes.json`
- `content/archetype-evidence.json`
- `lib/archetypes.ts`
- `lib/archetype-evidence.ts`
- `app/archetypes/[slug]/page.tsx`
- `app/explore/page.tsx`
- `app/explore/[slug]/page.tsx`
- `lib/explore-content.ts`
- `app/sitemap.ts`
- `scripts/audit-public-copy.mjs`
- `tests/public-copy-audit.test.mts`
- `tests/i18n-routing.test.mts`
- `e2e/critical-smoke.spec.ts`
- `e2e/v22-visual-accessibility.spec.ts`

#### Generated only if the check proves them stale (up to 2)

- `artifacts/evidence/current-summary.md`
- `artifacts/evidence/current-summary.json`

#### Plan A substitutions, if explicitly selected

- Add `content/archetypes/catalog.en.json` and `content/archetypes/evidence.json` instead of editing the two root JSON files.
- Delete `content/archetypes.json` and `content/archetype-evidence.json` in the same change.
- Edit the stale source-path comment in `lib/results/posture.ts` so it names the canonical accessor rather than a moved file.
- Keep every other common path above. This makes Plan A approximately 28 core paths, or 30 if both evidence summaries regenerate.

Under either plan, compatibility tests must pass before UI composition begins. The collision-review document is created as `blocked/pending` with the grammar, then may become `approved` only after two reviewers assess the exact rendered geometry digest.

### I.3 Optional V23.1 work

Optional work is admitted only after required gates pass and the PR remains within the review bound:

- add `content/explore/traditions.en.json` and reduce `lib/explore-content.ts` to a compatibility adapter;
- add or adapt `components/explore/family-card.tsx` only if the optional tradition-content move needs a new typed prop;
- add archetype sigil/detail links to `app/results/[payload]/page.tsx`;
- add archetype sigil/detail links to `components/profile/profile-report.tsx`;
- add sigils to `app/api/card/route.tsx` and related share-card code/tests after real-platform preview scope is approved;
- publish reviewed related Current Case or Decision Pattern links;
- add per-tradition evidence-coded reference rows where a reviewed authored relation exists.

Optional items must not be partially scaffolded with invented or publicly visible placeholder content.

### I.4 Files and systems not to touch in V23.1

- `content/instrument/**`
- `lib/scoring.ts`, `lib/scoring/**`, and `lib/scoring-calibration.ts`
- calibration, diagnostic, discrimination, attainable-range, replay, and instrument fixtures
- `lib/share.ts`, `lib/profile-share.ts`, `lib/profile-store.ts`, and all payload/store decoders or migrations
- Foundation, module, AI, and Perspective version registries
- `lib/modules/**`, Security/Technology item banks and scorers
- AI Governance item bank, scorer, payload, and atlas content
- Perspective scoring, catalog IDs, payload, and scenario versions
- `lib/atlas-lite.ts` IDs/content/fingerprints/order
- `lib/current-cases/**` and `content/current-cases/**`
- `lib/reference-profiles/**` catalog values or evidence coding
- `app/explore/atlas/**`, `components/field/**`, `lib/field/**`, `lib/results/position.ts`, and Map CSS; these are V23.2
- `i18n/routing.ts` and `i18n/paths.ts`; enumerate the new English sitemap entries in `app/sitemap.ts` and preserve the approved zh boundary unchanged
- Tier 1, aggregate/research APIs, database migrations, credentials, analytics semantics, and external services
- `package.json`, lockfiles, or dependency manifests
- fonts, raster images, culturally borrowed assets, or animation libraries
- approved zh long-form decks, except a separately authorized manifest-only status clarification

If a required implementation unexpectedly needs one of these paths, stop and explain the blocker instead of widening scope.

### I.5 Migration order and safe checkpoints

Use three logical review checkpoints inside the PR, even if the final branch is delivered as one PR:

1. **Compatibility checkpoint:** owner-selected content migration/expansion + separate identity/rich-content accessors + existing archetype/evidence tests. UI output is unchanged.
2. **Content checkpoint:** new schema fields, source/status validation, and owner-approved records. No route composition yet.
3. **Presentation checkpoint:** sigils, index, expanded detail, Explore hub, responsive/print styles, and E2E coverage.

At each checkpoint, inspect the diff for changes to frozen code/name/slug mapping and forbidden files. The rollback point is the Prompt 0 baseline (or the future commit containing these two docs). Because V23.1 changes no persisted format or score, rollback is a single PR revert; all old links remain valid throughout.

## I.6 Test plan and acceptance gates

### Contract and unit tests

- exactly eight pure codes, four lenses, two postures, three normative states, and no ninth code;
- exact code/name/slug/family compatibility, including `Shi (勢)` pending owner decision;
- existing pure and blend resolver fixtures unchanged;
- valid same-posture two-lens composite output retained; blend analogues remain absent;
- canonical catalog has eight unique records and resolves every neighbor/source/relation ID;
- field-status rules prevent unreviewed prose from publishing;
- historical/current claims enforce their source/date/scope requirements;
- Decision Pattern language never assigns, matches, calculates, or diagnoses a user;
- people, governments, parties, movements, and organizations are never labeled archetypes;
- all eight historical routes, analogue sections, source ledgers, P-/R+ notes, and safe return paths survive;
- all four tradition slugs and all ten Decision Pattern IDs/routes survive;
- Foundation V2-V5, Profile Share V1-V3, and Profile Store V1-V5 fixtures remain unchanged;
- public-copy audit scans both new content directories;
- sigil determinism, uniqueness, accessibility, currentColor, and prohibited-element tests pass;
- no unapproved Chinese route or English long-form fallback is introduced;
- no validity, reliability, representativeness, cross-cultural-equivalence, prevalence, or population-percentile claim is added.

### Route and rendering smoke

- `/explore` includes the nine sections in contract order;
- `/archetypes` exposes exactly eight detail links;
- all eight existing code-slug pages render;
- `?from=/results/<opaque>` works and unsafe `from` values fail closed;
- the four tradition routes render and identify the family as support;
- all ten Decision Pattern routes still render in English and Chinese;
- `/zh/explore`, `/zh/archetypes`, and `/zh/archetypes/p-plus` render the explicit translation-status state;
- representative pure and blend result/Profile fixtures preserve the Foundation identity hierarchy;
- invalid and unreconstructable payload states remain graceful.

### Command gates

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

If `evidence:audit:check` reports stale generated artifacts because copy-audit inputs changed, run `npm run evidence:audit`, inspect the deterministic artifact diff, rerun the check, then continue. Do not update the fixture baseline merely to silence an unrelated failure.

### PR acceptance gates

The PR is acceptable only when:

1. only the frozen Foundation archetype or existing blend is assigned;
2. all eight names/codes/slugs and all compatible routes/payloads survive;
3. no scoring, calibration, item-bank, payload, store, Map, Tier 1, or domain-classifier code changes;
4. content is owner-editable, versioned, validated, and source/status aware;
5. unreviewed actor or related-content claims are withheld;
6. English/zh boundaries fail closed;
7. all required command, visual, print, accessibility, and performance gates pass;
8. the collision review approves all eight sigils;
9. the diff remains inside the agreed path/size ceiling or the PR is split before review;
10. release notes call automation and visual QA pretesting, not human validation.

## I.7 Visual QA matrix

Use Chromium at 390×844, 768×900, and 1440×900, plus print preview. Test the default dark display and forced monochrome/currentColor print.

| Surface | 390px | 768px | 1440px | Print |
|---|---|---|---|---|
| `/explore` | One-column order, 44px targets, no overflow | Section rhythm and optional jump nav | Editorial hierarchy, readable line length | All nine definitions, no controls, sources retained |
| `/archetypes` | Four stacked lens groups; long names wrap | Pair layout remains legible | Four-lens directory, no card wall | Eight codes/names/sigils visible |
| `/archetypes/p-plus` | Hero, objections, sources, no clipping | Two-column opportunities remain semantic | Full hierarchy and line length | Analogue fit/break and source URLs visible |
| `/archetypes/p-minus` and `/r-plus` | Name-note behavior and long glyph/name | Same | Same | Name note prints |
| `/archetypes/m-minus` and `/s-minus` | Long canonical names, neighbor rows | Same | Same | No split/crop in compact rows |
| One `/explore/[tradition]` | No sticky-width trap; thinker cards removed | TOC behavior | Support-role links visible | Reading/source lists survive |
| Pure result, blend result, Profile | Identity unchanged; optional sigil nonessential | Same | Same | Existing print hierarchy unchanged |
| Invalid result/Profile state | Recovery visible | Same | Same | No misleading identity |
| `/zh/explore`, `/zh/archetypes/p-plus` | Explicit status; no English long form | Same | Same | Status only, no fallback |
| Existing `/zh/results`, `/zh/profile`, `/zh/explore/atlas` | Regression, CJK glyphs, no overflow | Same | Same | Existing approved behavior |

For every screen, assert `scrollWidth <= clientWidth + 1`. Add a 320-CSS-px/400% reflow check for the hub, index, representative detail, and zh status page. Review all eight sigils at 24/48/96px, 200% optical zoom, black/white reversal, and watermark scale. Screenshots are visual QA evidence, not human-validation evidence.

## I.8 Print QA

- Check A4 and US Letter for `/explore`, `/archetypes`, one detail with a name note, and one without.
- Hide site navigation, sticky TOC, jump controls, action buttons, and interactive-only hints.
- Expand interpretation-critical disclosures using the project’s existing print-details pattern.
- Preserve source titles and visible URLs; do not print only link-colored text.
- Use white background, black/gray `currentColor`, no gradients/shadows, and no animation state.
- Avoid clipped SVGs, fixed overlays, orphan headings, and forced page breaks inside long prose.
- Confirm all eight index entries, objection, “where it breaks,” evidence status, and review date print.
- A zh status page must not expose unapproved English merely because print styles expand content.

## I.9 Accessibility QA

- Exactly one H1 per route and a logical heading hierarchy.
- Archetype rows are semantic links/articles; no click-only `div`.
- Adjacent repeated sigils are decorative; stand-alone sigils have a concise `role="img"` label.
- Code, name, posture text, and layout encode meaning without color.
- Body, muted, link, and focus text meet WCAG AA contrast on the default dark surface; meaningful sigils, focus indicators, and UI components meet at least 3:1 non-text contrast.
- All links and disclosures work by keyboard with visible focus. Controls, disclosure summaries, and linked rows meet 44×44px; ordinary inline prose links use normal inline sizing with adequate spacing and line height.
- Browser automation checks landmark/heading/link names, keyboard disclosure behavior, focus visibility/return, no critical accessibility-rule failures under the repository’s existing harness, and the explicit contrast values. Do not add a dependency solely for this gate.
- Collapsed supplementary content remains discoverable; essential payoff and objections are not hidden.
- Focus order follows document order at 390px and at 320 CSS px/400% reflow; 200% remains the sigil optical-review level.
- Source links have descriptive accessible names.
- `prefers-reduced-motion` sees the same static marks and no transition-dependent information.
- Printed content remains semantically ordered even when controls are suppressed.

## I.10 Performance budget

The repository has no accepted numeric Lighthouse or bundle baseline, so V23.1 must not invent one. The binding structural budget is:

- zero new dependencies and zero lockfile changes;
- zero external image, font, icon, or runtime network requests for sigils/content;
- static/server-rendered `/explore`, `/archetypes`, and `/archetypes/[slug]`;
- zero new client boundary or hydration for static archetype content;
- eight compact inline SVG definitions generated from four bases/two transforms;
- no animation JavaScript, geometry library, or runtime layout measurement;
- no eager Map import or Map bundle change on the ontology pages;
- all static params complete at build time;
- no new client JavaScript for the required scope; any unexpected client-chunk increase is a review failure until explained.

## I.11 Release separation

| Release | In scope | Explicitly out of scope |
|---|---|---|
| **V23.1 Archetype + Explore** | Canonical eight-record presentation content, index/detail, ontology hub, variants/blends explanation, static sigils, compatibility/audit/QA | Map redesign, scoring, new codes, domain measurement work |
| **V23.2 Worldview Map** | Primary 4×2 matrix, exact baseline/blend/norm contract, secondary projection, optional overlays, honest overlap, mobile/print/a11y repair, zh fallback hardening | New scored identities or domain rescoring |
| **V23.3 Security** | Security measurement/presentation work under a separate scoped prompt | Technology/AI/Foundation rewrite |
| **V24 Economic Statecraft** | New explicitly scoped Economic Statecraft work after measurement/content authorization | Implicit reuse of Critical Political Economy as a scored substitute |
| **V25 Energy/Resource** | New explicitly scoped Energy/Resource work after measurement/content authorization | Silent domain expansion through editorial copy |

## 2. Inspected repository surface

The plan is grounded in the current repository, including:

- authority/history: `AGENTS.md`, `PRODUCT.md`, `docs/v22/V22_ARCHETYPE_NAMING_DECISION.md`, `docs/v22/V22_IMPLEMENTATION_AUDIT_2026-08-02.md`, `docs/v22/V22_PM_HANDOFF_2026-08-01.md`, `docs/v22-5/V22_5_FOUNDATION_IDENTITY_MIGRATION.md`, `docs/v22-5/V22_5_REV3_RECONCILIATION.md`, `docs/research/V22_5_HUMAN_TESTING_STATUS_2026-08-12.md`, `docs/research/V22_5_COGNITIVE_INTERVIEW_PACK.md`;
- Foundation/content: `content/archetypes.json`, `content/archetype-evidence.json`, `lib/archetypes.ts`, `lib/archetype-evidence.ts`, `lib/scoring.ts`, `lib/scoring/v2.ts`, `lib/scoring-calibration.ts`, `lib/types.ts`, `lib/share.ts`, `lib/profile-foundation-identity.ts`, `lib/profile-share.ts`, `lib/profile-store.ts`, `lib/worldview-config.ts`, `lib/copy/glosses.ts`;
- routes/surfaces: `app/archetypes/[slug]/page.tsx`, `app/results/[payload]/page.tsx`, `app/[locale]/results/[payload]/page.tsx`, `components/profile/profile-report.tsx`, `components/profile/profile-dashboard.tsx`, `components/profile/current-judgments-section.tsx`, `app/explore/page.tsx`, `app/explore/[slug]/page.tsx`, `app/explore/atlas/page.tsx`, `app/explore/reference/page.tsx`, `app/explore/reference/[id]/page.tsx`, `app/sitemap.ts`;
- Map/Patterns: all `components/field/**`, all `lib/field/**`, `lib/results/position.ts`, `lib/results/map-layout.ts`, `lib/atlas-lite.ts`, `components/worldview-profile/worldview-profile-page.tsx`, and the approved zh counterparts;
- evidence/context: all `lib/reference-profiles/**`, `lib/current-cases/types.ts`, `lib/current-cases/catalog.ts`, `lib/current-cases/profile-connection.ts`, `content/current-cases/README.md`, current case JSON records, `lib/perspectives/types.ts`, `lib/perspectives/catalog.ts`, `lib/modules/types.ts`, `lib/ai-governance-types.ts`;
- locale/copy: `i18n/routing.ts`, `i18n/paths.ts`, `content/locales/zh-Hans/manifest.ts`, `content/locales/zh-Hans/worldview-map.ts`, `content/locales/zh-Hans/worldview-profiles.ts`, `lib/locale-provenance.ts`, `app/[locale]/[...slug]/page.tsx`;
- audits/tests/styles: `scripts/audit-public-copy.mjs`, evidence-audit scripts, `.github/workflows/ci.yml`, `app/globals.css`, `components/field/worldview-map.module.css`, relevant archetype, routing, field, reference, i18n, public-copy, compatibility, share/store, E2E, print, and visual-accessibility tests.

## 3. Exact next implementation prompt outline

The next prompt should contain these instructions, in this order:

1. **Baseline:** name the branch and the commit containing both V23 documents; print current branch, HEAD, and status; require a clean tree.
2. **Authority:** read `V23_MASTER_CONTRACT.md`, this plan, `AGENTS.md`, the V22.5 identity migration, the naming decision, human-testing status, and frozen compatibility tests.
3. **Owner decisions:** state the approved P- display name, normative aliases/glosses, launch publication policy, legacy-source migration rule, initial reviewed blend/related-content set, Plan A or B content path, sigil construction-grammar approval and designated collision reviewers, and English-only zh boundary. Final sigil collision approval occurs only after rendering.
4. **Scope:** implement **required V23.1 only**; explicitly ban scoring, instruments, calibration, payload/store, Map, Decision Pattern identity, domain classifiers, Tier 1, dependencies, external assets/services, and unreviewed person assignments.
5. **Content migration:** state the owner-selected path. For recommended Plan B, expand the two root JSON files in place; for Plan A, move them atomically into `content/archetypes/`. Add schema/content versions, the claim/source/status contract, exactly eight records, a frozen identity accessor, and a separate fail-closed rich-content validator.
6. **Sigils:** implement four bases + two transforms + eight deterministic static definitions and the accessible server component; stop if the owner-approved collision contract cannot be met.
7. **Routes:** add `/archetypes`; expand all eight existing detail routes in place; preserve historical sections, source ledger, names, slugs, static params, and safe `from` behavior.
8. **Explore:** recompose `/explore` into the nine ordered sections using owner-editable content; add bounded tradition support links; remove public unsourced thinker-position cards.
9. **Compatibility/i18n:** preserve all result/share/store/Decision Pattern/tradition/reference routes and formats; English long form only; zh status pages and approved surfaces remain explicit with no fallback; redirects remain empty.
10. **Tests/audits:** add the contract, source, sigil, route, language, mobile, print, and accessibility tests named in this plan; update copy-audit roots; regenerate evidence summaries only if the check proves them stale.
11. **Gates:** run `git diff --check`, validate, strict copy audit, evidence check, lint, test, typecheck, build, CI E2E, and final `git diff --check`; stop and report the first failure.
12. **Handoff:** report exact changed files, owner-reviewed versus withheld content, route/payload compatibility evidence, visual/print/a11y results, artifact changes, remaining research, and diff size. Do not stage, commit, push, or open a PR unless separately requested.
