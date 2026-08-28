> **HISTORICAL, SUPERSEDED, NON-EXECUTABLE.** Preserved only for provenance. Verify every claim against the current roadmap, Git state, and runtime before reuse.

# mapbox-gl on live routes — audit

> **HISTORICAL AND SUPERSEDED AS EXECUTION AUTHORITY.** Preserve evidence for provenance. Reproduce against the reconciled baseline before acting.

**Scope note.** 58 files are staged (`find . -type f | wc -l`). Several files this analysis touches are **absent** and I do not guess at them: `lib/world-stage/data/world-countries-110m.json` (the 136 KB geometry itself), `lib/world-stage/scenes.ts`, `lib/world-stage/types.ts`, `lib/world-stage/zh-hans.ts`, `lib/http-headers.ts`, `components/home/world-stage-prototype/world-stage-prototype.module.css`, and any `.env*`, lockfile, `vercel.json`, or `node_modules`.

---

## Short answer

**Yes, mapbox ships on a live route — but only partly, and the part that always ships is not the expensive part.**

- `mapbox-gl.css` ships **unconditionally** on `/` (and `/zh-Hans`) via a static side-effect import. No flag, no guard.
- The ~800 KB `mapbox-gl` **JS** is a genuine `import()` inside `useEffect`, gated behind a build-time-inlined token check. It loads on every homepage visit **iff** `NEXT_PUBLIC_MAPBOX_TOKEN` is set in the deploy environment.
- Whether that env var is set in production **cannot be determined from the staged files**. This is the single pivotal unknown, and it is cheap to settle — see "The one thing to check" below.

Question 6 does not apply: something mapbox ships regardless, so the decision is not trivial.

---

## 1. Who imports mapbox-gl, and by what mechanism

Every reference in the repo (`grep -rn "mapbox" --include=*.ts --include=*.tsx --include=*.css`) lives in **one component**: `/mnt/user-data/uploads/ir-worldview-app-clean/components/home/world-stage/world-stage-map.tsx`. Four distinct mechanisms, and the difference between them is the whole story.

**a. Static, unconditional, value import — the CSS (line 3):**
```ts
import "mapbox-gl/dist/mapbox-gl.css"
```
A side-effect import at module top level in a `"use client"` file. Next extracts this into the route's CSS bundle at build time. It is emitted and served **whether or not a token exists, whether or not WebGL exists, whether or not the map ever initializes.** This is the only piece of mapbox that ships with certainty.

**b. Type-only imports — erased at compile time (lines 14, 47, 48):**
```ts
import type { GeoJSONSource, MapLayerMouseEvent } from "mapbox-gl"
```
```ts
type MapboxModule = typeof import("mapbox-gl")
type MapboxMap = import("mapbox-gl").Map
```
Zero runtime cost. Not a shipping concern.

**c. Dynamic import — the actual library (line 797), inside the `useEffect` that begins at line 254:**
```ts
    void import("mapbox-gl")
      .then((module: MapboxModule) => {
        if (cancelled || !mapContainerRef.current || !activeSceneRef.current) return

        const mapboxgl = module.default
        mapboxgl.accessToken = WORLD_STAGE_MAPBOX_TOKEN
```
This is a real code-split boundary. The bundler emits the chunk; the browser fetches it only if execution reaches line 797.

**d. There is no `next/dynamic`, no `ssr:false`, no `React.lazy` anywhere.** `WorldStageMap` itself is pulled in statically by its parent — `components/home/world-stage/world-stage-home.tsx` line 37:
```ts
import { WorldStageMap, type WorldStageMapHandle } from "./world-stage-map"
```

**Chain to the route** (`app/page.tsx`, lines 2 and 13):
```ts
import { WorldStageHome } from "@/components/home/world-stage/world-stage-home"
```
```tsx
export default function HomePage() {
  return <WorldStageHome />
}
```

`grep -rn "world-stage\|WorldStage" app/ components/ --include=*.tsx` outside the world-stage directory returns exactly those two lines. **One route, the homepage.** No other page in the staged tree touches this subsystem.

---

## 2. Does the home page render the mapbox map, and under what conditions

`app/page.tsx` has no flag. The gating is entirely inside `world-stage-map.tsx` lines 254–269:

```ts
  useEffect(() => {
    const container = mapContainerRef.current
    setMapReady(false)
    renderedSceneIdRef.current = null

    if (!container || !activeSceneRef.current) return
    if (!WORLD_STAGE_MAPBOX_TOKEN) {
      setDiagnostic("missing-token")
      return
    }
    if (!hasWebGlSupport()) {
      setDiagnostic("no-webgl")
      return
    }

    setDiagnostic(reducedMotion ? "reduced-motion-static" : "live-map")
```

Four gates, in order: container mounted → scene non-null → **token non-empty** → **WebGL available**. Only then does control reach line 797.

**There is no feature flag.** The token check *is* the flag, and it is an env guard. Since `process.env.NEXT_PUBLIC_MAPBOX_TOKEN` is inlined by Next at build time (`lib/world-stage/map-config.ts` lines 12–13), `!WORLD_STAGE_MAPBOX_TOKEN` compiles to a constant per deployment. It is not a runtime switch you can flip without a rebuild.

**`reducedMotion` does NOT prevent mapbox from loading.** The diagnostic string `"reduced-motion-static"` (line 269, and again at 736) is a misnomer — the map is still constructed, still WebGL, still fetching tiles. Only `scheduleSpin` short-circuits (lines 288–297). A user with `prefers-reduced-motion: reduce` still pays the full 800 KB.

### The fallback renders *alongside*, not instead of

This is the finding that most changes the calculus. Lines 881–901:

```tsx
      <div
        className={`${styles.fallbackMap} ${mapReady ? styles.fallbackMapDimmed : ""}`}
      >
        <WorldStageFallbackMap
          scene={scene}
          filters={filters}
          zoom={fallbackZoom}
          onInspect={positionInspection}
          ...
        />
      </div>

      <div
        ref={mapContainerRef}
        className={`${styles.mapboxHost} ${mapReady ? styles.mapboxHostReady : ""}`}
        aria-hidden="true"
      />
```

`WorldStageFallbackMap` is **always mounted and always rendered**. It is never conditional. When mapbox succeeds, the SVG is merely faded, per `world-stage.module.css` lines 577–585:

```css
.fallbackMap {
  opacity: 1;
  pointer-events: auto;
}

.fallbackMapDimmed {
  opacity: 0.08;
  pointer-events: none;
}
```

and the mapbox host fades in (lines 788–799, `.mapboxHost { opacity: 0 }` → `.mapboxHostReady { opacity: 1 }`).

**Consequence:** the full SVG world — geometry, all country paths, role fills, flows, nodes, hit areas — is in the DOM and in the JS bundle on *every* homepage load, mapbox or not. And `lib/world-stage/map-data.ts` line 1 statically imports the geometry:

```ts
import countryGeometryJson from "@/lib/world-stage/data/world-countries-110m.json" with {
  type: "json",
}
```

`map-data.ts` is imported by both the mapbox path and the fallback path, so the 136 KB of geometry ships unconditionally too. **When mapbox is active, the app is paying for both maps and showing one.**

Failure paths all resolve to the SVG: `"missing-token"`, `"no-webgl"`, `"load-error"` (set on map-construction throw at 826, on `map.on("error")` at 784, on `webglcontextlost` at 777, on a throw during layer setup at 740, and on dynamic-import rejection at 845). Every one leaves `mapReady === false`, so the SVG stays at full opacity with pointer events. The fail-closed design is genuinely solid.

The `?mapDebug=1` diagnostic readout (lines 974–981) is **development-only** — line 233: `if (process.env.NODE_ENV !== "development") return`. You cannot read the diagnostic state on production.

---

## 3. What mapbox is actually used for

Counted by grep on `world-stage-map.tsx`: **3 `map.addSource` calls, 7 `map.addLayer` calls, 0 occurrences of `beforeId`.**

**Map construction** (lines 806–824) — note how much is switched off:
```ts
          map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: WORLD_STAGE_MAPBOX_STYLE,
            ...initialCamera,
            projection: "globe",
            attributionControl: false,
            interactive: true,
            keyboard: false,
            boxZoom: false,
            doubleClickZoom: false,
            dragPan: true,
            dragRotate: true,
            pitchWithRotate: false,
            touchPitch: false,
            scrollZoom: false,
            touchZoomRotate: true,
            cooperativeGestures: false,
            fadeDuration: reducedMotion ? 0 : WORLD_STAGE_TRANSITION_MS,
          })
```

The APIs actually called:

| Capability | Calls | Notes |
|---|---|---|
| **Globe projection** | `projection: "globe"` (810) | The one thing SVG doesn't already do |
| **Atmosphere** | `map.setFog({ color, "high-color", "space-color", "horizon-blend", "star-intensity" })` (727–733) | Halo + stars |
| **Basemap theming** | `map.setConfigProperty("basemap", …)` ×12 (714–718), `map.setPaintProperty(backgroundLayer.id, …)` (724–725) | Driven by `WORLD_STAGE_BASEMAP_CONFIG`, `map-config.ts` 23–36 |
| **Vector sources** | `map.addSource` ×3 (516, 520, 526) — all `type: "geojson"`, all fed from local data | Not tiles |
| **Layers** | `map.addLayer` ×7 (533, 564, 575, 588, 600, 636, 666) — `fill`, `line` ×4, `circle` ×2 | Data-driven `match`/`case` expressions, `line-dasharray`, `*-emissive-strength` |
| **Camera animation** | `map.easeTo` ×3 (323, 365, 426), `map.stop()`, `getCenter()`, `getZoom()` | Spin, zoom, scene transition |
| **Hit-testing** | `map.on("mousemove"\|"mouseleave"\|"click", LAYER_ID, handler)` ×9 (694–702) | Uses `event.features[0].properties` and `event.point` |
| **Hover highlight** | `map.setFilter(COUNTRY_HOVER_LAYER_ID, ["==", ["get", "iso3"], iso3])` (406, 474, 510) | |
| **Lifecycle** | `getCanvas()`, `getStyle()`, `getSource()`, `.setData()`, `map.remove()` | |

### The tiles are almost entirely occluded

All 7 editorial layers are added with **no `beforeId`** (verified: 0 occurrences), so they append to the top of the style's layer stack — above every basemap layer including labels. The country fill (lines 533–563) covers the world's land at:

```ts
          "fill-opacity": [
            "case",
            ["==", ["get", "role"], "neutral"],
            0.84,
            0.98,
          ],
```

with the neutral fill `#183c5b` (`map-config.ts` line 54) sitting over a configured `colorLand: "#18344f"` (`map-config.ts` line 32). Those two colors are near-identical, at 84–98 % opacity.

**Inference (clearly labeled as such):** what a user actually sees from the paid tile service is the water color, the fog/atmosphere/stars, and labels over water. The land tiles — the thing you're billed for — are painted over by the vendored 110 m geometry. You are buying tiles to hide them. I'd want one screenshot to confirm, but the code is unambiguous about the layer order and the opacity.

So the honest list of what mapbox uniquely provides here is short: **globe projection, atmospheric fog, drag/rotate inertia, `easeTo` camera easing, and layer-scoped feature picking.** Everything else — the geometry, the roles, the flows, the nodes, the colors, the tooltips, the sources — is local data the app already renders in SVG.

---

## 4. Access token

`lib/world-stage/map-config.ts` lines 9–16:

```ts
// NEXT_PUBLIC_ tokens are intentionally visible in the browser. Restrict this
// token to production, preview, and local-development URL referrers in Mapbox.
// A missing or rejected token leaves the complete local SVG fallback visible.
export const WORLD_STAGE_MAPBOX_TOKEN =
  process.env.NEXT_PUBLIC_MAPBOX_TOKEN?.trim() ?? ""

export const WORLD_STAGE_MAPBOX_STYLE =
  process.env.NEXT_PUBLIC_MAPBOX_STYLE?.trim() || "mapbox://styles/mapbox/dark-v11"
```

Applied at line 802: `mapboxgl.accessToken = WORLD_STAGE_MAPBOX_TOKEN`.

**Required — yes.** `README.md` lines 93–115 documents it: set in `.env.local` for dev, in Vercel Project Settings → Environment Variables for production, restricted by URL referrer in the Mapbox dashboard. Default style is `mapbox://styles/mapbox/dark-v11` when `NEXT_PUBLIC_MAPBOX_STYLE` is unset.

Attribution is hand-rolled because `attributionControl: false`, rendered only when `mapReady` (lines 983–991), pointing at `mapbox.com/about/maps`, OSM copyright, and `apps.mapbox.com/feedback`.

**Corroborating detail (inference):** `next.config.ts` lines 24–27 attaches `mapReferrerHeader` specifically to `"/"`, `"/zh"`, `"/zh-Hans"` — exactly the homepage locales. `lib/http-headers.ts` is not staged so I can't read the header value, but a per-route Referrer-Policy on precisely the map route is what a referrer-restricted Mapbox token requires. If mapbox goes, that config block and its comment about Vercel prefix matching become dead code.

---

## 5. Verdict

### Can it be replaced by precomputed SVG from the vendored geometry?

**Yes — and more of the replacement already exists than the framing suggests.** The SVG fallback is not a degraded stub. It is a complete second renderer of the same editorial payload, already shipping on every homepage load.

**What is genuinely lost:**

1. **Globe projection.** `lib/world-stage/fallback-geometry.ts` lines 20–25 is a flat equirectangular map:
```ts
export function projectWorldStagePoint([longitude, latitude]: WorldStageLngLat) {
  return {
    x: 50 + ((longitude + 180) / 360) * (WORLD_STAGE_MAP_WIDTH - 100),
    y: 44 + ((90 - latitude) / 180) * (WORLD_STAGE_MAP_HEIGHT - 88),
  }
}
```
Flat vs. sphere is the real, visible difference. For a product whose homepage argument is "here is the world as a contested whole," that is an editorial loss, not just cosmetic.

2. **Atmosphere and stars** (`setFog`). Approximable with a radial gradient; not identical.

3. **Free drag-to-rotate and auto-spin.** Fallback zoom is viewBox-only (`FALLBACK_MIN_ZOOM` 0.5 → `FALLBACK_MAX_ZOOM` 2, step 0.25, lines 98–101); scene centering comes from `scene.camera.center`. No panning, no rotation.

**What is NOT lost, contrary to what you might expect:**

- **Tooltips, sources, "reviewed through" dates, pinning.** Both paths call the same `positionInspection` and render the same portal (lines 903–951). Identical.
- **Country roles, contested dashed borders, flow colors by relation, node colors by semiconductor role.** All present in the SVG (`world-stage-fallback-map.tsx` 108–207, CSS 602–661).
- **Layer filters and the legend.** Live in `world-stage-home.tsx` (362–457), renderer-agnostic.
- **Screen-reader content.** The visually-hidden `<section>` (953–972) is the accessibility surface; **both** canvases are `aria-hidden="true"` (line 900 and fallback line 96). Mapbox contributes *nothing* to a11y today.
- **Zoom buttons.** `zoomBy` (192–202) already falls through to the fallback when `zoomMapRef.current` is null.

**One thing that looks like a loss but isn't:** the fallback caps nodes at 6 and flows at 4 (`map-data.ts` lines 105–106):
```ts
export const WORLD_STAGE_FALLBACK_NODE_LIMIT = 6
export const WORLD_STAGE_FALLBACK_FLOW_LIMIT = 4
```
Mapbox renders all of them. But this is an authoring choice in the fallback, not a mapbox capability — it's a two-line change. (I can't say what fraction of nodes/flows is being hidden: `lib/world-stage/scenes.ts` is not staged, so I cannot count scene contents.)

### Constraint check

Verified safe. Every import specifier in `components/home/world-stage/` and `lib/world-stage/` resolves to `@/i18n/*`, `@/content/locales/*`, `@/lib/world-stage/*`, `react`, `react-dom`, `next-intl`, or `mapbox-gl`. **Nothing in this subsystem touches scoring, payloads, calibration, or replay.** Removing mapbox cannot break frozen replay. And removal *deletes* a dependency, so the no-new-dependencies rule is satisfied — provided the replacement is hand-written math, not d3-geo.

### Work estimate

Basis: hand-count of the code to be deleted or written, from the files above. `node_modules` and lockfile are absent, so I cannot verify the installed mapbox-gl size — the ~800 KB figure is yours, not measured here.

**Option A — delete mapbox, keep the flat SVG. 4–8 hours.**
Remove line 3, the effect at 254–855, the host div at 897–901, the attribution at 983–991, the diagnostic states, and `WORLD_STAGE_MAPBOX_TOKEN`/`_STYLE`/`_BASEMAP_CONFIG` from `map-config.ts`. Simplify `zoomBy`, drop `mapReady` and the dimming CSS. Raise the node/flow caps. Update `README.md` 93–115, drop the dep, revisit `next.config.ts` 24–27, re-run Playwright. Low risk. Loses the globe.

**Option B — delete mapbox, build an orthographic SVG globe from the same geometry. 25–40 hours (4–6 focused days).**

| Task | Hours |
|---|---|
| Orthographic projection + back-face culling (dot-product visibility per ring) | 3–5 |
| Great-circle flow arcs replacing the quadratic beziers at `fallback-geometry.ts` 55–71 | 2–3 |
| **Per-frame path regeneration + perf work** | **6–12** |
| Pointer hit-testing on the rotated sphere | 2–4 |
| Drag-to-rotate with inertia | 3–5 |
| Atmosphere look (radial gradient, star field) | 1–2 |
| Mapbox removal, README, tests, visual QA across breakpoints + reduced-motion + `forced-colors` | 4–6 |

**The line that can blow this estimate is the third one, and you should treat the range as real.** `WORLD_STAGE_COUNTRY_PATHS` is currently computed **once at module scope** (`fallback-geometry.ts` lines 47–53) precisely because the flat projection is camera-independent. An orthographic projection is not — every path string must be rebuilt whenever the globe rotates. I cannot size that cost, because `world-countries-110m.json` is not staged and I refuse to guess at its feature or coordinate count. **Measure that first.** If it's large, the mitigations are: precompute paths for the fixed enumerated scene angles rather than continuous rotation; simplify rings for the rotating state and swap in full detail at rest; or render to canvas 2D and do picking with a hidden color buffer (adds ~4 h and costs you the free SVG hit-testing).

### Recommendation

Drop mapbox. The editorial substance — every country role, flow, node, source, and date — is already rendered locally in SVG on every page load, and mapbox's own layers are drawn from that same local GeoJSON. You are shipping a second renderer, a tile bill, a token with a referrer-restriction operational burden, and a per-route header rule, in order to obscure the tiles you paid for behind an 84–98 % opaque overlay and gain a globe projection plus an atmosphere.

Take Option B if the globe is editorially load-bearing — I'd argue it is for this product. Take Option A if it isn't. Either way, delete line 3 today: that CSS ships to every homepage visitor unconditionally and buys nothing when the token is absent.

---

## The one thing to check before deciding

**I could not determine whether `NEXT_PUBLIC_MAPBOX_TOKEN` is set in production.** No `.env*`, no `vercel.json`, no deploy config is staged. If it is unset in production, the JS chunk is never fetched, the live cost today is the CSS alone, and this becomes a cleanup task rather than a migration.

Two ways to settle it in under a minute, both from the code above:

1. Load the production homepage with DevTools → Network, filter `mapbox`. A request to `api.mapbox.com` means the token is live.
2. Search the rendered DOM for `© Mapbox`. That block (lines 983–991) renders **only** when `mapReady === true`, so its presence is a direct, sufficient proof that mapbox initialized and tiles are being billed.

Do that before committing to either option.
