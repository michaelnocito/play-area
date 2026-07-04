# rooftop-sprint / tools

## rs_playtest.js — headless bot fairness suite

Runs the real `../index.html` game script inside a node `vm` with a stubbed DOM, injects a
debug hook at load (the shipped file is never modified), and drives `update()` directly —
no rAF, so the preview-tab-freeze gotcha and the slow-mo systems are bypassed entirely.

```
node tools/rs_playtest.js
```

Bots play at four reaction tiers (perfect/sharp/average/slow) and the summary prints
median distance/survival per tier plus death causes (`gap` / `guard` / `low`).

**Fairness bars — re-run after EVERY mechanics change:**
- elite (perfect+sharp) bots never die to `gap` → all gaps single-jump clearable
- elite bots never die to `low` → the slide trigger window is honest
- tiers separate cleanly → skill actually matters

**Gotcha worth keeping:** the canvas 2d-context stub must be a *chainable callable Proxy*
(`get`→proxy, `apply`→proxy). The draw code chains `ctx.x(...).y` freely; a plain object
stub throws on the first frame and the whole IIFE dies silently.

`RS_SEED=<n>` picks the deterministic mulberry32 stream (default 20260703). `RS_HTML=<path>`
points the suite at another build (e.g. `git show <sha>:index.html > /tmp/x.html`) to check
whether a failure is a regression or a pre-existing seed-specific flake — same seed, two
builds, compare death causes. `RS_DEBUG=1` dumps death forensics (nearby guards, segment
layout) to stderr on every non-survival ending.

## rs_qa_sweep.js — deep invariant sweep (timing + spacing, not just fairness)

Same vm/stub pattern as `rs_playtest.js`, extended with more internals (braziers, per-tier
kill counts, `mode`/`modIdx`) and a richer bot that also reacts to feints, archers, and
whiff recovery. Checks things the fairness suite doesn't:

```
node tools/rs_qa_sweep.js
```

- **guardOffRoof** — every alive, non-flying guard/Captain must sit on SOME active segment
  (catches "shoved/placed past the roof edge into gap airspace" bugs)
- **hazardOffRoof** — same check for low obstacles
- **consecutiveGap** — two gaps in a row with no roof between (the §6 root-cause class)
- **formationOverlap** — two alive guards within 4px of each other (catches formation
  members that can drift/clamp into the same spot)
- **pool exhaustion** — peak active count per pool vs its `MAX_*`; at-ceiling is a signal
  spawns may be silently dropping under heavier play than the fairness suite exercises
- **timing tier + encounter tallies** — CLEAN/HEAVY/PERFECT/DOMINO/CAPTAIN counts, feint
  blocked-vs-open ratio, whether archers/braziers/boons were ever exercised in the sweep
- **mode coverage** — runs a short Night Shift and Daily Trial session, not just campaign

`RS_QA_VERBOSE=1` prints the first occurrence of each violation kind with full context
(positions, segment bounds, patrol ranges). Three real bugs were found and fixed this way
2026-07-03: an unclamped Captain knockback that could shove him off his own roof into a gap;
a domino chain that could one-shot a Captain past his intended 3-hit sequence; and formation
members sharing a patrol range wide enough to eventually walk into each other (fixed by
giving the whole line a fixed post, like archers already had — no drift, no possible overlap,
regardless of roof length).
