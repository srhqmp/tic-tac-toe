const PlayerFactory = (function () {
  function createPlayer(type, symbol, name) {
    return {
      getType: () => type,
      getSymbol: () => symbol,
      getName: () => name,
    };
  }

  return {
    createHuman: (name) => createPlayer("human", "X", name),
    createComputer: (name = "Computer") => createPlayer("computer", "O", name),
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
  const createGame = (playerName) => {
    let winner = null;
    let currentPlayer = "player1"; // Track whose turn it is
    const gameBoard = Gameboard.createBoard();
    const player1 = PlayerFactory.createHuman(playerName);
    const player2 = PlayerFactory.createComputer("Computer");

    const generateComputerMove = () => {
      const index = Math.floor(Math.random() * 9);
      const success = gameBoard.placeMove(index, player2);
      if (!success) generateComputerMove();
    };

    return {
      getBoard: () => gameBoard.getBoard(),
      getWinner: () => {
        const winningMark = gameBoard.checkWinner();
        if (winningMark === "X") winner = player1.getName();
        if (winningMark === "O") winner = player2.getName();
        return winner;
      },
      placeMove: (index) => {
        if (winner !== null) return; // Game already won

        let current;
        if (currentPlayer === "player1") {
          current = player1;
        } else {
          current = player2;
        }

        const success = gameBoard.placeMove(index, current);
        if (success) {
          winner = gameBoard.checkWinner();
          if (winner === null && currentPlayer === "player1") {
            currentPlayer = "player2";
            generateComputerMove();
            currentPlayer = "player1";
          }
        }
      },
      resetGame: () => {
        winner = null;
        currentPlayer = "player1"; // Reset the turn to player1
        gameBoard.resetBoard();
      },
    };
  };

  return { createGame };
})();

const DisplayDOM = (function () {
  let tiktactoe;
  let display;

  const createDisplay = (gameInstance) => {
    return {
      renderGameboard: () => {
        const gameboard = document.getElementById("gameboard");
        gameboard.innerHTML = "";

        const arr = gameInstance.getBoard();

        arr.forEach((el, index) => {
          const div = document.createElement("div");
          div.classList.add("board-item");
          div.ariaLabel = index;
          div.innerText = el !== null ? el : "";

          // Add event listener for click
          div.addEventListener("click", () => {
            if (gameInstance.getWinner() === null && arr[index] === null) {
              gameInstance.placeMove(index);
              updateDisplay(gameInstance);
            }
          });

          gameboard.appendChild(div);
        });
      },
    };
  };

  const updateDisplay = (gameInstance) => {
    display.renderGameboard();
    const winner = gameInstance.getWinner();
    const messageElement = document.getElementById("message");

    if (winner !== null) {
      messageElement.innerText = `The winner is: ${winner}`;
      document.getElementById("restart-game").style.display = "block"; // Show Restart Button
    } else {
      const currentTurn =
        gameInstance.getBoard().filter((el) => el === null).length % 2 === 0
          ? "player2"
          : "player1";
      messageElement.innerText =
        currentTurn === "player1" ? "Your turn" : "Computer's turn";
    }
  };

  const initGame = () => {
    const startButton = document.getElementById("start-game");
    const restartButton = document.getElementById("restart-game");

    startButton.addEventListener("click", () => {
      const playerName =
        document.getElementById("player1-name").value || "Anonymous";
      tiktactoe = TicTacToe.createGame(playerName);
      display = createDisplay(tiktactoe);
      display.renderGameboard();
      startButton.style.display = "none"; // Hide Start Button
      restartButton.style.display = "block"; // Show Restart Button
      document.getElementById("message").innerText = "Your turn"; // Initial message
    });

    restartButton.addEventListener("click", () => {
      const playerName =
        document.getElementById("player1-name").value || "Anonymous";
      tiktactoe.resetGame();
      tiktactoe = TicTacToe.createGame(playerName);
      display = createDisplay(tiktactoe);
      display.renderGameboard();
      document.getElementById("message").innerText = "Your turn"; // Reset message
    });
  };

  return {
    createDisplay,
    updateDisplay,
    initGame,
  };
})();

DisplayDOM.initGame();
