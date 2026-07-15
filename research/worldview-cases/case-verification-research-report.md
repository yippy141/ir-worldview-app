# Audit and Upgrade of the V17 IR Worldview Case Library

## Scope and method

I could not directly inspect the literal branch contents for `feature/v18-world-stage-ui` in this session, so I treated the six case headings you provided as the target inventory and rebuilt them into a v18-ready replacement pack. The correction standard below follows your requirements: neutral context, structured source records, explicit claim typing, stale/disputed claim flags, verified “resembles the logic of” readings, strongest rival readings, and explicit analogy limits.

The source base prioritizes primary and near-primary material: U.S. Department of State historical and treaty pages, FRUS, NATO official histories and communiqués, UN Security Council documents, OSCE reporting, U.S. Treasury, SWIFT, BIS, and Chinese official government pages. Where interpretation is unavoidable, I used authoritative scholarship and specialist analysis from RAND, *International Security*, Fordham International Law Journal, Brookings, CSIS, PIIE, and the National Security Archive. This matters because several of the cases are frequently oversimplified in public discourse: the Cuban Missile Crisis is often reduced to “13 days” and unilateral capitulation; Kosovo is often misdescribed as having settled the legality of humanitarian intervention; and the semiconductor-controls case is still moving as rules changed in 2022, 2023, 2024, 2025, and again in January 2026. citeturn11search0turn11search12turn11search13turn14search0turn20search8turn17search0turn17search7turn17search1turn17search22turn17search15

## Corrected structured JSON

The JSON below is a corrected replacement pack rather than a literal diff against the inaccessible branch file. It is designed to be copyable into a case-library data structure and to replace plain source-name strings with full source records.

```json
{
  "libraryId": "ir-worldview-case-library-v18-proposed",
  "language": "en-CA",
  "asOfDate": "2026-07-14",
  "notes": [
    "This pack avoids assigning any public figure, government, or movement to a worldview profile.",
    "Undated official history pages use null publicationDate rather than an invented date.",
    "The semiconductor-controls case is explicitly time-bounded because the policy environment is still changing."
  ],
  "cases": [
    {
      "caseId": "security-cuban-missile-escalation-ceilings",
      "theme": "Cuban Missile Crisis and escalation ceilings",
      "title": "Cuban Missile Crisis",
      "neutralContext": "In 1962, the United States and the Soviet Union entered a direct nuclear confrontation after the discovery of Soviet missile deployments in Cuba. The crisis ended through a mix of public and private bargaining: the Soviet Union withdrew missiles from Cuba; the United States publicly pledged not to invade Cuba; and Washington privately agreed to remove Jupiter missiles from Turkey. The case is best used to illustrate crisis management under shared catastrophe awareness, signalling limits, and the political utility of backchannels.",
      "claimLedger": [
        {
          "claimId": "cmc_c1",
          "claimType": "historical_fact",
          "text": "Soviet nuclear-capable missiles were deployed to Cuba in 1962, producing a direct superpower confrontation."
        },
        {
          "claimId": "cmc_c2",
          "claimType": "historical_fact",
          "text": "The settlement combined Soviet withdrawal from Cuba, a public U.S. non-invasion pledge, and a secret U.S. commitment to remove Jupiter missiles from Turkey."
        },
        {
          "claimId": "cmc_c3",
          "claimType": "interpretation",
          "text": "The crisis is better read as bargaining under an escalation ceiling than as simple unilateral capitulation by one side."
        },
        {
          "claimId": "cmc_c4",
          "claimType": "current_policy_claim",
          "text": "The analogy is strongest when adversaries recognise shared catastrophic risk and have some reliable signalling or backchannel capacity."
        }
      ],
      "sourceRecords": [
        {
          "sourceId": "cmc_src_01",
          "title": "The Cuban Missile Crisis, October 1962",
          "authorInstitution": "U.S. Department of State, Office of the Historian",
          "publicationDate": null,
          "url": "https://history.state.gov/milestones/1961-1968/cuban-missile-crisis",
          "sourceType": "official_history",
          "claimsSupported": ["cmc_c1", "cmc_c3"],
          "accessDate": "2026-07-14"
        },
        {
          "sourceId": "cmc_src_02",
          "title": "Cuban Missile Crisis and Aftermath",
          "authorInstitution": "U.S. Department of State, Foreign Relations of the United States",
          "publicationDate": null,
          "url": "https://history.state.gov/historicaldocuments/frus1961-63v11/comp1",
          "sourceType": "primary_document_collection",
          "claimsSupported": ["cmc_c1", "cmc_c2"],
          "accessDate": "2026-07-14"
        },
        {
          "sourceId": "cmc_src_03",
          "title": "The Jupiter Missiles and the Endgame of the Cuban Missile Crisis, 60 Years Ago",
          "authorInstitution": "National Security Archive",
          "publicationDate": "2023-02-16",
          "url": "https://nsarchive.gwu.edu/briefing-book/cuban-missile-crisis-nuclear-vault/2023-02-16/jupiter-missiles-and-endgame-cuban",
          "sourceType": "archival_scholarship",
          "claimsSupported": ["cmc_c2", "cmc_c3"],
          "accessDate": "2026-07-14"
        },
        {
          "sourceId": "cmc_src_04",
          "title": "The Cuban Missile Crisis @ 60: Nuclear Crisis Lasted 59 Days, Not Just 13",
          "authorInstitution": "National Security Archive",
          "publicationDate": "2022-10-04",
          "url": "https://nsarchive.gwu.edu/briefing-book-special-exhibit/cuba-cuban-missile-crisis-russia-programs/2022-10-04/cuban-missile",
          "sourceType": "archival_scholarship",
          "claimsSupported": ["cmc_c1", "cmc_c3"],
          "accessDate": "2026-07-14"
        }
      ],
      "staleOrDisputedClaims": [
        {
          "claim": "The crisis was only '13 days' long.",
          "status": "stale_or_overcompressed",
          "reason": "The familiar 13-day framing omits longer crisis dynamics and nuclear deployments that were already present.",
          "suggestedWording": "The most intense public phase lasted 13 days, but the broader nuclear crisis ran longer."
        },
        {
          "claim": "Kennedy simply forced Soviet capitulation.",
          "status": "disputed",
          "reason": "The settlement also involved reciprocal concessions, including the secret Jupiter missile deal.",
          "suggestedWording": "The crisis ended through reciprocal, partly secret bargaining under extreme escalation risk."
        }
      ],
      "verifiedProfileReading": {
        "bestFitProfileId": "constraint-first-realist",
        "bestFitProfileLabel": "Constraint-First Realist",
        "confidence": "high",
        "whyItResemblesTheLogicOf": "The case centres on escalation ceilings, bargaining under catastrophic risk, and the value of restraint once military advantage meets unacceptable downside risk.",
        "strongestRivalProfileId": "competitive-balancer",
        "strongestRivalProfileLabel": "Competitive Balancer",
        "whyRivalAlsoFits": "A rival reading treats the case as coercive signalling and credibility management under hard power rivalry.",
        "whereAnalogyBreaks": [
          "The crisis was a bipolar nuclear confrontation with unusually direct signalling channels.",
          "Elite-controlled missile deployments do not map neatly onto distributed cyber, economic, or AI incidents.",
          "Shared catastrophe awareness was unusually acute and unusually legible."
        ]
      },
      "claimsRequiringWordingChanges": [
        {
          "from": "shows firm resolve wins",
          "to": "shows that resolve and restraint were jointly necessary once escalation ceilings came into view"
        },
        {
          "from": "Soviet backdown",
          "to": "reciprocal de-escalation through public and private concessions"
        }
      ]
    },
    {
      "caseId": "security-alliance-burden-sharing-coalition-durability",
      "theme": "Alliance burden sharing and coalition durability",
      "title": "ISAF in Afghanistan",
      "neutralContext": "The NATO-led International Security Assistance Force in Afghanistan became one of the largest coalitions in modern history. It operated under a UN mandate and included both NATO allies and partners, but coalition members contributed unevenly and often imposed national caveats on how their forces could be used. The case is best used to examine how risk, domestic politics, strategy clarity, and mission design shape coalition durability beyond simple spending or troop-count metrics.",
      "claimLedger": [
        {
          "claimId": "isaf_c1",
          "claimType": "historical_fact",
          "text": "NATO assumed command of ISAF in August 2003, and at its height the force exceeded 130,000 troops from 51 NATO and partner nations."
        },
        {
          "claimId": "isaf_c2",
          "claimType": "historical_fact",
          "text": "The coalition experienced significant national caveats and unequal risk exposure."
        },
        {
          "claimId": "isaf_c3",
          "claimType": "interpretation",
          "text": "Coalition durability depended on political tolerance, strategy clarity, and mission-role allocation, not only on aggregate contributions."
        },
        {
          "claimId": "isaf_c4",
          "claimType": "current_policy_claim",
          "text": "Burden-sharing analogies should track risk, task, and political constraints rather than treating expenditure or headcount as sufficient proxies."
        }
      ],
      "sourceRecords": [
        {
          "sourceId": "isaf_src_01",
          "title": "ISAF's Mission in Afghanistan (2001-2014)",
          "authorInstitution": "NATO",
          "publicationDate": "2022-05-30",
          "url": "https://www.nato.int/en/what-we-do/operations-and-missions/isafs-mission-in-afghanistan-2001-2014",
          "sourceType": "official_history",
          "claimsSupported": ["isaf_c1"],
          "accessDate": "2026-07-14"
        },
        {
          "sourceId": "isaf_src_02",
          "title": "Final Communiqué",
          "authorInstitution": "NATO Meeting of Foreign Ministers",
          "publicationDate": "2007-12-07",
          "url": "https://www.nato.int/en/about-us/official-texts-and-resources/official-texts/2007/12/07/final-communique",
          "sourceType": "official_communique",
          "claimsSupported": ["isaf_c2", "isaf_c3"],
          "accessDate": "2026-07-14"
        },
        {
          "sourceId": "isaf_src_03",
          "title": "Comparing Caveats: Understanding the Sources of National Restrictions upon NATO’s Mission in Afghanistan",
          "authorInstitution": "Stephen M. Saideman and David P. Auerswald",
          "publicationDate": "2012",
          "url": "https://nwc.ndu.edu/Portals/71/Images/Publications/Comparing%20Caveats.pdf",
          "sourceType": "peer_reviewed_article",
          "claimsSupported": ["isaf_c2", "isaf_c3"],
          "accessDate": "2026-07-14"
        },
        {
          "sourceId": "isaf_src_04",
          "title": "Risking NATO: Testing the Limits of the Alliance in Afghanistan",
          "authorInstitution": "RAND Corporation",
          "publicationDate": "2010",
          "url": "https://www.rand.org/content/dam/rand/pubs/monographs/2010/RAND_MG974.pdf",
          "sourceType": "research_monograph",
          "claimsSupported": ["isaf_c3", "isaf_c4"],
          "accessDate": "2026-07-14"
        }
      ],
      "staleOrDisputedClaims": [
        {
          "claim": "Free-riding alone explains coalition friction.",
          "status": "disputed",
          "reason": "The literature shows caveats and contribution patterns also tracked domestic institutions, public tolerance, role design, and strategy ambiguity.",
          "suggestedWording": "Free-riding was one part of coalition strain, but domestic politics, caveats, and mission design also mattered."
        },
        {
          "claim": "More allied members automatically make a coalition more durable.",
          "status": "disputed",
          "reason": "Broader membership can bring legitimacy and resources, but also more caveats and coordination costs.",
          "suggestedWording": "Broader coalitions can expand legitimacy and resources, but may also deepen coordination and risk-sharing problems."
        }
      ],
      "verifiedProfileReading": {
        "bestFitProfileId": "coalition-pragmatist",
        "bestFitProfileLabel": "Coalition Pragmatist",
        "confidence": "high",
        "whyItResemblesTheLogicOf": "The case turns on how to keep a coalition politically intact when members differ on risk tolerance, mission scope, and speed.",
        "strongestRivalProfileId": "institution-builder",
        "strongestRivalProfileLabel": "Institution Builder",
        "whyRivalAlsoFits": "A rival reading emphasises formal institutions, burden-sharing rules, and repeated coordination mechanisms as the core issue.",
        "whereAnalogyBreaks": [
          "ISAF was a long, ground-intensive counterinsurgency under a UN mandate rather than a short coalition operation.",
          "NATO’s formal alliance structure is much thicker than many ad hoc coalitions.",
          "Casualty exposure and caveats were unusually salient compared with economic or regulatory coalitions."
        ]
      },
      "claimsRequiringWordingChanges": [
        {
          "from": "allies failed to do their share",
          "to": "allies contributed unevenly, with major variation in risk acceptance, caveats, and role allocation"
        },
        {
          "from": "burden sharing determines coalition success",
          "to": "burden sharing is one major determinant of coalition cohesion, alongside strategy clarity and domestic political tolerance"
        }
      ]
    },
    {
      "caseId": "security-arms-control-verification",
      "theme": "Arms-control verification",
      "title": "INF Treaty Verification Regime",
      "neutralContext": "The 1987 INF Treaty eliminated an entire class of U.S. and Soviet ground-launched missiles and paired those obligations with one of the most intrusive verification systems then built into a nuclear arms-control agreement. Verification relied on data exchanges, national technical means, on-site inspections, and continuous monitoring. The regime was highly innovative, but the later collapse of the treaty shows that verification can reduce uncertainty without permanently solving underlying political conflict.",
      "claimLedger": [
        {
          "claimId": "inf_c1",
          "claimType": "historical_fact",
          "text": "The INF Treaty banned U.S. and Soviet ground-launched ballistic and cruise missiles with ranges between 500 and 5,500 kilometres."
        },
        {
          "claimId": "inf_c2",
          "claimType": "historical_fact",
          "text": "Its verification regime included intrusive on-site inspections and continuous monitoring."
        },
        {
          "claimId": "inf_c3",
          "claimType": "interpretation",
          "text": "Verification lowered uncertainty and raised the political costs of cheating, but did not eliminate strategic distrust."
        },
        {
          "claimId": "inf_c4",
          "claimType": "current_policy_claim",
          "text": "INF-style lessons transfer most cleanly to countable hardware and observable supply chains, and less cleanly to dual-use, software-heavy technology domains."
        }
      ],
      "sourceRecords": [
        {
          "sourceId": "inf_src_01",
          "title": "Intermediate-Range Nuclear Forces Treaty",
          "authorInstitution": "U.S. Department of State",
          "publicationDate": null,
          "url": "https://2009-2017.state.gov/t/avc/trty/102360.htm",
          "sourceType": "official_treaty_text",
          "claimsSupported": ["inf_c1", "inf_c2"],
          "accessDate": "2026-07-14"
        },
        {
          "sourceId": "inf_src_02",
          "title": "History of the National and Nuclear Risk Reduction Center",
          "authorInstitution": "U.S. Department of State",
          "publicationDate": null,
          "url": "https://2021-2025.state.gov/history-of-the-national-and-nuclear-risk-reduction-center/",
          "sourceType": "official_history",
          "claimsSupported": ["inf_c2"],
          "accessDate": "2026-07-14"
        },
        {
          "sourceId": "inf_src_03",
          "title": "U.S. Intent To Withdraw from the INF Treaty, February 2, 2019",
          "authorInstitution": "U.S. Department of State",
          "publicationDate": "2019-02-02",
          "url": "https://2017-2021.state.gov/u-s-intent-to-withdraw-from-the-inf-treaty-february-2-2019/",
          "sourceType": "official_statement",
          "claimsSupported": ["inf_c3"],
          "accessDate": "2026-07-14"
        },
        {
          "sourceId": "inf_src_04",
          "title": "The Post-INF Treaty Crisis: Background and Next Steps",
          "authorInstitution": "Arms Control Association",
          "publicationDate": "2019-08-07",
          "url": "https://www.armscontrol.org/issue-briefs/2019-08/post-inf-treaty-crisis-background-next-steps",
          "sourceType": "authoritative_policy_analysis",
          "claimsSupported": ["inf_c1", "inf_c2", "inf_c3", "inf_c4"],
          "accessDate": "2026-07-14"
        }
      ],
      "staleOrDisputedClaims": [
        {
          "claim": "Verification solved mistrust.",
          "status": "stale_or_overstated",
          "reason": "Verification improved transparency and compliance confidence, but the treaty later unravelled over compliance disputes and political conflict.",
          "suggestedWording": "Verification reduced uncertainty and improved detectability, but did not remove strategic disagreement."
        },
        {
          "claim": "INF proves that strong verification guarantees durable arms control.",
          "status": "disputed",
          "reason": "Durability also depended on broader political relations and continued mutual willingness to comply.",
          "suggestedWording": "INF shows that intrusive verification can support compliance where political commitments remain viable."
        }
      ],
      "verifiedProfileReading": {
        "bestFitProfileId": "institution-builder",
        "bestFitProfileLabel": "Institution Builder",
        "confidence": "high",
        "whyItResemblesTheLogicOf": "The core logic is that repeat interaction, agreed procedures, and inspection architecture can stabilise competition by shrinking uncertainty.",
        "strongestRivalProfileId": "constraint-first-realist",
        "strongestRivalProfileLabel": "Constraint-First Realist",
        "whyRivalAlsoFits": "A rival reading stresses that verification mattered only because each side still feared the costs of unconstrained missile competition.",
        "whereAnalogyBreaks": [
          "INF addressed countable, physical delivery systems rather than invisible code or general-purpose models.",
          "The treaty was bilateral and highly specific, not a loose plurilateral norm.",
          "Modern dual-use technology ecosystems are more commercially diffuse than Cold War missile basing regimes."
        ]
      },
      "claimsRequiringWordingChanges": [
        {
          "from": "verification makes cheating impossible",
          "to": "verification can deter, detect, and politically expose cheating; it does not make cheating impossible"
        },
        {
          "from": "verification equals trust",
          "to": "verification is a substitute for trust, not proof that trust exists"
        }
      ]
    },
    {
      "caseId": "order-humanitarian-intervention-contested-authority",
      "theme": "Humanitarian intervention and contested authority",
      "title": "Kosovo 1999",
      "neutralContext": "NATO launched Operation Allied Force in March 1999 to halt a worsening humanitarian catastrophe in Kosovo after diplomacy failed. The intervention proceeded without prior UN Security Council authorisation, and only afterwards did the Council adopt Resolution 1244 to establish an international civil and security presence. The case remains central because it raises three separate questions that are often conflated: the scale of atrocities on the ground, the legality and legitimacy of using force without prior Council approval, and the burdens of post-conflict governance.",
      "claimLedger": [
        {
          "claimId": "kos_c1",
          "claimType": "historical_fact",
          "text": "NATO’s air campaign in Kosovo lasted 78 days and began without prior Security Council authorisation."
        },
        {
          "claimId": "kos_c2",
          "claimType": "historical_fact",
          "text": "OSCE reporting documented severe human-rights abuses and forced displacement against Kosovo Albanians."
        },
        {
          "claimId": "kos_c3",
          "claimType": "interpretation",
          "text": "Kosovo became a landmark debate over legitimacy without clear legality; it did not settle a general legal right of humanitarian intervention."
        },
        {
          "claimId": "kos_c4",
          "claimType": "current_policy_claim",
          "text": "Present-day analogies should distinguish moral urgency, legal authority, and the practical governance burdens that follow intervention."
        }
      ],
      "sourceRecords": [
        {
          "sourceId": "kos_src_01",
          "title": "Kosovo Air Campaign (March-June 1999)",
          "authorInstitution": "NATO",
          "publicationDate": "2024-10-21",
          "url": "https://www.nato.int/en/what-we-do/operations-and-missions/kosovo-air-campaign-march-june-1999",
          "sourceType": "official_history",
          "claimsSupported": ["kos_c1"],
          "accessDate": "2026-07-14"
        },
        {
          "sourceId": "kos_src_02",
          "title": "Kosovo/Kosova As Seen, As Told",
          "authorInstitution": "OSCE Kosovo Verification Mission / ODIHR",
          "publicationDate": "1999-11-05",
          "url": "https://cdn.osce.org/sites/default/files/f/documents/d/d/17772.pdf",
          "sourceType": "primary_human_rights_report",
          "claimsSupported": ["kos_c2"],
          "accessDate": "2026-07-14"
        },
        {
          "sourceId": "kos_src_03",
          "title": "Security Council Resolution 1244 (1999)",
          "authorInstitution": "United Nations Security Council",
          "publicationDate": "1999-06-10",
          "url": "https://docs.un.org/s/res/1244(1999)",
          "sourceType": "official_un_resolution",
          "claimsSupported": ["kos_c1", "kos_c3"],
          "accessDate": "2026-07-14"
        },
        {
          "sourceId": "kos_src_04",
          "title": "The Kosovo Report",
          "authorInstitution": "Independent International Commission on Kosovo",
          "publicationDate": "2000-10-23",
          "url": "https://reliefweb.int/report/albania/kosovo-report",
          "sourceType": "independent_commission_report",
          "claimsSupported": ["kos_c3", "kos_c4"],
          "accessDate": "2026-07-14"
        },
        {
          "sourceId": "kos_src_05",
          "title": "Kosovo and the Limits of International Law",
          "authorInstitution": "David Wippman",
          "publicationDate": "2001",
          "url": "https://ir.lawnet.fordham.edu/cgi/viewcontent.cgi?article=1813&context=ilj&httpsredir=1&referer=&sei-redir=1",
          "sourceType": "peer_reviewed_legal_scholarship",
          "claimsSupported": ["kos_c3", "kos_c4"],
          "accessDate": "2026-07-14"
        }
      ],
      "staleOrDisputedClaims": [
        {
          "claim": "Kosovo established a legal doctrine of humanitarian intervention.",
          "status": "disputed",
          "reason": "Legality remained contested, even among supporters who judged the intervention legitimate or justified.",
          "suggestedWording": "Kosovo intensified debate over legitimacy and legality; it did not settle a general doctrine."
        },
        {
          "claim": "Humanitarian necessity alone resolved the authority question.",
          "status": "disputed",
          "reason": "The case remained contested precisely because humanitarian urgency and lawful authority pulled in different directions.",
          "suggestedWording": "The case highlights tension between humanitarian urgency and contested authority."
        }
      ],
      "verifiedProfileReading": {
        "bestFitProfileId": "legitimacy-reader",
        "bestFitProfileLabel": "Legitimacy Reader",
        "confidence": "high",
        "whyItResemblesTheLogicOf": "The decisive puzzle is how authority is read, claimed, and contested when urgency is high but procedural legitimacy is incomplete.",
        "strongestRivalProfileId": "justice-forward-solidarist",
        "strongestRivalProfileLabel": "Justice-Forward Solidarist",
        "whyRivalAlsoFits": "A rival reading prioritises the duty to protect civilians from grave harm even when legal authorisation lags.",
        "whereAnalogyBreaks": [
          "Kosovo unfolded in a late-unipolar moment with a very specific NATO and UN relationship.",
          "The post-conflict governance architecture was unusually extensive.",
          "Later R2P debates changed the normative vocabulary even though they did not erase the earlier legal dispute."
        ]
      },
      "claimsRequiringWordingChanges": [
        {
          "from": "proved humanitarian intervention works",
          "to": "became a reference case for the tension between protection claims, legality, and post-conflict authority"
        },
        {
          "from": "NATO had authority",
          "to": "NATO asserted moral and political justification, while prior legal authority remained contested"
        }
      ]
    },
    {
      "caseId": "statecraft-sanctions-finance-network-chokepoints",
      "theme": "Sanctions, finance, and network chokepoints",
      "title": "Iran Sanctions and SWIFT Disconnection",
      "neutralContext": "The Iran sanctions episode is a classic case of coercion through financial centrality and network chokepoints. In 2012, SWIFT disconnected sanctioned Iranian banks following an EU Council decision, while U.S. Treasury officials treated that move as one part of a wider sanctions architecture involving oil restrictions, secondary pressure, and multilateral diplomatic coordination. The case is strongest when framed as networked coercion that raises costs and narrows options, not as a single silver bullet that automatically produces capitulation.",
      "claimLedger": [
        {
          "claimId": "irn_c1",
          "claimType": "historical_fact",
          "text": "In March 2012, SWIFT disconnected sanctioned Iranian banks following an EU decision."
        },
        {
          "claimId": "irn_c2",
          "claimType": "historical_fact",
          "text": "The pressure campaign worked through a broader package that combined financial sanctions, oil restrictions, and coalition enforcement."
        },
        {
          "claimId": "irn_c3",
          "claimType": "interpretation",
          "text": "Network chokepoints magnify leverage, but targets adapt through insulation, rerouting, and political mobilisation."
        },
        {
          "claimId": "irn_c4",
          "claimType": "current_policy_claim",
          "text": "Sanctions analogies are strongest for cost imposition, containment, or limited bargaining aims; they are weaker when used as promises of automatic capitulation or regime change."
        }
      ],
      "sourceRecords": [
        {
          "sourceId": "irn_src_01",
          "title": "Statement by Under Secretary David Cohen on Action by the EU and SWIFT to Terminate Service for Sanctioned Iranian Banks",
          "authorInstitution": "U.S. Department of the Treasury",
          "publicationDate": "2012-03-15",
          "url": "https://home.treasury.gov/news/press-releases/tg1451",
          "sourceType": "official_statement",
          "claimsSupported": ["irn_c1", "irn_c2"],
          "accessDate": "2026-07-14"
        },
        {
          "sourceId": "irn_src_02",
          "title": "SWIFT Instructed to Disconnect Sanctioned Iranian Banks Following EU Council Decision",
          "authorInstitution": "SWIFT",
          "publicationDate": "2012-03-15",
          "url": "https://www.swift.com/insights/press-releases/swift-instructed-to-disconnect-sanctioned-iranian-banks-following-eu-council-decision",
          "sourceType": "official_press_release",
          "claimsSupported": ["irn_c1"],
          "accessDate": "2026-07-14"
        },
        {
          "sourceId": "irn_src_03",
          "title": "Council Regulation (EU) No 267/2012 Concerning Restrictive Measures Against Iran",
          "authorInstitution": "Council of the European Union",
          "publicationDate": "2012-03-23",
          "url": "https://eur-lex.europa.eu/eli/reg/2012/267/oj/eng",
          "sourceType": "official_regulation",
          "claimsSupported": ["irn_c1", "irn_c2"],
          "accessDate": "2026-07-14"
        },
        {
          "sourceId": "irn_src_04",
          "title": "Weaponized Interdependence: How Global Economic Networks Shape State Coercion",
          "authorInstitution": "Henry Farrell and Abraham L. Newman",
          "publicationDate": "2019",
          "url": "https://www.belfercenter.org/publication/weaponized-interdependence-how-global-economic-networks-shape-state-coercion",
          "sourceType": "peer_reviewed_article_summary",
          "claimsSupported": ["irn_c3", "irn_c4"],
          "accessDate": "2026-07-14"
        },
        {
          "sourceId": "irn_src_05",
          "title": "The US-Iran Nuclear Deal and the Effectiveness of Economic Sanctions",
          "authorInstitution": "Cathleen Cimino-Isaacs, Gary Clyde Hufbauer, and Jeffrey J. Schott",
          "publicationDate": "2015-07-28",
          "url": "https://www.piie.com/blogs/trade-and-investment-policy-watch/us-iran-nuclear-deal-and-effectiveness-economic-sanctions",
          "sourceType": "authoritative_policy_analysis",
          "claimsSupported": ["irn_c2", "irn_c4"],
          "accessDate": "2026-07-14"
        }
      ],
      "staleOrDisputedClaims": [
        {
          "claim": "SWIFT alone crippled Iran.",
          "status": "disputed",
          "reason": "The disconnection amplified a wider package of financial and oil sanctions plus diplomatic coordination.",
          "suggestedWording": "SWIFT disconnection was a high-leverage node inside a broader multilateral pressure campaign."
        },
        {
          "claim": "Sanctions success can be read directly from headline economic pain.",
          "status": "disputed",
          "reason": "Pain, adaptation, and political outcomes can move differently.",
          "suggestedWording": "Economic pain is evidence of pressure, not automatic proof of policy success."
        }
      ],
      "verifiedProfileReading": {
        "bestFitProfileId": "competitive-balancer",
        "bestFitProfileLabel": "Competitive Balancer",
        "confidence": "high",
        "whyItResemblesTheLogicOf": "The case is fundamentally about exploiting asymmetric leverage inside a competitive system without using direct military force.",
        "strongestRivalProfileId": "structural-inequality-critic",
        "strongestRivalProfileLabel": "Structural Inequality Critic",
        "whyRivalAlsoFits": "A rival reading sees the same episode less as tactical balancing and more as hierarchy reproduced through control over financial plumbing.",
        "whereAnalogyBreaks": [
          "2012-era dollar and messaging centrality was unusually concentrated relative to a gradually fragmenting payments environment.",
          "Targets can develop more shadow channels, alternative messaging paths, and sanctions evasion capacity over time.",
          "Network coercion is easier to demonstrate in finance than in many less-centralised commercial ecosystems."
        ]
      },
      "claimsRequiringWordingChanges": [
        {
          "from": "sanctions forced compliance",
          "to": "sanctions helped generate leverage by raising costs, narrowing financial options, and strengthening bargaining pressure"
        },
        {
          "from": "financial chokepoints end the game",
          "to": "financial chokepoints can sharply increase leverage, but adaptation and coalition maintenance remain decisive"
        }
      ]
    },
    {
      "caseId": "technology-industrial-policy-controls-developmental-autonomy",
      "theme": "Industrial policy, technology controls, and developmental autonomy",
      "title": "Advanced Semiconductor Export Controls and Domestic Capacity-Building",
      "neutralContext": "Since October 2022, the United States has imposed and repeatedly tightened export controls on advanced computing and semiconductor-manufacturing items destined for the People’s Republic of China. China has responded with intensified state-backed semiconductor financing, industrial-policy mobilisation, and explicit self-reliance language. Because this case is still unfolding, it should be treated as an 'as of' case rather than as a closed historical verdict. Its analytic value lies in showing the interaction between external chokepoints and internal capacity-building.",
      "claimLedger": [
        {
          "claimId": "chip_c1",
          "claimType": "historical_fact",
          "text": "BIS imposed major advanced-computing and semiconductor-manufacturing export controls in October 2022 and tightened them again in 2023, 2024, 2025, and January 2026."
        },
        {
          "claimId": "chip_c2",
          "claimType": "historical_fact",
          "text": "China expanded state-backed semiconductor financing and publicly linked chip development to self-reliance and technology-led growth."
        },
        {
          "claimId": "chip_c3",
          "claimType": "interpretation",
          "text": "Export controls can slow frontier access and raise costs, but they also intensify domestic substitution and industrial policy."
        },
        {
          "claimId": "chip_c4",
          "claimType": "current_policy_claim",
          "text": "Developmental autonomy in frontier technology requires both chokepoint management and durable domestic ecosystem building; the medium-term outcome remains unsettled as of 2026-07-14."
        }
      ],
      "sourceRecords": [
        {
          "sourceId": "chip_src_01",
          "title": "Commerce Implements New Export Controls on Advanced Computing and Semiconductor Manufacturing Items to the People’s Republic of China",
          "authorInstitution": "U.S. Bureau of Industry and Security",
          "publicationDate": "2022-10-07",
          "url": "https://www.bis.gov/press-release/commerce-implements-new-export-controls-advanced-computing-semiconductor-manufacturing-items-peoples",
          "sourceType": "official_press_release",
          "claimsSupported": ["chip_c1"],
          "accessDate": "2026-07-14"
        },
        {
          "sourceId": "chip_src_02",
          "title": "Commerce Strengthens Restrictions on Advanced Computing Semiconductors to Enhance Foundry Due Diligence and Prevent Diversion to PRC",
          "authorInstitution": "U.S. Bureau of Industry and Security",
          "publicationDate": "2025-01-15",
          "url": "https://www.bis.gov/press-release/commerce-strengthens-restrictions-advanced-computing-semiconductors-enhance-foundry-due-diligence-prevent",
          "sourceType": "official_press_release",
          "claimsSupported": ["chip_c1"],
          "accessDate": "2026-07-14"
        },
        {
          "sourceId": "chip_src_03",
          "title": "Department of Commerce Revises License Review Policy for Semiconductors Exported to China",
          "authorInstitution": "U.S. Bureau of Industry and Security",
          "publicationDate": "2026-01-13",
          "url": "https://www.bis.gov/press-release/department-commerce-revises-license-review-policy-semiconductors-exported-china",
          "sourceType": "official_press_release",
          "claimsSupported": ["chip_c1", "chip_c4"],
          "accessDate": "2026-07-14"
        },
        {
          "sourceId": "chip_src_04",
          "title": "Six Banks to Invest in Big Way in IC Fund",
          "authorInstitution": "The State Council of the People’s Republic of China",
          "publicationDate": "2024-05-29",
          "url": "https://english.www.gov.cn/news/202405/29/content_WS66569746c6d0868f4e8e7987.html",
          "sourceType": "official_government_news",
          "claimsSupported": ["chip_c2"],
          "accessDate": "2026-07-14"
        },
        {
          "sourceId": "chip_src_05",
          "title": "Unleashing ‘New Quality Productive Forces’: China’s Strategy for Technology-Led Growth",
          "authorInstitution": "Arthur R. Kroeber",
          "publicationDate": "2024-06-04",
          "url": "https://www.brookings.edu/articles/unleashing-new-quality-productive-forces-chinas-strategy-for-technology-led-growth/",
          "sourceType": "authoritative_policy_analysis",
          "claimsSupported": ["chip_c2", "chip_c3", "chip_c4"],
          "accessDate": "2026-07-14"
        },
        {
          "sourceId": "chip_src_06",
          "title": "The Limits of Chip Export Controls in Meeting the China Challenge",
          "authorInstitution": "Sujai Shivakumar, Charles Wessner, and Thomas Howell",
          "publicationDate": "2025-04-14",
          "url": "https://www.csis.org/analysis/limits-chip-export-controls-meeting-china-challenge",
          "sourceType": "authoritative_policy_analysis",
          "claimsSupported": ["chip_c3", "chip_c4"],
          "accessDate": "2026-07-14"
        }
      ],
      "staleOrDisputedClaims": [
        {
          "claim": "Export controls will stop technological catch-up.",
          "status": "disputed",
          "reason": "Evidence points more clearly to delay, cost imposition, and adaptation pressure than to permanent stoppage.",
          "suggestedWording": "Export controls can delay access, raise costs, and shape trajectories; they do not by themselves guarantee permanent technological denial."
        },
        {
          "claim": "Self-reliance means full autarky.",
          "status": "stale_or_overstated",
          "reason": "The observable strategy mixes substitution, financing, diversification, and selective continued external links rather than literal autarky.",
          "suggestedWording": "The strategy aims to reduce exposure to external chokepoints while preserving selected external linkages where useful."
        }
      ],
      "verifiedProfileReading": {
        "bestFitProfileId": "development-sovereignty-builder",
        "bestFitProfileLabel": "Development-Sovereignty Builder",
        "confidence": "high",
        "whyItResemblesTheLogicOf": "The case is centrally about preserving room to manoeuvre through public capacity, domestic ecosystem building, and reduced vulnerability to external controls.",
        "strongestRivalProfileId": "structural-inequality-critic",
        "strongestRivalProfileLabel": "Structural Inequality Critic",
        "whyRivalAlsoFits": "A rival reading emphasises hierarchy, dependence, and how chokepoints reproduce unequal power in the global political economy.",
        "whereAnalogyBreaks": [
          "Semiconductors are unusually capital-intensive, upstream-dependent, and tightly linked to both civilian and military capability.",
          "This is not a closed historical case; policy, enforcement, and firm adaptation are still moving.",
          "Lessons from chip controls do not automatically transfer to every frontier technology domain."
        ]
      },
      "claimsRequiringWordingChanges": [
        {
          "from": "controls can stop development",
          "to": "controls can slow frontier development and redirect industrial strategy, but do not by themselves settle the long-run outcome"
        },
        {
          "from": "autonomy through decoupling",
          "to": "greater autonomy through selective insulation, domestic capacity-building, and reduced exposure to key chokepoints"
        }
      ]
    }
  ]
}
```

## Case audit notes

The Cuban Missile Crisis card should be kept, but the narrative needs to move away from triumphalism and compression. Official State Department history and FRUS confirm the basic confrontation, while the National Security Archive materially strengthens the record on the secret Jupiter trade and on the misleadingly narrow “13 days” shorthand. That combination supports a neutral context in which both coercion and restraint mattered, and it makes the strongest profile reading a restraint-centred one rather than a simple “win through pressure” reading. citeturn11search0turn11search12turn11search13turn11search9

The alliance burden-sharing card is most defensible when anchored in ISAF rather than generic NATO rhetoric. NATO’s own official history confirms the scale of the coalition and the multi-year UN-mandated mission, while authoritative work by Saideman and Auerswald, and RAND’s Afghanistan study, shows that caveats, domestic institutions, strategy ambiguity, and casualty politics all shaped durability. That means the current card should not imply that burden sharing is reducible to free-riding or spending shares alone. citeturn22search0turn11search3turn26view0turn26view1

The arms-control verification card is analytically strong, but only if it is written with more discipline. The INF Treaty really did create an unusually intrusive verification regime, including inspections and monitoring, yet later compliance disputes and withdrawal show that verification is not a magic solvent for distrust. The corrected reading therefore fits an institution-building logic best, with a realist rival that reminds the reader that institutions endure only when strategic incentives still support them. citeturn24search0turn13search24turn24search26turn13search26

The humanitarian intervention card should be tightened around Kosovo’s three-part structure: atrocities, authority, and aftermath. NATO’s own record, OSCE human-rights reporting, UN Security Council Resolution 1244, the Kosovo Commission’s later “illegal but legitimate” framing, and Wippman’s legal analysis all point in the same editorial direction: the card should not say Kosovo settled the law. The best-fit profile is therefore about contested legitimacy and authority, while the strongest rival remains justice-first protectionism. citeturn14search0turn23search0turn20search8turn19search0turn27view4

The sanctions-and-chokepoints card should be rebuilt around the Iran/SWIFT episode as a networked coercion case, not a one-button coercion story. Treasury and SWIFT both document the March 2012 disconnection; the EU regulation shows the legal basis; Farrell and Newman explain why central nodes create leverage; and PIIE’s Iran analysis shows how coalition enforcement and oil restrictions mattered alongside financial measures. That supports a competitive-balancing reading with a strong political-economy rival. citeturn14search2turn14search3turn15search1turn31view0turn30view0

The industrial-policy and technology-controls card is the most time-sensitive and therefore the one that most needs an explicit “as of” stamp. BIS’s 2022, 2025, and 2026 actions show a repeatedly adjusted controls architecture, while official Chinese government reporting and Brookings/CSIS analysis show a paired response of self-reliance rhetoric, state-backed financing, and domestic ecosystem mobilisation. The case is useful, but only if the wording avoids determinism and clearly flags that medium-term outcomes are still unsettled. citeturn17search0turn17search22turn17search15turn18search0turn29view2turn27view1

## Editorial change memo

The main editorial problem across the six cards is not that the topics are wrong. It is that the likely current phrasing risks collapsing historical fact, interpretation, and present-policy inference into a single register. The corrected pack above fixes that by giving each case a typed claim ledger and by attaching source records to concrete claims rather than to the case in the abstract.

The strongest recurring wording repair is to replace certainty with calibrated scope. In practice, that means changing lines such as “proved,” “forced,” “established,” or “shows that X wins” into language about tendencies, pressures, trade-offs, and conditions. The sources above repeatedly support that move: Cuba ended through reciprocal concessions, not pure capitulation; ISAF coalition stress came from caveats and domestic politics as well as contribution gaps; INF verification improved detectability but did not guarantee political durability; Kosovo sharpened the authority debate rather than resolving it; Iran sanctions relied on coalition enforcement and adaptation dynamics; and semiconductor controls are best described as shaping trajectories rather than dictating final outcomes. citeturn11search13turn26view0turn24search26turn27view4turn30view0turn27view1

The second recurring repair is to keep profile language analogical rather than classificatory. “Resembles the logic of” is the right register; “is a case of” is too strong. That matters most in Kosovo and the sanctions card, where two rival readings are both genuinely strong, and in the semiconductor card, where the same facts can be read as autonomy-building or as structural hierarchy. The JSON therefore adds a strongest-rival field to prevent one-sided analogising.

The third repair is source hygiene. Where the present data model still uses plain source-name strings, each should be replaced with typed source records carrying a stable `sourceId`, institutional or author attribution, publication date when known, URL, source type, supported claim IDs, and access date. For undated official pages, `null` is better than a guessed date. For moving cases, especially semiconductor controls, an explicit `asOfDate` is necessary because the factual substrate is changing. citeturn17search0turn17search1turn17search22turn17search15

## Implementation notes

If you want this to drop cleanly into a v18 library, I would keep the top-level pattern used above: one case object per card, each with `neutralContext`, `claimLedger`, `sourceRecords`, `staleOrDisputedClaims`, `verifiedProfileReading`, and `claimsRequiringWordingChanges`. That structure makes future red-teaming much easier because each dispute can be traced to a discrete claim and a discrete source record rather than to a prose blob.

The one case I would mark for the earliest re-review is the export-controls card. BIS already revised the framework more than once after the original October 2022 rule, and official January 2026 licensing changes show that implementation is still not a settled endpoint. I would therefore add a repo-side reminder to review that card again within one or two release cycles, while the five historical cards can be treated as stable unless you decide to widen them with new comparators. citeturn17search0turn17search7turn17search1turn17search22turn17search15
