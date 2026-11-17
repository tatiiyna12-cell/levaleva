# LevaLeva – sammen på tur

Repository: https://github.com/tatiiyna12-cell/levaleva

Nettsted: https://tatiiyna12-cell.github.io/levaleva/

Komplett frontend-demo på norsk bokmål. Innlevering: **22. november 2026 kl. 23:59**. Lever GitHub-repository-lenken.

## Kjør lokalt

Åpne terminalen i prosjektmappen. Node.js 20 eller nyere er nødvendig.

```sh
npm start
```

Åpne http://127.0.0.1:4173. Ingen installasjon av avhengigheter eller byggetrinn. Stopp med Ctrl+C. Bruk HTTP-server eller VS Code Live Server; JavaScript-moduler fungerer ikke ved å dobbeltklikke HTML-filene.

## Sider og struktur

- `index.html`: forside med kommende turer.
- `turer.html`: kalender, turdetaljer og demonstrasjon av påmelding.
- `ny-tur.html`: ansattskjema med lokal lagring av demoturer.
- `css/style.css`: felles responsivt design.
- `js/data.js`: turmodell, eksempelturer og datofunksjoner.
- `js/repository.js`: adapter som senere kan erstattes av API-kall.
- `js/app.js`: kalender, modalvindu og skjemainteraksjon.
- `assets/`: original vedlagt logo og egen landskapsillustrasjon.
- `tests/`: tester av kalender og kapasitet.

Kalenderen viser inneværende og neste uke og flyttes én uke om gangen. Datoer følger Europe/Oslo. Demoturene genereres fra forrige uke til fem uker etter inneværende uke. Senere uker kan være tomme.

Modalvinduet viser alle påkrevde turdetaljer. Escape, lukkeknappen og klikk utenfor lukker vinduet. Påmeldingsknappen vises bare for fremtidige turer med ledige plasser. Knappen viser en demomelding; ingen registreres og ingen plass reserveres. Deltakernavn finnes ikke i datasettet.

Værvinduet er definert som i dag og de neste tre dagene, altså fire kalenderdager totalt. Værdata er tydelig merket som demonstrasjon. Brukeropprettede demoturer har ingen værmelding.

Ansattsiden har ingen autentisering i denne frontend-demoen. Demoturer lagres i sessionStorage i denne nettleserfanen. De deles ikke mellom brukere. Hvis lagring blokkeres, vises en melding. Ikke legg inn sensitive opplysninger.

## Backend senere

Turmodellen: `id`, `title`, `date` (YYYY-MM-DD), `time` (HH:mm i Europe/Oslo), `leader`, `start`, `route`, `duration` (minutter), `capacity`, `booked` (kun antall), `pace`, `accessible`, `info`, `weather` (objekt eller null).

Erstatt `tourRepository.list()` og `create()` med API-kall og gjør kallstedene asynkrone. Backend må validere felter, håndheve ansattroller, koble til ID-porten og kontrollere kapasiteten atomisk. Offentlige svar skal bare inneholde antall deltakere. Hemmelige nøkler skal ikke ligge i frontend.

## Test

```sh
npm test
```

Seks tester er bestått: ukegrenser, årsskifte, skuddår, norsk dato, værvindu, kapasitet og demodata. I nettleser er ukebytte, modal, Escape, fullbooket tur, demopåmelding og lokal opprettelse kontrollert. Alle tre sider er målt uten horisontal overflyt ved 390 px bredde. Forsiden og mobilkalenderen er visuelt inspisert.

Før innlevering: kontroller tomme/ugyldige skjemafelt, tastaturnavigasjon, en tur langt frem i tid, en annen nettleser og den publiserte siden. Ingen full tilgjengelighetsrevisjon er utført.

## Publiser på GitHub Pages

1. Opprett et repository, for eksempel `levaleva`. Velg Public hvis du bruker GitHub Free.
2. Last opp innholdet i denne mappen. `index.html` må ligge i repository-roten. Behold undermappene; ikke last opp bare ZIP-filen.
3. Commit filene til `main`.
4. Åpne Settings → Pages. Velg Deploy from a branch, `main` og `/(root)`, og lagre.
5. Vent på publisering og åpne adressen GitHub viser, vanligvis `https://BRUKERNAVN.github.io/levaleva/`.
6. Test alle tre sider. Lever repository-lenken `https://github.com/BRUKERNAVN/levaleva`; legg gjerne ved nettstedet også.

Relative lenker fungerer under repository-undermapper. `.nojekyll` er inkludert. Node-serveren brukes kun lokalt. Prosjektet er publisert på GitHub og GitHub Pages.

Offisiell veiledning: [Creating a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).

## Grafikk

Logoen er det originale vedlagte bildet uten endringer. Bildet er allerede beskåret øverst og nederst; bytt filen hvis en komplett original blir tilgjengelig. Landskapet er en egen SVG-illustrasjon, ikke et kart eller foto av den faktiske ruten. Ingen eksterne fonter, bildekilder eller sporing lastes inn.
