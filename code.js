/*
gameboard
- return state of board
- updates state of board
*/
const gameBoard = (()=>{

    let board = ['','','','','','','','',''];
    const board_state = () => board;
    const update_board = (cell, symbol) => board[cell] = symbol;
    const board_reset = () => {
        board = ['','','','','','','','',''];
        console.log(...board);
    }

    return {
        board_state, update_board, board_reset
    };

})();

/**
 Player
 - makes decision
 - passes decision to gameController
 */
 const Player = () =>{
    
    let name = '';
    const setName = (player_name) => name = player_name;
    const getName = () => name;

    let cell = -1;
    const setCell = (board_cell) => {
        cell = board_cell - 1;
    }

    const getCell = () => cell;
    return {getCell, setCell, getName, setName};
}

 /*
displayController
- gets data from gameboard
- displays turn, result, cells clicked, and the name screen and gameboard
*/
const displayController = (()=>{

    const scoreboard = document.querySelector('#scoreboard');

    const displayTurn = (player,symbol) =>{
        scoreboard.textContent = `${player}'s turn (${symbol})`;
    }

    const displayRes = (player,res) =>{

        if(!res) scoreboard.textContent = 'Draw';
        else scoreboard.textContent = `${player} wins!!`;

    }

    const displayCell = (cell,symbol) =>{
        cell.textContent = symbol;
    }

    const displayStartScreen = () =>{
        const refresh_button = document.querySelector('#refresh');
        const form = document.querySelector('form');
        const gameBoard = document.querySelector('#gameboard');
        form.style.visibility = 'collapse';
        gameBoard.style.visibility = 'visible';
        scoreboard.style.visibility = 'visible';
        refresh_button.style.visibility = 'visible';
    }

    return {displayTurn, displayRes, displayCell, displayStartScreen};
})();


/* gameController

- takes input from players
, if valid, passes to gameBoard
- calls endCon
*/
const gameController = (()=>{

    let p1='',p2='';
    let p1_symbol = '\u274C', p2_symbol = '\u25EF';
    let turn = 0;
    let state = ['','','','','','','','',''];
    let res = false;
    let cell,player,symbol;
    const board = document.querySelectorAll('.cell');

    const player1 = Player();
    const player2 = Player();

    /* take the name of the players,if valid, call gamelogic and start game*/
    const name_submission = document.querySelector('input[type="submit"]');
    name_submission.addEventListener('click', (e)=>{
        e.preventDefault();
        p1 = document.querySelector("#p1").value;
        p2 = document.querySelector("#p2").value;
        if(p1 != '' && p2!='')
        {
            displayController.displayStartScreen();
            player1.setName(p1);
            player2.setName(p2);
            p1 = player1.getName();
            p2 = player2.getName();
            player = p1;
            symbol = p1_symbol;
            displayController.displayTurn(player,symbol);
        }  
    })

    /* the conditions to win the game */
    const winCon = (() =>{

        const rowCheck = (cell) =>{

            if(cell == 0 || cell == 3 || cell == 6)
            {
                return state[cell] == state[cell+1] && state[cell] == state[cell+2];
            }

            if(cell == 1 || cell == 4 || cell == 7)
            {
                return state[cell] == state[cell-1] && state[cell] == state[cell+1];
            }

                return state[cell] == state[cell-1] && state[cell] == state[cell-2];
        }

        const colCheck = (cell) =>{

            if(cell < 3)
            {
                return state[cell] == state[cell+3] && state[cell] == state[cell+6];
            }

            if(cell < 6)
            {
                return state[cell] == state[cell-3] && state[cell] == state[cell+3];
            }

                return state[cell] == state[cell-3] && state[cell] == state[cell-6];
        }

        //implement diag check
        const diagCheck = (cell) => 
        (state[cell] == state[4]) && 
        ((state[cell] == state[0] && state[cell] == state[8]) || 
        (state[cell] == state[2] && state[cell] == state[6]))

        return {rowCheck, colCheck, diagCheck}
    })();

    /*
    The 'New game' button and its functionality. The players can repeat the match.*/
    const refresh_button = document.querySelector('#refresh');
    refresh_button.addEventListener('click',()=>{
        turn = 0;
        state = ['','','','','','','','',''];
        res = false;
        player = "";
        player1.setCell(0);
        player2.setCell(0);
        board.forEach(cell => cell.textContent = '');
        gameBoard.board_reset();
        player = p1;
        symbol = p1_symbol;
        displayController.displayTurn(player,symbol);
    })

    /*
    The core game logic. checks winCon on valid input, asks displaycontroller to display relevant info, updates gameBoard as necessary. 
    */
        board.forEach(board_cell => {
        board_cell.addEventListener('click', 
        ()=>{
            if(board_cell.textContent == '' && !res)
            {
                turn++;
                cell = board_cell.id.charAt(3);
                if(player == p1)
                {
                    player1.setCell(cell);  
                    cell = player1.getCell();
                }
                else
                { 
                    player2.setCell(cell);
                    cell = player2.getCell();
                }
                
                gameBoard.update_board(cell,symbol);
                state = gameBoard.board_state();
                displayController.displayCell(board_cell,symbol);

                                
                if(turn > 4)
                {
                    res = winCon.rowCheck(cell) || winCon.colCheck(cell);;
        
                    if(!(res || cell%2))
                    res = res || winCon.diagCheck(cell);
                }
                if(res || turn == 9) {
                    displayController.displayRes(player,res);
                    return;
                }

            if(player == p1)
            {
                player = p2;
                symbol = p2_symbol;
            }
            else {
                player = p1;
                symbol = p1_symbol;
            }

            displayController.displayTurn(player,symbol);

            }
        })
        })
                
})();