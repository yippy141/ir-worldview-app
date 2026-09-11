import type { WorkedApplication as Application } from "@/lib/results/interpretation"

export function WorkedApplication({ example, locale = "en" }: { example: Application; locale?: "en" | "zh-Hans" }) {
  return <section className="result-application" aria-label={locale === "en" ? "Illustrative application" : "示例应用"}>
    <h2>{example.title}</h2>
    <p className="result-application__facts">{example.facts}</p>
    <p>{example.application}</p>
    <h3>{locale === "en" ? "The strongest objection" : "最有力的反对意见"}</h3>
    <p>{example.rival}</p>
    <p><strong>{locale === "en" ? "What would change the argument. " : "什么会改变论证。 "}</strong>{example.change}</p>
    <p className="result-application__scope">{locale === "en" ? "An illustrative application of the reasoning. This is not a recorded answer or a prediction." : "这是推理的示例应用，不是已记录的答案，也不是预测。"}</p>
  </section>
}
