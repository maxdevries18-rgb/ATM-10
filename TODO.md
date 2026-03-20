# To Do

## Bugs (hoge prioriteit)
1. GitHub Pages activeren en testen op mobiel (Klaar voor activatie: bestanden gepusht, relatieve paden gecontroleerd)

## Voltooid ✅
2. Sidebar zichtbaar maken op desktop — wordt nu alleen getoond via hamburger menu (Gefixed met CSS media queries en expliciete transform reset)
3. Phase collapse animatie: initiële maxHeight ontbreekt bij ingeklapte fases (Gefixed met expliciete else-clause in renderer.js)
4. Section collapse: maxHeight wordt niet herberekend na content wijzigingen (Gefixed door maxHeight na animatie te resetten naar 'none')

## Verbeteringen (functioneel)

5. Export/Import functie voor progress (zodat je voortgang kunt back-uppen)
6. Quest data uitbreiden met meer gedetailleerde stappen per mod
7. Afbeeldingen/iconen toevoegen per mod en bij items
8. Filterfunctie toevoegen (toon alleen incomplete stappen)
9. "Reset progress" knop toevoegen per mod en globaal
10. Notities-veld per stap waar je eigen aantekeningen kunt toevoegen
11. Donker/licht theme toggle
12. PWA maken (offline beschikbaar, installeerbaar op telefoon)
13. README.md op GitHub bijwerken met project beschrijving en screenshot
14. Laadscherm/spinner tonen tijdens app initialisatie (nu blank scherm tijdens laden)
15. Foutmelding tonen als quest JSON bestanden niet laden (nu blijft "loading" tekst staan)

## Prestatie
16. Sidebar niet volledig opnieuw renderen bij elke stap-toggle — alleen het betreffende mod-item bijwerken (js/app.js)

## UX verbeteringen
17. Keyboard navigatie voor zoekresultaten (pijltjes omhoog/omlaag, Enter om te selecteren, Escape om te sluiten)
18. Scroll positie onthouden bij wisselen tussen mods
19. Scroll lock op body wanneer sidebar open is op mobiel (voorkomt scrollen van achtergrond)
20. Zoekresultaten sluiten nu ook bij klik op het zoekveld zelf — alleen sluiten bij klik buiten het zoekgebied (js/app.js)

## Toegankelijkheid (accessibility)
21. ARIA labels toevoegen: aria-expanded op section headers, role="progressbar" op voortgangsbalken, aria-label op checkboxes
22. Focus-visible stijlen toevoegen voor keyboard navigatie (sidebar toggle, mod items, checkboxes)
23. Labels koppelen aan checkboxes (nu geen `<label>` element)

## Beveiliging
24. HTML escaping toevoegen bij het renderen van stap-teksten en zoekresultaten — nu wordt innerHTML gebruikt met ruwe data (XSS risico bij toekomstige externe data)
