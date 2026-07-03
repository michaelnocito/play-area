# Rooftop Sprint — Dev Notes (always read first in a new chat)

> **⚡ RESUME HERE (2026-07-02, Batch 3 shipped): Next = BATCH 4 — score/tally.** Read
> `ROADMAP.md` FIRST (§3 has Mike's points spec: CLEAN 100 / HEAVY 250 / PERFECT 500 / domino
> escalator + end-of-run count-up tally). Batches: B1 feel ✅ → B2 identity ✅ → B3 audio ✅ →
> **B4 score/tally** → B5 economy + permanent progression (approved, spec §4, 2 sessions) →
> B6 districts/content → B7 ship wave (regenerate stale `builds/` there; GM/GD keep
> GAMEID_PLACEHOLDER pending Mike's dashboards).
>
> **🔊 BATCH 3 (light-reactive audio) DONE 2026-07-02:** procedural WebAudio `Snd` module, zero
> assets. Every voice = §7 speaker-scaling layers (click 2–5kHz / mid / 2nd–4th-harmonic bass /
> true-sub garnish, exponential ramps, mono by construction). Music sequencer runs off the SAME
> clock as the weapon glow throb (`Snd.tick(drawT, lampLight, state)` from `draw()`; 8th grid on
> `drawT*0.12`, bass lands on the throb peak) — layers gate on `lampLight` (embers → shimmer 0.2
> → bells 0.45 → pulse-bass 0.7 → hats 0.9), death collapses to embers. Full SFX set wired
> (jump/land/swing/kill-by-tier/chime-rising/domino/sparkle/death/slide/bird). Slow-mo = master
> low-pass via `Snd.setTs`. Mute = 🔊 button + M key + persisted + CG muteAudio listener; ad duck
> on CG adStarted/adFinished; `window.Snd` exposed for GM/GD `__adPause` wiring at B7 regen.
> **Headless-inert:** no `AudioContext` in the vm sandbox → Snd returns a noop stub, suite
> untouched. AudioContext resumes on first pointer/key gesture. QA knob: `Snd.qaHighpass(800)`
> in console = the phone test (10 = off). Mike's real-speaker ear pass pending.
>
> **🏮 BATCH 2 (Lamplighter identity) DONE 2026-07-02:** weapon = lamp on a pole (same
> reach/hitbox/timing — purely visual); guards carry lamp-poles (lamp goes dark on kill) and 6
> homing light-motes stream from each kill into your lamp; **`lampLight` run-state 0→1**
> (+0.12/kill, resets on death) drives weapon glow radius + flame brightness + a steady glow
> throb (`drawT*0.12` — B3's bass pulse must share this clock) + windows rekindling behind the
> player; feathers → **LIGHT** everywhere player-facing (HUD, tally, glowing-mote art; internal
> `feather*` var names kept on purpose); menu/death copy in Lamplighter voice (wardens, no
> blade/stealth). B3 hooks: key music layers off `lampLight`, light-stream chime on mote arrival.
>
> **Suite note (pre-existing, logged in ROADMAP §6):** `tools/rs_playtest.js` RNG is unseeded —
> a rare elite gap death (~1 per 2-3 suite runs) reproduces on the untouched Batch-1 build
> (`656facb`), so "expect identical numbers" was never true and Batch 1's green was a lucky
> roll. Low-hazard bar stays 0; guard deaths dominate as designed. Seed + root-cause in §6.
> Keep running the suite after every mechanics change; draw-path smoke (menu + playing) clean.

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
