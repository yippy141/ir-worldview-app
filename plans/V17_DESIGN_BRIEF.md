# V17 World Stage — Design Brief

Confirmed 2026-07-13 via `/impeccable shape`. Scope: unify and polish the V17
World Stage system already on `feature/v17-world-stage`, production-ready to
close the sprint.

## 1. Feature Summary

The World Stage is V17's unifying visual system: a full-viewport editorial map
homepage that orients readers across the inventory's six entry lenses, plus the
surfaces it links out to — the worldview map v2 explorer (`/explore/atlas`),
the scene layer with its editorial-demo caveats, and the new `/about`
overview. This brief codifies the system already on the branch and drives a
production-ready coherence pass so V17 can close.

## 2. Primary User Action

**Orient, then choose freely.** The six lenses (Foundation, Focus areas,
Perspective runs, Worldview map, AI futures, Profile) are peers. Success is a
first-time visitor understanding the shape of the inventory within seconds and
entering through whichever door fits their intent — with no lens artificially
privileged and no auto-advance anywhere.

## 3. Design Direction

- **Color strategy:** Restrained overall (product register default), with one
  earned exception: the homepage stage runs **Committed** — Meridian Navy *is*
  the surface, and brass appears only as instrument marks (active lens, route
  link, node/route symbols). DESIGN.md's Brass Discipline Rule at stage scale.
- **Scene sentence:** A reader alone at night, screen the only light in the
  room, a policy journal beside them, deciding where to test their own
  judgment — a chart room, not a control room. Dark is forced; the system is
  already dark-only.
- **Anchor references:** (1) FT visual-journalism cartography — muted
  geography, hairline routes, editorial captions doing the explaining; (2) The
  Economist's Graphic Detail — figures that state their limits in the caption;
  (3) the astrolabe itself (DESIGN.md's north star) — engraved scales, one
  brass pointer, nothing decorative.

## 4. Scope

Production-ready, ship-this-sprint. Breadth: four surfaces (homepage,
worldview map v2, scene layer, /about). Interactivity: shipped-quality — full
states, keyboard, 390px, reduced motion, final copy. Verified against
`npm run lint`, `npm run test`, `npx tsc --noEmit`, `npm run build`, and
browser screenshots at 390/768/1280 before close.

## 5. Layout Strategy

- **Homepage:** Stage topology — the map is the field, not a widget.
  Hierarchy: menu region (h1 + six indexed lenses) primary; detail aside
  (active lens description + route link) secondary; meta (current lens +
  qualification) and footer (secondary nav + legend) tertiary. The numbered
  menu is a real ordered sequence (01–06 with "N / 06" in the detail) — one of
  the few places numbering carries meaning; keep it, and keep it the only one.
- **Worldview map v2:** Two-representation explorer — the SVG map and its
  semantic list are parity views of the same data, with detail card and layer
  controls subordinate to the map itself.
- **Scene layer:** Scenes change the map's annotation (nodes + routes), never
  the page structure. The qualification line ("Illustrative editorial scene ·
  not live intelligence") is always visible while a scene renders — payoff
  first, but caveat never hidden.
- **/about:** Single-measure editorial article (≤66ch) with the three entry
  paths; no card grid, hairline-divided list per DESIGN.md.

## 6. Key States

- **Homepage default:** idle rotation cycling the six lenses;
  `data-sequence="running"`.
- **Paused:** any pointer/focus interaction pauses rotation permanently for
  the session — user control beats choreography.
- **Reduced motion:** rotation never starts (server snapshot defaults to
  reduced — correct); scene changes crossfade or cut, no camera flights.
- **Map unavailable** (no Mapbox token, load failure, offline): the SVG
  fallback map renders as a first-class alternative, not a degraded apology —
  same scene annotations, same legend accuracy.
- **390px:** menu and detail stack; map remains legible backdrop, never traps
  scroll; touch targets ≥44px.
- **Keyboard:** focus traverses the menu in order, focus selects the lens,
  visible brass focus ring throughout; map is skippable.
- **Worldview map v2:** no-profile/empty state teaches the map; selection
  state; list-parity view carries every node the map shows (release
  acceptance requires this).
- **/about:** draft-exists vs. fresh visitor (resume CTA states via
  `FoundationHeroActions`).

## 7. Interaction Model

Hover/focus on a lens previews it (map scene + detail aside update,
~150–250ms state ease); click navigates to the lens's route. Idle rotation
advances every interval until first interaction, then stays paused. The route
link in the detail aside is the explicit "go" affordance. On the worldview
map, markers are focusable and mirror into the semantic list anchors. All
navigation reversible; nothing auto-advances; selection ≠ commitment anywhere.

## 8. Content Requirements

Lens labels/lenses/descriptions/actions live in `lib/world-stage/scenes.ts`
(typed, validated — keep it the single source). Required microcopy: per-scene
qualification lines (must state "editorial demo" honestly, no current-affairs
claims), legend definitions ("Nodes: editorial prompts / Routes: thematic
links"), fallback-map notice if any, empty/no-profile copy on map v2,
resume-draft copy on /about. Ranges are fixed and small: 6 menu items, 3
scenes, single-digit nodes/routes per scene. Media: Mapbox GL scene +
hand-authored SVG fallback; no raster assets needed.

## 9. Recommended References

`polish.md` (the coherence pass itself), `adapt.md` (390px stage layout),
`animate.md` (scene transitions, idle rotation easing, reduced-motion parity),
`clarify.md` (qualification/legend/empty-state copy), `audit.md` (a11y +
Mapbox performance weight on the entry route).

## 10. Resolved Decisions

- **Map layer:** Mapbox ships as primary with the SVG fallback covering
  missing token, load failure, and reduced-capability clients. Production
  token and billing need to be provisioned before merge; the fallback is the
  no-token path, not a flag. (Resolves the tension with the sprint's
  "do not add a map library" bullet — the bullet is superseded by this
  decision; update AGENTS.md's sprint section at close per end-of-sprint
  discipline.)
