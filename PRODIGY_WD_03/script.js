 const board = document.getElementById("game-board");
    const statusText = document.getElementById("status");
    const restartBtn = document.getElementById("restart-btn");

    let cells = [];
    let currentPlayer = "X";
    let gameActive = true;
    let gameState = Array(9).fill("");

    const winConditions = [
      [0,1,2], [3,4,5], [6,7,8], // rows
      [0,3,6], [1,4,7], [2,5,8], // columns
      [0,4,8], [2,4,6]           // diagonals
    ];

    function handleClick(e) {
      const index = e.target.dataset.index;

      if (!gameActive || gameState[index] !== "") return;

      gameState[index] = currentPlayer;
      e.target.textContent = currentPlayer;

      const winCombo = checkWin();
      if (winCombo) {
        statusText.textContent = `${currentPlayer} wins! 🎉`;
        gameActive = false;
        highlightWinningCells(winCombo);
        return;
      }

      if (!gameState.includes("")) {
        statusText.textContent = "It's a draw!";
        gameActive = false;
        return;
      }

      currentPlayer = currentPlayer === "X" ? "O" : "X";
      statusText.textContent = `${currentPlayer}'s turn`;
    }

    function checkWin() {
      for (const condition of winConditions) {
        const [a, b, c] = condition;
        if (
          gameState[a] &&
          gameState[a] === gameState[b] &&
          gameState[a] === gameState[c]
        ) {
          return condition;
        }
      }
      return null;
    }

    function highlightWinningCells(indices) {
      indices.forEach(i => {
        document.querySelectorAll('.cell')[i].classList.add('win');
      });
    }

    function restartGame() {
      gameState.fill("");
      currentPlayer = "X";
      gameActive = true;
      statusText.textContent = `${currentPlayer}'s turn`;
      cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("win");
      });
    }

    function createBoard() {
      for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = i;
        cell.addEventListener("click", handleClick);
        cells.push(cell);
        board.appendChild(cell);
      }
      statusText.textContent = `${currentPlayer}'s turn`;
    }

    restartBtn.addEventListener("click", restartGame);
    createBoard();