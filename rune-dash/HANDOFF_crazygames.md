# 🎯 HANDOFF — "Mine everything for a quick-to-market CrazyGames hit"

**You are a game-design strategist + code archaeologist. Your job is research + a prioritized recommendation — NOT to build anything yet.** Read this fully, then produce the deliverable at the bottom.

> Run this as **Claude Code on Mike's machine** — you need filesystem access to his repos and the session-transcript search MCP. (claude.ai web can't reach local files.)

## The mission
Mike (solo dev, building under his own name) wants to ship a **very marketable, quick-to-market game on CrazyGames**. The seed is **Rune Dash** — his calm Norse freeze-jump auto-runner, already a single-file HTML5 build (perfect for CrazyGames: instant-play, no port needed). We want to mine *everything he's already made* for mechanics, lore, audio, level-design, and code we can **reuse or adapt** to make Rune Dash (or a Rune-Dash-adjacent title) hit on CrazyGames fast.

**The hard filter — apply it to every single recommendation:** only surface things with **clear ROI for a quick-to-market CrazyGames title**. Impact-on-marketability/retention must massively outweigh implementation time. Bias hard toward:
- Things that are **copy-paste/light-adapt reuse** from his existing HTML5/JS code (highest ROI).
- Mechanics already **proven to feel good** in his games.
- Anything that strengthens the **first-10-seconds hook**, the **core loop's juice**, or **shareability**.

Reject (or park with a one-line "later") anything that needs a Godot→HTML5 port, heavy new art, long build time, or doesn't move the CrazyGames needle. **Be ruthless. "Cool but not worth the time" = cut it.**

## The seed project — Rune Dash (current state)
- **Repo:** `github.com/michaelnocito/rune-dash` (**PRIVATE**). Local: `C:\Users\Mike\Projects\GAMES\rune-dash`. Single-file `index.html`, canvas + vanilla JS, no build step. Commits `RD-#NNN`.
- **Core mechanic (locked this week):** **freeze-jump.** Rune Bolt freezes a drifting shade into a permanent platform → you leap on it to **stomp-bounce** → **chain** bounces up an ice staircase without touching down. Prototyped/polished on the **Isa** realm (oversized "Prototype" card in realm select).
- **Feel systems already built (RD-#037→#043):** escalating combo juice (pitch-rising stomp sfx, hit-stop, screen-shake, cyan bloom + shockwave rings), **apex bullet-time** on chains, a **crescendo resolution** (major-chord swell + "CHAIN ×N +X◆" payoff pop when a chain lands), no-double-jump-on-Isa (glide-to-bridge for fine touch), a global `GAME_SPEED` pace dial, and audio that suspends when the tab is hidden.
- **Lore hook:** pre-level **Rune Reading** — you predict a rune's meaning to choose it; its omen reshapes the run. "We teach you the runes" is the differentiator.
- **Read `DEV_NOTES.md` + `ROADMAP.md` in the repo and the `project_rune_dash_state` memory for full detail.**

## Your three tasks

**1. Audit Rune Dash itself.** Review its mechanics (the bouncing, floating/gliding, freeze-jump chaining, level design), lore, and especially the **audio system** (the adaptive Web-Audio Norse score in the `Snd` closure — drone + reactive drums + bone-flute motif + combo sfx). Call out: what's already a strong CrazyGames asset, what's underused, and what small additions to the audio (or anything else) would meaningfully raise marketability. ROI-filtered.

**2. Mine ALL his other games + repos + past Claude Code chats** for anything transferable that helps a quick-to-market, marketable CrazyGames game — mechanics, juice, lore, art systems, reusable code, level-design patterns, hooks.
- **Master catalog:** the auto-memory `MEMORY.md` (loaded in your context) lists every project with location + status — use it as your index.
- **Especially look at** (action/arcade/feel-rich ones): **Hover Rails** (Godot arcade hoverboard racer — momentum, loop track, upgrade loop), **Matrix Construct / Enter the Construct** (Godot bullet-time gun-fu — the slow-mo DNA already cross-pollinated into Rune Dash), **Dance Combat Lab** (pygame rhythm-action), **Keygarden** (calm-design system, 4 art packs, breathing/return-streak retention), **SQL Quest** (client-side HTML5 game). Plus his analyst job-sim **web** games (spreadsheet/tableau-archaeology, good-enough-analytics, excel-interview, sql-dry-run) — mine these for **reusable HTML5/JS patterns and UI**, even if the theme doesn't transfer.
- **Repos:** local under `C:\Users\Mike\Projects\` and `C:\Users\Mike\Projects\GAMES\`; GitHub under `github.com/michaelnocito`. Read the relevant ones directly.
- **Past Claude Code chats:** use the session-management MCP — `mcp__ccd_session_mgmt__list_sessions` and `mcp__ccd_session_mgmt__search_session_transcripts` (search terms like "bounce", "bullet-time", "juice", "retention", "CrazyGames", "ad", "hook", "level design") to surface decisions/experiments worth reusing.

**3. Frame it for CrazyGames specifically.** Briefly verify current CrazyGames submission/marketability expectations (web-search if useful): instant HTML5 load, desktop + mobile, short pick-up-and-play sessions, strong immediate hook, the CrazyGames SDK for rewarded ads/analytics, shareability. Judge every candidate against *that* bar.

## Deliverable (output IN CHAT, copy-ready — Mike transfers it back)
A single **prioritized recommendation table/list**, each item with:
- **What** (the mechanic/asset/idea) and **source** (which game/repo/chat + file path).
- **ROI verdict:** `SHIP NOW` / `CHEAP WIN` / `MAYBE` / `CUT` — with a one-line why.
- **Effort estimate** (rough: hours/days; "reuse" vs "reimplement").
- **Marketability impact** (hook / retention / shareability / juice).

Then a short **"if I were Mike, do these 3 first"** call. Lead with your recommendation; present decisions one at a time if he needs to choose. **Don't build anything until he picks.**

## Mike's working rules (non-negotiable)
- **Solo authorship:** NO AI / Co-Authored-By trailers, ever. Commit as `Michael Nocito <hello.michaelnocito@gmail.com>`.
- **Commit + push after every change, no asking** (he pulls from git). Rune Dash commits use `RD-#NNN`.
- **Keep replies short**; for test steps, label them `NNNa`, `NNNb`… in plain language.
- **Verify in the preview before** telling him to test. Give your recommendation + why, present decisions one at a time.
- Keep local project copies **outside OneDrive** (`C:\Users\Mike\Projects`).
