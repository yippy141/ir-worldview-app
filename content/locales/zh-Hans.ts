import type { ChineseShellContent } from "@/content/locales/types"

export const chineseShellContent = {
  home: {
    metadata: {
      title: "国际关系世界观清单",
      description: "梳理你在世界政治问题上依赖的论证，并看清不同判断之间的张力。",
    },
    eyebrow: "国际关系世界观清单",
    title: "看清你在世界政治问题上依赖哪些论证。",
    intro:
      "这是一项编辑型互动工具，用七个维度整理你对国际关系取舍的判断。结果是一组连续画像及其相邻的解释传统，不是固定身份，也不是人群排名。",
    sections: [
      {
        id: "start",
        title: "从具体判断进入",
        paragraphs: [
          "“当前案例”先请你对一项有来源依据的国际事务作出判断，再用几种不同的世界观读法检验这项判断。案例档案、证据时间窗和更正状态都可以核查。",
        ],
        actions: [
          { href: "/cases", label: "查看当前案例", kind: "primary" },
          { href: "/about", label: "了解这个项目", kind: "secondary" },
        ],
      },
      {
        id: "language-status",
        title: "本期中文范围",
        paragraphs: [
          "本期只开放已经审校的中文外壳与说明页面。计分问卷、选项、结果解释、情境推演和证据记录继续以英文为准；这些页面在中文路径下会显示明确的状态说明。",
        ],
        actions: [
          { href: "/method", label: "阅读方法与局限", kind: "secondary" },
          { href: "/privacy", label: "阅读隐私说明", kind: "secondary" },
        ],
      },
    ],
  },
  about: {
    metadata: {
      title: "关于｜国际关系世界观清单",
      description: "了解国际关系世界观清单的用途、使用路径和编辑边界。",
    },
    eyebrow: "关于本项目",
    title: "辨认你反复依赖的外交政策论证，以及这些论证彼此冲突的地方。",
    intro:
      "国际关系世界观清单用于整理读者在常见国际关系取舍上的判断。它返回多维画像和相邻的解释传统，不把人归入不可改变的类型。",
    sections: [
      {
        id: "use",
        title: "如何使用",
        paragraphs: [
          "英文基础问卷要求你先完成作答，再逐项复核，最后生成结果。议题专题和情境推演用于观察具体问题或角色条件是否会改变基线判断。观点资料与方法页面说明模型覆盖了什么，又遗漏了什么。",
        ],
        actions: [
          { href: "/method", label: "阅读方法", kind: "primary" },
          { href: "/cases", label: "浏览案例档案", kind: "secondary" },
        ],
      },
      {
        id: "limits",
        title: "编辑边界",
        bullets: [
          "分数表示你在本模型量尺上的位置，不是人群百分位。",
          "国籍、公民身份和文化不会改变计分。",
          "世界观家族只是多维画像的解释性摘要，不是自然类别。",
          "覆盖不足的传统会作为背景被明确说明，不会在缺少题项覆盖时被新增为计分类别。",
        ],
      },
    ],
  },
  methods: {
    metadata: {
      title: "方法与局限｜国际关系世界观清单",
      description: "了解基础画像、相邻传统、情境推演、世界观地图及本工具的主要局限。",
    },
    eyebrow: "方法与局限",
    title: "这项清单如何工作",
    intro:
      "基础问卷比较你在七类外交政策取舍上的回答，寻找反复出现的论证倾向，也保留彼此拉扯的判断。它是编辑型解释工具，不是经过心理测量验证的诊断。",
    sections: [
      {
        id: "payoff",
        title: "结果可以告诉你什么",
        paragraphs: [
          "主要结果是一组七维画像。一个或两个国际关系传统会作为相邻模式的简写出现；战略风格和规范风格则作为修饰项单独呈现。混合结果并不异常，往往正是最值得阅读的部分。",
        ],
        bullets: [
          "传统名称不是永久身份。",
          "任何分数都不是百分位，也不表示道德高下。",
          "议题专题的读法与基础画像分开，不会被包装成额外的科学精度。",
        ],
      },
      {
        id: "scoring",
        title: "计分与解释",
        paragraphs: [
          "英文基础问卷包含同意度题、取舍题和小型情境题。它们共同映射到七个维度，并在 1 至 7 的内部量尺上形成画像。模型再把这组画像与四个经过编辑设定的参考轮廓比较：现实主义、制度主义、建构主义和批判政治经济学。",
          "参考轮廓、阈值和分析模式下第二选择的权重都来自明确的编辑判断，不是从大样本校准中推导出来。政治经济的重要性较高，也不会自动生成批判政治经济学结果；还需要更强的批判性或系统性组合。",
        ],
      },
      {
        id: "dimensions",
        title: "七个维度",
        paragraphs: [
          "这些维度来自国际关系中的主要争论，目的是整理解释前提和判断风格，并不声称覆盖所有重要传统。",
        ],
      },
      {
        id: "contexts",
        title: "情境推演与议题专题",
        paragraphs: [
          "情境推演把预先设定的变化叠加到已保存的基础画像上，用来比较角色与局势如何改变判断。基础画像保持不变，推演也不会另行分配一个世界观家族。小幅变化应当轻读。",
          "议题专题处理安全、技术与地缘经济等具体问题。专题答案形成独立的应用读法，不会把分数悄悄写回基础画像。",
        ],
      },
      {
        id: "map",
        title: "世界观地图",
        paragraphs: [
          "地图用人工设定的系数把七个基础维度投影到两个屏幕轴上。个人基线、情境推演以及符合证据要求的公共立场都经过同一投影。",
          "地图只用于定位和并列阅读。点与点之间的屏幕距离不代表经过验证的意识形态差异，也不提供人口密度、统计相似度或不确定区间。",
        ],
      },
      {
        id: "evidence",
        title: "公共立场与证据",
        paragraphs: [
          "思想家和公共立场来自有日期的来源台账。公开条目记录证据时间窗、各维度支持、争议说明、更新记录和第二位审读者。缺失值保持缺失；只有七个维度都有相连证据时，条目才会进入地图。",
          "AI 治理画像使用另一组轴和独立可视化。两套工具的数值不会合并成一个坐标。",
        ],
      },
      {
        id: "privacy",
        title: "历史、分享与数据",
        paragraphs: [
          "结果、草稿和历史记录默认保存在当前浏览器。分享链接会编码重新打开该结果所需的数据，因此应把链接视为由你控制的披露。产品分析只接受封闭的粗粒度事件，不接受答案、画像、结果链接或自由文本。",
        ],
        actions: [
          { href: "/privacy", label: "阅读隐私与数据使用", kind: "secondary" },
        ],
      },
      {
        id: "limits",
        title: "重要局限",
        items: [
          {
            heading: "尚未验证",
            body: "本工具不是经过验证的心理测量量表。维度、参考轮廓和阈值体现理论判断与编辑设计。",
          },
          {
            heading: "传统只是简写",
            body: "严肃读者常会因议题不同而借用多个传统。相邻传统不能取代对七维画像的阅读。",
          },
          {
            heading: "覆盖并不完整",
            body: "女性主义国际关系、后殖民理论和绿色国际关系等重要传统尚未得到充分题项覆盖。与这些传统接近的读者可能被映射到最近的已建模家族。",
          },
          {
            heading: "没有置信度数字",
            body: "本工具没有经过验证的置信度或“清晰度”量尺，因此不会用数字制造这种精确印象。",
          },
        ],
      },
    ],
    dimensions: {
      securityCompetition: {
        heading: "安全竞争",
        body: "你多大程度把大国竞争、意图不确定和相对位置视为持久约束。",
      },
      institutions: {
        heading: "制度与规则",
        body: "你多大程度认为规则、监督和重复互动能在没有世界政府的情况下巩固合作。",
      },
      domesticFilters: {
        heading: "国内政治",
        body: "联盟、政体、官僚能力和跨国行为体相对于外部压力有多重要。",
      },
      normsIdentity: {
        heading: "身份与合法性",
        body: "合法性、承认和社会意义是否会塑造利益与威胁，而不只是物质利益的修辞包装。",
      },
      politicalEconomy: {
        heading: "市场与依赖",
        body: "生产、金融、贸易依赖、制裁和杠杆在你的解释中处于什么位置。",
      },
      restraint: {
        heading: "克制与优势",
        body: "大国有机会扩大优势时，你更重视自我克制还是利用窗口。这是战略风格，不是独立家族。",
      },
      orderJustice: {
        heading: "秩序与正义",
        body: "主权与更广泛的道义责任冲突时，你通常把哪一项放在更前面。这不评判谁更有道德。",
      },
    },
  },
  privacy: {
    metadata: {
      title: "隐私与数据使用｜国际关系世界观清单",
      description: "了解本工具如何处理本地结果、分享链接、粗粒度产品分析和研究数据。",
    },
    eyebrow: "隐私与数据使用",
    title: "除非你主动分享，结果只保存在当前浏览器。",
    intro:
      "本工具不要求账户。已保存的结果、草稿和当前案例判断用于在本设备上形成个人画像；网站不收集研究问卷回答。",
    sections: [
      {
        id: "boundary",
        title: "当前边界",
        bullets: [
          "基础问卷、议题专题、AI、情境推演、个人画像和当前案例的历史记录保存在浏览器本地。",
          "网站不收集研究回答，也不收集与研究回答相连的联系方式。",
          "产品分析采用封闭的事件与属性白名单，并提供浏览器端退出选项。",
          "没有广告、画像数据出售、政治定向、会话回放或个人计分后台。",
        ],
      },
      {
        id: "research",
        title: "研究回答",
        paragraphs: [
          "网站目前不招募研究参与者，不收集研究回答，也不会把联系方式与问卷结果相连。未来如开展研究，必须先另行说明目的、数据范围、同意、保存期限、删除、安全和访问规则。",
        ],
      },
      {
        id: "analytics",
        title: "粗粒度产品分析",
        paragraphs: [
          "Vercel Web Analytics 只接收少量具名互动。网站没有安装自动页面浏览追踪。允许的属性限于已发布案例的稳定 ID（适用时）、宽泛路由类别、设备类别、来源类别和宽泛回访时间段。",
          "完整网址、结果载荷、答案 ID、画像家族、维度分数、电子邮件、自由文本、自定义时间戳和由应用持久保存的 IP 记录均被排除。来源网址在浏览器内先被归为宽泛类别；分析请求不附带请求 IP、Cookie、用户代理或来源标头。",
          "为限制聚合计数器被滥用，写入接口会把请求 IP 转换为仅在当前服务器进程内使用、带随机盐的单向分桶键。IP 和该键都不会写入聚合数据库；该键只存在于服务器内存中，并随进程结束而失效。",
        ],
      },
      {
        id: "sharing",
        title: "分享",
        paragraphs: [
          "基础问卷、AI、专题、情境推演和共享画像链接会编码重新打开页面所需的数据。请把这些网址视为由你控制的披露。删除本地历史不会撤回已经发出的链接，也不会清除浏览器或消息记录。",
          "普通当前案例链接不包含答案。只有在你明确选择时，分享文本才会附上最终判断。",
        ],
      },
      {
        id: "contact",
        title: "勘误与联系",
        paragraphs: [
          "联系渠道只用于事实勘误、隐私问题和安全报告。来信不会自动与结果、个人画像、当前案例回答或分析事件关联。",
        ],
        actions: [
          { href: "/feedback", label: "阅读勘误与联系说明", kind: "secondary" },
        ],
      },
      {
        id: "delete-data",
        title: "删除本地历史",
        paragraphs: [
          "下方控件会从当前浏览器删除本应用保存的结果、草稿和判断历史。网站没有可按个人身份检索或删除的服务器端研究回答。",
        ],
      },
    ],
  },
  corrections: {
    metadata: {
      title: "勘误与联系｜国际关系世界观清单",
      description: "提交事实勘误、隐私问题或安全报告，同时避免发送结果数据。",
    },
    eyebrow: "勘误与联系",
    title: "报告事实、隐私或安全问题。",
    intro:
      "项目邮箱只用于事实勘误、隐私问题和安全报告。网站不通过此渠道接收一般投稿或研究回答。",
    sections: [
      {
        id: "do-not-send",
        title: "请勿发送",
        paragraphs: [
          "不要发送问卷答案、结果或个人画像链接、受访者标识，也不要提供你本人、雇主、学校或其他人的非必要信息。网站不收集研究回答，因此删除研究数据不需要来信。",
        ],
      },
      {
        id: "include",
        title: "可以包含什么",
        paragraphs: [
          "请只写明公开页面标题、有争议的公开陈述，并在相关时附上来源。来信属于普通通信，不会并入产品分析或研究数据集。",
        ],
        actions: [
          { href: "mailto:jhyip16@outlook.com", label: "发送项目邮件", kind: "primary" },
          { href: "/privacy", label: "阅读隐私与数据使用", kind: "secondary" },
          { href: "/", label: "返回首页", kind: "secondary" },
        ],
      },
    ],
  },
  cases: {
    metadata: {
      title: "当前案例｜国际关系世界观清单",
      description: "浏览有来源依据的国际事务案例、证据时间窗和更正状态。",
    },
    eyebrow: "当前案例",
    title: "在正在发生的事务中作出判断",
    intro:
      "案例先要求读者对一项有来源依据的国际事务作出初步判断，再用相互竞争的世界观读法和一项条件变化检验判断。",
    privacyNote:
      "回答和未完成草稿保存在当前浏览器。每条记录都标明证据时间窗、来源和更正状态。",
    englishContentNotice:
      "案例档案页的中文审校尚未完成。本页开放中文档案索引；案例标题、摘要和正文继续以英文为准。",
    emptyTitle: "目前没有已发布案例",
    emptyBody: "只有完成来源核查和编辑审读的记录才会进入公开档案。",
  },
  profileShare: {
    familyLabels: {
      realist: "战略现实主义",
      institutionalist: "自由制度主义",
      constructivist: "社会建构主义",
      criticalPoliticalEconomy: "批判政治经济学",
    },
    strategyLabels: {
      Restrainer: "克制型",
      Hedger: "对冲型",
      Maximizer: "优势扩大型",
    },
    normativeLabels: {
      Pluralist: "多元秩序取向",
      "Conditional Solidarist": "有条件共同体取向",
      Universalist: "普遍主义取向",
    },
    moduleLabels: {
      security: "安全",
      technology: "技术与权力",
    },
    aiLabels: {
      precautionarySteward: "审慎治理者",
      strategicCompetitor: "战略竞争者",
      coordinationArchitect: "协调架构者",
      democraticGuardrailist: "民主护栏倡导者",
      stateCapacityBuilder: "国家能力建设者",
      openEcosystemBuilder: "开放生态建设者",
    },
    perspectiveLabels: {
      "incumbent-great-power": "守成大国",
      "rising-peer-competitor": "崛起中的同级竞争者",
      "exposed-ally": "处于暴露位置的盟友或脆弱小国",
      "middle-power-hedger": "采取对冲策略的中等强国",
      "capacity-constrained-state": "能力受限国家",
      "protection-authority": "保护或法律授权机构",
    },
    eyebrow: "共享世界观档案",
    title: (familyLabel) => `${familyLabel}：一份连续画像`,
    intro:
      "这份链接保存的是稳定标识、分数与版本信息。页面文字按当前语言即时生成；它不是人口排名，也不把解释性标签当作固定身份。",
    foundationHeading: "基础画像",
    foundationSummary: (familyLabel, runnerUpLabel) =>
      `在本工具覆盖的四个理论家族中，这组分数最接近${familyLabel}；${runnerUpLabel}是最近的相邻参照。标签只是七个维度组合的简写。`,
    moduleSummary:
      "该专题记录保留了答题标识与分析分数；解释文字按当前语言版本生成，并保持与基础画像分开。",
    aiTitle: "人工智能治理",
    aiSummary:
      "这一结果描述治理取舍的最近解释性组合，不把人工智能政治划分为固定阵营。",
    provenanceNotice:
      "这份档案包含来自不同语言或文案版本的完成记录。它们可以并列查看，但不会被表述为研究上等价的测量。",
  },
  unavailable: {
    metadata: {
      title: "中文内容状态｜国际关系世界观清单",
      description: "此页面的简体中文内容尚未完成编辑审校。",
    },
    eyebrow: "中文内容状态",
    title: "此页面的简体中文内容尚未通过编辑审校。",
    body:
      "为避免把未经核准的译文用于计分问卷、结果解释、情境推演或证据记录，本页暂不展示中文版本。原有英文网址和数据格式保持不变。",
    scope:
      "本期已开放中文首页、基础问卷改编测试版及其结果、关于、方法、隐私、勘误与联系，以及当前案例档案。",
  },
} satisfies ChineseShellContent
