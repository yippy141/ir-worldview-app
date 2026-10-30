import type { Locale } from "@/i18n/routing"

// Supplemental, unscored help. Keep issued question/copy-version content intact.
const terms = {
  en: {
    case_protection: [
      { term: "Tightly limited mandate", definition: "Authorization restricted to a specified task, area, duration, or permitted actions." },
      { term: "General license", definition: "Broad permission to act beyond the particular emergency or stated limits." },
    ],
    v21_rs_rev_05: [
      { term: "Forward presence", definition: "Keeping military forces deployed near a potential conflict area, away from their home territory." },
    ],
  },
  "zh-Hans": {
    case_protection: [
      { term: "严格限定的授权（tightly limited mandate）", definition: "把行动权限限定在特定任务、地区、时限或允许采取的措施之内。" },
      { term: "普遍许可（general license）", definition: "超出本次紧急情况或既定范围的广泛行动许可。" },
    ],
    v21_rs_rev_05: [
      { term: "前沿存在（forward presence）", definition: "把军事力量部署在潜在冲突地区附近，而非本国境内。" },
    ],
  },
} satisfies Record<Locale, Record<string, { term: string; definition: string }[]>>

export function foundationGlossary(itemId: string, locale: Locale) {
  const entries: Record<string, { term: string; definition: string }[]> = terms[locale]
  return entries[itemId] ?? []
}
