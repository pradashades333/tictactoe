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
    const players = [
        createPlayer("Bob", "X"),
        createPlayer("James", "O")
    ]

    let turnPlayer = players[0];


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

     return { activePlayer, playRound, switchTurn, resetGame }

})();


const displayController = (() => {
    const boardDiv = document.getElementById("game-board")
    const turnDisplay = document.getElementById("turn-display")
    const restart = document.getElementById("restart-btn")

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
            turnDisplay.textContent = `Player ${winner} wins!`;
        } else if (tie) {
            turnDisplay.textContent = "It's a tie!";
        } else {
            const currentPlayer = gameController.activePlayer().getMarker();
            turnDisplay.textContent = `Player ${currentPlayer}'s turn`;
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
displayController.updateTurnDisplay();