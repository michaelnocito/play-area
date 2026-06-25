# FLIPLINE — Dev Handoff / Resume Point

**Repo:** `github.com/michaelnocito/flipline` (PRIVATE, branch `main`) · **Local:** `C:\Users\Mike\Projects\GAMES\flipline`
**HEAD at handoff:** `a84facf` · **Deliverable:** one file `index.html` (~1030 lines, vanilla JS + Canvas, no build, no deps, authored in a 480×270 logical space).
**Read first:** `HANDOFF.md` (visual/level-design spec), `FLIPLINE_lore_bible.md` (wordless "Long Way Home" lore). Memory `project_flipline_state.md` auto-loads with full per-feature detail.

## What it is
One-button gravity-flip runner for **CrazyGames** (mobile, ad revenue). Tap/click/space flips gravity; player snaps floor↔ceiling; thread RED obstacles; score = distance. Identity: scrupulously fair, skill-rewarding, "doesn't juice every ad op."

## 🔒 Two sacred pillars — DO NOT BREAK
1. **Perf contract:** zero per-frame allocation (fixed pools), zero per-frame DOM writes (all UI on canvas), **NO** shadowBlur / gradients / canvas filters / per-frame clip (glow = oversized translucent fill; gradients baked once to offscreen then blitted), dt capped, single `requestAnimationFrame`. *(Audio scheduling is exempt — it runs on the audio thread, not the render loop.)*
2. **Locked feel — VISUAL changes only:** never retune `GRAV 4200` / `FLIPKICK 240` / `SPEED0 170` / `RAMP 0.35` / `GAP0 200→GAPMIN 120` / the inset **`PS-4`** hitbox. **Danger is always red.**

## How to run & verify (important — the harness is fiddly here)
- It's one self-contained file. Simplest: **double-click `index.html`** (file://) — SDK loads from CDN, no-ops gracefully offline.
- **The Claude-Preview server often fails to bind this session.** Reliable method: start your OWN server in the project dir via Bash background — `python -m http.server 8777` — then point the preview browser at `http://localhost:8777/index.html` via `preview_eval`.
- **Preview tab runs hidden** → `requestAnimationFrame` is throttled (loop frozen) and `innerWidth/innerHeight` read **0**. To verify LOGIC: drive globals + call `update(dt)` / `draw()` directly via `preview_eval` (top-level `let`s are reachable by bare name; function decls are on `window`).
- **Stuck audio in preview:** browser AudioContext stays alive when preview tab is hidden. Close and reopen the preview tab to clear it — game code is fine.
- **Syntax check:** extract the `<script>…</script>` block and `node --check` it (catches edit typos fast).
- **Visual/audio FEEL is Mike's call** — verify logic, hand him labelled test steps, let him eyeball/ear the live build.

## 🔄 REDESIGN IN PROGRESS — "Light-bringer" two-line journey (`a84facf`)
Pivoting from endless arcade → a lore-driven, level-based CAMPAIGN. **Lore:** a light-bringer travels the line. **DOWNLINE** (mid, segType 0) is INFECTED — dodge/cure it. **UPLINE** (upper, segType 1) is where you SPREAD LIGHT — vault over objects that then REGROW. **Flipping the line is the core skill**; curing happens when you flip up. Cool→warm home-beacon already implies the ending (reach home / world healed).
- **DONE this session:** lower MINE removed from rotation (`SEG_SEQ=[1,0]`, mine code parked/unreachable). UPLINE is now a **platformer** — floating light ledges (`spawnPlatform`, one-way landing via `onGround`, no double-jump), light-coins on ledge tops, forgiving floor, NO enemies yet (feel-first). Speed ramp dropped `RAMP 0.35→0.15` (⚠️ overrides locked-feel value, per Mike). Dev top-row = 2 pills DOWNLINE/UPLINE (works on ready+dead).
- **NEXT (design being locked w/ Mike):** campaign structure (discrete levels vs flow-to-finish); DOWNLINE one-button cure/"shoot" mechanic (recast of "enemies that need to be shot" — "top-down stick" phrase unclear, clarifying); UPLINE pillar-of-light VAULT + Angry-Birds GLIDE over regrowing objects; CrazyGames `data` module save + per-level `gameplayStart/Stop` + level-complete interstitial.
- **CrazyGames research (verified, citation-backed):** `SDK.data.setItem/getItem/removeItem/clear` (sync, ≤1MB, debounced ~1–30s, synced for logged-in/localStorage for guests; auto guest→account migration). Level-based games fully accepted (genre can't change post-submit). Midgame ad = level-complete slot, **max 1 / 3 min, no chaining**, SDK manages frequency. Must bracket every level/transition with `gameplayStop`→`gameplayStart`. ≤50MB, ≤20s to gameplay, landscape.

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
- **A8 submission assets (launch gate):** ✅ cover art done — `covers/flipline_cover_1920x1080.png`, `_800x1200.png`, `_icon_800x800.png` (regen via `covers/cover_gen.html`). ⏳ STILL NEEDS (Mike): **15–20s silent gameplay clip** (landscape, both desktop + mobile) + run **CrazyGames QA tool** against uploaded build → then **ship**.
- **Mike's new feature** — to be described at the start of next chat.
- **Warp code** — confirm dead and delete, or revive for the new feature.
- **v1.1 backlog:** leaderboards, music variety, new portal.

## Key tunables (top of `<script>`)
Movement/difficulty (**LOCKED**): `GRAV FLIPKICK SPEED0 SPEEDMX RAMP GAP0 GAPMIN HMIN/MAX WMIN/MAX PS`.
Tunable: `MAG_R` · `REVIVE_CD`/`GRACE` · `Music.BPM` + music submix gains · `WARP_*` (parked) · zone `ZONELEN/ZONES/ACCENTS`.

## Conventions
- **Solo authorship:** commit as `Michael Nocito <hello.michaelnocito@gmail.com>`, **NO Co-Authored-By / AI trailer.**
- Keep the project **outside OneDrive** (`C:\Users\Mike\Projects\GAMES\`).
- Mike pulls from git — commit + push after every change. Give labelled test steps (e.g. `F-a`, `F-b`) in plain language. Keep end-of-task replies short.
- `_shots/` and `.claude/launch.json` are gitignored; `covers/` IS committed.
