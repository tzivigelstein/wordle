import Keyboard from './Keyboard.js'
import Board from './Board.js'
import utils from './utils'

const { $ } = utils

const board = new Board({})

const keyboard = new Keyboard()

keyboard.onClick(({ letter, id }) => {
  const intID = parseInt(id)
  const SEND_BUTTON_ID = 20
  const DELETE_BUTTON_ID = 28

  if (intID === SEND_BUTTON_ID) {
    board.nextWord()
    keyboard.updateLettersStatus(board.getLettersStatus())
  } else if (intID === DELETE_BUTTON_ID) {
    board.deleteLetter()
  } else {
    board.setLetter(letter)
  }
})

const rulesContainer = $('.rulesContainer')
const rulesOpenButton = $('#rulesButton')
const rulesCloseButton = $('#closeRulesButton')

const footerButton = $('.footerButton')

// Make the rules load for the first time
// firstTime && "show rules"

// rulesContainer.classList.add('rulesContainerActive')

rulesOpenButton.addEventListener('click', () => {
  rulesContainer.classList.add('rulesContainerActive')
})

rulesCloseButton.addEventListener('click', () => {
  rulesContainer.classList.remove('rulesContainerActive')
})

footerButton.addEventListener('click', () => {
  rulesContainer.classList.remove('rulesContainerActive')
})

const statsContainer = $('.statsContainer')
const statsOpenButton = $('#statsButton')
const statsCloseButton = $('#closeStatsButton')

statsOpenButton.addEventListener('click', () => {
  statsContainer.classList.add('statsContainerActive')
})

statsCloseButton.addEventListener('click', () => {
  statsContainer.classList.remove('statsContainerActive')
})
