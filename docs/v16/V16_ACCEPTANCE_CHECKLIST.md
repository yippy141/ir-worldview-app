## Test and acceptance plan

### Unit tests

- Perspective scoring never mutates Foundation scores.
- A flat Perspective Run produces zero or negligible deltas.
- Mirror scenarios use the same signal keys and compatible weights.
- ProfileStore v1–v3 fixtures migrate to v4.
- Existing Foundation result payloads decode.
- Profile share V1 decodes.
- Profile share V2 round-trips.
- Reference Profiles pass evidence validation.
- Reference map positions come from the shared projection.
- Movement hulls contain their member points.
- Copy guardrails catch the target antithesis templates.

### Manual QA

- Foundation Standard and Analyst modes.
- Foundation result with old share link.
- Start a Perspective Run from result.
- Save and remove a Perspective Run.
- Profile with one and several overlays.
- Reference Profile detail with sources.
- Atlas with each layer combination.
- Keyboard-only map/list navigation.
- 390-pixel mobile viewport.
- Reduced-motion mode.
- Invalid perspective payload.
- Profile migration from existing localStorage.

### Release acceptance

- A user can distinguish personal baseline, Perspective Run, Atlas pattern, and Reference Profile without reading Methods.
- The map remains legible with two layers active.
- Mobile offers every item through the list.
- Every public Reference Profile displays date, scope, and evidence.
- Existing shared results still render.
- All checks pass:
  - `npm run lint`
  - `npm run test`
  - `npx tsc --noEmit`
  - `npm run build`

---
