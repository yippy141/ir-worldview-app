import foundationBankJson from "@/content/instrument/foundation.v2.json" with {
  type: "json",
}
import type {
  FoundationBackTranslationRecord,
  FoundationItemAnalysis,
  ZhHansFoundationDraftRecord,
  ZhHansFoundationQuestionCopy,
} from "@/content/locales/zh-Hans/foundation-types"

type Addition = {
  questionId: string
  prompt: string
  whatItAsks?: string
}

const additions: Addition[] = [
  {
    questionId: "val_mi_1",
    prompt: "美国应采取一切措施，包括使用武力，以阻止任何扩张主义大国发动侵略。",
  },
  {
    questionId: "val_ci_1",
    prompt: "美国需要加强与联合国的合作。",
  },
  {
    questionId: "val_iso_1",
    prompt: "美国应少管国际事务，让其他国家尽可能自行相处。",
  },
  {
    questionId: "val_mi_2",
    prompt: "与其只对对手的攻势作出反制，不如直接打击对手力量的核心。",
  },
  {
    questionId: "val_ci_2",
    prompt: "美国必须与其他国家合作，解决人口过剩、饥饿和污染等问题。",
  },
  {
    questionId: "val_iso_2",
    prompt: "我们不应过多从国际角度思考，而应更多关注本国问题。",
  },
  {
    questionId: "val_mi_3",
    prompt: "美国的军事力量并不是确保世界和平的最佳方式。",
  },
  {
    questionId: "val_ci_3",
    prompt: "促进和捍卫其他国家的人权至关重要。",
  },
  {
    questionId: "val_iso_3",
    prompt: "美国需要积极参与解决世界各地的冲突。",
  },
  {
    questionId: "val_mi_4",
    prompt: "美国必须展示决心，以免其他国家加以利用。",
  },
  {
    questionId: "val_ci_4",
    prompt: "保护全球环境至关重要。",
  },
  {
    questionId: "val_iso_4",
    prompt: "美国必须缩减其对自身全球领导角色的定位。",
  },
  {
    questionId: "v21_sc_rev_01",
    prompt: "如果各方都接受对军事优势的限制，大国就能够建立持久和平。",
    whatItAsks: "对军事优势的相互限制，能否使大国之间的和平持久？",
  },
  {
    questionId: "v21_sc_rev_02",
    prompt: "对手持续保持克制，可以成为其和平意图将会延续的可信证据。",
    whatItAsks: "持续克制能否表明，对手的和平意图很可能延续？",
  },
  {
    questionId: "v21_sc_rev_05",
    prompt: "深入的区域合作可以让成员国在政治上不再把彼此间的武装冲突视为可想象的选项。",
    whatItAsks: "深入的区域合作能否使成员国预期彼此会以和平方式处理争端？",
  },
  {
    questionId: "v21_in_rev_03",
    prompt: "当参与国保有足够力量来维持和执行协议时，国际协议才能长久。",
    whatItAsks: "协议能够延续，是否因为参与国仍有力量维护并执行协议？",
  },
  {
    questionId: "v21_df_rev_01",
    prompt: "面对相同的外部威胁，不同政治制度的国家通常仍会采取相似政策。",
    whatItAsks: "相似的外部威胁，是否会推动不同政治制度的国家采取相似政策？",
  },
  {
    questionId: "v21_df_rev_04",
    prompt: "只要外部处境保持不变，政权更替很少会改变一个国家的基本利益。",
    whatItAsks: "外部处境稳定时，一个国家的基本利益是否会在政权更替后继续存在？",
  },
  {
    questionId: "v21_ni_rev_01",
    prompt: "国家主要依据安全需要、资源和地理位置来界定自身利益。",
    whatItAsks: "国家利益是否主要由安全需要、资源和地理条件界定？",
  },
  {
    questionId: "v21_ni_rev_05",
    prompt: "在重大安全争端中，其他国家给予的承认很少会改变政府所追求的目标。",
    whatItAsks: "在重大安全争端中，其他国家的承认是否很少影响政府追求的目标？",
  },
  {
    questionId: "v21_pe_rev_02",
    prompt: "开放市场通常能给国家足够的灵活性，使其更换供应商并承受经济压力。",
    whatItAsks: "开放市场能否帮助国家更换供应商并抵御经济压力？",
  },
  {
    questionId: "v21_rs_rev_04",
    prompt: "为了阻止敌对大国支配关键地区，可以合理地在远离本土的地方作出长期承诺。",
    whatItAsks: "阻止某一大国支配地区，能否成为在远离本土处长期投入的正当理由？",
  },
  {
    questionId: "v21_rs_rev_05",
    prompt: "持续的前沿存在能增强盟友信心，也会压缩对手试探地区底线的空间。",
    whatItAsks: "前沿存在是否会安抚盟友，并减少对手试探地区底线的机会？",
  },
  {
    questionId: "v21_oj_rev_02",
    prompt: "即使起诉会使和平谈判更加复杂，国际法院仍应追究严重罪行。",
    whatItAsks: "当起诉可能使和平谈判复杂化时，法院是否仍应追究严重罪行？",
  },
]

const englishItems = new Map(
  foundationBankJson.items.map((item) => [item.id, item] as const),
)

function localizedCopy(addition: Addition): ZhHansFoundationQuestionCopy {
  return {
    prompt: addition.prompt,
    ...(addition.whatItAsks
      ? { clarification: { whatItAsks: addition.whatItAsks } }
      : {}),
  }
}

export const zhHansFoundationV21Drafts: readonly ZhHansFoundationDraftRecord[] =
  additions.map((addition) => ({
    questionId: addition.questionId,
    chineseDraftA: localizedCopy(addition),
    chineseDraftB: {
      ...localizedCopy(addition),
      prompt: `总体而言，${addition.prompt}`,
    },
    reconciledChinese: localizedCopy(addition),
  }))

export const zhHansFoundationV21BackTranslations:
readonly FoundationBackTranslationRecord[] = additions.map((addition) => {
  const source = englishItems.get(addition.questionId)
  if (!source) {
    throw new Error(`Missing canonical Foundation item: ${addition.questionId}`)
  }

  return {
    questionId: addition.questionId,
    backTranslation: {
      prompt: source.prompt,
      ...("clarification" in source && source.clarification
        ? {
            clarification: {
              whatItAsks: source.clarification.whatItAsks,
            },
          }
        : {}),
    },
  }
})

export const zhHansFoundationV21ItemAnalysis:
readonly FoundationItemAnalysis[] = additions.map((addition) => {
  const validationItem = addition.questionId.startsWith("val_")

  return {
    questionId: addition.questionId,
    construct: validationItem
      ? "External validation scale response"
      : "Canonical Foundation dimension response",
    intendedDistinction: validationItem
      ? "Preserves the cited validation-scale statement without altering Foundation family scoring."
      : "Tests the reverse-coded pole of the item's assigned Foundation dimension.",
    adjudicationNote:
      "The reconciled wording preserves the direction and scope of the English source while avoiding added theory cues.",
    optionLevelNotes: [
      { optionId: "1", note: "Clear disagreement endpoint." },
      { optionId: "4", note: "Neutral midpoint." },
      { optionId: "7", note: "Clear agreement endpoint." },
    ],
    termsRequiringGlossaryApproval: [
      validationItem ? "validation-scale wording" : "dimension-specific term",
    ],
    socialDesirabilityBias: {
      risk: validationItem ? "high" : "medium",
      note:
        "Interviewers should check whether respondents answer for public acceptability rather than analytic judgment.",
    },
    moderateOrRespectableOptionBias: {
      risk: "low",
      note:
        "The balanced Likert scale does not present a single authored compromise option.",
    },
    cognitiveInterviewProbes: [
      "请用自己的话复述这道题在问什么。",
      "哪个词最影响你的选择？",
    ],
  }
})
