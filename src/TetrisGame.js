document.addEventListener('DOMContentLoaded', () => {
    
    // buttons and state variables pertaining to the Game Window and Start Game modules
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.getElementById("startGame")
    const startScreen = document.getElementById("startScreen")
    const difficulties = document.getElementById("difficulties")
    const diffmeter = document.getElementById("diffmeter")
    const logo = document.getElementById("logo")

    // buttons pertaining to the difficulty settings in the Start Game module
    const easyBtn = document.getElementById("easy")
    const medBtn = document.getElementById("med")
    const hardBtn = document.getElementById("hard")
    

    // buttons and state variables pertaining to the End Game module and restarting the game
    const restartBtn = document.getElementById("restartGame")
    const restartScreen = document.getElementById("restartScreen")
    const finalScore = document.getElementById("finalScore")
    const controls = document.getElementById("controls")

    const width = 10 // width of the Grid
    let nextRandom = 0 // variable for random number (with 0 as a placeholder)
    let score = 0 // score state variable (initially set to 0)
    let timerID // state variable for keeping track of the time elapsed on current game

    // make the difficulty settings hidden until the "Start Game" button is pushed
    difficulties.style.visibility = "hidden";
    diffmeter.style.visibility = "hidden";
    controls.style.visibility = "hidden";

    //block colors
    const colors = [
        'orange', 'red', 'purple', 'green', 'blue' 
       ]

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                      Shape Module                                                        //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

       
    //each blocks and their 4 rotation positions

    const Lblock = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2], 
        [1, width+1, width*2+1, width*2], 
        [width, width*2, width*2+1, width*2+2]
    ]

    const Zblock = [
        [width+1, width+2, width*2, width*2+1],
        [0,width,width+1,width*2+1],
        [width+1,width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1]
    ]

    const Tblock = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
    ]

    const Oblock = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
    ]

    const IBlock = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
    ]

    // list of possible blocks
    const Blocks = [Lblock, Zblock, Tblock, Oblock, IBlock]

    //randomly picking block
    let currentPosition = 1 // represents the current position of the block (initially set to 1, which is the top left grid box)
    let currentRotation = 0 // the current rotational aligning 
    let random = Math.floor(Math.random()*Blocks.length) // selects a random block from the list available
    let current = Blocks[random][currentRotation] // makes the current block according to the random number generated and its initial rotation

    //drawing blocks on the grid
    function draw() {
        // for each new grid box that the block takes up, it is given the class of "blocks" and a background color that depends on what shape the block is
        current.forEach(ind => {
            squares[currentPosition + ind].classList.add('blocks')
            squares[currentPosition + ind].style.backgroundColor = colors[random]
        })
    }

     //undraw a block from the grid
     function eraseBlock() {
        // for each grid box taken up by the block, this function removes it's "block" class and sets the background color to be nothing
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('blocks')
            squares[currentPosition + index].style.backgroundColor = ''
        })
    } 

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////










//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                 Game Controller Module                                                   //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //assigning keys to movements
    function control(e){
        if(e.keyCode === 65){
            moveLeft() // input of 'A' moves the block left
        }else if (e.keyCode === 87){
            rotate() // input of 'W' rotates the block 90 degrees
        }else if (e.keyCode === 68){
            moveRight() // input of 'D' moves the block right
        }else if (e.keyCode === 83){
            moveDown() // input of 'S' moves the block down
        }
    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////










//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                 BlockFall Module                                                         //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // erases the block and redraws each part of it one row lower
    function moveDown(){
        eraseBlock()
        currentPosition += width // moves the position of the block down by one row
        draw()
        freezeBlock()
    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////










//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                 BlockStack Module                                                        //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //stop the blocks at the bottom and makes a new block
    function freezeBlock(){
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
            // for each grid box the current block occupies, it is now seen as "taken"
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            // a new block is randomly selected
            random = nextRandom
            nextRandom = Math.floor(Math.random()*Blocks.length)
            // current block is now the newly created block with an initial position in the middle of the top row on the grid
            current = Blocks[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameover()
        }
    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////










//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                 Grid Module                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

     //moving the blocks left while checking if at the left edge of grid

     function moveLeft() {
        eraseBlock()
        const LeftEdge = current.some(index => (currentPosition + index) % width === 0) // checks if block is at the left edge

        if(!LeftEdge) currentPosition -= 1 // only shifts left if it is not at the left edge of the grid

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            // if there is another block to the immediate left of the current block, it will move the current block back to the right (where it was originally)
            currentPosition += 1
        }
        draw()
        
    }

    //moving the blocks right while checking if at the right edge of grid
    function moveRight() {
        eraseBlock()
        const RightEdge = current.some(index => (currentPosition + index) % width === 9) // checks if block is at the right edge

        if(!RightEdge) currentPosition += 1 // only shifts right if it is not at the right edge of the grid

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            // if there is another block to the immediate right of the current block, it will move the current block back to the left (where it was originally)
            currentPosition -= 1
        }
        draw()
        
    }

    //rotating the blocks
    function rotate() {
        const LeftEdge = current.some(index => (currentPosition + index) % width === 0)
        const RightEdge = current.some(index => (currentPosition + index) % width === 9)
        if(!RightEdge && !LeftEdge){
            // erases the block and redraws it after switching to the next rotation out of 4 options
            eraseBlock()
            currentRotation ++
            //switch back to 0 after it gets to 4
            if(currentRotation === current.length){
                currentRotation = 0
            }
    
            current = Blocks[random][currentRotation] // reassigns the value of current to have the updated rotation value of the block
            draw()
        }

    }

    //showing upcoming blocks
    const displaySquares = document.querySelectorAll('.upcoming-grid div')
    const displayWidth = 4
    const displayIndex = 0

    //blocks without rotations
    const upNextBlock = [
        [1, displayWidth+1, displayWidth*2+1, 2], //LBlock
        [0, displayWidth, displayWidth+1, displayWidth*2+1], //ZBlock
        [1, displayWidth, displayWidth+1, displayWidth+2], //TBlock
        [0, 1, displayWidth, displayWidth+1], //OBlocks
        [1, displayWidth+1, displayWidth*2+1,displayWidth*3+1] //IBlock
    ]

    //Displaying the upcoming shape in grid
    function displayShape(){
        // erases the "upcoming block" that was previously generated
        displaySquares.forEach(square => {
            square.classList.remove('blocks')
            square.style.backgroundColor = ''
        })
        // draws the new "upcoming block" in the "Upcoming Block" grid
        upNextBlock[nextRandom].forEach( index => {
            displaySquares[displayIndex + index].classList.add('blocks')
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })
    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////










//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                 Start Game Module                                                        //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function startGame(difficulty){
        // makes the start screen and its features hidden
        difficulties.style.visibility = "hidden"
        startScreen.style.visibility = "hidden"
        diffmeter.style.visibility = "hidden"
        controls.style.visibility = "hidden"
        // allows keyboard input and starts timer
        document.addEventListener('keydown', control)
        draw()
        timerID = setInterval(moveDown, difficulty)
        // randomly selects the first block
        nextRandom = Math.floor(Math.random() * Blocks.length)
        displayShape()


    }


    // Each button method sets the speed of the block fall to what is selected, respectively, and starts the game

    easyBtn.addEventListener('click', () => {
        
        startGame(500)

    })

    medBtn.addEventListener('click', () => {
        
        startGame(250)

    })

    hardBtn.addEventListener('click', () => {
        
        startGame(100)

    })
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////










//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                     Pause Game Module                                                    //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
     //adding start and pause button

     startBtn.addEventListener('click', () => {
        
        startBtn.style.visibility = "hidden";
        difficulties.style.visibility = "visible"
        diffmeter.style.visibility = "visible"
        logo.style.visibility = 'hidden'
        controls.style.visibility = 'visible'


    })

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////










//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                     RowCheck Module                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //filling a row of blocks and adding to the score

    function addScore() {
        for(let i = 0; i < 199; i += width){
            // loops through all the rows of the grid, incrementing by the width of the grid
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

            // if every grid box in a row contains a block, then the score increments by 10 and the boxes are cleared
            if(row.every(index => squares[index].classList.contains('taken'))){
                score += 10
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('blocks')
                    squares[index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(i, width) 
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////










//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                     End Game Module                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //game over function

    function gameover(){
        // checks if one of the grid boxes that comprises the current block occupies a grid box with the "taken" class (invalid box)
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            scoreDisplay.innerHTML = 'end' // displays the "end" message in place of score
            clearInterval(timerID) // stops timer
            document.removeEventListener('keydown', control) // no longer accepts keyboard inputs
            // makes the restart screen and all its features visible
            finalScore.style.visibility = 'visible'
            restartScreen.style.visibility = 'visible'
            finalScore.innerHTML = `Score ${score}`
            restartBtn.style.visibility = 'visible'
            }
    }

    // button that allows the player to refresh the page and start the game again from scratch
    restartBtn.addEventListener('click', () => {
        
        location.reload()

    })
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
})