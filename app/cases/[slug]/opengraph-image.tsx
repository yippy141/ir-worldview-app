import { ImageResponse } from "next/og"
import { getPublishedCurrentCaseBySlug } from "@/lib/current-cases/catalog"
import { CURRENT_CASE_CATEGORY_LABELS } from "@/lib/current-cases/presentation"

export const alt = "IR Worldview Inventory Current Case"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function CurrentCaseOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const record = getPublishedCurrentCaseBySlug(slug)
  const title = record?.title ?? "Current Case"
  const category = record
    ? CURRENT_CASE_CATEGORY_LABELS[record.category]
    : "World politics"
  const decision = record?.decision.prompt ?? "Make your judgment before reading the comparison."

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          color: "#f4f1ea",
          background: "#111827",
          fontFamily: "Georgia, Times New Roman, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: "24px",
            borderBottom: "2px solid #b89a61",
            fontFamily: "Arial, sans-serif",
            fontSize: 24,
          }}
        >
          <span>IR Worldview Inventory</span>
          <span style={{ color: "#c9b991" }}>Current Case · {category}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              maxWidth: 980,
              fontSize: title.length > 70 ? 54 : 66,
              lineHeight: 1.04,
              letterSpacing: "-0.03em",
            }}
          >
            {title}
          </div>
          <div
            style={{
              maxWidth: 920,
              color: "#cbd5e1",
              fontFamily: "Arial, sans-serif",
              fontSize: 27,
              lineHeight: 1.35,
            }}
          >
            {decision}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "#c9b991",
            fontFamily: "Arial, sans-serif",
            fontSize: 22,
          }}
        >
          <span>Read the evidence. Make the call.</span>
          <span>{record ? `${record.sources.length} direct sources` : "Editorial interactive"}</span>
        </div>
      </div>
    ),
    size,
  )
}
