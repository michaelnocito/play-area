# JADE FIST — Roadmap to CrazyGames-grade

Same standard as Rooftop Sprint: genuinely fun + polished, clears CG quality guidelines.
One quality bar, one submission wave. Status as of JF-#020 (2026-07-03).

## Done
- [x] JF-#001 Prototype: core counter-brawler loop (strike / counter-throw / combo / tally)
- [x] JF-#003 Enemy variety: viper / iron monk / spearman, guards, shove-stumble chains
- [x] JF-#004 Permanent progression: JADE currency + 4 upgrade tracks, one-tap tally spend
- [x] JF-#006 Difficulty pass: whiff recovery, steeper ramp, tighter telegraphs, late pincers
- [x] JF-#007 Interaction pass: PERFECT counters, projectile throws, feints, enrage
- [x] JF-#008–#012 Campaign: 5-wave runs, counter-only bosses, 4 districts + LEGEND,
      belt techniques, daily trials + omen, story intro + ending
- [x] JF-#013 CG SDK v3 (init/loading, gameplayStart/Stop, happytime) — Batch A
- [x] JF-#014 Pause: P + auto-pause on blur, any-input resume — Batch B
- [x] JF-#015 devicePixelRatio-crisp canvas — Batch C
- [x] JF-#016 Rewarded DOUBLE JADE + interstitial w/ 3-min cooldown — Batch D
- [x] JF-#017 District ambience (petals/embers/mist/wind/motes) — Batch E
- [x] JF-#018 Visual onboarding demo loop on menu — Batch F
- [x] JF-#019 Submission package: thumbnail.html cover generator + JADE_FIST_SUBMISSION.md — Batch G
- [x] JF-#020 Touch of absurdity: comedy sends, edge bonks, felled-foe yelps (CG physics-comedy research)

## Left (in order)
- [ ] **Mike playtest** — full campaign Courtyard→Rooftop→ending→LEGEND; notes feed JF-#021
- [ ] **JF-#021 tuning pass** — first-guess values under review: Temple/Rooftop dBase 4/6,
      boss hp 3/3/4/4, trial targets, omen numbers, comedy-send rate (0.18), yelp rate (0.12)
- [ ] **Manual QA** (list in JADE_FIST_SUBMISSION.md): 144Hz speed, mobile portrait/landscape,
      adblock-on load, rewarded once-per-tally, CG preview-environment SDK check
- [ ] **Submit to CrazyGames** — cover PNG from thumbnail.html, listing copy from
      JADE_FIST_SUBMISSION.md, PEGI 12, tick Automatic Progress Save
- [ ] Post-review iterate on CG reviewer feedback

## Backlog (optional, not gating submission)
- [ ] Reactive music score keyed to combo heat (rooftop-sprint speaker architecture)
- [ ] Bot fairness suite (adapt rs_playtest.js pattern)
- [ ] Cosmetic shop / pre-run consumable buffs
- [ ] GM/GD alt builds from one master (fallback if CG rejects, rooftop build-script pattern)
