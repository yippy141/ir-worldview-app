# Brand brief: name, mark, and instructions for Claude Design

## Recommendation

**English name: Parallax.** Chinese name: **格局**. Tagline: "Where you stand changes what you see." Chinese tagline: 立场决定视野。

Parallax is the shift in where an object appears when you look at it from two positions. That is the product's claim in one word: the same event reads differently from a realist's seat and a constructivist's, and the Perspective Runs literally move you into another seat. The tagline nods to Miles's law ("where you stand depends on where you sit"), which most IR students meet through Graham Allison's bureaucratic politics model.

格局 is chosen for Chinese on its own merits, not as a translation. It is the word for the configuration of international power (国际格局), and it is also the everyday word for how wide someone's view is, as in the meme 格局小了 ("your view is small"). A test that tells you your 格局 will travel on Chinese social media in a way 国际关系世界观清单 never will.

## How the candidates compared

I scored names on five things: does it say what the product does, does it wink at IR, does it work in Chinese, can it be owned, and does it give a mark that survives 16 pixels.

| Name | Fit | Problem found |
| --- | --- | --- |
| Parallax / 视差 | Best meaning; strong mark | Crowded word. Parallax Inc. sells educational robotics kits, so a trademark search in education classes is needed. "Parallax scrolling" crowds web search. |
| Melian | Best IR insider signal: the first recorded argument between worldviews, Melos, 416 BC | Reads as realist. An Argentine shopping app and a security company use the name. Unknown to Chinese users. |
| Sextant | Instrument that finds your position | "Political Sextant" is already a well-known ideology quiz. Rejected. |
| Astrolabe / 星盘 | Matches the current design system's name | 星盘 is the Chinese word for a horoscope chart; there is astrology software called Astrolabe. Keep it as the design system name only. |
| Polarity | IR term, and it sounds like a personality axis | Polarity is an established cybersecurity company (polarity.io). |
| Casus | Built on cases; casus belli, casus foederis | CASUS is a Swiss legal-AI startup. |
| Mappa Mundi | Every world map shows its maker's centre | Several map and history apps use it. |
| Statecraft, Worldline | | Taken: a classroom IR simulation and a payments company. |

Every dictionary word collides with something. What matters is a collision in the same market, which rules out Sextant outright. Parallax's risk is in education, so do a clearance search before any money goes into it: USPTO TESS and WIPO Global Brand Database for classes 9, 41 and 42, and CNIPA for 格局 in class 41. Then check the domains (parallax.world, parallax.fyi, getparallax) and the handles. Until then, `parallax.jhyip.com` or keeping `irworldview.jhyip.com` costs nothing.

If Parallax fails clearance, my second choice is Melian, with the Chinese name unchanged.

## The mark

Primary mark, "angle" (`brand/parallax-mark-angle.svg`): two observers on an orbit arc sight one point, and a small arc marks the angle between their lines. That angle is what a parallax measurement actually measures, so the mark shows the product's operation rather than a metaphor for it. It reads as a surveying instrument, which suits the navy and brass Astrolabe system, and reduces to a caret with a dot at 16 pixels (`brand/parallax-favicon-16.svg`). One risk to watch in refinement: a bare drafting compass echoes the Masonic compass. Keep the orbit arc and the angle arc, which that symbol lacks. My first draft crossed the two lines and carried them past the point; rendered small it looked like a pair of scissors, so I dropped it.

Alternate, "two views" (`brand/parallax-mark-two-views.svg`): one solid disc and one outlined disc offset to the right. Simpler, but close to other overlapping-circle marks, so I would use it only as a secondary graphic, for example behind the Perspective Runs.

Wordmark: "parallax" in lowercase Spectral SemiBold, with the two l's drawn as strokes leaning toward each other so they meet above the x-height, echoing the sightlines. Chinese lockup: 格局 in Noto Serif SC SemiBold, set beside the mark, never under the Latin wordmark.

Colours stay in the product's system: navy `#0B1424`, brass `#CFA95A`, paper `#F3F5F8`, ink `#0D1726`.

## The result card is the growth engine

People will share the card, not the homepage, so the card deserves as much design time as the logo. What 8values and 16Personalities get right is a card that is legible as a thumbnail and gives people something to argue about. The Parallax card should carry, in this order: the archetype name large (Shi 勢), one line ("Realism, with restraint"), a seven-dot strip showing where the person sits on each dimension, the nearest alternative, and the brand small in the corner. No paragraphs, no disclaimers. A level result gets its own card ("No clear lean yet") rather than a borrowed archetype.

## Instructions for Claude Design

Open Claude Design and start a new project. Upload the SVGs in `brand/`, the product's `DESIGN.md`, a screenshot of the current landing page, and a screenshot of a current result page. Then paste:

```
Brand system for "Parallax" (Chinese: 格局), a web test that shows people how they think about international politics and compares them with eight readings drawn from different traditions. Audience: IR students, policy professionals, China watchers, AI governance people. Tone: an analyst with a view, not a personality quiz and not a think-tank report.

Keep: the navy and brass palette and the Spectral / Libre Franklin type pairing from DESIGN.md. The landing page and menu stay as they are.

Deliver:
1. The angle mark refined at 16, 32, 64, 180 and 512 px, in brass on navy and in ink on paper. Keep the geometry: two observers on an orbit arc, one sighted point, the angle arc between the sightlines. Avoid any resemblance to the Masonic compass.
2. The wordmark "parallax" in Spectral SemiBold, lowercase, with the two l's as converging strokes. Horizontal lockup with the mark, and a Chinese lockup with 格局 in Noto Serif SC.
3. Result share card at 1200×630 and 1080×1350, for three states: a clear result (Shi 勢, "Realism, with restraint", seven-dot dimension strip, nearest alternative), a close result (two names), and a level result ("No clear lean yet"). Legible at 300 px wide.
4. Favicon set and a 512 px app icon.
Constraints: no gradients, no glow, no globe or compass clichés, no em dashes in any copy.
```

When it is done, export the SVGs and PNGs, then give Claude Code or Codex this:

```
Replace the brand. Before anything else: git fetch origin; branch from origin/main.
1. Put the exported assets in public/brand/ and add app/icon.svg, app/apple-icon.png and app/opengraph-image assets from them.
2. Replace "IR Worldview Inventory" and "IR Worldview" in user-visible strings with "Parallax" (91 occurrences in 62 files under app, components, lib, content, messages and i18n; grep -rn "IR Worldview"). Keep "IR worldview" where it is a description rather than the name, for example "a test of your IR worldview".
3. messages/zh-Hans.json brand: 格局. Check every zh string that embeds the old brand.
4. Share text: "My Parallax reading: {name}" and the recipient version "A Parallax reading: {name}" in components/results/share-actions.tsx and the ResultCardHeroShare call sites.
5. Rebuild app/api/card/route.tsx to the Claude Design card for the three states.
6. Update README.md and TRADEMARK.md. Do not rename the repository, routes or storage keys.
Run the full CI including Playwright, update snapshots deliberately, and paste before/after screenshots of the landing page, a result page and the card.
```
