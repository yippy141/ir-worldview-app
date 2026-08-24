> **HISTORICAL, SUPERSEDED, NON-EXECUTABLE.** Preserved only for provenance. Reproduce against the reconciled baseline before reuse.

All measurements complete. Here is the report.

---

# `app/globals.css` — Composition Audit & Restructure Plan

**Scope note.** The staged copy at `/mnt/user-data/uploads/ir-worldview-app-clean` contains 60 files and **11 `.tsx` files total**. Most route and component code is absent. Every count below is measured from files that are present. Where a conclusion would require absent files, I say so.

**Counting method (applies throughout).** All counts come from four Python passes over the raw files (scripts in `/tmp/claude-0/-home-claude/e702124e-d434-598d-85b7-ebebf251ff38/scratchpad/`). Comments are stripped with `re.sub(r'/\*.*?\*/','',src,flags=re.S)` before any declaration counting, so commented-out code never inflates a figure. Declarations are parsed as `prop: value` pairs inside `{...}` blocks. Line-region membership (inside `@media` / `@keyframes` vs. top level) is computed with a brace-depth tracker, not by regex.

---

## Headline: the file is not what the brief assumes

Three premises in the task framing do not survive measurement:

| Premise | Measured reality |
|---|---|
| "227KB hand-written stylesheet" implies raw-value sprawl | **Colour is already fully tokenised.** 45 hex occurrences in 11,335 lines, and *every one* sits inside a token definition or the print token override. 1,358 `var()` references, 208 `color-mix()`. |
| Look for `#0F1B2D`, `#C9A227`, `#F4F1EA` | **All three appear zero times**, in globals.css and in all five modules. They are not in this codebase. |
| Tailwind v4 is installed alongside | **Tailwind is 100% vestigial.** Zero directives, zero `@apply`, zero utility classes, no config file staged. |

The real debt is **not** raw values. It is **un-abstracted repetition of about eight visual idioms**, each re-implemented with slightly different numbers — 54 distinct rem font sizes, 46 distinct spacing px values, 85 distinct padding values on bordered surfaces. That distinction changes what the rebuild should do.

---

## 1. Composition by category

**Method.** Brace-depth tracker assigns every one of the 11,335 lines to its enclosing at-rule (or top level). Top-level rule blocks are then classified by their selector: `:root` → tokens; bare element/`html:lang` selectors → reset/base; a fixed list of utility class names (`.sr-only`, `.skip-link`, `.stack-*`, `.row`, `.gap-*`, `.muted`, `.ui`, `.mono`, `.eyebrow`, …) → utilities; everything else → component classes.

| Category | Rule blocks | Lines | % of file |
|---|---:|---:|---:|
| Custom properties (`:root`) | 1 | 36 | 0.3% |
| Reset / base elements (incl. CJK `html:lang` rules) | 24 | 97 | 0.9% |
| Utilities | 23 | 79 | 0.7% |
| **Component classes** | **1,409** | **7,819** | **69.0%** |
| `@media` — responsive | 59 | 1,195 | 10.5% |
| `@media print` | 2 | 215 | 1.9% |
| `@keyframes` | 3 | 21 | 0.2% |
| Blank lines + section-banner comments between blocks | — | 1,873 | 16.5% |
| **Total** | **1,521** | **11,335** | **100%** |

Cross-check on the same file: 1,766 blank lines, 187 comment-only lines, 9,382 code lines. Typography has no separate row because it is not a section — it is distributed across the component classes (499 `font-size` declarations spread through the file, only ~60 of them in the nominal "Typography" banner at lines 746–806).

**Other structural totals:** 1,717 non-at-rule rule blocks · 1,963 individual selectors (comma-split) · **1,173 distinct class names** · ~5,641 declarations · 0 nested `&` selectors · 0 selectors with 3+ chained classes (specificity is genuinely flat) · 10 `!important`.

### The 17 feature groups, with verified line spans

These spans are contiguous and sum exactly to 11,335.

| Group | Lines |
|---|---:|
| AI governance compass + atlas + field guide | 1,467 |
| explore + article + atlas + issue comparisons | 1,245 |
| W2 foundation result extracted patterns + print block | 1,067 |
| result page (foundation) + profile hero + result-card hero | 954 |
| "V10.1 shared visual primitives" | 889 |
| landing / lobby / locale shell / hero | 849 |
| site shell / header / footer / nav / brand / panels | 617 |
| result detail (quick take, blind spot, drivers, reading) | 616 |
| field canvas + field explorer | 611 |
| charts (push chart, comparison, legend) | 549 |
| typography + buttons + CTAs + progress + likert | 507 |
| foundation + AI payoff sections | 463 |
| **"Mobile" override block** | **393** |
| reference profiles | 373 |
| perspectives (picker / run / result) | 309 |
| profile runs + history + locale-neutral profile | 252 |
| tokens + base + i18n + utilities | 174 |

**Two of these are mislabelled, and it matters for the rebuild:**

- **"V10.1 shared visual primitives" (lines 4764–5652, 889 lines) contains no primitives.** It holds 102 distinct feature-specific top-level classes: `.ai-bridge-*`, `.compare-argument-*`, `.compare-spine-*`, `.module-choice-*`, `.planned-module-*`, `.profile-analysis-*`. It is a chronological dumping ground with an aspirational name. Do not treat it as a shared layer.
- **"Mobile" (lines 6269–6661) is a single `@media (max-width: 720px)` block** holding 107 selectors and 130 declarations, reaching into **53 distinct component families** (`ai-result` ×11, `profile-hero` ×11, `quiz-shell` ×9, `wide-container` ×7, `site-shell` ×6, …). This is the single biggest obstacle to a per-feature split: moving component rules into feature files strands their responsive overrides in one shared block.

### A live cascade bug in that mobile block

`.ai-result-card` is declared four times. Source order, all at specificity (0,1,0):

| Line | Context | Declaration |
|---:|---|---|
| 5899 | top level | `padding: 22px 24px` |
| 6637 | inside `@media (max-width: 720px)` | `padding: 18px; border-radius: 6px` |
| 6854 | **top level, unconditional** | `padding: 24px 28px` |
| 7972 | inside a second `@media (max-width: 720px)` | `padding: 18px 20px` |

The unconditional rule at 6854 sits *after* the mobile override at 6637, so it wins at every viewport. Line 6638's `padding: 18px` is **dead** — the effective mobile padding is `18px 20px` from line 7972. `border-radius: 6px` at 6639 survives (never re-declared).

This is pre-existing, not something the rebuild introduces — but any reordering will change it. Record the current rendered value before touching it, or the "no visual regression" check will fail on a line that was already broken.

---

## 2. Raw hex colours

**Method.** `re.findall(r'#[0-9A-Fa-f]{3,8}\b', src)`, filtered to valid CSS hex lengths (3/4/6/8 digits), counted case-sensitively and case-insensitively. Both give the same distinct count, so there are no case-variant duplicates.

**45 total occurrences · 25 distinct.** Every occurrence is either a token definition in `:root` (lines 5–29, 17 occurrences) or inside the `@media print` token override (lines 7995–8120, 28 occurrences). **No hex value appears in an ordinary component rule.**

### The five specified colours

| Colour | Exact (case-sensitive) | Case-insensitive | Where |
|---|---:|---:|---|
| `#0a1322` | **1** | 1 | line 5, `--bg` |
| `#cea857` | **1** | 1 | line 14, `--accent` |
| `#0F1B2D` | **0** | **0** | absent from the entire codebase |
| `#C9A227` | **0** | **0** | absent from the entire codebase |
| `#F4F1EA` | **0** | **0** | absent from the entire codebase |

The last three also appear **zero** times across all five CSS modules. If they come from a design spec, that spec has not landed in code — the shipped palette is the "Direction B (Astrolabe)" navy/brass set defined at lines 4–35.

### Most frequent hex values

| Hex | Count | Role |
|---|---:|---|
| `#ffffff` | 8 | print token overrides |
| `#222222` | 6 | print `--accent` and borders |
| `#111111` | 3 | print `--text` |
| `#444444` | 3 | print `--muted` |
| `#c9c9c9` | 3 | print borders |
| `#999999` | 3 | print borders |
| all 19 others | 1 each | one-time `:root` token definitions |

The greys are entirely a print concern; the brand palette values appear exactly once each by construction. **Colour needs no cleanup.** It is the healthiest layer in the file.

Colour is expressed as: 1,358 `var()` references · 208 `color-mix(in srgb, …)` · 42 `transparent` · 9 `rgba()` · 9 `currentColor` · 0 `rgb()` / `hsl()` / `oklch()`. 29 custom properties defined, 32 referenced (the 3 extra are `--world-stage-*`, set from component code — see §7).

---

## 3. Spacing values

**Method.** Matched declarations whose property is `margin`/`padding`/`gap`/`row-gap`/`column-gap` plus all longhand and logical variants (`-top`, `-inline`, `-block-start`, …), then extracted every `<number>px` token from their values. Shorthands contribute multiple tokens (`padding: 16px 18px` → two).

**1,085 spacing declarations · 1,013 px tokens · 46 distinct px values** (including `-8px`, `-1px`). Non-px use is negligible: 16 `rem`, 3 `vw`, 3 `clamp()`, 1 `var()`.

### Is 7/14/18/24/28/44/64 a coherent scale?

**No.** It accounts for **314 of 1,013 tokens = 31.0%.**

| Claimed step | Occurrences |
|---:|---:|
| 7px | 10 |
| 14px | 93 |
| 18px | 107 |
| 24px | 56 |
| 28px | 37 |
| 44px | 9 |
| 64px | 2 |
| **Total** | **314 / 1,013 (31.0%)** |

The three most-used values in the file — 12px (87), 10px (84), 8px (84) — are **not in the proposed scale at all**, and 16px (79) and 20px (57) are also excluded. The set looks like a scale that was drafted but never enforced; 7px and 64px are near-vestigial.

Spacing is **ad hoc, but not chaotic** — it clusters hard on an even-number grid:

| Property | Share of 1,009 positive tokens |
|---|---:|
| Multiples of 2 | 958 (94.9%) |
| Multiples of 4 | 526 (52.1%) |
| Odd values (1,3,5,7,9,11,13,15) | 51 occurrences across 8 distinct values |

A conventional 4px scale `[4, 8, 12, 16, 20, 24, 32, 40, 48, 64]` already covers **445/1,009 = 44.1%** with zero edits. Snapping the 22px→24px, 18px→16/20px, 14px→12/16px, 10px→8/12px, 6px→4/8px neighbours would take coverage past 90% with sub-pixel-class visual movement — but that is a *deliberate* visual change and belongs in the rebuild, not in a mechanical refactor.

Full distinct set, ascending: `-8, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 40, 42, 44, 48, 50, 52, 54, 56, 58, 60, 64, 66, 68, 72, 74, 82, 84, 112` px.

---

## 4. Border-radius values

**Method.** Matched `border-radius` and all four corner longhands plus logical variants; counted whole normalised value strings.

**140 declarations · 17 distinct value strings** in globals.css. Adding the five modules (24 more declarations, 8 distinct) yields **17 distinct combined** — the modules introduce no new radii.

| Value | Count | Value | Count |
|---|---:|---|---:|
| `999px` | 26 | `2px` | 6 |
| `5px` | 19 | `6px` | 5 |
| `4px` | 16 | `1px` | 4 |
| `3px` | 16 | `9px` | 3 |
| `10px` | 11 | `18px` | 3 |
| `0` | 9 | `50%` | 3 |
| `8px` | 7 | `0 5px 5px 0` | 3 |
| `7px` | 7 | `12px` | 1 |
| | | `0 0 5px 5px` | 1 |

Discounting the two multi-corner shorthands and `50%`, there are **14 distinct scalar radii — and they include every integer from 1px to 10px.** This is genuine ad-hoc drift: `3px`, `4px`, `5px`, `6px`, `7px`, `8px`, `9px` are used 60 times between them for what is visually the same "slightly rounded card" decision. A three-step scale (`2px` sharp / `6px` card / `999px` pill) plus `0` and `50%` would replace all 17.

---

## 5. Font families

**Method.** Matched `font-family` declarations and normalised whitespace in values; separately extracted every concrete family name from the stacks.

**170 declarations · 11 distinct value strings**, but only **three real typefaces** — all loaded via `next/font/local` in `app/layout.tsx` and exposed as CSS variables.

| Value string | Count |
|---|---:|
| `var(--font-serif), Georgia, "Times New Roman", serif` | 62 |
| `var(--sans)` | 42 |
| `var(--font-mono), monospace` | 30 |
| `var(--font-mono), ui-monospace, "SF Mono", Menlo, Consolas, monospace` | 25 |
| `var(--font-sans), system-ui, sans-serif` | 3 |
| `var(--font-sans), system-ui, -apple-system, "Segoe UI", sans-serif` | 2 |
| `var(--font-serif), Georgia, serif` | 2 |
| `var(--font-sans)` | 1 |
| `inherit` | 1 |
| `"Songti SC", "STSong", "SimSun", "Noto Serif CJK SC", "Source Han Serif SC", serif` | 1 |
| `var(--font-mono), ui-monospace, "SFMono-Regular", monospace` | 1 |

The actual fonts, from `app/layout.tsx`:

| Variable | Font | Source |
|---|---|---|
| `--font-serif` | **Newsreader** (variable, weight 200–800) | `public/fonts/newsreader-variable.ttf` |
| `--font-sans` | **Archivo** (variable, weight 100–900) | `public/fonts/archivo-variable.ttf` |
| `--font-mono` | **Space Mono** (400 + 700) | `public/fonts/space-mono-{regular,bold}.woff2` |
| — | Simplified-Chinese system stack | `html:lang(zh-Hans)` override, lines 38–41 |

**The problem is not the number of families — it is that the same family is written four different ways.** Mono has 4 distinct fallback stacks, sans has 4, serif has 2. All 11 strings should collapse to three tokens (`--font-serif`, `--sans`, `--font-mono`), each defining its fallback chain exactly once. That is a mechanical, zero-risk edit worth ~170 touched lines.

### The real typographic debt

| Property | Declarations | Distinct values (globals) | Distinct (globals + modules) |
|---|---:|---:|---:|
| **`font-size`** | 499 | **77** | **118** |
| `line-height` | 286 | **38** | 46 |
| `letter-spacing` | 147 | 21 | 23 |
| `font-weight` | 193 | 5 | — |
| `transition` | 28 | 22 | 30 |
| `box-shadow` | 26 | 15 | 16 |
| `z-index` | 7 | 7 | 16 |

**54 distinct plain-rem font sizes** in globals.css alone: `0.6, 0.62, 0.625, 0.64, 0.66, 0.68, 0.6875, 0.7, 0.71, 0.72, 0.74, 0.75, 0.76, 0.78, 0.8, 0.82, 0.84, 0.85, 0.86, 0.87, 0.875, 0.88, 0.9, 0.92, 0.93, 0.94, 0.95, 0.96, 0.98, 1.0, 1.02, 1.04, 1.05, 1.06, 1.08, 1.1, 1.12, 1.15, 1.18, 1.2, 1.22, 1.24, 1.28, 1.3, 1.35, 1.4, 1.72, 1.75, 1.95, 2.0, 2.2, 2.35, 3.25, 3.8` rem. Twenty-two of the 499 use `clamp()`.

Between `0.86rem` and `0.88rem` there is no perceptible difference at 16px root — that is a 0.32px gap. **This is the highest-value cleanup in the entire audit**: a 9-step type scale replaces 118 values, and `font-weight` proves it can be done (already disciplined at 5 values, of which `650` ×6, `400` ×3, `500` ×4 are the strays against `700` ×90 and `600` ×90).

---

## 6. Is Tailwind doing real work?

**No. It is entirely vestigial.** Evidence, all negative:

| Check | Result |
|---|---|
| `@tailwind` directives in globals.css | **0** |
| `@import "tailwindcss"` | **0** |
| `@apply` | **0** |
| `@theme` / `@config` / `@plugin` / `@source` / `@utility` / `@custom-variant` / `@layer` | **0** |
| At-rules actually present | only `@media` (61) and `@keyframes` (3) |
| `postcss.config.*` or `tailwind.config.*` | **not present in the staged copy** |
| Tailwind utility classes in the 11 staged `.tsx` files | **0** |

The last row needs care: a regex for ~40 common Tailwind utility patterns returned 14 hits, but **all 14 are false positives** — custom BEM-ish names that merely contain the substring: `lobby-hero-grid`, `module-choice-grid`, `planned-track-grid`, `planned-module-grid`, `resource-list--grid`, `atlas-pattern-grid`, `lobby-related-grid`, `foundation-result-reading-grid`, `foundation-domain-grid`, `ai-atlas-detail-hero-grid`, and `print-hidden` (×3, alongside `row gap-sm wrap` which are this project's own utilities defined at globals.css lines 738–744).

`tailwindcss` and `@tailwindcss/postcss` are both **devDependencies**, not dependencies. With no directives and no config, the PostCSS plugin emits nothing.

**Recommendation:** this is a live decision the rebuild must make explicitly, not by default.

- **Remove it** if the rebuild stays with semantic classes + tokens. Deleting two devDependencies is not "adding a dependency" and does not touch the hard constraints. It removes a misleading signal that has already cost this audit's framing.
- **Adopt it properly** — `@import "tailwindcss"` plus a `@theme` block mapping the 29 existing tokens — only if the team commits to it. Note this is a *large* migration: 1,173 class names, 5,641 declarations. It is not a one-pass change and it conflicts with "no visual regression."

Do not leave it half-installed.

---

## 7. Duplication between globals.css and the CSS modules

### The modules

**Five module files are staged** (the brief says six; see the gap note below).

| File | Lines | Bytes | Rules | Decls | Hex | `var()` | `@media` | `!important` |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `worldview-map.module.css` | 1,938 | 36,558 | 273 | 985 | 4 | 201 | 7 | 38 |
| `current-case.module.css` | 1,579 | 27,386 | 239 | 780 | 4 | 183 | 4 | 1 |
| `world-stage.module.css` | 1,179 | 22,275 | 151 | 640 | 16 | 85 | 5 | 0 |
| `archetypes.module.css` | 888 | 14,841 | 136 | 416 | 7 | 90 | 6 | 6 |
| `worldview-profile.module.css` | 795 | 12,312 | 131 | 348 | 0 | 63 | 4 | 3 |
| **Total** | **6,379** | **113,372** | **930** | **3,169** | **31** | **622** | **26** | **48** |

Total CSS in the staged repo: **340,953 bytes** across 6 files.

Two exonerations, both verified:
- **The 38 `!important` in `worldview-map.module.css` are all inside `@media print`** (block opens at line 1773; first `!important` at 1777). Forcing print layout is a legitimate use. Do not flag these.
- **Token discipline is excellent.** 622 `var()` references against 31 hex occurrences. Every token used by four of five modules is defined in globals' `:root`. The only three exceptions — `--world-stage-country-fill`, `--world-stage-legend-color`, `--world-stage-node-color` in `world-stage.module.css` — are supplied at runtime from component code, which is the correct pattern for data-driven cartography.

The one real colour outlier is **`world-stage.module.css`: 16 hex occurrences, 15 distinct** (`#07111f`, `#d7b465`, `#e7ca8d`, `#91b8df`, `#9a5e4b`, `#a99573`, `#81778f`, `#f1f4f8`, `#cbd5e1`, `#9aacbf`, `#65778e`, `#334863`, `#162b45`, `#e2c38d`, `#000`). These are a map palette that never made it into the token layer.

### Duplication, measured three ways

**(a) Byte-identical declaration blocks shared across files.** 13 declaration-sets of ≥3 declarations appear in both globals.css and at least one module. The clearest is `.sr-only`, duplicated verbatim in `world-stage.module.css` (`position:absolute; width:1px; height:1px; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; padding:0`) against globals.css lines 9747–9757. Ten of the 13 are in `worldview-map.module.css` — axis/tick/label styling that mirrors the `.field-canvas` rules at globals.css 9791–9884.

**(b) Internal duplication inside globals.css.** 25 declaration-sets of ≥2 declarations repeat 3+ times, giving **73 redundant blocks**. Top offenders:

| Repeats | Declaration set |
|---:|---|
| ×8 | `display: grid; gap: 18px; grid-template-columns: 1fr` |
| ×7 | `border-top: none; padding-top: 0` |
| ×6 | `display: grid; gap: 14px; grid-template-columns: 1fr` |
| ×6 | `border-bottom: 1px solid var(--border); padding: 16px 0` |
| ×5 | `color: var(--muted); font-size: 0.9rem; line-height: 1.62; margin: 0` |
| ×5 | `outline: 2px solid color-mix(in srgb, var(--accent) 70%, white 30%); outline-offset: 2px` |
| ×5 | `color: var(--accent); font-weight: 600` |

**(c) Idiom-level duplication — the dominant form.** This is what actually explains the file size. Eight visual idioms are re-implemented from scratch, hundreds of times, with drifting numbers:

| Idiom | globals | modules | Total | Variant spread |
|---|---:|---:|---:|---|
| Bordered + padded surface | 214 | 95 | **309** | **85 distinct padding values, 16 distinct radii** |
| Muted prose (`--muted` + size + line-height) | 90 | 28 | **118** | — |
| Micro-label (uppercase + letter-spacing) | 83 | 7 | **90** | **13 letter-spacings, 12 font-sizes, 3 weights** |
| Grid + gap | 146 | — | 146 | 48 of them are `grid-template-columns: 1fr` |
| Flex row + gap | 89 | — | 89 | — |
| Pill (`border-radius: 999px`) | 26 | — | 26 | — |
| Focus ring (`outline` + `outline-offset`) | 18 | 14 | **32** | should be exactly one rule |

The micro-label case is the cleanest illustration. Ninety rules implement one visual idea — a small uppercase brass label — using letter-spacing values `0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.11, 0.12, 0.14em` and `0`, at twelve different font sizes. No reader can distinguish `0.06em` from `0.07em`. **One `.label-micro` class replaces all 90.**

Most-repeated single declarations in globals.css: `margin: 0` ×215 · `color: var(--muted)` ×196 · `display: grid` ×153 · `color: var(--text)` ×150 · `display: flex` ×99 · `font-weight: 700` ×90 · `font-weight: 600` ×90 · `text-transform: uppercase` ×84 · `grid-template-columns: 1fr` ×83 · `min-width: 0` ×81.

### Breakpoint chaos

**26 distinct `@media` conditions in globals.css**, mixing `min-width` and `max-width` with no shared set: `640, 900, 980, 720, 760, 960, 480, 420, 820, 600, 1040, 520, 680, 800, 799, 1024, 1139, 899, 1200, 721–980` plus `prefers-reduced-motion` and `print`. The modules add more (`worldview-map.module.css` alone uses `1200`, `900–1199`, `899`, `420`, `720`). Four or five named breakpoints would cover everything.

### Gap: two modules referenced but absent

Both are imported by staged code but not present in the staged copy — I cannot report on their contents:

- `app/explore/explore.module.css` — imported by `app/explore/page.tsx:28` and `app/explore/[slug]/page.tsx:10`
- `components/home/world-stage-prototype/world-stage-prototype.module.css` — imported by `components/home/world-stage-prototype/world-stage-map.tsx:2`

So the real repo has **at least seven** module files, not six. The staged five total 113KB; the brief's "roughly 150KB" is consistent with the two missing files making up the difference.

### What I could not determine

A class-usage cross-reference found **159 of 1,173** class names in staged source and 1,014 not found (86%). **This is not a dead-code measurement.** Only 11 `.tsx` files are staged, and the routes that would consume the missing classes (`app/ai/atlas/`, `app/profile/`, `app/field/`, `app/perspectives/`, `app/current-cases/`, `components/layout/site-chrome`) are all absent. The 86% is dominated by partial staging. **Dead-CSS analysis must be re-run against the full repo** — it is the one measurement that could materially shrink the file beyond what this plan achieves, and I cannot perform it here.

---

## 8. Proposed split and execution order

### Design principle

CSS source order determines the cascade at equal specificity, and this file is **entirely flat** (0 selectors with 3+ chained classes, only 10 `!important`). Flat specificity means **source order is the only thing holding the current rendering together** — and the `.ai-result-card` bug in §1 proves the order is already load-bearing in ways nobody intended.

Therefore: **split mechanically before splitting semantically.** Phase A must be provably order-preserving; only then is it safe to move rules.

### Phase A — mechanical split (one pass, zero visual regression by construction)

Cut at the verified line boundaries and re-import in **exactly** the original order. `app/globals.css` becomes a barrel of `@import` statements only. Next.js/Turbopack inlines these at build time, and `@import` order is preserved, so the concatenated output is byte-identical to today's file. Nothing is reordered, renamed, or deduplicated.

| # | Target file | Source lines | Budget |
|---:|---|---|---:|
| 1 | `styles/tokens.css` | 1–36 | 36 |
| 2 | `styles/i18n-cjk.css` | 37–91 | 55 |
| 3 | `styles/base.css` | 92–128 | 37 |
| 4 | `styles/shell.css` | 129–745 | 617 |
| 5 | `styles/typography.css` + `controls.css` | 746–1252 | 507 |
| 6 | `styles/landing.css` | 1253–2101 | 849 |
| 7 | `styles/explore.css` | 2102–3346 | 1,245 |
| 8 | `styles/result-foundation.css` | 3347–4300 | 954 |
| 9 | `styles/payoff.css` | 4301–4763 | 463 |
| 10 | `styles/legacy-v10-1.css` *(name it honestly)* | 4764–5652 | 889 |
| 11 | `styles/result-detail.css` | 5653–6268 | 616 |
| 12 | **`styles/responsive-mobile.css`** | 6269–6661 | 393 |
| 13 | `styles/ai-governance.css` | 6662–8128 | 1,467 |
| 14 | `styles/result-w2.css` + **`styles/print.css`** | 8129–9195 | 1,067 |
| 15 | `styles/charts.css` | 9196–9744 | 549 |
| 16 | `styles/utilities.css` + `styles/field.css` | 9745–10401 | 657 |
| 17 | `styles/perspectives.css` | 10402–10710 | 309 |
| 18 | `styles/reference-profiles.css` | 10711–11083 | 373 |
| 19 | `styles/profile.css` | 11084–11335 | 252 |
| | **Total** | | **11,335** |

**Verification gate.** Concatenate the imports in order and diff against the original `globals.css`. It must be byte-identical modulo whitespace. If it is not, stop. This gate is what makes Phase A risk-free, and it is why Phase A must not include *any* cleanup — the moment you dedupe, the diff stops being a proof.

Keep `styles/responsive-mobile.css` (#12) at its original position in the barrel even though it looks misplaced. Moving it is a Phase C decision, and moving it is exactly what would silently "fix" the `.ai-result-card` bug and change mobile rendering.

### Phase B — extract primitives (visible diff, reviewable)

Now that files are small, build the layer that never existed. Insert `styles/primitives.css` after `base.css` and before the feature files.

| Primitive | Replaces | Est. lines |
|---|---:|---:|
| `.surface` (+ `--sm`/`--lg` padding variants) | 309 bordered+padded rules | 40 |
| `.label-micro` | 90 micro-label rules | 12 |
| `.prose-muted` (+ size variants) | 118 muted-prose rules | 20 |
| `.grid-auto` / `.grid-1` | 146 grid+gap rules | 25 |
| `.cluster` (flex + gap) | 89 flex+gap rules | 15 |
| `.pill` | 26 rules | 10 |
| `:focus-visible` — **one** global rule | 32 duplicated focus rings | 6 |
| Card/list/rule separators | the ×7 and ×6 repeats | 20 |
| | **Total** | **~150** |

Then fold in the three no-risk normalisations:
- Collapse 11 `font-family` strings → 3 token references (~170 lines touched, zero visual change).
- Promote `world-stage.module.css`'s 15 map hexes into `tokens.css` as `--map-*`.
- Delete the duplicated `.sr-only` from `world-stage.module.css`.

Expect roughly **1,200–1,800 lines removed** from the feature files. Every removal is a real diff — review them.

### Phase C — collapse the scales (deliberate visual change; this is the rebuild)

Do not attempt this in the same pass as A or B. Each step changes pixels on purpose:

1. **Type scale.** 118 `font-size` values → 9 steps; 46 `line-height` values → 4; 23 `letter-spacing` values → 4. Highest value, highest visible impact.
2. **Spacing scale.** 46 px values → the 4px scale `[4, 8, 12, 16, 20, 24, 32, 40, 48, 64]` (already 44.1% covered; 94.9% of values are even, so snapping is short).
3. **Radius scale.** 17 values → 5 (`0`, `2px`, `6px`, `999px`, `50%`).
4. **Breakpoints.** 26 conditions → 4–5 named tokens, `min-width` only. **Do this step last** — it is what finally lets `responsive-mobile.css` dissolve into the feature files, and it is where the `.ai-result-card` bug gets resolved intentionally rather than accidentally.
5. **Decide on Tailwind** (§6). Remove the two devDependencies, or adopt it deliberately. Not both, not neither.

### Projected end state

| Layer | Lines |
|---|---:|
| tokens + base + i18n + utilities | ~250 |
| primitives | ~150 |
| print | ~215 |
| feature files (12–14 files, post-B and post-C) | ~5,500–6,500 |
| **Total** | **~6,100–7,100** (from 11,335) |

**A 40–45% reduction without touching a single scoring, payload, or calibration path.** All work is confined to `app/globals.css`, the five module files, and `app/layout.tsx`'s single CSS import — none of which participate in scoring or frozen replay. The constraint that frozen replay of old versions keeps working is unaffected by any step above, since no step changes markup or class names emitted by scoring code (Phase B changes class *usage* in components, which the missing-file caveat means must be verified against the full repo before executing).

**Prerequisite before Phase B:** re-run the dead-class analysis against the complete repository. If a meaningful share of the 1,014 unresolved class names really is dead, deleting them first would shrink the Phase B and C workload substantially — and that ordering cannot be decided from the staged copy.
