import test from "node:test"
import assert from "node:assert/strict"
import {
  FIELD_LAYER_CONFIGS,
  MAX_ACTIVE_FIELD_LAYERS,
  fieldSelectionKey,
  filterFieldItems,
  findSelectedFieldItem,
  getNextFieldItem,
  getNextFieldSelectionKey,
  getStableFieldItems,
  normalizeActiveFieldLayers,
  normalizeFieldFilters,
  parseFieldFilters,
  parseFieldLayerIds,
  parseFieldSelectionKey,
  resolveSelectedFieldItem,
  serializeFieldFilters,
  serializeFieldLayerIds,
  toggleActiveFieldLayer,
  type FieldFilterableItem,
} from "@/lib/field/layers"
import {
  calculateMovementHull,
  isPointInOrOnMovementHull,
  toMapPosition as toFieldMapPosition,
  type MapPosition,
} from "@/lib/field/position"
import { toMapPosition as toCanonicalMapPosition } from "@/lib/results/position"
import type { DimensionScores } from "@/lib/types"

test("Field layer config includes every V16 layer and marks Commons for later", () => {
  assert.deepEqual(
    FIELD_LAYER_CONFIGS.map(({ id, label }) => ({ id, label })),
    [
      { id: "my-profile", label: "My profile" },
      { id: "atlas-patterns", label: "Atlas patterns" },
      { id: "perspective-runs", label: "Perspective Runs" },
      { id: "reference-profiles", label: "Reference Profiles" },
      { id: "friends", label: "Friends" },
      { id: "commons", label: "Commons — later" },
    ],
  )
  assert.equal(
    FIELD_LAYER_CONFIGS.find(({ id }) => id === "commons")?.releaseStatus,
    "later",
  )
})

test("active layers keep My profile and one contextual layer", () => {
  const active = normalizeActiveFieldLayers([
    "reference-profiles",
    "friends",
    "atlas-patterns",
  ])

  assert.deepEqual(active, ["my-profile", "reference-profiles"])
  assert.ok(active.length <= MAX_ACTIVE_FIELD_LAYERS)

  assert.deepEqual(
    normalizeActiveFieldLayers(["perspective-runs", "perspective-runs"]),
    ["my-profile", "perspective-runs"],
  )
  assert.deepEqual(normalizeActiveFieldLayers(["commons", "unknown"]), [
    "my-profile",
  ])
})

test("two contextual layers remain possible when My profile is unavailable", () => {
  const availability = {
    "my-profile": false,
    "atlas-patterns": true,
    "perspective-runs": true,
    "reference-profiles": true,
  } as const

  assert.deepEqual(
    normalizeActiveFieldLayers(
      ["perspective-runs", "reference-profiles", "atlas-patterns"],
      availability,
    ),
    ["perspective-runs", "reference-profiles"],
  )

  assert.deepEqual(
    toggleActiveFieldLayer(
      ["perspective-runs", "reference-profiles"],
      "atlas-patterns",
      availability,
    ),
    ["reference-profiles", "atlas-patterns"],
  )
})

test("layer state has a stable URL value and applies availability on parse", () => {
  const encoded = serializeFieldLayerIds([
    "my-profile",
    "reference-profiles",
  ])
  assert.equal(encoded, "my-profile,reference-profiles")
  assert.deepEqual(parseFieldLayerIds(encoded), [
    "my-profile",
    "reference-profiles",
  ])
  assert.deepEqual(
    parseFieldLayerIds(encoded, { "reference-profiles": false }),
    ["my-profile"],
  )
})

test("Field filters round-trip through a canonical URL query string", () => {
  const filters = normalizeFieldFilters({
    query: "  strategic   restraint ",
    entityTypes: ["thinker", "leader", "thinker"],
    scopes: ["technology", "foundation", "foundation"],
    movementIds: ["hedgers", "alliance-currents", "hedgers"],
  })

  const encoded = serializeFieldFilters(filters)
  assert.equal(
    encoded,
    "q=strategic+restraint&entity=leader&entity=thinker&scope=foundation&scope=technology&movement=alliance-currents&movement=hedgers",
  )
  assert.deepEqual(parseFieldFilters(`?${encoded}`), filters)

  assert.deepEqual(
    parseFieldFilters(
      "entity=leader&entity=bogus&scope=foundation&scope=unknown&movement=%00bad",
    ),
    {
      query: "",
      entityTypes: ["leader"],
      scopes: ["foundation"],
      movementIds: [],
    },
  )
})

const filterItems: FieldFilterableItem[] = [
  {
    id: "mine",
    layerId: "my-profile",
    label: "My profile",
    scope: "foundation",
  },
  {
    id: "institutional-thinker",
    layerId: "reference-profiles",
    label: "Institutional cooperation",
    searchableText: ["rules and monitoring", "strategic restraint"],
    entityType: "thinker",
    scope: "foundation",
    movementIds: ["institutional-currents"],
  },
  {
    id: "alliance-leader",
    layerId: "reference-profiles",
    label: "Alliance posture",
    searchableText: "visible deterrence",
    entityType: "leader",
    scope: "security",
    movementIds: ["alliance-currents"],
  },
  {
    id: "technology-doctrine",
    layerId: "reference-profiles",
    label: "Technology doctrine",
    searchableText: "industrial capacity",
    entityType: "doctrine",
    scope: "technology",
  },
]

test("filtering uses OR within facets, AND across facets, and active layers", () => {
  const filtered = filterFieldItems(
    filterItems,
    {
      query: "rules restraint",
      entityTypes: ["thinker", "leader"],
      scopes: ["foundation"],
      movementIds: ["institutional-currents", "alliance-currents"],
    },
    ["reference-profiles"],
  )

  assert.deepEqual(
    filtered.map(({ id }) => id),
    ["institutional-thinker"],
  )
  assert.deepEqual(
    filterFieldItems(filterItems, {}, []).map(({ id }) => id),
    [],
  )
})

const selectionItems: FieldFilterableItem[] = [
  {
    id: "beta",
    layerId: "reference-profiles",
    label: "Beta",
  },
  {
    id: "alpha/with:punctuation",
    layerId: "reference-profiles",
    label: "Alpha",
  },
  {
    id: "mine",
    layerId: "my-profile",
    label: "My profile",
  },
]

test("selection keys round-trip and stable order ignores source order", () => {
  const alpha = selectionItems[1]
  const alphaKey = fieldSelectionKey(alpha)
  assert.deepEqual(parseFieldSelectionKey(alphaKey), {
    layerId: "reference-profiles",
    itemId: "alpha/with:punctuation",
  })

  const forward = getStableFieldItems(selectionItems).map(fieldSelectionKey)
  const reversed = getStableFieldItems([...selectionItems].reverse()).map(
    fieldSelectionKey,
  )
  assert.deepEqual(forward, reversed)
  assert.deepEqual(
    getStableFieldItems(selectionItems).map(({ id }) => id),
    ["mine", "alpha/with:punctuation", "beta"],
  )

  assert.equal(findSelectedFieldItem(selectionItems, alphaKey)?.id, alpha.id)
  assert.equal(findSelectedFieldItem(selectionItems, "bad-key"), null)
  assert.equal(
    resolveSelectedFieldItem(selectionItems, "bad-key")?.id,
    "mine",
  )
})

test("next-selection helpers wrap in both directions", () => {
  const stable = getStableFieldItems(selectionItems)
  const firstKey = fieldSelectionKey(stable[0])
  const lastKey = fieldSelectionKey(stable[stable.length - 1])

  assert.equal(
    getNextFieldItem(selectionItems, firstKey, "next")?.id,
    "alpha/with:punctuation",
  )
  assert.equal(
    getNextFieldSelectionKey(selectionItems, lastKey, "next"),
    firstKey,
  )
  assert.equal(
    getNextFieldSelectionKey(selectionItems, firstKey, "previous"),
    lastKey,
  )
  assert.equal(
    getNextFieldItem(selectionItems, null, "previous")?.id,
    "beta",
  )
})

test("Field projection is the canonical Foundation projection", () => {
  const scores: DimensionScores = {
    securityCompetition: 5.5,
    institutions: 3.2,
    domesticFilters: 4.1,
    normsIdentity: 5.2,
    politicalEconomy: 4.8,
    restraint: 3.7,
    orderJustice: 5.6,
  }

  assert.deepEqual(toFieldMapPosition(scores), toCanonicalMapPosition(scores))
})

test("movement hull handles zero, one, two, duplicate, and collinear points", () => {
  assert.deepEqual(calculateMovementHull([]), [])
  assert.deepEqual(calculateMovementHull([{ x: -0, y: 0.25 }]), [
    { x: 0, y: 0.25 },
  ])
  assert.deepEqual(
    calculateMovementHull([
      { x: 1, y: 1 },
      { x: -1, y: -1 },
    ]),
    [
      { x: -1, y: -1 },
      { x: 1, y: 1 },
    ],
  )
  assert.deepEqual(
    calculateMovementHull([
      { x: 1, y: 1 },
      { x: -1, y: -1 },
      { x: 0, y: 0 },
      { x: 1, y: 1 },
    ]),
    [
      { x: -1, y: -1 },
      { x: 1, y: 1 },
    ],
  )

  assert.equal(isPointInOrOnMovementHull({ x: 0, y: 0 }, []), false)
  assert.equal(
    isPointInOrOnMovementHull({ x: 0, y: 0.25 }, [{ x: 0, y: 0.25 }]),
    true,
  )
  assert.equal(
    isPointInOrOnMovementHull({ x: 0, y: 0 }, [
      { x: -1, y: -1 },
      { x: 1, y: 1 },
    ]),
    true,
  )
  assert.equal(
    isPointInOrOnMovementHull({ x: 1.1, y: 1.1 }, [
      { x: -1, y: -1 },
      { x: 1, y: 1 },
    ]),
    false,
  )
})

test("movement hull is deterministic and contains every member position", () => {
  const members: MapPosition[] = [
    { x: -0.8, y: -0.4 },
    { x: 0.7, y: -0.5 },
    { x: 0.9, y: 0.45 },
    { x: -0.5, y: 0.8 },
    { x: 0, y: 0 },
    { x: 0.2, y: 0.1 },
    { x: -0.8, y: -0.4 },
  ]
  const hull = calculateMovementHull(members)

  assert.deepEqual(hull, [
    { x: -0.8, y: -0.4 },
    { x: 0.7, y: -0.5 },
    { x: 0.9, y: 0.45 },
    { x: -0.5, y: 0.8 },
  ])
  assert.deepEqual(calculateMovementHull([...members].reverse()), hull)

  for (const member of members) {
    assert.equal(
      isPointInOrOnMovementHull(member, hull),
      true,
      `expected (${member.x}, ${member.y}) inside its movement hull`,
    )
  }

  assert.equal(isPointInOrOnMovementHull({ x: 0.7, y: -0.5 }, hull), true)
  assert.equal(isPointInOrOnMovementHull({ x: 1, y: 1 }, hull), false)
})
