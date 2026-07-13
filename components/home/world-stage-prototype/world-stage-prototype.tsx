"use client"

import Link from "next/link"
import { useRef, useState, type KeyboardEvent } from "react"
import { WorldStageMap, type WorldStageScene } from "./world-stage-map"
import styles from "./world-stage-prototype.module.css"

type MenuItem = {
  id: string
  index: string
  label: string
  scene: WorldStageScene
  lens: string
  description: string
  href: string
  action: string
}

const menuItems: MenuItem[] = [
  {
    id: "foundation",
    index: "01",
    label: "Foundation",
    scene: "foundation",
    lens: "Baseline judgments",
    description: "Build a baseline across seven recurring foreign-policy tradeoffs.",
    href: "/quiz",
    action: "Open Foundation",
  },
  {
    id: "focus-areas",
    index: "02",
    label: "Focus Areas",
    scene: "foundation",
    lens: "Issue-specific pressure",
    description: "Test how security, technology, and geoeconomics change the argument.",
    href: "/modules",
    action: "Open Focus Areas",
  },
  {
    id: "perspective-runs",
    index: "03",
    label: "Perspective Runs",
    scene: "perspectives",
    lens: "Judgment under context",
    description: "Revisit the same dimensions from a defined strategic situation.",
    href: "/perspectives",
    action: "Open Perspective Runs",
  },
  {
    id: "worldview-map",
    index: "04",
    label: "Worldview Map",
    scene: "perspectives",
    lens: "Modeled positions",
    description: "Browse nearby profiles, contextual movement, and the model’s limits.",
    href: "/explore/atlas",
    action: "Open Worldview Map",
  },
  {
    id: "ai-futures",
    index: "05",
    label: "AI & Futures",
    scene: "futures",
    lens: "Technology and order",
    description: "Examine AI governance choices and the futures those choices could shape.",
    href: "/ai",
    action: "Open AI Governance",
  },
  {
    id: "profile",
    index: "06",
    label: "My Profile",
    scene: "foundation",
    lens: "Your saved layers",
    description: "Return to your baseline, issue results, and contextual shifts on this device.",
    href: "/profile",
    action: "Open My Profile",
  },
]

const secondaryLinks = [
  { label: "Compare", href: "/compare" },
  { label: "About", href: "/" },
  { label: "Methods", href: "/method" },
  { label: "References", href: "/references" },
  { label: "Privacy", href: "/privacy" },
  { label: "Feedback", href: "/feedback" },
] as const

export function WorldStagePrototype() {
  const [activeIndex, setActiveIndex] = useState(0)
  const menuRefs = useRef<Array<HTMLButtonElement | null>>([])
  const activeItem = menuItems[activeIndex]

  function activate(index: number) {
    setActiveIndex(index)
  }

  function handleMenuKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number | null = null

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      nextIndex = (index + 1) % menuItems.length
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      nextIndex = (index - 1 + menuItems.length) % menuItems.length
    } else if (event.key === "Home") {
      nextIndex = 0
    } else if (event.key === "End") {
      nextIndex = menuItems.length - 1
    }

    if (nextIndex === null) return

    event.preventDefault()
    activate(nextIndex)
    menuRefs.current[nextIndex]?.focus()
  }

  return (
    <main className={styles.stage} id="site-main">
      <WorldStageMap activeScene={activeItem.scene} />

      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="IR Worldview Inventory home">
          <span className={styles.brandMark} aria-hidden="true">
            IR
          </span>
          <span>Worldview Inventory</span>
        </Link>
        <div className={styles.prototypeMeta}>
          <span>World Stage</span>
          <span>V17 prototype</span>
        </div>
      </header>

      <div className={styles.mapMeta} key={activeItem.id}>
        <p className={styles.lensLabel}>
          <span>Editorial lens</span>
          {activeItem.lens}
        </p>
        <p className={styles.mapQualification}>Illustrative scene · not live intelligence</p>
      </div>

      <div className={styles.primaryLayout}>
        <section className={styles.menuRegion} aria-labelledby="world-stage-heading">
          <div className={styles.introduction}>
            <h1 id="world-stage-heading">Choose where to begin.</h1>
            <p>Map your judgments, test them in context, or read the field.</p>
          </div>

          <div
            className={styles.menuList}
            role="tablist"
            aria-label="World Stage sections"
            aria-orientation="vertical"
          >
            {menuItems.map((item, index) => {
              const isActive = index === activeIndex

              return (
                <button
                  key={item.id}
                  ref={(node) => {
                    menuRefs.current[index] = node
                  }}
                  type="button"
                  role="tab"
                  id={`world-stage-tab-${item.id}`}
                  aria-selected={isActive}
                  aria-controls="world-stage-detail"
                  tabIndex={isActive ? 0 : -1}
                  className={`${styles.menuItem} ${isActive ? styles.menuItemActive : ""}`}
                  onClick={() => activate(index)}
                  onFocus={() => activate(index)}
                  onPointerEnter={() => activate(index)}
                  onKeyDown={(event) => handleMenuKeyDown(event, index)}
                >
                  <span className={styles.menuIndex}>{item.index}</span>
                  <span className={styles.menuLabel}>{item.label}</span>
                  <span className={styles.menuIndicator} aria-hidden="true" />
                </button>
              )
            })}
          </div>
        </section>

        <aside
          className={styles.detail}
          id="world-stage-detail"
          role="tabpanel"
          aria-labelledby={`world-stage-tab-${activeItem.id}`}
          key={`detail-${activeItem.id}`}
        >
          <div>
            <p className={styles.detailIndex}>{activeItem.index} / 06</p>
            <h2>{activeItem.label}</h2>
            <p className={styles.detailDescription}>{activeItem.description}</p>
          </div>
          <Link className={styles.routeLink} href={activeItem.href}>
            {activeItem.action}
            <span aria-hidden="true">→</span>
          </Link>
        </aside>
      </div>

      <footer className={styles.footer}>
        <nav className={styles.secondaryNav} aria-label="Secondary">
          {secondaryLinks.map((link) => (
            <Link key={link.label} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className={styles.legend} aria-label="Map symbol key">
          <span><i className={styles.nodeSymbol} /> Nodes: editorial prompts</span>
          <span><i className={styles.routeSymbol} /> Routes: thematic links</span>
        </div>
      </footer>
    </main>
  )
}
