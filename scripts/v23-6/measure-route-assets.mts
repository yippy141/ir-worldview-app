import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, relative, resolve } from "node:path"
import {
  brotliCompressSync,
  constants as zlibConstants,
  gzipSync,
} from "node:zlib"
import { chromium, type Browser } from "@playwright/test"

type TargetOptions = {
  label: "candidate" | "baseline"
  baseUrl: string
  buildDir: string
}

type Measurement = {
  label: string
  route: string
  baseUrl: string
  buildDir: string
  clientReferenceManifestJavascript: AssetTotals & {
    manifest: string
    files: AssetMeasurement[]
    mapboxMatches: string[]
  }
  browserRequestedJavascript: AssetTotals & {
    files: AssetMeasurement[]
    mapboxMatches: string[]
  }
  routeFonts: AssetTotals & {
    files: AssetMeasurement[]
  }
  browserNetwork: {
    requests: number
    encodedBytes: number
    javascriptBytes: number
    fontBytes: number
    cssBytes: number
    otherBytes: number
    mapboxRequests: string[]
  }
  fontRender: {
    spectralLoaded: boolean
    libreFranklinLoaded: boolean
    body: RenderedFontEvidence
    activeMenu: RenderedFontEvidence
  }
}

type RenderedFontEvidence = {
  familyStack: string
  primaryFamily: string
  registeredFaceCount: number
  loadedFaceCount: number
  fontFaceSetCheck: boolean
  renderedWithRegisteredFace: boolean
}

type AssetMeasurement = {
  url: string
  file: string | null
  rawBytes: number
  gzipBytes: number
  brotliBytes: number
}

type AssetTotals = {
  rawBytes: number
  gzipBytes: number
  brotliBytes: number
}

const options = parseOptions(process.argv.slice(2))
if (existsSync(options.output)) {
  throw new Error(`Refusing to overwrite existing measurement: ${options.output}`)
}
mkdirSync(dirname(options.output), { recursive: true })

const browser = await chromium.launch({ headless: true })
let candidate: Measurement
let baseline: Measurement | null = null
try {
  candidate = await measureTarget(browser, options.candidate, options.route)
  if (options.baseline) {
    baseline = await measureTarget(browser, options.baseline, options.route)
  }
} finally {
  await browser.close()
}

const report = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  route: options.route,
  candidate,
  baseline,
  comparison: baseline
    ? {
        clientReferenceManifestJavascript: compareTotals(
          candidate.clientReferenceManifestJavascript,
          baseline.clientReferenceManifestJavascript,
        ),
        browserRequestedJavascript: compareTotals(
          candidate.browserRequestedJavascript,
          baseline.browserRequestedJavascript,
        ),
        routeFonts: compareTotals(candidate.routeFonts, baseline.routeFonts),
        browserNetwork: compareNumber(
          candidate.browserNetwork.encodedBytes,
          baseline.browserNetwork.encodedBytes,
        ),
        browserJavascript: compareNumber(
          candidate.browserNetwork.javascriptBytes,
          baseline.browserNetwork.javascriptBytes,
        ),
        browserFonts: compareNumber(
          candidate.browserNetwork.fontBytes,
          baseline.browserNetwork.fontBytes,
        ),
      }
    : null,
  interpretation: {
    clientReferenceManifest: "clientReferenceManifestJavascript is the exact unique JavaScript chunk set named by the route's Next client-reference manifest. The pinned baseline 447,933 / 140,262 / 114,058 byte values use this set.",
    browserRequestedJavascript: "browserRequestedJavascript is the wider clean-browser JavaScript request set and can include Next bootstrap or runtime files outside the route client-reference manifest.",
    compression: "gzip and Brotli estimates are computed independently per local asset; browserNetwork uses clean-load CDP encodedDataLength.",
    cache: "Chromium disk cache is disabled and service workers are blocked for each measurement.",
    mapbox: "The candidate root must have no Mapbox request and no Mapbox signature in its loaded JavaScript assets.",
  },
}

writeFileSync(options.output, `${JSON.stringify(report, null, 2)}\n`, "utf8")
process.stdout.write(`${JSON.stringify(report, null, 2)}\n`)

if (
  candidate.browserNetwork.mapboxRequests.length > 0
  || candidate.clientReferenceManifestJavascript.mapboxMatches.length > 0
  || candidate.browserRequestedJavascript.mapboxMatches.length > 0
) {
  process.exitCode = 1
}

async function measureTarget(
  browser: Browser,
  target: TargetOptions,
  route: string,
): Promise<Measurement> {
  const context = await browser.newContext({
    baseURL: target.baseUrl,
    reducedMotion: "reduce",
    serviceWorkers: "block",
  })
  const page = await context.newPage()
  const cdp = await context.newCDPSession(page)
  const responses = new Map<string, {
    url: string
    type: string
    mimeType: string
    encodedBytes: number
  }>()

  cdp.on("Network.responseReceived", (event) => {
    responses.set(event.requestId, {
      url: event.response.url,
      type: event.type,
      mimeType: event.response.mimeType,
      encodedBytes: 0,
    })
  })
  cdp.on("Network.loadingFinished", (event) => {
    const response = responses.get(event.requestId)
    if (response) response.encodedBytes = event.encodedDataLength
  })
  await cdp.send("Network.enable")
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true })

  try {
    const response = await page.goto(route, { waitUntil: "load" })
    if (!response?.ok()) {
      throw new Error(`${target.label} ${route} returned ${response?.status() ?? "no response"}.`)
    }
    await page.evaluate(async () => {
      await document.fonts.ready
      await new Promise<void>((resolveFrame) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolveFrame())))
    })
    await page.waitForTimeout(500)

    const rootOrigin = new URL(target.baseUrl).origin
    const networkRows = [...responses.values()]
    const javascriptUrls = unique(
      networkRows
        .filter((entry) => {
          const url = new URL(entry.url)
          return url.origin === rootOrigin
            && (entry.type === "Script"
              || /javascript/iu.test(entry.mimeType)
              || /\/_next\/static\/.*\.js(?:\?|$)/u.test(url.pathname))
        })
        .map((entry) => entry.url),
    )
    const fontUrls = unique(
      networkRows
        .filter((entry) => /font|woff2?|ttf|otf/iu.test(
          `${entry.type} ${entry.mimeType} ${entry.url}`,
        ))
        .map((entry) => entry.url),
    )
    const browserRequestedJavascriptFiles = javascriptUrls.map((url) =>
      measureAsset(target.buildDir, url))
    const fontFiles = fontUrls.map((url) => measureAsset(target.buildDir, url))
    const browserRequestedMapboxMatches = browserRequestedJavascriptFiles
      .filter((asset) => {
        if (!asset.file) return false
        const text = readFileSync(resolve(target.buildDir, asset.file), "utf8")
        return /mapbox-gl|mapboxgl-canvas|mapbox-runtime|api\.mapbox\.com/iu.test(text)
      })
      .map((asset) => asset.url)
    const clientReferenceManifestJavascript = measureClientReferenceManifest(
      target.buildDir,
      route,
      target.baseUrl,
    )

    const fontRender = await page.evaluate(() => {
      const inspectRenderedFont = (element: HTMLElement) => {
        const familyStack = getComputedStyle(element).fontFamily
        const primaryFamily = familyStack.split(",")[0]?.trim().replace(/^['"]|['"]$/gu, "") ?? ""
        const normalize = (value: string) => value.replace(/^['"]|['"]$/gu, "").toLowerCase()
        const registeredFaces = Array.from(document.fonts).filter(
          (face) => normalize(face.family) === normalize(primaryFamily),
        )
        return {
          familyStack,
          primaryFamily,
          registeredFaceCount: registeredFaces.length,
          loadedFaceCount: registeredFaces.filter((face) => face.status === "loaded").length,
          fontFaceSetCheck: primaryFamily.length > 0
            && document.fonts.check(`16px ${JSON.stringify(primaryFamily)}`),
          renderedWithRegisteredFace: registeredFaces.length > 0
            && registeredFaces.some((face) => face.status === "loaded"),
        }
      }
      const body = inspectRenderedFont(document.body)
      const activeMenu = inspectRenderedFont(
        document.querySelector<HTMLElement>('[data-root-destination][data-selected="true"]')
          ?? document.body,
      )
      return {
        spectralLoaded: activeMenu.renderedWithRegisteredFace,
        libreFranklinLoaded: body.renderedWithRegisteredFace,
        body,
        activeMenu,
      }
    })

    return {
      label: target.label,
      route,
      baseUrl: target.baseUrl,
      buildDir: target.buildDir,
      clientReferenceManifestJavascript,
      browserRequestedJavascript: {
        ...sumAssets(browserRequestedJavascriptFiles),
        files: browserRequestedJavascriptFiles,
        mapboxMatches: browserRequestedMapboxMatches,
      },
      routeFonts: {
        ...sumAssets(fontFiles),
        files: fontFiles,
      },
      browserNetwork: summarizeBrowserNetwork(networkRows),
      fontRender,
    }
  } finally {
    await context.close()
  }
}

function measureClientReferenceManifest(
  buildDir: string,
  route: string,
  baseUrl: string,
): Measurement["clientReferenceManifestJavascript"] {
  const routeDirectory = route === "/"
    ? ""
    : route.replace(/^\/+|\/+$/gu, "")
  const manifestFile = resolve(
    buildDir,
    "server/app",
    routeDirectory,
    "page_client-reference-manifest.js",
  )
  if (!existsSync(manifestFile)) {
    throw new Error(
      `No client-reference manifest exists for ${route}: ${manifestFile}`,
    )
  }

  const manifestText = readFileSync(manifestFile, "utf8")
  const chunkPaths = unique(
    manifestText.match(/static\/chunks\/[^" ]+\.js/gu) ?? [],
  )
  const files = chunkPaths.map((path) =>
    measureAsset(buildDir, new URL(`/_next/${path}`, baseUrl).href))
  const mapboxMatches = files
    .filter((asset) => {
      if (!asset.file) return false
      const text = readFileSync(resolve(buildDir, asset.file), "utf8")
      return /mapbox-gl|mapboxgl-canvas|mapbox-runtime|api\.mapbox\.com/iu.test(text)
    })
    .map((asset) => asset.url)

  return {
    manifest: relative(buildDir, manifestFile),
    ...sumAssets(files),
    files,
    mapboxMatches,
  }
}

function measureAsset(buildDir: string, urlValue: string): AssetMeasurement {
  const url = new URL(urlValue)
  const staticPrefix = "/_next/"
  const relativeFile = url.pathname.startsWith(staticPrefix)
    ? decodeURIComponent(url.pathname.slice(staticPrefix.length))
    : null
  const absoluteFile = relativeFile ? resolve(buildDir, relativeFile) : null
  if (!absoluteFile || !existsSync(absoluteFile)) {
    return {
      url: urlValue,
      file: null,
      rawBytes: 0,
      gzipBytes: 0,
      brotliBytes: 0,
    }
  }

  const buffer = readFileSync(absoluteFile)
  return {
    url: urlValue,
    file: relative(buildDir, absoluteFile),
    rawBytes: buffer.byteLength,
    gzipBytes: gzipSync(buffer, { level: 9 }).byteLength,
    brotliBytes: brotliCompressSync(buffer, {
      params: {
        [zlibConstants.BROTLI_PARAM_QUALITY]: 11,
      },
    }).byteLength,
  }
}

function sumAssets(assets: AssetMeasurement[]): AssetTotals {
  return assets.reduce(
    (total, asset) => ({
      rawBytes: total.rawBytes + asset.rawBytes,
      gzipBytes: total.gzipBytes + asset.gzipBytes,
      brotliBytes: total.brotliBytes + asset.brotliBytes,
    }),
    { rawBytes: 0, gzipBytes: 0, brotliBytes: 0 },
  )
}

function summarizeBrowserNetwork(
  rows: Array<{ url: string; type: string; mimeType: string; encodedBytes: number }>,
) {
  const summary = {
    requests: rows.length,
    encodedBytes: 0,
    javascriptBytes: 0,
    fontBytes: 0,
    cssBytes: 0,
    otherBytes: 0,
    mapboxRequests: rows.filter((row) => isMapboxUrl(row.url)).map((row) => row.url),
  }

  for (const row of rows) {
    summary.encodedBytes += row.encodedBytes
    const value = `${row.type} ${row.mimeType} ${row.url}`.toLowerCase()
    if (row.type === "Script" || value.includes("javascript")) {
      summary.javascriptBytes += row.encodedBytes
    } else if (value.includes("font") || /\.(?:woff2?|ttf|otf)(?:\?|$)/u.test(value)) {
      summary.fontBytes += row.encodedBytes
    } else if (value.includes("css")) {
      summary.cssBytes += row.encodedBytes
    } else {
      summary.otherBytes += row.encodedBytes
    }
  }
  return summary
}

function compareTotals(candidate: AssetTotals, baseline: AssetTotals) {
  return {
    rawBytes: compareNumber(candidate.rawBytes, baseline.rawBytes),
    gzipBytes: compareNumber(candidate.gzipBytes, baseline.gzipBytes),
    brotliBytes: compareNumber(candidate.brotliBytes, baseline.brotliBytes),
  }
}

function compareNumber(candidate: number, baseline: number) {
  const delta = candidate - baseline
  return {
    candidate,
    baseline,
    delta,
    percent: baseline === 0 ? null : Number(((delta / baseline) * 100).toFixed(2)),
  }
}

function unique(values: string[]) {
  return [...new Set(values)].sort()
}

function parseOptions(args: string[]) {
  const values = new Map<string, string>()
  for (let index = 0; index < args.length; index += 1) {
    const key = args[index]
    const value = args[index + 1]
    if (!key?.startsWith("--") || !value || value.startsWith("--")) {
      throw new Error(`Expected --name value arguments; received ${key ?? "nothing"}.`)
    }
    values.set(key, value)
    index += 1
  }

  const candidateUrl = httpOrigin(values.get("--candidate-url"), "--candidate-url")
  const candidateBuildDir = requiredPath(
    values.get("--candidate-build-dir"),
    "--candidate-build-dir",
  )
  const output = values.get("--output")
  if (!output) throw new Error("--output is required.")

  const baselineUrl = values.get("--baseline-url")
  const baselineBuildDir = values.get("--baseline-build-dir")
  if (Boolean(baselineUrl) !== Boolean(baselineBuildDir)) {
    throw new Error(
      "--baseline-url and --baseline-build-dir must be supplied together.",
    )
  }

  return {
    route: values.get("--route") ?? "/",
    output: resolve(output),
    candidate: {
      label: "candidate" as const,
      baseUrl: candidateUrl,
      buildDir: candidateBuildDir,
    },
    baseline: baselineUrl && baselineBuildDir
      ? {
          label: "baseline" as const,
          baseUrl: httpOrigin(baselineUrl, "--baseline-url"),
          buildDir: requiredPath(baselineBuildDir, "--baseline-build-dir"),
        }
      : null,
  }
}

function httpOrigin(value: string | undefined, name: string) {
  if (!value) throw new Error(`${name} is required.`)
  const url = new URL(value)
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(`${name} must use http or https.`)
  }
  return url.origin
}

function requiredPath(value: string | undefined, name: string) {
  if (!value) throw new Error(`${name} is required.`)
  const path = resolve(value)
  if (!existsSync(path)) throw new Error(`${name} does not exist: ${path}`)
  return path
}

function isMapboxUrl(url: string) {
  return /(?:api|events|tiles)\.mapbox\.com|mapbox-gl|mapbox-runtime/iu.test(url)
}
