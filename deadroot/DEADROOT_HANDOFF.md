# DEADROOT — Handoff & Roadmap (2026-07-05)

Live: https://michaelnocito.github.io/play-area/deadroot/
Local: C:\Users\Mike\Projects\GAMES\play-area\deadroot\index.html
Full history: DEADROOT_DEV_NOTES.md (read DR-#021 → DR-#024 for the maze work).
Rules: single-file index.html, canvas + vanilla JS, fixed 60Hz, no build step, CG fast-load. `?dev=1` dev menu (strip before launch). Read GAME_BIBLE.md at chat start.

## Where it is now
A **buy-and-place hedge-maze tower defense**. You are the undead Hive; a human war-host enters through fixed **gates** and winds toward the central Hive. Kills give **biomass**; you spend it to place **HEDGE** walls (5◈, permanent) and **ZOMBIE** units (40◈, attack). A hedge can be **grown into a zombie** for the difference (35◈). Paths are guaranteed **≥2 tiles wide** (can't be pinched to single-file). Zombies are **destructible** — a slain one leaves a **gap** in the maze. Corpses are decorative + passive biomass income. A concentric **spiral labyrinth** is pre-seeded each run.

Recent slices: DR-#021 buildable walls + no-corner-cut collision + route overlay; DR-#022 corpse-webbing (retired by pivot); DR-#023 core pivot to buy-and-place labyrinth; DR-#024 deadroot unify (hedge↔zombie), 2-wide guarantee, destructible gaps.

Known: canvas screenshots time out in tooling — verify via `preview_eval` (reload first, no HMR). Dead code kept but unwired: FEAST/mutate/warden/corpse-webbing/tier2.

---

## ROADMAP — pick what to build next

### A. Direction / modes (the big fork)
- **A1 — Mode select (Survival + menu).** Add a front menu; wrap the current game as **Survival mode**. Foundation for everything multi-mode. Effort: **S–M**. *(Recommended first if going multi-mode.)*
- **A2 — "Quest" tactics mode (FFT-style).** Turn-based tactical battles: a party of 4–5 monster types (Spitter/Grabber/Brute/Spore/Shambler), move + one action per turn, simple enemy AI, 3–5 quest battles, reuse grid + sprites. A near-new core loop. Effort: **XL**. *(Recommended path: build a tiny prototype slice FIRST — one 8×8 battle, 2 units, move+attack, dumb AI — to validate the feel before committing.)*
- **A3 — Survival to shippable.** Balance pass, dead-code cleanup, art polish, pre-submission checklist. Effort: **M**. *(Recommended to finish before A2, so one mode ships while tactics is explored.)*

### B. Your requested additions
- **B1 — Grabber zombie.** New unit type that **slows** enemies (snare aura or on-hit slow — the old `rootmass` behavior fits). Needs a **distinct look** (grasping tendrils/hands vs the Spitter). Adds a 3rd palette brush / grow option. Effort: **S–M**.
- **B2 — Reabsorption cooldown.** When a zombie dies, a **few-second delay** before you can raise a new one (the Hive reabsorbs the biomass) — gives losing a zombie real weight, pairs with destructible gaps. *Decision needed: global cooldown vs per-tile.* Effort: **S**.

### C. Maze / build polish (existing backlog)
- C1 Drag-to-paint walls (place a line of hedges in one drag). **S–M**
- C2 Ghost + red/green drag preview while placing. **S**
- C3 Nicer art: 47-tile autotile hedges; distinct "zombie-in-a-wall" look. **M**
- C4 Path-length reward (DoT that stacks the longer they walk your maze). **S–M**
- C5 Sell / remove a hedge or zombie for partial refund. **S**
- C6 Rip out dead code (FEAST/mutate/warden/webbing/tier2). **S**
- C7 Rework boon + onboarding text that still references mutate/rot. **S**
- C8 Balance pass: kill bounty vs hedge/zombie costs; wave difficulty. **M**
- C9 Gate-escalation banners ("the west gate opens"). **S**

### D. Content / progression
- D1 Finish the human attacker roster (Knight→troop, Barbarian→incin, Halberdier→sweeper). **M**
- D2 Boss waves + named assaults tuned to the new loop. **M**
- D3 Meta upgrades (Mycelial Network) re-tuned for buy-and-place. **M**

---

## Suggested sequencing (my rec)
1. **B1 Grabber + B2 Reabsorption** — small, concrete, adds depth to the maze you're about to playtest.
2. **A1 Mode select + A3 Survival-to-shippable** — get one mode truly done.
3. **A2 Quest prototype** — validate the tactics feel small before committing to the full FFT direction.

Tell the next session which item IDs to build (e.g. "build B1 + B2", or "prototype A2").
