# Rune Dash — Dev Notes

A calm, low-friction auto-runner platformer. The völva runs the bridge of realms;
**tap to leap, hold to soar**, gather star-essence, grow your power one run at a time.
NES/SNES-era feel: instantly readable, ~1–2 buttons, short loops, persistent progression.

## Status
- **Web prototype, single file** — `index.html` (no build step). Open it or serve the folder.
- Realms **1 (Sowilo)** and **2 (Raidho)** are playable, complete start-to-gate.
- Verified: rendering, all menu transitions, run start, jump physics + collision + ground,
  survival, shrine/upgrade UI, localStorage save. (Feel/tuning is for playtesting.)

## Controls
- **Jump:** Space / W / ↑ / Click / Tap. Hold for a higher jump (variable height).
- **Cast rune-bolt:** J / K / Shift (Realm 2+), or tap the right edge of the screen.

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

## Audio design (RD-#008)

**Style:** CodeKeys-style ambient focus bed, NOT chiptune sequences.
A warm droning bass + breathing LFO pad that shifts per realm — the background is always
atmospheric, never melodic. Your keystrokes ARE the music.

**Keystroke beats:** every jump fires a tight percussive click (bandpass-filtered noise snap)
that sits rhythmically on the drone. You become the rhythm track.

**Kill bass hit:** deep 808-style sub-bass sine sweep (root → root×0.6, ~1s decay) + mid
square body + impact transient. The kill IS a beat drop. Loud, meaty, extended.

**Free SFX (always on):** jump snap, kill bass hit, runestone block thud, gate clear chord.
**Sound Forge (buy at Shrine):** Coin Chime (15✦), Bolt Crack (15✦), Death Knell (20✦).
Fewer default sounds so the player's ear locks onto the core set fast.

**Per-realm drone frequencies:**
- Sowilo A1 (55 Hz), 5th E2 (82 Hz), pad A3 (220 Hz), LFO 0.55 Hz
- Raidho G1 (49 Hz), 5th D2 (73 Hz), pad G3 (196 Hz), LFO 0.80 Hz
- Hagalaz E1 (41 Hz), 5th B1 (61 Hz), pad E3 (164 Hz), LFO 1.10 Hz
- Isa Bb1 (46 Hz), 5th F2 (69 Hz), pad Bb3 (185 Hz), LFO 0.38 Hz

## Next ideas (backlog)
- Implement the level-design roadmap above (start with #4 chunk library).
- Lore as a collectible gallery screen (view all whispers heard); locked realms show meaning.
- 3rd/4th realm content (Hagalaz, Isa stubs exist in `REALMS`).
- Daily-seed run + leaderboard for Sköll-style score chase.
- Board/art-pack skins using Mike's celestial artwork.
- Godot 4.6 port once feel is locked.

## Local serve
`npx serve -p 4209 .`  (preview config: launch name `rune-dash`, port 4209)
