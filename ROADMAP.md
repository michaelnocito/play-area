# Rune Dash — Road to Saleable

**North star:** a calm Norse rune-runner that ships *fast* but only when its functionality
and first-hour friction won't tank ratings. Lore/story grows **through level + game design**
(Tunic-style: meaning by use), not cutscenes. Ship the slice → then beef it up.

This is the dev-owned backlog. Mike = creative director + playtest gate. Claude = dev/producer
(implements, verifies in preview, commits/pushes each `RD-#NNN`).

---

## How we build (research-backed method)

1. **In-day iteration loops.** Each session = one playable improvement, verified in the browser
   preview, committed + pushed. Sketch → build → verify → ship, same day. *(2026 solo-AI norm:
   "prototype, scope, validate inside a day" — aibuzz, Althera.)*
2. **AI-as-junior-teammate, "ask → accept → run."** Claude carries each task implement→verify→
   commit→push; Mike steers + runs the playtest gate. No long handoffs.
3. **Marketability before depth.** The core loop must be legible in <60s. We polish the *first
   five minutes* before adding content. *(First-hour friction + polish are the #1 review-tankers
   — Entalto, GameRant.)*
4. **Lore as level design.** Each realm's rune meaning is expressed in its layout, hazards, and
   omen — story you *play*, not read. *(Tunic/Inscryption: teach by consequence.)*
5. **Interest before launch.** Capsule art + a 15–30s GIF/trailer + a store/portal page go up
   while we finish — not after. *(Wishlists/interest are the top leading indicator — Wishlist Engine.)*

---

## The pipeline (gated — we do not skip the gate)

**Stage 0 — Define "saleable" + the bar.** ✅ **LOCKED 2026-06-15: web portals first**
(CrazyGames / Poki / itch.io). Rationale: already HTML5 → fastest to a revenue-earning release
(ad rev-share + sponsorships), no port, lowest friction. Mobile + Steam are post-launch. "Saleable"
v1 = a portal-accepted build that passes the Ratings-Safe Gate. Stage-3 launch prep targets portal
requirements (SDK hooks, capsule/thumbnail, no broken external links, sane aspect ratio).

**Stage 1 — First-Hour Polish (protects ratings).** Onboarding clarity, zero dead-ends/softlocks,
responsive controls, stable framerate, fast load, mobile/touch, save reliability, the reading
mechanic reads instantly. This is the marketability core.

**Stage 2 — Saleable Slice (content + lore-as-design).** Finish the realms that exist, weave lore
into each realm's design, land the meta/economy loop + the re-cast-omen monetization hook, clear
win + progression. Enough to justify a "release," no more.

**Stage 3 — Launch prep.** Capsule, 15–30s trailer/GIF, store/portal page copy, soft-launch build.

**Stage 4 — Last Test = the Gate.** Full playtest against the Ratings-Safe Gate. **Pass → ship.**
Fail → fix the failing item, retest. Then post-launch: more realms, mobile/Steam, depth.

---

## Ratings-Safe Gate (must ALL pass before we publish)

**Functionality**
- [ ] No crash, softlock, or dead-end across all playable realms (incl. fail/retry/win loops).
- [ ] Stable framerate; fast first load; works after refresh.
- [ ] Save/restore reliable (incl. mobile/`file://`/private-mode — hardened RD-#018).
- [ ] Every advertised feature works (reading, omens, Rune Bolt freeze/shatter/leap, Shrine, Heroes).
- [ ] Mobile: touch targets ≥44px; portrait/landscape sane; no frozen screen.

**Friction (the orientation principles)**
- [ ] New player understands the core loop in <60s (what to do, why it's fun).
- [ ] Player always knows: what to do next, what they've done, where they're going. *(orientation)*
- [ ] Primary action stays on-screen; secondary output never buries it. *(action-always-visible)*
- [ ] Difficulty teaches → tests → combines; no unfair spikes.
- [ ] No confusing/buried UI; instructional text is crisp + concrete.

**First impression**
- [ ] Title/first screen looks polished; audio pleasant (and OFF/ON respected).
- [ ] The reading + first realm feel intentional, not placeholder.

---

## Backlog — triaged

### NOW (Stage 1 — first-hour polish, ratings protection)
- **RD-#026 Re-cast the omen** — ad/Amber reroll of the pre-level reading (new monetization hook,
  replaces retired Norns gate). *(Mike flagged; confirmed direction.)*
- **First-hour audit pass** — play realms 0–2 cold; fix any dead-end/confusion/friction against the Gate.
- **Onboarding clarity** — ensure the reading→omen→run loop is self-explanatory in <60s.

### NEXT (Stage 2 — saleable slice)
- **Checkpoint system** — totem mid-run, respawn from CP, lore card on touch (Act 2–3 realms).
- **Flesh out stub realms** Hagalaz(3)/Isa(4)/Algiz(5)/Tiwaz(6)/Laguz(7)/Dagaz(8) — real layouts +
  lore-as-design (each realm's rune meaning expressed in its level).
- **Meta/economy tune** — make Amber + Provisions + Heroes + omens cohere into a come-back loop.
- **Richer visual omens** (Phase 2) — weather/density/light so the omen is *felt*, not just a stat.

### LATER (Stage 3–4 + post-launch)
- **Launch artifacts** — capsule, trailer/GIF, portal/store page.
- **Mobile** — make repo public → GitHub Pages soft-test; then Godot port OR Capacitor/PWA wrap.
- **Real rewarded-ad SDK** via `window.adProvider` (GameMonetize / Playgama / portal SDK).
- **Tarot/deck variant** — reuse the reading engine with a swapped deck (parked strategic asset).

### ICEBOX / cleanup
- Purge dead `RUNE_LORE[].lifeMeaning` data (inert since RD-#024).
- Lore gallery / mastery rewards / 24-rune expansion beyond the 9 realm runes.

---

## Asks captured from the 2026-06-14/15 session
- ✅ RD-#020 Hero unlocks (cosmetic, ad-OR-Amber)
- ✅ RD-#021 Menu screens scroll (the "screen won't resize / had to minimize" bug)
- ✅ RD-#022 Faster run (~205 px/s) + rune-casting animation
- ✅ RD-#023 Rune Bolt freezes→shatters shades + leap off frozen + unified "Rune Bolt" naming
- ✅ RD-#024/#025 Pre-level Rune Reading shapes the run; retired personal divination
- ☐ RD-#026 Re-cast-the-omen monetization hook (NOW)
- ✅ This ask: research-backed dev plan + go-to-market + organize the backlog (this file)
- ✅ Decision: first commercial target = **web portals first** (CrazyGames/Poki/itch) — Stage 0 locked

## Research sources
Solo-AI pipeline: aibuzz.blog/ai-in-gaming-game-development, altheragames.com/en/blog/ai-game-development-2026 ·
Review-tankers / friction: entaltostudios.com/what-makes-indie-game-successful, gamerant.com Steam review ratings ·
Go-to-market / wishlists: game-developers.org 2026 indie marketing guide, wishlistengine.com 2026 benchmarks.
