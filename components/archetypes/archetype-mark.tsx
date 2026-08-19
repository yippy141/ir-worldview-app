import {
  formatArchetypeCodeSpeech,
  formatArchetypeDisplayCode,
  type ArchetypeDisplayCode,
} from "@/lib/archetype-display"
import {
  ARCHETYPE_MARK_DIRECTORY_SIZE,
  ARCHETYPE_MARK_HERO_SIZE,
  ARCHETYPE_MARK_MIN_PICTORIAL_SIZE,
  getArchetypeMark,
  type ArchetypeMarkNode,
  type PureArchetypeCode,
} from "@/lib/archetype-marks"
import {
  getArchetypeByCode,
  type BlendArchetype,
} from "@/lib/archetypes"

type MarkAccessibilityProps =
  | Readonly<{ decorative?: true; label?: never }>
  | Readonly<{ decorative: false; label: string }>

type SharedArchetypeMarkProps = Readonly<{
  code: PureArchetypeCode
  size?: number
  className?: string
}>

export type ArchetypeMarkProps = SharedArchetypeMarkProps &
  MarkAccessibilityProps

export type FoundationMarkPresentation = "hero" | "compact"

type SharedFoundationMarkProps = Readonly<{
  presentation?: FoundationMarkPresentation
  className?: string
}>

type PureFoundationMarkProps = SharedFoundationMarkProps &
  MarkAccessibilityProps &
  Readonly<{
    code: PureArchetypeCode
    primaryCode?: never
  }>

type BlendFoundationMarkProps = SharedFoundationMarkProps &
  Readonly<{
    code: BlendArchetype["code"]
    primaryCode: PureArchetypeCode
    decorative?: never
    label?: never
  }>

export type FoundationMarkProps =
  | PureFoundationMarkProps
  | BlendFoundationMarkProps

const HALLMARK_RUNNER_STYLE = {
  border: "1px solid currentColor",
  display: "inline-grid",
  lineHeight: 0,
  placeItems: "center",
} as const

function classNames(...values: Array<string | undefined>): string {
  return values.filter(Boolean).join(" ")
}

function renderMarkNode(node: ArchetypeMarkNode, key: string) {
  const paint = {
    fill: node.fill,
    stroke: node.stroke,
    strokeWidth: node.strokeWidth,
    strokeLinecap: node.strokeLinecap,
    strokeLinejoin: node.strokeLinejoin,
  }

  if (node.kind === "group") {
    return (
      <g key={key} {...paint}>
        {node.children.map((child, index) =>
          renderMarkNode(child, `${key}-${index}`),
        )}
      </g>
    )
  }
  if (node.kind === "path") {
    return <path key={key} d={node.d} {...paint} />
  }
  return (
    <circle
      key={key}
      cx={node.cx}
      cy={node.cy}
      r={node.r}
      {...paint}
    />
  )
}

/**
 * Renders one pure System A mark. Below the contracted pictorial threshold it
 * fails over to the visible canonical code instead of shrinking the artwork.
 */
export function ArchetypeMark(props: ArchetypeMarkProps) {
  const {
    code,
    size = ARCHETYPE_MARK_DIRECTORY_SIZE,
    className,
  } = props
  const definition = getArchetypeMark(code)
  const decorative = props.decorative !== false
  const meaningfulLabel =
    !decorative && typeof props.label === "string" ? props.label.trim() : ""

  if (
    !definition ||
    !Number.isFinite(size) ||
    size <= 0 ||
    (!decorative && meaningfulLabel.length === 0)
  ) {
    return null
  }

  if (size < ARCHETYPE_MARK_MIN_PICTORIAL_SIZE) {
    return (
      <span
        className={classNames(
          "archetype-mark",
          "archetype-mark--code",
          className,
        )}
        data-archetype-mark={code}
        data-archetype-mark-render="code"
        data-archetype-mark-size={size}
        aria-hidden={decorative ? "true" : undefined}
        aria-label={decorative ? undefined : meaningfulLabel}
        role={decorative ? undefined : "img"}
      >
        {formatArchetypeDisplayCode(code)}
      </span>
    )
  }

  return (
    <svg
      className={classNames(
        "archetype-mark",
        "archetype-mark--pictorial",
        className,
      )}
      data-archetype-mark={code}
      data-archetype-mark-render="pictorial"
      data-archetype-mark-size={size}
      viewBox={definition.viewBox}
      width={size}
      height={size}
      aria-hidden={decorative ? "true" : undefined}
      aria-label={decorative ? undefined : meaningfulLabel}
      role={decorative ? undefined : "img"}
      focusable="false"
    >
      {definition.nodes.map((node, index) =>
        renderMarkNode(node, `${code}-${index}`),
      )}
    </svg>
  )
}

function isBlendCode(
  code: ArchetypeDisplayCode,
): code is BlendArchetype["code"] {
  return /^[PRMS]\/[PRMS][+-]$/u.test(code)
}

function sizeForPresentation(
  presentation: FoundationMarkPresentation,
): typeof ARCHETYPE_MARK_HERO_SIZE | typeof ARCHETYPE_MARK_DIRECTORY_SIZE {
  return presentation === "hero"
    ? ARCHETYPE_MARK_HERO_SIZE
    : ARCHETYPE_MARK_DIRECTORY_SIZE
}

/**
 * Composes Foundation artwork without creating a blend mark. Hero blends use
 * an equal-size Diptych; compact blends use a Hallmark with a bordered 32px
 * runner-up. The blend code and both names remain visible in either mode.
 */
export function FoundationMark(props: FoundationMarkProps) {
  const presentation = props.presentation ?? "compact"
  const size = sizeForPresentation(presentation)

  if (!isBlendCode(props.code)) {
    const accessibility =
      props.decorative === false
        ? { decorative: false as const, label: props.label }
        : { decorative: true as const }

    return (
      <span
        className={classNames(
          "foundation-mark",
          "foundation-mark--pure",
          `foundation-mark--${presentation}`,
          props.className,
        )}
        data-foundation-mark="pure"
        data-foundation-mark-presentation={presentation}
      >
        <ArchetypeMark code={props.code} size={size} {...accessibility} />
      </span>
    )
  }

  const resolved = getArchetypeByCode(props.code)
  if (!resolved || !("archetypes" in resolved)) return null

  const leading = resolved.archetypes.find(
    ({ code }) => code === props.primaryCode,
  )
  const other = resolved.archetypes.find(
    ({ code }) => code !== props.primaryCode,
  )
  if (!leading || !other) return null

  const isDiptych = presentation === "hero"
  // A Diptych is equal-weight artwork, so it follows the blend's canonical
  // code/name order. Only the compact Hallmark distinguishes a scored leader.
  const [primary, runnerUp] = isDiptych
    ? resolved.archetypes
    : [leading, other]
  const runnerUpSize = isDiptych
    ? ARCHETYPE_MARK_HERO_SIZE
    : ARCHETYPE_MARK_MIN_PICTORIAL_SIZE
  const layout = isDiptych ? "diptych" : "hallmark"

  return (
    <span
      className={classNames(
        "foundation-mark",
        `foundation-mark--${presentation}`,
        `foundation-mark--${layout}`,
        props.className,
      )}
      data-foundation-mark="blend"
      data-foundation-mark-code={props.code}
      data-foundation-mark-layout={layout}
      data-foundation-mark-presentation={presentation}
    >
      <span
        className="foundation-mark__visual"
        data-foundation-mark-visual
        aria-hidden="true"
      >
        <span
          className="foundation-mark__panel foundation-mark__primary"
          data-foundation-mark-primary={primary.code}
        >
          <ArchetypeMark code={primary.code} size={size} />
        </span>
        {isDiptych ? (
          <span
            className="foundation-mark__connector"
            data-foundation-mark-connector
            aria-hidden="true"
          >
            /
          </span>
        ) : null}
        <span
          className="foundation-mark__panel foundation-mark__runner-up"
          data-foundation-mark-runner-up={runnerUp.code}
          data-foundation-mark-bordered={isDiptych ? undefined : "true"}
          style={isDiptych ? undefined : HALLMARK_RUNNER_STYLE}
        >
          <ArchetypeMark code={runnerUp.code} size={runnerUpSize} />
        </span>
      </span>
      <span className="foundation-mark__label" data-foundation-mark-label>
        <span
          data-foundation-mark-code-label
          aria-label={formatArchetypeCodeSpeech(props.code)}
        >
          {formatArchetypeDisplayCode(props.code)}
        </span>{" "}
        <span data-foundation-mark-name={primary.code}>{primary.name}</span>
        {" / "}
        <span data-foundation-mark-name={runnerUp.code}>{runnerUp.name}</span>
      </span>
    </span>
  )
}
