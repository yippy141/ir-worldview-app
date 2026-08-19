# Deterministic evidence audit

This report characterizes the checked-in instruments and scorers. It does not estimate population prevalence or create new psychometric pass thresholds. Concentrations and wording asymmetries are review evidence.

The audit is local and deterministic: it omits time and absolute paths, uses no network, external model, or database, and writes only the two requested files under `artifacts/evidence/`.

## Source manifest

| Source role | Path | SHA-256 |
| --- | --- | --- |
| instrument-bank | content/instrument/ai-governance.v2.json | 7a6fc3af779f29c04a249e92c887bc9168af9f49eeb7b436e29f8c3116c0810c |
| instrument-bank | content/instrument/ai-governance.v3.json | c61fc704a2121696effc2323f78ba0133ec8c7ae13b60133ef7928fb6f65bfd6 |
| instrument-bank | content/instrument/foundation.scoring.v1.json | e760f6f5b3037babcb5f64bcdcf54c54b4e8c1471a6d3c17a6bed33626712a00 |
| instrument-bank | content/instrument/foundation.v2.json | 1d47666272d54557313d89ccd437497bda685bac63f814044afff833f114e0e6 |
| instrument-bank | content/instrument/schema.json | 3931a03c04f285413572d511e8aa8a3515aa77688e5500c28f5b2371d60928b6 |
| instrument-bank | content/instrument/security.v2.json | 5eaf9093195b00f9fc2c77211c9018a023b325cff76f96cfd6901dd73536e6bd |
| instrument-bank | content/instrument/security.v3.json | 4ada4a5625952dcdce6113414e5796295625939d2ad18341d8451898a6b923ea |
| instrument-bank | content/instrument/security.v4.json | 685317aa2ad0d9f4eea883e6bae9c800364a3865aeb6a49cb2f7f44f600eea4d |
| instrument-bank | content/instrument/technology.v2.json | f32ac951c4bf019966c674f6649db468b4eb80c3da28b893659a0747ad964011 |
| instrument-bank | content/instrument/technology.v3.json | babfdcd7cf84130adb0736ee5abe49c661836ba1cee9ad1fde8799840042a968 |
| design-source | docs/v23/security/V23_3_SECURITY_ACTOR_BALANCE_LEDGER.csv | eb0e6b2df2812b4f0ef710e93dc40a466273937c22950e9888c1cc0f61ed53f7 |
| design-source | docs/v23/security/V23_3_SECURITY_ITEM_REVIEW.md | 7bd22bf39e9262b51e1684515569584f95521b9e260ff008dc8f2a492555b242 |
| design-source | docs/v23/security/V23_3_SECURITY_SOURCE_LEDGER.md | ce56c03619fb1c1b64480333d4698f31ce9685ad84d8b6a9ddc394be54c9e0cb |
| design-source | docs/v23/security/V23_3_SECURITY_V4_CONTRACT.md | a448fa34939e11f698de87db302610ed86c967208c129def5428640192868880 |
| scoring-runtime | lib/ai-governance-schema-v21.ts | 4cc318d3f16a9ad9a4e7e218dda899ab18da7f663f934c5579b1c7922a4e07b1 |
| scoring-runtime | lib/ai-governance-schema.ts | 7939c5af139694473793d7da2e0df97863f9fcaa5158e1372c8e3edce31edb46 |
| scoring-runtime | lib/ai-governance-scoring-v21.ts | 096ff3f59130e63b1be12498ce8bd2eb0b80e21c355bbf0870819e5c17a51d8d |
| scoring-runtime | lib/ai-governance-scoring.ts | 31497f9710c5c75fa0b1778fa212ac063d18fdff1c47b2fc81d1a73331ccb91a |
| scoring-runtime | lib/ai-governance-versions.ts | 09c351c88175671448fed98649a54c4a804976803eb5ba7cea8b3af371d43831 |
| calibration | lib/modules/calibration-data-v22.ts | eba33d471192a1a5efff0309461bf64056c52b922ea10fdb29d75c6c92e83754 |
| calibration | lib/modules/calibration-data.ts | 6a1d1a5ada8f2383a660d77db7b579deff69797d8a15d5f825220331143573ac |
| calibration | lib/modules/calibration.ts | 6aaa9ec35751fb3ad1574a0045937a1c04b57d894b891045b777ab5e2b3bd392 |
| scoring-runtime | lib/modules/runtime-v1.ts | 9997c9d63d8f998d1507aaaa57356cffeb84f9520f709f9dd5e2ea39150e3e50 |
| scoring-runtime | lib/modules/runtime-v2.ts | d33cd5cc22f437e24feb1ad5feb40a1d611f4ce121bb314cb6fd35a6fed878e2 |
| scoring-runtime | lib/modules/security-v21.ts | c2d1b0d99a0350ca51c8a4b20e5893d8684290722b2531b906a30c260374c15f |
| scoring-runtime | lib/modules/security-v22.ts | 76f61b4f5ee61f771b58dbac493166a6258df3ff650fe9b21b91fcb0b874f28d |
| scoring-runtime | lib/modules/security.ts | 3a69ff0a72adc866e36d3ef4bb2513d23cbe25082773db51889edf302fa41e70 |
| scoring-runtime | lib/modules/technology-v21.ts | 431874aaf7129398d1d3fb08c244e36e0a7e631f2ce3cf07ac3a89e5cfb53130 |
| scoring-runtime | lib/modules/technology.ts | 37d07809d6132a431757cfc1b4fb50070d85984b3c07740b6e01891a5df84fe6 |
| scoring-runtime | lib/modules/versions.ts | 9d310b66e376ba394e718e6c1d19e887cb28395047ada9f3304f8a2d4a09690d |
| scoring-runtime | lib/option-order.ts | 2fcfdb95d91d358db30a7d42bb86da1b754517b581fb5326c64f87841e29d83c |
| calibration | lib/scoring-calibration.ts | 6f3da32f4d4c5e3c9ca434a90856969fdc8f84db5ce50e60755be584ee2b1f4b |
| scoring-runtime | lib/scoring/v1.ts | 64ba868f9abdb4b2a3f6cb037a0b5b4301fd17132597b4180fa676a75e7443cb |
| calibration | lib/scoring/v2-calibration.ts | 9e4161036ae17b47c1367fcf8caf0db1d5d2cb80cb56e63a997369a5da132c9b |
| scoring-runtime | lib/scoring/v2.ts | 295d8be4e87aeba4cb574fe273efbaea83aa70a735d138b1fb8a083fba1c3d0c |
| scoring-runtime | lib/scoring/versions.ts | 87fc9bd229c254f66632939821bc63dc0acb53a02d094f970221d5ae0afa671c |
| copy-audit | scripts/audit-public-copy.mjs | ac4bc2e0880c0ac64f14fd0d559ec5617ac2ca6a50dd5b1620e27bbefb29fbf2 |
| calibration | scripts/calibrate-modules-bootstrap.mjs | d7094911334cdf2c65584b93f6a397b3c584b596f5b86058e124854a030d09da |
| calibration | scripts/calibrate-modules.mts | b34af8e105f72017c7a35310c3b0b45781b8a1e261f679e9c41d276a815aa640 |
| calibration | scripts/calibrate-targeted-forms.mts | 632442daa133683d99c87f8b5c3fc8ed6c595979970f07bd384b5d3f5ea13794 |
| copy-audit | scripts/code-unit-order.mjs | 8c1a37d324055d96678f1ad723d7dc1e3e067dd8801cb438001c03854877bc66 |
| diagnostic | scripts/diagnose-instrument.mts | 56d77aec89025844632c4ca799ff00c865fb80acded7c78af73b583acb9bc073 |
| diagnostic | scripts/diagnose-security-v4.mts | cdcd35e9ee726a40838cf4888d7dd79e326f80a8fd4b487f5cc97aa93288300e |
| evidence-entrypoint | scripts/evidence-audit.mts | 6f9ff2793b3a696d0a86937f35cc7b1969a846b6b14f363aa44cc8b01e353cc0 |
| evidence-bank-validation | scripts/evidence-bank-validation.mts | 5091f3fb838f29ae6337b1d3f01461b9fd4b50008565ae5e08d68fe63560bb95 |
| evidence-copy-delta | scripts/evidence-copy-delta.mts | 2a4fef55124cdf3d67203fa06d670f4983162a883804b2e0a523abe3de951e43 |
| evidence-instrument-analysis | scripts/evidence-instrument-analysis.mts | 5cb65b40a4d09b953e62c399ea266ca15ca9cfe3dc430e2ec5bc15451ddb302b |
| evidence-renderer | scripts/evidence-report.mts | 603412c72dfc0831e530c332a3d80ce14809b2fc16a505229729142e1bc04f29 |
| evidence-response-fixtures | scripts/evidence-response-fixtures.mts | 7b60c6ea3704bb628c620cc856f54e44bdf88f5e66733baa387e2b2e29017e18 |
| evidence-canonicalization | scripts/evidence-utils.mts | e80b75b95b56f68866077eb080c1347e75a128763c895802e2208cc4c80314b0 |
| diagnostic | scripts/validate-instrument.mts | 9b35f8460f0d58c194f5638009689b956c65c232fdc7ca04ba0765ccf05d9b5c |
| diagnostic | scripts/validate-security-v4.mts | 20863cf78b4756fdcc45667b00aefdf55069634c4ad7beaff944b6f245d4a439 |
| compatibility-test | tests/evidence-audit.test.mts | dd284aeaa2a7e5fe37b88a74aca147e7db4d9fb53f223f733960396a336537ae |
| compatibility-test | tests/evidence-instrument-analysis.test.mts | 4fb9f6c838346151da46795f344f83830f754519c97f54eecc3d299cc4175854 |
| evidence-baseline | tests/fixtures/evidence-audit-baseline.json | c6ded1a85949fd925ec2f80ab15aab792e6bea7403b3aa137048d386c3dc5055 |
| compatibility-test | tests/fixtures/instrument-version-golden.json | 444940da7418f398213ac7f8beb5e19ef802cf1f36488f2aac9ce35fc266c4f9 |
| compatibility-test | tests/fixtures/v21-module-copy-golden.json | 75f9475dc15f2f487ad7dfc3ec5ac2c78cc547927847605ec9f9e8a7f96b59e7 |
| compatibility-test | tests/instrument-measurement-gates.test.mts | 1ff5804dfb26bf455a67c61a1866cd939a19ee59ab1334e52b2b57d63078035d |
| compatibility-test | tests/instrument-version-compatibility.test.mts | 093856c4038e32800ecd8619518ac985d26cb812cdb6f8d6f1c33c99b182c60b |
| compatibility-test | tests/option-order.test.mts | 456a3abb313f146c7b2e76e6ce88ba495263cbaf33eeca28e899b0c104d399db |
| compatibility-test | tests/public-copy-audit.test.mts | 0d74af4f2ba5b8a5023dde61d2a87cbddbc9e6014e5e9423853c192e8b840cf2 |
| compatibility-test | tests/security-v4.test.mts | 41ad66493470cc9d51fdf582208730966d81cabb98b85c8bfc4068068f2875ab |
| compatibility-test | tests/v21-module-copy.test.mts | 378c1fffaa13b567f8ede3aab8044cc15e4e7f9e25cdc78a1523b8cbfdf746a4 |

## Current bank coverage

| Bank | Items | Mode | Axes | Lane | Question type | Scoring block | Actor role | Theater | Perspective tag | Knowledge load |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ai-governance-bank-v3 | 37 | analyst 37; standard 22 | deploymentPace 10; geopolitics 7; humanFuture 5; legitimacy 10; militaryRole 4; openness 5; oversight 11; riskHorizon 4 | undeclared 37 | likert 28; scenario 9 | likert-base 28; scenario-adjustment 9 | undeclared 37 | undeclared 37 | undeclared 37 | undeclared 37 |
| foundation-bank-v2 | 68 | analyst 68; standard 32 | domesticFilters 23; institutions 26; normsIdentity 22; orderJustice 13; politicalEconomy 19; restraint 21; securityCompetition 21 | undeclared 68 | likert 46; miniCase 11; tradeoff 11 | core 56; validation 12 | undeclared 68 | undeclared 68 | undeclared 68 | undeclared 68 |
| security-bank-v4 | 23 | analyst 23; standard 19 | activism 12; alliance 14; escalation 15; legitimacy 9 | alliances 9; deterrence 8; legitimacy 6 | case 23 | aggregate-and-card-type 13; card-type-only 10 | coalitionManager 10; developmental 1; exposedState 8; middlePowerHedging 7; protectionAuthority 7; rivalLogic 13 | undeclared 23 | alliance-manager 7; civilian-protection 1; cyber 1; deterrence 9; developmental 1; frontline-state 5; hedging 2; humanitarian 4; infrastructure 1; major-power 5; maritime 8; middle-power 6; nonaligned 5; nuclear 2; post-conflict 3; regional-order 4; regional-security 5; sanctions 3; small-state 1; transitional-justice 1; vulnerable-state 2 | low 9; medium 14 |
| technology-bank-v3 | 15 | analyst 15; standard 9 | control 11; governance 14; industrial 6; safety 5 | capacity 5; controls 5; governance 5 | case 15 | aggregate-and-card-type 13; card-type-only 2 | coalitionManager 5; developmental 9; exposedState 3; middlePowerHedging 2; protectionAuthority 5; rivalLogic 4 | undeclared 15 | ai-governance 3; alliance-manager 3; dependency 3; developmental 8; digital-sovereignty 1; export-controls 2; incident-response 1; industrial 4; major-power 2; middle-income 3; middle-power 1; military 1; nonaligned 2; regulation 2; research 1; research-access 1; safety 4; state-capacity 6; subsidies 1; supply-chain 1 | low 6; medium 9 |

- **ai-governance-bank-v3:** Analyst mode uses analystOptions where declared and otherwise uses options; standard items remain part of the analyst form.
- **foundation-bank-v2:** Bank mode tags are reported as declared. The active tiered Foundation flow selects core/extended forms separately and scores selected answers in analyst mode.
- **security-bank-v4:** Module modes use the exact questionsByMode bank membership.
- **technology-bank-v3:** Module modes use the exact questionsByMode bank membership.

## Legacy bank coverage

| Bank | Items | Mode | Axes | Lane | Question type | Scoring block | Actor role | Theater | Perspective tag | Knowledge load |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ai-governance-bank-v2 | 37 | analyst 37; standard 22 | deploymentPace 11; geopolitics 10; humanFuture 6; legitimacy 13; militaryRole 5; openness 7; oversight 14; riskHorizon 7 | undeclared 37 | likert 28; scenario 9 | likert-base 28; scenario-adjustment 9 | undeclared 37 | undeclared 37 | undeclared 37 | undeclared 37 |
| foundation-scoring-v1 | 44 | analyst 44; standard 20 | domesticFilters 21; institutions 25; normsIdentity 20; orderJustice 12; politicalEconomy 18; restraint 19; securityCompetition 18 | undeclared 44 | likert 22; miniCase 11; tradeoff 11 | legacy-score 44 | undeclared 44 | undeclared 44 | undeclared 44 | undeclared 44 |
| security-bank-v2 | 15 | analyst 15; standard 9 | activism 15; alliance 15; escalation 15; legitimacy 15 | alliances 5; deterrence 5; legitimacy 5 | case 15 | aggregate-and-card-type 14; card-type-only 1 | coalitionManager 6; developmental 1; exposedState 6; middlePowerHedging 5; protectionAuthority 4; rivalLogic 7 | undeclared 15 | alliance-manager 4; civilian-protection 1; cyber 1; deterrence 3; developmental 1; frontline-state 3; hedging 2; humanitarian 4; infrastructure 1; major-power 3; maritime 4; middle-power 4; nonaligned 4; nuclear 2; post-conflict 1; regional-order 3; regional-security 3; sanctions 2; small-state 1; transitional-justice 1; vulnerable-state 2 | low 6; medium 9 |
| security-bank-v3 | 15 | analyst 15; standard 9 | activism 8; alliance 8; escalation 7; legitimacy 6 | alliances 5; deterrence 5; legitimacy 5 | case 15 | aggregate-and-card-type 14; card-type-only 1 | coalitionManager 6; developmental 1; exposedState 6; middlePowerHedging 5; protectionAuthority 4; rivalLogic 7 | undeclared 15 | alliance-manager 4; civilian-protection 1; cyber 1; deterrence 3; developmental 1; frontline-state 3; hedging 2; humanitarian 4; infrastructure 1; major-power 3; maritime 4; middle-power 4; nonaligned 4; nuclear 2; post-conflict 1; regional-order 3; regional-security 3; sanctions 2; small-state 1; transitional-justice 1; vulnerable-state 2 | low 6; medium 9 |
| technology-bank-v2 | 15 | analyst 15; standard 9 | control 15; governance 15; industrial 15; safety 15 | capacity 5; controls 5; governance 5 | case 15 | aggregate-and-card-type 13; card-type-only 2 | coalitionManager 5; developmental 9; exposedState 3; middlePowerHedging 2; protectionAuthority 5; rivalLogic 4 | undeclared 15 | ai-governance 3; alliance-manager 3; dependency 3; developmental 8; digital-sovereignty 1; export-controls 2; incident-response 1; industrial 4; major-power 2; middle-income 3; middle-power 1; military 1; nonaligned 2; regulation 2; research 1; research-access 1; safety 4; state-capacity 6; subsidies 1; supply-chain 1 | low 6; medium 9 |

- **ai-governance-bank-v2:** Frozen V21 AI Governance bank. Discriminating axes were not declared in this version.
- **foundation-scoring-v1:** The frozen v1 scoring snapshot has no mode field. Non-an_ IDs are standard+analyst; an_ IDs are analyst-only, matching the v1 runtime.
- **security-bank-v2:** Frozen V21 module bank. Discriminating axes were not declared in this version.
- **security-bank-v3:** Frozen bank-v3/scorer-v2 module bank retained for replay compatibility.
- **technology-bank-v2:** Frozen V21 module bank. Discriminating axes were not declared in this version.

## Reverse-coded and scored-item shares

| Bank | Generation | Reverse / Likert | Reverse / any-scored Likert | Reverse / primary-scored Likert | Any-scored items | Primary-scored items | Reverse by mode | Reverse by axis | Primary-scored by mode |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ai-governance-bank-v2 | legacy | 28.6% (8/28) | 28.6% (8/28) | 28.6% (8/28) | 100.0% (37/37) | 100.0% (37/37) | analyst 28.6% (8/28); standard 50.0% (8/16) | deploymentPace 25.0% (1/4); geopolitics 33.3% (1/3); humanFuture 25.0% (1/4); legitimacy 25.0% (1/4); militaryRole 50.0% (1/2); openness 33.3% (1/3); oversight 20.0% (1/5); riskHorizon 33.3% (1/3) | analyst 100.0% (37/37); standard 100.0% (22/22) |
| ai-governance-bank-v3 | current | 53.6% (15/28) | 53.6% (15/28) | 53.6% (15/28) | 100.0% (37/37) | 100.0% (37/37) | analyst 53.6% (15/28); standard 50.0% (8/16) | deploymentPace 50.0% (2/4); geopolitics 66.7% (2/3); humanFuture 50.0% (2/4); legitimacy 50.0% (2/4); militaryRole 50.0% (1/2); openness 66.7% (2/3); oversight 40.0% (2/5); riskHorizon 66.7% (2/3) | analyst 100.0% (37/37); standard 100.0% (22/22) |
| foundation-bank-v2 | current | 37.0% (17/46) | 37.0% (17/46) | 44.1% (15/34) | 100.0% (68/68) | 82.4% (56/68) | analyst 37.0% (17/46); standard 11.5% (3/26) | domesticFilters 50.0% (2/4); institutions 40.0% (2/5); normsIdentity 40.0% (2/5); orderJustice 50.0% (2/4); politicalEconomy 40.0% (2/5); restraint 50.0% (2/4); securityCompetition 42.9% (3/7) | analyst 82.4% (56/68); standard 62.5% (20/32) |
| foundation-scoring-v1 | legacy | 13.6% (3/22) | 13.6% (3/22) | 13.6% (3/22) | 100.0% (44/44) | 100.0% (44/44) | analyst 13.6% (3/22); standard 7.1% (1/14) | domesticFilters 0.0% (0/2); institutions 25.0% (1/4); normsIdentity 0.0% (0/3); orderJustice 33.3% (1/3); politicalEconomy 25.0% (1/4); restraint 0.0% (0/2); securityCompetition 0.0% (0/4) | analyst 100.0% (44/44); standard 100.0% (20/20) |
| security-bank-v2 | legacy | n/a (0/0) | n/a (0/0) | n/a (0/0) | 100.0% (15/15) | 93.3% (14/15) | analyst n/a (0/0); standard n/a (0/0) | activism n/a (0/0); alliance n/a (0/0); escalation n/a (0/0); legitimacy n/a (0/0) | analyst 93.3% (14/15); standard 88.9% (8/9) |
| security-bank-v3 | legacy | n/a (0/0) | n/a (0/0) | n/a (0/0) | 100.0% (15/15) | 93.3% (14/15) | analyst n/a (0/0); standard n/a (0/0) | activism n/a (0/0); alliance n/a (0/0); escalation n/a (0/0); legitimacy n/a (0/0) | analyst 93.3% (14/15); standard 88.9% (8/9) |
| security-bank-v4 | current | n/a (0/0) | n/a (0/0) | n/a (0/0) | 100.0% (23/23) | 56.5% (13/23) | analyst n/a (0/0); standard n/a (0/0) | activism n/a (0/0); alliance n/a (0/0); escalation n/a (0/0); legitimacy n/a (0/0) | analyst 56.5% (13/23); standard 47.4% (9/19) |
| technology-bank-v2 | legacy | n/a (0/0) | n/a (0/0) | n/a (0/0) | 100.0% (15/15) | 86.7% (13/15) | analyst n/a (0/0); standard n/a (0/0) | control n/a (0/0); governance n/a (0/0); industrial n/a (0/0); safety n/a (0/0) | analyst 86.7% (13/15); standard 88.9% (8/9) |
| technology-bank-v3 | current | n/a (0/0) | n/a (0/0) | n/a (0/0) | 100.0% (15/15) | 86.7% (13/15) | analyst n/a (0/0); standard n/a (0/0) | control n/a (0/0); governance n/a (0/0); industrial n/a (0/0); safety n/a (0/0) | analyst 86.7% (13/15); standard 88.9% (8/9) |

## Option wording asymmetry

The JSON artifact contains every option and option-set distribution. This table identifies each bank's widest observed option-length spread and counts sets with unequal modal-verb or absolutism counts.

| Bank | Generation | Option sets | Widest word spread | Item / source | Modal-asymmetric sets | Absolutism-asymmetric sets |
| --- | --- | --- | --- | --- | --- | --- |
| ai-governance-bank-v2 | legacy | 15 | 10 | futureSociety / analystOptions | 7 | 5 |
| ai-governance-bank-v3 | current | 15 | 10 | futureSociety / analystOptions | 7 | 5 |
| foundation-bank-v2 | current | 22 | 13 | an_case_burdens / options | 12 | 8 |
| foundation-scoring-v1 | legacy | 22 | 0 | an_case_burdens / options | 0 | 0 |
| security-bank-v2 | legacy | 15 | 10 | iran_threshold / options | 14 | 1 |
| security-bank-v3 | legacy | 15 | 10 | iran_threshold / options | 14 | 1 |
| security-bank-v4 | current | 23 | 16 | iran_israel_gulf_thresholds / options | 18 | 3 |
| technology-bank-v2 | legacy | 15 | 8 | data_center_dependence / options | 14 | 9 |
| technology-bank-v3 | current | 15 | 10 | chips_controls / options | 15 | 8 |

### Repeated and near-duplicate option text

#### Current

Exact repeated groups: 0. Near-duplicate pairs: 0.

#### Legacy

Exact repeated groups: 16. Near-duplicate pairs: 20.

| Normalized text | Locations |
| --- | --- |
| allow limited protection if the killing is truly extreme limited action to stop it can still be defensible even without perfect consensus | security-bank-v2/atrocity_response/options/limited_protection_can_qualify; security-bank-v3/atrocity_response/options/limited_protection_can_qualify |
| build a long squeeze the stronger move is to wear down traffic insurers and political stamina over time rather than force one dramatic showdown | security-bank-v2/taiwan_quarantine/options/build_denial_endurance; security-bank-v3/taiwan_quarantine/options/build_denial_endurance |
| join coalitions case by case the most durable strategy is to join coalitions on specific problems without accepting whole of state alignment | security-bank-v2/middle_power_alignment/options/problem_based_coalitions; security-bank-v3/middle_power_alignment/options/problem_based_coalitions |
| keep regional states divided pressure works best if nearby states are not pushed into a fast hard anti china alignment | security-bank-v2/taiwan_quarantine/options/preserve_hedging_space; security-bank-v3/taiwan_quarantine/options/preserve_hedging_space |
| keep the legal bar high however terrible the case overriding sovereignty without durable grounding can damage order well beyond the crisis at hand | security-bank-v2/atrocity_response/options/legal_bar_remains_high; security-bank-v3/atrocity_response/options/legal_bar_remains_high |
| keep the pressure framed as law and politics economic and diplomatic pressure matters most if the operation still looks limited enough to avoid a wider military jump | security-bank-v2/taiwan_quarantine/options/raise_political_costs; security-bank-v3/taiwan_quarantine/options/raise_political_costs |
| make the line unmistakable the first job is to show that pressure below invasion can still change behavior before outside coalitions settle | security-bank-v2/taiwan_quarantine/options/clarify_response; security-bank-v3/taiwan_quarantine/options/clarify_response |
| make the promise visible a forward presence matters first because exposed allies need proof that any attack instantly widens the coalition | security-bank-v2/eastern_flank/options/make_the_promise_visible; security-bank-v3/eastern_flank/options/make_the_promise_visible |
| map resilience gaps the rival is exploiting repair redundancy and recovery weaknesses more than it is trying to trigger one dramatic showdown | security-bank-v2/gray_zone_sabotage/options/resilience_probe; security-bank-v3/gray_zone_sabotage/options/resilience_probe |
| raise the political cost through diplomacy iran gains more by widening the diplomatic and regional cost of further strikes than by chasing immediate military drama | security-bank-v2/shipping_attacks/options/anchor_in_regional_backing; security-bank-v3/shipping_attacks/options/anchor_in_regional_backing |
| restore deterrence visibly if the answer looks weak outside strikes and covert pressure may start to look low cost | security-bank-v2/shipping_attacks/options/punish_fast; security-bank-v3/shipping_attacks/options/punish_fast |
| separate security from the rest the state can deepen security ties where needed without turning trade finance and diplomacy into one bloc decision | security-bank-v2/middle_power_alignment/options/layered_alignment_is_real; security-bank-v3/middle_power_alignment/options/layered_alignment_is_real |
| test coalition fracture points the target is the political gap between partners with different thresholds for acting on incomplete evidence | security-bank-v2/gray_zone_sabotage/options/coalition_probe; security-bank-v3/gray_zone_sabotage/options/coalition_probe |
| test response thresholds the incidents are mainly testing whether ambiguity lets the rival impose costs without triggering a firm threshold response | security-bank-v2/gray_zone_sabotage/options/resolve_probe; security-bank-v3/gray_zone_sabotage/options/resolve_probe |
| treat autonomy as security from this position bargaining room is part of national security not a refusal to take threats seriously | security-bank-v2/middle_power_alignment/options/autonomy_is_rational; security-bank-v3/middle_power_alignment/options/autonomy_is_rational |
| use hard external backing without stronger outside balancing legal claims and coast guards will not offset material asymmetry for long | security-bank-v2/maritime_pressure/options/hard_external_backing; security-bank-v3/maritime_pressure/options/hard_external_backing |

| Similarity | Left | Right |
| --- | --- | --- |
| 0.972474 | security-bank-v2/aid_corridor/options/open_the_corridor | security-bank-v3/aid_corridor/options/open_the_corridor |
| 0.943456 | security-bank-v2/nuclear_hedging/options/restore_confidence_fast | security-bank-v3/nuclear_hedging/options/restore_confidence_fast |
| 0.933941 | security-bank-v2/atrocity_response/options/reduce_harm_without_widening | security-bank-v3/atrocity_response/options/reduce_harm_without_widening |
| 0.923311 | security-bank-v2/iran_threshold/options/threshold_is_a_leverage_problem | security-bank-v3/iran_threshold/options/threshold_is_a_leverage_problem |
| 0.919084 | security-bank-v2/patron_trust_gap/options/keep_it_issue_based | security-bank-v3/patron_trust_gap/options/keep_it_issue_based |
| 0.916667 | security-bank-v2/aid_corridor/options/seek_regional_cover | security-bank-v3/aid_corridor/options/seek_regional_cover |
| 0.890876 | security-bank-v2/patron_trust_gap/options/lock_in_guarantee | security-bank-v3/patron_trust_gap/options/lock_in_guarantee |
| 0.886941 | security-bank-v2/beijing_below_war/options/split_coalition | security-bank-v3/beijing_below_war/options/split_coalition |
| 0.883121 | security-bank-v2/eastern_flank/options/prioritize_local_denial | security-bank-v3/eastern_flank/options/prioritize_local_denial |
| 0.880054 | security-bank-v2/maritime_pressure/options/multilateralize_pressure | security-bank-v3/maritime_pressure/options/multilateralize_pressure |
| 0.87936 | security-bank-v2/selective_enforcement_memory/options/burden_is_asymmetric | security-bank-v3/selective_enforcement_memory/options/burden_is_asymmetric |
| 0.878472 | security-bank-v2/eastern_flank/options/pair_reassurance_with_limits | security-bank-v3/eastern_flank/options/pair_reassurance_with_limits |
| 0.878 | security-bank-v2/aid_corridor/options/secure_authority_first | security-bank-v3/aid_corridor/options/secure_authority_first |
| 0.861984 | security-bank-v2/shipping_attacks/options/keep_a_ceiling | security-bank-v3/shipping_attacks/options/keep_a_ceiling |
| 0.858195 | security-bank-v2/aid_corridor/options/intensify_indirect_pressure | security-bank-v3/aid_corridor/options/intensify_indirect_pressure |
| 0.856818 | security-bank-v2/gray_zone_sabotage/options/bait_for_escalation | security-bank-v3/gray_zone_sabotage/options/bait_for_escalation |
| 0.850083 | security-bank-v2/selective_enforcement_memory/options/selective_force_is_the_issue | security-bank-v3/selective_enforcement_memory/options/selective_force_is_the_issue |
| 0.848485 | security-bank-v2/iran_threshold/options/threshold_is_a_coalition_problem | security-bank-v3/iran_threshold/options/threshold_is_a_coalition_problem |
| 0.848485 | security-bank-v2/sanctions_enforcement/options/resistance_is_about_legal_grounding | security-bank-v3/sanctions_enforcement/options/resistance_is_about_legal_grounding |
| 0.84613 | security-bank-v2/iran_threshold/options/threshold_is_a_containment_problem | security-bank-v3/iran_threshold/options/threshold_is_a_containment_problem |

## Declared-axis midpoint/range gate

The Foundation bank is outside this gate because it does not declare item-level discriminating axes under the current instrument contract.

For every declared axis in every effective option set, the authored gate checks only:

- at least one signal strictly below the policy midpoint;
- at least one signal strictly above the policy midpoint; and
- total range at least the authored minimum.

An item appears in the failure column when any declared axis in any effective option set fails midpoint straddle or minimum range. Passing does not establish validity, reliability, or psychometric discrimination.

| Bank | Generation | Policy | Reviewed items | Items failing midpoint-straddle or minimum-range requirements |
| --- | --- | --- | --- | --- |
| ai-governance-bank-v2 | legacy | not declared / not applicable | 0 | none |
| ai-governance-bank-v3 | current | midpoint 0; minimum range 0.5 | 37 | none |
| foundation-bank-v2 | current | not declared / not applicable | 0 | none |
| foundation-scoring-v1 | legacy | not declared / not applicable | 0 | none |
| security-bank-v2 | legacy | not declared / not applicable | 0 | none |
| security-bank-v3 | legacy | midpoint 4; minimum range 2 | 15 | none |
| security-bank-v4 | current | midpoint 4; minimum range 2 | 23 | none |
| technology-bank-v2 | legacy | not declared / not applicable | 0 | none |
| technology-bank-v3 | current | midpoint 4; minimum range 2 | 15 | none |

### Descriptive declared-axis option geometry

Missing signals are counted explicitly and use the policy midpoint for the gate and geometry summaries. Duplicate signal values count options beyond the first occurrence of each exact value. Sole minimum/maximum flags identify whether one option alone occupies that extreme. These are non-blocking review aids.

| Bank | Generation | Item | Effective option set | Axis | Options | Distinct signal values | Non-midpoint options | Missing signals | Duplicate signal values | Sole minimum | Sole maximum | Midpoint/range gate |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ai-governance-bank-v3 | current | capabilityThreshold | analystOptions (analyst) | riskHorizon | 4 | 3 | 2 | 2 | 1 | yes | yes | passes |
| ai-governance-bank-v3 | current | capabilityThreshold | analystOptions (analyst) | deploymentPace | 4 | 4 | 3 | 1 | 0 | yes | yes | passes |
| ai-governance-bank-v3 | current | capabilityThreshold | analystOptions (analyst) | oversight | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| ai-governance-bank-v3 | current | capabilityThreshold | options (standard) | riskHorizon | 3 | 3 | 3 | 0 | 0 | yes | yes | passes |
| ai-governance-bank-v3 | current | capabilityThreshold | options (standard) | deploymentPace | 3 | 3 | 3 | 0 | 0 | yes | yes | passes |
| ai-governance-bank-v3 | current | capabilityThreshold | options (standard) | oversight | 3 | 3 | 3 | 0 | 0 | yes | yes | passes |
| ai-governance-bank-v3 | current | rivalBreakthrough | analystOptions (analyst) | deploymentPace | 4 | 4 | 3 | 1 | 0 | yes | yes | passes |
| ai-governance-bank-v3 | current | rivalBreakthrough | analystOptions (analyst) | geopolitics | 4 | 4 | 3 | 0 | 0 | yes | yes | passes |
| ai-governance-bank-v3 | current | rivalBreakthrough | analystOptions (analyst) | militaryRole | 4 | 4 | 3 | 1 | 0 | yes | yes | passes |
| ai-governance-bank-v3 | current | rivalBreakthrough | analystOptions (analyst) | legitimacy | 4 | 4 | 3 | 1 | 0 | yes | yes | passes |
| ai-governance-bank-v3 | current | rivalBreakthrough | options (standard) | deploymentPace | 3 | 3 | 3 | 0 | 0 | yes | yes | passes |
| ai-governance-bank-v3 | current | rivalBreakthrough | options (standard) | geopolitics | 3 | 3 | 2 | 0 | 0 | yes | yes | passes |
| ai-governance-bank-v3 | current | rivalBreakthrough | options (standard) | militaryRole | 3 | 3 | 3 | 0 | 0 | yes | yes | passes |
| ai-governance-bank-v3 | current | rivalBreakthrough | options (standard) | legitimacy | 3 | 3 | 2 | 1 | 0 | yes | yes | passes |
| ai-governance-bank-v3 | current | openWeights | analystOptions (analyst) | oversight | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| ai-governance-bank-v3 | current | openWeights | analystOptions (analyst) | openness | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| ai-governance-bank-v3 | current | openWeights | options (standard) | oversight | 3 | 3 | 3 | 0 | 0 | yes | yes | passes |
| ai-governance-bank-v3 | current | openWeights | options (standard) | openness | 3 | 3 | 3 | 0 | 0 | yes | yes | passes |
| ai-governance-bank-v3 | current | militaryIntegration | analystOptions (analyst) | deploymentPace | 4 | 4 | 3 | 1 | 0 | yes | yes | passes |
| ai-governance-bank-v3 | current | militaryIntegration | analystOptions (analyst) | geopolitics | 4 | 4 | 3 | 1 | 0 | yes | yes | passes |
| ai-governance-bank-v3 | current | militaryIntegration | analystOptions (analyst) | militaryRole | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| ai-governance-bank-v3 | current | militaryIntegration | options (standard) | deploymentPace | 3 | 3 | 3 | 0 | 0 | yes | yes | passes |
| ai-governance-bank-v3 | current | militaryIntegration | options (standard) | geopolitics | 3 | 3 | 2 | 1 | 0 | yes | yes | passes |
| ai-governance-bank-v3 | current | militaryIntegration | options (standard) | militaryRole | 3 | 3 | 3 | 0 | 0 | yes | yes | passes |
| ai-governance-bank-v3 | current | multilateralVerification | analystOptions (analyst) | oversight | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| ai-governance-bank-v3 | current | multilateralVerification | analystOptions (analyst) | geopolitics | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| ai-governance-bank-v3 | current | multilateralVerification | analystOptions (analyst) | legitimacy | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| ai-governance-bank-v3 | current | multilateralVerification | options (standard) | oversight | 3 | 3 | 3 | 0 | 0 | yes | yes | passes |
| ai-governance-bank-v3 | current | multilateralVerification | options (standard) | geopolitics | 3 | 3 | 3 | 0 | 0 | yes | yes | passes |
| ai-governance-bank-v3 | current | multilateralVerification | options (standard) | legitimacy | 3 | 3 | 3 | 0 | 0 | yes | yes | passes |
| ai-governance-bank-v3 | current | futureSociety | analystOptions (analyst) | deploymentPace | 4 | 4 | 3 | 1 | 0 | yes | yes | passes |
| ai-governance-bank-v3 | current | futureSociety | analystOptions (analyst) | legitimacy | 4 | 3 | 2 | 2 | 1 | yes | yes | passes |
| ai-governance-bank-v3 | current | futureSociety | analystOptions (analyst) | humanFuture | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| ai-governance-bank-v3 | current | futureSociety | options (standard) | deploymentPace | 3 | 3 | 2 | 1 | 0 | yes | yes | passes |
| ai-governance-bank-v3 | current | futureSociety | options (standard) | legitimacy | 3 | 3 | 2 | 1 | 0 | yes | yes | passes |
| ai-governance-bank-v3 | current | futureSociety | options (standard) | humanFuture | 3 | 3 | 3 | 0 | 0 | yes | yes | passes |
| ai-governance-bank-v3 | current | auditIncidentRegime | analystOptions (analyst) | deploymentPace | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| ai-governance-bank-v3 | current | auditIncidentRegime | analystOptions (analyst) | oversight | 4 | 3 | 4 | 0 | 1 | yes | no | passes |
| ai-governance-bank-v3 | current | auditIncidentRegime | analystOptions (analyst) | legitimacy | 4 | 4 | 3 | 1 | 0 | yes | yes | passes |
| ai-governance-bank-v3 | current | computeGovernance | analystOptions (analyst) | oversight | 4 | 3 | 4 | 0 | 1 | no | yes | passes |
| ai-governance-bank-v3 | current | computeGovernance | analystOptions (analyst) | geopolitics | 4 | 3 | 2 | 2 | 1 | yes | yes | passes |
| ai-governance-bank-v3 | current | computeGovernance | analystOptions (analyst) | openness | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| ai-governance-bank-v3 | current | computeGovernance | analystOptions (analyst) | legitimacy | 4 | 4 | 3 | 1 | 0 | yes | yes | passes |
| ai-governance-bank-v3 | current | criticalInfrastructure | analystOptions (analyst) | deploymentPace | 4 | 3 | 4 | 0 | 1 | yes | yes | passes |
| ai-governance-bank-v3 | current | criticalInfrastructure | analystOptions (analyst) | oversight | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| ai-governance-bank-v3 | current | criticalInfrastructure | analystOptions (analyst) | legitimacy | 4 | 4 | 3 | 1 | 0 | yes | yes | passes |
| security-bank-v3 | legacy | taiwan_quarantine | options (standard, analyst) | activism | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v3 | legacy | taiwan_quarantine | options (standard, analyst) | escalation | 4 | 4 | 3 | 0 | 0 | yes | yes | passes |
| security-bank-v3 | legacy | taiwan_quarantine | options (standard, analyst) | alliance | 4 | 3 | 4 | 0 | 1 | yes | yes | passes |
| security-bank-v3 | legacy | gray_zone_sabotage | options (standard, analyst) | activism | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v3 | legacy | gray_zone_sabotage | options (standard, analyst) | escalation | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v3 | legacy | shipping_attacks | options (standard, analyst) | activism | 4 | 4 | 3 | 0 | 0 | yes | yes | passes |
| security-bank-v3 | legacy | shipping_attacks | options (standard, analyst) | escalation | 4 | 4 | 3 | 0 | 0 | yes | yes | passes |
| security-bank-v3 | legacy | eastern_flank | options (standard, analyst) | activism | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v3 | legacy | eastern_flank | options (standard, analyst) | escalation | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v3 | legacy | eastern_flank | options (standard, analyst) | alliance | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v3 | legacy | maritime_pressure | options (standard, analyst) | alliance | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v3 | legacy | maritime_pressure | options (standard, analyst) | legitimacy | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v3 | legacy | middle_power_alignment | options (standard, analyst) | alliance | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v3 | legacy | atrocity_response | options (standard, analyst) | activism | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v3 | legacy | atrocity_response | options (standard, analyst) | legitimacy | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v3 | legacy | aid_corridor | options (standard, analyst) | activism | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v3 | legacy | aid_corridor | options (standard, analyst) | legitimacy | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v3 | legacy | ceasefire_accountability | options (standard, analyst) | legitimacy | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v3 | legacy | iran_threshold | options (analyst) | activism | 4 | 4 | 3 | 0 | 0 | yes | yes | passes |
| security-bank-v3 | legacy | iran_threshold | options (analyst) | escalation | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v3 | legacy | beijing_below_war | options (analyst) | activism | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v3 | legacy | beijing_below_war | options (analyst) | escalation | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v3 | legacy | nuclear_hedging | options (analyst) | escalation | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v3 | legacy | nuclear_hedging | options (analyst) | alliance | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v3 | legacy | patron_trust_gap | options (analyst) | alliance | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v3 | legacy | sanctions_enforcement | options (analyst) | alliance | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v3 | legacy | sanctions_enforcement | options (analyst) | legitimacy | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v3 | legacy | selective_enforcement_memory | options (analyst) | alliance | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v3 | legacy | selective_enforcement_memory | options (analyst) | legitimacy | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v4 | current | gray_zone_sabotage | options (standard, analyst) | activism | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v4 | current | gray_zone_sabotage | options (standard, analyst) | escalation | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v4 | current | eastern_flank | options (standard, analyst) | activism | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v4 | current | eastern_flank | options (standard, analyst) | escalation | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v4 | current | eastern_flank | options (standard, analyst) | alliance | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v4 | current | maritime_pressure | options (standard, analyst) | alliance | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v4 | current | maritime_pressure | options (standard, analyst) | legitimacy | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v4 | current | middle_power_alignment | options (standard, analyst) | alliance | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v4 | current | atrocity_response | options (standard, analyst) | activism | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v4 | current | atrocity_response | options (standard, analyst) | legitimacy | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v4 | current | aid_corridor | options (standard, analyst) | activism | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v4 | current | aid_corridor | options (standard, analyst) | legitimacy | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v4 | current | ceasefire_accountability | options (standard, analyst) | legitimacy | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v4 | current | nuclear_hedging | options (analyst) | escalation | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v4 | current | nuclear_hedging | options (analyst) | alliance | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v4 | current | patron_trust_gap | options (analyst) | alliance | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v4 | current | sanctions_enforcement | options (analyst) | alliance | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v4 | current | sanctions_enforcement | options (analyst) | legitimacy | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v4 | current | selective_enforcement_memory | options (analyst) | alliance | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v4 | current | selective_enforcement_memory | options (analyst) | legitimacy | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v4 | current | taiwan_inspection_regime_core | options (standard, analyst) | activism | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v4 | current | taiwan_inspection_regime_core | options (standard, analyst) | escalation | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v4 | current | taiwan_inspection_regime_core | options (standard, analyst) | alliance | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v4 | current | taiwan_beijing_instrument | options (standard, analyst) | activism | 4 | 4 | 3 | 0 | 0 | yes | yes | passes |
| security-bank-v4 | current | taiwan_beijing_instrument | options (standard, analyst) | escalation | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v4 | current | taiwan_taipei_continuity | options (standard, analyst) | activism | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v4 | current | taiwan_taipei_continuity | options (standard, analyst) | escalation | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v4 | current | taiwan_taipei_continuity | options (standard, analyst) | alliance | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v4 | current | taiwan_washington_coalition | options (standard, analyst) | escalation | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v4 | current | taiwan_washington_coalition | options (standard, analyst) | alliance | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v4 | current | iran_ceasefire_core | options (standard, analyst) | activism | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v4 | current | iran_ceasefire_core | options (standard, analyst) | escalation | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v4 | current | iran_ceasefire_core | options (standard, analyst) | alliance | 4 | 4 | 3 | 0 | 0 | yes | yes | passes |
| security-bank-v4 | current | iran_ceasefire_core | options (standard, analyst) | legitimacy | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v4 | current | iran_tehran_leverage | options (standard, analyst) | activism | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v4 | current | iran_tehran_leverage | options (standard, analyst) | escalation | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v4 | current | iran_israel_gulf_thresholds | options (standard, analyst) | escalation | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v4 | current | iran_israel_gulf_thresholds | options (standard, analyst) | alliance | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v4 | current | iran_mediator_navigation | options (standard, analyst) | escalation | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v4 | current | iran_mediator_navigation | options (standard, analyst) | legitimacy | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v4 | current | ukraine_ceasefire_stall | options (standard, analyst) | activism | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v4 | current | ukraine_ceasefire_stall | options (standard, analyst) | escalation | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v4 | current | ukraine_kyiv_security_architecture | options (standard, analyst) | activism | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v4 | current | ukraine_kyiv_security_architecture | options (standard, analyst) | escalation | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v4 | current | ukraine_kyiv_security_architecture | options (standard, analyst) | alliance | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v4 | current | ukraine_moscow_bargaining_tradeoff | options (standard, analyst) | activism | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v4 | current | ukraine_moscow_bargaining_tradeoff | options (standard, analyst) | escalation | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v4 | current | ukraine_external_division_of_labor | options (standard, analyst) | escalation | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v4 | current | ukraine_external_division_of_labor | options (standard, analyst) | alliance | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| security-bank-v4 | current | ukraine_external_division_of_labor | options (standard, analyst) | legitimacy | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| technology-bank-v3 | current | chips_controls | options (standard, analyst) | control | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| technology-bank-v3 | current | chips_controls | options (standard, analyst) | governance | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| technology-bank-v3 | current | open_weight_models | options (standard, analyst) | control | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| technology-bank-v3 | current | open_weight_models | options (standard, analyst) | safety | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| technology-bank-v3 | current | sovereign_stacks | options (standard, analyst) | control | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| technology-bank-v3 | current | sovereign_stacks | options (standard, analyst) | governance | 4 | 4 | 3 | 0 | 0 | yes | yes | passes |
| technology-bank-v3 | current | sovereign_stacks | options (standard, analyst) | industrial | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| technology-bank-v3 | current | fab_resilience | options (standard, analyst) | control | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| technology-bank-v3 | current | fab_resilience | options (standard, analyst) | governance | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| technology-bank-v3 | current | fab_resilience | options (standard, analyst) | industrial | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| technology-bank-v3 | current | industrial_policy | options (standard, analyst) | control | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| technology-bank-v3 | current | industrial_policy | options (standard, analyst) | governance | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| technology-bank-v3 | current | industrial_policy | options (standard, analyst) | industrial | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| technology-bank-v3 | current | public_compute | options (standard, analyst) | governance | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| technology-bank-v3 | current | public_compute | options (standard, analyst) | industrial | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| technology-bank-v3 | current | public_compute | options (standard, analyst) | safety | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| technology-bank-v3 | current | frontier_ai_governance | options (standard, analyst) | control | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| technology-bank-v3 | current | frontier_ai_governance | options (standard, analyst) | governance | 4 | 4 | 3 | 0 | 0 | yes | yes | passes |
| technology-bank-v3 | current | frontier_ai_governance | options (standard, analyst) | safety | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| technology-bank-v3 | current | military_ai | options (standard, analyst) | governance | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| technology-bank-v3 | current | military_ai | options (standard, analyst) | safety | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| technology-bank-v3 | current | digital_development | options (standard, analyst) | control | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| technology-bank-v3 | current | digital_development | options (standard, analyst) | governance | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| technology-bank-v3 | current | containment_critique | options (analyst) | control | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| technology-bank-v3 | current | containment_critique | options (analyst) | governance | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| technology-bank-v3 | current | data_center_dependence | options (analyst) | control | 4 | 4 | 3 | 0 | 0 | yes | yes | passes |
| technology-bank-v3 | current | data_center_dependence | options (analyst) | governance | 4 | 4 | 3 | 0 | 0 | yes | yes | passes |
| technology-bank-v3 | current | subsidy_race | options (analyst) | governance | 4 | 4 | 3 | 0 | 0 | yes | yes | passes |
| technology-bank-v3 | current | subsidy_race | options (analyst) | industrial | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| technology-bank-v3 | current | regional_public_compute | options (analyst) | control | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| technology-bank-v3 | current | regional_public_compute | options (analyst) | governance | 4 | 4 | 3 | 0 | 0 | yes | yes | passes |
| technology-bank-v3 | current | regional_public_compute | options (analyst) | industrial | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| technology-bank-v3 | current | incident_reporting | options (analyst) | control | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| technology-bank-v3 | current | incident_reporting | options (analyst) | governance | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| technology-bank-v3 | current | ai_standards_voice | options (analyst) | governance | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |
| technology-bank-v3 | current | ai_standards_voice | options (analyst) | safety | 4 | 4 | 4 | 0 | 0 | yes | yes | passes |

### Duplicate complete option vectors

Complete vectors cover every axis in the instrument axis universe; missing components use the policy midpoint. Exact duplicate groups are reported descriptively and do not create a new gate.

| Bank | Generation | Item | Effective option set | Duplicate complete-vector groups |
| --- | --- | --- | --- | --- |
| ai-governance-bank-v3 | current | capabilityThreshold | analystOptions (analyst) | none |
| ai-governance-bank-v3 | current | capabilityThreshold | options (standard) | none |
| ai-governance-bank-v3 | current | rivalBreakthrough | analystOptions (analyst) | none |
| ai-governance-bank-v3 | current | rivalBreakthrough | options (standard) | none |
| ai-governance-bank-v3 | current | openWeights | analystOptions (analyst) | none |
| ai-governance-bank-v3 | current | openWeights | options (standard) | none |
| ai-governance-bank-v3 | current | militaryIntegration | analystOptions (analyst) | none |
| ai-governance-bank-v3 | current | militaryIntegration | options (standard) | none |
| ai-governance-bank-v3 | current | multilateralVerification | analystOptions (analyst) | none |
| ai-governance-bank-v3 | current | multilateralVerification | options (standard) | none |
| ai-governance-bank-v3 | current | futureSociety | analystOptions (analyst) | none |
| ai-governance-bank-v3 | current | futureSociety | options (standard) | none |
| ai-governance-bank-v3 | current | auditIncidentRegime | analystOptions (analyst) | none |
| ai-governance-bank-v3 | current | computeGovernance | analystOptions (analyst) | none |
| ai-governance-bank-v3 | current | criticalInfrastructure | analystOptions (analyst) | none |
| security-bank-v3 | legacy | taiwan_quarantine | options (standard, analyst) | none |
| security-bank-v3 | legacy | gray_zone_sabotage | options (standard, analyst) | none |
| security-bank-v3 | legacy | shipping_attacks | options (standard, analyst) | none |
| security-bank-v3 | legacy | eastern_flank | options (standard, analyst) | none |
| security-bank-v3 | legacy | maritime_pressure | options (standard, analyst) | none |
| security-bank-v3 | legacy | middle_power_alignment | options (standard, analyst) | none |
| security-bank-v3 | legacy | atrocity_response | options (standard, analyst) | none |
| security-bank-v3 | legacy | aid_corridor | options (standard, analyst) | none |
| security-bank-v3 | legacy | ceasefire_accountability | options (standard, analyst) | none |
| security-bank-v3 | legacy | iran_threshold | options (analyst) | none |
| security-bank-v3 | legacy | beijing_below_war | options (analyst) | none |
| security-bank-v3 | legacy | nuclear_hedging | options (analyst) | none |
| security-bank-v3 | legacy | patron_trust_gap | options (analyst) | none |
| security-bank-v3 | legacy | sanctions_enforcement | options (analyst) | none |
| security-bank-v3 | legacy | selective_enforcement_memory | options (analyst) | none |
| security-bank-v4 | current | gray_zone_sabotage | options (standard, analyst) | none |
| security-bank-v4 | current | eastern_flank | options (standard, analyst) | none |
| security-bank-v4 | current | maritime_pressure | options (standard, analyst) | none |
| security-bank-v4 | current | middle_power_alignment | options (standard, analyst) | none |
| security-bank-v4 | current | atrocity_response | options (standard, analyst) | none |
| security-bank-v4 | current | aid_corridor | options (standard, analyst) | none |
| security-bank-v4 | current | ceasefire_accountability | options (standard, analyst) | none |
| security-bank-v4 | current | nuclear_hedging | options (analyst) | none |
| security-bank-v4 | current | patron_trust_gap | options (analyst) | none |
| security-bank-v4 | current | sanctions_enforcement | options (analyst) | none |
| security-bank-v4 | current | selective_enforcement_memory | options (analyst) | none |
| security-bank-v4 | current | taiwan_inspection_regime_core | options (standard, analyst) | none |
| security-bank-v4 | current | taiwan_beijing_instrument | options (standard, analyst) | none |
| security-bank-v4 | current | taiwan_taipei_continuity | options (standard, analyst) | none |
| security-bank-v4 | current | taiwan_washington_coalition | options (standard, analyst) | none |
| security-bank-v4 | current | iran_ceasefire_core | options (standard, analyst) | none |
| security-bank-v4 | current | iran_tehran_leverage | options (standard, analyst) | none |
| security-bank-v4 | current | iran_israel_gulf_thresholds | options (standard, analyst) | none |
| security-bank-v4 | current | iran_mediator_navigation | options (standard, analyst) | none |
| security-bank-v4 | current | ukraine_ceasefire_stall | options (standard, analyst) | none |
| security-bank-v4 | current | ukraine_kyiv_security_architecture | options (standard, analyst) | none |
| security-bank-v4 | current | ukraine_moscow_bargaining_tradeoff | options (standard, analyst) | none |
| security-bank-v4 | current | ukraine_external_division_of_labor | options (standard, analyst) | none |
| technology-bank-v3 | current | chips_controls | options (standard, analyst) | none |
| technology-bank-v3 | current | open_weight_models | options (standard, analyst) | none |
| technology-bank-v3 | current | sovereign_stacks | options (standard, analyst) | none |
| technology-bank-v3 | current | fab_resilience | options (standard, analyst) | none |
| technology-bank-v3 | current | industrial_policy | options (standard, analyst) | none |
| technology-bank-v3 | current | public_compute | options (standard, analyst) | none |
| technology-bank-v3 | current | frontier_ai_governance | options (standard, analyst) | none |
| technology-bank-v3 | current | military_ai | options (standard, analyst) | none |
| technology-bank-v3 | current | digital_development | options (standard, analyst) | none |
| technology-bank-v3 | current | containment_critique | options (analyst) | none |
| technology-bank-v3 | current | data_center_dependence | options (analyst) | none |
| technology-bank-v3 | current | subsidy_race | options (analyst) | none |
| technology-bank-v3 | current | regional_public_compute | options (analyst) | none |
| technology-bank-v3 | current | incident_reporting | options (analyst) | none |
| technology-bank-v3 | current | ai_standards_voice | options (analyst) | none |

## Actor, theater, tag, and knowledge-load concentration

Shares are raw item coverage for review, not population estimates or pass/fail gates.

| Bank | Generation | Actor-role leader | Actor undeclared | Theater leader | Theater undeclared | Perspective-tag leader | Knowledge-load leader |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ai-governance-bank-v2 | legacy | undeclared 37 (100.0%) | 37/37 | undeclared 37 (100.0%) | 37/37 | undeclared 37 (100.0%) | undeclared 37 (100.0%) |
| ai-governance-bank-v3 | current | undeclared 37 (100.0%) | 37/37 | undeclared 37 (100.0%) | 37/37 | undeclared 37 (100.0%) | undeclared 37 (100.0%) |
| foundation-bank-v2 | current | undeclared 68 (100.0%) | 68/68 | undeclared 68 (100.0%) | 68/68 | undeclared 68 (100.0%) | undeclared 68 (100.0%) |
| foundation-scoring-v1 | legacy | undeclared 44 (100.0%) | 44/44 | undeclared 44 (100.0%) | 44/44 | undeclared 44 (100.0%) | undeclared 44 (100.0%) |
| security-bank-v2 | legacy | rivalLogic 7 (46.7%) | 0/15 | undeclared 15 (100.0%) | 15/15 | alliance-manager, humanitarian, maritime, middle-power, nonaligned 4 (26.7%) | medium 9 (60.0%) |
| security-bank-v3 | legacy | rivalLogic 7 (46.7%) | 0/15 | undeclared 15 (100.0%) | 15/15 | alliance-manager, humanitarian, maritime, middle-power, nonaligned 4 (26.7%) | medium 9 (60.0%) |
| security-bank-v4 | current | rivalLogic 13 (56.5%) | 0/23 | undeclared 23 (100.0%) | 23/23 | deterrence 9 (39.1%) | medium 14 (60.9%) |
| technology-bank-v2 | legacy | developmental 9 (60.0%) | 0/15 | undeclared 15 (100.0%) | 15/15 | developmental 8 (53.3%) | medium 9 (60.0%) |
| technology-bank-v3 | current | developmental 9 (60.0%) | 0/15 | undeclared 15 (100.0%) | 15/15 | developmental 8 (53.3%) | medium 9 (60.0%) |

## Response-style results

These rows come from deterministic mechanical fixtures; no human respondent data is used. They test scorer behavior under constructed answer patterns. They do not establish validity, reliability, prevalence, or representativeness.

| Instrument tuple | Generation | Fixture | Outcome | Score range |
| --- | --- | --- | --- | --- |
| ai-governance:b2:s1:analyst | legacy | all-maximum | precautionarySteward / Frontier-risk first / Precaution-first / Competition-first | 6.70–7.00 |
| ai-governance:b2:s1:analyst | legacy | all-minimum | openEcosystemBuilder / Present-harms first / Deployment-first / Coordination-first | 1.00–2.30 |
| ai-governance:b2:s1:analyst | legacy | alternating | openEcosystemBuilder / Present-harms first / Deployment-first / Competitive hedger | 1.10–6.00 |
| ai-governance:b2:s1:analyst | legacy | always-first | democraticGuardrailist / Mixed risk lens / Deployment-first / Competitive hedger | 3.20–6.70 |
| ai-governance:b2:s1:analyst | legacy | always-last | openEcosystemBuilder / Present-harms first / Deployment-first / Competition-first | 1.80–6.00 |
| ai-governance:b2:s1:analyst | legacy | midpoint | democraticGuardrailist / Mixed risk lens / Deployment-first / Competitive hedger | 3.50–5.70 |
| ai-governance:b2:s1:analyst | legacy | seeded-random-20260728 | democraticGuardrailist / Mixed risk lens / Precaution-first / Competitive hedger | 3.40–6.80 |
| ai-governance:b2:s1:standard | legacy | all-maximum | precautionarySteward / Frontier-risk first / Precaution-first / Competition-first | 6.40–7.00 |
| ai-governance:b2:s1:standard | legacy | all-minimum | openEcosystemBuilder / Present-harms first / Deployment-first / Coordination-first | 1.00–1.80 |
| ai-governance:b2:s1:standard | legacy | alternating | democraticGuardrailist / Mixed risk lens / Threshold guardrails / Competitive hedger | 2.80–5.10 |
| ai-governance:b2:s1:standard | legacy | always-first | democraticGuardrailist / Mixed risk lens / Threshold guardrails / Competitive hedger | 2.90–4.90 |
| ai-governance:b2:s1:standard | legacy | always-last | democraticGuardrailist / Present-harms first / Deployment-first / Competitive hedger | 3.30–5.40 |
| ai-governance:b2:s1:standard | legacy | midpoint | democraticGuardrailist / Mixed risk lens / Threshold guardrails / Coordination-first | 3.70–5.60 |
| ai-governance:b2:s1:standard | legacy | seeded-random-20260728 | precautionarySteward / Present-harms first / Precaution-first / Coordination-first | 3.20–7.00 |
| ai-governance:b3:s2:analyst | current | all-maximum | precautionarySteward / Frontier-risk first / Precaution-first / Competition-first | 6.40–7.00 |
| ai-governance:b3:s2:analyst | current | all-minimum | openEcosystemBuilder / Present-harms first / Deployment-first / Coordination-first | 1.00–1.90 |
| ai-governance:b3:s2:analyst | current | alternating | openEcosystemBuilder / Present-harms first / Deployment-first / Competitive hedger | 1.10–5.20 |
| ai-governance:b3:s2:analyst | current | always-first | stateCapacityBuilder / Mixed risk lens / Deployment-first / Competitive hedger | 3.20–6.70 |
| ai-governance:b3:s2:analyst | current | always-last | openEcosystemBuilder / Present-harms first / Deployment-first / Competitive hedger | 1.30–5.40 |
| ai-governance:b3:s2:analyst | current | midpoint | democraticGuardrailist / Mixed risk lens / Threshold guardrails / Competitive hedger | 3.60–6.50 |
| ai-governance:b3:s2:analyst | current | seeded-random-20260728 | precautionarySteward / Mixed risk lens / Precaution-first / Coordination-first | 2.53–5.90 |
| ai-governance:b3:s2:standard | current | all-maximum | precautionarySteward / Frontier-risk first / Precaution-first / Competition-first | 6.40–7.00 |
| ai-governance:b3:s2:standard | current | all-minimum | openEcosystemBuilder / Present-harms first / Deployment-first / Coordination-first | 1.00–1.40 |
| ai-governance:b3:s2:standard | current | alternating | coordinationArchitect / Mixed risk lens / Threshold guardrails / Competitive hedger | 2.80–5.10 |
| ai-governance:b3:s2:standard | current | always-first | openEcosystemBuilder / Mixed risk lens / Threshold guardrails / Competitive hedger | 2.60–4.70 |
| ai-governance:b3:s2:standard | current | always-last | democraticGuardrailist / Present-harms first / Deployment-first / Competitive hedger | 3.30–5.20 |
| ai-governance:b3:s2:standard | current | midpoint | stateCapacityBuilder / Mixed risk lens / Deployment-first / Competitive hedger | 3.80–5.90 |
| ai-governance:b3:s2:standard | current | seeded-random-20260728 | precautionarySteward / Present-harms first / Precaution-first / Coordination-first | 2.70–7.00 |
| foundation:bna:s1:analyst | legacy | all-maximum | institutionalist / Restrainer / Pluralist | 5.26–6.36 |
| foundation:bna:s1:analyst | legacy | all-minimum | realist / Maximizer / Universalist | 2.08–4.68 |
| foundation:bna:s1:analyst | legacy | alternating | institutionalist / Hedger / Conditional Solidarist | 4.26–5.08 |
| foundation:bna:s1:analyst | legacy | always-first | institutionalist / Hedger / Conditional Solidarist | 4.33–5.12 |
| foundation:bna:s1:analyst | legacy | always-last | institutionalist / Hedger / Conditional Solidarist | 4.32–5.21 |
| foundation:bna:s1:analyst | legacy | midpoint | institutionalist / Hedger / Universalist | 3.31–4.76 |
| foundation:bna:s1:analyst | legacy | seeded-random-20260728 | institutionalist / Hedger / Conditional Solidarist | 4.21–5.74 |
| foundation:bna:s1:standard | legacy | all-maximum | institutionalist / Restrainer / Pluralist | 5.33–7.00 |
| foundation:bna:s1:standard | legacy | all-minimum | realist / Maximizer / Universalist | 1.00–4.22 |
| foundation:bna:s1:standard | legacy | alternating | institutionalist / Maximizer / Universalist | 3.67–4.90 |
| foundation:bna:s1:standard | legacy | always-first | constructivist / Hedger / Conditional Solidarist | 4.12–4.80 |
| foundation:bna:s1:standard | legacy | always-last | institutionalist / Hedger / Universalist | 3.67–5.13 |
| foundation:bna:s1:standard | legacy | midpoint | institutionalist / Hedger / Universalist | 3.17–5.06 |
| foundation:bna:s1:standard | legacy | seeded-random-20260728 | institutionalist / Hedger / Pluralist | 3.62–6.50 |
| foundation:b2:s2:analyst | current | all-maximum | realist / Restrainer / Pluralist | 5.44–6.44 |
| foundation:b2:s2:analyst | current | all-minimum | realist / Maximizer / Universalist | 1.96–4.13 |
| foundation:b2:s2:analyst | current | alternating | institutionalist / Hedger / Pluralist | 4.05–5.49 |
| foundation:b2:s2:analyst | current | always-first | constructivist / Restrainer / Conditional Solidarist | 4.28–5.03 |
| foundation:b2:s2:analyst | current | always-last | realist / Maximizer / Conditional Solidarist | 4.26–4.94 |
| foundation:b2:s2:analyst | current | midpoint | constructivist / Maximizer / Universalist | 3.39–4.68 |
| foundation:b2:s2:analyst | current | seeded-random-20260728 | constructivist / Maximizer / Conditional Solidarist | 4.19–5.34 |
| foundation:b2:s2:standard | current | all-maximum | constructivist / Restrainer / Pluralist | 5.33–7.00 |
| foundation:b2:s2:standard | current | all-minimum | realist / Maximizer / Universalist | 1.00–4.22 |
| foundation:b2:s2:standard | current | alternating | institutionalist / Restrainer / Pluralist | 4.46–6.73 |
| foundation:b2:s2:standard | current | always-first | realist / Maximizer / Pluralist | 4.12–4.80 |
| foundation:b2:s2:standard | current | always-last | institutionalist / Maximizer / Universalist | 3.67–5.13 |
| foundation:b2:s2:standard | current | midpoint | constructivist / Maximizer / Universalist | 3.17–5.06 |
| foundation:b2:s2:standard | current | seeded-random-20260728 | constructivist / Maximizer / Pluralist | 3.50–6.50 |
| security:b2:s1:analyst | legacy | all-maximum | Security read: no single lane dominates | 4.62–5.32 |
| security:b2:s1:analyst | legacy | all-minimum | Security read: restraint and crisis ceilings | 3.47–4.48 |
| security:b2:s1:analyst | legacy | alternating | Security read: no single lane dominates | 4.48–5.11 |
| security:b2:s1:analyst | legacy | always-first | Security read: no single lane dominates | 4.19–5.01 |
| security:b2:s1:analyst | legacy | always-last | Security read: no single lane dominates | 4.51–4.74 |
| security:b2:s1:analyst | legacy | midpoint | Security read: no single lane dominates | 3.77–4.57 |
| security:b2:s1:analyst | legacy | seeded-random-20260728 | Security read: no single lane dominates | 4.59–5.04 |
| security:b2:s1:standard | legacy | all-maximum | Security read: no single lane dominates | 4.81–5.27 |
| security:b2:s1:standard | legacy | all-minimum | Security read: restraint and crisis ceilings | 3.32–4.07 |
| security:b2:s1:standard | legacy | alternating | Security read: no single lane dominates | 4.47–5.19 |
| security:b2:s1:standard | legacy | always-first | Security read: no single lane dominates | 3.98–5.09 |
| security:b2:s1:standard | legacy | always-last | Security read: no single lane dominates | 4.29–5.00 |
| security:b2:s1:standard | legacy | midpoint | Security read: no single lane dominates | 3.78–4.34 |
| security:b2:s1:standard | legacy | seeded-random-20260728 | Security read: no single lane dominates | 4.73–4.97 |
| security:b3:s2:analyst | legacy | all-maximum | Security read: pressure and visible deterrence | 4.59–5.34 |
| security:b3:s2:analyst | legacy | all-minimum | Security read: restraint and crisis ceilings | 3.39–3.84 |
| security:b3:s2:analyst | legacy | alternating | Security read: pressure and visible deterrence | 4.48–4.63 |
| security:b3:s2:analyst | legacy | always-first | Security read: coalition-centered pressure management | 4.19–4.57 |
| security:b3:s2:analyst | legacy | always-last | Security read: pressure and visible deterrence | 4.12–4.65 |
| security:b3:s2:analyst | legacy | midpoint | Security read: restraint and crisis ceilings | 3.83–4.02 |
| security:b3:s2:analyst | legacy | seeded-random-20260728 | Security read: pressure and visible deterrence | 4.31–4.74 |
| security:b3:s2:standard | legacy | all-maximum | Security read: pressure and visible deterrence | 4.65–5.48 |
| security:b3:s2:standard | legacy | all-minimum | Security read: restraint and crisis ceilings | 3.31–3.80 |
| security:b3:s2:standard | legacy | alternating | Security read: pressure and visible deterrence | 4.47–4.70 |
| security:b3:s2:standard | legacy | always-first | Security read: restraint and crisis ceilings | 3.98–4.46 |
| security:b3:s2:standard | legacy | always-last | Security read: pressure and visible deterrence | 4.21–5.00 |
| security:b3:s2:standard | legacy | midpoint | Security read: restraint and crisis ceilings | 3.86–4.13 |
| security:b3:s2:standard | legacy | seeded-random-20260728 | Security read: pressure and visible deterrence | 4.39–5.07 |
| security:b4:s2:analyst | current | all-maximum | Security read: pressure and visible deterrence | 4.55–5.30 |
| security:b4:s2:analyst | current | all-minimum | Security read: restraint and crisis ceilings | 3.38–3.86 |
| security:b4:s2:analyst | current | alternating | Security read: pressure and visible deterrence | 4.55–4.61 |
| security:b4:s2:analyst | current | always-first | Security read: restraint and crisis ceilings | 4.08–4.78 |
| security:b4:s2:analyst | current | always-last | Security read: pressure and visible deterrence | 4.05–4.72 |
| security:b4:s2:analyst | current | midpoint | Security read: restraint and crisis ceilings | 3.75–4.02 |
| security:b4:s2:analyst | current | seeded-random-20260728 | Security read: coalition-centered pressure management | 4.25–4.49 |
| security:b4:s2:standard | current | all-maximum | Security read: pressure and visible deterrence | 4.46–5.54 |
| security:b4:s2:standard | current | all-minimum | Security read: restraint and crisis ceilings | 3.26–3.80 |
| security:b4:s2:standard | current | alternating | Security read: pressure and visible deterrence | 4.49–4.69 |
| security:b4:s2:standard | current | always-first | Security read: restraint and crisis ceilings | 3.82–4.66 |
| security:b4:s2:standard | current | always-last | Security read: pressure and visible deterrence | 4.07–5.01 |
| security:b4:s2:standard | current | midpoint | Security read: restraint and crisis ceilings | 3.73–4.02 |
| security:b4:s2:standard | current | seeded-random-20260728 | Security read: coalition-centered pressure management | 3.74–4.40 |
| technology:b2:s1:analyst | legacy | all-maximum | Technology read: no single tool dominates | 4.89–5.44 |
| technology:b2:s1:analyst | legacy | all-minimum | Technology read: openness with targeted safeguards | 3.35–4.09 |
| technology:b2:s1:analyst | legacy | alternating | Technology read: no single tool dominates | 4.28–4.68 |
| technology:b2:s1:analyst | legacy | always-first | Technology read: no single tool dominates | 4.40–4.69 |
| technology:b2:s1:analyst | legacy | always-last | Technology read: no single tool dominates | 4.37–4.79 |
| technology:b2:s1:analyst | legacy | midpoint | Technology read: openness with targeted safeguards | 3.40–4.28 |
| technology:b2:s1:analyst | legacy | seeded-random-20260728 | Technology read: no single tool dominates | 4.26–4.52 |
| technology:b2:s1:standard | legacy | all-maximum | Technology read: no single tool dominates | 5.05–5.19 |
| technology:b2:s1:standard | legacy | all-minimum | Technology read: openness with targeted safeguards | 3.21–4.25 |
| technology:b2:s1:standard | legacy | alternating | Technology read: no single tool dominates | 4.20–4.88 |
| technology:b2:s1:standard | legacy | always-first | Technology read: no single tool dominates | 3.86–4.90 |
| technology:b2:s1:standard | legacy | always-last | Technology read: no single tool dominates | 4.01–5.25 |
| technology:b2:s1:standard | legacy | midpoint | Technology read: no single tool dominates | 3.50–4.30 |
| technology:b2:s1:standard | legacy | seeded-random-20260728 | Technology read: no single tool dominates | 3.85–4.97 |
| technology:b3:s2:analyst | current | all-maximum | Technology read: control with capacity-building | 4.72–5.51 |
| technology:b3:s2:analyst | current | all-minimum | Technology read: openness with targeted safeguards | 3.35–4.02 |
| technology:b3:s2:analyst | current | alternating | Technology read: no single tool dominates | 4.28–4.61 |
| technology:b3:s2:analyst | current | always-first | Technology read: no single tool dominates | 4.22–4.55 |
| technology:b3:s2:analyst | current | always-last | Technology read: no single tool dominates | 4.36–4.63 |
| technology:b3:s2:analyst | current | midpoint | Technology read: openness with targeted safeguards | 3.40–4.13 |
| technology:b3:s2:analyst | current | seeded-random-20260728 | Technology read: no single tool dominates | 3.98–4.44 |
| technology:b3:s2:standard | current | all-maximum | Technology read: control with capacity-building | 4.78–5.23 |
| technology:b3:s2:standard | current | all-minimum | Technology read: openness with targeted safeguards | 3.21–4.14 |
| technology:b3:s2:standard | current | alternating | Technology read: no single tool dominates | 4.14–4.70 |
| technology:b3:s2:standard | current | always-first | Technology read: openness with targeted safeguards | 3.86–4.66 |
| technology:b3:s2:standard | current | always-last | Technology read: control with capacity-building | 4.00–5.25 |
| technology:b3:s2:standard | current | midpoint | Technology read: openness with targeted safeguards | 3.50–4.06 |
| technology:b3:s2:standard | current | seeded-random-20260728 | Technology read: no single tool dominates | 3.66–4.97 |

### Analyst secondary/backup-choice stress fixtures

Eligible analyst tuples add three structural fixtures over complete vectors centered at the instrument midpoint. A fixed primary is chosen from options with both positive and negative cosine-similarity partners where possible. The reinforcing fixture uses the most positively aligned distinct option; the competing fixture uses the most negatively opposed distinct option. If a sign is unavailable, that item's secondary is omitted and disclosed rather than mislabeled. Ties follow authored option order. The JSON artifact records each semantic ID, similarity review, and omission reason. Standard-mode tuples remain primary-only.

| Instrument tuple | Generation | Fixture | Outcome | Score range | Eligible items | Secondary fields | Skipped secondary/backup items |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ai-governance:b2:s1:analyst | legacy | analyst-secondary-competing | democraticGuardrailist / Present-harms first / Deployment-first / Competitive hedger | 3.21–6.52 | 3 | 3 | none |
| ai-governance:b2:s1:analyst | legacy | analyst-secondary-primary-only | democraticGuardrailist / Mixed risk lens / Deployment-first / Competitive hedger | 3.70–6.70 | 3 | 0 | none |
| ai-governance:b2:s1:analyst | legacy | analyst-secondary-reinforcing | democraticGuardrailist / Mixed risk lens / Threshold guardrails / Competitive hedger | 3.70–6.80 | 3 | 3 | none |
| ai-governance:b3:s2:analyst | current | analyst-secondary-competing | democraticGuardrailist / Present-harms first / Threshold guardrails / Competitive hedger | 3.77–6.52 | 3 | 3 | none |
| ai-governance:b3:s2:analyst | current | analyst-secondary-primary-only | democraticGuardrailist / Mixed risk lens / Threshold guardrails / Competitive hedger | 3.90–7.00 | 3 | 0 | none |
| ai-governance:b3:s2:analyst | current | analyst-secondary-reinforcing | democraticGuardrailist / Mixed risk lens / Precaution-first / Competitive hedger | 3.90–7.00 | 3 | 3 | none |
| foundation:bna:s1:analyst | legacy | analyst-secondary-competing | institutionalist / Hedger / Conditional Solidarist | 4.01–4.75 | 22 | 22 | none |
| foundation:bna:s1:analyst | legacy | analyst-secondary-primary-only | institutionalist / Hedger / Conditional Solidarist | 3.94–5.06 | 22 | 0 | none |
| foundation:bna:s1:analyst | legacy | analyst-secondary-reinforcing | institutionalist / Hedger / Conditional Solidarist | 4.24–5.07 | 22 | 22 | none |
| foundation:b2:s2:analyst | current | analyst-secondary-competing | institutionalist / Hedger / Universalist | 4.01–4.73 | 22 | 22 | none |
| foundation:b2:s2:analyst | current | analyst-secondary-primary-only | institutionalist / Restrainer / Universalist | 3.94–4.95 | 22 | 0 | none |
| foundation:b2:s2:analyst | current | analyst-secondary-reinforcing | institutionalist / Restrainer / Conditional Solidarist | 4.21–5.00 | 22 | 22 | none |
| security:b2:s1:analyst | legacy | analyst-secondary-competing | Security read: no single lane dominates | 3.94–4.58 | 15 | 13 | nuclear_hedging: no-negatively-opposed-candidate; selective_enforcement_memory: no-negatively-opposed-candidate |
| security:b2:s1:analyst | legacy | analyst-secondary-primary-only | Security read: restraint and crisis ceilings | 3.52–4.88 | 15 | 0 | none |
| security:b2:s1:analyst | legacy | analyst-secondary-reinforcing | Security read: no single lane dominates | 3.72–5.04 | 15 | 15 | none |
| security:b3:s2:analyst | legacy | analyst-secondary-competing | Security read: restraint and crisis ceilings | 3.97–4.12 | 15 | 15 | none |
| security:b3:s2:analyst | legacy | analyst-secondary-primary-only | Security read: restraint and crisis ceilings | 4.06–4.29 | 15 | 0 | none |
| security:b3:s2:analyst | legacy | analyst-secondary-reinforcing | Security read: no single lane dominates | 4.29–4.39 | 15 | 15 | none |
| security:b4:s2:analyst | current | analyst-secondary-competing | Security read: restraint and crisis ceilings | 4.01–4.13 | 23 | 23 | none |
| security:b4:s2:analyst | current | analyst-secondary-primary-only | Security read: restraint and crisis ceilings | 3.88–4.35 | 23 | 0 | none |
| security:b4:s2:analyst | current | analyst-secondary-reinforcing | Security read: restraint and crisis ceilings | 4.03–4.50 | 23 | 23 | none |
| technology:b2:s1:analyst | legacy | analyst-secondary-competing | Technology read: no single tool dominates | 4.18–4.71 | 15 | 15 | none |
| technology:b2:s1:analyst | legacy | analyst-secondary-primary-only | Technology read: no single tool dominates | 4.22–5.13 | 15 | 0 | none |
| technology:b2:s1:analyst | legacy | analyst-secondary-reinforcing | Technology read: no single tool dominates | 4.43–5.17 | 15 | 15 | none |
| technology:b3:s2:analyst | current | analyst-secondary-competing | Technology read: openness with targeted safeguards | 4.12–4.44 | 15 | 15 | none |
| technology:b3:s2:analyst | current | analyst-secondary-primary-only | Technology read: no single tool dominates | 4.15–4.65 | 15 | 0 | none |
| technology:b3:s2:analyst | current | analyst-secondary-reinforcing | Technology read: no single tool dominates | 4.38–4.72 | 15 | 15 | none |

### Named directional fixtures

| Instrument tuple | Generation | Fixture | Outcome | Score range |
| --- | --- | --- | --- | --- |
| ai-governance:b2:s1:analyst | legacy | deploymentPace-high | democraticGuardrailist / Frontier-risk first / Precaution-first / Coordination-first | 3.20–7.00 |
| ai-governance:b2:s1:analyst | legacy | deploymentPace-low | openEcosystemBuilder / Present-harms first / Deployment-first / Competition-first | 1.00–6.20 |
| ai-governance:b2:s1:analyst | legacy | geopolitics-high | strategicCompetitor / Mixed risk lens / Deployment-first / Competition-first | 1.00–7.00 |
| ai-governance:b2:s1:analyst | legacy | geopolitics-low | coordinationArchitect / Mixed risk lens / Threshold guardrails / Coordination-first | 1.00–7.00 |
| ai-governance:b2:s1:analyst | legacy | humanFuture-high | democraticGuardrailist / Mixed risk lens / Precaution-first / Competitive hedger | 3.80–7.00 |
| ai-governance:b2:s1:analyst | legacy | humanFuture-low | openEcosystemBuilder / Mixed risk lens / Deployment-first / Competitive hedger | 1.00–5.60 |
| ai-governance:b2:s1:analyst | legacy | legitimacy-high | democraticGuardrailist / Mixed risk lens / Threshold guardrails / Coordination-first | 2.70–7.00 |
| ai-governance:b2:s1:analyst | legacy | legitimacy-low | stateCapacityBuilder / Frontier-risk first / Precaution-first / Competition-first | 1.00–7.00 |
| ai-governance:b2:s1:analyst | legacy | militaryRole-high | strategicCompetitor / Present-harms first / Deployment-first / Competition-first | 1.40–7.00 |
| ai-governance:b2:s1:analyst | legacy | militaryRole-low | democraticGuardrailist / Mixed risk lens / Threshold guardrails / Coordination-first | 1.00–6.40 |
| ai-governance:b2:s1:analyst | legacy | openness-high | precautionarySteward / Frontier-risk first / Threshold guardrails / Competitive hedger | 4.30–7.00 |
| ai-governance:b2:s1:analyst | legacy | openness-low | openEcosystemBuilder / Mixed risk lens / Deployment-first / Competitive hedger | 1.00–5.60 |
| ai-governance:b2:s1:analyst | legacy | oversight-high | democraticGuardrailist / Mixed risk lens / Precaution-first / Competitive hedger | 4.10–7.00 |
| ai-governance:b2:s1:analyst | legacy | oversight-low | openEcosystemBuilder / Mixed risk lens / Deployment-first / Competitive hedger | 1.00–5.70 |
| ai-governance:b2:s1:analyst | legacy | riskHorizon-high | precautionarySteward / Frontier-risk first / Precaution-first / Competitive hedger | 3.80–7.00 |
| ai-governance:b2:s1:analyst | legacy | riskHorizon-low | democraticGuardrailist / Present-harms first / Deployment-first / Competitive hedger | 1.00–6.80 |
| ai-governance:b2:s1:standard | legacy | deploymentPace-high | precautionarySteward / Mixed risk lens / Precaution-first / Coordination-first | 3.20–7.00 |
| ai-governance:b2:s1:standard | legacy | deploymentPace-low | openEcosystemBuilder / Present-harms first / Deployment-first / Competition-first | 1.00–6.00 |
| ai-governance:b2:s1:standard | legacy | geopolitics-high | strategicCompetitor / Mixed risk lens / Deployment-first / Competition-first | 2.30–7.00 |
| ai-governance:b2:s1:standard | legacy | geopolitics-low | coordinationArchitect / Mixed risk lens / Precaution-first / Coordination-first | 1.00–6.30 |
| ai-governance:b2:s1:standard | legacy | humanFuture-high | democraticGuardrailist / Mixed risk lens / Threshold guardrails / Coordination-first | 3.70–7.00 |
| ai-governance:b2:s1:standard | legacy | humanFuture-low | democraticGuardrailist / Mixed risk lens / Deployment-first / Coordination-first | 1.00–5.60 |
| ai-governance:b2:s1:standard | legacy | legitimacy-high | democraticGuardrailist / Mixed risk lens / Threshold guardrails / Coordination-first | 2.80–7.00 |
| ai-governance:b2:s1:standard | legacy | legitimacy-low | stateCapacityBuilder / Mixed risk lens / Threshold guardrails / Competitive hedger | 1.00–6.10 |
| ai-governance:b2:s1:standard | legacy | militaryRole-high | strategicCompetitor / Mixed risk lens / Deployment-first / Competition-first | 2.80–7.00 |
| ai-governance:b2:s1:standard | legacy | militaryRole-low | democraticGuardrailist / Mixed risk lens / Threshold guardrails / Coordination-first | 1.00–5.60 |
| ai-governance:b2:s1:standard | legacy | openness-high | precautionarySteward / Mixed risk lens / Threshold guardrails / Coordination-first | 3.70–7.00 |
| ai-governance:b2:s1:standard | legacy | openness-low | democraticGuardrailist / Mixed risk lens / Threshold guardrails / Coordination-first | 1.00–5.60 |
| ai-governance:b2:s1:standard | legacy | oversight-high | precautionarySteward / Mixed risk lens / Precaution-first / Competitive hedger | 3.90–7.00 |
| ai-governance:b2:s1:standard | legacy | oversight-low | openEcosystemBuilder / Present-harms first / Deployment-first / Competitive hedger | 1.10–5.40 |
| ai-governance:b2:s1:standard | legacy | riskHorizon-high | precautionarySteward / Frontier-risk first / Precaution-first / Coordination-first | 3.70–7.00 |
| ai-governance:b2:s1:standard | legacy | riskHorizon-low | democraticGuardrailist / Present-harms first / Deployment-first / Competitive hedger | 1.00–5.30 |
| ai-governance:b3:s2:analyst | current | deploymentPace-high | democraticGuardrailist / Mixed risk lens / Precaution-first / Coordination-first | 2.30–7.00 |
| ai-governance:b3:s2:analyst | current | deploymentPace-low | openEcosystemBuilder / Present-harms first / Deployment-first / Competition-first | 1.00–6.20 |
| ai-governance:b3:s2:analyst | current | geopolitics-high | strategicCompetitor / Mixed risk lens / Deployment-first / Competition-first | 1.60–7.00 |
| ai-governance:b3:s2:analyst | current | geopolitics-low | coordinationArchitect / Mixed risk lens / Precaution-first / Coordination-first | 1.00–7.00 |
| ai-governance:b3:s2:analyst | current | humanFuture-high | democraticGuardrailist / Mixed risk lens / Precaution-first / Competitive hedger | 3.80–7.00 |
| ai-governance:b3:s2:analyst | current | humanFuture-low | openEcosystemBuilder / Mixed risk lens / Deployment-first / Competitive hedger | 1.00–4.60 |
| ai-governance:b3:s2:analyst | current | legitimacy-high | democraticGuardrailist / Mixed risk lens / Threshold guardrails / Coordination-first | 2.70–7.00 |
| ai-governance:b3:s2:analyst | current | legitimacy-low | strategicCompetitor / Mixed risk lens / Deployment-first / Competition-first | 1.00–7.00 |
| ai-governance:b3:s2:analyst | current | militaryRole-high | strategicCompetitor / Present-harms first / Deployment-first / Competition-first | 2.60–7.00 |
| ai-governance:b3:s2:analyst | current | militaryRole-low | democraticGuardrailist / Mixed risk lens / Precaution-first / Coordination-first | 1.00–7.00 |
| ai-governance:b3:s2:analyst | current | openness-high | precautionarySteward / Frontier-risk first / Precaution-first / Competitive hedger | 3.50–7.00 |
| ai-governance:b3:s2:analyst | current | openness-low | openEcosystemBuilder / Mixed risk lens / Deployment-first / Coordination-first | 1.00–5.80 |
| ai-governance:b3:s2:analyst | current | oversight-high | precautionarySteward / Mixed risk lens / Precaution-first / Competitive hedger | 3.90–7.00 |
| ai-governance:b3:s2:analyst | current | oversight-low | openEcosystemBuilder / Present-harms first / Deployment-first / Competition-first | 1.00–6.50 |
| ai-governance:b3:s2:analyst | current | riskHorizon-high | precautionarySteward / Frontier-risk first / Precaution-first / Competitive hedger | 3.90–7.00 |
| ai-governance:b3:s2:analyst | current | riskHorizon-low | democraticGuardrailist / Present-harms first / Threshold guardrails / Competitive hedger | 1.00–5.80 |
| ai-governance:b3:s2:standard | current | deploymentPace-high | precautionarySteward / Mixed risk lens / Precaution-first / Coordination-first | 2.50–7.00 |
| ai-governance:b3:s2:standard | current | deploymentPace-low | openEcosystemBuilder / Present-harms first / Deployment-first / Competition-first | 1.00–6.20 |
| ai-governance:b3:s2:standard | current | geopolitics-high | strategicCompetitor / Mixed risk lens / Deployment-first / Competition-first | 2.30–7.00 |
| ai-governance:b3:s2:standard | current | geopolitics-low | coordinationArchitect / Mixed risk lens / Precaution-first / Coordination-first | 1.00–6.30 |
| ai-governance:b3:s2:standard | current | humanFuture-high | precautionarySteward / Mixed risk lens / Threshold guardrails / Competitive hedger | 3.50–7.00 |
| ai-governance:b3:s2:standard | current | humanFuture-low | stateCapacityBuilder / Mixed risk lens / Deployment-first / Competitive hedger | 1.00–5.90 |
| ai-governance:b3:s2:standard | current | legitimacy-high | coordinationArchitect / Mixed risk lens / Threshold guardrails / Coordination-first | 2.30–7.00 |
| ai-governance:b3:s2:standard | current | legitimacy-low | stateCapacityBuilder / Mixed risk lens / Deployment-first / Competition-first | 1.00–5.70 |
| ai-governance:b3:s2:standard | current | militaryRole-high | strategicCompetitor / Mixed risk lens / Deployment-first / Competition-first | 2.80–7.00 |
| ai-governance:b3:s2:standard | current | militaryRole-low | democraticGuardrailist / Mixed risk lens / Threshold guardrails / Coordination-first | 1.00–5.70 |
| ai-governance:b3:s2:standard | current | openness-high | precautionarySteward / Mixed risk lens / Threshold guardrails / Competitive hedger | 3.50–7.00 |
| ai-governance:b3:s2:standard | current | openness-low | openEcosystemBuilder / Mixed risk lens / Deployment-first / Competitive hedger | 1.00–4.70 |
| ai-governance:b3:s2:standard | current | oversight-high | precautionarySteward / Mixed risk lens / Precaution-first / Competitive hedger | 3.60–7.00 |
| ai-governance:b3:s2:standard | current | oversight-low | openEcosystemBuilder / Present-harms first / Deployment-first / Coordination-first | 1.00–5.40 |
| ai-governance:b3:s2:standard | current | riskHorizon-high | precautionarySteward / Frontier-risk first / Threshold guardrails / Competitive hedger | 4.00–7.00 |
| ai-governance:b3:s2:standard | current | riskHorizon-low | openEcosystemBuilder / Present-harms first / Deployment-first / Competitive hedger | 1.00–4.80 |
| foundation:bna:s1:analyst | legacy | domesticFilters-high | institutionalist / Hedger / Conditional Solidarist | 4.06–5.84 |
| foundation:bna:s1:analyst | legacy | domesticFilters-low | institutionalist / Hedger / Conditional Solidarist | 4.00–4.97 |
| foundation:bna:s1:analyst | legacy | institutions-high | institutionalist / Hedger / Conditional Solidarist | 4.13–6.18 |
| foundation:bna:s1:analyst | legacy | institutions-low | realist / Hedger / Conditional Solidarist | 3.44–5.32 |
| foundation:bna:s1:analyst | legacy | normsIdentity-high | constructivist / Hedger / Universalist | 3.20–5.71 |
| foundation:bna:s1:analyst | legacy | normsIdentity-low | institutionalist / Hedger / Universalist | 3.65–4.93 |
| foundation:bna:s1:analyst | legacy | orderJustice-high | realist / Hedger / Pluralist | 3.88–5.72 |
| foundation:bna:s1:analyst | legacy | orderJustice-low | realist / Maximizer / Universalist | 2.98–5.36 |
| foundation:bna:s1:analyst | legacy | politicalEconomy-high | institutionalist / Hedger / Conditional Solidarist | 3.82–6.42 |
| foundation:bna:s1:analyst | legacy | politicalEconomy-low | institutionalist / Hedger / Conditional Solidarist | 4.09–5.04 |
| foundation:bna:s1:analyst | legacy | restraint-high | institutionalist / Restrainer / Conditional Solidarist | 3.93–5.80 |
| foundation:bna:s1:analyst | legacy | restraint-low | realist / Maximizer / Conditional Solidarist | 3.39–5.19 |
| foundation:bna:s1:analyst | legacy | securityCompetition-high | realist / Hedger / Conditional Solidarist | 3.69–6.34 |
| foundation:bna:s1:analyst | legacy | securityCompetition-low | constructivist / Hedger / Conditional Solidarist | 3.46–5.14 |
| foundation:bna:s1:standard | legacy | domesticFilters-high | institutionalist / Hedger / Conditional Solidarist | 3.93–6.03 |
| foundation:bna:s1:standard | legacy | domesticFilters-low | realist / Hedger / Conditional Solidarist | 3.93–4.80 |
| foundation:bna:s1:standard | legacy | institutions-high | institutionalist / Hedger / Conditional Solidarist | 4.00–6.39 |
| foundation:bna:s1:standard | legacy | institutions-low | realist / Hedger / Pluralist | 2.97–5.22 |
| foundation:bna:s1:standard | legacy | normsIdentity-high | constructivist / Maximizer / Universalist | 3.17–5.95 |
| foundation:bna:s1:standard | legacy | normsIdentity-low | realist / Maximizer / Universalist | 3.17–4.45 |
| foundation:bna:s1:standard | legacy | orderJustice-high | realist / Hedger / Pluralist | 3.86–6.70 |
| foundation:bna:s1:standard | legacy | orderJustice-low | realist / Maximizer / Universalist | 1.68–5.48 |
| foundation:bna:s1:standard | legacy | politicalEconomy-high | realist / Hedger / Pluralist | 3.89–6.60 |
| foundation:bna:s1:standard | legacy | politicalEconomy-low | realist / Hedger / Pluralist | 3.76–5.20 |
| foundation:bna:s1:standard | legacy | restraint-high | institutionalist / Restrainer / Conditional Solidarist | 3.74–5.96 |
| foundation:bna:s1:standard | legacy | restraint-low | realist / Maximizer / Universalist | 2.74–5.36 |
| foundation:bna:s1:standard | legacy | securityCompetition-high | realist / Hedger / Pluralist | 3.86–6.48 |
| foundation:bna:s1:standard | legacy | securityCompetition-low | constructivist / Hedger / Pluralist | 2.85–5.20 |
| foundation:b2:s2:analyst | current | domesticFilters-high | criticalPoliticalEconomy / Hedger / Universalist | 4.05–5.94 |
| foundation:b2:s2:analyst | current | domesticFilters-low | realist / Hedger / Universalist | 4.00–4.75 |
| foundation:b2:s2:analyst | current | institutions-high | institutionalist / Maximizer / Pluralist | 4.11–6.21 |
| foundation:b2:s2:analyst | current | institutions-low | realist / Maximizer / Pluralist | 3.35–5.09 |
| foundation:b2:s2:analyst | current | normsIdentity-high | constructivist / Maximizer / Universalist | 3.29–5.82 |
| foundation:b2:s2:analyst | current | normsIdentity-low | realist / Maximizer / Universalist | 3.69–4.76 |
| foundation:b2:s2:analyst | current | orderJustice-high | realist / Maximizer / Pluralist | 3.89–5.82 |
| foundation:b2:s2:analyst | current | orderJustice-low | realist / Maximizer / Universalist | 2.83–5.13 |
| foundation:b2:s2:analyst | current | politicalEconomy-high | criticalPoliticalEconomy / Maximizer / Pluralist | 3.83–6.45 |
| foundation:b2:s2:analyst | current | politicalEconomy-low | realist / Maximizer / Pluralist | 3.93–4.89 |
| foundation:b2:s2:analyst | current | restraint-high | institutionalist / Restrainer / Universalist | 3.94–5.91 |
| foundation:b2:s2:analyst | current | restraint-low | realist / Maximizer / Conditional Solidarist | 3.16–4.99 |
| foundation:b2:s2:analyst | current | securityCompetition-high | realist / Maximizer / Pluralist | 3.75–6.43 |
| foundation:b2:s2:analyst | current | securityCompetition-low | constructivist / Restrainer / Pluralist | 3.11–5.02 |
| foundation:b2:s2:standard | current | domesticFilters-high | realist / Hedger / Universalist | 3.93–6.03 |
| foundation:b2:s2:standard | current | domesticFilters-low | realist / Hedger / Universalist | 3.93–4.80 |
| foundation:b2:s2:standard | current | institutions-high | institutionalist / Maximizer / Conditional Solidarist | 4.00–6.39 |
| foundation:b2:s2:standard | current | institutions-low | realist / Maximizer / Pluralist | 2.97–5.22 |
| foundation:b2:s2:standard | current | normsIdentity-high | constructivist / Maximizer / Universalist | 3.17–5.95 |
| foundation:b2:s2:standard | current | normsIdentity-low | realist / Maximizer / Universalist | 3.17–4.45 |
| foundation:b2:s2:standard | current | orderJustice-high | realist / Maximizer / Pluralist | 3.86–6.70 |
| foundation:b2:s2:standard | current | orderJustice-low | realist / Maximizer / Universalist | 1.68–5.48 |
| foundation:b2:s2:standard | current | politicalEconomy-high | realist / Maximizer / Pluralist | 3.89–6.60 |
| foundation:b2:s2:standard | current | politicalEconomy-low | realist / Maximizer / Pluralist | 3.76–5.20 |
| foundation:b2:s2:standard | current | restraint-high | institutionalist / Restrainer / Universalist | 3.74–5.96 |
| foundation:b2:s2:standard | current | restraint-low | realist / Maximizer / Universalist | 2.74–5.36 |
| foundation:b2:s2:standard | current | securityCompetition-high | realist / Maximizer / Pluralist | 3.86–6.48 |
| foundation:b2:s2:standard | current | securityCompetition-low | constructivist / Restrainer / Pluralist | 2.85–5.20 |
| security:b2:s1:analyst | legacy | activism-high | Security read: no single lane dominates | 4.57–5.38 |
| security:b2:s1:analyst | legacy | activism-low | Security read: restraint and crisis ceilings | 3.33–5.01 |
| security:b2:s1:analyst | legacy | alliance-high | Security read: coalition-centered pressure management | 4.71–5.81 |
| security:b2:s1:analyst | legacy | alliance-low | Security read: restraint and crisis ceilings | 3.53–4.71 |
| security:b2:s1:analyst | legacy | escalation-high | Security read: no single lane dominates | 4.54–5.33 |
| security:b2:s1:analyst | legacy | escalation-low | Security read: restraint and crisis ceilings | 3.36–5.15 |
| security:b2:s1:analyst | legacy | legitimacy-high | Security read: protection-sensitive statecraft | 3.90–5.79 |
| security:b2:s1:analyst | legacy | legitimacy-low | Security read: no single lane dominates | 3.93–4.99 |
| security:b2:s1:standard | legacy | activism-high | Security read: no single lane dominates | 4.73–5.38 |
| security:b2:s1:standard | legacy | activism-low | Security read: restraint and crisis ceilings | 3.21–4.84 |
| security:b2:s1:standard | legacy | alliance-high | Security read: coalition-centered pressure management | 4.69–5.69 |
| security:b2:s1:standard | legacy | alliance-low | Security read: restraint and crisis ceilings | 3.42–4.49 |
| security:b2:s1:standard | legacy | escalation-high | Security read: no single lane dominates | 4.66–5.29 |
| security:b2:s1:standard | legacy | escalation-low | Security read: restraint and crisis ceilings | 3.26–5.08 |
| security:b2:s1:standard | legacy | legitimacy-high | Security read: protection-sensitive statecraft | 3.88–5.84 |
| security:b2:s1:standard | legacy | legitimacy-low | Security read: no single lane dominates | 3.67–4.89 |
| security:b3:s2:analyst | legacy | activism-high | Security read: pressure and visible deterrence | 4.43–5.44 |
| security:b3:s2:analyst | legacy | activism-low | Security read: restraint and crisis ceilings | 3.33–4.17 |
| security:b3:s2:analyst | legacy | alliance-high | Security read: pressure and visible deterrence | 4.42–5.04 |
| security:b3:s2:analyst | legacy | alliance-low | Security read: pressure and visible deterrence | 3.51–4.48 |
| security:b3:s2:analyst | legacy | escalation-high | Security read: pressure and visible deterrence | 4.39–5.39 |
| security:b3:s2:analyst | legacy | escalation-low | Security read: restraint and crisis ceilings | 3.36–4.31 |
| security:b3:s2:analyst | legacy | legitimacy-high | Security read: pressure and visible deterrence | 4.70–5.12 |
| security:b3:s2:analyst | legacy | legitimacy-low | Security read: pressure and visible deterrence | 3.56–5.02 |
| security:b3:s2:standard | legacy | activism-high | Security read: pressure and visible deterrence | 4.65–5.48 |
| security:b3:s2:standard | legacy | activism-low | Security read: restraint and crisis ceilings | 3.21–4.30 |
| security:b3:s2:standard | legacy | alliance-high | Security read: pressure and visible deterrence | 4.36–4.99 |
| security:b3:s2:standard | legacy | alliance-low | Security read: no single lane dominates | 3.63–4.45 |
| security:b3:s2:standard | legacy | escalation-high | Security read: pressure and visible deterrence | 4.59–5.39 |
| security:b3:s2:standard | legacy | escalation-low | Security read: restraint and crisis ceilings | 3.26–4.54 |
| security:b3:s2:standard | legacy | legitimacy-high | Security read: pressure and visible deterrence | 4.53–5.20 |
| security:b3:s2:standard | legacy | legitimacy-low | Security read: pressure and visible deterrence | 3.50–4.97 |
| security:b4:s2:analyst | current | activism-high | Security read: pressure and visible deterrence | 4.38–5.40 |
| security:b4:s2:analyst | current | activism-low | Security read: restraint and crisis ceilings | 3.32–4.22 |
| security:b4:s2:analyst | current | alliance-high | Security read: pressure and visible deterrence | 4.61–5.18 |
| security:b4:s2:analyst | current | alliance-low | Security read: restraint and crisis ceilings | 3.44–4.50 |
| security:b4:s2:analyst | current | escalation-high | Security read: pressure and visible deterrence | 4.34–5.26 |
| security:b4:s2:analyst | current | escalation-low | Security read: restraint and crisis ceilings | 3.43–4.48 |
| security:b4:s2:analyst | current | legitimacy-high | Security read: pressure and visible deterrence | 4.54–5.11 |
| security:b4:s2:analyst | current | legitimacy-low | Security read: pressure and visible deterrence | 3.45–4.85 |
| security:b4:s2:standard | current | activism-high | Security read: pressure and visible deterrence | 4.46–5.54 |
| security:b4:s2:standard | current | activism-low | Security read: restraint and crisis ceilings | 3.17–4.32 |
| security:b4:s2:standard | current | alliance-high | Security read: pressure and visible deterrence | 4.54–4.86 |
| security:b4:s2:standard | current | alliance-low | Security read: no single lane dominates | 3.61–4.46 |
| security:b4:s2:standard | current | escalation-high | Security read: pressure and visible deterrence | 4.40–5.34 |
| security:b4:s2:standard | current | escalation-low | Security read: restraint and crisis ceilings | 3.33–4.70 |
| security:b4:s2:standard | current | legitimacy-high | Security read: coalition-centered pressure management | 4.46–5.12 |
| security:b4:s2:standard | current | legitimacy-low | Security read: pressure and visible deterrence | 3.43–4.81 |
| technology:b2:s1:analyst | legacy | control-high | Technology read: no single tool dominates | 3.79–5.73 |
| technology:b2:s1:analyst | legacy | control-low | Technology read: openness with targeted safeguards | 3.19–4.33 |
| technology:b2:s1:analyst | legacy | governance-high | Technology read: coordinated governance | 4.38–6.12 |
| technology:b2:s1:analyst | legacy | governance-low | Technology read: no single tool dominates | 3.46–5.34 |
| technology:b2:s1:analyst | legacy | industrial-high | Technology read: no single tool dominates | 4.35–5.72 |
| technology:b2:s1:analyst | legacy | industrial-low | Technology read: openness with targeted safeguards | 3.40–4.55 |
| technology:b2:s1:analyst | legacy | safety-high | Technology read: no single tool dominates | 4.81–5.35 |
| technology:b2:s1:analyst | legacy | safety-low | Technology read: no single tool dominates | 3.65–4.17 |
| technology:b2:s1:standard | legacy | control-high | Technology read: no single tool dominates | 4.08–5.69 |
| technology:b2:s1:standard | legacy | control-low | Technology read: openness with targeted safeguards | 3.16–4.39 |
| technology:b2:s1:standard | legacy | governance-high | Technology read: coordinated governance | 4.42–6.04 |
| technology:b2:s1:standard | legacy | governance-low | Technology read: no single tool dominates | 3.54–5.10 |
| technology:b2:s1:standard | legacy | industrial-high | Technology read: no single tool dominates | 4.12–5.81 |
| technology:b2:s1:standard | legacy | industrial-low | Technology read: openness with targeted safeguards | 3.16–4.39 |
| technology:b2:s1:standard | legacy | safety-high | Technology read: no single tool dominates | 4.76–5.21 |
| technology:b2:s1:standard | legacy | safety-low | Technology read: no single tool dominates | 3.49–4.19 |
| technology:b3:s2:analyst | current | control-high | Technology read: control with capacity-building | 3.74–5.73 |
| technology:b3:s2:analyst | current | control-low | Technology read: openness with targeted safeguards | 3.19–4.26 |
| technology:b3:s2:analyst | current | governance-high | Technology read: coordinated governance | 4.37–5.95 |
| technology:b3:s2:analyst | current | governance-low | Technology read: control with capacity-building | 3.39–5.58 |
| technology:b3:s2:analyst | current | industrial-high | Technology read: control with capacity-building | 4.44–5.11 |
| technology:b3:s2:analyst | current | industrial-low | Technology read: safety-first constraint | 3.52–4.63 |
| technology:b3:s2:analyst | current | safety-high | Technology read: control with capacity-building | 4.59–5.30 |
| technology:b3:s2:analyst | current | safety-low | Technology read: openness with targeted safeguards | 3.65–3.98 |
| technology:b3:s2:standard | current | control-high | Technology read: control with capacity-building | 3.99–5.69 |
| technology:b3:s2:standard | current | control-low | Technology read: openness with targeted safeguards | 3.16–4.28 |
| technology:b3:s2:standard | current | governance-high | Technology read: coordinated governance | 4.21–5.78 |
| technology:b3:s2:standard | current | governance-low | Technology read: no single tool dominates | 3.42–5.44 |
| technology:b3:s2:standard | current | industrial-high | Technology read: control with capacity-building | 4.03–5.45 |
| technology:b3:s2:standard | current | industrial-low | Technology read: no single tool dominates | 3.50–4.52 |
| technology:b3:s2:standard | current | safety-high | Technology read: coordinated governance | 4.58–5.33 |
| technology:b3:s2:standard | current | safety-low | Technology read: openness with targeted safeguards | 3.49–4.08 |

## Presentation-seed invariance

For analyst tuples, matching semantic answer-ID digests and secondary-choice counts indicate that the same semantic secondary IDs were preserved across both presentation seeds.

Fixture baseline digest: `3bf75239ce19f6e10e1a6f086ff66fc7646d37534238689249f5fc1349aa839a` — matches the checked-in baseline.

| Generation | Instrument | Mode | Bank / scorer | Seed A | Seed B | Changed option sets / total option sets | Semantic secondary-choice count | Semantic answer-ID digests | Result-contract digests | Scenario-order digests |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| legacy | ai-governance | analyst | bank 2 / scorer 1 | evidence-semantic-order-a-v1 | evidence-semantic-order-b-v1 | 9 of 9 option sets changed visible order | 3 preserved | `d80babaec4e03d00b0d33b39511fc2c300f4aba71557cf2ef2a02b3d54013898` = `d80babaec4e03d00b0d33b39511fc2c300f4aba71557cf2ef2a02b3d54013898` | `e0fef76cdeaf85f7a68896e93f844cc67d426f8fc9c97d33b45ddfb7ed3c0574` = `e0fef76cdeaf85f7a68896e93f844cc67d426f8fc9c97d33b45ddfb7ed3c0574` | `13ef392587b374a57474654c88836482f8a7233568dd9bcd4d1376b11c3a6eda` = `13ef392587b374a57474654c88836482f8a7233568dd9bcd4d1376b11c3a6eda` |
| legacy | ai-governance | standard | bank 2 / scorer 1 | evidence-semantic-order-a-v1 | evidence-semantic-order-b-v1 | 6 of 6 option sets changed visible order | not applicable | `3dd527cd8085e018c33a4467f639e3acbe05123bf903657fd95ca172167b4d57` = `3dd527cd8085e018c33a4467f639e3acbe05123bf903657fd95ca172167b4d57` | `3d3b35e785dc524d0cba8ee46da4f511befa101804c3c44170a1bc87a9f0f1a4` = `3d3b35e785dc524d0cba8ee46da4f511befa101804c3c44170a1bc87a9f0f1a4` | `bd5d36efe0519b8f6050aab0f436009595bad11a886597dd094ab2b6a9c0f1ff` = `bd5d36efe0519b8f6050aab0f436009595bad11a886597dd094ab2b6a9c0f1ff` |
| current | ai-governance | analyst | bank 3 / scorer 2 | evidence-semantic-order-a-v1 | evidence-semantic-order-b-v1 | 9 of 9 option sets changed visible order | 3 preserved | `d80babaec4e03d00b0d33b39511fc2c300f4aba71557cf2ef2a02b3d54013898` = `d80babaec4e03d00b0d33b39511fc2c300f4aba71557cf2ef2a02b3d54013898` | `802869996654809b960741cac1520dbca92139aac768c0bbefce385246299358` = `802869996654809b960741cac1520dbca92139aac768c0bbefce385246299358` | `13ef392587b374a57474654c88836482f8a7233568dd9bcd4d1376b11c3a6eda` = `13ef392587b374a57474654c88836482f8a7233568dd9bcd4d1376b11c3a6eda` |
| current | ai-governance | standard | bank 3 / scorer 2 | evidence-semantic-order-a-v1 | evidence-semantic-order-b-v1 | 6 of 6 option sets changed visible order | not applicable | `3dd527cd8085e018c33a4467f639e3acbe05123bf903657fd95ca172167b4d57` = `3dd527cd8085e018c33a4467f639e3acbe05123bf903657fd95ca172167b4d57` | `bc7a9c0537e4770d03582f2f76f25a48ed93bab73d0b21348b1f55634fe05528` = `bc7a9c0537e4770d03582f2f76f25a48ed93bab73d0b21348b1f55634fe05528` | `bd5d36efe0519b8f6050aab0f436009595bad11a886597dd094ab2b6a9c0f1ff` = `bd5d36efe0519b8f6050aab0f436009595bad11a886597dd094ab2b6a9c0f1ff` |
| current | foundation | analyst | bank 2 / scorer 2 | evidence-semantic-order-a-v1 | evidence-semantic-order-b-v1 | 22 of 22 option sets changed visible order | 22 preserved | `2338aada3c7be2a7cabed27552c1f1f471fb9fc50ccc67b8445bbe39eec753bd` = `2338aada3c7be2a7cabed27552c1f1f471fb9fc50ccc67b8445bbe39eec753bd` | `294770d453a265837bad0099c64e519bd31f5330bf035cafd61aa98051f46c9f` = `294770d453a265837bad0099c64e519bd31f5330bf035cafd61aa98051f46c9f` | not applicable |
| current | foundation | standard | bank 2 / scorer 2 | evidence-semantic-order-a-v1 | evidence-semantic-order-b-v1 | 6 of 6 option sets changed visible order | not applicable | `c6ccc44d70d6d8190cfb044ed74310cc7b6cde5e28891ddfc60c36bf36b946c7` = `c6ccc44d70d6d8190cfb044ed74310cc7b6cde5e28891ddfc60c36bf36b946c7` | `ff592b267ea61a75b5365628b1ba68a3ec8e1fd645a659f9bb0e483217cdff26` = `ff592b267ea61a75b5365628b1ba68a3ec8e1fd645a659f9bb0e483217cdff26` | not applicable |
| legacy | foundation | analyst | bank n/a / scorer 1 | evidence-semantic-order-a-v1 | evidence-semantic-order-b-v1 | 22 of 22 option sets changed visible order | 22 preserved | `a5d2222fe60947f462b995c086d561522ddc1cbb8782be48187986c9dc63aee6` = `a5d2222fe60947f462b995c086d561522ddc1cbb8782be48187986c9dc63aee6` | `8eb76bda9c320a5f8c4d5efce2c9bae48809effa20181ccc7e40909001110763` = `8eb76bda9c320a5f8c4d5efce2c9bae48809effa20181ccc7e40909001110763` | not applicable |
| legacy | foundation | standard | bank n/a / scorer 1 | evidence-semantic-order-a-v1 | evidence-semantic-order-b-v1 | 6 of 6 option sets changed visible order | not applicable | `f48da32959e0deb7e8f32afa84b271bbee69a1813421540731ee93df6b783e59` = `f48da32959e0deb7e8f32afa84b271bbee69a1813421540731ee93df6b783e59` | `697e12794251faabaedc76292dd75874a27a73b37f034b1ab8825b296053b989` = `697e12794251faabaedc76292dd75874a27a73b37f034b1ab8825b296053b989` | not applicable |
| legacy | security | analyst | bank 2 / scorer 1 | evidence-semantic-order-a-v1 | evidence-semantic-order-b-v1 | 15 of 15 option sets changed visible order | 15 preserved | `5353e0cf334d44152cb6cb940269f3be23e75456b410e721834e40e9ff73a244` = `5353e0cf334d44152cb6cb940269f3be23e75456b410e721834e40e9ff73a244` | `7b32636d0a00dc7ceb9eb37cdfdf079a70c0122ec9f5e57dba696dc63c659a13` = `7b32636d0a00dc7ceb9eb37cdfdf079a70c0122ec9f5e57dba696dc63c659a13` | not applicable |
| legacy | security | standard | bank 2 / scorer 1 | evidence-semantic-order-a-v1 | evidence-semantic-order-b-v1 | 9 of 9 option sets changed visible order | not applicable | `ce64b7bd47600ae70db413fc69c63f8723e8149cf5399cc7ae5ac8aa5e278b32` = `ce64b7bd47600ae70db413fc69c63f8723e8149cf5399cc7ae5ac8aa5e278b32` | `19ab67427e6174888b0950d60b1f5f30187acb993a90bcc9b652c601303110d0` = `19ab67427e6174888b0950d60b1f5f30187acb993a90bcc9b652c601303110d0` | not applicable |
| legacy | security | analyst | bank 3 / scorer 2 | evidence-semantic-order-a-v1 | evidence-semantic-order-b-v1 | 15 of 15 option sets changed visible order | 15 preserved | `5353e0cf334d44152cb6cb940269f3be23e75456b410e721834e40e9ff73a244` = `5353e0cf334d44152cb6cb940269f3be23e75456b410e721834e40e9ff73a244` | `3891e1104592ac4596d1a3b0519f5a15c2df7665e0b40d467435791b035ed011` = `3891e1104592ac4596d1a3b0519f5a15c2df7665e0b40d467435791b035ed011` | not applicable |
| legacy | security | standard | bank 3 / scorer 2 | evidence-semantic-order-a-v1 | evidence-semantic-order-b-v1 | 9 of 9 option sets changed visible order | not applicable | `ce64b7bd47600ae70db413fc69c63f8723e8149cf5399cc7ae5ac8aa5e278b32` = `ce64b7bd47600ae70db413fc69c63f8723e8149cf5399cc7ae5ac8aa5e278b32` | `41824df6524759022779433a75d9e63480b0c31f528e3b20fdbf9a02c628bba5` = `41824df6524759022779433a75d9e63480b0c31f528e3b20fdbf9a02c628bba5` | not applicable |
| current | security | analyst | bank 4 / scorer 2 | evidence-semantic-order-a-v1 | evidence-semantic-order-b-v1 | 23 of 23 option sets changed visible order | 23 preserved | `36bb43a8cad5793cc486920583520982c7404f2c322829658384f468cda9c86a` = `36bb43a8cad5793cc486920583520982c7404f2c322829658384f468cda9c86a` | `69fa6da640fc60fddf8b5d6901689379510ee9fa9c6d8352af5a6786f8c172fc` = `69fa6da640fc60fddf8b5d6901689379510ee9fa9c6d8352af5a6786f8c172fc` | not applicable |
| current | security | standard | bank 4 / scorer 2 | evidence-semantic-order-a-v1 | evidence-semantic-order-b-v1 | 19 of 19 option sets changed visible order | not applicable | `7dd54d61bb0555a48151618f63b3592c93ed396cd9d98a1ba9485fa89516d7aa` = `7dd54d61bb0555a48151618f63b3592c93ed396cd9d98a1ba9485fa89516d7aa` | `1b3b85dd6b6fc250e8d8891d789484f98fbc48b5cd35c6826faefb484a77d095` = `1b3b85dd6b6fc250e8d8891d789484f98fbc48b5cd35c6826faefb484a77d095` | not applicable |
| legacy | technology | analyst | bank 2 / scorer 1 | evidence-semantic-order-a-v1 | evidence-semantic-order-b-v1 | 14 of 15 option sets changed visible order | 15 preserved | `1b3e715e64df0af185502a171d284154371a118881672ebba59c9b9d2c3c1ea9` = `1b3e715e64df0af185502a171d284154371a118881672ebba59c9b9d2c3c1ea9` | `a4baa4667c9bec36b69a568658b6cf262608b52749979b8c5d881734c0f03ebb` = `a4baa4667c9bec36b69a568658b6cf262608b52749979b8c5d881734c0f03ebb` | not applicable |
| legacy | technology | standard | bank 2 / scorer 1 | evidence-semantic-order-a-v1 | evidence-semantic-order-b-v1 | 8 of 9 option sets changed visible order | not applicable | `167b91cd97bb802294fad2a3b285ef7e84c40626635f411ec49360c799c67a33` = `167b91cd97bb802294fad2a3b285ef7e84c40626635f411ec49360c799c67a33` | `77e6ee471e63d5d25a5756eb71872f385f1954aea0025228eeacae4805145d3b` = `77e6ee471e63d5d25a5756eb71872f385f1954aea0025228eeacae4805145d3b` | not applicable |
| current | technology | analyst | bank 3 / scorer 2 | evidence-semantic-order-a-v1 | evidence-semantic-order-b-v1 | 14 of 15 option sets changed visible order | 15 preserved | `1b3e715e64df0af185502a171d284154371a118881672ebba59c9b9d2c3c1ea9` = `1b3e715e64df0af185502a171d284154371a118881672ebba59c9b9d2c3c1ea9` | `4e61032bd544ebd93abb19319979753b727a3c451ea46baca7f76f56cc30261f` = `4e61032bd544ebd93abb19319979753b727a3c451ea46baca7f76f56cc30261f` | not applicable |
| current | technology | standard | bank 3 / scorer 2 | evidence-semantic-order-a-v1 | evidence-semantic-order-b-v1 | 8 of 9 option sets changed visible order | not applicable | `167b91cd97bb802294fad2a3b285ef7e84c40626635f411ec49360c799c67a33` = `167b91cd97bb802294fad2a3b285ef7e84c40626635f411ec49360c799c67a33` | `1b5b1b932aa93b21643460758fe2833b603737224d3113b8f6b1abd6c8f0511f` = `1b5b1b932aa93b21643460758fe2833b603737224d3113b8f6b1abd6c8f0511f` | not applicable |

## Public-copy audit delta

P2 advisory baseline: 558. Current: 577. Unchanged and suppressed: 550. New: 27. Resolved: 8.

Higher-priority findings remain visible regardless of the P2 baseline.

| Priority | Count |
| --- | --- |
| P0 | 15 |
| P1 | 26 |
| P2 | 577 |

### P0 and P1 findings

| Priority | Rule | Audience | Location | Matched |
| --- | --- | --- | --- | --- |
| P0 | implementation-detail | operational | app/api/aggregate/stats/route.ts:40 (route:/api/aggregate/stats#invalidPayloadResponse.error) | result payload |
| P0 | implementation-detail | operational | app/api/card/route.tsx:33 (route:/api/card#GET) | result payload |
| P0 | public-release-language | editorial-source | content/locales/zh-Hans/manifest.ts:7 (content-key:content/locales/zh-Hans/manifest.ts#zhHansCopyDeckManifest.implementationRange) | V19.1 |
| P0 | public-release-language | editorial-source | content/locales/zh-Hans/manifest.ts:7 (content-key:content/locales/zh-Hans/manifest.ts#zhHansCopyDeckManifest.implementationRange) | V20 |
| P0 | public-release-language | operational | lib/archetype-content.ts:18 (content-key:lib/archetype-content.ts#OWNER_AUTHORIZED_BETA_QUALIFICATION) | beta |
| P0 | public-release-language | operational | lib/archetype-content.ts:283 (content-key:lib/archetype-content.ts#validateArchetypeContentCatalog) | beta |
| P0 | public-release-language | operational | lib/archetype-content.ts:749 (content-key:lib/archetype-content.ts#validateContentRecord) | v1 |
| P0 | public-release-language | operational | lib/archetype-content.ts:1167 (content-key:lib/archetype-content.ts#validatePublishableCore) | beta |
| P0 | public-release-language | operational | lib/archetype-content.ts:1180 (content-key:lib/archetype-content.ts#validatePublishableCore) | beta |
| P0 | public-release-language | operational | lib/archetype-content.ts:1192 (content-key:lib/archetype-content.ts#validatePublishableCore) | beta |
| P0 | public-release-language | operational | lib/archetype-content.ts:1204 (content-key:lib/archetype-content.ts#validatePublishableCore) | beta |
| P0 | public-release-language | operational | lib/reference-profiles/validation.ts:842 (content-key:lib/reference-profiles/validation.ts#validateEditorialState) | Version history |
| P0 | public-release-language | operational | lib/research/scoring-replay.ts:472 (content-key:lib/research/scoring-replay.ts#resolveReplayForm) | v1 |
| P0 | public-release-language | operational | lib/research/scoring-replay.ts:496 (content-key:lib/research/scoring-replay.ts#resolveReplayForm) | v2 |
| P0 | public-release-language | operational | lib/research/scoring-replay.ts:577 (content-key:lib/research/scoring-replay.ts#generateReplayResult) | v2 |
| P1 | banned-contrastive-template | editorial-source | content/locales/zh-Hans/foundation-back-translations-analyst-b.ts:145 (content-key:content/locales/zh-Hans/foundation-back-translations-analyst-b.ts#zhHansFoundationAnalystBackTranslationsB.9.backTranslation.options.3.label) | not only voice but |
| P1 | sits-between-template | public | lib/ai-governance-atlas-content.ts:361 (content-key:lib/ai-governance-atlas-content.ts#aiAtlasCurrentDebates.strategicCompetitor.1.prompt) | sit between |
| P1 | sits-between-template | public | lib/ai-governance-atlas-content.ts:424 (content-key:lib/ai-governance-atlas-content.ts#aiAtlasCurrentDebates.openEcosystemBuilder.0.prompt) | sit between |
| P1 | keeps-in-play-template | public | lib/atlas-lite.ts:58 (content-key:lib/atlas-lite.ts#atlasLitePatterns.0.decisionRule) | Keep several explanations in play |
| P1 | keeps-in-play-template | public | lib/atlas-lite.ts:62 (content-key:lib/atlas-lite.ts#atlasLitePatterns.0.cardSummary) | keeps several neighboring arguments in play |
| P1 | you-generally-believe-template | frozen | lib/modules/security-v21.ts:129 (frozen-compatibility:lib/modules/security-v21.ts#securityV21Module.summary) | you generally believe |
| P1 | you-generally-believe-template | frozen | lib/modules/security-v21.ts:159 (frozen-compatibility:lib/modules/security-v21.ts#securityV21Module.summary) | You generally believe |
| P1 | you-generally-believe-template | frozen | lib/modules/security-v21.ts:174 (frozen-compatibility:lib/modules/security-v21.ts#securityV21Module.summary) | You generally believe |
| P1 | pulls-clear-template | frozen | lib/modules/security-v21.ts:188 (frozen-compatibility:lib/modules/security-v21.ts#securityV21Module.summary) | pulling clear |
| P1 | sits-between-template | frozen | lib/modules/security-v21.ts:188 (frozen-compatibility:lib/modules/security-v21.ts#securityV21Module.summary) | sit between |
| P1 | pulls-clear-template | frozen | lib/modules/security-v21.ts:319 (frozen-compatibility:lib/modules/security-v21.ts#summary) | pulled clear |
| P1 | sits-between-template | frozen | lib/modules/security-v21.ts:319 (frozen-compatibility:lib/modules/security-v21.ts#summary) | sits between |
| P1 | pulls-clear-template | frozen | lib/modules/security-v21.ts:349 (frozen-compatibility:lib/modules/security-v21.ts#summary) | pulled clear |
| P1 | sits-between-template | frozen | lib/modules/security-v21.ts:349 (frozen-compatibility:lib/modules/security-v21.ts#summary) | sits between |
| P1 | pulls-clear-template | frozen | lib/modules/security-v21.ts:374 (frozen-compatibility:lib/modules/security-v21.ts#summary) | pulled clear |
| P1 | sits-between-template | frozen | lib/modules/security-v21.ts:374 (frozen-compatibility:lib/modules/security-v21.ts#summary) | sits between |
| P1 | you-generally-believe-template | frozen | lib/modules/technology-v21.ts:129 (frozen-compatibility:lib/modules/technology-v21.ts#technologyV21Module.summary) | You generally believe |
| P1 | you-generally-believe-template | frozen | lib/modules/technology-v21.ts:174 (frozen-compatibility:lib/modules/technology-v21.ts#technologyV21Module.summary) | You generally believe |
| P1 | pulls-clear-template | frozen | lib/modules/technology-v21.ts:188 (frozen-compatibility:lib/modules/technology-v21.ts#technologyV21Module.summary) | pulling clear |
| P1 | sits-between-template | frozen | lib/modules/technology-v21.ts:188 (frozen-compatibility:lib/modules/technology-v21.ts#technologyV21Module.summary) | sit between |
| P1 | pulls-clear-template | frozen | lib/modules/technology-v21.ts:313 (frozen-compatibility:lib/modules/technology-v21.ts#summary) | pulled clear |
| P1 | sits-between-template | frozen | lib/modules/technology-v21.ts:313 (frozen-compatibility:lib/modules/technology-v21.ts#summary) | sits between |
| P1 | pulls-clear-template | frozen | lib/modules/technology-v21.ts:339 (frozen-compatibility:lib/modules/technology-v21.ts#summary) | pulled clear |
| P1 | sits-between-template | frozen | lib/modules/technology-v21.ts:339 (frozen-compatibility:lib/modules/technology-v21.ts#summary) | sits between |
| P1 | pulls-clear-template | frozen | lib/modules/technology-v21.ts:365 (frozen-compatibility:lib/modules/technology-v21.ts#summary) | pulled clear |
| P1 | sits-between-template | frozen | lib/modules/technology-v21.ts:365 (frozen-compatibility:lib/modules/technology-v21.ts#summary) | sits between |

### New P2 findings

| Count | Rule | Audience | Location | Matched |
| --- | --- | --- | --- | --- |
| 1 | repeated-three-part-list | public | app/archetypes/[slug]/page.tsx (route:/archetypes/[slug]#ArchetypeDetailPage.p) | change the underlying Foundation score or assign people, organizations, or traditions to a fixed type / not editorial, expert, or methodological validation |
| 1 | repeated-three-part-list | public | content/instrument/security.v4.json (content-key:content/instrument/security.v4.json#items.14.scene) | legal authority, force priorities, and risk tolerance / escort, strike, or combat commitment is pre-authorized |
| 1 | repeated-three-part-list | public | content/instrument/security.v4.json (content-key:content/instrument/security.v4.json#items.12.options.3.label) | aviation notices, cyber pressure, and information operations rather than ship seizures / Effects are slower, less visible, and easier for Taiwan and partners to mitigate |
| 1 | repeated-adjacent-opening | public | lib/archetypes.ts (content-key:lib/archetypes.ts#readIdentityDefinition) | invalid archetype identity |
| 1 | repeated-adjacent-opening | public | lib/archetypes.ts (content-key:lib/archetypes.ts#readIdentityDefinitions) | invalid archetype identity |
| 1 | lens-metaphor-review | public | lib/modules/security-v22.ts (content-key:lib/modules/security-v22.ts#securityV22Module.summary) | lens cards |
| 1 | lens-metaphor-review | public | lib/modules/calibration.ts (content-key:lib/modules/calibration.ts#MODULE_CALIBRATION_SOURCE.securityMethod) | lens cards |
| 1 | general-prevalence-language-review | public | content/archetypes.json (content-key:content/archetypes.json#records.1.content.historicalAnalogue.nameNote.value.text) | usually |
| 1 | repeated-adjacent-opening | operational | lib/archetype-content.ts (content-key:lib/archetype-content.ts#validateClaimListField) | value must contain |
| 1 | repeated-adjacent-opening | editorial-source | content/archetype-evidence.json (content-key:content/archetype-evidence.json#records.0.unresolvedFields.4.reason) | the article is |
| 1 | lens-metaphor-review | public | components/modules/module-app.tsx (content-key:components/modules/module-app.tsx#ModuleApp.p) | lens cards |
| 1 | repeated-adjacent-three-part-list | public | lib/modules/security-v22.ts (content-key:lib/modules/security-v22.ts#securityLanes.2.description) | Order, legitimacy, and protection / legal authority, civilian protection, and bounded action |
| 1 | repeated-adjacent-three-part-list | public | lib/modules/security-v22.ts (content-key:lib/modules/security-v22.ts#securityV22Module.subtitle) | Security, Strategy, and Statecraft / alliances, escalation, and the legitimacy of force |
| 1 | repeated-adjacent-opening | public | lib/archetypes.ts (content-key:lib/archetypes.ts#readIdentityDefinition) | invalid archetype identity |
| 1 | repeated-adjacent-opening | public | lib/archetypes.ts (content-key:lib/archetypes.ts#readIdentityDefinition) | invalid archetype identity |
| 1 | repeated-adjacent-opening | public | components/modules/module-app.tsx (content-key:components/modules/module-app.tsx#ModuleApp.p) | answer from your |
| 1 | lens-metaphor-review | public | lib/modules/security-v22.ts (content-key:lib/modules/security-v22.ts#securityV22Module.summary) | lens cards |
| 1 | lens-metaphor-review | public | components/modules/module-result.tsx (content-key:components/modules/module-result.tsx#ModuleResultView.p) | lens cards |
| 1 | repeated-adjacent-opening | public | lib/archetypes.ts (content-key:lib/archetypes.ts#readIdentityDefinition) | invalid archetype identity |
| 1 | repeated-adjacent-opening | public | lib/archetypes.ts (content-key:lib/archetypes.ts#readIdentityDefinition) | invalid archetype identity |
| 1 | repeated-adjacent-opening | public | lib/modules/security-v22.ts (content-key:lib/modules/security-v22.ts#securityV22Module) | under security pressure |
| 1 | repeated-adjacent-opening | operational | lib/archetype-content.ts (content-key:lib/archetype-content.ts#validateArchetypeContentCatalog) | catalog and evidence |
| 1 | repeated-three-part-list | public | content/instrument/security.v4.json (content-key:content/instrument/security.v4.json#items.18.options.1.label) | a hotline, rescue arrangements, and third-party incident investigation / Nuclear, missile, and aligned-group disputes remain unresolved |
| 1 | repeated-adjacent-opening | public | lib/archetypes.ts (content-key:lib/archetypes.ts#readIdentityDefinition) | invalid archetype identity |
| 1 | general-prevalence-language-review | public | content/instrument/security.v4.json (content-key:content/instrument/security.v4.json#items.4.whyHard) | normally |
| 1 | repeated-adjacent-three-part-list | public | content/instrument/security.v4.json (content-key:content/instrument/security.v4.json#items.20.whyHard) | foreign support, monitoring, and limits / Each arrangement moves the burden, timing, and escalation risk differently |
| 1 | repeated-three-part-list | public | content/instrument/security.v4.json (content-key:content/instrument/security.v4.json#items.20.scene) | foreign support, monitoring, and limits / none guarantees protection without shifting cost, exposure, or freedom of action |

### Resolved P2 findings

| Count | Baseline fingerprint |
| --- | --- |
| 1 | 5e32fa9dc0d89fa8cd0886b739b09d76533e8622d8ba253496f668963bf4c878 |
| 1 | 690aca4166020393557611d3d3ff79ce2c1bb84bcc1d1b9969c1af2e9a2057ff |
| 1 | 863d56b5a73c241f1be9faae45bb2a329dce039b0dc27706e0a37e54cbf8084e |
| 1 | 890b3b7b2fd91e981ea8d7b7ab546f6ce680c8cb4a632960909a3b0f23cd4e67 |
| 1 | 9d3d0475ed56ca76c0735672124654647b78b9bf53fa68bf09693e9612b7e3b8 |
| 1 | 9e8a617a5bb005dfd6439e3aed6dbdf6465858a0222aca7bde485506b534befb |
| 1 | c439826a46cb340bbd782476277c854e2a53242d860a0bb2f220eb30bf3c78b1 |
| 1 | c9942d64f22b15ad56834eaa8653f93c8687c8f6362893e34ff28a1ace7d2b8d |

## Method notes

- Public evidence artifact schema version: 2. The nested instrument-evidence and response-fixture reports use the same schema version.
- Foundation validation-block items are counted as research-validation scored but not primary-result scored; both shares are shown.
- Module actor-lens items contribute card-type evidence but are excluded from aggregate and lane scores, so both any-scored and primary-scored shares are shown.
- Actor roles come only from explicit `actorRole` metadata or the repository's controlled perspective-tag matrix.
- No bank declares theater metadata. The audit records `undeclared`; it does not infer theater from prose, place names, tags, or IDs.
- The declared-axis midpoint/range gate reuses the checked-in V22 measurement contracts: minimum total range 2.0 with policy midpoint 4 for module signals, and minimum total range 0.5 with policy midpoint 0 for AI scenario deltas.
- Option-geometry fields and duplicate-vector groups are descriptive review aids, not new pass/fail thresholds or psychometric evidence.
- Near-duplicate text is an advisory string heuristic, not a measurement gate.
- Always-first, always-last, and alternating fixtures use a fixed presentation seed. Presentation invariance separately holds semantic answer IDs constant across two different seeds.
