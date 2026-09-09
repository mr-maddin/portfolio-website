# Portfolio Martin Weißkircher

Persönliche Portfolio-Website. Vanilla JS, Tailwind CSS v4 und Vite, keine Frameworks, keine externen Dienste beim Laden der Seite.

## Entwickeln

```bash
npm install
npm run dev       # Entwicklungsserver mit Hot Reload
npm run build     # Produktions-Build nach dist/
npm run preview   # Build lokal ansehen
```

Der Build verwendet relative Pfade (`base: "./"`) und läuft deshalb sowohl auf einer eigenen Domain als auch unter einem Unterpfad wie GitHub Pages.

## Struktur

```
index.html             Startseite
rechtliches.html       Impressum und Datenschutz (Platzhalter)
src/main.js            Verhalten: Navigation, Scrollspy, Reveal, Kontaktformular
src/styles/main.css    Design-Tokens (@theme) und Komponenten
public/images/         Profilbild und Projekt-Screenshots
public/projects/       Demo-Projekte, werden unverändert mit ausgeliefert
```

## Design-System

- Farben: warmes Graphit als Basis (`--color-surface`), Bernstein als einziger Akzent (`--color-accent`), Grün nur für den Verfügbarkeitsstatus.
- Schriften: Bricolage Grotesque (Headlines), IBM Plex Sans (Text), IBM Plex Mono (Metadaten). Alle Schriften werden lokal über Fontsource gebündelt.
- Alle Tokens stehen am Anfang von `src/styles/main.css` im `@theme`-Block.

## Vor dem Livegang ausfüllen

Alle Stellen sind im Code mit `TODO` markiert:

1. `index.html`: Kontaktformular-Endpoint im `action`-Attribut (z. B. Formspree). Bis dahin öffnet das Formular das E-Mail-Programm.
2. `index.html`: Fiverr-Profil-URL.
3. `index.html`: Domain in `og:image` für die Social-Media-Vorschau.
4. `rechtliches.html`: Impressum und Datenschutzerklärung.
5. `public/favicon.ico` und `public/apple-touch-icon.png` zeigen noch das alte Farbschema; `public/favicon.svg` ist bereits angepasst.
