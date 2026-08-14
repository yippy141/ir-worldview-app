import { createHash } from "node:crypto"
import { mkdirSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { archetypes } from "@/lib/archetypes"
import {
  archetypeSigils,
  SIGIL_GEOMETRY_DIGEST_INPUT,
  SIGIL_GEOMETRY_VERSION,
  type SigilDefinition,
  type SigilPrimitive,
} from "@/lib/archetype-sigils"

export const SIGIL_CONTACT_SHEET_RELATIVE_PATH =
  "artifacts/v23/V23_1_SIGIL_CONTACT_SHEET.svg" as const
export const SIGIL_CONTACT_SHEET_SIZES = [24, 48, 96] as const
export const SIGIL_CONTACT_SHEET_WATERMARK_SIZE = 160 as const

export const SIGIL_CONTACT_SHEET_MODES = [
  {
    id: "default-dark",
    label: "DEFAULT DARK · ASTROLABE",
    background: "#0a1322",
    foreground: "#cea857",
    text: "#eef2f7",
    muted: "#8295ab",
    rule: "#304563",
  },
  {
    id: "black-on-white",
    label: "BLACK ON WHITE",
    background: "#ffffff",
    foreground: "#000000",
    text: "#111111",
    muted: "#555555",
    rule: "#b8b8b8",
  },
  {
    id: "white-on-black",
    label: "WHITE ON BLACK",
    background: "#000000",
    foreground: "#ffffff",
    text: "#ffffff",
    muted: "#c5c5c5",
    rule: "#666666",
  },
  {
    id: "print",
    label: "PRINT SPECIMEN · BLACK INK ON WHITE PAPER",
    background: "#ffffff",
    foreground: "#111111",
    text: "#111111",
    muted: "#4a4a4a",
    rule: "#8a8a8a",
  },
] as const

const SHEET_WIDTH = 1960
const SHEET_HEIGHT = 3460
const PANEL_WIDTH = 920
const PANEL_HEIGHT = 1580
const PANEL_GAP = 40
const PANEL_LEFT = 40
const PANEL_TOP = 210
const ROW_TOP = 150
const ROW_HEIGHT = 176
const COLUMN_CENTERS = {
  24: 322,
  48: 432,
  96: 572,
  watermark: 764,
} as const

const PROJECT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..")
export const SIGIL_CONTACT_SHEET_PATH = resolve(
  PROJECT_ROOT,
  SIGIL_CONTACT_SHEET_RELATIVE_PATH,
)

export function sha256(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex")
}

export const SIGIL_CONTACT_SHEET_GEOMETRY_DIGEST = sha256(
  SIGIL_GEOMETRY_DIGEST_INPUT,
)

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
}

function formatNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : String(value)
}

function renderPrimitive(primitive: SigilPrimitive): string {
  if (primitive.kind === "line") {
    return (
      `<line x1="${formatNumber(primitive.from[0])}" ` +
      `y1="${formatNumber(primitive.from[1])}" ` +
      `x2="${formatNumber(primitive.to[0])}" ` +
      `y2="${formatNumber(primitive.to[1])}"/>`
    )
  }

  return `<path d="${escapeXml(primitive.d)}"/>`
}

function renderSigil(
  definition: SigilDefinition,
  size: number,
  centerX: number,
  centerY: number,
  scale: "24" | "48" | "96" | "watermark",
): string {
  const opacity = scale === "watermark" ? ' opacity="0.16"' : ""
  const primitives = definition.primitives
    .map((primitive) => `          ${renderPrimitive(primitive)}`)
    .join("\n")

  return [
    `        <svg data-sigil-code="${definition.code}" data-scale="${scale}" data-size="${size}"`,
    `          x="${centerX - size / 2}" y="${centerY - size / 2}" width="${size}" height="${size}"`,
    `          viewBox="${definition.viewBox}" fill="${definition.fill}" stroke="${definition.stroke}"`,
    `          stroke-width="${definition.strokeWidth}" stroke-linecap="${definition.strokeLinecap}"`,
    `          stroke-linejoin="${definition.strokeLinejoin}" color="inherit"${opacity}>`,
    primitives,
    "        </svg>",
  ].join("\n")
}

function renderPanel(
  mode: (typeof SIGIL_CONTACT_SHEET_MODES)[number],
  modeIndex: number,
): string {
  const column = modeIndex % 2
  const row = Math.floor(modeIndex / 2)
  const panelX = PANEL_LEFT + column * (PANEL_WIDTH + PANEL_GAP)
  const panelY = PANEL_TOP + row * (PANEL_HEIGHT + PANEL_GAP)
  const definitionsByCode = new Map(
    archetypeSigils.map((definition) => [definition.code, definition]),
  )
  const printAttribute = mode.id === "print" ? ' data-print-specimen="true"' : ""

  const entries = archetypes
    .map((archetype, index) => {
      const definition = definitionsByCode.get(archetype.code)
      if (!definition) {
        throw new Error(`Missing sigil definition for ${archetype.code}.`)
      }

      const rowY = panelY + ROW_TOP + index * ROW_HEIGHT
      const centerY = rowY + ROW_HEIGHT / 2
      const separatorY = rowY + ROW_HEIGHT
      const sizeSpecimens = SIGIL_CONTACT_SHEET_SIZES.map((size) =>
        renderSigil(
          definition,
          size,
          panelX + COLUMN_CENTERS[size],
          centerY,
          String(size) as "24" | "48" | "96",
        ),
      ).join("\n")
      const watermark = renderSigil(
        definition,
        SIGIL_CONTACT_SHEET_WATERMARK_SIZE,
        panelX + COLUMN_CENTERS.watermark,
        centerY,
        "watermark",
      )

      return [
        `      <g data-archetype-row="${archetype.code}" color="${mode.foreground}">`,
        `        <text x="${panelX + 30}" y="${centerY - 5}" fill="${mode.text}" font-family="Georgia, serif" font-size="23" font-weight="600">${escapeXml(archetype.name)}</text>`,
        `        <text x="${panelX + 30}" y="${centerY + 23}" fill="${mode.foreground}" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="15" font-weight="700" letter-spacing="2">${archetype.code}</text>`,
        sizeSpecimens,
        watermark,
        `        <line x1="${panelX + 24}" y1="${separatorY}" x2="${panelX + PANEL_WIDTH - 24}" y2="${separatorY}" stroke="${mode.rule}" stroke-width="1"/>`,
        "      </g>",
      ].join("\n")
    })
    .join("\n")

  return [
    `    <g data-mode="${mode.id}"${printAttribute}>`,
    `      <rect x="${panelX}" y="${panelY}" width="${PANEL_WIDTH}" height="${PANEL_HEIGHT}" rx="4" fill="${mode.background}" stroke="${mode.rule}" stroke-width="1"/>`,
    `      <text x="${panelX + 28}" y="${panelY + 42}" fill="${mode.foreground}" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="14" font-weight="700" letter-spacing="2">${mode.label}</text>`,
    `      <text x="${panelX + 28}" y="${panelY + 74}" fill="${mode.muted}" font-family="Arial, sans-serif" font-size="13">Production geometry · currentColor · static inline line/path primitives</text>`,
    `      <line x1="${panelX + 24}" y1="${panelY + 100}" x2="${panelX + PANEL_WIDTH - 24}" y2="${panelY + 100}" stroke="${mode.rule}" stroke-width="1"/>`,
    `      <text x="${panelX + COLUMN_CENTERS[24]}" y="${panelY + 128}" text-anchor="middle" fill="${mode.muted}" font-family="Arial, sans-serif" font-size="12">24px</text>`,
    `      <text x="${panelX + COLUMN_CENTERS[48]}" y="${panelY + 128}" text-anchor="middle" fill="${mode.muted}" font-family="Arial, sans-serif" font-size="12">48px</text>`,
    `      <text x="${panelX + COLUMN_CENTERS[96]}" y="${panelY + 128}" text-anchor="middle" fill="${mode.muted}" font-family="Arial, sans-serif" font-size="12">96px</text>`,
    `      <text x="${panelX + COLUMN_CENTERS.watermark}" y="${panelY + 128}" text-anchor="middle" fill="${mode.muted}" font-family="Arial, sans-serif" font-size="12">watermark · 160px · 16%</text>`,
    entries,
    "    </g>",
  ].join("\n")
}

export function renderArchetypeSigilContactSheet(): string {
  if (archetypes.length !== 8 || archetypeSigils.length !== 8) {
    throw new Error("Contact sheet requires exactly eight archetypes and sigils.")
  }

  const panels = SIGIL_CONTACT_SHEET_MODES.map(renderPanel).join("\n")

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<svg xmlns="http://www.w3.org/2000/svg" width="${SHEET_WIDTH}" height="${SHEET_HEIGHT}" viewBox="0 0 ${SHEET_WIDTH} ${SHEET_HEIGHT}" role="img" aria-label="V23.1 sigil collision-review contact sheet">`,
    '  <rect width="1960" height="3460" fill="#e7e4dc"/>',
    '  <text x="40" y="64" fill="#0a1322" font-family="Georgia, serif" font-size="34" font-weight="600">V23.1 archetype sigil collision-review contact sheet</text>',
    `  <text x="40" y="98" fill="#39485c" font-family="Arial, sans-serif" font-size="15">Eight pure codes · 24/48/96px · watermark · dark · black/white reversal · print</text>`,
    `  <text x="40" y="128" fill="#39485c" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="13">Geometry ${SIGIL_GEOMETRY_VERSION} · SHA-256 ${SIGIL_CONTACT_SHEET_GEOMETRY_DIGEST}</text>`,
    '  <text x="40" y="160" fill="#6a4633" font-family="Arial, sans-serif" font-size="14" font-weight="700">REVIEW STATUS: PENDING · THIS ARTIFACT IS NOT AN APPROVAL</text>',
    panels,
    '  <text x="40" y="3418" fill="#39485c" font-family="Arial, sans-serif" font-size="13">Generated deterministically from lib/archetype-sigils.ts. Visible names and codes come from the frozen identity catalog.</text>',
    "</svg>",
    "",
  ].join("\n")
}

export function writeArchetypeSigilContactSheet(): {
  artifactPath: string
  geometryDigest: string
  artifactDigest: string
} {
  const output = renderArchetypeSigilContactSheet()
  mkdirSync(dirname(SIGIL_CONTACT_SHEET_PATH), { recursive: true })
  writeFileSync(SIGIL_CONTACT_SHEET_PATH, output, "utf8")

  return {
    artifactPath: SIGIL_CONTACT_SHEET_PATH,
    geometryDigest: SIGIL_CONTACT_SHEET_GEOMETRY_DIGEST,
    artifactDigest: sha256(output),
  }
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : null
if (invokedPath === fileURLToPath(import.meta.url)) {
  const result = writeArchetypeSigilContactSheet()
  process.stdout.write(
    [
      `artifact=${result.artifactPath}`,
      `geometry_sha256=${result.geometryDigest}`,
      `artifact_sha256=${result.artifactDigest}`,
    ].join("\n") + "\n",
  )
}
