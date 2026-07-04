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

## The pipeline (asset → render → pack → integrate)
1. **Model/source the unit in 3D.** Mike is a 2D artist (charcoal/pencil), not a 3D modeler,
   so favor these over hand-modeling:
   - **Low-poly asset packs** (fastest start): Kenney (free, CC0), Synty, itch.io packs. Pick
     a consistent art family so all units read as one game.
   - **AI image-to-3D** for custom units: Meshy, Tripo, Rodin (2026 tools; feed Mike's own
     concept art or a text prompt → 3D model). Good for bespoke enemies/bosses.
   - **Blender** to rig/pose/animate and to render (free). This is the renderer regardless of
     where the model comes from.
2. **Render to frames.** Blender add-ons automate this: **Sprite 2D** (kameloov.itch.io/sprite-2d)
   or **Pre Render Creator** render the same animation from N angles and output sheets directly.
   - Camera: match the game's view. Deadroot = top-down-ish (render from a high angle, ~4 or 8
     movement directions per enemy). Jade Fist = side view (render left-facing, flip in canvas
     for right; anim states idle/walk/strike/counter/hit).
   - Lighting: ONE consistent rig across every unit (a key + rim light). Rim light / a subtle
     outline is what makes units pop off the background — critical for readability.
   - Output: transparent PNG, fixed source size (e.g. 256px, downscale in-engine), same for all.
3. **Pack into an atlas.** TexturePacker (free tier) or the add-on's own sheet output. Produce
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
1. **One deadroot enemy, end to end:** take the `scav`, source/model it, render 4-dir walk,
   pack, wire `drawSprite` into deadroot's enemy draw for scavs only. Ship it behind a flag so
   procedural + sprite can be A/B'd. **Get Mike's eyes on the look at real scale before doing
   more.** This proves the pipeline and the art bar in ~1 unit of work.
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

## Open question for Mike (answer in the new chat)
Where do the 3D assets come from? (a) free low-poly packs to start fast, (b) AI image-to-3D from
your own concept sketches, (c) you model in Blender. This decides the very first step.
