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

class Player {
  constructor(x, y) {
    this.y = y
    this.x = x
    this.p = $('<div class="player"></div>')
    $('.background').append(this.p)
    this.frames = {
    up: [-7, -9],
    down: [-72, -105],
    default: [-41, 24],
    right: [-40, -104],
    dead: [-71, 55]
    }
    this.setFrame('default')
  } setFrame(name) {
    let frame = this.frames[name]
    this.p.css('background-position', `${frame[0]}px ${frame[1]}px`)
    this.p.css('transform', 'scaleX(1)')
  } jump() {
    this.y += 25
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
      bottom: this.y + 'px'
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
