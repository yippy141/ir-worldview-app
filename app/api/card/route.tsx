import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import {
  buildFoundationShareCardInput,
  parseFoundationShareCardRequest,
} from "@/lib/share-card"
import { resolveFoundationPayload } from "@/lib/share"
import { getV2ScoringCalibration } from "@/lib/scoring"
import { buildFoundationCardCopy } from "@/lib/foundation-social-copy"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const CARD_SIZE = { width: 1200, height: 630 }
let cardFontsPromise: Promise<CardFonts | null> | null = null

type CardFonts = {
  display: ArrayBuffer
  cjk: ArrayBuffer
  sans: ArrayBuffer
  sansBold: ArrayBuffer
}

export async function GET(request: Request) {
  const payload = parseFoundationShareCardRequest(
    new URL(request.url).searchParams,
  )
  const resolved = payload ? resolveFoundationPayload(payload) : null
  if (!resolved) {
    return new Response("Invalid Foundation result payload.", { status: 400 })
  }
  const { lowDifferentiationThreshold } = getV2ScoringCalibration(
    resolved.scoringCalibration,
  )
  const input = buildFoundationShareCardInput(
    resolved.result,
    lowDifferentiationThreshold,
  )

  const { archetype, norm, coordinates } = input
  const cardCopy = buildFoundationCardCopy(archetype, norm)
  const isBlend = archetype.code.includes("/")
  const hasCjkTitle = /[\u3000-\u9fff]/u.test(cardCopy.name)
  const titleSize =
    cardCopy.name.length > 27 ? 58 : cardCopy.name.length > 13 ? 70 : 84
  const dotLeft = 35 + ((coordinates.x + 1) / 2) * 270 - 9
  const dotTop = 35 + ((1 - coordinates.y) / 2) * 270 - 9
  const cardFonts = await loadCardFonts()

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "48px 56px 42px",
          color: "#eef2f7",
          background: "#0a1322",
          fontFamily: "Archivo",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingBottom: 18,
            borderBottom: "2px solid #cea857",
            color: "#c7d2e0",
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: "0.12em",
          }}
        >
          <span>IR WORLDVIEW INVENTORY</span>
          <span style={{ color: "#cea857", letterSpacing: "0.04em" }}>
            FOUNDATION PROFILE
          </span>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "stretch",
            justifyContent: "space-between",
            paddingTop: 32,
          }}
        >
          <div
            style={{
              width: 704,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              paddingRight: 44,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  color: "#cea857",
                  fontSize: 30,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                }}
              >
                {cardCopy.readingCode}
              </div>
              <div
                style={{
                  display: "flex",
                  marginTop: 8,
                  color: "#f7f5ef",
                  fontFamily: "Newsreader, NotoArchetypes",
                  fontSize: titleSize,
                  fontWeight: 400,
                  lineHeight: 0.98,
                  letterSpacing: "-0.035em",
                  whiteSpace: hasCjkTitle && !isBlend ? "nowrap" : "normal",
                }}
              >
                {cardCopy.name}
              </div>
              <div
                style={{
                  display: "flex",
                  maxWidth: 650,
                  marginTop: 20,
                  color: "#c7d2e0",
                  fontSize: 27,
                  lineHeight: 1.28,
                }}
              >
                {cardCopy.gloss}
              </div>
            </div>

          </div>

          <div
            style={{
              width: 350,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderLeft: "1px solid #304563",
            }}
          >
            <div
              style={{
                width: 340,
                height: 340,
                display: "flex",
                position: "relative",
                color: "#8295ab",
                fontSize: 15,
                fontWeight: 700,
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 7,
                  left: 0,
                  width: "100%",
                  textAlign: "center",
                }}
              >
                IDEAS &amp; NORMS
              </span>
              <span
                style={{
                  position: "absolute",
                  bottom: 3,
                  left: 0,
                  width: "100%",
                  textAlign: "center",
                }}
              >
                MATERIAL STRUCTURE
              </span>
              <span style={{ position: "absolute", top: 159, left: 0 }}>
                POWER
              </span>
              <span style={{ position: "absolute", top: 159, right: 0 }}>
                RULES
              </span>
              <span
                style={{
                  position: "absolute",
                  top: 35,
                  left: 35,
                  width: 270,
                  height: 270,
                  display: "flex",
                  border: "2px solid #5a6c84",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  top: 170,
                  left: 35,
                  width: 270,
                  height: 1,
                  display: "flex",
                  background: "#5a6c84",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  top: 35,
                  left: 170,
                  width: 1,
                  height: 270,
                  display: "flex",
                  background: "#5a6c84",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  top: dotTop,
                  left: dotLeft,
                  width: 18,
                  height: 18,
                  display: "flex",
                  border: "4px solid #0a1322",
                  borderRadius: "50%",
                  background: "#cea857",
                  boxShadow: "0 0 0 2px #f7f5ef",
                }}
              />
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            paddingTop: 18,
            borderTop: "1px solid #304563",
            color: "#c7d2e0",
            fontSize: 19,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 5,
            }}
          >
            <span>Closest modeled family shown as a continuous profile</span>
            {archetype.analogue ? (
              <span style={{ color: "#8295ab", fontSize: 16 }}>
                Historical analogue · {archetype.analogue.label},{" "}
                {archetype.analogue.year}
              </span>
            ) : null}
          </div>
          <span style={{ color: "#f7f5ef", fontWeight: 700 }}>
            irworldview.jhyip.com
          </span>
        </div>
      </div>
    ),
    {
      ...CARD_SIZE,
      headers: {
        "cache-control": "public, max-age=86400, s-maxage=604800",
      },
      fonts: cardFonts
        ? [
            {
              name: "Newsreader",
              data: cardFonts.display,
              weight: 400,
              style: "normal",
            },
            {
              name: "NotoArchetypes",
              data: cardFonts.cjk,
              weight: 400,
              style: "normal",
            },
            {
              name: "Archivo",
              data: cardFonts.sans,
              weight: 400,
              style: "normal",
            },
            {
              name: "Archivo",
              data: cardFonts.sansBold,
              weight: 700,
              style: "normal",
            },
          ]
        : undefined,
    },
  )
}

function loadCardFonts(): Promise<CardFonts | null> {
  cardFontsPromise ??= Promise.all([
    readFile(
      join(process.cwd(), "public", "fonts", "newsreader-latin.ttf"),
    ),
    readFile(
      join(process.cwd(), "public", "fonts", "noto-cjk-archetypes.otf"),
    ),
    readFile(
      join(process.cwd(), "public", "fonts", "archivo-latin.ttf"),
    ),
    readFile(
      join(process.cwd(), "public", "fonts", "archivo-latin-bold.ttf"),
    ),
  ])
    .then(([display, cjk, sans, sansBold]) => ({
      display: toArrayBuffer(display),
      cjk: toArrayBuffer(cjk),
      sans: toArrayBuffer(sans),
      sansBold: toArrayBuffer(sansBold),
    }))
    .catch(() => null)

  return cardFontsPromise
}

function toArrayBuffer(data: Buffer): ArrayBuffer {
  return data.buffer.slice(
    data.byteOffset,
    data.byteOffset + data.byteLength,
  ) as ArrayBuffer
}
