export type AlignmentColor = "blue" | "red" | "gold" | "muted"
export type AlignmentScene = {
  kind: "imagined"
  id: string
  title: string
  internalBorders?: "faint"
  groups: Array<{ id: string; label: string; color: AlignmentColor; countries: string[] }>
}

export const ALIGNMENT_COLORS = { blue: "#86abd2", red: "#ca7770", gold: "#cea857", muted: "#293b50" } as const
export const ROOT_REVOLUTION_MS = 140_000
export const ROOT_SCENE_MS = 5_500
