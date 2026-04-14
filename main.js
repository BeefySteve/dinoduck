if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/dinoduck/service-worker.js')
    .then(registration => {
      console.log('SW registered: ', registration);
      
      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New version available
            if (confirm('A new version is available! Reload to update?')) {
              window.location.reload();
            }
          }
        });
      });
      
      // Listen for controller change (when new SW takes over)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('New service worker activated');
      });
    })
    .catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
}
// Game registry
const games = [
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
  {
    id: 'train',
    name: 'Train',
    module: () => import('./games/train.js'),
  },
  {
    id: 'multiplication',
    name: 'Dinosaur Multiplication',
    module: () => import('./games/multiplication.js'),
  },
  {
    id: 'division',
    name: 'Dinosaur Division',
    module: () => import('./games/division.js'),
  },
  {
    id: 'combined',
    name: 'Combined Multiplication & Division',
    module: () => import('./games/combined.js'),
  },
  // Add more games here
];

// Game descriptions for homescreen
const gameDescriptions = {
  maths: 'add numbers',
  multiplication: 'times tables (2s, 5s, 10s)',
  division: 'times tables (2s, 5s, 10s)',
  combined: 'multiply and divide',
  dinosaur2: 'Spell words like \'cat\' and \'dog\'.',
  dinosaur3: 'add, subtract and multiply',
  dinosaur4: 'Trace letters and learn ABCs.',
  letters: 'Find letters A to Z with pictures.',
  counting: 'Count animals up to 12.',
  duckduckduck: 'Tap ducks to make them splash.',
  duckduckduckduck: 'Draw straight lines and shapes.',
  train: 'Drive the train through mazes.',
};

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
    btn.className = 'game-button';
    btn.title = game.name;
    btn.setAttribute('aria-label', gameDescriptions[game.id] || game.name);

    // Create icon element
    const iconDiv = document.createElement('div');
    iconDiv.className = 'game-icon';
    let emoji = '';
    if (game.id === 'maths') {
      emoji = '🦖';
    } else if (game.id === 'multiplication') {
      emoji = '🦈✕';
    } else if (game.id === 'division') {
      emoji = '🦕÷';
    } else if (game.id === 'combined') {
      emoji = '🦈🦕';
    } else if (game.id === 'dinosaur2') {
      emoji = '🦖2';
    } else if (game.id === 'dinosaur3') {
      emoji = '🦖3';
    } else if (game.id === 'dinosaur4') {
      emoji = '🦖4';
    } else if (game.id === 'letters') {
      emoji = '🦆';
    } else if (game.id === 'counting') {
      emoji = '🦆🦆';
    } else if (game.id === 'duckduckduck') {
      emoji = '🦆🦆🦆';
    } else if (game.id === 'duckduckduckduck') {
      emoji = '🦆🦆🦆🦆';
    } else if (game.id === 'train') {
      emoji = '🚂';
    } else {
      emoji = game.name;
    }
    iconDiv.textContent = emoji;

    // Create description element
    const descP = document.createElement('p');
    descP.className = 'game-description';
    descP.textContent = gameDescriptions[game.id] || 'Play this fun game!';

    // Append to button
    btn.appendChild(iconDiv);
    btn.appendChild(descP);

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