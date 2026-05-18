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

## Current sprint: V14

- Current sprint is **V14 prelaunch payoff, trust, and AI-first wedge**.
- Typecheck is a hard gate: `npx tsc --noEmit` must pass, `typescript.ignoreBuildErrors` must be removed or false, and `npm run lint`, `npm run test`, and `npm run build` must pass after meaningful edits.
- Result-card payoff comes first: use one editorial visual spec for IR, AI, and Profile cards, with muted chips, a restrained accent, one plain-English summary, one non-obvious finding, and a clean share action.
- `/ai` must work as a standalone AI Governance Compass entry point, with IR framed as optional depth rather than a prerequisite.
- Landing page rewrite should lead with the quiz promise and primary CTA, then move product architecture below the fold with a sample result preview.
- Quiz friction work should default first-time users to Standard mode, add section markers, and restore a preliminary midpoint preview after section 1 without showing a family label.
- No scoring rewrites, no payload rewrites, no taxonomy changes, and no new modules this sprint.
- Research storage remains privacy-first: opt-in unchecked by default, no raw answers to third-party analytics, visible deletion path, safe failure without env vars, and smallest coherent diffs throughout.

## End-of-sprint discipline

When V14 ends, replace the "Current sprint" section above with the next
sprint's bullets, or remove it entirely until the next sprint is defined.
Do not let sprint sections accumulate.
