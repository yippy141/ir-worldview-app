# Independent assessment of the September 23 packet

Reviewed against local `a3e8d39` on 29 September. Source inspection and narrow reproductions are distinguished below from proposed behavior. The packet contains useful diagnoses and reusable implementation work, but is not ready for blanket application.

## 1. Keep the trust goals; redesign PR-A's ownership inference

**Verified in current code:** `components/profile/foundation-profile-sync.tsx` consumes a completion intent and calls `saveFoundationSnapshot`, then renders nothing. A real completion receives no save-success/failure feedback from this component. Opening a link without an intent does not save it. Preserve that behavior.

**Verified in the patch:** `browserKnowsFoundationResult` checks only payload equality in the Profile and its history. Its comment claims this proves local completion, but the check does not examine provenance or completion evidence. Older saved-on-view records and identical score payloads undermine that inference. A device record is not proof of who answered. This also conflicts with the recovered owner correction.

`?via=share` describes a URL, not a person's identity. PR-A's server-rendered “someone else's result” statement is therefore too strong; it can appear to the owner before hydration. The notice can hide after a local match while ShareActions still uses the URL flag and continues to treat the reader as a recipient. Unmarked recipient links have the reverse mismatch: a softer notice but owner-style share text. Use a consistent view-state contract and neutral shared-link wording.

The patch's module-level ownership Map can retain a “saved” state across client navigation after local data is cleared. Its `storage` event subscription alone does not notify the same document of its own writes. Test deletion, navigation, repeat completion, and both storage APIs failing. If session storage blocks the intent write, the result sync cannot distinguish that completion from a link; the proposed save-failure notice does not cover that path.

Do not delete the legacy helper and its tests merely as cleanup. Its dedup/comparison distinction was explicitly corrected by the owner. Retain it until replacement coverage proves all those guarantees, even if production callers have disappeared.

## 2. Accept the tie diagnosis; revise PR-C's definition and copy

**Reproduced using the live completion call shape:** all 1s, all 4s, and all 7s across the fourteen core items, scored with `generateResult(answers, "analyst", "core")`, each produce seven scores of 4, four family scores of 0, and `Kairos–Grotian`. The tie is assigned Realism then Institutionalism by stable enumeration order. This warrants a display correction without changing scoring or payloads.

Claude proposes using the gap from first to third family to classify a result, then saying all seven dimensions came out level. Those are different conditions. A broad family tie can coexist with distinct dimensional positions. Reusing the calibrated top-two threshold for a top-three test also needs justification. Separate exact flat vectors, exact multiway ties, broad low separation, and ordinary two-way close results. Do not imply a validated new classification.

**Counterexample reproduced:** `syntheticAnswers(4, "core")` has a first-to-third gap of 0.25, below 0.3675, but institutions scores 4.5, domestic politics 3.5, and restraint 2.5. The proposed predicate would therefore display a false all-dimensions-level explanation for this fixture.

The exemplar offers five follow-ups, while the implementation plan correctly notes that targeted follow-ups presuppose two meaningful leaders. Do not choose a targeted pair from an arbitrary tie. Use the existing general extension with its actual count. For a broad tie, suitable draft copy is: “These answers do not put one tradition clearly ahead. The dimension scores below show where they differ.” An exact-flat explanation may explicitly say all dimensions scored at the midpoint; it cannot infer why the person answered that way.

The count of 823,542 additional patterns is mathematically consistent with seven independent reverse-coded pairs (`7^7 - 1`), but is not a prevalence estimate. Avoid presenting it as evidence about real respondents. Current core calibration's top-two threshold is 0.3675. Preserve issued results and all supported forms.

## 3. Keep the copy ratchet idea; reject mechanical truth suppression

PR-B's existing-finding fingerprints and per-file counts are useful for preventing new copy problems without a wholesale rewrite. Its policy layer needs substantial revision:

- “One limit per screen,” banning model-subject sentences, and prohibiting storage/validation sentences would obstruct Method and truthful persistence notices. Keep relevant limits near the action and full methodological disclosure below the payoff.
- Agree-if/disagree-if explainers conflict with AGENTS.md's scope-and-terms-only clarifications and can cue answers. Do not adopt them in the current bank.
- The locked `explainer-changes-item` rule infers semantic drift from four new word stems. This is a review heuristic, not a reliable failing gate. The internal-label rule scans source text, not rendered dataflow. Catalogue regexes can also flag legitimate navigation such as “look up your result.” Trial these as advisory rules and document false positives first.
- Ratcheting `frozen` copy can pressure a maintenance edit to alter administered wording. Exempt version-frozen instruments from prose cleanup; handle substantive item changes as a versioned methodology task.
- Require baseline changes and `--accept` exceptions to be reviewable. A baseline generated on an already-damaged tree merely institutionalizes its defects. Do not make `copy:ratchet` a universal gate until its scripts and baseline actually exist.

Keep one authoritative editorial guide. A separate VOICE.md should supplement it only if responsibilities are explicit; avoid two competing constitutions.

## 4. Treat exemplars as drafts, not accepted product claims

Several rewrites are clearer, particularly third-person catalogue descriptions and concrete module introductions. Others overreach. “Where you part company with most realists” requires population or literature support the scores do not supply. “A result ... can flip with one answer” needs a demonstrated sensitivity condition. “Five follow-up questions” conflicts with the broad-tie pathway above. Literal fourteen-answer language is wrong for extended results. Historical anecdotes require source checking before publication. Keep the original examples and add reviewed, state-conditional after-passages in each implementation sprint.

## 5. Accept the Perspective Runs finding as a separate trust fix

**Verified:** `lib/perspectives/scoring.ts` falls back to `stabilityOrder.slice(0, 1)` when no dimension meets its stability threshold. It also includes dimensions with zero scenario coverage among zero-delta candidates, and clamping can make an outward signal appear unchanged at a scale boundary. Report untested dimensions, supported stability, and boundary-limited movement separately. This touches result derivation; specify compatibility and tests before changing it. Do not silently change scored values in a layout sprint.

## 6. Move security ahead of cosmetic work

The local manifest pins Next.js 16.2.11. The [official AVIF advisory](https://github.com/vercel/next.js/security/advisories/GHSA-2xp9-vwfh-vxw4) confirms a fix at 16.3.3. A newer [Node ImageResponse advisory](https://github.com/vercel/next.js/security/advisories/GHSA-vcvr-r3jv-pc5j), published September 22, affects versions from 16.2.0 below 16.3.6 when attacker-controlled values reach SVG content, attributes, or styles. The app has a Node `next/og` route in `app/api/card/route.tsx`; that identifies a review target, not proof of exploitability. Validate its input path and choose a currently patched compatible release. Claude's audit counts are historical, not fresh results.

Do not blindly run `npm audit fix` or remove impeccable based only on lack of a script reference. Review the actual dependency diff and owner/tooling use. Keep this an isolated maintenance change.

## 7. Revise the execution and design advice

The packet's “HEAD's parent is origin/main” check is wrong for a clean worktree at main and for a legitimate multi-commit branch. Record the fetched base, merge-base, and divergence instead; never hard-reset a checkout to make the check pass.

A 390px-wide “everything above the fold” requirement omits viewport height, text zoom, localization, and accessibility. Define a primary reading/action order, then inspect actual viewports without shrinking text to meet an arbitrary fold. Preserve the current homepage until there is evidence for changing it.

Parallax / 格局 and the SVGs are exploratory. The geometry and perspective concept may suit the product, but the Chinese name and deterministic tagline need audience testing and a naming decision. Name availability was not researched. A rename, blanket copy rollout, and bank v3 are deferred. None is a prerequisite for repairing trust.
