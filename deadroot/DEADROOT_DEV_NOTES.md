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
- **DIFFICULTY — Mike's playtest 2026-07-06 (2 tracker fails, triaged to roadmap):**
  (1) "Too easy: spam Spitters early and ride them to level 12 — no need for other
  tower types; we need to encourage strategic use of towers in type, quantity and
  placement." (2) "Engaging and novel but easy to figure out how to win — maybe start
  with a random maze pattern each level for variety."
  Both land on the NEXT planned slice: corpse-maze/hedge-maze pathing so placement =
  strategy, PLUS per-level randomized maze variation (already roadmapped after
  DR-#023/#024's fixed labyrinth), PLUS an economy/balance pass that punishes
  single-tower spam (e.g. escalating cost per duplicate tower type, armor/resist
  enemy types that hard-counter Spitter-only, or FEAST devour pressure). Fold the
  balance work into the maze slice so difficulty is tuned against the new pathing,
  not the old open field.
- Playtest pass on DR-#011/012: salvage balance, UNSCATHED frequency, combo feel,
  boss bar positioning, damage number spam threshold, tower readability QA.
- Remaining Category C: mobile QA full playthrough on live URL.
- Human eyes still needed: does the portrait rotate-hint read well; is squeezed
  mobile play (viewScale≈0.36 on a 375px phone) actually comfortable now that
  touch/tap targets are padded/radius-searched — a bigger fix (portrait
  camera/pan) is still open. Also: does the audio compressor actually sound
  right (can't verify by ear headlessly); does the reduced-motion path actually
  feel calmer (can't force prefers-reduced-motion in headless testing either).

## DR-#018 — Drastic graphical upgrade: environment, story frame, cartoon pop (2026-07-04)
Mike: "needs a drastic graphical upgrade... too sparse... align with the story (humans
from wooded borders), real objects like trees + permanent structures, must pop and be a
little goofy." Researched 2D depth technique (layered parallax, contact shadows as the
AO analog, vignette + warm color grading, cartoon cel outlines + wobble). 20 upgrades,
10 of them environment/level (non-enemy, non-player):

**Environment / level (10):**
1. **Wooded border treeline** — ~108 lumpy cel-outlined cartoon trees hug all four edges
   + denser corner thickets. This is the treeline the extermination squads emerge from.
2. **Ground radial gradient** — warm cultivated soil near the Hive fading to cold dark at
   the wooded rim (depth + "underground clearing" read; replaced the flat #0b0e10 fill).
3. **Abandoned human structures** — 5 hand-placed ruins telling the invasion story: leaning
   watchtower, tilted ☣ quarantine sign, sandbag barricade, wrecked army jeep (fungus
   reclaiming it), floodlight pole w/ cone.
4. **Bioluminescent mushrooms** — teal/violet glowing 'shroom clusters ringing the Hive's
   cultivated territory.
5. **Bone piles** — skulls + crossed bones from past sieges, count grows with lifetime
   plays (graveyard-fortress flavor; `save.plays`).
6. **Ambient spore motes** — 26 drifting glowing motes (live foreground parallax layer).
7. **Low drifting fog** — 7 soft fog banks creeping along the edges (background parallax).
8. **Invasion trails** — worn dirt paths marching in from the *currently open* spawn sides
   toward the Hive (reads live from waveIdx, so it escalates with the flanking waves).
9. **Contact shadows** — soft ground shadows under trees/structs/shrooms/corpses/towers/
   enemies (the 2D ambient-occlusion analog; grounds everything + adds pop).
10. **Painter's depth sort** — all ground decor y-sorted so nearer objects overlap farther.

**Enemy / player / effects (10):**
11. Enemy contact shadows. 12. Cel outlines on every enemy silhouette. 13. Walk-bob
squash-&-stretch shamble (gentler for bosses; motion-gated). 14. **Googly eyes** on the
humanoid grunts, pupils nervously tracking the Hive. 15. **Hive overhaul** — breathing
bioluminescent glow, writhing tendrils, pulsing core sacs, a big cyclops eye that tracks
the nearest enemy and occasionally blinks, cel outline, reddens when hurt. 16. Tower
contact shadows. 17. Spawn poof (grunt shoves out through the treeline). 18. Projectile
glow + comet trail + highlight. 19. Goofy death: deflate-puff ring on kill. 20. Corpse
redesign — an actual sprawled body (torso + splayed arm + head + X-eyes) that greens as
it rots into biomass.

**Perf (important):** the 20-item-heavy environment initially cost ~43ms/frame under the
preview's software renderer (would hurt Mike's weak UHD620 + mobile). Fixed by **baking
the static decor** (trees/structs/shrooms/bones) to an offscreen canvas once per run and
blitting it — dropped drawEnvironment to 0.06ms and full-frame draw from 77ms → ~1ms. The
bake freezes tree sway / shroom-glow pulse, but live motion is carried by motes, fog, the
Hive, trails, projectiles, and enemy bob, so the scene still moves plenty. `contactShadow`
+ the four decor draws take an optional target-context arg so they can render to either the
main canvas or the bake buffer.

**Verification note:** preview_screenshot AND canvas→dataURL image return were both broken
this whole session (repeated 30s timeouts / API-rejected image). Verified instead by (a)
draw() running clean across a 15k-tick regression covering every game state + entity type,
and (b) direct canvas pixel-sampling: trees confirmed framing all edges, Hive-glow center
brighter than the vignetted corners, warm gradient soil. **Mike should eyeball the live URL**
— the "does it actually pop / feel goofy" judgment can't be made headlessly.

## DR-#017 — CrazyGames-acceptance hardening batch #3 (2026-07-04)
Third guideline audit pass. By this point the easy/obvious gaps from DR-#015/#016
were gone, so this batch skews toward: closing the last Category C backlog item
(corpse-rot tooltip), teaching-tell polish, a real pause menu, and defensive
robustness. **Found and fixed a real bug introduced by this same batch**: the new
`hitPad()` had no upper bound, and under a degenerate/very-small `viewScale` it
inflated to the point where the pause and mute buttons' padded hit-regions covered
almost the entire screen, swallowing every tap. Caught via headless regression
(corpse-tap test came back with `menu` unexpectedly null) — capped `hitPad()` at
80px and added neighbor-aware padding caps (half the gap to the next button) on
the new pause-menu buttons so adjacent buttons can't swallow each other's taps
even at the cap. Relanded and re-verified all of the below headlessly: parse-check,
draw() on every tick of a 15k-tick regression, corpse/evolve tip triggers, pause
menu (resume/restart/quit) via real tap coordinates, title mute button, and a
mocked-async rewarded-ad double-tap race (confirmed only 1 SDK request fires).

**Category C, closed:**
1. **Corpse-rot tooltip** — one-time nudge (first-ever run only, `save.seenRotTip`)
   pointing at a corpse's rot ring with "the green ring = rot timer / let it empty
   for biomass, or mutate now." Fades in/out over ~9s.
2. **Evolve tooltip** — one-time nudge (`save.seenEvolveTip`) after the player's
   very first tower is built: "tap a tower again to EVOLVE it" — the tier-2 system
   from DR-#009 previously had no in-fiction teaching moment at all.

**Menus should stop the SDK's "gameplay" clock (bible: "menus... = stopped"):**
3. `offerBoons()`/`pickBoon()` now bracket the boon-choice screen with
   `CG.gameplayStop()`/`gameplayStart()` — it's a decision menu, not active play.

**Real pause menu (was tap-anywhere-to-resume only):**
4. RESUME / RESTART / QUIT buttons replace the single "tap to resume" — RESTART
   calls `newRun()` directly from pause, QUIT returns to the title screen. Tapping
   elsewhere on the pause overlay now does nothing (previously any tap resumed,
   which could double as an accidental menu click right after unpausing).

**Platform/SDK robustness:**
5. `CG.init` now races the real SDK init against a 4s timeout — a hung/broken SDK
   can no longer block first paint ("fast load is a feature").
6. `takeSecondWind`'s async callbacks wrapped in try/catch, and a new `awaitingAd`
   flag blocks a mashed WATCH-AD button from firing a second concurrent rewarded-ad
   request — verified with a mocked async SDK that resolves after a delay.
7. `window.addEventListener("blur", ...)` auto-pauses alongside the existing
   `visibilitychange` handler (some desktop alt-tab cases don't fire the latter).

**Accessibility — `prefers-reduced-motion`:**
8. Screen-shake magnitude halved (`shakeIt`).
9. Hit-stop freeze-frames skipped entirely (`setHitStop` helper).
10. The persistent low-HP "breathing" edge-pulse is disabled (the one-shot hit
    flash still fires — only the continuous flashing loop is motion-gated).

**Mobile / input robustness:**
11. `hitPad()` capped at 80px (see the bug note above) — was unbounded.
12. Corpse/tower tap-radius, boon cards, and Second Wind buttons now all route
    through the same padding helper for consistency (previously only some did).
13. Radial mutate-menu buttons (`menuHit`) padded the same way.
14. Debounce: a `mousedown` within 350ms of the last `touchstart` is ignored, so
    hybrid touch+mouse devices can't double-activate on one physical tap.
15. `viewScale` clamped to a 0.05 floor so a pathological viewport can't collapse
    the canvas to 0×0.
16. A second `resize()` fires 300ms after load (some mobile browsers report the
    wrong `innerHeight` before the URL bar collapses).
17. `overscroll-behavior`/`user-select`/`-webkit-touch-callout` CSS plus a
    `contextmenu`/`dragstart` prevent-default on the canvas — no browser chrome
    (long-press menu, text selection, image-drag ghost) can appear over the game.

**Player-facing polish:**
18. Title screen gained its own mute button (previously only reachable via the M
    key or the in-run HUD, which doesn't render on the title screen).
19. Title screen now shows total banked DNA and a "N/8 mutations found" lifetime
    completionist counter (`save.boonsSeenEver`) once a player has bested wave 1.
20. Next-wave enemy preview during prep (small colored dots + counts) — the player
    used to only see a named-moment tease ("2 ➜ THE BUTCHER"), never what's
    actually coming next wave-to-wave (bible law #8: player always knows what's
    next).
21. End-screen stats line now also reports towers evolved this run
    (`towersEvolvedThisRun`), not just built.
22. Desktop: Enter/Space now also sends the wave early from prep and starts a run
    from the title screen (previously only worked on the death/victory screen).
23. `<meta name="theme-color">` and canvas `role="img"`/`aria-label` for baseline
    platform/screen-reader hygiene.

Also fixed the meta viewport/aria niceties from earlier this session and reused the
`hitPad`/`pickBoon` helpers to avoid duplicating logic across mouse, touch, and
keyboard input paths.

## DR-#016 — CrazyGames-acceptance hardening batch #2, 12 more fixes (2026-07-04)
Re-ran the guideline audit a third time (GAME_BIBLE Parts 1/2/4) looking past what
DR-#014/#015 already covered. Verified headlessly via preview_eval: parse-check,
mocked-SDK ad-cooldown timing, master-compressor node creation, mobile-viewport
corpse/tower tap-radius hit tests (near-miss hits and far-miss non-hits), keyboard
digit-key boon/ability shortcuts, Enter-to-restart, particle hard-cap, and a full
15k-tick endless regression sweep.

1. **Interstitial ad-frequency cooldown** — `CG.interstitial` now no-ops (calls
   `done()` without requesting an ad) if under 45s since the last one. Stops rapid
   repeat deaths (e.g. declining Second Wind on wave 1 over and over) from
   spamming ads, which reads as a dark pattern and risks CG's own ad-frequency
   review.
2. **Master audio compressor** — every oscillator/noise/drone voice now routes
   through one `DynamicsCompressorNode` (`dest()`) instead of straight to
   `AC.destination`, so overlapping SFX (hive hit + combo + hit-stop) can't clip.
3. **Meta description + OG tags** — head previously had only a `<title>`; added
   an honest one-line description and OG title/description (bible: "the game is
   honest about what it is").
4. **`overscroll-behavior:none` + canvas `touch-action:none`** — iOS Safari
   rubber-band/bounce-scroll safeguard so a stray swipe near the viewport edge
   can't shift the page under the canvas mid-run.
5. **Particle hard cap** — new `addParticle()`/`MAX_PARTICLES=500` gate on all 4
   particle-push sites; a worst-case pile-up (boss death + frenzy combo + hive
   hit at once) can no longer spike the array unbounded and tank frame time.
6. **Device-adaptive input wording** — `IS_TOUCH`/`TAP_WORD`/`tapWord` detect
   touch capability once; all 4 "TAP..." strings (onboarding, pause, title,
   prep hint) now say CLICK on desktop, TAP on touch (bible UX law).
7. **Corpse/tower tap target widened to a real radius search** (the most
   important fix this round) — tap detection was exact-tile lookup, meaning at
   375px mobile (viewScale≈0.36) the actual core interaction — tapping a corpse
   — had a ~14px hit zone. Replaced with nearest-corpse/tower-within-radius using
   the same `hitPad()` padding as the HUD buttons; verified a tap 15px off dead
   center at mobile scale now still hits, while a tap far away correctly misses.
8. **Keyboard boon + ability shortcuts (desktop)** — digit keys 1-4 pick a boon
   when the choice screen is up, or fire the matching Hive Mind active otherwise.
9. **Enter/Space restarts from the death/victory screen** — desktop convenience,
   skips hunting for the tap zone; verified over→prep via a real KeyboardEvent.
10. **Defensive `hasAdblock` check** — now handles the SDK exposing it as either
    a boolean property or a method, since the exact shape can't be confirmed
    without the live SDK.
11. **Boon-card keyboard hints** — small "[1]" "[2]" "[3]" labels on boon cards
    (desktop only) so the new shortcut in #8 has a visible tell, not a secret.
12. **Ability-button keyboard hints** — same treatment, small digit label in the
    corner of each Hive Mind ability button (desktop only).

## DR-#015 — CrazyGames-acceptance hardening batch, 12 fixes (2026-07-04)
Re-ran the guideline audit (GAME_BIBLE Parts 1/2/4) and built all 12 findings in one
pass. Verified via preview_eval (headless; screenshot tooling unavailable again this
session) — parse-check, full playthrough loops, mocked-SDK adblock/error/success
paths, and a 375×812 mobile-viewport hit-target check.

1. **Adblock detection wired** — `CG.hasAdblock()` checks `SDK.ad.hasAdblock` before
   any rewarded-ad request; if blocked, skips straight to the fail callback instead
   of calling an ad that can't show.
2. **`loadingStart`/`loadingStop` now actually called** — bracketed around
   `CG.init()`'s success path (previously defined but dead code).
3. **Rewarded-ad failure is explained, not silent** — `takeSecondWind`'s fail
   callback now carries a reason ("adblock" vs "error"); the death screen appends
   "(Second Wind ad unavailable...)" instead of just vanishing the option.
4. **Second Wind HUD tell** — small pulsing shield glyph next to the Hive HP bar
   during play/prep whenever a revive is still banked this run (law #9: every
   mechanic needs a visible tell, not a surprise).
5. **Daily streak + return bonus** — `save.dailyStreak`/`lastDailyDay` track
   consecutive calendar days; `dailyStreakMult()` adds +5%/day up to +30% DNA on
   top of the existing ×1.5, shown on the title screen's Daily Trial button
   ("🔥 N-day streak"). Closes the "retention hooks need a streak" gap (law #11).
6. **Colorblind-safe status tells** — drench is now a droplet triangle (was a
   plain dot), corrode is a ring **plus radiating crack ticks** (was a plain ring)
   so acid/corrosion read by silhouette, not just hue, alongside the existing
   snared half-arc.
7. **Portrait rotate hint** — non-blocking bottom banner ("↻ rotate for a bigger
   view") appears for 5s whenever the viewport is portrait and narrow (<700px);
   never gates play, just nudges. Paired with an `orientationchange` listener
   (previously only bare `resize` was wired) so it also fires on device rotation.
8. **Minimum touch-target floor** — new `hitPad(size)` pads a button's hit box in
   logical space so its on-screen tap target never drops below ~44 real px,
   applied to mute/pause/speed/ability buttons. Verified: at 375px-wide mobile
   (viewScale≈0.36) a 56px button's effective on-screen tap area is now the full
   44px instead of ~20px.
9. **End-screen Second Wind transparency** — death screen now notes "🛡 Second
   Wind used" when it was, alongside the ad-unavailable note when it wasn't.
10. **Endless boss variety** — every 3rd endless wave alternates Purifier/Butcher
    (`Math.floor(n/3)%2`) instead of always spawning the Purifier, so long endless
    sessions don't repeat one silhouette forever.
11. **Boon variety on long sessions** — `run.boonsUsed` tracks picked boon ids;
    `offerBoons()` prefers boons not yet seen this run (falls back to the full
    pool once exhausted), and endless waves past `endlessN>=9` offer **3** choices
    instead of 2. `boonCards()`/`drawBoons()` made card-count-agnostic to support it.
12. **Fixed a dead scaling bug + spawn-count cap in endless** — `endlessWave()`
    computed a difficulty multiplier `s` that was never actually applied anywhere;
    endless was scaling danger purely through enemy *count*, which both trivializes
    per-enemy difficulty and risks runaway spawn-queue growth at high endlessN.
    Now: enemy counts are capped at `n=40` for spawn-queue/perf safety, and
    `run.endlessHpMult`/`endlessSpdMult` (set in `queueWave`, +15%/+5% per
    endlessN) apply real per-enemy stat scaling instead, matching bible law #6
    (difficulty is drama, not a treadmill of pure numbers).

## DR-#014 — Rewarded ad SECOND WIND (2026-07-04)
On Hive death (hiveHP<=0), if not a daily run and not yet used this run: instead of
ending, mode="secondwind" pauses sim and shows "THE HIVE FALTERS" overlay with two
buttons — WATCH AD (revives at 25% max HP, resumes "play", CG.gameplayStart()) or NO
THANKS (proceeds to normal gameOver()). Once per run (secondWindUsed flag, reset in
newRun()). Daily runs excluded to keep the leaderboard/best-wave comparison clean.
- CG adapter: added `CG.rewarded(done,fail)` → `SDK.ad.requestAd("rewarded",...)`;
  offline/no-SDK fallback calls `done()` immediately (same no-op-succeeds pattern as
  interstitial) so local testing exercises the full revive flow.
- If the rewarded ad errors, falls through to gameOver() as if declined.
- Verified via preview_eval (headless, since preview_screenshot was unavailable this
  session): forced hiveHP=1→gameOver() routed to "secondwind"; WATCH tap → hiveHP=25,
  mode="play", secondWindUsed=true; second death after use → routes straight to
  "over"; NO THANKS tap → routes straight to "over".
- Added `deadroot` entry to global `.claude/launch.json` (port 4216, serves the
  deadroot folder directly) since play-area's dev-server port was occupied by
  another session.

## DR-#019 — one-shot cardinal wardens + in-game DEV MENU (2026-07-04, Mike playtest feedback)
Feedback came in via the playtest tracker (deadroot DR-#001 run marked "Nothing freezes or
traps you" = fail): normal mobs slipped past the undefended side; Mike wanted the cardinal
wardens to reliably answer normal mobs, keeping perimeter awareness on the player.
- **Warden one-shot**: `CFG.towers.warden.dmg` 16 → 32, so a chain-sweep one-shots a 30hp
  scav the instant it enters range. Bigger enemies (troop/butcher/boss) still take multiple
  hits. Player must still watch the perimeter (chosen over auto-converting kills to free
  towers, which would trivialize the mutate economy).
- **DEV MENU (new reusable system, now mandated in GAME_BIBLE Part 5)**: in-game debug menu
  gated behind `?dev=1` (+ auto-on localhost), wrapped in `DR-#019 DEV:BEGIN..END` markers so
  the pre-launch build strips it (dev version stays in git). Toggle with the `⚙ DEV` button
  or the ` / ~ key. Knobs: warden fire rate / damage / range (live sliders → CFG), game speed
  1x/2x/4x, hive god mode, show tower ranges (debug-draw), +100 biomass, spawn scav, skip
  wave, kill all. Nothing in the block is load-bearing — real play runs identically without it.
- Verified in preview (?dev=1): DEV=true, sliders write CFG live (warden rate → 2.5),
  god/ranges toggle, +100 biomass works, no console errors. Screenshot tooling still times
  out on the canvas (known), verified functionally via eval.

## Readability driver — why a graphics move is on the table (2026-07-04, playtest-tracker feedback)
Three separate DR-#001 checklist fails all trace to ONE root Mike named directly: the 2D look
makes enemies (and towers/ranges) too hard to identify.
- "redo [zero-instructions test] after graphics upgrade. graphics are so basic right now we
  can't identify the gaps"
- "not easy to know what to do at first or what each tower does or its range"
- "the lack of clarity in tower design and placement makes it hard to put towers together at
  the right time"
Gut rating 3/5. DR-#018's graphics overhaul added atmosphere but did NOT solve enemy/tower
READABILITY. Mike is weighing a "same build, better graphics" rebuild (Godot or an easier
web path) specifically to fix enemy identification. NOTE for whoever picks this up: readability
is an art/silhouette/color problem, not inherently an engine problem — top-down 2D is usually
the MOST readable for TD (Bloons/Kingdom Rush). Engine choice pending Mike's decision; see the
engine handoff being drafted this session.

## DR-#020 — FEAST mechanic: tower combat + devour corpses to heal/upgrade (2026-07-05)
New tower mechanic (Mike). Researched Age of Mythology (buildings have HP, get destroyed,
are healable) + Warcraft 3 Undead Ghoul **Cannibalize** (consume a nearby corpse to heal;
a corpse eaten can't also be raised — contested-resource choice). Deadroot's version:
- **Towers take damage + can be destroyed.** Any attacker within 1.25 tiles of a zombie
  tower stops and hacks at it (deals its dmg on the 1s atkT cadence). At 0 HP the tower is
  destroyed (`destroyTower` → unblock tile + reflow, "ZOMBIE SLAIN"). Mike chose "anything
  in range" attacks. (Ranged spitters still usually kill weak attackers before melee, so
  this bites most at chokepoints / vs tanky units — tune later.)
- **Corpses feed towers (Mike's call: biomass only builds NEW zombies).** Tap a zombie →
  radial menu: **DEVOUR → HEAL** (restore 50% max HP) or **DEVOUR → LVL n+1** (level up),
  each consumes the nearest corpse in the tower's range; plus **SALVAGE** (biomass refund).
  A dashed range ring + "LVL n" tag show while the menu is open; buttons dim if no corpse
  is in range.
- **Levels scale power + look:** `t.level` (per-corpse). Firing rate +10%/lvl, damage
  +25%/lvl (wired into the fire loop). Devour-upgrade also +20 max HP. Visually the zombie
  grows (sprite + base glow ×(1+.1/lvl)), glow turns purple at lvl 3+, level pips above it.
- Replaced the old biomass-cost EVOLVE/tier-2 path (applyTier2 now dead code) with feasting.
  `corpseInRange`/`consumeCorpse`/`feastHeal`/`feastUpgrade`/`damageTower`/`destroyTower`
  added near mutate. Onboarding tip retext: "tap a zombie to DEVOUR corpses (heal/upgrade)".
- Verified: feastHeal 20→50 & consumes corpse; feastUpgrade → lvl2 +20max & consumes;
  immortal troop chips a spitter 60→30 (combat works); tower destroyed at 0 HP; menu opens
  with heal/upgrade/salvage and tapping upgrade levels it; screenshot confirms the radial
  menu + range ring + bigger purple lvl-3 zombie read clearly; multi-wave regression clean.
**Next / open:** balance (does "anything in range" stall or feel good at real difficulty?);
corpse is now contested 3 ways (mutate-new / feast-heal / feast-upgrade / rot) — watch the
economy; then Knight→troop etc., then fold Rootmass/Spore/Node into Spitter feast "mods".

## DR-#021 — MAZE foundation: buildable walls + no-squeeze collision + route overlay (2026-07-05)
Mike: "enemies are so free it's hard to strategize" — wanted corpse placement to build a real
maze (hedge-maze / spiderweb) so where you drop is a strategic call. Researched maze-TD design
(Red Blob flow-field, Gemcraft/Desktop TD open mazing, Defense Grid "no corner-cutting", spider-
web bridging geometry — see the session). Root cause found: the design was always "corpses block
= organic mazing," but two rules made it feel free. Confirmed 3 big calls with Mike (all my recs):
reject-the-seal wall rule, hard-wall webbing, foundation-first slice. This is the foundation slice;
**webbing (auto-strands bridging nearby corpses into a hedge) is the next slice.**
- **Relaxed the anti-box rule (the #1 fix).** DR-#001's `tryBlock` rejected a block if *any* edge
  tile lost its path → you literally couldn't close a single lane, so walls never became choke-
  points. New `sideHasPath(dist)` invariant: a placement is legal as long as EACH of the 4 edges
  keeps ≥1 open tile that reaches the Hive. You can now wall off lanes and force long serpentine
  routes; the game still guarantees enemies can always path in from any side (no full seal, no
  trapped mobs). `tryBlock` now just calls `sideHasPath`. Verified: a 14-tall interior wall builds
  fully (was rejected before); walling a whole edge column rejects exactly the tile that would seal
  that side (17 built / 1 rejected).
- **No-corner-cutting collision.** Enemy movement was continuous with NO wall collision — they
  followed the flow vector and clipped diagonally through 1-tile gaps ("too free"). Added
  `solidAt(px,py)` (blocked-tile test; outside-grid + Hive read open) + `moveWithWalls(e,mx,my)`
  which resolves X and Y independently with a `WALL_MARG=12` body half-width, so a body slides
  along a wall instead of squeezing a corner (Defense Grid rule). Hive-walking enemies now move via
  `moveWithWalls`. Sweepers left on their own pathStep (target corpses, not the Hive) to keep scope
  tight. Verified: body shoved into a wall moves 0px, slides 25px along it, moves 20px in the open.
- **Route overlay** (`drawFlowOverlay`, drawn under entities after `drawHive`): faint lime
  directional chevrons on every walkable tile so the player reads the lanes the maze funnels
  enemies through (research: persistent flow overlay is the single highest-value readability move).
  Draws only in play/prep, one batched stroke (~468 tiles, negligible). Skips blocked + Hive tiles.
- **Teaching feedback:** dropping a corpse that WOULD fully seal now shows "PATH STAYS OPEN" so the
  player learns the rule instead of silently getting a trampled corpse.
- Determinism (fixed 60Hz) + CG single-file fast-load intact; no new assets. Verified via
  preview_eval (screenshot tooling still times out on this canvas — known); console clean, no parse
  errors. All wrapped as DR-#021 with code comments.
**Next:** the spiderweb slice — corpses within ~2 tiles auto-grow a strand that hard-blocks the gap
(bridging scattered drops into a hedge), subject to the same seal rule; then live drag/red-preview
polish + a path-length damage reward (DoT along route) if Mike wants more strategic depth.

## DR-#022 — SPIDERWEB webbing: strands bridge nearby corpses/towers into hedge walls (2026-07-05)
The signature maze mechanic on top of DR-#021's foundation. Your dead anchor a web: any two BLOCKING
corpses/towers that line up (same row, same col, or a clean diagonal) with a 1-2 tile GAP auto-grow a
strand that HARD-BLOCKS the intervening tiles — so scattered organic corpse-drops fuse into a real
hedge/spiderweb wall without needing a perfectly contiguous line. Turns "where corpses land" into a
strategic web-completion puzzle.
- **Model:** nodes = non-trampled corpses + towers. Eligible pair = aligned (dc==0 | dr==0 | |dc|==|dr|)
  with `span=max(|dc|,|dr|)` in {2,3} (gap of 1 or 2 empty tiles). Nearest pairs claim strands first;
  each node caps at `WEB_CAP=4` connections so the web stays readable (spider-radial logic from research).
- **Seal-safe + fast:** strand tiles go into `blocked`, then ONE `computeFlow` checks `sideHasPath`
  (DR-#021 invariant). Common no-seal case = a single flow recompute. If a web would seal a side, peel
  strands back longest-first (capped at 24 peels), then a hard fallback strips any remaining web tiles —
  so the field is ALWAYS legal and a pathological dense mesh can't hitch the frame. Measured: realistic
  8-corpse cluster ~0.6ms / 9 strands; degenerate full-board 40-corpse lattice bounded to ~13ms / 26
  flows (and correctly refuses to web since it would seal).
- **Recompute trigger:** NOT per-frame. `update()` compares a structure signature
  (`corpses.length*1000 + towers.length`); `rebuildWebs()` runs only when a corpse/tower is added or
  removed. Idle frames cost nothing. Catches every add/remove site (drop/mutate/feast/sanitize/decay/
  destroy/warden) with no per-site wiring.
- **State:** `web[r][c]` (bool, which tiles are web-blocked, cleared+recomputed each rebuild; never
  coincides with a corpse/tower tile), `webStrands` (list of `[c1,r1,c2,r2]` for rendering), `lastStructSig`.
  All reset in `newRun`. `rebuildWebs` sets `flow`/`flowDist` directly from its final field.
- **Render:** `drawWebs()` (after `drawFlowOverlay`, under corpses so anchors sit on top): pale sticky
  strand (wide soft pass + thin bright line) with perpendicular cross-ticks = spiderweb read.
- Verified via preview_eval (page reloaded so evals hit current code — earlier evals silently ran stale
  page memory, worth remembering: static file, NO HMR): horiz gap-2 fills both tiles, diagonal bridges
  the mid tile, too-far (span>3) makes no strand, removing a node clears its strand+tiles, seal peel keeps
  every edge reachable, 600-frame live run (starter corpses+wardens, spawns, drops, full draw) throws
  nothing, console clean. Determinism (no RNG) + single-file fast-load intact.
**Next:** Mike playtests the maze feel end-to-end (does webbing make placement strategic? tune span/CAP/
gap). Then optional depth: live drag/red placement preview, path-length DoT reward. Then back to roster
(Knight→troop etc.) + the Spitter mod-tree tower rework.

## DR-#023 — CORE PIVOT: buy-and-place hedge-maze labyrinth (2026-07-05)
Mike: the corpse-maze failed because corpses fall where the ENEMY dies — the player never
controls placement, so it isn't strategic. Pivoted (his call, all my recs) to a classic
build-and-place maze TD reskinned as a Greek/Victorian hedge-maze / Minotaur's labyrinth, zombies
as the enemies-in-the-maze. Researched build-and-place TD economy + Cretan labyrinth structure +
autotile hedges (see session). Confirmed 3 big calls: clean pivot (retire corpse-mutate/FEAST as
core), tap-to-place hedges that auto-merge, fixed-entrance labyrinth. DR-#021 foundation carries
over (buildable-wall rule, no-corner-cut collision, route overlay). This slice = the playable new
loop; polish is backlogged.
- **Economy (reuses `biomass` = bone-biomass):** `startBiomass 120`, `hedgeCost 5` (~1/8 of a
  Spitter so a full maze ≈ one tower), Spitter still 40, `killBounty 6`. Corpses are now DECORATIVE
  + passive income (they still rot → biomass) — they no longer block or become buildable.
- **Fixed-entrance labyrinth:** `CFG.gates` (E,W,N,S border tiles); `openGates()` opens them in
  order as waves escalate (1→2→4). `spawnEnemy` picks a random open, reachable gate. Hive stays
  the central goal. `drawGates()` draws glowing inward arches at open gates.
- **Build palette (bottom-center):** `paletteBtns()` = [HEDGE 5◈][SPITTER 40◈]; tapping toggles
  `buildMode`; tapping a field tile places (brush stays sticky). `placeHedge`/`placeUnit` spend
  biomass, feedback on NEED BIOMASS / CAN'T BLOCK PATH. `drawPalette()` renders buttons + a
  green/red build cursor under the pointer.
- **Placement seal rule:** `tryPlaceBlock(c,r)` blocks only if EVERY open gate keeps a route to the
  Hive (`gatesReachable`), never on Hive/gate tiles — so you wall lanes into long routes but can't
  trap. (Replaces the generic sideHasPath check for player builds.)
- **Hedge render:** `drawHedges()` = merged topiary (autotile-lite: round only outer corners,
  extend 1px over shared edges so contiguous tiles read as one continuous hedge; base shadow +
  dappled top light). `seedLabyrinth()` pre-places 3 concentric square rings around the Hive with
  a one-side gap that rotates E→S→W (corkscrew inward) — reads as a labyrinth on load, ~102 hedge
  tiles, all 4 gates verified reachable.
- **Retired as core (code kept, dead):** corpse tap-menu removed; `mutate`/FEAST/`spawnWarden`/
  `rebuildWebs` (early-returns) no longer wired; tower tap-menu trimmed to SALVAGE only.
- Verified via preview_eval (page reloaded — static file, NO HMR): labyrinth seeds + all gates
  reachable; hedge/unit place with correct cost; Hive/gate/broke placements rejected; seal rule
  refuses trapping tiles (all gates stay reachable); a lone scav winds the full labyrinth and
  reaches center at ~frame 1549 (~26s, NOT trapped); 600-frame run + full draw throws nothing;
  console clean. Determinism (no RNG in pathing) + single-file fast-load intact.
**Backlog (deferred polish):** drag-to-paint walls; ghost/red drag preview; 47-tile blob autotile
art; path-length DoT reward; sell/remove hedges; rip out dead FEAST/mutate/web code; rework boons
& onboarding text that still reference mutate/rot; balance pass (kill bounty vs wall/tower costs);
gate-escalation banners. Then: Mike playtests the new loop.

## DR-#024 — deadroot unify: hedge↔zombie, 2-wide paths, destructible walls (2026-07-05)
Mike playtest on DR-#023: hedge pathing too restrictive; wants ≥2-wide lanes; the hedge IS the
deadroot (grows into a zombie or stays a blocker); every wall tile is a hedge OR a zombie; enemies
that kill a zombie leave a GAP in the maze. Confirmed lane call: paths ≥2 wide, build 1 tile at a time.
- **2-wide path guarantee (the "too restrictive"/"can't block full path" fix):** `wideOpenGrid()`
  marks every tile in a fully-open 2×2 block (out-of-grid + Hive read open); `gatesWideReachable()`
  BFSes those wide tiles from the Hive and requires every OPEN gate to connect. `tryPlaceBlock` now
  refuses any placement that would pinch the guaranteed route below 2 wide (not just full seal).
  Verified: filling a column, the 3 tiles that would choke it to 1-wide are refused (corridor stays
  ≥2). Seeded labyrinth rebuilt to 2 concentric rings spaced 3 apart (d=2,5) → 2-wide corridors +
  3-wide rotating gaps; seed passes `gatesWideReachable` with all 4 gates reachable (~60 hedge tiles).
- **Grow hedge → zombie (unified deadroot):** the ZOMBIE brush on an existing hedge tile converts it
  in place for the price difference (40−5 = 35, "GROWN"); on empty it places a fresh zombie (40) via
  the 2-wide `tryPlaceBlock`. Hedge = cheap permanent blocker; zombie = blocker that also attacks.
- **Destructible zombies → gaps:** attackers already brawl units in range (DR-#020 combat, still
  live); `destroyTower` unblocks the tile → a real breach in the maze. Hedges are NOT towers so
  they're indestructible structure. Verified: killing a placed/grown zombie unblocks its tile.
- Palette relabeled SPITTER→**ZOMBIE**; onboarding banner "GROW YOUR LABYRINTH — HEDGE walls the
  lanes, grow a hedge into a ZOMBIE to bite back."
- Verified via preview_eval (reload — no HMR): seed 2-wide + gates reachable; hedge place; grow
  (cost 35, hedge cleared, tile stays blocked); destroy → gap; pinch refused (3/14); 1200-frame run
  + full draw throws nothing; console clean. Determinism + fast-load intact.
**Backlog (still):** drag-to-paint; ghost/red drag preview; nicer autotile hedge + zombie-in-wall
art; path-length DoT; sell/remove; rip dead FEAST/mutate/warden/web code; boon/onboarding text; balance.

## DR-#025 — B1 Grabber zombie + B2 reabsorption cooldown (2026-07-05)
Two requested depth adds on top of the confirmed-good 2-wide maze (Mike playtest, HANDOFF Decisions).
- **B1 — GRABBER zombie (3rd build brush).** New unit type `CFG.towers.grabber` (cost 45, range 2.0,
  slow 0.40). It's a risen zombie that **slows every enemy in its aura** instead of shooting — the old
  rootmass snare behavior, reworked as a placeable unit. The snare loop now sums slow from rootmass AND
  grabber via a `slowMul = min(1-slow)` (multiple slowers stack to the strongest, not additively), and
  sets `e.snared` (so grabber-snared foes still trigger FERMENT ×2 with a Spitter's acid). Grabber is
  skipped in the fire loop (`type===grabber` → no projectile). Distinct look so it never reads as a
  Spitter: **amber base disc** (vs lime), a **persistent dashed amber snare-radius ring** (readability
  tell — this zone slows), and **4 animated grasping clawed tendrils** reaching outward (`drawGrabTendrils`,
  the silhouette tell / "grasping hands vs Spitter"). It's a tower → has HP, is destructible (leaves a
  maze gap like any zombie), can be **grown from a hedge** for 45−5=40, and salvages like other units.
  Palette rebalanced to 3 buttons (HEDGE / ZOMBIE / GRABBER), w138 gap14, each button uses its type's
  accent color when selected.
- **B2 — Reabsorption cooldown (GLOBAL Hive-wide — my pick over per-tile).** `CFG.reabsorbTime = 4`s.
  When ANY zombie dies (melee brawl → `destroyTower`, or incinerator burn-down → the fire-loop death
  path; both call `triggerReabsorb()`), the Hive-wide `reabsorbCD` is set to 4s. While it's >0, raising
  a **new** zombie (both fresh place AND grow-from-hedge, both brushes) is denied with a "REABSORBING Ns"
  popup. **Hedges are NOT gated** (structure, not undead) and **salvage does not trigger it** (deliberate
  player action, not a loss). Chose global over per-tile: simpler tell, and it makes losing any zombie a
  real tempo hit (pairs with destructible gaps — a breach + a raise-lockout at once). Tell: the two unit
  palette buttons dim + show a live "reabsorbing Ns" countdown; the build cursor goes red for unit brushes
  while cooling. Both reset in `newRun`; `reabsorbCD` decrements in `update()` alongside overgrowth/pher.
- Verified via preview_eval (reload — no HMR): grabber places (hp60) + appears as 3rd palette brush;
  enemy on top of grabber `snared=true`, far enemy `false`; zombie death sets reabsorbCD→4; new place +
  grow both blocked while cooling, both succeed after; **hedge stays allowed while cooling**; 1500-tick
  live run with 2 leveled/tier grabbers + a spitter + `draw()` every tick throws nothing; console clean.
  Determinism + single-file fast-load intact. All code wrapped in DR-#025 comments.
**Next:** Mike playtests grabber feel (slow % / range / cost) + reabsorb length (4s too punishing/lenient?).

## DR-#026 → #032 — C-backlog sweep (2026-07-05, "go for remaining roadmapped items")
Cleared the entire C polish/cleanup backlog in one session, each its own commit + headless verify (reload,
no HMR; parse-check; preview_eval eval + draw sweep; console clean). Numbering = one DR-# per batch.
- **DR-#026 (C7) — boon + onboarding text to the buy-and-place loop.** Reworked BOONS: dead Spore/Rootmass
  boons (LINGERING SPORES, DEEP ROOTS) → GRASPING REACH (+35% grabber radius, `run.grabR`), CHOKEHOLD
  (+15% grabber slow, `run.grabSlow`), THORNED HEDGES (hedges cost 2◈, `run.hedgeDisc` via `hedgeCostNow()`);
  ACID/HIDE retexted Spitter→Zombie. Wired grabR/grabSlow into the snare loop + aura render. Prep onboarding
  "TAP A CORPSE" (dead — no starter corpses post-pivot) → "PICK A BRUSH, THEN TAP THE FIELD TO BUILD" pointing
  at the palette. Neutralized the never-firing rot-ring + evolve/devour teaching nudges.
- **DR-#027 (C5) — sell/remove for partial refund.** Zombie SALVAGE already existed; added hedge removal:
  tap a hedge (no brush) → REMOVE menu. `hedgePaid[r][c]` tracks player-paid vs seeded hedges — paid refund
  60% of current hedge cost, seeded remove for free (repositioning). Removal always unblocks (never seals).
- **DR-#028 (C1+C2) — drag-to-paint + ghost preview.** Hold + drag with the HEDGE brush lays a wall in one
  stroke (`painting`/`dragPaint`, one hedge per newly-entered tile; units stay single-tap). Build cursor
  upgraded to a filled ghost in the brush's own hue (red + X when blocked).
- **DR-#029 (C9) — gate-escalation banners + flare.** Newly-opened gates flash an expanding ring + hot arch
  (`gateOpenT[]`, `GATE_DIR`) so the new front is unmissable; banners renamed to call the direction ("THE WEST
  GATE OPENS", "NORTH & SOUTH gates open"). Fixed a stale "steal your mutate" sweeper sub.
- **DR-#030 (C4) — path-length reward.** `e.mazeT` accrues while an enemy walks the maze; creeping-rot DoT
  ramps `min(mazeDoT*mazeT, cap)` (0.55/s per sec, cap 16) so long serpentine routes cook the horde (rot motes
  as the tell). Deaths route through the normal `kill()` (biomass + corpse). Troop loses ~29% over a 10s walk.
- **DR-#031 (C3) — leafier topiary hedges.** Deterministic dappled leaf-clumps (`hedgeHash`) + top-face
  highlight over the merged-corner topiary; clip-free (inset clumps) so it stays cheap — 120-hedge maze draws
  ~2.5ms under the preview's SOFTWARE renderer (negligible on real GPU). The grown zombie already reads distinct
  (glowing disc + sprite vs topiary), so no separate zombie-in-wall art needed. Full 47-blob atlas skipped as
  not worth the weight.
- **DR-#032 (C6) — rip dead code.** Removed the fully-retired DR-#022 spiderweb system (`rebuildWebs`,
  `drawWebs`, `web[]`, `webStrands`, `lastStructSig`, the per-frame structSig recompute), `spawnWarden` +
  `WARDEN_NAMES` (free cardinal wardens retired by the pivot, zero call sites), and `applyTier2` (biomass EVOLVE
  replaced by feast/salvage; `t.tier` never rises now). Verified zero dangling refs + 1500-tick run clean.
  (Left the harmless feast/mutate corpse-menu tangle — interwoven with the live salvage menu; low value, higher risk.)
**Not built (need Mike):** C8 balance, D2 boss waves, D3 meta re-tune, A3 shippable all need his playtest feel on
the new mechanics (rebalancing blind would risk the confirmed-good maze). D1 human roster is asset-gated (needs
Engvee Knight/Barbarian/Halberdier atlases dropped in `assets/raw/`, per SPR-#003).

## DR-#033 — dev-menu playtest tunables for the new mechanics (2026-07-05)
Mike chose "playtest" — so wired the `?dev=1` DEV MENU with live sliders for everything C8 would tune, so he can
dial the feel in real time and report the sweet spots (which feeds C8 without me guessing). Dropped the now-dead
warden knobs (warden removed in DR-#032 C6). Knobs → CFG: Grabber slow%/range/cost, Zombie cost, Hedge cost,
Kill bounty, Reabsorb secs, Maze rot/sec, Maze rot cap, + the existing enemy/tower sprite sizes. Slider label
precision now derives from step (`kdec`), menu scrolls (`max-height:92vh`), added a "spawn a troop (tanky)" button
(tank shows the slow + ramping rot better than a scav). Nothing load-bearing — all inside DR-#019 DEV:BEGIN..END,
stripped for release. Verified in-browser at `?dev=1`: menu opens, all 11 knobs show correct values/precision,
sliders write CFG live (grabber slow→0.6, reabsorb→6.5), spawn-troop works, console clean.
**Playtest URL:** https://michaelnocito.github.io/play-area/deadroot/?dev=1 (⚙ DEV button top-left, or ` / ~ key).

## SPR-#003 — Thief → scav (human attacker vertical slice) (2026-07-05)
The other half of the flip: first human attacker wired. "The Living vs The Dead" —
attackers are a fantasy human war-host (alternate-world lore lets Thief/Knight/Barbarian/
Halberdier coexist; NO orcs). Roster: **Thief→scav, Knight→troop, Barbarian→incin,
Halberdier→sweeper**, butcher/boss = scaled-up variants (later).
- Source: Engvee "Animated Isometric Thief" (free, same creator/style as the zombie pack →
  towers + attackers match). Mike downloaded `x256_Spritesheets.zip`; unzipped to
  `assets/raw/engvee_thief/` (gitignored).
- `scripts/pack_thief_atlas.py` (PIL): the thief sheets are 1024×1024 = 4×4 grid of 256px
  frames per direction (16 dirs available; we take 8). Crops tight to a shared character
  bbox so the sprite fills the frame (reads bigger — Mike's "too small" note), downsamples
  to 96px, packs 8 dirs × 8 frames → `assets/thief_atlas.png` (768×768, ~365KB). No tint
  (natural human reads distinctly from the green zombie towers).
- Sprite module generalized again: `pickFrame` + `blitFrame` (origin-space, for the enemy
  loop which is already translated) + `drawSpriteFrame` (world-space wrapper, for towers).
  SPR now holds {zombie, thief}, both loaded at boot.
- Scav enemy renders the thief (facing travel dir = -flow), drawSize e.r*4.4 (~40px, up from
  the old e.r*2.7). Procedural frog is the fallback. Status tells + hp bar still draw over it.
- Verified: parse OK, both atlases load, blitFrame('thief') returns true w/ 1633 opaque px in
  frame 0_0; pixel-sampling scav centers = dark human tones (40-67), NOT the light-blue
  procedural scav → thief IS rendering. (Screenshot tooling flaky/down most of session; got a
  couple clean captures confirming zombie-towers-on-green-pads + thief attackers.)
**Atlas budget note:** zombie ~176KB + thief ~365KB ≈ 540KB so far. Watch this as more units
land (CG fast-load = the whole reason we didn't pick Godot). Can trim frames/optimize PNGs later.
**Next:** Mike eyeballs live — is thief big/clear enough? Then Knight→troop etc., then the
Spitter mod-tree tower rework (4 towers → 1 zombie + visual mods).

## Playtest feedback triage (2026-07-05, from playtest-tracker DR-#001 run)
Three failed checklist items pulled from the tracker, triaged to roadmap:
1. **"Getting closer" (run 0, vague)** — no concrete ask; parked, no action needed unless
   Mike follows up with specifics.
2. **"Too easy — spam one tower type (spitters) straight to wave 12, no reason to vary type/
   quantity/placement"** — pre-dates the maze pivot (DR-#023→#025), which already forces
   placement strategy via buy-and-place hedges/zombies/grabbers. Still open: a real balance
   pass (C8, listed under DR-#026→032 "Not built") confirming the new economy actually
   rewards varied builds instead of one dominant unit. Needs Mike's playtest feel on the
   current maze build before tuning blind.
3. **"Too easy/predictable — suggest a random maze pattern per level"** — same pre-maze-pivot
   root cause. The seeded labyrinth (DR-#023/#024) is currently fixed, not randomized per
   level. Roadmapped: consider per-level maze variation (randomized ring gaps/rotation) once
   the current fixed layout's balance is confirmed with Mike — avoid randomizing on top of
   an untested economy.

## SPR-#002 — LORE FLIP: zombies are the TOWERS, humans are the attackers (2026-07-04)
Mike caught that SPR-#001 put the zombie sprite on the wrong side: "zombies are us, not the
ones attacking." Correct lore = you are the undead Hive → your risen dead are the TOWERS; the
attackers are the living. Decided direction (Mike):
- **Attackers = a fantasy human war-host** (alternate-world lore, so Thief/Knight/Barbarian/
  Halberdier coexist freely). Sourced from Engvee (same creator as the zombie pack → style
  matches). Roster: Thief→scav, Knight→troop, Barbarian→incin, Halberdier→sweeper,
  butcher/boss = scaled-up variants. NO orcs. Human atlases wired per-type as Mike drops them.
- **Towers = zombies.** Simplify to ONE base tower (Spitter = a risen zombie); upgrades/mods
  will change its look AND function (the old Rootmass/Spore/Node behaviors become Spitter mod
  branches — that rework is the NEXT slice, not done yet).

Shipped this batch (the tower half of the flip):
- Renamed `assets/scav_atlas.{png,json}` → `zombie_atlas.*` (it was always a zombie render).
- Sprite module generalized: `drawSpriteFrame(key,cx,cy,ang,animSeed,drawSize,flash)` (self-
  translating) + `towerAimAngle(t)` (zombie tower faces nearest attacker, else the field).
- Spitter tower renders the zombie sprite, aiming at its target, over a pulsing bioluminescent
  **base disc** (lime; violet at tier-2) so the dark sprite separates from the post-#018 dark
  ground + reads as "yours." drawSize 76. Procedural `drawTowerArt` kept as fallback.
- Enemy sprite path disabled (`spriteDrawn=false`) so attackers render procedurally until the
  human atlases land. Dev-menu toggle relabeled "Spitter zombie sprite (vs procedural)".
- Verified via screenshot: two zombie towers on glowing pads, readability much improved vs
  SPR-#001's tiny dark speck.
**Next:** Mike drops Engvee **Thief** in `assets/raw/` → wire Thief→scav, then the rest of the
human roster, then the Spitter mod-tree tower rework.

## SPR-#001 — pre-rendered-3D sprite pipeline, scav vertical slice (2026-07-04)
Answers the readability driver above without an engine rebuild: pre-render 3D models to 2D
sprite sheets, keep the existing web game. Engvee "Animated Isometric Zombies" pack (free,
clean commercial license, genuinely 3D-rendered) dropped in `assets/raw/` (gitignored, source
only, not shipped).
- `scripts/pack_atlas.py`: one-off packer (Pillow). Crops the Walk spritesheet's 4x5 frame
  grid, keeps 8 of 20 frames x 8 of 16 directions (the 45-degree steps), downsamples
  256px->96px, tints each frame toward the enemy's existing `col` (blend alpha 0.55, alpha
  channel preserved) so the pack doubles as the readability color-code. Outputs
  `assets/scav_atlas.png` (~172KB) + `assets/scav_atlas.json` (grid frame map).
- `index.html`: loads the atlas async (fetch+Image, non-blocking); `drawSprite()` picks the
  nearest of the 8 directions from the enemy's flow-field movement vector and an animation
  frame from elapsed time. Wired into the enemy render loop for `scav` only, gated by
  `useSprites` (dev-menu checkbox "Scav sprite (vs procedural)", default on) so procedural and
  sprite can be A/B'd live. Procedural circle+eyes fallback is untouched and still runs for
  every other enemy type, and for scav if the atlas 404s or the toggle is off — game never
  breaks if `assets/` is missing.
- Status tells (snared/drench/corroded), HP redden, HP bar, speed streak, and the last-enemy
  pulse ring are unchanged and layer on top of either draw path.
- Verified via preview_eval (headless): atlas fetch/image both 200, no console errors with
  sprites on or off, `drawSprite` renders non-blank pixels at the enemy's world position.
  Screenshot tooling still times out on this canvas (known issue) so the actual *look* at real
  in-game scale has NOT been eyeballed yet — that's the next step, per the handoff: Mike checks
  it live before any more enemies/towers get the sprite treatment.
- Next: Mike plays `?dev=1` locally or on a deploy, toggles the dev-menu checkbox to compare
  sprite vs procedural scav, judges readability at real scale. If it lands, Phase 1 (Engvee)
  extends to the other deadroot enemies it can cover; Phase 2 (Synty, needs Blender scripting)
  covers the rest of the roster. If it doesn't land, tune tint/scale/frame-count in
  `pack_atlas.py` and re-run.

## DR-#033 — playtest triage batch (2026-07-06)
Six changes from the playtest-tracker (Supabase inbox + failed checklist items, all on deadroot):

1. **Spitters too strong / too easy (fails 3:1, 2:4, 3:2 + inbox note).** Mike: "create a bunch
   of spitters quickly and ride them to level 12, no need for other tower types" + "scale down
   their damage." Nerfed SPITTER dmg 13→9 and range 3.3→2.9 (a back-line wall covered too much;
   placement now matters). Buffed enemy HP so they don't melt: scav 30→42, troop 95→120,
   incin 65→85, sweeper 75→90. All live-tunable in the `?dev=1` menu — this is a first pass off
   his feel, expect to re-tune.
2. **GRABBER "attacks / one-shots" + "looks like a regular zombie" (fails 6:0, 6:1, 6:2).** Root
   cause: grabber already dealt ZERO damage in code, but it shared the exact green ZOMBIE sprite,
   so Mike was placing spitters thinking they were grabbers (and spitters one-shot). Fix: made
   `dmg:0` explicit on the grabber def, and gave the grabber its OWN body — `drawGrabber()`, a
   squat amber root-sac with a dark maw + grasping arms, never the zombie sprite. Now unmistakable.
3. **Hedges → rotting wood (fail 6:10).** Mike: "more like rotting wood, grey and dark browns."
   Recolored `drawHedges()` from leafy green topiary (DR-#031) to grey-brown rotted planks:
   body #3a3128, dark grain streaks + knots, cool grey top highlight. Verified avg tile (41,39,33).
4. **Auto-deselect (inbox bug).** "deselecting units should happen automatically when another
   item/action is selected." Tapping an already-placed unit while a build brush is active now
   clears the brush and opens that unit's menu instead of silently failing the placement.
5. **Start with ~one hedge + random maze each run (inbox idea + fail 3:2).** Two asks in tension —
   "give the player just one hedge to start, draw their own, don't make them undo much" vs "random
   maze pattern each level for variety." Reconciled in `seedLabyrinth()`: was 2 full concentric
   rings; now 1–2 short RANDOM wall stubs (different every run), 2-wide-reachability enforced. Light
   enough to draw your own maze, varied enough to feel fresh. Seeded walls are free (no refund).

Verified headless (reload/no-HMR + eval): grabber snares but deals 0 dmg over 90 frames, amber body
distinct (R>G>B), hedge avg grey-brown, seed = ~2 tiles & random, deselect switches to unit menu,
1800-frame mixed run clean, console clean. Parse-check passed.

**Still needs Mike's feel:** the balance numbers (1–4) are a first pass — he should replay and we
re-tune off the new difficulty. The maze-seed reconciliation (5) is my synthesis of his two ideas;
if he wanted literally one hedge OR a full random maze, easy to dial `stubs`/`len` in seedLabyrinth.

## DR-#034 — CASTLE WALLS + playtest triage batch 2 (2026-07-06)
Three new tracker inbox items, one flagged BLOCKER by Mike:

1. **BLOCKER — "screen too busy, hard to decide where to build. Do away with hedges. Split the
   screen into 4 distinct paths, like fighting on top of castle walls, all 4 converging on the
   hive opening."** Shipped: permanent `rock` terrain grid — the whole field is castle stone
   EXCEPT four 4-wide lanes (rows 7–10 east-west, cols 11–14 north-south) and a 6×6 plaza around
   the Hive. Lanes line up with the existing E/W/N/S gates, so wave escalation (right → flank →
   all sides) is unchanged. Rock is never buildable, never unblocked, and corpses can't drop on
   it. `drawRocks()` renders dark stone with a lit parapet + crenellation teeth on every edge
   facing a lane, so the four paths read instantly. HEDGES RETIRED: seedLabyrinth removed,
   HEDGE brush pulled from the palette (now ZOMBIE + GRABBER), THORNED HEDGES boon removed
   (hedge functions left dormant in code in case "for now" gets revisited). New run banner:
   "DEFEND THE FOUR WALLS". Strategy is now lane defense: choke lanes with units (2-wide-path
   rule still enforced) instead of free-form mazing.
2. **Bug — on-screen text says "pick a brush"** (dev jargon for monster/building choices).
   Onboarding line is now "PICK A UNIT, THEN TAP/CLICK A PATH TO BUILD".
3. **Bug — death-recap screen shake is persistent, hard to read.** Root cause: `update()`
   early-returned on the end screens BEFORE the shake decay line, so the death `shakeIt(8)`
   froze on screen forever. Decay now runs before the early return; the recap settles in
   well under a second.

Verified in preview (dev build): all 4 gates open + reachable (flow dist 8–12), 304 rock /
164 lane tiles, enemies of every type walk 900 frames with zero rock incursions, placement
succeeds on lanes and is rejected on rock, palette shows 2 buttons, shake decays to 0 on the
over screen, console clean. Screenshot eyeballed: cross-of-4-lanes composition reads clean.

**Needs Mike's feel:** lane width (4 tiles) and plaza size are first guesses; balance from
DR-#033 now plays on lanes instead of open field, so expect a re-tune pass after his playtest.

## DR-#035 — DUNGEON pivot, core slice (2026-07-06, Mike's direction)
Mike's shift: "still tower defense, but the player creates a D&D-on-NES type level using
zombies, monsters, doors and traps, then we release the whole batch of enemies at once like
a raiding party. Player builds the dungeon before clicking start; evolve it wave by wave."
Scoped with him (all recommendations accepted): fixed dungeon floor plan / build-freely-then-
START / core slice first (doors + spikes now, monster variety later).

Shipped:
- **Fixed dungeon floor plan** (`ROOMS` rect list + `onFloor()` + `buildDungeon()`, reuses the
  DR-#034 `rock` terrain): ONE west entrance → guard room → NORTH branch (hall B → room D) or
  SOUTH branch (hall C → room E) → both converge on the east approach → Hive chamber. 37-tile
  crawl, corridors 2-wide, rooms are the garrison/build spaces. `sideHasPath` now just checks
  gate-reachability (was all-4-edges); `openGates()` always returns the single entrance.
- **Free build phase**: prep has NO timer (never auto-starts). Pulsing "⚔ START RAID" button
  (top-center; Enter/Space too) releases the whole party AT ONCE — `queueWave` pours every
  raider through the entrance 0.1s apart with y-jitter across the 2-wide doorway. Wave-by-wave
  evolve = existing loop: clear raid → biomass/boons → build more → bigger party (WAVES table
  unchanged, party preview relabeled "raid party").
- **DOOR (15◈, 150hp)**: breakable barrier. Walkable for the flow field (zero seal-rule
  interaction) but PHYSICALLY solid (`solidAt`) — raiders stop and hack it (min 8 dmg/s so
  dmg-0 sweepers can't stall forever). Plank+iron-band art, damage cracks, hp bar, oriented
  to the corridor.
- **SPIKES (20◈, 30 dmg, 3 uses)**: floor trap, fires on all raiders standing on it (pierces
  armor), 0.9s re-arm, uses pips, dulls out at 0.
- **Palette = ZOMBIE / GRABBER / DOOR / SPIKES**; ghost cursor knows the new costs/validity.
  Tap a door/trap with no brush → REMOVE menu (60% refund), mirroring the hedge pattern.
- Banners rewritten for one entrance ("a raiding party breaches the west door").

Verified in preview (reload, no HMR): parse OK; gate flow-dist 37; 1200 idle frames stay in
prep; placements land, door-on-rock rejected; raid releases 4-at-once over 0.3s; full 60s sim —
raiders hacked both doors down, trap fired (uses 3→2), zombie cleared the wave, hive untouched,
enemies never on rock, wave loop returned to build phase; console clean; screenshot eyeballed.

**Design note for the next slice:** doors do NOT redirect pathing (raiders bash through rather
than reroute), so the flow field always picks one branch. If we want doors to force the long
way around, make them flow-blockers behind the seal rule. Also candidates: more monster/trap
variety, per-wave dungeon evolution events, loot rooms.
**Needs Mike's feel:** door hp/cost, spike numbers, and whether the raid sizes need re-pacing
now that they arrive as one batch.

## DR-#036 — trinity raid roles (2026-07-06, Mike's direction)
Mike: "enemy units should be tanks, dps, heals, stealth and have 1 appropriate attribute: high
hp for tank with taunt, heals heal with lower hp, higher attack for dps, stealth can ambush and
stun 1 unit for 1.5 sec." Mapped onto the fantasy war-host:

- **KNIGHT (troop) = TANK.** hp 120→200 (started at 300, see balance note), TAUNT: any zombie
  with the knight inside his 2.4-tile taunt radius MUST target the nearest knight. Zombies
  farther away target freely — the counterplay is long-range back-liners sniping the clerics
  behind the tank (spitter range 2.9 > taunt 2.4). Visual tell: pulsing gold challenge ring.
- **CLERIC (new type) = HEALER.** hp 50 (lowest), dmg 0, heals the most-wounded raider within
  2.5 tiles at 8 hp/s. Visual: pale body + red cross, dashed green heal beam to its target,
  drifting green motes. First-seen banner: "CLERICS MEND THE RAID — kill the healers first."
- **INCIN = DPS.** dmg 8→26 (keeps its tower-burn + thermobaric identity).
- **THIEF (scav) = STEALTH.** Spawns HIDDEN: rendered at 0.3 alpha (player sees a ghost,
  zombies can't target it). Creeping within 1.5 tiles of a zombie triggers AMBUSH: that one
  zombie is stunned for 1.5s (can't shoot; grabber aura off too; dizzy-stars tell) and the
  thief is revealed. Taking any damage (warden sweeps, spike traps) also reveals. First-ambush
  banner teaches the rule.

WAVES recomposed as role-based parties (clerics from wave 5; intv column now vestigial since
DR-#035 releases everything at once); endless adds clerics. First-seen banners for knight+cleric.

**Balance found + fixed during verify:** at tank 300hp/heal 15, two clerics out-healed FOUR
focused spitters → tank+cleric parties were mathematically unkillable (taunt made it worse).
Also fixed my own taunt bug: it originally used the tower's full range instead of the knight's
taunt radius, which would have let one tank lock down every zombie forever. Final first pass:
tank 200hp, heal 8/s (2 focused zombies now out-damage 1 cleric), wave 5 softened to
2 knights + 1 cleric + 2 sweepers.

Verified in preview (reload, no HMR): parse OK; thief spawns hidden, untargetable, ambush stuns
1.48–1.5s then reveals; zombie targets the knight over a closer thief inside taunt radius, and
snipes a cleric when the knight sits outside the 2.4-tile radius; cleric healed a wounded
raider +29.6hp in 2s; wave 5 winnable with a reasonable 5-unit + doors/traps defense (hive
untouched); wave 8 remains a hard spike (butcher party) — needs Mike's feel; console clean.
(preview_screenshot tooling down again this session — behaviors verified via eval; Mike should
eyeball the new cleric/knight/stealth art live.)

**Needs Mike's feel:** tank hp / heal rate / taunt radius / stun duration (all in CFG.enemies,
dev-menu tunable), wave 8+ difficulty, and whether stealth-at-0.3-alpha reads clearly.

## DR-#037 — rot DoT removed + readability pass + wave-1 standards (2026-07-06, Mike)
Mike: "remove the rot dot, it's killing everything and overpowered (mob DoT can come later);
best visual upgrade you can — better contrast between background and elements; text easier to
read and fitting all boxes, especially the buff picks between stages; redo buffs/attacks/hp to
be standard for the 1st level; research how other games do it first."

Research (see chat sources): TD/game-art readability canon = darkest values on background
walls, mid-value desaturated floor, bright saturated actors, thick silhouettes, minimal UI
with grouped elements; early waves = trivially clearable grunt waves, one new threat per wave.

1. **Maze-rot DoT (DR-#030) REMOVED** — CFG.mazeDoT/mazeDoTCap, per-frame rot, mazeT field and
   dev knobs all deleted. It was free ambient damage that melted whole raids. A DoT can return
   later as a specific tower/trap ability.
2. **Contrast rework**: new `drawFloor()` — walkable tiles are mid-value grey-blue slabs
   (48..60 RGB, hash-varied, seams + worn highlights) instead of near-black gradient; rock
   walls darkened to #0e1116 with much brighter parapets (#5c6b82); enemy cel outlines
   2.5→3.5px. Layer order: environment → floor → rocks → hive → entities.
3. **Text pass**: `wrapLines()` helper (canvas word-wrap) — boon card titles AND effects wrap
   inside the card; cards 290×150→330×176; scrim darker; title/effect/hint sizes 22/17/13px
   (was 21/16/11, and long subs like "corpses rot 5s slower (more biomass)" used to overflow —
   verified all 7 boons now fit). Banner sub 14→17px bold, brighter. Lore line 11→13px.
4. **Wave-1 standards** (balance re-derived post-rot-removal, all sim-verified):
   - SPITTER dmg 9→14 (3 hits kills a base raider). KEY FINDING: the batch release gives
     towers far fewer shot windows than a trickle TD — the whole party crosses the kill zone
     at once — so per-hit damage must be higher than classic TD numbers.
   - SCAV hp 40, spd 2.2→1.7 (sprinting batch was uncatchable).
   - Zombie base HP 60→90 (survives ~3 DPS-raider hits). INCIN dmg 25→20.
   - THIEF stealth only from wave 3 — waves 1-2 arrive revealed (all-stealth wave 1 was
     literally unwinnable: untargetable until adjacent, then chain-stunned both zombies).
   - WAVES 1-6 recomposed: w1 4 scavs, w2 6 scavs, w3 stealth unlock (+sweepers), w4 tank
     intro, w5 healer intro, w6 dps intro (2 incins).
   Campaign sim (dumb static bot, no boons/actives/salvage): waves 1-3 clear at 100 hive HP,
   4-5 minor chip, wave 6 is the first real wall — reasonable mid-game ramp for a human
   using grabber slows/actives. Parse OK, console clean.

**Tooling:** preview_screenshot dead all session; pixel-sampling on the small preview canvas
unreliable — Mike should eyeball the new floor/walls/boon cards live and re-rate contrast.

## DR-#038 — UNDERGROUND BURROW: open plan, root walls, Deadroot lore (2026-07-06, Mike)
Mike: "need more of the play area to be playable; the setting is underground; the walls of the
room are roots; the lore is Deadroot — the humans have come to our stronghold in the Deadroot
forest and dared to enter our homes."

1. **Open floor plan** — `WALLS` rect list replaces `ROOMS` (76% of the grid playable, was 50%).
   Three chambers under the forest: west chamber (breached root-gate rows 8-9), the GREAT ROOT
   (col 8, rows 5-12) forcing raiders around its top or bottom, center Hive chamber, and an
   east deep-chamber behind a partition (build space). Two freestanding root clumps for cover.
2. **Root-wall art** — `drawRocks()` now draws dark heartwood mass + gnarled quadratic root
   strands + knots, with a BIOLUMINESCENT MOSS edge (#6f9b5a) facing open floor (the burrow's
   glow = chamber-read tell). Floor recolored from grey stone to warm packed earth (58..70 R)
   with moss patches. Value hierarchy from DR-#037 kept: dark walls < mid floor < bright actors.
3. **Lore text** — run-start banner "THEY DARE ENTER OUR HOME"; wave 1 "humans breach the west
   root-gate of the burrow"; 4 new LORE lines (Deadroot forest stronghold).
4. **ZOMBIES NO LONGER BLOCK PATHING** (the big mechanical consequence). On the open map,
   blocking towers made raiders path around every guard (whack-a-mole, untestable, unfun).
   Zombies are now GUARDS standing in the open: raiders stop to brawl any zombie within 1.25
   tiles (DR-#020 brawl), so placement = interception lines, not walls. Doors remain the only
   physical blockers. placeUnit occupancy check replaces tryPlaceBlock; ghost cursor checks
   tower occupancy directly. Zombie hp 120 (guards tank dogpiles — "their dead are your walls"),
   spitter range 2.9→3.2 (open-map coverage).
5. **RAID SPLITS AROUND THE GREAT ROOT** — the two routes are equal length, so the flow-field
   tie-break silently sent the whole raid down one side (bot losses looked random). Each raider
   now picks a side at spawn (`RAID_SPLIT` waypoints at the gap mouths, `e.wp` walked before
   flow-following) — the party streams around BOTH sides and the whole burrow is defended space.

Verified (reload, no HMR): parse OK, console clean; 76% playable, gate flow-dist 20, hive clear;
two full campaign sims (dumb static bot, both gap mouths defended): waves 1-6 at 100 hive HP,
first losses waves 7-8 (Butcher ramp) — humans with boons/actives/salvage will go further.
Screenshot tooling still down — Mike eyeballs the root walls / earth floor / moss glow live.

## DR-#039 — THE ROOTQUEEN (2026-07-07, Mike)
Mike: "remove the big eye in the center; the player can pick where they want to put their eye,
make it only 4 tiles big; turn it from the eye into the RootQueen — she is the boss of each level."

- **Fixed central eye REMOVED.** The RootQueen occupies 2x2 (= 4 tiles) and the player PLACES
  her as the FIRST act of every run: "PLACE YOUR ROOTQUEEN" prompt + 2x2 purple ghost cursor;
  tap 4 open tiles. `placeQueen(c,r)` validates (in-grid, no walls, not the gate), rewrites
  `CFG.hive` (everything — flow field, nearHive, abilities, HUD — already reads that rect, so
  placement is one rect-write + `rebuildFlow()`), reverts if the gate can't reach her.
- Until she's placed: taps do nothing else, the flow overlay and queen are hidden, palette
  build + START RAID stay gated (firstMutateDone). Placement banner: "THE ROOTQUEEN SETTLES —
  she is what they came for, she must not fall."
- **New art**: compact regal bulb inside her 80x80 footprint — dark ROOT CROWN spikes, royal
  purple mantle with bioluminescent jewels, a small eye that still tracks the nearest raider,
  glow radius pulled in from 92 to 54 so she doesn't dominate the burrow. Distress tells kept
  (red glow + frown under 50%, fast heartbeat under 25%).
- Strategy consequence: her position sets the raid's path length — deep east chamber = long
  gauntlet, near the gate = suicide. Verified: placement rejects the Great Root and the gate;
  deep-chamber placement gives flow-dist 28 (vs 20 center); waves 1-3 win at 100 HP; console clean.

## DR-#040 — Dev menu: global enemy HP / attack multipliers (2026-07-07, Mike)
Mike: "add to the dev controls enemy health so i can tweak their health and attack, just
global for all enemies that adjusts their current value."
- Two new `?dev=1` sliders: **Enemy HP ×** (0.2–4) and **Enemy attack ×** (0–4), globals
  `devEnemyHpMult` / `devEnemyDmgMult` applied at spawn AND live — moving the slider rescales
  every enemy already on the field (hp+max proportionally; dmg recomputed from CFG base), so
  the effect is visible mid-wave without a restart.
- Verified in preview: troop 200→400hp/10→30dmg on slider move, fresh spawns inherit both
  multipliers; console clean.

## DR-#041 — ADVENTURER AI slice: the raid acts like player characters (2026-07-07, Mike)
Inbox note (2026-07-07): "this should mimic the feel of a dungeon crawler but we are the
dungeon and the enemy are the heros... combat pacing (right now it's more of a follow-a-path
then the enemies free exploring. the enemies should act like player characters as much as we
can make them."  First slice, three behaviors:
1. **FIGHT BACK (aggro)** — when a raider with dmg>0 takes a hit, it (and party members within
   2 tiles) turns on the nearest zombie within 3.5 tiles and hunts it for 4s (`e.aggro`/
   `e.aggroT`, decays / clears when the zombie dies). Clerics + sweepers (dmg 0) keep to their
   jobs. Teaching banner "THE RAID FIGHTS BACK" on first trigger. This also answers the
   standing "too easy — enemies never pose a real threat" fail: bot sim now loses 2 guards by
   wave 3 (was 0).
2. **EXPLORE** — ~65% of raiders queue one "search point" (random open reachable floor tile on
   their side of the Great Root) between the gap-mouth waypoint and the queen (`e.wps` queue
   replacing the single `e.wp`), so the raid fans out and sweeps chambers instead of railing.
3. **SEARCH PAUSE (pacing)** — on reaching a search point the raider rummages 0.6–1.3s
   (`e.searchT`) before moving on — delver rhythm, not a march.
Verified in preview (reload, no HMR): waves 1-3 clear at 100 hive HP with a 6-spitter static
bot; aggro/search/waypoints all observed in-sim; parse OK; console clean. NOT yet done from
the note (next candidates): room-aware AI (torches/loot draws), retreat-when-wounded, per-role
formation. Needs Mike's feel pass.

## DR-#042 — LEVEL system: survive until the Queen opens the doorway (2026-07-07, Mike)
Mike: "the point is to survive the waves until your queen can open the next doorway; queen
is auto placed now; optimize level 1 around this; we don't need doors; start with zombies,
grabbers and traps; zombies have a small roam radius; we get to build a dungeon with mobs
for each level."
- **LEVELS array** (3 levels): each = name, lore, fixed root-wall floor plan, Queen spot,
  wave slice, raid-split waypoints, east-wall EXIT doorway. L1 THE BURROW GATE (waves 1-4,
  the DR-#038 burrow), L2 THE ROOTMAW (waves 5-8, serpentine baffles), L3 THE DEEP THRONE
  (waves 9-12, arena + throne ring). `EDGE_WALLS` shared shell; `onFloor()` is level-aware.
- **Queen AUTO-settles** (`settleQueen()`) at each level's deep spot — DR-#039 player
  placement retired. Player builds the dungeon AROUND her.
- **Doorway win-per-level**: clear the level's last wave → `beginDoorway()` (3.4s: banner,
  purple exit flare, surviving units reabsorbed as biomass refund) → next level, fresh
  build phase, hive HP restored. Final level's last wave = victory as before. Sealed exit
  arch drawn faintly all level (orientation: you can SEE where you're going); flares open
  during the transition (`drawExit`).
- **Doors retired** (palette = ZOMBIE / GRABBER / SPIKES); door code dormant.
- **Zombie roam** (`t.hx/hy/roamT`): idle units shamble ≤0.9 tiles around their post at
  14px/s (solidAt-checked); freeze the instant prey is within range+1.2 tiles.
- **Waypoint stuck-fix**: search waypoints are straight-line — no progress for 0.8s drops
  the detour back to the flow field (a hidden thief used to grind on the east partition
  forever = unwinnable wave).
- HUD: wave count per-level (n/4) + "LEVEL n — NAME"; prep shows "survive N more raids —
  the Queen opens the way".
- Verified headless (deadroot-alt:4226; 4216 dead again, preview_screenshot dead → base64
  fallback): all 3 layouts BFS-reachable (queen open+reachable, splits ok, 75-76% floor);
  full campaign sim L1→L2→L3→victory; honest-economy L1 run clears at 100 HP with greedy
  spitter play; roam drift ≤ radius; console clean.
- NOT balance-tuned: L2/L3 with real numbers are hard (sim died w7 with a sloppy build) —
  Mike playtest = next. Research batch (reverse-dungeon features) delivered in chat:
  top picks = loot bait, adjacency synergy, kill-combo rewards, morale/retreat.

## DR-#043 — playtest triage: paused stage modals + zombie→grabber evolve (2026-07-08, Mike)
Triage of today's inbox (2 items, both shipped) + 8 checklist fails (all were stale/already
addressed — claude fields re-lost again; rewritten in Supabase, 0 untriaged remain).
- **DR-#043a (inbox bug):** "info text between stages overlaps the action — pause until the
  user clears it." New `infoModal`/`showInfo()`: level intros, wave-start story beats (THE
  SCOUTS/PURGE/BUTCHER/EXTERMINATION/PURIFIER, endless PURIFIER INBOUND), and THE QUEEN OPENS
  THE WAY are now PAUSED modals — `update()` early-returns and the raid doesn't spawn until
  tap/Enter dismisses (`drawInfoModal`, dim overlay + wrapped sub + TAP TO CONTINUE). Mid-wave
  teach banners (ambush/taunt/etc) still passing banners — flagged to Mike.
- **DR-#043b (inbox idea, Mike: BLOCKER):** ONE monster choice. Palette = ZOMBIE + SPIKES.
  Tap a placed zombie → **EVOLVE → GRABBER** (30◈, `CFG.towers.grabber.evolve`,
  `evolveToGrabber()`): keeps slow aura, gains **rot DoT 2.5/s** in aura (the old maze-rot's
  new home, `CFG.towers.grabber.dot`). Morph animation `t.evolveT` 0.9s: wobble grow-in +
  husk ring + green/amber particles + aura-radius ring; one-time teach banner on first zombie.
  ⛔ Matching Engvee grabber sprite ASSET-GATED (only zombie/thief atlases) — procedural morph
  until a sheet lands in assets/raw/ (flagged in the Supabase note).
- Stale fails re-answered: grabber one-shot/looks/shoots (DR-#033), hedges (removed DR-#034),
  too-easy ×3 (DR-#037/#041/#042 + this evolve variety), onboarding (DR-#042 goal line +
  these modals). All set state=fixed → Mike's retest queue.
- Verified headless (deadroot-alt:4226, reload first): modal freezes sim (onboardT/spawnT
  pinned) + dismiss resumes; wave modal holds the raid at 0 spawns; palette=ZOMBIE/SPIKES;
  zombie menu = EVOLVE+SALVAGE; evolve swaps type/charges 30◈/closes menu; DoT 5hp over 2s;
  morph frame draws; console clean. Parse OK.

## DR-#044 — friction fix: mid-play banners → slim top ticker (2026-07-08, Mike)
Mike: "the text messages that appear, like saying that the enemy is here, really suck —
intrusive, overlap actual gameplay. do a friction test and fix."
- **Friction audit found:** drawBanner was a 110px dim band + 42px serif type across MID-FIELD,
  firing during combat (first-seen sweeper/knight/cleric at spawn, thief ambush, RAID FIGHTS
  BACK, last-survivor, 25-kill milestone); plus center-screen popups mid-combat (ability
  activations) and at wave clear (repelled/unscathed/hive-talk/reabsorb).
- **Fix:** banners are now a **queued ticker** (`bannerQ`, cap 4, plays one at a time 3.0s,
  fade+slide) docked at TOP+3..TOP+37 — inside wall row 0, which is solid rock, so it can
  never overlap action. Slim pill: dark bg, purple accent bar, 15px title + 13px sub inline,
  NO screen dim. Center screen is reserved for DR-#043a paused modals + end screens.
- All center popups during/around play routed to the ticker: wave repelled, unscathed
  (UNBROKEN folded in), hive-talk quote, reabsorb refund, OVERGROWTH/FUNGAL BLOOM/PHEROMONE,
  second wind. Only the boon-pick confirmation stays centered (decision menu, game stopped).
- Verified headless (deadroot-alt:4226): queue caps at 4 + plays in order; mid-field pixel
  IDENTICAL with a banner up (no dim); ticker renders after fade-in; full wave clean; parse OK;
  console clean.

## DR-#045 — grabber sprite from the SAME pack (2026-07-08, Mike correction)
Mike: "my instruction was that the grabber had to be part of the same graphic pack — right
now it evolves into something obviously not from that pack." He was right — DR-#043b shipped
a procedural stand-in and called the sprite asset-gated without checking what the pack had.
- The Engvee zombie skin1 pack (assets/raw/) has 13 animation sets; we only used Walk. The
  grabber is now the SAME zombie model using the **ROAR** animation (arms out, grasping) with
  a strong **amber tint** baked at pack time — unmistakably the pack's art, unmistakably not
  the green walking spitter.
- New `scripts/pack_grabber_atlas.py` (Roar sheets are 6x4/24-frame grids vs Walk's 4x5/20)
  → `assets/grabber_atlas.{png,json}` (172 KB, 8 dirs × 8 frames, tint #d9944a α0.55).
- Runtime: SPR.grabber entry + atlas load; drawGrabber draws aura ring → amber under-glow →
  `drawSpriteFrame('grabber', …)`; the DR-#033 procedural sac remains as the 404 fallback.
  Evolve morph (DR-#043b) wraps the sprite unchanged.
- Verified (deadroot-alt:4226, reload): atlas loads, evolve draws the amber Roar zombie
  (pixel-sampled), morph completes, console clean, parse OK.
- ⚠️ Lesson (see feedback_ask_before_substituting): check assets/raw/ BEFORE declaring
  art asset-gated.

## DR-#046 — UI/art batch: boss bar off the palette, size pass, raid routes, doorway juice, full reskin (2026-07-09)
From the 2026-07-09 triage. One combined commit for DR-#046→#048 (edits interleave in the single file).
1. **BLOCKER — boss HP bar relocated.** It sat at the bottom of the screen covering the build
   palette (the primary action view). Now a slim inline strip (name + HP in one line) docked
   over the TOP wall row — row 0 is solid rock, nothing playable there. The DR-#044 ticker
   shares that row and draws on top for its 3s; the bar returns underneath.
2. **Desktop-first size pass.** HUD biomass 30→36px, wave 26→30, level line 13→15, DNA 20→24,
   popups 18→21, palette buttons 126×58→150×64 (fonts 16→19/15→17), START RAID 240×58→290×66
   (font 22→26, hit region matched), onboarding 22→25, boon cards 330×176→360×192 (24/19),
   ticker 17/15, info-modal 38/19, wave preview dots 8→10 + counts 14px, lore 13→15, ability
   glyphs 34px, evolve/salvage menu circles r36→42 with 14-15px labels, enemy sprites
   ×6.0→×6.8, tower sprites 96→110px (both still dev-menu tunable).
3. **Raid splits are ROUTES now** (list of waypoints, one route picked per raider). L3's
   throne ring has two mouths, so its raid splits across 3 routes: straight into the west
   mouth, or around the top/bottom of the ring to storm the east mouth from behind — the
   player must defend every approach. Verified 30 spawns split ~11/9/10 and all route
   waypoints are open + flow-reachable. L1 unchanged in behavior (two Great Root routes).
4. **Doorway juice.** The sealed exit arch CHARGES as the Queen nears opening it: glow +
   line weight + pulse rate ramp with waves survived this level (`levelProgress()`), plus a
   charging radial aura. Every kill tears the raider's soul loose — a glowing wisp drifts up
   then homes on the Queen (`souls[]`); each arrival kicks `exitPulseT` so the arch visibly
   swells per soul, with a small ring/burst at the Queen.
5. **Full same-pack reskin (audited assets/raw/ FIRST — DR-#045 lesson).** The pack audit:
   only engvee_thief (20 anim sets) + engvee_zombie_skin1 (13 sets) exist — but that's enough
   for EVERYTHING: `scripts/pack_variant_atlases.py` packs one animation set + tint per role.
   KNIGHT=Block/steel-blue, INCIN=Attack_Stance/orange, SWEEPER=Run/hazmat-yellow,
   CLERIC=Buff/pale-robes, BUTCHER=Attack1/blood-red (96px), BOSS=Attack3/ash-white (96px),
   QUEEN=zombie Idle/royal-purple (112px, tracks nearest raider, keeps crown/glow/distress
   tells; procedural bulb stays as fallback). Enemy draw generalized via `ENEMY_SPR` map;
   sweeper sanitize-ring + knight taunt-ring tells now also draw over the sprite path.
   **Nothing still needs sourcing** — every unit + the Queen is covered by the two packs.
   Atlas budget: +8 atlases ≈ 2.1 MB (total ≈ 2.7 MB); watch load time on CG review.
   **Found+fixed a latent bug:** blitFrame's hit-flash used source-atop + white rect, which
   composites against the opaque canvas = a solid white box (glaring at the new sizes).
   Now a 'lighter' re-draw of the frame brightens only the sprite's own pixels.

## DR-#047 — per-level economy: grant + capped carry (research-first) (2026-07-09)
Mike: biomass carryover made L3 trivial (arrive rich) + the long-running "too easy" thread.
**Research:** Kingdom Rush, BTD6 and Dungeon Warfare all RESET cash per level and route
long-term reward through a meta layer (which Deadroot already has in DNA); BTD6 sells towers
at 70% so banking value in units always costs something; Rogue Tower (true carryover) fights
snowball with escalating per-copy prices instead. **Recommendation (shipped):** per-level
budget + a small capped efficiency carry —
- Each level grants `meta.bio + 30×levelIdx` (L1 ≈120, L2 ≈150, L3 ≈180 at tier 0).
- 25% of leftover biomass carries, hard-capped at half the new grant; carry the cap eats
  converts to a small DNA trickle (max 5) so efficiency still pays something.
- Doorway reclaim of surviving units/traps cut from 100% → 60% (the full refund double-dipped
  into the next budget). Ticker announces "THE HIVE BEGINS ANEW — grant · carried · DNA".
Verified: arriving at L3 with 120◈ now starts it at 210◈ (was 120 carried + full refunds on
top). L3 difficulty now tunes against a known budget; needs Mike's feel pass on the numbers.

## DR-#048 — MENDER: evolvable healer zombie (2026-07-09)
New second evolution beside GRABBER (same 30◈ pattern): tap a zombie → EVOLVE → MENDER.
- `CFG.towers.mender` (range 2.2, heal 7 hp/s, dmg 0): heals the most-wounded friendly
  zombie in range — the mirror of the raid's cleric, same dashed-green beam language so the
  mechanic reads from either side. It's a tower: brawled/burned down like any zombie, leaves
  a gap, triggers reabsorb, salvages normally.
- `evolveTower(t,type)` generalizes the DR-#043b morph (grabber + mender share the wobble
  grow-in + husk ring moment); zombie menu is now EVOLVE→GRABBER / EVOLVE→MENDER / SALVAGE.
- Art from the SAME pack: zombie **Lookup** animation (arms raised, chanting), green tint
  (`mender_atlas`, packed by the same variant script); procedural green sac + cross fallback.
- Teach banner updated: "GRABBER (slows + rots) or MENDER (heals your zombies)".
Verified headless (deadroot-alt:4226, reload): all 11 atlases load; evolve swaps type + morph
plays; wounded zombie healed +19.5hp in 3s (≈7/s); souls spawn on kill and arrive (exit
pulses); L3 routes split ~evenly and all waypoints reachable; 1500-tick all-enemy-types sim
with boss bar + both evolutions clean; parse OK; console clean; screenshots eyeballed
(boss bar top, palette clear, reskinned raid + purple Queen render).

## Triage 2026-07-09 — Mike's L1→L3 playtest (7 inbox + 2 fresh fails)
All decisions written to Supabase (inbox statuses + claude fields; the tracker's
PT-B2 merge fix now keeps them from being re-lost). Batches:
- **DR-#046 — UI/art batch (has the BLOCKER):**
  - BLOCKER bug: boss HP bar covers the bottom build palette → relocate.
  - Desktop-first size pass: key elements AND all text bigger.
  - Raid splits randomly between paths when the Queen is reachable 2+ ways.
  - Doorway juice (from fail 7:3): exit glow ramps as the Queen nears opening,
    pulses per kill, souls fly from dead raiders to the Queen.
  - Art: audit assets/raw/ FIRST (DR-#045 lesson), reskin remaining enemies +
    the Queen from the same Engvee pack; report what actually needs sourcing.
- **DR-#047 — balance, research-first:** biomass carryover makes L3 trivial
  (inbox + today's 3:1 fail + the older too-easy thread). Research TD economy
  leveling (per-level reset/cap/soft-tax) before tuning.
- **DR-#048 — healer unit:** evolvable zombie type that heals nearby units,
  killable; slots into the evolve menu beside GRABBER.
- Stale-fail cleanup: grabber one-shot/looks/attacks (fixed DR-#043b/#045),
  hedge look (hedges removed DR-#034), onboarding + spitter-spam/maze-variety
  (DR-#041/#042/#043) — all re-marked fixed → Mike's retest queue.
