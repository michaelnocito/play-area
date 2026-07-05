# GAME BIBLE — Minimum Standard for All Game Builds

This is gospel. Every game project (this repo and beyond) is built against this document.
It is the distilled result of CrazyGames research (docs.crazygames.com, verified 2026-07-03),
one rejection (Flipline), one accepted-pipeline submission (GameMonetize), and the full
Jade Fist design restructure. When a new chat starts a game task: read this first, then the
project's **<GAME>_HANDOFF.md** if one exists (current state + roadmap the last session left —
e.g. `deadroot/DEADROOT_HANDOFF.md`), then its <GAME>_DEV_NOTES.md, then build. A handoff names
what to pick up next; wait for the user to choose roadmap item IDs before building.

**Prime rule: before building ANY feature, check it against Part 1 and Part 2. If a game
fails Part 2, no amount of Part 1 compliance saves it.**

---

## Part 1 — Platform requirements (CrazyGames, the strictest bar we target)

Acceptance is judged on **depth and retention potential**. Full launch is gated on
**average playtime, conversion, and retention**. Compliance gets you reviewed; only
engagement gets you launched.

### Technical musts
- **No Escape** in controls (closes fullscreen). **No Ctrl/Cmd+W** (closes tab).
- **AZERTY support**: bind ZQSD/Q alongside WASD/arrows.
- **No custom fullscreen button** — the platform provides one.
- Consistent resolution throughout; no compression artifacts; **crisp at high
  devicePixelRatio** (scale the canvas backing store, don't CSS-stretch a logical buffer).
- Fixed-timestep game logic — stable at any refresh rate including 144Hz.
- Instant response to input; smooth flow; fast load (our single-file approach loads instantly).

### UX musts
- **≤1 input from load to gameplay.** Menus never stand between the player and playing.
- **Teach in gameplay**, visual-first, minimal text, skippable. Show, don't explain.
  Only teach the core verbs; let depth reveal itself.
- Device-adaptive: prompts say "tap" on touch, key names on desktop. Desktop first,
  mobile working.
- Clear labeled buttons, no delays or dark patterns, no misdirection.
- Legible at every supported resolution and pixel ratio.

### Content musts
- Clear reachable goals. Easy to learn. Controls consistent throughout.
- **No boring or repetitive stretches** — this is a stated rejection reason.
- One consistent visual style (never mix realistic and cartoony).
- Original assets only; name/iconography not confusable with existing IP.
- The game is honest about what it is. PEGI 12 ceiling for our builds.
- If multiplayer exists, solo play is equally prominent.

### SDK (wire before submission)
- v3: `await window.CrazyGames.SDK.init()` before anything else.
- **Game module**: `gameplayStart`/`gameplayStop` bracket active play (menus, pause,
  tally = stopped). `loadingStart`/`loadingStop` around loads.
- **Ad module**: midgame + rewarded ads, adblock detection. Rewarded ads must offer real
  value (extra life, double currency) but never gate core play.
- **Data**: localStorage is auto-backed by "Automatic Progress Save" (zero code) and
  cloud-synced for logged-in users — tick the "Progress Save" toggle in the submission flow.
- Use the **adapter pattern** (rooftop-sprint/flipline have it): all SDK calls behind one
  object with a localhost no-op fallback, so the game runs identically in dev.

---

## Part 2 — Design gospel (why Flipline failed and what fixes it)

Flipline was rejected on "quality." It was compliant. It was also a score-only endless
game with no reason to play a fourth run. These are the laws that came out of that and
the Jade Fist rebuild:

1. **There must be something to beat, not just a number to raise.** A campaign shape:
   levels/districts/stages, a final challenge, an ending. Endless mode is a POST-game
   reward (unlock it by finishing), never the whole game.
2. **Runs need an arc.** Waves or beats with rest moments, named milestones ("wave 8",
   "the Temple"), and bosses as punctuation. Death should have an identity ("felled on
   wave 4 of the Market"), not just a score.
3. **Progression must change play, not just stats.** Stat upgrades (hearts, reach) are
   seasoning. Real progression = new techniques, verbs, or options the player didn't have
   before. Rank ladders (belts) must GATE something mechanical or they're paint.
4. **Upgrades compress the warm-up or add options — never raise the skill ceiling.**
   ~×2 cost per tier; first buy within 1-2 runs (Rogue Legacy tally-screen flow: spend
   right on the death screen, one tap).
5. **Every run should differ from the last.** Daily trials, boon/curse choices, rotating
   modifiers. Cheap systems, huge next-run curiosity.
6. **Difficulty is drama, not a treadmill.** Spikes and relief, not a monotone ramp.
   Skill must run out of runway honestly: punish spam (whiff recovery), reward precision
   (perfect-timing tiers), escalate reads (feints, adaptive enemies).
7. **Depth lives inside few verbs.** Two-button games can carry huge depth if every new
   enemy/technique reframes the same inputs. Add reads before adding buttons.
8. **The player always knows** what to do now, what they just did, where they're going,
   and what's next (goal-gradient nudges, "N foes to next belt", next-district tease).
9. **Every mechanic has a visible tell.** New behavior = new color/flash/silhouette,
   taught by encounter, not by text. Real telegraphs look and sound different from fakes.
10. **A fantasy frame, however small.** Three lines of story, named places, a destination,
    an ending screen. "Mechanic" is not an identity; give the player a tale to retell.
11. **Retention hooks are layered, never gating**: daily return bonus + streak, daily
    trials, one-time bounty milestones, rank ladder, unlockable modes. All bonus, no walls.
12. **Design for broad appeal** — art-first, inclusive, calm-confident tone. Never pander.

### The critical test (run it on every build before calling it done)
Ask brutally: Why play a 4th run? What changes between runs? What does rank N unlock?
Where's the ending? What's the one-line pitch a player tells a friend? If any answer is
"nothing" or "score," the design isn't done.

---

## Part 3 — How we build (workflow standards)

- **Build on strengths first.** When triaging playtest feedback, reinforcing what's
  already landing well is the top priority — before spending effort on what doesn't
  work, double down on what players react to positively. Log positive feedback with
  the same rigor as bugs (playtest-tracker's 👍 strength tag, or a PASS note), and
  give it its own "build on it" roadmap lane, not just a checkmark. Only pour extra
  effort into non-strengths once the strengths pass has had its due — a weak feature
  polished to 6/10 rarely beats a strong feature pushed to 9/10.
- **Research first** at every new system/milestone: check how shipped games solved it,
  check platform docs, THEN build the right-sized thing.
- **Single-file web games by default**: one `index.html`, canvas + vanilla JS, procedural
  art + WebAudio, no assets, no build step. Instant load is a feature.
- **Fixed 60Hz timestep**, single rAF loop, visibility-change clock reset.
- **Versioned localStorage save** (`<game>_save_v1`), defensive load with defaults,
  `persist()` on every meaningful change. Bank progress on EVERY death.
- **Audio**: layered voices (transient click + mid body + bass + sub garnish), consistent
  levels, mute toggle persisted (M key + on-screen button).
- **Juice is mandatory**: hit-stop, screen shake, slow-mo on big moments, popups,
  particles, pitch-rising combo audio. Feel before features.
- **Task numbering**: `XX-#NNN` per project in commits and DEV_NOTES; one batch per
  commit; commit + push after every change without asking (solo authorship, no AI
  trailers, author = Michael Nocito <hello.michaelnocito@gmail.com>).
- **<GAME>_DEV_NOTES.md per game (unique game-prefixed filename, never generic)** is the design log: every batch documented with rationale.
  It's the handoff. Keep it current in the same commit.
- **Test steps enumerated** (`013a`, `013b`, ...) so pass/fail is precise. Parse-check
  (`node -e "new Function(script)"`) before every commit. Mike playtests on the live URL;
  no local preview needed for deployed sites.
- **After any change, always give the play link**: live URL + full local path.
- **Keep sessions short**: one or few batches per chat; git + DEV_NOTES + memory let a
  fresh chat resume instantly.
- **Design-batch cadence**: gap report → prioritized batches → one batch at a time to a
  polished finish line. Producer mindset: triage every request as blocker vs. backlog,
  and give every backlog item a touch.

---

## Part 4 — Pre-submission checklist (run top to bottom before any store/portal submit)

- [ ] Escape/Ctrl+W unused; AZERTY works; no custom fullscreen
- [ ] Crisp at devicePixelRatio > 1; stable at 144Hz; legible on mobile
- [ ] ≤1 input to gameplay; onboarding visual, in-game, skippable
- [ ] Pause exists (and auto-pause on tab blur)
- [ ] SDK wired: init, gameplayStart/Stop, loading events, rewarded + midgame ads, adblock-safe
- [ ] Progress Save toggle ticked (localStorage = free cloud save)
- [ ] The critical test (Part 2) passes with real answers
- [ ] Audio levels consistent; mute persists
- [ ] Original name + thumbnail; PEGI 12; honest description
- [ ] No cross-promo links, no external links
- [ ] **DEV MENU stripped** (see Part 5) — no `DEV:BEGIN..END` block in the submitted build
- [ ] Full playthrough QA on the live URL, desktop + mobile

---

## Part 5 — Dev menu (every game must have one; strip it before launch)

**The term.** What we're building is an in-game **debug menu** (a.k.a. dev menu / cheat
menu). The values it exposes for live tweaking are **tunables** or **cvars** ("console
variables", the id-Software/Valve term for named settings you change at runtime). The
build that ships with it stripped is the **release/shipping build**; the one that keeps it
is the **dev build**. The industry library most associated with these panels is **Dear
ImGui** (immediate-mode debug UI). We roll our own tiny DOM panel instead, same idea.

**Why it's mandatory.** Playtesting is a tune-retest-repeat loop. Editing a constant,
saving, and reloading for every tweak is death by a thousand cuts. A live dev menu lets
the value change while the game runs, so a whole session's worth of balance calls happens
in one sitting. This is standard studio practice.

**The rules (all games, going forward):**
1. **Gate it behind `?dev=1`** (plus auto-on for localhost) so players never see it:
   `const DEV = new URLSearchParams(location.search).has('dev') || location.hostname==='localhost';`
2. **Comment-mark the whole thing** with `DEV:BEGIN` / `DEV:END` (like the SDK markers) so
   a pre-launch step can strip it cleanly. Keep every dev-only line inside those markers.
3. **Nothing inside is load-bearing.** Real gameplay must run identically with the whole
   block deleted. Knobs write to the config/flags the game already reads; they add nothing.
4. **Strip before launch, save the dev version.** The submitted build has the block
   removed (Part 4 checkbox). The dev build stays in git history (and/or an `index.dev.html`),
   so the knobs are one revert away next time you tune.

**Canonical knobs (research-backed — grant/spawn/skip/view-modes/god are the standard debug
set; add game-specific tunables on top):**
- **Game speed** 1x/2x/4x (fast-forward testing)
- **God mode** (the thing you'd otherwise die to, made harmless — test long sessions)
- **Grant currency** (+N of the game's resource)
- **Spawn / skip / clear** (force the next wave, spawn a specific enemy, clear the field)
- **View modes** (show ranges / hitboxes / paths — the "debug draw" overlays)
- **Per-system tunables** — the sliders specific to this game (e.g. Deadroot: warden fire
  rate / damage / range)

Reference implementation: `deadroot/index.html`, `DR-#019 DEV:BEGIN..END`.
