# FLIPLINE — per-platform builds

The master game is the top-level `../index.html` (wired for **CrazyGames**). Each subfolder here is a
platform-specific derivative that swaps only the SDK/ad layer — the game logic is identical. Regenerate a
build by copying `../index.html` and re-applying the SDK changes noted below.

## itch/
- **What changed vs master:** removed the CrazyGames SDK `<script>` tag (2 lines in `<head>`). Nothing else.
- The game's SDK wrappers already no-op when no SDK is present; saves fall back to `localStorage`.
- Fully self-contained, no external dependency, no ad revenue (itch is hosting/donations only).
- **Upload:** `flipline-itch.zip` (index.html at root). itch → New project → Kind: HTML → upload zip →
  check "played in the browser" → embed 960×540 + Fullscreen button + Mobile friendly → cover =
  `../covers/flipline_cover_1920x1080.png` → Public.

## gamemonetize/
- **What changed vs master:** (1) replaced the CrazyGames SDK `<script>` with the GameMonetize
  `SDK_OPTIONS` + loader (in `<head>`); (2) replaced the `Ads` object with a GameMonetize adapter.
- ⚠️ **Before submitting: replace `GAMEID_PLACEHOLDER`** in the `<head>` `SDK_OPTIONS.gameId` with the real
  gameId from your GameMonetize dashboard (create account → add game → copy gameId).
- Ad mapping: `interstitial()` → `sdk.showBanner()` (fires on final death); `rewarded()` → `showBanner()`
  then grants on the next `SDK_GAME_START` (ad-finished), with an 8s timeout fallback so a no-fill ad never
  dead-ends the reward button. Audio mute is driven globally by `SDK_GAME_PAUSE`/`SDK_GAME_START`. A preroll
  fires on `SDK_READY` (GM norm; guarantees "Verify Game" detects an ad call).
- Saves fall back to `localStorage` (GM has no data-sync module).
- **Verified locally:** boots to ready, plays clean, SDK loads, ad fallbacks correct, zero console errors.
  Only the real gameId is missing.
