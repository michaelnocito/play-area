# ROOFTOP SPRINT — Roadmap to CrazyGames-grade

Dev-owned backlog. Standard: **is this genuinely fun and polished by small-game best practices,
and does it clear CrazyGames' quality guidelines?** (GameMonetize/GameDistribution are the earlier,
lower-bar releases — items marked ⚡ are the minimum for those.)

Status: `[ ]` todo · `[~]` partial · `[x]` done · 🔷 = Mike's direct design call

---

## 🏮 IDENTITY: THE LAMPLIGHTER (🔷 Mike's calls, client-intake 2026-07-02)

The city's lights are going out; you are the Lamplighter, running the rooftops to take them back.
- [x] 🔷 **Weapon = a lamp on a pole** (replaced the staff render — same reach/hitbox/timing,
  purely visual; glow radius + flame brightness driven by `lampLight`, steady throb clock ready
  to share with the B3 bass pulse).
- [x] 🔷 **Enemies carry lamps** (lamp-pole replaces the pike; lamp goes dark on death). Kill one
  and 6 homing light-motes stream into YOUR weapon; each arrival feeds `lampLight` (0→1,
  +0.12/kill, resets on death; buff/upgrade hooks can seed it).
- [x] Rekindling: foreground-building windows behind the player light up more densely and burn
  brighter as `lampLight` grows — the city responds in your wake.
- [x] Copy pass: menu pitch, death titles/tips in Lamplighter voice (wardens, no
  blade/stealth/AC echo); feathers → **Light** in HUD + tally; collectible = glowing mote.
- Store copy rides with Batch 7 (post-rename, per §12).

---

## 1. Core loop & mechanics

**Now:** run → jump gaps → timed strikes (CLEAN/HEAVY/PERFECT + domino) → die → retry.
**Standard:** every verb has depth; the "one more run" pull comes from mastery + visible progress.

- [x] Timing-strike windows w/ risk/reward tiers, domino kills, slow-mo payoff
- [x] 🔷 **REMOVE double jump** — replaced with **hold-to-jump-higher** (release cuts the rise at
  `JUMP_CUT`); gap width now capped at `speed×26` frames of travel (re-simmed: elite bots, 0 gap
  deaths <2500m); fall-death tip copy updated to teach the hold
- [x] 🔷 **Slide mechanic via context-sensitive action button** — guard in reach wins the press,
  else low hazard ahead → slide (32 frames, hitbox 28→14, dust, staff tucked, crouched pose);
  trigger window `10+speed×12` sized so the slide always outlasts the hazard
- [ ] Strike-verb extensions (LATER, same button): smash through weak railings/doors, deflect
  thrown objects back at rooftop archers

## 2. Level content & variety

**Now:** gaps + patrolling guards + feathers; one biome, no structure.
**Standard:** new element every ~30-45s of play; recognizable "chunks" so mastery grows.

- [x] 🔷 **Low obstacles to slide under**: clotheslines, low beams, hanging signs — one occupant
  per roof (guard OR hazard), contiguous roofs only (never right after a gap-jump arc), never on
  consecutive roofs, and always beyond the last gap's jump-arc landing + reaction room; teach beat
  w/ tutorial slow-time on the first one; a full 76px leap clears the whole band (expert alt)
- [ ] Guard formations: pairs, back-to-back, one-on-a-ledge (feeds domino setups — place guards
  in lines so PERFECT shots have targets; the mechanic sells itself)
- [ ] Rooftop chunk library: hand-authored segment patterns (staircase roofs, long gap + rope,
  lantern alley) mixed procedurally instead of pure RNG — the Flipline formation-sequencer pattern
- [ ] A second visual zone (dawn palette swap ~500m) for long-run freshness — cheap w/ pre-rendered
  sprite rebuild
- [ ] 🔷 **Districts (client intake 2026-07-02): endless + named district every 250m** — banner,
  palette shift, hazard-mix change, guard-density step; district names feed the Lamplighter lore
  ("LANTERN ROW REKINDLED" on crossing). This is the packaged answer to CG's "needs content."

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

- [x] 🔷 **Currency = "LIGHT"** (Mike's call 2026-07-02 — he hates feathers as currency; AC-clone
  fix too). DONE in Batch 2: glowing-mote collectible art, HUD label "Light", tally line "Light";
  zero player-facing "feather" text remains (internal var names kept). Kills already award Light.
- [ ] 🔷 **Cosmetic shop**: cloak colors/patterns, staff skins (wood/jade/gold/moonlit), trail
  effects, strike-flash colors — visible in the character at all times, rarity tiers, live try-on
- [ ] 🔷 **Buff shop (consumables, pre-run pick)**: head start (skip to 200m), starting shield
  (survive one hit), feather magnet, double-feathers run — banked inventory, one equipped per run
- [ ] Rewarded-ad hooks on the economy (revive-once-per-run; double-feathers offer on tally screen)
  — adapters already wired in all three platform builds
- [ ] Persistence: extend the existing Save wrapper (localStorage + CG Data Module) to a save object
  (coins, owned, equipped) — version the key
- [ ] 🔷 **APPROVED (Mike, 2026-07-02): permanent progression** — deep-researched (design-science
  brief in project chat; CG's own launch-metrics docs list "meaningful progression through
  unlocks and upgrades" as a top retention lever). Why it works: loss-aversion buffering (every
  death still banks progress), goal-gradient (next tier always in sight), competence path for
  average players, achievement drip. **Guardrails (the documented failure mode is grind-past-the-
  wall stat stacking):** upgrades compress the WARM-UP, never raise the ceiling; horizontal
  options over vertical stats; hard caps. **Spec: 3 tracks × 4-5 tiers, ~×2 cost/tier, maxed in
  2-4hrs of play, first purchase affordable by run 1-2:**
  - **Morning Oil** (vertical, capped): start with the lamp partly lit — begin at the energy a
    good run reaches by ~150m (incl. a starting music layer). Cap ≈ mid-run power, never beyond.
  - **Lamp Arts** (horizontal): new behaviors per tier — Light-magnet radius → PERFECT kills
    emit a stun flash → domino kills chain light farther.
  - **Wick & Flint** (utility): head-start distance · one extra free revive · tally Light bonus.
  - **Flow rule (Rogue Legacy GDC):** death → tally → one-tap spend → running again. No shop
    agonizing between runs; upgrade buttons live ON the tally screen.
  +1 session in Batch 5.

## 5. Controls & input feel

**Now:** 2 buttons (jump/strike), keyboard + touch zones. Solid foundation.
**Standard:** device-adaptive prompts, zero input latency, no dead inputs.

- [x] Input buffering: jump pressed ≤100ms (6 frames) before landing fires on landing
- [x] Coyote time (~80ms / 5 frames) off roof edges
- [ ] Show keyboard prompts on desktop / touch zones only on touch devices (currently both always)
- [ ] Keys: verify no browser-reserved keys (Space scroll is prevented ✓); add W/Z alternates for
  AZERTY compliance (CG guideline)

## 6. Difficulty & fairness

**Now:** sqrt speed ramp; strike windows time-normalized (done); all-tier bot suite exists.
**Standard:** deaths always feel earned; skill tiers separate cleanly (verified: 68s vs 38s).

- [x] Bot fairness suite lives in repo `tools/rs_playtest.js` (4 reaction tiers, death-cause
  tracking, draw-path smoke, PASS/FAIL fairness bars) — re-running it after EVERY mechanics
  change stays standing practice
- [ ] Anti-streak guard on formation RNG (no 3 identical challenges in a row)
- [ ] **Suite fairness bar flakes (found 2026-07-02, pre-existing):** `rs_playtest.js` RNG is
  unseeded — a rare elite gap death (~1 per 2-3 suite runs) shows up on the untouched Batch-1
  build (`656facb`) too, so Batch 1's green was a lucky roll. Seed the RNG for reproducible
  runs, then root-cause: unclearable gap edge case vs. bot-timing artifact
- [ ] First 150m = guaranteed gentle intro chunk (teach jump → teach strike → first mixed)
- [ ] Difficulty cap: speed plateaus at ~2500m so elite runs stay humanly possible

## 7. Audio (BIGGEST GAP — nothing exists) ⚡

**Standard:** procedural WebAudio, zero assets. 🔷 Direction (client intake 2026-07-02):
**LIGHT-REACTIVE SCORE** — the music IS your lamp. Research-grounded speaker architecture (cited
in project chat 2026-07-02: Audiokinetic/SOS/MDN):

**Speaker-scaling architecture (every sound):** phones are silent <~700Hz, laptops <~200-300Hz.
So each SFX/music voice = parallel layers into one bus: transient click 2–5kHz (0–5ms attack,
punch lives here) · mid body 200–500Hz · **harmonic bass** 150–500Hz (2nd–4th harmonics of the
sub pitch — the brain reconstructs the missing fundamental; this IS the bass on small speakers) ·
**true sub sine 40–90Hz as a parallel garnish** that only decent speakers/subwoofers reproduce
(small drivers filter it out acoustically — one mix works everywhere). Avoid 4–5kHz buildup
(handset resonance/fatigue). Envelopes via exponential ramps only (no gain jumps/clicks).

- [ ] 🔷 **Light-reactive music:** minimal warm ember-groove base; each lamp claimed from an enemy
  ADDS an instrument layer (shimmer → bells → pulse-bass → full); death drops back to embers.
  🔷 **Bass pulse timed to the weapon's light pulse** — the lamp visually throbs on the beat and
  the sub/harmonic-bass layer hits with it (audio and weapon glow share one clock).
- [ ] ⚡ SFX set (layered per architecture): jump whoosh, land thud, strike swing, kill hit
  (pitch by tier CLEAN low → PERFECT bright) + **light-stream chime** as the lamp feeds in,
  domino impact (sub garnish moment), Light-mote sparkle, death (layers collapse), slide scrape,
  bird flutter
- [ ] Slow-mo audio: low-pass filter sweep during bullet-time (sells the effect hard, cheap)
- [ ] Mute button (platform guideline: CG `muteAudio` setting listener + in-game toggle)
- [ ] ⚡ Ad-break ducking hooks already exist (`__adPause`) — wire `Snd.duck` when audio lands
- [ ] QA: audition through a master high-pass swept at 800/400/200Hz + in mono (the phone test)

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
- [x] Move `rs_playtest.js` + a README into `tools/` (chainable-Proxy ctx stub note kept)
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

## Sequencing — ONE quality bar, ONE submission wave (Mike's call 2026-07-02)

No early lower-quality ship to GM/GD. Build to CrazyGames grade, then submit the SAME build
everywhere (CG + GameMonetize + GameDistribution + itch) in one wave. Large-chunk batches:

**BATCH 1 — Feel & verbs: ✅ DONE 2026-07-02.** Double-jump OUT → hold-to-jump-higher; slide +
low obstacles (clotheslines/beams/signs) via context action button; input buffering + coyote
time; slide teach beat w/ tutorial slow-time; gaps retuned for single-jump and re-simmed green.
Bonus: two latent engine bugs found by the suite and fixed (seam ground-flicker, segment-pool
exhaustion punching holes in the world).

Re-scoped at client intake 2026-07-02 (batch-per-session 🔷; audio is ~1.5 sessions):

**BATCH 2 — Lamplighter identity:** lamp-on-a-pole weapon render; enemy lamps; kill →
light-stream into weapon + brightness escalation state (`lampLight` 0→1, drives glow radius +
future music layers); rekindling windows in your wake; copy pass (death/menu lines); feathers →
LIGHT rename + glowing-mote art. (Identity first so audio's light-reactive layers have the state
to key off.)

**BATCH 3 — Audio (light-reactive score, ~1.5 sessions):** speaker-scaling layer architecture
(see §7); ember-groove base + per-lamp instrument layers keyed to `lampLight`; bass pulse
clock-shared with the weapon's visual throb; full SFX set; slow-mo low-pass; mute + CG muteAudio;
ad-duck wiring; 800/400/200Hz high-pass + mono QA pass.

**BATCH 4 — Score & tally:** points system (CLEAN 100 / HEAVY 250 / PERFECT 500 / domino
escalator), end-of-run tally screen w/ count-up + NEW BEST stinger, in-run point popups, HUD
points counter.

**BATCH 5 — Economy:** Light wallet + save versioning; cosmetic shop (cloaks/lamp skins/trails,
live try-on); buff shop (consumables, pre-run pick); rewarded-ad hooks (revive, double-Light on
tally); interstitial cooldown; 🔷 permanent lamp progression — APPROVED, spec in §4 (Morning
Oil / Lamp Arts / Wick & Flint, tally-screen one-tap spend) — Batch 5 is 2 sessions.

**BATCH 6 — Content & polish:** districts (named, banner/palette/hazard-mix/density every 250m);
guard formations for domino setups; rooftop chunk library + anti-streak; guaranteed intro chunk;
difficulty cap; menu-world backdrop; landing dust/speed lines; desktop-vs-touch prompts; AZERTY.

**BATCH 7 — Ship wave:** perf audit on weak hardware (RSCALE cap probe); cover art + crop sets;
gameplay clips; store copy (post-Lamplighter voice); real-device mobile pass; CG QA tool; gameIds
into GM/GD builds; regenerate all builds; SUBMIT ALL PORTALS.

**Acceptance per batch:** `tools/rs_playtest.js` suite green + batch checklist walked + pushed.
