# V22.5 Rev3 reconciliation and dependency map

**Reconciliation date:** 2026-08-06  
**Branch:** `main`  
**Audited commit:** `11907229ac25ab53b3e060d49312c0af1fb7fa68`  
**Plan context:** `IR_WORLDVIEW_V22_5_EVIDENCE_READY_BETA_PLAN_REV3_2026-08-06.md`

This is the Prompt 0 read-only reconciliation. It records the current production
dependency graph and the compatibility boundary. It does not implement the
V22.5 changes.

For this audit:

- **production import/use** means reachable from the shipped `app`, `components`,
  or `lib` graph, excluding tests, scripts, and documentation;
- **active hardcoded distributional claim** primarily means public result or
  explanatory copy that asserts or implies a frequency, prevalence, normality,
  rank, or reference-group comparison without deriving it from the exact live
  aggregate cohort;
- scored items and hypothetical premises can also contain frequency
  propositions. Section 3.4 inventories those separately because they ask the
  respondent to evaluate a proposition rather than reporting a respondent
  distribution;
- sourced Current Case facts and attributed summaries of scholarship are
  separated from respondent-distribution claims, but remain public-copy review
  surfaces;
- the four classifications below describe the required treatment, not work
  performed in this prompt.

## Classification legend

| Classification | Meaning in this reconciliation |
|---|---|
| **remove now** | Stop producing, assigning, or rendering this dependency on current V22.5 surfaces. |
| **preserve as static editorial content** | Keep the authored material, but do not use it to infer or assign a user identity. |
| **freeze for legacy rendering** | Keep the route, decoder, stored field, stable identity, tombstone behavior, or safety/privacy invariant needed by old links, saved data, or fail-closed operation. Do not extend it into the new model. |
| **migrate later** | Requires a subsequent implementation, editorial review, schema change, rename, or owner-operated production step. |

## Reconciled headline

1. There are exactly **four** production imports of the two Atlas matchers. All
   four assign an old Atlas pattern to a user and are **remove now**.
2. New Security and Technology results still generate, render, save, and share
   numerical `overlayDeltas`. They are not legacy-only today.
3. Current Profile synthesis uses those deltas to create directional arrows,
   “shift” narratives, integrated headlines, share metadata, and Atlas
   assignments. Those active uses are **remove now**.
4. The current module fallback sentence says “most answer patterns land here.”
   The named V22 seeded diagnostic reports 17.2%–32.2% for those result
   fallbacks, so the claim is false even within the project's declared
   calibration artifact.
5. The Current Case launch record was last evidenced, reviewed, and approved
   on 2026-07-17—**20 calendar days** before this reconciliation. There is no
   deadline or expiry field, and the catalog cannot represent “published archive
   exists, but no case is active.”
6. Tier 1 has preview/staging evidence, but the activation record says
   Production was not configured or deployed. All production activation steps
   remain owner-operated prerequisites.
7. Atlas IDs and pages, Foundation Share V2–V5, Module Payload V1–V3, AI Payload
   V1–V2, Perspective Payload V1, Profile Share V1–V3, local ProfileStore
   V1–V5, and the other compatibility contracts listed below must survive.

---

## 1. Atlas matcher production imports

Exactly four production files import `matchAtlasLiteFoundation` or
`matchAtlasLiteProfile`.

| Production import | Current effect | Treatment |
|---|---|---|
| `app/results/[payload]/page.tsx:4,237-244` imports and calls `matchAtlasLiteFoundation`. The result drives “Read the … profile” at `:546-548` and personalized Security and Technology forecasts at `:574-584`. | Assigns an old Atlas pattern to every rendered Foundation result. The nearby historical-case link at `:245-250` is independently selected from reviewed static case metadata and need not depend on the matcher. | **remove now** |
| `components/profile/profile-report.tsx:10,60-64` imports and calls `matchAtlasLiteProfile`. The match drives the layered hero at `:81-97` and the personalized pattern detail, fingerprint, neighbors, and links at `:199-230`. | Gives the integrated Profile a second inferred master identity. Its input state is also downstream of numerical module deltas. | **remove now** |
| `components/profile/profile-compare.tsx:4,21-34` imports and calls `matchAtlasLiteProfile` for both sides. The matches render two “worldview profile” cards at `:161-206`. | Assigns old Atlas identities to both shared Profiles. | **remove now** |
| `lib/current-cases/profile-connection.ts:1,47-85` imports and calls `matchAtlasLiteFoundation`, selects the matching case reading, and labels the response aligned, in tension, or not covered. It renders through `components/current-case/current-case-app.tsx:117-123,528-546`; assignment copy lives in `content/locales/en/current-cases.ts:72-73,100-115` and `content/locales/zh-Hans/navigation-controls.ts:131-132,159-174`. | Personalizes a Current Case reading by old Atlas assignment. | **remove now** |

Matcher logic and matcher metadata are interleaved with the static catalog in
`lib/atlas-lite.ts`; the split cannot be done by deleting only the bottom of the
file:

| Atlas dependency | Treatment |
|---|---|
| `matchAtlasLiteFoundation`, `matchAtlasLiteProfile`, and the score engine at `lib/atlas-lite.ts:694-803` | **remove now**, after the four call sites above stop depending on them |
| Matcher-only schema/context at `lib/atlas-lite.ts:12-26,74,77-91` and embedded `rules` blocks at `:143,202,260,318,378,437,494,551,608,666` | **remove now** after static content is split from matching metadata |
| Authored fields in `AtlasLitePattern` at `lib/atlas-lite.ts:53-73`, the ten records' editorial copy, fingerprints, neighbor IDs, static getters at `:672-692`, and stable IDs | **preserve as static editorial content** |
| Ten IDs and `/explore/atlas/<id>` URLs locked by `tests/atlas-lite.test.mts:13-50`, including localized detail routes | **freeze for legacy rendering** |
| Static Current Case reading accordions at `components/current-case/current-case-app.tsx:356-395` | **preserve as static editorial content**; they show rival authored interpretations without assigning one to the respondent |
| Current Case validation of stable Atlas IDs at `lib/current-cases/validation.ts:511-521`, reviewed `bestFitProfileId` values, sitemap entries, and localized IDs | **freeze for legacy rendering** |
| Split static content from rules and rename the public collection “Decision Patterns” or another non-personal taxonomy | **migrate later** |

No Foundation result or Current Case response payload stores an assigned Atlas
ID. The assignment is recomputed during rendering. Removing the matchers
therefore requires no Foundation or Current Case payload migration.

---

## 2. `overlayDeltas` and module-to-Foundation comparison UI

### 2.1 Current generation and persistence path

The current path is:

`Security/Technology definition` → `runtime-v2` → `ModuleResult` →
`ModuleProfileSync` → `ProfileStore/Profile Share` → `profile-helpers` →
Profile UI, metadata, sharing, and Atlas assignment.

| Dependency | Current behavior | Treatment |
|---|---|---|
| `lib/modules/types.ts:106,125-162` | Makes lane `delta`, result `overlayDeltas`, optional `comparison`, Foundation-aware lane summaries, `buildOverlayDeltas`, and `compareToFoundation` part of the module contract. | The active requirement is **remove now** from new Profile writes/reads; the existing shape is **freeze for legacy rendering** |
| `lib/modules/security.ts:298-331,391-400,430-435,464-473` | Generates Foundation-dimension deltas, authored “hardens/becomes more bounded/pushes” comparisons, and lane-relative copy. | Stop active rendering and persistence **remove now**; keep the registered V22 implementation **freeze for legacy rendering** |
| `lib/modules/technology.ts:309-341,389-395,424-429,470-475` | Generates Foundation-dimension deltas, authored “pulls/more comfortable/more coordinated” comparisons, and lane-relative copy. | Stop active rendering and persistence **remove now**; keep the registered V22 implementation **freeze for legacy rendering** |
| `lib/modules/runtime-v2.ts:170-199` | Invokes the current definition's bridge methods and returns `overlayDeltas` and `comparison`. | **freeze for legacy rendering** because V22 golden replay includes the deltas; remove its output from active Profile use now |
| `components/modules/module-result.tsx:80-111` and `components/profile/module-profile-sync.tsx:17-23` | Save every new module result's comparison and deltas into the Profile. | **remove now** for new saves |
| `lib/profile-store.ts:1097-1147` | During hydration, resolves the linked Foundation, passes it back into `summarizeLanes`, and invokes `compareToFoundation`, recreating lane deltas and comparison copy even when stored display copy is absent. | **remove now** from current Profile display reconstruction; preserve frozen legacy fallback data |
| `lib/profile-helpers.ts:486-508` | Calculates `Foundation score + overlayDelta`, clamps the value to 1–7, and emits synthetic overlay positions. | **remove now** |
| `lib/profile-helpers.ts:570-625` | Selects the strongest numeric shift, counts “meaningful shifts” at a hardcoded `0.55` threshold, and compares Security/Technology signs and magnitudes. | **remove now** |
| `lib/profile-helpers.ts:323-483,695-738` and `lib/narrative/profile.ts:32-194`, especially `:45-52,62-67` | Converts the synthetic movement into profile states, integrated headlines, “stable/shifted/tension” copy, and next-probe narrative. | **remove now** from active Profile synthesis |
| `lib/profile-share.ts:167-243,330-460` | V1/V2 share construction can embed overlay-derived profile state `ps`; V3 resolution rebuilds a Profile containing `od` and derives assessment at render time. | Overlay-derived new share meaning is **remove now**; old shapes and resolution are **freeze for legacy rendering** |
| `app/modules/page.tsx:171`, `app/modules/[slug]/page.tsx:27-34`, `components/modules/module-app.tsx:88-180`, and `app/modules/[slug]/results/[payload]/page.tsx:33-36,60-68` | Propagates the optional Foundation token into the module questionnaire/result route, resolves it, and supplies Foundation scores to the result runtime. | Supplying it to active comparison logic is **remove now**; the query codec and old linked URLs are **freeze for legacy rendering** |
| A future, explicitly reviewed relationship vocabulary such as `reinforces`, `qualifies`, `pulls-against`, or `not-comparable` | No reviewed replacement contract is present on this commit. | **migrate later** |

Both registered version tuples are compatibility boundaries. V21 uses
`runtime-v1`; V22 uses `runtime-v2`, and the checked-in V22 golden replay
includes `overlayDeltas` (`tests/instrument-version-compatibility.test.mts:76-129`).
Do not mutate either registered result in place. The V22.5 removal boundary is
active rendering, persistence into new Profiles, and interpretive consumption.
A later current contract can leave the old bridge output unused or introduce a
new version, but it cannot silently change V21/V22 replay.

The optional `foundation` query may remain available as provenance, navigation,
or old-link context. It must no longer cause a Security or Technology result to
claim that it moved Foundation dimensions.

### 2.2 Visible UI and public-copy uses

| UI surface | Visible use | Treatment |
|---|---|---|
| `components/modules/module-result.tsx:147-151` | Lane-level “Relative to Foundation” copy. | **remove now** |
| `components/modules/module-result.tsx:182-222,475-513` | “Against your Foundation baseline,” Reinforces/Complicates/Pulls away cards, and fallback relation text generated from comparison and lane deltas. | **remove now** |
| `components/profile/profile-report.tsx:147-165,571-716` | “Biggest shift” plus the “Relative pull from the Foundation anchor” chart, directional bars, thresholds, and labels. | **remove now** |
| `components/profile/profile-report.tsx:168-184` | “What stayed steady, what shifted” and “Open tension” copy derived through the overlay-based triad. | **remove now** |
| `components/profile/profile-report.tsx:335-341` | Stored module comparison shown as “Directional read.” | **remove now** |
| `components/profile/profile-report.tsx:81-97,199-230` | Overlay-derived Profile state feeds the old Atlas hero and pattern detail. | **remove now** |
| `components/profile/profile-compare.tsx:19-34,61-95,161-206` | Overlay-derived integrated summaries and Atlas assignments for both profiles. The copy at `:94` says overlays are “added back in.” | **remove now** |
| `app/profile/share/[payload]/page.tsx:22-25,89-96` and `components/profile/profile-dashboard.tsx:95-115` | Overlay-derived integrated headline used in shared-profile metadata and sharing. | **remove now** |
| `components/profile/profile-report.tsx:234-289` with `lib/ai-governance-cross-module-synthesis.ts:12-260` | Categorical Foundation-plus-AI “alignment,” “tension,” and “the AI result adds a pull” synthesis. It does not consume `overlayDeltas`, but it is still an unreviewed module-to-Foundation bridge rather than side-by-side reporting. | **remove now** from the active Profile; a reviewed non-metric relation is **migrate later** |
| `app/modules/page.tsx:65,84-87,108-117` | Promises a “focused overlay,” says the Foundation “holds, hardens, or starts to split,” and promises a Foundation comparison. | **remove now** |
| `components/modules/module-app.tsx:196-217,470-472` | “Foundation linkage,” compare-to-baseline, confirm/qualify/complicate, and “shows what changes” copy. | **remove now** |
| `app/method/page.tsx:419-420` | Describes module overlays as editorial transforms that shift emphasis inside Foundation space. | **remove now** when synthesis stops |
| `app/results/[payload]/page.tsx:349-350` | “Add a focus-area overlay” and pressure-test-the-baseline framing. | **remove now**; a neutral link to a separate Focus Area result can remain |
| `lib/narrative/foundation.ts:261` | Dormant module-push/divergence language. It is not rendered by the current Foundation page. | **migrate later** before any reuse |

The standalone Security and Technology headline, axis scores on their attainable
scales, lane scores, lane summaries that do not compare with Foundation,
selected-answer evidence, challenge, and back-to-Foundation navigation can be
**preserved as static editorial content** on separate module results.

The following adjacent comparisons do **not** consume `overlayDeltas` and should
not be removed as collateral:

- `lib/profile-compare.ts` directly compares two Foundation results and, where
  present, the same module's own lanes. That comparison is **preserve as static
  editorial content** after its Atlas cards and overlay promise are removed.
- Perspective Runs have their own authored scenario-set payload and explicitly
  leave the Foundation unchanged. Their route/payload compatibility is
  **freeze for legacy rendering**. They are not evidence that Security or
  Technology axes numerically move Foundation dimensions.

### 2.3 Legacy delta and comparison records

| Compatibility dependency | Required boundary | Treatment |
|---|---|---|
| `lib/modules/runtime-v1.ts:167-193`, `lib/modules/runtime-v2.ts:170-199`, all four registered Security/Technology definitions, and tuples in `lib/modules/versions.ts:35-99` | Module V1/V2 tokens must replay through V21; existing V3 tokens dispatch by their explicit V21/V22 tuple. Both checked-in tuples have golden outputs, including deltas. | **freeze for legacy rendering** |
| Local ProfileStore V1–V5 at `lib/profile-store.ts:180-280,495-590,835-854` | Continue accepting `overlayDeltas`, `comparison`, linked Foundation payload, lane `delta`, and non-regenerable legacy English copy. | **freeze for legacy rendering** |
| Profile Share V1/V2 at `lib/profile-share.ts:39-100,236-267,577-635` | Continue accepting `ms[].od`, optional `cp`, `ls[].d`, and stored profile state `ps`. | **freeze for legacy rendering** |
| Profile Share V3 at `lib/profile-share.ts:102-148,167-202,270-292,421-460` | Continue accepting canonical module payloads, `ms[].od`, optional linked Foundation `fp`, and provenance. | **freeze for legacy rendering** |
| Current Profile Share encoders | New profiles without AI/Perspective data emit V1; profiles with that data emit V3. Both still carry required `od`. | Stop putting newly interpreted movement into active Profiles **remove now**; keep the required old field shape and decoders **freeze for legacy rendering** |
| Old `od`, `cp`, `d`, and `ps` values after decode | Accept and preserve them so old data opens; do not use them to assign a live type, draw new Foundation arrows, or claim metric movement. | **freeze for legacy rendering** |

---

## 3. Active hardcoded distributional claims

### 3.1 Current scoring and result claims

| Location | Claim or implied benchmark | Evidence/status | Treatment |
|---|---|---|---|
| `lib/modules/security.ts:223` | “On the current question set most answer patterns land here.” | The named 500-seed V22 diagnostic reports the fallback at 17.2% Standard and 22.6% Advanced. | **remove now** |
| `lib/modules/technology.ts:223` | Same “most answer patterns” claim. | The named diagnostic reports 31.2% Standard and 32.2% Advanced. | **remove now** |
| `lib/modules/security-v21.ts:188` and `lib/modules/technology-v21.ts:188` | The same sentence in frozen definitions. | Reachable only when resolving old module versions. Do not copy forward. | **freeze for legacy rendering** |
| `lib/modules/security.ts:81` and `lib/modules/technology.ts:81` | “Most cases start from … A smaller set …” | Public description at `app/modules/page.tsx:168`, `components/modules/module-app.tsx:192`, and route metadata. The bank composition is not calculated into this string, so it can drift. | **remove now** or generate mechanically from the current bank |
| `lib/modules/security-v21.ts:82` and `lib/modules/technology-v21.ts:82` | Frozen versions of the same module-composition claim. | Old payload display dependency. Do not copy forward. | **freeze for legacy rendering** |
| `app/method/page.tsx:125` | “Mixed outputs are normal and can be meaningful.” | “Normal” implies an observed result distribution; none is named. | **remove now** |
| `content/locales/zh-Hans/editorial-pages.ts:63` | “混合结果很常见，也可能最有解释价值。” (“Mixed results are common and may be the most interpretively valuable.”) | Active Chinese Methods copy; missed by the current scanner. | **remove now** |
| `app/explore/page.tsx:58-60` | “The runner-up family often remains nearly as important as the primary one.” | No named answer-space calibration or live cohort supports “often.” | **remove now** |
| `lib/result-content.ts:331` | “Most analysts believe” great-power competition is primarily about technology supply chains. | Live pressure-test premise through `getPressureTestQuestions` and `app/results/[payload]/page.tsx:235,703-709`; it manufactures an unsourced consensus. | **remove now** or replace with an explicitly sourced proposition |
| `lib/ai-governance-results-v2.ts:353` | Mixed scores “usually” mean the respondent is “less ideological than threshold-driven.” | Unsupported personality inference from a fallback score pattern; rendered through `components/results/ai-governance-profile-sections.tsx:69-80`. | **remove now** |

The module diagnostic is declared at `lib/modules/calibration.ts:10-26`.
`tests/module-calibration.test.mts:63-80` requires each default-headline share
to remain below 40%. The diagnostic is synthetic calibration, not a user
population; it can disprove “most” within the modeled answer space but cannot
support a real-world prevalence claim.

### 3.2 Active authored reference-group comparators

These strings are generated from fixed score thresholds and authored family
profiles, not an observed distribution.

`getIssueAreaTilts` is called at
`app/results/[payload]/page.tsx:195,586-590`:

- `lib/result-helpers.ts:754`: “Realists who also score high … often hold …”;
- `lib/result-helpers.ts:772`: may diverge from “mainstream liberal
  institutionalism”;
- `lib/result-helpers.ts:799`: “relatively high … unusual in this tradition”;
- `lib/result-helpers.ts:808`: “Critical PE adherents … tend to …”.

`getRunnerUpSeparation` is called at
`app/results/[payload]/page.tsx:196,661-663`. All empirical-sounding comparators
in `lib/result-helpers.ts:845-899` are active:

- `:847` “relatively high for a realist” and “typical realist profile”;
- `:851` “moderate-to-high for a realist”;
- `:855` “relatively high for a realist”;
- `:861` “notable for an institutionalist”;
- `:869` “high for an institutionalist”;
- `:875` “notable for a constructivist”;
- `:879` “relatively high for a constructivist”;
- `:880` “the standard constructivist position”;
- `:883` “notable in a constructivist profile”;
- `:889` “higher than typical for a critical PE primary”;
- `:893` “high for a critical PE primary”;
- `:897` “notable in a critical PE profile”.

The direct score and authored-reference comparison can remain, but the
empirical-sounding population/tradition benchmark is **remove now**. A later
version may say explicitly “relative to this tool's authored reference profile”
without implying observed prevalence.

Four AI strings compare authored taxonomy records rather than people, explicitly
or by an unstated comparison group:

- `lib/ai-governance-profile-copy.ts:75`: “More likely than most profiles …”;
- `:100`: “More likely to worry …”;
- `:124`: “Often more attentive than other profiles …”;
- `:149`: “More likely to emphasize …”.

They render through
`components/results/ai-governance-profile-sections.tsx:47-56`. The unsupported
current comparator wording is **remove now**. An explicit replacement such as
“among the six authored profiles” is **migrate later**; it must not be read as a
cohort claim.

### 3.3 Static editorial prevalence and rank language

These claims do not describe the distribution of product results and must not
be used in scoring or user assignment. The surrounding material is static
editorial content; the frequency or rank wording still needs an attributable
source or a softer formulation.

| Location | Claim type | Treatment |
|---|---|---|
| `app/method/page.tsx:76` and `app/explore/page.tsx:53-54` | “Most serious readers/analysts … draw on more than one tradition.” | **remove now** unless a source is attached; preserve the non-essentialist point |
| `app/explore/page.tsx:213-215` | Scholars from non-Western contexts “often” read situations through different priors. | **preserve as static editorial content**, with source review |
| The ten authored records in `lib/atlas-lite.ts:110-652` | Static pattern descriptions, case tendencies, cautions, and objections remain useful once they no longer assign a user identity. | **preserve as static editorial content** |
| `lib/atlas-lite.ts:129,188,246,304,364,423,480,537,594,652`, plus `:293` (“A realist runner-up often remains close”), `:583` (“closest neighbor is often …”), and localized pattern prose such as `content/locales/zh-Hans/worldview-profiles.ts:39` | “Often/usually” and runner-up/neighbor frequency describe an authored pattern as though it were observed. Current matcher removal makes some of this copy non-personal, but does not substantiate the qualifiers. | The current assignment is **remove now**; source or soften these qualifiers **migrate later** while preserving the surrounding static record |
| `lib/futures/trajectories.ts:125,203,255,279,305,329`, rendered by `components/futures/trajectory-card.tsx:49` | “A minority,” “a significant fraction,” “Nobody,” “a growing part,” “Almost no one,” and “often ranked above” make advocate/prevalence claims. | **preserve as static editorial content** only with source support; otherwise soften or remove the rank/frequency wording |
| `app/explore/[slug]/page.tsx:220` | “Real thinkers frequently draw on multiple frameworks.” | **preserve as static editorial content**, with source review or softer non-frequency wording |
| `app/references/page.tsx:27,34,56,95,151,176,204,235` | “Original,” “clearest,” “best,” “most cited,” “sharpest,” “most sophisticated,” and “strongest” rank the bibliography. | **preserve as static editorial content**, with bibliographic support or softened rank wording |
| `lib/explore-content.ts:151,180,343,430,449,485,490,630,647,782` | “Clearest,” “strongest,” “most direct,” “best explains,” “definitive,” “most cited,” “sharpest,” and “most rigorous” rank readings or traditions. | **preserve as static editorial content**, with bibliographic support or softened rank wording |
| `lib/ai-governance-reading-lists-v2.ts:28,131,200,284` | “One of the clearest,” “best single,” “clearest,” and “one of the strongest” rank reading-list entries. | **preserve as static editorial content**, with bibliographic support or softened rank wording |
| `app/method/page.tsx:464,468,472` and `content/locales/zh-Hans/editorial-pages.ts:270-273` | Frequency/performance summaries directly attributed to Converse, Zaller, Tetlock, and Sil/Katzenstein. | **preserve as static editorial content** |
| `content/current-cases/us-brazil-section-301-tariffs.json:53` | “Around 18% of Brazil's exports,” tied to a Reuters source record and claim ledger. | **preserve as static editorial content** |

`lib/result-helpers.ts:639-718` also contains “mainstream,” “notably high,” and
“higher than most critical PE adherents,” but its only entry point is
`getFoundationSurprisingFinding`, which has no production import on this
commit. It is dormant rather than active. Its treatment is **migrate later**
before reuse.

### 3.4 Scored-item and hypothetical propositions

These are active public propositions containing words such as “often,”
“usually,” “rarely,” “many,” or “most.” They are not evidence about the
distribution of respondents or results: the instrument asks the respondent to
judge them. They nevertheless need copy-scan coverage and construct/source
review, because frequency wording can turn an intended value or causal item
into an unbounded empirical assertion.

| Active source | Frequency/generalization locations | Treatment |
|---|---|---|
| Current Foundation bank, `content/instrument/foundation.v2.json` | `:110,172-174,202-204,219,349,434,464,500-502,879,894,924,939,999,1014,1029-1031,1044-1050,1065,1321` | **preserve as static editorial content** as scored propositions, subject to construct and source review; never use them as respondent-prevalence evidence |
| Current Security bank, `content/instrument/security.v3.json` | `:407,1141,1152,1186,1196,1244` | **preserve as static editorial content** as scored or scenario propositions, subject to construct and source review |
| Current Technology bank, `content/instrument/technology.v3.json` | `:380,1190` | **preserve as static editorial content** as scored or scenario propositions, subject to construct and source review |
| Current AI Governance bank, `content/instrument/ai-governance.v3.json` | `:52,70,106,142,160,178,250,371` | **preserve as static editorial content** as scored propositions, subject to construct and source review |
| `lib/result-content.ts:316` | Hypothetical stipulation: “A war begins that most international lawyers consider unjustified.” Unlike the unsourced real-world consensus asserted at `:331`, this explicitly defines a scenario the respondent is asked to reason through. | **preserve as static editorial content**, subject to scenario and source-language review |
| Frozen Security, Technology, and AI Governance V21/V2 banks | Old scored propositions are part of issued payload replay. | **freeze for legacy rendering**; do not silently rewrite old banks |

A prevalence rule should scan these sources, report the exact matched phrase,
and classify the context. It should not automatically rewrite or fail a scored
item merely because the proposition contains a frequency term.

### 3.5 Data-derived distributional UI that is not hardcoded

The following templates are acceptable in kind because they use the exact
aggregate cohort and are suppressed below `n = 100`:

- English results at `app/results/[payload]/page.tsx:405-415,480,805-830`;
- Push Chart at `components/results/push-chart.tsx:41-54`;
- posture strip at `components/results/posture-strip.tsx:47-49,97-101`;
- share-card rarity at `lib/share-card.ts:43-44` and
  `app/api/card/route.tsx:326-329`;
- Chinese results at
  `app/[locale]/results/[payload]/page.tsx:169-178,253-267,343-346`.

They are gated by the exact current payload/form/version/locale/copy-version
contract in `lib/research/aggregate-stats.ts:167-215`, the Tier 1 feature flag,
and `n >= 100` in `lib/percentiles.ts:84-165`. Making the cohort definition more
visible is **migrate later**; these are not unsupported hardcoded claims.

---

## 4. Public-copy scan coverage gaps

The current scanner is an advisory English string scan, not yet the required
public-copy gate.

| Gap | Current evidence | Required treatment |
|---|---|---|
| Missing roots | `scripts/audit-public-copy.mjs:7` scans only `app`, `components`, `lib`, and `content/current-cases`. Of 57 files under `content`, it reaches only the three Current Case JSON records. It misses all 9 `content/instrument/*` files, all 42 `content/locales/*` files, `content/archetypes.json`, and `content/archetype-evidence.json`. It also misses top-level `messages/en.json` and `messages/zh-Hans.json`, which are loaded by `i18n/request.ts:5-14`, and public status/metadata copy in `i18n`, including `i18n/metadata.ts:33-36`. | **migrate later** |
| Locale blindness | `looksLikePublicCopy` at `scripts/audit-public-copy.mjs:290-297` requires at least one ASCII letter, and every rule is English. Chinese-only strings are skipped even if their roots are added; mixed strings containing Latin text such as “AI” enter the scanner but are still evaluated only by English regexes. The active claim at `content/locales/zh-Hans/editorial-pages.ts:63` demonstrates the miss. | **migrate later** |
| Blanket file exclusions | `collectFiles` at `scripts/audit-public-copy.mjs:190-198` skips every filename ending in `validation.ts` and supports only `.ts`, `.tsx`, `.js`, `.jsx`, and `.json`. That can omit public validation/status copy without an audience-aware reason. | **migrate later**; document exclusions by audience and cover every shipped copy source |
| Missing required prevalence rules | No rule detects “most answer patterns,” “normal,” “often remains,” “typical profile,” unsupported percentages, or other cohort/rank language. | **migrate later** |
| Missing repeated-structure rules | No rule covers “sits between,” “keeps X in play,” “pulls clear,” “what matters most,” “you generally believe,” “the deeper danger,” “the stronger path,” or repeated adjacent three-part lists. | **migrate later** |
| Partial metaphor coverage | `layer`, `lens`, and `map` have narrow regexes, but required abstract uses outside the enumerated phrases can pass. | **migrate later** |
| Lexical extraction | `sourceCandidates` at `scripts/audit-public-copy.mjs:202-237` uses quote regexes and stripped JSX lines rather than a syntax tree. Apostrophes/comments can desynchronize candidates, multi-line JSX is fragmented, and dynamically assembled copy is not evaluated as one sentence. | **migrate later** |
| No structural adjacency | The scanner cannot determine that neighboring cards repeat the same three-part list or template. | **migrate later** |
| No production/legacy/internal classification | It scans all of `lib` without reachability context. Strict findings currently include dormant Tier 2 replay strings and API errors, while a future prevalence rule would also hit frozen V21 copy. | **migrate later** |
| Incomplete finding schema | Findings at `scripts/audit-public-copy.mjs:158-168` report the whole source candidate and one generic `note`. They do not provide the exact matched substring, a separate reason and suggested action, or a TS/TSX copy key; non-JSON `path` is always `null`. | **migrate later** |
| Missing project commands | `package.json:5-18` has neither `copy:audit` nor `copy:audit:strict`. | **migrate later** |
| Missing CI gate | `.github/workflows/ci.yml` does not run the copy audit. | **migrate later** |
| Duplicated weak tests | `tests/atlas-copy-guardrails.test.mts:35-87,241-299,436-470` maintains separate patterns and a similarly fragile extractor. It exercises module fallback summaries but has no prevalence rule, so the false “most answer patterns” sentence passes. Active issue-tilt and runner-separation output is not exercised. | **migrate later** |

Direct execution on this commit:

```text
node scripts/audit-public-copy.mjs --format=json
72 findings: P0 5, P1 0, P2 67; strict findings 5
```

The five current strict findings are two public API strings and three dormant
`lib/research/scoring-replay.ts` strings. Wiring the existing script directly
to CI would therefore fail for the wrong mixture of audiences. The gate first
needs complete roots, stable finding fields, required rules, and explicit
production/frozen/internal classification. It must remain non-mutating.

---

## 5. Current Case launch record and review age

### 5.1 Current launch

| Field | Recorded value |
|---|---|
| ID | `security-europe-anti-ballistic-coalition-ukraine-2026-07` |
| Slug | `europe-missile-defence-coalition-ukraine` |
| Version / state | `1`, `published`, `launch` |
| Title | “Europe’s integrated anti-ballistic-missile coalition for Ukraine” |
| Published / updated | `2026-07-17` / `2026-07-17` |
| Evidence window | `2026-06-26` through `2026-07-17` |
| Research review | `2026-07-17` |
| Source check | `2026-07-17` |
| Copy review | `2026-07-17` |
| Approval | `2026-07-17` |
| Reviewers | `research-editor`, `approving-editor` |
| Revisit | none |
| Age on 2026-08-06 | **20 calendar days** since evidence-window end, update, all reviews, and approval |

Source: `content/current-cases/europe-missile-defence-coalition-ukraine.json:2-16,267-273`.
The two archive cases also end their evidence windows and record all reviews on
2026-07-17.

### 5.2 Freshness gap

- `lib/current-cases/types.ts:135-185` has publication/update dates, an evidence
  window, and review dates, but no review deadline, expiry, or active-through
  field.
- `lib/current-cases/validation.ts:156-216,626-646` validates dates, evidence,
  completed review, and reviewer count, but never compares a deadline with the
  current date.
- `lib/current-cases/catalog.ts:41-50,83-90` requires exactly one `launch`
  whenever any published cases exist.
- `getLatestPublishedCurrentCase` at
  `lib/current-cases/catalog.ts:124-129` selects the launch and otherwise falls
  back to the first published record. That makes “archives exist but no active
  case” unrepresentable.
- `/current` and `/zh/current` always redirect to that helper's case or to the
  archive (`app/current/route.ts:1-7` and the locale counterpart).
- `content/current-cases/README.md:1-44` specifies approval, source coverage,
  and versioning but no post-publication deadline.
- `research/current-cases/README.md:3-17` selects candidates from the preceding
  21 days for a research pack, but that is not an ongoing launch expiry rule.

The repository and Rev3 plan do not provide a numeric owner-approved deadline.
The 20-day age therefore cannot be compared with a typed limit. Rev3 does make
the product decision explicit: the July 17 evidence window must not be
presented as current on August 6.

| Current Case dependency | Treatment |
|---|---|
| Public “current” presentation for the July 17 record | **remove now** |
| The three reviewed records, article pages, source ledgers, corrections pages, and Chinese translations | **preserve as static editorial content** in the archive |
| Static rival Worldview/Decision Pattern readings | **preserve as static editorial content** |
| Personalized matcher-based Foundation connection | **remove now** |
| `launchRole` data marker, deadline field, validation, explicit inactive state, catalog selection, and `/current` fail-closed behavior | **migrate later** as one atomic change after the owner supplies the deadline policy |
| Stable record IDs, slugs, versions, and old saved responses | **freeze for legacy rendering** |

Do not remove or flip the JSON `launchRole` marker by itself:
`validateCurrentCaseCatalogForPublication` rejects every non-empty published
catalog without exactly one launch. The marker must remain unchanged until the
deadline/no-active/catalog migration lands atomically. The current public
presentation can stop calling the case current without first invalidating the
catalog.

---

## 6. Tier 1 production prerequisites

### 6.1 Current production code boundary

| Dependency | Current state | Treatment |
|---|---|---|
| `POST /api/aggregate/result` at `app/api/aggregate/result/route.ts:158-295` | Validates bounded completion/result events, no-ops unless the flag and database are present, rate-limits, writes only the four `agg_*` tables, and returns silent `202` on storage failure. | **migrate later** through owner-operated activation; preserve the aggregate-only contract |
| `GET /api/aggregate/stats` at `app/api/aggregate/stats/route.ts:10-49` and `lib/research/aggregate-stats.ts:167-267` | Accepts only an exact current Foundation V5 cohort tuple and suppresses small cells server-side. Legacy results still render but receive no cohort comparison. | **migrate later** through production activation; preserve legacy exclusion |
| `lib/research/feature-flags.ts:1-8` | Only exact server-side `TIER1_AGGREGATES_ENABLED=true` enables Tier 1. `DATABASE_URL` alone cannot activate it. | **freeze for legacy rendering** as the safety default |
| `app/privacy/page.tsx:13-18,25-32,45-99` and Chinese privacy copy at `content/locales/zh-Hans/editorial-pages.ts:280-338` | Separate browser-local raw answers/history from bounded aggregate counters and exclude identifiers, answers, and full result URLs. | **preserve as static editorial content**, kept synchronized with behavior |
| Browser opt-out in `lib/research/tier1-aggregate.ts:369-448` | Suppresses both Tier 1 write types. | **freeze for legacy rendering** |
| Dormant replay tables from migration `002` | Their existence is not Tier 2 activation; Tier 1 writes only `agg_*`. | **migrate later**; keep dormant |
| `/api/research/{submit,event,delete}` | Body-blind `410` tombstones; environment flags cannot revive the old Tier 2 surface. | **freeze for legacy rendering** as tombstone behavior |

### 6.2 Evidence already recorded

`docs/decisions/v22-tier1-activation.md`, dated 2026-08-05, records:

- migrations `001`–`003` passing on fresh and upgrade staging databases;
- exact eight-table inspection and exact aggregate-write columns;
- live/local silent-failure and `n < 100` suppression checks;
- a Preview-only deployment with the flag and database enabled;
- one real Preview Foundation run producing 7 dimension buckets, 1 label,
  14 completion counters, and 14 latency counters while all replay tables
  remained empty;
- a live process-local rate-limit exercise;
- no Production configuration or Production deployment change.

That record is staging/Preview evidence, not a live Production inspection.

### 6.3 Owner-operated production checklist and repository evidence

| # | Production prerequisite | Repository evidence as of 2026-08-05 |
|---:|---|---|
| 1 | Create a Production Neon database or branch separate from staging. | **Not evidenced** in the repository record. |
| 2 | Run migrations `001`–`003` in Production. | **Not evidenced in Production**; staging evidence exists. |
| 3 | Verify the exact eight-table Production schema and confirm all four replay tables are empty. | **Not evidenced in Production**; staging evidence exists. |
| 4 | Add `DATABASE_URL` and `TIER1_AGGREGATES_ENABLED=true` to Production only. | **Recorded not done**; the activation record says Production configuration was unchanged. |
| 5 | Deploy the intended `main` SHA. | **Recorded not done for Tier 1**; Production deployments were unchanged. |
| 6 | Complete one controlled Foundation run in Production. | **Not evidenced in Production**; a Preview run exists. |
| 7 | Verify expected Production aggregate increments and zero replay rows. | **Not evidenced in Production**; Preview evidence exists. |
| 8 | Verify Production percentile and rarity suppression below exact-cohort `n = 100`. | **Not evidenced in Production**; code, tests, and Preview evidence pass. |
| 9 | Clear smoke-test counters before beta recruitment. | **Not evidenced** and not applicable until the Production smoke run occurs. |
| 10 | Document rollback: set `TIER1_AGGREGATES_ENABLED=false` and redeploy. | The procedure is specified in Rev3 and repeated here; an owner runbook entry and rehearsal are **not evidenced**. |
| 11 | Check server logs after the first five real completions. | **Not yet evidenced**; requires Production activation and five completions. |

There is no migration, smoke-counter-clear, or rollback npm script in
`package.json`; these are manual owner operations. No coding agent should
change production credentials.

Overall Tier 1 production activation is **migrate later**. The privacy copy is
**preserve as static editorial content**; current-payload cohort gates,
default-off behavior, legacy-result exclusion, opt-out, and Tier 2 tombstones
are **freeze for legacy rendering** safety/compatibility invariants.

---

## 7. Legacy routes, payloads, and local records that must survive

There is no single legacy-route registry. This inventory is derived from the
route tree, decoder registries, stable storage keys, and literal compatibility
tests.

| Route or record | Compatibility contract | Treatment |
|---|---|---|
| `/results/[payload]` and `/zh/results/[payload]` | Foundation Share V2, V3, V4, and V5 decode through `lib/types.ts:141-204` and `lib/share.ts:136-177,213-336`. V2–V4 reconstruct with the correct legacy scorer and preserve encoded family/modifier identity. Do not recompute identity under current rules. | V2–V4 **freeze for legacy rendering**; V5 remains current |
| `/api/card?payload=<foundation>` | Uses `resolveFoundationPayload` at `app/api/card/route.tsx:26-42`; old Foundation result pages generate this metadata image URL with their original payload. | **freeze for legacy rendering** for Foundation Share V2–V5 |
| `/modules/[slug]/results/[payload]?foundation=...` decoder and route identity | Module source payload V1 and V2 dispatch to the frozen V21 tuple (bank 2, scorer 1, runtime 1); V3 dispatches by its explicit supported V21/V22 tuple through `lib/modules/framework.ts:126-238` and `lib/modules/versions.ts:35-99`. | All issued V1–V3 tokens and tuple replay are **freeze for legacy rendering**; the current V3 renderer's comparison UI is separately **remove now** under Section 2 |
| `/ai/results/[payload]` decoder and route identity | AI Payload V1 resolves to V21 bank 2/scorer 1; V2 resolves through the supported tuple in `lib/ai-governance-share.ts:25-122` and `lib/ai-governance-versions.ts:16-39`. | V1 and issued V2 decoder/schema compatibility are **freeze for legacy rendering**; current V2 public copy can **migrate later** without breaking payload resolution |
| `/perspectives/[perspectiveId]/result/[payload]` | Perspective Payload V1 is tied to an exact perspective/scenario-set contract; route verifies matching ID. | **freeze for legacy rendering** |
| `/profile/share/[payload]` and `/zh/profile/share/[payload]` decoders and route identities | Profile Share V1, V2, and V3 decode through `lib/profile-share.ts:65-153,330-460,733-950`. Old `od`, `cp`, `d`, and `ps` fields remain accepted. | V1/V2 and issued V3 schema/decoder compatibility are **freeze for legacy rendering**; the current V3 renderer's Atlas/overlay synthesis is separately **remove now** |
| `/compare?left=<profile>&right=<profile>` | `app/compare/page.tsx:15-90` accepts tokens or full Profile Share links and resolves both through the V1–V3 decoder. Remove the live Atlas assignments without breaking these inputs. | **freeze for legacy rendering** |
| Local ProfileStore | Stable `ir-worldview-profile-v1` storage plus ProfileStore V1–V5 migration to canonical V5; non-regenerable legacy English display copy is intentionally retained. | V1–V4 migration and V5 schema readability are **freeze for legacy rendering**; the current V5 Profile renderer's Atlas/overlay interpretation is separately **remove now** |
| Local Foundation drafts | Stable `ir-worldview-session-v3` slot; Session V3–V7 parse into V7 through `lib/quiz-session.ts:17-84`. | **freeze for legacy rendering** |
| Local AI and Perspective drafts | Stable `ai-governance-answers-v1` and `ir-perspective-drafts-v1` slots remain registered in `lib/storage-keys.ts:4,6`. | **freeze for legacy rendering** |
| Local Foundation result history | Stable `ir-worldview-history` slot; unversioned snapshots receive frozen legacy-English provenance through `lib/result-history.ts:37-68`. | **freeze for legacy rendering** |
| Current Case response store | Stable slot; Store V1/V2 accepted, old reasoning labels migrate through frozen aliases, and versioned responses remain readable through `lib/current-cases/response-store.ts:30-75,221-360`. | **freeze for legacy rendering** |
| Content rendered at `/explore/atlas/[id]` and `/zh/explore/atlas/[id]` | The ten old patterns remain useful when presented as a non-personal editorial taxonomy. | **preserve as static editorial content** |
| `/explore/atlas/[id]` and `/zh/explore/atlas/[id]` route identities | Ten stable IDs and URLs are identity/order locked by `tests/atlas-lite.test.mts:13-50`. | **freeze for legacy rendering** |
| `/explore/atlas` and `/zh/explore/atlas` query/deep-link contract | `layers`, `sel`, and the legacy `atlas-patterns` layer/selection IDs are encoded and parsed by `lib/field/map-state.ts:43-83` and locked by `tests/field.test.mts:44-71,140-172`. | **freeze for legacy rendering**; the collection label can **migrate later** |
| `/archetypes/[slug]` | The eight `{p|r|m|s}-{plus|minus}` evidence routes are linked from old and current Foundation results through `archetypeEvidencePath`; slugs are locked by `tests/archetype-evidence.test.mts:29-52`. | Route/slug identity **freeze for legacy rendering**; evidence pages **preserve as static editorial content** |
| `/ai/atlas/[id]` and `/ai/atlas` | Persisted AI archetype IDs resolve to established editorial detail and collection routes. | Route/ID identity **freeze for legacy rendering**; page content **preserve as static editorial content** |
| `/explore/[familySlug]` | The four modeled-family slugs resolve the established theory-library detail pages. | Route/slug identity **freeze for legacy rendering**; theory pages **preserve as static editorial content** |
| `/explore/reference`, `/explore/reference/[id]`, and localized equivalents | Stable reference-profile IDs are linked from the Worldview Map and public-position cards. | Route/ID identity **freeze for legacy rendering**; evidence-coded profiles **preserve as static editorial content** |
| `/cases`, `/zh/cases`, `/cases/[slug]`, `/zh/cases/[slug]`, and each slug's `/sources` and `/corrections` routes | Stable reviewed case IDs/slugs/versions, archive indexes, source ledgers, and correction records. | **preserve as static editorial content** |
| `/cases/[slug]/challenge` | Compatibility/recovery page for the retired challenge flow. | **freeze for legacy rendering** |
| `/api/current-cases/challenge`, `/reveal`, and `/validate` | Body-blind `410` responses through `lib/current-cases/retired-challenge.ts`; do not revive or repurpose. | **freeze for legacy rendering** |
| `/api/research/submit`, `/event`, and `/delete` | Body-blind `410` responses through `lib/research/unavailable.ts`; do not revive with environment flags. | **freeze for legacy rendering** |
| `/current` and `/zh/current` | Stable public entry routes. Their identity should survive, but selection must gain expiry/no-active behavior. | **migrate later** |
| English unprefixed routes and `/zh` routes | `proxy.ts:11-25` retains English on the unprefixed route tree; payload segments stay opaque through `i18n/paths.ts:41-67`. Sensitive result/share/challenge paths remain private/no-store through `lib/http-headers.ts:17-43`. | **freeze for legacy rendering** |

The local-data deletion registry at `lib/local-data.ts:13-55` must continue to
cover Profile data, Foundation/AI/Perspective drafts, Current Case responses,
result history, first-seen date, and Tier 1 dedupe while preserving the user's
analytics opt-out.

The aggregate-stats endpoint does not need to serve legacy Foundation cohorts.
Old results must open; they may correctly show no percentile or rarity.

---

## 8. Consolidated dependency disposition

### Remove now

- all four production Atlas matcher imports and the matcher implementation after
  its last caller is removed;
- all active Security/Technology overlay comparison rendering, persistence into
  new Profiles, sharing as interpreted movement, and downstream consumption;
  registered V21/V22 replay generation remains frozen;
- current Profile delta arithmetic, directional chart, shift/tension synthesis,
  integrated share headline, old Atlas assignment, and unreviewed cross-module
  synthesis;
- module and marketing copy that promises Foundation movement or comparison;
- current unsupported respondent, answer-pattern, normality, consensus, and
  uncalibrated tradition-relative claims;
- the July 17 record's active/current presentation and personalized case
  comparison.

### Preserve as static editorial content

- the ten old Atlas/Decision Pattern pages, their authored case notes,
  objections, neighbors, and static Current Case reading accordions;
- separate Security, Technology, and AI results on their own constructs;
- the three reviewed Current Case records, their sources, corrections, and
  Chinese translations as archive content;
- privacy explanations, theory/reference libraries, and sourced editorial
  claims;
- direct Foundation-to-Foundation and same-module lane comparisons that do not
  use `overlayDeltas`.

### Freeze for legacy rendering

- all Foundation, Module, AI, Perspective, and Profile Share decoder versions
  listed above;
- old module banks/scorers/runtimes and deterministic legacy display copy;
- ProfileStore generations, old overlay/comparison fields, result history,
  drafts, Current Case response migrations, and stable storage keys;
- stable Atlas/case URLs and IDs, locale routing, opaque payload segments, and
  private/no-store headers;
- retired Current Case challenge and Tier 2 research API tombstones;
- Tier 1 default-off, exact-current-cohort, opt-out, and small-cell gates.

### Migrate later

- split and rename the static Atlas collection;
- implement the copy-audit roots, extraction, rule set, finding schema, npm
  commands, legacy/internal classification, tests, and CI gate;
- add the Current Case deadline, validation, inactive state, and fail-closed
  `/current` behavior after an owner supplies the deadline policy;
- activate Tier 1 through the eleven owner-operated Production steps;
- introduce any future cross-domain relationship vocabulary only after explicit
  editorial and measurement review.

## Stop boundary

No production code, content, payload, scoring, route, feature flag, database,
credential, or test was changed for this reconciliation.
