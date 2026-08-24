# V23.5 Release Test Matrix

Status: binding acceptance matrix
Baseline SHA: `a80fe4d02d818ae546672d15f64aa596a25b1ceb`
Production baseline: `dpl_GQDHf5DJKEgcXWwfHsyovHnZKvBa`

## 1. Evidence rule

Each result records:

- exact code SHA and preview URL;
- date, operator, browser, operating system, viewport, locale, and motion setting;
- fixture ID and frozen date where applicable;
- pass, fail, excluded, or blocked;
- screenshot, trace, command output, or issue ID;
- reviewer and disposition.

A manual screenshot proves only the observed build and state. It is regression coverage only when a deterministic CI assertion compares it.

## 2. Fixed fixture registry

The test runner must generate opaque URL segments from the checked-in objects below. Do not copy long encoded payloads into this document. Record the generated route and digest in the release evidence manifest so every screenshot in one cycle uses the same token.

| Fixture ID | Source | Required use |
| --- | --- | --- |
| `FND-CURRENT-PURE-EN` | Current Foundation payload built from a named fixed score vector in `tests/foundation-result.test.mts` | Pure result, Profile save, share, print |
| `FND-CURRENT-BLEND-EN` | Current low-differentiation fixture in Foundation result tests | Blend hierarchy and copy |
| `FND-LEGACY` | `PRE_V16_FOUNDATION_SHARE` and frozen share fixtures in `tests/share.test.mts` | Legacy replay |
| `FND-INVALID` | `%%%bad%%%payload` | Recovery route |
| `SEC-V3`, `SEC-V4`, `SEC-V5` | `tests/fixtures/instrument-version-golden.json` and `tests/fixtures/security-v5-golden.json` | Compatibility and result rendering |
| `TECH-V2`, `TECH-V3` | `tests/fixtures/instrument-version-golden.json` | Compatibility and result rendering |
| `AI-V2`, `AI-V3` | Fixed payload objects in `tests/ai-governance-share.test.mts` and current version tests | AI result and legacy replay |
| `PROFILE-EMPTY` | Clean browser storage | Empty Profile |
| `PROFILE-V1` through `PROFILE-V5` | `tests/fixtures/profile-store-v1.json` through `profile-store-v5.json` | Local migration and populated Profile |
| `PROFILE-SHARE-V1` through `V3` | `tests/fixtures/profile-share-v1.json` through `profile-share-v3.json` | Shared Profile replay |
| `CASE-ACTIVE` | Reviewed Current Case catalog with injected in-window date | Homepage, `/current`, case route |
| `CASE-INACTIVE` | Same catalog with injected date outside every review window | Homepage, `/current`, Recent Cases |
| `DRAFT-SEC-STD` | Fixed Standard answers plus position | Mode restore |
| `DRAFT-SEC-ADV` | Fixed Advanced answers plus position | Mode restore |
| `DRAFT-TECH-STD` | Fixed Standard answers plus position | Mode restore |
| `DRAFT-TECH-ADV` | Fixed Advanced answers plus position | Mode restore |
| `MAP-NO-TOKEN` | Empty `NEXT_PUBLIC_MAPBOX_TOKEN` | Fallback, bundle, accessibility |
| `MAP-WITH-TOKEN` | Approved restricted test token | Coherent JS and CSS boundary |

Before Phase 1 closes, add a deterministic evidence-manifest generator or record an explicit exclusion. The manifest stores no participant or live-user data.

## 3. Automated gate

Run task-specific inner loops while editing. Run this complete gate on every meaningful integrated PR:

```bash
npm run typecheck
npm run validate
npm run copy:audit:strict
npm run lint
npm run test
npm run build
```

Before release, also run:

```bash
npm run evidence:audit:check
CI=1 npm run test:e2e
git diff --check
```

Record command, exit status, duration, and log path. Stop integration on failure. Do not waive a failure because it passed on the baseline.

## 4. Critical route matrix

| Surface | English route | Chinese route where supported | Fixture or state | Automated | Manual |
| --- | --- | --- | --- | --- | --- |
| Homepage | `/` | `/zh` | `CASE-ACTIVE`, `CASE-INACTIVE`, map states | route, ordering, labels | hierarchy, overflow, controls, map alternative |
| Foundation quiz | `/quiz` | `/zh/quiz` | clean, partial, complete draft | persistence, reset transitions | keyboard, 44px, no auto-advance |
| Foundation result | `/results/[payload]` | `/zh/results/[payload]` | pure, blend, legacy, invalid | decode, hierarchy hooks, recovery | payoff, codes, print, share |
| Profile | `/profile` | `/zh/profile` | empty and stores v1 to v5 | migration, state separation | hierarchy, mobile, next action |
| Profile share | `/profile/share/[payload]` | `/zh/profile/share/[payload]` | share v1 to v3, invalid | decode and recovery | print and hierarchy |
| Focus Areas index | `/modules` | unsupported unless explicitly localized | empty and saved Foundation | saved-state guidance | taxonomy and next action |
| Security questionnaire | `/modules/security` | unsupported | Standard and Advanced drafts | switch, reload, reset, order | pagination, keyboard, mobile endurance |
| Security result | `/modules/security/results/[payload]` | unsupported | v3, v4, v5, invalid | exact tuple replay | domain separation, print |
| Technology questionnaire | `/modules/technology` | unsupported | Standard and Advanced drafts | switch, reload, reset, order | pagination, keyboard, mobile endurance |
| Technology result | `/modules/technology/results/[payload]` | unsupported | v2, v3, invalid | exact tuple replay | domain separation, print |
| AI landing | `/ai` | unsupported | clean browser and saved draft | links and resume state | domain framing and next action |
| AI quiz | `/ai/quiz` | unsupported | clean, partial, complete | reset transitions | keyboard and no auto-advance |
| AI review | `/ai/review` | unsupported | complete fixed draft | answer order and edit routes | hierarchy and reversible navigation |
| AI result | `/ai/results/[payload]` | unsupported | v2, v3, invalid | exact tuple replay | separate-domain language, share |
| Explore hub | `/explore` | supported subset | fixed content | links and taxonomy | scan, reading order, locale boundary |
| Atlas | `/explore/atlas` | `/zh/explore/atlas` | fixed data | routes, one main | keyboard, semantic parity, print |
| Explore prototype | owner-selected route | only if approved copy exists | fixed record | routes, sources | before and after review |
| Current Cases | `/cases` | `/zh/cases` | active and inactive dates | state and labels | evidence dates, empty-current expectation |
| Current redirect | `/current` | locale behavior as implemented | active and inactive dates | redirect destination | promise consistency |
| Current Case detail | `/cases/[slug]` | approved localized record | reviewed fixture | freshness and sources | comprehension, print, corrections |
| Method | `/method` | `/zh/method` | fixed content | anchors and links | lookup, hierarchy, print |
| Feedback | `/feedback` | `/zh/feedback` | fixed content | route and links | scope matches invitations |
| Development Learn | `/learn` | none | dev and production env | dev works, production not found, noindex | none |
| World Stage prototype | `/world-stage-prototype` | none | dev and production env | dev works, production not found, noindex | none |

## 5. Behavior acceptance matrix

### Current Case

| ID | Given | Action | Expected |
| --- | --- | --- | --- |
| `CASE-01` | A reviewed case is inside its window | Load homepage | Current Case is live and may lead |
| `CASE-02` | No reviewed case is inside its window | Load homepage | Foundation leads; Recent Cases is in exploration |
| `CASE-03` | Inactive state | Open `/current` | Redirect agrees with homepage and never reaches an empty-current promise |
| `CASE-04` | A reviewed case crosses a start or end date boundary after build | Make a new request after the boundary | Availability is recomputed per request and updates without redeploy or an hourly revalidation wait |
| `CASE-05` | Invalid or unpublished record | Request direct case route | Fail closed under current catalog policy |

### Reset and draft safety

| ID | Given | Action | Expected |
| --- | --- | --- | --- |
| `DRAFT-01` | Zero Foundation answers | Reset | Immediate clear, no confirmation |
| `DRAFT-02` | One or more Foundation answers | Reset and cancel | Every answer and position remain |
| `DRAFT-03` | One or more Foundation answers | Reset and confirm | Foundation draft clears |
| `DRAFT-04` | Zero or answered AI draft | Repeat reset cases | Same rules as Foundation |
| `DRAFT-05` | Security Standard and Advanced drafts | Switch modes and reload | Each mode restores its own answers and position |
| `DRAFT-06` | Technology Standard and Advanced drafts | Switch modes and reload | Each mode restores its own answers and position |
| `DRAFT-07` | Both modes contain work | Reset active mode | Other mode remains intact |
| `DRAFT-08` | Malformed local record | Load module | Graceful recovery without clearing unrelated records |

### Focus Area pagination

| ID | Given | Action | Expected |
| --- | --- | --- | --- |
| `FLOW-01` | New questionnaire | Select an answer | No automatic advance |
| `FLOW-02` | Answered current question | Next, Back, edit | Answer remains reversible |
| `FLOW-03` | Partial draft | Reload | Answers and current position restore |
| `FLOW-04` | Complete draft | Open review and return to item | Every answer remains and may be edited |
| `FLOW-05` | Fixed answer set entered in arbitrary interaction order | Generate result | Scorer input follows frozen bank order |
| `FLOW-06` | Invalid saved position | Load | Position recovers safely; answers remain |

### Compatibility and cohort boundaries

| ID | Check | Expected |
| --- | --- | --- |
| `COMPAT-01` | Foundation current and legacy fixtures | Existing results reproduce exactly |
| `COMPAT-02` | Security v3, v4, v5 | Exact bank and scorer dispatch |
| `COMPAT-03` | Technology v2, v3 | Exact bank and scorer dispatch |
| `COMPAT-04` | AI v2 and v3 | Exact result and copy version dispatch |
| `COMPAT-05` | Profile stores v1 to v5 and shares v1 to v3 | Readable under registered compatibility paths |
| `COMPAT-06` | Invalid or unsupported tuple | Graceful fail-closed recovery |
| `COHORT-01` | Tier 1 flag off | No aggregation write or ranking UI |
| `COHORT-02` | Exact real cohort below 100 | No ranking returned |
| `COHORT-03` | Tuple, form, or locale mismatch | No ranking returned |
| `COHORT-04` | Authorized matching cohort at least 100 in test fixture | Infrastructure computes only the allowed Foundation statistic, while public V23.5 UI stays hidden |

## 6. Visual and accessibility matrix

Run every row at 320, 390, 768, and 1440 pixels on the critical routes relevant to the change.

| Area | Assertion | Evidence |
| --- | --- | --- |
| Reflow | No horizontal overflow; content remains usable at 400 percent zoom | screenshot and scroll-width check |
| Controls | Primary mobile targets at least 44px; no overlap | computed bounds |
| Landmarks | One main; correct skip-link destination | accessibility tree |
| Source order | Intro and primary choices precede Map details and sources | DOM and accessibility order |
| Contrast | Normal text at least 4.5:1; large text at least 3:1 | measured token and surface pairs |
| Focus | Visible keyboard focus on every interactive element | keyboard trace and screenshot |
| Keyboard | Logical order; no trap; all flows complete | manual trace or automated steps |
| Motion | Reduced-motion setting removes ambient and nonessential movement | media emulation and screenshot |
| Sticky chrome | No task content hidden beneath header or footer | screenshots and bounding boxes |
| Questionnaire | One question unit, compact progress, explicit navigation | screenshots and interaction trace |
| Locale | Supported Chinese and English chrome perform the same task | paired screenshots and tree |
| Map alternative | Semantic non-map content is complete and reachable | tree and keyboard trace |
| Print | Legible text, sources, and hierarchy; no useless controls | rendered PDF or print screenshot |
| Identity | Newsreader, Archivo, Space Mono, navy, brass, and editorial hierarchy remain | before and after owner review |

## 7. Copy and comprehension matrix

Record row-level human dispositions in the [V23.5 Runtime Copy Review Ledger](../editorial/V23_5_RUNTIME_COPY_REVIEW_LEDGER.md). Its `pending` state blocks Phase 3 acceptance. Inventory and model output cannot approve copy.

| Check | Automated boundary | Human boundary |
| --- | --- | --- |
| Runtime composition | Every known combinator renders deterministically | Read complete paragraphs |
| Block job | Every block has a declared job | Owner confirms the job is real and necessary |
| Duplicate job | Router reports adjacent duplicates | Human decides merge, cut, or retain |
| Instrument subject | Router reports candidate sentences | Human checks whether the subject obscures the reader or policy problem |
| English em dash | Blocker with recorded exemptions | None unless exemption is disputed |
| Constitution filler | Blocker | Owner resolves quotations or proper-name edge cases |
| Frozen banks | Blocker across all version suffixes | No bank edit in V23.5 |
| Nominalization, hedge, variance, triad, n-gram | Advisory summary | Never a pass or fail by itself |
| Internal vocabulary | Route and text search where deterministic | New reader walkthrough |
| Result hierarchy | Structural and copy assertions | Moderated comprehension probes |

## 8. Performance matrix

| ID | State | Expected |
| --- | --- | --- |
| `PERF-01` | Homepage, no Mapbox token | Mapbox JavaScript does not initialize; no Mapbox attribution appears; fallback works |
| `PERF-02` | Homepage, token present | Mapbox JavaScript and CSS load behind the same feature boundary |
| `PERF-03` | Map path proven unused | No isolated stylesheet deletion; create a maintenance ADR for whole-path removal |
| `PERF-04` | Every changed entry route | First-load or route chunk does not grow more than 10 percent without approved explanation |
| `PERF-05` | Reduced motion | No repeated work from disabled animation loops |
| `PERF-06` | Baseline and candidate | Bundle reports use the same build mode and environment |

Attach bundle comparison to every map or client-state PR.

## 9. Research release gate

The automated matrix does not replace participant evidence.

Stop fielding for:

- one privacy, accessibility, broken-route, or materially misleading result issue;
- two independent reports of the same consequential comprehension, option-valence, or knowledge-load problem;
- repeated scientific-classification reading of an authored family;
- repeated belief that a domain module changed Foundation.

V23.5 may release only when no critical issue is open and each major issue is fixed and retested or deferred with written owner rationale.

## 10. Deployment and rollback matrix

| Step | Required evidence | Stop condition |
| --- | --- | --- |
| Merge | One coherent, reviewed, independently revertible PR | overlapping subsystem or failed gate |
| Preview | Preview URL tied to reviewed head SHA | deployment source unknown |
| Manual review | Critical route, locale, viewport, print, and failure-state evidence | critical mismatch |
| Production deploy | Exact production SHA recorded | SHA cannot be tied to reviewed source |
| Production smoke | Homepage states, one result per contract family, Profile, Method, Cases, invalid route | broken or misleading behavior |
| Rollback | Revert the last coherent PR and redeploy known-good SHA | rollback source unknown |

V23.5 has no data or payload migration. Rollback is code-only. Do not delete browser records or cohort infrastructure as part of rollback.
