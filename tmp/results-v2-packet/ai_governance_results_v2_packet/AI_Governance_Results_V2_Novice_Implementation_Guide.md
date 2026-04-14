# AI Governance Results V2 - Novice Implementation Guide

This guide assumes:

- your current AI Governance Compass is already working locally
- your IR worldview quiz still works
- you are in the repo root in the VS Code terminal
- you want to improve the AI results page without risking the rest of the site

This packet is designed to be a **safe V2A upgrade**.
It should make the results page much richer **without changing the quiz questions, scoring, or share payload format**.

---

## Part 1 - Protect your current work first

Run these commands from the repo root:

```bash
git status
git add -A
git commit -m "Checkpoint before AI results V2" || true
git branch backup/ai-results-v1
git tag ai-results-v1-safe
```

If your feature branch is already the AI branch, stay on it.
If you accidentally moved off it, go back with:

```bash
git checkout feature/ai-governance-compass
```

Optional but recommended: push the checkpoint to GitHub.

```bash
git push origin backup/ai-results-v1
git push origin ai-results-v1-safe
```

---

## Part 2 - Download and unzip the packet

Download the packet zip from ChatGPT to your computer.
Assume it lands in `~/Downloads`.

Then run:

```bash
mkdir -p tmp/results-v2-packet
unzip -o ~/Downloads/ai_governance_results_v2_packet.zip -d tmp/results-v2-packet
find tmp/results-v2-packet -maxdepth 4 -type f | sort
```

You should see files including:

- `AI_Governance_Results_V2_Brainstorm.md`
- `AI_Governance_Results_V2_Novice_Implementation_Guide.md`
- `AI_Governance_Results_V2_Claude_Code_Prompts.txt`
- `starter/lib/ai-governance-profile-copy.ts`
- `starter/lib/ai-governance-results-v2.ts`
- `starter/components/results/ai-governance-profile-sections.tsx`

---

## Part 3 - Copy the starter files into your repo

Create the destination folders if needed:

```bash
mkdir -p lib
mkdir -p components/results
```

Now copy the new files:

```bash
cp tmp/results-v2-packet/ai_governance_results_v2_packet/starter/lib/ai-governance-profile-copy.ts lib/
cp tmp/results-v2-packet/ai_governance_results_v2_packet/starter/lib/ai-governance-results-v2.ts lib/
cp tmp/results-v2-packet/ai_governance_results_v2_packet/starter/components/results/ai-governance-profile-sections.tsx components/results/
```

Check that the files are there:

```bash
ls lib | grep ai-governance
ls components/results | grep ai-governance
```

---

## Part 4 - Quick pre-check before asking Claude or Codex to edit anything

Run:

```bash
npm run lint
```

If lint passes, great.
If lint fails at this stage, it is probably a path or import issue.
Do not continue until you see the exact error.

---

## Part 5 - Open the files you are about to work with

In VS Code, open these files side by side:

- `app/ai/results/[payload]/page.tsx`
- `components/results/ai-governance-share-actions.tsx`
- `lib/ai-governance-results.ts`
- `lib/ai-governance-results-v2.ts`
- `components/results/ai-governance-profile-sections.tsx`

You are mostly going to modify the AI results route page.
You should **not** need to touch IR files.

---

## Part 6 - Use the AI prompts one by one

Open the prompts file from this packet.
Paste them **one at a time** into Claude Code or Codex.
Do not paste all of them at once.

### Prompt 1

Use `PROMPT 1 - WIRE IN THE RESULTS V2 HELPERS`

After Claude or Codex finishes, run:

```bash
npm run lint
```

If lint passes, commit immediately:

```bash
git add -A
git commit -m "Wire AI results V2 sections"
```

### Prompt 2

Use `PROMPT 2 - HERO UPGRADE ONLY`

Then run:

```bash
npm run lint
```

If lint passes:

```bash
git add -A
git commit -m "Upgrade AI results hero with clarity and hybrid signal"
```

### Prompt 3

Use `PROMPT 3 - POLISH THE NEW SECTIONS`

Then run:

```bash
npm run lint
```

If lint passes:

```bash
git add -A
git commit -m "Polish AI results V2 layout"
```

### Prompt 4

Use `PROMPT 4 - SAFETY CHECK ONLY`

This is important because the result page must still work from share links.
Read the output carefully.
If the agent says the new section depends on raw answers being present, stop and fix that before continuing.

### Prompt 5

Use `PROMPT 5 - OPTIONAL SMALL COPY TUNING`

Then run:

```bash
npm run lint
```

If lint passes:

```bash
git add -A
git commit -m "Tighten AI results V2 copy"
```

### Prompt 6

Only use this if lint fails after the earlier prompts.

---

## Part 7 - Run the site and check the result page manually

Run:

```bash
npm run dev
```

Open the site:

```bash
open http://localhost:3000
```

Now manually check these things.

### Home page

- the home page still loads
- the IR quiz card still exists
- the AI card still exists

### IR side

- the IR quiz still opens
- the IR result flow still works

### AI side

Open one or more existing AI result links or retake the quiz.
Check for:

- hero still looks right
- clarity text appears and makes sense
- hybrid label only appears when the profile is mixed
- the new sections render in a sensible order
- the policy cards do not overflow on mobile width
- the tensions section never shows blank space
- runner-up and farthest-archetype cards use real archetype names
- the about/methods area still exists lower on the page
- the share buttons still work

### Most important sanity test

Open the result page in a fresh private browser window.
If the result is loaded from a share link, the new Results V2 content should still appear.
If it disappears in private browsing, the implementation probably depended on local raw answers instead of payload-safe result data.

---

## Part 8 - Clean up and save the work

When everything works:

```bash
git add -A
git commit -m "Finish AI Governance Compass Results V2"
```

Optional push:

```bash
git push -u origin feature/ai-governance-compass
```

---

## Part 9 - Rollback commands if anything goes wrong

If a prompt makes a mess and you have not committed yet:

```bash
git reset --hard HEAD
```

If you want to go back to the checkpoint from the start of this guide:

```bash
git checkout feature/ai-governance-compass
git reset --hard ai-results-v1-safe
```

If you want your backup branch:

```bash
git checkout backup/ai-results-v1
```

---

## Part 10 - What this packet does not do yet

This Results V2 packet does **not** yet add:

- new quiz questions
- raw scenario recap on the result page
- transhumanism overlays
- redistribution overlays
- centralization vs decentralization overlays
- compare-with-friends features
- bilingual or Chinese-language mode

Those belong in the next packet.
This one is about making the current result page feel much more substantial first.

---

## Recommended next packet after this one

Once Results V2 is stable, the next high-value packet should probably be:

**AI Governance Overlays + Compare Mode**

That packet would add:

- overlay worldview badges
- raw scenario-choice recap
- better China and middle-power interpretation
- stronger share and comparison features

