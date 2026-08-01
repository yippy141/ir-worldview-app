# V21 archetype naming review

Date: 2026-08-01

Status: owner decision required before broad public sharing

## Bottom line

The `P/R/M/S` composition and the `+/-` posture mapping are useful. They turn
the existing continuous result into a compact presentation layer without
changing scoring. The eight names are less even. Four are strong, two are
usable with caveats, and two should be revised before they become durable
public labels.

The repository currently preserves the names and glosses in the supplied V21
archetype system exactly. All historical analogue fields are `null`, as the E1
prompt required. This review does not silently substitute names that the owner
was meant to author.

## Name-by-name review

| Code | Current name | Call | Reason | Strongest alternatives |
| --- | --- | --- | --- | --- |
| P+ | Kairos | Keep | The opportune-moment idea fits a power lens plus willingness to apply leverage. It is distinctive without claiming a specific IR school. | Strategic Press; Power Activist |
| P- | Shi (勢) | Keep with the character | Accumulated positional advantage fits a power lens plus patience. `Shi` alone is ambiguous in Latin script, so the character and a short definition should travel with the name. | Position Builder; Power Balancer |
| R+ | Nomos | Reconsider | Law and ordering fit the rules lens, but `Nomos` carries a strong Carl Schmitt and territorial-order association in international-law scholarship. That baggage is much wider than “institutions plus enforcement.” | Charter; Rule Enforcer |
| R- | Concert | Keep | It already denotes sustained consultation, compromise, and restraint among major powers. The hierarchy implied by the Concert of Europe should be acknowledged in the full explanation. | Rule Steward |
| M+ | Mandala | Replace | In IR, Kautilya’s mandala is commonly read through realism, self-help, security dilemmas, and shifting alliances. That points toward the power lens, not the constructivist meaning/legitimacy lens used here. | Norm Shaper; Legitimacy Shaper; Narrative Shaper |
| M- | Nemawashi (根回し) | Keep with caveat | Quiet groundwork and consensus-building fit meaning plus restraint. Its management-literature association is real, but the mapping is intelligible and the gloss controls the meaning. | Consensus Builder |
| S+ | Dirigisme | Reconsider gloss or name | It is memorable, but “the state should shape them” adds a domestic economic-policy prescription. The scored combination is a structural lens plus a general pressure posture; it does not directly measure support for state economic direction. | Structural Strategist; Structural Reformer |
| S- | Dependencia | Keep with caveat | It is the most precise structural name, but it is also an established body of theory. The result must remain a nearby-profile label, not a claim that the respondent endorses the entire school. | Dependency Buffer |

## Recommended working set

If clarity and methodological fidelity take priority over maintaining the
cross-cultural naming conceit, the strongest working set is:

- P+ Kairos
- P- Shi (勢)
- R+ Charter
- R- Concert
- M+ Norm Shaper
- M- Nemawashi (根回し)
- S+ Structural Strategist
- S- Dependencia

This set also produces more legible blends: `Charter–Dependencia` and
`Norm Shaper–Structural Strategist` tell the reader more than
`Nomos–Dependencia` and `Mandala–Dirigisme` without implying extra precision.

## Gloss changes if the current names stay

- Nomos: replace the absolute “rules that are not enforced are not rules” with
  “rules endure when violations carry credible consequences.”
- Dirigisme: replace the unmeasured state-policy prescription with
  “production, finance, and dependence structure politics, and you favor
  actively reshaping those constraints.”
- Dependencia: keep the exposure language, but add a full-analysis note that
  the label is an analogy to a structural reading rather than membership in a
  school.

## Evidence behind the cautions

- A 2026 IR article describes Kautilya’s mandala through self-help, anarchy,
  security dilemmas, shifting alliances, and realism:
  https://iupindia.in/ViewArticleDetails.asp?ArticleID=8558
- The Schmitt association is not incidental; *Nomos der Erde* remains an
  explicit reference point in international-law debates:
  https://www.cambridge.org/core/journals/leiden-journal-of-international-law/article/abs/europe-and-the-new-world-order-lessons-from-alexandre-kojeves-engagement-with-schmitts-nomos-der-erde/1AC709666F5A0E9052233E86BD2732E3
- “Concert” already has the consultative, compromise-based meaning the R-
  archetype needs:
  https://www.cfr.org/articles/concert-powers-global-era
- `Dependencia` is an established theory whose conceptual precision has itself
  been debated in *International Organization*:
  https://www.cambridge.org/core/journals/international-organization/article/abs/dependence-and-dependencia-theory-notes-toward-precision-of-concept-and-argument/1874D3608C2AA95D298E9B5B031DE0BE

## Locking rule

Keep the codes, family mapping, posture mapping, and payload stable. A naming
revision should edit typed presentation data and its tests only. It must not
change `computeCoreDimensionScores`, `scoreFamilies`, modifiers, or historical
payload resolution.
