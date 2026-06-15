# Rune Dash — Dev Notes

A calm, low-friction auto-runner platformer. The völva runs the bridge of realms;
**tap to leap, hold to soar**, gather star-essence, grow your power one run at a time.
NES/SNES-era feel: instantly readable, ~1–2 buttons, short loops, persistent progression.

## Status (current — through RD-#019)
- **Web prototype, single file** — `index.html` (no build step). Open it or serve the folder.
- **9 Realms across 3 Acts** (REALMS array). Fully built: Sowilo(0), Raidho(1), Wunjo(2).
  Stubs w/ real layouts but placeholder content: Hagalaz(3), Isa(4), Algiz(5), Tiwaz(6),
  Laguz(7), Dagaz(8). Per-realm `speed` field sets pacing. Each realm has a hero rune +
  thematic identity; 24 Elder Futhark runes mapped across the 9 (see memory file for the table).
- **Commercial direction (confirmed):** calm auto-runner for adults; hook = "we teach you the
  runes"; target = mobile via Godot port; HTML5 portals (CrazyGames/Poki) for soft launch.
  Free + rewarded ads + one-time IAP (~$2.99 ad-free+sound). `window.adProvider` hook in place.
- **Mobile testing DEFERRED** (Mike's call). file:// on mobile froze; RD-#018 hardened it
  (persist try/catch + on-screen error bar). When he returns: make repo public → GitHub Pages.

## Controls
- **Jump:** Space / W / ↑ / Click / Tap. Hold for a higher jump (variable height).
- **Cast rune-bolt:** J / K / Shift, or tap the right ~20% of the screen.
- **Sound:** M or the ♪ button (on by default). **Ghost toggle:** G.

## Replay / come-back hooks
- **Star-essence** from coins + slain shades → spent at the **Shrine of Skills**.
- **Skill tree (3 branches, 3 levels each):**
  - Wind-Step — higher/floatier jumps; **lvl 2 unlocks double-jump**.
  - Rune-Bolt — faster cast cooldown + faster bolts.
  - Ward — start each run with a shield charge (one free hit).
- **Realm select** (Mega Man style): clearing a realm unlocks the next.
- **Best-time** tracked per realm.

## Code map (all in `index.html`)
- `buildLevel(realm)` — hand-authored level layout (ground segs, gaps, pillars, foes, coins, gate, teach prompts).
- `cfg()` — tuned feel constants, modified by upgrade levels (jump force, gravity, coyote/buffer, bolt stats).
- `update()` — fixed-timestep sim: jump buffering + coyote time, variable jump, gravity, ground/obstacle/foe/coin collision, casting, gate.
- `render()` + `draw*()` — parallax sky/stars/mountains, ground, gate portal, coins, shades, bolts, hooded-völva sprite, particles, HUD.
- `REALMS`, `UPGRADES` — data tables. `save` / `persist()` — localStorage (`runeDash.save.v1`).

## Feel tuning knobs (in `cfg()`)
`runSpeed`, `grav`, `jumpV`, `cutMul`, `coyoteMax`, `bufMax`, `maxFall`, `boltCD`, `boltV`.

## Visual art direction (psychedelic-celestial) + Godot-handoff mapping
All art is **procedural canvas vector geometry** (no raster sprite assets yet), so it ports
cleanly to Godot primitives and leaves seams to drop in Mike's hand-drawn art later.
`animT` (wall-clock seconds, set in `loop()`) drives idle motion; `cam` drives world scroll.

| Element | HTML draw fn | Godot equivalent |
|---|---|---|
| Sky gradient + vignette | `drawSky` / `drawVignette` | `ColorRect` + gradient shader / `CanvasModulate` |
| Aurora ribbons | `drawSky` (sine-displaced bands) | `Line2D`/`Polygon2D` + wave shader, `lighter` = additive blend |
| Constellation + stars | `drawSky` | `Points`/`Line2D`, parallax via `ParallaxLayer` |
| Sun/moon + runic ring | `drawSky` | `Sprite2D` + rotating `Node2D` of `Line2D` ticks |
| Floating monoliths / ridges | `drawMonolith` / `drawRidge` | `ParallaxLayer` sprites (hash() seed → fixed peaks) |
| Crystalline ground / platforms | `drawGround` / `drawCrust` / `drawCrystalPlatform` | `Polygon2D` tiles + glowing `Line2D` seam |
| Carved menhir hazards | `drawObstacles` | `Polygon2D` + `PointLight2D` |
| Rune-crystal essence | `drawCoins` (spinning diamond) | `AnimatedSprite2D` or `Polygon2D` + spin tween |
| Wraith foes | `drawFoes` (tattered cloak + eyes) | `Polygon2D` skeleton or `GPUParticles2D` |
| Rune-bolt | `drawBolts` (shard + trail) | `Sprite2D` + `GPUParticles2D` trail |
| Rune-gate | `drawGate` (pillars + veil + ring) | scene: `StaticBody2D` + shader veil + rotating ring |
| Völva player | `drawPlayer` | `Skeleton2D` rig (legs/cloak/hood/staff), or hand-drawn frames |

**Handoff rule:** keep gameplay (`update`, hitboxes, `cfg`) separate from rendering (`draw*`).
A Godot port reimplements only the `draw*` layer + scene tree; the sim logic maps 1:1.
Per-element hitboxes are unchanged by visuals (player 30×44, foes 34×34, coins 20×20).

## Dev/test bridge
`window.__dev` (bottom of script): `start(i)`, `jump()`, `step(n)`, `freeze()`, `thaw()`, `setCam(v)`.
Lets tooling freeze a single frame for inspection (the rAF loop never idles otherwise).

## Level-design roadmap (research-backed, RD-#005)
Levels are on the right track; 5 ways to deepen them (sources: retrostylegames, Tadeas Jun
2D level design, gamedesignskills, 300mind endless-runner, LinkedIn pacing/rhythm):
1. **Teach → test → combine** (Mario method) — safe intro of each mechanic, low-stakes first
   challenge, ramp, then combine with earlier mechanics. Extend the jump-teach to glide + cast.
2. **Tension & release rhythm** — author each realm as a wave: breather → groove stretch →
   intense burst → release. Avoid uniform difficulty.
3. **Risk/reward optional routes** — upper path with extra essence + a rune-crystal that
   *requires the glide* to reach.
4. **Authored chunks + seeded variation** *(top pick)* — library of hand-tuned segment chunks
   assembled per-run with a seed + difficulty weighting; fresh but fair. Pairs with per-run imagery.
5. **In-run ramp + telegraphing** — gently scale speed/density through a run; telegraph hazards.

## Audio design (RD-#015 — Adaptive Norse score; supersedes RD-#008)

**CodeKeys ambient bed KILLED.** Now an adaptive Norse score: **calm base, big payoffs**.
- **Base:** warm layered sine/triangle drone (throat-sung/horn feel) + frame-drum pulse
  (`_kick` = woody thud + skin slap) + seed shaker (`_hat`) + woven **bone-flute motif**
  (`_flute`). `PENTA` + `REALM_MOTIF` give each rune a signature melody (audio teaches runes).
- **Payoffs:** kill (`bassHit`) = war-horn swell over a drum-boom; gate (`gateClear`) =
  3 frame-drum hits + ascending flute run. Glide = sustained melodic chord.
- `REALM_AMB` (9 entries): `[root Hz, 5th Hz, pad Hz, LFO Hz, BPM]`. `activityScore` (bumped
  by actions, decays) drives reactive drum/flute density. Sound ON by default.
- Sound Forge (Shrine): Ward Pulse / Double Echo / Gate Shimmer.

## Economy (RD-#016)
- **Currency = Amber** (Freya's tears; re-themed from star-essence). Code id stays `essence`
  to preserve saves. Collectible art = amber teardrop (`drawCoins`).
- **Single currency + evergreen sink ladder** (research-backed: taps/sinks, pinch point,
  "always something to spend on"). Fix for currency stagnation = **Provisions** (`BOONS`):
  Ember Ward (12, start shielded), Amber Surge (20, 2× amber that run), Twin Leap (15, double-
  jump that run). Banked in `save.boons`, auto-consumed at `startRun` → `runBoons`. Bought in
  Shrine "Provisions". Surge = spend-to-earn loop that pairs with the watch-ad bonus.

## Rune Forecaster (RD-#017, #019) — spaced-repetition rune practice
- **Learning-science anchor = SPACED REPETITION.** Realm Select → "ᛜ Rune Forecaster".
- **Weekly Focus Rune** (free): `ensureWeekly()`/`pickWeekly()` surface the least-recently-shown
  rune, held all week, cycling all 9 over ~9 weeks.
- **Daily Draw** (free 1/day): `doDailyDraw()` with 🔥 streak.
- **Norns' Spread** (ad OR 25 Amber): Urd/Verdandi/Skuld. RD-#019 made it a real reading —
  `RUNE_READING[id]` = a full sentence per position + a `thread` clause; renders 3 positional
  readings + a "threads, woven" synthesis landing on the future rune's `lifeMeaning`.
- **Carry/Practice card** (`openCarry`): CSS breathing circle synced to per-rune vowel mantra
  (`RUNE_GROWTH.mantra`) + 3 phrases (`RUNE_GROWTH.phrases`) + draw-and-keep prompt.
- Data-driven (`FC_DECK`/`RUNE_LORE`/`RUNE_READING`/`RUNE_GROWTH`) → **Tarot clone = deck swap**.

## Session log RD-#014 → #019
- **#014** mobile foundation + ad hooks (`Ads`/`window.adProvider`) + 9-realm scaffold (SAVE_KEY v2)
- **#015** adaptive Norse audio · **#016** Amber + Provisions · **#017** Rune Forecaster
- **#018** mobile-freeze hardening (persist try/catch + on-screen error bar)
- **#019** Norns' Spread cohesive-sentence reading

## Next ideas (backlog)
- **RD-#020 hero unlocks** (NEXT): cosmetic-first völva reskins (berserker/Thor/Odin), ad-OR-Amber.
- Checkpoint system (totem mid-run, respawn from CP, lore card) for Act 2-3 realms.
- Flesh out stub realms Hagalaz(3)/Isa(4)/Algiz(5)/Tiwaz(6)/Laguz(7)/Dagaz(8) with real layouts.
- Mobile/deploy when Mike returns: make repo public → GitHub Pages; add landscape hint.
- Give daily/weekly the richer "reading" voice; lore gallery; Tarot clone; Godot port.

## Local serve
`npx serve -p 4209 .`  (preview config: launch name `rune-dash`, port 4209)
