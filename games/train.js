export function init(container, options = {}) {
  const { gameplay = false, onExit } = options;
  
  let score = 0;
  let currentLevel = 1;
  let gameActive = true;
  let trainElement = null;
  let isDragging = false;
  let currentPosition = { x: 0, y: 0 };
  let lastPosition = { x: 0, y: 0 };
  let maze = [];
  let mazeSize = 8;
  let stationPosition = { x: 0, y: 0 };
  let startPosition = { x: 0, y: 0 };
  let visitedCells = new Set();
  let junctions = [];
  
  // Clear container
  container.innerHTML = '';
  
  // Create score display
  const scoreDisplay = document.createElement('div');
  scoreDisplay.style.cssText = `
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 1.5em;
    font-weight: bold;
    color: #ffb300;
    text-shadow: 1px 1px 4px #fffde7, 0 0 2px #1976d2;
    z-index: 10;
  `;
  scoreDisplay.textContent = `Score: ${score}`;
  container.appendChild(scoreDisplay);
  
  // Create game area
  const gameArea = document.createElement('div');
  gameArea.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    position: relative;
  `;
  container.appendChild(gameArea);
  
  // Create maze container
  const mazeContainer = document.createElement('div');
  mazeContainer.style.cssText = `
    display: grid;
    gap: 2px;
    background: #333;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  `;
  gameArea.appendChild(mazeContainer);
  
  // Create train element
  trainElement = document.createElement('div');
  trainElement.innerHTML = '🚂';
  trainElement.style.cssText = `
    position: absolute;
    font-size: 2em;
    cursor: grab;
    user-select: none;
    z-index: 5;
    transition: transform 0.1s ease;
    pointer-events: auto;
    transform: translate(-50%, -50%);
  `;
  trainElement.addEventListener('mousedown', startDrag);
  trainElement.addEventListener('touchstart', startDrag);
  container.appendChild(trainElement);
  
  function generateMaze() {
    // Adjust difficulty based on score
    if (score < 10) {
      mazeSize = 6;
    } else if (score < 25) {
      mazeSize = 8;
    } else if (score < 50) {
      mazeSize = 10;
    } else {
      mazeSize = 12;
    }
    
    // Initialize maze
    maze = [];
    for (let y = 0; y < mazeSize; y++) {
      maze[y] = [];
      for (let x = 0; x < mazeSize; x++) {
        maze[y][x] = { type: 'empty', connections: [] };
      }
    }
    
    // Set random start position (train shed) - on left or top edge
    const startEdge = Math.random() < 0.5 ? 'left' : 'top';
    if (startEdge === 'left') {
      startPosition = { x: 0, y: Math.floor(Math.random() * mazeSize) };
    } else {
      startPosition = { x: Math.floor(Math.random() * mazeSize), y: 0 };
    }
    maze[startPosition.y][startPosition.x] = { type: 'start', connections: [] };
    
    // Set random station position - on opposite edge from start
    if (startEdge === 'left') {
      // Start is on left, station on right
      stationPosition = { x: mazeSize - 1, y: Math.floor(Math.random() * mazeSize) };
    } else {
      // Start is on top, station on bottom
      stationPosition = { x: Math.floor(Math.random() * mazeSize), y: mazeSize - 1 };
    }
    maze[stationPosition.y][stationPosition.x] = { type: 'station', connections: [] };
    
    // Generate tracks using a simple pathfinding algorithm
    generateTracks();
    
    // Reset visited cells
    visitedCells.clear();
    visitedCells.add(`${startPosition.x},${startPosition.y}`);
    
    // Reset current position
    currentPosition = { ...startPosition };
    lastPosition = { ...startPosition };
    
    // Wait for maze to render before positioning train
    setTimeout(() => {
      updateTrainPosition();
    }, 100);
  }
  
  function generateTracks() {
    // Create a complex path with multiple segments
    const mainPath = generateMeanderingPath(startPosition, stationPosition);
    
    // Create tracks along the main path
    for (let i = 0; i < mainPath.length - 1; i++) {
      const current = mainPath[i];
      const next = mainPath[i + 1];
      
      // Determine connection direction
      if (next.x > current.x) {
        maze[current.y][current.x].connections.push('right');
        maze[next.y][next.x].connections.push('left');
      } else if (next.x < current.x) {
        maze[current.y][current.x].connections.push('left');
        maze[next.y][next.x].connections.push('right');
      } else if (next.y > current.y) {
        maze[current.y][current.x].connections.push('down');
        maze[next.y][next.x].connections.push('up');
      } else if (next.y < current.y) {
        maze[current.y][current.x].connections.push('up');
        maze[next.y][next.x].connections.push('down');
      }
    }
    
    // Add some additional path segments for complexity
    addAdditionalPaths();
    
    // Add some crossing tracks (tunnels and bridges)
    addCrossingTracks();
    
    // Ensure station is accessible
    ensureStationAccessible();
    
    // Add junctions and their dead end branches
    addJunctions();
    
    // Mark all dead ends as buffers (after all dead end branches are created)
    markDeadEndsAsBuffers();
  }
  
  function addAdditionalPaths() {
    const numAdditionalPaths = Math.min(Math.floor(score / 15) + 1, 2);
    
    for (let i = 0; i < numAdditionalPaths; i++) {
      // Find a random point on the main path to branch from
      const pathCells = [];
      for (let y = 0; y < mazeSize; y++) {
        for (let x = 0; x < mazeSize; x++) {
          if (maze[y][x].connections.length > 0 && maze[y][x].type !== 'start' && maze[y][x].type !== 'station') {
            pathCells.push({ x, y });
          }
        }
      }
      
      if (pathCells.length > 0) {
        const startCell = pathCells[Math.floor(Math.random() * pathCells.length)];
        const endCell = pathCells[Math.floor(Math.random() * pathCells.length)];
        
        if (startCell.x !== endCell.x || startCell.y !== endCell.y) {
          const branchPath = generateMeanderingPath(startCell, endCell);
          
          // Create tracks along the branch path
          for (let j = 0; j < branchPath.length - 1; j++) {
            const current = branchPath[j];
            const next = branchPath[j + 1];
            
            // Only add if the cells are empty or already have connections
            if (maze[current.y][current.x].type === 'empty' || maze[current.y][current.x].connections.length > 0) {
              if (next.x > current.x) {
                if (!maze[current.y][current.x].connections.includes('right')) {
                  maze[current.y][current.x].connections.push('right');
                }
                if (!maze[next.y][next.x].connections.includes('left')) {
                  maze[next.y][next.x].connections.push('left');
                }
              } else if (next.x < current.x) {
                if (!maze[current.y][current.x].connections.includes('left')) {
                  maze[current.y][current.x].connections.push('left');
                }
                if (!maze[next.y][next.x].connections.includes('right')) {
                  maze[next.y][next.x].connections.push('right');
                }
              } else if (next.y > current.y) {
                if (!maze[current.y][current.x].connections.includes('down')) {
                  maze[current.y][current.x].connections.push('down');
                }
                if (!maze[next.y][next.x].connections.includes('up')) {
                  maze[next.y][next.x].connections.push('up');
                }
              } else if (next.y < current.y) {
                if (!maze[current.y][current.x].connections.includes('up')) {
                  maze[current.y][current.x].connections.push('up');
                }
                if (!maze[next.y][next.x].connections.includes('down')) {
                  maze[next.y][next.x].connections.push('down');
                }
              }
            }
          }
        }
      }
    }
  }
  
  function addCrossingTracks() {
    const numCrossings = Math.min(Math.floor(score / 10) + 1, 3);
    
    for (let i = 0; i < numCrossings; i++) {
      // Find a suitable location for a crossing
      const crossingX = Math.floor(Math.random() * (mazeSize - 2)) + 1;
      const crossingY = Math.floor(Math.random() * (mazeSize - 2)) + 1;
      
      // Only add crossing if the cell is empty
      if (maze[crossingY][crossingX].type === 'empty') {
        // Randomly decide if it's a tunnel or bridge
        const isTunnel = Math.random() < 0.5;
        maze[crossingY][crossingX].type = isTunnel ? 'tunnel' : 'bridge';
        
        // Add connections in both directions
        maze[crossingY][crossingX].connections = ['up', 'down', 'left', 'right'];
        
        // Connect to adjacent cells if they exist
        const directions = [
          { x: 1, y: 0, dir: 'right', opposite: 'left' },
          { x: -1, y: 0, dir: 'left', opposite: 'right' },
          { x: 0, y: 1, dir: 'down', opposite: 'up' },
          { x: 0, y: -1, dir: 'up', opposite: 'down' }
        ];
        
        for (const dir of directions) {
          const nextX = crossingX + dir.x;
          const nextY = crossingY + dir.y;
          
          if (nextX >= 0 && nextX < mazeSize && nextY >= 0 && nextY < mazeSize) {
            if (maze[nextY][nextX].type === 'empty') {
              // Create a short track segment
              maze[nextY][nextX].connections.push(dir.opposite);
            }
          }
        }
      }
    }
  }
  
  function ensureStationAccessible() {
    // Check if station has connections
    if (maze[stationPosition.y][stationPosition.x].connections.length === 0) {
      // Find the closest connected cell to the station
      let closestDistance = Infinity;
      let closestCell = null;
      
      for (let y = 0; y < mazeSize; y++) {
        for (let x = 0; x < mazeSize; x++) {
          if (maze[y][x].connections.length > 0 && (x !== stationPosition.x || y !== stationPosition.y)) {
            const distance = Math.abs(x - stationPosition.x) + Math.abs(y - stationPosition.y);
            if (distance < closestDistance) {
              closestDistance = distance;
              closestCell = { x, y };
            }
          }
        }
      }
      
      // Connect station to closest cell
      if (closestCell && closestDistance === 1) {
        const dx = closestCell.x - stationPosition.x;
        const dy = closestCell.y - stationPosition.y;
        
        if (dx === 1) {
          maze[stationPosition.y][stationPosition.x].connections.push('right');
          maze[closestCell.y][closestCell.x].connections.push('left');
        } else if (dx === -1) {
          maze[stationPosition.y][stationPosition.x].connections.push('left');
          maze[closestCell.y][closestCell.x].connections.push('right');
        } else if (dy === 1) {
          maze[stationPosition.y][stationPosition.x].connections.push('down');
          maze[closestCell.y][closestCell.x].connections.push('up');
        } else if (dy === -1) {
          maze[stationPosition.y][stationPosition.x].connections.push('up');
          maze[closestCell.y][closestCell.x].connections.push('down');
        }
      }
    }
  }
  
  function markDeadEndsAsBuffers() {
    // Find all cells with only one connection (dead ends) that are reachable from start
    for (let y = 0; y < mazeSize; y++) {
      for (let x = 0; x < mazeSize; x++) {
        const cell = maze[y][x];
        
        // Skip start, station, junctions, tunnels, bridges, and existing buffers
        if (cell.type === 'start' || cell.type === 'station' || 
            cell.type === 'junction' || cell.type === 'tunnel' || 
            cell.type === 'bridge' || cell.type === 'buffer') {
          continue;
        }
        
        // Only mark as buffer if it's reachable from start
        if (canReachFromStart(x, y)) {
          // If cell has exactly one connection, it's a dead end
          if (cell.connections.length === 1) {
            cell.type = 'buffer';
          }
          
          // Also mark cells with no connections as buffers (isolated cells)
          if (cell.connections.length === 0 && cell.type === 'empty') {
            cell.type = 'buffer';
          }
        }
      }
    }
  }
  
  function generateMeanderingPath(start, end) {
    const path = [start];
    let current = { ...start };
    let lastDirection = null;
    let stepsInCurrentDirection = 0;
    let totalSteps = 0;
    const maxSteps = mazeSize * 3; // Prevent infinite loops
    
    while ((current.x !== end.x || current.y !== end.y) && totalSteps < maxSteps) {
      const dx = end.x - current.x;
      const dy = end.y - current.y;
      
      // Force more corners and detours
      const shouldChangeDirection = stepsInCurrentDirection > 1 && Math.random() < 0.6;
      const shouldDetour = Math.random() < 0.3 && totalSteps > 5;
      
      let nextX = current.x;
      let nextY = current.y;
      let newDirection = null;
      
      if (shouldDetour && lastDirection) {
        // Create a detour by going perpendicular and then back
        if (lastDirection === 'horizontal') {
          nextY = current.y + (Math.random() < 0.5 ? 1 : -1);
          newDirection = 'vertical';
        } else {
          nextX = current.x + (Math.random() < 0.5 ? 1 : -1);
          newDirection = 'horizontal';
        }
      } else if (shouldChangeDirection && lastDirection) {
        // Force a corner by going perpendicular to current direction
        if (lastDirection === 'horizontal') {
          nextY = current.y + (dy > 0 ? 1 : -1);
          newDirection = 'vertical';
        } else {
          nextX = current.x + (dx > 0 ? 1 : -1);
          newDirection = 'horizontal';
        }
      } else {
        // Normal movement towards target with more randomness
        const shouldGoHorizontal = Math.abs(dx) > Math.abs(dy) ? 0.6 : 0.4;
        const random = Math.random();
        
        if (random < shouldGoHorizontal && dx !== 0) {
          nextX = current.x + (dx > 0 ? 1 : -1);
          newDirection = 'horizontal';
        } else if (dy !== 0) {
          nextY = current.y + (dy > 0 ? 1 : -1);
          newDirection = 'vertical';
        } else if (dx !== 0) {
          nextX = current.x + (dx > 0 ? 1 : -1);
          newDirection = 'horizontal';
        }
      }
      
      // Ensure we stay within bounds
      if (nextX >= 0 && nextX < mazeSize && nextY >= 0 && nextY < mazeSize) {
        current = { x: nextX, y: nextY };
        path.push(current);
        totalSteps++;
        
        if (newDirection === lastDirection) {
          stepsInCurrentDirection++;
        } else {
          stepsInCurrentDirection = 1;
          lastDirection = newDirection;
        }
      } else {
        // If we hit a boundary, try the other direction
        if (dx !== 0) {
          nextX = current.x + (dx > 0 ? 1 : -1);
          nextY = current.y;
        } else if (dy !== 0) {
          nextX = current.x;
          nextY = current.y + (dy > 0 ? 1 : -1);
        }
        
        if (nextX >= 0 && nextX < mazeSize && nextY >= 0 && nextY < mazeSize) {
          current = { x: nextX, y: nextY };
          path.push(current);
          totalSteps++;
        }
      }
    }
    
    // If we didn't reach the end, add a direct path
    if (current.x !== end.x || current.y !== end.y) {
      while (current.x !== end.x || current.y !== end.y) {
        const dx = end.x - current.x;
        const dy = end.y - current.y;
        
        if (dx !== 0) {
          current.x += dx > 0 ? 1 : -1;
        } else if (dy !== 0) {
          current.y += dy > 0 ? 1 : -1;
        }
        
        path.push({ ...current });
      }
    }
    
    return path;
  }
  
  function findPath(start, end) {
    const queue = [[start]];
    const visited = new Set();
    
    while (queue.length > 0) {
      const path = queue.shift();
      const current = path[path.length - 1];
      const key = `${current.x},${current.y}`;
      
      if (current.x === end.x && current.y === end.y) {
        return path;
      }
      
      if (visited.has(key)) continue;
      visited.add(key);
      
      // Add adjacent cells
      const directions = [
        { x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }
      ];
      
      for (const dir of directions) {
        const next = { x: current.x + dir.x, y: current.y + dir.y };
        if (next.x >= 0 && next.x < mazeSize && next.y >= 0 && next.y < mazeSize) {
          queue.push([...path, next]);
        }
      }
    }
    
    return [start, end]; // Fallback
  }
  
  function addJunctions() {
    junctions = [];
    const numJunctions = Math.min(Math.floor(score / 5) + 2, Math.floor(mazeSize / 2));
    
    // Find cells that are on the path to the station (not dead ends)
    const validJunctionCells = findValidJunctionCells();
    
    // Convert some valid cells to junctions and add dead ends
    for (let i = 0; i < numJunctions && i < validJunctionCells.length; i++) {
      const randomIndex = Math.floor(Math.random() * validJunctionCells.length);
      const cell = validJunctionCells.splice(randomIndex, 1)[0];
      
      // Convert this cell to a junction, keeping its existing connections
      maze[cell.y][cell.x].type = 'junction';
      junctions.push(cell);
      
      // Add a dead end branch from this junction
      addDeadEnd(cell);
    }
  }
  
  function findValidJunctionCells() {
    const validCells = [];
    
    // Find the main path from start to station
    const mainPath = findMainPath();
    
    // Only place junctions on cells that are part of the main path
    for (let y = 0; y < mazeSize; y++) {
      for (let x = 0; x < mazeSize; x++) {
        if (maze[y][x].connections.length > 0 && 
            maze[y][x].type !== 'start' && 
            maze[y][x].type !== 'station' &&
            isOnMainPath(x, y, mainPath)) {
          validCells.push({ x, y });
        }
      }
    }
    
    return validCells;
  }
  
  function findMainPath() {
    // Use A* or simple pathfinding to find the main path from start to station
    const visited = new Set();
    const queue = [{ x: startPosition.x, y: startPosition.y, path: [] }];
    
    while (queue.length > 0) {
      const current = queue.shift();
      const key = `${current.x},${current.y}`;
      
      if (visited.has(key)) continue;
      visited.add(key);
      
      const newPath = [...current.path, { x: current.x, y: current.y }];
      
      // Check if we reached the station
      if (current.x === stationPosition.x && current.y === stationPosition.y) {
        return newPath;
      }
      
      // Add adjacent connected cells to queue
      const cell = maze[current.y][current.x];
      const directions = [
        { x: 1, y: 0, dir: 'right' },
        { x: -1, y: 0, dir: 'left' },
        { x: 0, y: 1, dir: 'down' },
        { x: 0, y: -1, dir: 'up' }
      ];
      
      for (const dir of directions) {
        if (cell.connections.includes(dir.dir)) {
          const nextX = current.x + dir.x;
          const nextY = current.y + dir.y;
          
          if (nextX >= 0 && nextX < mazeSize && nextY >= 0 && nextY < mazeSize) {
            const nextCell = maze[nextY][nextX];
            const oppositeDir = dir.dir === 'right' ? 'left' : 
                               dir.dir === 'left' ? 'right' : 
                               dir.dir === 'down' ? 'up' : 'down';
            
            if (nextCell.connections.includes(oppositeDir)) {
              queue.push({ x: nextX, y: nextY, path: newPath });
            }
          }
        }
      }
    }
    
    return [];
  }
  
  function isOnMainPath(x, y, mainPath) {
    return mainPath.some(pos => pos.x === x && pos.y === y);
  }
  
  function canReachFromStart(startX, startY) {
    // Check if this cell can be reached from the start position
    const visited = new Set();
    const queue = [{ x: startPosition.x, y: startPosition.y }];
    
    while (queue.length > 0) {
      const current = queue.shift();
      const key = `${current.x},${current.y}`;
      
      if (visited.has(key)) continue;
      visited.add(key);
      
      // Check if we reached the target cell
      if (current.x === startX && current.y === startY) {
        return true;
      }
      
      // Add adjacent connected cells to queue
      const cell = maze[current.y][current.x];
      const directions = [
        { x: 1, y: 0, dir: 'right' },
        { x: -1, y: 0, dir: 'left' },
        { x: 0, y: 1, dir: 'down' },
        { x: 0, y: -1, dir: 'up' }
      ];
      
      for (const dir of directions) {
        if (cell.connections.includes(dir.dir)) {
          const nextX = current.x + dir.x;
          const nextY = current.y + dir.y;
          
          if (nextX >= 0 && nextX < mazeSize && nextY >= 0 && nextY < mazeSize) {
            const nextCell = maze[nextY][nextX];
            const oppositeDir = dir.dir === 'right' ? 'left' : 
                               dir.dir === 'left' ? 'right' : 
                               dir.dir === 'down' ? 'up' : 'down';
            
            if (nextCell.connections.includes(oppositeDir)) {
              queue.push({ x: nextX, y: nextY });
            }
          }
        }
      }
    }
    
    return false;
  }
  
  function canReachStation(startX, startY) {
    // Use a simple pathfinding to check if this cell can reach the station
    const visited = new Set();
    const queue = [{ x: startX, y: startY }];
    
    while (queue.length > 0) {
      const current = queue.shift();
      const key = `${current.x},${current.y}`;
      
      if (visited.has(key)) continue;
      visited.add(key);
      
      // Check if we reached the station
      if (current.x === stationPosition.x && current.y === stationPosition.y) {
        return true;
      }
      
      // Add adjacent connected cells to queue
      const cell = maze[current.y][current.x];
      const directions = [
        { x: 1, y: 0, dir: 'right' },
        { x: -1, y: 0, dir: 'left' },
        { x: 0, y: 1, dir: 'down' },
        { x: 0, y: -1, dir: 'up' }
      ];
      
      for (const dir of directions) {
        if (cell.connections.includes(dir.dir)) {
          const nextX = current.x + dir.x;
          const nextY = current.y + dir.y;
          
          if (nextX >= 0 && nextX < mazeSize && nextY >= 0 && nextY < mazeSize) {
            const nextCell = maze[nextY][nextX];
            const oppositeDir = dir.dir === 'right' ? 'left' : 
                               dir.dir === 'left' ? 'right' : 
                               dir.dir === 'down' ? 'up' : 'down';
            
            if (nextCell.connections.includes(oppositeDir)) {
              queue.push({ x: nextX, y: nextY });
            }
          }
        }
      }
    }
    
    return false;
  }
  
  function addDeadEnd(junction) {
    // Find available directions from the junction
    const availableDirections = [];
    const directions = [
      { x: 1, y: 0, dir: 'right', opposite: 'left' },
      { x: -1, y: 0, dir: 'left', opposite: 'right' },
      { x: 0, y: 1, dir: 'down', opposite: 'up' },
      { x: 0, y: -1, dir: 'up', opposite: 'down' }
    ];
    
    for (const dir of directions) {
      const nextX = junction.x + dir.x;
      const nextY = junction.y + dir.y;
      
      // Check if this direction is available (not already connected)
      if (nextX >= 0 && nextX < mazeSize && nextY >= 0 && nextY < mazeSize) {
        const nextCell = maze[nextY][nextX];
        if (nextCell.type === 'empty' && !nextCell.connections.includes(dir.opposite)) {
          availableDirections.push(dir);
        }
      }
    }
    
    if (availableDirections.length > 0) {
      // Choose a random available direction
      const chosenDir = availableDirections[Math.floor(Math.random() * availableDirections.length)];
      const deadEndLength = Math.floor(Math.random() * 3) + 2; // 2-4 cells long
      
      let currentX = junction.x;
      let currentY = junction.y;
      
      // Create the dead end path
      for (let i = 0; i < deadEndLength; i++) {
        const nextX = currentX + chosenDir.x;
        const nextY = currentY + chosenDir.y;
        
        if (nextX >= 0 && nextX < mazeSize && nextY >= 0 && nextY < mazeSize) {
          // Connect current cell to next cell
          maze[currentY][currentX].connections.push(chosenDir.dir);
          maze[nextY][nextX].connections.push(chosenDir.opposite);
          
          currentX = nextX;
          currentY = nextY;
          
          // Mark the last cell as a buffer (dead end)
          if (i === deadEndLength - 1) {
            maze[nextY][nextX].type = 'buffer';
          }
        } else {
          break;
        }
      }
    }
  }
  
  function renderMaze() {
    mazeContainer.style.gridTemplateColumns = `repeat(${mazeSize}, 40px)`;
    mazeContainer.style.gridTemplateRows = `repeat(${mazeSize}, 40px)`;
    mazeContainer.innerHTML = '';
    
    for (let y = 0; y < mazeSize; y++) {
      for (let x = 0; x < mazeSize; x++) {
        const cell = document.createElement('div');
        cell.style.cssText = `
          width: 40px;
          height: 40px;
          border: 1px solid #666;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5em;
          background: #444;
          position: relative;
        `;
        
        const cellData = maze[y][x];
        
        if (cellData.type === 'start') {
          cell.innerHTML = '🏭';
          cell.style.background = 'linear-gradient(135deg, #424242 0%, #616161 50%, #424242 100%)';
          cell.style.border = '3px solid #212121';
          cell.style.boxShadow = 'inset 0 0 10px rgba(0,0,0,0.5)';
          cell.style.fontSize = '1.8em';
        } else if (cellData.type === 'station') {
          cell.innerHTML = '🚉';
          cell.style.background = 'linear-gradient(135deg, #1565c0 0%, #1976d2 50%, #1565c0 100%)';
          cell.style.border = '2px solid #0d47a1';
          cell.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
          cell.style.fontSize = '1.8em';
        } else if (cellData.type === 'junction') {
          // Use track symbol but with special styling
          const trackSymbol = getTrackSymbol(cellData.connections);
          cell.innerHTML = trackSymbol;
          cell.style.background = 'linear-gradient(45deg, #ff9800 0%, #ffb74d 50%, #ff9800 100%)';
          cell.style.border = '2px solid #f57c00';
          cell.style.color = '#e65100';
          cell.style.fontWeight = 'bold';
          cell.style.boxShadow = '0 0 8px rgba(255,152,0,0.6)';
        } else if (cellData.type === 'buffer') {
          cell.innerHTML = '🛑';
          cell.style.background = 'linear-gradient(135deg, #b71c1c 0%, #d32f2f 50%, #b71c1c 100%)';
          cell.style.border = '2px solid #8e0000';
          cell.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
          cell.style.fontSize = '1.6em';
        } else if (cellData.type === 'tunnel') {
          cell.innerHTML = '🚇';
          cell.style.background = '#424242';
          cell.style.color = '#fff';
        } else if (cellData.type === 'bridge') {
          cell.innerHTML = '🌉';
          cell.style.background = '#8bc34a';
        } else if (cellData.connections.length > 0) {
          // Draw tracks
          cell.style.background = 'linear-gradient(45deg, #5d4037 0%, #8d6e63 50%, #5d4037 100%)';
          cell.style.border = '1px solid #3e2723';
          const symbol = getTrackSymbol(cellData.connections);
          cell.innerHTML = symbol;
          cell.style.color = '#3e2723';
          cell.style.fontWeight = 'bold';
          
          // Debug: log any dot symbols
          if (symbol === '•') {
            console.log('Dot cell found:', { x, y, connections: cellData.connections });
            // Treat dot cells as buffers to prevent getting stuck
            cellData.type = 'buffer';
            cell.innerHTML = '🛑';
            cell.style.background = '#d32f2f';
          }
        }
        
        mazeContainer.appendChild(cell);
      }
    }
  }
  
  function getTrackSymbol(connections) {
    // Count connections in each direction
    const hasLeft = connections.includes('left');
    const hasRight = connections.includes('right');
    const hasUp = connections.includes('up');
    const hasDown = connections.includes('down');
    
    // Straight tracks - use double lines for more realistic train tracks
    if (hasLeft && hasRight && !hasUp && !hasDown) {
      return '══';
    } else if (hasUp && hasDown && !hasLeft && !hasRight) {
      return '║';
    }
    
    // Corners - use double lines where possible
    if (hasRight && hasDown && !hasLeft && !hasUp) {
      return '╔';
    } else if (hasLeft && hasDown && !hasRight && !hasUp) {
      return '╗';
    } else if (hasRight && hasUp && !hasLeft && !hasDown) {
      return '╚';
    } else if (hasLeft && hasUp && !hasRight && !hasDown) {
      return '╝';
    }
    
    // Crossings (3 or 4 connections)
    const connectionCount = connections.length;
    if (connectionCount >= 3) {
      return '╬';
    }
    
    // Single connection (end of track)
    if (connectionCount === 1) {
      if (hasLeft) return '══';
      if (hasRight) return '══';
      if (hasUp) return '║';
      if (hasDown) return '║';
    }
    
    // Any other case (shouldn't happen, but just in case)
    return '══';
  }
  
  function updateTrainPosition() {
    const cellSize = 40;
    const gap = 2;
    const containerRect = mazeContainer.getBoundingClientRect();
    
    const x = containerRect.left + (currentPosition.x * (cellSize + gap)) + (cellSize / 2);
    const y = containerRect.top + (currentPosition.y * (cellSize + gap)) + (cellSize / 2);
    
    trainElement.style.left = `${x}px`;
    trainElement.style.top = `${y}px`;
    // Keep the transform for centering
    trainElement.style.transform = 'translate(-50%, -50%)';
  }
  
  function startDrag(e) {
    if (!gameActive) return;
    
    e.preventDefault();
    isDragging = true;
    trainElement.style.cursor = 'grabbing';
    trainElement.style.transform = 'translate(-50%, -50%) scale(1.1)';
    
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('touchmove', onDrag);
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);
  }
  
  function onDrag(e) {
    if (!isDragging) return;
    
    e.preventDefault();
    const rect = mazeContainer.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    const x = Math.floor((clientX - rect.left) / 42); // 40px cell + 2px gap
    const y = Math.floor((clientY - rect.top) / 42);
    
    if (x >= 0 && x < mazeSize && y >= 0 && y < mazeSize) {
      const newPosition = { x, y };
      
      // Check if move is valid (connected track) and not reversing
      const isValid = isValidMove(currentPosition, newPosition);
      const isReversingMove = isReversing(currentPosition, newPosition);
      
      if (isValid && !isReversingMove) {
        lastPosition = { ...currentPosition };
        currentPosition = newPosition;
        updateTrainPosition();
        
        // Check if we visited a new cell
        const cellKey = `${x},${y}`;
        if (!visitedCells.has(cellKey)) {
          visitedCells.add(cellKey);
          
          // Check if it's a junction
          if (maze[y][x].type === 'junction') {
            score++;
            scoreDisplay.textContent = `Score: ${score}`;
            showFeedback('+1 point for correct junction!', '#4caf50');
          }
          
          // Check if we hit a buffer (dead end)
          if (maze[y][x].type === 'buffer') {
            showFeedback('Game Over! You hit a dead end!', '#d32f2f');
            setTimeout(() => {
              endGame();
            }, 1000);
            return;
          }
          
          // Check if we reached the station
          if (x === stationPosition.x && y === stationPosition.y) {
            score++;
            scoreDisplay.textContent = `Score: ${score}`;
            showFeedback('+1 point for reaching the station!', '#4caf50');
            
            // Generate new maze
            setTimeout(() => {
              generateMaze();
              renderMaze();
            }, 1000);
          }
        }
      } else {
        // If invalid move, snap back to current position
        updateTrainPosition();
      }
    }
  }
  
  function isValidMove(from, to) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    
    // Must be adjacent
    if (Math.abs(dx) + Math.abs(dy) !== 1) {
      return false;
    }
    
    // Check if there's a track connection
    const fromCell = maze[from.y][from.x];
    const toCell = maze[to.y][to.x];
    
    if (dx === 1) { // Moving right
      return fromCell.connections.includes('right') && toCell.connections.includes('left');
    } else if (dx === -1) { // Moving left
      return fromCell.connections.includes('left') && toCell.connections.includes('right');
    } else if (dy === 1) { // Moving down
      return fromCell.connections.includes('down') && toCell.connections.includes('up');
    } else if (dy === -1) { // Moving up
      return fromCell.connections.includes('up') && toCell.connections.includes('down');
    }
    
    return false;
  }
  
  function isReversing(from, to) {
    // Check if this move would go back to the position we just came from
    return (to.x === lastPosition.x && to.y === lastPosition.y);
  }
  
  function endDrag() {
    isDragging = false;
    trainElement.style.cursor = 'grab';
    trainElement.style.transform = 'translate(-50%, -50%) scale(1)';
    
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('touchmove', onDrag);
    document.removeEventListener('mouseup', endDrag);
    document.removeEventListener('touchend', endDrag);
  }
  
  function showFeedback(message, color) {
    const feedback = document.createElement('div');
    feedback.textContent = message;
    feedback.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: ${color};
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      font-size: 1.2em;
      z-index: 20;
      animation: fadeInOut 1s ease-in-out;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(1); }
      }
    `;
    document.head.appendChild(style);
    
    container.appendChild(feedback);
    setTimeout(() => {
      container.removeChild(feedback);
      document.head.removeChild(style);
    }, 1000);
  }
  
  function endGame() {
    gameActive = false;
    
    const endScreen = document.createElement('div');
    endScreen.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.8);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 100;
    `;
    
    endScreen.innerHTML = `
      <h2 style="color: white; margin-bottom: 20px;">Game Over!</h2>
      <p style="color: white; font-size: 1.5em; margin-bottom: 30px;">Final Score: ${score}</p>
      <div style="display: flex; gap: 20px;">
        <button onclick="this.closest('div').remove(); location.reload();" style="
          padding: 15px 30px;
          font-size: 1.2em;
          background: #4caf50;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        ">🔄 Play Again</button>
        <button onclick="window.location.reload();" style="
          padding: 15px 30px;
          font-size: 1.2em;
          background: #2196f3;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        ">🏠 Back to Menu</button>
      </div>
    `;
    
    container.appendChild(endScreen);
  }
  
  // Initialize game
  generateMaze();
  renderMaze();
  
  // Position train after initial render
  setTimeout(() => {
    updateTrainPosition();
  }, 200);
  
  // Handle window resize
  window.addEventListener('resize', updateTrainPosition);
  
  // Return destroy function
  return function destroy() {
    window.removeEventListener('resize', updateTrainPosition);
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('touchmove', onDrag);
    document.removeEventListener('mouseup', endDrag);
    document.removeEventListener('touchend', endDrag);
  };
} 