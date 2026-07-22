# FLIPLINE → ODD SOCK — Dev Handoff / Resume Point

## ✅ JOURNEY BATCH (2026-07-21) — §journey-batch — P1+P2+P3 + GQ-5/6/7/8 + C1 + C3, in proto/drum.html
The whole remaining feasible roadmap in one wave (Mike: "go for all that are feasible");
C4 ship-wave assets + the feel-gate stay his. Full item list in FLIPLINE_ROADMAP.md build order.

**Shape of it:**
- **THE JOURNEY (C2/P1):** `STAGES[]` — 9 named drums reading as one sentence, cumulative
  mechanics via `stageHas(stage,key)` (drift 2+ / zipper 4+ / wobble 5+ / spincycle 7+ / lint 8+),
  per-stage teases via `stageTease` (3/6/9; endless = every 3rd). Stage 9 clear → `mode="reunion"`
  scene (socks meet, biggest smile, confetti) → "…but laundry day happens again." → tap continues
  into ENDLESS TUMBLE n (stage 10+, everything on). `reunited` persists; ready screen shows it.
- **P2:** `mode="intro"` cold-open (2.6s, zero text, skippable, `seenIntro` persists);
  `teaseT` timeline (out → hover → yank w/ speed lines + falling note); sock pupils aim at the
  vortex (or the teased pair) via world→local rotation; wide eyes + "oh!" mouth during hover.
- **GQ-5:** landing arcs at the rim for every obstacle with z<0.72 once `zeff>TELE_Z` (0.46),
  drawn at LIVE angle so drum spin + towel drift stay truthful. Zippers get silver arcs.
- **GQ-6 fairness notes:** drift 0.12rad/s vs steer 3.0 (4% — a re-read, not a reflex tax);
  zipper `zm=1.5` + hw 0.09 + its own spawn tick; wobble/spincycle modulate SPIN only (world
  moves, never the player — the E3 lesson); lint veil is draw-only.
- **GQ-7:** `mode="clear"` 1.5s ceremony — sock spirals into the vortex (`ck` timeline in the
  sock draw), button confetti rains inward, then the stage screen. NEW BEST (metres OR points)
  plays the win stinger at death.
- **GQ-8:** `teachT/teachKind` — world runs ×0.35 under the glyphs; beat 1 = ◀ ▶ on the first
  garment ever (ends the moment they steer), beat 2 = ⊙ TAP on the first full bar (ends on tap).
  `taught1/taught2` persist.
- **C1:** P pause + any-input resume + auto-pause on BOTH visibilitychange and window blur
  (CG iframe gotcha); M mute persisted, applied every frame (`(mutedFlag||paused)→gain 0` also
  silences the always-on rumble loop); AZERTY = Q steers left, Z taps; `SDKA` adapter seam —
  ONE object the real CG SDK swaps into at C4, already routed: gameplayStart/Stop at every
  run/stage boundary, happytime on beating the pair, rewarded FREE MEND on the stage screen
  (only when hp<max AND can't afford ¢25), `tryMidgame()` at final death + every 3rd stage
  clear with an honest 180s cooldown clock. `?dev=1` god (G) + stage-skip (N) inside
  DEV:BEGIN/END strip markers.
- **C3:** `runPts() = m×10 + ¢×25 + stages×250`; dead screen = line-item tally revealing one
  row per 0.45s with a tick (advanced in update, not draw), TOTAL, NEW BEST pulse, haul;
  `bestPts` persists. **P3 missions:** `MISSIONS[30]` (graze/coin/stage/pulse/ride/jam/pair/
  clean/hot/quarter kinds; run-scoped `M` + lifetime `TOT`), 3 visible slots, drip-feed
  `mNext`, at most ONE completion per `mCheck()` call (breathing room), ¢ paid instantly +
  banner; `RANKS[8]` ladder = mDone/4. Ready screen lists the 3 slots + rank.
- **Save schema grew** (same key `flipline.drum.proto`): seenIntro/reunited/muted/bestPts/
  tot/mSlots/mNext/mDone/t1/t2. Old saves migrate silently (missing fields default).
  ⚠️ The 2026-07-21 test drive polluted the proto save → CLEARED it; Mike starts fresh
  (cold-open + full mission list) — the proto bank was throwaway.

**Verified headless (paused=true freezes the rAF loop, update() driven by hand; 12/12):**
intro auto-advance + skip · teach1 fires at first garment z>0.55 and ends on steer ·
stage names/mech gates/tease gates all correct · tease fires at 51% of stage 3 ·
clear → 1.5s ceremony → stage screen, gained pays · stage 9 → reunion → endless ·
mission pays +¢10 and refills its slot · zipper hw 0.09 zm 1.5 spawns at stage 4 ·
drift towel at stage 2 · wobble swings spinNow 0.270..0.448 · spin-cycle surges + banner ·
death tally reaches 4 lines w/ NEW BEST both-flavours · AZERTY q steers negative ·
pause flag honoured. Console clean, `node` parse clean.

**Bot fairness harness (same session):** `?bot=1&react=N` (default 12) arms a gap-seeking bot
inside DEV:BEGIN/END markers — samples 64 rim angles, scores clearance vs everything incoming
(leading each obstacle by its remaining spin), steers to the best reachable gap through an
N-frame reaction queue; `BOT` skips saveLS so the real save is never touched. Drive it headless:
`paused=true` freezes the rAF loop, then step `update(1/60)` by hand and `advance()` through
screens (the JOURNEY-batch pattern). **Verdict 2026-07-21: 0% unreactable across 31 hits /
10 runs** — death forensics (45-frame history ring; at each hp loss, check whether ANY angle
reachable in 0.5s cleared everything in the hit window at the snapshot 30 frames back) found a
reachable escape with ≥0.26rad margin before EVERY hit, with zippers/drift/wobble live. A
reaction sweep (4/8/12f) changed nothing → deaths are planning failures, not reflex failures =
skill-shaped and fair. The bot itself dies mid-stage-1-to-2, i.e. it plays like an average
first-session player; don't read its stage ceiling as the game's.

**Test steps for Mike (JB-a…JB-l):** JB-a fresh load → cold-open plays once, tap skips it.
JB-b first run → world slows w/ ◀ ▶ glyphs at the first shirt; steering ends it.
JB-c full static bar → ⊙ TAP glyph slow-beat once ever. JB-d stage 1 clear → sock spirals
into the vortex w/ confetti before the stage screen. JB-e stage 3 past halfway → your pair
swings out, hovers wide-eyed, gets yanked back. JB-f stage 4+ → thin silver zipper whips
(faster, telegraphed). JB-g stage 5+ → the drum visibly wobbles. JB-h stage 7+ → SPIN CYCLE!
gauntlet before the vortex. JB-i die → tally counts up line by line; NEW BEST pulses when
earned. JB-j ready screen → rank + 3 missions w/ live progress; complete one mid-run → banner
+ ¢. JB-k P pauses (and clicking off the tab pauses); M mutes and it sticks after reload.
JB-l clear stage 9 → REUNION scene → tap → ENDLESS TUMBLE.

## ✅ DRUM ALIVE batch (2026-07-16) — GQ-B core + E4 + coin choreography, in proto/drum.html
🔷 Mike: "the side-to-side cylinder feels like the beginning of the core movement but is
missing something" → triple research pass (movement feel / engagement systems / secondary
verbs; Super Hexagon, Slope, Downwell, Jetpack Joyride, Touhou graze, Tempest 2000 all
cited in session). Diagnosis: playing normally, CHASE sat at ~0 the whole run (measured in
live play) — the risk layer was invisible; drum tumble too weak to matter; no music.
Built (world moves, player NEVER displaced — E3/B1 lesson holds):
- **Living tumble:** `spinNow` = DRUMSPIN·(1 + chase·0.35 + (stage−1)·0.12); sock, laundry
  AND change all ride the same spin (gaps never move relative to the player — fair).
- **DRUM JAM (E4):** every 11–17s (not <50m or last 80m): 0.9s grind telegraph (shudder +
  grind SFX + "THE DRUM GRINDS…") → 2.6s eased ×3 spin surge ("DRUM JAM!", spawns ×0.7
  denser) → 2s relief (no new laundry). Rotational only — zeff untouched.
- **Beat-lock:** BEAT=0.5s dryer THUMP; spawn cadence arms `wantSpawn`, actual pattern
  lands ON the next thump; rim breathes with beatP.
- **Music bed (GQ-3):** thump kick each beat, bass root on the 1 + answering fifth,
  pentatonic off-beat layer + noise hats that open with `inten = max(chase, prog·0.5,
  jam·0.85)` — the CHASE is now audible.
- **HOT ¢×2 (visible risk pay):** chase>0.66 = HOT — every coin pays double, "HOT ¢×2"
  flashes on the chase bar, "×2!" pop at the bank.
- **Hem-hug trails (coin choreography):** `hemTrail()` lays 3 pennies ALONG a garment's
  graze edge (solo + pair patterns) — the greedy line IS the graze line.
Verified (live harness): 13/13 spawns on-beat; spin 0.22→0.297 @ chase 1; jam surge peaks
0.89 rad/s and ends clean; HOT quarter paid 6¢, cool penny 1¢; draw clean; node --check ok.
Test steps: DA-a idle at stage 1 — hear the thump, rim breathes, patterns arrive on it ·
DA-b graze + grab change till the chase bar crosses the hot line — music opens up, world
spins faster, "HOT ¢×2" shows, coins bank double · DA-c wait for "THE DRUM GRINDS…" —
shudder, then a 2.6s fast-spin jam, then a quiet breather · DA-d confirm you're never
shoved: sock only moves when you steer (plus the shared drum carry) · DA-e hem-hug penny
runs sit along hot edges — riding them = riding the graze line · DA-f play pure-safe —
music stays sparse, drum stays slow (the contrast IS the feature).
## ✅ STATIC PULSE + INSTANT RESTART (2026-07-16, same session) — 🔷 Mike: "do 4 and 5 first"
- **STATIC PULSE (second verb, feel-gate):** tap with a PARTIAL static bar (≥0.35) = 0.3s
  intangible-IN-PLACE discharge, costs ⅓ meter (crack SFX, expanding ring, spark shower).
  Full bar + tap = RIDE THE CURRENT, untouched and locked. No displacement ever (E3 lesson).
  Creates the spend decision: pulse now vs save for the ride; graze charges it, so the
  second verb is earned by risky use of the first (Downwell coupling).
- **INSTANT RESTART:** death screen accepts ANY key/tap after a 0.4s lockout (panic-tap
  guard so the haul is still readable) — steering keys included, so retry is <1s without
  moving your hands (Crossy Road rule).
- HUD: static meter shows the pulse-threshold notch; label cycles slide→PULSE→RIDE;
  ready screen teaches all three.
Verified live: pulse i-frame survives a direct rim overlap, same overlap damages after it
ends; cling 0.5→0.15 on pulse; full bar rides (never pulses); early arrow blocked on death,
arrow restarts at 0.66s; draw clean; node --check ok.
Test steps: SP-a build ⅓ static, tap — crack + ring, meter drops to the notch · SP-b tap
INSIDE a garment's arrival — it passes through you · SP-c full bar tap still rides the
current · SP-d die — arrows do nothing for a beat, then any key relaunches instantly ·
SP-e decide mid-wall: pulse through vs hold for the ride (the interesting choice).
NEXT: Mike feel-gates DRUM ALIVE + PULSE together. Then P2 (near-reunion teases +
expressive sock) → P1 (staged reunion ending, C2) → P3 (3-slot missions, C3);
P4 Daily Tumble + P5 Lint Locker = post-launch update wave (roadmap 🧭 PURPOSE & RETURN).

## ⚡ PREVIOUS RESUME (2026-07-11): DRUM BUILD-OUT
🔷 DRUM-ONLY ARC LOCKED — `proto/drum.html` IS the CrazyGames submission; the flip-runner
`index.html` (Batches A/B/B2) is a post-launch content update, never mixed into the review.
**Build order (one large chunk per session): GQ-A feel & feedback → GQ-B sound & drama →
C1 compliance → C2 stages+ending+drum-sim → C3 score/meta/shop port → C4 ship wave.**
Full specs per chunk: FLIPLINE_ROADMAP.md (🧺 DRUM PLAN section, GQ-1..8 gap analysis).
Proto state: static ride + garment gaps + 3-hit health + stages/MEND all working and
feel-approved. ❌ CATCH & FLING CUT (🔷 Mike 2026-07-11: "we don't need to catch cloths,
enough to be collecting coins and powerups") — cool garments, tap-priority catch, fling,
and the catch-COMBO all removed; tap = ride only; loop = buttons + orbs + graze.
✅ GQ-A DONE (2026-07-11, see below). ✅ ENGAGEMENT REWORK E1+E2 DONE (2026-07-12, see
below — CHASE meter + loot-in-danger + loose-change currency, after Mike: "novelty wears
off, mechanics aren't keeping me engaged").
❌ E3+B1 BUILT AND REVERTED same day (`f856960` → reverted): STATIC LEAP across the
diameter (Tempest 2000 jump) + HIT=TOSSED knockback w/ change scatter (Sonic rings).
🔷 Mike playtested: "I hate the last change, it plays like garbage." DO NOT REBUILD —
the centre RIDE (1.6s untouchable current, 0.5s landing grace) is back and stays; damage
stays clean (hit-stop/flash/fray, no knockback, no coin scatter). Lesson: physical
displacement of the player (forced angle changes, knockback) fights the drum's
read-and-steer core; juice on hits yes, control theft no.
NEXT = Mike feel-gates E1+E2 (keep/tune/kill), then E4 (drum-jam pressure events) or GQ-B (procedural
music bed re-voiced dryer-dark w/ vortex-proximity intensity, surge/relief waves ported
from TUMBLE, vortex suck-in slow-mo + confetti + stage/NEW BEST stingers).

## ✅ ENGAGEMENT REWORK — E1 CHASE + E2 LOOT-IN-DANGER + CHANGE CURRENCY (2026-07-12)
🔷 Mike: "the initial novelty wears off quickly and the play mechanics just aren't keeping
me engaged" + "floating static coins don't go with flying in the dryer… research how to
make the currencies unique." Research-backed diagnosis (Downwell/Super Hexagon/Tunnel Rush
+ Mario-vs-Sonic collectible placement): every system was single-purpose, colClear() made
loot risk-free (Sonic "pity offering" problem), and pacing ignored how you played.
Four ranked experiments defined — one feel-gate each: E1 CHASE meter · E2 loot-in-danger ·
E3 static ride → fast risk lane w/ forced dismount · E4 telegraphed drum-jam pressure
events. E1+E2 built; E3/E4 parked pending Mike's verdict. If E1+E2 don't land, revisit the
core verb (parked SPIN-THE-DRUM inversion) before GQ-B/C2 spend.
- **E1 THE CHASE (Downwell "gem high" move):** grazes (+0.25), pennies (+0.06), quarters
  (+0.16) fill `chase` (decays 0.05/s when safe). CHASE = +50% progress speed (`CHASE_SPD`)
  AND +25% approach speed (`CHASE_Z` — opt-in intensity, obstacles+coins share `zeff`).
  The PAIR races you on the progress bar (PAIR_MPS 18 vs safe pace ~16.5, +8%/stage,
  PAIR_HEAD 30m head start): beat it to the vortex → "YOU'RE GAINING ON YOUR PAIR!" +¢10
  (`GAIN_BONUS`), lose → "YOUR PAIR SLIPPED DEEPER…". Hot play = literally catching up;
  story is now mechanical, not cosmetic. HUD: thin hot CHASE bar under progress + PAIR tick.
- **E2 LOOT IN THE DANGER (Mario-coin rule):** colClear() placement removed for currency —
  pennies (1¢) run through a pattern's threadable gap, QUARTERS (3¢) sit just past a hot
  hem (GHW+0.14, inside graze range) — every pattern is now a take-the-risk decision.
  Orbs/patches keep safe placement (utility shouldn't gamble).
- **CURRENCY = LOOSE CHANGE ¢** (diegetic — what dryers actually eat): copper pennies /
  milled-edge silver quarters, fake-3D end-over-end tumble (width-collapse spin), metallic
  clink SFX, ¢ glyph everywhere, save field buttons→change (old banks migrate). Buff-orb
  diegetic re-theme (dryer sheet shield etc.) = GQ-B candidate.
- Verified: node --check; harness — save migration (42¢), graze→chase 0.25, quarter pays
  3¢+0.16 chase, full-chase speed ratio 1.50×, pair race + gain bonus fires, patterns
  spawn 12 coins/6 waves, 30s sim stable, draw clean.
Test steps: E-a HUD shows ¢ + tumbling copper/silver coins woven THROUGH the laundry (none
floating safely in the open) · E-b grab a quarter beside a hot hem — clink + CHASE bar
jumps + world speeds up · E-c play pure-safe — CHASE drains, PAIR tick pulls ahead, stage
screen says it slipped deeper · E-d play hot (grazes+change) — beat the PAIR tick, stage
screen "GAINING" +¢10 · E-e old save's button bank shows up as ¢.

## ✅ GQ-A — FEEL & FEEDBACK (2026-07-11) — DONE, in proto/drum.html
- **Steering ease (GQ-1):** `steerV` chases input over ~80ms (`STEER_EASE`), sock leans
  (rotate −lastMove·0.28 — local +x = decreasing angle) + stretches (1+|sv|·0.14 tangential)
  into travel; direction-reversal at speed kicks a dust puff (0.25s cooldown).
- **Hit-stop (GQ-2):** frame() freezes update 60ms on shield-pop, 80ms on damage
  (`HITSTOP_SHIELD/DMG`) — draw still runs. Camera micro-zoom punch `zoomP` (×1.035,
  decays 5/s) on shield/damage, centred on the drum.
- ~~Catch COMBO~~ — removed with the CATCH & FLING cut (see above). PENT ladder const
  kept in Snd for GQ-B music; a graze-streak combo is a candidate if GQ-B wants one.
- **GRAZE (GQ-4):** hot garment at the rim, pass within 0.10rad beyond the hitbox edge →
  once per garment (`o.grz`): +0.08 static, ember sparks, tick sound (full-charge sound if
  it tops the meter). One angular subtraction — safe in drum geometry (never reattempt the
  flip-runner skim).
- **🔷 STORY LOCK:** you dive into THE LOST SOCK VORTEX because your PAIR was sucked in
  first — you're chasing it. The pair sock is now VISIBLE spiralling in the vortex during
  play (warm glow, grows with progress, always ahead); ready screen states the hook; stage
  screen = "YOUR PAIR IS STILL AHEAD".
- Verified: node --check clean; preview harness — ease ramp (0.2→0.914 over 11 frames),
  reversal dust, graze +0.08 exactly once w/ no hp loss, hit → hitStop 0.08/zoom/combo
  reset, catch → combo 1 + hitStop 0.06, escaped catchable resets combo, draw clean.
Test steps: GA-a steer taps feel eased, sock leans/stretches, quick reversal kicks dust ·
GA-b skim just past a hot garment at the rim — orange sparks + static meter bumps, no damage ·
GA-c take a hit — brief freeze-frame + zoom punch + red flash · GA-d ready screen reads the
pair-chase hook; watch the vortex — the little warm pair sock spirals inside it · GA-e no
icy garments appear; tap only rides the current when STATIC is full.

**Repo:** `github.com/michaelnocito/play-area` (PUBLIC monorepo, branch `main`) — Flipline lives in the `flipline/` subfolder · **Local:** `C:\Users\Mike\Projects\GAMES\play-area\flipline`
**HEAD at handoff:** `0c70ed3` (2026-07-02) · **Deliverable:** one file `index.html` per platform (vanilla JS + Canvas, no build, no deps, 480×270 logical space). Master `index.html` = CrazyGames build; per-platform derivatives under `builds/` (see `builds/README.md`).
**Read first:** this file + **`FLIPLINE_ROADMAP.md`** (the dev-owned backlog — CrazyGames-grade rework, 🧦 ODD SOCK identity pivot 2026-07-02) + memory `project_flipline_state.md` (full per-feature + submission history). Also `FLIPLINE_HANDOFF.md`, `FLIPLINE_lore_bible.md` (⚠️ pre-sock lore — superseded by ROADMAP's Odd Sock section), `FLIPLINE_store_copy.md` (⚠️ rewrite gated on final name, Batch D).

## 🧪 DRUM PROTOTYPE — "INSIDE THE DRYER" Level 1 (2026-07-11) — ⏳ FEEL-GATE, Mike playtests
🔷 Mike's call: the dryer should BE a cylinder — 3rd-person, looking into the drum, dodging
around the circumference; static cling = leap power; the built flip-runner becomes a LATER
level; run starts in the dryer heading to the LOST SOCK VORTEX.
Built `proto/drum.html` (self-contained, does NOT touch the live build):
- Camera looks into the drum: rim at RIM=112px, obstacles born at the vortex (z=0.06) and
  approach the camera (r = RIM·z^1.8); red heat ARCS (solo / offset double / ring-with-gap /
  spiral triplet). Drum itself tumbles at 0.22 rad/s (obstacles + wall texture ride it).
- Controls: ←→/AD steer (3.0 rad/s — full π sweep ~1.05s, the fairness anchor; every ring gap
  ≥0.55 rad), SPACE/tap = LEAP when STATIC is full. Touch: hold left/right half steers; quick
  tap (<170ms, no drag) leaps.
- STATIC CLING: charges at 0.5/s WHILE STEERING (slide on fabric = friction = static — charge
  by playing), full bar = one 0.6s invulnerable leap w/ shadow + landing puff + spark crawl.
- Goal: 400m to THE LOST SOCK VORTEX (progress bar top HUD); vortex glow grows w/ progress;
  win screen teases "Level 2: UNDER THE FLOOR". Death = SINGED! instant retry.
- Research first (per practice): Tunnel Rush-style 360° tube dodgers are CrazyGames staples;
  Tempest (rim-rider archetype) + Super Hexagon (readability: rotation helps you see gaps
  coming; patterns must be escapable at max steer speed) ground the fairness rules.
- Verified: node --check clean, booted, bot-driven runs + screenshots (`_shots/drum_*.png`) —
  steering, charging, leap, death/retry all exercised. Crude bot dies 90–320m (it only reacts
  0.3 rad out — humans read whole rings ahead); PROPER drum bot-sim harness required before
  this is promoted into the main build.
**✅ 2026-07-11 (later): direction APPROVED by Mike ("this is great, and the new direction") +
collectibles added (research-first: guaranteed-cadence trails > scattered singles; never
co-located with hazards; magnet = the classic):**
- **BUTTONS = currency** (matches the main game): guaranteed 4-button sweeping trail every
  4.5s (sweep rewards a slide → which charges STATIC — one loop), placed via `colClear()`
  angular-clearance check vs co-arriving heat arcs; occasional ×3 risk single tucked beside an
  arc's edge. Banked to `localStorage flipline.drum.proto` on death AND win (main-save
  integration when promoted).
- **BUFF ORBS** every 8s (5s first), cycling SHIELD → MAGNET → BOLT in the main game's colour
  language: SHIELD (gold, absorbs one hit + 0.8s grace, ring visual), MAGNET (cyan, 7s,
  buttons within ±1.3 rad glide in, rim field arc), STATIC BOLT (drum-specific: leap meter
  instantly full).
- HUD: ● counter + "+N ●" pop top-left, MAGNET timer / SHIELD labels; SINGED!/vortex screens
  show the run's haul + banked total.
- LEVEL_LEN 400→600m (~35s — 400 played in ~20s, too thin for the orb cycle); orb cadence
  11→8s. Freeze-on-start bug fixed earlier (`d717410`: negative inner-lip arc radius threw and
  killed the rAF loop).
- Verified: bot session across 20+ runs — buttons accumulate + persist, all 3 orb kinds spawn,
  shield absorb + grace works, magnet pull works, win at 600m (`_shots/drum_buttons/magnet/win.png`).
**✅ Controls fix (`15f4f04`):** steering was angle-based, so "right" moved the sock LEFT at the
bottom of the drum (Mike caught it). Default is now **SCREEN** (right = sock moves right at the
bottom); ready-screen toggle "CONTROLS: SCREEN/WHEEL" for players who think in drum-rotation
terms; choice persisted in the proto save. Both directions + persistence verified.
**✅ 2026-07-11 (later still) — HEALTH + STAGES + CLOTH BARRIERS (🔷 Mike):**
- **3-hit condition system (not hearts):** hp 3 → each hit frays the sock visibly (dmg 1:
  notches + scorch; dmg 2: threadbare holes + hanging threads + worried stitch-mouth), 1s
  grace flicker; 3rd hit = DISINTEGRATE into cloth-scrap + thread particles (sock hidden),
  death screen "UNRAVELLED". HUD = 3 stitched-patch pips (mint), not hearts.
- **Health economy:** PATCH pickup (mint square w/ stitch border, MEND glow) spawns every
  ~12s ONLY while hurt; heals +1. **Stages:** vortex reach = STAGE CLEAR (not run end) —
  hp + buttons carry over, each stage +8% base tumble speed; between-stage screen = haul,
  condition pips, **MEND +1 for ● 25** buy button. Death → back to stage 1. Buttons now have
  a real in-proto sink.
- **Barriers ARE clothes now** (v2 after Mike's "not seeing the barriers as cloths"): first
  pass stamped tiny same-red garments ON a thick band → read as texture. Rework: garments
  ARE the barrier — bold outlined silhouettes (t-shirt w/ collar+sleeves, pants w/ waistband
  +creases, waving towel w/ stripes; dark #7d0f1f outline, bright #ff4a63 body, white-hot
  hems), sized ~3.6× band thickness, 1–5 filling the arc by arc-length; band reduced to a
  thin hot wire behind them. Plus 3 muted background garments tumbling mid-drum (never red,
  no collision) for life/depth.
- Verified in preview: dmg-state visuals, disintegration death, stage-clear → mend (25
  buttons, hp+1) → stage 2 faster w/ hp carried, patch spawns only when hurt, laundry+stage
  screenshots (`_shots/hp_*.png`). node --check clean.
**✅ 2026-07-11 — GAPS + STATIC RIDE (🔷 Mike: "remove red lines, dodge between cloths,
ride the center"):**
- Barriers are now INDIVIDUAL garments (GHW=0.24 rad each, hitbox 0.8× visual) with real
  threadable gaps — connecting wire deleted. Patterns: solo / pair (0.5rad gap) / wall-of-3 /
  ring-of-5 (~0.78rad gaps) / spiral triplet.
- **Critical fairness fix found by test:** garments ride the tumbling drum (+0.22rad/s) but
  the sock didn't → a gap you parked in drifted onto you. Static cling means the drum CARRIES
  the sock — player angle now drifts with DRUMSPIN too, so relative positions are stable.
  Threading test: park-in-gap survives ✓, direct hit registers ✓.
- **STATIC RIDE replaces the leap:** full charge → tap = ride the centre current ~1.6s
  (untouchable, +25% speed, crackling tether visual, sock orbits small at the vortex).
  Balance: ~3-5s of real sliding to charge vs ~1.6s safety + ~0.4s distance gained — costs
  more than it saves; no charging and NO rim loot pickup while riding; 0.5s grace on landing.
**✅ 2026-07-11 — CATCH & FLING (🔷 Mike picked it from the 5 researched uniqueness options):**
the hook mechanic — every incoming garment is now a decision, not just a dodge.
- ~1 in 3 waves carries a COOL garment (icy blue palette + glow + pulsing "CATCH!" cue from
  z 0.55). Harmless if ignored — a lost prize, never a punishment.
- TAP while it's at the rim (z 0.86–1.08, arc GHW+0.24) → snatched + flung spiralling into
  the vortex: **+5 buttons +0.25 static** (rubbing cloth = charge) + vortex burst on arrival.
- Input priority: catch > ride (a landing catchable eats the tap; empty tap still rides).
  Laundry-color variety also landed this day (`a395764`): 4 hot palettes × 3 kinds, muted
  denim/olive/grey for bg clothes.
- Risk = positioning: cool pieces land amid hot patterns, chasing them drags you toward
  danger (graze-style risk-reward per the research; parry precedent).
- Verified: catch-priority/payout/harmless/ride-fallback all pass; cue + fling screenshots
  (`_shots/catch_*.png`).
**NEXT: Mike feel-tests the catch loop (window tightness, +5/+0.25 payout). Runner-up ideas
parked in chat/roadmap: SPIN-THE-DRUM control inversion (boldest), static polarity push,
wet/dry rim terrain, thread pendulum. Then promote into main build as campaign Level 1
(Batch C): drum bot-sim harness, main-save integration, per-land drum variants.**
Test steps: D-a boot to ready screen · D-b steer both ways around the full rim · D-c slide to
fill STATIC then tap/space — leap clears an arc at the rim · D-d die on purpose (SINGED! →
tap retries) · D-e reach 400m — vortex win screen · D-f touch: hold halves steers, quick tap
leaps (on phone).

## ✅ BATCH B2 — Pacing & THEME LOCK (2026-07-11) — DONE, Mike playtests next
Mike's playtest call: "huge gaps in action, feels bland" + "background must represent the sock
theme." Root cause found: RAMP 0.15 was tuned for the CUT two-line design → top speed needed
1,267m, past the average player's whole run. Landed in master `index.html`:
- **🔷 THEME LOCKED — THE JOURNEY HOME:** run starts INSIDE THE DRYER, escapes UNDER THE FLOOR,
  crosses THE GARDEN WALL, climbs to THE ATTIC (cycles; Batch C makes lands discrete). One land
  index drives palette + ridge + backdrop set-piece + wall texture: drum porthole/lifters +
  perforated walls · pipes/cobweb + floorboards · clothesline w/ hung laundry + bricks ·
  moonbeam/bulb + beam hatch. `LANDNAME` banner at run start + each crossing; tally says
  "in THE <LAND>" (death identity). Set-pieces baked pre-colored in each land's accent
  (BGDECO[4], no per-frame tint); wall strips dark-on-transparent (WALLTEX[4]); ZONES/ACCENTS
  now 4 per-land palettes aligned to the same index (old 5-entry cool→warm cycle replaced).
- **Pacing (B2):** RAMP 0.15→0.30 (🔷 Mike approved restore; top speed ~630m); COL_FROM 60→20;
  WEAVE_MAX 175→80; lure gap 30–54→18–34m; solos-only 100→50m; formation difficulty window
  100–420→60–360m w/ all onsets ~40% sooner; dip lures 110→70m.
- **TUMBLE surges:** SURGE_FROM 90, every 110–160m: 4s burst (spacing ×0.72 **clamped ≥GAPMIN**,
  lures every 10m, "TUMBLE!" banner, shake, music bass filter forced open) → 3s relief
  (spacing ×1.45, pickFormation forced solo). Spacing floor = the fairness lock, unchanged.
- **Sim re-run (1,500 runs):** earlyDeath 0% all tiers, clean separation, medians
  250/321/475/702/872m — shorter runs by design (avg player now EXPERIENCES the fast band;
  ~2min sessions, portal-typical). Reaction budget math unchanged (GAPMIN/SPEEDMX locked).
- Verified in preview: all 4 land backdrops + wall textures + banners + surge shot
  (`_shots/b2_*.png`), node --check clean.
**NEXT: Mike playtests feel (pace + theme), then Batch C — discrete lands campaign designed
AROUND the journey-home theme (each land = a crafted room ending "SOCK SAFE").**

## ✅ BATCH B — Score & tally (2026-07-11) — DONE
Every action now has visible value; the tally is the retention beat. In master `index.html`:
- **Values:** `PTS_M=10/m · PTS_BTN=25×val · PTS_ORB=150 · PTS_LAND=250`; `score()=dist*10+bPts`
  (bPts banks event bonuses; ptsB/orbsN tracked for the tally; zonesRun reused for lands).
- **Best migration:** old best was metres → scaled ×10 once on load, `bestV:2` flag in the save
  marks migrated (persist always writes it). Coin economy UNCHANGED: `lastEarned=(dist/14)+bonus`
  stays distance-based so points don't inflate currency.
- **HUD:** points top-centre (bold), metres small at VW/2+72, buttons counter left as before.
- **Popups:** "+250 NEW LAND" (mint) on zone cross, "+150 <BUFF>" (buff colour) on orb grab —
  single popup slot (popT/popTxt/popCol), rises under the HUD.
- **Tally (dead screen rewritten):** CRASHED → 4 line items (DISTANCE Nm / BUTTONS / ORBS ×n /
  LANDS ×n) reveal one per 0.45s with a Snd.point() tick, values count up over ~0.35s, rule line,
  TOTAL counts up, then NEW BEST stinger (Snd.flow) or "best N"; retry pill / ad-double /
  SHOP / next-unlock only draw once `tallyDone` (taps gated the same way — no stale-rect taps).
  Tap during the count-up skips to the final numbers. Ticker runs in update() (dt side), not draw.
- **Verified:** node --check clean; preview bot run → mid-run HUD + popup shot, tally mid/done
  shots (`_shots/batchB_*.png`); line items sum exactly to TOTAL (1700+375+150+750=2975 on the
  test run); NEW BEST path exercised. Physics/spawning untouched → no sim re-run needed
  (2× buff still doubles worldX, so "2× SCORE" label stays true).
**NEXT: Mike playtests feel, then Batch C (discrete lands campaign).**

## ✅ BATCH A — ODD SOCK visual identity (2026-07-10) — DONE, Mike playtests next
The rejection lever, landed in master `index.html` only (portal builds regenerate in Batch D per
the one-build-everywhere rule). What shipped:
- **Sock hero sprite system:** `sockOutline`/`mkSock` bake a white sock mask + 6 pattern socks +
  a warm pair-sock ONCE at boot; `sockSprite()` tints the mask live (Chroma / aura / shield glows)
  on a shared 128² buffer — 3 ops, alloc-free; `blitSock()` draws. Googly eyes (glancing pupils),
  reactive mouth, cloth-flop rotation w/ vy, speed stretch, vertical mirror on ceiling. `shapePath`
  deleted. SHAPE shop axis = sock PATTERNS now (Stripes/Polka/Argyle/Heel Pop/Holiday/Toe Hole) —
  same costs/indexes, saves compatible.
- **Obstacle reskin:** style 0 HEAT COIL (drifting element rings), style 1 LINT CLUMP (hot
  half-band, mottle tufts, scalloped free edge carved INWARD → visual ⊆ hitbox, fair). Hitboxes,
  formations, physics UNTOUCHED.
- **World art per land:** RIDGE → RIDGES[4] themed masks (dryer duct / under-floor / garden wall /
  attic), picked by `(dist/ZONELEN)%4`, tinted on the unchanged RIDGEBUF pipeline.
- **Buttons:** coin draw = 4-hole stitched button; currency glyph ◆→● everywhere (rarity ◆ kept).
- **Pair-sock beacon:** SOCKGOLD sprite inside the horizon glow.
- **Juice:** landing flump dust (`flump()`), static-cling sparks >305 px/s.
- **Audio flavor:** flip = soft directional cloth "flump" (triangle+noise), dryer-rumble loop
  under the music bed (one-time nodes through Music.gain — mute/duck still cover it).
- **Fix in passing:** ready-screen buff description overlapped the watch-ad pill → folded into
  the START BOOST header line (BDESC line removed).
- **Verified:** `node --check` clean; booted + bot-driven to 230m in preview (screenshots in
  `_shots/batchA_*.png`); 1,500-run sim re-run at HEAD → medians 390/553/897/1271/1408m,
  0% early deaths — statistically identical to the pre-rework baseline. Name stays FLIPLINE
  until Mike's Batch D call (tagline now "a lost sock, tumbling home — tap to flip").
**NEXT: Mike eyeballs the sock/lands live, then Batch B (score & tally).**

## 🧭 NORTH STAR CHANGE (2026-07-02, Mike's call)
No more speed-to-portals. **ONE quality bar (CrazyGames-grade), ONE build everywhere.** Full audit
(guideline-grounded + 1,500-run bot-verified) + batch plan live in `FLIPLINE_ROADMAP.md`. Identity rework:
**ODD SOCK** — googly-eyed runaway sock journeying home to its pair through the house-world;
danger stays red; shop becomes sock patterns; name final call after graphics (ODD SOCK / SOCK HOP /
TUMBLE). Fairness/perf/audio/UX/monetization pillars measured AT standard; gaps = visual identity
(the rejection cause), content depth ("needs content"), score visibility, in-gameplay teach.

## 📦 PLATFORM SUBMISSION STATUS (2026-07-02)
- **CrazyGames** — ❌ REJECTED (subjective "overall quality does not meet platform expectations"; not a bug — genre saturation + minimal visuals). Parked. Master `index.html` is this build.
- **GameMonetize** — ✅ SUBMITTED, IN REVIEW. `builds/gamemonetize/` (gameId `i9wbwtje123k5itbsv3io3hz7yc7x85v`), SDK verified + sent to activation. Currently the only platform in play that pays revenue (ad-impression share). Nothing pending — check back on approval status next session.
- **GameDistribution** — ✅ SUBMITTED, IN REVIEW (2026-07-02). `builds/gamedistribution/` — gameId `e41d1c7182f84a3587f8b81d351d9a07` wired in, SDK adapter verified (`gdsdk.showAd()` / `showAd('rewarded')` + `SDK_GAME_PAUSE`/`START`/`REWARDED_WATCH_COMPLETE`), dashboard checklist completed (details/assets/upload/SDK-test/rewarded-ads all checked — SDK-test checkbox needed a page refresh after watching the ad to register), version `1.0.0` + changelog submitted, activation requested. Nothing pending on Mike's side; awaiting GameDistribution approval (historically ~3 weeks). Payout: $50 accrual threshold, paid monthly once crossed.
- **itch.io** — ✅ **LIVE** at `mnocito.itch.io/flipline` (2026-07-02). Free / "No payments" — itch has no ad SDK, this listing earns $0 unless donations are enabled later. Value here is a stable no-review portfolio link, not revenue.
- **GameJolt** — 🔧 BUILT (2026-07-02), awaiting Mike's upload. `builds/gamejolt/` = identical to the itch build (no ad-SDK exists on GameJolt; revenue = platform-level sticker/charge system, creators keep up to 50% on sales). Zip ready: `builds/flipline-gamejolt.zip`. Upload: gamejolt.com → Add Game → browser/HTML build → zip (index.html at root) → 960×540 embed → covers from `covers/` → publish. Open checklist, no review gate.

## 🌐 PORTAL LANDSCAPE RESEARCH (2026-07-02, 4 research passes, cited)
Priority queue after GameJolt: **Y8** (open, 50% rev share via own-AdSense or manual, light SDK: script tag + `nextAds()`/`showReward()`) → **GameFlare** (open checklist, 50/35/15 partner-site or 85/15 own-site split, €50 min monthly payout — ⚠️ %s came from search cache, their dev page 403s bots; eyeball distribution.gameflare.com/developers before building) → **GamePix** (45% share, semi-curated QA gate, SDK docs thin publicly — pull full API ref from dashboard `gpxprj.blob.core.windows.net/api/index.html` before building) → **Newgrounds** (open, no ad-SDK needed, but revenue mechanism/rate unconfirmed officially — portfolio-tier until verified). **Skip:** Kongregate (BD-pitch gated + heavy custom SDK), Yandex Games (rev % undisclosed + Yandex Bank under EU sanctions ban since 2025-07 — payout-rail risk), Miniclip (browser portal dead since 2022-07, mobile-only now), Agame/Kizi (Azerion network, no indie self-submit), Facebook Instant Games (sunset/forced migration Sept 2026), CoolMathGames (puzzle-genre only + no-ads policy, wrong fit), Silvergames (email-only submission, revenue undisclosed — low priority). **Playgama Bridge** noted: one-SDK-to-many-portals abstraction layer (~80% retention claimed) — maybe worth it if chasing many portals later, adds a dependency, not a first move.

## ✅ Task A + B — DONE (2026-07-02)
Canvas-scope tap fix folded into master + itch builds (`0c70ed3`), verified in preview (canvas tap flips, non-canvas click doesn't, mute/fx unaffected), `node --check` clean. itch.io project created and published: cover (`covers/flipline_cover_1920x1080.png`) + 3 in-game screenshots (`_shots/screen_ready.png`, `screen_play.png`, `screen_shop.png` — pulled live via `canvas.toDataURL()` through preview_eval since no ffmpeg is installed to extract frames from the existing `.webm` clips) + embed 960×540/Fullscreen/Mobile-friendly + No payments + Public.

## ⏳ NEXT: monetization-platform roadmap
GameDistribution build is done and waiting on a real gameId + submission (see status above — that's the very next step). Researched (2026-07-02) before building: GameDistribution has the best-documented SDK and concrete payout terms of the untried options, so it went first; GamePix's SDK specifics were too thin in public docs to build blind (would need dashboard access first). Remaining portals worth trying next, roughly in priority order:
1. **GamePix** — 45% rev share, ad-revenue portal, lower bar than CrazyGames historically; SDK integration TBD — pull the full API ref from the dashboard (`gpxprj.blob.core.windows.net/api/index.html`) before building, don't guess at method names again.
2. **Newgrounds** — smaller audience, low friction, has its own ad/monetization program (Newgrounds Wallet + ad revenue share) — good low-effort parallel submission.
3. **GameJolt** — similar profile to itch (community-first, optional monetization via GJ's own systems) — traction-focused more than revenue, but easy to add.
- Explicitly **skip** Poki/Famobi — same curated-quality-bar rejection risk as CrazyGames, not worth the resubmission cycle without a real visual-identity upgrade.
- **Gameplay trailer for itch/others (parked, low priority):** `.webm` clips exist (`_shots/desktop.webm`, `_shots/mobile.webm`) from the CrazyGames submission but itch wants a hosted YouTube/Vimeo link, not a file — upload to YouTube first if this becomes worth doing.

## Conventions (unchanged)
Solo authorship — commit as `Michael Nocito <hello.michaelnocito@gmail.com>`, NO Co-Authored-By/AI trailer. Outside OneDrive. Commit + push after every change. `builds/*.zip`, `_shots/`, `.claude/` gitignored.

## 🚀 SHIP DECISION (2026-07-01): downline-only v1
Reviewed the redesign: DOWNLINE (flip-runner + formations + buffs + revive + shop + audio + zones + CrazyGames ad hooks) is feature-complete and submission-ready. UPLINE (glide platformer) was only ever a feel-locked skeleton — floating ledges + coins, **zero obstacles/enemies/challenge**, no vault mechanic, no bloom-regrow layer, never playtested. Rather than gate launch on finishing an unproven mechanic, **shipped downline-only**: `SEG_SEQ=[0]` permanently, segment-switch code guarded off (`SEG_SEQ.length>1`), dev level-picker UI/code fully removed (`devRow`, `R_DEV`, `devSeg`, `DEV*` consts — was showing to real players on ready/dead screens, not just dev). Upline code (glide physics, `spawnPlatform`, palettes) left in place, unreachable — parked as a **post-launch content update**, to be redesigned with actual danger/vault/bloom before it ships. Verified: syntax clean, ran a full sim (start→crash→revive-offer) staying in segType 0 the whole time, ready-screen screenshot confirms no dev UI leaks to players.

## What it is NOW (v1, shipping)
**Downline flip-runner**, endless. Gravity-flip; thread red obstacles in pooled formations (solo/double/zig-zag/staircase/pinch/gauntlet); buffs (magnet/shield/2×); 3-tier revive w/ CrazyGames-compliant ad policy; cosmetics shop; procedural audio; cool→warm zone lore; home-beacon. One-button, scrupulously fair, skill-rewarding.

## 🔒 Two sacred pillars — DO NOT BREAK
1. **Perf contract:** zero per-frame allocation (fixed pools), zero per-frame DOM writes (all UI on canvas), **NO** shadowBlur / gradients / canvas filters / per-frame clip (glow = oversized translucent fill; gradients baked once to offscreen then blitted), dt capped, single `requestAnimationFrame`. *(Audio scheduling is exempt — it runs on the audio thread, not the render loop.)*
2. **Locked flip feel (DOWNLINE only):** never retune `GRAV 4200` / `FLIPKICK 240` / `SPEED0 170` / `GAP0 200→GAPMIN 120` / the inset **`PS-4`** hitbox. **Danger is always red.** ⚠️ `RAMP 0.35` was overridden to 0.15 as part of the REDESIGN (per Mike: "really drop the speed increase") — the two-line journey is slower.

## How to run & verify (important — the harness is fiddly here)
- It's one self-contained file. Simplest: **double-click `index.html`** (file://) — SDK loads from CDN, no-ops gracefully offline.
- **The Claude-Preview server often fails to bind this session.** Reliable method: start your OWN server in the project dir via Bash background — `python -m http.server 8777` — then point the preview browser at `http://localhost:8777/index.html` via `preview_eval`.
- **Preview tab runs hidden** → `requestAnimationFrame` is throttled (loop frozen) and `innerWidth/innerHeight` read **0**. To verify LOGIC: drive globals + call `update(dt)` / `draw()` directly via `preview_eval` (top-level `let`s are reachable by bare name; function decls are on `window`).
- **Stuck audio in preview:** browser AudioContext stays alive when preview tab is hidden. Close and reopen the preview tab to clear it — game code is fine.
- **Syntax check:** extract the `<script>…</script>` block and `node --check` it (catches edit typos fast).
- **Visual/audio FEEL is Mike's call** — verify logic, hand him labelled test steps, let him eyeball/ear the live build.

## 🔄 REDESIGN — "Light-bringer" two-line campaign (`e10fc83`)
**Lore:** light-bringer travels the line. **DOWNLINE** (mid, segType 0) is INFECTED — dodge/cure it. **UPLINE** (upper, segType 1) is where you SPREAD LIGHT — vault over objects that regrow. **Flipping the line is the core verb**; curing happens on flip-up. Cool→warm home-beacon = the ending (reach home, world healed).

**DONE (HEAD e10fc83):**
- Mine removed (`SEG_SEQ=[1,0]`, mine code parked/unreachable). Two-line flow: downline ⇄ upline.
- **UPLINE platformer + GLIDE mechanic (FEEL LOCKED):** floating light ledges (`spawnPlatform`, heights [34,52,68]), one-way landing via `onGround`, no double-glide. **Glide physics (tuned):** 1st tap = launch (GLIDE_LIFT 375, apex ~85px) into gentle float (GLIDE_GRAV 825, GLIDE_VMAX 300); 2nd tap = cancel → full-gravity drop for precise platform landing. **No bounce on landing**. Light-coins on ledge tops. Forgiving floor. NO enemies (feel-first).
- Speed ramp dropped `RAMP 0.35→0.15` (overrides locked-feel; per Mike: "really drop the speed increase").
- Slower transitions: XFADE 1.5s + 25% speed-drop ease-in over 3s (acclimT).
- Dev top-row = 2 pills DOWNLINE/UPLINE (ready+dead).

**NEXT (design LOCKED, ready to build):**
- **UPLINE:** layer pillar-of-light VAULT (bigger launch + Angry-Birds glide) + regrowing BLOOM objects over existing platforms.
- **DOWNLINE:** stays flip-and-dodge (no shooting; simpler one-button identity).
- **Campaign:** discrete levels (Level 1, 2…), each a crafted stretch ending in "region healed"; save + unlock + level-complete ad via `SDK.data`; endless kept as replay mode. Bracket all transitions with `gameplayStop`→`gameplayStart`.

**CrazyGames (verified, citation-backed):** `SDK.data.setItem/getItem/removeItem` (sync, ≤1MB, debounced 1–30s, synced logged-in / localStorage guests / auto-migrate). Level-based accepted (genre locked post-submit). Midgame=level-complete, **max 1/3min, no chaining**, SDK throttles. Bracket transitions w/ gameplayStop→Start. ≤50MB, ≤20s, landscape.

## (superseded) THREE LEVELS — multi-level segments (`edb0c33`)
- **What:** `segType` 0 **tunnel/mid** (flip, the OG game) · 1 **upper/sky** (jump) · 2 **lower/mine** (jump+stomp). Every `SEG_LEN=250`m the world switches along **`SEG_SEQ=[1,0,2,0]`** → mid→upper→mid→lower→repeat (mid = home base). State: `segType prevSegType nextSeg xfade segStep`.
- **Control:** one button always. Tunnel → flip; sky+mine → **FIXED-ARC jump** (`skyJump()`, grounded-only, no double-jump).
- **SKY:** red floor-juts you hop (`spawnSky`); soft OUTDOOR palette `UPPER_ZONES/ACC` (replaced the harsh invert — Mike found it too bright).
- **MINE:** `spawnMine` = 50/50 **stompable enemy** (`o.k===1`, crawl `ENEMY_VX`, defeat by top-stomp → coins + `STOMP_BOUNCE`; side/below contact KILLS) or **red spike** (`o.k===0`, jump-only). Enemies are RED (pillar). Earthy `LOWER_ZONES/ACC`. `drawCritter`/`drawSpike`.
- **Fair by math:** jump apex 90 > spike 44; sky reach 182 < `SKY_GAPMIN=190`; mine reach+closing 190 < `MINE_GAPMIN=205` → always clear + land in gap.
- **Transition:** boundary clears field (non-lethal) + `XFADE=1.1`s palette blend (per-level `palZ/palA`, prev→new) + banner. Reuses Snd.warp().
- **Reuse:** obstacle/coin pools (added `o.k`), collision, trail, light, buffs, revive shared — zero new per-frame alloc; **locked flip constants untouched** (each mode has its own const block).
- **DEV menu:** main-menu row `▬ TUNNEL / ▲ ABOVE / ▼ MINE` (`R_DEV[]`, `devSeg`) launches straight into a level for testing.
- **Deferred (v1.1):** skill-gated "flip/jump into the portal" entry (currently auto at distance, non-lethal); per-level music; richer enemy variety/chase; rename banners. Mike playtests feel next.

## Systems map (current code — `ca7c0ba`)
- **Score:** `score() = dist` (pure distance in metres). No bonus multiplier, no flow state.
- **Buffs** `BT[0/1/2]` (independent timers, stack): **0 = MAGNET** (coins within `MAG_R=150` glide to player), **1 = SHIELD** (smash through red), **2 = 2×** (worldX/score ×2). Pre-run pick-1 chip + "watch ad → all 3" + daily-gift. Orbs (kind 1/2/3 → BT[k-1]) earned mid-run; onboarding free shield.
- **Revive** (CrazyGames-compliant): death #1 → **free** revive (3s "GET READY", field cleared, GRACE shield); death #2 → `offer` mode (CONTINUE? one rewarded ad → revive + all buffs); death #3 / decline → `finalDeath()` (banks score, fires the queued midgame interstitial — the ONLY place it fires). Audio ducks during ads. Policy: no ad-chaining, ad-revive offered once/run.
- **Warp tubes — PARKED.** Spawn line commented out. Entity pool / draw / `Snd.warp()` kept for reuse. Safe to delete if confirmed dead.
- **Zones/lore:** `ZONES`/`ACCENTS` cool→warm "lands" (ZONELEN 55m); per-land ridge tint, zone-crossing sweep, home-beacon that grows with `best` + steps closer each land crossed this run; player-centred emotional light (`lightR`, cached `LIGHTSPR`/`DARK` buffer, never shadowBlur).
- **Cosmetics:** SHAPE / TRAIL / AURA tabbed shop with live try-on; reactive items = ◆ rarity badge; dead-screen next-unlock bar. Coins = currency.
- **Obstacles:** tech-panel banded silhouettes + dual energy seam + depth grid + 2nd parallax layer. Pooled formation sequencer (`pickFormation`) with difficulty scalar + per-formation onset ramps.

## ⚠️ What was tried and pulled this session
- **Skim / HOMEWARD / Flow State** — spent multiple sessions trying to make a "fly close to obstacles = bonus" mechanic work. The physics of gravity-flip play send the player to the safe wall (max clearance), so any fraction-of-lane gate either never fired or fired on everything. Fully removed at `ca7c0ba`. **Do not re-attempt this exact mechanic.** Mike has a new feature idea for the next chat.

## Audio architecture (procedural — zero load latency)
- `Snd` = SFX: persistent oscillator voices → gain → shared lowpass → master. SFX pitched to **`PENT`** (A-minor pentatonic). Flip is **directional** (`Snd.flip(up)`). Coin = high-pent sparkle. `Snd.muted` + `Snd.adMuted` (duck during ads).
- `Music` = dark A-minor "Matrix techno" bed on `setInterval(25ms)` lookahead scheduler (OFF the render loop). `Music.BPM=126`. `Music.flow` flag exists in code but does nothing now (flow removed) — safe to clean up if touching Music.

## Shipped commits (newest first)
`ca7c0ba` remove skim/HOMEWARD system entirely · `e3c6314` (skim gate 75% — pulled) · `a09f240` (every-dodge NICE — pulled) · `33dd875` (SKIM_FRAC 0.50 calibration — pulled) · `7cb7f3a` Flow State (Homeward) · `2837343` desktop window-fill fix + parked warps · `9a85064` obstacle tech-panel visual pass · `c1d5c5b` directional flip / scale-walk skims / portal breakout audio · `b198591` Magnet replaces Slow-mo · `6a5241c` procedural techno bed + richer SFX · `7771541` precision ad-revive · `c8212ae`+`39bf5df` A8 cover art + generator.

## Open items / next
- **Launch gate:** see top of file — everything code-side done, remaining steps are Mike's (CrazyGames portal).
- **Warp code** — confirm dead and delete, or revive for a future feature.
- **v1.1 backlog:** finish upline (vault + bloom-regrow + actual danger, currently just a skeleton) as a post-launch content update, leaderboards, music variety, more cosmetics.

## 🪙 Store & currency review (2026-07-01)
Functionally tested live (purchase gate blocks unaffordable items, allows once affordable, re-equip doesn't double-charge, persists to localStorage, `nextUnlock()` carrot picks the correct cheapest item) — **no bugs found.**

**Model:** cosmetic-only, 100% earnable free, zero pay-to-win — correct for CrazyGames policy. No real-money IAP wired (by design — CrazyGames titles monetize via ad impressions, not purchases; "encourages spending" here means encourages *ad-economy engagement*, which the game already does via watch-ad-to-double-coins, watch-ad-to-start-with-all-3-buffs, and the daily first-run gift).

**Catalog:** 17 items across 3 categories (7 shapes, 4 trails, 6 auras), tiered 0/30/45/50/65/70/75/100/110/120/140/160/200 coins. **1,245 coins to own everything.** Earn rate is roughly 1 coin/14m of distance plus loose-coin pickups every 30-54m — a full run nets roughly 20-100+ coins depending on skill (matches sim survival distances). That works out to **~15-30 runs to 100% completion**, a healthy depth for a casual runner — not so shallow it's exhausted day one, not so deep it reads as a grind wall.

**Recommendations (not blockers, worth a v1.1 pass):**
1. Add 1-2 sub-30-cost items so a brand-new player's first purchase can land within their very first session — the psychological "first purchase" hook matters for retention and the cheapest item right now (30) is already reachable in ~1 decent run, but a ~15-cost item would guarantee it lands even for a rough first run.
2. No coin sink exists once a player owns everything — fine for launch, but plan more cosmetic drops (or a leaderboard entry cost, or prestige variants) so completionists don't go idle on the currency.

## Key tunables (top of `<script>`)
Movement/difficulty (**LOCKED**): `GRAV FLIPKICK SPEED0 SPEEDMX RAMP GAP0 GAPMIN HMIN/MAX WMIN/MAX PS`.
Tunable: `MAG_R` · `REVIVE_CD`/`GRACE` · `Music.BPM` + music submix gains · `WARP_*` (parked) · zone `ZONELEN/ZONES/ACCENTS`.

## Conventions
- **Solo authorship:** commit as `Michael Nocito <hello.michaelnocito@gmail.com>`, **NO Co-Authored-By / AI trailer.**
- Keep the project **outside OneDrive** (`C:\Users\Mike\Projects\GAMES\`).
- Mike pulls from git — commit + push after every change. Give labelled test steps (e.g. `F-a`, `F-b`) in plain language. Keep end-of-task replies short.
- `_shots/` and `.claude/launch.json` are gitignored; `covers/` IS committed.
