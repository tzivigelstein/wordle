import '../styles.css'
import Keyboard from './Keyboard.js'
import Board from './Board.js'

const board = new Board({})

const keyboard = new Keyboard()

board.initBoard()

keyboard.onClick(({ letter, id }) => {
  const intID = parseInt(id)
  const sendButtonID = 20
  const deleteButtonID = 28

  if (intID === sendButtonID) {
    board.nextWord()
    keyboard.updateLettersStatus(board.getLettersStatus())
  } else if (intID === deleteButtonID) {
    board.deleteLetter()
  } else {
    board.setLetter(letter)
  }
})
