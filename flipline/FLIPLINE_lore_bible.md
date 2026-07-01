# FLIPLINE — Lore Bible: *The Long Way Home*

> **Tells its whole story with zero words.** No cutscenes, no captions, no reading — the lore lives
> entirely in light, color, motion, and expression, so the instant-play loop stays pure. Pair this
> with the visual/perf handoff; every idea here obeys the same performance contract (no per-frame
> allocation, no per-frame gradients/shadowBlur, dt-capped loop) and the locked feel/fairness rules.

---

## 1. The premise (felt, never stated)

You are a small **traveling light**, lost far from home, crossing strange realms to get back. You
don't know the way — you just keep moving forward and hold your light together. Home is a distant
**beacon** that, run by run, grows a little closer.

Nobody is ever *told* this. They *feel* it: the loneliness of a single light in a vast dark, the pull
of a far glow on the horizon, the relief when the world opens up around you.

---

## 2. The Emotional Light — the primary narrator

The traveler **emits a radius of illumination**, and that radius **breathes with its emotional state**,
revealing more or less of the world. This is how the character "speaks."

- **Hope / joy** (Clean Pass, clean landing, milestone, nearing the beacon): glow **blooms wide & warm**,
  revealing motes, the beacon, zone detail → uplift, momentum.
- **Strain / fear** (obstacle very near, falling fast, long stretch with no Clean Pass): glow
  **constricts & dims**, the periphery darkens, the world closes in → tension, isolation.
- **Travelling** (normal): a steady medium glow → quiet determination.
- **Setback** (crash): light **snuffs to a spark**, then **re-blooms** on respawn → "down, not out."
- **Empowered** (Shield / Slow-mo / 2× gates): a brief **flare** → a surge of safety/clarity.

The light pairs with the **existing expressive face**: the *radius* carries the intensity of the
emotion, the *face* carries its flavor (worried / whoa / grin). Together = full wordless emotion, and
it doubles as readability — the world literally opens up when you're playing well.

### Perf-safe implementation (read before building)
Do NOT use a per-frame gradient or shadowBlur. Cache it:
- **Once at init:** render a soft radial light sprite (white→transparent) to a small offscreen canvas
  with a gradient *one time*; keep it as an image.
- **Per frame:** ease a single scalar `lightR` (dt-based) toward a target set by the states above.
  Draw a translucent dark vignette over the field, then blit the **cached** sprite (scaled to `lightR`,
  at the player) to punch the lit hole. Zero per-frame gradients, fully within the contract.
  *(Implementation note: the hole is punched into a cached offscreen darkness buffer with
  `destination-out`, then that buffer is blitted over the world — doing `destination-out` on the main
  canvas would punch through to the page background instead of revealing the lit world.)*
- Drive `lightR` the way `bgPulse` already works (Clean Pass / land bloom; proximity-to-nearest-
  obstacle and fall speed constrict). Respect the **reduce-flashing (`lowFx`) toggle** — keep a
  calmer, less-constricting light so it never feels oppressive.

---

## 3. Home — the beacon (direction + progress, wordless)

A faint point of light sits on the far horizon and **grows brighter/larger with progress**. Tie it to
**best distance** long-term (home gets nearer the better you do), and brighten it within a run as you
pass milestones. It gives the endless runner a *destination* — reaching a new best = the beacon
visibly closer = a wordless "you got nearer home."

---

## 4. The world as a journey (re-theme what we already have)

- **Zones = lands you pass through.** Arc the palette so it *feels* like it trends from cold/strange
  toward warm/golden (homeward), even as it loops — early zones lonelier, deeper zones grander.
- **Trail = the path you've travelled**, the thread to where you've been.
- **Red = the wilds** — the harsh unknown between you and home, not a cartoon villain. Stays
  unmistakably red (danger reads instantly); only the *meaning* changes, never the function.
- **Skins = forms a wanderer takes / fellow travelers** — all far from home.

---

## 5. Death & rebirth (the retry loop *is* a beat)

A crash isn't failure — it's the light **guttering**, then **relighting** as you set out again. The
world resets, the beacon's still there. "Tap to retry" becomes *pressing on*, not *starting over*.

---

## 6. Wordless beat sheet

- **Open:** one small light in a wide dark, a far beacon → "lonely traveler, long way to go."
- **Moment to moment:** light breathes with hope/fear; face reacts; trail streams behind.
- **Crossing a zone:** color shifts → a new land. (Optional collectible flavor: a small wordless
  glyph per land — still no prose.)
- **Milestone / new best:** light blooms, beacon steps closer → "nearer home."
- **Crash:** light guts and relights → "press on."
- **Long game:** best distance pulls the beacon ever closer; skins reframe *who* travels.

---

## 7. Composes with the build
Reuses the face, zone palette, trail, bgPulse, milestones, best distance, skins, gates, death burst.
Adds only: one cached **light sprite**, a `lightR` scalar, and a **beacon** element. Visuals only —
movement, difficulty, fairness, and the hitbox stay locked.

## 8. One line for the implementer
> "Add *The Long Way Home* wordless lore: a breathing emotional light (cached radial sprite + a single
> `lightR` scalar that blooms on hope / constricts on fear), a growing home-beacon tied to best
> distance, and zones re-themed as lands. No text, no cutscenes. Obey the perf contract — cached sprite
> only, no per-frame gradients/shadowBlur — and respect the reduce-flashing toggle."

---

## Implementation status (2026-06-21)

All three features shipped in `index.html`:
- **Emotional light** — `lightR` eased scalar; blooms on hope (Clean Pass / landing / milestone /
  gate), constricts on fear (obstacle proximity + fall speed); snuffs to a spark on death, re-blooms
  on respawn; Shield = wide gold flare, Slow-mo = calm-wide, 2× = bright. Cached `LIGHTSPR` punched
  into the offscreen `DARK` buffer, blitted over the world. `lowFx` floors the radius + lightens the
  gloom. Darkness alpha 0.38 keeps incoming red readable.
- **Home-beacon** — warm additive `LIGHTGOLD` glow on the horizon, grows with `best` distance +
  brightens on each milestone.
- **Zones as lands** — `ZONES`/`ACCENTS` re-themed cool→warm (night → dusk → cold dawn → amber →
  gold-home) per cycle; danger stays red.

Verified: light state machine validated numerically; adversarial perf + readability audits passed
(the spotlight is decorative, not gating — obstacles are always read at the dimmed floor and stay
perceivable, so fairness holds).
