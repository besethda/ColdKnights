let tileWidth = 16
let tileHeight = 16
let renderedTileWidth = tileWidth * 4
let width = $(window).width()
const barHeight = $('.cold-level').height()

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
      randomNumber(1, 10) < (10 - i - 3) ? 
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

const renderPlayer = () => {
  let 
}

const makeClock = () => {
  var start = new Date
  setInterval(()=> {
    let number = Math.floor((new Date - start) / 1000)
    decreaseTime(number)
    number < 60 ? $('.timer').text(number) : $('.timer').text('')
  }, 1000)
}

const decreaseTime = (number) => {
  $('.cold-level').height(`${barHeight - (barHeight / 60) * number}`)
}

makeClock()
createGround('.blocks')
createIslands()

