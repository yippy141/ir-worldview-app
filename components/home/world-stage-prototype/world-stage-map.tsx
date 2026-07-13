import type { WorldStageSceneId } from "@/lib/world-stage/types"
import styles from "./world-stage-prototype.module.css"

type WorldStageMapProps = {
  activeScene: WorldStageSceneId
}

type SceneGroupProps = {
  scene: WorldStageSceneId
  activeScene: WorldStageSceneId
  children: React.ReactNode
}

function SceneGroup({ scene, activeScene, children }: SceneGroupProps) {
  return (
    <g
      className={`${styles.scene} ${activeScene === scene ? styles.sceneActive : ""}`}
      data-scene={scene}
    >
      {children}
    </g>
  )
}

export function WorldStageMap({ activeScene }: WorldStageMapProps) {
  return (
    <div className={styles.mapFrame} aria-hidden="true">
      <svg
        className={styles.mapSvg}
        viewBox="0 0 1200 620"
        preserveAspectRatio="xMidYMid meet"
      >
        <g className={styles.graticule}>
          <path d="M55 155H1145M35 310H1165M55 465H1145" />
          <path d="M205 45V575M400 24V596M600 14V606M800 24V596M995 45V575" />
          <ellipse cx="600" cy="310" rx="565" ry="274" />
          <ellipse cx="600" cy="310" rx="565" ry="160" />
        </g>

        <g className={styles.landmass}>
          <path d="M105 162l44-52 63-31 87-3 46 29 47 8 30 35-28 31-46-7-21 31-43 1-18 38-42 13-31-31-63-6-42-26z" />
          <path d="M281 255l52 17 28 46-5 69-26 77-36 75-30-25 2-65-25-47 14-49-28-54 31-14z" />
          <path d="M451 119l57-39 71 8 45 26 71-10 46 27 75-16 75 23 45 42-33 35-60 3-29 33-54 7-25-21-43 18-31-21-55 11-34-30-56-8-35-39-48-8z" />
          <path d="M527 247l67-14 63 31 21 63-25 58-24 91-45 31-31-55-17-62-36-50 6-59z" />
          <path d="M749 259l43-14 43 22 11 35-39 16-28-23-31-3z" />
          <path d="M888 392l59-30 55 20 36 46-24 42-68 6-53-37z" />
          <path d="M304 77l34-45 57 13 20 43-49 29-45-10z" />
          <path d="M1032 298l26-11 23 15-20 20z" />
        </g>

        <g className={styles.coastlineEcho}>
          <path d="M96 153l47-57 67-34 92 1" />
          <path d="M444 108l61-43 78 7" />
          <path d="M876 385l68-39 69 21" />
        </g>

        <SceneGroup scene="foundation" activeScene={activeScene}>
          <g className={styles.foundationRoutes}>
            <path d="M216 191C373 128 467 160 573 286" />
            <path d="M573 286C692 185 807 180 922 219" />
            <path d="M573 286C674 359 795 410 946 421" />
            <path d="M216 191C303 276 377 338 573 286" />
          </g>
          <g className={styles.foundationNodes}>
            {[
              [216, 191],
              [341, 324],
              [573, 286],
              [714, 205],
              [922, 219],
              [946, 421],
              [605, 420],
            ].map(([cx, cy], index) => (
              <g key={`${cx}-${cy}`} transform={`translate(${cx} ${cy})`}>
                <circle r={index === 2 ? 15 : 11} />
                <path d="M0-5 5 0 0 5-5 0Z" />
              </g>
            ))}
          </g>
        </SceneGroup>

        <SceneGroup scene="perspectives" activeScene={activeScene}>
          <g className={styles.perspectiveRoutes}>
            <path d="M254 237C376 105 587 106 741 190" />
            <path d="M254 237C416 291 540 351 690 408" />
            <path d="M254 237C479 207 731 246 951 372" />
          </g>
          <g className={styles.perspectiveFrames}>
            <path d="M196 179v-25h25M288 154h25v25M313 271v25h-25M221 296h-25v-25" />
            <path d="M689 151v-21h21M773 130h21v21M794 223v21h-21M710 244h-21v-21" />
            <path d="M639 368v-21h21M723 347h21v21M744 440v21h-21M660 461h-21v-21" />
            <path d="M899 330v-21h21M983 309h21v21M1004 402v21h-21M920 423h-21v-21" />
          </g>
          <g className={styles.perspectiveNodes}>
            <g transform="translate(254 237)">
              <circle r="18" />
              <circle r="5" />
            </g>
            <g transform="translate(741 190)">
              <circle r="12" />
              <path d="M-5 0H5M0-5V5" />
            </g>
            <g transform="translate(690 408)">
              <circle r="12" />
              <path d="M-5 0H5M0-5V5" />
            </g>
            <g transform="translate(951 372)">
              <circle r="12" />
              <path d="M-5 0H5M0-5V5" />
            </g>
          </g>
        </SceneGroup>

        <SceneGroup scene="futures" activeScene={activeScene}>
          <g className={styles.futureRoutes}>
            <path d="M178 220C342 179 436 204 549 278S777 358 1009 275" />
            <path d="M296 404C436 334 553 330 682 241S850 137 1004 170" />
            <path d="M549 278 682 241M682 241 811 337M549 278 435 388" />
          </g>
          <g className={styles.futureNodes}>
            {[
              [178, 220, "square"],
              [296, 404, "diamond"],
              [435, 388, "square"],
              [549, 278, "diamond"],
              [682, 241, "square"],
              [811, 337, "diamond"],
              [1004, 170, "square"],
              [1009, 275, "diamond"],
            ].map(([x, y, shape]) => (
              <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
                {shape === "square" ? (
                  <rect x="-9" y="-9" width="18" height="18" />
                ) : (
                  <path d="M0-12 12 0 0 12-12 0Z" />
                )}
                <circle r="3" />
              </g>
            ))}
          </g>
          <g className={styles.futureSignals}>
            <path d="M526 278a23 23 0 0 1 46 0M516 278a33 33 0 0 1 66 0" />
            <path d="M659 241a23 23 0 0 1 46 0M649 241a33 33 0 0 1 66 0" />
          </g>
        </SceneGroup>
      </svg>
    </div>
  )
}
