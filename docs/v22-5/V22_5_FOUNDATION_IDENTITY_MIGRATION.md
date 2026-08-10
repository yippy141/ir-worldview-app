# V22.5 Foundation identity migration

**Migration date:** 2026-08-06  
**Baseline:** `11907229ac25ab53b3e060d49312c0af1fb7fa68`  
**Scope:** Prompt 1 — one assigned user identity and static Decision Patterns

## Contract after this migration

- A current Foundation result is identified by the Foundation archetype
  resolved from its exact, versioned payload and registered scoring
  calibration.
- My Profile, shared Profile, Profile comparison, metadata, and share text use
  that same payload-resolved Foundation archetype as the user-level identity.
  The closest modeled tradition remains supporting evidence, not a second
  personal classification.
- Security, Technology, and AI results remain separate domain results. They do
  not rename the Foundation archetype.
- The ten former Atlas profiles are now presented publicly as **Decision
  Patterns**: authored editorial reading aids that are not calculated from,
  matched to, or assigned from a respondent's answers.
- Current Case comparison returns
  `unavailable / missing-authored-mapping` until a reviewed, versioned authored
  mapping contract exists. It does not guess through a Decision Pattern.

## Matcher and static-content split

`lib/atlas-lite.ts` remains the compatibility catalog for the ten stable
Decision Pattern records, fingerprints, neighbor relationships, getters, and
route helper. The following assignment machinery was deleted:

- `matchAtlasLiteFoundation`;
- `matchAtlasLiteProfile`;
- matcher-only context and scoring helpers;
- the ten embedded assignment-rule blocks.

A production-source guard scans `app`, `components`, and `lib` and fails if
either deleted matcher identifier is reintroduced.

## Compatibility boundary

No Foundation scoring rule, payload schema, stored score, or URL token was
changed.

- Existing Foundation payload versions continue through their registered
  decoders and calibrations. Profile identity is resolved from that exact
  payload rather than reconstructed from cached display fields. When a
  decodable local snapshot contains conflicting cached result fields,
  hydration restores the payload's family, modifiers, and dimension scores
  before any supporting Profile analysis is rendered.
- Non-decodable legacy local ProfileStore V1/V2 Foundation tokens are not
  reinterpreted. They show an honest “Foundation identity unavailable” hero
  and do not expose cached family labels as a current identity. Saved Focus
  Area results, Perspective runs, history, and Profile actions remain
  accessible. The localized Profile and shared Profile follow the same rule:
  they show a Chinese unavailable/archived Foundation state without treating
  the Profile as empty or the share link as invalid.
- Current Profile shares use V3 when the Foundation and every included module
  have canonical payloads. If any module is a legacy display-only snapshot, or
  the saved Foundation token can no longer be reconstructed, the write path
  uses the V2 compatibility envelope so that the Foundation record, legacy
  module, AI Governance, and Perspective Runs remain in the same shared
  Profile. Existing V1 and V2 payload decoding remains unchanged; a
  structurally valid legacy envelope with an unresolvable Foundation is shown
  as an unavailable identity rather than rejected as an invalid link.
- Foundation payload V5 currently reconstructs its canonical identity from
  the encoded dimension scores and form calibration with the current scorer.
  This is stable while V5 has one scorer implementation. A future scorer
  version must add an explicit versioned reconstruction path or migration;
  otherwise an already-saved V5 snapshot could resolve to a different
  identity even though its encoded scores are unchanged.
- All ten historical IDs and `/explore/atlas/<id>` URLs remain stable, as do
  the localized `/zh/explore/atlas/<id>` routes and the opaque
  `atlas-patterns` Worldview Map layer/query key.
- Static Current Case reading records continue to reference the same stable
  catalog IDs.
- Profile Store V1–V5, Profile Share V1–V3, Foundation share payloads, module
  payloads, and their existing decoders were not rewritten.

## Simplified Chinese boundary

The approved Chinese copy deck does not contain localized Foundation archetype
names or glosses. Chinese Foundation result and Profile routes therefore show
the canonical archetype name/code with a visible notice that the name and
archetype explanation have not completed Chinese editorial review. They retain
the approved Chinese closest-tradition narrative as supporting copy; no silent
English gloss fallback was added.

Foundation result routes are translated and use the locale-aware internal
route contract. Module, AI Governance, and Perspective detail routes remain
English-only; Chinese Profile copy states that boundary and links directly to
their canonical English paths rather than constructing unavailable `/zh`
routes.

## Tests added or updated

- exact current and frozen Foundation payload identity resolution;
- conflicting cached fields cannot replace the payload-resolved identity;
- Profile hero, metadata, and sharing use the Foundation archetype;
- current Foundation results do not assign a Decision Pattern;
- production code cannot reference either deleted matcher;
- all ten Decision Pattern IDs and English/localized routes remain resolvable;
- Current Case comparison returns the explicit unavailable state in both
  public locales;
- legacy V1/V2 local Profiles retain their saved subordinate results without
  inventing a Foundation identity;
- a legacy-module Profile round-trips through V2 with its AI Governance and
  Perspective Run records intact;
- Chinese Profile links resolve translated Foundation routes once and send
  English-only domain details to their canonical English routes;
- English and Chinese result/Profile browser flows and Decision Pattern detail
  routes.

## Verification

| Gate | Result |
|---|---|
| `npm run lint` | Pass |
| `npm run test` | Pass — 436 tests |
| `npm run build` | Pass — 149 static pages generated |
| `npm run test:e2e` | Pass — 50 passed, 1 intentionally skipped |

The intentionally skipped browser check is the existing local-development
cache-header assertion; it runs under CI's production server mode.

## Explicit non-goals

This migration did not create a replacement matcher, map Decision Patterns
one-to-one onto Foundation archetypes, change Foundation scoring, or reinterpret
saved payloads. Module-to-Foundation overlay migration remains outside Prompt
1.
