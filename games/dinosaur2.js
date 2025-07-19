// Dinosaur 2 Spelling Game (Three-letter emoji names)
let cleanup = null;

const ITEMS = [
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
  const dinoIcon = document.createElement('div');
  dinoIcon.textContent = '🦖';
  dinoIcon.style.fontSize = '3em';
  dinoIcon.style.marginBottom = '10px';
  const title = document.createElement('h2');
  title.textContent = 'Dinosaur 2';
  container.appendChild(dinoIcon);
  container.appendChild(title);
  const startBtn = document.createElement('button');
  startBtn.textContent = 'Start';
  container.appendChild(startBtn);

  let score = 0;
  let questionNum = 0;
  let shuffled = [];
  let lastWrong = null;

  function startGame() {
    score = 0;
    questionNum = 0;
    lastWrong = null;
    // Shuffle all items
    shuffled = ITEMS.slice();
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
    // Pick item
    const item = shuffled[questionNum];
    // Show emoji
    const emojiDiv = document.createElement('div');
    emojiDiv.textContent = item.emoji;
    emojiDiv.style.fontSize = '4em';
    emojiDiv.style.margin = '30px 0 20px 0';
    container.appendChild(emojiDiv);
    // Input
    const input = document.createElement('input');
    input.type = 'text';
    input.maxLength = 3;
    input.autofocus = true;
    input.setAttribute('aria-label', 'Type the name');
    input.style.fontSize = '1.2em';
    input.style.width = '140px';
    input.style.textTransform = 'lowercase';
    input.style.letterSpacing = '0.2em';
    setTimeout(() => input.focus(), 0);
    container.appendChild(input);
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
        correctMsg.innerHTML = `Correct answer: <b>${lastWrong.word}</b> <span style="font-size:2em;vertical-align:middle;">${lastWrong.emoji}</span>`;
        container.appendChild(correctMsg);
      }
      const retryBtn = document.createElement('button');
      retryBtn.textContent = '🔄 Play Again';
      retryBtn.onclick = () => {
        score = 0;
        questionNum = 0;
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

    function checkAnswer() {
      if (submit.disabled) return;
      submit.disabled = true;
      input.disabled = true;
      const val = input.value.trim().toLowerCase();
      if (val === item.name) {
        score++;
        questionNum++;
        scoreCounter.textContent = `Score: ${score}`;
        if (questionNum === shuffled.length) {
          setTimeout(() => endGame(), 1000);
        } else {
          setTimeout(() => nextQuestion(), 1000);
        }
      } else {
        lastWrong = { word: item.name, emoji: item.emoji };
        feedback.textContent = 'Wrong! Game Over.';
        setTimeout(() => endGame(), 1000);
      }
    }

    submit.onclick = checkAnswer;
    input.onkeydown = e => {
      if (e.key === 'Enter') checkAnswer();
    };
  }

  startBtn.onclick = startGame;

  cleanup = () => {
    container.innerHTML = '';
  };
}

export function destroy() {
  if (cleanup) cleanup();
} 