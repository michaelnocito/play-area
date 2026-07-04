# JADE FIST — Dev Notes

Kung fu counter-brawler for CrazyGames. Single-file `index.html`, canvas + vanilla JS,
procedural art + WebAudio, no assets, no build step. Commits: `JF-#NNN`.

## Where this came from
- Combat design mined from the "Bourne Identity combat mechanics" chat (2026-06-29):
  2D side-view brawler slice — strike combos, **counter windows as timers**, throws, shoves.
- Quality bar + architecture patterns lifted from Rooftop Sprint's ROADMAP (the CrazyGames
  research doc): instant load, ≤1 input to gameplay, speaker-scaling layered WebAudio,
  fixed timestep, tally screen with line-item reveal, mute + persistence.

## Core loop (JF-#001 prototype)
Enemies walk in from both sides → tap/press **toward** one to strike (CLEAN, ×combo) →
enemy flashes **RED** during windup = counter window → strike the flash = **COUNTER**
(500×combo, slow-mo, throw that FELLS neighbors for +250 each) → get hit 3 times → tally.

- Verbs: strike left / strike right. Keyboard ←→ / A,D / Q (AZERTY) / Space=facing. Touch: tap half.
- Juice: hit-stop, shake, slow-mo on counter, pitch-rising combo sfx, popups, particle bursts.
- Audio: layered voices (transient click + mid body + harmonic bass + sub garnish), gong-wobble
  counter (beat-frequency pair), mute persisted (M key / 🔊 top-right).
- Persistence: `jf_best`, `jf_mute` in localStorage.
- Fixed 60Hz timestep, single rAF loop, visibility-change clock reset.

## Known prototype shortcuts (fix before submission)
- Player is stationary (pure counter-brawler, one-position). Consider micro-step/lane later.
- No CG SDK wiring yet (adapter pattern exists in rooftop-sprint/flipline — copy at ship batch).
- No pause, no district/wave structure, no economy/progression.
- ~~Enemy hit check in E_STRIKE approximate under slow-mo~~ fixed JF-#002 (`didHit` flag).

## JF-#002 polish pass (no new features)
1. Strike hit-check bug fixed (one guaranteed check via `didHit`).
2. Input buffered through hit-stop (press lands when time resumes, never eaten).
3. Telegraph fairness: rising windup audio cue + final third goes solid bright red ("NOW").
4. Combo-decay bar under the combo counter (you can see the chain expiring).
5. Device-adaptive prompts (touch vs keyboard wording on menu/teach/retry).
6. Tally fast-forward: first tap reveals all lines, next tap restarts.
7. Pincer guard: first 15s spawns alternate sides; an enemy never opens a windup while
   the opposite side is already threatening (holds just outside reach instead).

## JF-#003 enemy interactions pass
1. **Viper** (diff>1): fast walker, 60% telegraph — tests reaction. Pale + slim.
2. **Iron Monk** (diff>2.5): strikes only SHOVE him (+50); COUNTER is the only kill (750 base).
   Broad + grey, dark sash.
3. **Spearman** (diff>4): winds up at long range and lunges; counterable at HIS reach (600
   base); long recover = the punish answer. Pole + blade rendered.
4. **Guard/block**: some initiates raise a bracer arc — first strike = BLOCKED (clank, no
   combo), breaks guard + staggers; follow-up fells. Chance scales with difficulty (cap 50%).
5. **Shove chains**: a staggered body sliding into a neighbor STUMBLEs them (+100, breaks
   their guard) — space control tool vs brutes/crowds.
6. **HEAVY punish**: striking any enemy during recover (slumped, tilted, dim) = HEAVY 250×combo.
7. **Duo rush** (diff>3): doubles now spawn same-side, staggered — feeds counter-throw fells.

## JF-#004 saved progression (CrazyGames research pass, 2026-07-03)
Research (docs.crazygames.com): acceptance is judged on depth/retention potential; full launch
gated on avg playtime + conversion + retention. **Automatic Progress Save** backs up
localStorage for HTML5 games with zero code, and the SDK Data Module cloud-syncs it for
logged-in users → localStorage IS our cloud save. Tick "Progress Save" in the submission flow.

Design per the Rooftop §4 research (compress warm-up, never raise ceiling; ×2 cost/tier;
first buy in 1-2 runs; Rogue Legacy one-tap-spend-on-tally flow):
- Currency: **JADE ◆** — 1/kill, 3/counter; banked on death (`jf_save_v1`, versioned key).
- **IRON BODY** (2 tiers, 20/40◆): +1 heart.
- **JADE PALM** (3 tiers, 12/24/48◆): +8 player reach per tier.
- **INNER FOCUS** (3 tiers, 12/24/48◆): +40 frames combo window per tier.
- **SECOND WIND** (1 tier, 60◆): rise once per fight at 1♥ (slow-mo + burst moment).
- Tally = shop: 2×2 upgrade grid on the death screen, tap or keys 1-4, pips show tiers;
  restart dead-zone below y370 so shop taps never restart. Menu shows jade + training count.

## JF-#005 progression pass (7 items, CG-research-grounded)
1. **Belt ranks**: lifetime kills → WHITE→…→BLACK (BELTS table); live promotion banner
   mid-run; belt line in tally; **player's sash renders in belt color** (visible rank).
2. **Goal-gradient nudges**: cheapest affordable upgrade pulses on the tally; menu shows
   "N foes to NEXT belt"; first-training callout when nothing owned but affordable.
3. **First-buy onboarding**: blinking "you can afford your first training" over the grid.
4. **Daily return bonus**: first fight each day = ×2 jade (banner at run start + tally
   note); consecutive-day streak tracked and shown on menu ("day N").
5. **Jade bounty milestones** (one-time, saved): First Counter 10◆, Five-Fold Chain 15◆,
   Iron Monk Felled 15◆, Spear Turned Aside 15◆, Endure 90s 20◆ — center banner + chime.
6. **Warm-up compression by belt**: run starts `belt×200` frames into the ramp and the
   alternating-spawn learning window shrinks (900→300) — skips the boring open, ceiling
   untouched (the documented guardrail).
7. **Wallet count-up on tally** + `tallyDone` flag now gates shop input (fixes variable
   line-count reveal when a promotion line is present).

## JF-#006 difficulty pass (7 items — game was too easy; CG judges retention/tension)
1. **Whiff recovery**: striking empty air locks strikes for 14 frames (`whiffT`) — kills
   the spam-both-directions dominant strategy; every press must be a read.
2. **Steeper ramp**: `difficulty = waveT/390` (was /480) — ~25% faster climb, cap unchanged.
3. **Spawn cadence**: floor 34→26, slope 6→7 (`max(26, 90 − diff·7)`).
4. **Tighter telegraphs late**: windup floor 26→20 frames, shrink slope 2→2.4.
5. **True pincers past difficulty 6**: the opposite-side fairness guard is now
   learning-phase-only (`difficulty <= 6`) — late game may threaten both sides at once.
6. **Duo rush scales**: chance `min(0.2 + diff·0.05, 0.55)` (was flat 0.35); past diff 7
   the second spawn has a 40% chance to take the OPPOSITE side (feeds the pincer test).
7. **Combo window base 150→120 frames** — INNER FOCUS tiers now matter.

## JF-#007 attack/enemy-interaction pass (7 items, CG depth bar; every tell visual)
1. **PERFECT COUNTER**: countering in the final-third "NOW" flash = 1.5× points, +5◆,
   harder throw (vx 12), wider fell radius (220), gold burst — rewards the tell JF-#002 built.
2. **Thrown bodies are projectiles**: an airborne countered enemy fells anyone he passes
   through mid-flight (E_THROWN collision, 40px) — throw DIRECTION is now a tactical choice.
3. **SWEEP bonus**: one throw felling 2+ = +500 and +2◆, center banner.
4. **Viper FEINT** (diff>4, 35%): pale flash, NO windup audio, springs back out of reach
   (untargetable) — striking it = whiff + recovery. Real telegraphs stay red + audible.
5. **Brute ENRAGE**: each shove he eats cuts his next windup 15% (floor 55% of base,
   `windup0`); "ENRAGED" popup + reddish tint at 2 shoves — shove-stalling escalates.
6. **Guarded vipers** (diff>5): bracer guard no longer initiate-only.
7. **Adaptive guards**: while combo ≥8, new spawns get +20% guard chance (cap 0.6) and a
   one-time "THE CROWD WISES UP" banner — pushes flow players from strike-spam to counters.

## JF-#008…#012 — the DESIGN restructure (game had no shape: endless screen, fake progression)
Gap report verdict (2026-07-03): no levels, no ending, stat-only upgrades, cosmetic belts,
treadmill difficulty, identical runs, no fantasy. Five batches:

**JF-#008 waves+bosses**: quota waves w/ rest beats (`beginWave/onWaveClear`), difficulty from
wave number; every 5th wave = boss (T_BOSS): counters are the ONLY damage, each drops a phase
(faster windup + 2 adds), hp pips; strikes = SHRUGGED OFF; "Felled on WAVE N" tally identity.

**JF-#009 districts**: DISTRICTS table = Courtyard / Market(crowd: fast spawns, duo-heavy) /
Temple(guard-heavy +18%) / Rooftop(spear-heavy), each w/ own palette (sky/ground/lantern hue/
skyline), dBase 0/2/4/6, named boss (Iron Master/Butcher/Abbot/Jade Thief, hp 3/3/4/4).
Boss fell = DISTRICT CLEARED victory tally + next district unlocks (save.dist). Menu selector
(◀ ▶ arrows or taps, Space fights).

**JF-#010 techniques**: belts teach play — YELLOW=DRAGON SWEEP (perfect throws vx15/pierce 260),
GREEN=IRON CATCH (counter an unlanded strike; 3-frame hit grace; counts perfect),
BLUE=PALM WAVE (3 consecutive perfects = both-side 260px fell; HUD pips). Live unlock banner.

**JF-#011 trials+omen**: 6-trial pool, date-seeded trio daily, 15◆ each once/day (save.tday/
tdone); menu checklist. Daily OMEN boon/curse pair (3-pool: +1♥/faster telegraphs, jade×1.5/
−1♥, wider perfect/faster enemies), toggle O key or tap card; applied via `omen` modifiers.

**JF-#012 story+ending+LEGEND**: first-launch 3-line tale (save.intro), veteran run-start shows
district line instead of controls lesson, ROOFTOP victory = S_END ending screen ("THE JADE IS
RECLAIMED") then tally; save.dist→4 unlocks LEGEND district (dBase 7, endless, boss returns
every 5 waves +1 hp, never `won`).

**JF-#013 CG SDK wiring (Batch A)**: SDK v3 script tag + rooftop-sprint adapter copied verbatim
(sdkLive gate, graceful no-op offline; interstitial/rewarded stubs in place for Batch D).
`CG.init()` at boot with loadingStart/Stop bracketing the handshake (single-file game, nothing
else to load); `gameplayStart()` in startRun, `gameplayStop()` in endRun, `happytime()` on
victory. Parse-checked only — Batch B (pause + auto-pause on blur) is next.

**JF-#014 pause (Batch B)**: S_PAUSE state — P toggles, tab blur auto-pauses
(visibilitychange), any key/tap resumes; update() early-returns so the world is fully
frozen; dark overlay w/ PAUSED + resume hint drawn over the frozen frame; CG
gameplayStop/Start bracket the pause per CG guidelines. No Escape binding (CG rule).

**JF-#015 dpi-crisp canvas (Batch C)**: backing store = 960x540 x scale x devicePixelRatio,
base setTransform maps logical coords to physical pixels; CSS size unchanged so pointer math
untouched. Crisp on hi-dpi per CG requirement.

**JF-#016 monetization hooks (Batch D)**: midgame interstitial between runs (never before the
first run, 3-min cooldown); rewarded DOUBLE JADE offer on the tally (gold button right of the
upgrade grid, R key or tap, once per run, +jadeRun banked again on adFinished; offline fallback
grants immediately). happytime() on district victories was JF-#013.

**JF-#017 district ambience (Batch E)**: deterministic drift-from-t layers, zero particle
state — Courtyard blossom petals, Market rising embers, Temple incense mist banks, Rooftop
wind streaks, Legend jade motes. Drawn in drawWorld so they freeze with pause.

**JF-#018 menu demo loop (Batch F)**: the two static instruction lines replaced by a looping
240-frame visual demo (approach → red-flash windup w/ aura → counter throw w/ spin-out) using
the real fighter() renderer at 0.72 scale, phase captions above. CG visual-first onboarding.

**JF-#019 submission package (Batch G)**: `thumbnail.html` = self-contained 2048x1152 cover
generator (night city + hero counter scene + title, one-click PNG download);
`JADE_FIST_SUBMISSION.md` = listing copy, PEGI 12 rationale, Progress Save toggle reminder,
tech checklist (all A-F items ticked), manual QA list (144Hz/mobile/adblock/campaign/CG preview).

**JF-#020 touch of absurdity**: grounded in CG casual research (physics comedy = top pattern:
Ragdoll Archers/Happy Wheels). Three light layers, all rare on purpose: (1) ~1-in-6 perfect
counters on non-bosses = comedy send (vx x1.7, vy -11, wild spin, gold one-liner from a 5-line
pool); (2) airborne thrown bodies BONK off the screen edge once and rebound back into play
(still a projectile — can fell on the return); (3) 12% chance a felled foe mutters a small
grey yelp under the FELLED popup. No balance change beyond the send arc.

## §top-100 — CrazyGames top-100 research (2026-07-03)

Method: scraped /hot (Popular This Month, 46 ranked) + popularity-ordered leaders from
every /c/<tag> page (~100 titles deduped); deep-read the top-20 game pages; cross-checked
CG docs (basic-launch-metrics, requirements) + industry commentary.

### Recurring patterns in the top games
1. One-input / mouse-only control floor (Space Waves, Realm Traveler, merge games)
2. Sub-10s load, straight into gameplay (CG bar: 80%+ conversion past 1 min, <20MB)
3. Visible growth fantasy WITHIN a single run (EvoWars, Fish Eat, Count Masters)
4. Merge/upgrade meta bolted onto simple combat (Zombies 4, Merge Master Tanks)
5. Death-retry loop measured in seconds ("one more try" = interstitial cadence)
6. Persistent progression + cloud save (CG: "lost progress means lost players")
7. Multiplayer/with-friends as distribution — BUT current /hot top-10 is majority SP casual
8. Local 2-3P on one keyboard (Ragdoll Archers, Fish Eat) — MP tag with zero netcode
9. Trend-surfing memes (brainrot wave) — search capture, short shelf life, not our lane
10. Genre-classic revivals with modern juice (Marble Boom, Frogger, Bloons)
11. Idle/AFK layers even in action games — session length + return habit
12. Leaderboards as retention scaffolding (CG curates "Leaderboards"/"be the best" shelves)
13. Cosmetic unlock economies (Smash Karts hats, Shell Shockers eggs) — no pay-to-win
14. Listing = autoplay hover VIDEO (8 MP4 sizes), not the static thumbnail; first 5s decide CTR
15. Daily hooks (CG-recommended); retention feeds the ranking algo, so retention IS distribution

### Unlisted/structural (from inspecting the top-20 pages myself)
- Titles are keyword strings, not brands ("Merge X", "X Simulator", "X.io", "Obby: X")
- CG Originals get ~30% of category top-15 slots — exclusivity buys placement
- "Updated" badge in Hot/New lists: shipping updates re-triggers discovery
- Editorial intent tags ("5-minute fun", "Premium Perks", "Adrenaline rush") = shelves to design for
- Controller tag is tiny (59 games) — cheap differentiation
- Mobile tag on 18/20 of top-20 — table stakes

### Jade Fist verdict
Already match: fast run loop + retry cadence, rewarded double-jade + interstitial, daily
trials/omen/return bonus, endless LEGEND, cosmetics (#023), one-tap mobile, district goals.
Adopt list (ranked G1-G7) lives in JADE_FIST_ROADMAP.md.

## JF-#021..#024 — backlog cleared (2026-07-03)
- #021 reactive music: A-pentatonic pluck bed + 2-voice drone inside Snd; one intensity
  knob (0.32 + difficulty*.045 + combo*.025 + boss*.18); taiko thump under bosses;
  intensity 0 on pause/blur; routes through master so mute covers it.
- #022 bot fairness suite: ?bot=N&react=12; bot counters any windup visible >= react
  frames, thins crowds at t%10; every hit classified pincer/fast/clean; per-run
  console.table + aggregate verdict (flags >15% fast or >35% pincer). BOT mode
  no-ops persist(), forces dist=4, never writes jf_best.
- #023 cosmetic shop: STYLES robe dyes (0/40/60/90/120), save.cos {own, wear};
  menu wardrobe under trials, C cycles / B or tap buys; wearCol() used in-fight,
  hurt flash still overrides.
- #024 alt builds: SDK:HEAD + SDK:ADAPTER markers in master; make-alt-builds.ps1
  regex-swaps them into alt-builds/gamemonetize + gamedistribution (same CG facade,
  placeholder gameIds, rewarded falls back to immediate grant). Regenerate after any
  master change if the alt builds are ever needed.

## JF-#025/#026 — G1+G2 built (2026-07-03, "complete game" bar before launch)
- #025 scrolls: non-final wave clears offer 2 of 6 run-only scrolls; world holds
  (restT frozen) until left/right picks; effects: TIGER throw vx x1.3 + fell range +50,
  CRANE perfTh min .55, OX +1 heart now/max, SERPENT CW +70, DRAGON jade x1.5 at tally,
  MONKEY whiff 14->7. run={} resets each run; HUD glyph row under hearts; bot picks random.
- #026 Hall of Legends: save.hall[5] per-district top-5 {s,w}; tally splices
  "Hall of Legends #N" line; menu shows selected district top-3 under the omen.
  RESEARCH FACT: CG leaderboards are invite-only (one board/game, Mon-Mon seasons,
  client SDK needs an Encryption Key) — so local board now, CG.submitScore(s) no-op
  seam in all three adapters (master + GM/GD via make-alt-builds.ps1) for later.

## Bot fairness pass — RESULTS (2026-07-03, post-#026 build)
Fixes found by running the suite: bot no longer pokes brutes/bosses (strike only
shoves them = wave livelock), waits when a staggered brute body-blocks the counter
lane, and dismisses the S_END ending screen. Body-blocking itself is BY DESIGN.
- ?bot=3&react=12 (200ms): 12/12 wins, avg wave 5.0, ZERO hits taken. No pincer,
  no unreactable telegraphs at normal reaction speed. PASS.
- ?bot=2&react=18 (300ms stress): 8/8 wins, 4 hits total; 3 = late-game vipers
  (16-frame/267ms telegraph, intended skill test), 1 = allowed late pincer (diff>6).
  Distribution matches design intent. PASS.
- Tuning note for JF-#027: perfect-play bot wins 20/20 runs — difficulty leans
  gentle at optimal play; viper floor is 16f (267ms) if late-game ever feels cheap.

## JF-#027/#028 — cartoon art + duck/jump + difficulty (2026-07-03, Mike "50% ready")
- #027 cartoon pass: fighter() rebuilt — chunky cel-outlined limbs (OUT=#181220),
  BIG heads, live faces (idle/angry-V-brows/X-eyes/dizzy pupils), squash&stretch param;
  popups now comic-font (Comic Sans stack) with springy pop-in + tilt + outline;
  burst() throws stars on heavy hits; brighter enemy palette (viper cyan/brute purple/
  spear teal/boss gold); sleepy-faced moon w/ drifting z's; outlined bouncing title+banner.
- #028 duck/jump + throws + difficulty (Mike: campaign too easy):
  * vertical dodge axis: jump (up/W, swipe up) dodges LOW throws, duck (down/S, swipe
    down) dodges HIGH throws. JUMP_DUR 32 / JUMP_H 76 / DUCK_DUR 26. Brief action
    windows, one dodge at a time. Player squash reads the pose; attack during a dodge
    just uses that pose (jump-kick/low-sweep look). Touch: pointermove >42px = dodge,
    refunds the tap's whiff so a pure dodge is free.
  * spearman (T_SPEAR) now willThrow=true: from range (d<340, >reach+20) enters E_AIM,
    telegraphs high(amber=DUCK)/low(cyan=JUMP) with a dashed line + pulse + caption,
    releases a flying spear (dart), THEN closes to normal melee. Throws NOT red
    (red stays melee-counter only). darts[] {x,vx,high,y0,life}; collide within 30px;
    dodged = +150 & 'dodge' trial, else hurtPlayer.
  * difficulty bump: dBase 1/3/5/7/9 (was 0/2/4/6/7), boss hp 3/4/5/5/6, per-wave
    ramp 1.1->1.3 cap 13, INTRO 900->720, pincer guard lifts at diff 5 (was 6),
    duo gate diff>2 & p up, spear chance 0.18->0.24 & appears from diff 3 (all districts).
  * bot: dodges incoming darts (react at 90px), logs dart hits type 'dart'.
  * FAIRNESS (?bot=3&react=12, 200ms): 11/12 wins (was 12/12 flawless), avg wave 4.8,
    14 hits total — 13 darts + 1 melee, 0% unreactable(fast), 7% pincer. One legit
    Rooftop w3 loss (spear district). Harder + still fair. PASS.

## JF-#029 — dodge poses + full test battery (2026-07-03, Mike: jump/duck need work, duck unclear)
- fighter() rebuilt with explicit POSE (not uniform squash which only read as "short"):
  * duck = deep horse-stance crouch — bent knees splay wide, feet planted ±25, whole
    upper body drops via torsoDrop=30 so the head sinks low. Arms tuck in.
  * air (jump) = knees tucked up under the body (feet high), lead arm extends for a
    flying-kick read. Verified visually via canvas-crop render: duck now clearly crouches.
  * player draw adds a ground shadow that shrinks+fades with jump height and goes wide
    + flat under the crouch — sells the vertical.
- FULL TEST BATTERY (headless via preview_eval, 17/17 pass):
  * dodge windows: jump/duck each dodge from ~4 up to 20+ frames before impact (span
    generous); duck(26f)/jump(32f) comfortably cover the ~7f dart pass.
  * wrong-height correctly FAILS: jump doesn't clear a HIGH throw, duck doesn't clear LOW.
  * reaction budget: 52f telegraph (DUCK!/JUMP! caption) + 18-32f post-release by range
    (tightest 18f/300ms >> human ~12-15f). Fair.
  * attack timing: windup strike=counter, late(> .66)=perfect(bigger vx), early=normal,
    whiff sets recovery lock and blocks re-strike during it.
  * spacing constants sane; startRun clears darts + resets jump/duck + grounds player.
  * BOT FAIRNESS re-run (?bot=3&react=12): 12/12 wins, 3 hits (all dodgeable darts),
    0% unreactable, 0% pincer. No regression from the pose work (pure-draw).

## JF-#030..#034 — the "make it sillier" batch (2026-07-03, all 10 built on existing systems)
1. Enemy chatter (#030): type-flavored approach MUTTERS (cocky viper / dim monk / twitchy
   spearman) at 14%, bigger YELPS bank.
2. Gag props (#031): one per district (dummy/noodle-cart/gong/laundry/urn) at PROP_X=132;
   a thrown body sailing through it crashes with a cry + burst + wakes the moon.
3. Reactive moon (#031): moonWake(f) on STRIKE/boss-fall/flawless-wave — opens startled eyes
   + brows + 'o' mouth + '!'; flawless wave also pops a "slow clap".
4. Longest-yeet stat (#030): tracks farthest thrown-body travel, tally brags it with an
   escalating title (a decent toss → Village Legend → Provincial/National Record).
5. Joke scrolls (#032): GREASE (slip x1.9 + low stagger friction), DRUNKEN (perfTh<=.5 +
   player sway), BIG-HEAD (head group scaled 1.65 around neck), TINY-FISTS (ext x0.5 arms +
   slip x1.6). All player-favourable, opt-in — no fairness risk.
6. Accessory cosmetics (#033): STYLES gained panda hood / fake mustache / chicken suit /
   li'l dragon familiar (wornAcc()); drawn in the head group so BIG-HEAD scales them.
7. Bowling STRIKE (#030): one throw felling 3+ = "☗ STRIKE!! N PINS" banner + shake + moon.
8. Hype announcer (#030): HYPE thresholds (3..30) fire cheeky bad-dub combo callouts,
   once each per run (hypeShown), "Nice." → "Show off." → "Okay, calm down." → ...
9. Boss personalities (#034): BOSS_FLAVOR taunt on entry + jab when staggered; THE BUTCHER's
   signature = spinning-cleaver throws (reuses the dart/dodge system, drawn as a cleaver).
10. Between-wave cameo (#031): restGag at each wave-clear — white-flag straggler waddles off
    OR a black cat trots across; cleared at beginWave.
VALIDATION: 600-frame all-silly smoke (every joke scroll + cosmetic + Butcher boss) no throw;
bot fairness ?bot=3&react=12 = 12/12 wins, 7 hits all dodgeable throws, 0% unreactable, 0% pincer.

## JF-#035 — menu legibility pass (2026-07-04, Mike: overlay too transparent/busy)
Menu overlay 0.55→0.82 alpha + radial vignette; solid rounded panels behind every corner
text cluster (trials/wardrobe/omen/hall); real filled "SPACE TO FIGHT" CTA button instead of
blinking bare text; trials/omen/hall condensed to fewer lines; techniques-known line dropped
(pure clutter). Traded some information density for legibility — JF-#036 below had to walk
part of that back (trials detail) once it broke "player always knows what to do now".

## JF-#036 — full CG-guidelines audit, 12 fixes (2026-07-04)
Ran GAME_BIBLE.md Part 1/4 checklist against the code, the 12-run headless bot suite, live
console with the real SDK script loaded, and mobile portrait/landscape resize — then fixed
everything found:
1. **Ad/gameplay bracketing was backwards**: `startRun` fired `CG.interstitial()` and
   `CG.gameplayStart()` in the same tick. Split into `startRun` (decides whether an ad is due)
   → `beginRun` (the actual run setup + `gameplayStart()`), and `CG.interstitial(cb)` now only
   calls back once the ad module resolves (adFinished/adError) — gameplayStart never overlaps
   an in-flight ad.
2. **No debounce on SDK gameplay calls**: confirmed live — the real SDK logged 56 "call
   throttled, delay 1000" errors during a compressed bot run. Added `gpGate()`, a shared
   1100ms min-interval gate wrapping gameplayStart/Stop/happytime in the CG adapter.
3. **Portrait mobile had no rotate prompt**: canvas was measured shrinking to 375×211 inside
   an 812-tall viewport (74% black bars). Added `portraitBlock` (checked in `fit()`), an
   auto-pause on entering portrait (wired after `pauseGame`/`state` exist, since `fit()` runs
   before those are declared), and a rotate-device screen in `draw()`.
4. **Omen-toggle click hitbox drifted from its JF-#035 panel**: was `y<148`, panel now ends at
   y=136 — a sliver of the Hall of Legends panel below it wrongly toggled Omen. Fixed to match.
5. **Duck dodge was measurably harder than jump**: `DUCK_DUR` 26 vs `JUMP_DUR` 32 frames, and
   bot-suite hits skewed hard toward high-windup (duck) misses. Bumped `DUCK_DUR` to 30.
6. **loadingStart/loadingStop fired after the game was already visible/interactive**: both
   only fire once the async `SDK.init()` promise resolves, by which point the synchronous
   script had already parsed and the RAF loop was running. Canvas now starts at `opacity:0`
   and only fades in inside the `CG.init` callback, so the SDK loading bracket matches what
   the player can actually see/touch.
7. **Trials panel lost per-trial detail in JF-#035**: condensed to a bare "2/3 done" count,
   regressing "player always knows what to do now". Restored a line listing which trials are
   still open (or "all done today"), panel resized to fit.
8. **LEGEND endless mode had no player-facing loop identity** (difficulty/boss HP already
   scale with `wave` via `spawnBoss`, just nothing showed it): added "LOOP N" to the boss-fall
   banner and "(loop N)" to the death tally when felled in LEGEND.
9. **Wardrobe BUY touch target was 130×20 logical** — under common touch-target minimums.
   Bumped to 150×26 and pushed the whole wardrobe block down to clear the taller trials panel.
10. **Wardrobe label-row and buy-row sat ~6px apart** — real mis-tap risk on touch (cycling
    style instead of buying). Given real clearance in the new layout (item 9).
11. **13px logical panel text scales under 10 CSS px on mobile landscape** (960-logical canvas
    at ~0.69 scale on a typical phone). Bumped the smallest panel fonts to 14px.
12. **No adblock-detection signal for QA**: ad calls were silent try/catch with nothing to
    tell "adblock suppressed" from "ad just didn't fire". Added `CG.checkAdblock()` (reads
    `SDK.ad.hasAdblock` once init resolves) into `CG.adblockDetected` for QA visibility.

VALIDATION: `node --check` on the extracted script; bot suite re-run 10/12 wins (duck:jump hit
ratio improved from ~5:1 to 2:1); zero SDK-throttle console errors on the same bot run that
previously produced 56; portrait-mode auto-pause + rotate screen verified via forced resize
events in the preview harness; wardrobe/omen click rects sanity-checked post-layout-change.

## JF-#037 — second CG-guidelines audit, 12 more fixes — several were regressions in #035/#036 (2026-07-04)
Same test methodology as JF-#036 (bot suite, live SDK console, resize), turned on itself: found
several of JF-#036's own fixes had introduced new problems. Fixed all 12:
1. **`gpGate` (JF-#036) shared ONE timestamp across gameplayStart/Stop/happytime — proven live
   to silently eat happytime() on every single victory**, since `gameplayStop()` and
   `happytime()` fire back-to-back in the same tick on a win and the shared gate treats the
   second call as a repeat of the first. Split into independent `gpLast.start/stop/happy`
   timestamps — each still throttles repeats of itself, no longer cross-blocks a different call.
2. **No `window.blur` pause listener** — only `visibilitychange`. CG hosts games in an iframe;
   clicking elsewhere on the CG page (comments, related games) blurs this window without the
   tab itself becoming hidden. Added a `blur` listener alongside visibilitychange.
3. **`adT` started at `0`**, so the first interstitial's "3-min cooldown" was trivially already
   satisfied the instant `ranOnce` flipped — could fire on run #2, seconds into a session.
   `adT` now starts at `Date.now()` so the clock actually begins at session load.
4. **Paused screen drew the pause overlay OVER the mute button** (invisible) but the mute
   click-hitbox check ran first regardless of state — a tap in that corner during pause
   silently toggled mute instead of the promised "tap anywhere to resume". Mute button now
   draws AFTER the pause overlay, so visible = clickable again.
5. **`CG.adblockDetected` (added in #036) was computed but never displayed anywhere.** Added
   `?debug=1` — a corner readout of `sdkLive` / `adblockDetected` / `portraitBlock` for QA on
   the CG preview environment without opening devtools.
6. **`make-alt-builds.ps1`'s GameMonetize/GameDistribution stub adapters used the OLD
   `interstitial()` signature (no callback)** — since #036 changed `startRun()` to call
   `CG.interstitial(beginRun)` and wait for it, building for those platforms would have
   permanently soft-locked the menu the first time an ad was due (beginRun() never called).
   Both stubs now accept `cb` and invoke it once their ad call resolves.
7. **No timeout safety net on the interstitial ad callback** — if CG's ad module never calls
   adStarted/adFinished/adError (a hang), the player could never start another run. Added an
   8s timeout-and-continue to `CG.interstitial`.
8. **`rewardUsed` flipped to `true` BEFORE the rewarded ad confirmed anything** — a hung ad
   (no finish, no error) would have permanently disabled the double-jade offer without ever
   granting it. Added `adPending` (blocks re-clicks while a request is in flight, same 8s
   timeout as #7 on `CG.rewarded`); `rewardUsed` — the permanent one-per-tally lock — now
   only sets inside the actual callback.
9. **A hung `SDK.init()` promise would leave the canvas invisible forever** — #036's fix
   (hide the canvas until loadingStart/Stop fire, so the SDK bracket matches what's visible)
   had no timeout, so an SDK hang now blanked the whole game instead of just delaying reveal.
   Added a 6s timeout-and-reveal around `CG.init`.
10. **New "remaining trials" text (added in #036 item 7) overflowed its panel** — confirmed via
    `measureText`: 354px of ' · '-joined text in a 250px-wide panel, spilling ~115px into the
    CTA area. Switched to one trial name per line, panel height now sized to the actual list.
11. **Race condition: no re-entrancy guard on `startRun()` while an ad was pending.** The menu
    stays fully interactive during the ad-wait window and `adT` is already updated the instant
    the ad is requested, so a second tap during that window skipped the (already-consumed)
    cooldown check and called `beginRun()` immediately — then the original ad's callback fired
    later and called `beginRun()` AGAIN, clobbering the run already in progress. Added
    `adPendingRun` guard.
12. **Alt-build output files were stale** (last regenerated a full day earlier, missing all of
    #035/#036/#037). Regenerated both after the script fix (item 6).

VALIDATION: `node --check` on the extracted script for both the master and both regenerated alt
builds (had to fix the extraction to grab the LAST `<script>...</script>` block, not a naive
first-to-last greedy match, since the alt builds' injected SDK head blocks are also bare
`<script>` tags); happytime() confirmed firing independently of gameplayStop() via a direct
`gpLast` check; trials-panel line widths confirmed under the 230px inner panel width via
`measureText`; bot suite re-run 11/12 wins, zero console errors; debug=1 overlay confirmed
rendering without error.

## JF-#038 — third pass: asked for 50, delivered what was real (2026-07-04)
After two deep audit rounds (24 verified fixes, several of which were regressions from the
round before), a genuine third sweep does not turn up 50 more distinct CG-relevant bugs in a
2300-line file without inventing thin/duplicate findings — which is exactly the pattern that
caused #036→#037's regressions. Said so and scoped down instead of padding. What was real:
- **Both `.md` docs were stale**: JADE_FIST_ROADMAP.md still said "Left: Mike re-playtest →
  JF-#029 tuning pass" as the next step, three batches and two audits behind reality.
  JADE_FIST_SUBMISSION.md's tech checklist and listing description dated to JF-#018/#019 and
  never mentioned scrolls/wardrobe/Hall of Legends/LEGEND — undersells depth to CG reviewers,
  who judge acceptance on exactly that. Rewrote both to current state.
- **No favicon/meta description/OG tags** — harmless for the CG-hosted listing (their own page
  chrome), but the standalone GH Pages URL Mike actually uses to test fired a 404 favicon
  request every load and had nothing useful if the link got shared. Added an inline SVG
  favicon (no asset file) + description + og:title/og:description.
- **`checkAdblock()` only ran once, at SDK-init time** — some adblock detectors populate late.
  Added a re-check right before the first real interstitial/rewarded request too.

VALIDATION: `node --check` on master + both regenerated alt builds; bot suite 12/12 wins, zero
console errors.
