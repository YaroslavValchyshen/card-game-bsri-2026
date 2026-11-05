import { state } from '../state.js';
import { cardColor, getPositions, SHAPE_IMAGES } from './cardHelpers.js';

export function renderCard(card) {
  const isSelected = state.selected.some((c) => c.id === card.id);
  const isFlipped = state.flippedCards.has(card.id);
  const elapsed = state.flipTimestamps[card.id]
    ? (Date.now() - state.flipTimestamps[card.id]) / 1000
    : 0;

  return `
    <div
      class="card${isSelected ? ' selected' : ''}${isFlipped ? ' flipped' : ''}"
      data-id="${card.id}"
    >
      <div class="card-inner">
        <div class="card-front" style="background-color:${cardColor(card.color)}99;">
          <div class="shape-row">
            ${getPositions(card.count)
              .map(
                (pos) => `
              <img
                class="shape-icon"
                src="${SHAPE_IMAGES[card.shape]}"
                draggable="false"
                style="left:${pos.left};top:${pos.top};width:${pos.size};height:${pos.size};"
              />
            `
              )
              .join('')}
          </div>
        </div>
        <div class="card-back">
          <img src="${card.backImage}" class="back-image" draggable="false" alt="Mathematician poster" />
          <span class="back-enlarge">🔍 Click to enlarge</span>
          <div class="back-timer">
            <div class="back-timer-bar" style="${isFlipped ? `animation-delay:-${elapsed}s;` : ''}"></div>
          </div>
        </div>
      </div>
    </div>
  `;
}
