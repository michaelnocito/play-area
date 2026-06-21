# FLIPLINE — Visual & Level-Design Handoff

> **Purpose of this doc:** let a fresh agent improve **how the game looks** and **how interesting the
> obstacles/levels feel** — *without* re-deriving anything and *without* breaking the two things this
> game was built around: **buttery performance** and **a carefully tuned feel**. Read top to bottom
> before touching the file.

The single deliverable is one file: **`index.html`** — vanilla JS + Canvas, no build step, no
dependencies. Everything is authored in a 480×270 logical space, scaled to fit.

---

## 1. What the game is

**FLIPLINE** — a one-button gravity-flip runner. You auto-scroll; tap/click/space flips gravity so
the player snaps between floor and ceiling; thread red obstacles; score = distance; beat your best.
Same proven lane as CrazyGames hits *Space Waves* / *Hyper Wave Challenge*.

**North Star:** smooth on mobile, big/bold/flat, low-friction, fast to load — built for ad revenue
on CrazyGames. Plus a chosen identity: **fairness + skill-feel** (scrupulously fair hitboxes, danger
always unmistakably red, and a "Clean Pass" reward for skimming obstacles by a hair).

---

## 2. ⛔ The performance contract — DO NOT BREAK THIS

1. **Zero per-frame allocation.** No `new`, no array `.map/.filter/.slice`, no object/string churn
   inside `update()`/`draw()` loops. Obstacles, particles, trail, gates are **fixed object pools**
   reused forever. A couple of `rgb(...)` strings per frame is the accepted ceiling.
2. **Zero per-frame DOM writes.** Score, coins, shop, menus are **drawn on the canvas**. Only DOM is
   the mute / reduce-flashing / rotate elements.
3. **No `shadowBlur`, no gradients, no canvas filters, no per-frame `roundRect` glow churn.** "Glow"
   is faked with a larger translucent fill behind a shape. Keep it.
4. **Delta-time, capped.** The loop is framerate-independent (`dt` in seconds, capped at 0.033).
5. **Single `requestAnimationFrame` loop:** `frame()` → `update(dt)` → `draw()`.

If a visual idea can't be done within these rules, it doesn't ship. Test every change on a real phone.

---

## 3. 🔒 The locked feel — VISUAL CHANGES ONLY

Do not touch movement, collision, difficulty, or reward logic:

- **Movement (locked):** `GRAV 4200`, `FLIPKICK 240`, gravity flip + apex-snap.
- **Difficulty curve (locked):** `SPEED0 170 → cap`, `RAMP 0.9`, spacing `GAP0 200 → GAPMIN 120`,
  alternating "pairs" that only start at 100m and ramp slowly. Early game is deliberately gentle.
- **Fairness (identity — do not weaken):** the hitbox is an **inset square** (`PS-4`), smaller than
  the visual. Danger is **always red**. A new shape/skin must never change the hitbox.
- **Clean Pass:** skim an obstacle within 14px as it passes → spark + combo + bonus coins/score.
- **Buff gates** (start 150m): Slow-mo / Shield / 2×. Zone color shifts every 55m, milestone pop
  every 50m, coins auto-earned (distance + Clean Pass).

You may **restyle** any of the above (how the obstacle/gate/player *looks*), never **retune** it.

---

## 4. How rendering works today

`draw()` order, every frame: background fill → far-parallax motes → speed stripes → walls →
gates → obstacles → trail → player → particles → score → flash → milestone → mode overlays.

- **Dynamic zone palette** — `ZONES[]` (bg) + `ACCENTS[]` (player/trail/glow) lerp by distance
  (`ZONELEN 55`). Walls tint per zone. `zoneRGB()` interpolates.
- **Fake glow** — translucent oversized fill behind player & obstacles.
- **Obstacles** — beveled: dark base, left highlight, right shade, a bright play-facing danger edge,
  glow that pulses brighter as it nears the player.
- **Player** — `shapePath()` renders the equipped skin; squash on flip; expressive face. Hitbox
  unchanged regardless of shape.
- **Trail** — 20-point ring buffer, tapered glowing squares.
- **Reactive background** — quiet brightness pulse on landings / Clean Passes (`bgPulse`).
- **Accessibility** — `lowFx` toggle suppresses full-screen flashes, bg pulse, most shake; saved.

---

## 5. 🎯 What to improve

### A. Premium graphics — *within §2*
- **Obstacles** (weakest element): richer silhouettes (notched/tech/crystalline via paths), layered
  two-tone fill, an animated energy seam — all flat fills/paths only.
- **Background**: a second parallax band, a subtle precomputed horizon/vignette, faint scanline/grid
  that reads as "speed." Keep it behind gameplay and low-contrast so danger pops.
- **Player/trail**: light touch only.

### B. Obstacles / level design less basic
- New obstacle *formations* (staircases, quick double-flip gaps, pinch points, gauntlets) — composed
  from the existing pooled rectangle primitive.
- Possibly new fair hazard *types* that still read instantly as red danger and keep a simple hitbox.
- A spawn/pattern system that introduces formations gradually (nothing punishing before ~100m).

### Constraints (non-negotiable)
- Fairness first: danger always red, hitboxes simple and forgiving, nothing unreadable at top speed.
- Mobile smoothness is a hard gate.
- Stay single-file, no assets/dependencies.

---

## 6. Tunables map

Top of `<script>`: `WALL, PX, PS, GRAV, FLIPKICK, SPEED0, SPEEDMX, RAMP, GAP0, GAPMIN, HMIN/HMAX,
WMIN/WMAX`. Visual: `ZONELEN`, `ZONES`, `ACCENTS`, `GATECOL`, `SKINS`. Gates: `GATE_DUR, GATES_FROM`.
Spawn: `spawnObstacle()`. Draw: `draw()` + `shapePath()`. Pools: `obs`, `par`, `trail`, `gates`.
