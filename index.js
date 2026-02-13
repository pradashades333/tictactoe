const gameBoard = (function () {

    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const placeMaker = (index, marker) => {
        if (board[index] === ""){
            board[index] = marker;
            return true;
        }
        else {
            return false;
        }
    };

    const printBoard = () => {
        console.log(board);
    };

    const checkWinner = () => {
        const winningCombos = [
            [0 , 1 , 2],
            [3 , 4 , 5],
            [6 , 7 , 8],
            [0 , 3 , 6],
            [1 , 4 , 7],
            [2 , 5 , 8],
            [0 , 4 , 8],
            [2 , 4 , 6]
        ];


       for (let combo of winningCombos) {
            if (board[combo[0]] !== "" &&
                board[combo[0]] === board[combo[1]] &&
                board[combo[1]] === board[combo[2]] ){
                return board[combo[0]]
            }
        }

        return null;
    }

    const checkTie = () => {
        for (let space of board) {
            if (space === "") {
                return false;
            }
        }
        return true;
    };

    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    }


    return {getBoard,placeMaker,printBoard, checkWinner, checkTie, resetBoard}
})();


function createPlayer (name, marker){
    const getName = () => name;
    const getMarker = () => marker;


    return{getName, getMarker}
}

const gameController = (function(){
    let players = [
        createPlayer("Player 1", "X"),
        createPlayer("Player 2", "O")
    ];

    let turnPlayer = players[0];

    const setPlayers = (name1, name2) => {
        players[0] = createPlayer(name1, "X");
        players[1] = createPlayer(name2, "O");
        turnPlayer = players[0];
    };

    const switchTurn = () => {
    if (turnPlayer === players[0]) {
        turnPlayer = players[1]
    } else{
        turnPlayer = players[0]
    }
    };


    const activePlayer = () => turnPlayer;

    const playRound = (index) => {
        let markerLocation = gameBoard.placeMaker(index, turnPlayer.getMarker())

        if (markerLocation){
            const winner = gameBoard.checkWinner()

            if (winner) {
                console.log(`Player ${winner} wins`);
                return;
            }

            if (gameBoard.checkTie()){
                console.log("Tie")
                return;
            }


            switchTurn();
        }

    }

    const resetGame = () => {
        gameBoard.resetBoard();
        turnPlayer = players[0];
    };

     return { activePlayer, playRound, switchTurn, resetGame, setPlayers }

})();


const displayController = (() => {
    const nameScreen = document.getElementById("name-screen")
    const gameContainer = document.getElementById("game-container")
    const boardDiv = document.getElementById("game-board")
    const turnDisplay = document.getElementById("turn-display")
    const restart = document.getElementById("restart-btn")
    const startBtn = document.getElementById("start-btn")
    const player1Input = document.getElementById("player1-name")
    const player2Input = document.getElementById("player2-name")

    const startGame = () => {
        const name1 = player1Input.value.trim() || "Player 1";
        const name2 = player2Input.value.trim() || "Player 2";
        gameController.setPlayers(name1, name2);

        nameScreen.classList.add("hidden");
        gameContainer.classList.remove("hidden");

        updateTurnDisplay();
    };

    startBtn.addEventListener('click', startGame);

    player1Input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') player2Input.focus();
    });
    player2Input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') startGame();
    });

    const renderBoard = () => {
        for (let i = 0; i <9; i++){
            const square = document.createElement('div');
            square.classList.add('square')
            square.dataset.index = i;
            boardDiv.appendChild(square);
        }

    }


    const addSquareListeners = () => {
        const squares = document.querySelectorAll(".square")

        squares.forEach(square => {
            square.addEventListener('click', () => {
                const squareIndex = Number(square.dataset.index)
                gameController.playRound(squareIndex)
                updateDisplay();
                updateTurnDisplay();
            })

        })
    }

    const updateDisplay = () => {
        const board = gameBoard.getBoard()
        const squares = document.querySelectorAll('.square');

        squares.forEach((square, index) => {
            square.textContent = board[index];
        });
    }

    const updateTurnDisplay = () => {
        const winner = gameBoard.checkWinner();
        const tie = gameBoard.checkTie();

        if (winner) {
            const winnerName = gameController.activePlayer().getName();
            turnDisplay.textContent = `${winnerName} wins!`;
        } else if (tie) {
            turnDisplay.textContent = "It's a tie!";
        } else {
            const currentName = gameController.activePlayer().getName();
            const currentMarker = gameController.activePlayer().getMarker();
            turnDisplay.textContent = `${currentName} (${currentMarker})'s turn`;
        }
    };



    restart.addEventListener('click', () => {
        gameController.resetGame();
        updateDisplay();
        updateTurnDisplay();
    });

    return{renderBoard, addSquareListeners, updateDisplay, updateTurnDisplay}

})();


displayController.renderBoard();
displayController.addSquareListeners();
