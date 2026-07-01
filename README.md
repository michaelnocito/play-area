# Play Area

Consolidated repo for Michael Nocito's browser games. Each game is a
self-contained subfolder (own `index.html`, own dev notes) merged in via
`git subtree` from its original standalone repo, so full commit history
survived the move.

- [`flipline/`](flipline/) — one-button gravity-flip runner (CrazyGames submission).
- [`rooftop-sprint/`](rooftop-sprint/) — auto-scroll rooftop runner, jump + strike.
- [`rune-dash/`](rune-dash/) — calm auto-runner with the freeze-jump mechanic.

Root `index.html` is a simple hub linking to each. Served via GitHub Pages.

Godot desktop games (Camelot Hills, Hover Rails, Inconnu Heretic, Matrix
Construct, Nexus Godot, Rune Wanderer) live in local-only git repos under
`C:\Users\Mike\Projects\GAMES\` — no GitHub hosting, since they ship as
Windows exes, not web builds.
