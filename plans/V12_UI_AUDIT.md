# V12 UI audit and file map

Audit date: April 28, 2026.

## Audit basis

Source order used for this pass:

1. Current local branch code.
2. Localhost snapshot PDF in `docs/design/v11_1/Claude Design IR Worldviews Designs/uploads/april 26 IR Worldview Inventory pages pdf.pdf` (PDFKit reports 117 pages; file mtime April 27, 2026).
3. `plans/V12_EXEC_PLAN.md` and `plans/V12_SOURCE_OF_TRUTH.md`.
4. Present V12 pack files under `v12-pack/ir_ai_v12_pack/`.
5. Claude design references under `docs/design/v11_1/Claude Design IR Worldviews Designs/`.

No production or public GitHub state was treated as source of truth.

## Current blockers

### Profile payoff

- The Profile top has already moved toward an anchored-spread layout, but the headline still comes from `buildIntegratedHeadline(profile)`, which remains Foundation-family-first: for layered profiles it reads like "baseline stays closest to X, but Y changes emphasis" instead of making the nearest integrated Atlas-style pattern the payoff.
- The nearest Atlas pattern appears lower on the page. For V12, when 2+ layers exist, that pattern should become the primary read, with the Foundation family as subtitle or supporting metadata.
- The hero still uses a "Baseline" chip and numeric `baseline n / 7 · pressure n / 7` lane metadata. This risks implying fresh measured scores or direct rescores rather than relative pulls/editorial transforms.
- The spread legend still exposes `|Delta| >= 0.5` and `|Delta| < 0.5`. That is clearer than raw deltas, but still reads more quantitative than the V12/design handoff wants.
- The top screen is close to the right shape: short summary, three chips, dominant visual, AI band, CTA row. The remaining blocker is hierarchy and precision language, not a full layout rebuild.
- Secondary Profile sections repeat stable thread, pressure shifts, reasoning style, AI layer, and module summaries. Much is already lower or collapsed, but the page still feels like accumulated summaries after the first screen.

### Module clarity

- Security and Technology entry pages still read like briefing packets before the first question: visible lanes, perspective coverage, long answer instructions, and scope/limits all appear in the pre-question ramp.
- The "What it does not claim" material is still visually peer with "What it measures" and "In-flow shorthand"; V12 wants this integrated into a calmer scope/limits disclosure or matched notes block.
- Module result pages do not yet have a "Decisive calls" surface. They still move from top-line read into lane cards, Foundation linkage, card-type read, instincts, unresolved, notes, module profile, then evidence.
- Advanced module results open the selected-framings evidence log by default. In the localhost PDF, this creates the exact "structured evidence export" feel the V12 trim spec is trying to avoid.
- Actor-lens separation is explained in several places but mostly as prose. The Red Team note correctly flags that this architecture should be more visible, or said once with less repetition.

### AI Atlas depth

- `/ai/field-guide` already exists and follows the two-column explainer direction, but `/ai/atlas/[id]` does not exist.
- `/ai/atlas` is browse-first and uses fingerprint cards, but cards link to in-page nearby-comparison anchors rather than real archetype depth pages.
- Per-archetype detail requirements are not yet met: short definition, compact fingerprint, nearest neighbors, strongest critique, starting readings, and return routes to AI result / AI Atlas / AI Field Guide.
- AI Atlas "Next" CTAs currently go to AI home, quiz, and references, not the Field Guide. AI home links to the Atlas but not clearly to the Field Guide. AI results link to Profile and Atlas through reading shelves, but not consistently to the Field Guide near the payoff.
- The Field Guide covers axes, archetype splits, IR cross-read, starting points, and a non-scored futures appendix. It does not yet include the V12 shelf for under-modeled perspectives such as labor/automation, surveillance/platform power, environmental/compute externalities, Global South dependence/sovereignty, Chinese official framings, and open-source / anti-incumbency politics.

### Trust signaling

- `AGENTS.md` still says the current sprint is V10.1, while the V12 pack supplies a replacement V12 sprint block. This is a repo-hygiene trust issue for agent work, not an app UI blocker.
- The Methods page has strong baseline limitations, but it does not yet include the V12 methods add-on: second-choice answers count at reduced weight; family weights are authored reference profiles; module overlays are relative pulls/editorial transforms; thresholds are heuristic, not validated population cutoffs.
- README is directionally honest, but its route list lags the current app: it omits `/ai/atlas`, `/ai/field-guide`, `/compare`, and `/profile/share/[payload]`.
- Profile and module overlay visuals still need stricter language around relative pulls. "Baseline delta", "pressure n / 7", and exposed numeric thresholds could make the overlay look more measured than it is.
- Trust notes mostly sit below the first payoff, which is good. The remaining risk is not placement so much as inconsistent precision language and stale public/repo packaging.

## Keep / reduce / replace map

| Surface | Keep | Reduce | Replace |
| --- | --- | --- | --- |
| Profile top | Anchored-spread direction, short summary, max-three-chip structure, AI band, CTA row, local/share reuse through `ProfileReport`. | Foundation-family dominance, numeric lane metadata, `|Delta|` threshold language, repeated callout text directly under the chart. | Main headline for 2+ layers with nearest Atlas-style integrated pattern; Foundation family as subtitle/supporting cue; relabel spread as relative pull/editorial deviation. |
| Profile secondary sections | `LayerRelationshipStack`, Atlas feature, AI layer explanation, module overlay access, appendix disclosures. | Full module re-summaries, repeated stable/shift/reasoning language, visible mini-scales in module recap. | Use shared `ScaleBar` or a calmer summary primitive where recap metrics remain; collapse appendix-like detail by default. |
| Profile empty/share states | Existing invalid shared-profile handling and local Profile empty state. | Any suggestion that Profile is equally useful before a Foundation result exists. | If touched, make empty state more explicit that Profile is a destination after saved layers, not a starting surface. |
| Module entry pages | Title, one paragraph, Foundation linkage, mode choice, reversible answer flow, Foundation comparison note. | Visible lanes, perspective coverage wall, long answer instructions, three peer meta callouts before questions. | Collapsed "How to read these cases" and integrated "Scope and limits" block matching the page grammar. |
| Module result pages | Top-line result, 3 lane reads with `ScaleBar`, Foundation linkage, module profile, retake/next CTAs, full evidence source. | Repeated challenge/unresolved copy, repeated actor-lens explanation, open-by-default advanced evidence log, long selected-framings dump. | Add "Decisive calls" with 4-6 informative choices and one-sentence implications; keep full evidence log collapsed by default. |
| AI Atlas browse | Six current repo archetypes, fingerprint row card direction, four-axis compact fingerprint, browse-first meaning. | In-page comparison section weight, quiz-forward CTAs, card CTAs that do not lead to real depth. | Link each card to `/ai/atlas/[id]`; move deeper critique/readings/comparison to detail pages; add clear Field Guide route. |
| AI Atlas detail | Existing typed atlas content and reading-list/deep-profile sources. | N/A: route is missing. | Add route pages using current taxonomy only: definition, fingerprint, neighbors, critique, readings, return links. |
| AI Field Guide | Existing route, no-scoring banner, left rail, eight axes, nearby splits, IR cross-read, optional non-scored futures appendix. | Quiz-forward hero/action emphasis and any futures prominence beyond appendix. | Add under-modeled perspectives shelf and clearer AI Atlas/result/Profile navigation. |
| AI result | Payoff-first result hero, Trust and coverage below payoff, `AiProjectBridge`, rich profile sections, reading list. | Navigation that buries Atlas/Field Guide routes; repeated "about" notes. | Add concise CTA row to Profile, AI Atlas, and AI Field Guide without changing result logic or payloads. |
| AI home | Clear companion-module framing and route to questionnaire/Atlas. | Treating Atlas as the only browse/learn route. | Add Field Guide as a distinct explainer route beside Atlas. |
| Shared visual primitives | `ScaleBar`, `SegmentedLevel`, `ComparisonRow` shape legend and collision offsets, `LayerRelationshipStack`. | One-off Profile mini-scale and any new bespoke chart grammar. | Only extend primitives if a reusable detail-page or module callout need appears; otherwise keep changes local to touched surfaces. |
| Trust/docs | Methods limitations, README methodology limitations, V12 source-of-truth plans. | Stale sprint language and route omissions. | Merge V12 sprint block into `AGENTS.md`; add V12 methods add-on; update README routes/trust notes. |

## Files-to-touch list

### Primary UI files

- `components/profile/profile-report.tsx`
- `components/profile/profile-dashboard.tsx` (only if the Profile empty state is tightened)
- `components/modules/module-app.tsx`
- `components/modules/module-result.tsx`
- `app/ai/page.tsx`
- `app/ai/results/[payload]/page.tsx`
- `app/ai/atlas/page.tsx`
- `app/ai/atlas/[id]/page.tsx` (new)
- `app/ai/field-guide/page.tsx`
- `app/globals.css`

### Shared primitives and reusable display

- `components/visual-primitives.tsx` (only for reusable primitive fixes)
- `components/atlas/ai-archetype-fingerprint.tsx`
- `components/atlas/atlas-fingerprint.tsx` (only if shared fingerprint behavior needs a small correction)
- `components/results/ai-governance-profile-sections.tsx` (only for AI result CTA/structure cleanup if the page file alone is not enough)
- `components/results/ai-governance-reading-list-section.tsx` (only if detail pages reuse the reading path shape)
- `components/ai/ai-project-bridge.tsx` (only if AI result/home navigation needs to be centralized)

### Typed content/helpers likely needed

- `lib/ai-governance-atlas-content.ts`
- `lib/ai-governance-profile-copy.ts` (read/reuse; edit only if detail-page copy needs typed surfacing)
- `lib/ai-governance-reading-lists-v2.ts` (read/reuse; edit only if detail-page readings need a typed helper)
- `lib/modules/framework.ts` (only if "Decisive calls" is cleaner as a shared typed helper than a local view transform)

### Trust and repo-hygiene files

- `AGENTS.md`
- `README.md`
- `app/method/page.tsx`
- `plans/V12_UI_AUDIT.md`

### Avoid unless a later prompt explicitly opens them

- `tmp/**`
- `package.json` and `package-lock.json`
- Scoring/payload/share code: `lib/scoring.ts`, `lib/ai-governance-scoring.ts`, `lib/share.ts`, `lib/profile-share.ts`, `lib/url-payload.ts`, `lib/ai-governance-share.ts`
- Quiz/review flows: `components/quiz-app.tsx`, `components/ai-governance-quiz-app.tsx`, `components/quiz/**`, `app/quiz/**`, `app/ai/quiz/**`, `app/ai/review/**`
- Homepage rewrite work in `app/page.tsx` unless a later trust prompt explicitly requests a small funnel note.
- Compare-page overhaul.

## Notes for the next prompts

- Local code is ahead of the PDF in some V11.2 areas, but the PDF still confirms the main user-facing blockers: long module ramps, open evidence dumps, Foundation-first Profile payoff, and missing AI Atlas depth.
- Claude design files are layout and dominance references only. They contain some obsolete AI archetype/axis names; current repo taxonomy remains authoritative.
- The current working tree was otherwise clean except untracked `v12-pack/`. Do not clean or reorganize it as part of UI implementation.
