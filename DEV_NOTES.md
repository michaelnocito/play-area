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

## Next ideas (backlog)
- 3rd/4th realm content (Hagalaz, Isa stubs exist in `REALMS`).
- Daily-seed run + leaderboard for Sköll-style score chase.
- Board/art-pack skins using Mike's celestial artwork.
- Sound (jump, coin, cast, gate) — keep default OFF, toggle on.
- Godot 4.6 port once feel is locked.

## Local serve
`npx serve -p 4209 .`  (preview config: launch name `rune-dash`, port 4209)
