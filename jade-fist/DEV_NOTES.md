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
