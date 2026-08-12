import type { BetaPageContent } from "@/content/locales/beta-types"

export const zhHansBetaPage = {
  metadata: {
    title: "受控测试｜国际关系世界观清单",
    description: "自愿参与访谈或产品反馈，帮助检验国际关系世界观清单是否清楚、公平并具有实际用途。",
    openGraph: {
      type: "website",
      title: "受控测试｜国际关系世界观清单",
      description: "帮助检验这项编辑型互动工具是否容易理解、公平呈现分歧，并对读者有用。",
    },
  },
  eyebrow: "受控测试",
  title: "帮助检验这项清单是否清楚、公平并具有实际用途。",
  intro:
    "这次小范围测试收集的是读者如何理解和使用本清单的产品反馈。参与完全自愿，不会影响你的结果，也不会限制你使用网站。",
  testingTitle: "项目正在检验什么",
  testingItems: [
    "理解：题目、结果和局限说明能否在没有额外解释时被读懂。",
    "公平：不同立场是否得到准确呈现，同时避免把读者引向某一答案。",
    "用途：这项体验能否帮助读者反思一项判断，或更清楚地展开讨论。",
  ],
  participationTitle: "在本应用之外参与",
  participationBody:
    "项目负责人可能提供外部访谈预约页面或反馈表。该链接会在本网站之外打开。",
  optionalNote:
    "参与完全自愿。即使不预约访谈、不提交反馈，你仍可使用清单的所有公开功能。",
  participationLink: "打开测试参与页面",
  linkUnavailable: "本页面目前不接受测试预约。网站的其他公开内容仍可正常使用。",
  opensNewTab: "将在新标签页打开。",
  boundariesTitle: "请勿提供结果或身份隐私信息",
  boundariesIntro: "无论参加访谈还是使用外部表格，都不要粘贴或发送：",
  prohibitedItems: [
    "问卷答案或当前案例答案；",
    "结果网址或个人画像链接；",
    "雇主或学校的详细信息；",
    "任何其他人的信息。",
  ],
  dataTitle: "产品反馈与汇总计数彼此分开",
  productFeedbackBody:
    "产品反馈是你主动通过外部参与服务提供的内容，用于评估设计和编辑体验。",
  tier1Body:
    "第一层汇总计数如被启用，只记录粗粒度、经推导的产品使用数据。它们不是反馈，不会把任何人登记为测试参与者，也不包含留言或联系方式字段。",
  externalDataBody:
    "本应用不设置测试反馈表，也不会在应用数据库中保存自由文本或联系方式。你选择向外部服务提交的内容适用该服务自己的条款。",
  otherRoutesTitle: "事实、隐私与安全报告",
  correctionsBody:
    "勘误与联系页面只用于事实勘误、隐私问题或安全报告。一般产品反馈应通过自愿参加的测试流程提供。",
  correctionsLink: "阅读勘误与联系说明",
  privacyLink: "阅读隐私与数据使用",
  homeLink: "返回首页",
} as const satisfies BetaPageContent
