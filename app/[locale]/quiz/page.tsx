import { Suspense } from "react"
import { QuizApp } from "@/components/quiz-app"
import { localizedAlternates, publicPath } from "@/i18n/paths"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "基础问卷｜国际关系世界观清单",
  description: "先完成 14 道核心题生成暂定画像，再按需增加定向或完整扩展题。",
  alternates: {
    canonical: publicPath("zh-Hans", "/quiz"),
    languages: localizedAlternates("/quiz"),
  },
}

export default function ChineseQuizPage() {
  return (
    <div className="wide-container">
      <Suspense fallback={<div className="panel" style={{ padding: "40px" }}>正在加载问卷…</div>}>
        <QuizApp locale="zh-Hans" />
      </Suspense>
    </div>
  )
}
