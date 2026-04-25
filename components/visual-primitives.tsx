import type { CSSProperties, ReactNode } from "react"

type CssVars = CSSProperties & Record<`--${string}`, string | number>

export type VisualTone =
  | "default"
  | "baseline"
  | "security"
  | "technology"
  | "ai"
  | "muted"

export type ScaleBarProps = {
  label?: string
  value: number
  min?: number
  max?: number
  lowLabel?: string
  highLabel?: string
  valueLabel?: string
  showValue?: boolean
  tone?: VisualTone
  className?: string
}

export function ScaleBar({
  label,
  value,
  min = 1,
  max = 7,
  lowLabel,
  highLabel,
  valueLabel,
  showValue = true,
  tone = "default",
  className,
}: ScaleBarProps) {
  const boundedValue = clamp(value, min, max)
  const percent = valueToPercent(boundedValue, min, max)
  const readableValue = valueLabel ?? `${formatValue(boundedValue)} / ${formatValue(max)}`
  const ariaLabel = label ? `${label}: ${readableValue}` : readableValue

  return (
    <div className={classNames("v10-scale-bar", className)} data-tone={tone}>
      {(label || showValue) ? (
        <div className="v10-scale-bar__meta">
          {label ? <span className="v10-scale-bar__label">{label}</span> : <span />}
          {showValue ? <span className="v10-scale-bar__value">{readableValue}</span> : null}
        </div>
      ) : null}

      <div
        className="v10-scale-bar__track"
        role="meter"
        aria-label={ariaLabel}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={boundedValue}
        aria-valuetext={readableValue}
      >
        <span
          className="v10-scale-bar__fill"
          style={{ "--v10-scale-value": `${percent}%` } as CssVars}
        />
      </div>

      {(lowLabel || highLabel) ? (
        <div className="v10-scale-bar__poles" aria-hidden="true">
          <span>{lowLabel}</span>
          <span>{highLabel}</span>
        </div>
      ) : null}
    </div>
  )
}

export type SegmentedLevelValue = "low" | "medium" | "high" | 1 | 2 | 3

export type SegmentedLevelProps = {
  label?: string
  level: SegmentedLevelValue
  showValue?: boolean
  compact?: boolean
  tone?: VisualTone
  className?: string
}

const LEVEL_LABELS: Record<1 | 2 | 3, string> = {
  1: "Low",
  2: "Medium",
  3: "High",
}

export function SegmentedLevel({
  label,
  level,
  showValue = true,
  compact = false,
  tone = "default",
  className,
}: SegmentedLevelProps) {
  const activeLevel = normalizeLevel(level)
  const readableValue = LEVEL_LABELS[activeLevel]
  const ariaLabel = label ? `${label}: ${readableValue}` : readableValue

  return (
    <div
      className={classNames("v10-segmented-level", compact && "v10-segmented-level--compact", className)}
      data-tone={tone}
      role="group"
      aria-label={ariaLabel}
    >
      {label ? <span className="v10-segmented-level__label">{label}</span> : null}
      <span className="v10-segmented-level__cells" aria-hidden="true">
        {[1, 2, 3].map((step) => (
          <span
            key={step}
            className={classNames(
              "v10-segmented-level__cell",
              step <= activeLevel && "v10-segmented-level__cell--active",
            )}
          />
        ))}
      </span>
      {showValue ? <span className="v10-segmented-level__value">{readableValue}</span> : null}
    </div>
  )
}

export type ComparisonMarkerShape = "bar" | "circle" | "square" | "diamond" | "triangle"

export type ComparisonSeries = {
  id: string
  label: string
  value: number
  valueLabel?: string
  shape?: ComparisonMarkerShape
  tone?: VisualTone
}

export type ComparisonRowProps = {
  label: string
  baseline: ComparisonSeries
  overlays?: ComparisonSeries[]
  min?: number
  max?: number
  lowLabel?: string
  highLabel?: string
  collisionThresholdPercent?: number
  showLegend?: boolean
  className?: string
}

type PlottedSeries = Required<Pick<ComparisonSeries, "shape" | "tone">> &
  ComparisonSeries & {
    percent: number
    offset: number
    readableValue: string
  }

const OVERLAY_SHAPES: ComparisonMarkerShape[] = ["circle", "square", "diamond", "triangle"]

export function ComparisonRow({
  label,
  baseline,
  overlays = [],
  min = 1,
  max = 7,
  lowLabel,
  highLabel,
  collisionThresholdPercent = 3,
  showLegend = true,
  className,
}: ComparisonRowProps) {
  const series = normalizeComparisonSeries(baseline, overlays, min, max)
  const plottedSeries = applyCollisionOffsets(series, collisionThresholdPercent)
  const ariaLabel = `${label}: ${plottedSeries
    .map((item) => `${item.label} ${item.readableValue}`)
    .join(", ")}`

  return (
    <div className={classNames("v10-comparison-row", className)}>
      <div className="v10-comparison-row__header">
        <p className="v10-comparison-row__label">{label}</p>
        {showLegend ? <ComparisonLegend series={plottedSeries} /> : null}
      </div>

      <div className="v10-comparison-row__scale">
        <span className="v10-comparison-row__end">{lowLabel ?? formatValue(min)}</span>
        <div className="v10-comparison-row__track" role="group" aria-label={ariaLabel}>
          <span className="v10-comparison-row__axis" aria-hidden="true" />
          {plottedSeries.map((item) => (
            <span
              key={item.id}
              className="v10-comparison-row__marker"
              data-tone={item.tone}
              style={{
                "--v10-comparison-position": `${item.percent}%`,
                "--v10-comparison-offset": `${item.offset}px`,
              } as CssVars}
              title={`${item.label}: ${item.readableValue}`}
            >
              <MarkerGlyph shape={item.shape} />
            </span>
          ))}
        </div>
        <span className="v10-comparison-row__end v10-comparison-row__end--high">
          {highLabel ?? formatValue(max)}
        </span>
      </div>
    </div>
  )
}

export type LayerRelationshipStatus =
  | "anchor"
  | "reinforces"
  | "complicates"
  | "diverges"
  | "pending"

export type LayerRelationshipItem = {
  id: string
  label: string
  title: string
  status: LayerRelationshipStatus
  statusLabel?: string
  text: string
  action?: ReactNode
}

export type LayerRelationshipStackProps = {
  items: LayerRelationshipItem[]
  ariaLabel?: string
  className?: string
}

export function LayerRelationshipStack({
  items,
  ariaLabel = "Profile layer relationships",
  className,
}: LayerRelationshipStackProps) {
  return (
    <div className={classNames("v10-layer-stack", className)} aria-label={ariaLabel}>
      {items.map((item) => (
        <article
          key={item.id}
          className="v10-layer-stack__item"
          data-status={item.status}
        >
          <div className="v10-layer-stack__meta">
            <p className="v10-layer-stack__label">{item.label}</p>
            <span className="v10-layer-stack__status">
              {item.statusLabel ?? statusLabel(item.status)}
            </span>
          </div>
          <h3 className="v10-layer-stack__title">{item.title}</h3>
          <p className="v10-layer-stack__text">{item.text}</p>
          {item.action ? <div className="v10-layer-stack__action">{item.action}</div> : null}
        </article>
      ))}
    </div>
  )
}

function ComparisonLegend({ series }: { series: PlottedSeries[] }) {
  return (
    <div className="v10-comparison-row__legend" aria-label="Comparison legend">
      {series.map((item) => (
        <span key={item.id} className="v10-comparison-row__legend-item">
          <span className="v10-comparison-row__legend-marker" data-tone={item.tone}>
            <MarkerGlyph shape={item.shape} />
          </span>
          <span>{item.label}</span>
          <span className="v10-comparison-row__legend-value">{item.readableValue}</span>
        </span>
      ))}
    </div>
  )
}

function MarkerGlyph({ shape }: { shape: ComparisonMarkerShape }) {
  if (shape === "bar") {
    return (
      <svg className="v10-marker-glyph" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <rect x="6" y="1.5" width="4" height="13" rx="1" fill="currentColor" />
      </svg>
    )
  }

  if (shape === "square") {
    return (
      <svg className="v10-marker-glyph" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <rect x="3" y="3" width="10" height="10" rx="1.5" fill="currentColor" />
      </svg>
    )
  }

  if (shape === "diamond") {
    return (
      <svg className="v10-marker-glyph" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path d="M8 1.8 14.2 8 8 14.2 1.8 8 8 1.8Z" fill="currentColor" />
      </svg>
    )
  }

  if (shape === "triangle") {
    return (
      <svg className="v10-marker-glyph" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path d="M8 2 14 13H2L8 2Z" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg className="v10-marker-glyph" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <circle cx="8" cy="8" r="5.5" fill="currentColor" />
    </svg>
  )
}

function normalizeComparisonSeries(
  baseline: ComparisonSeries,
  overlays: ComparisonSeries[],
  min: number,
  max: number,
): PlottedSeries[] {
  return [
    {
      ...baseline,
      shape: baseline.shape ?? "bar",
      tone: baseline.tone ?? "baseline",
    },
    ...overlays.map((overlay, index) => ({
      ...overlay,
      shape: overlay.shape ?? OVERLAY_SHAPES[index % OVERLAY_SHAPES.length],
      tone: overlay.tone ?? "default",
    })),
  ].map((item) => {
    const boundedValue = clamp(item.value, min, max)

    return {
      ...item,
      value: boundedValue,
      percent: valueToPercent(boundedValue, min, max),
      offset: 0,
      readableValue: item.valueLabel ?? formatValue(boundedValue),
    }
  })
}

function applyCollisionOffsets(
  series: PlottedSeries[],
  collisionThresholdPercent: number,
): PlottedSeries[] {
  const sorted = series
    .map((item, index) => ({ item, index }))
    .sort((a, b) => a.item.percent - b.item.percent)
  const offsets = new Array<number>(series.length).fill(0)
  const groups: Array<Array<{ item: PlottedSeries; index: number }>> = []

  for (const marker of sorted) {
    const group = groups.at(-1)
    const previousMarker = group?.at(-1)

    if (!group || !previousMarker || marker.item.percent - previousMarker.item.percent > collisionThresholdPercent) {
      groups.push([marker])
    } else {
      group.push(marker)
    }
  }

  for (const group of groups) {
    collisionOffsets(group.length).forEach((offset, index) => {
      offsets[group[index].index] = offset
    })
  }

  return series.map((item, index) => ({
    ...item,
    offset: offsets[index],
  }))
}

function collisionOffsets(count: number) {
  if (count <= 1) return [0]
  if (count === 2) return [-8, 8]

  const offsets = [0]
  for (let step = 1; offsets.length < count; step += 1) {
    offsets.push(-step * 9)
    if (offsets.length < count) offsets.push(step * 9)
  }

  return offsets
}

function normalizeLevel(level: SegmentedLevelValue): 1 | 2 | 3 {
  if (level === "low") return 1
  if (level === "medium") return 2
  if (level === "high") return 3
  return clamp(level, 1, 3) as 1 | 2 | 3
}

function valueToPercent(value: number, min: number, max: number) {
  if (max <= min) return 0
  return ((value - min) / (max - min)) * 100
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function formatValue(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1)
}

function statusLabel(status: LayerRelationshipStatus) {
  if (status === "anchor") return "Anchor"
  if (status === "reinforces") return "Reinforces"
  if (status === "complicates") return "Complicates"
  if (status === "diverges") return "Diverges"
  return "Pending"
}

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}
