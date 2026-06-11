// Surker Jugend – Navigation
// Hamburger-Menü öffnen/schließen (mobil)

const navKnopf = document.querySelector('.nav-knopf');
const hauptnav = document.querySelector('.hauptnav');

navKnopf.addEventListener('click', () => {
  const istOffen = hauptnav.classList.toggle('offen');
  navKnopf.setAttribute('aria-expanded', istOffen);
  navKnopf.textContent = istOffen ? '✕' : '☰';
});

// Menü schließen, wenn ein Link angeklickt wird
hauptnav.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    hauptnav.classList.remove('offen');
    navKnopf.setAttribute('aria-expanded', 'false');
    navKnopf.textContent = '☰';
  }
});
