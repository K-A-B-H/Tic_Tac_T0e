let currentPlayer = '';
let aiPlayer = '';
let gameMode = '';
let board = ['', '', '', '', '', '', '', '', ''];
let playerXScore = 0;
let playerOScore = 0;
let maxScore = 1;

// Event Listeners for menu buttons
document.getElementById('play-ai').addEventListener('click', () => {
    gameMode = 'ai';
    transitionToScreen('menu', 'max-score-selection');
});

document.getElementById('play-friend').addEventListener('click', () => {
    gameMode = 'friend';
    transitionToScreen('menu', 'max-score-selection');
});

document.getElementById('max-score-submit').addEventListener('click', () => {
    const input = document.getElementById('max-score-input');
    const value = parseInt(input.value);
    if (value >= 1 && value <= 10) {
        maxScore = value;
        if (gameMode === 'ai') {
            transitionToScreen('max-score-selection', 'side-selection');
        } else {
            currentPlayer = 'X';
            startGame();
        }
    } else {
        showResult('Please select a score between 1 and 10', false);
    }
});

document.getElementById('choose-x').addEventListener('click', () => {
    currentPlayer = 'X';
    aiPlayer = 'O';
    startGame();
});

document.getElementById('choose-o').addEventListener('click', () => {
    currentPlayer = 'O';
    aiPlayer = 'X';
    startGame();
});

function transitionToScreen(fromScreenId, toScreenId) {
    document.getElementById(fromScreenId).classList.add('screen-hidden');
    setTimeout(() => {
        document.getElementById(fromScreenId).classList.add('hidden');
        document.getElementById(toScreenId).classList.remove('hidden');
        setTimeout(() => {
            document.getElementById(toScreenId).classList.remove('screen-hidden');
        }, 25);
    }, 250);
}

function startGame() {
    resetBoard();
    updateScore();
    if (gameMode === 'ai') {
        transitionToScreen('side-selection', 'game');
        if (aiPlayer === 'X') {
            currentPlayer = 'X';
            setTimeout(aiMove, 500);
        } else {
            currentPlayer = 'X';
        }
    } else {
        transitionToScreen('max-score-selection', 'game');
        currentPlayer = 'X';
    }
}

document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', () => {
        const index = cell.getAttribute('data-index');
        if (board[index] === '') {
            makeMove(index);
        }
    });
});

function makeMove(index) {
    const cell = document.querySelector(`.cell[data-index='${index}']`);
    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add('filled');

    if (checkWin(currentPlayer)) {
        handleWin();
    } else if (board.every(cell => cell !== '')) {
        setTimeout(() => showResult('It\'s a draw!', true), 500);
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        if (gameMode === 'ai' && currentPlayer === aiPlayer) {
            setTimeout(aiMove, 500);
        }
    }
}

function handleWin() {
    const winningCells = getWinningCells(currentPlayer);
    winningCells.forEach(index => {
        document.querySelector(`.cell[data-index='${index}']`).classList.add('win');
    });

    if (currentPlayer === 'X') playerXScore++;
    else playerOScore++;
    updateScore();

    if (playerXScore >= maxScore || playerOScore >= maxScore) {
        const winner = gameMode === 'ai'
            ? (currentPlayer === aiPlayer ? 'AI' : 'You')
            : currentPlayer;
        setTimeout(() => showResult(`${winner} wins the match!`, true), 1000);
    } else {
        setTimeout(() => {
            showResult(`${currentPlayer} wins this round!`, true);
        }, 1000);
    }
}

document.getElementById('restart').addEventListener('click', () => {
    showResult('Game Restarted', true);
    resetBoard();
});

document.getElementById('end-game').addEventListener('click', endGame);

// Modal functionality
const modal = document.querySelector('.result-modal');
const overlay = document.querySelector('.modal-overlay');
const continueBtn = document.querySelector('.continue-btn');

continueBtn.addEventListener('click', () => {
    modal.classList.remove('show');
    overlay.classList.remove('show');

    const winningCells = document.querySelectorAll('.cell.win');
    winningCells.forEach(cell => cell.classList.remove('win'));

    if (playerXScore >= maxScore || playerOScore >= maxScore) {
        endGame();
    } else {
        resetBoard();
    }
});

function showResult(message, showContinue = true) {
    document.querySelector('.result-text').textContent = message;
    continueBtn.style.display = showContinue ? 'block' : 'none';
    modal.classList.add('show');
    overlay.classList.add('show');
}

function resetBoard() {
    board = ['', '', '', '', '', '', '', '', ''];
    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('filled', 'win');
    });
    if (gameMode === 'ai' && aiPlayer === 'X') {
        currentPlayer = 'X';
        setTimeout(aiMove, 300);
    } else {
        currentPlayer = 'X';
    }
}

function updateScore() {
    if (gameMode === 'friend') {
        document.getElementById('player-x-score').textContent = `X: ${playerXScore}`;
        document.getElementById('player-o-score').textContent = `O: ${playerOScore}`;
    } else {
        // For AI mode, use the initial player choice to determine score display
        const humanScore = aiPlayer === 'O' ? playerXScore : playerOScore;
        const aiScore = aiPlayer === 'O' ? playerOScore : playerXScore;
        document.getElementById('player-x-score').textContent = `You: ${humanScore}`;
        document.getElementById('player-o-score').textContent = `AI: ${aiScore}`;
    }
}

function endGame() {
    playerXScore = 0;
    playerOScore = 0;
    resetBoard();
    transitionToScreen('game', 'menu');
}

function aiMove() {
    const move = minimax(board, aiPlayer);
    makeMove(move.index);
}

function minimax(newBoard, player) {
    const availSpots = newBoard.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);

    if (checkWin('X')) return { score: -10 };
    if (checkWin('O')) return { score: 10 };
    if (availSpots.length === 0) return { score: 0 };

    const moves = [];
    for (let i = 0; i < availSpots.length; i++) {
        const move = {};
        move.index = availSpots[i];
        newBoard[availSpots[i]] = player;

        if (player === 'O') {
            const result = minimax(newBoard, 'X');
            move.score = result.score;
        } else {
            const result = minimax(newBoard, 'O');
            move.score = result.score;
        }

        newBoard[availSpots[i]] = '';
        moves.push(move);
    }

    let bestMove;
    if (player === 'O') {
        let bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

function checkWin(player) {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    return winningCombinations.some(combination =>
        combination.every(index => board[index] === player)
    );
}

function getWinningCells(player) {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const combination of winningCombinations) {
        if (combination.every(index => board[index] === player)) {
            return combination;
        }
    }
    return [];
}
