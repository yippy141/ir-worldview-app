export function FirstInstinctPrompt({ locale = "en" }: { locale?: string }) {
  return <p className="muted">{locale === "zh-Hans"
    ? "凭第一直觉作答，不必反复推敲反例。"
    : "Go with your first instinct. Don't overthink counterexamples."}</p>
}
