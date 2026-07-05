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
