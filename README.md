# Zombies Guides

A personal, non-commercial Call of Duty Zombies map-guide app, built for my own use on my
phone while playing. Not affiliated with, endorsed by, or connected to Activision or
Treyarch. No ads, nothing for sale.

Live: https://scotypreston.github.io/zombies-guide/

## Guides

| Map | Game |
|---|---|
| Zombies in Spaceland | Infinite Warfare |
| Rave in the Redwoods | Infinite Warfare |
| Mob of the Dead | Black Ops 2 |
| Origins | Black Ops 2 |
| Moon | Black Ops 1 |

## Credits

The screenshots and reference material were gathered from community guides and wikis while
researching each map. Credit to the original authors, including ZombieSlaya Mr.'s Steam
guides, Glitching Queen, the Call of Duty Fandom wiki, and GameRant. Individual captions
credit sources where a specific image came from one. If you made something here and would
rather it not be included, open an issue and I'll take it down.

## Running it locally

No build step — it's plain HTML/CSS/JS.

```bash
python -m http.server 5560
```

Then open http://localhost:5560/

## Publishing an update

```powershell
.\publish.ps1 "what changed"
```

That rebuilds the offline file list, commits and pushes. GitHub Pages redeploys in about a
minute. Add `-PurgeImages` only if you replaced an image while keeping its old filename.
