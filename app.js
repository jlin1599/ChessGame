const gameboard = document.querySelector("#gameboard")
const playerdisplay = document.querySelector("#player")
const infodisplay = document.querySelector("#info-display")
const width = 8
let playerGo = 'white'
playerdisplay.textContent = 'white'

const startPieces = [
    rook, knight,bishop,queen,king,bishop,knight,rook,
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    '','','','','','','','',
    '','','','','','','','',
    '','','','','','','','',
    '','','','','','','','',
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    rook, knight,bishop,queen,king,bishop,knight,rook,
]
function createBoard(){
    startPieces.forEach((startPiece, i) =>{
        const square = document.createElement('div')
        square.classList.add('square')
        square.innerHTML = startPiece
        square.firstChild?.setAttribute('draggable', true) // Make pieces draggable for interaction
        square.setAttribute('square-id', i)
        square.classList.add('beige')
        const row = Math.floor((63-i)/8)+1 //defines what row we are in 
        if (row % 2 ===0){
            square.classList.add(i % 2 === 0 ? "beige" : "brown") //even rows
        }else{
            square.classList.add(i % 2 === 0 ? "brown": "beige") //odd rows
        }
        if(i <= 15){
            square.firstChild.firstChild.classList.add('black')  // Add the "black" class to pieces in the first two rows (black pieces)
        }
        if( i>= 48){
            square.firstChild.firstChild.classList.add('white')  // Add the "white" class to pieces in the last two rows (white pieces)
        }

        gameboard.append(square)
    })
}
createBoard()


const allSquares = document.querySelectorAll(".square")

allSquares.forEach(square => {
    square.addEventListener('dragstart', dragStart)
    square.addEventListener('dragover', dragOver)
    square.addEventListener('drop', dragDrop)
}
)

let startPositionID 
let draggedElement

function dragStart(e) {
    startPositionID = (e.target.parentNode.getAttribute('square-id'))
    draggedElement = e.target
}

function dragOver(e) {
    e.preventDefault()
}

function dragDrop(e){
    e.stopPropagation()

    const correctGo = draggedElement.firstChild.classList.contains(playerGo)
    const taken = e.target.classList.contains('piece')
    const valid = checkIfValid(e.target)
    const opponentGo = playerGo === 'white' ? 'black' : 'white'
    const takenByOpponent = e.target.firstChild?.classList.contains(opponentGo)
    if(correctGo){
        if(takenByOpponent && valid){
            e.target.parentNode.append(draggedElement)
            e.target.remove()
            checkForWin()
            changePlayer()
            return
        }
        if(taken && !takenByOpponent){
            infodisplay.textContent = "you cannot go here!"
            setTimeout(() => infodisplay.textContent = "",2000)
            return
        }
        if(valid){
            e.target.append(draggedElement)
            checkForWin()
            changePlayer()
            return
        }
    }
}

function changePlayer() {
    if (playerGo === "black"){
        reverseIDs()
        playerGo = "white"
        playerdisplay.textContent = 'white'
    }else{
        revertIDs()
        playerGo = "black"
        playerdisplay.textContent = 'black'
    }
}


function reverseIDs() {
    const allSquares = document.querySelectorAll(".square")
    allSquares.forEach((square, i) => 
        square.setAttribute('square-id',(width*width - 1) - i))
}

function revertIDs(){
    const allSquares = document.querySelectorAll(".square")
    allSquares.forEach((square, i) => 
        square.setAttribute('square-id', i))
}
function checkForWin() {
    const kings = Array.from(document.querySelectorAll('#king'));
    console.log(kings);

    // Reference to the playerGo_container
    const playerGoContainer = document.querySelector('.playerGo_container');

    if (!kings.some(king => king.firstChild.classList.contains('white'))) {
        infodisplay.innerHTML = "Black Player Wins!";
        playerGoContainer.textContent = "Black Player Wins!";
        const allSquares = document.querySelectorAll('.square');
        allSquares.forEach(square => square.firstChild?.setAttribute('draggable', false));
    }

    if (!kings.some(king => king.firstChild.classList.contains('black'))) {
        infodisplay.innerHTML = "White Player Wins!";
        playerGoContainer.textContent = "White Player Wins!";
        const allSquares = document.querySelectorAll('.square');
        allSquares.forEach(square => square.firstChild?.setAttribute('draggable', false));
    }
}
   


function checkIfValid(target) {
    const targetID = Number(target.getAttribute('square-id')) || Number(target.parentNode.getAttribute('square-id')) 
    const startID = Number(startPositionID)
    const piece = draggedElement.id
    console.log(targetID)
    console.log('start-ID', startID)
    console.log('piece', piece)
    

    switch(piece){
        case 'pawn':
            const whiteStarterRow = [48, 49, 50, 51, 52, 53, 54, 55];
            const blackStarterRow = [8, 9, 10, 11, 12, 13, 14, 15];
            
            const isWhitePawn = whiteStarterRow.includes(startID);

            if (
                // White pawn movement
                (isWhitePawn && (
                    whiteStarterRow.includes(startID) && startID - width * 2 === targetID || 
                    startID - width === targetID || // Single step forward
                    startID - width - 1 === targetID && document.querySelector(`[square-id="${startID - width - 1}"]`).firstChild || 
                    startID - width + 1 === targetID && document.querySelector(`[square-id="${startID - width + 1}"]`).firstChild
                )) ||
                // Black pawn movement
                (!isWhitePawn && (
                    blackStarterRow.includes(startID) && startID + width * 2 === targetID || // Double step from start row
                    startID + width === targetID || // Single step forward
                    startID + width - 1 === targetID && document.querySelector(`[square-id="${startID + width - 1}"]`).firstChild || 
                    startID + width + 1 === targetID && document.querySelector(`[square-id="${startID + width + 1}"]`).firstChild
                ))
            ) {
                return true;
            }
            break;
        /*case 'pawn':
            const starterRow = [8,9,10,11,12,13,14,15]
            if (
                starterRow.includes(startID) && startID + width *2 === targetID || 
                startID + width === targetID || 
                startID + width -1 === targetID && document.querySelector(`[square-id = "${startID + width -1}"]`).firstChild ||
                startID + width +1 === targetID && document.querySelector(`[square-id = "${startID + width +1}"]`).firstChild              
            ){
                return true
            }
            break; */
        case 'knight':
            if(
                startID + width *2 - 1 === targetID ||
                startID + width *2 + 1 === targetID ||
                startID + width - 2 === targetID ||
                startID + width + 2 === targetID ||
                startID - width *2 + 1 === targetID ||
                startID - width *2 - 1 === targetID ||
                startID - width - 2 === targetID ||
                startID - width + 2 === targetID                 
            ){
                return true
            }
            break;
        case 'bishop':
            if(
                startID + width +1 === targetID ||
                startID + width *2 +2 === targetID && !document.querySelector(`[square-id = "${startID + width +1}"]`).firstChild ||
                startID + width *3 +3 === targetID && !document.querySelector(`[square-id = "${startID + width +1}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*2 +2}"]`).firstChild ||
                startID + width *4 +4 === targetID && !document.querySelector(`[square-id = "${startID + width +1}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*2 +2}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*3 +3}"]`).firstChild ||
                startID + width *5 +5 === targetID && !document.querySelector(`[square-id = "${startID + width +1}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*2 +2}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*3 +3}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*4 +4}"]`).firstChild ||
                startID + width *6 +6 === targetID && !document.querySelector(`[square-id = "${startID + width +1}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*2 +2}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*3 +3}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*4 +4}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*5 +5}"]`).firstChild ||
                startID + width *7 +7 === targetID && !document.querySelector(`[square-id = "${startID + width +1}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*2 +2}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*3 +3}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*4 +4}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*5 +5}"]`).firstChild  && !document.querySelector(`[square-id = "${startID + width*6 +6}"]`).firstChild ||
                // --
                startID - width -1 === targetID ||
                startID - width *2 -2 === targetID && !document.querySelector(`[square-id = "${startID - width -1}"]`).firstChild ||
                startID - width *3 -3 === targetID && !document.querySelector(`[square-id = "${startID - width -1}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*2 -2}"]`).firstChild ||
                startID - width *4 -4 === targetID && !document.querySelector(`[square-id = "${startID - width -1}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*2 -2}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*3 -3}"]`).firstChild ||
                startID - width *5 -5 === targetID && !document.querySelector(`[square-id = "${startID - width -1}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*2 -2}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*3 -3}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*4 -4}"]`).firstChild ||
                startID - width *6 -6 === targetID && !document.querySelector(`[square-id = "${startID - width -1}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*2 -2}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*3 -3}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*4 -4}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*5 -5}"]`).firstChild ||
                startID - width *7 -7 === targetID && !document.querySelector(`[square-id = "${startID - width -1}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*2 -2}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*3 -3}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*4 -4}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*5 -5}"]`).firstChild  && !document.querySelector(`[square-id = "${startID - width*6 -6}"]`).firstChild ||
                // -- 
                startID - width +1 === targetID ||
                startID - width *2 +2 === targetID && !document.querySelector(`[square-id = "${startID - width +1}"]`).firstChild ||
                startID - width *3 +3 === targetID && !document.querySelector(`[square-id = "${startID - width +1}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*2 +2}"]`).firstChild ||
                startID - width *4 +4 === targetID && !document.querySelector(`[square-id = "${startID - width +1}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*2 +2}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*3 +3}"]`).firstChild ||
                startID - width *5 +5 === targetID && !document.querySelector(`[square-id = "${startID - width +1}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*2 +2}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*3 +3}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*4 +4}"]`).firstChild ||
                startID - width *6 +6 === targetID && !document.querySelector(`[square-id = "${startID - width +1}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*2 +2}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*3 +3}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*4 +4}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*5 +5}"]`).firstChild ||
                startID - width *7 +7 === targetID && !document.querySelector(`[square-id = "${startID - width +1}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*2 +2}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*3 +3}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*4 +4}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*5 +5}"]`).firstChild  && !document.querySelector(`[square-id = "${startID - width*6 +6}"]`).firstChild ||
                // --
                startID + width -1 === targetID ||
                startID + width *2 -2 === targetID && !document.querySelector(`[square-id = "${startID + width -1}"]`).firstChild ||
                startID + width *3 -3 === targetID && !document.querySelector(`[square-id = "${startID + width -1}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*2 -2}"]`).firstChild ||
                startID + width *4 -4 === targetID && !document.querySelector(`[square-id = "${startID + width -1}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*2 -2}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*3 -3}"]`).firstChild ||
                startID + width *5 -5 === targetID && !document.querySelector(`[square-id = "${startID + width -1}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*2 -2}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*3 -3}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*4 -4}"]`).firstChild ||
                startID + width *6 -6 === targetID && !document.querySelector(`[square-id = "${startID + width -1}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*2 -2}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*3 -3}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*4 -4}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*5 -5}"]`).firstChild ||
                startID + width *7 -7 === targetID && !document.querySelector(`[square-id = "${startID + width -1}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*2 -2}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*3 -3}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*4 -4}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*5 -5}"]`).firstChild  && !document.querySelector(`[square-id = "${startID + width*6 -6}"]`).firstChild 
            ){
                return true
            }
            break;
        case 'rook':
            if (
                startID + width === targetID ||
                startID + width *2 === targetID && !document.querySelector(`[square-id = "${startID + width}"]`).firstChild ||
                startID + width *3 === targetID && !document.querySelector(`[square-id = "${startID + width}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*2}"]`).firstChild ||                        
                startID + width *4 === targetID && !document.querySelector(`[square-id = "${startID + width}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*2}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*3}"]`).firstChild || 
                startID + width *5 === targetID && !document.querySelector(`[square-id = "${startID + width}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*2}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*3}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*4}"]`).firstChild || 
                startID + width *6 === targetID && !document.querySelector(`[square-id = "${startID + width}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*2}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*3}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*4}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*5}"]`).firstChild || 
                startID + width *7 === targetID && !document.querySelector(`[square-id = "${startID + width}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*2}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*3}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*4}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*5}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*6}"]`).firstChild || 
                //--
                startID - width === targetID ||
                startID - width *2 === targetID && !document.querySelector(`[square-id = "${startID - width}"]`).firstChild ||
                startID - width *3 === targetID && !document.querySelector(`[square-id = "${startID - width}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*2}"]`).firstChild ||                        
                startID - width *4 === targetID && !document.querySelector(`[square-id = "${startID - width}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*2}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*3}"]`).firstChild || 
                startID - width *5 === targetID && !document.querySelector(`[square-id = "${startID - width}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*2}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*3}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*4}"]`).firstChild || 
                startID - width *6 === targetID && !document.querySelector(`[square-id = "${startID - width}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*2}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*3}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*4}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*5}"]`).firstChild || 
                startID - width *7 === targetID && !document.querySelector(`[square-id = "${startID - width}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*2}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*3}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*4}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*5}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*6}"]`).firstChild ||                
                //--
                startID + 1 === targetID ||
                startID + 2 === targetID && !document.querySelector(`[square-id = "${startID + 1}"]`).firstChild ||
                startID + 3 === targetID && !document.querySelector(`[square-id = "${startID + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startID + 2}"]`).firstChild ||                        
                startID + 4 === targetID && !document.querySelector(`[square-id = "${startID + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startID + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startID + 3}"]`).firstChild || 
                startID + 5 === targetID && !document.querySelector(`[square-id = "${startID + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startID + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startID + 3}"]`).firstChild && !document.querySelector(`[square-id = "${startID + 4}"]`).firstChild || 
                startID + 6 === targetID && !document.querySelector(`[square-id = "${startID + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startID + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startID + 3}"]`).firstChild && !document.querySelector(`[square-id = "${startID + 4}"]`).firstChild && !document.querySelector(`[square-id = "${startID + 5}"]`).firstChild || 
                startID + 7 === targetID && !document.querySelector(`[square-id = "${startID + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startID + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startID + 3}"]`).firstChild && !document.querySelector(`[square-id = "${startID + 4}"]`).firstChild && !document.querySelector(`[square-id = "${startID + 5}"]`).firstChild && !document.querySelector(`[square-id = "${startID + 6}"]`).firstChild ||                 
                //--
                startID - 1 === targetID ||
                startID - 2 === targetID && !document.querySelector(`[square-id = "${startID - 1}"]`).firstChild ||
                startID - 3 === targetID && !document.querySelector(`[square-id = "${startID - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startID - 2}"]`).firstChild ||                        
                startID - 4 === targetID && !document.querySelector(`[square-id = "${startID - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startID - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startID - 3}"]`).firstChild || 
                startID - 5 === targetID && !document.querySelector(`[square-id = "${startID - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startID - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startID - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startID - 4}"]`).firstChild || 
                startID - 6 === targetID && !document.querySelector(`[square-id = "${startID - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startID - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startID - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startID - 4}"]`).firstChild && !document.querySelector(`[square-id = "${startID - 5}"]`).firstChild || 
                startID - 7 === targetID && !document.querySelector(`[square-id = "${startID - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startID - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startID - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startID - 4}"]`).firstChild && !document.querySelector(`[square-id = "${startID - 5}"]`).firstChild && !document.querySelector(`[square-id = "${startID - 6}"]`).firstChild    
            ){
                return true
            }
            break;
        case 'queen':
            if(
                startID + width +1 === targetID ||
                startID + width *2 +2 === targetID && !document.querySelector(`[square-id = "${startID + width +1}"]`).firstChild ||
                startID + width *3 +3 === targetID && !document.querySelector(`[square-id = "${startID + width +1}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*2 +2}"]`).firstChild ||
                startID + width *4 +4 === targetID && !document.querySelector(`[square-id = "${startID + width +1}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*2 +2}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*3 +3}"]`).firstChild ||
                startID + width *5 +5 === targetID && !document.querySelector(`[square-id = "${startID + width +1}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*2 +2}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*3 +3}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*4 +4}"]`).firstChild ||
                startID + width *6 +6 === targetID && !document.querySelector(`[square-id = "${startID + width +1}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*2 +2}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*3 +3}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*4 +4}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*5 +5}"]`).firstChild ||
                startID + width *7 +7 === targetID && !document.querySelector(`[square-id = "${startID + width +1}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*2 +2}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*3 +3}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*4 +4}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*5 +5}"]`).firstChild  && !document.querySelector(`[square-id = "${startID + width*6 +6}"]`).firstChild ||
                // --
                startID - width -1 === targetID ||
                startID - width *2 -2 === targetID && !document.querySelector(`[square-id = "${startID - width -1}"]`).firstChild ||
                startID - width *3 -3 === targetID && !document.querySelector(`[square-id = "${startID - width -1}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*2 -2}"]`).firstChild ||
                startID - width *4 -4 === targetID && !document.querySelector(`[square-id = "${startID - width -1}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*2 -2}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*3 -3}"]`).firstChild ||
                startID - width *5 -5 === targetID && !document.querySelector(`[square-id = "${startID - width -1}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*2 -2}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*3 -3}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*4 -4}"]`).firstChild ||
                startID - width *6 -6 === targetID && !document.querySelector(`[square-id = "${startID - width -1}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*2 -2}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*3 -3}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*4 -4}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*5 -5}"]`).firstChild ||
                startID - width *7 -7 === targetID && !document.querySelector(`[square-id = "${startID - width -1}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*2 -2}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*3 -3}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*4 -4}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*5 -5}"]`).firstChild  && !document.querySelector(`[square-id = "${startID - width*6 -6}"]`).firstChild ||
                // -- 
                startID - width +1 === targetID ||
                startID - width *2 +2 === targetID && !document.querySelector(`[square-id = "${startID - width +1}"]`).firstChild ||
                startID - width *3 +3 === targetID && !document.querySelector(`[square-id = "${startID - width +1}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*2 +2}"]`).firstChild ||
                startID - width *4 +4 === targetID && !document.querySelector(`[square-id = "${startID - width +1}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*2 +2}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*3 +3}"]`).firstChild ||
                startID - width *5 +5 === targetID && !document.querySelector(`[square-id = "${startID - width +1}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*2 +2}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*3 +3}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*4 +4}"]`).firstChild ||
                startID - width *6 +6 === targetID && !document.querySelector(`[square-id = "${startID - width +1}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*2 +2}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*3 +3}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*4 +4}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*5 +5}"]`).firstChild ||
                startID - width *7 +7 === targetID && !document.querySelector(`[square-id = "${startID - width +1}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*2 +2}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*3 +3}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*4 +4}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*5 +5}"]`).firstChild  && !document.querySelector(`[square-id = "${startID - width*6 +6}"]`).firstChild ||
                // --
                startID + width -1 === targetID ||
                startID + width *2 -2 === targetID && !document.querySelector(`[square-id = "${startID + width -1}"]`).firstChild ||
                startID + width *3 -3 === targetID && !document.querySelector(`[square-id = "${startID + width -1}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*2 -2}"]`).firstChild ||
                startID + width *4 -4 === targetID && !document.querySelector(`[square-id = "${startID + width -1}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*2 -2}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*3 -3}"]`).firstChild ||
                startID + width *5 -5 === targetID && !document.querySelector(`[square-id = "${startID + width -1}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*2 -2}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*3 -3}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*4 -4}"]`).firstChild ||
                startID + width *6 -6 === targetID && !document.querySelector(`[square-id = "${startID + width -1}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*2 -2}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*3 -3}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*4 -4}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*5 -5}"]`).firstChild ||
                startID + width *7 -7 === targetID && !document.querySelector(`[square-id = "${startID + width -1}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*2 -2}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*3 -3}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*4 -4}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*5 -5}"]`).firstChild  && !document.querySelector(`[square-id = "${startID + width*6 -6}"]`).firstChild ||
                //--
                startID + width === targetID ||
                startID + width *2 === targetID && !document.querySelector(`[square-id = "${startID + width}"]`).firstChild ||
                startID + width *3 === targetID && !document.querySelector(`[square-id = "${startID + width}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*2}"]`).firstChild ||                        
                startID + width *4 === targetID && !document.querySelector(`[square-id = "${startID + width}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*2}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*3}"]`).firstChild || 
                startID + width *5 === targetID && !document.querySelector(`[square-id = "${startID + width}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*2}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*3}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*4}"]`).firstChild || 
                startID + width *6 === targetID && !document.querySelector(`[square-id = "${startID + width}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*2}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*3}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*4}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*5}"]`).firstChild || 
                startID + width *7 === targetID && !document.querySelector(`[square-id = "${startID + width}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*2}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*3}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*4}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*5}"]`).firstChild && !document.querySelector(`[square-id = "${startID + width*6}"]`).firstChild || 
                //--
                startID - width === targetID ||
                startID - width *2 === targetID && !document.querySelector(`[square-id = "${startID - width}"]`).firstChild ||
                startID - width *3 === targetID && !document.querySelector(`[square-id = "${startID - width}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*2}"]`).firstChild ||                        
                startID - width *4 === targetID && !document.querySelector(`[square-id = "${startID - width}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*2}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*3}"]`).firstChild || 
                startID - width *5 === targetID && !document.querySelector(`[square-id = "${startID - width}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*2}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*3}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*4}"]`).firstChild || 
                startID - width *6 === targetID && !document.querySelector(`[square-id = "${startID - width}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*2}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*3}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*4}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*5}"]`).firstChild || 
                startID - width *7 === targetID && !document.querySelector(`[square-id = "${startID - width}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*2}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*3}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*4}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*5}"]`).firstChild && !document.querySelector(`[square-id = "${startID - width*6}"]`).firstChild ||                
                //--
                startID + 1 === targetID ||
                startID + 2 === targetID && !document.querySelector(`[square-id = "${startID + 1}"]`).firstChild ||
                startID + 3 === targetID && !document.querySelector(`[square-id = "${startID + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startID + 2}"]`).firstChild ||                        
                startID + 4 === targetID && !document.querySelector(`[square-id = "${startID + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startID + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startID + 3}"]`).firstChild || 
                startID + 5 === targetID && !document.querySelector(`[square-id = "${startID + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startID + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startID + 3}"]`).firstChild && !document.querySelector(`[square-id = "${startID + 4}"]`).firstChild || 
                startID + 6 === targetID && !document.querySelector(`[square-id = "${startID + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startID + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startID + 3}"]`).firstChild && !document.querySelector(`[square-id = "${startID + 4}"]`).firstChild && !document.querySelector(`[square-id = "${startID + 5}"]`).firstChild || 
                startID + 7 === targetID && !document.querySelector(`[square-id = "${startID + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startID + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startID + 3}"]`).firstChild && !document.querySelector(`[square-id = "${startID + 4}"]`).firstChild && !document.querySelector(`[square-id = "${startID + 5}"]`).firstChild && !document.querySelector(`[square-id = "${startID + 6}"]`).firstChild ||                 
                //--
                startID - 1 === targetID ||
                startID - 2 === targetID && !document.querySelector(`[square-id = "${startID - 1}"]`).firstChild ||
                startID - 3 === targetID && !document.querySelector(`[square-id = "${startID - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startID - 2}"]`).firstChild ||                        
                startID - 4 === targetID && !document.querySelector(`[square-id = "${startID - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startID - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startID - 3}"]`).firstChild || 
                startID - 5 === targetID && !document.querySelector(`[square-id = "${startID - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startID - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startID - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startID - 4}"]`).firstChild || 
                startID - 6 === targetID && !document.querySelector(`[square-id = "${startID - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startID - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startID - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startID - 4}"]`).firstChild && !document.querySelector(`[square-id = "${startID - 5}"]`).firstChild || 
                startID - 7 === targetID && !document.querySelector(`[square-id = "${startID - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startID - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startID - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startID - 4}"]`).firstChild && !document.querySelector(`[square-id = "${startID - 5}"]`).firstChild && !document.querySelector(`[square-id = "${startID - 6}"]`).firstChild 
            ){
                return true
            }
            break;
        case 'king':
            if(
                startID + 1 === targetID ||
                startID - 1 === targetID ||
                startID + width === targetID ||
                startID - width === targetID ||
                startID + width -1 === targetID ||
                startID + width +1 === targetID ||
                startID - width -1 === targetID ||
                startID - width +1 === targetID 
            ){
                return true
            }
            break;
    }  
}