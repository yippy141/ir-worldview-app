# Futures catalogue surface

Scope: English `/futures`, `/futures/preferences`, `/futures/compare` and `/futures/scenarios/[id]`. Recorded 11 September 2026 for `futures-catalogue-0.2` and `futures-preferences-0.1`.

## Overview

**Mode: Read + Operate.** Readers browse materially different futures, state desired conditions, review an explained shortlist, and separately assess expectations. This extends the established Astrolabe world in root `DESIGN.md`; it introduces no new branding. Root `PRODUCT.md`, `DESIGN.md` and its sidecar remain the authority. The Departure record in `docs/futures/DESIGN_SURFACE.md` and its historical artifacts remain separate.

The collection contains nineteen entries: twelve inherited Life 3.0 scenarios and seven project-authored scenarios. The Departure is one peer entry and the only optional deeper exercise. The first viewport offers the general questionnaire and whole-catalogue browsing, with any-two comparison also available. Completing the main journey never requires Departure.

This record describes inspected source. Existing synthetic measurements record no horizontal overflow for collection, question, result and comparison states at 320, 390, 768 and 1440 CSS pixels. The fresh visual reviewer reported presentation ready and identified two meaning/behavior corrections now present in code: catastrophic loss cannot provide positive institutional support, and embedded consultation links preserve the in-memory exercise through new tabs. The fresh reviewer subsequently returned disposition: ship after both corrections and their readback regression were resolved. Final validation is recorded in CATALOGUE_DELIVERY.md. Screenshot capture, synthetic checks and reviewer observations do not establish human validation or formal accessibility conformance.

## Colors

Use the root navy fields, brass actions and selection, pale primary text, secondary text and tokenized rules. The local surface references existing tokens rather than defining another palette. Feature markers pair visible words with simple shapes; color alone does not communicate a descriptor state.

## Typography

Spectral carries headings, important questions and the lead. Libre Franklin carries controls, body explanations and status labels. The collection title scales from 2.1rem to 4.25rem and has a 19-character measure; player titles use a smaller 2rem to 3.2rem range with a wider measure. Body line height is 1.7. Long reading and questions are capped at 78 characters, with evidence following the primary task.

## Layout

The page is capped at 1120px with fluid side padding. The catalogue is a flat sequence of divided rows: title, attribution and alias on the left; premise, three preview descriptors and actions on the right. Its complete anchor index uses three columns. A collapsed disclosure retains the historical map of the twelve inherited entries and their legacy anchors; the seven additions receive no invented coordinates. Map position never contributes to matching.

At 760px and below, catalogue rows, detail ledgers, result reasons and expectation controls become single-column; the index becomes two columns. Comparison retains two scenario columns while moving the condition label above each pair. At 430px and below, descriptor previews and scenario selectors stack, primary actions fill the width, and comparison names wrap.

The shared global header remains sticky. The comparison header has 110px top clearance below it; anchored sections and focused player headings use a 120px scroll margin. Local question navigation remains in normal flow.

## Elevation & Depth

Flat navy fields, spacing and thin rules organize the reading. Selected options gain a panel background and an inset brass edge. The native reset dialog uses a dark backdrop to identify its modal state. No new raised card system or decorative depth is introduced.

## Shapes

Catalogue and review entries remain open rows rather than boxed cards. Actions and selects have square corners. Brass focus outlines sit outside controls. Feature marks accompany the explicit labels Present, Absent, Variant-dependent, Unspecified and Inapplicable; unresolved states never imply a guarantee.

## Components

- **Catalogue and detail.** All nineteen entries retain stable IDs, original names or project authorship, source status, concrete institutional accounts, objections, unknowns and comparison links. Shared descriptors are independent of prose length and map coordinates. Catastrophic endpoints explicitly mark institutions that do not exist as inapplicable and supply no positive preference support; known conflicts still count.
- **Question unit.** Twelve self-contained questions distinguish personal participation, other people's choices and common rules. Native radios include uncertainty, no stated preference and neither supplied position. Scope disclosures start collapsed. Selection never advances; Back and Next are separate. A non-negotiable requires a direct checkbox confirmation after a directional choice.
- **Review and editing.** All twelve answers must be complete and explicitly submitted from review before matching. Review exposes every answer and confirmed constraint. Changing a choice or constraint withdraws the previous shortlist and announces that review and submission are required again. Other answers and separate expectations remain. Changing the choice clears that question's constraint confirmation.
- **Preference result.** Plain-language nearby futures and their reasons precede the methods disclosure. Deterministic editorial matching weights active domains equally, preserves unresolved evidence, excludes confirmed conflicts, requires minimum known coverage and positive support, and retains all ties at the third qualifying entry. Qualified non-results remain possible. Every entry can be inspected against the stated conditions. Internal ordering values are not shown as percentages, an identity score or a validated measure.
- **Any-two comparison.** Two native selects control a semantic comparison table with institutional accounts, descriptor differences and open questions. Equal selections request two different entries; invalid incoming IDs receive recovery copy. Standalone comparison uses ordinary links. Comparison embedded in the preference result opens scenario and source-consultation links in new tabs, with a visible explanation, to keep the current exercise available. Result scenario links do the same.
- **Expectations.** The optional task offers all nineteen entries independently of the shortlist. Its explicit horizon is the end of 2100, without assuming superintelligence occurs. Plausible, unlikely, unsure and unassessed remain distinct. Readback places these judgments beside preferences without changing matching or calculating probabilities.
- **State and recovery.** Responses live only in component memory; leaving or refreshing clears them. They are not stored in Profile, put in a share URL or transferred to AI Governance. Step changes focus and reveal the new heading. Visible focus, native radio/select behavior, status announcements and reduced-motion overrides remain part of the surface. Reset uses a native modal dialog, initially focuses “Keep my answers,” supports Escape, and returns focus to its trigger on cancellation.

## Do's and Don'ts

- **Do** preserve the whole-catalogue entrance, flat reading hierarchy, shared descriptors and explicit distinction between desired conditions and expectations.
- **Do** preserve the optional Departure journey and its historical documentation without promoting its internal decisions into general answers.
- **Don't** treat unspecified conditions, institutional absence after catastrophe, map proximity or exercise completion as positive preference evidence.
- **Don't** infer a future identity, forecast, probability or AI Governance category from this editorial comparison.

Implementation references: `app/futures/page.tsx`, the three related route directories, `components/futures/catalogue.module.css`, `catalogue-content.tsx`, `preference-player.tsx`, `comparison-explorer.tsx`, and `lib/futures/catalogue/`, `preferences.ts`, `preference-state.ts`, `matching.ts`. Synthetic coverage is specified in `e2e/futures-catalogue.spec.ts`; captured evidence is in `artifacts/futures-catalogue/`. This documentation pass ran no tests and performed no independent browser inspection.
