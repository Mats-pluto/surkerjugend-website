// Surker Jugend – News-Abschnitt auf der Startseite laden
// Liest data/news.json und zeigt den Text im NEWS-Abschnitt an.
// So kann die News über das CMS bearbeitet werden, ohne HTML anzufassen.

// --- Mini-Markdown-Wandler -------------------------------------------------
// Wandelt einen einfachen Markdown-Text in sicheres HTML um. Wir nutzen
// bewusst KEINE große Bibliothek (kein CDN -> kein Cookie-Banner, weniger
// Ballast), sondern unterstützen nur das, was die News wirklich braucht:
//   - Absätze (Leerzeile trennt Absätze)
//   - **fett**            -> <strong>fett</strong>
//   - [Text](https://...) -> Link (öffnet in neuem Tab)
//   - einzelne Zeilenumbrüche -> <br>
// Sicherheit: Zuerst werden ALLE HTML-Sonderzeichen entschärft. Dadurch kann
// niemand über das CMS echtes HTML/JavaScript einschleusen. Erst danach setzen
// wir unsere erlaubten Formatierungen gezielt wieder ein.

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Formatiert EINEN Absatz: erst fett, dann Links, dann Zeilenumbrüche.
function formatiereAbsatz(absatz) {
  let html = escapeHtml(absatz);

  // **fett** -> <strong>fett</strong>
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // [Text](URL) -> <a href="URL">Text</a>
  // Nur http/https-Links zulassen (Sicherheit: kein javascript: o.ä.).
  html = html.replace(/\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener">$1</a>');

  // Einzelne Zeilenumbrüche innerhalb eines Absatzes -> <br>
  html = html.replace(/\n/g, '<br>');

  return html;
}

// Wandelt den gesamten Markdown-Text in mehrere <p>-Absätze um.
function markdownZuHtml(text) {
  // Leerzeile(n) trennen Absätze.
  const absaetze = text.split(/\n\s*\n/);
  return absaetze
    .map(a => a.trim())
    .filter(a => a !== '')
    .map(a => `<p>${formatiereAbsatz(a)}</p>`)
    .join('');
}

// --- News laden ------------------------------------------------------------
async function ladeNews() {
  const container = document.getElementById('news-text');
  if (!container) return;
  try {
    // Cache-Buster (?t=Zeitstempel): erzwingt frisches Laden, damit
    // CMS-Änderungen auf GitHub Pages sofort sichtbar sind (siehe aktionen.js).
    const antwort = await fetch('data/news.json?t=' + Date.now());
    if (!antwort.ok) throw new Error('Daten konnten nicht geladen werden');
    const daten = await antwort.json();
    const text = (daten.text || '').trim();

    // Abschnitt bleibt immer sichtbar. Bei leerem Text zeigen wir
    // einen freundlichen Platzhalter statt einer leeren Fläche.
    if (text === '') {
      container.innerHTML = '<p>Aktuell gibt es keine Neuigkeiten. Schau bald wieder vorbei!</p>';
      return;
    }
    container.innerHTML = markdownZuHtml(text);
  } catch (fehler) {
    container.innerHTML = '<p>Die News konnten gerade nicht geladen werden. Bitte später erneut versuchen.</p>';
    console.error(fehler);
  }
}

ladeNews();
