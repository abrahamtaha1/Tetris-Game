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



})