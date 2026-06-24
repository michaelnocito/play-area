# FLIPLINE — Dev Handoff / Resume Point

**Repo:** `github.com/michaelnocito/flipline` (PRIVATE, branch `main`) · **Local:** `C:\Users\Mike\Projects\GAMES\flipline`
**HEAD at handoff:** `7cb7f3a` · **Deliverable:** one file `index.html` (~1030 lines, vanilla JS + Canvas, no build, no deps, authored in a 480×270 logical space).
**Read first:** `HANDOFF.md` (visual/level-design spec), `FLIPLINE_lore_bible.md` (wordless "Long Way Home" lore). Memory `project_flipline_state.md` auto-loads with full per-feature detail.

## What it is
One-button gravity-flip runner for **CrazyGames** (mobile, ad revenue). Tap/click/space flips gravity; player snaps floor↔ceiling; thread RED obstacles; score = distance. Identity: scrupulously fair, skill-rewarding, "doesn't juice every ad op."

## 🔒 Two sacred pillars — DO NOT BREAK
1. **Perf contract:** zero per-frame allocation (fixed pools), zero per-frame DOM writes (all UI on canvas), **NO** shadowBlur / gradients / canvas filters / per-frame clip (glow = oversized translucent fill; gradients baked once to offscreen then blitted), dt capped, single `requestAnimationFrame`. *(Audio scheduling is exempt — it runs on the audio thread, not the render loop.)*
2. **Locked feel — VISUAL changes only:** never retune `GRAV 4200` / `FLIPKICK 240` / `SPEED0 170` / `RAMP 0.35` / `GAP0 200→GAPMIN 120` / the inset **`PS-4`** hitbox / **Clean-Pass 14px**. **Danger is always red.** Buffs/Flow are sanctioned modifiers but must NOT alter the baseline curve or the hitbox.

## How to run & verify (important — the harness is fiddly here)
- It's one self-contained file. Simplest: **double-click `index.html`** (file://) — SDK loads from CDN, no-ops gracefully offline.
- **The Claude-Preview server often fails to bind this session.** Reliable method: start your OWN server in the project dir via Bash background — `python -m http.server 8777` — then point the preview browser at `http://localhost:8777/index.html` via `preview_eval`. (curl from the host CAN'T reach the 4210 preview proxy — it's browser-internal; curl your own 8777 to confirm it's up.)
- **Preview tab runs hidden** → `requestAnimationFrame` is throttled (loop frozen) and `innerWidth/innerHeight` read **0** (so you can't measure pixel fill or screenshot reliably). To verify LOGIC: drive globals + call `update(dt)` / `draw()` directly via `preview_eval` (top-level `let`s are reachable by bare name; function decls are on `window`).
- To test the **offline ad-grant** path, set `window.CrazyGames=undefined` first (the real SDK loads from CDN in preview → `Ads.rewarded` goes async otherwise).
- **Syntax check:** extract the `<script>…</script>` block and `node --check` it (catches edit typos fast).
- **Visual/audio FEEL is Mike's call** — you can't reliably see/hear it here. Verify logic, hand Mike labelled test steps, let him eyeball/ear the live build.

## Systems map (current code)
- **Buffs** `BT[0/1/2]` (independent timers, stack): **0 = MAGNET** (coins within `MAG_R=150` glide to player, coins only), **1 = SHIELD** (smash through red), **2 = 2×** (worldX/score ×2). Pre-run pick-1 chip + "watch ad → all 3" + daily-gift. Orbs (kind 1/2/3 → BT[k-1]) earned mid-run; onboarding free shield. (Slow-mo was removed — it was useless early + snapped back.)
- **Revive** (CrazyGames-compliant): death #1 → **free** revive (`beginRevive(false)`, 3s "GET READY", field cleared, `GRACE` shield) ; death #2 → `offer` mode (CONTINUE? one rewarded ad → revive + all buffs) ; death #3 / decline → `finalDeath()` (banks score, fires the queued midgame interstitial — the ONLY place it fires). Audio ducks during ads (`Snd.duck`). Policy notes: no ad-chaining, ad-revive offered once/run, never midgame+rewarded-to-continue at the same break.
- **Flow State "Homeward"** (earned, NOT a buff): `flow` 0..1 meter charges on Clean-Pass skims (`FLOW_GAIN`) + coins (`FLOW_COIN`); at ≥1 → `flowActive` (rising sting `Snd.flow()`, `Music.flow` swell, gold blazing trail, light→LR_MAX, "HOMEWARD" + meter bar). Drains `FLOW_DRAIN`/s while lit (sustain by skimming); reward = **bonus score** via `bonusM` (`+= dx/40 * FLOW_MULT` → 1.5×) kept OFF `dist` so difficulty/spacing stay locked. `score() = dist + (bonusM|0)` is used for HUD/best/lastEarned. Resets on crash.
- **Warp tubes — PARKED.** Spawn line is commented out in `update()` (Mike: "they don't warp, benefit unclear"). Entity pool / draw / `Snd.warp()` kept for reuse. Flow State replaced them. Safe to delete the warp code if Mike confirms.
- **Zones/lore:** `ZONES`/`ACCENTS` cool→warm "lands" (ZONELEN 55m); per-land ridge tint, zone-crossing "new land" sweep, home-beacon that grows with `best` + steps closer each land crossed this run; player-centred emotional light (`lightR`, cached `LIGHTSPR`/`DARK` buffer, never shadowBlur).
- **Cosmetics:** SHAPE / TRAIL / AURA tabbed shop with live try-on; reactive items = ◆ rarity badge; dead-screen next-unlock bar. Coins = currency.
- **Obstacles:** tech-panel banded silhouettes + dual energy seam + depth grid + 2nd parallax layer (commit `9a85064`). Pooled formation sequencer (`pickFormation`) with a master difficulty scalar + per-formation onset ramps.

## Audio architecture (procedural — zero load latency, safe to keep tweaking)
- `Snd` = SFX: persistent oscillator voices → gain → shared lowpass (warm) → master; `burstN` (filtered noise one-shots); `tone` (scheduled pitched one-shot). SFX pitched to **`PENT`** (A-minor pentatonic) to sit in-key. Flip is **directional** (`Snd.flip(up)` — ascends up / descends down). Clean-Pass skims **walk up the scale** with combo. Coin = high-pent sparkle. `Snd.muted` (mute button kills all) + `Snd.adMuted` (`duck` during ads).
- `Music` = a live **dark A-minor "Matrix techno"** bed on a `setInterval(25ms)` lookahead scheduler (OFF the render loop): four-on-floor kick, offbeat hats, rolling `M_BASS`, sparse `M_LEAD` "digital rain"; bass lowpass opens with game speed (and wide in Flow). Routes through `Snd.master`. **Music ON by default**, one mute kills music+SFX. `Music.BPM=126`.

## Shipped this session (newest first)
`7cb7f3a` Flow State (Homeward) · `2837343` desktop window-fill fix + parked warps · `9a85064` obstacle tech-panel visual pass · `c1d5c5b` directional flip / scale-walk skims / portal breakout audio · `e8b8aba` warp tubes (now parked) · `b198591` Magnet replaces Slow-mo · `6a5241c` procedural techno bed + richer SFX · `7771541` precision ad-revive · `c8212ae`+`39bf5df` A8 cover art + generator.

## Open items / next
- **A8 submission assets (launch gate):** ✅ cover art done — `covers/flipline_cover_1920x1080.png`, `_800x1200.png`, `_icon_800x800.png` (regen via `covers/cover_gen.html`). ⏳ STILL NEEDS (Mike): a **15–20s silent gameplay clip in BOTH orientations** (he records) + run the **CrazyGames QA tool** against the uploaded build → then **ship**.
- **Awaiting Mike's live playtest feel:** audio/rhythm, Magnet, Flow State, the desktop screen-fill fix, the revive flow. Tune from his labelled feedback.
- **Warp code** can be deleted once Mike confirms Flow State fully replaces it.
- **v1.1 backlog:** leaderboards (free discovery boost), manual pause, music variety, new portal.

## Key tunables (top of `<script>`)
Movement/difficulty (**LOCKED**): `GRAV FLIPKICK SPEED0 SPEEDMX RAMP GAP0 GAPMIN HMIN/MAX WMIN/MAX PS`.
Tunable: `MAG_R` (magnet pull) · `REVIVE_CD`/`GRACE` (revive) · `FLOW_GAIN/FLOW_COIN/FLOW_DRAIN/FLOW_IDLE/FLOW_MULT` · `Music.BPM` + music submix gain (0.16/0.22) · `WARP_*` (parked) · zone `ZONELEN/ZONES/ACCENTS`.

## Conventions
- **Solo authorship:** commit as `Michael Nocito <hello.michaelnocito@gmail.com>`, **NO Co-Authored-By / AI trailer.**
- Keep the project **outside OneDrive** (it's in `C:\Users\Mike\Projects\GAMES\`).
- Mike pulls from git — commit + push after a change. Give him **labelled** test steps (e.g. `FLOW-a`) in plain language; keep end-of-task replies short.
- `_shots/` and `.claude/launch.json` are gitignored; `covers/` IS committed.
