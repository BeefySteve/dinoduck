if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/dinoduck/service-worker.js');
}
// Game registry
const games = [
  // Dinosaur games
  {
    id: 'maths',
    name: 'Dinosaur Maths Addition',
    module: () => import('./games/maths.js'),
  },
  {
    id: 'dinosaur2',
    name: 'Dinosaur 2',
    module: () => import('./games/dinosaur2.js'),
  },
  {
    id: 'dinosaur3',
    name: 'Dinosaur 3',
    module: () => import('./games/dinosaur3.js'),
  },
  {
    id: 'dinosaur4',
    name: 'Dinosaur 4',
    module: () => import('./games/dinosaur4.js'),
  },
  // Duck games
  {
    id: 'letters',
    name: 'Duck Letters',
    module: () => import('./games/letters.js'),
  },
  {
    id: 'counting',
    name: 'Duck Duck',
    module: () => import('./games/counting.js'),
  },
  {
    id: 'duckduckduck',
    name: 'Duck Duck Duck',
    module: () => import('./games/duckduckduck.js'),
  },
  {
    id: 'duckduckduckduck',
    name: 'Duck Duck Duck Duck',
    module: () => import('./games/duckduckduckduck.js'),
  },
  // Add more games here
];

const gameMenu = document.getElementById('game-menu');
const gameContainer = document.getElementById('game-container');
const topBar = document.getElementById('top-bar');
let currentGame = null;
let currentGameModule = null;

function showTopBar(show) {
  if (show) {
    topBar.classList.remove('hidden');
  } else {
    topBar.classList.add('hidden');
  }
}

function renderMenu() {
  showTopBar(true);
  gameMenu.innerHTML = '';
  games.forEach(game => {
    const btn = document.createElement('button');
    if (game.id === 'maths') {
      btn.textContent = '🦖';
      btn.title = 'Dinosaur Maths Addition';
      btn.style.fontSize = '2em';
    } else if (game.id === 'dinosaur2') {
      btn.textContent = '🦖2';
      btn.title = 'Dinosaur 2';
      btn.style.fontSize = '2em';
    } else if (game.id === 'dinosaur3') {
      btn.textContent = '🦖3';
      btn.title = 'Dinosaur 3';
      btn.style.fontSize = '2em';
    } else if (game.id === 'dinosaur4') {
      btn.textContent = '🦖4';
      btn.title = 'Dinosaur 4';
      btn.style.fontSize = '2em';
    } else if (game.id === 'letters') {
      btn.textContent = '🦆';
      btn.title = 'Duck Letters';
      btn.style.fontSize = '2em';
    } else if (game.id === 'counting') {
      btn.textContent = '🦆🦆';
      btn.title = 'Duck Duck';
      btn.style.fontSize = '2em';
    } else if (game.id === 'duckduckduck') {
      btn.textContent = '🦆🦆🦆';
      btn.title = 'Duck Duck Duck';
      btn.style.fontSize = '2em';
    } else if (game.id === 'duckduckduckduck') {
      btn.textContent = '🦆🦆🦆🦆';
      btn.title = 'Duck Duck Duck Duck';
      btn.style.fontSize = '2em';
    } else {
      btn.textContent = game.name;
    }
    btn.onclick = () => loadGame(game);
    gameMenu.appendChild(btn);
  });
}

async function loadGame(game) {
  if (currentGameModule && currentGameModule.destroy) {
    currentGameModule.destroy();
  }
  showTopBar(false);
  gameContainer.innerHTML = '<em>Loading...</em>';
  const module = await game.module();
  currentGameModule = module;
  if (module.init) {
    module.init(gameContainer, { gameplay: true, onExit: renderMenu });
  }
}

renderMenu();
// Removed auto-load of the first game. Only load on click. 