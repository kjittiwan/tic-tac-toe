const modal = document.getElementById("modal");
const modalText = document.getElementById("modalText");

//Define functions to show and hide modal
const showModal = () => {
  modal.style.display = "block";
};
const hideModal = () => {
  modal.style.display = "none";
};

// Define a Player factory function that returns an
// object with a method to get the sign (either "X" or "O")
const Player = (sign) => {
  const getSign = () => sign;
  return { getSign };
};

// Define a gameBoard module with methods to get the current value of a cell,
// place a sign on a cell, and reset the board
const gameBoard = (() => {
  // Create an array to represent the game board with 9 null values
  board = Array(9).fill(null);
  const getCell = (index) => {
    return board[index];
  };
  const placeSign = (index, sign) => {
    board[index] = sign;
  };
  const resetBoard = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = "";
    }
  };
  return { getCell, placeSign, resetBoard };
})();

// Define a displayController module with methods to update the game board,
// display the current player, handle clicks on cells, and reset the game
const displayController = (() => {
  const cells = document.querySelectorAll(".cell");
  const playerXText = document.querySelector(".playerX");
  const playerOText = document.querySelector(".playerO");

  cells.forEach((cell) => {
    cell.addEventListener("click", (e) => {
      // If the cell already has a sign, do nothing
      if (e.target.textContent !== "") return;
      gameController.playRound(parseInt(e.target.dataset.index));
      updateGameboard();
      displayCurrentPlayer();

      if (gameController.checkWin(cells, cell)) {
        noCurrentPlayer();
        updateModalText(cell);
        showModal();
      }
    });
  });

  // Define a method to display the current player (either X or O)
  const displayCurrentPlayer = () => {
    if (gameController.getCurrentPlayerSign() === "X") {
      playerXText.classList.add("current-player");
      playerOText.classList.remove("current-player");
    }
    if (gameController.getCurrentPlayerSign() === "O") {
      playerOText.classList.add("current-player");
      playerXText.classList.remove("current-player");
    }
  };

  // Define a method to remove the current player class from both player X and player O
  const noCurrentPlayer = () => {
    playerXText.classList.remove("current-player");
    playerOText.classList.remove("current-player");
  };

  const resetBtn = document.getElementById("resetBtn");
  resetBtn.addEventListener("click", () => {
    // End the game, hide the modal, and reset the game board and current player
    gameController.endGame();
    hideModal();
    modalText.textContent = "";
    updateGameboard();
    displayCurrentPlayer();
  });

  // Function to update the modal text with the winning player's sign
  const updateModalText = (cellClicked) => {
    modalText.textContent = `Player "${cellClicked.textContent}" Wins`;
  };

  // Function to update the game board by setting the text content of each cell
  // to the value in the array of each index.
  const updateGameboard = () => {
    for (let i = 0; i < cells.length; i++) {
      cells[i].textContent = gameBoard.getCell(i);
    }
  };
})();

// Function to keep track of the game state and provides functions to update it.
const gameController = (() => {
  let round = 1;
  const playerX = Player("X");
  const playerO = Player("O");

  //Function called when a player makes a move on the game board.
  const playRound = (cellIndex) => {
    // Places the current player's sign on the game board.
    gameBoard.placeSign(cellIndex, getCurrentPlayerSign());
    // If the game is a draw, show the modal with the message.
    if (checkDraw()) {
      showModal();
      modalText.textContent = "It's a Draw..";
    }
    round++;
  };

  const getCurrentPlayerSign = () => {
    return round % 2 === 1 ? playerX.getSign() : playerO.getSign();
  };

  const checkWin = (board, cell) => {
    return winConditions.some((condition) => {
      return condition.every((index) => {
        return board[index].textContent === cell.textContent;
      });
    });
  };

  const checkDraw = () => {
    return round === 9;
  };

  const endGame = () => {
    gameBoard.resetBoard();
    round = 1;
  };

   // Array of all the possible win conditions in the game.
  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  return { playRound, checkWin, checkDraw, endGame, getCurrentPlayerSign };
})();

