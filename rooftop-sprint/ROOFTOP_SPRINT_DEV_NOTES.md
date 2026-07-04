# Rooftop Sprint — Dev Notes (always read first in a new chat)

> **⚡ RESUME HERE (2026-07-04, RS-#042 feel-pass shipped on top of RS-SILLY): Next = MIKE'S
> FULL PLAYTEST, then B7 SHIP WAVE**
>
> **🎛️ RS-#042 DONE 2026-07-04 (HEAD `3df1962`) — camera shake + pace tuning, from Mike
> reporting shake felt like stutter:** shake was raw per-frame `(rnd()-0.5)*shake` jitter with
> no ceiling and inconsistent overwrite-vs-`Math.max` across triggers — the hard per-frame
> random snap (not the decay rate) was the actual stutter culprit. Replaced with `addShake()`
> (max-not-overwrite, `SHAKE_CAP` 9, global `SHAKE_MULT` 0.6×), exponential decay, and an eased
> `shakeX/shakeY` that lerps toward a new random target each step instead of teleporting to it.
> Speed: added a 30m runway holding base speed before the climb starts, gentler ramp
> coefficient, plateau trimmed 6.6→6.2 so top speed doesn't outrun strike-window readability.
> Tried also widening `strikeWindows()` for more high-speed forgiveness — **reverted**: it
> flipped the default-seed fairness suite to 2 elite gap deaths (bot AI keys off those same
> windows for its jump/strike decision). Verified clean on the speed+shake-only version:
> `rs_playtest.js` and `rs_qa_sweep.js` both green on default seed.
>
> **🎉 RS-SILLY DONE 2026-07-04 (HEAD `702d558`), 10 lighter-touch fun items — cosmetic only,
> zero new hitboxes (Law 12: broad appeal, art-first, never pandering):** warden death quips
> (`WARDEN_QUIPS`, ~30% of kills) · Captain personality lines per stage (`CAPTAIN_QUIPS[0-2]`
> for stagger/break/fell) · bowling-night STRIKE callout + cartoon-star burst on 3+ domino
> chains · reactive moon (sleepy-blink idle → wide-eyed startle on PERFECT/domino-3+/captain
> hits, `moonReactT`) · rare fancy top-hat mote (6% of pickups, +100 instead of +50, doubly
> dapper) · rare party-hat warden variant (8%, own quip bank `SILLY_QUIPS`, same stats/hitbox)
> · hype-announcer lines on PERFECT/domino/captain-felled (`HYPE_LINES`) · a fresh joke
> one-liner under every tally (`TALLY_JOKES`, new `#tallyJoke` div) · rare cameo passerby
> (`cameos` pool, MAX 2, purely decorative, one `CAMEO_LINES` reaction as you pass). Verified:
> parse OK, fairness suite green on default seed, deep QA sweep (`rs_qa_sweep.js`) zero
> violations across campaign/endless/daily. One seed (2) flipped to a gap-death FAIL purely
> from the added cosmetic `rnd()` calls shifting the deterministic stream — confirmed via
> `RS_DEBUG=1` the gap (78px) is well inside the speed-scaled clearable cap (129px), same
> bot-timing-margin noise class documented in §6, not a new mechanic bug.
>
> **🔬 QA SWEEP DONE 2026-07-03 (HEAD `715290f`):** new `tools/rs_qa_sweep.js` — checks attack
> timing + spacing beyond the fairness suite: guard/hazard-off-roof containment, formation
> overlap, consecutive-gap, pool-exhaustion peaks, per-tier kill-timing tallies, feint
> blocked/open ratio, and short Night Shift + Daily Trial coverage runs. Found and fixed 3
> real bugs: **Captain knockback** (`nearest.x += 30 + speed*6` on a non-lethal hit) had zero
> bounds check and could shove him off his own roof into gap airspace — now clamped to the
> segment he's standing on; **domino chains could one-shot a Captain**, skipping his intended
> 3-hit stagger/break/fell sequence — captains now explicitly excluded from the missile-chain
> check; **guard-line formation members** (RS-LEVELDESIGN's showcase 3-wide beat) shared a
> patrol range wide enough that they could eventually walk into each other — fixed by putting
> the whole line on a fixed post (patrolMin=patrolMax=own spot), like archers already had, so
> there's no drift to reason about regardless of roof length. Fairness suite + QA sweep both
> green after the fixes (verified: every tier but slow now wins the campaign outright). (perf audit on his i5, cover art + clips, store
> copy, GM/GD gameIds, regenerate `builds/` — wire `window.Snd.duck` into their `__adPause` —
> CG QA tool, submit all portals). Read the gap-report status block at the top of
> `ROOFTOP_SPRINT_ROADMAP.md` for exactly what shipped.
>
> **🏛 RS-LEVELDESIGN DONE 2026-07-03 (HEAD `051b673`), 10-item level-design pass:** guard LINE
> formations (3-wide showcase beat before every gate, clamped to the roof) · rope-bridge visual
> dressing on gaps >55px · Lantern Alley identity for the post-gate rest beat · signature
> pre-gate brazier+formation set-piece · 6 unique per-district landmarks scrolling into view
> (the Great Beacon visibly brightens on approach) · dawn-palette swap every other Night
> Shift/Daily lap · per-district roof-trim tint · anti-streak on hazard-kind AND enemy-variant
> RNG. **Fixed 2 real bugs it surfaced:** unclamped guard line could float a body past its
> roof's edge into the next gap's airspace (now clamped, line shortens gracefully); the
> district rewrite had silently shrunk the absolute no-hazard-before-220m floor down to
> district-0's 150m rest zone (restored explicitly). Bot jump-margin widened in the harness
> only (confirmed via `RS_DEBUG=1` that every borderline case was trivially clearable at the
> true edge — bot-timing, not a game bug); verified clean across 10+ seeds.
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
