# V10.1 Diagram Audit

Scope: audit only. This plan follows the V10.1 patch pack and does not change scoring, routes, payload formats, taxonomy, or temp files.

Planned shared primitive file for later prompts: `components/visual-primitives.tsx`.

## Foundation Result

| Current diagram or micro-chart | Current files | Decision | Replacement primitive | Expected files to touch later |
| --- | --- | --- | --- | --- |
| Result signature SVG emblem in the hero. Decorative node-and-line mark with family color. | `app/results/[payload]/page.tsx`, `app/globals.css` | Remove | Either a top-three `ScaleBar` summary or a collapsed single-column hero. Prefer top-three `ScaleBar` only if it adds useful signal above the fold. | `app/results/[payload]/page.tsx`, `app/globals.css`, `components/visual-primitives.tsx` |
| Dimension profile score bars using `.score-bar` / `.score-fill`. | `app/results/[payload]/page.tsx`, `app/globals.css` | Replace | `ScaleBar` | `app/results/[payload]/page.tsx`, `app/globals.css`, `components/visual-primitives.tsx` |
| Nearest Atlas pattern compact fingerprint embedded in the Foundation result. | `app/results/[payload]/page.tsx`, `components/atlas/atlas-fingerprint.tsx`, `app/globals.css` | Replace | `SegmentedLevel` inside the Atlas fingerprint component | `components/atlas/atlas-fingerprint.tsx`, `app/globals.css`, `components/visual-primitives.tsx` |
| Primary-vs-runner-up comparison strip in the interpretation drawer. This is a tabular comparison of expected high/low/neutral, not a continuous movement plot. | `app/results/[payload]/page.tsx`, `app/globals.css` | Keep | None | None expected |
| Last-saved-result history shift rows. Textual comparison rows, not a chart. | `components/results/history-compare.tsx`, `app/globals.css` | Keep | None | None expected |

## Module Result

| Current diagram or micro-chart | Current files | Decision | Replacement primitive | Expected files to touch later |
| --- | --- | --- | --- | --- |
| Focus-area lane meters in the result lead cards using `.score-bar` / `.score-fill`. | `components/modules/module-result.tsx`, `app/globals.css` | Replace | `ScaleBar` | `components/modules/module-result.tsx`, `app/globals.css`, `components/visual-primitives.tsx` |
| Module profile axis bars using `.score-bar` / `.score-fill`. | `components/modules/module-result.tsx`, `app/globals.css` | Replace | `ScaleBar` | `components/modules/module-result.tsx`, `app/globals.css`, `components/visual-primitives.tsx` |
| Foundation linkage reinforce / complicate / pull-away cards. Structured status cards, not chart logic. | `components/modules/module-result.tsx`, `app/globals.css` | Keep | None | None expected |

## AI Result

| Current diagram or micro-chart | Current files | Decision | Replacement primitive | Expected files to touch later |
| --- | --- | --- | --- | --- |
| AI axis profile bars using `.ai-score-bar` / `.ai-score-fill`. | `app/ai/results/[payload]/page.tsx`, `app/globals.css` | Replace | `ScaleBar` | `app/ai/results/[payload]/page.tsx`, `app/globals.css`, `components/visual-primitives.tsx` |
| AI / IR relationship bridge cards. Structured relationship copy, not a chart. | `components/ai/ai-project-bridge.tsx`, `app/globals.css` | Keep | None | None expected |
| AI result profile-shape and summary cards. They name clarity and policy signals without charting. | `components/results/ai-governance-profile-sections.tsx`, `app/globals.css` | Keep | None | None expected |

## Profile

| Current diagram or micro-chart | Current files | Decision | Replacement primitive | Expected files to touch later |
| --- | --- | --- | --- | --- |
| Saved-layer pill strip in the hero and mosaic header. Duplicated status signal. | `components/profile/profile-report.tsx`, `app/globals.css` | Replace | Fold into `LayerRelationshipStack`; keep one compact layer-status presentation if still useful. | `components/profile/profile-report.tsx`, `app/globals.css`, `components/visual-primitives.tsx` |
| Worldview mosaic / constellation: absolute-positioned nodes, SVG connector lines, decorative background, and status pills. | `components/profile/profile-report.tsx`, `app/globals.css` | Replace | `LayerRelationshipStack` | `components/profile/profile-report.tsx`, `app/globals.css`, `components/visual-primitives.tsx` |
| Baseline-vs-overlay spine plot with dot markers on a thin track. Legend uses same dot shape with color only; near collisions are not offset. | `components/profile/profile-report.tsx`, `lib/profile-helpers.ts`, `app/globals.css` | Replace | `ComparisonRow` with shape-coded legend markers and near-collision offsets | `components/profile/profile-report.tsx`, `app/globals.css`, `components/visual-primitives.tsx` |
| Completed-module lane mini-scales using `.profile-mini-scale` / `.profile-mini-scale-fill`. | `components/profile/profile-report.tsx`, `app/globals.css` | Replace | `ScaleBar` | `components/profile/profile-report.tsx`, `app/globals.css`, `components/visual-primitives.tsx` |
| Nearest Atlas pattern compact fingerprint in the Profile Atlas feature. | `components/profile/profile-report.tsx`, `components/atlas/atlas-fingerprint.tsx`, `app/globals.css` | Replace | `SegmentedLevel` inside the Atlas fingerprint component | `components/atlas/atlas-fingerprint.tsx`, `app/globals.css`, `components/visual-primitives.tsx` |
| Profile AI layer mode pills. Status labels only, not a chart. | `components/profile/profile-report.tsx`, `app/globals.css` | Keep | None | None expected |

## Atlas Cards

| Current diagram or micro-chart | Current files | Decision | Replacement primitive | Expected files to touch later |
| --- | --- | --- | --- | --- |
| Atlas browse cards currently do not render the fingerprint or another level micro-chart; they rely on family chips and driver tags. This is a high-traffic surface with insufficient level signal. | `components/atlas/atlas-pattern-card.tsx`, `app/explore/atlas/page.tsx`, `app/globals.css` | Replace | Add the shared `SegmentedLevel`-based Atlas fingerprint to cards, using the existing `AtlasFingerprint` component after it is refactored. | `components/atlas/atlas-pattern-card.tsx`, `components/atlas/atlas-fingerprint.tsx`, `app/globals.css`, `components/visual-primitives.tsx` |
| Primary family cue chip. Visual label, not a diagram. | `components/atlas/atlas-pattern-family.tsx`, `components/atlas/atlas-pattern-card.tsx`, `app/globals.css` | Keep | None | None expected |

## Atlas Detail

| Current diagram or micro-chart | Current files | Decision | Replacement primitive | Expected files to touch later |
| --- | --- | --- | --- | --- |
| Visual fingerprint strip in the detail side card. Active segments depend on subtle fill and gradient treatment. | `app/explore/atlas/[id]/page.tsx`, `components/atlas/atlas-fingerprint.tsx`, `app/globals.css` | Replace | `SegmentedLevel` | `components/atlas/atlas-fingerprint.tsx`, `app/globals.css`, `components/visual-primitives.tsx` |
| Driver tag list beside the detail fingerprint. Labels, not a chart. | `app/explore/atlas/[id]/page.tsx`, `app/globals.css` | Keep | None | None expected |

## Replacement Primitive Map

- `ScaleBar`: Foundation dimension profile, module lane meters, module profile axes, AI axis profile, Profile module lane mini-scales, optional Foundation hero top-three summary.
- `ComparisonRow`: Profile baseline-vs-overlay spine plot. Must include marker examples in the legend, shape-coded series, and vertical offsets when values nearly coincide.
- `SegmentedLevel`: Atlas fingerprint rows on Atlas cards, Atlas detail, Foundation embedded Atlas card, and Profile embedded Atlas feature.
- `LayerRelationshipStack`: Profile relationship/mosaic replacement and one consolidated layer-status presentation.

## KNOWN DEFERRED ITEMS

- `typescript.ignoreBuildErrors: true` in `next.config.ts`.
- Unsigned base64 JSON share payloads in `lib/url-payload.ts`.
- Magic-number overlay coefficients in `lib/modules/security.ts` and `lib/modules/technology.ts`.
- The `0.45` second-choice weight in `lib/scoring.ts`.
