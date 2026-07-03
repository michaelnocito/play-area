# Rooftop Sprint — Dev Notes (always read first in a new chat)

> **⚡ RESUME HERE (2026-07-03, RS-VARIETY + RS-ECON shipped — ALL 30 gap-report items done
> except the chunk-library half): Next = MIKE'S FULL PLAYTEST, then B7 SHIP WAVE** (perf audit
> on his i5, cover art + clips, store copy, GM/GD gameIds, regenerate `builds/` — wire
> `window.Snd.duck` into their `__adPause` — CG QA tool, submit all portals). Read the gap-report
> status block at the top of `ROOFTOP_SPRINT_ROADMAP.md` for exactly what shipped.
>
> **🌗 RS-VARIETY + RS-ECON DONE 2026-07-03 (HEAD `c1519e1`):** Daily Trial (EMBER-gated,
> seeded `rnd()`/mulberry32 route + date-pinned modifier + own best) · district-gate BOONS
> (FLAME-gated 1-of-2, picked with JUMP/STRIKE during a paused overlay, `state==='boon'`) ·
> Night Shift rotating modifiers · ARCHERS (deflectable arrows: timed strike returns them and
> kills the sender; slide/leap also dodge) · FEINT WARDENS (steel-X shield 60/150 frames =
> leap read) · dark BRAZIERS (strike to rekindle; press-theft guarded) · mote arcs over wide
> gaps · WHIFF RECOVERY (ground 24f / air 10f, slides exempt) · buffs (Head Start / Warding
> Charm / Mote Magnet / Double Light — chips on menu+death, one per run, none in Daily) ·
> 5 cloak colors (live on runner) · rewarded ads: once-per-run REVIVE (un-banks `lastBank`
> then resumes the run) + double-Light on the tally. Harness: bots read feints (leap) and
> arrows (deflect), presses are reach-aware (whiff recovery punishes flails), boon state
> handled, `RS_DEBUG=1` dumps death forensics to stderr. Suite green, campaign winnable,
> slow tier separates. Earlier same day: RS-CAMPAIGN + RS-PROG (full detail in the roadmap's gap-report block; older batch logs live in git history of this file).
>
**What this is:** CrazyGames auto-runner, hooded-assassin rooftop theme. Two
mobile-friendly inputs only: **JUMP** (auto-scroll, time your jumps over
gaps) and **STRIKE** (tap to auto-target the nearest guard in range). Built
from the original `rooftop-creed` web prototype, restructured with
everything learned shipping Flipline.

Local: `C:\Users\Mike\Projects\GAMES\rooftop-sprint`. Repo:
`github.com/michaelnocito/rooftop-sprint` (to be pushed). Single deliverable
= `index.html` (vanilla JS + Canvas, no build/deps, 480×270 logical space,
CSS-scaled letterbox).

## Why a new repo, not rooftop-creed or rooftop-creed-godot

- `rooftop-creed` (web) = the original prototype (jump/slide/strike,
  auto-scroll). Superseded by this.
- `rooftop-creed-godot` = diverged into a **player-driven** stealth
  platformer (no auto-scroll, jump/slide/strike combat chain). Different
  game, kept separate, not touched by this build.
- This repo is the from-scratch CrazyGames version: auto-scroll runner,
  exactly 2 inputs (jump + strike-nearest), reusing Flipline's engineering
  conventions rather than the prototype's control scheme.

## Carried over from Flipline

- **Perf contract:** fixed-size pools for particles/messages/segments/
  guards/feathers — zero per-frame allocation, `active` flags instead of
  push/splice.
- **CrazyGames SDK wrapper:** same graceful-no-op pattern (`CG.init`,
  `loadingStart/Stop`, `gameplayStart/Stop`, `happytime`, `interstitial`,
  `rewarded`). SDK v3 call names — reverify against current docs before
  submission.
- **Gotcha fixed before it bit us:** `SDK.data.getItem()` throws
  synchronously ("CrazySDK is not initialized yet") if touched before
  `CG.init()` resolves — and since the whole game boots inside one IIFE, an
  uncaught throw at load time kills the *entire* script silently (blank
  screen, no errors visible except the SDK's own console.error). Fixed by
  reading the initial best-score from `localStorage` directly and gating
  all `SDK.data` access behind an `sdkReady` flag that only flips true
  inside the `CG.init` callback.
- **Known preview-environment gotcha (from Flipline):** the Claude Preview
  tab runs backgrounded, which freezes `requestAnimationFrame` entirely
  (`document.hidden === true`). Screenshots will hang/timeout and the game
  will appear frozen at 0 in this sandbox specifically — this is a preview
  tooling limitation, not a game bug. Verified core logic instead by
  exposing a temporary `window.__debug` hook (update/draw/player/guards/
  tryJump/tryStrike), driving `update()` directly in a loop, then removed
  the hook before commit. A bot that jumps whenever grounded survived to
  444m/1348 frames — jump, gravity, gap-fall death, guard spawn/patrol/
  alert-telegraph, and strike-nearest-guard all confirmed working.
- Solo authorship, outside OneDrive, commit+push after every change,
  labelled test steps, short replies — same conventions as every other
  game project.

## Current systems (first playable milestone)

- **Auto-scroll:** `speed = baseSpeed + sqrt(distance) * 0.09` — gentler
  ramp than a linear increase (borrowed from the Godot fork's difficulty
  research).
- **Jump:** double-jump, `GRAVITY 0.34` / `JUMP_V -7.2`, apex clears guard
  height with room to spare — jumping over a guard is a viable skilled
  alternative to striking it.
- **Strike:** auto-targets nearest *alive* guard within `STRIKE_RANGE_X 36
  / STRIKE_RANGE_Y 30`, one guard per tap, feather reward + particle burst
  + shake.
- **Guards:** patrol a segment, red "alert" telegraph + "!" when player is
  within 60px (fairness — danger reads before it punishes), kill on
  contact unless the player's feet are `GUARD_CLEAR_DY` above them (jumped
  clear).
- **Feathers:** floating collectible, bob animation, +1 each; score =
  `floor(distance) + feathers*5`.
- **Score persistence:** best score via `localStorage`, mirrored to
  CrazyGames Data Module once SDK is ready.
- **Mobile controls:** two large tap zones across the bottom 30% of the
  screen (left=JUMP, right=STRIKE), translucent labels, `pointerdown`
  handlers. Desktop: Space/Up=jump, X/F=strike, Enter=restart.

## Not yet built (this session was explicitly "take more time")

- Procedural audio (Flipline's music/SFX scheduler) — currently silent.
- Cosmetic shop / currency sink for feathers beyond scorekeeping.
- Revive-on-death / rewarded-ad flow (`CG.rewarded` is wired but unused).
- Cover art, gameplay capture clips, CrazyGames QA tool pass.
- Difficulty/formation variety beyond gaps + solo guards (no guard
  clusters, no varied hazard types yet).
- Real visual playtest — couldn't screenshot in this sandbox (see gotcha
  above); Mike should open `index.html` directly or via
  `npx serve -p 4214 .` and play it by hand next.

## Launch.json

Added a `rooftop-sprint` entry (port 4214) to `C:\Users\Mike\.claude\launch.json`
for preview tooling.

## Conventions

Solo authorship — commit as Michael Nocito <hello.michaelnocito@gmail.com>,
NO Co-Authored-By. Outside OneDrive. Commit + push after every change.
