// Duck Duck Counting Minigame
let cleanup = null;

const ANIMALS = [
  { name: 'Duck', emoji: '🦆' },
  { name: 'Dinosaur', emoji: '🦖' },
  { name: 'Unicorn', emoji: '🦄' },
  { name: 'Cat', emoji: '🐱' },
  { name: 'Dog', emoji: '🐶' },
  { name: 'Rabbit', emoji: '🐰' },
  { name: 'Lion', emoji: '🦁' },
  { name: 'Penguin', emoji: '🐧' },
  { name: 'Elephant', emoji: '🐘' },
  { name: 'Monkey', emoji: '🐒' },
];

const LEVELS = [
  { name: 'Level 1', max: 3 },
  { name: 'Level 2', max: 5 },
  { name: 'Level 3', max: 8 },
  { name: 'Level 4', max: 10 },
  { name: 'Level 5', max: 12 },
];

export function init(container, options = {}) {
  container.innerHTML = '';
  const duckIcon = document.createElement('div');
  duckIcon.textContent = '🦆';
  duckIcon.style.fontSize = '3em';
  duckIcon.style.marginBottom = '10px';
  const title = document.createElement('h2');
  title.textContent = 'Duck Duck';
  container.appendChild(duckIcon);
  container.appendChild(title);
  const startBtn = document.createElement('button');
  startBtn.textContent = 'Start';
  container.appendChild(startBtn);

  let score = 0;
  let levelIdx = 0;
  let questionNum = 0;
  let lastWrongCount = null;
  let lastWrongAnimal = null;
  let lastCorrectCount = null;
  let prevAnswer = null;

  function startLevel() {
    questionNum = 0;
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
    // Level title
    const levelTitle = document.createElement('h3');
    levelTitle.textContent = LEVELS[levelIdx].name;
    container.appendChild(levelTitle);
    // Pick animal and count, ensuring not same animal or count as previous
    let animal, count;
    do {
      animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
      count = Math.floor(Math.random() * LEVELS[levelIdx].max) + 1;
    } while (prevAnswer && (prevAnswer.animal === animal || prevAnswer.count === count));
    lastCorrectCount = count;
    prevAnswer = { animal, count };
    // Show animals
    const animalRow = document.createElement('div');
    animalRow.style.fontSize = '2.5em';
    animalRow.style.margin = '30px 0 20px 0';
    animalRow.style.letterSpacing = '0.15em';
    animalRow.textContent = Array(count).fill(animal.emoji).join(' ');
    container.appendChild(animalRow);
    // Make answer choices
    let choices = [count];
    while (choices.length < Math.min(6, LEVELS[levelIdx].max)) {
      let n = Math.floor(Math.random() * LEVELS[levelIdx].max) + 1;
      if (!choices.includes(n)) choices.push(n);
    }
    // Sort choices numerically
    choices.sort((a, b) => a - b);
    const btnRow = document.createElement('div');
    btnRow.style.margin = '20px 0';
    choices.forEach(n => {
      const btn = document.createElement('button');
      btn.textContent = n;
      btn.style.fontSize = '2em';
      btn.onclick = () => {
        Array.from(btnRow.children).forEach(b => b.disabled = true);
        if (n === count) {
          score++;
          questionNum++;
          scoreCounter.textContent = `Score: ${score}`;
          if (questionNum === 10) {
            levelIdx++;
            if (levelIdx < LEVELS.length) {
              showLevelUpCelebration(() => startLevel());
            } else {
              setTimeout(() => endGame(), 1000);
            }
          } else {
            setTimeout(() => nextQuestion(), 1000);
          }
        } else {
          lastWrongCount = count;
          lastWrongAnimal = animal;
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
    container.innerHTML = '';
    container.appendChild(duckIcon);
    const endMsg = document.createElement('h2');
    endMsg.textContent = `Game Over! Your score: ${score}`;
    container.appendChild(endMsg);
    if (lastWrongCount !== null && lastWrongAnimal !== null) {
      const correctMsg = document.createElement('div');
      correctMsg.style.margin = '16px 0';
      correctMsg.style.fontSize = '1.2em';
      correctMsg.innerHTML = `Correct answer: <b>${lastWrongCount}</b> <span style="font-size:2em;vertical-align:middle;">${lastWrongAnimal.emoji}</span>`;
      container.appendChild(correctMsg);
    }
    const retryBtn = document.createElement('button');
    retryBtn.textContent = '🔄 Play Again';
    retryBtn.onclick = () => {
      score = 0;
      levelIdx = 0;
      questionNum = 0;
      lastWrongCount = null;
      lastWrongAnimal = null;
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
    lastWrongCount = null;
    lastWrongAnimal = null;
    startLevel();
  };

  cleanup = () => {
    container.innerHTML = '';
  };
}

export function destroy() {
  if (cleanup) cleanup();
} 