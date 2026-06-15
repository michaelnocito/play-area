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

## First-hour audit findings (2026-06-15, data-backed via live level instrumentation)
Measured at ~205 px/s across all 9 realms. **Confirms Mike's playtest observations:**
- **Dead air:** longest empty stretch (no foe/coin/obstacle) = **885–1380 px ≈ up to ~6.7s of nothing**
  per realm. Sowilo has a 1330px void near x≈5260.
- **Bobbing foes never reach the run lane:** **0 / all foes** in every realm dip low enough to threaten
  a grounded runner (foe bottom-of-bob sits ~30px above the player's head). Floating = harmless unless
  you jump. → confirms "bouncers should come to the bottom of the platform."
- **Layout repetition:** realms **4–8 (Isa/Algiz/Tiwaz/Laguz/Dagaz) are byte-identical** (shared stub
  builder); realms 0–3 reuse the same coinArc + obstacle-run + foe-row motifs. → confirms "too similar."
- **Sparse density:** foes 1.0–2.8 / 1k px, coins 4.2–8.7 / 1k px.

## Backlog — triaged

### NOW (Stage 1 — first-hour polish, ratings protection)
- **RD-#026 Re-cast the omen** — ad/Amber reroll of the pre-level reading (new monetization hook,
  replaces retired Norns gate).
- **RD-#027 Foe "divers"** — some foes bob DOWN into the run lane (to platform bottom) so they're real
  timing threats + freeze targets; vary amplitude/phase per foe. *(Mike: bouncers come to the bottom.)*
- **RD-#028 Kill the dead air** — fill the 885–1380px voids with rhythm (coins/foes/optional routes);
  target no stretch >~2–2.5s empty. *(Mike: no-enemy/no-coin stretches.)*
- **RD-#029 Layout variety** — differentiate the 5 identical stub realms + vary placement/enemy patterns
  per realm (authored chunks + realm identity). *(Mike: placement/enemies feel too similar.)*

### NEXT (Stage 2 — depth/retention; research-backed: stats + achievements + unlockables drive replay)
- **RD-#030 End-of-level metrics screen (saveable)** — time, coins, enemies frozen, enemies killed,
  freeze-jump combos, best/PB. For the data geeks. *(Mike.)* *(Cumulative stats = long-term goal hook.)*
- **RD-#031 Badges / achievements** — Flawless (kill all), Deep Freeze (freeze all), Coin Collector,
  Speedrun (time), combo badges. Per-realm, persisted, shown on results + realm select. *(Mike; research.)*
- **RD-#032 Skill-trick reward** — freeze → stomp → jump-again chain drops a **Rune Shard** ✅ (decided
  2026-06-15): a rare *skill-only* currency, spent on exclusive Heroes/cosmetics. Visible combo counter;
  bigger chains = more shards. Optional, skill-gated, no forced friction; aspirational come-back sink. *(Mike.)*
- **RD-#033 Revive-by-ad** — watch a rewarded ad to continue from where you died (sanctioned ad moment).
  *(Mike.)*
- **Checkpoint system** — totem mid-run, respawn from CP, lore card on touch (Act 2–3 realms).
- **Meta/economy tune** — make Amber + Provisions + Heroes + omens + skill-reward cohere into a come-back loop.
- **Richer visual omens** (Phase 2) — weather/density/light so the omen is *felt*, not just a stat.

> **Design constraint (Mike):** no feature may add friction beyond the enjoyment it returns — EXCEPT
> sanctioned ad moments (revive-by-ad, omen reroll). Skill rewards stay optional, never blocking.

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
