# V23.3 Security source ledger

Status: **design evidence; not a shipping bibliography**
Access check: 2026-08-19
Research cut-off: 2026-08-18

## 1. Source-pack provenance

| Field | Value |
|---|---|
| Local source | `/Users/jinhuayip/Downloads/deep-research-report (34).md` |
| Pack title | *Security Module v4 — Primary-source research pack* |
| Lines | 533 |
| SHA-256 | `710f612df32c67712fca929551985b09e467fe1284e15c8d54e1fb7573e24990` |
| Evidence windows | Taiwan: 2022-08-10 to 2026-08-18; Iran: 2025-06-13 to 2026-08-18; Ukraine: 2022-02-24 to 2026-08-18 |
| Durable evidence keys | T01–T10, T-C1–T-C10, I01–I14, I-C1–I-C12, U01–U14, U-C1–U-C12 |
| Supplemental candidate key | I07-S1, an explicit Oman-source addition not present in the pack |
| Export limitation | inline `turn…` citation markers are opaque and cannot serve as public provenance |

The candidate uses the pack's fully authored Taiwan, Iran, and Ukraine common-core and actor-lens families. The pack's brief suggestions for additional Analyst-only Ukraine diagnostics are not complete questions and are not silently expanded in this design.

### Evidence classes

| Code | Meaning | Permitted use |
|---|---|---|
| OF | observed fact | neutral setup when directly supported and time-bounded |
| DP | declared policy | attributed actor position; not proof of intent or future conduct |
| DOC | doctrine or legal position | attributed and left contestable where law or interpretation is disputed |
| AA | authoritative assessment of another actor | assessment, never converted into that actor's doctrine or selected plan |
| SA | scholarly assessment | secondary support, subordinate to primary evidence |
| SAx | scenario assumption | invented condition stated on the card; no outside knowledge required |

Actor plausibility is not factual or legal equivalence. A source establishes that an actor said or assessed something; it does not make the claim neutral truth or make one answer correct.

## 2. Taiwan source register

| ID | Issuer, title, date | Class / use | Public URL | Resolution and caveat |
|---|---|---|---|---|
| T01 | PRC State Council, *The Taiwan Question and China's Reunification in the New Era*, 2022-08-10 | DP: unification, independence, external-interference position | [English text](https://english.www.gov.cn/archive/whitepaper/202208/10/content_WS62f34f46c6d02e533532f0ac.html); [Chinese PDF](https://lb.china-embassy.gov.cn/zyts/202208/P020220810734810690529.pdf) | verified official; actor policy, not neutral operational intent |
| T02 | China Coast Guard, Taiwan-area law-enforcement exercise announcement, 2025-04-01 | OF for announced exercise; DP/DOC for claimed authority | [Chinese](https://www.ccg.gov.cn/hjyw/202504/t20250401_2638.html); [English](https://www.ccg.gov.cn/mhenu/news/202504/t20250401_2641.html) | verified exact page; inspection/interception/detention were exercise claims |
| T03 | ROC Presidential Office, President Lai's national-security remarks and measures, 2025-03-13 | DP: cross-Strait status and Taiwan response | [Chinese](https://www.president.gov.tw/News/39105); [English](https://english.president.gov.tw/News/6919) | verified exact page; pack says 2025-03-17, but official page says 2025-03-13 |
| T04 | ROC Presidential Office, *Safeguarding Democratic Taiwan* action-plan material, likely 2025-11-26 | DP: Taiwan resilience/action plans | [Chinese candidate](https://www.president.gov.tw/News/39650); [English candidate](https://english.president.gov.tw/News/7048) | likely intended source, but pack lacks enough title/date metadata to prove exact match; owner confirmation required |
| T05 | U.S. Department of Defense, *Military and Security Developments Involving the PRC 2025* | AA: blockade-relevant exercises and PLA/CCG integration | [Official PDF](https://media.defense.gov/2025/Dec/23/2003849070/-1/-1/1/ANNUAL-REPORT-TO-CONGRESS-MILITARY-AND-SECURITY-DEVELOPMENTS-INVOLVING-THE-PEOPLES-REPUBLIC-OF-CHINA-2025.PDF) | verified; do not use the pack's 2,771 count without “as of late November 2024”; a different full-year measure uses different counts |
| T06 | U.S. Department of State, *Response to China's Military Exercise Near Taiwan*, 2026-01-01 | DP: opposition to coercive status-quo change and call for restraint | [Official page](https://www.state.gov/releases/office-of-the-spokesperson/2026/01/response-to-chinas-military-exercise-near-taiwan/) | official URL verified; site may render a technical-error shell, so capture an archive before shipping |
| T07 | White House, U.S.–Japan alliance fact sheet, 2026-03-19 | DP: cross-Strait peace and opposition to coercive change | [Official fact sheet](https://www.whitehouse.gov/fact-sheets/2026/03/fact-sheet-president-donald-j-trump-strengthens-u-s-japan-alliance-for-the-benefit-of-all-americans/) | verified |
| T08 | White House, U.S.–ROK joint fact sheet, 2025-11-13 | DP: peaceful resolution and status-quo language | [Official fact sheet](https://www.whitehouse.gov/fact-sheets/2025/11/joint-fact-sheet-on-president-donald-j-trumps-meeting-with-president-lee-jae-myung/) | verified; does not establish a combat commitment |
| T09 | Philippine Presidential Communications Office, Philippines–Japan joint statement, 2026-05-28 | DP: peace, stability, and peaceful resolution | [Official statement](https://pco.gov.ph/news_releases/the-philippines-japan-joint-statement-on-the-elevation-to-a-comprehensive-strategic-partnership-weaving-the-future-together-peace-prosperity-possibilities/) | verified; does not establish facility access or combat commitment |
| T10 | Japan Ministry of Foreign Affairs, Foreign Minister Motegi speech, 2026-02-20 | DP: Strait stability plus dialogue with China | [Official speech](https://www.mofa.go.jp/fp/pp/pageite_000001_01492.html) | verified |

### Taiwan claim register

| Claim ID | Auditable claim | Class | Source IDs | Candidate use |
|---|---|---|---|---|
| T-C1 | Beijing's published policy prefers its formulation of peaceful reunification and opposes independence/external interference | DP | T01 | Beijing objective frame only |
| T-C2 | Taipei says the ROC and PRC are not subordinate and Taiwan's future should be decided by its people | DP | T03 | Taipei objective/constraint frame only |
| T-C3 | CCG publicly trained for vessel identification, inspection, interception, and detention around Taiwan | OF + DP/DOC | T02 | plausibility of inspection instrument; claimed authority remains attributed |
| T-C4 | U.S. DoD assesses that 2024 exercises simulated joint blockade operations against major ports/bases | AA | T05 | instrument plausibility; not proof Beijing selected a plan |
| T-C5 | U.S. DoD reported increased aircraft detections using a late-November 2024 cut-off | AA | T05 | background only; numerical count omitted from cards |
| T-C6 | U.S. DoD assesses increasing PLA/CCG integration in Taiwan coercion | AA | T05 | plausibility of CCG instrument under PLA overwatch |
| T-C7 | Washington opposes unilateral status-quo changes by force/coercion and supports peaceful resolution | DP | T06, T07 | Washington lens |
| T-C8 | Japan calls Strait stability important while seeking stable China relations and dialogue | DP | T07, T10 | coalition heterogeneity |
| T-C9 | U.S.–ROK statement opposed unilateral change and supported peaceful resolution | DP | T08 | coalition heterogeneity; no combat inference |
| T-C10 | Philippines and Japan jointly emphasized peace, stability, and peaceful resolution | DP | T09 | coalition heterogeneity; no basing inference |

## 3. Iran/Gulf source register

| ID | Issuer, title, date | Class / use | Public URL | Resolution and caveat |
|---|---|---|---|---|
| I01 | IAEA Director General, introductory statement to Board of Governors, 2026-06-08; underspecified Iran chronology | OF: safeguards/verification status | [Exact IAEA statement](https://www.iaea.org/newscenter/statements/iaea-director-generals-introductory-statement-to-the-board-of-governors-8-june-2026); [possible supporting report](https://www.iaea.org/sites/default/files/documents/gov2025-50.pdf) | statement verified; the pack's second “Iran chronology” reference needs owner confirmation; verification gap is not a weaponization finding |
| I02 | UN Security Council, 10189th meeting record, 2026-07-02 | OF at event level; neutral conflict chronology | [Verbatim record](https://docs.un.org/S/PV.10189); [DPPA summary](https://dppa.un.org/en/speeches-and-statements/un-calls-for-maximum-restraint-to-preserve-ceasefire-between-the) | verified |
| I03 | UN Security Council Resolution 2817, 2026-03-11 | authoritative multilateral action | [UN record](https://digitallibrary.un.org/record/4105560?ln=en); [PDF](https://digitallibrary.un.org/record/4105560/files/S_RES_2817_%282026%29-EN.pdf) | verified; resolution does not settle every use-of-force claim in the conflict |
| I04 | IMO, Middle East/Hormuz highlighted incidents, through 2026-08-11 | OF: shipping incidents, fatalities, exposure | [Mutable incident page](https://www.imo.org/en/mediacentre/hottopics/pages/middle-east-highlighted-incidents.aspx); [Hormuz hub](https://www.imo.org/en/mediacentre/hottopics/pages/middle-east-strait-of-hormuz.aspx); [8 July statement](https://www.imo.org/en/mediacentre/pressbriefings/pages/imo-secretary-general-condemns-new-attacks-on-ships-in-strait-of-hormuz.aspx) | verified at access date; mutable count requires snapshot/hash before shipping |
| I05 | IMO, Red Sea incident record, through 2026-08 | OF: independent commercial-shipping impact | [Red Sea hub](https://www.imo.org/en/mediacentre/hottopics/pages/red-sea.aspx); [23 July statement](https://www.imo.org/en/mediacentre/pressbriefings/pages/statement-on-recent-attacks-in-the-red-sea.aspx) | verified; incident evidence does not prove Tehran ordered each attack |
| I06 | White House and PRC MFA, public records of U.S.–Iran MOU, 2026-06-15 to 18 | OF for announcement/signing; parties' descriptions are DP | [White House signing](https://www.whitehouse.gov/gallery/president-donald-j-trump-signs-a-memorandum-of-understanding-between-the-islamic-republic-of-iran-and-the-united-states-at-the-palace-of-versailles-france-on-june-17-2026/); [White House release](https://www.whitehouse.gov/releases/2026/06/president-trumps-iran-agreement-is-america-first-in-action/); [PRC MFA 15 June](https://www.mfa.gov.cn/eng/xw/fyrbt/202606/t20260615_11945847.html); [PRC MFA 18 June](https://www.mfa.gov.cn/mfa_eng/wjbzhd/202606/t20260618_11948298.html) | cross-party official confirmation; implementation remains uncertain |
| I07 | Qatar MFA, 2026-08-11; Iranian Embassy/MFA Iran–Oman Hormuz committee | OF/DP: mediation and off-ramp | [Exact Qatar page](https://mofa.gov.qa/en/qatar/latest-articles/latest-news/details/2026/08/11/advisor-to-prime-minister-and-foreign-ministry-official-spokesperson--israel%27s-rejection-of-gaza-peace-plan-continues-foot-dragging-on-ceasefire-deal) | Qatar half verified despite the Gaza-led title; pack-named Iranian page remains unresolved |
| I07-S1 | Oman Ministry of Foreign Affairs, Oman–Iran joint statement, 2026-06-23 | supplementary OF/DP: joint Hormuz working group | [Official Oman statement](https://www.fm.gov.om/en/48943/) | explicit ledger supplement; does not silently replace the missing Iranian half of I07 |
| I08 | White House, Operation Epic Fury releases, 2026-03 | U.S. DP only | [Objectives release](https://www.whitehouse.gov/releases/2026/03/operation-epic-fury-decisive-american-power-to-crush-irans-terror-regime/); [launch release](https://www.whitehouse.gov/releases/2026/03/peace-through-strength-president-trump-launches-operation-epic-fury-to-crush-iranian-regime-end-nuclear-threat/) | verified official actor rhetoric; loaded language is excluded from card copy |
| I09 | Israel Defense Forces, Iran-war briefings and legal position, 2026-02-28 | Israeli DP/DOC only | [live updates](https://www.idf.il/en/mini-sites/iran-israel-war-2026/live-updates-iran-israel-war-2026/february-28-2026-iran-israel-war-2026-live-updates/); [spokesperson briefing](https://www.idf.il/en/mini-sites/israel-at-war/briefings-by-idf-spokesperson-bg-effie-defrin/february-26-press-briefings/press-briefing-by-idf-spokesperson-bg-effie-defrin-february-28-2026/); [legal position](https://www.idf.il/en/mini-sites/iran-israel-war-2026/articles-iran-israel-war-2026/the-legality-of-operation-roaring-lion/) | verified actor sources; not neutral legal or damage findings |
| I10 | UN Security Council/DPPA, renewed ceasefire strain, 2026-07-02 | OF/status check | [Verbatim record](https://docs.un.org/S/PV.10189); [DPPA summary](https://dppa.un.org/en/speeches-and-statements/un-calls-for-maximum-restraint-to-preserve-ceasefire-between-the) | verified; same record as I02, distinct evidentiary use |
| I11 | Iranian government/MFA Persian statements on ceasefire and Hormuz | Iranian DP/DOC | no exact primary URL recovered | unresolved; candidate IRNA pages are not silently substituted; source/snapshot required before shipping |
| I12 | Gulf Cooperation Council, extraordinary and subsequent statements, 2025-06 and 2026-03 | Gulf DP | [1 March 2026 meeting](https://www.gcc-sg.org/en/MediaCenter/News/Pages/news2026-3-1-2.aspx); [16 June 2025 statement](https://www.gcc-sg.org/en/MediaCenter/News/Pages/news2025-6-16-5.aspx); [13 June 2025 statement](https://www.gcc-sg.org/en/MediaCenter/News/Pages/news2025-6-13-1.aspx) | verified; supports divergent Gulf concerns, not a unitary Israel–Gulf position |
| I13 | Hezbollah leadership statement via Al-Ahed/Media Relations, 2026-06 | movement DP | no exact movement-primary URL recovered | unresolved; secondary corroboration does not replace the named source without a ledger amendment |
| I14 | U.S.–GCC joint ministerial statement, 2026-06-25 | coalition DP | [GCC statement](https://www.gcc-sg.org/en/MediaCenter/News/Pages/news-2026-6-25-10.aspx) | verified |

### Iran/Gulf claim register

| Claim ID | Auditable claim | Class | Source IDs | Candidate use |
|---|---|---|---|---|
| I-C1 | 2025 attacks on Iranian nuclear facilities interrupted IAEA verification | OF | I01 | neutral nuclear background |
| I-C2 | IAEA reported loss of continuity of knowledge over specified material | OF, not weaponization | I01 | neutral core; card defines the phrase without using the quantity |
| I-C3 | UN record describes 2026 U.S./Israeli strikes followed by Iranian strikes on U.S. bases and Gulf states | OF at event level | I02 | common chronology |
| I-C4 | Resolution 2817 condemned Iranian missile/drone attacks on Gulf states | authoritative UN action | I03 | Israel/U.S./Gulf lens context |
| I-C5 | Washington publicly stated missile, naval, nuclear, and partner-network objectives | DP | I08 | U.S. objective frame only |
| I-C6 | Iran calls U.S./Israeli operations aggression and links the security environment to its Hormuz legal position | DP/DOC, contested | I11 | Tehran frame only; blocked from shipping until source resolved |
| I-C7 | IMO documented dozens of commercial-shipping incidents and seafarer deaths by 2026-08-11 | OF | I04 | maritime plausibility; live count omitted from cards |
| I-C8 | Qatar and Oman have remained involved in mediation/Hormuz discussion | OF/DP | I07, I07-S1 | mediator-lens plausibility; Qatar and Oman pages resolved, pack-named Iranian page unresolved |
| I-C9 | A first-stage MOU was publicly acknowledged while later UN reporting showed a fragile ceasefire | OF for announcement; status uncertain | I06, I10 | neutral core chronology |
| I-C10 | GCC states opposed Iranian attacks and had also criticized Israeli attacks on Iran | DP | I12 | prevents treating Gulf states as sharing every Israeli aim |
| I-C11 | Hezbollah leadership rejected unilateral disarmament and tied posture to wider arrangements | movement DP | I13 | aligned-group autonomy caveat; source unresolved |
| I-C12 | UN/IMO records show direct exposure for seafarers and trading states outside the main disputes | OF | I04 | mediator/trading-state lens |

## 4. Ukraine source register

| ID | Issuer, title, date | Class / use | Public URL | Resolution and caveat |
|---|---|---|---|---|
| U01 | UN General Assembly, Resolution ES-11/1, *Aggression against Ukraine*, adopted 2022-03-02 | authoritative UN resolution: legal/political baseline | [UN record](https://digitallibrary.un.org/record/3965290?ln=en); [English PDF](https://digitallibrary.un.org/record/3959039/files/A_RES_ES-11_1-EN.pdf) | verified adopted resolution; do not substitute the draft-resolution record |
| U02 | UN Human Rights Monitoring Mission in Ukraine, *Protection of Civilians in Armed Conflict — July 2026*, published 2026-08-12 | OF: time-bounded civilian-harm reporting | [Official update](https://ukraine.ohchr.org/en/Protection-of-Civilians-in-Armed-Conflict-July-2026); [PDF](https://ukraine.ohchr.org/sites/default/files/2026-08/Ukraine%20-%20protection%20of%20civilians%20in%20armed%20conflict%20%28July%29_ENG.pdf) | verified; July update uses a revised June comparator, so do not mix it with the earlier June release |
| U03 | President of Ukraine, *Open Letter to the President of the Russian Federation*, 2026-06-04 | Ukrainian DP: talks and Europe/U.S. guarantor role | [Official English page](https://www.president.gov.ua/en/news/vidkritij-list-prezidentu-rosijskoyi-federaciyi-vid-preziden-104769) | verified actor source; rhetoric is not neutral fact |
| U04 | Leaders of Ukraine, France, United Kingdom, and Germany, joint statement, meeting 2026-06-07; Ukraine publication 2026-06-08 | Ukrainian/European DP: ceasefire, contact-line starting point, guarantees | [Ukraine official English page](https://www.president.gov.ua/en/news/spilna-zayava-lideriv-franciyi-velikoyi-britaniyi-nimechchin-104789); [French official text](https://www.elysee.fr/emmanuel-macron/2026/06/07/declaration-conjointe-des-dirigeants-de-la-france-du-royaume-uni-de-lallemagne-et-de-lukraine) | verified with material pack correction: Poland was not a signatory; distinguish 7 June meeting from 8 June publication |
| U05 | Russian Ministry of Foreign Affairs, Sergey Lavrov roundtable remarks on Ukraine, 2026-06-23 | Russian DP: neutral/non-aligned/non-nuclear demand | [Official English page](https://mid.ru/en/press_service/video/view/2121604/); [public document mirror](https://primarynewssource.org/sourcedocument/foreign-minister-sergey-lavrovs-remarks-and-answers-to-questions-during-the-ambassadorial-roundtable-discussion-ukraine-crisis-the-wests-true-goals-and-role-moscow-june-23-2026/) | official URL verified but intermittently times out; actor demand, not neutral causation or legal status |
| U06 | Russian Ministry of Foreign Affairs, information bulletin for 2026-03-02 to 09 | Russian official chronology of trilateral rounds | [Official bulletin PDF](https://www.mid.ru/upload/medialibrary/7bf/388c83za0jc0nths4on5fvovvbzs3y3r/%D0%98%D0%BD%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%BD%D1%8B%D0%B9%20%D0%B1%D1%8E%D0%BB%D0%BB%D0%B5%D1%82%D0%B5%D0%BD%D1%8C%202%E2%80%939%20%D0%BC%D0%B0%D1%80%D1%82%D0%B0%202026%20%D0%B3%D0%BE%D0%B4%D0%B0.pdf); [Ukrainian cross-check](https://www.rnbo.gov.ua/en/Diialnist/7403.html) | exact official container verified; standalone Russian article unresolved; granular Analyst chronology still needs independent cross-check |
| U07 | U.S. Department of State, Secretary Rubio remarks to press at Le Bourget, 2026-03-27 | U.S. DP: ceasefire/negotiated settlement | [Official transcript URL](https://www.state.gov/releases/office-of-the-spokesperson/2026/03/secretary-of-state-marco-rubio-remarks-to-press-8/); [transcript mirror](https://www.globalsecurity.org/military/library/news/2026/03/mil-260327-state01.htm); [White House continuity](https://www.whitehouse.gov/briefings-statements/2025/11/readout-of-peace-talks-in-geneva/) | exact official URL verified but currently returns a technical-error/forbidden shell; capture an archive before shipping |
| U08 | North Atlantic Treaty Organization, *The Ankara Summit Declaration*, 2026-07-08 | OF/DP: 2026 allied support commitment and financing description | [Official declaration](https://www.nato.int/en/about-us/official-texts-and-resources/official-texts/2026/07/08/the-ankara-summit-declaration); [Ukraine-support page](https://nato.int/en/what-we-do/partnerships-and-cooperation/natos-support-for-ukraine) | verified; date any “current” financing description to July 2026 and do not infer an automatic military guarantee |
| U09 | European Council, conclusions on Ukraine and European defense/security, 2026-06-18 | EU DP | [Official conclusions](https://www.consilium.europa.eu/en/press/press-releases/2026/06/18/european-council-conclusions-on-ukraine-and-on-european-defence-and-security/) | verified; actor position only |
| U10 | PRC Ministry of Foreign Affairs, Wang Yi statement, 2026-02-14 | Chinese DP: dialogue, political settlement, nonparty framing | [Official Chinese page](https://www.mfa.gov.cn/wjdt_674879/wjbxw_674885/202602/t20260214_11860162.shtml) | verified; does not establish neutrality or implementation |
| U11 | PRC Ministry of Foreign Affairs, regular briefing, 2026-06-18 | Chinese DP/denial concerning lethal arms | [Official Chinese page](https://www.mfa.gov.cn/web/wjdt_674879/fyrbt_674889/202606/t20260618_11948460.shtml) | verified actor denial; not neutral OF |
| U12 | Indian Ministry of External Affairs, *Transcript of Bi-Weekly Media Briefing*, 2026-07-28 | Indian DP: dialogue and diplomacy | [Official transcript](https://www.mea.gov.in/media-briefings?dtl/41567/Transcript_of_BiWeekly_Media_Briefing_by_the_Official_Spokesperson_July_28_2026) | verified |
| U13 | Council of the European Union, Iran sanctions decision/release, 2026-01-29 | EU AA/policy on alleged Iranian support | [Official release](https://www.consilium.europa.eu/en/press/press-releases/2026/01/29/iran-council-adopts-new-sanctions-over-serious-human-rights-violations-and-iran-s-continued-support-to-russia-s-war-of-aggression-against-ukraine/); [framework](https://www.consilium.europa.eu/en/policies/sanctions-against-iran/); [legal act](https://data.europa.eu/eli/dec/2026/263/oj) | verified EU assessment/action; not an Iranian admission |
| U14 | IAEA Director General, introductory statement to Board of Governors, 2026-06-08 | OF/authoritative technical assessment: nuclear safety in Ukraine | [Official statement](https://www.iaea.org/newscenter/statements/iaea-director-generals-introductory-statement-to-the-board-of-governors-8-june-2026); [19 June update](https://www.iaea.org/newscenter/pressreleases/update-354-iaea-director-general-statement-on-situation-in-ukraine) | verified; safety concern is not a claim about battlefield responsibility beyond the source |

### Ukraine claim register

| Claim ID | Auditable claim | Class | Source IDs | Candidate use |
|---|---|---|---|---|
| U-C1 | UNGA ES-11/1 characterized Russia's action as aggression against Ukraine and demanded withdrawal of Russian forces | authoritative UN resolution | U01 | mandatory legal/political baseline on all Ukraine cards |
| U-C2 | Ukraine publicly seeks a ceasefire and negotiated peace combined with outside security commitments | DP | U03, U04 | neutral-core and Kyiv-lens setup, attributed to Ukraine |
| U-C3 | Ukraine and the European signatories say the current line of contact can start negotiations without recognizing borders changed by force | DP | U04 | Kyiv lens; never convert line of contact into sovereignty change |
| U-C4 | Russia's public settlement demands include neutral/non-aligned and non-nuclear status for Ukraine | Russian DP | U05 | neutral-core and Moscow-lens setup, expressly attributed |
| U-C5 | Russian sources reported multiple trilateral negotiating rounds in early 2026 | Russian official chronology | U06 | background only; not used in candidate setup |
| U-C6 | UN monitoring recorded 437 civilians killed and 2,610 injured in Ukraine in July 2026 | OF | U02 | background only; excluded from candidate setup |
| U-C7 | NATO allies pledged €70 billion in equipment, assistance, and training for Ukraine in 2026 | OF/DP commitment | U08 | outside-lens context; amount omitted from card |
| U-C8 | NATO said in July 2026 that European allies and Canada financed the vast majority of current security assistance to Ukraine | NATO authoritative description | U08 | dated outside-lens setup |
| U-C9 | China says it favors political settlement, is not a party, and has not supplied lethal weapons to either side | Chinese DP/denial | U10, U11 | dialogue portion only in outside-lens setup; denial not used |
| U-C10 | India reiterated in July 2026 that dialogue and diplomacy should be the way forward | Indian DP | U12 | outside-lens setup |
| U-C11 | The EU maintains sanctions based on its assessment of Iranian military support for Russia's war | EU AA/policy | U13 | background only; not an Iranian admission and not used in candidate setup |
| U-C12 | The IAEA says nuclear facilities in Ukraine remain a continuing safety concern | OF/authoritative technical assessment | U14 | background only; not used in candidate setup |

## 5. Exact candidate bindings

The `SAx` row is the complete invented scenario condition shown to respondents. Source IDs establish plausibility and the decision cells' public constraints; they are not extra facts a respondent must know.

| Candidate item | Setup claim IDs | Source IDs | SAx supplied on card | Prohibited inference |
|---|---|---|---|---|
| `taiwan_inspection_regime_core` | T-C1, T-C2, T-C3, T-C4, T-C6, T-C7 | T01, T02, T03, T05, T06 | ten-day regime; three ports; selected inspections; PLA overwatch; no firing; voluntary shipping suspension; Taipei rejects legality | operation imminence, settled blockade law, alliance entry |
| `taiwan_beijing_instrument` | T-C1, T-C3, T-C4, T-C6 | T01, T02, T05 | objective is pressure plus an off-ramp short of major attack | secret PRC intent, rules of engagement, selected war plan |
| `taiwan_taipei_continuity` | T-C2 | T03, T04 | objective is commerce, non-recognition, and clash avoidance | domestic unanimity, certain foreign intervention |
| `taiwan_washington_coalition` | T-C7, T-C8, T-C9, T-C10 | T06, T07, T08, T09, T10 | coalition interests overlap but exposure/risk tolerance differ | pre-authorized basing, escort, strike, or combat commitments |
| `iran_ceasefire_core` | I-C1, I-C2, I-C7, I-C9, I-C12 | I01, I02, I04, I06, I10 | formal ceasefire; two vessel attacks in 72 hours; mutual accusations; Gulf interceptions; verification gap; negotiations continue | material location, weaponization, settled attribution, current live ceasefire status |
| `iran_tehran_leverage` | I-C6, I-C9, I-C11 | I06, I10, I11, I13 | objective is a durable pause plus negotiating leverage | unitary command over aligned groups, legal correctness, source-resolved claim |
| `iran_israel_gulf_thresholds` | I-C4, I-C5, I-C10 | I03, I08, I12 (claim union); I09, I14 (actor-frame context) | parties agree on deterring renewed attacks but differ on tolerable residual capability | all Gulf states share Israeli aims; belligerent damage claims are facts |
| `iran_mediator_navigation` | I-C7, I-C8, I-C9, I-C12 | I04, I06, I07, I07-S1, I10 | mediator/trading state weighs navigation while the larger dispute persists | exact current traffic count, mediator neutrality, comprehensive settlement |
| `ukraine_ceasefire_stall` | U-C1, U-C2, U-C4 | U01, U03, U04, U05 | both sides accept outside monitoring in principle but disagree about what must precede a general ceasefire; definition of outside security commitment | private reservation points, Moscow's demands as neutral causation, a preferred settlement sequence |
| `ukraine_kyiv_security_architecture` | U-C1, U-C2, U-C3 | U01, U03, U04 | ceasefire is available; Ukraine remains outside NATO; one post-ceasefire architecture must be selected | automatic intervention, a contact line as a legal border, reader support for Ukraine |
| `ukraine_moscow_bargaining_tradeoff` | U-C1, U-C4 | U01, U05 | Russian negotiators cannot obtain every stated demand | legal equivalence, justification of invasion, private Russian minimum terms |
| `ukraine_external_division_of_labor` | U-C1, U-C8, U-C9 (dialogue portion only), U-C10 | U01, U08, U10, U12 | the war and talks continue; Europe, United States, China, and India all want a ceasefire but differ over military risk | China/India as military guarantors, July support description as timeless, Chinese denial as neutral fact |

## 6. Quarantine and release status

These claims are excluded from candidate card prose:

- T05's 2,771 aircraft-detection figure without its late-November 2024 cut-off;
- any statement that Beijing selected an inspection, quarantine, or blockade plan;
- any claim that a partner has pre-authorized territory, escorts, strikes, or combat;
- I04's mutable incident total unless an archived snapshot and hash are stored;
- any inference from IAEA verification loss to weaponization, diversion, or exact material location;
- any claim that Tehran ordered every act by Hezbollah, Iraqi groups, or the Houthis;
- claims of belligerent destruction percentages, casualty totals, or permanent nuclear-program destruction;
- any description of “the Gulf” as a unitary Israeli military ally;
- Ukraine casualty, battlefield, weapons-stock, or territorial-control claims not needed by a card;
- any conversion of Russia's “root causes” formulation into neutral causation or of a contact line into legal recognition;
- private minimum terms, predictions of collapse, or an automatic military response inferred from “security guarantee”;
- U-C8's “current” support description without the July 2026 date, or U-C9's Chinese denial as neutral fact;
- claims of Iranian support in Ukraine without attribution to the EU assessment and policy action.

Shipping provenance status is **HOLD**. T04 is only a likely match; the Iranian half of I07 plus I11 and I13 lack exact named primary URLs; T06 and I04 require durable snapshots. All Ukraine IDs have usable public URLs, but U04 requires the signatory/date correction recorded above, U06 resolves to an official bulletin rather than a standalone article, and U07's exact official page needs an archive capture. Exact IDs remain in the design so gaps and corrections stay visible rather than being replaced with weaker sources.
