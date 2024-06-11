const cells = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const winningMessageElement = document.getElementById('winningMessage');
const winningMessageTextElement = document.getElementById('winningMessageText');
const restartButton = document.getElementById('restartButton');
const startButton = document.getElementById('startButton');
const popupRestartButton = document.getElementById('popupRestartButton');
const bgColorPicker = document.getElementById('bgColorPicker');
const bgImagePicker = document.getElementById('bgImagePicker');
let isXTurn = true;

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

startButton.addEventListener('click', () => {
    board.classList.remove('hidden');
    restartButton.classList.remove('hidden');
    startButton.classList.add('hidden');
    startGame();
});

restartButton.addEventListener('click', () => {
    winningMessageElement.classList.add('hidden');
    board.classList.remove('slide-out');
    board.classList.remove('hidden');
    startGame();
});

popupRestartButton.addEventListener('click', () => {
    winningMessageElement.classList.add('hidden');
    winningMessageElement.classList.remove('show');
    board.classList.remove('slide-out');
    board.classList.remove('hidden');
    startGame();
});

bgColorPicker.addEventListener('input', (e) => {
    document.body.style.background = e.target.value;
});

bgImagePicker.addEventListener('change', (e) => {
    const reader = new FileReader();
    reader.onload = () => {
        document.body.style.background = `url(${reader.result}) no-repeat center center fixed`;
        document.body.style.backgroundSize = 'cover';
    };
    reader.readAsDataURL(e.target.files[0]);
});

function startGame() {
    isXTurn = true;
    cells.forEach(cell => {
        cell.classList.remove('x');
        cell.classList.remove('o');
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    setBoardHoverClass();
}

function handleClick(e) {
    const cell = e.target;
    const currentClass = isXTurn ? 'x' : 'o';
    placeMark(cell, currentClass);
    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setBoardHoverClass();
    }
}

function endGame(draw) {
    if (draw) {
        winningMessageTextElement.innerText = 'Draw!';
    } else {
        winningMessageTextElement.innerText = `${isXTurn ? "X's" : "O's"} Wins!`;
    }
    winningMessageElement.classList.add('show');
    winningMessageElement.classList.remove('hidden');
    board.classList.add('slide-out');
    setTimeout(() => {
        board.classList.add('hidden');
    }, 1000); // Match the duration of the slide-out animation
}

function isDraw() {
    return [...cells].every(cell => {
        return cell.classList.contains('x') || cell.classList.contains('o');
    });
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
}

function swapTurns() {
    isXTurn = !isXTurn;
}

function setBoardHoverClass() {
    board.classList.remove('x');
    board.classList.remove('o');
    if (isXTurn) {
        board.classList.add('x');
    } else {
        board.classList.add('o');
    }
}

function checkWin(currentClass) {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return cells[index].classList.contains(currentClass);
        });
    });
}
