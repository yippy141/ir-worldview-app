# IR Worldview Simplified Chinese copy deck: editorial memo

Date: 2026-07-20  
Locale: `zh-Hans`  
Deck version: 1  
Source English copy: V19.1  
Status: approved for public-route integration

## Editorial outcome

This deck supplies the approved Simplified Chinese public-copy layer for the requested
unscored surfaces. It follows the V19.1 public English release, the Chinese voice and glossary,
and the V19.2–V20 locale architecture. It does not change scoring, payload formats, structural
catalogs, source ledgers, routes, privacy behavior, or saved records.

The governing Chinese register is that of a careful policy editor: direct, calm, specific, and
explicit about what comes from a source, what is an interpretation, and what remains uncertain.
The copy avoids personality-test language, product marketing, ornamental slogans, and claims of
precision that the method cannot support.

## Delivery map

| Requested area | Typed source |
| --- | --- |
| Product glossary | `content/locales/zh-Hans/product-glossary.ts` |
| Navigation and controls | `content/locales/zh-Hans/navigation-controls.ts` |
| World Stage | `content/locales/zh-Hans/world-stage.ts` |
| Current Case archive | `content/locales/zh-Hans/current-cases/archive.ts` |
| Three Current Case records | `content/locales/zh-Hans/current-cases/*.ts` |
| About, Methods, Privacy, Corrections | `content/locales/zh-Hans/editorial-pages.ts` |
| Worldview Map UI | `content/locales/zh-Hans/worldview-map.ts` |
| Ten worldview-profile names and descriptions | `content/locales/zh-Hans/worldview-profiles.ts` |
| Thinkers and public-position UI | `content/locales/zh-Hans/reference-profiles-ui.ts` |
| Metadata and Open Graph copy | `content/locales/zh-Hans/metadata.ts` |
| Deck scope and version | `content/locales/zh-Hans/manifest.ts` |

`content/locales/zh-Hans/index.ts` is the deck's typed entry point. The owner-approved Foundation
adaptation is included as an adapted beta. AI, Focus Area, and Perspective instruments remain
outside this deck.

## Translation decisions

The Chinese copy translates the reader task, not English sentence structure. “Profile” becomes
“画像” when it describes a continuous result, never “人格” or a fixed “类型.” “Worldview Map” is
“世界观地图.” “Current Case” is “当前案例.” “Perspective Runs” is provisionally “情境推演” because
the surface asks readers to judge from a defined strategic position; it is not a forecast or a
simulation.

The ten public profile names are deliberately short and descriptive. Their technical descriptors
remain in English as canonical editorial references. The Chinese names are public labels, not new
scored families.

Every Current Case source keeps the exact original source title in `originalTitle`. A distinct
`displayTitle` provides the Chinese reading aid. Publishers, dates, URLs, source IDs, claim IDs,
option IDs, reasoning-tag IDs, profile IDs, actors, route URLs, review dates, and correction status
remain canonical and are not localized.

## Politically sensitive or ambiguous terminology

The typed glossary marks unresolved choices as `flagged` or `provisional` and records alternatives.
Recommended first-pass decisions are:

| English term | Recommended display | Alternative | Editorial note |
| --- | --- | --- | --- |
| legitimacy | 正当性 | 合法性；认受性 | Use “法律效力” or “合法性” only when the claim is specifically legal. |
| economic statecraft | 经济治国方略 | 经济手段；经济权力运用 | Accurate in the field but formal for general readers; use “经济手段” in tight UI. |
| hedging | 战略对冲 | 两面下注；风险对冲 | “两面下注” is too judgmental for neutral analytical copy. |
| retaliation | 反制措施 | 报复措施；回应措施 | “反制” can reproduce an actor's political framing; attribute it when reporting a government claim. |
| South China Sea arbitral award | 南海仲裁案裁决 | 南海仲裁裁决 | Avoid shorthand that obscures the proceeding; state the contest over acceptance separately. |
| Code of Conduct in the South China Sea | “南海行为准则” | 南海各方行为准则 | Keep quotation marks where the copy refers to the negotiated instrument. |
| strategic autonomy | 战略自主 | 战略自主能力 | Do not imply complete independence from allies or infrastructure. |
| semiconductor tooling | 半导体制造设备 | 半导体生产设备与工艺能力 | Never use “工具链”; it falsely suggests software infrastructure. |

Case copy follows attribution rules for contested claims. The South China Sea record states the
tribunal and supporting governments' legal position, then separately states the Chinese
government's rejection; it does not collapse the disagreement into a neutral-sounding fact. The
Brazil record attributes Section 301 claims to the U.S. Trade Representative. References to
Taiwan preserve the source's institutional wording and do not infer diplomatic recognition.

## Preservation and source-honesty audit

The parity test compares the Chinese case records and World Stage overlays against the canonical
English catalogs. It checks stable IDs, dates, actors, URLs, claim-to-source links, options,
profiles, evidence windows, and the empty correction histories shipped in V19.1. The same test
confirms that all ten profile IDs and original public names remain unchanged and that each source
shows a Chinese display title separately from the original title.

No public correction entry is invented for the three records. Their current state is expressed as
“目前没有公开更正记录,” with the canonical editorial update date and evidence-window end retained.

## Handoff notes

The V20 implementation binds these typed fields to the Chinese routes, confirms line breaking with
the chosen CJK system stacks, and runs page-level bilingual QA. Scored questions and options remain
outside the approved scope until instrument translation and measurement review are separately
commissioned.
