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

## Current sprint: bounded V23.1 content and ontology correction

- Publish the revised English archetype content only as qualified `partial`
  copy. The owner authorizes this AI-assisted English copy for editorial beta
  use; human editorial review remains pending. Do not represent the 104
  sentences as individually human-reviewed, externally expert-reviewed, or
  validated. Preserve claim IDs, source links, and version alignment.
- The first sigil geometry remains blocked as rejected design history. Ship
  only the eight exact System A marks in the supplied typed manifest under the
  owner-selected editorial-beta decision: 112px hero, 48px directory, and
  code-only below 32px. Blends compose pure marks under the Diptych/Hallmark
  rules and never receive a new mark. Treat the artwork as contemporary
  editorial illustration, not an authentic historical emblem or universal
  cultural clearance.
- Add the English archetype directory, expand the eight stable detail routes,
  and recompose Explore into the contracted nine-section field guide. Treat
  modeled traditions, Decision Patterns, references, and Focus Areas as
  supporting or contextual layers beside the headline Foundation reading.
- Simplified Chinese keeps its explicit status surfaces and existing approved
  Map, Decision Pattern, and reference behavior. No English long-form content
  or accessible label may leak into an unapproved Chinese route.
- This sprint does not change the Map, scoring, items, calibration, payloads,
  stores, modules, Tier 1, dependencies, or Chinese approved-route manifests.

## End-of-sprint discipline

When a sprint ends, replace the "Current sprint" section above with the next
sprint's bullets, or remove it entirely until the next sprint is defined.
Do not let sprint sections accumulate.
