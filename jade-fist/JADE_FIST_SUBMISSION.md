# JADE FIST — CrazyGames submission package (JF-#019, Batch G)

Verify every item against docs.crazygames.com/requirements before submitting.

## Listing
- **Name**: Jade Fist (unique, no IP collision)
- **Category**: Action / Beat 'em up
- **Tags**: kung fu, brawler, counter, arcade, one button, martial arts
- **Description draft**: "The school's jade was stolen. Fight through four districts of the
  night city with two moves: strike toward them, or counter the red flash and throw them into
  the rest. Fell the bosses, learn belt techniques, take the daily trials, reclaim the jade."
- **Age rating**: PEGI 12 (non-realistic violence toward stick-figure characters, no blood)
- **Automatic Progress Save**: TICK THE TOGGLE (save is localStorage `jf_save_v1` — zero code needed)

## Assets
- Cover 2048×1152: open `thumbnail.html` locally, click download. Also export any smaller
  sizes the form asks for from the same PNG.
- Gameplay video/GIF if requested: record a Market-district run (busiest visuals).

## Tech checklist (state at JF-#018)
- [x] SDK v3 init + loading + gameplayStart/Stop (JF-#013)
- [x] happytime on victory (JF-#013)
- [x] Midgame interstitial w/ 3-min cooldown, never pre-first-run (JF-#016)
- [x] Rewarded ad = DOUBLE JADE on tally (JF-#016)
- [x] Pause: P + auto-pause on tab blur, any input resumes (JF-#014)
- [x] No Escape / Ctrl+W bindings
- [x] AZERTY: Q + A + D + arrows all mapped
- [x] devicePixelRatio-crisp canvas (JF-#015)
- [x] Visual onboarding demo loop on menu (JF-#018)
- [x] Touch controls (tap halves) — mobile-capable

## Pre-submission QA (manual, Mike)
- [ ] 144Hz monitor run: speed identical to 60Hz (fixed-step loop should hold)
- [ ] Mobile portrait + landscape: letterboxing correct, tap targets reachable
- [ ] Adblock on: game still loads and plays (ads no-op)
- [ ] Full campaign clear: Courtyard → Rooftop → ending → LEGEND unlock
- [ ] Rewarded button grants exactly once per tally
- [ ] QA on crazygames.com preview environment (SDK live) before publishing
