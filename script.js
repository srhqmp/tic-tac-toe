const PlayerFactory = (function () {
  function createPlayer(type, symbol) {
    return {
      getType: () => type,
      getSymbol: () => symbol,
    };
  }
  return {
    createHuman: () => createPlayer("human", "X"),
    createComputer: () => createPlayer("computer", "O"),
  };
})();

const Gameboard = (function () {
  function createBoard() {
    let gameBoard = new Array(9).fill(null);
    let winner = null;

    const getBoardDisplay = () => {
      const row1 = gameBoard.slice(0, 3).map((item) => `|${item}|`);
      const row2 = gameBoard.slice(3, 6).map((item) => `|${item}|`);
      const row3 = gameBoard.slice(6).map((item) => `|${item}|`);
      return `${row1.join("")}\n${row2.join("")}\n${row3.join("")}\n`;
    };

    const allEqual = (arr) => arr.every((v) => v === arr[0]);

    return {
      resetBoard: () => (gameBoard = new Array(9).fill(null)),
      getBoard: () => gameBoard,
      placeMove: (index, player) => {
        if (index < 0 || index > gameBoard.length) {
          console.log("ERROR: Index is beyond game board index. (0-8)");
          return false;
        } else if (gameBoard[index] === null) {
          gameBoard[index] = player.getSymbol();
          console.log(getBoardDisplay());
          console.log(`Symbol ${player.getSymbol()} placed to index ${index}`);
          return true;
        } else {
          console.log("ERROR: Can't place to occupied index.");
          return false;
        }
      },
      checkWinner: () => {
        if (
          gameBoard[0] !== null &&
          gameBoard[1] !== null &&
          gameBoard[2] !== null &&
          allEqual([gameBoard[0], gameBoard[1], gameBoard[2]])
        ) {
          winner = gameBoard[0];
        } else if (
          gameBoard[3] !== null &&
          gameBoard[4] !== null &&
          gameBoard[5] !== null &&
          allEqual([gameBoard[3], gameBoard[4], gameBoard[5]])
        ) {
          winner = gameBoard[3];
        } else if (
          gameBoard[6] !== null &&
          gameBoard[7] !== null &&
          gameBoard[8] !== null &&
          allEqual([gameBoard[6], gameBoard[7], gameBoard[8]])
        ) {
          winner = gameBoard[6];
        } else if (
          gameBoard[0] !== null &&
          gameBoard[3] !== null &&
          gameBoard[6] !== null &&
          allEqual([gameBoard[0], gameBoard[3], gameBoard[6]])
        ) {
          winner = gameBoard[0];
        } else if (
          gameBoard[1] !== null &&
          gameBoard[4] !== null &&
          gameBoard[7] !== null &&
          allEqual([gameBoard[1], gameBoard[4], gameBoard[7]])
        ) {
          winner = gameBoard[1];
        } else if (
          gameBoard[2] !== null &&
          gameBoard[5] !== null &&
          gameBoard[8] !== null &&
          allEqual([gameBoard[2], gameBoard[5], gameBoard[8]])
        ) {
          winner = gameBoard[2];
        } else if (
          gameBoard[0] !== null &&
          gameBoard[4] !== null &&
          gameBoard[8] !== null &&
          allEqual([gameBoard[0], gameBoard[4], gameBoard[8]])
        ) {
          winner = gameBoard[0];
        } else if (
          gameBoard[2] !== null &&
          gameBoard[4] !== null &&
          gameBoard[6] !== null &&
          allEqual([gameBoard[2], gameBoard[4], gameBoard[6]])
        ) {
          winner = gameBoard[2];
        }
        return winner;
      },
    };
  }

  return {
    createBoard,
  };
})();

const TicTacToe = (function () {
  const createGame = () => {
    let winner = null;
    const gameBoard = Gameboard.createBoard();
    const player1 = PlayerFactory.createHuman();
    const player2 = PlayerFactory.createComputer();

    const generateComputerMove = () => {
      const index = Math.floor(Math.random() * 9);
      const success = gameBoard.placeMove(index, player2);
      if (!success) generateComputerMove();
    };

    return {
      getBoard: () => gameBoard.getBoard(),
      getWinner: () => {
        const winningMark = gameBoard.checkWinner();
        if (winningMark === "X") winner = player1.getType();
        if (winningMark === "O") winner = player2.getType();
        return winner;
      },
      placeMove: (index) => {
        if (winner === null) {
          const success = gameBoard.placeMove(index, player1);
          if (success) {
            generateComputerMove();
            winner = gameBoard.checkWinner();
          }
        }
      },
      resetGame: () => {
        winner = null;
        gameBoard.resetBoard();
      },
    };
  };

  return { createGame };
})();

const DisplayDOM = (function () {
  const createDisplay = (arr) => {
    return {
      renderGameboard: () => {
        const gameboard = document.getElementById("gameboard");
        console.log(arr);
        arr.forEach((el) => {
          const div = document.createElement("div");
          div.classList.add("board-item");
          gameboard.appendChild(div);
          div.innerText = "X";
        });
      },
    };
  };

  return { createDisplay };
})();

const ttt = TicTacToe.createGame();
const display = DisplayDOM.createDisplay(ttt.getBoard());
display.renderGameboard();

// do {
//   const index = prompt("Select number");
//   ttt.placeMove(index);
// } while (ttt.getWinner() === null);

const winner = ttt.getWinner();
console.log(`WINNER: ${winner}`);
