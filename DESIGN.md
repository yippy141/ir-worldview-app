---
name: IR Worldview Inventory
description: A policy-journal interactive for mapping worldview profiles — navy field, brass instrument.
colors:
  meridian-navy: "#0a1322"
  meridian-navy-2: "#0e1a2e"
  chart-panel: "#122139"
  hairline: "#22344f"
  hairline-soft: "#304563"
  ink: "#eef2f7"
  ink-2: "#c7d2e0"
  slate-muted: "#8295ab"
  slate-faint: "#5a6c84"
  sextant-brass: "#cea857"
  brass-bright: "#e0c07f"
  brass-dim: "#9a7d3e"
  steel-blue: "#86abd2"
  tradition-realist: "#d98a5a"
  tradition-institutionalist: "#7aa8d8"
  tradition-constructivist: "#62c2a3"
  tradition-cpe: "#c198d8"
typography:
  display:
    fontFamily: "Newsreader, Georgia, 'Times New Roman', serif"
    fontSize: "clamp(1.75rem, 3vw, 2.4rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Newsreader, Georgia, 'Times New Roman', serif"
    fontSize: "clamp(1.1rem, 2vw, 1.4rem)"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Newsreader, Georgia, 'Times New Roman', serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Newsreader, Georgia, 'Times New Roman', serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Archivo, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "0.78rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.04em"
  micro:
    fontFamily: "'Space Mono', ui-monospace, 'SF Mono', Menlo, Consolas, monospace"
    fontSize: "0.72rem"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  xs: "3px"
  sm: "5px"
  md: "7px"
  lg: "10px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "20px"
  lg: "32px"
  xl: "44px"
components:
  button-primary:
    backgroundColor: "{colors.sextant-brass}"
    textColor: "{colors.meridian-navy}"
    rounded: "{rounded.sm}"
    padding: "10px 18px"
  button-primary-hover:
    backgroundColor: "{colors.brass-bright}"
  button-secondary:
    backgroundColor: "{colors.chart-panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "10px 18px"
  cta-primary:
    backgroundColor: "{colors.sextant-brass}"
    textColor: "{colors.meridian-navy}"
    rounded: "{rounded.pill}"
    padding: "11px 22px"
  cta-secondary:
    backgroundColor: "{colors.chart-panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "11px 22px"
  option-card:
    backgroundColor: "{colors.chart-panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "18px 20px"
  panel:
    backgroundColor: "{colors.chart-panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "40px"
  tradition-chip:
    backgroundColor: "{colors.tradition-realist}"
    textColor: "{colors.meridian-navy}"
    rounded: "{rounded.xs}"
    padding: "3px 10px"
---

# Design System: IR Worldview Inventory

## 1. Overview

**Creative North Star: "The Astrolabe"**

A precision brass instrument read against a deep navy night. The interface is
the instrument, not the spectacle: a calm, dark field of Meridian Navy on which
a single calibrated accent — Sextant Brass — marks action, selection, and
orientation. Everything else is drawn in hairlines and tonal panels, the way an
astrolabe's scales are engraved rather than painted. The register is a serious
policy-journal interactive: serif prose carries the reading voice, small sans
labels do the instrument's engraving, and mono appears only for micro/technical
readouts.

This system explicitly rejects the surfaces PRODUCT.md names as
anti-references: it must never resemble a SaaS dashboard, an AI demo, a
personality-test funnel, a therapy app, lecture notes, or a dissertation
abstract. No gradients, no neon, no glassmorphism, no oversized shadows, no
stacked identical cards, no decorative charts, no fake precision. Density is
editorial, not dashboard: article measures capped near 66ch, hairline-divided
lists preferred over card grids, generous vertical rhythm (`.page-space`,
52px/112px) around each reading surface.

Motion is state, not choreography: 120–300ms eases on hover, border, and
selection changes; a single 150ms fade between quiz questions; every animation
has a `prefers-reduced-motion` fallback. The theme is dark-only
(`color-scheme: dark`); print gets a flat black-on-white override — that is a
media adaptation, not a second theme.

**Key Characteristics:**
- Dark-only navy field with one brass accent; color is calibration, not decoration.
- Serif-led editorial typography (Newsreader) with sans (Archivo) reserved for UI labels and mono (Space Mono) for micro readouts.
- Depth drawn with 1px hairlines and tonal panel steps; shadows are vestigial (≤0.08 alpha).
- Hairline-divided editorial lists over card grids; pills for CTAs and wayfinding chips.
- Calibrated and quiet components: thin borders, exact states, brass only for action and selection.

## 2. Colors: The Astrolabe Palette

A navy night field, engraved hairlines, and one brass instrument color, with a
small reserved set of tradition inks for worldview content.

### Primary
- **Sextant Brass** (#cea857): The single instrument accent. Primary buttons and CTAs, selected states, active nav underlines, kickers, and inline links. It signals "this is where you act or where you are" — never atmosphere.
- **Bright Brass** (#e0c07f): Hover/emphasis step of the brass. Used for hover states on brass elements and the eyebrow label tone.
- **Dim Brass** (#9a7d3e): Muted brass for de-emphasized accent contexts.

### Secondary
- **Steel Blue** (#86abd2): A cool secondary instrument tone for data/figure contexts. Rare by design.

### Tertiary
- **Realist Umber** (#d98a5a), **Institutionalist Blue** (#7aa8d8), **Constructivist Teal** (#62c2a3), **CPE Lilac** (#c198d8): The tradition inks. They appear only as chips, rules, and subtle callouts bound to actual tradition content (realist, institutionalist, constructivist, critical political economy). Chip text sits in Meridian Navy on the tradition color.

### Neutral
- **Meridian Navy** (#0a1322): The body field. Every page sits on it.
- **Meridian Navy 2** (#0e1a2e): The second field step; quieter panels and the legacy `--paper`/`--panel-2` aliases resolve here.
- **Chart Panel** (#122139): Raised surface for panels, form UI, and option cards. Surfaces frequently lighten via `color-mix(in srgb, var(--panel) N%, white …)` steps rather than new tokens — reuse those mixes, don't invent new hexes.
- **Ink** (#eef2f7) / **Ink 2** (#c7d2e0): Primary and secondary reading text.
- **Slate Muted** (#8295ab) / **Slate Faint** (#5a6c84): Supporting text and metadata. Muted is the floor for running copy; Faint is metadata-only.
- **Hairline** (#22344f) / **Hairline Soft** (#304563): The engraved lines. 1px borders, dividers, and list rules.

### Named Rules
**The Brass Discipline Rule.** Sextant Brass marks action, selection, and orientation only. If an element is not interactive, not selected, and not a wayfinding label, it does not get brass.

**The Tradition Ink Rule.** The four tradition colors are content-bound: they may only appear attached to their named tradition (chips, rules, callouts). They are never ambient decoration, chart garnish, or generic category colors.

## 3. Typography

**Display Font:** Newsreader (with Georgia, "Times New Roman", serif)
**Body Font:** Newsreader (same family carries prose and headings)
**Label Font:** Archivo (with system-ui fallback) — the `.ui` utility
**Micro/Mono Font:** Space Mono (with ui-monospace fallback) — the `.mono` utility

**Character:** A single editorial serif voice, from headline to footnote, with a
neutral sans doing quiet instrument-engraving in labels and steps, and a mono
reserved for micro technical readouts. The pairing contrasts on axis (serif
prose vs. sans/mono apparatus), never on style within an axis.

### Hierarchy
- **Display / h1** (700, clamp(1.75rem, 3vw, 2.4rem), 1.15, -0.02em): Page titles. The V15 landing hero scales to 3.8rem at ≥900px — that is the ceiling.
- **Headline / h2** (700, clamp(1.1rem, 2vw, 1.4rem), 1.3, -0.01em): Section heads.
- **Title / h3** (600, 1rem): Entry and list-item titles, serif.
- **Body** (400, ~0.9–1.06rem, 1.6–1.8): Serif prose. Leads run up to 1.22rem. Measure capped at 56–66ch (`max-width` in ch on every prose block).
- **Label** (600–700, 0.7–0.9rem, Archivo): UI labels, steps, kickers. Uppercase kickers track 0.04–0.11em at 0.68–0.78rem, colored brass.
- **Micro** (Space Mono, ≤0.75rem): Technical/metadata readouts only.

### Named Rules
**The Serif Voice Rule.** Newsreader speaks; Archivo labels; Space Mono measures. Never set running prose in Archivo, never set a heading in Space Mono, and never introduce a fourth family.

**The Quiet Kicker Rule.** Uppercase tracked labels exist as a deliberate brass-toned system (`.eyebrow`, `.section-kicker`) — use them where the codebase already does (section wayfinding), and never stack one above every heading by reflex.

## 4. Elevation

Depth is drawn, not cast. Layering is carried by tonal steps of the navy field
(Meridian Navy → Meridian Navy 2 → Chart Panel, plus `color-mix` lightening
toward white) and by 1px hairline borders. Shadows exist but are vestigial:
ambient washes at 0.03–0.08 alpha under panels and menus, and one heavier
legacy token (`--shadow`, 0 10px 24px rgba(0,0,0,0.38)) that must not spread.
New surfaces must not introduce heavier or more numerous shadows; if a surface
needs separation, give it a hairline and a tonal step.

### Shadow Vocabulary
- **Panel ambience** (`box-shadow: 0 8px 22px rgba(36, 24, 19, 0.035)`): The default panel wash. Barely perceptible; that is the point.
- **Menu float** (`box-shadow: 0 18px 34px rgba(35, 24, 19, 0.08)`): Nav disclosure menus and true overlays only.
- **Feature wash** (`box-shadow: 0 12px 30px rgba(36, 24, 19, 0.04)`): Landing feature panels.

### Named Rules
**The Hairline Rule.** Separation comes from a 1px Hairline border plus a tonal panel step. A shadow may accompany that separation as ambience; it may never be the separation.

## 5. Components

Calibrated and quiet: instrument-like precision — thin borders, exact states,
brass used sparingly for selection and primary action. Every interactive
component ships with default, hover, focus-visible, selected/active, and
disabled treatments; focus is a 2px brass-white outline offset 4px.

### Buttons
- **Shape:** Softly squared (5px radius) for in-flow buttons; full pills (999px) for CTAs and nav actions.
- **Primary:** Sextant Brass fill, Meridian Navy text, 600 weight (10px 18px; CTA pill 11px 22px).
- **Hover / Focus:** Fill steps to Bright Brass; borders shift to brass with a 1px brass ring (`box-shadow: 0 0 0 1px var(--accent)`); focus-visible gets the 2px offset outline. Transitions 150ms ease.
- **Secondary:** Chart Panel fill, 1px Hairline border, Ink text; hover raises border to brass.
- **Disabled:** 0.35 opacity, no ring, `cursor: not-allowed`.

### Chips
- **Tradition chips:** Tradition ink fill, navy text, 3px radius, uppercase 0.72rem at 0.07em tracking. Content-bound per The Tradition Ink Rule.
- **Mode pills / step chips:** Pill outline (1px Hairline border), panel-tone fill, uppercase Archivo label; active step warms border and text to brass.

### Cards / Containers
- **Corner Style:** 7–10px radius (panels 10px, small callouts 7–9px).
- **Background:** Chart Panel lightened via `color-mix` steps (76–92% panel toward white).
- **Shadow Strategy:** Panel ambience only (see Elevation).
- **Border:** Always 1px Hairline or Hairline Soft. Callouts may warm the left edge tone but only ever at 1px.
- **Internal Padding:** 18–24px for callouts and list panels; 40px for primary form panels.
- **Preference:** Hairline-divided editorial lists (lobby menus, thinker entries, rail links) are the default for collections; boxed cards are reserved for form UI and true asides.

### Option Cards (signature)
The quiz answer affordance: full-width grid of circular option badge (30px, panel tone) plus serif option title and muted supporting text, 5px radius, panel fill. Hover draws the brass ring; selection fills the badge brass, tints the card `color-mix(in srgb, var(--accent) 14%, transparent)`, and holds the ring. Selection never auto-advances.

### Navigation
- **Style:** Sticky hairline-bottomed header on a blurred field tint; text links in Archivo-adjacent sizing (0.88rem).
- **States:** Hover/active draw a 1px brass-mixed underline via inset box-shadow — no boxes, no fills. The profile link is the one pill in the header.
- **Mobile:** Disclosure summary pill opening a bordered sheet of grouped hairline lists.

### Progress
6px pill track in panel tone with 1px border; brass fill; width transitions 300ms. Progress states facts ("Question 12 of 39"), never fake precision.

## 6. Do's and Don'ts

### Do:
- **Do** keep Sextant Brass under discipline: action, selection, orientation — roughly ≤10% of any screen.
- **Do** separate surfaces with 1px hairlines and tonal steps; reuse the existing `color-mix` panel steps instead of minting new hexes.
- **Do** cap prose at 56–66ch and keep the serif voice for everything a person reads.
- **Do** ship every interactive state (hover, focus-visible with the 2px offset brass outline, selected, disabled) and a `prefers-reduced-motion` fallback for every animation.
- **Do** prefer hairline-divided lists for collections, and keep navigation reversible — no auto-advance on selection, ever.
- **Do** use the tradition inks only where their tradition is actually named.

### Don't:
- **Don't** resemble a "SaaS dashboard, AI demo, personality-test funnel, therapy app, lecture notes, or dissertation abstract" (PRODUCT.md, verbatim).
- **Don't** use "gradients, neon, glassmorphism, oversized shadows, stacked identical cards, decorative charts, fake precision, or self-discovery language" (PRODUCT.md, verbatim).
- **Don't** add a light theme; the system is dark-only and the print stylesheet is the sole light rendering.
- **Don't** cast structural shadows or grow the legacy `--shadow` token's use; ambience stays ≤0.08 alpha.
- **Don't** use colored side-stripes thicker than 1px, gradient text, or identical card grids.
- **Don't** introduce a fourth typeface, set prose in Archivo, or put confidence/percentile language in UI copy unless methodologically justified.
- **Don't** let tradition colors drift into ambient decoration or generic category coding.
