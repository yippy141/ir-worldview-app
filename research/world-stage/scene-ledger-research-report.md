# World Stage Editorial Scene Ledger for the IR Worldview Inventory

## Scope and method

This ledger is designed for a homepage editorial map, not for operational intelligence. It uses public, source-backed evidence to show how the same geopolitical terrain re-orders under five different strategic questions. Country-role labels are intentionally constrained to the categories you specified: formal treaty ally, strategic partner, transactional partner, competitor, exposed or dependent actor, hedging actor, contested relationship, and outside the active lens. Where public evidence supports only a looser characterization, confidence is reduced rather than overstated. citeturn1search0turn0search1turn16search0turn15search7turn3search1turn7search1turn10search0turn12search1

Coordinates are rounded, public, homepage-safe approximations intended for cartography rather than precise facility geolocation. Base names, fab sites, cloud regions, ports, and governance nodes are all public and non-sensitive, but a simplified map can still mislead by implying fixed hierarchy, seamless interoperability, or point-to-point flows that are in practice mediated by law, politics, host-country consent, corporate contracting, export controls, and infrastructure bottlenecks. Claims likely to become stale within six months are explicitly flagged inside each scene’s caveats. citeturn24search3turn1search6turn19search1turn27search2turn13search1turn23search4

## Structured JSON

```json
{
  "researchRunDate": "2026-07-14",
  "product": "IR Worldview Inventory - World Stage homepage scene ledger",
  "editorialNotes": {
    "intendedUse": "Educational editorial mapping, not live intelligence",
    "coordinatePolicy": "Rounded public approximations for homepage cartography",
    "magnitudePolicy": "No invented quantitative magnitudes; 1-3 values are editorial ordinal weights only"
  },
  "scenes": [
    {
      "sceneId": "us_alliance_security_lens",
      "publicLabel": "Familiar U.S.-alliance security lens",
      "oneSentencePurpose": "Show the Indo-Pacific as a treaty-and-posture system centered on U.S. forward presence, host-nation infrastructure, and distributed deterrence.",
      "lensOwner": "Washington-centered security planning view",
      "evidenceWindow": "asOf 2026-07-14; treaty texts remain in force, posture details use latest public material cited",
      "countryRoles": [
        {
          "iso3": "USA",
          "role": "lens owner",
          "rationale": "This scene is organized around U.S. treaty commitments, forward posture, and budgeted resilience investments in the Indo-Pacific.",
          "confidence": "high",
          "sourceIds": ["SRC01", "SRC05", "SRC06", "SRC08"]
        },
        {
          "iso3": "JPN",
          "role": "formal treaty ally",
          "rationale": "The 1960 Treaty of Mutual Cooperation and Security and Article VI basing arrangements make Japan a core host and treaty partner.",
          "confidence": "high",
          "sourceIds": ["SRC01", "SRC02", "SRC09", "SRC10"]
        },
        {
          "iso3": "KOR",
          "role": "formal treaty ally",
          "rationale": "The 1953 Mutual Defense Treaty and the centrality of Camp Humphreys make South Korea a core treaty and posture node.",
          "confidence": "high",
          "sourceIds": ["SRC03", "SRC11"]
        },
        {
          "iso3": "PHL",
          "role": "formal treaty ally",
          "rationale": "The 1951 Mutual Defense Treaty, Visiting Forces Agreement framework, and EDCA expansion place the Philippines inside the active alliance map.",
          "confidence": "high",
          "sourceIds": ["SRC04", "SRC05"]
        },
        {
          "iso3": "AUS",
          "role": "formal treaty ally",
          "rationale": "ANZUS and the U.S. Force Posture Initiatives, especially Marine Rotational Force-Darwin and related infrastructure, make Australia a key alliance platform.",
          "confidence": "high",
          "sourceIds": ["SRC06", "SRC07"]
        },
        {
          "iso3": "IND",
          "role": "strategic partner",
          "rationale": "Official U.S.-India and Indian statements describe a comprehensive global strategic partnership, but not a formal mutual-defense treaty.",
          "confidence": "high",
          "sourceIds": ["SRC14"]
        },
        {
          "iso3": "TWN",
          "role": "exposed or dependent actor",
          "rationale": "U.S. ties are officially robust but unofficial, grounded in the Taiwan Relations Act rather than a defense treaty; Taiwan sits inside the lens as a contingency-shaping actor.",
          "confidence": "high",
          "sourceIds": ["SRC13"]
        },
        {
          "iso3": "CHN",
          "role": "competitor",
          "rationale": "Recent U.S. Indo-Pacific posture documents explicitly prioritize deterrence against the PRC, making China the principal competitive reference point in this lens.",
          "confidence": "high",
          "sourceIds": ["SRC08"]
        }
      ],
      "nodes": [
        {
          "id": "n_us_washington",
          "kind": "capital",
          "label": "Washington, DC",
          "coordinates": [38.907, -77.037],
          "importance": 3,
          "whyItMatters": "Treaty, budget, and force-posture decisions that structure the alliance map are made here.",
          "confidence": "high",
          "sourceIds": ["SRC05", "SRC08", "SRC14"]
        },
        {
          "id": "n_jp_yokosuka",
          "kind": "fleet",
          "label": "Yokosuka",
          "coordinates": [35.281, 139.667],
          "importance": 3,
          "whyItMatters": "Home to Fleet Activities Yokosuka, 7th Fleet headquarters, and the U.S. Navy's only permanently forward-deployed carrier strike group.",
          "confidence": "high",
          "sourceIds": ["SRC10"]
        },
        {
          "id": "n_jp_kadena",
          "kind": "base",
          "label": "Kadena Air Base",
          "coordinates": [26.356, 127.768],
          "importance": 3,
          "whyItMatters": "Officially described as the hub of airpower in the Pacific, Kadena symbolizes the air component of the alliance lens.",
          "confidence": "high",
          "sourceIds": ["SRC09"]
        },
        {
          "id": "n_kr_humphreys",
          "kind": "base",
          "label": "Camp Humphreys",
          "coordinates": [36.967, 127.028],
          "importance": 3,
          "whyItMatters": "The largest overseas U.S. military installation anchors the Korean Peninsula portion of the alliance map.",
          "confidence": "high",
          "sourceIds": ["SRC11"]
        },
        {
          "id": "n_ph_manila",
          "kind": "capital",
          "label": "Manila",
          "coordinates": [14.600, 120.984],
          "importance": 2,
          "whyItMatters": "Alliance diplomacy, VFA/EDCA implementation, and maritime-security coordination are politically routed through Manila.",
          "confidence": "high",
          "sourceIds": ["SRC04", "SRC05"]
        },
        {
          "id": "n_au_darwin",
          "kind": "base",
          "label": "Darwin",
          "coordinates": [-12.463, 130.846],
          "importance": 2,
          "whyItMatters": "Darwin hosts Marine Rotational Force-Darwin and sits inside the U.S. Force Posture Initiatives as a recurring alliance platform.",
          "confidence": "high",
          "sourceIds": ["SRC07"]
        },
        {
          "id": "n_us_guam",
          "kind": "base",
          "label": "Andersen AFB and Joint Region Marianas",
          "coordinates": [13.584, 144.930],
          "importance": 3,
          "whyItMatters": "Guam is a public, official hub for Indo-Pacific power projection and distributed posture resilience.",
          "confidence": "high",
          "sourceIds": ["SRC12"]
        },
        {
          "id": "n_jp_tokyo",
          "kind": "capital",
          "label": "Tokyo",
          "coordinates": [35.676, 139.650],
          "importance": 2,
          "whyItMatters": "The treaty is bilateral, but alliance politics, host-nation support, and force-modernization choices are also political decisions made in Tokyo.",
          "confidence": "high",
          "sourceIds": ["SRC01", "SRC02"]
        }
      ],
      "flows": [
        {
          "id": "f_us_japan_treaty",
          "kind": "military",
          "label": "U.S.-Japan treaty and basing framework",
          "from": "n_us_washington",
          "to": "n_jp_tokyo",
          "direction": "two-way",
          "weight": 3,
          "plain-language meaning": "Washington and Tokyo are linked by a standing mutual-security treaty plus facilities-and-areas arrangements that make Japan a core host for U.S. forces.",
          "confidence": "high",
          "sourceIds": ["SRC01", "SRC02"]
        },
        {
          "id": "f_us_rok_treaty",
          "kind": "military",
          "label": "U.S.-ROK mutual defense and basing",
          "from": "n_us_washington",
          "to": "n_kr_humphreys",
          "direction": "two-way",
          "weight": 3,
          "plain-language meaning": "The U.S.-ROK treaty underwrites the continued stationing of U.S. land, air, and sea forces in and about South Korea.",
          "confidence": "high",
          "sourceIds": ["SRC03", "SRC11"]
        },
        {
          "id": "f_us_ph_mdt_edca",
          "kind": "military",
          "label": "U.S.-Philippines MDT plus EDCA access",
          "from": "n_us_washington",
          "to": "n_ph_manila",
          "direction": "two-way",
          "weight": 3,
          "plain-language meaning": "The alliance with the Philippines combines the 1951 treaty with EDCA access and infrastructure arrangements that expand practical interoperability.",
          "confidence": "high",
          "sourceIds": ["SRC04", "SRC05"]
        },
        {
          "id": "f_us_au_darwin",
          "kind": "military",
          "label": "U.S. rotational posture through Darwin",
          "from": "n_us_washington",
          "to": "n_au_darwin",
          "direction": "two-way",
          "weight": 2,
          "plain-language meaning": "Darwin is a recurring rotational posture node rather than a classic treaty-base equivalent, which is why it should be mapped as alliance infrastructure, not as identical to Japan or Korea.",
          "confidence": "high",
          "sourceIds": ["SRC06", "SRC07"]
        },
        {
          "id": "f_guam_forward_posture",
          "kind": "military",
          "label": "Guam to forward alliance arc",
          "from": "n_us_guam",
          "to": "n_jp_kadena",
          "direction": "two-way",
          "weight": 2,
          "plain-language meaning": "A simplified homepage version can depict Guam and Japan as linked posture nodes in a distributed U.S. forward network, though the underlying authorities and missions differ by location.",
          "confidence": "medium",
          "sourceIds": ["SRC08", "SRC09", "SRC12"]
        }
      ],
      "caveats": [
        "Stale≤6mo: U.S. tactical-aircraft laydown, FY-budgeted posture projects, and EDCA implementation pace can change quickly.",
        "A simplified homepage map may wrongly imply that all treaty partners offer identical legal authorities, domestic political consent, and military access; they do not.",
        "Taiwan should not be colored or labeled as a formal treaty ally in this scene because the U.S. relationship is explicitly unofficial and law-based rather than treaty-based."
      ],
      "sensitiveOrDisputedClassifications": [
        "Taiwan classification is highly sensitive; 'exposed or dependent actor' is used here to avoid implying diplomatic recognition or a mutual-defense treaty.",
        "Darwin is a rotational posture site, not a sovereign transfer of control; mapping it like a permanent U.S. base would mislead."
      ],
      "missingEvidence": [
        "Public sources do not provide a single authoritative point-to-point map of legal access, command authorities, and contingency commitments across all alliance nodes.",
        "Public budget and posture documents do not fully capture classified contingency planning."
      ]
    },
    {
      "sceneId": "beijing_regional_security_lens",
      "publicLabel": "Beijing-centered regional-security lens",
      "oneSentencePurpose": "Show regional security as Beijing might editorially center it: sovereignty disputes, nearby theaters, strategic partnerships, and selective external-access infrastructure.",
      "lensOwner": "Beijing-centered regional-security view",
      "evidenceWindow": "asOf 2026-07-14; uses PRC official white papers, MFA statements, MOD briefings, and partner-government material",
      "countryRoles": [
        {
          "iso3": "CHN",
          "role": "lens owner",
          "rationale": "The scene is organized around PRC defense policy, sovereignty claims, regional consultation mechanisms, and security-partnership arrangements.",
          "confidence": "high",
          "sourceIds": ["SRC15", "SRC16", "SRC21"]
        },
        {
          "iso3": "RUS",
          "role": "strategic partner",
          "rationale": "Official PRC statements define the relationship as a 'new-era comprehensive strategic partnership of coordination' while explicitly saying it is not a Cold War-style alliance.",
          "confidence": "high",
          "sourceIds": ["SRC17"]
        },
        {
          "iso3": "PAK",
          "role": "strategic partner",
          "rationale": "China and Pakistan officially describe their relationship as an all-weather strategic cooperative partnership, with CPEC and Gwadar embedded in wider cooperation.",
          "confidence": "high",
          "sourceIds": ["SRC18", "SRC19"]
        },
        {
          "iso3": "KHM",
          "role": "exposed or dependent actor",
          "rationale": "Cambodia's Ream modernization and joint logistics/training center materially pull Cambodia into the Beijing-centered security picture, even as Phnom Penh rejects claims of exclusivity.",
          "confidence": "medium",
          "sourceIds": ["SRC22"]
        },
        {
          "iso3": "PHL",
          "role": "contested relationship",
          "rationale": "China and the Philippines maintain a bilateral consultation mechanism on the South China Sea, but PRC official language simultaneously frames Philippine maritime actions as infringements.",
          "confidence": "high",
          "sourceIds": ["SRC20"]
        },
        {
          "iso3": "TWN",
          "role": "contested relationship",
          "rationale": "PRC white papers and Eastern Theater statements treat Taiwan as a sovereignty issue and a core military-theater focus, not as an external peer state.",
          "confidence": "high",
          "sourceIds": ["SRC21", "SRC23"]
        },
        {
          "iso3": "USA",
          "role": "competitor",
          "rationale": "PRC defense and security documents frame U.S.-led alliances and military activity as central adverse pressures in the regional environment.",
          "confidence": "medium",
          "sourceIds": ["SRC15", "SRC16"]
        }
      ],
      "nodes": [
        {
          "id": "n_cn_beijing",
          "kind": "capital",
          "label": "Beijing",
          "coordinates": [39.904, 116.407],
          "importance": 3,
          "whyItMatters": "Beijing is the political and doctrinal center of this lens, where sovereignty, security concepts, and partnership designations are articulated.",
          "confidence": "high",
          "sourceIds": ["SRC15", "SRC16", "SRC17"]
        },
        {
          "id": "n_cn_nanjing",
          "kind": "fleet",
          "label": "Eastern Theater command axis",
          "coordinates": [32.060, 118.797],
          "importance": 3,
          "whyItMatters": "Public Eastern Theater statements make this axis the most visible operational reference point for cross-strait pressure and signaling.",
          "confidence": "high",
          "sourceIds": ["SRC23"]
        },
        {
          "id": "n_cn_zhanjiang",
          "kind": "fleet",
          "label": "Zhanjiang",
          "coordinates": [21.270, 110.359],
          "importance": 2,
          "whyItMatters": "Official PRC material links the Southern Theater Navy to Zhanjiang, making it a practical anchor for the South China Sea part of the lens.",
          "confidence": "medium",
          "sourceIds": ["SRC24"]
        },
        {
          "id": "n_cn_xiamen",
          "kind": "governance",
          "label": "Xiamen",
          "coordinates": [24.479, 118.089],
          "importance": 2,
          "whyItMatters": "Xiamen hosted the 2025 China-Philippines Bilateral Consultation Mechanism meeting on the South China Sea.",
          "confidence": "high",
          "sourceIds": ["SRC20"]
        },
        {
          "id": "n_kh_ream",
          "kind": "port",
          "label": "Ream Naval Base",
          "coordinates": [10.503, 103.600],
          "importance": 2,
          "whyItMatters": "Ream is now publicly tied to the Cambodia-China joint logistics and training center, making it a key external-access node in this lens.",
          "confidence": "medium",
          "sourceIds": ["SRC22"]
        },
        {
          "id": "n_pk_gwadar",
          "kind": "port",
          "label": "Gwadar",
          "coordinates": [25.121, 62.325],
          "importance": 2,
          "whyItMatters": "Gwadar is a perennial symbol node for CPEC, strategic depth, and westward connectivity in Beijing-centered mapping.",
          "confidence": "high",
          "sourceIds": ["SRC19"]
        },
        {
          "id": "n_ru_moscow",
          "kind": "capital",
          "label": "Moscow",
          "coordinates": [55.756, 37.617],
          "importance": 2,
          "whyItMatters": "Moscow matters here not because it is a regional Asian node, but because public PRC documents elevate Moscow as Beijing's highest-level strategic partner.",
          "confidence": "high",
          "sourceIds": ["SRC17"]
        },
        {
          "id": "n_ph_manila_2",
          "kind": "capital",
          "label": "Manila",
          "coordinates": [14.600, 120.984],
          "importance": 2,
          "whyItMatters": "From the Beijing-centered viewpoint, Manila is both dispute counterpart and dialogue counterpart.",
          "confidence": "high",
          "sourceIds": ["SRC20"]
        }
      ],
      "flows": [
        {
          "id": "f_cn_ru_strategic",
          "kind": "governance",
          "label": "Beijing-Moscow strategic coordination",
          "from": "n_cn_beijing",
          "to": "n_ru_moscow",
          "direction": "two-way",
          "weight": 3,
          "plain-language meaning": "PRC and Russian official texts describe a very high-level strategic partnership, but not a formal mutual-defense alliance.",
          "confidence": "high",
          "sourceIds": ["SRC17"]
        },
        {
          "id": "f_cn_pk_cpec",
          "kind": "supply-chain",
          "label": "Beijing-Gwadar CPEC corridor",
          "from": "n_cn_beijing",
          "to": "n_pk_gwadar",
          "direction": "two-way",
          "weight": 2,
          "plain-language meaning": "Gwadar is best shown as a CPEC-linked strategic connectivity node rather than as proof of a public PRC overseas naval base claim.",
          "confidence": "high",
          "sourceIds": ["SRC18", "SRC19"]
        },
        {
          "id": "f_cn_kh_ream",
          "kind": "military",
          "label": "Beijing-Ream logistics and training link",
          "from": "n_cn_beijing",
          "to": "n_kh_ream",
          "direction": "two-way",
          "weight": 2,
          "plain-language meaning": "Public Cambodia and PRC material now openly links Ream to a Cambodia-China joint logistics and training center, even while Cambodia rejects the idea of a foreign-exclusive base.",
          "confidence": "medium",
          "sourceIds": ["SRC22"]
        },
        {
          "id": "f_cn_ph_bcm",
          "kind": "governance",
          "label": "Xiamen-Manila South China Sea consultation channel",
          "from": "n_cn_xiamen",
          "to": "n_ph_manila_2",
          "direction": "two-way",
          "weight": 1,
          "plain-language meaning": "Even in a contested relationship, an official bilateral consultation mechanism exists and should be shown as a governance channel rather than as normal strategic trust.",
          "confidence": "high",
          "sourceIds": ["SRC20"]
        }
      ],
      "caveats": [
        "Stale≤6mo: PRC military exercises around Taiwan, rhetoric in regular press briefings, and the public framing of Ream can shift quickly.",
        "A simplified homepage map may wrongly imply that all PRC partnerships are equivalent; PRC-Russia, PRC-Pakistan, and PRC-Cambodia relationships differ in legal form, capability depth, and strategic purpose.",
        "This lens should not convert sovereignty claims into internationally settled facts; it should depict Beijing's view, not adjudicate disputes."
      ],
      "sensitiveOrDisputedClassifications": [
        "Taiwan classification is highly sensitive; wording here reflects PRC official framing without endorsing it.",
        "Ream Naval Base status is disputed; public evidence supports a joint logistics/training center, but exclusivity and wartime-use assumptions remain contested in open sources."
      ],
      "missingEvidence": [
        "Public sources do not reveal confidential military understandings, actual contingency permissions, or operational access terms at Ream or Gwadar.",
        "Open-source PRC materials identify theaters and partnerships more readily than detailed command-and-control arrangements."
      ]
    },
    {
      "sceneId": "middle_power_hedging_nonalignment",
      "publicLabel": "Middle-power hedging and nonalignment",
      "oneSentencePurpose": "Show a world organized less by formal camp membership than by selective engagement, issue-based coalitions, and autonomy-preserving diplomacy.",
      "lensOwner": "No single owner; editorially centered on autonomous middle-power statecraft",
      "evidenceWindow": "asOf 2026-07-14; uses official foreign-policy doctrines and summit materials",
      "countryRoles": [
        {
          "iso3": "IND",
          "role": "hedging actor",
          "rationale": "Indian official statements continue to foreground strategic autonomy and a comprehensive but non-allied pattern of major-power engagement.",
          "confidence": "high",
          "sourceIds": ["SRC14", "SRC27"]
        },
        {
          "iso3": "IDN",
          "role": "hedging actor",
          "rationale": "Indonesia's official 'bebas aktif' doctrine explicitly rejects alignment with superpowers while insisting on active diplomacy.",
          "confidence": "high",
          "sourceIds": ["SRC25"]
        },
        {
          "iso3": "VNM",
          "role": "hedging actor",
          "rationale": "Vietnamese official diplomacy describes an independent, self-reliant, diversified, and multilateralized approach often summarized as 'bamboo diplomacy.'",
          "confidence": "high",
          "sourceIds": ["SRC26"]
        },
        {
          "iso3": "BRA",
          "role": "hedging actor",
          "rationale": "Brazil's 2025 BRICS presidency and summit-hosting role show an effort to shape multipolar governance without reducing foreign policy to a single camp.",
          "confidence": "high",
          "sourceIds": ["SRC28"]
        },
        {
          "iso3": "SAU",
          "role": "hedging actor",
          "rationale": "Saudi official documents show simultaneous pursuit of a comprehensive strategic partnership with China and ongoing strategic dealings with the United States.",
          "confidence": "medium",
          "sourceIds": ["SRC30"]
        },
        {
          "iso3": "ARE",
          "role": "hedging actor",
          "rationale": "The UAE's official foreign-policy principles stress non-interference and broad external partnerships, while its economic and technology ties span multiple major powers.",
          "confidence": "high",
          "sourceIds": ["SRC29", "SRC30"]
        }
      ],
      "nodes": [
        {
          "id": "n_in_newdelhi",
          "kind": "capital",
          "label": "New Delhi",
          "coordinates": [28.614, 77.209],
          "importance": 3,
          "whyItMatters": "New Delhi is where strategic autonomy is articulated and practiced across competing relationships.",
          "confidence": "high",
          "sourceIds": ["SRC14", "SRC27"]
        },
        {
          "id": "n_id_jakarta",
          "kind": "capital",
          "label": "Jakarta",
          "coordinates": [-6.208, 106.846],
          "importance": 3,
          "whyItMatters": "Jakarta symbolizes Indonesia's bebas aktif doctrine and its role as an ASEAN-centered balancer.",
          "confidence": "high",
          "sourceIds": ["SRC25", "SRC31"]
        },
        {
          "id": "n_asean_secretariat",
          "kind": "governance",
          "label": "ASEAN Secretariat",
          "coordinates": [-6.244, 106.799],
          "importance": 2,
          "whyItMatters": "ASEAN's Jakarta secretariat is a visible institutional anchor for non-bloc, consensus-heavy regional diplomacy.",
          "confidence": "high",
          "sourceIds": ["SRC31"]
        },
        {
          "id": "n_vn_hanoi",
          "kind": "capital",
          "label": "Hanoi",
          "coordinates": [21.028, 105.854],
          "importance": 2,
          "whyItMatters": "Hanoi is the political center of Vietnam's diversified and self-reliant diplomacy.",
          "confidence": "high",
          "sourceIds": ["SRC26"]
        },
        {
          "id": "n_br_brasilia",
          "kind": "capital",
          "label": "Brasília",
          "coordinates": [-15.793, -47.882],
          "importance": 2,
          "whyItMatters": "Brasília provides the executive center of Brazil's governance activism and BRICS presidency framing.",
          "confidence": "high",
          "sourceIds": ["SRC28"]
        },
        {
          "id": "n_br_rio",
          "kind": "governance",
          "label": "Rio de Janeiro",
          "coordinates": [-22.907, -43.173],
          "importance": 2,
          "whyItMatters": "Rio hosted the 2025 BRICS summit, giving the city editorial value as a convening node of plural alignments.",
          "confidence": "high",
          "sourceIds": ["SRC28"]
        },
        {
          "id": "n_sa_riyadh",
          "kind": "energy",
          "label": "Riyadh",
          "coordinates": [24.714, 46.675],
          "importance": 2,
          "whyItMatters": "Riyadh matters because energy, investment, and summit diplomacy let Saudi Arabia keep multiple great-power channels open at once.",
          "confidence": "medium",
          "sourceIds": ["SRC30"]
        },
        {
          "id": "n_ae_abudhabi",
          "kind": "finance",
          "label": "Abu Dhabi",
          "coordinates": [24.454, 54.377],
          "importance": 2,
          "whyItMatters": "Abu Dhabi is the clearest Gulf node for capital-driven hedging across commerce, technology, and diplomacy.",
          "confidence": "high",
          "sourceIds": ["SRC29", "SRC30"]
        }
      ],
      "flows": [],
      "caveats": [
        "Stale≤6mo: summit calendars, rotating presidencies, and transactional openings can shift fast and should not be treated as fixed structural alignments.",
        "A simplified homepage map may overstate coherence among 'hedgers'; India's autonomy, Indonesia's bebas aktif, Vietnam's bamboo diplomacy, Brazil's governance entrepreneurship, and Gulf multi-vector diplomacy are not the same strategy.",
        "This scene is intentionally thinner on militarized flows because the editorial point is choice-preservation, not a single institutionalized network."
      ],
      "sensitiveOrDisputedClassifications": [
        "Saudi and Emirati roles are best treated as hedging rather than as stable attachment to any single external pole.",
        "Brazil's BRICS role can be politicized domestically and internationally; the ledger treats it as governance positioning, not camp membership."
      ],
      "missingEvidence": [
        "No single official dataset measures 'hedging'; this scene rests on doctrine texts, summit roles, and official partnership language rather than a quantified index.",
        "Open sources often understate how much domestic politics shape middle-power room for maneuver."
      ]
    },
    {
      "sceneId": "semiconductor_advanced_manufacturing_networks",
      "publicLabel": "Semiconductor and advanced-manufacturing networks",
      "oneSentencePurpose": "Show the chip system as a cross-border production network in which bottlenecks sit at different stages rather than in one sovereign center.",
      "lensOwner": "Supply-chain and industrial-capacity view",
      "evidenceWindow": "asOf 2026-07-14; uses company annual reports, official factory pages, and government industrial-policy material",
      "countryRoles": [
        {
          "iso3": "TWN",
          "role": "strategic partner",
          "rationale": "Taiwan hosts multiple TSMC leading-edge fab nodes that remain central to global foundry production and overseas network expansion.",
          "confidence": "high",
          "sourceIds": ["SRC32"]
        },
        {
          "iso3": "KOR",
          "role": "strategic partner",
          "rationale": "South Korea remains central through Samsung's large-scale memory and foundry manufacturing base anchored at Pyeongtaek.",
          "confidence": "high",
          "sourceIds": ["SRC34"]
        },
        {
          "iso3": "USA",
          "role": "strategic partner",
          "rationale": "The United States is a design, policy, and re-shoring node, with TSMC Arizona now in volume production and advanced packaging investment announced.",
          "confidence": "high",
          "sourceIds": ["SRC32"]
        },
        {
          "iso3": "NLD",
          "role": "exposed or dependent actor",
          "rationale": "The Netherlands is both a bottleneck supplier location through ASML and a policy chokepoint through export controls on advanced semiconductor manufacturing equipment.",
          "confidence": "high",
          "sourceIds": ["SRC33"]
        },
        {
          "iso3": "JPN",
          "role": "strategic partner",
          "rationale": "Japan combines state-backed semiconductor revitalization with the growing TSMC-linked Kumamoto manufacturing node.",
          "confidence": "high",
          "sourceIds": ["SRC32", "SRC35"]
        },
        {
          "iso3": "MYS",
          "role": "strategic partner",
          "rationale": "Malaysia's official semiconductor strategy and major Penang packaging/test expansions place it inside higher-value backend and ecosystem roles.",
          "confidence": "high",
          "sourceIds": ["SRC36"]
        }
      ],
      "nodes": [
        {
          "id": "n_tw_hsinchu",
          "kind": "fab",
          "label": "Hsinchu Science Park",
          "coordinates": [24.784, 121.003],
          "importance": 3,
          "whyItMatters": "Hsinchu remains one of the densest public symbols of Taiwan's foundry and R&D concentration.",
          "confidence": "high",
          "sourceIds": ["SRC32"]
        },
        {
          "id": "n_tw_tainan",
          "kind": "fab",
          "label": "TSMC Fab 18, Tainan",
          "coordinates": [23.098, 120.277],
          "importance": 3,
          "whyItMatters": "Fab 18 is a flagship advanced-node complex and an editorial shorthand for Taiwan's continuing leading-edge concentration.",
          "confidence": "high",
          "sourceIds": ["SRC32"]
        },
        {
          "id": "n_us_phoenix",
          "kind": "fab",
          "label": "TSMC Arizona, Phoenix",
          "coordinates": [33.750, -112.155],
          "importance": 2,
          "whyItMatters": "Phoenix captures the U.S. re-shoring push and TSMC's stated effort to strengthen the U.S. semiconductor ecosystem.",
          "confidence": "high",
          "sourceIds": ["SRC32"]
        },
        {
          "id": "n_kr_pyeongtaek",
          "kind": "fab",
          "label": "Pyeongtaek Campus",
          "coordinates": [36.994, 127.112],
          "importance": 3,
          "whyItMatters": "Samsung identifies Pyeongtaek as the world's largest semiconductor production complex and a core site for memory and foundry scale.",
          "confidence": "high",
          "sourceIds": ["SRC34"]
        },
        {
          "id": "n_nl_veldhoven",
          "kind": "factory",
          "label": "ASML Veldhoven",
          "coordinates": [51.418, 5.406],
          "importance": 3,
          "whyItMatters": "Veldhoven is a bottleneck manufacturing and R&D node because ASML's headquarters is also its biggest R&D and manufacturing site.",
          "confidence": "high",
          "sourceIds": ["SRC33"]
        },
        {
          "id": "n_jp_kumamoto",
          "kind": "fab",
          "label": "JASM Kumamoto",
          "coordinates": [32.844, 130.816],
          "importance": 2,
          "whyItMatters": "Kumamoto represents Japan's semiconductor revival through a TSMC-linked manufacturing foothold backed by Japanese policy.",
          "confidence": "high",
          "sourceIds": ["SRC32", "SRC35"]
        },
        {
          "id": "n_my_penang",
          "kind": "factory",
          "label": "Penang packaging and test cluster",
          "coordinates": [5.337, 100.282],
          "importance": 2,
          "whyItMatters": "Penang captures Malaysia's backend strength, especially advanced packaging and testing expansions.",
          "confidence": "high",
          "sourceIds": ["SRC36"]
        }
      ],
      "flows": [
        {
          "id": "f_nl_tw_tools",
          "kind": "technology",
          "label": "Veldhoven to Tainan tools flow",
          "from": "n_nl_veldhoven",
          "to": "n_tw_tainan",
          "direction": "one-way",
          "weight": 3,
          "plain-language meaning": "A simplified map can show Veldhoven feeding leading-edge Taiwanese fabs because Dutch lithography capability is a major upstream bottleneck for advanced manufacturing.",
          "confidence": "medium",
          "sourceIds": ["SRC33", "SRC32"]
        },
        {
          "id": "f_nl_kr_tools",
          "kind": "technology",
          "label": "Veldhoven to Pyeongtaek tools flow",
          "from": "n_nl_veldhoven",
          "to": "n_kr_pyeongtaek",
          "direction": "one-way",
          "weight": 3,
          "plain-language meaning": "Samsung's advanced production base depends on a tool ecosystem in which ASML is a critical upstream supplier.",
          "confidence": "medium",
          "sourceIds": ["SRC33", "SRC34"]
        },
        {
          "id": "f_tw_us_expansion",
          "kind": "supply-chain",
          "label": "Tainan to Phoenix foundry expansion",
          "from": "n_tw_tainan",
          "to": "n_us_phoenix",
          "direction": "one-way",
          "weight": 2,
          "plain-language meaning": "Phoenix should be shown as an overseas extension of a Taiwan-centered foundry system, not as a substitute for it.",
          "confidence": "high",
          "sourceIds": ["SRC32"]
        },
        {
          "id": "f_tw_jp_jasm",
          "kind": "technology",
          "label": "Taiwan to Kumamoto manufacturing extension",
          "from": "n_tw_hsinchu",
          "to": "n_jp_kumamoto",
          "direction": "one-way",
          "weight": 2,
          "plain-language meaning": "Kumamoto is best understood as a Japan-based extension of a Taiwan-led foundry network operating under a different state-policy setting.",
          "confidence": "high",
          "sourceIds": ["SRC32", "SRC35"]
        },
        {
          "id": "f_tw_my_backend",
          "kind": "supply-chain",
          "label": "Taiwan to Penang backend link",
          "from": "n_tw_hsinchu",
          "to": "n_my_penang",
          "direction": "two-way",
          "weight": 1,
          "plain-language meaning": "Penang belongs on the map because frontend chip leadership still relies on backend packaging, test, and handling ecosystems across Asia.",
          "confidence": "medium",
          "sourceIds": ["SRC36"]
        }
      ],
      "caveats": [
        "Stale≤6mo: fab ramp status, product-node roadmaps, backend capacity additions, and export-control coverage can change quickly.",
        "A simplified homepage map may wrongly imply a single linear chain; real semiconductor production depends on many parallel supplier, design, packaging, and equipment relationships.",
        "Country-level color fills can hide the fact that a few specific sites matter far more than national averages."
      ],
      "sensitiveOrDisputedClassifications": [
        "Tool flows from Veldhoven to end fabs are editorial shorthand for upstream dependence, not public transaction-by-transaction shipment records.",
        "Phoenix should not be depicted as evidence of U.S. independence from Taiwanese production concentration."
      ],
      "missingEvidence": [
        "Public company reports do not provide complete, current, customer-by-customer routing maps.",
        "Exact cross-facility dependency varies by chip type, foundry node, packaging path, and export-control treatment."
      ]
    },
    {
      "sceneId": "frontier_ai_compute_chips_cloud_governance",
      "publicLabel": "Frontier-AI compute, chips, cloud, research, and governance infrastructure",
      "oneSentencePurpose": "Show frontier AI as an infrastructure stack in which compute buildout, advanced chips, cloud regions, research clusters, and governance institutions depend on each other.",
      "lensOwner": "Infrastructure and model-development view",
      "evidenceWindow": "asOf 2026-07-14; uses company filings, cloud-region pages, official AI-governance documents, and public compute announcements",
      "countryRoles": [
        {
          "iso3": "USA",
          "role": "lens owner",
          "rationale": "The U.S. concentrates major cloud capacity, frontier model firms, GPU design leadership, fab re-shoring efforts, and federal AI governance institutions.",
          "confidence": "high",
          "sourceIds": ["SRC38", "SRC39", "SRC40", "SRC43", "SRC45"]
        },
        {
          "iso3": "TWN",
          "role": "exposed or dependent actor",
          "rationale": "Advanced-model development still depends materially on Taiwanese leading-edge manufacturing capacity even when the compute is physically elsewhere.",
          "confidence": "high",
          "sourceIds": ["SRC32", "SRC38", "SRC45"]
        },
        {
          "iso3": "NLD",
          "role": "exposed or dependent actor",
          "rationale": "The Dutch lithography bottleneck remains foundational to frontier-AI chip supply because advanced fabs depend on ASML's manufacturing and export-control environment.",
          "confidence": "high",
          "sourceIds": ["SRC33"]
        },
        {
          "iso3": "KOR",
          "role": "strategic partner",
          "rationale": "Samsung's AI-oriented HBM and memory roadmap makes South Korea central to frontier compute scaling.",
          "confidence": "high",
          "sourceIds": ["SRC34"]
        },
        {
          "iso3": "ARE",
          "role": "strategic partner",
          "rationale": "The UAE is building out AI capital, compute, and research infrastructure through G42, Khazna, MBZUAI, MGX, and formal technology partnerships.",
          "confidence": "high",
          "sourceIds": ["SRC44", "SRC46"]
        },
        {
          "iso3": "GBR",
          "role": "strategic partner",
          "rationale": "The UK's AI Security Institute gives Britain a notable governance and evaluation role in the frontier-AI ecosystem.",
          "confidence": "high",
          "sourceIds": ["SRC41"]
        }
      ],
      "nodes": [
        {
          "id": "n_us_nova",
          "kind": "compute",
          "label": "Northern Virginia cloud belt",
          "coordinates": [39.043, -77.487],
          "importance": 3,
          "whyItMatters": "Northern Virginia is a canonical U.S. cloud-region anchor for hyperscale compute and a reasonable homepage shorthand for frontier inference and training infrastructure.",
          "confidence": "high",
          "sourceIds": ["SRC39", "SRC40"]
        },
        {
          "id": "n_us_santaclara",
          "kind": "research",
          "label": "Santa Clara Bay Area AI hardware cluster",
          "coordinates": [37.354, -121.955],
          "importance": 3,
          "whyItMatters": "Santa Clara stands in for the Bay Area's dense frontier-AI hardware, software, and capital ecosystem, including NVIDIA.",
          "confidence": "high",
          "sourceIds": ["SRC38"]
        },
        {
          "id": "n_us_washington_ai",
          "kind": "governance",
          "label": "Washington, DC",
          "coordinates": [38.907, -77.037],
          "importance": 2,
          "whyItMatters": "Federal AI standard-setting, export framing, and policy architecture remain heavily Washington-driven.",
          "confidence": "high",
          "sourceIds": ["SRC43", "SRC45"]
        },
        {
          "id": "n_tw_hsinchu_ai",
          "kind": "fab",
          "label": "Hsinchu-Tainan advanced fab axis",
          "coordinates": [24.000, 120.640],
          "importance": 3,
          "whyItMatters": "A homepage map can merge Taiwan's key advanced-fab zones into one axis to indicate where frontier-AI chips are physically manufactured.",
          "confidence": "medium",
          "sourceIds": ["SRC32"]
        },
        {
          "id": "n_kr_pyeongtaek_ai",
          "kind": "fab",
          "label": "Pyeongtaek memory complex",
          "coordinates": [36.994, 127.112],
          "importance": 2,
          "whyItMatters": "Pyeongtaek matters because HBM and server-memory scaling have become core constraints in AI infrastructure.",
          "confidence": "high",
          "sourceIds": ["SRC34"]
        },
        {
          "id": "n_nl_veldhoven_ai",
          "kind": "factory",
          "label": "ASML Veldhoven",
          "coordinates": [51.418, 5.406],
          "importance": 3,
          "whyItMatters": "Veldhoven remains a bottleneck site for the equipment stack beneath frontier-AI chips.",
          "confidence": "high",
          "sourceIds": ["SRC33"]
        },
        {
          "id": "n_ae_abudhabi_ai",
          "kind": "compute",
          "label": "Abu Dhabi AI campus and research cluster",
          "coordinates": [24.454, 54.377],
          "importance": 2,
          "whyItMatters": "Abu Dhabi combines capital, compute, sovereign-cloud ambition, and MBZUAI-led research in one increasingly visible node.",
          "confidence": "high",
          "sourceIds": ["SRC44", "SRC46"]
        },
        {
          "id": "n_gb_london_ai",
          "kind": "governance",
          "label": "London AI governance node",
          "coordinates": [51.507, -0.128],
          "importance": 2,
          "whyItMatters": "London belongs on the map because the UK's AI Security Institute has become one of the most visible public institutions for frontier-AI evaluation and governance.",
          "confidence": "high",
          "sourceIds": ["SRC41"]
        }
      ],
      "flows": [
        {
          "id": "f_nl_tw_ai_tools",
          "kind": "technology",
          "label": "Veldhoven to Taiwan fab bottleneck flow",
          "from": "n_nl_veldhoven_ai",
          "to": "n_tw_hsinchu_ai",
          "direction": "one-way",
          "weight": 3,
          "plain-language meaning": "A homepage line from Veldhoven to Taiwan captures the public fact that frontier chips rely on advanced lithography capability concentrated in the Netherlands.",
          "confidence": "medium",
          "sourceIds": ["SRC33", "SRC32"]
        },
        {
          "id": "f_tw_us_compute",
          "kind": "technology",
          "label": "Taiwan fabs to U.S. cloud compute",
          "from": "n_tw_hsinchu_ai",
          "to": "n_us_nova",
          "direction": "one-way",
          "weight": 3,
          "plain-language meaning": "This is an editorial inference showing that U.S. frontier cloud capacity depends on chips manufactured through Taiwan-centered advanced fab capacity.",
          "confidence": "medium",
          "sourceIds": ["SRC32", "SRC38", "SRC39", "SRC40", "SRC45"]
        },
        {
          "id": "f_kr_us_memory",
          "kind": "technology",
          "label": "Korean AI memory into U.S. compute",
          "from": "n_kr_pyeongtaek_ai",
          "to": "n_us_nova",
          "direction": "one-way",
          "weight": 2,
          "plain-language meaning": "This flow is a homepage shorthand for the dependence of frontier compute on AI-oriented memory and HBM supply from Korean production complexes.",
          "confidence": "medium",
          "sourceIds": ["SRC34", "SRC39", "SRC40"]
        },
        {
          "id": "f_us_design_to_cloud",
          "kind": "technology",
          "label": "Bay Area hardware-design ecosystem to cloud deployment",
          "from": "n_us_santaclara",
          "to": "n_us_nova",
          "direction": "one-way",
          "weight": 2,
          "plain-language meaning": "NVIDIA's data-center business and U.S. hyperscale cloud infrastructure should be shown as linked layers of one frontier-AI stack.",
          "confidence": "high",
          "sourceIds": ["SRC38", "SRC39", "SRC40"]
        },
        {
          "id": "f_ae_us_ai_finance_compute",
          "kind": "finance",
          "label": "Abu Dhabi capital and compute partnership with U.S. stack",
          "from": "n_ae_abudhabi_ai",
          "to": "n_us_nova",
          "direction": "two-way",
          "weight": 2,
          "plain-language meaning": "UAE capital and infrastructure partnerships with Microsoft, G42, Khazna, MGX, and U.S.-linked AI projects make Abu Dhabi a real frontier-AI node, not just an investor outpost.",
          "confidence": "high",
          "sourceIds": ["SRC44", "SRC46"]
        },
        {
          "id": "f_us_uk_governance",
          "kind": "governance",
          "label": "Washington-London AI safety and standards channel",
          "from": "n_us_washington_ai",
          "to": "n_gb_london_ai",
          "direction": "two-way",
          "weight": 1,
          "plain-language meaning": "The U.S. and UK should be linked as governance actors because both maintain public institutions dedicated to frontier-AI evaluation and international coordination.",
          "confidence": "high",
          "sourceIds": ["SRC41", "SRC43"]
        }
      ],
      "caveats": [
        "Stale≤6mo: compute-capacity announcements, data-center buildouts, AI-campus timelines, cloud-region capacity claims, and governance implementation calendars can change very quickly.",
        "A simplified homepage map may falsely imply that training compute, inference compute, fab output, memory supply, and governance institutions move at the same pace; they do not.",
        "Some flows here are explicitly editorial inferences from public dependencies rather than published shipment routes."
      ],
      "sensitiveOrDisputedClassifications": [
        "Taiwan's role in frontier-AI chip supply is undeniable in public sources, but any map should avoid implying diplomatic recognition from technical dependence.",
        "Abu Dhabi's AI-campus and finance role is growing fast; editorial treatment should not assume announced projects are already fully delivered."
      ],
      "missingEvidence": [
        "Public sources do not disclose full procurement relationships, utilization rates, or model-by-model training footprints.",
        "Cloud-region pages identify geography and capacity categories better than they reveal frontier-model-specific deployment."
      ]
    }
  ]
}
```

The first scene is anchored in treaty texts and official posture documents: Japan’s 1960 security treaty and Article VI facilities framework, the 1953 U.S.-ROK treaty, the 1951 U.S.-Philippines MDT plus EDCA reaffirmations, ANZUS and Australia’s Force Posture Initiatives, and the U.S. Pacific Deterrence Initiative’s emphasis on distributed and resilient Indo-Pacific posture. citeturn1search0turn1search4turn0search1turn16search0turn1search9turn15search7turn24search3turn1search6turn24search1turn24search2turn24search12turn25search17

The second scene is grounded in PRC official framing: the 2019 defense white paper, the Global Security Initiative concept paper, official PRC definitions of the Russia and Pakistan relationships, PRC statements on Taiwan, the 2025 China-Philippines South China Sea consultation mechanism meeting in Xiamen, and official Cambodia/PRC material on the Ream joint logistics and training center. citeturn3search0turn6search2turn3search1turn3search2turn3search3turn6search4turn20search11turn5search11turn20search17

The third scene rests on official doctrine rather than a single alliance map: Indonesia’s bebas aktif formulation, Vietnam’s official descriptions of bamboo diplomacy as independent, self-reliant, diversified, and multilateralized foreign policy, Indian official uses of “strategic autonomy,” Brazil’s 2025 BRICS presidency and Rio summit role, and official Gulf statements showing multi-vector external partnerships. citeturn7search1turn29search3turn8search2turn7search0turn29search17turn29search6turn29search2turn9search9turn9search0turn22search12

The semiconductor scene is driven by company and industrial-policy sources: TSMC’s 2025 annual report and fab pages for Taiwan, Arizona, and Kumamoto; ASML’s annual report and Veldhoven site pages; Samsung’s reporting on Pyeongtaek and AI memory; Japan’s semiconductor revitalization strategy; and Malaysia’s official semiconductor strategy plus Penang packaging/test expansion announcements. citeturn10search0turn17search8turn18search0turn17search12turn17search6turn10search6turn19search1turn17search11turn27search1turn19search2turn11search3turn19search3turn19search12

The frontier-AI scene is built from current official infrastructure and governance material: NVIDIA’s annual reporting, Microsoft’s 2025 annual report and Azure region pages, AWS infrastructure pages, NIST’s AI governance/consortium material, the UK AI Security Institute, the EU AI Act and AI Factories materials, OpenAI’s compute-infrastructure publications, and G42/Microsoft/Khazna/MBZUAI/MGX material on the UAE’s AI buildout. citeturn12search16turn12search1turn14search7turn12search2turn23search0turn23search4turn12search3turn13search0turn27search2turn13search1turn14search3turn14search6turn13search11turn27search3turn14search9turn28search0

## Source ledger

```json
[
  {
    "sourceId": "SRC01",
    "title": "MOFA: Japan-U.S. Security Treaty",
    "publisher": "Ministry of Foreign Affairs of Japan",
    "date": "n.d.",
    "url": "https://www.mofa.go.jp/region/n-america/us/q%26a/ref/1.html",
    "claimCoverage": "1960 U.S.-Japan treaty text; legal basis for formal treaty-ally classification."
  },
  {
    "sourceId": "SRC02",
    "title": "Agreement regarding the Status of United States Armed Forces in Japan",
    "publisher": "Ministry of Foreign Affairs of Japan",
    "date": "n.d.",
    "url": "https://www.mofa.go.jp/region/n-america/us/q%26a/ref/2.html",
    "claimCoverage": "Article VI facilities-and-areas framework; rationale for Japan as a host-country infrastructure node."
  },
  {
    "sourceId": "SRC03",
    "title": "Mutual Defense Treaty Between the United States and the Republic of Korea",
    "publisher": "Avalon Project, Yale Law School",
    "date": "1953-10-01",
    "url": "https://avalon.law.yale.edu/20th_century/kor001.asp",
    "claimCoverage": "Treaty basis for U.S.-ROK formal treaty-ally classification."
  },
  {
    "sourceId": "SRC04",
    "title": "Mutual Defense Treaty",
    "publisher": "Lawphil Project, Republic of the Philippines",
    "date": "1951-08-30",
    "url": "https://lawphil.net/international/treaties/mutdef.html",
    "claimCoverage": "Treaty basis for U.S.-Philippines formal treaty-ally classification."
  },
  {
    "sourceId": "SRC05",
    "title": "Joint Statement on the Philippines-United States Fourth 2+2 Ministerial Dialogue",
    "publisher": "U.S. Department of Defense",
    "date": "2024-07-30",
    "url": "https://www.defense.gov/News/Releases/Release/Article/3854902/joint-statement-on-the-philippines-united-states-fourth-22-ministerial-dialogue/",
    "claimCoverage": "Current alliance framing for the Philippines; MDT reaffirmation, VFA/EDCA significance, South China Sea applicability."
  },
  {
    "sourceId": "SRC06",
    "title": "United States of America country brief",
    "publisher": "Australian Department of Foreign Affairs and Trade",
    "date": "n.d.",
    "url": "https://www.dfat.gov.au/geo/united-states-of-america/united-states-of-america-country-brief",
    "claimCoverage": "ANZUS characterization and Australian formal treaty-ally status."
  },
  {
    "sourceId": "SRC07",
    "title": "United States Force Posture Initiatives and Marine Rotational Force – Darwin",
    "publisher": "Australian Department of Defence",
    "date": "n.d.",
    "url": "https://www.defence.gov.au/defence-activities/programs-initiatives/united-states-force-posture-initiatives",
    "claimCoverage": "Darwin posture role; rotational access vs permanent-basing nuance."
  },
  {
    "sourceId": "SRC08",
    "title": "Pacific Deterrence Initiative FY2026",
    "publisher": "U.S. Department of Defense Comptroller",
    "date": "2025-06-12",
    "url": "https://comptroller.defense.gov/Portals/45/Documents/defbudget/FY2026/FY2026_Pacific_Deterrence_Initiative.pdf",
    "claimCoverage": "Distributed and resilient Indo-Pacific posture; explicit deterrence-against-PRC framing."
  },
  {
    "sourceId": "SRC09",
    "title": "Homepage of Kadena Air Base",
    "publisher": "U.S. Air Force",
    "date": "n.d.",
    "url": "https://www.kadena.af.mil/",
    "claimCoverage": "Kadena as Pacific airpower hub; node importance in the U.S.-alliance security scene."
  },
  {
    "sourceId": "SRC10",
    "title": "Welcome Aboard Yokosuka",
    "publisher": "Commander, Navy Region Japan",
    "date": "n.d.",
    "url": "https://cnrj.cnic.navy.mil/Installations/CFA-Yokosuka/Welcome-Aboard/",
    "claimCoverage": "Yokosuka as 7th Fleet HQ and forward-deployed carrier strike group node."
  },
  {
    "sourceId": "SRC11",
    "title": "USAG Humphreys - Army Garrisons",
    "publisher": "U.S. Army",
    "date": "n.d.",
    "url": "https://home.army.mil/humphreys/",
    "claimCoverage": "Camp Humphreys location and role as largest overseas U.S. military installation."
  },
  {
    "sourceId": "SRC12",
    "title": "36th Wing and Andersen Air Force Base Guam official pages",
    "publisher": "U.S. Air Force",
    "date": "n.d.",
    "url": "https://www.andersen.af.mil/About-Us/Fact-Sheets/Display/Article/414606/36th-wing/",
    "claimCoverage": "Guam as Joint Region Marianas/Andersen AFB power-projection hub."
  },
  {
    "sourceId": "SRC13",
    "title": "Taiwan Relations Act and U.S.-Taiwan Relations",
    "publisher": "American Institute in Taiwan",
    "date": "1979 text; 2026 explanatory letters and policy pages",
    "url": "https://www.ait.org.tw/policy-history/taiwan-relations-act/",
    "claimCoverage": "Unofficial but robust U.S.-Taiwan relationship; justification for exposed/dependent rather than treaty-ally labeling."
  },
  {
    "sourceId": "SRC14",
    "title": "India-US Bilateral Relations and 2025 Joint Statement",
    "publisher": "Ministry of External Affairs of India",
    "date": "2025-01 to 2025-02",
    "url": "https://www.mea.gov.in/Portal/ForeignRelation/US_Bilateral_Brief_0125.pdf",
    "claimCoverage": "India-U.S. comprehensive global strategic partnership; basis for strategic-partner classification."
  },
  {
    "sourceId": "SRC15",
    "title": "《新时代的中国国防》白皮书全文",
    "publisher": "Ministry of National Defense of the People's Republic of China",
    "date": "2019-07-24",
    "url": "https://www.mod.gov.cn/gfbw/fgwx/bps/4846424.html",
    "claimCoverage": "PRC defense-policy framing of regional security, sovereignty, and external pressure."
  },
  {
    "sourceId": "SRC16",
    "title": "全球安全倡议概念文件",
    "publisher": "Ministry of Foreign Affairs of the People's Republic of China",
    "date": "2023-02-21",
    "url": "https://www.mfa.gov.cn/wjbxw_new/202302/t20230221_11028322.shtml",
    "claimCoverage": "PRC global and regional security framing; diplomatic rationale for Beijing-centered lens."
  },
  {
    "sourceId": "SRC17",
    "title": "中华人民共和国和俄罗斯联邦在两国建交75周年之际关于进一步深化中俄新时代全面战略协作伙伴关系的联合声明",
    "publisher": "Ministry of Foreign Affairs of the People's Republic of China",
    "date": "2024-05-16",
    "url": "https://www.mfa.gov.cn/zyxw/202405/t20240516_11305860.shtml",
    "claimCoverage": "Official PRC-Russia relationship label; strategic-partner rather than formal-alliance classification."
  },
  {
    "sourceId": "SRC18",
    "title": "中华人民共和国和巴基斯坦伊斯兰共和国关于建立全天候战略合作伙伴关系的联合声明",
    "publisher": "Ministry of Foreign Affairs of the People's Republic of China",
    "date": "2015-04-21",
    "url": "https://www.mfa.gov.cn/gjhdq_676201/gj_676203/yz_676205/1206_676308/1207_676320/201504/t20150421_9288487.shtml",
    "claimCoverage": "Official China-Pakistan all-weather strategic cooperative partnership designation."
  },
  {
    "sourceId": "SRC19",
    "title": "Gwadar Projects Under CPEC",
    "publisher": "China-Pakistan Economic Corridor Official Website, Government of Pakistan",
    "date": "n.d.",
    "url": "https://cpec.gov.pk/gwadar",
    "claimCoverage": "Gwadar as official CPEC node and justification for its importance in the Beijing-centered and infrastructure scenes."
  },
  {
    "sourceId": "SRC20",
    "title": "中国和菲律宾举行南海问题双边磋商机制第十次会议",
    "publisher": "Ministry of Foreign Affairs of the People's Republic of China",
    "date": "2025-01-16",
    "url": "https://www.mfa.gov.cn/web/wjbxw_new/202501/t20250116_11536598.shtml",
    "claimCoverage": "Official China-Philippines BCM channel; contested relationship plus governance flow."
  },
  {
    "sourceId": "SRC21",
    "title": "台湾问题白皮书",
    "publisher": "Ministry of Foreign Affairs of the People's Republic of China",
    "date": "portal page with 2022 white paper link",
    "url": "https://www.mfa.gov.cn/web/ziliao_674904/zt_674979/dnzt_674981/qtzt/twwt/twwtbps/",
    "claimCoverage": "PRC official framing of Taiwan as a sovereignty issue; basis for contested-relationship classification in Beijing lens."
  },
  {
    "sourceId": "SRC22",
    "title": "Cambodia-China Joint Logistics and Training Centre / PRC MOD briefings on Ream",
    "publisher": "Agence Kampuchea Presse and Ministry of National Defense of the PRC",
    "date": "2025-04-05 and 2025-04-24",
    "url": "https://akp.gov.kh/post/detail/333548",
    "claimCoverage": "Ream joint logistics/training center; open-source basis for Cambodia/Ream node with medium confidence."
  },
  {
    "sourceId": "SRC23",
    "title": "东部战区组织陆海空火等兵力位台岛周边开展联合演训",
    "publisher": "Ministry of National Defense of the People's Republic of China",
    "date": "2025-04-01",
    "url": "https://www.mod.gov.cn/gfbw/qwfb/16378133.html",
    "claimCoverage": "Eastern Theater role in Taiwan-centered pressure/signaling."
  },
  {
    "sourceId": "SRC24",
    "title": "南部战区海军与广东省湛江市探索推动新时代双拥工作实践",
    "publisher": "Ministry of National Defense of the People's Republic of China",
    "date": "2024-11-16",
    "url": "https://www.mod.gov.cn/gfbw/gfdy/zzdy/16352506.html",
    "claimCoverage": "Southern Theater Navy and Zhanjiang linkage."
  },
  {
    "sourceId": "SRC25",
    "title": "Indonesia's Foreign Policy",
    "publisher": "Ministry of Foreign Affairs of the Republic of Indonesia",
    "date": "n.d.",
    "url": "https://kemlu.go.id/washington/kebijakan/kebijakan-luar-negeri-ri",
    "claimCoverage": "Official bebas aktif doctrine; basis for Indonesian hedging-actor classification."
  },
  {
    "sourceId": "SRC26",
    "title": "General Secretary Nguyen Phu Trong - an eminent diplomat of international stature / bamboo diplomacy explanations",
    "publisher": "Ministry of Foreign Affairs of Viet Nam",
    "date": "2024-07-24 and related 2024 pages",
    "url": "https://mofa.gov.vn/web/ministry-of-foreign-affairs/detail/chi-tiet/general-secretary-nguyen-phu-trong-an-eminent-diplomat-of-international-stature-minister-of-foreign-affairs-47-88.html",
    "claimCoverage": "Independent, self-reliant, diversified, multilateralized foreign policy and bamboo-diplomacy framing."
  },
  {
    "sourceId": "SRC27",
    "title": "Remarks of Minister of State Shri Kirti Vardhan Singh at the 11th Raisina Dialogue 2026",
    "publisher": "Ministry of External Affairs of India",
    "date": "2026-03-06",
    "url": "https://www.mea.gov.in/Speeches-Statements.htm?dtl%2F40857%2FRemarks_of_Minister_of_State_Shri_Kirti_Vardhan_Singh_at_the_11th_Raisina_Dialogue_2026_March_06_2026=",
    "claimCoverage": "Current official Indian use of strategic autonomy language."
  },
  {
    "sourceId": "SRC28",
    "title": "Brazil assumes the presidency of BRICS in 2025 / Rio chosen to host BRICS Summit",
    "publisher": "Government of Brazil",
    "date": "2025-01-01 and 2025-03-14",
    "url": "https://www.gov.br/planalto/en/latest-news/2025/01/brazil-assumes-the-presidency-of-brics-in-2025",
    "claimCoverage": "Brazil's governance-entrepreneur role and Rio summit node."
  },
  {
    "sourceId": "SRC29",
    "title": "Foreign Policy",
    "publisher": "Ministry of Foreign Affairs of the United Arab Emirates",
    "date": "updated 2026-07",
    "url": "https://www.mofa.gov.ae/en/missions/paris/the-uae/foreign-policy",
    "claimCoverage": "Official UAE foreign-policy principles; basis for hedging and multi-vector classification."
  },
  {
    "sourceId": "SRC30",
    "title": "Saudi-China summit / Saudi Vision 2030 / U.S.-Saudi strategic partnership materials",
    "publisher": "Saudi Ministry of Foreign Affairs and The White House",
    "date": "2022-12-09, 2022-06-09, 2025-11-18",
    "url": "https://www.mofa.gov.sa/en/ministry/statements/Pages/Joint-Statement-at-the-Conclusion-of-the-Saudi-Chinese-Summit.aspx",
    "claimCoverage": "Saudi multi-vector external relationships; evidence for hedging-actor classification."
  },
  {
    "sourceId": "SRC31",
    "title": "ASEAN Secretariat contact and mandate pages",
    "publisher": "ASEAN",
    "date": "n.d.",
    "url": "https://asean.org/general-inquiries/",
    "claimCoverage": "ASEAN Secretariat as a Jakarta governance node."
  },
  {
    "sourceId": "SRC32",
    "title": "TSMC 2025 Annual Report and TSMC fab/location pages",
    "publisher": "Taiwan Semiconductor Manufacturing Company",
    "date": "2026-02 to 2026-04",
    "url": "https://investor.tsmc.com/static/annualReports/2025/english/index.html",
    "claimCoverage": "Taiwan fabs, Arizona, Kumamoto, foundry overseas expansion, advanced-node and packaging ecosystem."
  },
  {
    "sourceId": "SRC33",
    "title": "ASML 2025 Annual Report / Veldhoven HQ pages / Dutch export-control updates",
    "publisher": "ASML and Government of the Netherlands",
    "date": "2025-2026",
    "url": "https://www.asml.com/investors/annual-report/2025",
    "claimCoverage": "ASML bottleneck role, Veldhoven node, and Dutch export-control significance."
  },
  {
    "sourceId": "SRC34",
    "title": "Samsung reporting and semiconductor site materials",
    "publisher": "Samsung Electronics / Samsung Semiconductor",
    "date": "2025-2026",
    "url": "https://semiconductor.samsung.com/about-us/our-story/",
    "claimCoverage": "Pyeongtaek as world-scale semiconductor complex; AI memory/HBM relevance."
  },
  {
    "sourceId": "SRC35",
    "title": "Outline of Semiconductor Revitalization Strategy in Japan and related METI materials",
    "publisher": "Ministry of Economy, Trade and Industry of Japan",
    "date": "2024-07 and 2025-06",
    "url": "https://www.meti.go.jp/english/policy/index_information_policy.html",
    "claimCoverage": "Japan industrial-policy role in semiconductor revitalization and support for Kumamoto node."
  },
  {
    "sourceId": "SRC36",
    "title": "Malaysia semiconductor strategy and Penang ecosystem materials",
    "publisher": "Malaysian Investment Development Authority",
    "date": "2024-2026",
    "url": "https://www.mida.gov.my/mida-news/national-semiconductor-strategy-to-guide-industry-up-value-chain/",
    "claimCoverage": "Malaysia NSS, Penang advanced packaging and test expansion, backend-node importance."
  },
  {
    "sourceId": "SRC38",
    "title": "NVIDIA 2025 Annual Report",
    "publisher": "NVIDIA Corporation",
    "date": "2025-05-13",
    "url": "https://s201.q4cdn.com/141608511/files/doc_financials/2025/annual/NVIDIA-2025-Annual-Report.pdf",
    "claimCoverage": "Frontier-AI hardware and data-center business scale; Santa Clara ecosystem relevance."
  },
  {
    "sourceId": "SRC39",
    "title": "Microsoft 2025 Annual Report and Azure global infrastructure pages",
    "publisher": "Microsoft",
    "date": "2025",
    "url": "https://www.microsoft.com/investor/reports/ar25/index.html",
    "claimCoverage": "Cloud/AI infrastructure scale, 400+ datacenters in 70 regions, Azure geography relevance."
  },
  {
    "sourceId": "SRC40",
    "title": "AWS Global Infrastructure",
    "publisher": "Amazon Web Services",
    "date": "n.d.",
    "url": "https://aws.amazon.com/about-aws/global-infrastructure/",
    "claimCoverage": "AWS regions/AZs and Northern Virginia as a cloud-region anchor."
  },
  {
    "sourceId": "SRC41",
    "title": "The AI Security Institute",
    "publisher": "Government of the United Kingdom",
    "date": "2025-2026",
    "url": "https://www.aisi.gov.uk/",
    "claimCoverage": "UK role in frontier-AI evaluation and governance."
  },
  {
    "sourceId": "SRC42",
    "title": "EU AI Act and AI Factories pages",
    "publisher": "European Union",
    "date": "2024-2026",
    "url": "https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng",
    "claimCoverage": "EU AI-governance infrastructure, implementation timeline, and AI Factories initiative."
  },
  {
    "sourceId": "SRC43",
    "title": "Center for AI Standards and Innovation and NIST AI Consortium",
    "publisher": "National Institute of Standards and Technology",
    "date": "2024-2026",
    "url": "https://www.nist.gov/caisi",
    "claimCoverage": "U.S. AI-governance, standards, and evaluation infrastructure."
  },
  {
    "sourceId": "SRC44",
    "title": "Microsoft-G42-Khazna and MBZUAI materials",
    "publisher": "G42 / MBZUAI",
    "date": "2024-2026",
    "url": "https://www.g42.ai/resources/news/microsoft-and-g42-accelerate-uaes-digital-future-major-data-centre-expansion",
    "claimCoverage": "Abu Dhabi compute, sovereign-cloud, research, and AI-campus growth."
  },
  {
    "sourceId": "SRC45",
    "title": "OpenAI compute-infrastructure publications",
    "publisher": "OpenAI",
    "date": "2025-2026",
    "url": "https://openai.com/index/building-the-compute-infrastructure-for-the-intelligence-age/",
    "claimCoverage": "Public framing of large-scale frontier-AI compute buildout and U.S.-centered infrastructure expansion."
  },
  {
    "sourceId": "SRC46",
    "title": "MGX official site and portfolio materials",
    "publisher": "MGX",
    "date": "2025-2026",
    "url": "https://www.mgx.ae/",
    "claimCoverage": "UAE AI-capital role, investment platform, and Abu Dhabi's rise as a finance/compute node."
  }
]
```

## Editorial memo

The strongest editorial principle across all five scenes is that **the underlying world is the same, but the organizing question changes the map**. Under the U.S.-alliance lens, the world coheres around treaty law, host-country posture, and resilient basing; under the Beijing-centered lens, it coheres around sovereignty, adjacent theaters, consultation mechanisms, and asymmetric partnership geometry; under the hedging lens, the same geography becomes a looser field of autonomy-seeking capitals rather than a hard security chain. That contrast is not speculative; it follows directly from the very different official documents each side publishes to describe the same region. citeturn1search0turn1search9turn15search7turn3search0turn6search2turn6search4turn7search1turn29search3turn7search0

The biggest **homepage simplification risk** is false equivalence. Japan, South Korea, the Philippines, and Australia all fall inside the U.S. security architecture, but not with identical authorities, basing politics, or contingency implications. Likewise, Russia, Pakistan, Cambodia, and the Philippines all appear in Beijing’s regional-security picture, but the evidentiary basis and relationship depth differ sharply: PRC-Russia is a deliberately high-level strategic partnership that explicitly stops short of alliance language; Pakistan is an all-weather strategic partner with a mature corridor logic; Cambodia is a smaller, more disputed infrastructure case; and the Philippines is both dialogue partner and maritime dispute counterpart. A clean homepage needs those differences in tooltips, caveats, and color logic or it will teach the wrong lesson. citeturn17search6turn24search3turn3search1turn3search2turn20search11turn6search4

The **middle-power scene** is evidentially solid at the doctrine level and weaker at the network-flow level. Indonesia’s bebas aktif, Vietnam’s bamboo diplomacy, India’s strategic autonomy, and Brazil’s multilateral positioning are all official and quotable. What is less directly measurable is how much those similar-sounding doctrines produce convergent behavior. That is why the JSON keeps this scene thinner on flows: the strongest public evidence shows orientation and self-description, not a dense institutional network comparable to treaty alliances or semiconductor supply chains. citeturn7search1turn29search3turn7search0turn29search6

The **semiconductor scene** has some of the strongest evidence in the whole project because it can lean on company annual reports, fab addresses, and official industrial-policy pages rather than diplomatic interpretation. It is also one of the best scenes for teaching that power is distributed by bottleneck: leading-edge foundry concentration in Taiwan, memory scale in Korea, lithography in the Netherlands, industrial policy in Japan, re-shoring in the United States, and backend expansion in Malaysia. The implication is editorially important: even when governments talk about national resilience, the actual production map remains international and site-specific. citeturn10search0turn17search8turn17search11turn10search6turn19search1turn19search2turn11search3turn19search3

The **frontier-AI scene** is the most likely to go stale and the most likely to be misunderstood if drawn as a neat chain. Cloud buildout, compute announcements, AI-campus plans, and governance timelines are moving quickly. Even the governance stack is in flux: the EU AI Act has staged applicability dates, the UK AI Safety Institute has shifted to AI Security Institute branding, and NIST’s U.S. institutional setup has also evolved. Meanwhile, compute dependence is real but often inferential: one can say with confidence that frontier cloud capacity depends on advanced chips and on memory, but public sources do not give a model-by-model, region-by-region dependency table. That is why some flows in Scene Five are explicitly marked as editorial inference rather than as literal shipment routes. citeturn27search2turn12search3turn23search0turn23search4turn14search3turn27search3turn12search1turn12search2turn12search16

For a first public release, the safest editorial rule is to **prefer site-specific, public, and legally or institutionally legible evidence over abstract geopolitical shorthand**. Treaty texts, official base pages, annual reports, fab addresses, and formal policy documents travel better across audiences than looser labels such as “camp” or “orbit.” This is especially important for Taiwan, Ream, and frontier-AI compute dependencies, where overclaiming would create avoidable controversy or factual fragility. citeturn26search2turn22search26turn20search11turn5search11turn14search3turn23search17

## Recommended first-release subset

The strongest first-release subset is the combination of **Scene One, Scene Four, and a trimmed version of Scene Five**. Scene One has the cleanest legal backbone, Scene Four has the cleanest infrastructure backbone, and Scene Five lets the homepage connect geopolitics to a current general-interest question without relying too heavily on speculative or classified material. citeturn1search0turn0search1turn16search0turn10search0turn10search6turn17search11turn12search1turn12search2turn23search0

A prudent first-release package would therefore include these specific items: for the U.S.-alliance lens, Washington, Yokosuka, Kadena, Camp Humphreys, Manila, Darwin, and Guam, plus only the treaty/posture flows with the highest legal clarity; for the semiconductor lens, Hsinchu, Tainan, Phoenix, Pyeongtaek, Veldhoven, Kumamoto, and Penang, plus only the most defensible bottleneck and expansion flows; for the frontier-AI lens, Northern Virginia, Santa Clara, Washington, Hsinchu-Tainan, Veldhoven, Pyeongtaek, Abu Dhabi, and London, while clearly labeling the Taiwan-to-cloud and Korea-to-cloud links as editorial dependency flows rather than literal route maps. citeturn24search12turn24search1turn24search2turn24search3turn25search17turn17search8turn18search0turn17search12turn17search11turn17search6turn11search3turn12search16turn12search1turn12search2turn13search11turn12search3

Scenes Two and Three are valuable, but I would release them after UI testing clarifies how much nuance the homepage can carry. Scene Two is strong on sources but politically sensitive in ways a minimalist map can misrepresent; Scene Three is analytically rich but conceptually easiest for users to flatten into “the rest,” which would defeat its purpose. In other words, they belong in the product, but not necessarily in the very first screen a new user sees. citeturn3search1turn3search2turn20search11turn7search1turn29search3turn7search0turn29search6