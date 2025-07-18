// Maths Addition Minigame with Sequential Levels
let cleanup = null;

let lastWrongA = null;
let lastWrongB = null;

const LEVELS = [
  {
    name: 'Level 1',
    description: 'Total ≤ 10',
    gen: () => {
      let a, b;
      do {
        a = Math.floor(Math.random() * 10) + 1;
        b = Math.floor(Math.random() * 10) + 1;
      } while (a + b > 10);
      return [a, b];
    },
  },
  {
    name: 'Level 2',
    description: 'Single digits only',
    gen: () => {
      let a = Math.floor(Math.random() * 9) + 1;
      let b = Math.floor(Math.random() * 9) + 1;
      return [a, b];
    },
  },
  {
    name: 'Level 3',
    description: 'Total ≤ 20',
    gen: () => {
      let a, b;
      do {
        a = Math.floor(Math.random() * 20) + 1;
        b = Math.floor(Math.random() * 20) + 1;
      } while (a + b > 20);
      return [a, b];
    },
  },
  {
    name: 'Level 4',
    description: 'Total ≤ 30',
    gen: () => {
      let a, b;
      do {
        a = Math.floor(Math.random() * 30) + 1;
        b = Math.floor(Math.random() * 30) + 1;
      } while (a + b > 30);
      return [a, b];
    },
  },
  {
    name: 'Level 5',
    description: 'Total ≤ 40',
    gen: () => {
      let a, b;
      do {
        a = Math.floor(Math.random() * 40) + 1;
        b = Math.floor(Math.random() * 40) + 1;
      } while (a + b > 40);
      return [a, b];
    },
  },
];

export function init(container, options = {}) {
  container.innerHTML = '';
  const dinoIcon = document.createElement('div');
  dinoIcon.textContent = '🦖';
  dinoIcon.style.fontSize = '3em';
  dinoIcon.style.marginBottom = '10px';

  let gameActive = false;
  let score = 0;
  let levelIdx = 0;
  let questionNum = 0;
  // Remove reset from here
  // lastWrongA = null;
  // lastWrongB = null;

  function startLevel() {
    container.innerHTML = '';
    const levelTitle = document.createElement('h3');
    levelTitle.textContent = LEVELS[levelIdx].name;
    container.appendChild(levelTitle);
    const questionDiv = document.createElement('div');
    questionDiv.style.margin = '10px 0';
    container.appendChild(questionDiv);
    const input = document.createElement('input');
    input.type = 'text';
    input.inputMode = 'numeric';
    input.pattern = '[0-9]*';
    input.autofocus = true;
    input.setAttribute('aria-label', 'Your answer');
    container.appendChild(input);
    const submit = document.createElement('button');
    submit.textContent = 'Check!';
    container.appendChild(submit);
    const feedback = document.createElement('div');
    feedback.style.marginTop = '10px';
    container.appendChild(feedback);

    let a, b;
    function newQuestion() {
      [a, b] = LEVELS[levelIdx].gen();
      questionDiv.textContent = `${a} + ${b}`;
      input.value = '';
      feedback.textContent = '';
      input.focus();
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

    function endGame(wrongA = null, wrongB = null) {
      gameActive = false;
      container.innerHTML = '';
      container.appendChild(dinoIcon);
      const endMsg = document.createElement('h2');
      endMsg.textContent = `Game Over! Your score: ${score}`;
      container.appendChild(endMsg);
      if (wrongA !== null && wrongB !== null) {
        const correctMsg = document.createElement('div');
        correctMsg.style.margin = '16px 0';
        correctMsg.style.fontSize = '1.2em';
        correctMsg.textContent = `Correct answer: ${wrongA} + ${wrongB} = ${wrongA + wrongB}`;
        container.appendChild(correctMsg);
      }
      const retryBtn = document.createElement('button');
      retryBtn.textContent = '🔄 Play Again';
      retryBtn.style.marginBottom = '12px';
      retryBtn.onclick = () => {
        score = 0;
        levelIdx = 0;
        questionNum = 0;
        init(container, options);
      };
      container.appendChild(retryBtn);
      // Always show Exit button after Play Again
      const exitBtn = document.createElement('button');
      exitBtn.textContent = '🏠 Back to Menu';
      exitBtn.style.marginTop = '12px';
      exitBtn.onclick = () => {
        if (options.onExit) options.onExit();
      };
      container.appendChild(exitBtn);
    }

    function checkAnswer() {
      const val = parseInt(input.value.replace(/[^0-9]/g, ''), 10);
      if (val === a + b) {
        score++;
        questionNum++;
        if (questionNum === 10) {
          levelIdx++;
          questionNum = 0;
          if (levelIdx < LEVELS.length) {
            showLevelUpCelebration(() => startLevel());
          } else {
            feedback.textContent = 'You completed all levels! 🏆';
            setTimeout(() => {
              endGame();
            }, 1200);
          }
        } else {
          newQuestion();
        }
      } else {
        feedback.textContent = 'Wrong! Game Over.';
        setTimeout(() => {
          endGame(a, b);
        }, 1200);
      }
    }

    submit.onclick = checkAnswer;
    input.onkeydown = e => {
      if (e.key === 'Enter') checkAnswer();
    };

    newQuestion();
  }

  gameActive = true;
  score = 0;
  levelIdx = 0;
  questionNum = 0;
  startLevel();

  cleanup = () => {
    gameActive = false;
    container.innerHTML = '';
  };
}

export function destroy() {
  if (cleanup) cleanup();
} 