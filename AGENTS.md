# AGENTS.md

You are working on the **IR Worldview Inventory**.

This is a serious editorial interactive with a thin social/share layer. The
core promise is reflection, self-location, and structured worldview mapping.
The product should feel closer to a Foreign Affairs / Economist / policy-journal
interactive than to a SaaS tool, AI demo, or personality-test product.

## Product principles

1. **Clarity over cleverness.** No fake precision. No confidence language
   unless methodologically justified. No decorative charts that imply more
   rigor than the model has.

2. **Editorial, not vibe-coded.** Strong typography and spacing hierarchy.
   Calm, deliberate interactions. Avoid gradients, neon, glassmorphism,
   oversized shadows, dashboard tropes, and stacked identical cards.

3. **Rigorous but legible.** Results should explain "so what" in plain
   English. Jargon must be defined. Methods must be transparent about
   limitations. The app should openly distinguish modeled traditions from
   under-modeled ones.

4. **Continuous profile, not essentialist box.** Named families and modifiers
   are interpretive summaries of a multidimensional profile, not natural
   kinds. Composite outcomes should be presented as families of nearby
   profiles, not absolute identities.

5. **Respect the user's time.** Navigation must always be reversible. Answer
   selection must never auto-advance. Review before results is required.
   Resume flow should be supported when a draft exists.

6. **Payoff before caveat.** Result and Profile pages must answer the
   user's question before the system explains itself. Trust notes belong
   below the first payoff, not in the hero.

## Methodology guardrails

- Do not present scores as population percentiles unless they actually are.
- Do not add new scored worldview families without corresponding item
  coverage.
- Do not use nationality, citizenship, or culture to alter scoring.
- Strategic culture and national perspective may appear as editorial
  context, not as a scoring adjustment.
- If a feature would make the tool look more rigorous than it is, avoid it.

## Content guardrails

### Scenario design

Avoid the structure where option A is an extreme, B is a sensible
compromise, and C is the opposite extreme. That format mechanically attracts
users to B and weakens discrimination. Options should represent distinct
logics, not intensity levels on one axis. Where useful, use a two-step design:
threshold question first, implementation question second.

### Clarifications

Question clarifications must be collapsed by default, short, and explain
scope or terms only. They must not hint at which answer is more sophisticated.

Bad: "Realists think X, liberals think Y, so consider whether..."
Good: "This asks whether durable rivalry is built into the system or
depends more on the issue and relationship involved."

## Technical guardrails

- Centralize encode/decode logic in one shared library.
- Centralize slug definitions in one source of truth.
- Avoid duplicating worldview labels and keys across files.
- Prefer typed config data over scattered string literals.
- Add graceful invalid-result handling, but fix the generator first.
- Never edit `tmp/` or import from temp files.
- Do not add new dependencies unless explicitly asked.

## Repo conventions for Codex

- Keep scoring and payload formats stable unless explicitly asked to change
  them as a real blocker fix.
- Make the smallest coherent diffs possible per prompt.
- Do not refactor unrelated files without reason.
- Run `npm run lint`, `npm run test`, and `npm run build` after meaningful
  edits. Stop and summarize if any fail.
- When a spec is ambiguous, choose the path that improves trust, clarity,
  maintainability, and editorial quality, in that order.

## Current sprint: bounded V23.2 Worldview Map correction

- Make the exact eight-cell archetype matrix the default English Map view.
  Resolve a baseline only from the exact Foundation payload: one active cell
  for a pure result or two same-row cells for a blend. Keep the normative alias
  beside the selection and never turn it into spatial rank.
- Retain projection version 1 as a secondary continuous view and state plainly
  that it does not encode posture. Preserve valid legacy `layers`, `sel`, and
  `view` links through the `projection` compatibility rule.
- Decision Patterns, Perspective Runs, and reference positions are optional
  contextual overlays, off by default. Exact collisions form accessible
  clusters at their source coordinate; never add random jitter.
- Use the eight exact System A marks. A blend composes the two pure marks under
  the Diptych rules and never receives a new mark. The optional decorative Map
  field may be omitted; if present it stays static, sparse, and non-content.
- Both projections retain a complete semantic list, keyboard access, non-color
  encoding, visible focus, lens-grouped mobile reflow, and static print output.
  Simplified Chinese retains approved behavior and fails closed before any
  unapproved English copy or accessible label can appear.
- Do not change scoring, payloads, archetype resolution, Decision Pattern IDs,
  modules, Current Cases, Tier 1, dependencies, or approved locale manifests.

## End-of-sprint discipline

When a sprint ends, replace the "Current sprint" section above with the next
sprint's bullets, or remove it entirely until the next sprint is defined.
Do not let sprint sections accumulate.
