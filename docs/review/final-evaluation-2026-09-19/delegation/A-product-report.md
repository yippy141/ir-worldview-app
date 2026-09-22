## Audit scope and evidence limits

Source-based review only. I cannot run the app, inspect hidden implementation, see rendered output, or cite user research. Every user-behavior claim below is a **hypothesis** to be tested, not a finding of fact. File:line citations refer to the supplied files. "Prior critique excluded as instructed."

---

## 12–20 substantive findings

**F1 — Root home's "Enter" is a hash/mode dance, not navigation.**
`components/home/root/root-home.tsx:128-136,149-152`. Clicking Enter calls `sessionStorage.setItem`, `replaceState` with `#menu`, `flushSync`, `scrollTo(0,0)`, then an animation and focus move. Why it matters: a novice's first click produces a URL change, scroll jump, animated reposition, and a focus jump — four state mutations for one intent. On slow devices or with motion settings changing, this is the highest-risk moment in first use. Severity: medium. Smallest remedy: keep the visual choreography but make Enter a plain anchor to `#menu` when reduced-motion is set, so the interactive path and the no-JS/assistive path are the same.

**F2 — Menu relies on client storage to decide first paint.**
`root-home.tsx:77-109,169`. `mode` and `localStatus` resolve after mount (SSR shows menu geometry, then hydration reconciles). Why it matters: returning readers may see a flash of the entrance, and there is a deliberate one-frame scroll cancellation (`:94-95`) — a smell that layout is not deterministic across SSR/hydration. Severity: medium. Smallest remedy: render the resolved menu server-side from a cookie-free default and treat storage as an enhancement, or document the flash as accepted.

**F3 — "On this device" copy does not localize inside the client component.**
`root-home.tsx:38-53`: `answerLabel`, `recordLabel`, `runLabel` are hardcoded `"answer"/"answers"`, `"result"/"results"`, `"Run"/"Runs"` — even when `locale === "zh-Hans"`. The Chinese template strings (`content/root.ts:87,91-93`) still interpolate English count-nouns. Why it matters: a Chinese reader sees `此设备保存了1 份领域记录` fine but `{{count}} 题` combined with English pluralization logic; the `draftOnly` path emits `… {{count}} answers` from the English branch. Severity: medium (visible localization defect, directly contradicts `PRODUCT.md:32` fail-closed localization intent). Smallest remedy: move plural labels into `RootCopy.localState` as template fields.

**F4 — Root nav and child directory have two different label sources.**
`lib/navigation.ts:45-48` (`sectionLabel`) vs `content/root.ts:44-48` (`destinationCopy`). Two parallel label registries for the same destinations. Why it matters: a renamed section can drift between home and directory. `destinations.ts:4` says they share the registry, but labels do not. Severity: low-medium. Smallest remedy: single `sectionLabel` lookup with an optional explanation string.

**F5 — `destinationIsCurrent` has special cases hardcoded to routes.**
`lib/navigation.ts:51-56`: `foundation` claims `/results/*`, `profile` claims `/compare`. Why it matters: these are policy statements hidden in a predicate; a future `/results` or `/compare` owner will get a wrong "current" highlight. Severity: low. Smallest remedy: add `owns?: (path:string)=>boolean` to each destination entry so ownership is declared next to `href`.

**F6 — Beta page is index:false but links to an external participation service without disclosed data terms in the component.**
`app/beta/page.tsx:7-10`, `components/beta/controlled-beta-page.tsx:36-48`. The component renders `participationUrl` with `target="_blank"` and an `aria-describedby` pointing at `content.externalDataBody` — but that body is only rendered *below* the link (`:74-79`). Why it matters: the described-by note exists, but the visible disclosure ("external service", what it collects) is below the CTA, so the reader may click before reading. Severity: medium (privacy expectation). Smallest remedy: move the external-service note above the link, and state whether the external service collects anything beyond contact.

**F7 — Feedback page says "no research responses" but does not name what happens to the email content.**
`app/feedback/page.tsx:25-38`. "These messages are ordinary correspondence and are not joined to product analytics or a research dataset." Why it matters: it asserts a negative (no join), which is good, but does not say retention or handling of the named page title. Severity: low-medium. Smallest remedy: one sentence: "Messages are kept only to answer them and are not republished without consent."

**F8 — About page asserts "I studied at Johns Hopkins SAIS" as a credential without scope.**
`app/about/page.tsx:27`. Why it matters: this is the only external-credential signal in the product, and it is doing heavy lifting for trust on a product whose methodology is explicitly unvalidated (`PRODUCT.md:42`). Severity: low-medium. Smallest remedy: add one clause distinguishing coursework/personal project from institutional endorsement, so the credential is not read as validation.

**F9 — `ConnectedProfile` decides "unavailable" state from `Object.keys(bundle).length <= 1`.**
`components/profile/connected-profile.tsx:42`. Why it matters: `length <= 1` counts top-level bundle keys (e.g., `foundation`, `ai`, `technology`), which is a proxy for "one subject" that breaks if a new domain key is added or a domain is present-but-empty. Severity: medium (correctness of a user-facing "we can't say anything" message). Smallest remedy: derive from the actual domain set with observations, not key count.

**F10 — Relation selection picks `relations[0]` then falls back with a topic ternary.**
`connected-profile.tsx:38-39`. The fallback `bundle.ai || bundle.technology ? "access" : "cooperation"` duplicates logic embedded in `relations.ts:26,38,60`. Why it matters: "next question" can point to a topic that is `unavailable` while a relations entry for the other topic is applicable. Severity: medium. Smallest remedy: export a `pickNextRelation(bundle)` from `relations.ts` and use it here, keeping the fallback rule in one place.

**F11 — `RelationReading` "That is not what I meant" copies the evidence list but the correction is explicitly unscored and page-local.**
`connected-profile.tsx:53-59`. Why it matters: this is the product's most defensible gesture (user can reject interpretation) — but the copy `"It stays in this page only and clears when you leave or reset"` is buried and may read as a limitation. Severity: low. Smallest remedy: surface the page-local scope *before* the textarea, not after, so the expected behavior is clear.

**F12 — Foundation interpretation is subtler than the summary implies.**
`lib/results/foundation-interpretation.ts:19-25`. The summary concatenates three axis readings chosen by a sort on `|score-4|`. Why it matters: "the most extreme deviation from midpoint" is a defensible heuristic but is presented as if it were the dominant explanation. The scope note (`:46`) is good; the *body* still reads as if the dimension is reliably the driver. Severity: medium (overreading risk flagged by `PRODUCT.md:15,42`). Smallest remedy: one phrase in the summary body ("The most distinctive position in these scores is …") so the selection rule is visible.

**F13 — `foundationAxisReading` uses `positionBand` twice per key.**
`foundation-interpretation.ts:14-16,23-26`. Why it matters: two calls to the same function on the same value, plus the middle case at `:44`. Not a bug; risk is drift if `positionBand` changes thresholds. Severity: low. Smallest remedy: compute `band` once per axis.

**F14 — `departure` is an "authored choice, never a scoring instrument", but the reducer still clears later answers on revision.**
`lib/futures/departure.ts:115-132`. Why it matters: clearing downstream answers with a notice is a strong UX choice; the notice string (`:131`) is long and lives in the data module rather than the copy layer. Severity: low-medium (localization/voice). Smallest remedy: move notice text to the copy module keyed by code.

**F15 — `interpretDeparture` returns prose with a framing-dependent pronoun.**
`departure.ts:135-148`. `"For the fictional adult, you"` — Why it matters: this is a grammatical patch for a policy framing rather than a rewritten sentence; it will read awkwardly, and it says a lot about how "policy frame" is being handled across the product. Severity: low. Smallest remedy: two parallel sentence templates per reading, or one impersonal form.

**F16 — Departure uses one shared `desiredOptions`/`evidenceOptions` block across stages a and b.**
`departure.ts:23-36,54,64-65`. Why it matters: stage b re-asks the same question under a new premise; the reminder text changes but the option labels do not. This is deliberate and probably good; the risk is that a reader who wants a *different* option at b cannot express it. Severity: low. Smallest remedy: keep share, but add one free-text field for the desired question at b.

**F17 — Navigation directory uses `<details open>` driven by current path.**
`components/layout/navigation-directory.tsx:22-28`. Why it matters: `<details open>` is uncontrolled after mount; a `usePathname` change (client nav) will not re-close. This may be fine, but it is unspecified behavior relative to `PRODUCT.md:23` reversible navigation. Severity: low. Smallest remedy: document the "sticky-open" behavior as intentional, or key the `<details>` on `path`.

**F18 — Two navs on the same page have the same `aria-label` "Site information".**
`root-home.tsx:141` and `navigation-directory.tsx:31` (and again on `root-home.tsx` if reused). Why it matters: duplicate landmark labels make screen-reader landmark lists ambiguous. Severity: low. Smallest remedy: differentiate ("Site information" vs "Footer links") or merge.

**F19 — `RootDestinationId` couples home module content to `navigationSections` ordering.**
`lib/root/destinations.ts:4-6` + `content/root.ts:20,43-49`. Adding/reordering a section requires updating `destinationCopy` in both locales. Why it matters: the type system will fail loudly (good), but the failure lands at runtime content-mapping time, in two places. Severity: low. Smallest remedy: same pattern but keep explanations in the section registry so there is one add point.

**F20 — `references` and `thinkers` are split.**
`lib/navigation.ts:22,29`. `thinkers → /explore/reference` labeled `publicPositions`; `references → /references` labeled `references`. Why it matters: two entries with similar names in the same "library" group will read as redundant to a novice. Severity: low. Smallest remedy: test with first-time readers whether these are distinguishable; if not, rename one in the `nav` messages.

---

## Strengths worth preserving

- **Explicit model-scope language throughout.** `foundation-interpretation.ts:46`, `relations.ts:19,26`, `PRODUCT.md:42`, `about/page.tsx:28`. The product refuses the standard personality-test move of implying validity. This is the core brand asset.
- **"That is not what I meant" mechanism** (`connected-profile.tsx:53-59`). Giving readers a structured way to reject interpretation is rare and is directly aligned with `PRODUCT.md:49,50`.
- **Authored relations rather than subtraction across instruments** (`relations.ts:19`). This is the sound methodological choice and deserves protection from refactor pressure.
- **Departure is explicitly authored, unscored** (`departure.ts:1-7,115-132`). The un-scored framing exercise is a real alternative to funnel psychology.
- **Evidence-coded reference profiles with dates/scopes/sources** (`PRODUCT.md:41`). This is what makes the "examine public posture" claim more than decorative.
- **Chinese fail-closed localization** (`PRODUCT.md:32`). Right call for a sensitive product; preserve it even at cost to launch coverage.
- **`sectionLabel` shared registry** (`navigation.ts:45-48`). Good single source for section names; the note in F4 is about extending it, not replacing it.
- **Local status is read-only and optional** (`root-home.tsx:78-87`). Storage is used as a convenience, not as identity.

---

## First-use journey (hypothesis)

1. **Land** on `/` — sees brand, one sentence, one word: Enter. Low commitments. Note: `#entrance` vs `#menu` state is URL-driven (`root-home.tsx:89`), so a shared URL carries state; this is fine but means a "clean" share can land someone in the menu.
2. **Click Enter** — hypothesize the biggest friction point: animated reposition + scroll + focus move (F1). Novice may not read the menu; may press Back expecting to return to the opening copy, and per `:130` comment, Back from a child returns to menu. That is a small deception of "Back".
3. **Choose a destination** — menu offers five groups, each with a heading, explanation, and 1–7 children (`navigation.ts:38-42`). A novice sees roughly 20 links at once. "Cases, Decisions, Perspectives" under one group and "Library" containing both `Library` and `Worldview Map` and `Reference profiles` signals the taxonomy is curated for an informed reader, not a first-timer.
4. **Take Foundation** — result page is where the product's promise lives. If the interpretation is read before the summary caveat, overreading is likely (F12).
5. **Profile** — "Connections worth examining" is the most interesting page; it is also where the most server/client coupling and state logic lives (F9–F11).
6. **Returning reader** — "On this device" (`root-home.tsx:169-171`) is the gentlest possible return prompt; good.

**Naming-load analysis (hypothesis, not tested):**

- **Foundation** / **Security** / **Technology** / **AI Governance** — clean.
- **Futures / Preferences / Compare / Departure** — "Futures" as a section containing "The Departure" is a stack of abstraction. A novice needs "scenarios about possible worlds" before they need "The Departure".
- **Cases / Decisions / Perspectives** — "Cases" (specific situation) vs "Decisions" (what to do) vs "Perspectives" (from another actor) is defensible but "Decisions" and "Cases" will collide in first use; expect "which one was the case with the decision".
- **Library / Library, Worldview Map, Public positions, Archetypes, AI Atlas, AI Field Guide, References** — the single heaviest naming surface. **Archetypes** and **Worldview Map** must be understood as related-but-different (per `PRODUCT.md:28`), and the label `thinkers`/`publicPositions`/`references` (F20) adds a third near-synonym.
- **Questionnaires = Foundation + Security + Technology + AI** — "Questionnaires" plural when one of them is the "Foundation" is fine, but "Foundation" is a metaphor with no domain meaning for a novice.
- **Profile** as both section and route — fine.

Net: the two-dimensional taxonomy (topic × activity) is honest, but the *labels* are curated for a reader who already knows IR and already knows the product. A novice will spend more time choosing a starting point than the product intends.

---

## Commercial / strategic analysis

**Job to be done (hypothesis):** "I have views about foreign policy, technology, or AI, and I want a structured way to notice my own patterns and discuss them with one other person — without being told I have a personality type."

Plausible buyers, in decreasing order of fit with the stated limits (no validation, independent, English-first, beta):

1. **Self-directed adult learner / discussion-group participant.** Wants a structured prompt, not a diagnosis.
2. **Instructor in IR / policy / AI-ethics courses** (undergraduate, extension, professional certificate). Wants a reusable exercise with visible method caveats — the "method available, validation open" posture is a *feature* here, not a defect.
3. **Tabletop/simulation/foresight practitioner.** `Departure` and `Futures` map directly onto scenario-facilitation work.
4. **Curriculum/editorial publisher or civic-education org.** Wants a linkable interactive; the fail-closed zh-Hans route matters for some buyers more than others.

**Substitutes:**
- Political-compass-style quizzes — cheap, viral, but a different job (entertainment identity, not deliberation).
- In-person case teaching (Harvard KSG-style) — high-trust, scarce, expensive, no interactive.
- Academic IR-literature summaries — high credibility, no interactivity, no personal mapping.
- Off-the-shelf survey tools (Qualtrics, Typeform) — no interpretation layer.
- AI chat-based "help me think about my IR views" — free, personalized, unauditable, and directly competes with the "get a reading" job. The defensible counter is the *authored*, versioned, replayable scoring contract (`PRODUCT.md:30,40`).

**Return trigger:** the product's honest answer today is "compare with someone" (`connected-profile.tsx:43`). That is a plausible loop: one person takes it, sends the link, second person takes it, they discuss. But sharing routes and comparison are listed as product surfaces (`PRODUCT.md:23`), not as a designed loop in the supplied files. There is no feed, streak, or retained save that would bring someone back alone.

**Acquisition (hypothesis):** organic, via instructors and discussion groups, plus link-sharing between two people. Not SEO-driven at scale, because the strongest assets (interpretation, relations) live behind interactive gathering. The method page and reference profiles are the most indexable surfaces.

**Defensibility:** weak as software; plausible as *editorial*. The assets are (a) the authored relations/interpretations, (b) the source-qualified reference profiles, (c) the versioned scoring contracts, and (d) the explicit refusal to overclaim. (a)–(c) can be copied; (d) cannot be copied without changing the product's identity. The moat, if any, is the *editorial voice and standards* plus the specific citation apparatus.

**Venture vs sustainable niche:**
- **Not venture-shaped on the shown evidence.** No population data, no network effect, no lock-in, no obvious 10x distribution. A VC principal should say: "This is a well-made independent editorial product; the realistic outcome is a respected niche resource, not a category-defining company, absent a specific paid use (course licensing, facilitation, curriculum) or a data product built on consented, ethically collected responses."
- **Sustainable-niche-shaped:** yes, plausibly. Small team, editorial upkeep, licensing to courses, sponsorship by a foundation, or donation-funded. That is a real business; it is not a "scale" business.

**Falsifiable pilot gates (none claimed as met; these are what would need to be true):**
1. **Interpretation-comprehension gate.** First-time readers can restate, in their own words, "the reading is not a diagnosis." Falsifiable by a reading-comprehension prompt after first Foundation result. (Would test F12, `foundation-interpretation.ts:19-25`.)
2. **Menu-selection gate.** A first-time reader reaches a destination in ≤2 actions without asking "which one?". (Tests F1, naming load.)
3. **Return-with-another-person gate.** A meaningful share of first-time completers send a result link to one other person, measured by share route use and paired completion. (Tests the "compare with someone" loop.)
4. **Chinese-route integrity gate.** No zh-Hans surface shows an English plural noun or untranslated template artifact. (Tests F3.)
5. **Correction-affordance gate.** Users who disagree with a reading can locate "That is not what I meant" without instruction. (Tests `connected-profile.tsx:53-59`.)
6. **Departure-consistency gate.** A majority of departures leave the exercise able to state which option they chose at each stage and why (measures whether the clearing behavior is helpful, not confusing). (Tests F14.)
7. **Trust-calibration gate.** After the About page, readers do not report the product as "validated" or "peer-reviewed." (Tests F8.)

All seven are stated as gates, not evidence. None should be reported as passing without data.

---

## Coverage / task matrix for automated functional probes (JSON-serializable)

This is a **functional-probe specification**, not UI automation and not executable. Each entry names a target route, a probe kind, an assertion, and the source it derives from. "Probe kind" values are from a small closed vocabulary so a harness can dispatch: `render`, `contract`, `link-graph`, `payload`, `i18n`, `a11y-static`, `state-machine`, `copy-presence`, `privacy-copy`.

```json
{
  "schema": "functional-probe-matrix/v1",
  "target_revision": "6c19e4125228767a25b6660d29c636cc9a41ddb0",
  "probes": [
    { "id": "root-render",            "route": "/",                       "kind": "render",       "assert": ["root main present", "brand heading present", "entrance and menu regions present"], "source": ["components/home/root/root-home.tsx:137-178"] },
    { "id": "root-hash-modes",        "route": "/#entrance,/ #menu",       "kind": "state-machine","assert": ["mode derived from hash", "navigating to #menu without JS still lands on menu section"], "source": ["components/home/root/root-home.tsx:77-95"] },
    { "id": "root-local-status-copy", "route": "/",                       "kind": "copy-presence","assert": ["new device copy renders", "foundation-only copy renders", "draft-only copy renders under both locales"], "source": ["components/home/root/root-home.tsx:27-62","content/root.ts:50-61,83-94"] },
    { "id": "root-i18n-plural",       "route": "/?locale=zh-Hans",         "kind": "i18n",         "assert": ["no latin-script plural noun inside localized localState sentence"], "source": ["components/home/root/root-home.tsx:38-53","content/root.ts:87,91-93"] },
    { "id": "nav-destination-registry","route": "n/a",                     "kind": "contract",     "assert": ["every navigationSections child id resolves in destinations", "every destination href unique", "every labelKey resolves in both locales"], "source": ["lib/navigation.ts:6-49","lib/root/destinations.ts:4-6"] },
    { "id": "nav-current-policy",     "route": "/results/*,/compare",      "kind": "contract",     "assert": ["foundation current on /results/*", "profile current on /compare"], "source": ["lib/navigation.ts:51-56"] },
    { "id": "dir-render",             "route": "/method,/about,/privacy",  "kind": "render",       "assert": ["directory nav renders", "all utilities present", "beta link honored when supplied"], "source": ["components/layout/navigation-directory.tsx:11-36"] },
    { "id": "dir-open-state",         "route": "/modules/security",        "kind": "state-machine","assert": ["questionnaires details open when child current"], "source": ["components/layout/navigation-directory.tsx:22-28"] },
    { "id": "about-render",           "route": "/about",                   "kind": "render",       "assert": ["metadata title/description set", "method and privacy links present", "email link rendered when contact present"], "source": ["app/about/page.tsx:6-35"] },
    { "id": "feedback-render",        "route": "/feedback",                "kind": "render",       "assert": ["corrections heading present", "no-answer-submission guidance present", "email link when present"], "source": ["app/feedback/page.tsx:6-53"] },
    { "id": "beta-noindex",           "route": "/beta",                    "kind": "contract",     "assert": ["robots.index=false", "robots.follow=false", "participation link absent -> linkUnavailable branch renders"], "source": ["app/beta/page.tsx:7-10","components/beta/controlled-beta-page.tsx:36-54"] },
    { "id": "beta-external-note",     "route": "/beta",                    "kind": "a11y-static",  "assert": ["aria-describedby target id present", "external note body precedes or is adjacent to CTA"], "source": ["components/beta/controlled-beta-page.tsx:37-47,74-79"] },
    { "id": "foundation-interp-bands","route": "n/a",                      "kind": "contract",     "assert": ["foundationAxisReading returns one of three strings per key", "summary nonempty for all 343 band combinations"], "source": ["lib/results/foundation-interpretation.ts:14-25"] },
    { "id": "foundation-interp-scope","route": "n/a",                      "kind": "copy-presence","assert": ["scope field present on interpretation object", "scope mentions no lasting trait"], "source": ["lib/results/foundation-interpretation.ts:45-52"] },
    { "id": "relations-states",       "route": "n/a",                      "kind": "contract",     "assert": ["each relation state in {applicable, contrary, mixed, score-only, unavailable}", "unavailable text present for each rule"], "source": ["lib/connected/relations.ts:20-67"] },
    { "id": "relations-evidence-use", "route": "n/a",                      "kind": "contract",     "assert": ["exact() rejects actor-role-judgment observations", "cross-domain subtraction never used"], "source": ["lib/connected/relations.ts:11-17,19"] },
    { "id": "profile-fallback",       "route": "/profile",                 "kind": "render",       "assert": ["connected-profile renders", "evidence list excluded when unavailable"], "source": ["components/profile/connected-profile.tsx:29-47"] },
    { "id": "departure-reducer",      "route": "/futures/departure",       "kind": "state-machine","assert": ["submit blocked until all stages complete", "navigate blocked without prerequisites", "revising earlier answer clears later answers and sets notice"], "source": ["lib/futures/departure.ts:115-132"] },
    { "id": "departure-interp",       "route": "/futures/departure",       "kind": "contract",     "assert": ["interpretDeparture returns [] unless all stages complete", "never returns more than one reading per combination than rules allow", "no reading implies psychological cause"], "source": ["lib/futures/departure.ts:135-148"] },
    { "id": "departure-localized",    "route": "/futures/departure",       "kind": "i18n",         "assert": ["notice string not embedded in data module if locale != en"], "source": ["lib/futures/departure.ts:131"] },
    { "id": "link-graph",             "route": "*",                        "kind": "link-graph",   "assert": ["all internal hrefs resolve to a defined destination id", "no destination id is orphaned from both nav and utilities"], "source": ["lib/navigation.ts:6-49"] },
    { "id": "privacy-routes",         "route": "/privacy,/feedback,/beta", "kind": "privacy-copy", "assert": ["each route states what is and is not collected", "beta states external service behavior before CTA"], "source": ["app/feedback/page.tsx:25-38","components/beta/controlled-beta-page.tsx:66-79"] }
  ]
}
```

Each probe is specified to be **deterministic from source**, so a harness can implement it without a browser where possible (contract/state-machine/i18n probes) and with a headless renderer where it must (render/a11y-static/link-graph). I have not run any of them.

---

## Short list of what I would fix first (not a redesign)

1. F3 — localize plural nouns (visible defect).
2. F9 / F10 — make "next relation" and "no relations" derive from domain state, not key count or a parallel topic ternary.
3. F12 — say in the body that the summary highlights the most distinctive axis, not the cause.
4. F6 — move the external-service disclosure above the beta CTA.
5. F1 — offer a non-animated Enter path for reduced-motion / low-power devices.
6. F20 — verify with first-time readers that `thinkers`/`publicPositions` and `references` are distinguishable; if not, rename one label.

Everything else in this audit is either a low-severity hygiene item or a strategic observation that does not require code change. My recommendation is to keep the current architecture; no wholesale refactor or new dependency is justified by the evidence supplied.
