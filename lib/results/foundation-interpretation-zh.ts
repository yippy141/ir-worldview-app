import type { DimensionKey, DimensionScores } from "@/lib/types"
import { positionBand, type ResultInterpretation } from "@/lib/results/interpretation"

const directions: Record<DimensionKey, [string, string, string]> = {
  securityCompetition: ["你的记录为缓和关系与合作留出较大空间。", "竞争维度的分数尚不能说明合作能否改变国家间的关系。", "你的记录把持续竞争视为善意本身难以消除的约束。"],
  institutions: ["你的记录更看重权力，而非规则独立约束行为的能力。", "制度维度的分数尚不能说明规则能在多大程度上约束强国。", "你的记录赋予制度改变行为激励的作用，而不只把它视为权力的反映。"],
  domesticFilters: ["你的记录更重视国际体系压力，而非国内政治差异。", "国内政治维度尚不能说明不同国家为何对同一外部压力作出不同反应。", "你的记录重视国内联盟与政治制度如何改变国家对同一外部压力的反应。"],
  normsIdentity: ["你的记录更重视物质利益，而非身份与正当性的解释力。", "身份与规范维度尚不能区分承认改变利益还是主要表达利益。", "你的记录把承认与正当性视为可以塑造利益本身的因素。"],
  politicalEconomy: ["你的记录更重视安全与外交，而非市场结构和依赖关系。", "政治经济维度尚不能区分结构性约束与外交选择的相对作用。", "你的记录关注市场、资源与依赖关系的控制如何产生政治权力。"],
  restraint: ["战略位置倾向于在机会出现时运用优势。", "战略位置尚未确定施压与设限之间的界线。", "战略位置倾向于限制施压力度，避免过度扩张。"],
  orderJustice: ["规范位置为正义诉求突破既有秩序留出较大空间。", "规范位置尚未确定突破既有秩序的门槛。", "规范位置更重视秩序与主权，而非从外部推行正义。"],
}

export function buildFoundationInterpretationZh(scores: DimensionScores): ResultInterpretation {
  const keys: DimensionKey[] = ["securityCompetition", "institutions", "domesticFilters", "normsIdentity", "politicalEconomy"]
  const first = [...keys].sort((a, b) => Math.abs(scores[b] - 4) - Math.abs(scores[a] - 4))[0]
  const read = (key: DimensionKey) => directions[key][positionBand(scores[key]) === "low" ? 0 : positionBand(scores[key]) === "high" ? 2 : 1]
  const high = positionBand(scores[first]) === "high"
  const middle = positionBand(scores[first]) === "middle"
  const lens: Record<string, [string, string]> = {
    securityCompetition: high
      ? ["核查是否改变了作弊的收益，还是只记录一项暂时有效的战略交易？", "持续核查也可能让合作本身更持久，而非只能依赖原有交易。"]
      : ["核查与相互让步能否降低关系中的威胁？这需要超越对对方公开意图的信任。", "一方可能先利用让步改善自身地位，之后再违约；安抚本身并不消除这种机会。"],
    institutions: high
      ? ["信息交换、重复互动与违约成本，是否足以改变遵约的收益？", "战略收益足够大时，强国仍可能承担制度施加的违约成本。"]
      : ["谁有能力执行协议，又为什么会持续这样做？书面义务本身不足以回答这个问题。", "信息交换与对等核查也可能在缺少单一强制执行者的情况下维持合作。"],
    domesticFilters: high
      ? ["两国国内哪些群体从遵约中获益，哪些群体会阻止让步？", "外部脆弱性也可能让国内政治不同的国家作出相似选择。"]
      : ["相同的战略处境是否会推动两国接受相似交易，即使它们的国内制度不同？", "国内拥有否决能力的群体可能阻止一项从国家整体看有利的协议。"],
    normsIdentity: high
      ? ["对等核查权是否让双方都被承认为可接受的合作伙伴？", "相同的权利表述仍可能掩盖不同的军事脆弱性；承认未必改变物质利害。"]
      : ["双方实际放弃什么，又能核查什么？承认本身未必能补偿不利的安全交易。", "屈辱或不平等的条款可能使一项物质上有利的交易在政治上无法被接受。"],
    politicalEconomy: high
      ? ["谁控制核查所需的技术与供应链，这会不会产生新的依赖？", "外交安排、共同规则与替代供应者也可能约束这种依赖。"]
      : ["在经济资源不对等的情况下，双方是否仍能通过安全交易与相互承诺达成可行协议？", "对金融、生产或核查技术的控制，可能在谈判开始前就限制了可选方案。"],
  }
  return { kind: "model-interpretation", summary: `${read(first)}${read("restraint")}${read("orderJustice")}`,
    scope: "这段解释组合了记录中的维度位置，不据此还原具体答案，也不把它当作持久特质。",
    example: { kind: "illustrative-implication", title: "一项承受压力的军控交易", facts: "假设两个竞争对手同意相互核查已申报设施，但都无法排除未申报设施的存在。遵约要求双方作出实质让步。",
      application: `将这组位置用于此情境，可以追问：${middle ? "核查是否改变了行为激励，还是仅在战略交易维持时才有效？分数尚不能确立其中一种解释优先。" : lens[first][0]}${scores.restraint >= 5 ? "克制取向为保留有限交易提供了理由，即使这意味着不完全运用优势。" : scores.restraint <= 3 ? "运用优势的取向为趁议价能力仍在时争取更强条款提供了理由。" : "战略分数尚不能决定应当多大力度争取更好条款。"}${positionBand(scores[first]) === "middle" ? "这里的中间分数不能确立某一种解释优先，也可能来自相反答案的组合。" : ""}`,
      rival: middle ? "中间分数可能来自相反答案的组合，不能说明两种论证在此情境中会得到相同权重。" : lens[first][1], change: "如果核查能及时发现违规，或让步会实质改变一方胁迫另一方的能力，论证就需要重新权衡。" },
    followUp: { kind: "follow-up", question: "若无法排除未申报设施，你是否接受对已申报设施的可核查限制？哪一项让步会使你拒绝？" } }
}
