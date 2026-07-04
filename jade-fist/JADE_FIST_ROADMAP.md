# JADE FIST — Roadmap to CrazyGames-grade

Same standard as Rooftop Sprint: genuinely fun + polished, clears CG quality guidelines.
One quality bar, one submission wave. Status as of JF-#037 (2026-07-04).

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
- [x] JF-#021 Reactive music: pentatonic pluck bed + drone, one intensity knob
      (difficulty/combo/boss), taiko pulse under bosses, silent on pause/blur
- [x] JF-#022 Bot fairness suite: ?bot=N (&react=12) plays N runs per district,
      classifies hits pincer/fast/clean, console table + verdict; never touches real save
- [x] JF-#023 Cosmetic shop: 5 robe dyes (pure jade sink), wardrobe on menu (C/B or tap)
- [x] JF-#024 GM/GD alt builds: SDK-marked master + make-alt-builds.ps1 →
      alt-builds/{gamemonetize,gamedistribution}/index.html (placeholder gameIds)
- [x] JF-#025 Within-run scrolls (G1): wave clears offer 2 of 6 run-only scrolls
      (Tiger/Crane/Ox/Serpent/Dragon/Monkey); powers die with the run
- [x] JF-#026 Hall of Legends (G2): local per-district top-5, tally rank line, menu top-3;
      CG.submitScore seam (CG boards are INVITE-ONLY — wire when invited)
- [x] JF-#027 Cartoon art pass: chunky cel-outlined fighters, big heads + live faces,
      squash, comic-font pop-in popups, star hits, brighter palette, sleepy moon
- [x] JF-#028 Duck/jump dodge axis + spearman throws (high=duck/low=jump, telegraphed) +
      difficulty bump; bot re-validated fair (11/12 wins, 0% unreactable)
- [x] JF-#029 Real duck/jump poses (deep crouch + tucked-leg leap) + ground shadow;
      full test battery 17/17 (dodge windows, timing, spacing, integrity) + bot 12/12 fair
- [x] JF-#030–#034 "Make it sillier" batch (10 gags, all on existing systems): enemy
      chatter, gag props, reactive moon, longest-yeet stat, joke scrolls, accessory
      cosmetics, bowling STRIKE, hype announcer, boss personalities + Butcher cleavers,
      between-wave cameo; validated smoke + bot 12/12 fair
- [x] JF-#035 Menu legibility pass: darker vignette, solid panels behind corner text,
      real filled CTA button, condensed trials/omen/hall text (partly reverted by #036
      once it broke "player always knows what to do now")
- [x] JF-#036 First CG-guidelines audit (12 fixes): ad/gameplayStart ordering, portrait-
      mobile rotate prompt, stale click hitbox, duck/jump dodge symmetry, loading-order,
      restored trial detail, LEGEND loop identity, wardrobe touch targets, mobile font size,
      adblock-detection hook
- [x] JF-#037 Second CG-guidelines audit (12 more fixes, several were #036 regressions):
      independent SDK-call debounce (was silently eating happytime() on every win),
      window.blur pause listener, ad-cooldown clock starting at session load, mute button
      visible during pause again, debug=1 QA overlay, GM/GD alt-build callback fix, timeout
      safety nets on ad/init callbacks, non-optimistic reward flag, trials-panel text
      overflow fix, startRun() re-entrancy guard, alt-builds regenerated

## Left (in order)
- [ ] **Mike playtest** the current build (post #035–#037: legibility + two compliance
      audits, no further self-review — see JADE_FIST_DEV_NOTES.md for why diminishing
      returns set in on solo audit passes)
- [ ] **Manual QA** (list in JADE_FIST_SUBMISSION.md): 144Hz speed, mobile portrait/landscape
      (including the new rotate prompt), adblock-on load, rewarded once-per-tally,
      CG preview-environment SDK check, `?debug=1` readout sanity check
- [ ] **Submit to CrazyGames** — cover PNG from thumbnail.html, listing copy from
      JADE_FIST_SUBMISSION.md (now mentions scrolls/Hall of Legends/wardrobe for CG's
      depth-and-retention read, not just the base combat loop), PEGI 12, tick Automatic
      Progress Save
- [ ] Post-review iterate on CG reviewer feedback

## Top-100 gap analysis (2026-07-03 research vs current build)
Full findings in JADE_FIST_DEV_NOTES.md §top-100. Already covered: fast-to-play run
loop, rewarded double-jade + interstitial pattern, daily trials/omen/return bonus,
endless LEGEND mode, cosmetics (#023), mobile one-tap controls, district/boss goals.

- [x] G1 → JF-#025 within-run scrolls (visible growth inside one run, the top pattern)
- [x] G2 → JF-#026 Hall of Legends (local; CG leaderboards invite-only, seam ready)
- [ ] G3 Listing SEO + video: subtitle keywords ("Jade Fist: Kung Fu Counter Fighting");
      hover-video MP4 must open on a counter→comedy-send moment in the first 5s (at submission)
- [ ] G4 CG account integration (Premium Perks shelf) once live: data-module cloud save
- [ ] G5 Update cadence: ship a visible update ~monthly post-launch — "Updated" badge
      re-triggers discovery placement
- [ ] G6 Local 2P versus mode (Ragdoll Archers model): split-keyboard duel, "2 Player" tag
- [ ] G7 Controller support: small curated tag (only ~59 games), cheap differentiation
