# IR Worldview Inventory: final product evaluation

**Audit date: 19 September 2026. Author: Codex, with four DeepSeek MCP review workstreams.**

**Verdict: ready for a small, moderated pilot after a short trust-and-copy pass.** There is enough substance here to learn from real users now. There is not yet an evidenced basis for treating the output as a validated measurement of a person, or for investing in it as a venture-scale business. Those are different thresholds.

The strongest product is a place to examine a judgment, encounter a serious competing argument, and discuss what would change one's mind. The weakest product is a machine that assigns an impressive name and then surrounds it with qualifications. The former is already present, especially in the two decision exercises. Make that experience the standard for the rest of the site.

This is an evaluation, not an implementation sprint. Application code, scoring, payload formats, dependencies and production were not changed. The files in this folder are the deliverable.

## Read this package

- [Detailed copy review and rewrites](COPY-REVIEW.md): specific editorial judgments, including current copy and legacy candidates.
- [851 copy-pattern candidates](copy-candidates.csv): every flag from the reviewed source scanner, with exact text, file, line, source link and server-text matches. These are candidates, **not 851 proven defects or proof of AI authorship**.
- [210-route coverage ledger](route-coverage.csv): every enumerated public/recovery URL, including Chinese variants and all discovered reading/scenario leaves.
- [477-file source ledger](source-file-coverage.csv): audited extraction scope, line counts and SHA-256 hashes.
- [Verification and delegation review](VERIFICATION.md): production version, test results, reproducible probes, rejected DeepSeek claims, and limitations.
- [Pilot protocol](PILOT.md): the next research step, with concrete tasks and decision gates.

## What was actually evaluated

The live site was already beyond PR 63. Production deployment `b49365f79bdd4306fbe62d9f8ee2e48f130f5008` includes PR 64. The isolated audit source has the **same Git tree**, `5582b768a72469120743f3725ab383a4e8e133f2`, as that deployment. Findings concern that production version, not the older checkout in the user's working directory.

Coverage combined live browser use, source review, synthetic probes and the project's automated suite. The live walkthrough completed Foundation, AI Governance, Security Standard, Technology Standard, an Exposed Ally Perspective Run, the European missile-defence Current Case, both decision exercises, the twelve Futures preferences and The Departure. It also inspected Profile, comparison, navigation, reading surfaces and World Stage. Other role packs, extended forms, recovery states, Chinese flows, sharing and responsive behavior received source/automated coverage rather than a claim of every combination being manually played.

All 210 enumerated routes resolved: **208 returned HTTP 200; `/learn` and a deliberately nonexistent route returned 404**. HTTP 200 includes intentional invalid-payload and unavailable-language explanations. It is not equivalent to a working interactive completion. Source extraction covered 477 files and 102,604 lines, yielding 11,641 candidate text fragments. This is a traceable coverage record, not a claim that every line was read with equal human attention. Nor is this a security penetration test, a full accessibility certification, a legal review, or empirical instrument validation.

The production-equivalent source passed **lint, 745 unit tests, a production build and 218 Chromium browser tests**. Four additional audit probes passed after correcting an erroneous punctuation expectation in the probe itself. A passing probe can reproduce a defect; “passed” does not mean its observed behavior is desirable.

## The judgments that matter most

### 1. There is a real editorial product here

The visual identity is distinctive: controlled typography, restrained color, careful reading widths, and a globe that feels related to international politics. It does not generally look like a generic SaaS dashboard. Replacing its visual system would destroy more value than it creates. The strongest layouts explain a question before asking the reader to learn the interface.

The arms-control worked example on Foundation results gives the abstract dimensions somewhere to operate. The distinction between a government's power, the rule governing that power, and the evidence needed to trust it is useful. The decision exercises improve on many personality quizzes by recording a choice and its stated reason, changing a specific condition, and allowing the respondent to withhold judgment.

Versioned payloads, reproducible scoring, explicit limitations, invalid-link recovery, review before submission, and separate actor-lens judgments show serious engineering and methodological care. These are substantive strengths. More tests or more disclaimers alone will not solve the remaining interpretive problems.

### 2. The product still asks the reader to understand too many systems

Foundation, Foundation archetypes, the Worldview Map, Decision Patterns, Thinkers, modules, AI approaches, Perspective Runs, Current Cases, Futures and Profile are each defensible. Together they make the reader learn the project's architecture before knowing what to do next.

A novice can reasonably ask: Is “Musyawarah” my result, is Constructivism my result, is a Decision Pattern another result, and why is AI Governance a separate system? “Reading,” “position,” “lane,” “lens,” “form,” “reference” and “registered” do not reliably answer that question.

Keep the breadth available, but give the first visit a clear route: answer one question set, understand one concrete implication, inspect one rival argument, and choose one next exercise. The Library can hold the rest. This is a navigation and explanation task, not a demand to delete the content.

### 3. The system is often more honest in its footnotes than in its headline

The site repeatedly says that model outputs are not durable traits. Yet some headings and explanations say that a role moved the user, that a judgment held steady, or that a specific pair of traditions defines an undifferentiated result. These statements can exceed what the computation establishes.

The correction is not another paragraph saying “this is not a diagnosis.” Make the claim itself smaller and more concrete. Describe the submitted answers, the operation applied to them, and the question they leave open.

### 4. There is enough to pilot; there is not enough evidence to declare success

The missing evidence is whether other people understand and value the experience without the creator explaining it. This audit cannot substitute for that. An articulate model can rationalize almost any polished result. Friends may praise the work to be kind. The pilot must require observable comprehension and a useful discussion, not only agreement with a label.

## Priority findings and acceptance conditions

Severity here is about the intended pilot. **P1** means fix before unmoderated sharing or an expert evaluation that relies on the affected claim. **P2** means meaningful improvement or research issue. **P3** means polish or maintenance. No verified P0 production blocker was found.

| ID | Priority | Finding, evidence and consequence | Smallest coherent remedy / acceptance condition |
|---|---|---|---|
| F01 | P1 | Opening a Foundation result on a clean browser writes it into `ir-worldview-history` and says “Saved to this device.” The recipient did not complete the questionnaire. The new Profile correctly remains empty, so the defect is specifically the older history path. See `evidence/share-recipient-storage.json` and `share-recipient-profile.txt`. | Save completed results through the existing completion intent; shared views remain read-only unless explicitly saved as someone else's result. A clean recipient must acquire no personal-history record merely by opening a link. |
| F02 | P1 | A failed storage write still produces “Saved to this device.” The probe throws on `Storage.setItem`; storage remains empty and the success label appears. See `storage-failure-and-404.json`. | Storage writes return an outcome; only display success after success. Offer an accurate temporary-result message when unavailable. |
| F03 | P1 | Old history compares Core and extended-form results when locale and copy version match. Its record lacks question-set/scorer provenance. The probe produces “Changed from Constructivism to Realism” after opening two different-form links. | Retire this duplicate comparison surface or retain full provenance and distinguish comparable completions from supplied/opened results. Never imply longitudinal personal change from this sequence. |
| F04 | P1 for expert use | An all-midpoint Core input ties all four family scores at zero but receives Kairos–Grotian and an “initial” Realism–Institutionalism read. All-agree and all-disagree inputs produce the same scores. The prose acknowledges ambiguity, but does not explain why the other two tied families disappear. | Give the tied/flat case an insufficient-differentiation presentation. Preserve the existing payload and score if needed; do not present enumeration order as evidence for a special two-family blend. |
| F05 | P1 for expert use | Perspective scoring adds authored option offsets to the saved baseline and clamps to 1–7. The UI says “The role moved you” and that held dimensions mark judgments the role “could not shake.” A zero offset, absent signal or clipping is not evidence of stable judgment. | Say “These role choices receive a higher modeled emphasis on…” and “The model assigned little/no change here.” Remove causal and resilience claims. Keep the exercise; do not treat it as a measured treatment effect. |
| F06 | P2, fix in trust pass | Technology showed Control posture **4.2** on Open–Control-first and called it open; Governance **4.4** on National–Coordinated and called it national. Form calibration supports the text, while the apparent midpoint of the meter suggests otherwise. | Align meter interpretation and prose. Mark the relevant reference/band or use a categorical directional display. Do not silently alter the scorer to make the picture convenient. |
| F07 | P2, factual correction | The European missile-defence case says “Ten European states and Ukraine,” implying eleven. Its own ledger and the primary declaration name ten countries total, including Ukraine. | “Ten countries, including Ukraine” or “Nine other European states and Ukraine.” Correct both languages and record the correction. |
| F08 | P2, pilot operations | `/feedback` refuses general product submissions; live `/beta` says interviews are not accepting bookings. The site invites evaluation without a working general feedback route. | Use the existing external beta configuration or provide the moderator's channel in invitations. No new in-app form is necessary. Verify an evaluator knows how to report confusion. |
| F09 | P2 | Fresh Foundation entry shows the introduction/Start Foundation and an active first question together. After refresh the introduction disappears. “Start” is not a crisp state boundary. | Show a clear introduction or an active questionnaire, with a deliberate transition and a clearly labeled resume state. |
| F10 | P2 | Foundation's seven numeric buttons expose labels such as “2 out of 7”; review later supplies the verbal disagreement label. Scale semantics are less accessible while answering than while reviewing. | Give every choice its verbal meaning, group it as one response scale, and verify keyboard/screen-reader use. Maintain selection without auto-advance. |
| F11 | P2 | Adjacent forward/reverse Core pairs often ask compatible propositions, then collapse them to a single score. Specific pairs are reviewed below. | Conduct item-level cognitive interviews. Rewrite only with explicit copy/version handling; do not substitute a wholesale item bank during a polish sprint. |
| F12 | P2 | AI Governance's fresh result places all 22 exact answers before the worked application. This is valuable evidence, but a long interruption before the practical payoff, especially on mobile. | Keep the revealing pair visible and collapse the complete transcript. Make its page-memory lifetime clear near its action. |
| F13 | P2 | AI result “Strategic Competitor” led with a paragraph about public supervision/authorization. The driver of the category and the driver of the hero paragraph are not the same selection rule. | Connect the title to its actual differentiating evidence in one sentence, or lead with the concrete positions and subordinate the category. |
| F14 | P2 | Security labels “Gray-zone sabotage” an Explanation question but options prescribe actions: publish a threshold, create a cell, hold measures, prioritize repair. Technology has a similar diagnosis/prescription mix. | Make the selectable sentence a cause if measuring explanation. Put the implied policy in a separate sentence or subsequent question. |
| F15 | P2 | Sharing a result keeps extensive second-person wording. A recipient may read “your recorded position” as their own, amplified by F01. | Identify it as a shared reading at entry. Use neutral wording unless completion provenance establishes it is the viewer's own result. |
| F16 | P2 | Several archetype catalogue cards say “Your answers…” even for an untested visitor. This is a direct context error, not merely a preference about style. | Use “This reading…” or a concrete third-person description in browse pages. |
| F17 | P2 | Result, Profile and module explanations repeatedly use “registered form,” “recorded position,” “read,” “lane” and “model emphasis.” The reader pays an unnecessary translation cost. | Use “answers,” “result,” “question set,” “topic” and “what this approach emphasizes” where precise. Keep technical vocabulary in Method/evidence disclosures. |
| F18 | P2 | The model's large synthetic calibration ensembles can establish behavior under constructed inputs, not human reliability, norms, fairness or predictive validity. The site mostly says this correctly; names and numbers can still overwhelm the limitation. | Preserve the distinction in every claim and evaluation brief. The next evidence must come from people, with a defined intended interpretation. |
| F19 | P2 | Current Case assumption challenges introduce declarative new information under “changed assumption.” The heading implies a hypothetical, but a hurried reader of a sourced news case could read it as an update. | Begin “Suppose…” and label it hypothetical. Attach a source only if the statement is intended as a reported fact. |
| F20 | P2 | Cases were published 17 July, review due 24 July; on 19 September they still appear under “Recent cases.” The overdue status is honestly shown. | Review them, or explicitly frame them as archived exercises from July. Do not let “current” imply active monitoring. |
| F21 | P2 | Futures offers twelve broad conditions but many inherited scenario descriptors are unspecified. Comparison can be dominated by what the source omitted rather than an actual disagreement with the user. | Retain “unspecified” and distinguish it from conflict. Explain why each recommended world is discussable; do not rank sparse entries as worse futures. |
| F22 | P2 | The Departure is three comparisons but thirteen response groups, plus extensive reading. Editing an earlier choice deliberately clears later choices. Correctly disclosed, still a substantial time cost. | State the effort at entry and make downstream clearing salient at the edit action. Test whether the repeated shelf distracts from completion. |
| F23 | P2 | Primary prose uses raw 3/5 directional bands, while category/modifier routing can use form-specific calibration. A synthetic extended result had unresolved normative hero prose and a Universalist modifier in old history. | Audit agreement between headline, prose, badges and history as distinct outputs. When the readings legitimately differ, say why at the point of use. |
| F24 | P2 | Seven-dimensional profiles are projected onto authored two-dimensional maps. Distinct profiles can share a point; restraint does not enter this map's coordinates. Distance can look more informative than it is. | Keep the projection explanation and full dimensions accessible. Never use apparent proximity as empirical similarity or hide overlap behind a single marker. |
| F25 | P3 | English nonexistent route renders an English body and `lang=en`, but browser title is “国际关系世界观清单”. Reproduced after hydration. | Correct fallback metadata; test body, language and title together in both locales. |
| F26 | P3 | `/learn` is 404 while older documentation advertises it. No broad live navigation outage was found. | Update stale documentation or redirect to the current Library. |
| F27 | P3 | Foundation has repeated share controls; identical comparison produces seven repetitions of the same observation. | Keep a clear main share action and summarize identical dimensions once, leaving the table available. |
| F28 | P3 | Contribution values such as +2.004 are exposed as exact arithmetic, but can look like measurement precision. Many repeated disclosures then explain why not to overread them. | Show a simple ranked contribution explanation by default; retain exact arithmetic in a calculation disclosure. Keep internal coefficients unchanged. |
| F29 | P3 | The catalogue names Musyawarah, Shi, Kairos, Grotian, Satyagraha, Dirigisme, Dependencia and Concert impose unequal translation burdens. | Add short, accurate functional glosses alongside every name. Test comprehension, not just memorability or preference. |
| F30 | P3 | World Stage auto-rotates and cycles substantive views. It can change the map while someone reads its evidence. Pause works and documented membership maps have clear dates. | Consider pausing on deliberate inspection. Keep the theatrical entrance distinct from reading behavior. |
| F31 | P3 | Chinese coverage is partial: unsupported areas provide English-only notices rather than silently translated instruments. The navigation still exposes many such detours. | Tell readers which journeys are available in Chinese before they enter them; retain explicit unsupported states. |
| F32 | P3 | Legacy helpers contain more sweeping profile/trait prose than current renderers. Static scans will overstate live problems unless call sites are traced. | Mark or isolate compatibility copy and remove demonstrably dead copy only in a separately reviewed cleanup. Do not mass-rewrite from a CSV. |
| F33 | P1, privacy wording | AI review says “No data leaves your browser.” Generate computes locally, then navigates to `/ai/results/<encoded scores>`, which is resolved by a server page. Derived scores are data, even though the raw answer transcript stays in page memory. Privacy describes URL disclosure correctly elsewhere. | Replace the absolute promise with “Your answers are scored in this browser. The result page URL contains your scores; the answer transcript stays here.” Align this with the privacy page before inviting users to submit. |

The evidence for F01–F03 is in [HistoryCompare](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/components/results/history-compare.tsx#L41) and [result-history](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/result-history.ts#L25), plus the saved probes. F05 follows directly from [Perspective arithmetic](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/perspectives/scoring.ts#L83) and the [stability claim](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/app/perspectives/%5BperspectiveId%5D/result/%5Bpayload%5D/page.tsx#L222). The [13 July declaration](https://www.elysee.fr/en/emmanuel-macron/2026/07/13/joint-declaration-on-the-establishment-of-the-integrated-anti-ballistic-missile-coalition) supports F07's country count.

## The novice walkthrough: where understanding is earned or lost

### Opening, navigation and return

The opening has a recognizable editorial character and a clear Enter action. PR 64's entry and reading layout changes matter; a critique of the earlier version should not be copied forward. The existing browser suite exercises Enter/Back, deep links, reduced motion, no-JavaScript fallback, touch rotation, keyboard navigation and small screens. I did not find a reason to rebuild this entrance.

The menu's breadth is the difficulty. “Questionnaires,” “Cases and exercises,” “Library” and “Your worldview” are intelligible groupings, but the number of parallel destinations still makes choosing a starting point work. A first-time visitor should be able to answer “What will I know in ten minutes?” before meeting the full taxonomy.

The site does useful local persistence work. Foundation and module drafts resume, module modes maintain separate drafts, and Profile restores saved records. However, “on this device” actually means this browser/origin's storage; it does not promise cross-browser or permanent access. Privacy explains much of this. Keep the short operational statement near saving.

### Foundation: questions, review, result, follow-up

Selection does not auto-advance. Review is required and editing is straightforward. These are important strengths. The default fourteen statements are short enough to finish, but several require considerable knowledge of IR debates. A novice may answer whether a sentence sounds sensible rather than a stable view of the mechanism it names.

The statement/clarification relationship needs close attention. For example, the first item's sustained-cooperation premise and “necessary” claim are stronger than the clarification's general suggestion that uncertainty pushes preparation. A clarification must explain the item, not soften it into a different proposition.

The synthetic completed pattern `[6,5,6,3,5,3,6,2,5,3,6,3,6,5]` produced dimensions `[4.5,5.5,5,6,5,5.5,4.5]`, Constructivism, and Musyawarah. That output was traceable. Its worked example and rival objection were much more intelligible than its abstract opening paragraph. “Recognition can change what states want” is easier to grasp than repeated formulations about a “recorded position” and “interests themselves.”

The targeted follow-up route is an intelligent response to ambiguity, but it should not imply that a small follow-up battery establishes a true identity. A flat response pattern does not warrant privileging the first two tied families. The result should make that distinction before displaying a memorable hybrid name.

### Profile, shared Profile and pair comparison

The current Profile is materially better than the old critique suggests. One saved subject can support a follow-up question; users do not have to finish everything before receiving value. The relations distinguish access, authority, capacity and cooperation rather than forcing one master score. Users can inspect or reject a suggested relation without silently changing their results.

The limitation is accumulated reading. Users must understand why Foundation, AI and Technology can disagree, what information was actually saved, and why some exact answers are no longer available. A Profile that shows everything can still fail to tell a person what to do next. Make the most useful next question prominent and let the other records remain inspectable.

Pair comparison correctly handled identical valid Foundation links. It explicitly said matching scores do not prove matching answers or reasons. The discussion question was useful. Its seven identical “scores match” rows and two-decimal numbers are unnecessary repetition. The parsed-link flow correctly rejected disallowed origins, malformed data and oversized input in the reviewed probes. This does not establish cryptographic authenticity of a result, nor does it need to for a voluntary conversation tool.

### Security and Technology

Security Standard is nineteen cases, estimated eighteen to twenty-four minutes; Advanced is twenty-three. Technology Standard is nine, estimated eight to ten minutes; Advanced is fifteen. These are substantial optional commitments. Present them as such, not as a quick final step after Foundation.

The cases now use more concrete actors, time horizons, constraints and accepted costs. Distinct options frequently represent genuinely different strategies. The blanket accusation that every middle answer is a sensible compromise is unsupported. Some options remain asymmetrically attractive, but that requires item-level observation and testing.

Explanation, Decision and Actor lens are a useful distinction that the item text does not consistently honor. The Security sabotage example asks for a cause but makes the answer an action package. Technology asks which investment model will build capacity, then calls the answer an explanation. A person can agree with a diagnosis and reject its attached policy. The scored signal becomes ambiguous when the interface does not let them separate the two.

Security explicitly excludes actor-lens responses from its headline, axes and lanes. That is correct and worth retaining. It does not mean the time spent on those cases is wasted; it means their payoff should be an understandable discussion of another actor's constraints, not a hidden contribution to “your” worldview. The current evidence log is much more defensible than a cross-actor average.

Both results lead with actual selected choices and a worked application. That is a strength. The lane meters and axis meters then introduce two similar-looking sets of quantities, each with its own scale. Users need a plain-language distinction and visuals that agree with the calibrated prose. Repeated “registered form” notes currently make the reader resolve the conflict.

### AI Governance

The entry question is excellent: who may build, release and stop powerful AI? It states a real political problem. Standard uses sixteen statements and six scenarios; Advanced expands the form. The review makes every selection visible and does not submit merely because the final option was chosen.

Several statement pairs blend factual expectations and policy priorities. A person can think rivalry is durable and still favor coordination; accept bounded military use while wanting routine deployment restrained; favor meaningful human control and welcome major social transformation. The result's disclosure of the exact competition pair is a thoughtful acknowledgment of this problem. It is evidence that the pair should not be treated as a simple bipolar attitude without further justification.

The result I generated was “Strategic Competitor,” with public oversight and legitimacy dominating its opening explanation. Its military answer was more useful for explaining the category. The title, hero paragraph and contribution comparison should tell one coherent story about why this reading appears.

Exact answers from the fresh completion are currently page-memory evidence and disappear on reload; the saved/shared score remains. This is a legitimate privacy design, but the user must understand the tradeoff. Do not imply a preserved answer transcript when only derived values remain. Collapse the full transcript until requested so that it does not bury the worked example.

### Current Cases, source ledgers and corrections

All three current cases, their source ledgers and corrections pages were included: European missile defence, the South China Sea award anniversary, and U.S.–Brazil Section 301 tariffs. The European case was completed through all seven stages. It preserved the first judgment, accepted optional reasons, offered four competing readings, introduced a changed assumption, and recorded a final judgment. The ordinary share link excludes choices unless the user selects them for share text. This is good control over disclosure.

The payoff is currently a careful record: “You kept [choice] with confidence at 3 out of 5.” It does not establish learning, better calibration or reduced bias. The “Foundation connection” says no reviewed mapping exists for this case. That honesty is preferable to inventing one, but the section itself consumes space to explain a feature that is not available. A short scope note would suffice.

These cases have real sources, but a source ledger is not automatically a fact-check. The country-count error demonstrates why editorial review remains necessary. The USTR action and French declarations were checked against primary pages; the Chinese Foreign Ministry statement supports a reported Chinese position, not independent adjudication of the legal dispute. Dated case status should remain prominent. This audit does not claim to have verified every sentence of every historical source.

### Two decision exercises

“Who gets access?” and “Who gets to verify?” are the best candidates for a first classroom or seminar test. They stipulate technical reach, hold important costs constant, change one institutional provision, record a principal reason, and keep refusal distinct from a policy choice. The resulting discussion can be useful even if a person rejects the broader worldview inventory.

The tested access sequence chose qualified evaluation under independent admission, then withheld a decision after the developer gained a veto. The result correctly refrained from assigning a replacement policy. The tested verification sequence changed from national inspections to a neutral custodian when national access became asymmetric. Its interpretation explained the tradeoff and asked whether the same rule would be acceptable from the other side. These are concrete intellectual payoffs.

The next research concern is demand: the changed condition is deliberately salient, so users can infer what the exercise is testing. That is acceptable for teaching, but it limits causal research claims. Order effects and the influence of the supplied reasons require separate study. Do not present a scripted change as proof that the exercise made a person more consistent.

### Perspective Runs

All six role routes were inventoried, and Exposed Ally was completed. Actor, objective, constraint and uncertainty stay visible. Three scenarios and required review make the flow manageable. Explicit saving is preferable to silently attaching the result to Profile.

The role frame is educationally valuable. The apparent measured movement is not. Its score is constructed by adding authored signals to the Foundation baseline, so the baseline is mathematically part of both endpoints. Clipping also makes room for upward or downward movement depend on the starting point. A drawn line can help illustrate the model, but “the role moved you” implies an observed effect the design has not isolated.

The “held steady” language is the worst remaining over-inference I found. A dimension can stay fixed because the chosen options supply no offset. That does not show that the role challenged and failed to change a judgment. Make this a comparison of modeled emphasis, and let actual choices carry the interpretation.

### Library, archetypes, Decision Patterns and Thinkers

The inventory includes all eight Foundation archetypes, four tradition essays, ten Decision Pattern pages, six AI approach pages, the Field Guide, eight Thinker pages and References. All discovered leaves are in the route ledger. A reader can find enough depth to question the result rather than merely accept it.

The earlier “only four thinkers” criticism is stale in a literal sense: PR 64 adds essays on Elinor Ostrom, Hedley Bull, Amitav Acharya and Amartya Sen. Distinguish these reading essays from the earlier evidence-coded profiles of Mearsheimer, Keohane, Wendt and Strange; not every essay has a map estimate. Wendt's no-map-position status is explicit. Adding essays is useful, but it does not establish expanded item coverage for new scored families.

The breadth of modeled traditions remains selective. Feminist, postcolonial/decolonial, green and English School approaches are acknowledged as under-modeled. That is the right current boundary. Do not add them as labels before defining and testing their item coverage. A reading recommendation is not equivalent to representation in a scoring model.

The ten Decision Pattern pages repeat almost the same “easy to mistake for X… The difference…” paragraph. This is a strong AI-like editorial signature because it supplies uniform structure without consistent explanatory economy. Replace the repeated prose with a compact comparison of the actual disputed decision. Their public names are now plainer than their legacy slugs; the old names should not be mistaken for current headings.

### AI Futures and The Departure

All nineteen scenario pages and the two-world comparison were covered. The catalogue separates source premises, project inference and unresolved conditions. That is more intellectually honest than assigning numbers to every possible future. Still, the matrix can become a wall of “unspecified,” “unresolved” and “different or incomplete terms.” The reader needs the few consequential differences first.

All twelve preferences answered “Not sure” produced an appropriately restrained result: too few directional domains to compare, with uncertainty distinct from no preference and rejection of the question. This is a useful model for the Foundation all-tie state. Preferences and expectations are explicitly separate; preserve that distinction.

Some alternatives build values into their stipulated costs. Biological replacement, permanent exclusion from political standing, irrevocable membership and invisible government are loaded stakes. Those are legitimate scenarios to examine, but broad preference questions cannot establish timeless principles across all conceivable variants. “Neither describes my view” is essential, and the frequency and reasons for using it should inform revision.

The Departure distinguishes desired conditions, evidence sufficient to trust the offer, a personal/advisory decision and powers granted to the departing AI. The less-personal framing works as an option. The tested uncertain/rejected combination received no invented personality interpretation. Its transparency about being an AI-assisted draft is a strength. Its fallback “no additional interpretation rule applies” is nevertheless implementation language; say that the choices leave several questions open.

The shelf uses both older editorial names and current catalogue titles, e.g. “Guardian in the Background” versus Protector God. Links resolve to retained anchors, but the naming shift adds work. Consolidate displayed names while preserving URLs.

### World Stage and documented maps

World Stage is an effective visual attraction, and the live map rendered. Pause and map selection are available. Five views organize alliances, chip networks, regional security, hedging and AI infrastructure. Source dates and perspective owners are visible in the evidence. The EU/NATO and RCEP maps distinguish literal membership/signing data from the fictional home animation.

The interpretive overlays should never imply a complete or neutral global dataset. “Focus,” “partner,” “competitor” and “exposed” are relative to a stated lens; source coverage and selection matter. The site largely acknowledges this, but a screenshot can detach the map from that explanation. Keep a concise lens/date key in the visual itself. Avoid making spatial line lengths, point sizes or decorative routes look quantitative.

### About, Method, References, Privacy, Feedback, Beta and recovery

About establishes the author and personal nature of the project. The methodological documentation is unusually candid for an interactive of this kind. References provide a way out to the intellectual sources. These pages should support the product, not become prerequisites for understanding a result.

Privacy correctly explains that encoded result links disclose their contents to recipients and services handling the request. “Computed in your browser” does not mean an encoded result URL never reaches a server. Foundation/AI links primarily carry derived values; Focus Area links include selected answer IDs. Removing local history does not retract a shared link. Keep these distinctions.

AI review's stronger “No data leaves your browser” promise needs correction now. The [generation handler](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/components/quiz/ai-governance-review-screen.tsx#L102) encodes the result and navigates to its server-rendered page; [the review footer](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/components/quiz/ai-governance-review-screen.tsx#L225) should distinguish local calculation from URL disclosure. This is an inconsistency in an explicit promise, not a claim that secret answer collection was found.

The corrected invalid-result flows fail gracefully. Unsupported Chinese routes explain that the content is English-only. The English 404 metadata bug and stale `/learn` route are small repairs. A live feedback path is more important for the immediate pilot than adding any new feature.

## Methodology review: the questions a supervisor should insist on

### Define the intended interpretation before validating it

“This helps a reader discuss competing arguments” and “this measures a continuous worldview” require different evidence. The first can be evaluated through comprehension, quality of discussion and useful disagreement. The second requires evidence for the construct, response process, internal structure and intended uses. Validity is about the supported interpretation and use of scores, not a permanent quality obtained by passing a software test. This follows the framework of the [AERA/APA/NCME Standards for Educational and Psychological Testing](https://www.testingstandards.net/uploads/7/6/6/4/76643089/9780935302356.pdf).

For this stage, I would define the primary claim as: **given explicit answers to authored political questions, the tool presents traceable comparisons with selected IR arguments that help the respondent explain a judgment.** Test that. Do not quietly slide from it to a stable trait, representative worldview distribution, population norm or prediction of policy behavior.

### Examine all seven Core pairs

There is one forward and one reverse item per dimension. For responses `x` and `y`, the dimension is `(x + 8 − y) / 2`. A one-step change on one item moves that dimension by 0.5; changing one response from one endpoint to the other moves it by 3. That is substantial resolution relative to many category boundaries. A short reflective form can still be useful, but it cannot support elaborate precision without further evidence.

| Dimension | What the pair contrasts | Substantive concern to test |
|---|---|---|
| Security competition | Military preparation remains necessary under uncertainty / a rival's sustained restraint can credibly signal peaceful intent. | Both can be true. Evidence can improve while residual uncertainty still warrants preparation. A middle score may encode a sophisticated conditional position, acquiescence, disagreement with both, or uncertainty. |
| Institutions | Monitoring and repeated contact sustain agreements / agreements endure when states retain power to enforce the bargain. | These are complementary mechanisms in many institutional arguments. Endorsing enforcement is not straightforward rejection of institutional effects. |
| Domestic filters | Governing coalitions redirect policy under unchanged external conditions / regime change rarely alters basic interests under fixed constraints. | Coalition versus regime and policy versus basic interests change the scope. A response difference may arise from wording, not the intended dimension. |
| Norms and identity | Recognition changes goals / recognition rarely changes security disputes. | General goal formation and a hard subset of disputes differ. Recognition may matter for some interests without settling a particular dispute. |
| Political economy | International rules give strong states structural advantage / open markets allow replacement suppliers and adaptation. | Structural advantage and practical substitutability can coexist. This risks mixing salience of economic mechanisms with a critical theory commitment. |
| Restraint | Avoid overextension / regional domination by a hostile power can justify long commitments. | Prudent restraint often permits a costly exception. The pair may distinguish thresholds or threat assessment more than a single strategic posture. |
| Order and justice | Preserve a stable order despite injustice / severe mass atrocity can override sovereignty. | General preference and exceptional threshold are compatible. Agreement with both does not necessarily mean an unresolved moral position. |

These are **content-validity concerns, not demonstrated estimates of bias or reliability**. Interview respondents about what they thought each proposition meant. Include people who know the theories and people who do not. Ask experts to independently map items to constructs before showing them the intended weights.

### The model represents authored contrasts

The family calculation standardizes dimension scores against the registered form's synthetic baseline, multiplies by authored family coefficients, sums and ranks. Those choices encode an argument about how to distinguish traditions. They are not discovered clusters of respondents.

The synthetic probes show: all 4s, all 7s and all 1s on the paired Core items all yield seven dimension scores of 4 and four tied family scores. Making every scored direction uniformly high or uniformly low also leaves the Core family contrasts essentially tied, while modifiers change. This is a consequence of the contrast structure. It should be explained as such; it is not evidence that everyone is a realist/institutionalist blend.

A one-item sweep around all-midpoint changes the leading family, as expected near a four-way tie. The existence of a switch is not by itself a bug. The problem would be claiming a stable categorical identity despite weak discrimination. Similarly, order/justice and restraint can influence both family ranking and their own modifier. That double role deserves a theoretical rationale and a sensitivity analysis; it is not automatically illegitimate.

Keep internal floating-point coefficients frozen unless a deliberate scorer revision is justified. The earlier proposal to round them merely because they look precise would risk changing outputs without improving validity. Precision in computation and precision in psychological inference are separate matters.

### Form, language and response process are part of the instrument

Core, targeted and extended forms have different exposure and calibration. Identical dimensions on different forms need not justify a change narrative. Locale and copy edition matter, but matching those alone is not enough; F03 is a concrete implementation example.

Translations should receive independent item review, reconciliation and cognitive testing. Equal scoring code does not establish equivalent meaning. Neither nationality nor culture should alter the individual's scoring. The current separation of national/strategic perspective as context is the correct boundary.

Likert agreement, scenario preference and actor advice elicit different acts of judgment. Averaging their coded signals does not automatically create one continuous construct. Explain which are scored together and why. Keep explicit reasons and contextual choices available where appropriate; do not infer missing reasons from averages.

### What empirical work is needed

Start with cognitive interviews and expert content review, then decide whether a stronger measurement project is warranted. A small convenience sample can reveal confusing terms and common answer strategies; it cannot establish population norms or subgroup fairness. Reliability and stability analyses need an explicit design, intended population and adequate information per construct. A two-item dimension deserves particular caution; a single omnibus reliability number for the whole multidimensional inventory would be misleading.

If developing research claims, assess test–retest behavior with an appropriate interval, response-pattern distinctions, order effects, category stability near boundaries, convergence and disagreement with established constructs, and consequences of interpretation. Separate a construct-validation study from an experiment about whether the tool improves discussion. In the latter, judge explanations before and after with blinded criteria and a meaningful comparison activity. A rise in confidence alone is not improved reasoning.

Synthetic diagnostics remain useful: detect impossible states, asymmetric routing, fragile labels, clipping, and whether a counterfactual actually follows the registered scorer. They do not replace respondent evidence. This repo is strong enough on computational discipline to move to that next kind of work.

## Commercial and VC assessment

### The most plausible customer is not yet the anonymous quiz taker

The consumer has a recognizable need: understand why political arguments feel persuasive and have a better conversation with someone who disagrees. But a single gratifying result is episodic. The saved Profile and new cases offer reasons to return; the audit supplies no cohort retention or willingness-to-pay evidence that people do return.

A teacher, seminar leader, policy training provider or discussion organizer has a more concrete job: make participants articulate assumptions and compare tradeoffs in limited time. The two decision exercises can accomplish this without asking the buyer to endorse a personality model. A pilot with a real facilitator is therefore the best near-term test. This is a commercial hypothesis, not proof of demand.

| Possible path | Why it could work | What is missing | Useful next test |
|---|---|---|---|
| Public educational/editorial project | Distinctive voice, shareable entry and substantial free reading. | Distribution, repeat use and a sustainable editorial cadence. | Give a small group one exercise and see whether they voluntarily invite someone or return for a second. |
| Classroom/seminar resource | Concrete dilemmas, explicit rival arguments, reasons and changed conditions. | Facilitator instructions, demonstrated comprehension and repeat adoption. | Have two instructors run an exercise without the creator present; observe whether they request another. |
| Paid professional workshop | Judgment under uncertainty is relevant to policy and strategy teams. | A defined buyer, differentiated facilitation, outcomes and actual budgets. | Offer a narrowly scoped facilitated pilot through an existing relationship; learn what would justify payment before building team software. |
| Research instrument | Transparent code, versioned forms, reproducibility. | A specified validation program, appropriate consent/data handling and human evidence. | Secure an academic collaborator around one defensible construct or teaching outcome. |
| Venture-backed standalone platform | Could eventually connect curriculum, facilitation and repeat discussion. | Evidence of market size, retention, scalable acquisition, willingness to pay and defensibility. | Do not infer this case from feature breadth. Require repeated paid adoption or strong organic recurring use first. |

Two useful benchmarks illustrate the alternatives. [Clearer Thinking](https://www.clearerthinking.org/) offers free reflective tools, educational content and coaching; the relevance is an ecosystem around useful exercises, not a claim that this project can copy its economics. [Polis](https://compdemocracy.org/polis/) supports participant-generated statements and collective discussion; it illustrates a different job from locating one person against an authored typology. Neither benchmark proves a market for this particular product.

### A VC principal's answer today

I would pass on an investment decision based on the present evidence, while being interested in a tightly scoped pilot. The software and content demonstrate execution ability. They do not establish an economic engine.

The questions are basic: who comes back, how often, for what job, who pays, and why this tool wins over a reading, a seminar worksheet or a conversation with a general-purpose model? A model can imitate archetype prose cheaply. A trusted collection of carefully tested cases, a strong curriculum, facilitator adoption and evidence of better discussions would be harder to replace. That defensibility has to be earned.

The largest cost is likely to be maintaining good content, sources, translations and evaluator trust. Three overdue Current Cases already show the operational burden of “current.” Adding topics increases that burden before proving a recurring use. Privacy-preserving local storage is appropriate to the present promise, but it also means a team/research product would require a deliberate new data and trust model. Do not accidentally create one by adding analytics or a feedback box.

As a portfolio and intellectual project, this is substantially stronger than “I built a quiz.” It demonstrates editorial judgment, instrument design, transparent modeling and interaction design. Its credibility will improve more from five candid user sessions and a documented revision than from another layer of features.

## What to do next

1. Fix the old-history ownership/comparability path and false saved status. Correct the country count and 404 metadata. Establish the beta feedback channel.
2. Make the claims smaller: neutral-result presentation, Perspective movement/stability wording, and meter/prose agreement. Put the concrete payoff ahead of complete evidence transcripts.
3. Run the small pilot in [PILOT.md](PILOT.md). Record confusion and usefulness without collecting unnecessary answer payloads.
4. Revise the specific items and copy that people actually misunderstand. Keep a versioned distinction between a wording change, an interpretation change and a scorer change.
5. Decide whether the next investment is teaching utility, editorial distribution or formal instrument validation. Do not try to prove all three with one small beta.

The project needs disciplined contact with users now. The remaining work is meaningful, but it is no longer a reason to postpone all external testing.
