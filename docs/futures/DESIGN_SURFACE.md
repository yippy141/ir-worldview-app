# The Departure surface

Scope: `/futures/departure` · `departure-0.1-draft` · recorded 11 September 2026.

## Overview

**Mode: Read, with an explicit decision task.** Readers examine a fictional invitation to leave Earth, decide which conditions matter, and review a reading tied to their actual choices. This surface inherits the Astrolabe identity in root `DESIGN.md`; it does not establish a replacement design system.

Personal framing is the owner-selected default. The equally available policy framing concerns a fictional adult, uses the same choices, and carries equal weight. Neither framing requests names or personal history.

## Typography

Preserve Spectral for the title, leading question and important prompts, and Libre Franklin for controls and supporting explanation. The opening title is larger than subsequent comparison headings. Task labels precede question text; scope clarifications remain collapsed by default.

## Layout

One dominant reading column sits beside a supporting relationship diagram on wide screens, within a page capped at 1140px. The opening uses a near-balanced split; comparisons give the questions more width. At 800px and below, the diagram follows the reading or questions in a single column and loses its sticky positioning. At 520px and below, actions stack, progress becomes a two-column index, and review records and shelf entries become single-column rows.

The diagram represents Earth, outward passage, return/contact terms and reserved authority. Its SVG title, description and caption carry the meaning without relying on color. Distances, travel times and probabilities are not encoded. Comparison B changes the return relation to a promise; comparison C labels the selected successor-policy package without silently granting monitoring or intervention powers.

## Components

- Preserve navy fields, brass actions and selection, steel Earth lines, tokenized rules and flat, square option rows. Use spacing and headings for the reading and continuation; reserve bordered choices for actual decisions.
- Keep the three explicit comparisons: A, the invitation; B, revised return protections; C, successor-AI authority. Trusted preference, credibility and decisions under unverified claims remain separate tasks.
- Native radio selection never advances. Completion unlocks the next comparison; disabled continuation has an adjacent explanation. All thirteen choices must reach review before explicit submission creates a reading.
- Back navigation preserves answers. Changing an existing answer clears every later response in question order, including later questions in that comparison, and withdraws the previous reading. Returning to the opening preserves the in-memory draft.
- Clearing choices, or changing framing after answers exist, requires inline confirmation. Focus moves to “Keep my draft”; cancellation returns focus to the initiating control. Step changes focus the new heading. Keep visible keyboard focus, non-color selected states and the reduced-motion override.
- Put the condition-specific reading before its limits. Keep all decisions inspectable, with an editable review path. The comparison shelf and source ledger follow the player and remain accessible throughout the journey. Shelf entries are editorial comparisons, never assigned matches.

## Known limits

This English-only, AI-assisted editorial draft has `noindex, nofollow` metadata. Answers live in component memory and are lost on leaving or reloading; submission neither saves nor sends them. It produces no score, validated match, forecast or change to Foundation or AI Governance results. JavaScript is required for the decision journey; the shelf and sources remain readable without it. Print styles simplify the current view, not the whole journey into an exported record.

Implementation: `app/futures/departure/page.tsx`, `components/futures/departure-player.tsx`, `components/futures/departure-diagram.tsx`, `components/futures/departure.module.css`, and `lib/futures/departure.ts`. Delivery scope and validation evidence remain in `DEPARTURE_V01_DELIVERY.md` and `VALIDATION.md`.
