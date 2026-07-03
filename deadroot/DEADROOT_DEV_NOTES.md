# DEADROOT — Dev Notes

Zombie-resistance tower defense for CrazyGames. Lore: humans nearly exterminated the
undead; the virus got smarter. You defend the Underground Hive — their dead are your
walls, weapons, and food. Built from the Gemini design session ("Project Outbreak"),
adapted to GAME_BIBLE standards (single-file, no assets, procedural canvas + WebAudio).

Live: https://michaelnocito.github.io/play-area/deadroot/
Local: C:\Users\Mike\Projects\GAMES\play-area\deadroot\index.html

## Core loop
Kill human → corpse drops at that tile (blocks pathing = organic mazing) → tap corpse →
spend Biomass to mutate a tower, OR let it rot 15s for a big Biomass payout. Bio-Sweepers
(yellow hazmat) target corpses and sanitize them (3s channel) — kill them for a bonus
corpse on the spot.

## DR-#001 — Full playable slice (2026-07-03)
- Grid 26×18, flow-field BFS pathing to central Hive; corpses/towers block tiles.
- Anti-boxing failsafe: if a corpse would seal the last path, it drops trampled (walkable).
- Enemies: Scavenger, Trooper (shield/armor, drench strips it), Incinerator (burns towers;
  detonates spore clouds = THERMOBARIC, damages humans — bait mechanic), Sweeper, Boss
  Purifier (wave 12, drops 3 corpses).
- Towers: Spitter 40 (acid, applies drenched −15% armor), Rootmass 50 (snare aura 60%),
  Spore 65 (DoT cloud, coats), Node 70 (+50% fire rate nearby).
- Synergy: snared + drenched target hit by Spitter → FERMENT ×2 damage.
- Economy: kill +6, decay payout 25 (× stack), corpse stacking on same tile.
- Campaign: 12 waves / 3 named assaults (Scouts, Purge, Extermination) → ending screen →
  ENDLESS unlock ("The Long Night", scaling waves). Death has identity ("Overrun on wave
  N — THE PURGE").
- Meta: DNA per wave cleared; Mycelial Network on death/victory screen (Rogue Legacy
  tally flow): Hive HP, start Biomass, decay payout, rot time, tower dmg, fire rate.
  ×2 cost per tier. Save deadroot_save_v1.
- Onboarding: run starts with 3 corpses by the Hive + biomass for one mutate; "TAP A
  CORPSE" scrawl; first wave holds until first mutation (or corpses rot). ≤1 input to play.
- CG SDK adapter (rooftop-sprint pattern), gameplayStart/Stop, interstitial on death,
  happytime on wave clear. Pause P + auto on tab blur; mute M persisted; DPR-scaled canvas;
  fixed 60Hz timestep. Pointer-only controls (AZERTY N/A).

## Critical test (Part 2)
- Why a 4th run? Mycelial upgrades + campaign to beat + endless after.
- What changes between runs? Corpse drop positions = every maze differs; meta tiers.
- Where's the ending? Wave 12 boss → "THE SURFACE IS SILENT" → endless unlock.
- Pitch: "Tower defense where the enemies ARE your towers — mutate their corpses before
  the cleanup crew steals them back."

## DR-#002 — Category B: depth & retention (2026-07-03)
Audit sorted improvements into 3 categories (A feel/juice, B depth/retention, C platform
compliance). Mike picked B. Three changes:
1. **Hive Mind actives** (progression that changes play, bible law #3): 3 new Mycelial
   unlock nodes — OVERGROWTH 60 DNA (all humans near-stopped 4s), FUNGAL BLOOM 80 (all
   corpses decay instantly for full payout), PHEROMONE 100 (6s: towers hunt Sweepers
   first +40% fire rate). Unlocked actives appear as bottom-left HUD buttons, 75s CD.
2. **Boon choices** (every run differs, law #5): after waves 3/6/9/11 (and every 3rd
   endless wave), prep pauses with "THE HIVE ADAPTS" — pick 1 of 2 run-only boons from
   a pool of 8 (acid dmg, slow rot, kill bounty, sweeper slow, cloud time, tower HP,
   root radius, instant biomass).
3. **Difficulty drama** (law #6 + #8): THE BUTCHER mini-boss punctuates wave 8 (520hp,
   cleaver silhouette, drops 2 corpses); named banners on phase starts + boss waves;
   Purifier siren; goal-gradient tease in prep ("2 waves to THE BUTCHER").
End-screen layout compacted to fit 9 meta rows (shared endLayout() for draw + hit).

## DR-#003 — Spawn-side onboarding (2026-07-03, Mike playtest feedback)
Wave 1 spawns from the RIGHT only (player learns the loop facing one front). Waves 2-4
add the LEFT ("THEY FLANK" banner). All four sides open at THE PURGE (wave 5, banner
sub says "from every direction"). Endless keeps all sides. Banners tell the player each
escalation (bible law #9: every mechanic has a visible tell).

## DR-#004 — 2x speed toggle (2026-07-03)
Fast-forward button bottom-right (›1x / »2x). Doubles the fixed-timestep updates per
frame so simulation stays deterministic (render fps unchanged). Resets to 1x on every
new run. Standard TD quality-of-life.

## DR-#005 — Mobile readability: big icons over text (2026-07-03, Mike feedback)
Researched mobile TD conventions (Bloons/Kingdom Rush): radial icon buttons, cost badges,
icon+number HUDs, almost no words. Applied:
- Mutate menu → 4 radial ICON buttons (40px-radius circles orbiting the corpse, N/E/S/W),
  each showing the tower's actual art + a pictogram tell (shot dots / roots / puffs /
  link sparks) + ◈cost badge. Affordable = green ring, not = dimmed. Range rings preview
  around the corpse while the menu is open. Field dims behind the menu. Zero desc text.
- HUD 56→72px: biomass droplet icon + 30px number (no "BIOMASS" label), hive icon + fat
  HP bar, big wave fraction "3/12", ◆DNA, 56px pause/mute touch targets.
- Ability buttons 48→68px, speed button 48→68px, SEND button 240×58 with countdown,
  popups 14→18px, onboarding cut to just "TAP A CORPSE ▼", goal tease now "2 ➜ THE
  BUTCHER". Boon cards 290×150 with bigger type. Meta rows widened/bumped.

## DR-#006 — Undefendable-gap fix: Hive Buds (2026-07-03, Mike design catch)
Corpse-only building left lanes with no recent kills impossible to defend, and the
starter corpses weren't on wave 1's spawn side. Fixes:
- Starter corpses now BOTH sit on the right lane (hive+3/+4), matching wave 1's east-only
  spawns from DR-#003.
- NEW: tap any empty tile → grow a BUD (◈60): a hive-grown purple sprout shooter (range
  2.8, rate 0.9, dmg 9) — weaker + pricier than corpse towers so corpses stay the
  economy, but no lane is ever unanswerable. Anti-box rule applies: if a Bud would seal
  the last path it's denied ("KEEP A PATH OPEN"). Buds block tiles, burn like other
  towers, count for first-mutate onboarding.

## DR-#007 — Wave 1-3 pacing ease (2026-07-03, Mike playtest)
Opening was overwhelming before the player could build/acclimate. Wave 1: 6 scavs @1.4s
→ 4 @3.0s (a readable trickle, still pressure). Wave 2: 9 @1.1 → 7 @1.8. Wave 3: 8 @1.0
→ 8 @1.3, sweepers 5s → 6s apart. Waves 4+ untouched — the ramp starts once the player
knows the loop.

## Backlog / next
- DR-#002: Mike playtest + tuning pass (wave pacing, costs, sweeper pressure).
- Rewarded ad hook (e.g. revive Hive at 25% once/run, or double DNA on tally).
- Tower upgrades (tier 2 mutations), more synergies (spore+spitter ignite?).
- Daily trial modifier, per-wave intro banners, better boss telegraphs.
- Mobile QA on live URL; SDK verify vs current docs before submission.
