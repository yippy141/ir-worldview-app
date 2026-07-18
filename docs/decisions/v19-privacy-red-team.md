# Hostile review board verdict

## **NO-GO for server-side research-response storage. Conditional GO for a local-only V19 beta.**

The current backend proposal does not merely collect survey answers. It would create a reusable record of a person’s geopolitical judgments, inferred political or philosophical orientation, confidence, longitudinal changes, and possibly contact identity. That is a surveillance-grade dataset even when the product’s intent is educational.

The safest part of the present system is that the storage adapter is still disabled. Keep it disabled. The V19 product plan itself correctly defers raw-response storage and public aggregate reporting.  

The danger is that the intake scaffold is already shaped incorrectly for activation:

* `consentVersion` is optional and silently defaulted; there is no server-enforced `researchConsent === true`.
* One request may contain raw answers, stable respondent and session identifiers, detailed derived profiles and scores, exact times, source, and contact email.
* The visible consent checkbox is explicitly a non-submitting mock-up.
* The earlier architecture document correctly required affirmative consent and a separate contact path, but the current validator contradicts those requirements.

The connected GitHub source is also not a certifiable V19 source of truth: its latest visible merge is labeled V18, its public privacy page still refers to V13, and the Current Case challenge files present in the uploaded V19 snapshot are not available from `main`. The uploaded repository snapshot therefore had to be treated as the operative V19 proposal. A production system cannot be approved when the reviewed commit, deployed code, consent version, privacy notice, and data map do not identify the same system.

As a legal-risk assumption, IR worldview results and AI-governance profiles should be treated as data revealing or intentionally inferring political opinions and potentially philosophical beliefs. Under EU and UK rules, political opinions are sensitive or special-category data; intentional inference can qualify regardless of how accurate the inference is. Processing normally requires both an Article 6 lawful basis and an Article 9 condition. ([ICO][1])

This is a launch-risk review, not a jurisdiction-specific legal opinion.

---

# 1. Launch blockers

Every item below is a **P0 blocker before enabling any response-storage environment variable or storage adapter**.

| Blocker                                                           | Why it blocks launch                                                                                                                                                                                                                                                                                                                                      | Required disposition                                                                                                                                                                                  |
| ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1. No server-enforced consent**                                 | A consent-version string is not proof of consent. The server accepts a submission without an affirmative consent field and supplies its own default consent version.                                                                                                                                                                                      | Reject every response unless the server receives and records an explicit, current, purpose-specific consent receipt.                                                                                  |
| **2. Consent purposes are bundled**                               | “Research and product improvement” can encompass question testing, profile analysis, longitudinal linkage, publication, partnerships, and future commercial use. Those are materially different purposes.                                                                                                                                                 | Separate consent for: this single run; longitudinal linkage; public aggregate publication; follow-up contact; and any external research partnership.                                                  |
| **3. Sensitive-opinion processing has no documented legal basis** | The product intentionally derives worldview labels and policy-orientation scores. Calling this “research” does not itself create a legal basis or research exemption.                                                                                                                                                                                     | Written legal determination for each offered jurisdiction: controller’s Article 6 basis, Article 9 condition, national research-law requirements, and whether explicit consent is valid.              |
| **4. No completed DPIA**                                          | The system combines profiling, sensitive political-opinion data, longitudinal linkage, social sharing, possible group use, and public reporting. Even where a DPIA is not automatically mandatory at tiny scale, this board requires one.                                                                                                                 | Signed DPIA before processing; repeat it whenever purposes, fields, processors, cohorts, or reports change. At scale, GDPR DPIA triggers become substantially more likely. ([European Commission][2]) |
| **5. Raw answers and derived profiles are both retained**         | This stores the evidence and the operator’s interpretation of that evidence. It magnifies breach harm and is generally unnecessary because derived profiles can be recreated from answers plus a versioned scoring model.                                                                                                                                 | Select one minimum dataset per research purpose. Do not retain full answers, complete score vectors, labels, summaries, and event history together.                                                   |
| **6. Stable identifiers create a longitudinal political dossier** | A persistent `respondentId` can connect Foundation, modules, AI Governance, Current Cases, Profile, and events over time. Pseudonymisation does not make this anonymous or remove it from data-protection law. ([European Commission][3])                                                                                                                 | Default to a new per-run identifier. Cross-run or cross-instrument linkage must be a separate, optional research study with separate consent.                                                         |
| **7. Contact separation is false**                                | The API accepts `contactEmail` in the same response. The proposed SQL places email in a different table but keys that table with the same `respondent_id`. That is trivially joinable, not meaningful separation.                                                                                                                                         | Remove contact data from the research system. A later contact study needs a separate system, separate access role, and preferably no shared join key.                                                 |
| **8. Deletion is an intake form, not a deletion system**          | The current route only accepts a request. It does not prove the requester controls the record, delete data, remove exports, address backups, or confirm completion. A shared result link is not an ownership credential.                                                                                                                                  | User-held deletion secret, self-service deletion, verified email only where email was separately collected, cascading deletion, backup expiry, and auditable confirmation.                            |
| **9. Retention is not enforced**                                  | “12 months, then review/prune” is an aspiration, not a retention rule. There is no automated expiry in the reviewed scaffold.                                                                                                                                                                                                                             | Hard deletion dates stored with every run and automated deletion jobs tested before launch. No indefinite “research archive.”                                                                         |
| **10. No administrator-access governance**                        | Enabling database RLS is not an access model. No policies, analyst roles, export approval, just-in-time access, audit review, or break-glass process are demonstrated.                                                                                                                                                                                    | Least-privilege roles, phishing-resistant MFA, access logging, two-person raw export approval, no routine founder/developer browsing, and periodic access reviews.                                    |
| **11. Research endpoints lack adequate abuse controls**           | The response and deletion endpoints show payload validation but no demonstrated origin policy, distributed rate limiting, bot controls, replay protection, or study-enrolment authorization. This permits poisoning, spam, fabricated consent receipts, and deletion abuse.                                                                               | Invite or enrolment controls for a research beta, distributed rate limits, replay protection, monitoring, and a data-quality threat model.                                                            |
| **12. Current friend challenge leaks more than its UX suggests**  | The V19 token contains the inviter’s final choice and confidence for 30 days, is a non-revocable bearer link, and the reveal endpoint accepts any valid option and confidence rather than proof that the recipient completed the full case.                                                                                                               | Remove answer-bearing challenges from the safe beta, or require a revocable, short-lived, one-time flow with a real completion receipt.                                                               |
| **13. No small-cell disclosure protocol**                         | A minimum cell size of 20 alone does not prevent differencing, complementary disclosure, rare-combination identification, or inference inside a known class or workplace. Statistical agencies use suppression, perturbation, secondary suppression, query controls, and contextual review—not one magic threshold. ([Office for National Statistics][4]) | No public aggregate reports in the beta. Before publication, adopt a written disclosure-control protocol and independent release review.                                                              |
| **14. Group, classroom, and employer modes create coercion**      | Consent is unlikely to be freely given where an instructor or employer requests participation and can observe completion or results. Employment guidance specifically warns that power imbalance usually makes consent inappropriate. ([ICO][5])                                                                                                          | Defer these modes. Future adult workshops must be aggregate-only, genuinely optional, and technically prevent organizer access to individual results or participation status.                         |
| **15. No minors policy**                                          | A public quiz may be used by minors. Under-13 collection can trigger COPPA; UK services likely to be accessed by children must assess the Children’s Code; U.S. K–12 surveys of political beliefs can invoke PPRA. ([Federal Trade Commission][6])                                                                                                        | Research beta restricted to independently recruited adults aged 18+. No K–12 or youth group use.                                                                                                      |
| **16. International scope is undefined**                          | A non-EU operator may still fall under GDPR when offering services to, or monitoring, people in the EU. Sensitive data, rights handling, representatives, transfers, and local research laws then arise. ([European Commission][7])                                                                                                                       | Region-limit research collection until counsel approves each jurisdiction. Global product access may remain local-only, subject to separate analytics/ePrivacy review.                                |
| **17. Controller and processor chain are unidentified**           | The privacy page does not name a legal controller, address, jurisdiction, privacy contact, database processor, processor locations, or transfer mechanism.                                                                                                                                                                                                | Name the controller and execute all required DPAs before collection. Publish the current processor/subprocessor list.                                                                                 |
| **18. Research-ethics status is unresolved**                      | Publishing generalizable findings, recruiting university cohorts, or partnering with researchers may constitute human-subjects research under institutional or funding rules. Investigators should not casually self-declare a project exempt. ([HHS.gov][8])                                                                                             | Obtain a written IRB or independent research-ethics determination before institutional recruitment or generalizable research publication.                                                             |
| **19. Production provenance is not auditable**                    | Consent references V13 while the proposal is V19. GitHub, uploaded snapshot, privacy page, and deployment are not demonstrably synchronized.                                                                                                                                                                                                              | Immutable production commit SHA, data-schema version, consent version, processor configuration, and policy version recorded for every submitted run.                                                  |

Valid consent must be freely given, specific, informed, unbundled, prominent, and as easy to withdraw as to provide. Explicit consent must expressly identify the controller, purposes, and processing. ([ICO][9])

---

# 2. Required privacy copy

This is the minimum plain-language copy that should appear **at the point of collection**, not hidden only in a general privacy page.

Placeholders must be replaced before launch.

## A. Pre-consent notice

> ### Optional research contribution — adults 18 and older
>
> Your answers and the result derived from them may reveal or allow us to infer political opinions, philosophical beliefs, and other sensitive views. In some countries these are legally protected as sensitive or special-category personal data.
>
> Contributing is optional. You can use, save, and share the ordinary product without contributing research data. Refusing or later withdrawing will not reduce your access to the product.
>
> **Controller:** [FULL LEGAL NAME], [POSTAL ADDRESS OR JURISDICTION], [PRIVACY EMAIL].
>
> **What this study collects:** the question and answer identifiers from this single run; the instrument, scoring, consent, and application versions; a randomly generated identifier for this run; and [ONLY OTHER APPROVED FIELDS].
>
> **What it does not collect:** your name, email address, employer, school, precise location, advertising identifier, social-media identity, shared result link, or a persistent identifier connecting this run with other runs.
>
> **Purpose:** to evaluate question quality, answer distributions, and the reliability of the inventory. We will not use the data for advertising, political persuasion or targeting, employment or educational decisions, insurance, credit, public ideological ranking, or individualized profiling by a third party.
>
> **Linkage:** this run will not be connected to another quiz, module, Current Case, Profile, device, or contact record unless you separately and explicitly consent to a defined linkage study.
>
> **Processors and location:** [PROCESSOR NAMES], processing in [REGIONS]. Details and applicable transfer safeguards are listed in the privacy notice.
>
> **Retention:** the pseudonymous run will be automatically deleted on [DATE / 90 DAYS AFTER SUBMISSION]. Encrypted backups expire within [MAXIMUM BACKUP WINDOW].
>
> **Important limitation:** the record is pseudonymous, not anonymous. A distinctive combination of answers could still identify you if it were combined with information from another source.
>
> **Your choices:** you may withdraw consent, obtain a copy, correct eligible information, or delete the run through the private link issued after submission. Contact [PRIVACY EMAIL] for assistance or to complain.

Individuals must receive information about purposes, collected data, recipients, and rights before processing. ([European Commission][10])

## B. Required separate controls

These may not be compressed into one checkbox.

> ☐ **Age and voluntariness:** I confirm that I am at least 18 years old and that no employer, instructor, school, funder, or program requires me to contribute this research record or will receive my individual response.

> ☐ **Single-run explicit consent:** I explicitly consent to [CONTROLLER] storing and analysing the answers from this single run for the question-quality study described above.

Do **not** offer the following in the safe beta. When eventually offered, each requires its own unchecked control:

> ☐ **Longitudinal linkage:** I explicitly consent to this run being linked with specified future runs for [EXACT STUDY PURPOSE] until [DATE].

> ☐ **Public aggregate research:** I consent to my run being considered for aggregate publications after disclosure review. No row-level record or individual profile will be published.

> ☐ **External research partner:** I consent to [NAMED INSTITUTION] receiving [EXACT DATA] for [EXACT STUDY]. Its role, retention, and contact information are [DETAILS].

A generic acceptance of terms, continued product use, or a pre-ticked setting is not sufficient.

## C. Contact invitation

For the safe beta, collect **no contact information**.

A later follow-up study should use copy such as:

> ### Separate follow-up list
>
> This optional form is separate from the research-response database. The person managing follow-up contact cannot view your answers, and response analysts cannot view this contact list. Do not enter your research run ID, result link, employer, or school.
>
> Your address will be used only to invite you to [DEFINED ACTIVITY] and will be deleted by [DATE].

Do not publish this promise until technical and organizational separation actually exists.

## D. Submission receipt

> ### Research contribution received
>
> **Run ID:** [OPAQUE RUN ID]
> **Consent version:** [VERSION]
> **Automatic deletion date:** [DATE]
> **Purposes accepted:** [LIST]
>
> Save the private deletion link below. It contains a secret needed to manage this run. It is not your result-sharing link and should not be sent to another person.
>
> [VIEW / DOWNLOAD MY DATA]
> [WITHDRAW AND DELETE THIS RUN]
>
> Withdrawal stops future consent-based processing. It does not make prior lawful processing unlawful. Information already converted into a genuinely anonymous published statistic may no longer be traceable to your run.

## E. Required friend-challenge confirmation

The present privacy page’s “bearer link” disclosure is directionally honest but insufficiently prominent. Immediately before creating any answer-bearing link, display:

> This link reveals your final answer and confidence after the recipient submits a response. Anyone who receives or obtains the link may be able to reveal that information. Links can be forwarded, copied into message previews, retained in browser history, or exposed through another person’s device.
>
> [CURRENTLY: it cannot be individually revoked and expires after 30 days.]
>
> Do not create this link if disclosure of your answer could affect your work, education, safety, relationships, immigration status, or public reputation.

The bracketed current limitation is an argument to block the feature, not normalize it.

## F. Required group-session copy for any future mode

> Participation is voluntary and is not required for a grade, employment benefit, promotion, team assignment, or program eligibility. The organizer cannot see who participated, whether a particular person completed the activity, or any person’s answers or result.
>
> A group report is produced only when the disclosure threshold is met. Categories may be combined, rounded, or suppressed to prevent identification. No participant roster is joined with response data. An equivalent non-participation alternative is available without penalty.

---

# 3. Data fields to remove

The current intake and proposed schema allow far more data than is necessary: contact email, persistent identifiers, raw answers, arbitrary JSON, exact timestamps, full derived profiles, free-text summaries, event metadata, and profile linkage.

| Current or proposed field                          | Board decision                                        | Safer replacement                                                                   |
| -------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `contactEmail` in research submissions             | **Remove completely**                                 | Separate contact system with no response join key; omit in safe beta.               |
| Global `respondentId`                              | **Remove from default research**                      | New per-run pseudonymous ID.                                                        |
| Client-selected `sessionId`                        | **Remove as a persistent linkage key**                | Server-issued run ID with no cross-run meaning.                                     |
| `instrument: "profile"`                            | **Remove**                                            | Do not upload the user’s holistic Profile. Study individual instruments separately. |
| `derivedResult.topLabel`                           | **Remove where raw answers are kept**                 | Recompute in a restricted analysis environment using versioned scoring.             |
| `runnerUp` and `profileState`                      | **Remove**                                            | Same as above.                                                                      |
| `familyScores`                                     | **Remove from stored source record**                  | Compute transiently; retain only approved aggregate output.                         |
| `archetypeScores`                                  | **Remove**                                            | Compute transiently.                                                                |
| `dimensionScores` and `axisScores`                 | **Remove unless indispensable to a named study**      | Store the smallest approved derived metrics, not the entire vector.                 |
| `modifiers`                                        | **Remove by default**                                 | Recompute, or store one pre-specified study variable.                               |
| `summary`                                          | **Remove**                                            | It adds a natural-language sensitive profile and potential unexpected free text.    |
| Answer-level `rawJson`                             | **Remove**                                            | Fixed, versioned, enumerated answer fields only.                                    |
| Arbitrary research-event `meta`                    | **Remove**                                            | A narrow event-specific property schema or no research events.                      |
| Arbitrary `eventName`                              | **Remove**                                            | Closed allowlist reviewed with the DPIA.                                            |
| Event `respondentId` / `sessionId`                 | **Remove from ordinary product analytics**            | Aggregate event counts without a research join.                                     |
| Full `route`                                       | **Remove**                                            | Coarse route category.                                                              |
| Exact `startedAt` and `completedAt`                | **Remove**                                            | UTC date plus broad duration bucket, only if required.                              |
| Free-text `source`                                 | **Remove**                                            | Short enumerated acquisition category.                                              |
| Feedback free text linked to a run                 | **Remove linkage**                                    | Separate feedback form; no automatic response identifier.                           |
| Deletion-request `reason`                          | **Remove by default**                                 | Optional unlinked service-quality feedback after deletion.                          |
| Deletion-request `contact_email`                   | **Remove from research database**                     | Separate verified rights-request system.                                            |
| IP address, user agent, full referrer and full URL | **Never persist in research tables**                  | Security logs with redaction and short retention only.                              |
| Challenge token in logs or analytics               | **Never collect**                                     | Token redaction at every log, monitoring, error, and analytics boundary.            |
| Shared result/profile URL                          | **Never use as an identifier or deletion credential** | Separate deletion secret.                                                           |
| `hasLocalFoundation` analytics property            | **Remove for the initial beta**                       | Measure Foundation and Current Case funnels separately.                             |
| Exact custom-event timestamp                       | **Remove as a custom property**                       | Provider ingestion time and day-level reporting are sufficient.                     |

Fields that should remain when response research is eventually approved:

* question ID;
* selected answer ID;
* instrument version;
* scoring version;
* consent version;
* production commit SHA;
* coarse mode;
* per-run ID;
* automatic deletion date.

That is enough for most question-quality analysis.

---

# 4. Threat model

## Protected assets

The sensitive assets are not limited to “answers.” They include:

1. raw answer sequences;
2. derived worldview labels and score vectors;
3. changes across modules and time;
4. contact-to-response mappings;
5. cohort membership;
6. friend-challenge tokens and their encryption secret;
7. consent and deletion credentials;
8. administrator exports;
9. supposedly anonymous public tables;
10. local browser histories containing completed political judgments.

## Trust boundaries

The system crosses at least these boundaries:

* participant browser and local storage;
* Vercel edge/runtime and platform logs;
* application API;
* research database and backups;
* Vercel Analytics;
* contact, newsletter, or feedback provider;
* administrators and analysts;
* institutional organizers;
* research partners;
* published reports;
* messaging platforms carrying friend links.

## Adversaries and failure modes

| Adversary or failure                                  | Attack path                                                                              | Likely harm                                                                    | Required control                                                                                                                    |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| **External database attacker**                        | Credential theft, application flaw, exposed service key, vulnerable dependency           | Bulk exposure of political judgments, profiles and longitudinal history        | Minimal dataset, field separation, encryption, key separation, private networking where available, rotation and incident monitoring |
| **Compromised administrator**                         | Stolen admin session or local machine                                                    | Raw exports, targeted searches, deletion, modification                         | Hardware-key MFA, just-in-time access, export approval, no permanent super-admin sessions                                           |
| **Curious insider or founder**                        | Routine database browsing or downloading CSVs                                            | Unaccountable surveillance and favoritism                                      | Role separation, logged queries, explicit research protocol, no raw-data dashboard                                                  |
| **Employer or instructor**                            | “Voluntary” cohort invitation, completion tracking, asking participants to share results | Chilling speech, retaliation, grading or employment discrimination             | No individual visibility, no participant roster linkage, alternative activity, contractual prohibition                              |
| **Political campaign, advocacy group or data broker** | Purchase, partnership, sponsor request, API access, “audience insights”                  | Voter segmentation, persuasion, ideological targeting                          | Permanent no-sale/no-targeting restriction, no row-level sharing, no audience export                                                |
| **Abusive friend or acquaintance**                    | Forwarded or stolen bearer challenge link                                                | Unwanted disclosure of judgment and confidence                                 | Remove answer-bearing bearer links or make short-lived, revocable and one-use                                                       |
| **Messaging/link-preview service**                    | URL inspection and preview generation                                                    | Challenge token copied into third-party systems                                | Opaque non-sensitive URL, strict referrer and cache policy, no answer in bearer token                                               |
| **Malicious group participant**                       | Combining knowledge of peers with a small cohort report                                  | Identification of minority or unusual views                                    | No small cohorts, broad categories, suppression, rounding, disclosure review                                                        |
| **Differencing attacker**                             | Requesting overlapping aggregate tables or comparing reports over time                   | Derivation of small cells or a particular person’s change                      | No interactive table builder, query budgets, complementary suppression, stable release design                                       |
| **Bot or coordinated actor**                          | Automated fake submissions                                                               | Poisoned research findings and manufactured ideological trends                 | Invite controls, anti-replay, anomaly review, provenance and sensitivity analyses                                                   |
| **Deletion attacker**                                 | Using a guessed ID, shared result URL or another person’s email                          | Destruction of another participant’s records or discovery that a record exists | Secret deletion credential, verified contact channel, non-enumerating responses                                                     |
| **Third-party processor**                             | Support access, logs, backups, subprocessors or government demand                        | Exposure outside the research team’s intended boundary                         | DPA, subprocessor register, access restrictions, region review, request-handling policy                                             |
| **Shared-device user**                                | Opening local Profile or Current Case history                                            | Disclosure to family, classmates or coworkers                                  | Clear local-storage notice, “delete local history” control, private-mode guidance                                                   |
| **Cross-site scripting or compromised dependency**    | Reading same-origin local storage                                                        | Exfiltration of local Profile and case history                                 | Strong CSP, dependency governance, no unnecessary third-party scripts, local-data minimization                                      |
| **Government or legal process**                       | Subpoena, court order, border or regulatory demand                                       | Identification or chilling of participants                                     | Data minimization, short retention, documented request review and transparency policy                                               |
| **Researcher publication error**                      | Over-granular table, quotation, rare profile combination                                 | Reidentification and reputational harm                                         | Independent disclosure review and motivated-intruder testing                                                                        |

Effective anonymisation must consider what a motivated, reasonably competent person could infer using outside information. Merely removing names or replacing them with IDs is not sufficient. ([NIST Computer Security Resource Center][11])

---

# 5. DPIA-style risk table

This is a screening-level DPIA table. It is not a substitute for the signed DPIA of the actual controller.

| Processing activity                                   | Rights and harms at stake                                                       | Inherent risk | Required mitigation                                                                  | Expected residual risk | Decision                         |
| ----------------------------------------------------- | ------------------------------------------------------------------------------- | ------------: | ------------------------------------------------------------------------------------ | ---------------------: | -------------------------------- |
| Collecting IR and AI-governance answers               | Privacy, political expression, freedom from discrimination, chilling of thought |  **Critical** | Explicit single-run consent, adults only, strict minimisation, 90-day deletion       |                 Medium | Block until complete             |
| Deriving worldview and political-orientation profiles | Misclassification, stigma, manipulation, ideological sorting                    |  **Critical** | User-facing explanation, no high-stakes use, do not retain label with raw answers    |                 Medium | Block storage of derived profile |
| Persistent respondent ID across instruments           | Longitudinal surveillance, unexpected context collapse                          |  **Critical** | Per-run ID only; independent consent for defined linkage study                       |             Low–Medium | Remove from beta                 |
| Contact-to-response linkage                           | Direct identification, phishing, retaliation, partner misuse                    |  **Critical** | No contact collection; later separate trust domain with no shared key                |                    Low | Remove                           |
| Raw answers plus full scores and summary              | Maximum breach intelligibility and harm                                         |      **High** | Choose the minimum representation; derive transiently                                |             Low–Medium | Redesign                         |
| Exact timestamps and source data                      | Reidentification using attendance, social posts or organizer knowledge          |      **High** | Day/date buckets, enumerated source, no attendance roster                            |                    Low | Minimise                         |
| Public aggregate reporting                            | Small-cell identification, misleading public-opinion claims                     |      **High** | No beta report; disclosure protocol, manual review, caveats, rounding/suppression    |                 Medium | Defer                            |
| Private classroom or team report                      | Organizer inference, retaliation, peer identification                           |  **Critical** | Adult voluntary participation, no individual visibility, sufficiently large groups   |            Medium–High | Defer                            |
| Employer-sponsored use                                | Coercion, adverse employment effects, discrimination                            |  **Critical** | No individual data or completion status; contractual no-decision use                 |                   High | No-go use                        |
| Friend challenge                                      | Uncontrolled disclosure through bearer links                                    |      **High** | Case-only sharing or short-lived revocable one-use links                             |             Low–Medium | Block present design             |
| Research events joined to responses                   | Behavioural surveillance beyond stated study                                    |      **High** | Separate aggregate analytics; no shared IDs                                          |                    Low | Remove join                      |
| Administrator access and exports                      | Insider abuse and uncontrolled copies                                           |  **Critical** | RBAC, MFA, JIT, query logging, two-person export approval                            |                 Medium | Block until evidenced            |
| Processor and subprocessor access                     | International transfer, unanticipated secondary access                          |      **High** | DPAs, subprocessor review, SCC/IDTA where applicable, deletion commitments           |                 Medium | Block until contracted           |
| Minor participation                                   | Invalid consent, developmental vulnerability, parental and school rights        |  **Critical** | Adults-only recruitment; no K–12 use                                                 |                    Low | Exclude                          |
| EEA/UK participation                                  | Special-category basis, rights, transfers, representative obligations           |      **High** | Jurisdictional legal review and transfer framework                                   |                 Medium | Region-limit beta                |
| Security breach                                       | Employment, academic, political, immigration and personal repercussions         |  **Critical** | Minimal data, short retention, encryption, incident plan and tabletop                |                 Medium | Block until tested               |
| Function creep into partners or monetisation          | Betrayal of original consent and civil-liberties harm                           |  **Critical** | Purpose limitation, re-consent, permanent prohibited-use clauses                     |                 Medium | Governance blocker               |
| Incorrect or poisoned research findings               | Reputational harm, misleading public discourse, bad scoring changes             |      **High** | Enrolment controls, quality checks, self-selection caveats                           |                 Medium | No public claims in beta         |
| Version and policy drift                              | Users consent to a system different from the one operating                      |      **High** | Immutable versions, deployment attestations, consent invalidation on material change |                    Low | Block until unified              |

The EDPB issued draft Guidelines 1/2026 on personal-data processing for scientific research, with consultation closing June 25, 2026. Those guidelines are current but not a final safe harbor; counsel should consider them without assuming that “scientific research” removes the need for a lawful basis, purpose limitation, safeguards, or rights handling. ([European Data Protection Board][12])

---

# 6. Minimum legal review questions

Counsel should answer these in writing before collection.

## Controller and jurisdiction

1. **Who is the data controller?** Is it the creator personally, an LLC, a nonprofit, a fiscal sponsor, a university, or joint controllers?
2. What legal name, address, jurisdiction, privacy contact and complaint channel must appear in the notice?
3. Which locations will the product actively market to or recruit from?
4. Does targeting or monitoring people in the EEA or UK bring the project within GDPR or UK GDPR territorial scope?
5. Is an EU representative, UK representative, DPO, or formally designated privacy officer required?
6. Which U.S. state consumer-privacy, biometric, educational-survey, employment, or breach laws apply at the anticipated scale?

## Lawful basis and sensitive data

1. Do the questions or generated results constitute data revealing political opinions, philosophical beliefs, or another protected category?
2. What Article 6 lawful basis applies to each activity?
3. What Article 9 condition applies to each activity?
4. Is explicit consent legally available and valid for this controller and context?
5. Is consent still freely given in a class, fellowship, workplace or paid program?
6. Which purposes require separate consent rather than one broad “research and product improvement” authorization?
7. Is retaining both raw answers and derived profiles necessary and proportionate?
8. What change in purpose, recipient or monetisation requires fresh consent?

## Research ethics

1. Is the activity product testing, human-subjects research, scientific research under applicable data-protection law, or multiple activities with different rules?
2. Does university recruitment, publication, sponsorship or federal support trigger institutional IRB/Common Rule requirements?
3. Who is authorized to issue the exemption or non-human-subjects determination?
4. Does the consent process meet both data-protection consent and research-informed-consent requirements?
5. What adverse-event, complaint and participant-support procedure is required?
6. Who owns the data and publication rights in a university or think-tank partnership?

HHS defines research as a systematic investigation designed to develop or contribute to generalizable knowledge and recommends that investigators not independently make exemption determinations where institutional processes apply. ([HHS.gov][8])

## Children, education and employment

1. How will the product avoid actual or constructive knowledge that a research participant is under 18?
2. What COPPA obligations arise if an under-13 participant submits data?
3. Is the service likely to be accessed by UK children, and what Children’s Code assessment is needed?
4. Would K–12 use implicate PPRA because the survey concerns political beliefs?
5. When would classroom results become education records under FERPA?
6. What written agreement and direct-control terms would an educational institution require?
7. Can any employer-sponsored version obtain valid consent given the power imbalance?
8. Which state laws restrict adverse employment action based on political activity or opinion?
9. Must the product explicitly prohibit hiring, promotion, assignment, discipline or security-screening uses?

PPRA expressly covers surveys of students’ or parents’ political affiliations or beliefs in covered educational programs. FERPA may also constrain third-party educational tools and requires limits on use, redisclosure and institutional control where education records are involved. ([studentprivacy.ed.gov][13])

## Rights, deletion and retention

1. What rights apply to access, correction, portability, objection, restriction, withdrawal and erasure in each jurisdiction?
2. How should identity be verified without collecting more identity information than the study otherwise needs?
3. What is the lawful retention period for raw records, consent receipts, deletion audit records, security logs and backups?
4. Which research or legal-claims exceptions to deletion might apply, and will the project intentionally rely on any?
5. When are aggregates sufficiently and irreversibly anonymised that rights no longer attach?
6. How will deletion propagate to processors, backups, exports, cached tables and research partners?

GDPR erasure rights are not absolute, but data retained for research or another exception still requires a valid basis and appropriate safeguards; truly anonymised information is treated differently from reversible pseudonymisation. ([European Commission][14])

## Contracts and international transfers

1. Does the project have an executed DPA with Vercel under its actual plan? Vercel’s current DPA states that it applies to Pro and Enterprise customers; this must not be assumed for another plan. ([Vercel][15])
2. What DPA will govern the selected database provider, and in which region will the database and backups reside?
3. Which providers process hosting logs, analytics, email, newsletter subscriptions, feedback, error reports, support tickets and backups?
4. Does each contract prohibit sale, advertising use, model training and secondary purposes?
5. What are each processor’s breach-notification period, deletion assistance, audit rights and subprocessor-change terms?
6. Are EU SCCs, a UK IDTA/addendum, adequacy mechanism, and transfer-impact assessment required?
7. Who is controller, processor or joint controller in institutional pilots and research partnerships?
8. Does a group customer contract prohibit individual employment, educational or disciplinary use?
9. What insurance—cyber, technology E&O or research liability—is appropriate?

GDPR requires processor guarantees and contractual controls. The European Commission’s SCCs cover controller–processor terms and international transfers, with transfer assessments and onward-transfer obligations where applicable. ([European Commission][10])

## Incident response and publication

1. What incidents must be notified to users, regulators, institutional partners and processors?
2. Who has authority to disable collection and rotate secrets?
3. Can the team meet a 72-hour GDPR supervisory notification deadline where required?
4. What approval process applies before every public table or cohort report?
5. What sample limitations and self-selection caveats are legally and ethically required?
6. Can an institution, sponsor or journalist receive unpublished row-level or small-cell data? The board’s answer should be no.

Under GDPR, a qualifying personal-data breach must be reported to the supervisory authority without undue delay and, where applicable, within 72 hours; high-risk breaches may also require notice to affected individuals. ([European Commission][2])

---

# 7. Safe beta scope

## A. V19 public product beta that is acceptable now

V19 may launch as an editorial and reflective product under these constraints:

* Research-response storage remains disabled.
* Foundation, module, AI, Profile and Current Case histories remain browser-local.
* A prominent “delete all local history” control is available.
* No account, email or persistent research identifier is created.
* Coarse product analytics remain separated from answers and profiles, with an effective browser opt-out.
* No public aggregate worldview results.
* No classroom, group, fellowship, team or employer reporting.
* No minors-focused distribution.
* No raw-data export, research dashboard or partner API.
* Friend sharing is limited to a case-only link or ordinary user-selected result sharing; the current 30-day answer-bearing challenge should not ship.

The V19 plan already describes raw-response storage and public aggregate results as deferred work. That is the correct launch boundary, not a feature deficiency.

Vercel describes Web Analytics as cookie-free, aggregate-oriented and based on a short-lived visitor hash, but that does not remove the need to verify the applicable DPA, hosting logs, configured custom fields, local-storage access rules and privacy notice. ([Vercel][16])

## B. A later research beta that could be approved

Only after all P0 blockers are resolved:

| Scope element             | Maximum safe beta boundary                                                      |
| ------------------------- | ------------------------------------------------------------------------------- |
| Participants              | 50–150 independently recruited adults, 18+                                      |
| Jurisdiction              | One counsel-approved jurisdiction; the conservative starting point is U.S.-only |
| Recruitment               | Direct adult invitations, not classroom-required or employer-sponsored          |
| Instruments               | One instrument or Current Case study, not the holistic Profile                  |
| Identity                  | One random ID per run; no persistent browser respondent ID                      |
| Contact                   | None                                                                            |
| Longitudinal linkage      | None                                                                            |
| Data retained             | Fixed answer IDs, versions, coarse duration and run ID only                     |
| Derived profile           | Computed transiently; not stored with raw answers                               |
| Retention                 | Automatic deletion of source runs after 90 days                                 |
| Backups                   | Documented maximum expiry, preferably no more than 35 days                      |
| Application/security logs | Payload-redacted; 7–14 days unless a documented security need justifies longer  |
| Consent                   | Separate, explicit, current, server-verified; receipt issued                    |
| Deletion                  | One-click deletion using a user-held secret                                     |
| Administrators            | At most two named roles; all access logged; no local CSV downloads              |
| Analysis                  | Internal question-quality analysis only                                         |
| External sharing          | None                                                                            |
| Public publication        | None during the beta                                                            |
| Group reports             | None                                                                            |
| Friend challenge          | Disabled or case-only                                                           |
| Legal/ethics              | Written legal review, DPIA and independent ethics/IRB determination             |
| Incident readiness        | Completed tabletop exercise before first submission                             |

Limiting the beta to one jurisdiction reduces complexity; it does not eliminate applicable state laws, security duties, research ethics, or the need for accurate representations.

## C. Later aggregate-publication gate

Do not treat “cell size 20” as a safe harbor.

A conservative first public release should require:

* at least 200 valid opt-in participants overall;
* no geographic, school, employer or program-level results;
* no demographic cross-tabs;
* each displayed subgroup or cell containing at least 50 participants;
* rounding or controlled perturbation;
* primary and complementary suppression;
* no overlapping releases that allow differencing;
* no downloadable microdata or row-level extracts;
* motivated-intruder review;
* written disclosure clearance;
* methods language beginning with “Among self-selected participants who opted in…”;
* explicit statement that results are not representative of the public.

Those numbers are board-imposed interim safeguards, not statutory thresholds. Disclosure risk depends on context, outside knowledge, rarity and the number of overlapping releases. NIST and ONS guidance both emphasize governance and disclosure-risk assessment rather than simple removal of direct identifiers. ([NIST Computer Security Resource Center][11])

---

# 8. No-go use cases

These should be prohibited in public policy, customer contracts, data architecture and access controls—not merely discouraged in marketing copy.

1. **Political advertising or campaign targeting.**
   No voter segmentation, issue targeting, persuasion scoring, canvassing prioritisation, donor targeting or campaign-message testing based on answers or inferred profiles. ICO guidance treats inferred political opinions as special-category data and regards political-message targeting without explicit consent as generally impermissible. ([ICO][1])

2. **Individualized political persuasion.**
   No changing news, arguments, candidate information, Current Case framing or recommended political messages to exploit a person’s profile. User-initiated educational explanation is different from covert persuasion.

3. **Employment decisions.**
   No hiring, promotion, termination, performance review, culture-fit analysis, team assignment, leadership selection, background checking or workplace investigation.

4. **Security-clearance, intelligence or law-enforcement screening.**
   No “loyalty,” extremism, radicalisation, foreign-influence, insider-threat or national-security-risk inference.

5. **Educational admissions, grading or discipline.**
   No admissions decisions, scholarship decisions, course grading, program eligibility, participation marks or disciplinary action.

6. **Named classroom or workplace reporting.**
   No organizer access to an individual’s completion status, answers, result, confidence, change over time or share activity.

7. **Credit, insurance, housing or immigration decisions.**
   No underwriting, risk scoring, tenancy decisions, benefits eligibility, visa processing or citizenship assessment.

8. **Data sale, licensing or broker access.**
   No selling, renting, licensing, bartering or supplying response-level or profile-level data to advertisers, campaigns, consultancies, media audience teams, data brokers or enrichment firms.

9. **CRM, social-media or public-record enrichment.**
   No joining responses to LinkedIn, voter files, social accounts, email-marketing records, employer directories, donation records or data-broker attributes.

10. **Raw-data sharing with research sponsors or institutional customers.**
    A partner does not receive row-level data merely because it funded a workshop or report. A genuine research partnership requires separate governance and consent.

11. **Public ideological leaderboards.**
    No ranking named people, schools, employers, classes, countries, professional groups or institutions as more realist, interventionist, authoritarian, cooperative, radical or otherwise.

12. **Small-cohort or rare-profile reports.**
    No report where an organizer or participant could reasonably infer a specific person’s views from attendance or outside knowledge.

13. **Minor research participation in the general product.**
    No under-18 research beta and no K–12 classroom deployment without a separate child-specific legal, safeguarding, parental-consent, assent and ethics program.

14. **Mandatory or coerced participation.**
    No activity where refusal could affect employment, grades, fellowship standing, institutional access or social standing.

15. **Psychological or clinical diagnosis.**
    No claims that a worldview profile diagnoses personality, mental health, propensity for violence, moral character or cognitive deficiency.

16. **Automated adverse decisions.**
    No API or scoring service allowing another party to make consequential decisions from the profile.

17. **Individual reidentification research.**
    No attempts to infer who submitted a record, even internally, except narrowly necessary incident or rights-request handling under written authorization.

18. **Open individual-level research API or downloadable microdata.**
    Pseudonymised rows remain sensitive personal data. There should be no public or customer-accessible row-level dataset.

19. **Governmental or military cohort profiling.**
    A voluntary educational workshop for officials may eventually be acceptable only as a non-identifiable discussion exercise. Organizational mapping of individual officials’ beliefs is not.

20. **Retroactive purpose changes.**
    Data collected for question testing may not later be repurposed for commercial benchmarks, sponsor research, AI training, campaigns or group products without a new legal basis and new consent.

---

# Board resolution

The product may proceed as a **local-first V19 public beta**. The research-response backend may not be activated.

The board will reconsider only after receiving a review packet containing:

1. one immutable production commit SHA;
2. a complete data-flow and trust-boundary map;
3. a filled-in controller identity and privacy notice;
4. the final consent screens and submission receipt;
5. a signed DPIA;
6. written legal-basis and jurisdiction analysis;
7. an independent ethics or IRB determination;
8. executed processor agreements and a subprocessor register;
9. an access-control and export-approval matrix;
10. automated retention and deletion test evidence;
11. an incident-response plan and tabletop record;
12. a statistical-disclosure-control protocol;
13. a prohibited-use policy incorporated into contracts;
14. evidence that contact data, response data and product analytics cannot be silently joined.

Until then, the correct privacy architecture is not “pseudonymous storage with good intentions.” It is **no research-response storage at all**.

[1]: https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-for-the-use-of-personal-data-in-political-campaigning-1/special-category-data/ "https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-for-the-use-of-personal-data-in-political-campaigning-1/special-category-data/"
[2]: https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/obligations_en "https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/obligations_en"
[3]: https://commission.europa.eu/law/law-topic/data-protection/rules-business-and-organisations/application-gdpr_cs "https://commission.europa.eu/law/law-topic/data-protection/rules-business-and-organisations/application-gdpr_cs"
[4]: https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates/methodologies/qualityandmethodologyinformationqmiforcensus2021 "https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates/methodologies/qualityandmethodologyinformationqmiforcensus2021"
[5]: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/employment/monitoring-workers/data-protection-and-monitoring-workers/?search=imbalance "https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/employment/monitoring-workers/data-protection-and-monitoring-workers/?search=imbalance"
[6]: https://www.ftc.gov/news-events/news/press-releases/2025/01/ftc-finalizes-changes-childrens-privacy-rule-limiting-companies-ability-monetize-kids-data "https://www.ftc.gov/news-events/news/press-releases/2025/01/ftc-finalizes-changes-childrens-privacy-rule-limiting-companies-ability-monetize-kids-data"
[7]: https://commission.europa.eu/law/law-topic/data-protection/rules-business-and-organisations/application-regulation/who-does-data-protection-law-apply_en "https://commission.europa.eu/law/law-topic/data-protection/rules-business-and-organisations/application-regulation/who-does-data-protection-law-apply_en"
[8]: https://www.hhs.gov/ohrp/regulations-and-policy/guidance/faq/investigator-responsibilities/index.html "https://www.hhs.gov/ohrp/regulations-and-policy/guidance/faq/investigator-responsibilities/index.html"
[9]: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/lawful-basis/a-guide-to-lawful-basis/consent/ "https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/lawful-basis/a-guide-to-lawful-basis/consent/"
[10]: https://commission.europa.eu/law/law-topic/data-protection/rules-business-and-organisations/public-administrations-and-data-protection/what-are-main-aspects-general-data-protection-regulation-gdpr-public-administration-should-be-aware_en "https://commission.europa.eu/law/law-topic/data-protection/rules-business-and-organisations/public-administrations-and-data-protection/what-are-main-aspects-general-data-protection-regulation-gdpr-public-administration-should-be-aware_en"
[11]: https://csrc.nist.gov/pubs/sp/800/188/final "https://csrc.nist.gov/pubs/sp/800/188/final"
[12]: https://www.edpb.europa.eu/public-consultations/guidelines-12026-on-processing-of-personal-data-for-scientific-research_de "https://www.edpb.europa.eu/public-consultations/guidelines-12026-on-processing-of-personal-data-for-scientific-research_de"
[13]: https://studentprivacy.ed.gov/faq/what-protection-pupil-rights-amendment-ppra "https://studentprivacy.ed.gov/faq/what-protection-pupil-rights-amendment-ppra"
[14]: https://commission.europa.eu/law/law-topic/data-protection/rules-business-and-organisations/dealing-citizens/do-we-always-have-delete-personal-data-if-person-asks_en "https://commission.europa.eu/law/law-topic/data-protection/rules-business-and-organisations/dealing-citizens/do-we-always-have-delete-personal-data-if-person-asks_en"
[15]: https://vercel.com/legal/dpa "https://vercel.com/legal/dpa"
[16]: https://vercel.com/docs/analytics "https://vercel.com/docs/analytics"
