const PlayerFactory = (function () {
  function createPlayer(type, symbol, name) {
    return {
      getType: () => type,
      getSymbol: () => symbol,
      getName: () => name,
    };
  }

  return {
    createPlayer: (name, symbol) => createPlayer("human", symbol, name),
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

    const checkTie = () => {
      return gameBoard.every((cell) => cell !== null) && winner === null;
    };

    return {
      resetBoard: () => {
        gameBoard = new Array(9).fill(null);
        winner = null;
      },
      getBoard: () => gameBoard,
      placeMove: (index, player) => {
        if (index < 0 || index >= gameBoard.length) {
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

        for (const [a, b, c] of winConditions) {
          if (
            gameBoard[a] !== null &&
            gameBoard[a] === gameBoard[b] &&
            gameBoard[a] === gameBoard[c]
          ) {
            winner = gameBoard[a];
            return winner;
          }
        }

        if (checkTie()) {
          winner = "Tie";
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
  const createGame = (player1Name, player2Name) => {
    let winner = null;
    let currentPlayer = "player1"; // Track whose turn it is
    const gameBoard = Gameboard.createBoard();
    const player1 = PlayerFactory.createPlayer(player1Name, "X");
    const player2 = PlayerFactory.createPlayer(player2Name, "O");

    return {
      getBoard: () => gameBoard.getBoard(),
      getWinner: () => {
        const winningMark = gameBoard.checkWinner();
        if (winningMark === "X") winner = player1.getName();
        if (winningMark === "O") winner = player2.getName();
        if (winningMark === "Tie") winner = "Tie";
        return winner;
      },
      getCurrentPlayerName: () =>
        currentPlayer === "player1" ? player1.getName() : player2.getName(),
      placeMove: (index) => {
        if (winner !== null) return; // Game already won or tied

        let current;
        if (currentPlayer === "player1") {
          current = player1;
        } else {
          current = player2;
        }

        const success = gameBoard.placeMove(index, current);
        if (success) {
          winner = gameBoard.checkWinner();
          if (winner === null) {
            currentPlayer = currentPlayer === "player1" ? "player2" : "player1";
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
        gameboard.style.display = "grid";
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
    const currentPlayerName = gameInstance.getCurrentPlayerName();

    if (winner !== null) {
      if (winner === "Tie") {
        messageElement.innerText = "The game is a tie!";
      } else {
        messageElement.innerText = `The winner is: ${winner}`;
      }
      document.getElementById("restart-game").style.display = "block"; // Show Restart Button
    } else {
      messageElement.innerText = `${currentPlayerName}'s turn`;
    }
  };

  const initGame = () => {
    const startButton = document.getElementById("start-game");
    const restartButton = document.getElementById("restart-game");

    startButton.addEventListener("click", () => {
      const player1Name =
        document.getElementById("player-name-1").value || "Player 1";
      const player2Name =
        document.getElementById("player-name-2").value || "Player 2";
      tiktactoe = TicTacToe.createGame(player1Name, player2Name);
      display = createDisplay(tiktactoe);
      display.renderGameboard();
      startButton.style.display = "none"; // Hide Start Button
      restartButton.style.display = "block"; // Show Restart Button
      document.getElementById("message").innerText = `${player1Name}'s turn`; // Initial message
    });

    restartButton.addEventListener("click", () => {
      const player1Name =
        document.getElementById("player-name-1").value || "Player 1";
      const player2Name =
        document.getElementById("player-name-2").value || "Player 2";
      tiktactoe.resetGame();
      tiktactoe = TicTacToe.createGame(player1Name, player2Name);
      display = createDisplay(tiktactoe);
      display.renderGameboard();
      document.getElementById("message").innerText = `${player1Name}'s turn`; // Reset message
    });
  };

  return {
    createDisplay,
    updateDisplay,
    initGame,
  };
})();

DisplayDOM.initGame();
