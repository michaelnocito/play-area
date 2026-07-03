# HANDOFF — JADE FIST (2026-07-03, end of CG-compliance session, at JF-#020)

**YOU (the assistant reading this) ARE RECEIVING THE HANDOFF.** Mike pasted this to start a
new chat. Do not re-summarize it back to him or write a new handoff — read it, load the
listed memories/docs, and start on the next task below.

**What this is:** Jade Fist, a kung fu counter-brawler targeting CrazyGames acceptance.
Single-file canvas + vanilla JS, no build step.
Local: `C:\Users\Mike\Projects\GAMES\play-area\jade-fist\index.html` (public play-area monorepo).
Live: https://michaelnocito.github.io/play-area/jade-fist/. Commits `JF-#NNN`; at **JF-#020**.
Read first: memory `project_jade_fist_state` + `reference_crazygames_requirements`, repo-root
`GAME_BIBLE.md`, and `jade-fist/JADE_FIST_DEV_NOTES.md` (full design log).

**This session (JF-#013 → #020) — ALL CG gap batches A–G closed, plus seasoning:**
- #013 (A) CG SDK v3: init + loading bracket, gameplayStart/Stop per run, happytime on victory.
  Adapter copied from rooftop-sprint; graceful no-op off-platform.
- #014 (B) Pause: P toggles, tab blur auto-pauses, any input resumes; world fully frozen.
- #015 (C) devicePixelRatio-crisp canvas (logical 960x540 unchanged, pointer math untouched).
- #016 (D) Ads: interstitial between runs (3-min cooldown, never pre-first-run); rewarded
  DOUBLE JADE button on tally (R or tap, once per run; offline fallback grants immediately).
- #017 (E) District ambience: Courtyard petals, Market embers, Temple mist, Rooftop wind,
  Legend jade motes — all deterministic from t, freeze with pause.
- #018 (F) Menu instruction text replaced by a looping visual counter demo (approach → red
  flash → throw) with phase captions.
- #019 (G) `thumbnail.html` = one-click 2048x1152 cover PNG generator;
  `JADE_FIST_SUBMISSION.md` = listing copy, PEGI 12, Progress Save toggle, tech + QA checklists.
- #020 Touch of absurdity (CG research: physics comedy = top casual pattern): ~1-in-6 perfect
  counters = comedy send (double arc, wild spin, gold one-liner); thrown bodies BONK off screen
  edges once and rebound as live projectiles; 12% felled-foe yelps. Bosses exempt.

**State: submission-ready code, NOT playtested.** Everything since #006 is parse-checked only.

**Next work, in order (see JADE_FIST_ROADMAP.md):**
1. Mike playtests the full campaign → notes become the **JF-#021 tuning pass** (first-guess
   values: dBase 4/6 for Temple/Rooftop, boss hp, trial targets, send rate 0.18, yelp rate 0.12).
2. Manual QA list in JADE_FIST_SUBMISSION.md (144Hz, mobile, adblock, rewarded-once, CG preview).
3. Submit: cover from thumbnail.html, listing copy from the submission doc, PEGI 12,
   tick Automatic Progress Save.
4. Backlog (non-gating): reactive music, bot fairness suite, cosmetic shop, GM/GD alt builds.

**Standing rules:** check docs.crazygames.com/requirements before any feature; commit+push after
every change (solo authorship, no AI trailers); always give live URL + local path; enumerate test
steps as 021a/021b…; keep sessions short, one batch per chat.
