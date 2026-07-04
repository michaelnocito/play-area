# JADE FIST — CrazyGames submission package (updated JF-#037, 2026-07-04)

Verify every item against docs.crazygames.com/requirements before submitting.

## Listing
- **Name**: Jade Fist (unique, no IP collision)
- **Category**: Action / Beat 'em up
- **Tags**: kung fu, brawler, counter, arcade, one button, martial arts
- **Description draft**: "The school's jade was stolen. Fight through four districts of the
  night city with two moves: strike toward them, or counter the red flash and throw them into
  the rest. Fell the bosses, learn belt techniques and daily trials, grow a run with scrolls
  that die when it ends, dress your fighter from the wardrobe, and climb each district's Hall
  of Legends. Reclaim the jade — then keep going in LEGEND, the endless retelling."
  (Was combat-only; CG judges acceptance on depth/retention, so the listing should say what's
  actually in the game — scrolls/wardrobe/Hall of Legends/LEGEND were all built but unlisted.)
- **Age rating**: PEGI 12 (non-realistic violence toward stick-figure characters, no blood)
- **Automatic Progress Save**: TICK THE TOGGLE (save is localStorage `jf_save_v1` — zero code needed)

## Assets
- Cover 2048×1152: open `thumbnail.html` locally, click download. Also export any smaller
  sizes the form asks for from the same PNG.
- Gameplay video/GIF if requested: record a Market-district run (busiest visuals).

## Tech checklist (state at JF-#037)
- [x] SDK v3 init + loading + gameplayStart/Stop (JF-#013; independently debounced + a 6s
  init timeout so a hung SDK.init() can't blank the canvas forever, JF-#037)
- [x] happytime on victory (JF-#013; confirmed firing independently of gameplayStop() again
  after JF-#037 fixed a shared-debounce bug that had silently killed it on every win)
- [x] Midgame interstitial w/ 3-min cooldown, never pre-first-run, clock starts at session
  load not epoch 0 (JF-#016/#037), 8s hang timeout, re-entrancy guard on startRun() (JF-#037)
- [x] Rewarded ad = DOUBLE JADE on tally, non-optimistic reward flag + 8s hang timeout (JF-#016/#037)
- [x] Pause: P + auto-pause on tab blur AND window blur for iframe embeds, any input resumes
  (JF-#014/#037); mute button visible (and thus honestly clickable) during pause again
- [x] No Escape / Ctrl+W bindings
- [x] AZERTY: Q + A + D + arrows all mapped (physical-position `code`, verified correct)
- [x] devicePixelRatio-crisp canvas (JF-#015)
- [x] Visual onboarding demo loop on menu (JF-#018)
- [x] Touch controls (tap halves + swipe dodge) — mobile-capable
- [x] Portrait-mobile rotate prompt + auto-pause (JF-#036) — was a bare 375x211 letterboxed
  strip with no explanation before this
- [x] `?debug=1` QA overlay: sdkLive / adblockDetected / portraitBlock readout (JF-#037)
- [x] GameMonetize/GameDistribution alt builds regenerated with matching ad-callback
  signature (JF-#037 fixed a stub-adapter mismatch that would have deadlocked those builds)

## Pre-submission QA (manual, Mike)
- [ ] 144Hz monitor run: speed identical to 60Hz (fixed-step loop should hold)
- [ ] Mobile portrait + landscape: rotate prompt shows correctly, letterboxing correct in
  landscape, tap targets reachable
- [ ] Adblock on: game still loads and plays (ads no-op); `?debug=1` should show
  `adblock:true` — use this to confirm the detection actually works, not just that
  gameplay isn't blocked
- [ ] Full campaign clear: Courtyard → Rooftop → ending → LEGEND unlock; confirm LEGEND
  boss-fall banner shows "LOOP N" and death tally shows "(loop N)"
- [ ] Rewarded button grants exactly once per tally
- [ ] QA on crazygames.com preview environment (SDK live) before publishing
