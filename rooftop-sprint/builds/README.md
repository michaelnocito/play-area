# ROOFTOP SPRINT — per-platform builds

The master game is the top-level `../index.html` (wired for **CrazyGames**). Each subfolder here is a
platform-specific derivative that swaps only the SDK/ad layer — the game logic is identical (the `CG`
adapter object keeps the same interface, so every call site is untouched). Regenerate a build by copying
`../index.html` and re-applying the SDK changes noted below.

## itch/
- **What changed vs master:** removed the CrazyGames SDK `<script>` tag; `CG` object replaced with pure
  no-ops; saves go straight to `localStorage`.
- Fully self-contained, no external dependency, no ad revenue (itch is hosting/donations only).
- **Upload:** `rooftop-sprint-itch.zip` (index.html at root). itch → New project → Kind: HTML → upload
  zip → check "played in the browser" → embed 960×540 + Fullscreen button + Mobile friendly → Public.

## gamemonetize/
- **What changed vs master:** (1) CrazyGames SDK `<script>` replaced with the GameMonetize `SDK_OPTIONS`
  + loader; (2) `CG` object replaced with a GameMonetize adapter; (3) `update()` gains an `adPaused`
  guard — `SDK_GAME_PAUSE` freezes the sim so nothing moves under an ad, `SDK_GAME_START` resumes.
- ⚠️ **Before submitting: replace `GAMEID_PLACEHOLDER`** in `SDK_OPTIONS.gameId` with the real gameId
  from the GameMonetize dashboard.
- Ad mapping: `interstitial()` → `sdk.showBanner()` (fires on death screen); `rewarded()` → showBanner
  then grant on next `SDK_GAME_START`, 8s no-fill timeout fallback (currently unused by the game — wired
  for a future revive/bonus flow). Preroll fires on `SDK_READY` so "Verify Game" always sees an ad call.
- No audio system in the game yet, so ad mute hooks are not needed.
- **Verified locally:** boots to menu, run starts, SDK loader injects, pause/resume hooks live, zero
  console errors (the "Handler scope is deprecated" warnings come from GameMonetize's own SDK).

## gamedistribution/
- **What changed vs master:** same shape as gamemonetize/ but with the GameDistribution `GD_OPTIONS` +
  loader, `gdsdk.showAd()` / `gdsdk.showAd('rewarded')`, and `SDK_REWARDED_WATCH_COMPLETE` reward grant.
- ⚠️ **Before submitting: replace `GAMEID_PLACEHOLDER`** in `GD_OPTIONS.gameId` with the real gameId
  from developer.gamedistribution.com.
- **Verified locally:** boots to menu, run starts, GD SDK v1.x loads, pause/resume hooks live, zero
  console errors.

## Still needed before submission (all platforms)
- Cover/thumbnail art (GM wants 512×512 etc.; GD wants 512×384, 512×512, 200×120, 1280×720 — reuse the
  crop technique from `../../flipline/covers/gm_covers.py` / `gd_covers.py` once a master cover exists).
- A short gameplay clip for listings that ask for one.
- Real-device mobile touch pass.
