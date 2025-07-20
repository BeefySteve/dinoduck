// Dinosaur 3 Minigame (Addition, Subtraction, Multiplication)
let cleanup = null;

const LEVELS = [
  {
    name: 'Level 1',
    ops: ['+'],
    a: () => Math.floor(Math.random() * 9) + 1,
    b: () => Math.floor(Math.random() * 9) + 1,
  },
  {
    name: 'Level 2',
    ops: ['+', '-'],
    a: () => Math.floor(Math.random() * 9) + 1,
    b: () => Math.floor(Math.random() * 9) + 1,
  },
  {
    name: 'Level 3',
    ops: ['+', '-', '×'],
    a: () => Math.floor(Math.random() * 9) + 1,
    b: (op) => op === '×' ? Math.floor(Math.random() * 3) + 1 : Math.floor(Math.random() * 9) + 1,
  },
  {
    name: 'Level 4',
    ops: ['+', '-', '×'],
    a: (op) => op === '×' ? Math.floor(Math.random() * 5) + 1 : Math.floor(Math.random() * 15) + 1,
    b: (op) => op === '×' ? Math.floor(Math.random() * 5) + 1 : Math.floor(Math.random() * 15) + 1,
  },
  {
    name: 'Level 5',
    ops: ['+', '-', '×'],
    a: (op) => op === '×' ? Math.floor(Math.random() * 6) + 1 : Math.floor(Math.random() * 20) + 1,
    b: (op) => op === '×' ? Math.floor(Math.random() * 6) + 1 : Math.floor(Math.random() * 20) + 1,
  },
];

export function init(container, options = {}) {
  container.innerHTML = '';
  const dinoIcon = document.createElement('div');
  dinoIcon.textContent = '🦖';
  dinoIcon.style.fontSize = '3em';
  dinoIcon.style.marginBottom = '10px';
  const title = document.createElement('h2');
  title.textContent = 'Dinosaur 3';
  container.appendChild(dinoIcon);
  container.appendChild(title);
  const startBtn = document.createElement('button');
  startBtn.textContent = 'Start';
  container.appendChild(startBtn);

  let score = 0;
  let levelIdx = 0;
  let questionNum = 0;
  let lastWrong = null;

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
    // Generate question
    const ops = LEVELS[levelIdx].ops;
    const op = ops[Math.floor(Math.random() * ops.length)];
    const a = LEVELS[levelIdx].a(op);
    const b = typeof LEVELS[levelIdx].b === 'function' ? LEVELS[levelIdx].b(op) : LEVELS[levelIdx].b;
    let question, answer;
    if (op === '+') {
      question = `${a} + ${b}`;
      answer = a + b;
    } else if (op === '-') {
      // Ensure no negative answers
      if (a < b) {
        question = `${b} - ${a}`;
        answer = b - a;
      } else {
        question = `${a} - ${b}`;
        answer = a - b;
      }
    } else if (op === '×') {
      question = `${a} × ${b}`;
      answer = a * b;
    }
    // Show question
    const questionDiv = document.createElement('div');
    questionDiv.style.margin = '10px 0';
    questionDiv.textContent = question;
    container.appendChild(questionDiv);
    // Input
    const input = document.createElement('input');
    input.type = 'text';
    input.inputMode = 'numeric';
    input.pattern = '[0-9-]*';
    input.autofocus = true;
    input.setAttribute('aria-label', 'Your answer');
    container.appendChild(input);
    setTimeout(() => input.focus(), 0);
    const submit = document.createElement('button');
    submit.textContent = 'Check!';
    container.appendChild(submit);
    const feedback = document.createElement('div');
    feedback.style.marginTop = '10px';
    container.appendChild(feedback);

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
      if (lastWrong) {
        const correctMsg = document.createElement('div');
        correctMsg.style.margin = '16px 0';
        correctMsg.style.fontSize = '1.2em';
        correctMsg.textContent = `Correct answer: ${lastWrong.q} = ${lastWrong.a}`;
        container.appendChild(correctMsg);
      }
      const retryBtn = document.createElement('button');
      retryBtn.textContent = '🔄 Play Again';
      retryBtn.onclick = () => {
        score = 0;
        levelIdx = 0;
        questionNum = 0;
        lastWrong = null;
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

    function checkAnswer() {
      if (submit.disabled) return;
      submit.disabled = true;
      input.disabled = true;
      const val = parseInt(input.value.replace(/[^0-9-]/g, ''), 10);
      if (val === answer) {
        score++;
        questionNum++;
        scoreCounter.textContent = `Score: ${score}`;
        if (questionNum === 8) {
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
        lastWrong = { q: question, a: answer };
        feedback.textContent = 'Wrong! Game Over.';
        setTimeout(() => endGame(), 1000);
      }
    }

    submit.onclick = checkAnswer;
    input.onkeydown = e => {
      if (e.key === 'Enter') checkAnswer();
    };
  }

  function startGame() {
    score = 0;
    levelIdx = 0;
    questionNum = 0;
    lastWrong = null;
    startLevel();
  }

  startBtn.onclick = startGame;

  cleanup = () => {
    container.innerHTML = '';
  };
}

export function destroy() {
  if (cleanup) cleanup();
} 