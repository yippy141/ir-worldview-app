# V21 validation battery: published source

## Source and response scale

The twelve validation items below are reproduced from the foreign-policy
batteries in:

> Joshua D. Kertzer, Kathleen E. Powers, Brian C. Rathbun, and Ravi Iyer.
> 2014. “Moral Support: How Moral Values Shape Foreign Policy Attitudes.”
> *The Journal of Politics* 76 (3): 825–840.
> https://doi.org/10.1017/S0022381614000073.
>
> Exact item wording and coding: “Moral Support: How Moral Values Shape
> Foreign Policy Attitudes — Supplementary Appendix,” section 1.1, pp. 2–3.
> https://jkertzer.sites.fas.harvard.edu/Research_files/YourMorals%20Appendix%20012714.pdf.

The appendix states that all foreign-policy battery items use a seven-point
Likert response scale ranging from “Strongly disagree” to “Strongly agree.”
The app therefore records responses on the existing 1–7 Foundation scale
(1 = strongly disagree; 7 = strongly agree). Reverse-coded items are transformed
as `8 - response` before the scale mean is calculated, so every reported mean
remains on the original 1–7 response metric and a higher value indicates more of
the named orientation.

This implementation uses four published indicators per construct. Item wording
is not adapted. The source battery contains additional indicators; this is a
fixed twelve-item validation subset, not a claim to reproduce the authors’ full
factor scores.

## Militant internationalism

Citation for each item: Kertzer et al. (2014), supplementary appendix §1.1,
p. 2.

| App ID | Published battery position | Exact published wording | Reverse-coded |
| --- | --- | --- | --- |
| `val_mi_1` | Militant internationalism 1 | The United States should take all steps including the use of force to prevent aggression by any expansionist power | No |
| `val_mi_2` | Militant internationalism 2 | Rather than simply countering our opponents’ thrusts, it is necessary to strike at the heart of an opponent’s power. | No |
| `val_mi_3` | Militant internationalism 5 | American military strength is not the best way to ensure world peace. | Yes |
| `val_mi_4` | Militant internationalism 6 | The United States must demonstrate its resolve so that others do not take advantage of it. | No |

## Cooperative internationalism

Citation for each item: Kertzer et al. (2014), supplementary appendix §1.1,
p. 2.

| App ID | Published battery position | Exact published wording | Reverse-coded |
| --- | --- | --- | --- |
| `val_ci_1` | Cooperative internationalism 1 | The United States needs to cooperate more with the United Nations. | No |
| `val_ci_2` | Cooperative internationalism 2 | It is essential for the United States to work with other nations to solve problems such as overpopulation, hunger, and pollution. | No |
| `val_ci_3` | Cooperative internationalism 3 | Promoting and defending human rights in other countries is of utmost importance. | No |
| `val_ci_4` | Cooperative internationalism 5 | Protecting the global environment is of utmost importance. | No |

## Isolationism

Citation for each item: Kertzer et al. (2014), supplementary appendix §1.1,
pp. 2–3.

| App ID | Published battery position | Exact published wording | Reverse-coded |
| --- | --- | --- | --- |
| `val_iso_1` | Isolationism 1 | The U.S. should mind its own business internationally and let other countries get along the best they can on their own. | No |
| `val_iso_2` | Isolationism 2 | We should not think so much in international terms but concentrate more on our own national problems. | No |
| `val_iso_3` | Isolationism 3 | The U.S. needs to play an active role in solving conflicts around the world. | Yes |
| `val_iso_4` | Isolationism 4 | America’s conception of its leadership role in the world must be scaled down. | No |

## Implementation boundary

These items form a `validation` scoring block. They are presented inside the
ordinary Foundation sequence, but they are excluded from core dimension and
family scoring. Their three additive means are research-only fields and are not
part of result or share payloads.
