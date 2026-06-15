// Surker Jugend – Leiterrunde laden und anzeigen
// Liest data/leiter.json und baut daraus die Leiter-Karten.
// So kann die Leiterrunde über das CMS bearbeitet werden, ohne HTML anzufassen.

// Entschärft HTML-Sonderzeichen, damit aus den CMS-Eingaben kein HTML
// eingeschleust werden kann (Sicherheit) – gleiche Idee wie in aktionen.js.
function sicher(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Rechnet aus einem Geburtsdatum (z.B. "2004-01-01") das aktuelle Alter aus.
// Wichtig: Es reicht NICHT, nur die Jahre abzuziehen – sonst wäre jemand,
// der dieses Jahr noch keinen Geburtstag hatte, ein Jahr zu alt. Deshalb
// ziehen wir 1 ab, falls der Geburtstag dieses Jahr noch nicht war.
function berechneAlter(geburtsdatum) {
  const geb = new Date(geburtsdatum);
  // Ungültiges/leeres Datum? Dann kein Alter anzeigen.
  if (isNaN(geb)) return null;

  const heute = new Date();
  let alter = heute.getFullYear() - geb.getFullYear();

  // Hatte die Person dieses Jahr schon Geburtstag?
  // Vergleicht Monat, und bei gleichem Monat den Tag.
  const monatDiff = heute.getMonth() - geb.getMonth();
  const tagDiff = heute.getDate() - geb.getDate();
  if (monatDiff < 0 || (monatDiff === 0 && tagDiff < 0)) {
    alter = alter - 1;
  }
  return alter;
}

// Baut eine einzelne Zeile (<dt>/<dd>) für die Infoliste.
function zeile(beschriftung, wert) {
  return `<dt>${beschriftung}</dt><dd>${sicher(wert)}</dd>`;
}

// Baut eine einzelne Leiter-Karte als HTML-String.
function leiterKarte(leiter) {
  // --- Foto: entweder echtes Bild, oder Platzhalter mit Initial ---
  const initial = leiter.name ? sicher(leiter.name.charAt(0)) : '?';
  const foto = leiter.bild
    ? `<div class="leiter-foto"><img src="${sicher(leiter.bild)}" alt="${sicher(leiter.name)}"></div>`
    : `<div class="leiter-foto">
         <span class="leiter-initial">${initial}</span>
         <span class="leiter-foto-hinweis">Foto folgt 📸</span>
       </div>`;

  // --- Rolle: nur anzeigen, wenn ausgefüllt (sonst Zeile komplett weglassen) ---
  const rolleZeile = leiter.rolle && leiter.rolle.trim() !== ''
    ? zeile('Rolle', leiter.rolle)
    : '';

  // --- Alter: aus Geburtsdatum berechnet; falls Datum fehlt, "-" ---
  const alter = berechneAlter(leiter.geburtsdatum);
  const alterZeile = zeile('Alter', alter !== null ? alter : '-');

  // --- Tätig seit: falls leer, "-" anzeigen ---
  const taetig = leiter.taetig_seit && leiter.taetig_seit.trim() !== ''
    ? leiter.taetig_seit
    : '-';
  const taetigZeile = zeile('Ehrenamtlich tätig seit', taetig);

  return `
    <article class="leiter">
      ${foto}
      <h3>${sicher(leiter.name)}</h3>
      <dl>
        ${rolleZeile}
        ${alterZeile}
        ${taetigZeile}
      </dl>
    </article>`;
}

// Lädt die Daten und schreibt die Karten in den Container.
async function ladeLeiter() {
  const container = document.getElementById('leiter-liste');
  if (!container) return;
  try {
    // Cache-Buster (?t=Zeitstempel): erzwingt frisches Laden, damit
    // CMS-Änderungen auf GitHub Pages sofort sichtbar sind (siehe aktionen.js).
    const antwort = await fetch('data/leiter.json?t=' + Date.now());
    if (!antwort.ok) throw new Error('Daten konnten nicht geladen werden');
    const daten = await antwort.json();
    const leiter = daten.leiter || [];

    if (leiter.length === 0) {
      container.innerHTML = '<p>Die Leiterrunde wird gerade aktualisiert. Schau bald wieder vorbei!</p>';
      return;
    }
    container.innerHTML = leiter.map(leiterKarte).join('');
  } catch (fehler) {
    container.innerHTML = '<p>Die Leiterrunde konnte gerade nicht geladen werden. Bitte später erneut versuchen.</p>';
    console.error(fehler);
  }
}

ladeLeiter();
