// Dinosaur 4 - Letter Tracing Game
let cleanup = null;

const LOWER = 'abcdefghijklmnopqrstuvwxyz'.split('');
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const DIGRAPHS3 = [
  'ch', 'sh', 'th', 'qu', 'ng', 'nk', 'ay', 'ee', 'igh', 'ow', 'oo', 'ar', 'or', 'air', 'ir', 'ou', 'oy'
];
const DIGRAPHS4 = [
  'ea', 'oi', 'aw', 'are', 'ur', 'er', 'ow', 'ai', 'oa', 'ew', 'ire', 'ear', 'ure'
];

const LEVELS = [
  { name: 'Level 1', letters: LOWER },
  { name: 'Level 2', letters: LOWER.concat(UPPER) },
  { name: 'Level 3', letters: LOWER.concat(DIGRAPHS3) },
  { name: 'Level 4', letters: LOWER.concat(DIGRAPHS3, DIGRAPHS4) }
];

export function init(container, options = {}) {
  container.innerHTML = '';
  const dinoIcon = document.createElement('div');
  dinoIcon.textContent = '🦖';
  dinoIcon.style.fontSize = '3em';
  dinoIcon.style.marginBottom = '10px';
  const title = document.createElement('h2');
  title.textContent = 'Dinosaur 4';
  container.appendChild(dinoIcon);
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
    // Shuffle letters for this level
    shuffled = LEVELS[levelIdx].letters.slice();
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
    // End Game button (only for Dinosaur 4)
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
    // Pick letter
    const letter = shuffled[questionNum % shuffled.length];
    // Use single-storey a and g for outline
    let displayLetter = letter;
    if (letter === 'a') displayLetter = 'ɑ';
    if (letter === 'g') displayLetter = 'ɡ';
    // Show letter outline (big, faint)
    const letterOutline = document.createElement('div');
    letterOutline.textContent = displayLetter;
    letterOutline.style.fontSize = letter.length === 1 ? '7em' : (letter.length === 2 ? '5em' : '3.5em');
    letterOutline.style.opacity = '0.15';
    letterOutline.style.position = 'absolute';
    letterOutline.style.left = '50%';
    letterOutline.style.top = '50%';
    letterOutline.style.transform = 'translate(-50%, -50%)';
    letterOutline.style.pointerEvents = 'none';
    letterOutline.style.fontFamily = "'Comic Sans MS', 'Comic Sans', 'Arial Rounded MT Bold', sans-serif";
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
    canvasWrap.appendChild(letterOutline);
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
    // Drawing logic
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1976d2';
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
      if (levelIdx < 3 && questionNum === 8) {
        levelIdx++;
        setTimeout(() => showLevelUpCelebration(() => startLevel()), 300);
      } else if (levelIdx < 3) {
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
    const dinoDance = document.createElement('div');
    dinoDance.textContent = '🦖💃';
    dinoDance.style.fontSize = '4em';
    dinoDance.style.margin = '40px 0';
    dinoDance.style.animation = 'dino-dance 1.2s linear';
    container.appendChild(dinoDance);
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
    container.appendChild(dinoIcon);
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