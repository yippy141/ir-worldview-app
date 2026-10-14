import styles from "./exercise.module.css"

export function SimulationContext({ episode }: { episode: "verify" | "access" }) {
  return <div>
    <span className={styles.categoryPill}>{episode === "verify"
      ? "AI Compute & Treaty Simulation · Fictional States (Arden & Belvar)"
      : "AI Access Simulation · Fictional Research Institute"}</span>
    <p className={styles.small}>{episode === "verify"
      ? "Arden and Belvar are hypothetical great powers in a frontier AI verification exercise."
      : "This hypothetical exercise asks who should control access to a capable AI model and admit its evaluators."}</p>
  </div>
}
