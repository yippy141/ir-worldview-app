# IR + AI V12 — Non-goals and deferred list

## Hard non-goals for V12

Do not do these in this sprint:

- no new scored IR families
- no new live IR modules
- no new scored AI module
- no scoring rewrite
- no payload rewrite unless a blocker demands the smallest possible fix
- no compare-page overhaul
- no homepage rewrite
- no crisis simulation / crisis lab
- no dynamic discourse crawler or news scraper
- no auto-updating bibliography system
- no Tegmark / Life 3.0 futures inside the scored AI compass
- no broad rewrite of the entire question bank
- no giant CSS refactor outside touched surfaces

## Allowed but only if clearly isolated

- optional stub link for `/ai/futures`, but non-scored only
- manual watchlist / discourse rail backed by a typed content file
- small version marker in footer or methods page
- small About / README / repo packaging cleanup

## Known deferred items to keep visible

These should remain visible even if not fully fixed in V12:

- exact second-choice weighting rationale
- longer-term sensitivity review of module overlay transforms
- longer-term review of AI archetype balance if real response distributions look skewed
- fuller treatment of under-modeled AI political economy / labor / environmental perspectives
- broader regional or functional IR modules
- more sophisticated share-card polish
- optional AI futures mirror

## Release discipline note

If `npx tsc --noEmit` still fails after Prompt A and the error scope is broad, do not hide that fact.
Document it clearly and avoid presenting the build as evaluator-ready beyond friendly pilot testing.
