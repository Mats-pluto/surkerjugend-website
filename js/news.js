// ============================================================
// news.js – lädt data/news.json und rendert die News-Karten
// in den #news-container auf der Startseite.
// Funktioniert genauso wie aktionen.js:
//   - Cache-Buster (?t=...) damit GitHub Pages sofort aktuell ist
//   - Eigener Mini-Markdown-Renderer für **fett** und Zeilenumbrüche
//   - Bei leerer Liste: Abschnitt wird komplett ausgeblendet
// ============================================================

(function () {
  const container = document.getElementById("news-container");
  const abschnitt = document.getElementById("news-abschnitt");

  // Sicherheitsnetz: falls das Element auf einer anderen Seite fehlt
  if (!container || !abschnitt) return;

  // Einfacher Markdown-Renderer:
  // **text** → <strong>text</strong>
  // \n       → <br>
  // HTML-Sonderzeichen werden zuerst escaped (Sicherheit)
  function renderText(raw) {
    const escaped = raw
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return escaped
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br>");
  }

  fetch("data/news.json?t=" + Date.now())
    .then(function (res) {
      if (!res.ok) throw new Error("Fehler beim Laden der News");
      return res.json();
    })
    .then(function (daten) {
      const liste = daten.news;

      // Keine News → ganzen Abschnitt ausblenden
      if (!liste || liste.length === 0) {
        abschnitt.style.display = "none";
        return;
      }

      // Für jede News eine Karte bauen
      liste.forEach(function (news) {
        const karte = document.createElement("div");
        karte.className = "news-karte";

        // Titel
        const titel = document.createElement("h3");
        titel.innerHTML = renderText(news.titel);
        karte.appendChild(titel);

        // Text
        const text = document.createElement("p");
        text.innerHTML = renderText(news.text);
        karte.appendChild(text);

        // Optionaler Link
        if (news.link_url) {
          const link = document.createElement("a");
          link.className = "knopf knopf--gelb";
          link.href = news.link_url;
          link.target = "_blank";
          link.rel = "noopener";
          link.textContent = news.link_text || news.link_url;
          karte.appendChild(link);
        }

        container.appendChild(karte);
      });
    })
    .catch(function (err) {
      console.error("news.js:", err);
      // Im Fehlerfall Abschnitt ausblenden statt leere Box zeigen
      abschnitt.style.display = "none";
    });
})();
