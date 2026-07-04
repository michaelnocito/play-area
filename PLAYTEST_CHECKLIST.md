# PLAYTEST CHECKLIST — reusable across every game in this repo

Modeled on how QA/playtest actually runs at game studios, scaled down for a solo dev who is
usually both the developer and the tester. Read this alongside `GAME_BIBLE.md` (the CG/design
standard) — that doc says WHAT the bar is; this doc says HOW to test against it.

**How studios structure this (the research behind this doc):** most studios run several
distinct *passes*, not one big "playtest," because each pass is tuned to catch a different
class of problem and mixing them dilutes all of them. A smoke test wants speed. A cold/FTUE
test wants zero context. A systematic pass wants completeness over feel. A balance pass wants
several back-to-back runs, not one. Bug reports get a severity tier so triage is fast. Sessions
end with a structured debrief, not just vibes. Solo devs skip this and end up either shipping
broken builds or drowning in unstructured "it felt off" notes they can't act on.

---

## 0. Before you start
- [ ] Note the build: commit hash or task number (e.g. `JF-#038`), and where it's running
      (local file / GH Pages / CG preview environment)
- [ ] If you're both dev and tester: **put real time between finishing the build and testing
      it** (a few hours minimum, overnight if the schedule allows). Studios use fresh
      playtesters for a reason — you cannot catch your own onboarding confusion five minutes
      after writing the onboarding.
- [ ] Clear/reset save data at least once per test cycle so you're testing the FIRST-run
      experience too, not just your already-progressed save

## Pass 1 — Smoke test (2-5 min, every build, no exceptions)
Fast, shallow, just "does it run." Run this before anything else, every time.
- [ ] Loads with no console errors
- [ ] Reaches gameplay in ≤1 input from load (or whatever the platform's bar is)
- [ ] Core loop is reachable and completes one full cycle (one run/level/match)
- [ ] Restart/retry works
- [ ] Audio plays, mute works
- [ ] No crash, no stuck states, no infinite loading

## Pass 2 — Cold / first-time-user test (once per major feature, blind if possible)
Studios call this FTUE (first-time-user-experience). The point is zero prior context —
if you're the only tester, do this pass with the *longest* gap since you last looked at the
code, or better, hand it to someone who's never seen it.
- [ ] Don't read any instructions/docs first — just open it and try to play
- [ ] Note every moment of "wait, what do I do?" — that's an onboarding gap, not a player failure
- [ ] Note anything you did that the game didn't expect (this finds missing input handling)
- [ ] Could you tell, at every moment, what to do right now / what you just did / where
      you're going next? (if no — that's a real finding, not nitpicking)

## Pass 3 — Systematic feature pass (methodical, not fun-focused)
Go feature-by-feature with a checklist, not a free-play session. Boring on purpose —
completeness beats vibes here.
- [ ] Every menu screen: every button/control does what its label says
- [ ] Every input method (keyboard, touch, controller if supported) reaches every action
- [ ] Every currency/progression system: earn it, spend it, see it update correctly
- [ ] Every save/load path: close and reopen, does state survive correctly
- [ ] Every "edge" state: 0 of something, max of something, first time vs Nth time
- [ ] Every screen at minimum and maximum supported resolution/aspect ratio

## Pass 4 — Balance / fun pass (several back-to-back sessions, not one)
One playthrough tells you almost nothing about balance — studios run multiple back-to-back
sessions and look for the shape across them, not any single run.
- [ ] Play 3-5 full sessions back to back, same day
- [ ] Where did difficulty spike unfairly vs. feel earned?
- [ ] Where did it drag (the "boring/repetitive stretch" red flag)?
- [ ] Would you play a 4th/5th run? Why or why not? (the GAME_BIBLE "critical test")
- [ ] Rate 1-5: fun, fair, clear, would-recommend — track this over time per build so you can
      see trend, not just a snapshot

## Pass 5 — Platform compliance pass
Whatever the target platform's hard requirements are (see `GAME_BIBLE.md` for CrazyGames).
Run this pass right before submission, not just once early.
- [ ] Re-run the platform's own checklist top to bottom
- [ ] Test on the actual target device classes (not just desktop Chrome)
- [ ] Test the failure paths too: adblock on, slow network, background tab, orientation change

## Pass 6 — Regression pass (after every bug-fix batch)
The pass most solo devs skip, and the one that catches "fixed A, broke B."
- [ ] Re-test everything that touched the same system as the fix, not just the fixed bug itself
- [ ] Re-run Pass 1 (smoke test) in full — a fix that breaks the smoke test is worse than the
      bug it fixed
- [ ] If the fix touched shared/adapter code (e.g. an SDK layer), re-test every caller of it,
      not just the one that prompted the fix

---

## Bug report template (use this shape even in casual chat feedback)
```
Title:       <one line, specific>
Build:       <commit/task number>
Severity:    Blocker / Critical / Major / Minor / Cosmetic
Repro steps: 1. ... 2. ... 3. ...
Expected:    <what should happen>
Actual:      <what happened>
Frequency:   always / sometimes (~X%) / once
```
**Severity tiers** (standard industry triage — use this to decide what blocks ship):
- **Blocker**: can't progress / crashes / save corrupts
- **Critical**: core loop broken or badly degraded for most players
- **Major**: a real feature broken or clearly wrong, workaround exists
- **Minor**: cosmetic-adjacent but real (misaligned UI, wrong color, unclear text)
- **Cosmetic**: polish only, no functional impact

**Ship gate**: no open Blocker or Critical bugs. Major bugs get a real look, not an automatic
block. Minor/Cosmetic go to backlog.

## Session debrief (answer after every playtest session, even solo)
1. What's the one thing that would make me not recommend this to a friend?
2. What's the first thing I'd fix if I could only fix one thing?
3. Did anything feel like it wasted my time?
4. What surprised me (good or bad)?
5. Am I more or less excited to play again than before this session?

---

*Companion to `GAME_BIBLE.md` (the acceptance/design standard) and each game's own
`<GAME>_DEV_NOTES.md` (the build log). This doc is the reusable HOW; those are the WHAT and
the WHEN.*
