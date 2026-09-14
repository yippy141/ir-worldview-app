# After-passages, Sprint A pass 1

13 September 2026. Every changed public passage, before and after, grouped by page. Read these against "The owner's read" in `IR_EDITORIAL_STYLE_GUIDE.md`. Code and tests changed alongside; this file is the prose only.

Not changed in this pass, by design: administered questions, options, clarifications, scoring, bank versions, navigation labels and URL structure (the registry task), the footer (same task), the Field Guide (next pass), `lib/explore-content.ts` and `lib/atlas-lite.ts` (long files for the implementer brief in the guide).

## Root menu (`content/root.ts`, English only; labels unchanged)

**Inventory.** Before: "Start with the Foundation when the site is new to you. It asks fourteen broad questions about recurring disputes in international politics. Security, Technology and AI Governance then test whether the same habits hold once the policy problem becomes more specific." After: "Begin with the Foundation: fourteen questions about the arguments people reach for when world politics gets hard. Then, if you want, take Security, Technology, or AI Governance, which put the same kind of question to you inside one policy field."

**World Stage.** Before: "The case library and full map sit here. Each case is tied to a defined evidence window and asks for one decision without pretending that the record is complete." After: "Cases and the full map. Each case gives you the record up to a stated date and asks for one decision."

**Atlas.** Before: "Use the Atlas to compare the four traditions modeled by the Foundation with thinkers, Decision Patterns and dated public positions. These are reference points, not identities assigned to the reader." After: "Four traditions, eight Foundation readings, four thinkers, and dated public positions: reference points to compare your result against."

**Perspective Runs.** Before: "Perspective Runs ask how the same baseline changes when the reader is placed inside another actor's constraints. They remain separate from the Foundation." After: "The same questions, answered from another actor's seat: an exposed ally, a rising power. Your own result stays as it was."

**Profile.** Before: "Saved results remain on this device. Profile keeps the Foundation, domain inventories and Perspective Runs as separate records and shows only relationships the project has reviewed." After: "Everything you have saved, on this device only. Each result is kept on its own."

**Device status.** "No saved Foundation, domain record or Perspective Run is present on this device." became "Nothing is saved on this device yet." "A Foundation read is saved" became "A Foundation result is saved". "2 saved domain records" became "2 saved Security, Technology or AI results".

## Security and Technology hub (`app/modules/page.tsx`)

Before: kicker "Focus Areas"; heading "Add a focused issue read beside the Foundation"; lead "Use Security and Technology to examine concrete policy judgments. Each result remains a separate domain record and leaves the Foundation unchanged."; side note "How to read this layer. Broad priors and issue instincts are related, but not identical. The point here is to read the issue on its own terms when the case becomes specific."; a three-column block "What Focus Areas cover / How long it takes / What it does not claim"; two cards each ending "What it does not claim"; ten planned modules; a "Same product family" block with three links.

After: kicker "Security and Technology"; heading "Two shorter questionnaires built from cases"; lead "An ally asks for troops on its border. A ministry decides whether to fund public compute. You choose, and the result shows which logic you kept returning to. Each questionnaire gives its own result and leaves your Foundation result alone."

Security card: "Deterrence, alliances, sanctions, and the use of force." / "Each case is set at a real table: a NATO ministerial choosing an eastern-flank posture, a coastal state deciding whose help to accept, a monitoring team watching a ceasefire fray." / Start Security / live counts and time / "The result reads three things" followed by the module's three lane descriptions.

Technology card: "Export controls, chips, open models, sovereign clouds, and who writes the rules for AI." / "Each case is a budget or an access decision: a cabinet deciding whether to build a sovereign cloud, a research board choosing how far to open a capable model, a ministry signing for data-centre capacity it cannot build itself." / Start Technology / counts / lanes.

Foot: "Already have results? Open Profile. For who should govern powerful AI, AI Governance is its own questionnaire."

Removed: the planned-modules block (roadmap material), the "Same product family" block, both "What it does not claim" cells.

Foundation-state strip: "Choose a focus area" became "Choose a questionnaire"; "Take the Foundation first" became "Start with the Foundation"; "Browse Focus Areas" became "See both questionnaires"; "Foundation is the clearest starting point" became "The Foundation is the usual starting point".

## AI Governance hub (`app/ai/page.tsx`)

Before: kicker "AI Governance Compass"; heading "Compare your judgments on frontier AI governance"; "22 questions. Around 8 minutes."; "The questions cover eight axes: risk horizon, deployment pace, oversight, geopolitics, openness, military use, legitimacy, and human future."; buttons "Take the AI Compass" and "Browse the AI Atlas →"; a bridge line; the access-decision section; a three-column "What it covers / How long it takes / What it does not claim"; a "Choose your route" section with Standard and Advanced cards; an "Optional depth" section with eight links.

After: kicker "AI Governance"; heading "Who should be allowed to build, release, and stop powerful AI?"; "22 questions. About eight minutes."; "You take positions on release, oversight, military use, and rivalry between states. The result shows which of six governing approaches your answers came nearest, and where the closest rival approach would have decided differently."; buttons "Start" and "Start Advanced (37 questions)"; "Advanced adds 15 questions on compute, audits, and incident reporting."

"What a result looks like": "An example, from a synthetic set of answers. Precautionary Steward. 'The burden of proof rises with capability: you wanted thresholds and outside testing before broad deployment. The nearest alternative, Democratic Guardrailist, binds the same check to public oversight instead of to the capability itself.' Your own result names the approach, the rival, and the question your answers left open." (Grounded in the Precautionary Steward atlas card and the Guardrailist pairing in the Field Guide.)

"Also here": The six approaches ("What each one wants, worries about, and would decide."); Who gets access? ("A ten-minute decision exercise for a fictional research institute. No questionnaire needed."); Futures ("Nineteen possible worlds, and the conditions you would want in them."); Field Guide ("Who can inspect, release, restrict, or stop a model, approach by approach."). The Foundation bridge component is unchanged.

Question counts are live from the schema.

## Foundation result (`components/results/foundation-result-story.tsx`)

**Chapter 01 title.** "Why X rather than Y" became "Why X, and not Y". Copy: "The rows below locate your recorded positions alongside the two readings' authored emphases." became "The rows below put your positions beside what each reading expects."

**Chapter 02.** Title "The exact terms in the family comparison" became "What did the work". Before: "The largest positive term comes from {dimension}. This is where the recorded pattern most supports X relative to Y. Each row is one term in the live scorer's X minus Y comparison. A positive term adds to the first reading's score relative to the second. A negative term subtracts from it. This calculation uses the calibration registered for the exact completed form. It does not treat distance from the raw scale midpoint as classification evidence." After: "Your answers on {dimension} did most of the work: there you sided with the X reading." Then, only when a contribution row is negative: "On {dimension 2} you leaned the other way; that is where Y gets its support" and, only when the low-differentiation flag is set, ", and why it stayed close." Then "Each row shows how far one dimension pulled toward one reading or the other." and a disclosure "How this is calculated" with one sentence and a link to Method. Legacy links: "This link predates the dimension-by-dimension comparison, so those terms cannot be shown. The rows in chapter 01 still apply."

**Chapter 03.** Title "Where this reading sits in the registered matrix" became "Where this reading sits among the eight". Dropped: "The matrix is a reference system. It does not rank people or assign a population category." Kept and tightened the first paragraph: "...The highlighted readings pair that posture with X and Y. Because they sit close, the rival argument is worth reading before the name settles."

**Chapter 04.** Title "The submitted choices that can be shown here" became "Choices behind your result". Before: "A result generated in this browser can keep up to three derived evidence records from the exact submitted answer set. The result URL does not contain those records or the underlying answers. Shared, legacy, deleted, and tuple-mismatched records remain unavailable. The page does not reconstruct evidence from the dimension scores alone." After: "Up to three of your own answers, each beside the alternative that would have moved the result. They come from the answers you submitted in this browser; a shared link cannot show them." The evidence component is unchanged.

**Chapter 05.** Title "Domain inventories remain separate records" became "Your other results on this device". Before: two paragraphs about scales and master scores. After: "Security, Technology, and AI Governance each give their own result. None of them changes this one." The saved-results cards are unchanged.

**Chapter 06.** Before: "A case can reveal which consideration takes priority when the baseline leaves a tension unresolved. The evidence window and rival interpretation remain part of the case record. This is a pressure test for the reading. The case does not prove that the registered name is a lasting identity." After: "A reviewed case shows which consideration you put first when the reading leaves two in tension. The case keeps its evidence window and its rival interpretation."

**Chapter 07.** Title "The limits stay attached to the result" became "What this model can and cannot say". Before: "This inventory compares answers with four authored tradition profiles. It makes no reliability, validity, or population claim, and it does not establish a durable personal trait. The public method describes the Foundation robustness diagnostic, including its constructed inputs and greater sensitivity near family and blend boundaries. The repository carries the exact methods and diagnostic data." After: "Your answers were compared with four authored tradition profiles. The result is a reading of those answers, not a validated test and not a personal trait. Readings near a boundary between traditions move more easily than others." The Method link stays.

**Footer.** "Open the next record or read the comparison more closely." became "Read the rival argument, or take a question to a harder case." "Open domain inventories" became "Security and Technology".

**Figure labels.** "Local decisive-choice evidence" became "Your answers and the alternatives"; "Records saved on this device" became "Saved on this device"; "Eight registered Foundation readings" became "The eight Foundation readings".

## AI result (`app/ai/results/[payload]/page.tsx`)

Eyebrow "AI Governance Compass" became "AI Governance".

Rounded-score note (shown only when the saved label no longer leads after reconstruction). Before: "The saved name is preserved. These rounded coordinates do not reproduce it as a leading model score; use the positions below as the supported reading." After: "This link stores rounded positions. Recomputed from them, {label} is no longer the top-scoring approach, so the name you were given is kept and the positions below are what the link contains."

Scale note. Before: "The marker locates the recorded position on a 1–7 scale. Either endpoint can express a strong position; this is not a progress bar." After: "Each marker is your position on a 1 to 7 scale between two poles. Either end is a strong position."

Comparison arithmetic. Before, inline: "Each term is the recorded axis position minus 4, multiplied by the difference between these two frozen model weights." After, inside a disclosure "How the comparison terms are calculated": "Each term is your position on the axis, measured from the midpoint, multiplied by how differently the two approaches weight that axis. Positive terms favor X; negative terms favor Y."

"A new question to consider. No answer is recorded or rescored here." became "Nothing you decide here is recorded or rescored."

Futures invitation. Before: "Your governing priorities today leave that question open. Explore possible worlds, compare preferred conditions and consider expectations separately. This result supplies no answers to Futures." After: "Browse nineteen possible worlds and say which conditions you would want in them. Futures is a separate exercise and starts empty."

## Profile (`components/profile/profile-report.tsx`)

"Saved Foundation read" became "Your Foundation result"; "Shared Foundation read" became "Shared Foundation result"; "No Foundation read is saved" became "No Foundation result is saved"; "Domain records / Separate domain records" became "Other results / Your other results"; "Foundation and issue records stay separate. Completed Focus Areas and AI results appear beside the saved Foundation read; none changes the Foundation result." became "Security, Technology, and AI Governance results appear here once you complete them. None of them changes your Foundation result."; "Separate domain record" chips became "Saved result"; "Complete the Security inventory to add a separate result here." became "Complete Security to add its result here."; "The Profile keeps each saved record separate and does not infer a relationship from..." became "Each result is shown on its own. The Profile does not infer a relationship from..."; next-step cards: "Create your own Foundation read" became "Take the Foundation yourself"; "Add the broad baseline while keeping existing records separate." became "Add the fourteen-question Foundation result."; "Create a separate technology and power record." became "Add a Technology result."; "Create a separate record for AI governance judgments." became "Add an AI Governance result."

## Library hub (`content/explore/hub.en.json`, content version 23.2.0)

Hero. Before: "Ways of reading world politics. Explore what different traditions notice, what they explain, and where their arguments come apart. Start with a name, a thinker, or a decision. Decision Patterns and evidence-coded public positions are reading aids. They never become your Foundation result." After: "Library. Four traditions, eight Foundation readings, four thinkers, seven decision patterns. Start with a name you were given, a thinker you have heard of, or a decision you would have made differently. Nothing in the Library changes your result."

Section intros, before and after:
- "The inventory uses a deliberate hierarchy so that supporting evidence never competes with the Foundation result." → "Your Foundation result is the headline. Everything else here explains, compares, or challenges it."
- "Four explanatory lenses combine with two strategic postures. The rows summarize a continuous profile; they are not population types." → "Four ways of explaining world politics, each with two strategic postures."
- "The closest modeled tradition supports a Foundation reading; it is not a second Foundation result. Each tradition remains broader than the instrument can represent." → "The traditions the Foundation scores against. Each is broader than fourteen questions can capture."
- "These dimensions preserve the tradeoffs beneath the headline label. A score describes a position within this model, not a percentile." → "What sits behind every reading. A score is a position on this model's scale, not a percentile."
- "Decision Patterns are authored ways of approaching a choice. The directory supports comparison and does not calculate, match, or diagnose a user." → "Seven authored ways of approaching a hard choice. Compare them; none is assigned to you."
- "Published entries are dated, scoped interpretations built from cited public evidence. They describe a position within an evidence window and never assign a person or organization to an archetype." → "Four thinkers, each read from cited work within a dated window. No thinker is assigned a Foundation reading."
- "Security and Technology are Focus Area questionnaires; AI Governance is a separate domain result; Perspective Runs are role-conditioned comparisons; Current Cases are time-bounded judgment exercises." → "Security, Technology, and AI Governance are their own questionnaires. Perspective Runs put you in another actor's seat. Cases ask for one judgment on a live question."
- "Four modeled traditions do not exhaust International Relations. Important approaches remain under-modeled because the current dimensions and item coverage cannot represent them adequately." → "Four traditions do not cover the field. Feminist, postcolonial, and green approaches are described here and not scored."

Also: "make cooperation durable" → "make cooperation last" (twice); "Published entries in the validated directory" → "Published thinkers"; "These records sit beside the Foundation. They do not rescore it." → "None of these changes your Foundation result."; section headings renamed to plain nouns ("The four traditions", "The seven dimensions", "Thinkers", "What is not covered").

## About (`app/about/page.tsx`)

Before: "See which foreign-policy arguments you rely on and where they conflict. The IR Worldview Inventory is an editorial interactive for locating your judgments across recurring international-relations tradeoffs. It returns a multidimensional profile and nearby interpretive families, not a fixed identity or population ranking." Then "How to use it" and "Editorial limits".

After: "It asks how you read world politics, and shows you the logic you used." Then one paragraph on what each part does and what a result is. "Who made it": "{author} built and edits it. He trained at Johns Hopkins SAIS in technology, security, and governance, and writes about frontier technology and great-power competition. The questions, cases, and readings are authored; the scoring is a set of authored weights, described in full in Method, and not a validated test. AI tools were used in drafting and checking; the sources cited on each page are the record of what was checked." "What the scores are and are not": four plain bullets. "Corrections and contact": email and a privacy link.

## Mobile menu intros (`messages/en.json`)

"Browse Cases, build a Foundation baseline, and add Focus Areas, AI Governance, or Perspective Runs where useful." → "Take the Foundation, then Security, Technology, or AI Governance. Cases and Perspective Runs put your judgment to work."
"Use the Worldview Map, the field guide, and methods when you want to browse profiles or challenge the model." → "Read the traditions and thinkers, browse possible futures, or check the method."

## Removed

`app/learn/page.tsx`: a starter-template page ("This starter keeps the quiz logic in a small schema file..."), dev-only and unreachable in production. The guard test now covers only the world-stage prototype.
