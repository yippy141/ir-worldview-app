# V19 privacy red-team response

**Status:** accepted for local-only V19; research backend remains blocked  
**Owner approval of a final research schema:** not recorded  
**Operational research storage:** unavailable and non-activatable

This response treats `V19-privacy-red-team.md` as a hostile design review, not as an instruction to
build every control into an inactive product. The correct V19 fix is to remove the unsafe intake
shape and misleading UI. Consent receipts, deletion credentials, retention jobs, research admin
routes, migrations, and research audit logs belong to a separately approved backend release.

## Findings accepted and changed

| Finding | Decision | V19 disposition |
| --- | --- | --- |
| Persistent `respondentId` and client `sessionId` enable cross-run linkage | Accept | Removed with the research payload contract. No research route reads a body. |
| Optional/defaulted consent is not explicit consent | Accept | Removed the mock consent checkbox. There is no collection control while collection is unavailable. |
| `contactEmail` in the response contract is false separation | Accept | Removed the response contract and contact field. |
| `rawJson`, `derivedResult.summary`, arbitrary event `meta`, `source`, and deletion `reason` admit free text | Accept | Removed all research intake schemas and event intake. |
| Raw answers plus derived profiles are excessive | Accept | No server-side response or derived-profile record exists in V19. |
| Environment flags create a dangerous activation path | Accept | Legacy research routes are fixed `410` tombstones. Environment variables cannot enable them. |
| Answer-bearing friend challenges are non-revocable bearer disclosures | Accept | Retired token creation, validation, and reveal. Sharing now offers a case-only invitation. |
| `hasLocalFoundation` and exact custom timestamps are unnecessary analytics properties | Accept | Removed both from the allowlist, client event, privacy copy, tests, and measurement plan. |
| Local-only launch needs a visible deletion control | Accept | Added one control covering registered Profile, draft, Current Case, and result-history keys. |
| Result feedback links propagated encoded result payloads | Accept | Result pages now link to a context-free corrections page. |
| The external feedback form creates a free-text/contact intake | Accept | Removed the product link and replaced it with a narrow operational contact boundary. |
| Share/result URLs deserve stricter browser handling | Accept | Added `no-referrer` and security headers plus `private, no-store` on encoded share routes. The two World Stage homepages send only their origin cross-site so the URL-restricted Mapbox token can load tiles. |

## Findings that remain release gates instead of V19 features

The following findings are valid for a future research service, but implementing placeholder
versions now would make the release look safer or more operational than it is:

- controller identity, jurisdiction, legal basis, DPIA, and ethics/IRB determination;
- named processors, contracts, transfer basis, and subprocessor register;
- authenticated deletion, backup expiry, and deletion evidence;
- distributed rate limits, enrolment controls, anti-replay, and poisoning analysis;
- protected admin routes, phishing-resistant MFA, just-in-time access, and export approval;
- incident response, audit review, and a completed tabletop;
- a disclosure-control protocol for any aggregate publication.

V19 does not claim these controls exist. It prevents the processing that would require them.

## Pushback on over-broad recommendations

1. **Do not build a full consent ceremony for an inactive intake.** A realistic-looking checkbox
   without an approved controller, purpose, schema, or storage service is misleading. Consent UI
   should ship with the reviewed collection path, not before it.
2. **Do not remove deliberate user sharing.** User-selected result/profile links and explicitly
   selected Current Case reading text are product outputs under the reader's control. The unsafe
   element was a bearer link that stored another person's answer until reveal.
3. **Do not treat a cell threshold as anonymisation.** “Suppress below 20” is a necessary floor in
   the supplied backend requirements, but it is insufficient for public release. V19 publishes no
   participant aggregates. Any later release also needs complementary suppression, differencing
   controls, rounding or perturbation, motivated-intruder review, and a self-selection warning.
4. **Do not call local-only use anonymous.** Local browser state and deliberately shared URLs still
   carry sensitive judgments. The accurate claim is that V19 does not collect research responses.

## Proposed future contract — not approved

This is the smallest candidate contract for owner review. It is not a migration specification.

### Identity decision

`runId` should be a server-issued random identifier created independently for each submission. It
must have no derivation from a device, browser, result URL, email, analytics visitor, prior run, or
another instrument. The phrase “pseudonymous respondent ID” is rejected if it means a stable person
or browser identifier. Cross-run linkage requires a different study and separate approval.

### Candidate source fields

| Field | Type/constraint | Purpose |
| --- | --- | --- |
| `runId` | server UUID; one run only | Row relationship and deletion target |
| `instrumentId` | closed enum; no holistic Profile | Approved single instrument |
| `instrumentVersion` | immutable version enum | Reproducibility |
| `scoringVersion` | immutable version enum | Transient recomputation provenance |
| `consentVersion` | exact approved enum | Consent provenance |
| `productionCommitSha` | 40-character lowercase SHA | Deployment provenance |
| `mode` | closed coarse enum | Approved instrument mode |
| `questionId` | versioned question foreign key | Question analysis |
| `answerOptionId` | enumerated option foreign key | Fixed-choice response |
| `durationBucket` | optional closed enum | Coarse quality signal |
| `submittedOn` | server UTC date | Retention scheduling without event-time precision |
| `deleteOn` | server UTC date; at most 90 days | Enforced expiry |
| `deletionSecretHash` | password-hash/KDF output only | User-held deletion credential verification |

No source table may contain contact data, free text, arbitrary JSON, exact client timestamps,
derived labels, score vectors, full routes/referrers, IP addresses, user agents, analytics IDs, or
shared URLs.

### Consent and operational records

Consent must have separate unchecked age/voluntariness and single-run explicit-consent controls.
The server must reject the submission unless both are current and true, and must create an immutable
purpose-specific consent receipt. Withdrawal/deletion is a distinct event. Product analytics must
never carry `runId`, a deletion credential, or a consent-receipt identifier.

An operational audit log may record only authenticated administrative action, actor, outcome,
approved reason code, and time. It must never copy answers, profiles, request bodies, deletion
secrets, or contact messages. There is no individual scoring dashboard and no general raw-data
endpoint.

## Owner decisions required before implementation

1. Approve `runId` as per-run only, or explicitly propose and justify a separate linkage study.
2. Name the controller, jurisdiction, lawful basis, special-category condition, and privacy contact.
3. Approve one instrument, exact purpose, recruitment boundary, and consent wording.
4. Approve the final question/option allowlist, versions, mode enum, and optional duration buckets.
5. Approve 90-day source retention and the backup-expiry maximum.
6. Approve the storage/auth providers, regions, DPAs, roles, and export prohibition.
7. Approve the deletion-token design and backup/deletion evidence model.
8. Approve the incident plan, rate-limit/enrolment design, migration plan, and security test plan.
9. Confirm that beta analysis remains internal with no public aggregates or group reports.
10. Record legal/ethics review and explicit owner sign-off in a new decision record.

Until those decisions are recorded, security, migration, retention-job, deletion, admin-route, and
research E2E implementation is intentionally out of scope because there is no approved backend to
test.
