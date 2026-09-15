# Navigation and reader copy: before / after

Base: PR59 merge `445c5d6107c6c90402155654dad8e97bc82c54dc`. Its final head matches the accepted `b10da2ed8149aa8f1ffb907651b22f2405c3357e`. Scope: navigation, parent links, the AI Field Guide and a narrow Profile-label wrapping fix exposed by the 320px acceptance check.

## Field Guide

### Opening

**Before:** Six approaches to governing powerful AI answer the same question differently: who may inspect a model, release it, restrict it, or stop it. This guide works one decision through all six and sets out where each would put those powers. It ends with what the questionnaire leaves out.

**After:** A lab has built a powerful model. Releasing its weights would let others study and use it independently; keeping the weights inside the lab would limit that access. Who should decide, and what would justify their choice?

“Powerful” is retained from the supplied passage, as authorized by this brief. AI Governance now names the parent link; the questionnaire action remains separate.

### Shared scenario

**Before:** The fictional Larch Research Institute must decide how to provide access to a capable model for the next three months. Its internal tests show useful software and cyber assistance but do not establish autonomous attacks, and no misuse has been observed outside testing. The options are downloadable weights, qualified external evaluation in a secure enclave, or a hosted service with deeper evaluation kept inside Larch. In the enclave, an independent panel admits qualified teams and Larch cannot veto a qualified applicant; a revised arrangement gives Larch the final veto. Staffing, screening criteria, wait times and publication rights stay the same under both.

**After, displayed as setup, options, admission comparison and unchanged conditions:**

The fictional Larch Research Institute must decide how to provide access to a capable model for the next three months. Its internal tests show useful software and cyber assistance but do not establish autonomous attacks, and no misuse has been observed outside testing.

- Publish downloadable weights that anyone can run or modify. Released copies cannot be recalled.
- Admit qualified external evaluators to a secure enclave, with general access through a monitored hosted service.
- Offer a monitored, rate-limited hosted service, keeping weights and deeper evaluation inside Larch.

**Original admission:** An independent panel admits qualified teams and makes final admission decisions. Larch cannot veto a qualified applicant.

**Revised admission:** The revised arrangement gives Larch final admission power and a veto over applicants who meet the same criteria.

**Unchanged conditions:** Staffing, budget, screening criteria, wait times, research permissions and publication rights stay the same. Capability and misuse evidence, and the public-weights and hosted-service options, also stay fixed.

**Research permissions:** Qualified enclave participants may inspect and modify the model, export approved findings and publish criticism under the existing export terms. Weights remain inside the enclave.

**Uncertainty:** Larch does not know how much new benefit or misuse wider access would produce. No arrangement guarantees safety or useful criticism.

This restores visible details from `getPublishedDecision("who-gets-access")`: general hosted access alongside the enclave, budget, research permissions and export terms. The published exercise is unchanged. No staff shortage, safety guarantee, catch-up deadline or appeal mechanism is added.

### Precautionary Steward

**Before:** The model's cyber assistance raises the question of what wider release would enable. An enclave lets outside teams investigate while the downloadable weights stay inside Larch. The argument then asks what further evidence would justify giving up the ability to recall copies. Irreversibility alone does not answer every release question.

**After:** Publishing the weights would let anyone run or modify the model, and Larch could not retrieve the released copies. An enclave gives qualified outsiders access without distributing those weights. A precautionary argument favors keeping that control while further testing examines the cyber risks and what would justify wider release.

### Strategic Competitor

**Before:** Hosted access and enclave evaluation both keep the model's copies under Larch's control. Wider release could also help other actors develop the capability. So this argument weighs the value of outside scrutiny against access by teams whose strategic interests conflict with Larch's. The three-month period is a horizon for the decision, not evidence of when a rival will catch up.

**After:** Publishing weights would let competitors build on Larch's work. Hosted access or an enclave would keep the weights inside, while offering different opportunities for outsiders to investigate. A strategic argument asks which researchers should gain access, what they could learn, and how that knowledge might benefit a rival.

### Coordination Architect

**Before:** Under the original arrangement an independent panel applies an admission rule that Larch cannot override. A coordination argument asks whether other institutes could adopt comparable criteria and recognize the evaluations that result. The developer veto moves final discretion to Larch. The arrangement still has rules; what changes is who decides the hard cases and whether an excluded applicant can contest the decision.

**After:** Other institutes could use comparable admission criteria and recognize one another's evaluations. The independent panel gives Larch less discretion to exclude qualified applicants. A coordination argument asks whether that arrangement could support cooperation between institutes, and how a developer veto would affect their willingness to rely on it.

### Democratic Guardrailist

**Before:** Evaluators keep the right to publish criticism under both enclave arrangements. Accountability also depends on who gains access and who can contest an exclusion. This argument asks who appoints and oversees the admission authority. Independence from Larch does not by itself make the panel publicly accountable.

**After:** Evaluators may publish criticism under both arrangements. The difference is who gets inside: an independent panel admits qualified teams in the first; Larch can veto them in the second. Public accountability raises another question: who appoints that decision-maker, oversees its choices and hears a complaint from an excluded researcher?

### State Capacity Builder

**Before:** Screening applicants and supporting their investigations takes staff and money, and in this exercise both stay fixed. The argument asks whether the responsible bodies can perform the work they authorize, and who covers a shortfall if they cannot. It wants that answer before it treats hosted access as the only workable arrangement.

**After:** The enclave requires people to screen applicants and support their work. A state-capacity argument asks whether the responsible bodies have the staff, money and authority to do that job. Before choosing, it would need to know how much work each arrangement requires and who can deliver it.

### Open Ecosystem Builder

**Before:** Downloadable weights let researchers outside the qualified group reproduce and modify the model. The enclave limits who takes part even when an independent panel decides admission. This argument weighs broader investigation against copies Larch cannot revoke. Support for independent scrutiny does not by itself settle whether unrestricted release is justified.

**After:** Publishing the weights lets researchers outside the qualified group reproduce and modify the model. An independent admission panel still leaves some researchers out. Wider access would reduce that dependence on permission, but Larch would lose the ability to recall the copies. Is access for more researchers worth giving up that control?

These remain illustrative arguments, with several approaches able to support the same option. The accountability question asks what would be needed; it does not supply an appeal process. Fixed resources are stated in the scenario, not repeated as a caveat in the State Capacity Builder reading. Repetitive short questions were removed for the Steward, Architect and Capacity Builder; the other three remain.

### Framing and the three exact edits

- **Illustrations:** The repeated closing paragraph (“These readings are authored illustrations. Nothing on this page is scored, and none of them is attached to you…”) becomes one introduction: “These illustrative arguments show how the six approaches could read this decision. Several may support the same arrangement for different reasons. To make your own decision, open the exercise.”
- **Open Ecosystem Builder / Coordination Architect:** “Wider reproducibility comes with copies that nobody can restrict afterward, and shared rules can harden into a club of the already powerful.” → “Wider access allows more researchers to reproduce the work, while Larch loses the ability to recall released copies. Shared rules raise a different concern: whether the participating firms and states would exclude others.” Recall of copies is distinct from later legal restrictions.
- **Worker voice:** “Would your result change if worker voice, and neither frontier safety nor state capacity, were the starting point?” → “How would you judge workplace AI if workers' bargaining power were your main concern?” This is a reading prompt, with no inferred score change.
- **Axes:** “Your answers give positions on these axes. Each runs between two poles, and either end is a position. Each approach weights those positions differently, and the comparison decides which result leads. It says nothing about technical expertise, or about whether the institutions you favor can be built in time.” → “Your answers give positions on the axes below. Each approach weights those positions differently; the comparison determines which result leads.” Pole definitions stay visible; Method is linked beside the explanation.

## Navigation labels and links

| Destination | Before | After |
| --- | --- | --- |
| `/quiz` on root | Inventory | Foundation |
| `/explore` | Atlas / Explore / field guide | Library |
| `/modules` | Focus Areas | Security and Technology |
| `/profile` | My Profile / profile | Profile |
| `/explore/atlas` in Profile | Open Atlas | Open Worldview Map |
| `/explore/reference` | Thinkers & public positions / reference profiles / reference directory | Thinkers |
| `/ai/atlas` | AI Atlas / The six approaches / AI governance archetypes | AI approaches |
| AI questionnaire chrome | AI Questionnaire / AI Governance Compass / Exit to AI home | AI Governance |
| Perspective chrome and return links | Perspective Brief / Exit to briefs / All briefs / Try another brief | Perspective Run / Perspective Runs |
| Foundation archetype return | Back to your result or Take the Foundation | Foundation archetypes, plus Your Foundation result when the existing allowlist accepts it |
| Case source/correction return | Return to the case | The case’s title |
| `/method` in shared chrome | Methods | Method |

**Root explanation:** “Begin with the Foundation: fourteen questions about the arguments people reach for when world politics gets hard. Then, if you want, take Security, Technology, or AI Governance…” → “Foundation asks fourteen questions about the arguments people reach for when world politics gets hard. You can also start with Security, Technology, or AI Governance…” The final clause is unchanged. Security, Technology and AI Governance each have an ordinary secondary link. The five destination IDs, paths and globe interaction are unchanged. The approved Chinese explanation retains its recommendation to start with Foundation under the Chinese prose freeze; the secondary links allow independent entry without a prerequisite.

**Mobile introduction:** “Take the Foundation, then Security, Technology, or AI Governance. Cases and Perspective Runs put your judgment to work.” → “Choose Foundation, Security, Technology, or AI Governance. Cases and Perspective Runs put your judgment to work.”

World Stage, Decisions and the Library’s deeper indexes are included in compact navigation. Detail templates now supply or reuse destination links, including shared/invalid results and missing thinker records. Existing Futures links remain in place. The new All decisions link performs document navigation through the existing clear-on-exit lifecycle. Questionnaire step Back, saved drafts and result-return allowlists retain their existing behavior.

**Chinese interface wording for owner inspection:** Root 问卷 → 基础问卷; 图谱 → 观点资料. Shared navigation 议题专题 → 安全与技术; 我的画像 → 档案; 思想家与公共立场 → 思想家. Added destinations use 世界舞台, 决策练习, AI 治理取向, 基础原型, 安全, 技术 and 关于. 基础问卷, 观点资料, 档案 and 世界舞台 reuse existing interface equivalents. The Worldview Map’s secondary links use 思想家 and 档案. Approved Chinese explanatory copy and questionnaire text remain unchanged; unsupported routes keep the existing translation-status notice.

**Footer:** Personal contact/social links leave the global footer. About is added beside Method, Privacy and Corrections and contact, with prefetch disabled to preserve the exercises’ existing request boundary. Authorship, the project email on About/contact, licence files and attribution remain.

## Style-guide corrections

- The “sided with the institutionalist reading” exemplar becomes: “The strongest contribution to Institutionalism's lead came from your answers about institutions.” It requires the actual largest positive contribution to the lead over the compared rival; a label alone cannot establish a belief.
- Standard navigation and repeated control labels are desirable. The rule targets repeated empty explanations.
- Necessary figure explanations may stay beside the figure. Notes correcting prior drafts belong here.

## Review evidence

### Original-size screenshots

All images are unscaled viewport captures at device-pixel ratio 1, 900px high. The after images use the production build. The [before introduction](../../artifacts/navigation-reader-copy/before/field-guide-intro-1440.png) uses the verified base in development mode.

| View | Inspected after screenshots |
| --- | --- |
| Field Guide introduction | [390px](../../artifacts/navigation-reader-copy/after/field-guide-intro-390.png) · [1440px](../../artifacts/navigation-reader-copy/after/field-guide-intro-1440.png) |
| Worked admission comparison | [1440px](../../artifacts/navigation-reader-copy/after/field-guide-scenario-1440.png) |
| Six illustrative readings | [1440px](../../artifacts/navigation-reader-copy/after/field-guide-readings-1440.png) |
| Powers table | [320px](../../artifacts/navigation-reader-copy/after/field-guide-powers-320.png) · [768px](../../artifacts/navigation-reader-copy/after/field-guide-powers-768.png) · [1440px](../../artifacts/navigation-reader-copy/after/field-guide-powers-1440.png) |
| Decision Pattern parent | [390px](../../artifacts/navigation-reader-copy/after/parent-route-390.png) · [1440px](../../artifacts/navigation-reader-copy/after/parent-route-1440.png) |
| Expanded mobile menu | [390px](../../artifacts/navigation-reader-copy/after/menu-390.png) |
| Shared Profile label wrapping | [320px](../../artifacts/navigation-reader-copy/after/shared-profile-320.png) |

**Visual inspection:** Each linked image above was opened and inspected, plus the introduction at 320/768px and the 1440px no-JS and print-media captures. The original/revised admission headings remain visible; prose is narrower than the desktop table; the six readings use unfilled paired columns; mobile powers rows stack their two labeled cells without horizontal overflow. The menu scrolls within the viewport. The print capture is a browser print-media view, not a paginated PDF review. Other retained captures are supporting records, not claimed visual inspections. The scoped layout scan returned no findings.

### Checks

**Run here, passed:** `npm run validate`, `npm run lint`, `npm run test` (722/722), `npm run typecheck`, `npm run copy:audit:strict`, `npm run evidence:audit:check`, and the production build with an empty Mapbox token. The strict gate passed; recorded copy findings remain 17 P0 / 132 P1 / 1,101 P2, unchanged from the base—not zero advisory findings.

The complete CI browser sequence ran against production servers, with `CI=1`:

| Stage | Local result |
| --- | --- |
| `npm run test:e2e` | 181 passed, Chromium |
| Decision-exercise configuration | 29 passed, Chromium |
| Result-interpretation configuration | 25 passed, 1 existing skip, Chromium + WebKit |

**Exclusions:** The 162-route crawl runs once in Chromium; its duplicate WebKit run remains skipped, while representative interactions run in both engines. The main suite remains Chromium-only. Existing development-server exclusions for cache headers, Departure privacy and three print tests did **not** apply because these runs used production servers. PR59’s prior accepted CI record and the workflow configuration were read; that historical run was not rerun here. Current-head remote CI is reported on the draft PR.

**Keyboard and reflow:** Native Tab reached every menu link, scrolled focused links into view, and kept focus rings inside the panel. Escape returned focus to the trigger; Tab could leave the non-modal menu. Fresh pages checked 39 parent/recovery/shared routes at each of 320/390/768/1440px, with no horizontal overflow. Separate checks covered locale dispatch, preserved module drafts, clearing ephemeral decision answers on exit, semantic table header associations, anchors, print and no-JS content.

Earlier browser runs caught obsolete label assertions and the new About link’s unintended prefetch; exact expectations and the prefetch behavior were corrected without relaxing privacy or content checks. Clean reruns also resolved local evidence-refresh/generated-report races. Historical evidence and screenshot baselines were not rewritten; generated exercise outputs went to scratch locations. Only the authorized current evidence summary and this change’s captures are retained.

The first remote CI run found a 2px shared-Profile overflow at 320px. Its existing `nowrap` labels also exceeded their card’s text area locally. Profile labels now wrap within that area; wording, typography and scoring are unchanged. The acceptance test additionally checks each label against its container, retaining the viewport assertion. The 320px correction screenshot above was visually inspected.

Text checks prevent known regressions; they do not prove semantic equivalence. The no-positive contribution fixture modifies signs to exercise a helper state; it does not demonstrate that a complete questionnaire produces that state.
