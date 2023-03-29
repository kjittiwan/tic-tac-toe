const modal = document.getElementById("modal");
const showModal = () => {
  modal.style.display = "block";
}
const hideModal = () => {
  modal.style.display = "none";
}
const Player = (sign) => {
  const getSign = () => sign;
  return {getSign};
}

const gameBoard = (() => {
  board = Array(9).fill(null);
  const getCell = (index) => {
    return board[index]
  }
  const placeSign = (index, sign) => {
    board[index] = sign;
  }
  const resetBoard = () => {
    for(let i=0; i<board.length; i++) {
      board[i] = "";
    }
  }
  return {getCell, placeSign, resetBoard};
})();

const displayController = (() => {
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    cell.addEventListener("click", (e) => {
      if (e.target.textContent !== "") return;
      gameController.playRound(parseInt(e.target.dataset.index))
      updateGameboard();
      if (gameController.checkWin(cells)){
        console.log('win');
        showModal();
      }
    })
  })
  const resetBtn = document.getElementById("resetBtn");
  resetBtn.addEventListener("click", () => {
    gameController.endGame();
    hideModal();
    updateGameboard();

  })
  const updateGameboard = () => { 
    for(let i=0; i<cells.length; i++) {
      cells[i].textContent = gameBoard.getCell(i);
    }
  }
})();

const gameController = (() => {
  let round = 1;
  const playerX = Player("X");
  const playerO = Player("O");
  const playRound = (cellIndex) => {
    gameBoard.placeSign(cellIndex, getCurrentPlayerSign());
    if(round === 9){
      console.log('draw')
      showModal();
    }
    round++ 
  }
  const getCurrentPlayerSign = () => {
    return round % 2 === 1 ? playerX.getSign() : playerO.getSign();
  }
  const checkWin = (cellElements) => {
    return winConditions.some(condition => {
      return condition.every((index) => {
        return cellElements[index].textContent == (playerX.getSign() || playerO.getSign());
      })
    })
  }
  const endGame = () => {
    gameBoard.resetBoard();
    round = 1;
  }
  return {playRound, checkWin, endGame};
})();
const winConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

