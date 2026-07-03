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

## Backlog / next
- DR-#002: Mike playtest + tuning pass (wave pacing, costs, sweeper pressure).
- Rewarded ad hook (e.g. revive Hive at 25% once/run, or double DNA on tally).
- Tower upgrades (tier 2 mutations), more synergies (spore+spitter ignite?).
- Daily trial modifier, per-wave intro banners, better boss telegraphs.
- Mobile QA on live URL; SDK verify vs current docs before submission.
