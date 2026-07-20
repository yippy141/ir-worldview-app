import { ImageResponse } from "next/og"
import { zhHansOpenGraphImageCopy } from "@/content/locales/zh-Hans/metadata"

export const alt = "国际关系世界观清单当前案例"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function ZhHansCurrentCaseOpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const copy = zhHansOpenGraphImageCopy.case(slug)

  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 72px", color: "#f4f1ea", background: "#111827", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 24, borderBottom: "2px solid #b89a61", fontSize: 24 }}>
        <span>{copy.brand}</span>
        <span style={{ color: "#c9b991" }}>{copy.eyebrow}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ maxWidth: 1000, fontSize: copy.title.length > 28 ? 54 : 66, lineHeight: 1.18 }}>{copy.title}</div>
        <div style={{ maxWidth: 940, color: "#cbd5e1", fontSize: 27, lineHeight: 1.5 }}>{copy.decision}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", color: "#c9b991", fontSize: 22 }}>
        <span>{copy.footer}</span>
        <span>{copy.sourceCount}</span>
      </div>
    </div>,
    size,
  )
}
