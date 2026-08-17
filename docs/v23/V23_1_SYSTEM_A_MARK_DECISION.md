# V23.1 System A mark decision

**Status:** binding beta design decision
**Decision date:** 2026-08-18
**Owner disposition:** selected for the English V23.1 beta

## Decision

V23.1 uses the eight pure marks defined by
`assets/V23_SYSTEM_A_DERIVED_SIGILS_MANIFEST.json`. The manifest is the source
of truth for the code-to-geometry relationship, view box, and SVG body of each
mark. Production translates that exact geometry into typed, server-safe JSX;
the supplied sprite and contact sheet are review artifacts, not runtime
assets.

The selected set contains exactly `P+`, `P−`, `R+`, `R−`, `M+`, `M−`,
`S+`, and `S−`. There is no ninth or blend mark. Pure marks render at 112px
in a hero and 48px in the directory. Any request below 32px renders the
visible canonical code instead of pictorial geometry. A blend hero is a
Diptych of two equal pure marks; a compact blend is a Hallmark with the
primary pure mark and a clearly bordered 32px runner-up. The blend code and
both names stay visible.

All production geometry is static, monochrome `currentColor`, and inline. It
uses no external asset, client script, animation, mask, filter, gradient, or
new dependency. Adjacent marks are decorative because the visible code and
name carry the public meaning. Reversed and print treatments inherit their
foreground color from the surrounding layout.

## Public explanation

The following disclosure accompanies the marks on the archetype pages:

> About the mark: This is contemporary editorial artwork made for this
> inventory. It is not an authentic historical emblem, a cultural
> classification, or an endorsement. The visible code and name carry the
> meaning.

## Rationale and boundaries

System A gives each of the eight stable pure codes an exact, independently
specified editorial mark without reviving the rejected generative grammar.
The previous geometry v1 remains blocked design history: its four-base,
two-transform construction produced collisions and is not a production
fallback.

Automated collision, integrity, rendering, accessibility, print, reversed,
and 200% bounds checks are release requirements. The owner accepts the
bounded residual cultural risk of this editorial-artwork treatment for the
English beta. That acceptance is not external expert review, human cultural
validation, or universal cultural clearance. Any material geometry or
meaning change requires a new collision decision.

This decision changes presentation only. It does not change scoring, items,
calibration, payloads, Profile identity, Map behavior, modules, Current Cases,
Tier 1, dependencies, or the approved Chinese-route manifests. Marks remain
out of share cards in V23.1, and Chinese long-form archetype routes remain
fail-closed.

## Alternatives not selected

- **Geometry v1:** blocked and retained only in
  `design-history/rejected-sigil-geometry-v1/`.
- **Code-only production at every size:** superseded by the owner's System A
  selection; code-only remains the required fallback below 32px.
- **A bespoke blend mark:** rejected because blends must remain a composition
  of the two pure readings.
- **External SVG or sprite rendering:** rejected because the production
  contract requires typed, server-safe inline geometry.
