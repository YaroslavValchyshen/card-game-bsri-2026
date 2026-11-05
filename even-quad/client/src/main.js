import './style.css';

import { state } from './state.js';
import { setupSocketListeners } from './socket.js';
import { toggleCard, updateSelectionUI } from './game/selection.js';
import { toggleFlip } from './game/flip.js';
import { findQuad } from './game/game.js';
import { renderTopbar } from './render/topbar.js';
import { renderScoreboard } from './render/scoreboard.js';
import { renderBoard } from './render/board.js';
import { renderGameOver } from './render/gameOver.js';
import { openPoster } from './render/posterViewer.js';
import { APP_TITLE, AWM_EVENQUADS_URL, APP_CREATOR } from './config.js';

// ─── Render ──────────────────────────────────────────────────────────────────

function render() {
  const app = document.getElementById('app');

  app.innerHTML = `
    <header class="site-header">
      <h1>${APP_TITLE}</h1>
      <a class="awm-link" href="${AWM_EVENQUADS_URL}" target="_blank" rel="noopener">
        Learn more on the AWM EvenQuads website ↗
      </a>
    </header>
    ${renderTopbar()}
    <p class="instructions">
      <strong>How to play:</strong> click four cards to select a Quad.
      <strong>Right-click</strong> a card (or press and hold on a touchscreen) to flip it over
      and meet the mathematician on the back. Click a flipped card to enlarge the poster.
    </p>
    ${renderScoreboard()}
    ${renderGameOver()}
    ${renderBoard()}
    <footer class="site-footer">
      App created by ${APP_CREATOR} ·
      Card designs and posters from the
      <a href="${AWM_EVENQUADS_URL}" target="_blank" rel="noopener">AWM EvenQuads project</a>
    </footer>
  `;

  document.querySelectorAll('.card').forEach((element) => {
    element.addEventListener('click', () => {
      const card = state.deck.find((c) => c.id === element.dataset.id);
      if (!card) return;
      if (state.flippedCards.has(card.id)) {
        openPoster(card.backImage);
        return;
      }
      toggleCard(card);
    });

    element.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      const card = state.deck.find((c) => c.id === element.dataset.id);
      if (card) toggleFlip(card.id);
    });

    // Long press on touch devices (1.5s)
    let longPressTimer;
    let longPressTriggered = false;

    element.addEventListener('touchstart', () => {
      longPressTriggered = false;

      longPressTimer = setTimeout(() => {
        const card = state.deck.find((c) => c.id === element.dataset.id);
        if (card) {
          longPressTriggered = true;
          toggleFlip(card.id);
        }
      }, 1500);
    });

    element.addEventListener('touchend', () => {
      clearTimeout(longPressTimer);
    });

    element.addEventListener('touchmove', () => {
      clearTimeout(longPressTimer);
    });

    element.addEventListener('touchcancel', () => {
      clearTimeout(longPressTimer);
    });
  });
}

// ─── Keyboard shortcut ───────────────────────────────────────────────────────

window.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() !== 't') return;

  const quad = findQuad(state.deck);
  if (!quad) {
    console.log('No quad found');
    return;
  }

  state.selected = [...quad];
  updateSelectionUI();
  console.log(
    'Quad found:',
    quad.map((c) => c.id)
  );
});

// ─── Bootstrap ───────────────────────────────────────────────────────────────

setupSocketListeners(render);
render();
