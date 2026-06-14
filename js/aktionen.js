// Surker Jugend – Aktionen laden und anzeigen
// Liest data/aktionen.json und baut daraus die Aktionen-Karten.
// So können die Aktionen über das CMS bearbeitet werden, ohne HTML anzufassen.

// Wandelt **fett** in <strong> um und Zeilenumbrüche in <br> –
// damit Bearbeiter im CMS einfache Formatierung nutzen können.
function formatiere(text) {
  // 1. HTML-Sonderzeichen entschärfen (Sicherheit: kein eingeschleustes HTML)
  const sicher = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  // 2. **fett** -> <strong>fett</strong>
  const mitFett = sicher.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // 3. Zeilenumbrüche -> <br>
  return mitFett.replace(/\n/g, '<br>');
}

// Baut eine einzelne Aktions-Karte als HTML-String.
function karte(aktion, index) {
  // Karten abwechselnd leicht links/rechts kippen (wie vorher im festen HTML)
  const kippung = index % 2 === 0 ? 'karte--gekippt-l' : 'karte--gekippt-r';
  // Bild nur einbauen, wenn eines hinterlegt ist (sonst leer = kein Bild)
  const bild = aktion.bild
    ? `<div class="aktion-bild"><img src="${aktion.bild}" alt="${aktion.titel}"></div>`
    : '';
  const knopf = aktion.anmeldung_url
    ? `<a class="knopf knopf--blau" href="${aktion.anmeldung_url}" target="_blank" rel="noopener">Zur Anmeldung</a>`
    : '';
  // Hat die Karte ein Bild, bekommt sie eine Extra-Klasse fürs Layout
  const mitBild = aktion.bild ? ' karte--mit-bild' : '';
  return `
    <div class="karte ${kippung}${mitBild}">
      ${bild}
      <h3>${aktion.datum} · ${aktion.titel}</h3>
      <p>${formatiere(aktion.text)}</p>
      ${knopf}
    </div>`;
}

// Lädt die Daten und schreibt die Karten in den Container.
async function ladeAktionen() {
  const container = document.getElementById('aktionen-liste');
  if (!container) return;
  try {
    // Cache-Buster (?t=Zeitstempel): hängt bei jedem Laden eine andere Zahl an
    // die Adresse, damit der Browser/Server die Datei IMMER frisch lädt und
    // nicht aus dem Cache. Wichtig bei GitHub Pages, das Dateien ~10 Min cacht –
    // so erscheinen CMS-Änderungen sofort statt mit Verzögerung.
    const antwort = await fetch('data/aktionen.json?t=' + Date.now());
    if (!antwort.ok) throw new Error('Daten konnten nicht geladen werden');
    const daten = await antwort.json();
    const aktionen = daten.aktionen || [];

    if (aktionen.length === 0) {
      container.innerHTML = '<p>Aktuell sind keine Aktionen geplant. Schau bald wieder vorbei!</p>';
      return;
    }
    container.innerHTML = aktionen.map(karte).join('');
  } catch (fehler) {
    // Falls etwas schiefgeht: freundlicher Hinweis statt leerer Seite
    container.innerHTML = '<p>Die Aktionen konnten gerade nicht geladen werden. Bitte später erneut versuchen.</p>';
    console.error(fehler);
  }
}

ladeAktionen();
