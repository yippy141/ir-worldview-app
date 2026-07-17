# DR-019: Map label correction

- Status: Resolved
- Date: 2026-07-17
- Scope: World Stage public map selector

## Context

The alliance scene is built from the reviewed `us_alliance_security_lens`
record. Its visible countries, nodes, and flows describe the U.S. alliance
network across the Pacific. A former public label referred to Atlantic
alliances, which did not match the reviewed scene displayed underneath it.

## Decision

The public map-view label is **Pacific alliances**. The underlying research
scene, sources, Mapbox data, camera, and route behavior are unchanged.

The five public World Stage map views are:

1. Pacific alliances
2. Chip networks
3. Regional security
4. Hedging states
5. AI infrastructure

Profile remains a World Stage menu destination, but it does not receive a
separate public map view or duplicate the alliance research scene.

## Consequences

- The selector now describes the geography it displays.
- The automatic map cycle and public selector share the same five-view set.
- No scoring, payload, research, or profile-model contract changes.
