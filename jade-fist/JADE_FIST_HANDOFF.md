# HANDOFF — JADE FIST (2026-07-04, at JF-#038)

**YOU (the assistant reading this) ARE RECEIVING THE HANDOFF.** Mike pasted this to start a
new chat. Do not re-summarize it back to him or write a new handoff — read it, load the
listed memories/docs, and start on the next task below.

**What this is:** Jade Fist, a kung fu counter-brawler targeting CrazyGames acceptance.
Single-file canvas + vanilla JS, no build step.
Local: `C:\Users\Mike\Projects\GAMES\play-area\jade-fist\index.html` (public play-area monorepo).
Live: https://michaelnocito.github.io/play-area/jade-fist/. Commits `JF-#NNN`; at **JF-#038**.
Read first: memory `project_jade_fist_state` + `reference_crazygames_requirements`, repo-root
`GAME_BIBLE.md`, and `jade-fist/JADE_FIST_DEV_NOTES.md` (full design log) + `JADE_FIST_ROADMAP.md`.

**Mike's bar:** NO launch until the game is COMPLETE and genuinely fun. Playtest #1 PASSED but he
called it "50% ready". He makes features gating on demand. Don't rush to submit.

**Where the build is now (major systems all in + validated):**
- Core: counter-brawler (strike / counter the RED telegraph = throw / combo). Enemy types
  viper·iron-monk·spearman + guards/feints/enrage. 4 districts + bosses + LEGEND endless.
- Progression: JADE currency + 4 permanent upgrades, belts + techniques, daily trials + omen,
  return-bonus streak, Hall of Legends (local per-district top-5; CG leaderboards are INVITE-ONLY,
  `CG.submitScore` no-op seam is wired for when we're invited).
- G1 within-run **scrolls** (wave-clear offers 2 of 10 run-only powers; 6 real + 4 joke).
- **Dodge axis** (JF-#028/#029): spearmen throw ONE spear from range first (telegraphed HIGH=DUCK
  amber / LOW=JUMP cyan) then close to melee. Keys ▲/W jump, ▼/S duck; touch swipe up/down.
  Real crouch/leap poses + ground shadow (duck verified to read as a crouch).
- Cartoon art pass (JF-#027): chunky cel-outlined big-headed fighters, live faces, comic popups,
  star hits, brighter palette, sleepy (now reactive) moon.
- **"Make it sillier" batch (JF-#030–#034), all built on existing systems:** enemy chatter,
  district gag props (thrown bodies crash the noodle-cart/gong/etc), reactive moon, longest-yeet
  brag stat, 4 joke scrolls (Grease/Drunken/Big-Head/Tiny-Fists), accessory cosmetics
  (panda/mustache/chicken/li'l-dragon), bowling STRIKE on 3+ felled, hype announcer, boss
  personalities (taunts + Butcher's cleaver throws reusing the dodge system), between-wave cameo.
- CG-compliance done earlier (batches A–G): SDK v3, pause, dPR-crisp canvas, rewarded double-jade
  + interstitial, ambience, visual onboarding, submission package (thumbnail.html + submission doc).
- GM/GD alt builds: `make-alt-builds.ps1` stamps GameMonetize + GameDistribution variants from the
  SDK-marked master. Regenerate after ANY master change (script does it; commit does too).

**Difficulty:** bumped in #028 (dBase 1/3/5/7/9, boss hp 3/4/5/5/6, earlier pincers, more throwers).
Mike found it too easy before; validate any further changes with the bot.

**Testing you can run headlessly (I do this via the Claude Preview tool, not screenshots):**
- Bot fairness: open `index.html?bot=3&react=12` — `BOT` is a top-level const (ref it directly in
  eval, not `window.BOT`). Fast-forward with a setInterval calling `update()` in a loop; read
  `BOT.stats`. USE TRAILING SLASH: `/jade-fist/?bot=3...` or the dev server drops the query.
  Last run: 12/12 wins, 0% unreactable, 0% pincer — all hits were dodgeable throws. FAIR.
- Preview SCREENSHOTS time out in the backgrounded renderer. To actually SEE a frame: set
  `cv.width=960;cv.height=540;cx.setTransform(1,0,0,1,0,0)`, pose the state, `draw()`, then
  `drawImage` a crop to a temp canvas and `toDataURL('image/jpeg',...)`; decode + Read it.
  (Mike also just checks the live URL — see memory `feedback_no_local_preview_for_deployed_sites`.)

**Since JF-#034 (all shipped):** JF-#035 menu legibility pass; JF-#036 first CG-guidelines
audit (12 fixes); JF-#037 second audit (12 more, several were #036 regressions); JF-#038
combat rebalance (counter-throw was OP — normal/fast/spear now take 2+ hits, the wide
screen-clearing throw gated behind combo≥4/FINISH_AT) + roadmap/submission doc sync. All in
JADE_FIST_DEV_NOTES.md. Bot suite 12/12 fair. Playtest tracker shows all-pass (historical).

**Next work, in order (JADE_FIST_ROADMAP.md):**
1. **Mike full playtest** of the current build (post #035–#038: legibility + two compliance
   audits + rebalance). Feedback rides the playtest tracker (game "jade-fist").
2. **Manual QA** (JADE_FIST_SUBMISSION.md): 144Hz speed, mobile portrait/landscape, adblock-on
   load, rewarded-once, CG preview-environment SDK check.
3. **Submit to CrazyGames**: cover from thumbnail.html, listing copy from the submission doc,
   PEGI 12, tick Automatic Progress Save. Listing SEO (gap G3): subtitle keywords
   ("Jade Fist: Kung Fu Counter Fighting"); hover-video first 5s should show a counter → comedy
   send → STRIKE.
4. Post-launch backlog (gaps G4–G7): CG account/Premium Perks cloud save, monthly update cadence,
   local 2P versus, controller support.

**Standing rules:** check docs.crazygames.com/requirements before any feature; parse-check the
inline JS (`node --check`) before committing; commit+push after every change (solo authorship as
Michael Nocito, NO AI/Co-Authored-By trailers); always give the live URL + local path; enumerate
test steps as 035a/035b…; keep sessions short, one batch per chat; regenerate alt builds after
master changes.
