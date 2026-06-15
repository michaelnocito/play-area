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

## Rune Reading shapes the run (RD-#024) — replaces the personal Forecaster
**Pivot (Mike):** the old self-diagnosis "Forecaster" (daily/weekly/Norns life-reading) was
RETIRED in #024/#025 — "AI apps do that better." The runes now teach you to *read* them by
shaping the road ahead.
- **Learning-science anchor = GENERATION EFFECT** (predict before reveal) + dual-coding (meaning
  + felt gameplay effect). Honors "learn to read, not self-diagnose."
- **Flow:** pick a realm → `openReading(realm)` → völva casts 3 runes face-up on the cloth →
  tap one to READ it (predict its meaning, 3 choices) → reveal teaches the meaning + the omen →
  "Walk this path" applies the omen and `startRun`. "Read another" lets you study the others.
  Wrong answers still teach (no mastery credit, no block). "Run Again" re-reads each run.
- **`RUNE_OMEN[id]`** = `{glyph,name,read,omen,desc,fx}`. `fx` primitives applied across
  `startRun`/`cfg`/`endRun`/foe-shatter: `essMul` (Sowilo 1.5 / Hagalaz 2.0), `speedMul`
  (Raidho 1.12 / Isa 0.85), `twin` (Wunjo), `startShield` (Algiz), `noShield` (Hagalaz),
  `killBonus` (Tiwaz +6/shade), `glide` (Laguz softer soar), `gateBonus` (Dagaz +40 on clear).
- **Mastery:** `save.runeMastery[id]` = correct reads; reading screen shows "Runes you can read: N/9";
  `pickReadingRunes()` biases toward least-read runes (light spaced practice). Intro card now
  shows the chosen omen (replaced the old "IF THIS RUNE APPEARS IN YOUR LIFE" text).
- **Monetization rethink (TODO):** the ad/Amber hook should become **re-cast the omen** (reroll
  the modifier — Balatro/Hades reroll). Phase-2 ideas: 2-3 rune spreads (combined omens), richer
  *visual* omens (weather/density), lore gallery, mastery rewards.
- Note: `RUNE_LORE[id].lifeMeaning` fields are now dead data (kept, inert) — purge later.

## Session log RD-#014 → #019
- **#014** mobile foundation + ad hooks (`Ads`/`window.adProvider`) + 9-realm scaffold (SAVE_KEY v2)
- **#015** adaptive Norse audio · **#016** Amber + Provisions · **#017** Rune Forecaster
- **#018** mobile-freeze hardening (persist try/catch + on-screen error bar)
- **#019** Norns' Spread cohesive-sentence reading
- **#020** Hero unlocks — cosmetic völva reskins (Völva/Berserker/Thor/Odin), ad-OR-Amber
- **#021** Menu screens scroll + `justify-content:safe center` — tall text screens (Shrine/
  Realm/Forecaster) no longer clip Back/nav buttons off-screen on short windows
- **#022** Run pace +22% (`runSpeed` 3.42 px/frame = ~205 px/s @ realm 1, was ~168; dropped
  RD-#013's 0.85 dampener) + **rune-casting animation** (`castRunes`): drawn stone(s) tumble
  from the hand and land on the seer's cloth (CSS `#s-cast` screen) before the reading shows.
  Wired into the daily draw (1 stone) + Norns' spread (3 stones); tap-to-skip; `Snd.land` thud
  per stone + `Snd.coin` on reveal.
- **#023** Combat reshape: **Rune Bolt** freezes a shade on the 1st hit (`f.frozen`, drifting
  stops, ice-crystal `drawFrozenFoe`), **shatters** it on the 2nd (kill + 5 amber). A frozen
  shade is a safe **stepping-stone** — descending onto it bounces you (`vy=jumpV*0.78`); side
  contact is harmless. Unfrozen shades still damage. Attack renamed **Rune Bolt** everywhere
  (teach prompts, title hint, intro overlay, Shrine upgrade). New onboarding teach card.
- **#024** **Rune Reading shapes the run** (read-to-choose pre-level omen) — see section above.
- **#025** Removed the retired Forecaster (–382 lines: JS, markup, CSS, `RUNE_READING`/`RUNE_GROWTH`).

## Heroes (RD-#020) — cosmetic völva reskins
- **Cosmetic only** (same hitbox/powers). `HEROES` table = `{id,name,lore,cost,pal}`;
  `pal` = `{cloakTop,cloakBot,hood}` swapped into `drawPlayer` (aura stays realm-hued).
- 4 skins: Völva (free/default), Berserker (60), Thor's Chosen (120), Odin's Eye (200).
- Unlock = **Amber OR one rewarded ad** (`unlockHero`); `equipHero` sets `save.hero`.
- Save: `save.hero` (equipped id) + `save.heroes` (unlocked ids, default `[0]`). Shrine
  "⚔ Heroes" section between Provisions and Sound Forge (swatch chip + Wear/Ad/✦ buttons).

## Next ideas (backlog)
- Checkpoint system (totem mid-run, respawn from CP, lore card) for Act 2-3 realms.
- Flesh out stub realms Hagalaz(3)/Isa(4)/Algiz(5)/Tiwaz(6)/Laguz(7)/Dagaz(8) with real layouts.
- Mobile/deploy when Mike returns: make repo public → GitHub Pages; add landscape hint.
- Give daily/weekly the richer "reading" voice; lore gallery; Tarot clone; Godot port.

## Local serve
`npx serve -p 4209 .`  (preview config: launch name `rune-dash`, port 4209)
