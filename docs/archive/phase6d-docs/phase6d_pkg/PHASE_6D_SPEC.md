# Phase 6D — So-What Payoff, Shareable Profile, and Compare Layer

## Goal

Move the product from "interesting private result" to "interpretable, shareable, and comparable" without adding new modules or simulation features.

This phase should make the product feel more useful in three ways:

1. clearer practical meaning (`so what`)
2. easier exploration of patterns and neighbors
3. actual friend-to-friend comparison without a backend

## What this phase should accomplish

### 1. Sharpen visible result language

Across Foundation, Module, Profile, and Atlas detail pages:
- reduce memo-like phrasing
- reduce AI-coded wording such as `X matters`, `you think X matters`, `nearest-fit shorthand`, `case by case`
- make summaries sound more natural, direct, and human
- add one explicit `So what this usually means` paragraph block where appropriate

The visible question every result surface should answer is:

**What does this pattern usually mean in practice, and what would it make you more or less likely to emphasize?**

### 2. Improve Atlas clarity

The Atlas cards should remain brief executive summaries.
The Atlas detail pages should now become genuinely useful landing pages.

Each Atlas detail page should have:
- a clean top summary with no repeated first-screen text
- one stronger visual fingerprint with clearer contrast
- `What this usually emphasizes`
- `What this often underestimates`
- `How this often shifts in Security`
- `How this often shifts in Technology`
- `Nearby patterns`
- `Questions to pressure-test`

### 3. Create a shareable integrated profile payload

The current Profile is still too tied to local device state.
This phase should make it possible to share a completed integrated profile.

Implement a lightweight share format that serializes:
- Foundation snapshot
- completed module snapshots
- integrated profile state
- nearest Atlas pattern IDs if useful

This should support:
- `Copy share link`
- opening a shared profile on another device

Do **not** include raw answer histories if not necessary.
Prefer sharing result state, not the full answer log.

### 4. Add a compare page

Implement a compare surface for two shared profiles.

This should not be a social network or database.
It should simply compare two encoded profiles side by side.

Minimum viable compare page should show:
- each person’s one-line profile summary
- Foundation spine comparison
- biggest Security difference
- biggest Technology difference
- shared stable trait
- biggest disagreement / divergence
- nearest Atlas pattern and neighbors for each person

Possible route structure:
- `/compare?left=<payload>&right=<payload>`

If needed, also support a simple input UI where a user can paste a friend link.

### 5. Light visual refinement

Do not redesign the whole site.
But improve the perceived payoff by:
- darkening / strengthening fingerprint contrast
- reducing repeated small boxes
- making the main comparison or fingerprint visual do more work
- keeping the palette restrained

Important:
- do **not** add rainbow category colors
- do **not** make this look like a flashy dashboard
- use stronger contrast and a small number of accents only if it improves readability

## Scope

### In scope
- Atlas wording pass for visible surfaces
- Atlas detail-page improvement
- stronger `so what` blocks on result surfaces
- shareable integrated profile payload
- compare page
- modest visual refinement tied to clarity
- tests for share/compare payload integrity

### Out of scope
- new modules
- crisis lab / simulation
- percentiles / rarity / popularity
- backend storage
- public user accounts
- large redesign of Explore/Methods/References
- repo-wide language sweep beyond touched surfaces

## Content rules

### Tone rules
- write in plain but serious language
- prefer `you usually...`, `you tend to...`, `you are more likely to...`, `you often start with...`
- avoid `X matters` as a recurring crutch
- avoid stacking multiple hedges in one sentence
- avoid taxonomy-first phrasing on top surfaces
- every visible summary should be understandable by a smart layperson in one read

### Atlas card rule
Each Atlas card must be readable in about 5 seconds.
That means:
- one sentence summary
- 2 to 3 short driver tags
- one short pressure note
- no memo paragraph on the card

### Atlas detail rule
Each detail page must add real value beyond the card.
The first screen should not repeat the same summary twice.

### `So what` rule
Every major result surface should include one short block that translates the pattern into practical implications.
Examples:
- what kinds of arguments this user is more likely to find persuasive
- what kinds of policy instincts tend to follow
- what the pattern might miss or underweight

## Suggested implementation shape

### New or likely files
- `lib/profile-share.ts` (new)
- `app/profile/share/[payload]/page.tsx` or similar (new)
- `app/compare/page.tsx` (new)
- `components/profile/profile-compare.tsx` (new)
- `components/atlas/atlas-fingerprint.tsx` (update)
- `app/explore/atlas/[id]/page.tsx` (update)
- `lib/atlas-lite.ts` (update)
- `lib/narrative/foundation.ts` (update)
- `lib/narrative/profile.ts` (update)
- `components/profile/profile-dashboard.tsx` (update)
- `app/results/[payload]/page.tsx` (update)
- tests for profile-share / compare / copy guards

### Share model guidance
Keep the payload small and deterministic.
Avoid backend dependencies.
Prefer a read-only shared profile view generated from encoded result state.
If malformed, fail safely and visibly.

### Compare model guidance
The compare page should answer:
- where are these two people similar?
- where do they diverge?
- what shifts in one domain but not the other?

Keep it lightweight and explainable.
No scoring theatrics.
No composite compatibility score.

## Acceptance criteria

### Functional
- a user can create a shareable integrated profile link
- the shared profile opens on another device and matches the local profile state
- a compare page can render two shared profiles side by side
- malformed or partial payloads fail safely

### Content / UX
- Atlas cards are still concise
- Atlas detail pages do not repeat their opening summary
- visible copy reduces old AI-coded phrasing
- `so what` language is clearer and more natural
- compare output is understandable without reading the Methods page

### Visual
- fingerprints or comparable micro-visuals have stronger contrast and clearer differentiation
- compare page has one dominant visual object near the top
- result/profile surfaces remain restrained, not dashboard-heavy

## What success looks like

After this phase, the product should let a user:
- understand their result more quickly
- click deeper into a pattern if interested
- share their integrated profile
- compare it with a friend
- see that there is a larger map of possible patterns

without needing more modules or a simulation layer yet.
