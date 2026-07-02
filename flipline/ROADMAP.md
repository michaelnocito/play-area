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
- [ ] Theme-flavor pass w/ Batch A (optional, cheap): softer "boing/flump" flip variant, dryer
  rumble under the bed, squeaky coin — keep the in-key system, re-voice the timbres for silly.

## 4. Visuals & identity — ❌ THE REJECTION CAUSE → Batch A

**Now:** hero = a small square; obstacles = banded rectangles; lore exists only as color math.
**Standard (CG explicit):** "high quality… visually pleasing… originality of assets."

- [ ] 🔷 **Sock hero:** drawn character (heel/toe silhouette, googly eyes, cloth flop on flip,
  stretch on speed) — replaces the square. Shop shapes become sock patterns on the SAME body.
- [ ] **World art per land:** layered parallax silhouettes themed per room-region (duct walls w/
  rivets + lint drifts → floor joists + dust motes → garden bricks + fireflies → attic beams +
  moonlight), pre-rendered to offscreen buffers (perf contract holds). Rooftop Sprint's
  procedural-art pass is the proven template.
- [ ] **Obstacles re-skinned:** red heat coils / lint clumps / hot vents — silhouette + seam
  redraw, hitboxes and formations UNCHANGED (fairness data stays valid).
- [ ] **Beacon made legible:** the pair-sock glowing on the horizon, visibly closer each land.
- [ ] **Coins → buttons** (the currency everyone loses behind the couch). Same pools/physics.
- [ ] Juice: flip squash-and-stretch, landing flump particles, static-spark trail at speed.

## 5. Content depth & goals — ❌ "NEEDS CONTENT" → Batch C

**Now:** one endless mode, palette-only variety. **Standard:** "clear goals the player can reach."

- [ ] **Discrete lands campaign** (design already CG-verified in dev notes): each land = a crafted
  stretch ending "SOCK SAFE — next room unlocked"; save via SDK.data; level-complete interstitial
  (max 1/3min, no chaining); endless = replay mode unlocked after land 1.
- [ ] **Upline redesign** (the parked second line): in sock-lore = the TOP of the dryer world?
  Design gate — vault/bloom mechanic still needs real danger before it ships. If it's not fun by
  the Batch C deadline, ship campaign on downline-only lands and keep upline parked. NOT a blocker.
- [ ] Per-land "wardrobe" milestone: each completed land banks a guaranteed shop discount or
  exclusive pattern unlock (gives lands a reward identity beyond distance).

## 6. Score & tally — ❌ INVISIBLE VALUE → Batch B

**Now:** score = raw distance; formula invisible; dead screen is static numbers.
**Standard:** every action has visible value; the tally is the retention beat.

- [ ] Point values: distance 10/m · button pickup flat value · orb grab bonus · land-crossed bonus
  · buff-earned bonus. (⚠️ NO near-miss/skim scoring — tried, physics-impossible, do not reattempt.)
- [ ] End-of-run tally screen: line-item count-up w/ tick sounds + NEW BEST stinger; the
  rewarded-ad "double it" offer moves onto the tally (its natural home).
- [ ] In-run floating popups (+50 LAND!) so values are learned during play.
- [ ] HUD: run points counter top-center.

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

## Sequencing — ONE bar, ONE wave

**BATCH A — Sock identity (the rejection lever):** hero + world art per land + obstacle re-skin +
buttons + beacon legibility + juice + audio flavor pass. Re-run sim (hitboxes unchanged → expect
identical numbers; verify anyway).
**BATCH B — Score & tally:** values, tally count-up, popups, HUD counter, ad-double onto tally.
**BATCH C — Campaign:** discrete lands + saves + level-complete ads + wardrobe milestones;
upline only if the redesign proves fun (not a blocker).
**BATCH D — Ship wave:** onboarding beat, text diet, prompts/AZERTY, name final call 🔷, store
copy, covers/clips, mobile pass, CG QA tool → **resubmit CG + update GM/GD/GameJolt/itch builds
to the same grade in one wave.**

**Live-portal note:** GM + GD are in review with the pre-rework build. Assumption (per the
one-build-everywhere rule): when the rework ships, ALL portal builds regenerate and update, even
if the old build was approved meanwhile. If Mike wants approved builds frozen instead, flag before
Batch D.
