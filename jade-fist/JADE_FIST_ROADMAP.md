# JADE FIST — Roadmap to CrazyGames-grade

Same standard as Rooftop Sprint: genuinely fun + polished, clears CG quality guidelines.
One quality bar, one submission wave. Status as of JF-#024 (2026-07-03).

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
- [ ] **Mike playtest** — full campaign Courtyard→Rooftop→ending→LEGEND; notes feed JF-#025
- [ ] **Bot fairness pass** — run index.html?bot=3, read the console verdict before tuning
- [ ] **JF-#025 tuning pass** — first-guess values under review: Temple/Rooftop dBase 4/6,
      boss hp 3/3/4/4, trial targets, omen numbers, comedy-send rate (0.18), yelp rate (0.12),
      music intensity curve, cosmetic dye prices (40/60/90/120)
- [ ] **Manual QA** (list in JADE_FIST_SUBMISSION.md): 144Hz speed, mobile portrait/landscape,
      adblock-on load, rewarded once-per-tally, CG preview-environment SDK check
- [ ] **Submit to CrazyGames** — cover PNG from thumbnail.html, listing copy from
      JADE_FIST_SUBMISSION.md, PEGI 12, tick Automatic Progress Save
- [ ] Post-review iterate on CG reviewer feedback

## Backlog — CLEARED 2026-07-03
- [x] JF-#021 Reactive music: pentatonic pluck bed + drone, one intensity knob
      (difficulty/combo/boss), taiko pulse under bosses, silent on pause/blur
- [x] JF-#022 Bot fairness suite: ?bot=N (&react=12) plays N runs per district,
      classifies hits pincer/fast/clean, console table + verdict; never touches real save
- [x] JF-#023 Cosmetic shop: 5 robe dyes (pure jade sink), wardrobe on menu (C/B or tap)
- [x] JF-#024 GM/GD alt builds: SDK-marked master + make-alt-builds.ps1 →
      alt-builds/{gamemonetize,gamedistribution}/index.html (placeholder gameIds)

## Top-100 gap analysis (2026-07-03 research vs current build)
Full findings in JADE_FIST_DEV_NOTES.md §top-100. Already covered: fast-to-play run
loop, rewarded double-jade + interstitial pattern, daily trials/omen/return bonus,
endless LEGEND mode, cosmetics (#023), mobile one-tap controls, district/boss goals.

Adopt (ranked, none gating submission):
- [ ] G1 Within-run escalation: technique/power pickups that grow DURING a run
      (top pattern: EvoWars/merge games — visible growth inside one run)
- [ ] G2 Leaderboards: per-district score/wave board via CG data module
      ("Leaderboards"/"be the best" curated shelves; retention = ranking flywheel)
- [ ] G3 Listing SEO + video: subtitle keywords ("Jade Fist: Kung Fu Counter Fighting");
      hover-video MP4 must open on a counter→comedy-send moment in the first 5s
- [ ] G4 CG account integration (Premium Perks shelf) once live: data-module cloud save
- [ ] G5 Update cadence: ship a visible update ~monthly post-launch — "Updated" badge
      re-triggers discovery placement
- [ ] G6 Local 2P versus mode (Ragdoll Archers model): split-keyboard duel, cheap
      "2 Player" tag entry
- [ ] G7 Controller support: small curated tag (only ~59 games), cheap differentiation
