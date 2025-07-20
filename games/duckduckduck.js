// Duck Duck Duck - Touchscreen Tapping Practice Game
let cleanup = null;

const ITEMS = [
  { name: 'duck', emoji: '🦆' },
  { name: 'dog', emoji: '🐶' },
  { name: 'cat', emoji: '🐱' },
  { name: 'car', emoji: '🚗' },
  { name: 'sun', emoji: '☀️' },
  { name: 'bus', emoji: '🚌' },
  { name: 'egg', emoji: '🥚' },
  { name: 'fox', emoji: '🦊' },
  { name: 'cow', emoji: '🐮' },
  { name: 'ant', emoji: '🐜' },
  { name: 'bat', emoji: '🦇' },
  { name: 'owl', emoji: '🦉' },
  { name: 'bee', emoji: '🐝' },
  { name: 'pig', emoji: '🐷' },
  { name: 'rat', emoji: '🐀' },
  { name: 'ram', emoji: '🐏' },
  { name: 'hen', emoji: '🐔' },
  { name: 'yak', emoji: '🐂' },
  { name: 'emu', emoji: '🦤' },
  { name: 'ape', emoji: '🦍' },
  { name: 'bug', emoji: '🐛' },
  { name: 'poo', emoji: '💩' },
];

export function init(container, options = {}) {
  container.innerHTML = '';
  const duckIcon = document.createElement('div');
  duckIcon.textContent = '🦆';
  duckIcon.style.fontSize = '3em';
  duckIcon.style.marginBottom = '10px';
  const title = document.createElement('h2');
  title.textContent = 'Duck Duck Duck';
  container.appendChild(duckIcon);
  container.appendChild(title);
  const startBtn = document.createElement('button');
  startBtn.textContent = 'Start';
  container.appendChild(startBtn);

  let score = 0;
  let lastWrong = null;
  let lastItem = null;

  function startGame() {
    score = 0;
    lastWrong = null;
    nextRound();
  }

  function nextRound() {
    container.innerHTML = '';
    // Score counter
    const scoreCounter = document.createElement('div');
    scoreCounter.style.position = 'absolute';
    scoreCounter.style.top = '16px';
    scoreCounter.style.right = '24px';
    scoreCounter.style.fontSize = '1.1em';
    scoreCounter.style.fontWeight = 'bold';
    scoreCounter.textContent = `Score: ${score}`;
    container.appendChild(scoreCounter);
    // Pick item
    const item = ITEMS[Math.floor(Math.random() * ITEMS.length)];
    lastItem = item;
    // Create tap area
    const tapArea = document.createElement('div');
    tapArea.style.position = 'relative';
    tapArea.style.width = '100%';
    tapArea.style.height = '350px';
    tapArea.style.margin = '30px 0 20px 0';
    tapArea.style.touchAction = 'manipulation';
    tapArea.style.userSelect = 'none';
    // Random position
    const emojiBtn = document.createElement('button');
    emojiBtn.textContent = item.emoji;
    emojiBtn.style.position = 'absolute';
    emojiBtn.style.fontSize = '3em';
    emojiBtn.style.background = 'none';
    emojiBtn.style.border = 'none';
    emojiBtn.style.cursor = 'pointer';
    emojiBtn.style.padding = '0';
    emojiBtn.style.margin = '0';
    emojiBtn.style.lineHeight = '1';
    emojiBtn.style.transition = 'box-shadow 0.1s';
    // Randomize position (10% to 80% of width/height)
    const top = Math.random() * 70 + 10;
    const left = Math.random() * 70 + 10;
    emojiBtn.style.top = `${top}%`;
    emojiBtn.style.left = `${left}%`;
    // Only allow one tap per round
    let tapped = false;
    emojiBtn.onclick = (e) => {
      if (tapped) return;
      tapped = true;
      e.stopPropagation();
      emojiBtn.style.boxShadow = '0 0 0 4px #4dd0e1';
      score++;
      scoreCounter.textContent = `Score: ${score}`;
      // More complex animation: curve, spin, scale, and fly off
      const directions = [
        { x: 120, y: 0, rot: 720 },   // right
        { x: -120, y: 0, rot: -720 },  // left
        { x: 0, y: -120, rot: 540 },  // up
        { x: 0, y: 120, rot: -540 },   // down
        { x: 100, y: -100, rot: 900 }, // up-right
        { x: -100, y: -100, rot: -900 }, // up-left
        { x: 100, y: 100, rot: 1080 }, // down-right
        { x: -100, y: 100, rot: -1080 } // down-left
      ];
      const dir = directions[Math.floor(Math.random() * directions.length)];
      emojiBtn.style.transition = 'transform 1.1s cubic-bezier(.7,-0.2,.7,1.5), opacity 1.1s';
      emojiBtn.style.zIndex = '10';
      // Animate with a curve and spin
      emojiBtn.animate([
        { transform: 'scale(1) rotate(0deg)', offset: 0 },
        { transform: `translate(${dir.x/3}vw, ${dir.y/3}vh) scale(1.2) rotate(${dir.rot/3}deg)`, offset: 0.3 },
        { transform: `translate(${dir.x*0.7}vw, ${dir.y*0.7}vh) scale(0.8) rotate(${dir.rot*0.7}deg)`, offset: 0.7 },
        { transform: `translate(${dir.x}vw, ${dir.y}vh) scale(1.5) rotate(${dir.rot}deg)`, opacity: 0, offset: 1 }
      ], {
        duration: 1100,
        fill: 'forwards',
        easing: 'cubic-bezier(.7,-0.2,.7,1.5)'
      });
      setTimeout(() => {
        emojiBtn.style.transform = `translate(${dir.x}vw, ${dir.y}vh) scale(1.5) rotate(${dir.rot}deg)`;
        emojiBtn.style.opacity = '0';
      }, 30);
      setTimeout(() => nextRound(), 1100);
    };
    tapArea.onclick = (e) => {
      if (tapped) return;
      tapped = true;
      // Missed the emoji
      lastWrong = item;
      setTimeout(() => endGame(), 1000);
    };
    tapArea.appendChild(emojiBtn);
    container.appendChild(tapArea);
  }

  function endGame() {
    container.innerHTML = '';
    container.appendChild(duckIcon);
    const endMsg = document.createElement('h2');
    endMsg.textContent = `Game Over! Your score: ${score}`;
    container.appendChild(endMsg);
    if (lastWrong) {
      const correctMsg = document.createElement('div');
      correctMsg.style.margin = '16px 0';
      correctMsg.style.fontSize = '1.2em';
      correctMsg.innerHTML = `You needed to tap: <span style="font-size:2em;vertical-align:middle;">${lastWrong.emoji}</span>`;
      container.appendChild(correctMsg);
    }
    const retryBtn = document.createElement('button');
    retryBtn.textContent = '🔄 Play Again';
    retryBtn.onclick = () => {
      score = 0;
      lastWrong = null;
      startGame();
    };
    container.appendChild(retryBtn);
    const exitBtn = document.createElement('button');
    exitBtn.textContent = '🏠 Back to Menu';
    exitBtn.onclick = () => {
      if (options.onExit) options.onExit();
    };
    container.appendChild(exitBtn);
  }

  startBtn.onclick = startGame;

  cleanup = () => {
    container.innerHTML = '';
  };
}

export function destroy() {
  if (cleanup) cleanup();
} 