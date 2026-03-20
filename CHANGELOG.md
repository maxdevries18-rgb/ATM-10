# Changelog

## 2026-03-20 — Mobiele Optimalisatie & UX
- [Mobile] Sidebar toggle verbeterd: groter touch-target (44px) en betere klik-interactie op touch-apparaten.
- [Mobile] Header layout aangepast: mod-header stapelt nu verticaal op kleine schermen (<480px).
- [Mobile] iOS zoom gefixed: font-size op inputs naar 16px verhoogd om automatisch zoomen te voorkomen.
- [UX] Loading overlay toegevoegd: toont een laadscherm (⛏️) tijdens het ophalen van JSON data.
- [UX] Global error handler: toont een duidelijke foutmelding als de app niet kan laden (bijv. geen internet).
- [Fix] Sidebar sluit-logica verbeterd: klik buiten de sidebar sluit deze nu betrouwbaarder op mobiel.

## 2026-03-20 — Bugfixes en Optimalisaties
- [Fix] Sidebar op desktop is nu standaard zichtbaar (transform: none reset toegevoegd aan css/style.css).
- [Fix] Phase collapse animatie opgelost: initiële hoogte is nu correct bij ingeklapte fases.
- [Fix] Section collapse animatie verbeterd: hoogte wordt nu correct afgehandeld voor dynamische content.
- [Pages] Voorbereid voor GitHub Pages: relatieve paden gecontroleerd en bestanden gepusht naar main.
- [Project] Git repository geïnitialiseerd en gekoppeld aan GitHub.

## 2026-03-20 — Initiële release
- Project opgezet met vanilla HTML/CSS/JS
- 18 mods toegevoegd over 4 fases (Early, Mid, Late, Endgame)
- 242 quest stappen met checkboxes, details, items en tips
- Zoekfunctie over alle mods en stappen
- Dependencies systeem (aanbevolen eerst / helpt met)
- Progress tracking via localStorage
- Dark theme met responsive design (mobiel + desktop)
- Sidebar met collapsible fase-groepen en voortgangspercentages
- GitHub repo aangemaakt en eerste push gedaan
- GitHub Pages configuratie voorbereid
- .gitignore toegevoegd (server.js, .claude/, CLAUDE.md)
