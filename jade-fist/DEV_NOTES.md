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
