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

## DR-#008 — Flesh Wardens replace Buds (2026-07-03, Mike direction)
Monsters, not plants. Purchasable Bud removed entirely (no more empty-tile build menu).
Instead every run STARTS with 4 free Flesh Wardens, one per cardinal direction (N/S/W/E
tiles 12,3 / 12,14 / 6,9 / 19,9): big overweight chain-swinging undead brutes (150 HP,
chain sweep hits ALL humans within 1.7 tiles, 16 dmg @0.8/s). They block their tile,
can burn down, and guarantee each lane can kill an easy unit before corpse towers exist.
Visual: stitched belly, hood eyes, orbiting chain ball that whips fast on swing.

## DR-#009 — Category B finish: tier-2 upgrades, daily trial, CORRODE synergy (2026-07-03)

### Tier-2 tower evolution (tap an existing tower to evolve)
Tap any non-warden tower that hasn't been upgraded → EVOLVE button appears above it (single
radial button, purple badge with tier-2 name + cost). Purple "2" dot marks evolved towers.
- GEYSER (Spitter ◈80): shots splash acid on hit — half-damage + drench in 1.5-tile radius.
- STRANGLER (Rootmass ◈90): snared enemies inside the aura take 8 dmg/s crush DoT.
- BLIGHT (Spore ◈100): clouds grow 50% wider and coat intensity doubles (3.0 vs 1.5).
- OVERMIND (Node ◈110): link radius expands to 2.4 tiles; linked towers also get +25% dmg.

### Daily Trial (title screen button)
"DAILY TRIAL" button on title shows today's forced hostile modifier (red) + helpful modifier
(green) + "DNA ×1.5". Mods are date-derived (rotate every day, no RNG needed). Hostile: +25%
enemy HP / +20% enemy speed / corpses rot 5s faster. Helpful: +4 kill bounty / towers +40 HP /
+50 starting biomass. DNA per wave cleared is ×1.5 (ceiling). Daily best wave tracked per day
and shown on the button ("today: wave N"). Normal tap still starts a standard run.

### CORRODE synergy (new: acid + coat + drench = armor strip)
When a Spitter (or GEYSER splash) hits a target that is already both coated (in a spore cloud)
AND drenched (previously hit by acid), that enemy becomes CORRODED for 3s: all armor stripped
while corroded. Visual: yellow-green glowing ring. Popup "CORRODE!" on trigger.
Existing synergies preserved: FERMENT (snare+drench → ×2 dmg), THERMOBARIC (incin+cloud →
explosion), drench strips 15% armor.

### Implementation notes
- run.enemyHp / run.enemySpd multipliers wired into spawnEnemy() — daily hostile mods apply.
- FULL LARDER daily helpful now correctly adds biomass (was empty apply fn, now fixed).
- towers carry tier:0/1 field; menu guards t.tier===0 before offering evolve.
- menu.tower clears on tower death. menuAnchor/menuOpts/drawMenu handle both corpse and tower
  menu types cleanly.
- BLIGHT cloud stores coat intensity in cl.coat field; cloud loop uses Math.max to not
  downgrade intensity from overlapping clouds.

## DR-#010 — Category A: feel & juice (2026-07-03)

### Hit-stop (freeze frame on big kills)
Boss kill = 4-frame freeze; Butcher kill = 3 frames; THERMOBARIC explosion = 3 frames.
Implemented in frame(): when hitStop>0, decrement and call draw() only — update() skipped.
Simulation stays deterministic; no clock drift.

### bigBurst (big-moment particles)
New bigBurst(x,y,col,n): particles with speed 80–280 (vs 30–120 for burst), lifetime 0.7–1.2s,
rendered at 7px squares (vs 3px). Alpha fades slower (×1.4 vs ×2.5). Used on Boss (32+18
two-tone particles), Butcher (24), and THERMOBARIC (two bigBurst calls).

### Wave-clear slow-mo
After every wave repelled: slowMoT=0.45s, timeScale=0.15. acc increments at 15% speed for
0.45 real seconds, then snaps back. Gives a breath/punctuation beat between waves. Does not
affect perfNow (animations still run at normal speed).

### Screen-edge red pulse
edgePulseT=1.0 on every Hive hit; decays at 2.5/s in frame() (gone in ~0.4s). Rendered as
a radial gradient from transparent center to rgba(210,40,40) at edges. Additionally: while
mode is play/prep and HP < 30%, a persistent breathing pulse (sin wave, 0–0.18 alpha) keeps
the edges red. Flash and persistent pulse take the max so they don't conflict.

### Bass drone
Persistent sawtooth OscillatorNode at 55Hz. Lazily created on first updateDrone() call once
AudioContext is ready. Gain = 0 above 60% HP; rises linearly to 0.12 at 0 HP (setTargetAtTime
with 0.8s time constant for smooth interpolation). Stops on gameOver/victory via stopDrone().
Silent when muted (gain target = 0). Recreates itself on next run via lazy init.

## DR-#011 — 30-improvement completeness pass / v1.1 (2026-07-03)
v1.0 tagged in git at DR-#010 HEAD. DR-#011 is v1.1.

### Feel & Juice
- **Tower cooldown arc** — white reload arc on shooter towers (Spitter/Spore/Warden)
- **Warden impact ring** — expanding yellow ring pulse on chain swing
- **Wave-start flash** — 0.15s white screen flash when a wave begins (waveFlashT)
- **Corpse tap ring** — expanding green ring + burst on corpse tap before menu opens
- **Acid projectile trail** — 45% chance per frame of yellow-green trail particle on Spitter shots
- **Tier-2 tower glow** — soft purple aura (pulsing alpha) behind evolved towers
- **Enemy speed streaks** — Scavengers draw two ghost circles behind them along the flow vector
- **Tension drone layer** — second oscillator (sine 110Hz) joins below 25% HP, fades to 0.05 gain

### Gameplay / Depth
- **Last enemy pulse** — red pulsing ring around the final enemy when spawn queue is empty
- **Boss HP bar** — full-width labeled bar at bottom of screen during boss/butcher waves
- **Enemy HP tint** — dark-red overlay tint builds as enemy HP falls below 50%
- **Node link lines** — pulsing purple dashes from Node towers to all buffed towers in range
- **Kill combo FRENZY** — 3+ kills in 1.5s shows "×N FRENZY!" popup (comboT/comboN)
- **Ground death stains** — fading enemy-colored ellipses where kills happen (max 20, 5s lifetime)
- **Sweeper interception** — killing a Sweeper mid-sanitize (chanT>0) gives +30 biomass + "INTERCEPTED!"
- **Tower salvage** — tap an evolved (tier-1) tower: SALVAGE button returns 40% of tier-2 cost
- **Big hit damage numbers** — floating yellow number popup on hits dealing ≥30 damage

### Retention / Depth
- **UNSCATHED bonus** — if Hive takes 0 damage in a wave: +3 DNA + "UNSCATHED" popup
- **UNBROKEN streak** — noHitWaves counter; at 3+ consecutive no-damage waves: banner + note
- **Kill milestone banners** — every 25 kills this run shows "N ELIMINATED" banner
- **First-sweeper banner** — first Sweeper spawned shows "SWEEPERS SANITIZE CORPSES — KILL THEM"
- **Prep screen lore** — LORE[] array of 12 flavor lines rotating slowly on prep screen bottom
- **Boon card hover highlight** — card brightens + border thickens when pointer is over it
- **Endless DNA ×1.2** — endless wave gains now Math.ceil(wn×1.2) instead of flat wn

### Stats / Info
- **Wave clear time** — seconds appended to wave-clear popup ("WAVE 5 REPELLED +5 DNA  12s")
- **Kill counter HUD** — small ⚡N count below biomass number during play/prep
- **Run stats on end screen** — kills / towers built / peak biomass shown above Mycelial Network
- **Biomass spend popup** — "-X◈" popup on mutate and tier-2 evolve

### Polish
- **Hive throb acceleration** — hive pulses 7× faster when HP < 25% (from 2.2×)
- **Enhanced title animation** — 22 animated root vein curves on the title screen
- **Pointer tracking** — mousemove + touchmove update ptrX/ptrY for hover effects

### New state variables added
comboT, comboN, noHitWaves, waveStartHP, waveT, waveFlashT, stains[], rings[],
killsThisRun, towersBuiltThisRun, peakBiomass, seenSweeper, ptrX, ptrY,
droneNode2, droneGain2

## DR-#012 — Tower graphics overhaul (2026-07-03)
Mike: "too hard to figure out what tower does what — simplify mechanic + visuals."
Research: JF cartoon pass (chunky outlines, distinct silhouettes, behavior tells in art).

### 20 changes shipped
**Silhouettes (5):** Spitter = organic acid sac + protruding proboscis tube; Rootmass =
4 curved bezier claw arms + knotted core; Spore = mushroom (dome + wide brim + stem);
Node = 6-point crystal star spire; Warden = wider stitched torso outline.

**Cel outline (1):** All towers draw a dark outline before fill, popping off dark bg.

**Behavior tells (4):** Spitter acid drip animates at proboscis tip (sin oscillation);
Rootmass arms rotate (grabbing motion); Spore emits 3 rising puff particles (always
drifting up = cloud tell); Node pulses 2 expanding signal rings (broadcast tell).

**Color system (3):** TCOL palette — unique hue per type (acid lime / bark brown /
emerald / violet / sickly green). Tier-2 shifts body color: GEYSER=teal, STRANGLER=
dark-brown, BLIGHT=sickly dark, OVERMIND=bright violet. HP bars use tower accent color.

**Tier-2 art (3):** GEYSER adds splash ring at tip; STRANGLER adds 5th arm + barbed
hooks; BLIGHT darkens cap; OVERMIND adds crystal spire above star. Tier badge removed —
art carries the signal. Aura glow uses tower accent color.

**Menu UX (4):** Per-tower colored background per option; role label inside button
(ACID/SNARE/SPORE/LINK); affordable options pulse with green shimmer ring; range preview
ring uses tower color; node range ring now shown.

### New
- `TCOL` constant (palette per tower type)
- `drawTowerArt(type, tier, pulse, isIcon, swing)` — unified renderer
- `drawTowerIcon` is now a thin wrapper around `drawTowerArt`

## Backlog / next (v1.1 → submission)
- **Category C (before submission):** rewarded ad SECOND WIND hook, CG SDK verify,
  mobile QA full playthrough on live URL, corpse rot timer / Sweeper sanitize tooltip.
- Playtest pass on DR-#011/012: salvage balance, UNSCATHED frequency, combo feel,
  boss bar positioning, damage number spam threshold, tower readability QA.
