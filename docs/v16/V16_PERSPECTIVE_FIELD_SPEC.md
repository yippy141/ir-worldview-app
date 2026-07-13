## 1. Locked product decisions

### 1.1 Keep the Foundation personal

The Foundation continues to ask for the respondent’s own judgment. It remains the default entry point and the anchor for the Profile.

A country selector will not silently alter Foundation scoring. Nationality, citizenship, and culture do not determine a worldview score.

### 1.2 Add Perspective Runs

A Perspective Run is a separate, shorter exercise. The respondent reasons from a defined actor position and receives a contextual overlay beside the personal baseline.

The first release should support these role packs:

1. incumbent great power;
2. rising peer competitor;
3. exposed ally or vulnerable small state;
4. middle power or nonaligned hedger;
5. developmental or capacity-constrained state;
6. international institution or protection authority.

Two named-country pilot packs may follow after content review. The first strong candidates are the United States and China because mirrored cases can test the same strategic problem from opposing positions.

A Perspective Run should report:

- where the respondent’s judgment moved;
- which dimensions stayed stable;
- which constraints produced the shift;
- which scenario exposed the largest change.

It should not assign a second permanent identity.

### 1.3 Add Reference Profiles

Reference Profiles place thinkers, leaders, movements, doctrines, and AI-governance currents in the same educational field.

Every profile is an evidence-coded public posture with:

- entity type;
- domain and scope;
- evidence window;
- review date;
- source ledger;
- dimension-level support;
- uncertainty or disagreement notes;
- version history.

The interface should use “public posture,” “coded position,” or “reference profile.” Avoid claims about private motives or inner beliefs.

### 1.4 Treat movements as constellations

Broad coalitions need multiple profiles or a bounded region. A single MAGA dot would erase major disagreements.

A useful first MAGA/GOP set could include:

- Vance-aligned restraint and negotiated de-escalation;
- Rubio-aligned hawkish internationalism;
- Miller-aligned sovereignty and national-state primacy;
- evangelical or Christian-Zionist foreign-policy currents.

These labels remain provisional until the evidence pack is complete. Each profile carries an “as of” date and a scope note.

### 1.5 Use separate maps where the dimensions differ

IR Reference Profiles use the seven Foundation dimensions and the current 2D projection.

AI-governance Reference Profiles use the AI Governance axes and its own visualization.

A crosswalk may connect related concepts across IR and AI. The crosswalk should remain visible and documented. Scores from different instruments should never be merged into one master coordinate.

### 1.6 Build a layered field

The Field Explorer supports these layers:

- My profile
- Atlas patterns
- Perspective Runs
- Reference Profiles
- Friends
- Commons — later

Only one or two layers should be active at once. Mobile opens with a list and offers the map as a second view.

### 1.7 Defer Commons infrastructure

V16 can ship with local profile storage, share payloads, Perspective Runs, and static curated Reference Profiles.

The opt-in public Commons still requires persistent storage, consent records, deletion, moderation, rate limiting, and quality controls. That work belongs in a dedicated data release.

---

## 2. Product model

The app now contains four clearly defined objects.

| Object | Question answered | Data source | Scored into Foundation? |
|---|---|---|---|
| Personal baseline | “Which arguments do I find persuasive?” | Foundation answers | Yes |
| Perspective Run | “How do I reason under this actor’s constraints?” | Short mirrored scenario set | No |
| Reference Profile | “Where does this public posture sit in the field?” | Coded public evidence | No |
| Social comparison | “Where do two profiles align and split?” | Shared profiles | No composite score |

The visual grammar should distinguish them:

- **Personal baseline:** solid brass dot;
- **Perspective Run:** outlined dot connected to baseline;
- **Atlas pattern:** small neutral marker;
- **Reference Profile:** shape based on entity type;
- **Friend:** named dot with explicit sharing;
- **Commons:** aggregate density, once the data system exists.

Color alone should never carry the distinction.

---

## 3. Perspective Run interaction

### Entry points

Add “Try another vantage point” in:

- the Foundation result;
- the Profile;
- the Atlas or Field Explorer.

### Start screen

The start screen explains three things in direct language:

1. The Foundation recorded the user’s own judgment.
2. This run asks the user to advise from a defined strategic position.
3. The result will appear beside the baseline as a contextual shift.

### During the run

Every screen carries a persistent context badge:

> Reasoning from: Exposed ally

Each scenario should identify:

- the actor;
- the objective;
- the constraint;
- the uncertainty;
- the decision or explanatory task.

Do not use a generic country dropdown that simply swaps names inside existing questions. Country packs need reviewed scenarios that match geography, alliances, regime constraints, economic exposure, and strategic position.

### Result

Use a compact comparison:

- baseline dot;
- perspective dot;
- connecting line;
- three largest dimension shifts;
- one stable thread;
- one scenario that produced the largest movement.

Suggested result language:

> Advising an exposed ally moved your answers toward alliance reliability and visible deterrence. Your view of institutions changed little. The largest shift came when delay increased the risk of a fait accompli.

---

## 5. Profile storage and sharing

### 5.1 Migration-safe ProfileStore v4

Keep the existing current snapshots for compatibility and add history.

```ts
export type ProfileStore = {
  v: 4
  foundation: FoundationSnapshot | null
  foundationHistory: FoundationSnapshot[]
  modules: Partial<Record<ModuleSlug, ModuleSnapshot>>
  moduleHistory: ModuleSnapshot[]
  aiGovernance: AiGovernanceSnapshot | null
  aiHistory: AiGovernanceSnapshot[]
  perspectiveRuns: PerspectiveRunSnapshot[]
}
```

Migration rules:

- v1–v3 data must still parse;
- the current Foundation becomes the first history entry when history is absent;
- existing Security and Technology snapshots remain valid;
- missing arrays become empty arrays;
- corrupted optional history never erases the current saved snapshot.

### 5.2 Share payloads

Keep all existing Foundation result URLs valid.

Add `ProfileSharePayloadV2` for optional:

- AI Governance result;
- Perspective Runs;
- run dates;
- projection version.

Keep the existing V1 decoder. Shared profiles should render even when V2-only fields are absent.

### 5.3 Perspective snapshot

```ts
export type PerspectiveRunSnapshot = {
  id: string
  timestamp: number
  perspectiveId: string
  perspectiveLabel: string
  scenarioSetVersion: number
  dimensionScores: DimensionScores
  baselineDeltas: Partial<Record<DimensionKey, number>>
  strongestShiftKeys: DimensionKey[]
  resultPath: string
}
```

---

## 6. Route and component plan

### Routes

- `/perspectives` — choose a role pack and start a run
- `/perspectives/[perspectiveId]` — run the scenario set
- `/perspectives/[perspectiveId]/result/[payload]` — share-safe result
- `/explore/atlas` — enhanced layered Atlas
- `/explore/reference/[id]` — evidence and profile detail
- `/profile` — baseline, overlays, history, and sharing

### Libraries

- `lib/perspectives/types.ts`
- `lib/perspectives/catalog.ts`
- `lib/perspectives/scoring.ts`
- `lib/perspectives/share.ts`
- `lib/reference-profiles/types.ts`
- `lib/reference-profiles/catalog.ts`
- `lib/reference-profiles/validation.ts`
- `lib/field/layers.ts`
- `lib/field/position.ts`

### Components

- `components/field/field-explorer.tsx`
- `components/field/field-map.tsx`
- `components/field/field-list.tsx`
- `components/field/layer-controls.tsx`
- `components/field/field-detail-card.tsx`
- `components/perspectives/perspective-picker.tsx`
- `components/perspectives/perspective-quiz.tsx`
- `components/perspectives/perspective-result.tsx`
- `components/reference/reference-profile-card.tsx`
- `components/reference/reference-evidence-drawer.tsx`

Prefer shared primitives over separate desktop and mobile implementations.

---

## 7. Field Explorer behavior

### Desktop

- The map receives the largest visual area.
- A compact rail holds layer controls and filters.
- Selection opens one detail card.
- Labels appear for the selected item and immediate neighbors.
- Pan and zoom remain restrained.
- A reset control restores the default view.
- Keyboard navigation follows the item list.

### Mobile

- List view opens first.
- “View map” switches to the spatial view.
- Selected details appear in a bottom sheet or normal page block.
- Labels appear only after selection.
- Pinch zoom can be supported if it does not interfere with page scrolling.
- Every map item remains available in a semantic list.

### Layer rules

- Maximum two active layers.
- `My profile` stays visible when a contextual layer is active.
- Friends and Reference Profiles cannot both auto-label every item.
- Filters persist in the URL query string.
- Empty filters produce an explanatory state.

---

## 8. Copy guardrail: contrastive antithesis

The existing editorial guide should add a section named **Contrastive antithesis**.

### Flag these templates

- “X, not Y”
- “It is X, not Y”
- “This is not X. It is Y.”
- “not just X, but Y”
- “less about X and more about Y”
- “rather than”
- “doesn’t merely”
- “the point is not”
- “more than a”
- “not a verdict”

These patterns often create polished symmetry without adding information.

### Rewrite method

1. State the useful claim directly.
2. Put a real limitation in a separate sentence.
3. Use concrete nouns and verbs.
4. Remove self-conscious product positioning from result copy.
5. Keep plain safety or methodology limits when they carry necessary information.

### Examples

| Flagged | Direct |
|---|---|
| “This is a structured interpretation, not a verdict.” | “This result summarizes patterns across your answers. The family label is shorthand.” |
| “It is not a personality test. It is a worldview map.” | “The inventory maps how you judge geopolitical tradeoffs.” |
| “The point is not to classify you.” | “The profile shows where your judgments stay stable and where context changes them.” |
| “You are not reflexively hawkish; you are…” | “You support pressure when delay increases strategic risk. You also set clear limits on escalation.” |
| “More than a quiz.” | State the actual deliverable: “The Profile combines your baseline, issue modules, and contextual shifts.” |

### Test strategy

Extend the existing copy guardrail test. Use a focused list of public copy factories and an explicit allowlist for essential legal, safety, and methodology statements.

Suggested soft-flag patterns:

```ts
const ANTITHESIS_PATTERNS = [
  /\b(?:it is|it's|this is|that is)\b[^.!?]{0,90}\bnot\b/i,
  /\bnot just\b/i,
  /\bless about\b[^.!?]{0,90}\bmore about\b/i,
  /\brather than\b/i,
  /\bdoes(?:n't| not)\s+(?:just|merely)\b/i,
  /\bthe point is not\b/i,
  /\bmore than (?:a|an)\b/i,
  /\bnot a verdict\b/i,
]
```

Do not scan source comments, tests, or quoted educational examples. Scan public copy outputs and selected page strings.

---
