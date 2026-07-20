# Foundation 简体中文改编包

## 当前状态

本改编包已获 owner approval，并以 **adapted beta** 接入 `/zh/quiz` 与 `/zh/results/[payload]`。批准范围是编辑文案与运行时接入，不构成效度、跨语言等价性或数据合并声明。

## 交付文件

| 交付项 | 源文件 |
|---|---|
| Typed zh-Hans content | `content/locales/zh-Hans/foundation-instrument.ts` 与 `foundation-copy-*.ts` |
| Item-intent sheet | `content/locales/zh-Hans/foundation-item-intent.ts`，由逐题 analysis、双稿、回译与 canonical English source 组合 |
| Back translation | `content/locales/zh-Hans/foundation-back-translations.ts` 及其分片文件 |
| Glossary additions | `content/locales/zh-Hans/foundation-glossary.ts` |
| Cognitive-interview protocol | `docs/editorial/V20_FOUNDATION_ZH_HANS_COGNITIVE_INTERVIEW_PROTOCOL.md` |
| Unresolved decisions | `docs/editorial/V20_FOUNDATION_ZH_HANS_UNRESOLVED_DECISIONS.md` |

## 结构保证

中文题目只覆盖展示字段。`getZhHansFoundationQuestions(mode)` 从 canonical English schema 取得并原样保留：

- question ID；
- question kind；
- Likert dimension 与 reverse flag；
- choice card type；
- answer-option ID；
- 每个 option 的 signal 数值；
- Analyst 第二选择开关；
- Standard 与 Analyst 的题目顺序；
- Standard 五个 section 的 question ID 顺序。

评分函数、第二选择权重和 canonical answer ID 均未修改。草稿可在语言之间继续使用；完成时另行记录结构版本、计分版本、文案版本与完成语言。共享结果 payload 不含翻译后的展示文字，可在英文或中文结果路由中重新生成解释。

`ProfileStore` 继续使用 v5 locale-neutral 持久化形态。显示名称与长篇解释不会作为 canonical 数据写入本地存储。

中文与英文完成记录不会被称为等价测量，也不会合并为同一语言数据。

## 逐题字段

`zhHansFoundationItemIntentSheet` 的 44 行均含：

- `questionId`；
- `construct`；
- `intendedDistinction`；
- `englishSource`；
- `chineseDraftA`；
- `chineseDraftB`；
- `reconciledChinese`；
- `backTranslation`；
- `adjudicationNote`；
- `optionLevelNotes`；
- `termsRequiringGlossaryApproval`；
- `socialDesirabilityBias`；
- `moderateOrRespectableOptionBias`；
- `cognitiveInterviewProbes`。

Likert 题的 option-level notes 记录 1、4、7 三个锚点；choice 题覆盖所有 canonical option ID。
