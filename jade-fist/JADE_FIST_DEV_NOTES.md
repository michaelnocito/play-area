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
