# IR + AI V13 acceptance checklist

## Profile payoff
- [ ] If a user has 2+ layers, Profile leads with an integrated pattern, not only Foundation family.
- [ ] Foundation family appears as closest modeled baseline / supporting cue.
- [ ] Above the fold has one headline, one short synthesis paragraph, one dominant visual, max three chips/facts.
- [ ] Stable thread, biggest shift, and open tension appear once each, not repeatedly under different names.
- [ ] Evidence, appendix, completed overlays, and full module summaries are below the fold and collapsed where appropriate.
- [ ] Overlay movement visual is labeled as directional/editorial, not re-measurement.
- [ ] Mobile around 390px is readable without overlapping cards or clipped text.

## Method and trust
- [ ] Code/tests and Methods agree on second-choice weight.
- [ ] AI result hero no longer says “Mostly settled,” “Hybrid zone,” “Clear lead,” or shows clarity as a main signal.
- [ ] Result surfaces use closest modeled fit / bounded model language.
- [ ] Methods explains module overlays as directional/editorial transforms.
- [ ] Any remaining precision-like display is demoted or contextualized.

## Question hardening lite
- [ ] `plans/V13_QUESTION_HARDENING_AUDIT.md` exists.
- [ ] Dimensions/axes have forward/reverse/tradeoff/scenario balance noted.
- [ ] 6–10 high-risk items are flagged.
- [ ] No more than 5 targeted wording changes are made in V13.
- [ ] Deferred question backlog is documented.

## AI Atlas / Field Guide
- [ ] AI Atlas cards are clickable.
- [ ] Each AI archetype has a useful detail page or detail surface.
- [ ] Detail pages preserve existing archetype and axis names.
- [ ] Detail pages include what the archetype prioritizes, nearby archetype, core disagreement, current debates to watch, and readings.
- [ ] AI Field Guide links to Atlas and details.
- [ ] No new scored AI archetypes or scoring logic were added.
- [ ] Optional Futures Mirror, if added, is explicitly non-scored.

## Privacy and data
- [ ] Product works without research opt-in.
- [ ] Research opt-in is unchecked by default.
- [ ] Raw answer storage is described as pseudonymous/de-identified, not strictly anonymous.
- [ ] No raw answers go to third-party analytics.
- [ ] Optional contact info is stored separately from responses.
- [ ] Privacy/data-use note is visible before collection is activated.
- [ ] Deletion path exists.
- [ ] API routes are disabled safely if env vars are missing.
- [ ] Every stored session includes instrument/scoring/consent version.

## Release hygiene
- [ ] `npm run lint` passes.
- [ ] `npm run test` passes.
- [ ] `npm run build` passes.
- [ ] `npx tsc --noEmit` was run once.
- [ ] Type errors are fixed if small-scope or documented if large-scope.
- [ ] README/About text matches current product.
- [ ] Obvious temp/backup artifacts are not committed.
- [ ] Vercel preview URL is tied to the V13 branch/commit.

## Beta readiness
- [ ] 10–20 person beta invite copy is drafted.
- [ ] Feedback questions are ready.
- [ ] Research opt-in has been tested both accepted and declined.
- [ ] At least one full user path is tested on mobile.
- [ ] At least one shared result link opens in a fresh browser.
