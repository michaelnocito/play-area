# DEADROOT — Handoff & Roadmap (2026-07-05)

Live: https://michaelnocito.github.io/play-area/deadroot/
Local: C:\Users\Mike\Projects\GAMES\play-area\deadroot\index.html
Full history: DEADROOT_DEV_NOTES.md (read DR-#021 → DR-#024 for the maze work).
Rules: single-file index.html, canvas + vanilla JS, fixed 60Hz, no build step, CG fast-load. `?dev=1` dev menu (strip before launch). Read GAME_BIBLE.md at chat start.

## Where it is now
A **buy-and-place hedge-maze tower defense**. You are the undead Hive; a human war-host enters through fixed **gates** and winds toward the central Hive. Kills give **biomass**; you spend it via a 3-brush palette: **HEDGE** walls (5◈, permanent, **drag to paint a line**), **ZOMBIE** units (40◈, bite), and **GRABBER** units (45◈, slow-aura). A hedge can be **grown into a zombie/grabber** for the difference. Paths are guaranteed **≥2 tiles wide**. Zombies/grabbers are **destructible** — a slain one leaves a **gap** AND starts a **4s Hive-wide reabsorption cooldown** before you can raise a new unit. The longer enemies wind your maze, the more **creeping-rot DoT** cooks them (rewards long routes). Tap a hedge/zombie to **sell/remove** it. Gates **flare** when a new front opens. Corpses are decorative + passive biomass income. A concentric **labyrinth** is pre-seeded each run.

Recent slices: DR-#023 pivot to buy-and-place; DR-#024 hedge↔zombie unify + 2-wide + destructible gaps; **DR-#025 Grabber + reabsorption cooldown; DR-#026→#032 the full C polish backlog (boon/onboarding text, sell/remove, drag-paint + ghost cursor, gate flares, path-length rot, leafy hedges, dead-code rip).**

Known: canvas screenshots time out in tooling — verify via `preview_eval` (reload first, no HMR). Remaining dead code (harmless): feast/mutate corpse-menu tangle (interwoven with the live salvage menu).

## Decisions locked (2026-07-05, Mike playtest)
- **The 2-wide maze feels good** — no tuning needed there. Direction is confirmed: this is a buy-and-place hedge-maze **Survival** game.
- **FFT-style tactics is a separate game, PARKED.** Agreed it's a near-new core loop, not an evolution of this. Not on the near-term roadmap — revisit as its own project later. Everything below is about making the maze Survival game great.

---

## ROADMAP — pick what to build next

### A. Direction / shippable
- **A3 — Survival to shippable.** Balance pass, dead-code cleanup, art polish, GAME_BIBLE Part 4 pre-submission checklist. The finish line for this game. Effort: **M**. *(Recommended once the depth items below are in.)*
- ~~A1 Mode select~~ — not needed while there's a single mode; revisit only if/when the tactics game exists.
- ~~A2 Quest tactics (FFT)~~ — **PARKED** as a separate future game (see Decisions above).

### B. Your requested additions
- ~~**B1 — Grabber zombie.**~~ **DONE (DR-#025).** 3rd build brush (GRABBER, 45◈, range 2.0, slow 0.40): a zombie that slows every enemy in its amber snare aura instead of shooting. Distinct look = amber disc + dashed aura ring + grasping clawed tendrils. Destructible, growable from a hedge. Tune slow%/range/cost on playtest.
- ~~**B2 — Reabsorption cooldown.**~~ **DONE (DR-#025), GLOBAL Hive-wide (chosen over per-tile).** 4s lockout on raising a NEW zombie (fresh place AND grow) after any zombie dies; hedges/salvage exempt. Palette buttons dim + countdown; cursor red while cooling. Tune the 4s on playtest.

### C. Maze / build polish — ✅ ALL DONE (DR-#026 → #032)
- ~~C1 Drag-to-paint walls~~ **DONE (DR-#028)** — hold+drag the HEDGE brush lays a wall in one stroke.
- ~~C2 Ghost + red/green drag preview~~ **DONE (DR-#028)** — filled ghost cursor in the brush hue, red+X when blocked.
- ~~C3 Nicer art~~ **DONE (DR-#031)** — leafy dappled topiary + top-face highlight (clip-free/cheap). *Full 47-blob atlas + separate zombie-in-wall art judged not worth the weight; grown zombie already reads distinct.*
- ~~C4 Path-length reward~~ **DONE (DR-#030)** — creeping-rot DoT ramps with time spent walking the maze.
- ~~C5 Sell/remove for refund~~ **DONE (DR-#027)** — tap a hedge → REMOVE (60% refund for paid, free for seeded); zombie SALVAGE already existed.
- ~~C6 Rip dead code~~ **DONE (DR-#032)** — removed spiderweb system + spawnWarden + applyTier2 (feast/mutate menu tangle left as harmless).
- ~~C7 Rework boon + onboarding text~~ **DONE (DR-#026)** — grabber/hedge boons replace dead Spore/Rootmass ones; palette onboarding replaces "TAP A CORPSE".
- **C8 Balance pass** — ⏳ NEEDS MIKE'S PLAYTEST. Kill bounty vs hedge/zombie/grabber costs, reabsorb 4s, grabber slow/range, maze-DoT ramp, wave difficulty. **M**
- ~~C9 Gate-escalation banners~~ **DONE (DR-#029)** — directional banners + just-opened gate flare.

### D. Content / progression — needs Mike
- **D1 Human roster** (Knight→troop, Barbarian→incin, Halberdier→sweeper). ⛔ ASSET-GATED — drop the Engvee Knight/Barbarian/Halberdier sheets in `assets/raw/` (per SPR-#003) and I'll wire + pack them. **M**
- **D2 Boss waves + named assaults tuned to the new loop.** ⏳ NEEDS PLAYTEST FEEL (content + balance). **M**
- **D3 Meta (Mycelial Network) re-tuned for buy-and-place.** ⏳ Mostly still relevant; could add maze-flavored nodes (grabber/hedge/maze-DoT) — needs balance. **M**

---

## Where we are now
The whole **C polish/cleanup backlog + B additions are shipped** (DR-#025 → #032, 8 commits, each headless-verified).
Everything left needs something only Mike can give:
- **C8 / D2 / D3 / A3** need **your playtest feel** on the new mechanics — rebalancing blind would risk the confirmed-good maze.
- **D1** needs **new sprite assets** (Engvee human sheets) dropped in `assets/raw/`.

## Suggested next (pick one)
1. **Playtest the current build** (grabber, reabsorb, drag-paint, maze-DoT, sell/remove, gate flares) and send tuning notes → I do **C8** balance from your numbers.
2. **Drop the Engvee human sheets** → I wire **D1** (Knight/Barbarian/Halberdier).
3. **A3 Survival → shippable** — I run the GAME_BIBLE Part 4 pre-submission checklist + strip the `?dev=1` menu for a release build (needs your go-ahead that the loop feels done).
