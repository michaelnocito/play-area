# Rune Dash — Design Handoff

> Paste this whole file into a fresh Claude session (or Claude's design/artifact mode) to bring it up to speed. It's self-contained — you don't need the codebase to riff on visuals, UI, marketing, icon, or store art. The actual game is one file: `index.html` (canvas + vanilla JS, no build step).

---

## What it is (one breath)

A **calm, low-cognitive-load auto-runner platformer** with a Norse / celestial soul. You play a **völva** (a Norse seer) who runs the bridge between nine realms. Tap to leap, hold to soar, fire a **Rune Bolt** to freeze foes into platforms. You gather **Amber** (Freya's tears) and grow your power one run at a time.

It is deliberately the *opposite* of Subway Surfers: unhurried, hypnotic, made for adults. Underserved niche.

**The center of gravity / core hook:** *"We teach you the runes."* Before each level the völva reads three runes for the road ahead; you predict what a rune means, then learn the truth, and that rune's power shapes the run. The audio, the lore, and the art all serve this one promise — you leave knowing something real.

**Signature mechanic:** freeze-jump. Bolt a drifting shade → it becomes a permanent ice platform → leap on → **stomp-bounce** → chain bounces upward, each higher than the last, with rising audio that **resolves** in a warm chord when you land. Think Mario stomp-chain meets a crescendo.

---

## Audience & positioning

- **Who:** adults who want a beautiful, meditative reflex game — broad appeal, men and women alike. Never pander or skew "young boys." Art-first and inclusive. (See house rule below.)
- **Vibe words:** calm, hypnotic, warm, mythic, low-friction, flow-state, earned.
- **Anti-vibe:** frantic, cluttered, gacha-noisy, childish, neon-arcade.
- **Commercial path:** web portals first (CrazyGames / Poki / itch), then mobile (iOS/Android), then maybe Steam. Free base game + optional rewarded ads + a small ~$2.99 IAP.

---

## Visual DNA (pulled straight from the live build)

### Core palette (CSS variables)
| Token | Hex | Use |
|---|---|---|
| `--bg0` | `#0b0a1f` | deepest background / theme color |
| `--bg1` | `#1a1140` | mid background |
| `--panel` | `#140f33` | cards, modals, panels |
| `--ink` | `#e8e6ff` | primary text (soft lavender-white) |
| `--dim` | `#9a98c8` | secondary text |
| `--gold` | `#ffd479` | Amber currency, rewards, highlights |
| `--rune` | `#7fd4ff` | rune / ice / "magic" cyan |

Backgrounds are **radial gradients** from a lit center to near-black edges (e.g. `radial-gradient(140% 120% at 50% -10%, #15103a 0%, #07061a 72%)`). The whole UI feels like looking up into a deep night sky.

### Accent / state colors
- **Cyan `#9fe8ff` / `#7fd4ff`** — runes, ice, Rune Shards (skill currency), the freeze mechanic.
- **Gold/amber `#ffd479` / `#ffe6a0`** — the Amber currency, ad buttons, payoff bursts.
- **Reward green `#8fe6a0`**, **wrong/warm `#ffc08a`** — reading-quiz feedback.
- **Combo heat ramp:** cyan → gold → hot, scaling with chain length (the `⚡ ×N` counter shifts hue as you chain).

### Type
- UI font: `"Segoe UI", system-ui, sans-serif` (clean, no custom webfont yet — open to a tasteful display face for the logo).
- Title `RUNE DASH`: `clamp(34px, 8vw, 72px)`, weight 800, letter-spacing `.06em`, with a **gradient text fill** `linear-gradient(180deg,#fff,#9fb8ff 60%,#7fd4ff)` — white at top melting into cyan.
- Buttons: rounded, dark `#191347` fill, `#4a3f8f` border; primary = purple gradient `#3a2f8f→#241a5e` with a brighter `#8a7cff` edge and glow on hover.

### The "seer's cloth" sub-theme
The rune-reading screens break from the dark sky into a **warm linen** surface — `radial-gradient(125% 130% at 50% 26%, #efe6cb 0%, #d6c8a2 58%, #b1a279 100%)` — runestones tumble from the hand and land on it. Dark-sky game / warm-cloth divination is an intentional two-mode contrast worth leaning into.

### The hero: the völva
Drawn in canvas as a hooded seer with a flowing cloak and a **realm-hued magical aura**. Four cosmetic skins (same silhouette, swapped cloak/hood palette + bolt projectile):
- **Völva** (free default) — `#2a2058 / #120d2e` cloak, cyan shard bolt
- **Berserker** — deep red `#5a2a22`, ice-axe bolt
- **Thor's Chosen** — blue `#1d3a6a`, gold hammer bolt
- **Odin's Eye** — slate `#34314c`, violet feather bolt

### The nine realms (each has its own sky gradient + hue + rune glyph)
3 Acts × 3 realms. Each realm's `sky` is a 3-stop horizon gradient (dark → mid → lit band).

| Realm | Rune | Theme | Sky stops | Mood |
|---|---|---|---|---|
| Sowilo ᛋ | Sun | Realm of the Sun | `#241327 → #5a2c4a → #c25e5e` | warm dusk rose |
| Raidho ᚱ | Ride | Realm of the Ride | `#0c1330 → #1b2c66 → #3f7fb5` | cool sky-blue |
| Wunjo ᚹ | Joy | Realm of Joy | `#121a06 → #263c10 → #5a8a1e` | green meadow |
| Hagalaz ᚺ | Storms | Realm of Storms | `#140b2a → #2a1a52 → #5a3f9a` | violet storm |
| Isa ᛁ | Ice | Realm of Ice ⭐ | `#0a1a2a → #143a52 → #3f9ab5` | frozen cyan (the prototype realm) |
| Algiz ᛉ | Protection | Realm of Protection | `#0a1c0e → #143a1e → #2a7840` | warding green |
| Tiwaz ᛏ | Justice | Realm of Justice | `#1e0a0a → #3a1010 → #8a2828` | blood red |
| Laguz ᛚ | Flow | Realm of Flow | `#060a18 → #0e1830 → #1a3060` | deep water |
| Dagaz ᛞ | Dawn | Realm of Dawn | `#1a1606 → #36300c → #a07c18` | golden dawn |

---

## The screens (current UX flow)

1. **Title** — `RUNE DASH`, tagline *"The völva runs the bridge of realms. Tap to leap, hold to soar. Gather amber and grow your power. One run at a time."*, one **Begin the Run** button, a control hint line.
2. **Choose a Realm** — Amber + "Whispers heard" counters, grid of realm cards (Act I/II/III dividers). Isa's card is deliberately oversized with a "✦ Prototype" tag.
3. **Rune Reading** (the hook) — three runes cast face-up on the linen cloth → tap one to predict its meaning (3 choices) → reveal teaches the true meaning + the omen it grants → **"Walk this path"** starts the run.
4. **The run** — full-screen canvas; minimal HUD (Amber drops, combo `⚡ ×N`, active boon badges).
5. **Shrine of Skills** — spend Amber on permanent upgrades + evergreen Provisions (boons) + Hero skins.
6. **Results** — *"✦ Realm Cleared ✦"* or *"The run ends…"*, run stats, best chain, "Claim +N Bonus Essence — Watch a short ad", Run Again.

---

## In-game "feel" / juice already built (for animation/motion reference)

- Stomp-chains escalate: each bounce higher, a forward **lunge** surge, **hit-stop** freeze-frames, **screen-shake**, expanding **cyan shockwave rings**, **apex bullet-time** on chains ≥2.
- The `⚡ ×N` combo counter grows and hue-shifts cyan→gold→hot as the chain climbs.
- Particle bursts: white impacts, gold amber-pickup sparkles `#ffd479`, purple kill-rings `#c9a3ff`, cyan freeze-shatter `#bfe9ff`.
- Audio is an adaptive Norse score — calm drone + frame-drum + bone-flute, with each realm having its own flute motif (the music itself teaches the rune).

---

## What I'd love design help with (pick any — open brief)

These are *suggestions*, not constraints. Surprise me.

1. **Logo / wordmark** — a real `RUNE DASH` lockup (the current one is gradient system-font). Norse-runic but legible and calm, not metal-band.
2. **App / portal icon** — single strong symbol (the völva? a single rune in amber? an ice-platform chain?) that reads at 64px and on a CrazyGames thumbnail.
3. **Title-screen art direction** — a hero key-art treatment for the title and store pages. The völva on the bridge of realms, deep starfield, warm amber accents.
4. **Realm-select redesign** — nine realms is a lot of cards. A more evocative map / constellation / bifröst-bridge layout that shows progression across 3 Acts.
5. **The reading screen** — make the dark-sky → warm-linen divination moment feel sacred and tactile. This is the hook; it should be the prettiest screen.
6. **Marketing one-pager / store capsule** — how do we sell "calm auto-runner that teaches you the runes" to a portal in one image?
7. **A cohesive design-system spec** — tighten the palette/type/spacing/components into something reusable as the game grows.

---

## House rules for whoever picks this up (Mike's standing preferences)

- **Calm, low cognitive load, flow-state** above all. If it adds visual noise or friction, it's wrong.
- **Broad, inclusive appeal** — art-first; never pander to or superficially target a gender.
- **Player orientation always:** the player should always know what to do next, what they've done, and what to do *right now*. The primary action must stay visible — secondary output never covers it.
- Norse / celestial flavor is the skin; the *learning* (you actually leave knowing the runes) is the substance. Don't let theme become costume-only.
- Single-file, no-build-step ethos for the prototype — anything handed back should drop into `index.html` cleanly or be a standalone asset.

---

*Source of truth for game logic: `index.html`, `RUNE_DASH_ROADMAP.md`, `RUNE_DASH_DEV_NOTES.md` in this repo (github.com/michaelnocito/rune-dash, private). This handoff covers the design surface only.*
