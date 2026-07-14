"use client"

import Link from "next/link"
import { useState } from "react"
import { SectionStage } from "@/components/landing/section-stage"
import { getSectionStage } from "@/lib/world-stage/section-stages"
import styles from "./focus-areas.module.css"

export type FocusTheatreViewModel = {
  slug: string
  shortTitle: string
  title: string
  subtitle: string
  description: string
  laneLabels: readonly string[]
  standardTime: string
  advancedTime: string
  standardQuestionCount: number
  advancedQuestionCount: number
  doesNotClaim: string
}

type FocusTheatresProps = {
  theatres: readonly FocusTheatreViewModel[]
  foundationQuery: string
}

const focusStage = getSectionStage("focus-areas")

export function FocusTheatres({ theatres, foundationQuery }: FocusTheatresProps) {
  const [activeSlug, setActiveSlug] = useState(theatres[0]?.slug ?? "security")

  return (
    <div className={styles.theatres}>
      <div className={styles.theatreList} role="list">
        {theatres.map((theatre) => {
          const isActive = theatre.slug === activeSlug

          return (
            <article
              key={theatre.slug}
              role="listitem"
              className={styles.theatre}
              data-active={isActive ? "true" : "false"}
              onPointerEnter={() => setActiveSlug(theatre.slug)}
              onFocusCapture={() => setActiveSlug(theatre.slug)}
            >
              <p className={styles.theatreKicker}>
                <span className={styles.theatreDot} data-theatre={theatre.slug} aria-hidden="true" />
                {theatre.shortTitle}
              </p>
              <h3 className={styles.theatreTitle}>{theatre.title}</h3>
              <p className={styles.theatreSubtitle}>{theatre.subtitle}</p>
              <p className={styles.theatreDescription}>{theatre.description}</p>
              <dl className={styles.theatreMeta}>
                <div>
                  <dt>Covers</dt>
                  <dd>{theatre.laneLabels.join(" · ")}</dd>
                </div>
                <div>
                  <dt>Length</dt>
                  <dd>
                    Standard {theatre.standardTime} ({theatre.standardQuestionCount} questions) ·
                    Advanced {theatre.advancedTime} ({theatre.advancedQuestionCount})
                  </dd>
                </div>
                <div>
                  <dt>Does not claim</dt>
                  <dd>{theatre.doesNotClaim}.</dd>
                </div>
              </dl>
              <p className={styles.theatreAction}>
                <Link href={`/modules/${theatre.slug}${foundationQuery}`} className="cta-primary">
                  Open {theatre.shortTitle}
                </Link>
              </p>
            </article>
          )
        })}
      </div>

      <SectionStage
        stage={focusStage}
        activeGroupId={activeSlug}
        variant="panel"
        className={styles.theatreStage}
      />
    </div>
  )
}
