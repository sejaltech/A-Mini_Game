'use strict';


const MAZES = {
  easy: {
    time: 60,
    grid: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,1,0,0,0,0,0,0,0,1],
      [1,0,1,0,1,0,1,1,1,0,1,0,1],
      [1,0,1,0,0,0,0,0,1,0,1,0,1],
      [1,0,1,1,1,1,1,0,1,0,1,0,1],
      [1,0,0,0,0,0,1,0,0,0,1,0,1],
      [1,1,1,0,1,0,1,1,1,1,1,0,1],
      [1,0,0,0,1,0,0,0,0,0,0,0,1],
      [1,0,1,1,1,1,1,0,1,1,1,0,1],
      [1,0,0,0,0,0,0,0,1,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1],
    ],
    start: [1,1],
    goal:  [9,11],
  },
  medium: {
    time: 45,
    grid: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
      [1,0,1,1,1,0,1,0,1,1,1,1,1,0,1],
      [1,0,1,0,0,0,0,0,0,0,0,0,1,0,1],
      [1,0,1,0,1,1,1,1,1,0,1,0,1,0,1],
      [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
      [1,1,1,0,1,0,1,1,1,1,1,0,1,1,1],
      [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
      [1,0,1,1,1,0,1,0,1,1,1,1,1,0,1],
      [1,0,0,0,1,0,0,0,0,0,0,0,1,0,1],
      [1,1,1,0,1,1,1,0,1,1,1,0,1,0,1],
      [1,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
      [1,0,1,1,1,1,1,0,1,0,1,1,1,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ],
    start: [1,1],
    goal:  [13,13],
  },
  hard: {
    time: 30,
    grid: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1],
      [1,0,1,0,1,0,1,1,1,1,1,0,1,0,1,0,1],
      [1,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,1],
      [1,0,1,1,1,0,1,0,1,0,1,1,1,0,1,0,1],
      [1,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,1],
      [1,1,1,0,1,1,1,0,1,1,1,1,1,0,1,0,1],
      [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
      [1,0,1,1,1,0,1,0,1,0,1,0,1,1,1,0,1],
      [1,0,1,0,0,0,1,0,1,0,1,0,0,0,1,0,1],
      [1,0,1,0,1,1,1,0,1,0,1,1,1,0,1,0,1],
      [1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1],
      [1,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1],
      [1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
      [1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1],
      [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ],
    start: [1,1],
    goal:  [15,15],
  },
};


const state = {
  screen:      'start',       
  difficulty:  'easy',
  maze:        null,
  player:      { row: 0, col: 0 },
  goal:        { row: 0, col: 0 },
  score:       0,
  moves:       0,
  timeLeft:    60,
  totalTime:   60,
  timerID:     null,
  paused:      false,
  won:         false,
  highScore:   0,
  startTime:   0,
};


const $ = id => document.getElementById(id);
const screens = {
  start:    document.getElementById('start-screen'),
  game:     document.getElementById('game-screen'),
  gameover: document.getElementById('gameover-screen'),
};

const ui = {
  mazeContainer:  $('maze-container'),
  scoreDisplay:   $('score-display'),
  movesDisplay:   $('moves-display'),
  timerDisplay:   $('timer-display'),
  progressBar:    $('progress-bar'),
  finalScore:     $('final-score'),
  finalTime:      $('final-time'),
  finalMoves:     $('final-moves'),
  finalRating:    $('final-rating'),
  highScoreDisp:  $('high-score-display'),
  resultBadge:    $('result-badge'),
  resultIcon:     $('result-icon'),
  resultTitle:    $('result-title'),
  resultSub:      $('result-sub'),
  pauseOverlay:   $('pause-overlay'),
};

/* ═══════════════════════════════════════════════
   SCREEN TRANSITIONS
   ═══════════════════════════════════════════════ */
function showScreen(name) {
  const current = Object.values(screens).find(s => s.classList.contains('active'));
  if (current) {
    current.classList.add('exit');
    current.classList.remove('active');
    setTimeout(() => current.classList.remove('exit'), 600);
  }
  setTimeout(() => {
    screens[name].classList.add('active');
    state.screen = name;
  }, 200);
}

/* ═══════════════════════════════════════════════
   MAZE RENDERING
   ═══════════════════════════════════════════════ */
function renderMaze() {
  const { grid } = state.maze;
  const rows = grid.length;
  const cols = grid[0].length;

  ui.mazeContainer.style.gridTemplateColumns = `repeat(${cols}, var(--cell-size))`;
  ui.mazeContainer.style.gridTemplateRows    = `repeat(${rows}, var(--cell-size))`;
  ui.mazeContainer.innerHTML = '';

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.row = r;
      cell.dataset.col = c;

      if (grid[r][c] === 1) {
        cell.classList.add('wall');
      } else {
        cell.classList.add('path');
      }

      if (r === state.player.row && c === state.player.col) cell.classList.add('player');
      if (r === state.goal.row   && c === state.goal.col)   cell.classList.add('goal');

      ui.mazeContainer.appendChild(cell);
    }
  }
}

function getCell(row, col) {
  return ui.mazeContainer.querySelector(`[data-row="${row}"][data-col="${col}"]`);
}

function updatePlayerVisual(fromRow, fromCol) {
  const prevCell = getCell(fromRow, fromCol);
  const nextCell = getCell(state.player.row, state.player.col);

  if (prevCell) {
    prevCell.classList.remove('player');
    prevCell.classList.add('visited');
  }
  if (nextCell) {
    nextCell.classList.add('player', 'player-enter');
    setTimeout(() => nextCell.classList.remove('player-enter'), 150);
  }
}

const DIRS = {
  ArrowUp:    [-1,  0],
  ArrowDown:  [ 1,  0],
  ArrowLeft:  [ 0, -1],
  ArrowRight: [ 0,  1],
  w: [-1,  0], W: [-1,  0],
  s: [ 1,  0], S: [ 1,  0],
  a: [ 0, -1], A: [ 0, -1],
  d: [ 0,  1], D: [ 0,  1],
};

function tryMove(key) {
  if (!DIRS[key]) return;
  if (state.paused || state.screen !== 'game') return;

  const [dr, dc] = DIRS[key];
  const newRow = state.player.row + dr;
  const newCol = state.player.col + dc;
  const grid = state.maze.grid;

  // Boundary and wall check
  if (
    newRow < 0 || newRow >= grid.length ||
    newCol < 0 || newCol >= grid[0].length ||
    grid[newRow][newCol] === 1
  ) {

    ui.mazeContainer.classList.add('shake');
    setTimeout(() => ui.mazeContainer.classList.remove('shake'), 300);
    return;
  }

  const fromRow = state.player.row;
  const fromCol = state.player.col;
  state.player.row = newRow;
  state.player.col = newCol;
  state.moves++;

  state.score = Math.max(0, state.score - 1);

  updatePlayerVisual(fromRow, fromCol);
  updateHUD();

  if (newRow === state.goal.row && newCol === state.goal.col) {
    onWin();
  }
}

function startTimer() {
  clearInterval(state.timerID);
  state.timerID = setInterval(() => {
    if (state.paused) return;
    state.timeLeft--;
    updateHUD();
    if (state.timeLeft <= 0) {
      clearInterval(state.timerID);
      onLose();
    }
  }, 1000);
}


function updateHUD() {

  ui.scoreDisplay.textContent = state.score;


  const prevMoves = parseInt(ui.movesDisplay.textContent);
  ui.movesDisplay.textContent = state.moves;
  if (state.moves !== prevMoves) {
    ui.movesDisplay.classList.remove('pop');
    void ui.movesDisplay.offsetWidth;
    ui.movesDisplay.classList.add('pop');
  }


  ui.timerDisplay.textContent = state.timeLeft;
  const pct = (state.timeLeft / state.totalTime) * 100;
  ui.progressBar.style.width = `${pct}%`;

  if (state.timeLeft <= 10) {
    ui.timerDisplay.classList.add('danger');
    ui.progressBar.classList.add('danger');
  } else {
    ui.timerDisplay.classList.remove('danger');
    ui.progressBar.classList.remove('danger');
  }
}

function calcScore() {
  const timeTaken = state.totalTime - state.timeLeft;
  const timeBonus = state.timeLeft * 10;
  const movesPenalty = state.moves * 2;
  const diffBonus = { easy: 0, medium: 500, hard: 1200 }[state.difficulty];
  return Math.max(0, timeBonus - movesPenalty + diffBonus + 200);
}

function getRating(score) {
  if (score >= 800) return '★★★';
  if (score >= 400) return '★★☆';
  return '★☆☆';
}


function onWin() {
  clearInterval(state.timerID);
  state.won = true;


  const goalCell = getCell(state.goal.row, state.goal.col);
  if (goalCell) goalCell.classList.add('flash-win');


  state.score = calcScore();
  if (state.score > state.highScore) state.highScore = state.score;

  const timeTaken = state.totalTime - state.timeLeft;

  spawnConfetti();

  setTimeout(() => {
    populateGameOver(true, timeTaken);
    showScreen('gameover');
  }, 700);
}

function onLose() {
  state.won = false;
  const timeTaken = state.totalTime;

  ui.mazeContainer.classList.add('shake');

  setTimeout(() => {
    populateGameOver(false, timeTaken);
    showScreen('gameover');
  }, 500);
}

function populateGameOver(won, timeTaken) {
  if (won) {
    ui.resultBadge.classList.remove('fail');
    ui.resultIcon.textContent = '✓';
    ui.resultTitle.textContent = 'ESCAPED!';
    ui.resultTitle.classList.remove('fail');
    ui.resultSub.textContent = 'You conquered the labyrinth.';
  } else {
    ui.resultBadge.classList.add('fail');
    ui.resultIcon.textContent = '✕';
    ui.resultTitle.textContent = 'TRAPPED.';
    ui.resultTitle.classList.add('fail');
    ui.resultSub.textContent = 'The maze consumed you.';
    state.score = 0;
  }

  ui.finalScore.textContent = state.score;
  ui.finalTime.textContent  = `${timeTaken}s`;
  ui.finalMoves.textContent = state.moves;
  ui.finalRating.textContent = won ? getRating(state.score) : '☆☆☆';
  ui.highScoreDisp.textContent = state.highScore;
}


function spawnConfetti() {
  const colors = ['#00e5ff','#ff3cac','#ffe033','#7fff00','#ff6b35'];
  for (let i = 0; i < 60; i++) {
    const el = document.createElement('div');
    el.className = 'confetti';
    el.style.left = `${Math.random() * 100}vw`;
    el.style.background = colors[Math.floor(Math.random() * colors.length)];
    el.style.width  = `${6 + Math.random() * 6}px`;
    el.style.height = `${6 + Math.random() * 6}px`;
    el.style.animationDuration = `${1.5 + Math.random() * 2}s`;
    el.style.animationDelay   = `${Math.random() * 0.5}s`;
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }
}

function initGame() {
  const config = MAZES[state.difficulty];
  state.maze     = config;
  state.player   = { row: config.start[0], col: config.start[1] };
  state.goal     = { row: config.goal[0],  col: config.goal[1] };
  state.timeLeft = config.time;
  state.totalTime= config.time;
  state.moves    = 0;
  state.score    = 0;
  state.won      = false;
  state.paused   = false;

  ui.pauseOverlay.classList.add('hidden');

  renderMaze();
  updateHUD();
  startTimer();
}

function restartGame() {
  clearInterval(state.timerID);
  showScreen('game');
  setTimeout(() => initGame(), 300);
}

function togglePause() {
  state.paused = !state.paused;
  ui.pauseOverlay.classList.toggle('hidden', !state.paused);
  document.getElementById('pause-btn').textContent = state.paused ? '▶ RESUME' : '⏸ PAUSE';
}


document.addEventListener('keydown', e => {

  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) {
    e.preventDefault();
  }

  if (e.key === 'Escape' && state.screen === 'game') togglePause();
  if (e.key === ' '     && state.screen === 'game') togglePause();

  tryMove(e.key);
});


document.querySelectorAll('.diff-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.diff-btn').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');
    state.difficulty = btn.dataset.level;
  });
});


document.getElementById('start-btn').addEventListener('click', () => {
  showScreen('game');
  setTimeout(() => initGame(), 350);
});


document.getElementById('pause-btn').addEventListener('click', togglePause);
document.getElementById('resume-btn').addEventListener('click', () => {
  state.paused = false;
  ui.pauseOverlay.classList.add('hidden');
  document.getElementById('pause-btn').textContent = '⏸ PAUSE';
});


document.getElementById('quit-btn').addEventListener('click', () => {
  clearInterval(state.timerID);
  state.paused = false;
  showScreen('start');
});


document.getElementById('replay-btn').addEventListener('click', restartGame);


document.getElementById('menu-btn').addEventListener('click', () => {
  clearInterval(state.timerID);
  showScreen('start');
});


let touchStart = null;

document.addEventListener('touchstart', e => {
  touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
}, { passive: true });

document.addEventListener('touchend', e => {
  if (!touchStart) return;
  const dx = e.changedTouches[0].clientX - touchStart.x;
  const dy = e.changedTouches[0].clientY - touchStart.y;
  const adx = Math.abs(dx), ady = Math.abs(dy);

  if (Math.max(adx, ady) < 20) return; 

  if (adx > ady) {
    tryMove(dx > 0 ? 'ArrowRight' : 'ArrowLeft');
  } else {
    tryMove(dy > 0 ? 'ArrowDown' : 'ArrowUp');
  }
  touchStart = null;
}, { passive: true });

try {
  const saved = localStorage.getItem('labyrinth_hs');
  if (saved) state.highScore = parseInt(saved) || 0;
} catch (_) {}

const _origOnWin = onWin;
window.addEventListener('beforeunload', () => {
  try { localStorage.setItem('labyrinth_hs', state.highScore); } catch (_) {}
});
