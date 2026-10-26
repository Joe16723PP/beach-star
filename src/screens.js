'use strict';

// Cream panels for every screen that sits over the beach. Gameplay stays in game.js.
class BeachScreens {
  static text(value) {
    return String(value).replace(/[&<>"']/g, (ch) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[ch]));
  }

  static stars(n) {
    const filled = Math.max(0, Math.min(3, n | 0));
    return '★'.repeat(filled) + '☆'.repeat(3 - filled);
  }

  static artFor(id) {
    const map = {
      patience: 'assets/game/props/lounger-coral.png',
      capacity: 'assets/game/props/coconut-bar.png',
      tip: 'assets/game/ui-icons/icon-request-snack.png',
      shade: 'assets/game/props/umbrella-yellow.png',
      'bar-drink': 'assets/game/ui-icons/icon-request-drink.png',
      'bar-snack': 'assets/game/ui-icons/icon-request-snack.png',
      'bar-rental': 'assets/game/ui-icons/icon-request-float.png',
    };
    return map[id] || 'assets/game/ui-icons/icon-request-drink.png';
  }

  static levelTiles(save, levels, interactive) {
    return levels.map((level) => {
      const open = level.number <= save.unlocked;
      const num = String(level.number).padStart(2, '0');
      const starText = this.stars(save.stars[level.number - 1] || 0);
      if (!interactive) {
        return `<div class="level-tile ${open ? 'open' : 'locked'}">${num}${open ? '' : ' 🔒'}<span>${starText}</span></div>`;
      }
      return `<button type="button" class="level-tile ${open ? 'open' : 'locked'}" data-action="start" data-level="${level.number}" ${open ? '' : 'disabled'}>${num}<span>${open ? starText : '🔒'}</span></button>`;
    }).join('');
  }

  static menu(save, levels) {
    const total = save.stars.reduce((sum, n) => sum + n, 0);
    const continueLabel = save.stars.some(Boolean) ? 'Continue your story' : 'Start the campaign';
    const level = Math.min(save.unlocked, 10);
    return `<div class="crest">
      <div class="sun" aria-hidden="true"></div>
      <p class="eyebrow"><span>Your little piece of paradise</span></p>
      <h1 id="dialog-title" class="wordmark"><span class="sr-only">Welcome to </span>Beach<span>Star</span></h1>
    </div>
    <p class="lede">Welcome guests, prepare orders at the beach shops, and carry each item to the right lounger.</p>
    <div class="service-preview" aria-hidden="true">
      <span><img src="assets/game/ui-icons/icon-request-drink.png" alt=""></span>
      <span><img src="assets/game/ui-icons/icon-request-snack.png" alt=""></span>
      <span><img src="assets/game/ui-icons/icon-request-float.png" alt=""></span>
    </div>
    <div class="level-grid">${this.levelTiles(save, levels, false)}</div>
    <p class="balance"><i class="coin" aria-hidden="true"></i> ${total} / 30 stars · ${save.coins} beach coins</p>
    <div class="button-stack">
      <button type="button" class="primary" data-action="start" data-level="${level}">${continueLabel} →</button>
      <div class="button-row">
        <button type="button" class="secondary" data-action="levels">Choose level</button>
        <button type="button" class="secondary" data-action="sound">Sound: ${save.sound ? 'On' : 'Off'}</button>
      </div>
    </div>`;
  }

  static levelPicker(save, levels) {
    return `<p class="eyebrow">Campaign map</p>
      <h1 id="dialog-title">Choose your shift</h1>
      <div class="level-grid">${this.levelTiles(save, levels, true)}</div>
      <div class="button-stack">
        <button type="button" class="secondary" data-action="menu">← Resort home</button>
      </div>`;
  }

  static pause() {
    return `<div class="pause-mark" aria-hidden="true"><i></i><i></i></div>
      <p class="eyebrow">Take a breather</p>
      <h1 id="dialog-title">Shift paused</h1>
      <p class="lede">Your guests and station timers are paused.</p>
      <div class="button-stack">
        <button type="button" class="primary" data-action="resume">Back to the beach</button>
        <button type="button" class="secondary" data-action="restart">Restart shift</button>
        <button type="button" class="secondary" data-action="menu">Resort home</button>
      </div>`;
  }

  static summary(result) {
    const rule = result.won
      ? (result.score === 3
        ? 'Visit goal met and mood is at least 85%: 3 stars.'
        : result.score === 2
          ? 'Visit goal met and mood is at least 60%: 2 stars.'
          : 'Visit goal met below 60% mood: 1 star.')
      : 'Missed visit goal: no stars.';
    const detail = result.won
      ? `You completed ${result.visits} visits and fulfilled ${result.orders} orders, earning ${result.earned} coins.`
      : `You completed ${result.visits} of ${result.goal} visits and fulfilled ${result.orders} orders.`;
    const primary = result.canNext ? 'Next sunny shift →' : (result.won ? 'Play again' : 'Try again');
    const shift = `Shift ${String(result.levelNumber).padStart(2, '0')} · ${this.text(result.levelName)}`;
    return `<p class="eyebrow">${result.won ? 'Shift complete' : 'Shift ended'}</p>
      <h1 id="dialog-title">${result.won ? 'The beach is beaming!' : 'The tide can turn'}</h1>
      <p class="shift-name">${shift}</p>
      <div class="stars" aria-hidden="true">${this.stars(result.score)}</div>
      <div class="stat-pills">
        <div class="stat-pill"><span class="pill-ico">V</span><span><small>Visits</small><strong>${result.visits} / ${result.goal}</strong></span></div>
        <div class="stat-pill"><span class="pill-ico">O</span><span><small>Orders</small><strong>${result.orders}</strong></span></div>
        <div class="stat-pill"><span class="pill-ico coin-ico" aria-hidden="true"></span><span><small>Earned</small><strong>${result.earned}</strong></span></div>
        <div class="stat-pill"><span class="pill-ico">M</span><span><small>Mood</small><strong>${result.happy}%</strong></span></div>
      </div>
      <p class="rule">${rule} Mood ${result.happy}%.</p>
      <p class="lede">${detail}</p>
      <div class="button-stack">
        <button type="button" class="primary" data-action="${result.canNext ? 'next' : 'retry'}">${primary}</button>
        <div class="button-row">
          <button type="button" class="secondary" data-action="shop">Upgrade shop</button>
          <button type="button" class="secondary" data-action="menu">Resort home</button>
        </div>
      </div>
      <p class="small-note">Coins carry into future shifts. Upgrades apply on the next shift.</p>`;
  }

  static shop(coins, offers) {
    const cards = offers.length
      ? offers.map(([id, name, cost, effect]) => {
        const short = coins < cost;
        return `<button type="button" class="upgrade${short ? ' is-short' : ''}" data-action="buy-${this.text(id)}">
          <span class="upgrade-art"><img src="${this.artFor(id)}" alt=""></span>
          <span class="upgrade-name">${this.text(name)}</span>
          <span class="upgrade-effect">${this.text(effect)}</span>
          <span class="upgrade-cost">${cost} coins</span>
        </button>`;
      }).join('')
      : '<p class="small-note">Every upgrade is already maxed out.</p>';
    return `<p class="eyebrow">Between shifts</p>
      <h1 id="dialog-title">Upgrade shop</h1>
      <p class="balance"><i class="coin" aria-hidden="true"></i> ${coins} beach coins</p>
      <div class="shop-grid">${cards}</div>
      <div class="button-stack">
        <button type="button" class="secondary" data-action="summary">Back to the recap</button>
      </div>
      <p class="small-note">Coins carry into future shifts. Upgrades apply on the next shift.</p>`;
  }
}
