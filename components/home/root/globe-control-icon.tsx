/** Small inline control marks; accessible names belong to their native buttons. */
export function GlobeControlIcon({ kind }: { kind: "previous" | "next" | "in" | "out" }) {
  const path = kind === "previous" ? "M19 12H5m6-6-6 6 6 6" : kind === "next" ? "M5 12h14m-6-6 6 6-6 6" : kind === "in" ? "M5 12h14M12 5v14" : "M5 12h14"
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" focusable="false"><path d={path} /></svg>
}
