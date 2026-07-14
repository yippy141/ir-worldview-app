---
target: V17 section landings + worldview profile pages
total_score: 29
p0_count: 0
p1_count: 3
timestamp: 2026-07-14T00-00-40Z
slug: nents-worldview-profile-worldview-profile-page-tsx
---
Method: dual-agent (A: general-purpose a9e3329284ab806b8 · B: Explore)

Target: V17 section landings + Worldview Profile learning pages (components/worldview-profile/worldview-profile-page.tsx and sibling surfaces).

# Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Perspectives mobile tap gives no visible feedback (brief below fold) |
| 2 | Match System / Real World | 3 | "Security theatre" collides with the idiom; jargon front-loading on Modules hero |
| 3 | User Control and Freedom | 3 | Hover steals selection on Perspectives role index |
| 4 | Consistency and Standards | 2 | Three kicker systems; steel vs brass links; two master-detail patterns for one job |
| 5 | Error Prevention | 3 | Case-strip anchors over-promise |
| 6 | Recognition Rather Than Recall | 3 | "Seat"/"run" undefined on foundation result card (defined on module result) |
| 7 | Flexibility and Efficiency | 3 | 9-section profile page, no in-page nav |
| 8 | Aesthetic and Minimalist Design | 3 | Kicker saturation; AI landing ~14 links |
| 9 | Error Recovery | 3 | Zero-case pattern silently loses its case section |
| 10 | Help and Documentation | 3 | Method band + glosses are contextual and strong |
| **Total** | | **29/40** | **Good** |

# Anti-Patterns Verdict
LLM: not AI-slop — copy depth (sources, disputes, "resembles the logic of"), hairline-list discipline, and progressive disclosure are well above the bar. One surviving tell: uppercase kicker above every section of the profile page (11 on one page) plus a third kicker style minted in three module CSS files, against DESIGN.md's Quiet Kicker Rule.
Detector: 61 advisory findings — 57 design-system-font-size (bulk match the app-wide fine-grained rem vocabulary in globals.css; ~10 are genuinely novel steps), 4 design-system-color (3 confirmed mirrors of WORLD_STAGE_SCENE_COLORS; rgba(101,119,142,0.24) matches the homepage stage graticule value — continuity, not drift). Clean files: all page TSX + focus-theatres + perspective-picker.
Browser overlays: skipped — no browser automation exposed this session.

# Priority Issues
- [P1] Hover-select steals control on Perspectives role index (onPointerEnter on role=tab; mobile dead-tap). Fix: remove pointerenter selection; scroll brief into view on mobile click. → harden
- [P1] Profile hero "Notices first" wired to cardDrivers[0] (scoring rationale, duplicated verbatim in the fingerprint aside). Fix: use detailDrivers[0]; keep chips only in aside. → clarify/polish
- [P1] Kicker saturation + third (mono) kicker system defined 3×. Fix: serif headings carry sections; ≤2 eyebrows per page; retire mono page-kickers (mono stays for stage captions/meta readouts). → typeset/distill
- [P2] SectionStage: aria-hidden SVG with no semantic parity for node anchors; mobile order puts ornament before task (order:-1). Fix: sr-only anchor list from section-stages labels; drop order:-1; hide decorative band on small viewports where it precedes the task. → adapt
- [P2] Case-strip anchors all point at one section while only the primary case renders fully. Fix: per-case anchors. → polish

# Persona Red Flags
- Alex: AI landing sells one decision twice (hero CTA + mode rows → same quiz); no in-page nav on 9-section profile page. Credit: Home/End/Arrow roving tabindex; deep seat links with reasons.
- Jordan: "SECURITY THEATRE" kicker reads as the fake-security idiom; share-link arrival on profile page gets no "how you get one" until the last band; Perspectives mobile dead-tap.
- Sam: Perspectives tablist is APG-correct (credit); stage node info has no text equivalent (parity fail); aria-label on plain div "Three signals" not reliably exposed; moreCases lacks list semantics.

# Minor Observations
- ~10 inline style={{}} props in worldview-profile-page.tsx beside its own module.css; `${styles.sectionIntro}` no-op literal.
- Roadmap summary hint vanishes when open instead of flipping to "Close the list".
- Case coverage lopsided (5 readings for two patterns, 1 for four) — visible thinness on some heroes.
- Steel-blue case links vs brass link vocabulary — undocumented tone split.
- module-result.tsx hardcodes Georgia serif (pre-existing).
- "Advanced" ↔ internal `analyst` naming trap; Twelve Trajectories count unguarded by tests.
- Stage crossfade 700ms vs 150ms UI eases — two tempos.

# Questions
1. Why does the profile page never show *you* (saved match date, nearest alternative)?
2. Why is the map inert exactly on the page about seats (Perspectives), when Focus Areas already has the wiring?
3. Could the profile page hold structure with headings and hairlines alone — the more confident Economist move?
