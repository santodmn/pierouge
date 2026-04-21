/* ==========================================================
   PIEDI VINO — main.js
   Moduli:
   1. Rilevamento Touch (disabilita cursore custom)
   2. Cursore Custom (solo desktop)
   3. Navigazione — scroll + menu hamburger mobile
   4. Reveal al Scroll (Intersection Observer)
   5. Form — Accesso Privato
   ========================================================== */


/* ==========================================================
   1. RILEVAMENTO TOUCH
   Su dispositivi touch il cursore custom non serve
   ========================================================== */

const isTouch = window.matchMedia('(hover: none)').matches;


/* ==========================================================
   2. CURSORE CUSTOM (solo desktop)
   Punto fisso + anello fluido con ritardo (lerp)
   ========================================================== */

if (!isTouch) {
  const cursor     = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursorRing');

  let mouseX = -100, mouseY = -100;
  let ringX  = -100, ringY  = -100;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursor.style.left = mouseX - 4 + 'px';
    cursor.style.top  = mouseY - 4 + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;

    cursorRing.style.left = ringX - 18 + 'px';
    cursorRing.style.top  = ringY - 18 + 'px';

    requestAnimationFrame(animateRing);
  }

  animateRing();
}


/* ==========================================================
   3. NAVIGAZIONE
   a) Sfondo al scroll
   b) Menu hamburger mobile
   ========================================================== */

const nav        = document.getElementById('nav');
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('navLinks');

// a) Sfondo al scroll
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 80);
});

// b) Hamburger — apre/chiude il menu
hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  // Blocca lo scroll della pagina mentre il menu è aperto
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Chiude il menu al click su un link
document.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  });
});


/* ==========================================================
   4. REVEAL AL SCROLL
   Usa IntersectionObserver per aggiungere .visible
   agli elementi con classe .reveal quando entrano nel viewport
   ========================================================== */

const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // si attiva una volta sola
    }
  });
}, {
  threshold: 0.12
});

revealElements.forEach((el) => revealObserver.observe(el));


/* ==========================================================
   5. FORM — ACCESSO PRIVATO
   Validazione base e feedback all'utente.
   Sostituire il corpo di handleSubmit() con la chiamata
   al proprio backend / servizio email (es. Netlify, Formspree)
   ========================================================== */

const submitBtn = document.getElementById('submitBtn');

submitBtn.addEventListener('click', handleSubmit);

function handleSubmit() {
  const nome      = document.getElementById('nome').value.trim();
  const email     = document.getElementById('email').value.trim();
  const interesse = document.getElementById('interesse').value;

  if (!email) {
    alert('Inserisci un indirizzo email.');
    return;
  }

  // TODO: inviare i dati al backend
  // Esempio con Formspree:
  //
  // fetch('https://formspree.io/f/YOUR_ID', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ nome, email, interesse })
  // });

  console.log('Richiesta accesso:', { nome, email, interesse });
  alert('Richiesta ricevuta. Ti contatteremo.');
}
/* ==========================================================
   6. LOOKBOOK — Drag to scroll (solo desktop)
   ========================================================== */

const track = document.getElementById('lookbookTrack');

if (track && !isTouch) {
  let isDragging = false;
  let startX, scrollStart;

  track.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - track.offsetLeft;
    scrollStart = track.scrollLeft;
    track.classList.add('dragging');
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    track.classList.remove('dragging');
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.4; /* 1.4 = velocità di trascinamento */
    track.scrollLeft = scrollStart - walk;
  });
}
