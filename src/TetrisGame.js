document.addEventListener('DOMContentLoaded', () => {
    
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-Game')
    const width = 10
    let nextRandom = 0
    let score = 0
    let timerID


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

    document.addEventListener('keyup', control)
   
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
        eraseBlock()
        currentRotation ++
        //switch back to 0 after it gets to 4
        if(currentRotation === current.length){
            currentRotation = 0
        }

        current = Blocks[random][currentRotation]
        draw()
    }

})