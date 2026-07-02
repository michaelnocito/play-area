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
