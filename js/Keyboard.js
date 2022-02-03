import { deleteButtonSVG } from './deleteButtonSVG.js'
const keyboard = $('.keyboardContainer')
import keyboardLetters from './keyboardLetters.js'

export default class Keyboard {
  constructor() {
    this.initKeyboard()
  }

  initKeyboard() {
    keyboardLetters.forEach((row, index) => {
      const keyboardLettersFragment = document.createElement('div')
      keyboardLettersFragment.classList.add('keyboardRow')
      row.forEach(letter => {
        keyboardLettersFragment.appendChild(createKeyboardLetter(letter))
      })

      if (index === 2) {
        const deleteButton = createDeleteButton()
        keyboardLettersFragment.appendChild(deleteButton)
      }

      keyboard.appendChild(keyboardLettersFragment)
    })

    function createKeyboardLetter({ letter, id }) {
      const letterButton = document.createElement('button')
      letterButton.id = id
      letterButton.innerText = letter
      letterButton.classList.add('keyboardButton')

      return letterButton
    }

    function createDeleteButton() {
      const deleteButton = document.createElement('button')
      deleteButton.id = 28
      deleteButton.innerHTML = deleteButtonSVG
      deleteButton.classList.add('keyboardButton')

      return deleteButton
    }
  }

  onClick(callback) {
    const htmlButtons = $$('.keyboardButton')
    htmlButtons.forEach(button => {
      button.addEventListener('click', e => {
        callback({ letter: e.target.innerHTML, id: e.target.id })
      })
    })
  }

  updateLettersStatus([correctLetters, almostCorrectLetters, wrongLetters]) {
    const letters = $$('.keyboardButton')
    letters.forEach(letter => {
      if (correctLetters.includes(letter.innerHTML)) {
        letter.classList.add('correctLetter')
      } else if (almostCorrectLetters.includes(letter.innerHTML)) {
        letter.classList.add('almostCorrectLetter')
      } else if (wrongLetters.includes(letter.innerHTML)) {
        letter.classList.add('wrongLetter')
      }
    })
  }
}
