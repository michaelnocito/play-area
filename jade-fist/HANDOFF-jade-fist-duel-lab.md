# HANDOFF — Jade Fist duel feel-lab

**Date:** 2026-07-26 · **Repo:** `C:\Users\Mike\Projects\play-area` (public, GH Pages)
**Last commits:** `dd02a33` (JF-#065), `d23f59e` (JF-#066) · **Next free number: JF-#067**

## Read first, in this order
1. `BUILD_PILLARS.md` (play-area root) — the three pillars this work is an instance of
2. `GAME_BIBLE.md` (play-area root) — CrazyGames compliance floor
3. `jade-fist/JADE_FIST_DEV_NOTES.md` — scroll to JF-#065 and JF-#066 at the end
4. This file

## What this is
A Mario-64 "chase the rabbit" feel-lab for Jade Fist, mirroring the one built for Odd Sock
(`flipline/proto/shirt-test.html`, commit `3095ca4`). Pillar 1: one enemy, played until the
core verb is fun, before any more content.

**Live:** https://michaelnocito.github.io/play-area/jade-fist/proto/duel-test.html
**Local:** `C:\Users\Mike\Projects\play-area\jade-fist\proto\duel-test.html`
**Harness:** `jade-fist/proto/duel-harness.js` — `node duel-harness.js`, currently 10/10

Standalone single file. **Not wired into the game.** Nothing here has been applied to
`jade-fist/index.html` yet — that is a deliberate decision waiting on Mike's feel-gate.

## How it works
One normal foe on a fixed clock, cycling **MID → HIGH → SWEEP** so the rhythm is learnable.
Nobody dies: he is thrown and walks back in, you are hit and lose your streak.

| Line | Colour | Answer | Notes |
|---|---|---|---|
| MID | red | press AWAY (back-step) | counterable when armed |
| HIGH | amber | press UP (rise) | counterable when armed; +2f windup, see below |
| SWEEP | cyan | HOLD DOWN (low guard) | **armored** — punching into it gets you swept |

A **fresh** dodge (within 20f) arms the jade ring for `READY_DUR`. Armed, striking into his
next windup **throws** him; in the final third that is a PERFECT. Unarmed, your strike is a
chip that does not stop the swing. Lazy held crouch slips the blow but arms nothing.

**Live tuning:** `[ ]` windup · `- =` gap · `, .` arm window · `R` reset. All shown in the HUD.

## Current numbers
- `WINDUP` **28f** (467ms), floor **22f**, per-line offset `LINE_WIND` (high +2, sweep −1)
- `READY_DUR` **110f** — the shipped value, unchanged
- `GAP` 40f · `BACK_DUR` 20 · `RISE_DUR` 32 · `DUCK_DUR` 30 · freshness 20f · `PERF_TH` 0.66
- hit-stop tiers 8/12/16 (JF-#061, verbatim from Capcom)

## The two findings so far
**1. The dodge→counter loop did not close one-on-one.** At the old 52f telegraph the budget
from your dodge to a ripe next windup was ~112f against a 110f arm. Invisible in the full game
because there you dodge one foe and counter a *different* one.

**2. The telegraph was nearly twice human choice-reaction time, which is what made you jump
early.** Capcom's SF Seminar (Hour 1) puts pure reaction at "at least 10 frames" — but that
assumes you know which button you are pressing. Three lines means a *choice* reaction, 350-400ms
≈ 21-24f (Balakrishnan et al., *Neurology Research International* 2014, DOI 10.1155/2014/301473).
A dodge only covers 20f, so at 52f you read the line at ~23f then had to **wait** ~9f or your
dodge expired. Waiting is unnatural, so you press early. **Rule: telegraph ≈ choice RT + a few
frames.** 28f does that. Guessing at frame 4 still loses.

Fixing 2 fixed 1 for free (budget dropped to ~96f). One number was wrong, not two.

Same paper: red and green are reacted to significantly faster than yellow (P<0.0001, P=0.0002),
which is why the amber HIGH line pays +2 frames.

## Open decisions — Mike's, do not build past these
1. **Is holding DOWN as a LOW GUARD the right answer to the sweep?** With NO JUMPING locked
   (JF-#059) there is no third movement axis, so the crouch now draws a shin bracer and the
   sweep checks off it, rather than reading as ducking under a leg. This is how Street Fighter
   answers a sweep. The alternative is reopening a hop, which contradicts the no-jump call.
2. **Does 28f feel right in the hand**, or tighter/looser?
3. **Fixed MID→HIGH→SWEEP rotation, or random** once all three can be read?
4. **Does any of this go back into `index.html`,** and does the lab duel become the game's
   opening beat (a single named duel before the crowd waves)?

## Test steps for Mike
- **DL-a** each line answered correctly feels distinct
- **DL-b** the jade ring reads as "you may counter now" without text
- **DL-c** a PERFECT counter feels different from an early one
- **DL-d** the fixed rotation is learnable, not boring
- **DL-e** report the three numbers that felt right (windup / gap / arm)
- **DL-f** the telegraph no longer makes you jump early
- **DL-g** the sweep reads as a leg from the silhouette alone
- **DL-h** low guard vs sweep feels like a check, not a hide
- **DL-i** confirm the low-guard answer, or ask for the hop back

## Gotchas for the next session
- **The preview pane does not re-execute JS on reload for `file:` pages.** Stub a global once
  and it stays stubbed through navigation. Use the node harness for anything stateful.
- **If you are ARMED, the same input becomes a counter and no dodge is recorded.** Zero
  `readyT` before measuring the dodge budget or your test will report a false failure.
- **Reaching a later line in the rotation means the earlier ones landed** unless your harness
  answers them. Snapshot `dodged`/`taken` around the single attack you are measuring.
- Top-level `let`/`const` in the game script are **not** properties of a `vm` sandbox object;
  expose them via a second `runInContext` with getters (see `duel-harness.js`).
- Commit as Michael Nocito <hello.michaelnocito@gmail.com>, no AI trailers. Commit + push
  after every change. A green push is not proof it shipped — check the Pages build and curl
  the live URL for a marker.

## Not started
- The full game's own numbers are untouched. Deciding whether `index.html` adopts the 28f
  telegraph and the sweep is decision 4 above.
- Roadmap G6 (local 2P versus) remains the only other buildable item, and Mike parked it.
