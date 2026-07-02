# FLIPLINE — Dev Handoff / Resume Point

**Repo:** `github.com/michaelnocito/play-area` (PUBLIC monorepo, branch `main`) — Flipline lives in the `flipline/` subfolder · **Local:** `C:\Users\Mike\Projects\GAMES\play-area\flipline`
**HEAD at handoff:** `a9222c8` (2026-07-01) · **Deliverable:** one file `index.html` per platform (vanilla JS + Canvas, no build, no deps, 480×270 logical space). Master `index.html` = CrazyGames build; per-platform derivatives under `builds/` (see `builds/README.md`).
**Read first:** this file + memory `project_flipline_state.md` (full per-feature + submission history). Also `HANDOFF.md`, `FLIPLINE_lore_bible.md`, `FLIPLINE_store_copy.md`.

## 📦 PLATFORM SUBMISSION STATUS (2026-07-01)
- **CrazyGames** — ❌ REJECTED (subjective "overall quality does not meet platform expectations"; not a bug — genre saturation + minimal visuals). Parked. Master `index.html` is this build.
- **GameMonetize** — ✅ SUBMITTED, IN REVIEW. `builds/gamemonetize/` (gameId `i9wbwtje123k5itbsv3io3hz7yc7x85v`), SDK verified + sent to activation. Nothing pending.
- **itch.io** — ⏳ build ready (`builds/flipline-itch.zip`), NOT yet uploaded. Instant/no-review when Mike uploads.

## ⏳ TWO REMAINING TASKS (this handoff)
**Task A — fold the canvas-scope tap fix into the master + itch builds (code, then commit/push).**
The tap-to-flip handler listens on `window` and flips on ANY click (only exempting mute/fx buttons), calling `preventDefault()`. Harmless on CrazyGames/itch (no overlay buttons) but wrong in principle; already fixed in the GameMonetize build (`a9222c8`). Propagate for consistency:
1. In master `index.html`, find the `addEventListener("pointerdown",e=>{ if(e.target.id==="mute"||e.target.id==="fx"||needRotate)return; ...` line and change the guard to `if(e.target!==cv||needRotate)return;` (only the canvas flips; `cv` is the canvas, defined earlier). Keep the rest of the handler identical.
2. Re-derive the itch build from the fixed master: `builds/itch/index.html` = master with the 2-line CrazyGames SDK `<script>` (the `<!-- ... -->` comment + `<script src="https://sdk.crazygames.com/...">`) removed from `<head>`. Nothing else differs.
3. Re-zip: `builds/flipline-itch.zip` (just `index.html` at root; `builds/*.zip` is gitignored).
4. Verify each build boots to `ready`, a canvas tap flips, a non-canvas element click does NOT flip, mute/fx still toggle (drive `update()`/click via preview_eval — preview tab may background-throttle rAF; set canvas dims directly if `innerWidth`=0). `node --check` the extracted `<script>`. Commit + push.

**Task B — Mike uploads the itch.io build (no code; hand him the steps).**
File: `builds/flipline-itch.zip`. itch.io → Create new project → Kind: HTML → upload zip → check "This file will be played in the browser" → embed **960×540** + **Fullscreen button** + **Mobile friendly** → cover = `covers/flipline_cover_1920x1080.png` → Pricing: No payments (or donations) → Public. No review; live instantly.

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
