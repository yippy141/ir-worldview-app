## 4. Reference Profile methodology

### 4.1 Entity types

```ts
export type ReferenceEntityType =
  | "thinker"
  | "leader"
  | "government"
  | "movement"
  | "institution"
  | "doctrine"
  | "ai-current"
```

### 4.2 Source hierarchy

Use these sources in descending order of evidentiary weight:

1. enacted policy, official decisions, votes, signed doctrine;
2. official platforms, speeches, testimony, interviews;
3. canonical books, papers, and essays;
4. high-quality reporting with direct quotations or documented actions;
5. reputable expert datasets;
6. analyst interpretation, clearly marked.

### 4.3 Minimum evidence rule

A Reference Profile may appear on the map when:

- at least five of seven Foundation dimensions have support;
- each strong dimension has two independent evidence items;
- the evidence window is stated;
- the review date is present;
- disputes or reversals are recorded;
- the profile passes a second-person review.

Sparse profiles may still appear as reading cards without a map position.

### 4.4 Public display

Show:

- a plain summary;
- the relevant domain;
- “reviewed [date]”;
- support level per dimension;
- evidence drawer;
- strongest source;
- disagreement or change note.

Hide raw coding coefficients from the default view. The Methods page can explain the coding process.

### 4.5 Internal dimension estimate

```ts
export type EvidenceSupport = "sparse" | "partial" | "strong"

export type DimensionEstimate = {
  value: number // existing 1–7 scale
  support: EvidenceSupport
  sourceIds: string[]
  note: string
}

export type ReferenceProfile = {
  id: string
  name: string
  shortName: string
  entityType: ReferenceEntityType
  scope: "foundation" | "security" | "technology" | "ai-governance"
  asOf: string
  evidenceWindow: {
    start?: string
    end: string
  }
  summary: string
  dimensionEstimates: Partial<Record<DimensionKey, DimensionEstimate>>
  sourceIds: string[]
  disputes: string[]
  reviewer: string
  version: number
}
```

Store the seven-dimension estimate as the canonical data. Compute the 2D position through the existing projection at runtime. Do not hand-place Reference Profiles to make the chart look attractive.

### 4.6 Movement profile

A movement may provide:

- `memberProfileIds`;
- an optional display hull computed from member positions;
- a short account of internal disagreements;
- a scope note explaining which branches are included.

---

## 9. Initial Reference Profile seed

Build the schema for all categories. Ship a small, reviewed set.

### IR thinkers

1. John Mearsheimer
2. Robert Keohane
3. Alexander Wendt
4. Susan Strange

### Contemporary U.S. currents

1. Vance-aligned America First restraint
2. Rubio-aligned hawkish internationalism
3. Miller-aligned sovereign nationalism
4. Evangelical or Christian-Zionist foreign-policy current

- It will be worth including the Democrats and other GOP currents too, as well as non-party affiliated currents.

### Contemporary currents outside of the U.S

1. China
2. EU (specifically Germany and France)
3. UK
4. Japan
5. South Korea
6. Canada
7. Australia
8. MENA nations
9. ASEAN nations
10. Brazil, Mexico and LATAM

### AI-governance currents

1. Precautionary safety governance
2. Strategic competition and state capability
3. International coordination and verification
4. Open ecosystem and acceleration

- And any additional currents and subcurrents within discourse

The current political entries need dated evidence. Treat them as time-bounded public postures. Keep a correction path in the detail page.

A second seed should add non-U.S. doctrines before a major public launch:

- PRC comprehensive national security;
- India strategic autonomy;
- EU strategic autonomy;
- developmental sovereignty or nonaligned industrial policy.
