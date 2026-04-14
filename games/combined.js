// Combined Multiplication and Division Game
let cleanup = null;

const LEVELS = [
  {
    name: '2 Combined Times Table',
    description: '2 × and ÷ facts',
    table: 2,
    multipliers: [1, 2, 3, 4, 5],
    quotients: [1, 2, 3, 4, 5],
  },
  {
    name: '5 Combined Times Table',
    description: '5 × and ÷ facts',
    table: 5,
    multipliers: [1, 2, 3, 4, 5],
    quotients: [1, 2, 3, 4, 5],
  },
  {
    name: '10 Combined Times Table',
    description: '10 × and ÷ facts',
    table: 10,
    multipliers: [1, 2, 3, 4, 5],
    quotients: [1, 2, 3, 4, 5],
  },
  {
    name: 'Mixed Combined Times Tables',
    description: 'All tables mixed',
    table: null,
    multipliers: null,
    quotients: null,
  },
];

// Shuffle array function
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Generate question for a given times table
function generateQuestion(level, lastMultiplier = null, lastQuotient = null, isMultiplication) {
  if (level.table !== null) {
    if (isMultiplication) {
      let multiplier;
      do {
        multiplier = level.multipliers[Math.floor(Math.random() * level.multipliers.length)];
      } while (lastMultiplier !== null && multiplier === lastMultiplier);
      return {
        isMultiplication: true,
        table: level.table,
        multiplier,
        answer: level.table * multiplier,
      };
    } else {
      let quotient;
      do {
        quotient = level.quotients[Math.floor(Math.random() * level.quotients.length)];
      } while (lastQuotient !== null && quotient === lastQuotient);
      return {
        isMultiplication: false,
        table: level.table,
        quotient,
        dividend: level.table * quotient,
        answer: quotient,
      };
    }
  } else {
    // Mixed level
    const tables = [2, 5, 10];
    const table = tables[Math.floor(Math.random() * tables.length)];
    if (isMultiplication) {
      const multipliers = [1, 2, 3, 4, 5];
      let multiplier;
      do {
        multiplier = multipliers[Math.floor(Math.random() * multipliers.length)];
      } while (lastMultiplier !== null && multiplier === lastMultiplier);
      return {
        isMultiplication: true,
        table,
        multiplier,
        answer: table * multiplier,
      };
    } else {
      const quotients = [1, 2, 3, 4, 5];
      let quotient;
      do {
        quotient = quotients[Math.floor(Math.random() * quotients.length)];
      } while (lastQuotient !== null && quotient === lastQuotient);
      return {
        isMultiplication: false,
        table,
        quotient,
        dividend: table * quotient,
        answer: quotient,
      };
    }
  }
}

export function init(container, options = {}) {
  container.innerHTML = '';
  const dinoIcon = document.createElement('div');
  dinoIcon.textContent = '🦈🦕';
  dinoIcon.style.fontSize = '3em';
  dinoIcon.style.marginBottom = '10px';

  let gameActive = false;
  let multScore = 0;
  let divScore = 0;
  let levelIdx = 0;
  let multCount = 0;
  let divCount = 0;
  let lastMultiplier = null;
  let lastQuotient = null;
  let currentQuestion = null;

  // Shuffle levels for randomization
  const shuffledLevels = [...LEVELS];
  shuffleArray(shuffledLevels);

  function startLevel() {
    container.innerHTML = '';
    multCount = 0;
    divCount = 0;
    lastMultiplier = null;
    lastQuotient = null;

    // Score counters
    const scoreCounter = document.createElement('div');
    scoreCounter.style.position = 'absolute';
    scoreCounter.style.top = '16px';
    scoreCounter.style.right = '24px';
    scoreCounter.style.fontSize = '1.1em';
    scoreCounter.style.fontWeight = 'bold';
    scoreCounter.textContent = `×: ${multScore} ÷: ${divScore}`;
    container.appendChild(scoreCounter);

    // Level title
    const levelTitle = document.createElement('h3');
    levelTitle.textContent = shuffledLevels[levelIdx].name;
    levelTitle.style.marginTop = '20px';
    container.appendChild(levelTitle);

    // Level description
    const levelDesc = document.createElement('div');
    levelDesc.textContent = shuffledLevels[levelIdx].description;
    levelDesc.style.fontSize = '0.9em';
    levelDesc.style.color = '#666';
    levelDesc.style.marginBottom = '20px';
    container.appendChild(levelDesc);

    nextQuestion(scoreCounter);
  }

  function nextQuestion(scoreCounter) {
    container.innerHTML = '';

    // Score counters
    scoreCounter.style.position = 'absolute';
    scoreCounter.style.top = '16px';
    scoreCounter.style.right = '24px';
    scoreCounter.style.fontSize = '1.1em';
    scoreCounter.style.fontWeight = 'bold';
    scoreCounter.textContent = `×: ${multScore} ÷: ${divScore}`;
    container.appendChild(scoreCounter);

    // Level title
    const levelTitle = document.createElement('h3');
    levelTitle.textContent = shuffledLevels[levelIdx].name;
    levelTitle.style.marginTop = '20px';
    container.appendChild(levelTitle);

    // Determine question type: alternate
    const isMultiplication = (multCount + divCount) % 2 === 0;

    // Question display
    currentQuestion = generateQuestion(
      shuffledLevels[levelIdx],
      lastMultiplier,
      lastQuotient,
      isMultiplication
    );

    if (isMultiplication) {
      lastMultiplier = currentQuestion.multiplier;
    } else {
      lastQuotient = currentQuestion.quotient;
    }

    const questionDiv = document.createElement('div');
    questionDiv.style.fontSize = '2.5em';
    questionDiv.style.fontWeight = 'bold';
    questionDiv.style.margin = '30px 0 20px 0';
    questionDiv.style.color = '#006064';
    if (isMultiplication) {
      questionDiv.textContent = `${currentQuestion.table} × ${currentQuestion.multiplier} = ?`;
    } else {
      questionDiv.textContent = `${currentQuestion.dividend} ÷ ${currentQuestion.table} = ?`;
    }
    container.appendChild(questionDiv);

    // Visual representation for division
    if (!isMultiplication) {
      const visualDiv = document.createElement('div');
      visualDiv.style.display = 'flex';
      visualDiv.style.justifyContent = 'center';
      visualDiv.style.margin = '20px 0';
      visualDiv.style.fontSize = '2em';
      const groups = [];
      for (let i = 0; i < currentQuestion.quotient; i++) {
        groups.push('🍎'.repeat(currentQuestion.table));
      }
      visualDiv.textContent = groups.join(' | ');
      container.appendChild(visualDiv);
    }

    // Input field
    const input = document.createElement('input');
    input.type = 'text';
    input.inputMode = 'numeric';
    input.pattern = '[0-9]*';
    input.autofocus = true;
    input.setAttribute('aria-label', 'Your answer');
    input.style.fontSize = '1.5em';
    input.style.padding = '10px';
    input.style.borderRadius = '8px';
    input.style.border = '2px solid #b2ebf2';
    input.style.width = '100px';
    input.style.textAlign = 'center';
    input.style.margin = '10px';
    container.appendChild(input);
    input.focus();

    // Submit button
    const submit = document.createElement('button');
    submit.textContent = 'Check!';
    submit.style.marginTop = '15px';
    container.appendChild(submit);

    // Feedback area
    const feedback = document.createElement('div');
    feedback.style.marginTop = '15px';
    feedback.style.fontSize = '1.2em';
    feedback.style.minHeight = '30px';
    container.appendChild(feedback);

    function checkAnswer() {
      if (submit.disabled) return;
      submit.disabled = true;
      input.disabled = true;

      // Validate input
      const userAnswer = parseInt(input.value.trim(), 10);
      if (isNaN(userAnswer) || input.value.trim() === '') {
        feedback.textContent = '❌ Please enter a number';
        feedback.style.color = '#d32f2f';
        setTimeout(() => {
          submit.disabled = false;
          input.disabled = false;
          input.focus();
          feedback.textContent = '';
        }, 1500);
        return;
      }

      // Check answer
      if (userAnswer === currentQuestion.answer) {
        // Correct answer
        if (isMultiplication) {
          multScore++;
          multCount++;
        } else {
          divScore++;
          divCount++;
        }
        feedback.textContent = '✓ Correct! 🎉';
        feedback.style.color = '#388e3c';
        scoreCounter.textContent = `×: ${multScore} ÷: ${divScore}`;

        if (levelIdx < 3 && multCount === 6 && divCount === 6) {
          // Level complete
          levelIdx++;
          if (levelIdx < shuffledLevels.length) {
            setTimeout(() => {
              showLevelUpCelebration(() => startLevel());
            }, 800);
          } else {
            // All levels complete
            setTimeout(() => {
              endGame(scoreCounter);
            }, 800);
          }
        } else {
          // Next question (for level 4, keep going)
          setTimeout(() => {
            submit.disabled = false;
            input.disabled = false;
            nextQuestion(scoreCounter);
          }, 800);
        }
      } else {
        // Incorrect answer - end game
        setTimeout(() => {
          endGame(scoreCounter, currentQuestion);
        }, 800);
      }
    }

    submit.onclick = checkAnswer;
    input.onkeydown = (e) => {
      if (e.key === 'Enter') checkAnswer();
    };
  }

  function showLevelUpCelebration(next) {
    container.innerHTML = '';
    let flashes = 0;
    const maxFlashes = 6;
    const dinoDance = document.createElement('div');
    dinoDance.textContent = '🦈🦕💃';
    dinoDance.style.fontSize = '4em';
    dinoDance.style.margin = '40px 0';
    dinoDance.style.animation = 'dino-dance 1.2s linear';
    container.appendChild(dinoDance);

    const celebMsg = document.createElement('h2');
    celebMsg.textContent = 'Amazing! Combined Level Complete!';
    celebMsg.style.color = '#388e3c';
    container.appendChild(celebMsg);

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

  function endGame(scoreCounter, wrongQuestion = null) {
    gameActive = false;
    container.innerHTML = '';
    container.appendChild(dinoIcon);

    const totalScore = multScore + divScore;
    const endMsg = document.createElement('h2');
    endMsg.textContent = `Game Over! Your score: ${totalScore}`;
    container.appendChild(endMsg);

    if (wrongQuestion !== null) {
      const correctMsg = document.createElement('div');
      correctMsg.style.margin = '16px 0';
      correctMsg.style.fontSize = '1.2em';
      if (wrongQuestion.isMultiplication) {
        correctMsg.textContent = `Correct answer: ${wrongQuestion.table} × ${wrongQuestion.multiplier} = ${wrongQuestion.answer}`;
      } else {
        correctMsg.textContent = `Correct answer: ${wrongQuestion.dividend} ÷ ${wrongQuestion.table} = ${wrongQuestion.answer}`;
      }
      container.appendChild(correctMsg);
    }

    const playAgainBtn = document.createElement('button');
    playAgainBtn.textContent = '🔄 Play Again';
    playAgainBtn.style.marginBottom = '12px';
    playAgainBtn.onclick = () => {
      multScore = 0;
      divScore = 0;
      levelIdx = 0;
      multCount = 0;
      divCount = 0;
      lastMultiplier = null;
      lastQuotient = null;
      init(container, options);
    };
    container.appendChild(playAgainBtn);

    const exitBtn = document.createElement('button');
    exitBtn.textContent = '🏠 Back to Menu';
    exitBtn.style.marginTop = '12px';
    exitBtn.onclick = () => {
      if (options.onExit) options.onExit();
    };
    container.appendChild(exitBtn);
  }

  gameActive = true;
  multScore = 0;
  divScore = 0;
  levelIdx = 0;
  multCount = 0;
  divCount = 0;
  startLevel();

  cleanup = () => {
    gameActive = false;
    container.innerHTML = '';
  };
}

export function destroy() {
  if (cleanup) cleanup();
}