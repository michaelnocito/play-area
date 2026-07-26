# DEADROOT — Handoff & Roadmap (2026-07-08, post DR-#042)

> # ⛩️ FIRST: BRING THIS GAME IN LINE WITH THE BUILD PILLARS
>
> **Before any roadmap item below is picked up, read `BUILD_PILLARS.md` at the repo root and
> do the Pillar 1 pass on this game.** This block outranks everything under it. When Mike says
> "look at the roadmap", the answer starts here, not at the backlog.
>
> **Pillar 1 — THE GARDEN.** Strip to ONE thing and play it until it is genuinely fun before
> any more content gets built. Committed feel-lab at `deadroot/proto/lane-test.html`:
>
> - **ONE defender unit** against **ONE raider**. Not a party, not a floor plan, not four waves.
> - The **real shipped numbers**, not approximations, so tuning transfers straight back.
> - **No fail state.** The lab is reps, not runs.
> - The **dev cockpit** (see BUILD_PILLARS "the two things people get wrong"): every feel
>   number on a key and on screen, a one-key NUMBERS DUMP printing the current tuning as one
>   pasteable line, force-spawn any single unit/raider, freeze + single-frame step, slow-motion,
>   a reaction readout in frames, no-fail toggle, instant reset, range/aggro overlay. All inside
>   `DEV:BEGIN` / `DEV:END` markers. **This game already has the best head start on the cockpit
>   in the repo** — `?dev=1` with live Enemy HP × / Enemy attack × tunables. Extend that, don't
>   rebuild it.
> - A **headless harness** (`node lane-harness.js`) driving the real update loop, so an agent
>   can prove a change without a human playing.
>
> **Status here: NO LAB YET,** and this is the game that needs it most, because it is the one
> with the largest roster (ZOMBIE / GRABBER / SPIKES vs KNIGHT / CLERIC / INCIN / THIEF). The
> question Pillar 1 asks is uncomfortable and worth asking: **is one zombie meeting one knight
> a good five seconds?** Everything above it — placement, synergy, bait, waves, levels — is
> content stacked on that single exchange. If that exchange is not readable and satisfying on
> its own, no amount of dungeon design fixes it.
>
> **Pillar 1 exits only when Mike says the one thing is fun.** An agent never certifies feel.
>
> **The roster ladder (BUILD_PILLARS section B).** Do not test all four raiders at once. Start
> with the one that asks the core question most purely — probably the KNIGHT, since tank+taunt
> is the plainest statement of "your unit must survive contact". Note that the teaching enemy is
> a deliberate design object and may have to be **invented after the fact** (the Goomba was built
> last and placed first); if no current raider teaches the exchange cleanly, build a plain one
> that does. Then add raiders **one at a time to the same lab**, playing each new pair before a
> third. Each must ask a **different question** — CLERIC asks "can you out-damage sustain",
> THIEF asks "can you cover a flank" — and any raider that is only more HP and more damage is a
> difficulty slider, not a raider. The ROOTQUEEN floor is the exam, built from questions already
> taught.
>
> **Pillar 2 — ONE IDEA, MANY PROBLEMS.** Every item below gets this filter before it is built:
> name the two-plus problems it solves. One problem is a patch.
>
> **Pillar 3 — THE FOUR-STEP TEACH.** Each mechanic gets four beats across the levels:
> introduce, develop, twist, conclude. The twist is a new angle, not a difficulty spike.

---

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

### Feature backlog (DR-#042 research)
1. ✅ **Treasure bait** (S) → DR-#054 — third build brush; greedy roles break formation, knight/cleric don't.
2. ✅ **Adjacency synergy** (S) → DR-#054 — zombie beside a grabber +30% dmg; trap beside a monster re-arms 45% sooner.
3. ✅ **Kill-combo bonus** (S) → DR-#054 — chain pays biomass, trap+monster mix pays double.
4. ✅ **Party intel** (S) → DR-#054 — roles named, party HP totalled, one actionable threat read.
5. ✅ **Morale & retreat** (M) → DR-#052 — the signature reverse-dungeon moment.
6. **Queen active abilities** (M) — root-slam AoE / terror scream on cooldown. **Mike to pick.**
7. **Room-purpose tiles** (M) — Nest (free zombie/wave), Larder (regen), Bone Pit (+essence). **Mike to pick.**
8. Partly done: per-level modifiers + veteran carryover shipped as DR-#053. Left: torch/darkness ambush bonus, monster fusion.

**Balance note carried by DR-#054:** adjacency synergy is the first direct answer to the standing
"spam one tower type and ride it to level 12" playtest failure — a bare Spitter line earns none of
it. Whether that is enough, or whether it still needs escalating per-duplicate cost, is a FEEL call
on the live build.

### Housekeeping
- Dormant dead code: doors (placeDoor/drawDoors/CFG.door), hedges, feast/mutate menu tangle — rip when convenient. **S**
- Meta (Mycelial Network) + boons still tuned for the old loop — revisit with balance. **M**
