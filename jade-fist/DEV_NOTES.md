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
- Enemy hit check in E_STRIKE uses a first-frame check that's approximate under slow-mo dt.
