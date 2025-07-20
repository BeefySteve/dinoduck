// Duck Duck Duck Duck - Line Tracing Game
let cleanup = null;

const STRAIGHT_LINES = [
  { type: 'line', x1: 30, y1: 110, x2: 190, y2: 110 }, // horizontal
  { type: 'line', x1: 110, y1: 30, x2: 110, y2: 190 }, // vertical
  { type: 'line', x1: 40, y1: 40, x2: 180, y2: 180 }, // diagonal \
  { type: 'line', x1: 180, y1: 40, x2: 40, y2: 180 }, // diagonal /
];
const CURVES = [
  { type: 'arc', x: 110, y: 110, r: 70, start: Math.PI, end: 2 * Math.PI }, // bottom half
  { type: 'arc', x: 110, y: 110, r: 70, start: 0, end: Math.PI }, // top half
  { type: 'arc', x: 110, y: 110, r: 70, start: Math.PI/2, end: 3*Math.PI/2 }, // left half
  { type: 'arc', x: 110, y: 110, r: 70, start: -Math.PI/2, end: Math.PI/2 }, // right half
];
const SHAPES = [
  { type: 'circle', x: 110, y: 110, r: 70 },
  { type: 'triangle', points: [ [110,40], [40,180], [180,180] ] },
  { type: 'square', x: 40, y: 40, size: 140 },
];

const LEVELS = [
  { name: 'Level 1', paths: STRAIGHT_LINES },
  { name: 'Level 2', paths: STRAIGHT_LINES.concat(CURVES) },
  { name: 'Level 3', paths: STRAIGHT_LINES.concat(CURVES, SHAPES) }
];

export function init(container, options = {}) {
  container.innerHTML = '';
  const duckIcon = document.createElement('div');
  duckIcon.textContent = '🦆';
  duckIcon.style.fontSize = '3em';
  duckIcon.style.marginBottom = '10px';
  const title = document.createElement('h2');
  title.textContent = 'Duck Duck Duck Duck';
  container.appendChild(duckIcon);
  container.appendChild(title);
  const startBtn = document.createElement('button');
  startBtn.textContent = 'Start';
  container.appendChild(startBtn);

  let score = 0;
  let levelIdx = 0;
  let questionNum = 0;
  let shuffled = [];

  function startLevel() {
    questionNum = 0;
    // Shuffle paths for this level
    shuffled = LEVELS[levelIdx].paths.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    nextQuestion();
  }

  function nextQuestion() {
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
    // End Game button
    const endGameBtn = document.createElement('button');
    endGameBtn.textContent = 'End Game';
    endGameBtn.style.display = 'block';
    endGameBtn.style.margin = '8px auto 0 auto';
    endGameBtn.style.fontSize = '0.95em';
    endGameBtn.style.padding = '8px 18px';
    endGameBtn.style.background = '#ff7043';
    endGameBtn.style.color = '#fff';
    endGameBtn.style.border = 'none';
    endGameBtn.style.borderRadius = '8px';
    endGameBtn.style.cursor = 'pointer';
    endGameBtn.onclick = () => endGame();
    container.appendChild(endGameBtn);
    // Level title
    const levelTitle = document.createElement('h3');
    levelTitle.textContent = LEVELS[levelIdx].name;
    container.appendChild(levelTitle);
    // Pick path
    let path;
    if (levelIdx < 2) {
      path = shuffled[questionNum % shuffled.length];
    } else {
      // Level 3: unlimited
      path = shuffled[Math.floor(Math.random() * shuffled.length)];
    }
    // Canvas for drawing
    const canvasWrap = document.createElement('div');
    canvasWrap.style.position = 'relative';
    canvasWrap.style.width = '220px';
    canvasWrap.style.height = '220px';
    canvasWrap.style.margin = '40px auto 20px auto';
    canvasWrap.style.background = '#fffde7';
    canvasWrap.style.borderRadius = '16px';
    canvasWrap.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
    canvasWrap.style.touchAction = 'none';
    const canvas = document.createElement('canvas');
    canvas.width = 220;
    canvas.height = 220;
    canvas.style.position = 'absolute';
    canvas.style.left = '0';
    canvas.style.top = '0';
    canvas.style.zIndex = '2';
    canvas.style.touchAction = 'none';
    canvasWrap.appendChild(canvas);
    container.appendChild(canvasWrap);
    // Draw the path
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#bdbdbd';
    ctx.globalAlpha = 0.5;
    if (path.type === 'line') {
      ctx.beginPath();
      ctx.moveTo(path.x1, path.y1);
      ctx.lineTo(path.x2, path.y2);
      ctx.stroke();
    } else if (path.type === 'arc') {
      ctx.beginPath();
      ctx.arc(path.x, path.y, path.r, path.start, path.end);
      ctx.stroke();
    } else if (path.type === 'circle') {
      ctx.beginPath();
      ctx.arc(path.x, path.y, path.r, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (path.type === 'triangle') {
      ctx.beginPath();
      ctx.moveTo(path.points[0][0], path.points[0][1]);
      ctx.lineTo(path.points[1][0], path.points[1][1]);
      ctx.lineTo(path.points[2][0], path.points[2][1]);
      ctx.closePath();
      ctx.stroke();
    } else if (path.type === 'square') {
      ctx.beginPath();
      ctx.rect(path.x, path.y, path.size, path.size);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    // Drawing logic
    ctx.strokeStyle = '#1976d2';
    ctx.lineWidth = 8;
    let drawing = false;
    let last = null;
    function getPos(e) {
      if (e.touches) {
        const rect = canvas.getBoundingClientRect();
        return {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top
        };
      } else {
        const rect = canvas.getBoundingClientRect();
        return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };
      }
    }
    function startDraw(e) {
      if (e.cancelable) e.preventDefault();
      drawing = true;
      last = getPos(e);
    }
    function moveDraw(e) {
      if (e.cancelable) e.preventDefault();
      if (!drawing) return;
      const pos = getPos(e);
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      last = pos;
    }
    function endDraw(e) {
      if (e && e.cancelable) e.preventDefault();
      drawing = false;
    }
    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('touchstart', startDraw, { passive: false });
    canvas.addEventListener('mousemove', moveDraw);
    canvas.addEventListener('touchmove', moveDraw, { passive: false });
    canvas.addEventListener('mouseup', endDraw);
    canvas.addEventListener('mouseleave', endDraw);
    canvas.addEventListener('touchend', endDraw, { passive: false });
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next';
    nextBtn.style.marginTop = '20px';
    nextBtn.onclick = () => {
      score++;
      questionNum++;
      scoreCounter.textContent = `Score: ${score}`;
      if (levelIdx < 2 && questionNum === 8) {
        levelIdx++;
        setTimeout(() => showLevelUpCelebration(() => startLevel()), 300);
      } else if (levelIdx < 2) {
        setTimeout(() => nextQuestion(), 300);
      } else {
        setTimeout(() => nextQuestion(), 300);
      }
    };
    container.appendChild(nextBtn);
  }

  function showLevelUpCelebration(next) {
    container.innerHTML = '';
    container.style.transition = 'background 0.2s';
    let flashes = 0;
    const maxFlashes = 6;
    const duckDance = document.createElement('div');
    duckDance.textContent = '🦆💃';
    duckDance.style.fontSize = '4em';
    duckDance.style.margin = '40px 0';
    duckDance.style.animation = 'dino-dance 1.2s linear';
    container.appendChild(duckDance);
    const style = document.createElement('style');
    style.textContent = `@keyframes dino-dance { 0%{transform:translateX(0);} 20%{transform:translateX(-20px);} 40%{transform:translateX(20px);} 60%{transform:translateX(-20px);} 80%{transform:translateX(20px);} 100%{transform:translateX(0);} }`;
    document.head.appendChild(style);
    const flashInterval = setInterval(() => {
      container.style.background = flashes % 2 === 0 ? '#fff176' : '#4dd0e1';
      flashes++;
      if (flashes > maxFlashes) {
        clearInterval(flashInterval);
        container.style.background = '';
        document.head.removeChild(style);
        next();
      }
    }, 200);
  }

  function endGame() {
    container.innerHTML = '';
    container.appendChild(duckIcon);
    const endMsg = document.createElement('h2');
    endMsg.textContent = `Game Over! Your score: ${score}`;
    container.appendChild(endMsg);
    const retryBtn = document.createElement('button');
    retryBtn.textContent = '🔄 Play Again';
    retryBtn.onclick = () => {
      score = 0;
      levelIdx = 0;
      questionNum = 0;
      startLevel();
    };
    container.appendChild(retryBtn);
    const exitBtn = document.createElement('button');
    exitBtn.textContent = '🏠 Back to Menu';
    exitBtn.onclick = () => {
      if (options.onExit) options.onExit();
    };
    container.appendChild(exitBtn);
  }

  startBtn.onclick = () => {
    score = 0;
    levelIdx = 0;
    questionNum = 0;
    startLevel();
  };

  cleanup = () => {
    container.innerHTML = '';
  };
}

export function destroy() {
  if (cleanup) cleanup();
} 