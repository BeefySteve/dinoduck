// Duck Letters Minigame
let cleanup = null;

const ITEMS = [
  { name: 'Apple', emoji: '🍎' },    // A
  { name: 'Banana', emoji: '🍌' },   // B
  { name: 'Cat', emoji: '🐱' },      // C
  { name: 'Duck', emoji: '🦆' },     // D
  { name: 'Elephant', emoji: '🐘' }, // E
  { name: 'Fish', emoji: '🐟' },     // F
  { name: 'Grapes', emoji: '🍇' },   // G
  { name: 'Hat', emoji: '🎩' },      // H
  { name: 'Ice Cream', emoji: '🍦' }, // I
  { name: 'Jigsaw', emoji: '🧩' },   // J
  { name: 'Kangaroo', emoji: '🦘' }, // K
  { name: 'Lion', emoji: '🦁' },     // L
  { name: 'Monkey', emoji: '🐒' },   // M
  { name: 'Nose', emoji: '👃' },     // N
  { name: 'Octopus', emoji: '🐙' },  // O
  { name: 'Penguin', emoji: '🐧' },  // P
  { name: 'Queen', emoji: '👸' },    // Q
  { name: 'Rabbit', emoji: '🐰' },   // R
  { name: 'Sun', emoji: '☀️' },      // S
  { name: 'Tiger', emoji: '🐯' },    // T
  { name: 'Unicorn', emoji: '🦄' },   // U
  { name: 'Van', emoji: '🚐' },      // V
  { name: 'Whale', emoji: '🐋' },    // W
  { name: 'Xylophone', emoji: '🎼' },// X (musical notes as proxy)
  { name: 'Yo-yo', emoji: '🪀' },    // Y
  { name: 'Zebra', emoji: '🦓' },    // Z
];

const LEVELS = [
  { name: 'Level 1', choices: 2 },
  { name: 'Level 2', choices: 3 },
  { name: 'Level 3', choices: 4 },
  { name: 'Level 4', choices: 5 },
  { name: 'Level 5', choices: 6 },
];

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');

export function init(container, options = {}) {
  container.innerHTML = '';
  const duckIcon = document.createElement('div');
  duckIcon.textContent = '🦆';
  duckIcon.style.fontSize = '3em';
  duckIcon.style.marginBottom = '10px';
  const title = document.createElement('h2');
  title.textContent = 'Duck Letters';
  container.appendChild(duckIcon);
  container.appendChild(title);
  const startBtn = document.createElement('button');
  startBtn.textContent = 'Start';
  container.appendChild(startBtn);

  let gameActive = false;
  let score = 0;
  let usedIndexes = [];
  let levelIdx = 0;
  let questionNum = 0;
  let shuffledItems = [];
  let lastWrongItem = null;
  let lastWrongLetter = null;

  function startLevel() {
    questionNum = 0;
    usedIndexes = [];
    shuffledItems = ITEMS.slice();
    for (let i = shuffledItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledItems[i], shuffledItems[j]] = [shuffledItems[j], shuffledItems[i]];
    }
    nextItem();
  }

  function nextItem() {
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
    // Level title
    const levelTitle = document.createElement('h3');
    levelTitle.textContent = LEVELS[levelIdx].name;
    container.appendChild(levelTitle);
    const remaining = shuffledItems.filter((_, i) => !usedIndexes.includes(i));
    if (remaining.length === 0 || questionNum === 10) {
      // 8 questions per level
      if (questionNum < 8 && remaining.length > 0) return;
      // Level complete
      levelIdx++;
      if (levelIdx < LEVELS.length) {
        showLevelUpCelebration(() => startLevel());
      } else {
        endGame();
      }
      return;
    }
    const idx = Math.floor(Math.random() * remaining.length);
    const itemIdx = shuffledItems.findIndex((item, i) => !usedIndexes.includes(i) && i === shuffledItems.indexOf(remaining[idx]));
    usedIndexes.push(itemIdx);
    const item = shuffledItems[itemIdx];
    const img = document.createElement('div');
    img.textContent = item.emoji;
    img.style.fontSize = '4em';
    img.style.margin = '20px 0';
    container.appendChild(img);
    // Pick correct letter and random incorrect letters
    const correctLetter = item.name[0].toLowerCase();
    const allLetters = Array.from(new Set(ITEMS.map(i => i.name[0].toLowerCase())));
    let choices = [correctLetter];
    while (choices.length < LEVELS[levelIdx].choices) {
      const l = allLetters[Math.floor(Math.random() * allLetters.length)];
      if (!choices.includes(l)) choices.push(l);
    }
    // Shuffle choices
    for (let i = choices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [choices[i], choices[j]] = [choices[j], choices[i]];
    }
    const btnRow = document.createElement('div');
    btnRow.style.margin = '20px 0';
    choices.forEach(letter => {
      const btn = document.createElement('button');
      btn.textContent = letter;
      btn.style.fontSize = '2em';
      btn.onclick = () => {
        // Disable all buttons immediately
        Array.from(btnRow.children).forEach(b => b.disabled = true);
        if (letter === correctLetter) {
          score++;
          questionNum++;
          scoreCounter.textContent = `Score: ${score}`;
          setTimeout(() => nextItem(), 1000);
        } else {
          lastWrongItem = item;
          lastWrongLetter = correctLetter;
          setTimeout(() => endGame(), 1000);
        }
      };
      btnRow.appendChild(btn);
    });
    container.appendChild(btnRow);
  }

  function showLevelUpCelebration(next) {
    container.innerHTML = '';
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
    gameActive = false;
    container.innerHTML = '';
    container.appendChild(duckIcon);
    const endMsg = document.createElement('h2');
    endMsg.textContent = `Game Over! Your score: ${score}`;
    container.appendChild(endMsg);
    if (lastWrongItem && lastWrongLetter) {
      const correctMsg = document.createElement('div');
      correctMsg.style.margin = '16px 0';
      correctMsg.style.fontSize = '1.2em';
      correctMsg.innerHTML = `Correct answer: '<b>${lastWrongLetter}</b>' for <span style="font-size:2em;vertical-align:middle;">${lastWrongItem.emoji}</span>`;
      container.appendChild(correctMsg);
    }
    const retryBtn = document.createElement('button');
    retryBtn.textContent = '🔄 Play Again';
    retryBtn.onclick = () => {
      levelIdx = 0;
      score = 0;
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
    levelIdx = 0;
    startLevel();
  };

  cleanup = () => {
    gameActive = false;
    container.innerHTML = '';
  };
}

export function destroy() {
  if (cleanup) cleanup();
} 