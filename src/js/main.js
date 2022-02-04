import '../styles.css'
import Keyboard from './Keyboard.js'
import Board from './Board.js'

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
