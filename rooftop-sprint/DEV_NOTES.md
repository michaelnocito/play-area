# Rooftop Sprint — Dev Notes (always read first in a new chat)

> **⚡ RESUME HERE (2026-07-02, Batch 1 shipped):** Read `ROADMAP.md` FIRST — dev-owned backlog,
> sequencing locked: one quality bar, ONE submission wave to ALL portals (CG+GM+GD+itch).
> **BATCH 1 (Feel & verbs) is DONE and sim-verified:** double jump OUT → hold-to-jump-higher
> (`JUMP_CUT` release trim), slide + low hazards (clothesline/beam/sign) on the context action
> button (guard-in-reach wins the press), jump buffer 6f + coyote 5f, gaps capped at `speed×26`
> for single-jump clearance, slide teach beat w/ tutorial slow-time, per-cause death copy.
> Bot suite now lives in **`tools/rs_playtest.js`** (see `tools/README.md`) — run
> `node tools/rs_playtest.js` after EVERY mechanics change; fairness bars green (elite bots:
> 0 gap deaths, 0 low-hazard deaths <2500m; all deaths = guard timing, the designed skill test).
> It also flushed out two latent engine bugs, both fixed: (1) `groundYForPlayer` flickered
> "airborne" for 1 frame at contiguous roof seams (cancelled slides), (2) `MAX_SEGMENTS 10` could
> exhaust while `nextSpawnX` still advanced → invisible holes in the world (now 14 + spawn
> returns false instead of skipping).
>
> **🏮 RE-SCOPED 2026-07-02 (client intake, HEAD `385c9e0`): identity = THE LAMPLIGHTER.**
> Weapon = lamp on a pole; enemies carry lamps; kills stream light into YOUR lamp (visible
> brightening, `lampLight` run-state); windows rekindle in your wake. Audio = LIGHT-REACTIVE
> SCORE (music layers keyed to `lampLight`, bass pulse clock-shared with the weapon's glow throb),
> built on the small-speaker layer architecture in ROADMAP §7. Now SEVEN batches —
> **Next = BATCH 2 (Lamplighter identity visuals + feathers→LIGHT rename)**, THEN audio (B3,
> ~1.5 sessions) so the music has the light state to key off. 🔶 Permanent lamp progression
> proposed in ROADMAP §4, awaiting Mike's call (would be +1 session in B5).
> Currency is named **"Light"** (Mike's call — never "feathers" player-facing).
> `builds/` derivatives are now STALE vs master — regenerate at Batch 7 (ship wave);
> GM/GD keep GAMEID_PLACEHOLDER pending Mike's dashboard records.

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
