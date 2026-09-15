"use client"

import { useLocale } from "next-intl"
import { usePathname } from "next/navigation"
import { Link } from "@/i18n/navigation"
import { internalPath } from "@/i18n/paths"
import { LanguageSwitcher } from "@/components/language-switcher"
import { destinations, destinationLabel, destinationIsCurrent, navigationSections, navigationUtilities, type DestinationId } from "@/lib/navigation"
import styles from "./navigation-directory.module.css"

export function NavigationDirectory({ betaLink, language = true }: { betaLink?: { href: string; label: string } | null; language?: boolean }) {
  const locale = useLocale()
  const path = internalPath(usePathname() ?? "/")
  const item = (id: DestinationId, home = false) => <Link href={destinations[id].href} prefetch={false}
    className={home ? styles.home : styles.child}
    aria-current={path === destinations[id].href ? "page" : undefined}>
    {destinationLabel(id, locale)}
  </Link>
  return <div className={styles.directory}>
    <nav className={styles.sections} aria-label={locale === "zh-Hans" ? "网站栏目" : "Site sections"}>
      {navigationSections.map(section => <div className={styles.section} key={section.home}>
        {section.children.length ? <details open={destinationIsCurrent(section.home, path) || section.children.some(id => destinationIsCurrent(id, path))}>
          <summary className={styles.sectionTitle}>{destinationLabel(section.home, locale)}</summary>
          <div className={styles.children}>
            {item(section.home, true)}
            {section.children.map(id => <span key={id}>{item(id)}</span>)}
          </div>
        </details> : item(section.home, true)}
      </div>)}
    </nav>
    <nav className={styles.utilities} aria-label={locale === "zh-Hans" ? "网站信息" : "Site information"}>
      {navigationUtilities.map(id => <span key={id}>{item(id)}</span>)}
      {betaLink && <Link href={betaLink.href}>{betaLink.label}</Link>}
    </nav>
    {language && <div className={styles.language}><LanguageSwitcher /></div>}
  </div>
}
