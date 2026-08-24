export type QuizChromeMeta = {
  title: string
  sectionLabel: string
  exitHref: string
  exitLabel: string
  progressLabel: string
  steps: string[]
  activeStep: string
}

const moduleTitles: Record<string, string> = {
  security: "Security & Strategy",
  technology: "Technology & Geoeconomics",
}

export function getQuizChromeMeta(
  pathname: string | null,
  locale: string,
): QuizChromeMeta | null {
  if (!pathname) return null

  if (pathname === "/quiz" || pathname === "/quiz/review") {
    const chinese = locale === "zh-Hans"
    const quizStep = chinese ? "问卷" : "Quiz"
    const reviewStep = chinese ? "检查" : "Review"

    return {
      title: chinese ? "基础问卷" : "Foundation Questionnaire",
      sectionLabel: chinese ? "国际关系世界观清单" : "IR Worldview Inventory",
      exitHref: "/",
      exitLabel: chinese ? "返回首页" : "Exit to home",
      progressLabel: chinese ? "问卷进度" : "Route progress",
      steps: [quizStep, reviewStep],
      activeStep: pathname === "/quiz/review" ? reviewStep : quizStep,
    }
  }

  // Only the Foundation questionnaire is authored and approved in Chinese.
  if (locale !== "en") return null

  if (pathname === "/ai/quiz" || pathname === "/ai/review") {
    return {
      title: "AI Questionnaire",
      sectionLabel: "AI Governance Compass",
      exitHref: "/ai",
      exitLabel: "Exit to AI home",
      progressLabel: "Route progress",
      steps: ["Quiz", "Review"],
      activeStep: pathname === "/ai/review" ? "Review" : "Quiz",
    }
  }

  const perspectiveMatch = pathname.match(/^\/perspectives\/([^/]+)$/)
  if (perspectiveMatch) {
    return {
      title: "Perspective Brief",
      sectionLabel: "Perspective Run",
      exitHref: "/perspectives",
      exitLabel: "Exit to briefs",
      progressLabel: "Route progress",
      steps: [],
      activeStep: "",
    }
  }

  const moduleMatch = pathname.match(/^\/modules\/([^/]+)$/)
  if (moduleMatch) {
    const slug = moduleMatch[1]

    return {
      title: `${moduleTitles[slug] ?? "Focus Area"} Questionnaire`,
      sectionLabel: "Focus Area",
      exitHref: "/modules",
      exitLabel: "Exit to Focus Areas",
      progressLabel: "Route progress",
      steps: ["Questions"],
      activeStep: "Questions",
    }
  }

  return null
}
