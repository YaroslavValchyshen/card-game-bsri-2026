// Full-screen viewer for the mathematician poster on the back of a card.
// Lives on <body> (outside #app) so it survives the app's frequent re-renders.

let overlay = null;

function close() {
  if (!overlay) return;
  overlay.classList.remove('open');
  const el = overlay;
  overlay = null;
  setTimeout(() => el.remove(), 200);
}

export function openPoster(src) {
  close();

  overlay = document.createElement('div');
  overlay.className = 'poster-viewer';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-label', 'Mathematician poster');
  overlay.innerHTML = `
    <button class="poster-close" aria-label="Close">&times;</button>
    <img src="${src}" alt="Poster of the mathematician featured on this card" draggable="false" />
    <p class="poster-hint">Click anywhere or press Esc to return to the game</p>
  `;
  overlay.addEventListener('click', close);
  overlay.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    close();
  });

  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay?.classList.add('open'));
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') close();
});
