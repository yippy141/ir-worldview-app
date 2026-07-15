import test from "node:test"
import assert from "node:assert/strict"
import {
  DEFAULT_FIELD_LAYER_AVAILABILITY,
  FIELD_LAYER_CONFIGS,
  MAX_ACTIVE_FIELD_LAYERS,
  PUBLIC_FIELD_LAYER_CONFIGS,
  fieldSelectionKey,
  filterFieldItems,
  findSelectedFieldItem,
  getFieldListGroups,
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
  toggleFieldSelectionKey,
  type FieldFilterableItem,
} from "@/lib/field/layers"
import {
  parseWorldviewMapQuery,
  serializeWorldviewMapQuery,
  WORLDVIEW_MAP_FAMILY_KEYS,
} from "@/lib/field/map-state"
import {
  FIELD_MARKER_OVERLAP_DISTANCE,
  calculateFieldMarkerFanOffset,
  calculateMovementHull,
  groupOverlappingMapItems,
  isPointInOrOnMovementHull,
  toMapPosition as toFieldMapPosition,
  type MapPosition,
} from "@/lib/field/position"
import { toMapPosition as toCanonicalMapPosition } from "@/lib/results/position"
import type { DimensionScores } from "@/lib/types"

test("Worldview Map keeps legacy layer IDs with the reviewed V17 public labels", () => {
  assert.deepEqual(
    FIELD_LAYER_CONFIGS.map(({ id, label, releaseStatus }) => ({
      id,
      label,
      releaseStatus,
    })),
    [
      { id: "my-profile", label: "My baseline", releaseStatus: "available" },
      { id: "atlas-patterns", label: "Worldview profiles", releaseStatus: "available" },
      { id: "perspective-runs", label: "My perspective shifts", releaseStatus: "available" },
      { id: "reference-profiles", label: "Thinkers & public positions", releaseStatus: "available" },
      { id: "friends", label: "Friends", releaseStatus: "hidden" },
      { id: "commons", label: "Commons", releaseStatus: "hidden" },
    ],
  )
  assert.deepEqual(
    PUBLIC_FIELD_LAYER_CONFIGS.map(({ id }) => id),
    ["my-profile", "atlas-patterns", "perspective-runs", "reference-profiles"],
  )
  assert.equal(DEFAULT_FIELD_LAYER_AVAILABILITY.friends, false)
  assert.equal(DEFAULT_FIELD_LAYER_AVAILABILITY.commons, false)
  assert.deepEqual(parseFieldLayerIds("friends,commons"), ["my-profile"])
  assert.deepEqual(
    parseFieldLayerIds("friends,commons", { friends: true, commons: true }),
    ["my-profile"],
  )
})

test("active layers keep one or two explicit layers without forcing a baseline", () => {
  const active = normalizeActiveFieldLayers([
    "reference-profiles",
    "friends",
    "atlas-patterns",
  ])

  assert.deepEqual(active, ["reference-profiles", "atlas-patterns"])
  assert.ok(active.length <= MAX_ACTIVE_FIELD_LAYERS)

  assert.deepEqual(
    normalizeActiveFieldLayers(["perspective-runs", "perspective-runs"]),
    ["perspective-runs"],
  )
  assert.deepEqual(normalizeActiveFieldLayers(["commons", "unknown"]), [
    "my-profile",
  ])
  assert.deepEqual(normalizeActiveFieldLayers(["atlas-patterns"]), [
    "atlas-patterns",
  ])
  assert.deepEqual(normalizeActiveFieldLayers(["reference-profiles"]), [
    "reference-profiles",
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

test("the shared Worldview Map query codec preserves legacy keys and canonical selection", () => {
  const familyKey = WORLDVIEW_MAP_FAMILY_KEYS[0]
  const selection = fieldSelectionKey({
    layerId: "reference-profiles",
    itemId: "alpha/with:punctuation",
  })
  const params = new URLSearchParams()
  params.set("layers", "atlas-patterns,reference-profiles")
  params.set("q", "strategic restraint")
  params.append("family", familyKey)
  params.set("reviewed", "12")
  params.set("sel", selection)
  params.set("view", "map")

  const parsed = parseWorldviewMapQuery(params)
  assert.equal(parsed.layerParam, "atlas-patterns,reference-profiles")
  assert.deepEqual(parsed.familyKeys, [familyKey])
  assert.equal(parsed.reviewedWithin, "12")
  assert.equal(parsed.selectedKey, selection)
  assert.equal(parsed.view, "map")

  const encoded = serializeWorldviewMapQuery({
    activeLayerIds: parseFieldLayerIds(parsed.layerParam),
    filters: parsed.filters,
    familyKeys: parsed.familyKeys,
    reviewedWithin: parsed.reviewedWithin,
    selectedKey: parsed.selectedKey,
    view: parsed.view,
  })
  const reparsed = parseWorldviewMapQuery(encoded)
  assert.deepEqual(reparsed, parsed)
  assert.equal(parseWorldviewMapQuery("sel=not-a-selection").selectedKey, null)
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

  assert.equal(toggleFieldSelectionKey(null, alphaKey), alphaKey)
  assert.equal(toggleFieldSelectionKey(alphaKey, alphaKey), null)
  assert.equal(
    toggleFieldSelectionKey(alphaKey, fieldSelectionKey(selectionItems[0])),
    fieldSelectionKey(selectionItems[0]),
  )
})

test("selection and semantic-list groups remain layer-scoped and complete", () => {
  const sameIdAcrossLayers: FieldFilterableItem[] = [
    {
      id: "shared-id",
      layerId: "atlas-patterns",
      label: "Worldview profile",
    },
    {
      id: "shared-id",
      layerId: "reference-profiles",
      label: "Public position",
    },
    {
      id: "future",
      layerId: "friends",
      label: "Hidden future item",
    },
  ]

  const groups = getFieldListGroups(sameIdAcrossLayers, [
    "atlas-patterns",
    "reference-profiles",
    "friends",
  ])
  assert.deepEqual(
    groups.map(({ layerId, items }) => ({
      layerId,
      keys: items.map(fieldSelectionKey),
    })),
    [
      {
        layerId: "atlas-patterns",
        keys: ["atlas-patterns::shared-id"],
      },
      {
        layerId: "reference-profiles",
        keys: ["reference-profiles::shared-id"],
      },
    ],
  )
  assert.notEqual(
    fieldSelectionKey(sameIdAcrossLayers[0]),
    fieldSelectionKey(sameIdAcrossLayers[1]),
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

  const traversed: string[] = []
  let current: string | null = null
  for (let index = 0; index < stable.length; index += 1) {
    current = getNextFieldSelectionKey(selectionItems, current, "next")
    assert.ok(current)
    traversed.push(current)
  }
  assert.deepEqual(traversed, stable.map(fieldSelectionKey))
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

test("overlap grouping is deterministic, lossless, and leaves coordinates untouched", () => {
  const points = [
    { key: "b", position: { x: 0.05, y: 0 } },
    { key: "a", position: { x: 0, y: 0 } },
    {
      key: "selected",
      position: { x: FIELD_MARKER_OVERLAP_DISTANCE, y: 0 },
    },
    { key: "separate", position: { x: 0.5, y: 0.5 } },
  ]
  const original = structuredClone(points)
  const forward = groupOverlappingMapItems(points)
  const reversed = groupOverlappingMapItems([...points].reverse())

  assert.deepEqual(forward, reversed)
  assert.deepEqual(points, original)
  assert.deepEqual(
    forward.map((group) => group.items.map((item) => item.key)),
    [["a", "b", "selected"], ["separate"]],
  )
  assert.deepEqual(
    forward.flatMap((group) => group.items.map((item) => item.key)).sort(),
    points.map((point) => point.key).sort(),
  )
  assert.equal(
    forward[0].items.some((item) => item.key === "selected"),
    true,
  )

  const beyond = groupOverlappingMapItems([
    { key: "left", position: { x: 0, y: 0 } },
    {
      key: "right",
      position: { x: FIELD_MARKER_OVERLAP_DISTANCE + 0.0001, y: 0 },
    },
  ])
  assert.equal(beyond.length, 2)
})

test("overlap fan offsets are finite and distinct", () => {
  assert.deepEqual(calculateFieldMarkerFanOffset(0, 1), { x: 0, y: 0 })
  const offsets = Array.from({ length: 12 }, (_, index) =>
    calculateFieldMarkerFanOffset(index, 12),
  )
  assert.equal(
    offsets.every(({ x, y }) => Number.isFinite(x) && Number.isFinite(y)),
    true,
  )
  assert.equal(
    new Set(offsets.map(({ x, y }) => `${x.toFixed(6)}:${y.toFixed(6)}`)).size,
    offsets.length,
  )
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
