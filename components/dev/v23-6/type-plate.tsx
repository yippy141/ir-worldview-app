"use client"

import { zhHansWorldStageUi } from "@/content/locales/zh-Hans/world-stage"
import { ArmillaryVisual } from "./armillary-visual"
import { RootShell, type RootTypeTreatment } from "./root-shell"
import styles from "./type-plate.module.css"

const TREATMENTS: ReadonlyArray<{
  id: RootTypeTreatment
  title: string
  stack: string
  note: string
}> = [
  {
    id: "a",
    title: "A. Corrected current stack",
    stack: "Newsreader display, Archivo interface, Space Mono for the saved date",
    note: "The three roles the design authority already names, with the serif kept for editorial voice, the interface entirely in the sans, and mono limited to the one date stamp. No tracked uppercase and no numbered menu indices.",
  },
  {
    id: "b",
    title: "B. Personal-site continuity",
    stack: "Serif carries the menu, small quiet sans, system mono",
    note: "Reproduces the measured relationships on jhyip.com: a serif that carries the wordmark, the heading, and the item titles at 500 weight with tight negative tracking; a sans that stays at 15px and never grows; a restrained display scale near twice body; and the system mono stack.",
  },
  {
    id: "c",
    title: "C. Single-family modernist",
    stack: "Archivo only, across every role",
    note: "One bundled family. Hierarchy comes from a wide scale range, a light display weight, whitespace, and a single left alignment. No mono role exists, so the saved date is set in the same family at a smaller size.",
  },
]

const BOARDS = [
  { id: "desktop", label: "1440 by 900", width: 1440, height: 900, scale: 0.5 },
  { id: "mobile", label: "390 by 812", width: 390, height: 812, scale: 0.62 },
] as const

function Board({
  treatment,
  board,
}: Readonly<{
  treatment: RootTypeTreatment
  board: (typeof BOARDS)[number]
}>) {
  return (
    <figure className={styles.board} data-board={board.id}>
      <div
        className={styles.viewport}
        style={{
          width: board.width * board.scale,
          height: board.height * board.scale,
        }}
      >
        <div
          className={styles.canvas}
          style={{
            width: board.width,
            height: board.height,
            transform: `scale(${board.scale})`,
            ["--root-viewport-height" as string]: `${board.height}px`,
          }}
        >
          <RootShell
            variant="type-plate"
            container="div"
            typeTreatment={treatment}
            visitor="returning"
            reducedMotionOverride
            renderVisual={(state) => <ArmillaryVisual {...state} />}
          />
        </div>
      </div>
      <figcaption>{board.label}</figcaption>
    </figure>
  )
}

/**
 * One composition, three type treatments, two widths.
 *
 * Layout, copy, document order, and the still armillary are held constant so
 * the only variable on this page is typography. The plate does not name a
 * winner. The comparison rows below record what each treatment costs.
 */
export function TypePlate() {
  return (
    <main className={styles.plate} id="site-main">
      <header className={styles.head}>
        <h1>Typography plate</h1>
        <p>
          The same root composition in three treatments at 1440 and 390 CSS
          pixels. The visual is the still armillary in every board, and the
          returning-visitor state is forced so the date stamp is present to
          compare. Each treatment can also be opened full screen with the type
          parameter on either root prototype.
        </p>
      </header>

      {TREATMENTS.map((treatment) => (
        <section
          className={styles.treatment}
          key={treatment.id}
          data-treatment={treatment.id}
          aria-labelledby={`treatment-${treatment.id}`}
        >
          <div className={styles.treatmentHead}>
            <h2 id={`treatment-${treatment.id}`}>{treatment.title}</h2>
            <p className={styles.stackLine}>{treatment.stack}</p>
            <p className={styles.noteLine}>{treatment.note}</p>
            <p className={styles.specimen} data-treatment-specimen={treatment.id}>
              <span lang="zh-Hans">{zhHansWorldStageUi.heading}</span>
            </p>
          </div>

          <div className={styles.boards}>
            {BOARDS.map((board) => (
              <Board board={board} key={board.id} treatment={treatment.id} />
            ))}
          </div>
        </section>
      ))}
    </main>
  )
}
