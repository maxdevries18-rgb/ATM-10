# ATM 10 Quest Guide — Project Context

## Wat is dit?
Een web app die je stap voor stap door de Minecraft modpack "All The Mods 10" helpt. Je kunt per mod quests afvinken en je voortgang wordt lokaal opgeslagen.

## Tech Stack
- Vanilla HTML/CSS/JS (geen framework, geen build step)
- Statische site, draait op GitHub Pages
- `server.js` voor lokaal testen (Node.js)
- Data in JSON bestanden, UI volledig client-side gerenderd

## Huidige staat
- **18 mods** verdeeld over 4 fases (Early, Mid, Late, Endgame)
- **242 quest stappen** met checkboxes, tips, benodigde items
- Zoekfunctie, dependencies tussen mods, progress tracking via localStorage
- Dark theme, responsive (mobiel + desktop)
- GitHub repo: https://github.com/maxdevries18-rgb/ATM-10.git
- GitHub Pages: https://maxdevries18-rgb.github.io/ATM-10/

## Structuur
```
index.html          — Hoofdpagina
css/style.css       — Layout, header, sidebar, responsive
css/components.css  — Quest steps, checkboxes, cards, animaties
js/app.js           — Entry point, laadt data en wires alles samen
js/state.js         — LocalStorage voor progress en UI state
js/renderer.js      — Alle DOM rendering
js/search.js        — Zoekindex en zoeklogica
js/dependencies.js  — Mod dependencies (prerequisites/unlocks)
data/phases.json    — 4 game fases
data/mods.json      — 18 mod definities
data/dependencies.json — Relaties tussen mods
data/quests/*.json  — Quest data per mod (sections → steps)
```
