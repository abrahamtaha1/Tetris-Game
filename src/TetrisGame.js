document.addEventListener('DOMContentLoaded', () => {
    
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.getElementById("startGame")
    const startScreen = document.getElementById("startScreen")
    const difficuties = document.getElementById("difficulties")
    const diffmeter = document.getElementById("diffmeter")

    const easyBtn = document.getElementById("easy")
    const medBtn = document.getElementById("med")
    const hardBtn = document.getElementById("hard")

    const width = 10
    let nextRandom = 0
    let score = 0
    let timerID


    difficulties.style.visibility = "hidden";
    diffmeter.style.visibility = "hidden";

     //block colors

     const colors = [
        'orange', 'red', 'purple', 'green', 'blue' 
       ]

    //each blocks

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

    const Blocks = [Lblock, Zblock, Tblock, Oblock, IBlock]

//randomly picking block
    let currentPosition = 1
    let currentRotation = 0
    let random = Math.floor(Math.random()*Blocks.length)
    let current = Blocks[random][currentRotation]

    //drawing blocks on the grid
    function draw() {
        current.forEach(ind => {
            squares[currentPosition + ind].classList.add('blocks')
            squares[currentPosition + ind].style.backgroundColor = colors[random]
        })
    }

     //undraw a block

     function eraseBlock() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('blocks')
            squares[currentPosition + index].style.backgroundColor = ''
        })
    } 

    //assigning keys to movements

    function control(e){
        if(e.keyCode === 65){
            moveLeft()
        }else if (e.keyCode === 87){
            rotate()
        }else if (e.keyCode === 68){
            moveRight()
        }else if (e.keyCode === 83){
            moveDown()
        }
    }
   
    function moveDown(){
        eraseBlock()
        currentPosition += width
        draw()
        freezeBlock()
    }

    //stop the blocks at the bottom and make new block
    function freezeBlock(){
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            random = nextRandom
            nextRandom = Math.floor(Math.random()*Blocks.length)
            current = Blocks[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameover()
        }
    }

     //moving the blocks left while checking if at the left edge of grid

     function moveLeft() {
        eraseBlock()
        const LeftEdge = current.some(index => (currentPosition + index) % width === 0)

        if(!LeftEdge) currentPosition -= 1

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            currentPosition += 1
        }
        draw()
        
    }

    //moving the blocks right while checking if at the right edge of grid
    function moveRight() {
        eraseBlock()
        const RightEdge = current.some(index => (currentPosition + index) % width === 9)

        if(!RightEdge) currentPosition += 1

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            currentPosition -= 1
        }
        draw()
        
    }

    //rotating the blocks

    function rotate() {
        const LeftEdge = current.some(index => (currentPosition + index) % width === 0)
        const RightEdge = current.some(index => (currentPosition + index) % width === 9)
        if(!RightEdge && !LeftEdge){
            eraseBlock()
            currentRotation ++
            //switch back to 0 after it gets to 4
            if(currentRotation === current.length){
                currentRotation = 0
            }
    
            current = Blocks[random][currentRotation]
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
        displaySquares.forEach(square => {
            square.classList.remove('blocks')
            square.style.backgroundColor = ''
        })
        upNextBlock[nextRandom].forEach( index => {
            displaySquares[displayIndex + index].classList.add('blocks')
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })
    }


    function startGame(difficulty){

        difficulties.style.visibility = "hidden"
        startScreen.style.visibility = "hidden"
        diffmeter.style.visibility = "hidden"
        document.addEventListener('keydown', control)
        draw()
        timerID = setInterval(moveDown, difficulty)
        nextRandom = Math.floor(Math.random() * Blocks.length)
        displayShape()


    }

    easyBtn.addEventListener('click', () => {
        
        startGame(500)

    })

    medBtn.addEventListener('click', () => {
        
        startGame(250)

    })

    hardBtn.addEventListener('click', () => {
        
        startGame(100)

    })

     //adding start and pause button

     startBtn.addEventListener('click', () => {
         
        startBtn.style.visibility = "hidden";
        difficulties.style.visibility = "visible"
        diffmeter.style.visibility = "visible"

        /*if(timerID) {
            clearInterval(timerID)
            timerID = null
        */

    })

    //filling a row of blocks and adding to the score

    function addScore() {
        for(let i = 0; i < 199; i += width){
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

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

    //game over function

    function gameover(){
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            scoreDisplay.innerHTML = 'end'
            clearInterval(timerID)
            document.removeEventListener('keydown', control)
            }
    }

})