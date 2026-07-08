# DEADROOT — Handoff & Roadmap (2026-07-08, post DR-#042)

Live: https://michaelnocito.github.io/play-area/deadroot/
Local: C:\Users\Mike\Projects\GAMES\play-area\deadroot\index.html
Full history: DEADROOT_DEV_NOTES.md (read DR-#035 → DR-#042 for the dungeon era).
Rules: single-file index.html, canvas + vanilla JS, fixed 60Hz, no build step, CG fast-load. `?dev=1` dev menu with live tunables incl. Enemy HP × / Enemy attack × (strip before launch). Read GAME_BIBLE.md at chat start. Commits `DR-#NNN`, author Michael Nocito <hello.michaelnocito@gmail.com>, no AI trailers, parse-check + push every change. ⚠️ Stage explicit paths only (`git add deadroot/...`) — `git add -A` from a subdir stages the whole monorepo (ca07c55 swept in another session's jade-fist JF-#040 WIP).

## What the game is now (DR-#042)
A **level-based dungeon-builder defense**. You are the undead Hive. Each LEVEL is a fixed root-burrow floor plan you populate with mobs during an untimed build phase (palette: **ZOMBIE** 40◈ bite / **GRABBER** 45◈ slow-aura / **SPIKES** 20◈ 3-use trap), then **START RAID** releases the whole adventuring party through the one west entrance. **The point: survive the level's 4 waves until your ROOTQUEEN can open the next doorway.** She is **auto-placed** at each level's deep spot (2×2, boss of the level); the sealed east **exit arch** is faintly visible all level; on clearing the last wave she tears it open (3.4s flare), surviving units are **reabsorbed as biomass**, and you descend to a fresh dungeon at full HP.

- **Levels:** L1 THE BURROW GATE (DR-#038 burrow, Great Root split, waves 1-4) · L2 THE ROOTMAW (serpentine baffles, waves 5-8) · L3 THE DEEP THRONE (arena + throne ring, waves 9-12). Final wave = victory → endless (L1 layout). Data in `LEVELS[]` (walls/queen/exit/waves/splits); `onFloor()` is level-aware.
- **Raiders** (DR-#036/#041): KNIGHT tank+taunt 2.4, CLERIC heals 8hp/s, INCIN dps, THIEF stealth-ambush-stun; they fight back when wounded, explore/search, and drop stuck straight-line waypoints after 0.8s (DR-#042 fix).
- **Zombies roam** ≤0.9 tiles around their post, freeze when prey is within range+1.2 tiles. Guards don't block pathing (DR-#038); doors and hedges are retired dormant code.
- HUD: LEVEL n — NAME + wave n/4; prep shows "survive N more raids — the Queen opens the way".

Known tooling: preview `deadroot` (4216) often dead → use `deadroot-alt` (4226); preview_screenshot times out → canvas→toDataURL→base64→decode→Read fallback; static file has NO HMR → `window.location.reload()` before preview_eval.

## Verified vs NOT verified
✅ All 3 layouts BFS-reachable; full campaign sim L1→L2→L3→victory; honest-economy L1 clears at 100 HP; roam bounded; console clean.
⚠️ **L2/L3 balance untested by a human** — waves 5-8 killed a sloppy sim garrison at 1× numbers. All numbers dev-tunable.

## ROADMAP — pick what to build next
### Needs Mike first
- **P1 — Playtest the level loop** (steps 042a-e from the DR-#042 chat: auto-Queen, roam, doorway transition, L2/L3 difficulty, 3-brush palette). Tuning notes → balance pass. **M**
- **D1 — Human sprite roster.** ⛔ ASSET-GATED: Engvee Knight/Barbarian/Halberdier sheets into `assets/raw/` (SPR-#003 pipeline). **M**
- **A3 — Shippable.** GAME_BIBLE Part 4 checklist + strip `?dev=1`. After the loop feels done. **M**

### Feature backlog (DR-#042 research, Mike to pick — rec: batch the 4 S items, then #5)
1. **Treasure bait** (S) — placeable loot piles lure greedy heroes off-path into kill zones.
2. **Adjacency synergy** (S) — zombie next to grabber hits harder; adjacent spikes re-arm faster.
3. **Kill-combo bonus** (S) — extra biomass for trap+monster kills within a short window.
4. **Party intel** (S) — richer pre-wave party preview to re-tune the dungeon.
5. **Morale & retreat** (M) — party morale bar; at zero survivors rout to the entrance and drop loot. The signature reverse-dungeon moment.
6. **Queen active abilities** (M) — root-slam AoE / terror scream on cooldown.
7. **Room-purpose tiles** (M) — Nest (free zombie/wave), Larder (regen), Bone Pit (+essence).
8. Later: torch/darkness ambush bonus, per-level modifiers, veteran carryover, monster fusion.

### Housekeeping
- Dormant dead code: doors (placeDoor/drawDoors/CFG.door), hedges, feast/mutate menu tangle — rip when convenient. **S**
- Meta (Mycelial Network) + boons still tuned for the old loop — revisit with balance. **M**
