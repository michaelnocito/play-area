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

## 🕯 GAME_BIBLE GAP REPORT (2026-07-03) — 30 changes; ✅ 19 BUILT same day (RS-CAMPAIGN + RS-PROG, HEAD `98dd8b3`)

**BUILT:** ①-⑩ campaign spine (6 districts w/ rest/pressure arcs + mood tints, 3-hit Warden
Captains at every gate w/ skip-respawn, Great Beacon ending + first-clear bonus + Night Shift
endless unlock, menu checkpoint map, death identity, speed plateau, district-1 gentle intro) ·
⑪ stun flash + wider dominoes · ⑫ Light Burst (lamp ≥ half auto-absorbs a guard/low death for
0.5 light; unlocked by 2 districts relit OR EMBER rank) · ⑬ rank gates (EMBER → Light Burst
alt-path, BEACON → early Night Shift; FLAME reserved for the boon slot ⑰) · ⑭ Second Flame
revive (once/run, any death; a gap death sets you down on the next roof) · ⑲(half) gap
anti-streak — **this ROOT-CAUSED §6**: at speed, a full-hold jump overflies a min-length roof
into a second gap; never two gapped segments in a row now · ⑳ gauntlet pairs · ㉖-㉙ story /
map / goal-gradient / ending. Suite green on default + all previously-failing seeds; bots WIN
the campaign (beacon deaths in the summary = clears).

**✅ 2026-07-03 LATER SAME DAY — RS-VARIETY + RS-ECON closed the rest (HEAD `c1519e1`):**
⑮ buffs (Head Start / Warding Charm / Mote Magnet / Double Light — banked, one equipped/run,
menu+death chips, none in Daily) · ⑯ Daily Trial (EMBER-gated; seeded route via in-game
mulberry32 `rnd()`, date-pinned modifier, own daily best) · ⑰ boons (FLAME-gated 1-of-2 at
every gate; JUMP/STRIKE picks: Gleaming Motes / Kindled Lamp / Quiet Roofs / Long Look) ·
⑱ Night Shift rotating modifiers (Dark Night / Double Watch / Bright Motes / Low Ceiling) ·
㉑ archers (hold far roofs, deflectable arrows — deflect kills the sender; slide-under/leap
also work) · ㉒ feint wardens (steel-X shield read = LEAP, gold diamond = strike; 60/150-frame
cycle) · ㉓ dark braziers (strike to rekindle +50, never steals the press near a warden) ·
㉔ distinct tells (X marker+shield plank, bow+red glint, plume+pips) · ㉕ whiff recovery
(ground 24f / air 10f; slides exempt — ducking is never locked) · ㉚ rewarded ads: once-per-run
revive (un-banks the tally first) + double-Light on tally; adError → safe path · cosmetic
cloaks (5 colors, live on the runner). Light Burst rebalanced: covers arrows too. Harness
taught all new reads (feint-leap, arrow deflect, reach-aware presses) + `RS_DEBUG=1` death
forensics. Suite green; slow tier still separates.

**STILL OPEN (small):** ⑲(half) hand-authored chunk library (anti-streak + district pacing
cover most of it) · adblock detection call (error path already safe) · real-device touch pass.

Original 30-item list (🔁 = was already elsewhere in this roadmap):

**A. Something to beat (Law 1 — biggest gap):** ①campaign spine: run = journey to relight the
Great Beacon ②🔁finite ~6-district sequence (banner/palette/hazards/density — upgrades §2
districts from flavor to spine) ③final district + real ending screen, completion saved
④endless = POST-game unlock "Night Shift" ⑤district checkpoints (start from any reached).
**B. Run arc & drama (Laws 2/6):** ⑥gauntlet pressure pockets + scripted rest (spikes & relief
vs monotone ramp) ⑦Warden Captain boss at each district gate ⑧death identity ("Felled by a
Captain in Lantern Row") ⑨🔁speed plateau ~2500m (§6) ⑩🔁guaranteed gentle intro chunk (§6).
**C. Progression changes play (Laws 3/4):** ⑪🔁Lamp Arts real tier behaviors (stun flash /
farther dominoes) ⑫new verb: Light Burst — spend lamp light to erase one mistake (campaign
unlock) ⑬ranks GATE mechanics (EMBER=daily trial, FLAME=boon slot, BEACON=early Night Shift)
⑭Wick & Flint T3 = free revive (behavior, not +50m) ⑮🔁buff consumables (§4 B5.2).
**D. Every run different (Law 5):** ⑯daily trial (seeded route + modifier + daily best)
⑰boon choice at each district gate (1 of 2 run modifiers) ⑱rotating nightly modifier in Night
Shift ⑲🔁chunk library + anti-streak (§2) ⑳🔁guard formations for domino jackpots (§2).
**E. New reads, same 2 buttons (Laws 7/9):** ㉑Archer — deflect arrow w/ timed strike ㉒feint
warden (fake telegraph, punishes early press; looks AND sounds different) ㉓strikeable braziers
(environmental strike) ㉔distinct tell per enemy type ㉕whiff recovery (spam can't win).
**F. Fantasy frame & orientation (Laws 8/10):** ㉖3-line skippable boot story ㉗menu campaign
map (districts as lit/unlit lamps, next named) ㉘goal-gradient HUD/tally ("next district 80m",
"12 wardens to FLAME") ㉙ending screen + retellable pitch in store copy.
**G. Compliance leftovers (Parts 1/4):** ㉚🔁rewarded ads w/ real value + adblock-safe path
(revive at Captain, double-Light on tally; never gating).

All re-batched work landed same day. **NEXT = B7 SHIP WAVE** (perf audit, covers, clips,
store copy, gameIds, build regen incl. Snd.duck into GM/GD __adPause, submit all portals) —
plus Mike's full hands-on playtest of the campaign, which no build has had yet.

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

- [x] 🔷 **Points system (B4, 2026-07-02)**: CLEAN 100 · HEAVY 250 · PERFECT 500 · domino FELLED
  = 500 × chain position (2-chain +1000, 3-chain +2500 cumulative — the jackpot) · distance 10/m
  · Light = flat 50 (also currency, see §4). `runScore()` = single source of truth; per-tier
  counters + bestChain tracked per run
- [x] **End-of-run tally screen (B4)**: line-item reveal with uiTick sounds (Distance → kills by
  tier → Domino bonus → Light), TOTAL count-up, NEW BEST stinger; timers cancelled on early restart
- [x] In-run floating point popups (B4): tier messages now carry values (PERFECT +500,
  FELLED +1500...), +50 on Light pickup
- [x] Per-run stats line (B4): total kills + best chain under the tally

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
- [x] Persistence (B5.1, 2026-07-03): versioned save object `rooftopSprintSave_v1` (Light wallet,
  3 track tiers, lifetime kills, daily streak, milestones) — localStorage + CG Data Module mirror;
  CG research (via Jade Fist JF-#004): localStorage IS the cloud save (Automatic Progress Save) —
  tick "Progress Save" in the submission flow
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
  **[~] B5.1 SHIPPED (2026-07-03, 7-item CG-retention pass, JF-#005 pattern):** ① versioned save
  (above) ② 3 tracks live w/ one-tap tally spend (keys 1-3 / tap; ×2 costs 15/30/60): Morning Oil
  = lampLight seed 0.12/tier cap 0.36 (starting music layers follow free), Lamp Arts = Light-magnet
  +12px/tier, Wick & Flint = head start 50m/tier ③ goal-gradient: cheapest-affordable row pulses +
  first-buy callout ④ **Lantern ranks** (lifetime kills 0/25/75/200/500/1200 → SPARK…LIGHTBRINGER),
  sash renders in rank color, live promotion banner, rank on menu ⑤ daily return: first run/day =
  ×2 Light + streak on menu ⑥ one-time bounties (First Perfect 10 / Triple Domino 20 / 500m 15 /
  1000m 30) w/ banners ⑦ wallet count-up on tally + `tallyDone` input gate. **Still open for B5.2:**
  Lamp Arts tier behaviors (stun flash, farther dominoes — currently magnet ×3), cosmetic shop,
  buff consumables, rewarded-ad hooks, interstitial cooldown.

## 5. Controls & input feel

**Now:** 2 buttons (jump/strike), keyboard + touch zones. Solid foundation.
**Standard:** device-adaptive prompts, zero input latency, no dead inputs.

- [x] Input buffering: jump pressed ≤100ms (6 frames) before landing fires on landing
- [x] Coyote time (~80ms / 5 frames) off roof edges
- [x] Show keyboard prompts on desktop / touch zones only on touch devices (B5-UX 2026-07-03:
  `isTouch` via pointer-coarse media query; touch zones hidden on desktop, controls line adapts)
- [x] Keys: Space scroll prevented ✓; Z/W jump alternates added for AZERTY (B5-UX)

## 6. Difficulty & fairness

**Now:** sqrt speed ramp; strike windows time-normalized (done); all-tier bot suite exists.
**Standard:** deaths always feel earned; skill tiers separate cleanly (verified: 68s vs 38s).

- [x] Bot fairness suite lives in repo `tools/rs_playtest.js` (4 reaction tiers, death-cause
  tracking, draw-path smoke, PASS/FAIL fairness bars) — re-running it after EVERY mechanics
  change stays standing practice
- [ ] Anti-streak guard on formation RNG (no 3 identical challenges in a row)
- [~] **Suite fairness flake — RNG now SEEDED (B5-UX 2026-07-03):** mulberry32 in the harness
  sandbox (`RS_SEED` env, default 20260703 = green; `RS_HTML` env points the suite at any build).
  Seeds 2 and 3 reproduce the elite gap death deterministically and identically on old builds —
  confirmed layout/bot edge case, NOT a regression signal. Still open: root-cause with seed 2
  (unclearable gap edge case vs. bot-timing artifact)
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

- [x] 🔷 **Light-reactive music (B3, 2026-07-02):** ember pad + beat pulse always; layers gate on
  `lampLight` — shimmer 0.2 → bells 0.45 → pulse-bass 0.7 → full/hats 0.9; death → embers.
  🔷 Bass pulse shares the weapon's glow-throb clock (`Snd.tick(drawT,…)`, 8th grid off
  `drawT*0.12`, beat lands on the throb peak at π/2) — lamp throbs ON the beat.
- [x] ⚡ SFX set (B3, all voices layered per architecture via `bassHit`/`click`/`tone`/`noiseSweep`):
  jump whoosh, land thud, swing, kill by tier (CLEAN 52Hz → PERFECT 82Hz + bright click + ping),
  light-stream chime (pitch rises with lampLight), domino (sub-garnish moment), mote sparkle,
  death collapse, slide scrape, bird flutter
- [x] Slow-mo low-pass sweep (`Snd.setTs(ts)` from the main loop)
- [x] Mute: in-game 🔊 button (top center) + M key, persisted; CG `muteAudio` listener (guarded)
- [x] ⚡ Ad ducking: CG interstitial/rewarded adStarted/adFinished → `Snd.duck`; `window.Snd`
  exposed so GM/GD build wrappers wire their `__adPause` through it at B7 regen
- [~] QA: `Snd.qaHighpass(800/400/200)` console knob built in (master HPF insert); all voices are
  mono by construction. Mike's ear pass on real speakers/phone still pending

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

- [x] ⚡ Trim menu overlay text to one line + control glyphs (B5-UX: "Run the rooftops. Take
  back the light." + adaptive controls line)
- [x] In-world teach beats: first gap JUMP, first guard STRIKE, first low obstacle SLIDE (all
  shipped w/ tutorial slow-time in B1)
- [x] HUD: current run POINTS counter top center (B4); Light count doubles as currency (mute
  button moved to upper-right below the Light counter)
- [x] Death → replay in ≤1 input (B5-UX: Space restarts w/ 45-frame guard so a held jump can't
  skip the tally; explicit hint line on the death screen)
- [x] Pause (B5-UX): P / ⏸ button / canvas tap, 3-2-1 resume countdown, SDK gameplayStop/Start
  bracketing, auto-pause on tab hidden — CG QA checks this

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
- [x] Interstitial cooldown (B5-UX): min-interval 2.5 min, seeded at boot so the first death of
  a session never shows an ad
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
