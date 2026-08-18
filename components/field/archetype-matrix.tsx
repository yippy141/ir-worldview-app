import Link from "next/link"
import type { CSSProperties } from "react"
import {
  ArchetypeMark,
  FoundationMark,
} from "@/components/archetypes/archetype-mark"
import {
  formatArchetypeCodeSpeech,
  formatArchetypeDisplayCode,
} from "@/lib/archetype-display"
import {
  ARCHETYPE_MATRIX_CELLS,
  ARCHETYPE_MATRIX_LENSES,
  activeMatrixCodes,
  type WorldviewMapBaseline,
} from "@/lib/field/archetype-matrix"
import { getArchetypePath } from "@/lib/archetypes"
import styles from "./worldview-map.module.css"

const MATRIX_HEADING_ID = "foundation-archetype-matrix-heading"
const MATRIX_BASELINE_ID = "foundation-archetype-matrix-baseline"

export type ArchetypeMatrixProps = Readonly<{
  baseline: WorldviewMapBaseline | null
}>

type MatrixConnector = Readonly<{
  startColumn: number
  endColumn: number
  posture: "+" | "-"
}>

function connectorFor(
  activeCodes: readonly string[],
): MatrixConnector | null {
  if (activeCodes.length !== 2) return null

  const activeCells = activeCodes
    .map((code) =>
      ARCHETYPE_MATRIX_CELLS.find(
        (cell) => cell.archetypeCode === code,
      ),
    )
    .filter((cell): cell is (typeof ARCHETYPE_MATRIX_CELLS)[number] =>
      Boolean(cell),
    )

  if (
    activeCells.length !== 2 ||
    activeCells[0].posture !== activeCells[1].posture
  ) {
    return null
  }

  const columns = activeCells.map((cell) =>
    ARCHETYPE_MATRIX_LENSES.findIndex(({ lens }) => lens === cell.lens),
  )
  if (columns.some((column) => column < 0)) return null

  return {
    startColumn: Math.min(...columns),
    endColumn: Math.max(...columns),
    posture: activeCells[0].posture,
  }
}

function connectorStyle(connector: MatrixConnector): CSSProperties {
  const spannedColumns = connector.endColumn - connector.startColumn + 1

  return {
    gridColumn: `${connector.startColumn + 1} / ${connector.endColumn + 2}`,
    gridRow: connector.posture === "+" ? 2 : 3,
    marginInline: `${50 / spannedColumns}%`,
  }
}

/**
 * The categorical Foundation reference structure. Its lens-major document
 * order is also its narrow-screen order; CSS alone turns the same eight-entry
 * semantic list into the desktop 4 x 2 matrix.
 */
export function ArchetypeMatrix({ baseline }: ArchetypeMatrixProps) {
  const resolvedArchetype = baseline?.resolvedArchetype ?? null
  const activeCodes = activeMatrixCodes(resolvedArchetype)
  const activeCodeSet = new Set(activeCodes)
  const connector = connectorFor(activeCodes)
  const blend = activeCodes.length === 2

  return (
    <section
      className={styles.matrixSection}
      aria-labelledby={MATRIX_HEADING_ID}
      data-archetype-matrix
      data-archetype-matrix-baseline={
        baseline ? (blend ? "blend" : "pure") : "none"
      }
    >
      <header className={styles.matrixHeader}>
        <h2 id={MATRIX_HEADING_ID}>Foundation archetype matrix</h2>
        <p>
          Four explanatory lenses, each shown in an applying-advantage and a
          restraint posture. The cells are reference points, not ranks.
        </p>
      </header>

      <div className={styles.matrixLayout}>
        <div className={styles.matrixPostureLabels} aria-hidden="true">
          <span />
          <span className={styles.matrixPostureLabel}>
            <span className={styles.matrixPostureSign}>+</span>
            <strong>Applying advantage</strong>
          </span>
          <span className={styles.matrixPostureLabel}>
            <span className={styles.matrixPostureSign}>&minus;</span>
            <strong>Restraint</strong>
          </span>
        </div>

        <ol
          className={styles.matrixLensList}
          aria-label="Eight Foundation archetypes grouped by explanatory lens"
        >
          {ARCHETYPE_MATRIX_LENSES.map(({ lens, label }, column) => {
            const cells = ARCHETYPE_MATRIX_CELLS.filter(
              (cell) => cell.lens === lens,
            )

            return (
              <li
                className={styles.matrixLensGroup}
                data-matrix-lens={lens}
                key={lens}
                style={{ "--matrix-column": column + 1 } as CSSProperties}
              >
                <h3 className={styles.matrixLensHeading}>{label}</h3>
                <ol
                  className={styles.matrixCellList}
                  aria-label={`${label} archetypes`}
                >
                  {cells.map((cell) => {
                    const active = activeCodeSet.has(cell.archetypeCode)
                    const codeLabel = formatArchetypeDisplayCode(
                      cell.archetypeCode,
                    )

                    return (
                      <li
                        className={`${styles.matrixCellItem}${
                          active ? ` ${styles.matrixCellItemActive}` : ""
                        }`}
                        data-archetype-matrix-cell={cell.archetypeCode}
                        data-archetype-code={cell.archetypeCode}
                        data-archetype-matrix-active={active ? "true" : undefined}
                        data-matrix-posture={cell.posture}
                        key={cell.archetypeCode}
                      >
                        <Link
                          className={styles.matrixCellLink}
                          href={getArchetypePath(cell.archetypeCode)}
                          aria-label={`${
                            active
                              ? blend
                                ? "Shared result. "
                                : "Your result. "
                              : ""
                          }Open ${cell.archetype.name}, ${formatArchetypeCodeSpeech(cell.archetypeCode)}, ${cell.postureLabel}`}
                          aria-describedby={active ? MATRIX_BASELINE_ID : undefined}
                        >
                          <span className={styles.matrixCellPosture}>
                            {cell.postureLabel}
                          </span>
                          <span className={styles.matrixCellIdentity}>
                            <ArchetypeMark
                              code={cell.archetypeCode}
                              size={48}
                              className={styles.matrixMark}
                            />
                            <span
                              className={styles.matrixCellCode}
                              data-archetype-code-label
                              aria-label={formatArchetypeCodeSpeech(
                                cell.archetypeCode,
                              )}
                            >
                              {codeLabel}
                            </span>
                          </span>
                          <strong className={styles.matrixCellName}>
                            {cell.archetype.name}
                          </strong>
                          {active ? (
                            <span className={styles.matrixActiveLabel}>
                              {blend ? "Shared result" : "Your result"}
                            </span>
                          ) : null}
                        </Link>
                      </li>
                    )
                  })}
                </ol>
              </li>
            )
          })}

          {connector ? (
            <li
              className={styles.matrixBlendConnector}
              style={connectorStyle(connector)}
              data-archetype-matrix-connector
              data-matrix-posture={connector.posture}
              aria-hidden="true"
            />
          ) : null}
        </ol>
      </div>

      <MatrixBaseline baseline={baseline} />
    </section>
  )
}

function MatrixBaseline({
  baseline,
}: Readonly<{ baseline: WorldviewMapBaseline | null }>) {
  if (!baseline) {
    return (
      <div
        id={MATRIX_BASELINE_ID}
        className={`${styles.matrixBaseline} ${styles.matrixBaselineEmpty}`}
        data-matrix-baseline-detail="none"
      >
        <h3>No Foundation baseline yet</h3>
        <p>
          The full matrix remains available as a reference. Complete the{" "}
          <Link href="/quiz">Foundation</Link> to highlight your reading.
        </p>
      </div>
    )
  }

  const archetype = baseline.resolvedArchetype
  const isBlend = "archetypes" in archetype

  return (
    <div
      id={MATRIX_BASELINE_ID}
      className={styles.matrixBaseline}
      data-matrix-baseline-detail={isBlend ? "blend" : "pure"}
    >
      <div className={styles.matrixBaselineHeading}>
        <div>
          <h3>Your Foundation reading</h3>
          <p className={styles.matrixBaselineIdentity}>
            <strong>{archetype.name}</strong>
            <span
              className={styles.matrixBaselineCode}
              data-foundation-mark-code-label
              aria-label={formatArchetypeCodeSpeech(archetype.code)}
            >
              {formatArchetypeDisplayCode(archetype.code)}
            </span>
          </p>
          <p>{archetype.gloss}</p>
        </div>
        <dl className={styles.matrixNormativeState}>
          <div>
            <dt>Normative orientation</dt>
            <dd data-matrix-normative-alias>
              {baseline.normativeState.publicLabel}
            </dd>
          </div>
        </dl>
      </div>

      <div className={styles.matrixFoundationMark}>
        {isBlend ? (
          <FoundationMark
            code={archetype.code}
            primaryCode={baseline.leadingPureCode}
            presentation="hero"
          />
        ) : (
          <FoundationMark code={archetype.code} presentation="hero" />
        )}
      </div>

      {isBlend ? (
        <p className={styles.matrixBlendNote}>
          Both highlighted cells belong to the same result and share the same
          posture. The connection does not create a midpoint or a new mark.
        </p>
      ) : null}
    </div>
  )
}
