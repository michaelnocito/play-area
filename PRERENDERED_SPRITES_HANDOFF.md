# HANDOFF — Pre-rendered 3D sprite pipeline for play-area games (2026-07-04)

**YOU (the assistant reading this) ARE RECEIVING THE HANDOFF.** Mike pasted this to start a
new Claude Code chat. Read it, load the listed docs/memory, and start on the vertical slice.
Do not re-summarize it back to him.

## Why this exists (the real goal)
Deadroot playtest feedback (via the playtest tracker) had three separate fails that all trace
to ONE root Mike named: **the 2D look makes enemies and towers too hard to identify.** Gut
rating 3/5. He considered a Godot rebuild; we ruled it out (full GDScript rewrite + multi-MB
WASM web export that fights CrazyGames' fast-load bar). **Chosen path: pre-rendered 3D
sprites** — model/light units in 3D, render them to 2D sprite sheets, drop them into the
existing web games. Keeps the game logic, keeps instant web load, gives a premium 3D look, and
(done right) fixes readability.

**Readability is the actual deliverable, not "3D for its own sake."** Every design choice
below serves: can the player instantly tell each enemy/tower apart at real in-game size?

## Read first
- `GAME_BIBLE.md` (repo root) — the CG/design standard, incl. Part 5 (dev menu, keep it).
- `deadroot/DEADROOT_DEV_NOTES.md` — see the "Readability driver" entry + DR-#018 graphics work.
- Memory: `project_deadroot_state`, `project_jade_fist_state`, `reference_crazygames_requirements`.
- Live games: deadroot https://michaelnocito.github.io/play-area/deadroot/ , jade-fist
  https://michaelnocito.github.io/play-area/jade-fist/ . Local: `C:\Users\Mike\Projects\GAMES\play-area\<game>\index.html`.

## ASSET SOURCE — DECIDED: ready-made packs, Mike does ZERO art
**Mike is NOT a game/digital/3D artist and has no desire to learn 3D tools (Blender etc.).
Do not propose any path that asks him to model, rig, or render.** He picks packs and eyeballs
the result; **Claude Code does all the integration (and any rendering scripting) itself.**
- **Prefer packs that already ship 2D SPRITE SHEETS pre-rendered from 3D** (top-down /
  isometric character sprite packs on Kenney and itch.io). This is the whole shortcut: if the
  pack is already 2D sprites, there is **NO Blender / no rendering step at all** — just pick,
  license-check, and integrate. This is the default.
- Only if a needed unit exists solely as a 3D model (GLTF/FBX) and not as sprites: Claude
  scripts **Blender headless** (Python API, `blender -b -P render.py`) to render it to sprite
  sheets. Claude writes/runs the script; Mike never touches Blender. Treat this as the fallback.
- **NOT AI-generated** (Mike's explicit constraint — GameMonetize rejected Flipline as an "AI
  game"; do not use Meshy/Tripo/Rodin or any AI-gen assets for shipped units).
- **Originality note (CG wants original assets):** stock packs carry an "asset-flip" risk. Cheap
  mitigations Claude can do in CODE, no art skill needed: per-enemy-type runtime color tint (a
  canvas/globalCompositeOperation or offscreen recolor) — this doubles as the readability
  color-coding, so it earns its keep; prefer less-ubiquitous packs over the most-recognizable
  Synty sets; kitbash/recombine. Always verify each pack's license allows commercial web use.

## The pipeline (pick pack → [render only if needed] → pack atlas → integrate)
1. **Pick a pack** (above). Default = a 2D sprite pack with the pre-rendered-3D look.
2. **Render to frames — ONLY if the pack is 3D-model-only** (fallback). Claude scripts Blender
   headless: match the game view (deadroot top-down ~4-8 dirs; jade-fist side view, flip for
   facing, anim states idle/walk/strike/counter/hit), ONE consistent light rig + rim light,
   transparent PNG, fixed source size. Add-ons like **Sprite 2D** (kameloov.itch.io/sprite-2d)
   automate directional sheets if Blender is available. Skip this whole step for 2D-sprite packs.
3. **Pack into an atlas.** TexturePacker (free tier) or a free packer / script. Produce
   a PNG atlas + a JSON frame map (name → {x,y,w,h}). Keep total atlas weight small (aim a few
   hundred KB — CG penalizes slow load; this is the main constraint vs. Godot).
4. **Integrate into the web game.** Add a small sprite module:
   - Load the atlas PNG + JSON once at boot.
   - `drawSprite(type, state, dir, frame, x, y, scale)` = one `ctx.drawImage(atlas, sx,sy,sw,sh, ...)`.
   - Replace the procedural draw for that unit (deadroot enemy draw / jade-fist `fighter()`)
     with `drawSprite`. Keep the procedural draw as a fallback if the atlas fails to load.
   - These are currently single-file `index.html`. CG hosts a whole folder, so it's fine to add
     an `assets/` dir (atlas PNG + JSON). Note in the game's dev notes that it's no longer
     strictly single-file, and keep the loader graceful (game still runs if assets 404).

## Readability rules to bake in (the point of all this)
- **Silhouette first:** each enemy type must be recognizable by SHAPE alone (test in pure black).
- **Hard color-coding:** one dominant hue per type, far apart on the wheel; keep away from the
  telegraph/UI colors already used.
- **Size hierarchy:** scav < troop < butcher < boss, obviously.
- **Rim light / outline** so units separate from the (now busy, post-DR-#018) background.
- **Test at real in-game scale**, not zoomed in. A sprite that reads at 256px but mud at 40px
  failed. Deadroot enemies render around 20-40px on screen.

## Scope & order — do a VERTICAL SLICE first (de-risk before volume)
0. **FIRST: propose 2-3 candidate packs to Mike** (with preview images/links) that fit
   deadroot's tone and cover the enemy roster; let him pick. He does zero art; he only chooses.
1. **One deadroot enemy, end to end:** take the `scav`, grab its sprites from the chosen pack
   (render via headless Blender only if the pack is 3D-model-only), pack, wire `drawSprite` into
   deadroot's enemy draw for scavs only, add the per-type color tint. Ship it behind a flag so
   procedural + sprite can be A/B'd. **Get Mike's eyes on the look at real scale before doing
   more.** Proves the pipeline + the look in ~1 unit of work.
2. If the slice lands: the other deadroot enemies + towers, then the Hive.
3. Then jade-fist (side-view fighters: player + 3 enemy types + bosses).
- **Feedback rides the playtest tracker** (games "deadroot" / "jade-fist" in the Supabase-backed
  app; Claude reads/writes it — see `project_playtest_tracker` memory). Mike marks fails, you fix.

## Constraints / standing rules
- **Keep CG fast-load** — atlas weight is the budget. If it balloons, that's the whole reason we
  didn't pick Godot; don't recreate the problem.
- Keep the game logic and the dev menu (`?dev=1`, GAME_BIBLE Part 5) intact.
- Solo authorship: commit as Michael Nocito <hello.michaelnocito@gmail.com>, NO AI/Co-Authored-By
  trailers. Commit + push after each change. `node --check` the inline JS before committing.
- Always give Mike the live URL + local path. Keep sessions short, one slice per chat.
- Task numbering per game continues (`DR-#NNN`, `JF-#NNN`); this initiative can tag `SPR-` in
  commit bodies if useful.

## Decided (2026-07-04)
Asset source = **ready-made packs** (prefer pre-rendered-2D-sprite packs so no Blender needed).
**Mike does zero art and won't learn 3D tools** — Claude picks/proposes packs, does all
integration and any rendering scripting. NOT AI-generated (Flipline was rejected as an "AI
game"). First action in the new chat = propose 2-3 candidate packs for deadroot for Mike to pick.

## Sprite pack decision (2026-07-04, after research)
Ready-made 2D sprite packs that are BOTH genuinely 3D-pre-rendered AND have a full 4-tier
enemy roster (weak/mid/tanky/boss) with a clean commercial license turned out to be rare.
**Two-phase plan Mike chose:**
- **Phase 1 (prototype, now):** RetroStyle Games "SWAT vs Zombies" free pack
  (retrostylegames.com/portfolio/free-isometric-sprites-swat-vs-zombies/). Confirmed genuinely
  pre-rendered from rigged 3D models. Only 3 character types (SWAT Soldier, Zombie Brute,
  Female Zombie), 4 animation states each — enough to prove the pipeline (drawSprite, atlas,
  color-tint) on the scav enemy, NOT enough for the full roster.
  **License is Discord-gated with no stated commercial terms — prototype/internal use only,
  do NOT ship this pack in the CG/itch.io release.** Swap to Phase 2 before shipping.
  Mike downloads (may require joining their Discord per the page), drops files in
  `deadroot/assets/raw/`, Claude wires the vertical slice (scav enemy first, behind a flag)
  to prove the pipeline before spending on Synty.
- **Phase 2 (once deadroot is tight/polished):** Synty POLYGON City Zombies pack
  (syntystore.com/products/polygon-city-zombies-pack, $49.99) — 50 distinct character types,
  much stronger variety/quality, clean one-time commercial license. Sold as 3D FBX models only
  (no sprite-sheet deliverable exists), so this requires Claude to script headless Blender
  rendering (the fallback pipeline step already documented above). Mike never touches Blender.
- Rejected: Kenney (vector, not 3D), CraftPix/GameDeveloperStudio zombie packs (vector/Spriter,
  not 3D despite topdown-zombie branding), monogon's itch pack (real 3D/voxel but only 3
  characters, no anim, props-only), RetroStyle SWAT vs Zombies (real 3D-rendered, only 3 chars,
  Discord-gated license with no stated commercial terms — too risky to build on).
