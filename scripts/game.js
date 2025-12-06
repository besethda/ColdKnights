let tileWidth = 64
let tileHeight =64
let renderedTileWidth = tileWidth
let width = $(window).width()
const barHeight = $('.cold-level').height()
let tileList
let tileMap
const keys = { left: false, right: false, space: false}
let fireFound = false
let gameFinished = true
let p

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
  fireDiv.append('<img src="/public/images/campfire_centered.gif" class="fire"/>')
}

const makeClock = (gameStopped = false) => {
  var start = new Date
  const timer = setInterval(()=> {
    if (gameFinished === false) {
      let number = Math.floor((new Date - start) / 1000)
      $('.cold-level').height(`${barHeight - (barHeight / 30) * number}`)
      if (number < 30) {
        $('.timer').text(number)
      } else {
        $('.timer').text('')
        gameOver()
      }
    }
  }, 1000)
}

const gameOver = (winLose) => {
  gameFinished = true
  if (winLose === 'win') {
    clearInterval(gameLoop)
  } else {
    changeFrame(true)
    document.removeEventListener('keydown', keyDownEvents)
    document.removeEventListener('keydown', keyUpEvents)
  }
}

let lastHeight

const changeFrame = (dead = false) => {
  let currentHeight = p.y
  if (dead === true || gameFinished === true) {
    p.setFrame('dead')
  } else {
    if (p.grounded === true) {
      p.setFrame('default')
    } else if (currentHeight > lastHeight) {
      p.setFrame('down')
    }
  }
  lastHeight = currentHeight
}

const checkFireFound = () => {
  let fire = $('.fire')[0]
  let fireDimensions = fire.getBoundingClientRect()
  let horizontalTouch = 
    p.box.left < fireDimensions.right&&
    p.box.right > fireDimensions.left

  let verticalTouch =
  p.box.bottom >= fireDimensions.top&&
  p.box.top <= fireDimensions.bottom
  
  if (verticalTouch && horizontalTouch) {
    gameOver('win')}
}

const checkForCollision = () => {
  p.grounded = false
  let playerBox = p.box

  $('.tile').each((index, element)=> {
    let tileBox = element.getBoundingClientRect()
    let backgroundBox = $('.background')[0].getBoundingClientRect()

    let tileTop = tileBox.top -backgroundBox.top
    let tileBottom = tileBox.bottom -backgroundBox.top
    let tileLeft = tileBox.left -backgroundBox.left
    let tileRight = tileBox.right -backgroundBox.left

    let playerLeft = p.x
    let playerRight = p.x + p.width
    let playerTop = p.y
    let playerBottom = p.y + p.height

    let horizontalAlign = playerRight > tileLeft && playerLeft < tileRight;
    if (!horizontalAlign) return

    let nextBottom = playerBottom + p.velocityY

    const verticalAlign = playerBottom <= tileTop && nextBottom >= tileTop
    
    if(verticalAlign) {
    p.y = tileTop -p.height
    p.velocityY = 0
    p.grounded = true
    p.updateCSS()
    }})
  }

const startGame = () =>{
  $('.cold-bar').css('display', 'flex')
  let startingY = ($(window).height()- (tileHeight + 64))
  p = new Player(30, startingY)
  const keyDownEvents = (e) => {
    if (e.code === 'Space') {p.jump()
    } else if (e.code === 'ArrowRight') {keys.right = true
    } else if (e.code === 'ArrowLeft') {keys.left = true 
    }}
  const keyUpEvents = (e) => {
    if (e.code === 'ArrowRight') {keys.right = false
    } else if (e.code === 'ArrowLeft') {keys.left = false 
    }}

  makeClock()
  createGround('.blocks')
  createIslands()
  p.moveRight()
  document.addEventListener('keydown', keyDownEvents)
  document.addEventListener('keyup', keyUpEvents)
}

class Player {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.grounded = false
    this.gravity = .3
    this.p = $('<div class="player"></div>')
    $('.background').append(this.p)
    this.width = this.p[0].getBoundingClientRect().width
    this.height = this.p[0].getBoundingClientRect().height
    this.velocityY = 0
    this.updateCSS()
    this.frames = {
    up: [-9, -9],
    down: [-73, -105],
    default: [-41, 24],
    right: [-41, -104],
    dead: [-72, 55]
    }
    this.setFrame('default')
  }
    updateCSS() {
      this.p.css({ left: this.x + 'px', top: this.y + 'px'})
  } get box() {
    return this.p[0].getBoundingClientRect()
  } applyGravity() {
    if (!this.grounded) {
      this.velocityY += this.gravity
      this.y += this.velocityY
      this.updateCSS()
    }
  } setFrame(name) {
    let frame = this.frames[name]
    this.p.css('background-position', `${frame[0]}px ${frame[1]}px`)
  } jump() {
    if(this.grounded) {
      this.velocityY = -12
      this.grounded = false
      this.setFrame('up')
    }
  } moveRight() {
    this.setFrame('right')
    this.p.css('transform', 'scale(4)')
    this.x += 7
    this.updateCSS()
  } moveLeft() {
    this.setFrame('right')
    this.p.css('transform', 'scale(-4, 4)')
    this.x -= 7
    this.updateCSS()
  } die() {
    this.setFrame('dead')
  }
  }

var start = new Date
const gameLoop = setInterval(()=> {
  if (gameFinished === false){
    let speed = Math.floor((new Date - start) / 1000)
    if (keys.left) p.moveLeft()
    if (keys.right) p.moveRight()
    p.applyGravity()
    checkForCollision()
    changeFrame()
    checkFireFound()
  }}, 10)

  let menu = $('.menu')
  menu.css('display', 'flex')
  menu.click(()=> {gameFinished = false 
    startGame()
    menu.css('display', 'none')
  })
