


//Manipulating DOM
const htmlBoard = document.querySelector('.board');
for(let i = 0; i < 9; i++)
{
    const cell  = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    htmlBoard.appendChild(cell);
}


//GAMEBOARD MODULE
// it will contain the game board and the functions to manipulate it
const Gameboard = (() => {

    let board = [
        '', '', '',
        '', '', '',
        '', '', '',
    ];

    const getBoard = () => board;

    const setCell = (index, marker) => {
        console.log("Board[index] is ", board[index] )
        if(board[index] === "")
        {
            console.log(`We placed ${marker} at ${index}`);
            board[index] = marker;
            renderBoard(getBoard());
            return true;
        }
        console.log("HOWEVER CANT PLACE");
        return false;
    }
   
    //here we are clearing the board
    const clearBoard = () => {
        board =  [
            '', '', '',
            '', '', '',
            '', '', '',
        ]
    }
    const winPatterns = [
        [0,1,2], [3,4,5], [6,7,8], 
        [0,3,6], [1,4,7], [2,5,8], 
        [0,4,8], [2,4,6]           
      ];
    const getWinPatterns = () => winPatterns;

    return {getBoard, setCell, clearBoard, getWinPatterns}
})();


//Create player function
function createPlayer(name, marker) {   
    return {
        name: name,
        marker: marker,
    }
}
//Render Function
function renderBoard() {
    const boardState = Gameboard.getBoard();
    const cells = document.querySelectorAll('.cell');
  
    cells.forEach((cell, index) => {
      cell.textContent = boardState[index];  // will show 'X', 'O', or ''
      cell.style.color = boardState[index] === 'X' ? '#00ffff' : '#ff00ff'; 
    });
  }
function chatMessage(text) {
    const chatBox = document.querySelector('.chat');
    const message = document.createElement('p');

    chatBox.appendChild(message);  // ✅ append to the chat container

    message.textContent = text;
    chatBox.scrollTop = chatBox.scrollHeight;

}
function restartGameFlow() {
    chatMessage("Restarting the Game");
    // Clear the board array
    Gameboard.clearBoard();
    // Re-render empty board
    renderBoard();

    // Reset the GameController
    GameController.restartGame();

    // ✅ Reset the name fields
    document.querySelector('#name1').value = "";
    document.querySelector('#name2').value = "";

    // ✅ Change button text back to Play
    playButton.textContent = "Play";
    playButton.type = "submit";

    // ✅ Remove this restart event so it doesn’t stack
    playButton.removeEventListener('click', restartGameFlow);
}


//GAMECONTROLER MODULE
const GameController = (() => {

    let player1 = null;
    let player2 = null;

    let currentPlayer = null;
    let gameCount = 0;
    let isPlaying = false;

    // ✅ initialize the game with players
    const startGame = (p1, p2) => {
        player1 = p1;
        player2 = p2;
        currentPlayer = player1;  // Player 1 goes first
        isPlaying = true;
        gameCount = 0;
        chatMessage("The game has started! Good Luck!");
    };

    const getCurrentPlayer = () => currentPlayer;
    const getGameStatus = () => isPlaying;
    const getGameCount = () => gameCount;

    const playRound = (index) => {
        isPlaying = true;
        const board = Gameboard.getBoard();

        chatMessage(`--- Round ${gameCount + 1} ---`);
        chatMessage(`It's ${currentPlayer.name}'s turn (${currentPlayer.marker})`);
        if(board[index] !== "")
        {
            
            chatMessage(`❌ Cell ${index} is already taken! Try again.`);
            return;
        }
        if(Gameboard.setCell(index, currentPlayer.marker))
        {
            renderBoard();
            chatMessage(`✅ ${currentPlayer.name} placed ${currentPlayer.marker} on cell ${index}`);
        }
        gameCount++;
        if(gameCount >= 5)
        {
            if(checkWinner(Gameboard.getBoard(), currentPlayer.marker))
            {
                return;
            }
            
        }
        
        switchPlayer();
        chatMessage(`📢 Next: ${currentPlayer.name}'s turn`);
        
    }

    //Switches player in between turns
    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    }
    //Checks winner or tie
    const checkWinner = (board,marker) => {

        for(let pattern of Gameboard.getWinPatterns())
        {
            const[a,b,c] = pattern;

            if(board[a] === marker && board[b] === marker && board[c] === marker)
            {
                chatMessage(`${currentPlayer.name} wins!`);
                restartGame();
                return;
            }
        }
        if(gameCount === 9)
        {
            chatMessage(`It's a tie!`);
            restartGame();
        }
    }

    //Restarts the game
    const restartGame = () => {
        console.log("We are restarting the game");
        gameCount = 0;
        currentPlayer = player1;
        isPlaying = false;
        Gameboard.clearBoard();
    }

    return {startGame, getCurrentPlayer, getGameCount, getGameStatus, playRound, restartGame };
})();

//CONNECTING DOM, ONCLICK EVENT handlers

const form = document.querySelector('.names');
const playButton = document.querySelector('#play-btn');
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name1 = document.querySelector('#name1').value.trim();
    const name2 = document.querySelector('#name2').value.trim();

    const player1 = createPlayer(name1, 'X');
    const player2 = createPlayer(name2, 'O');

    console.log("Player 1:", player1.name);
    console.log("Player 2:", player2.name);

    GameController.startGame(player1, player2);

    playButton.textContent = "Restart";
    playButton.type = "Button";

    playButton.addEventListener('click', restartGameFlow);

});

const cells = document.querySelectorAll('.cell');


cells.forEach(cell => {
    cell.addEventListener("click", (event) => {
        if (GameController.getGameStatus()) {
            const index = event.target.dataset.index;
            GameController.playRound(index);
        } else {
            chatMessage("Not in game yet. Press Play to start!");
        }
    });
});









