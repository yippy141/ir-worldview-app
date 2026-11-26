export function FirstInstinctPrompt({ locale = "en" }: { locale?: string }) {
  return <p className="muted">{locale === "zh-Hans"
    ? "凭第一直觉作答，不必反复推敲反例。"
    : "You can revisit any answer before you see your result."}</p>
}
