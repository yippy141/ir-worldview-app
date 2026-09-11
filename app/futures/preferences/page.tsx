import type { Metadata } from "next"
import { PreferencePlayer } from "@/components/futures/preference-player"
import styles from "@/components/futures/catalogue.module.css"
export const metadata: Metadata = { title: "Preferred conditions | Futures", description: "Consider desired conditions across the Futures catalogue, then assess expectations separately.", robots: { index: false } }
export default function PreferencesPage() { return <article className={styles.page} lang="en"><PreferencePlayer /></article> }
