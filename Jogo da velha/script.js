const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset-button');
const modeToggle = document.getElementById('mode-toggle');
let currentPlayer = 'X';
let board = Array(9).fill(null);
let isSinglePlayer = false; // False: Dois Jogadores | True: Contra IA
let xWins = 0;
let oWins = 0;
let draws = 0;
function checkWinner() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Linhas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colunas
        [0, 4, 8], [2, 4, 6]             // Diagonais
    ];

    for (const [a, b, c] of winningCombinations) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            // Destacar as células que formam a linha vencedora
            cells[a].classList.add('winning-cell');
            cells[b].classList.add('winning-cell');
            cells[c].classList.add('winning-cell');

            // Atualiza os contadores de vitória
            if (board[a] === 'X') {
                xWins++;
                document.getElementById('x-wins').textContent = xWins;
            } else {
                oWins++;
                document.getElementById('o-wins').textContent = oWins;
            }

            alert(`Jogador ${board[a]} venceu!`);
            return board[a];
        }
    }

    // Verificar se há empate
    if (!board.includes(null)) {
        draws++;
        document.getElementById('draws').textContent = draws;
        alert("Empate!");
        return 'Draw';
    }

    return null;
}


function handleCellClick(event) {
    const cell = event.target;
    const index = cell.dataset.index;

    if (!board[index]) {
        board[index] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add('taken');

        if (checkWinner()) {
            cells.forEach(cell => cell.removeEventListener('click', handleCellClick));
            return;
        }

        if (isSinglePlayer && currentPlayer === 'X') {
            currentPlayer = 'O';
            setTimeout(makeAIMove, 500); // Pequeno atraso para simular "pensamento"
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
    }
}

function makeAIMove() {
    // Função para verificar se a IA ou o jogador pode vencer
    function findWinningMove(player) {
        for (const [a, b, c] of [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Linhas
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colunas
            [0, 4, 8], [2, 4, 6]             // Diagonais
        ]) {
            if (
                board[a] === player && board[b] === player && board[c] === null
            ) return c;
            if (
                board[a] === player && board[c] === player && board[b] === null
            ) return b;
            if (
                board[b] === player && board[c] === player && board[a] === null
            ) return a;
        }
        return null;
    }

    // Passo 1: Verificar se a IA pode vencer
    let move = findWinningMove('O');
    if (move === null) {
        // Passo 2: Verificar se precisa bloquear o jogador
        move = findWinningMove('X');
    }
    if (move === null) {
        // Passo 3: Jogar no centro, se disponível
        if (board[4] === null) {
            move = 4;
        }
    }
    if (move === null) {
        // Passo 4: Jogar em um canto, se disponível
        const corners = [0, 2, 6, 8].filter(index => board[index] === null);
        if (corners.length > 0) {
            move = corners[Math.floor(Math.random() * corners.length)];
        }
    }
    if (move === null) {
        // Passo 5: Jogar em qualquer célula restante
        const emptyCells = board.map((value, index) => (value === null ? index : null)).filter(index => index !== null);
        move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    // Realizar a jogada
    if (move !== null) {
        board[move] = currentPlayer;
        const cell = cells[move];
        cell.textContent = currentPlayer;
        cell.classList.add('taken');

        if (checkWinner()) {
            cells.forEach(cell => cell.removeEventListener('click', handleCellClick));
            return;
        }

        currentPlayer = 'X'; // Alterna para o jogador humano
    }
}

function resetGame() {
    board.fill(null); // Reinicia o estado lógico do tabuleiro
    cells.forEach(cell => {
        cell.textContent = ''; // Remove o X ou O de cada célula
        cell.classList.remove('taken', 'winning-cell'); // Remove as classes 'taken' e 'winning-cell'
        cell.addEventListener('click', handleCellClick, { once: true }); // Reativa o clique na célula
    });
    currentPlayer = 'X'; // Define o jogador inicial como X
}


function toggleMode() {
    isSinglePlayer = !isSinglePlayer;
    modeToggle.textContent = isSinglePlayer ? 'Modo: Contra IA' : 'Modo: Dois Jogadores';
    resetGame();
}

// Eventos
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
modeToggle.addEventListener('click', toggleMode);
