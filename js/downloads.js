// ============================================================
// downloads.js – lädt data/downloads.json und rendert die
// Download-Karten in den #downloads-container.
// Funktioniert genauso wie aktionen.js und news.js:
//   - Cache-Buster (?t=...) damit GitHub Pages sofort aktuell ist
//   - Bei leerer Liste: ein Hinweistext statt leerer Box
// ============================================================

(function () {
  const container = document.getElementById("downloads-container");

  // Sicherheitsnetz: falls das Element auf einer anderen Seite fehlt
  if (!container) return;

  fetch("data/downloads.json?t=" + Date.now())
    .then(function (res) {
      if (!res.ok) throw new Error("Fehler beim Laden der Downloads");
      return res.json();
    })
    .then(function (daten) {
      const liste = daten.downloads;

      // Keine Downloads → Hinweistext anzeigen
      if (!liste || liste.length === 0) {
        container.innerHTML = "<p>Aktuell sind keine Dokumente zum Herunterladen verfügbar.</p>";
        return;
      }

      // Karten-Wrapper (damit das CSS-Grid greift)
      const karten = document.createElement("div");
      karten.className = "karten";

      liste.forEach(function (eintrag) {
        const karte = document.createElement("div");
        karte.className = "karte";

        const titel = document.createElement("h3");
        titel.textContent = eintrag.titel;
        karte.appendChild(titel);

        const beschreibung = document.createElement("p");
        beschreibung.textContent = eintrag.beschreibung;
        karte.appendChild(beschreibung);

        const link = document.createElement("a");
        link.className = "knopf knopf--blau";
        link.href = eintrag.datei;
        link.setAttribute("download", "");
        link.textContent = "Herunterladen";
        karte.appendChild(link);

        karten.appendChild(karte);
      });

      container.appendChild(karten);
    })
    .catch(function (err) {
      console.error("downloads.js:", err);
      container.innerHTML = "<p>Die Downloads konnten leider nicht geladen werden.</p>";
    });
})();
