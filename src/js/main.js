import '../styles.css'
import '../game.css'
import '../rules.css'
import Keyboard from './Keyboard.js'
import Board from './Board.js'
import { $ } from './utils'

const board = new Board({})

const keyboard = new Keyboard()

board.initBoard()

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

const rulesCloseButton = $('.closeButton')
const rulesContainer = $('.rulesContainer')
const rulesOpenButton = $('#rulesButton')
const footerButton = $('.footerButton')

rulesOpenButton.addEventListener('click', () => {
  rulesContainer.classList.add('rulesContainerActive')
})

rulesCloseButton.addEventListener('click', () => {
  rulesContainer.classList.remove('rulesContainerActive')
})

footerButton.addEventListener('click', () => {
  rulesContainer.classList.remove('rulesContainerActive')
})
