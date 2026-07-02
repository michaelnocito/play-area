# ROOFTOP SPRINT — Roadmap to CrazyGames-grade

Dev-owned backlog. Standard: **is this genuinely fun and polished by small-game best practices,
and does it clear CrazyGames' quality guidelines?** (GameMonetize/GameDistribution are the earlier,
lower-bar releases — items marked ⚡ are the minimum for those.)

Status: `[ ]` todo · `[~]` partial · `[x]` done · 🔷 = Mike's direct design call

---

## 1. Core loop & mechanics

**Now:** run → jump gaps → timed strikes (CLEAN/HEAVY/PERFECT + domino) → die → retry.
**Standard:** every verb has depth; the "one more run" pull comes from mastery + visible progress.

- [x] Timing-strike windows w/ risk/reward tiers, domino kills, slow-mo payoff
- [ ] 🔷 **REMOVE double jump** (Mike's call — no purpose in current design)
  - Re-sim gap fairness after removal (bots currently sometimes save themselves with the 2nd jump);
    retune `gap` max + step-up heights so all gaps are single-jump clearable at every speed
  - Replace with **hold-to-jump-higher** (variable jump height) — standard runner practice, gives
    the jump button its own skill axis without a second air-jump
  - Update fall-death tip copy (currently teaches double-jump)
- [ ] 🔷 **Slide mechanic via context-sensitive action button**: the STRIKE button doubles as SLIDE
  when a low obstacle is near and no guard is in range (2-button philosophy preserved)
  - Priority rule: guard in strike range → strike wins; else low obstacle ahead → slide
  - Slide = brief hitbox shrink + dust particles + staff tucked
- [ ] Strike-verb extensions (LATER, same button): smash through weak railings/doors, deflect
  thrown objects back at rooftop archers

## 2. Level content & variety

**Now:** gaps + patrolling guards + feathers; one biome, no structure.
**Standard:** new element every ~30-45s of play; recognizable "chunks" so mastery grows.

- [ ] 🔷 **Low obstacles to slide under**: clotheslines, low beams, hanging signs (pairs w/ slide)
- [ ] Guard formations: pairs, back-to-back, one-on-a-ledge (feeds domino setups — place guards
  in lines so PERFECT shots have targets; the mechanic sells itself)
- [ ] Rooftop chunk library: hand-authored segment patterns (staircase roofs, long gap + rope,
  lantern alley) mixed procedurally instead of pure RNG — the Flipline formation-sequencer pattern
- [ ] A second visual zone (dawn palette swap ~500m) for long-run freshness — cheap w/ pre-rendered
  sprite rebuild
- [ ] Milestone events every 250m: brief "district" banner + palette shift + guard density bump

## 3. Scoring & end-of-run tally 🔷

**Now:** score = distance + feathers×5, shown only at death, formula invisible.
**Standard:** every action has a visible point value; the tally screen is the retention beat.

- [ ] 🔷 **Points system, tallied at end of run** (Mike's spec):
  - CLEAN kill = 100 · HEAVY BLOW = 250 · PERFECT = 500 (set values, scaling with skill to perform)
  - 🔷 **Domino = biggest boost**: each FELLED body = 500 × chain position (2-chain = +1000,
    3-chain = +2500 cumulative...) — knocking over multiple enemies is the jackpot
  - Distance = 10/m base so movement still matters
  - Feathers = flat pickup value (also currency, see §4)
- [ ] **End-of-run tally screen**: line-item count-up (Distance → Kills by tier → Domino bonus →
  Feathers → TOTAL) with tick sounds and a NEW BEST stinger — the Rune Dash/arcade pattern
- [ ] In-run floating point popups (+500 PERFECT) so values are learned during play
- [ ] Per-run stats line (kills by tier, best chain) under the tally

## 4. Economy: currency + shop 🔷

**Now:** feathers exist, worth score only. No sinks.
**Standard:** one soft currency, cosmetic-first shop, buffs as consumables; no pay-to-win (portal
monetization = ads, not IAP). Flipline's 17-item shop is the proven template.

- [ ] 🔷 **Currency**: feathers become the spendable currency (collected + kill drops).
  Batch-3 rename applies here (feathers → sigils/marks, kills AC-clone read; pick at build time)
- [ ] 🔷 **Cosmetic shop**: cloak colors/patterns, staff skins (wood/jade/gold/moonlit), trail
  effects, strike-flash colors — visible in the character at all times, rarity tiers, live try-on
- [ ] 🔷 **Buff shop (consumables, pre-run pick)**: head start (skip to 200m), starting shield
  (survive one hit), feather magnet, double-feathers run — banked inventory, one equipped per run
- [ ] Rewarded-ad hooks on the economy (revive-once-per-run; double-feathers offer on tally screen)
  — adapters already wired in all three platform builds
- [ ] Persistence: extend the existing Save wrapper (localStorage + CG Data Module) to a save object
  (coins, owned, equipped) — version the key

## 5. Controls & input feel

**Now:** 2 buttons (jump/strike), keyboard + touch zones. Solid foundation.
**Standard:** device-adaptive prompts, zero input latency, no dead inputs.

- [ ] Input buffering: jump pressed ≤100ms before landing fires on landing (standard runner QoL)
- [ ] Coyote time (~80ms) off roof edges
- [ ] Show keyboard prompts on desktop / touch zones only on touch devices (currently both always)
- [ ] Keys: verify no browser-reserved keys (Space scroll is prevented ✓); add W/Z alternates for
  AZERTY compliance (CG guideline)

## 6. Difficulty & fairness

**Now:** sqrt speed ramp; strike windows time-normalized (done); all-tier bot suite exists.
**Standard:** deaths always feel earned; skill tiers separate cleanly (verified: 68s vs 38s).

- [ ] Re-run the bot fairness suite after EVERY mechanics change (double-jump removal, slide) —
  keep `rs_playtest.js` harness in repo under `tools/` instead of scratchpad
- [ ] Anti-streak guard on formation RNG (no 3 identical challenges in a row)
- [ ] First 150m = guaranteed gentle intro chunk (teach jump → teach strike → first mixed)
- [ ] Difficulty cap: speed plateaus at ~2500m so elite runs stay humanly possible

## 7. Audio (BIGGEST GAP — nothing exists) ⚡

**Standard:** procedural WebAudio (Flipline `Snd` pattern proven): zero assets, in-key SFX.

- [ ] ⚡ SFX: jump whoosh, land thud, strike swing, kill hit (pitch by tier: CLEAN low → PERFECT
  bright), domino impact, feather sparkle, death, slide scrape, bird flutter
- [ ] Slow-mo audio: low-pass filter sweep during bullet-time (sells the effect hard, cheap)
- [ ] Ambient bed: sparse night-city drone + distant wind, calm not busy
- [ ] Mute button (platform guideline: CG `muteAudio` setting listener + in-game toggle)
- [ ] ⚡ Ad-break ducking hooks already exist (`__adPause`) — wire `Snd.duck` when audio lands

## 8. Visuals & juice

**Now:** full procedural pass done (sky/moon/skyline/lanterns/cloak/birds/embers), native-res,
slow-mo. Strong.

- [ ] Landing dust scaled by fall height; speed lines at high velocity
- [ ] Guard death variety: FAR-kill slump animation (currently same fade)
- [ ] Slide dust + cloth flatten (with §1 slide)
- [ ] Moon parallax drift over long runs; occasional shooting star (cheap delight)
- [ ] Menu screen: draw the game world behind the overlay dimmed (currently flat dark)

## 9. UX, onboarding & UI ⚡

**Standard (CG explicit):** gameplay ≤1 click, teach in-game, visuals over text.

- [ ] ⚡ Trim menu overlay text to one line + control glyphs; move lore flavor to a subtitle
- [ ] In-world teach beats: first gap shows JUMP prompt, first guard shows STRIKE (partial: guard
  teach exists), first low obstacle shows SLIDE
- [ ] HUD: current run POINTS counter (top center) once §3 lands; feather count doubles as currency
- [ ] Death → replay in ≤1 input (canvas tap ✓, add Space/Enter hint line)
- [ ] Pause (P / tap HUD) with resume countdown — CG QA checks this

## 10. Performance & tech

**Now:** fixed-timestep ✓, zero-alloc pools ✓, pre-rendered sprites ✓, native-res ✓, instant boot ✓.

- [ ] Perf audit at RSCALE 4 on weak hardware (Mike's i5-8265U is the perfect test rig) — if the
  1920×1080 backing store strains it, cap RSCALE by a quick FPS probe in the first seconds
- [ ] Move `rs_playtest.js` + a README into `tools/` (keep the chainable-Proxy ctx stub note)
- [ ] Lighthouse-style load check: single file, no external assets except SDK — keep it that way

## 11. Monetization & SDK ⚡

**Now:** CG master + itch/GM/GD builds regenerate from one script; interstitial on death; rewarded
wired but unused.

- [ ] ⚡ Real gameIds from Mike's GM + GD dashboards (replace `GAMEID_PLACEHOLDER`)
- [ ] Rewarded-ad uses (needs §4): revive once per run · double-feathers on tally
- [ ] Interstitial cadence check vs each platform's policy (currently every death — likely too
  often; add min-interval 2-3 min like Flipline's cooldown)
- [ ] Regenerate builds after every master change (`make_rs_builds.py` — move into repo `tools/`)

## 12. Submission assets & QA ⚡

- [ ] ⚡ Cover art: render a hero frame at 1920×1080 from the live game (technique proven), then
  crop set: GM sizes + GD 512×384/512×512/200×120/1280×720 (reuse flipline `covers/*.py`)
- [ ] ⚡ Gameplay clip 15-20s (MessageChannel-paced capture, WEBM — see Flipline gotchas memo)
- [ ] Store copy: name/desc/controls/tags — write AFTER feather rename so no stale terms ship
- [ ] Real-device mobile touch pass (no game has one on record — do it before first submission)
- [ ] CrazyGames QA tool pass (their automated checker) before CG submission

---

## Sequencing

**Sprint A (monetize-ready ⚡, GM/GD):** §7 SFX minimum → §9 onboarding trim + pause →
§11 gameIds + interstitial cooldown → §12 assets → SUBMIT GM + GD + itch.

**Sprint B (the fun deepening):** §1 double-jump removal + hold-jump + slide → §2 low obstacles +
guard formations → §3 points + tally screen → re-sim fairness.

**Sprint C (retention/economy):** §4 currency + shops + rewarded hooks → §8 juice extras →
§2 second zone.

**Sprint D (CrazyGames submission):** §6 difficulty cap + intro chunk → §10 perf audit →
§12 CG QA tool → SUBMIT CG.

Feather rename (AC-clone risk) lands at the START of Sprint B (touches copy, shop, tally naming).
