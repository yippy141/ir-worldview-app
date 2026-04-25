# V8 Execution Plan

## Sprint goal

Coherence + payoff + trust cleanup.

## Non-goals

- no new live modules
- no broad question-bank rewrite
- no scoring rewrite
- no standalone AI product

## Current execution order

1. Preflight
2. Prompt 0
3. Prompt 1
4. Prompt 3
5. Prompt 4A
6. Prompt 5
7. Prompt 6
8. Prompt 7
9. Optional Prompt 4B
10. Mini beta

## Files likely to be touched

- homepage / lobby files
- shared layout / nav files
- profile top-level files
- result page files
- copy-heavy route files
- README / .gitignore / AGENTS.md if needed

## Risks to watch

- duplicate explanation UI
- accidental question wording drift
- app code importing from tmp/
- trust notes becoming too dominant
- reintroducing pseudo-precision in results

## Manual QA checklist

- homepage start path is obvious
- Foundation feels complete on its own
- Modules and AI feel optional but meaningful
- Profile top is clear
- share links still work
- result pages load directly from URL
- home/modules/AI/profile/method wording does not contradict itself

## Commit rhythm

Commit after every successful step with a clear message.
