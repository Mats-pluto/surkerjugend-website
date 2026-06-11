# Surker Jugend – Website

Statische Website für die Surker Jugend. Kein Baukasten, kein Cookie-Banner nötig,
volle Kontrolle. Gebaut mit HTML, CSS und einer Mini-Portion JavaScript.

## Struktur

```
site/
├── index.html              Startseite (Hero, Teaser, News, Instagram-Hinweis)
├── ueber-uns.html          Über uns
├── gruppenstunden.html     Termine: Offene Gruppenstunden
├── aktionen.html           Termine: Aktionen (mit Anmelde-Links)
├── leiterrunde.html        Alle Leiter*innen + Brutus
├── einblicke.html          Foto-Galerie (aktuell Platzhalter)
├── location.html           Pfarrheim + Google-Maps-Link
├── downloads.html          Dokumente
├── impressum.html          Impressum (§ 5 TMG)
├── datenschutz.html        Datenschutzerklärung (Entwurf – prüfen!)
├── css/style.css           Alle Styles, Design-Tokens oben in :root
├── js/main.js              Hamburger-Menü
├── assets/                 Logos, Favicon, Kreisel-Symbole
├── assets/fonts/           Montserrat + Nunito, lokal (kein Google-CDN!)
└── downloads/              ⚠️ docx-Dateien hier ablegen (siehe Checkliste)
```

## Design-Tokens

Alle Farben und Grundwerte stehen in `css/style.css` ganz oben unter `:root`:

| Variable        | Wert      | Verwendung                       |
|-----------------|-----------|----------------------------------|
| `--blau`        | `#0049ac` | Primärfarbe, Buttons, Hero       |
| `--dunkelblau`  | `#07015b` | Überschriften, Footer, Schatten  |
| `--himmel`      | `#eaf1fc` | helle Abschnitt-Hintergründe     |
| `--akzent`      | `#ffc72c` | Sonnengelb, sparsam (Buttons, Marker) |

Gelb zu auffällig? Einfach `--akzent` auf einen Blauton ändern – fertig.

## Warum kein Cookie-Banner?

Die alte Jimdo-Seite brauchte eins wegen: Instagram-Embeds, Google-Maps-Embed,
Google-Form-Embeds und Jimdo-Tracking. Die neue Seite **verlinkt** stattdessen
nach draußen (erst beim Klick fließen Daten) und hostet Schriften lokal.
→ Keine Einwilligung nötig, kein Banner.

## Launch-Checkliste

- [ ] **Downloads:** Die 3 docx-Dateien von der alten Seite herunterladen und in
      `downloads/` ablegen mit exakt diesen Namen:
      `einverstaendniserklaerung-bildrecht.docx`,
      `gesundheitszeugnis-2026.docx`, `medikamenteneinnahme-2026.docx`
- [ ] **Fotos:** Galerie-Platzhalter in `einblicke.html` durch echte `<img>` ersetzen
      (Bilder z.B. in `assets/fotos/` ablegen). Vorher Einverständnis fürs
      Bildrecht prüfen!
- [ ] **Team-Fotos (optional):** In `leiterrunde.html` die Initialen-Avatare durch
      Fotos ersetzen: `<div class="avatar"><img src="..." alt="Name"></div>`
- [ ] **Anmelde-Link Maiaktion:** In `aktionen.html` steht aktuell bei beiden
      Aktionen derselbe Google-Form-Link (von der alten Seite war nur der
      Fahrt-Link auslesbar). Richtigen Link für die Maiaktion eintragen.
- [ ] **Datenschutzerklärung:** Entwurf in `datenschutz.html` prüfen (lassen) und
      den gelben internen Hinweis-Kasten entfernen.
- [ ] **Deploy:** Ordner auf Netlify ziehen (Drag & Drop) oder Repo verbinden.
- [ ] **Domain:** `surkerjugend.de` von Jimdo zu Netlify umziehen
      (DNS bzw. Nameserver beim Domain-Anbieter ändern).
- [ ] **Erst danach** Jimdo kündigen.
