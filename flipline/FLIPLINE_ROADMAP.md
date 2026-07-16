# FLIPLINE → ODD SOCK — Roadmap to CrazyGames-grade

Dev-owned backlog. Standard: **is this genuinely fun and polished by small-game best practices,
and does it clear CrazyGames' quality guidelines?** North star changed 2026-07-02 (Mike's call,
same as Rooftop Sprint): no more speed-to-portals — ONE quality bar, ONE build everywhere.

**Rejection context:** CrazyGames rejected the current build 2026-07-01 on their subjective
quality clause. Their published levers (docs.crazygames.com + the only concrete staff feedback on
record anywhere: *"needs content and polishing — looks like a prototype"*): visual quality,
originality of name/assets, clear goals, content depth. Resubmission is officially allowed after
"meaningful improvements," but repeat non-compliant submissions risk account restrictions —
**we get one good resubmission shot; the game must look visibly different when they open it.**

Status: `[ ]` todo · `[~]` partial · `[x]` done · 🔷 = Mike's direct design call

---

## 🧦 THE REWORK: "ODD SOCK" (🔷 Mike's call 2026-07-02)

New identity — fun and silly, instantly readable, keeps every built emotional system:

- **Hero:** a runaway sock with googly eyes, tumbling through the world behind the laundry —
  dryer ducts, under-floor passages, the secret routes of a house. Cloth flop/stretch on flip.
- **Mini-lore:** *every lost sock is on a journey home to its pair.* The existing home-beacon =
  its pair, glowing on the horizon. Zones/lands = rooms/regions of the house-world (dryer duct →
  under-floor → garden wall → attic…). The reunion is the ending. The ENTIRE Long-Way-Home system
  (beacon, zone sweeps, emotional spotlight) survives — it just becomes legible and funny.
- **Danger stays red:** hot coils, red lint clumps, licking heat — the fairness rule is untouched.
- **Shop = sock cosmetics:** stripes, polka dots, argyle, holiday socks, a toe-hole (rarity!),
  trails = loose threads/static sparks, auras = static cling glow. The 17-item shop maps 1:1.
- **Name:** working title **ODD SOCK** — final name call after the graphics land (🔷 Mike:
  rename decision "probably after we redo graphics"). Candidates: ODD SOCK / SOCK HOP / TUMBLE.
- **Tone:** silly on the surface, weirdly heartfelt underneath ("where lost socks go" is a joke
  everyone already knows). Store copy rewrites AFTER the rename decision so nothing ships stale.

---

## 1. Fairness & difficulty — ✅ AT STANDARD (bot-verified 2026-07-02)

1,500 runs × 5 reaction tiers (`tools/sim.js`, re-run at HEAD): clean monotonic skill separation
(median 393 / 559 / 891 / 1,252 / 1,384m), **zero early-death friction at every tier**, deaths
spread across all 6 formations and concentrated in top speed brackets. Locked flip constants stay
locked. Re-run the suite after EVERY mechanics change — standing practice.

## 2. Performance & tech — ✅ AT STANDARD

Fixed dt cap, zero-alloc pools, DPR-aware native-res canvas, single-file instant boot, no
external assets beyond the SDK. Meets the 144Hz/165Hz physics-consistency requirement (the exact
check Rooftop Sprint failed). Keep the perf contract sacred (see FLIPLINE_DEV_NOTES.md pillars).

## 3. Audio — ✅ AT STANDARD (theme pass optional)

Procedural SFX in-key (PENT), directional flip, techno bed, ad ducking, mute + CG muteAudio.
- [x] Theme-flavor pass w/ Batch A (2026-07-10): flip re-voiced as a soft directional cloth
  "flump" (triangle + low noise puff), low looping dryer-rumble bed added under the music
  (one-time nodes, routed through Music.gain so mute/duck still silence it). Coin sparkle kept.

## 4. Visuals & identity — ❌ THE REJECTION CAUSE → Batch A

**Now:** hero = a small square; obstacles = banded rectangles; lore exists only as color math.
**Standard (CG explicit):** "high quality… visually pleasing… originality of assets."

- [x] 🔷 **Sock hero** (2026-07-10): baked sock sprite system (white mask tinted live for Chroma +
  glows, 6 baked pattern socks) — heel/toe silhouette, googly eyes w/ glancing pupils, reactive
  mouth, cloth-flop rotation with vertical motion, speed stretch, vertical mirror on the ceiling.
  SHAPE shop axis became sock PATTERNS (Stripes/Polka/Argyle/Heel Pop/Holiday/Toe Hole) on the
  same body — saves/costs/indexes unchanged.
- [x] **World art per land** (2026-07-10): 4 themed parallax masks — dryer duct (riveted panels +
  vent slats) → under-floor (joists + hanging studs) → garden wall (staggered bricks + stems) →
  attic (rafters + box stacks); picked by land index, tinted per-land on the existing RIDGEBUF
  pipeline (perf contract holds).
- [x] **Obstacles re-skinned** (2026-07-10): style 0 = HEAT COIL (drifting glowing element rings),
  style 1 = LINT CLUMP (mottled fluff, hot half-band, scalloped free edge carved INWARD so
  visual ⊆ hitbox). Hitboxes/formations UNCHANGED — sim re-run confirms fairness holds.
- [x] **Beacon made legible** (2026-07-10): the warm PAIR SOCK sprite drawn inside the horizon
  glow — visibly a sock now, still grows/nears with best + lands crossed.
- [x] **Coins → buttons** (2026-07-10): 4-hole stitched-rim button draw; currency glyph ◆ → ●
  across HUD/tally/shop. Same pools/physics/values.
- [x] Juice (2026-07-10): landing flump dust puffs (both surfaces), static-cling sparks above
  305 px/s, cloth-flop + speed-stretch on the hero. (Flip squash was already in.)
- Also fixed in passing: ready-screen "survives 1 hit" buff description overlapped the watch-ad
  pill — description folded into the START BOOST header line.

## 5. Content depth & goals — ❌ "NEEDS CONTENT" → Batch C

**🔷 CAMPAIGN RESTRUCTURE (Mike 2026-07-11): Level 1 = INSIDE THE DRYER (drum dodger).**
New core mechanic prototyped in `proto/drum.html`: 3rd-person view INTO the drum cylinder;
the sock rides the rim and steers around the circumference to dodge red heat arcs coming out
of THE LOST SOCK VORTEX (the level goal); STATIC CLING charges while sliding and spends on a
leap (brief invulnerable hop). The drum itself tumbles. Research-grounded (Tunnel Rush is a
CrazyGames staple; Tempest/Super Hexagon readability rules: every pattern leaves a gap
reachable at max steer speed). The EXISTING flip-runner becomes Levels 2+ (UNDER THE FLOOR →
GARDEN WALL → ATTIC). ⏳ Feel-gate: Mike playtests the prototype before it's promoted into
the main build; needs its own bot-sim fairness harness when promoted.

**Now:** one endless mode, palette-only variety. **Standard:** "clear goals the player can reach."

- [ ] **Discrete lands campaign** (design already CG-verified in dev notes): each land = a crafted
  stretch ending "SOCK SAFE — next room unlocked"; save via SDK.data; level-complete interstitial
  (max 1/3min, no chaining); endless = replay mode unlocked after land 1.
- [ ] **Upline redesign** (the parked second line): in sock-lore = the TOP of the dryer world?
  Design gate — vault/bloom mechanic still needs real danger before it ships. If it's not fun by
  the Batch C deadline, ship campaign on downline-only lands and keep upline parked. NOT a blocker.
- [ ] Per-land "wardrobe" milestone: each completed land banks a guaranteed shop discount or
  exclusive pattern unlock (gives lands a reward identity beyond distance).

## 6. Score & tally — ✅ DONE (Batch B, 2026-07-11)

- [x] Point values: distance 10/m · button 25×val · orb +150 · land crossed +250
  (`PTS_M/PTS_BTN/PTS_ORB/PTS_LAND`). Old metre-based best migrated ×10 once via `bestV:2`
  save flag. Button/coin ECONOMY stays distance-based — points never inflate currency.
  (⚠️ NO near-miss/skim scoring — physics-impossible, do not reattempt.)
- [x] End-of-run tally: 4 line items + TOTAL count up one per beat w/ tick sounds, NEW BEST
  stinger (Snd.flow), tap-to-skip; retry/shop/upsells only appear once the tally lands; the
  rewarded-ad "double buttons" offer lives on the tally now.
- [x] In-run floating popups: "+250 NEW LAND", "+150 <BUFF>" (buttons keep their "+N ●" pop).
- [x] HUD: run points top-centre, metres small beside it.

## 7. Onboarding — [~] → Batch D

**Now:** 1 tap to gameplay ✓, skippable ✓, free shield orb ✓ — but the teach is a text tagline.
**Standard (CG explicit):** "implement the onboarding in gameplay… prioritize visuals, limit text."

- [ ] First-run slow-time beat on the first obstacle: pulsing TAP glyph + arrow, once,
  penalty-free (Rooftop Sprint teach-beat pattern).
- [ ] Ready-screen text diet after the rename (one silly hook line max).

## 8. UX & plumbing — ✅ mostly AT STANDARD

Pause (Esc/P/corner/auto on tab-hide) ✓ · mute ✓ · retry ≤1 input ✓ · rotate prompt ✓.
- [ ] Desktop vs touch prompts (show keys on desktop, TAP on touch — currently generic).
- [ ] AZERTY: W/Z alternates (CG guideline).

## 9. Monetization & SDK — ✅ AT STANDARD

Revive ladder w/ policy-compliant ad gating ✓, cooldowns ✓, adapters for CG/GM/GD (+SDK-free
itch/GameJolt) ✓. Rewarded-ad double moves to tally screen in Batch B (no policy change).

## 10. Submission assets & QA — Batch D

- [ ] Cover art + full crop set REDONE post-rework (hero frame from the live game; reuse
  `covers/gd_covers.py` / `gm_covers.py` pipelines).
- [ ] Gameplay clips redone (MessageChannel-paced capture, WEBM — gotchas in memory/dev notes).
- [ ] Store copy rewritten in sock voice AFTER the name is final.
- [ ] Real-device mobile touch pass.
- [ ] CrazyGames QA tool pass, then resubmit — ONCE, with everything above landed.

---

## 🧺 DRUM PLAN — 🔷 DRUM-ONLY ARC LOCKED (Mike 2026-07-11)
One game, one control scheme: the drum dodger IS the submission. Flip-runner (Batches A/B/B2
work) held as a post-launch content update ("the journey continues UNDER THE FLOOR") — scores
CG's "frequently maintained" guideline; never mixed into the first review.

### Gameplay-quality gaps vs CG top-100 (Slice Master / Drive Mad / OvO / Tunnel Rush tier),
### researched 2026-07-11 — QUALITY FIRST, then compliance/content:
- **GQ-1 Input feel:** steering is constant-velocity "cursor" movement — add ~80ms ease-in/out,
  sock lean/stretch into travel, reversal dust kick. (Latency fine; feel is the gap.)
- **GQ-2 Five-layer feedback + celebration hierarchy:** catch has 2/5 layers (sound, anim) —
  add 60-90ms hit-stop, camera micro-zoom punch, catch-COMBO counter w/ rising-pitch audio
  (port the pentatonic-ladder idea); PopCap model: action→combo→stage→journey tiers.
- **GQ-3 Music:** none (rumble+beeps). Port procedural bed, re-voiced for the dryer; intensity
  opens with vortex proximity + stage.
- **GQ-4 Rhythm & near-miss:** linear ramp, no surge/relief waves (port TUMBLE concept), no
  GRAZE reward — pass close to hot laundry = spark + static sliver. (Skim was physics-impossible
  in the flip-runner — documented; drum geometry makes graze a one-subtraction check. Safe here.)
- **GQ-5 Telegraphs at speed:** faint rim landing-arc markers once tumble speed crosses a
  threshold (Tunnel Rush-style forewarning).
- **GQ-6 Variety cadence:** top-100 = new read every 30-60s; we have 5 patterns/3 garments
  forever → each stage adds ONE behavior (drifting towel, zipper whip, unbalanced-load wobble),
  SPIN CYCLE finale gauntlet before the vortex.
- **GQ-7 Ceremony:** vortex suck-in slow-mo + button confetti + stinger; stage/NEW BEST fanfares.
- **GQ-8 First-60s teach beats:** one-time slow-time on first cool garment + first full static
  (visual glyph, no text) — CG onboarding guideline.

**🔷 STORY LOCK (2026-07-11):** the sock dives into the vortex CHASING ITS PAIR, which got
sucked in first — pair visible spiralling in the vortex mid-run, ready/stage screens carry
the hook. The reunion stays the ending (C2).

**❌ CATCH & FLING CUT (🔷 Mike 2026-07-11):** collecting coins + powerups is enough —
cool garments, catch, fling, and the catch-combo removed; tap = static ride only.

**🔥 ENGAGEMENT REWORK (🔷 Mike 2026-07-12: "novelty wears off, mechanics not engaging"):**
research-ranked experiments, one feel-gate each — ✅ E1 CHASE meter (risk = speed = catching
your pair, who races you on the progress bar; Downwell coupling) + ✅ E2 loot-in-danger
(colClear removed for currency; pennies thread gaps, quarters beside hot hems; Mario-coin
rule) + ✅ currency → diegetic LOOSE CHANGE ¢ (pennies/quarters, tumble spin, clink).
❌ E3 STATIC LEAP + B1 HIT=TOSSED — built 2026-07-12, 🔷 REVERTED same day ("plays like
garbage"). DO NOT REBUILD: player displacement (chord leap replacing the ride, knockback,
coin scatter) fights the read-and-steer core. Centre RIDE restored and locked · ⏳ E4
telegraphed drum-jam pressure events (folds into GQ-B surges; world moves, NOT the player).
Escape hatch: if E1+E2 fail the feel-gate, revisit the core verb (SPIN-THE-DRUM inversion)
before spending GQ-B/C2.

### Build order (locked): ✅ GQ-A feel & feedback DONE 2026-07-11 (GQ-1,2,4-graze — steering
ease/lean/reversal dust, 60-90ms hit-stop, camera zoom punches, graze reward, story lock;
see dev notes) → GQ-B sound & drama — ✅ CORE DONE 2026-07-16 as the DRUM ALIVE batch
(GQ-3 music bed keyed to CHASE+progress, GQ-4 surges = DRUM JAM grind→surge→relief + E4,
beat-locked spawns on the dryer thump, living tumble ramp, HOT ¢×2 visible risk pay,
hem-hug coin trails; see dev notes; GQ-7 ceremony still open) → C1 compliance (pause/auto-pause, music-mute persisted, AZERTY, CG SDK
adapter w/ rewarded mend + stage-break interstitials, DEV:BEGIN/END menu, shared ODD SOCK
save, real-device mobile pass) → C2 content depth (4-5 authored stages w/ GQ-5/6 reads,
ENDING + endless unlock, drum bot-sim fairness harness) → C3 score/meta (Batch-B tally port,
points, shop port = sock patterns, daily gift, milestones, GQ-8 beats) → C4 ship wave
(covers/clips/store copy in sock voice, 🔷 name final call, CG QA tool, ONE resubmission).

## 🧺 DRUM AUDIT vs CG standards (2026-07-11, docs re-verified) — ~40-45% to retail-worthy

Core loop + identity = SOLVED (the unfixable-by-polish rejection lever). Proto is 0%
platform-compliant. Rejection levers: identity 🟡 (needs drum art/music/juice), depth 🔴
(same drum faster; CG bar = 10+ min avg playtime, 10-15% D1 retention), score 🔴 (port
Batch B), onboarding 🔴 (text-only). Bible P1 fails: pause, mute+music, AZERTY, SDK, dev
menu, drum sim harness, shared save, device pass. Critical test: pitch ✅ ("lost sock
dodging burning laundry inside the dryer"), ending ❌, run-variety ❌, 4th-run reason thin.
**Path: C1 compliance (1 session) → C2 content depth/stage identities + ending (2+) →
C3 score/tally/shop port (1-2) → C4 ship wave (1-2). 🔷 Open call: submit drum-only
(rec) vs drum+flip-runner combined.**

## Sequencing — ONE bar, ONE wave

**BATCH A — Sock identity (the rejection lever): ✅ DONE 2026-07-10** (see §3/§4 above). Sim
re-run at HEAD confirms hitbox-identical fairness. Mike playtests feel/look next.
**BATCH B — Score & tally: ✅ DONE 2026-07-11** (see §6 above).
**BATCH B2 — Pacing & theme lock: ✅ DONE 2026-07-11** (🔷 Mike playtest call: "huge gaps in
action, feels bland" + "background must be representative of the sock theme"). Landed:
- **Theme LOCKED: THE JOURNEY HOME.** 4 named lands cycling — THE DRYER (run starts inside the
  drum) → UNDER THE FLOOR → THE GARDEN WALL → THE ATTIC — chasing the pair-sock beacon. Palette,
  ridge, backdrop set-piece (porthole+lifters / pipes+cobweb / clothesline w/ hung laundry /
  moonbeam+bulb) and wall texture (drum perforations / floorboards / bricks / beam grain) all
  keyed to one land index. Land-name banner on entry + on every crossing; death identity on the
  tally ("in THE ATTIC").
- **Pacing:** RAMP 0.15→0.30 (🔷 restore approved — top speed ~630m, avg players reach the fast
  band); loot from 20m; normal lures from 80m (was 175); lure cadence 18–34m (was 30–54);
  solos-only cut 100→50m; formation onsets ~40% sooner; dips from 70m.
- **TUMBLE surges:** every ~110–160m past 90m — 4s telegraphed dense burst ("TUMBLE!", spacing
  ×0.72 clamped at GAPMIN, button shower, music filter wide open, shake) → 3s relief (spacing
  ×1.45, solos only). Difficulty is drama now, not a treadmill.
- Sim re-run at the new tuning — see FLIPLINE_DEV_NOTES.md for numbers.
**BATCH C — Campaign:** discrete lands + saves + level-complete ads + wardrobe milestones;
upline only if the redesign proves fun (not a blocker).
**BATCH D — Ship wave:** onboarding beat, text diet, prompts/AZERTY, name final call 🔷, store
copy, covers/clips, mobile pass, CG QA tool → **resubmit CG + update GM/GD/GameJolt/itch builds
to the same grade in one wave.**

**Live-portal note:** GM + GD are in review with the pre-rework build. Assumption (per the
one-build-everywhere rule): when the rework ships, ALL portal builds regenerate and update, even
if the old build was approved meanwhile. If Mike wants approved builds frozen instead, flag before
Batch D.
