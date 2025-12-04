let tileWidth = 16
let tileHeight = 16
let renderedTileWidth = tileWidth * 4
let width = $(window).width()
const barHeight = $('.cold-level').height()
let tileList
let tileMap

const randomNumber = (bottomRange, topRange) => {
  let number = Math.floor(Math.random() * (topRange - bottomRange + 1))
  return (number + bottomRange)
}

const createGround = (classname) => {
  for(let i = 0; i < (width/renderedTileWidth); i++) {
    $(`${classname}`).append(`<div class="tile" style = 'background-position: ${- 112 - (randomNumber(0,1) * -16)}px ${(randomNumber(0,1) * -16)}px'> </div>`)
  }
}

const createIslands = () => {
  let lastLayer
  let background = $('.background')
  let windowHeight = $(window).height()
  for(let i = 0; i < ((windowHeight - 64)/ 192); i++) {
    background.append(`<div class='floor layer${i}'></div>`)
    for(let j = 0; j < (width/renderedTileWidth); j++) {
      randomNumber(1, 10) < (10 - i - 2) ? 
      $(`.layer${i}`).append(`<div class="tile" style = 'background-position: ${- 112 - (randomNumber(0,1) * -16)}px ${(randomNumber(0,1) * -16)}px'> </div>`)
      : $(`.layer${i}`).append(`<div class="empty-tile" style = 'background-position: 800px 3px'> </div>`)
      lastLayer = i
    }
  }
  createFire(lastLayer)
}

const createFire = (topLayer) => {
  let layerList = $(`.layer${topLayer} .tile`)
  let fireDiv = $(layerList[randomNumber(0, layerList.length-1)])
  fireDiv.append('<img src="/images/campfire_centered.gif" class="fire"/>')
}

const makeClock = () => {
  var start = new Date
  setInterval(()=> {
    let number = Math.floor((new Date - start) / 1000)
    $('.cold-level').height(`${barHeight - (barHeight / 60) * number}`)
    number < 60 ? $('.timer').text(number) : $('.timer').text('')
  }, 1000)
}

const checkForCollision = () => {
  let playerBox = p.p[0].getBoundingClientRect()

  let collided = false

  $('.tile').each((index, element)=> {
    let tileBox = element.getBoundingClientRect()
    
    let overlap = playerBox.bottom > tileBox.top &&
      playerBox.top < tileBox.bottom &&
      playerBox.right > tileBox.left &&
      playerBox.left < tileBox.right

    if (!overlap) return


    let falling = p.velocity > 0
    let prevBottom = p.previousY + p.height
    let wasAbove = prevBottom <= tileBox.top
    console.log(
      "Tile:", tileBox.top, tileBox.bottom, 
      "Player:", playerBox.top, playerBox.bottom,
      "vel:", p.velocity,
      "falling:", falling,
      "wasAbove:", wasAbove
    );
    if(falling && wasAbove) {
    let inTileArea = playerBox.bottom - tileBox.top
    p.y -= inTileArea
    p.p.css('top', p.y + 'px')
    p.velocity = 0
    p.grounded = true
    return
    }
  })

  
}


class Player {
  constructor(x, y) {
    this.grounded = true
    this.gravity = .3
    this.width = 60
    this.height = 60
    this.y = y
    this.x = x
    this.p = $('<div class="player"></div>')
    $('.background').append(this.p)
    this.velocity = 6
    this.previousX = this.x
    this.previousY = this.y
    this.frames = {
    up: [-7, -9],
    down: [-72, -105],
    default: [-41, 24],
    right: [-40, -104],
    dead: [-71, 55]
    }
    this.setFrame('default')
  } applyEffects() {
    this.previousX = this.x
    this.previousY = this.y
    this.velocity += this.gravity
    this.y += this.velocity
  } setFrame(name) {
    let frame = this.frames[name]
    this.p.css('background-position', `${frame[0]}px ${frame[1]}px`)
    this.p.css('transform', 'scaleX(1)')
  } jump() {
    this.velocity = -6
    this.grounded = false
    this.setFrame('up')
  } moveRight() {
    this.setFrame('right')
    this.x += 4
  } moveLeft() {
    this.p.css('transform', 'scaleX(-1)')
    this.x -= 4
  } die() {
    this.setFrame('dead')
  } update() {
    this.p.css({
      left: this.x + 'px',
      top: this.y + 'px'
    })
  }
}
  
let p = new Player(16, 16)
p.update()

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    p.jump() 
  } else if (e.code === 'ArrowRight') {
    p.moveRight()
  } else if (e.code === 'ArrowLeft') {
    p.moveLeft()  
  }
  p.update()
})

makeClock()
createGround('.blocks')
createIslands()

var start = new Date
setInterval(()=> {let speed = Math.floor((new Date - start) / 1000)
  p.applyEffects()
  p.update()
  checkForCollision()

}, 100)

