import { ReviewScreen } from "@/components/quiz/review-screen"
import { localizedAlternates, publicPath } from "@/i18n/paths"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "复核答案｜国际关系世界观清单",
  description: "生成基础画像前，逐项复核简体中文基础问卷答案。",
  alternates: {
    canonical: publicPath("zh-Hans", "/quiz/review"),
    languages: localizedAlternates("/quiz/review"),
  },
}

export default function ChineseReviewPage() {
  return (
    <div className="wide-container">
      <ReviewScreen locale="zh-Hans" />
    </div>
  )
}
