// Surker Jugend – Einblicke (Galerie) laden und anzeigen
// Liest data/einblicke.json und baut daraus die Bild-Galerie.
// So kann die Galerie über das CMS bearbeitet werden, ohne HTML anzufassen.

// Entschärft HTML-Sonderzeichen, damit aus den CMS-Eingaben kein HTML
// eingeschleust werden kann (Sicherheit) – gleiche Idee wie in aktionen.js.
function sicher(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Baut eine einzelne Galerie-Kachel als HTML-String.
function kachel(eintrag) {
  // Ohne Bild macht eine Kachel keinen Sinn -> überspringen.
  if (!eintrag.bild) return '';

  // Beschreibung nur anzeigen, wenn ausgefüllt (optional).
  const text = eintrag.text && eintrag.text.trim() !== ''
    ? `<figcaption>${sicher(eintrag.text)}</figcaption>`
    : '';

  // Als alt-Text nehmen wir die Beschreibung, sonst einen neutralen Standard.
  const altText = eintrag.text && eintrag.text.trim() !== ''
    ? sicher(eintrag.text)
    : 'Einblick in die Surker Jugend';

  return `
    <figure>
      <div class="galerie-bild"><img src="${sicher(eintrag.bild)}" alt="${altText}"></div>
      ${text}
    </figure>`;
}

// Lädt die Daten und schreibt die Kacheln in den Container.
async function ladeEinblicke() {
  const container = document.getElementById('einblicke-galerie');
  if (!container) return;
  try {
    // Cache-Buster (?t=Zeitstempel): erzwingt frisches Laden, damit
    // CMS-Änderungen auf GitHub Pages sofort sichtbar sind (siehe aktionen.js).
    const antwort = await fetch('data/einblicke.json?t=' + Date.now());
    if (!antwort.ok) throw new Error('Daten konnten nicht geladen werden');
    const daten = await antwort.json();
    const einblicke = daten.einblicke || [];

    if (einblicke.length === 0) {
      container.innerHTML = '<p>Hier kommen bald Fotos von unseren Aktionen. Schau gerne wieder vorbei!</p>';
      return;
    }
    container.innerHTML = einblicke.map(kachel).join('');
  } catch (fehler) {
    container.innerHTML = '<p>Die Einblicke konnten gerade nicht geladen werden. Bitte später erneut versuchen.</p>';
    console.error(fehler);
  }
}

ladeEinblicke();
