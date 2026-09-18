import type { Metadata } from "next"
import { PreferencePlayer } from "@/components/futures/preference-player"
import styles from "@/components/futures/catalogue.module.css"
export const metadata: Metadata = { title: "Preferred conditions | AI Futures", description: "Consider desired conditions across the AI Futures catalogue, then assess expectations separately.", robots: { index: false } }
export default function PreferencesPage() { return <article className={styles.page} lang="en"><PreferencePlayer /></article> }
