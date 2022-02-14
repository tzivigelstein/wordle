import { deleteButtonSVG } from './deleteButtonSVG.js'
import utils from './utils/index.js'
import keyboardLetters from './keyboardLetters.js'
import { $addClass } from './utils/dom.js'

const { $, $$ } = utils

export default class Keyboard {
  constructor() {
    this.keyboardElement = $('.keyboardContainer')
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

      this.keyboardElement.appendChild(keyboardLettersFragment)
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

  updateLettersStatus(keys) {
    const [correctLetters, almostCorrectLetters, wrongLetters] = keys
    const letters = $$('.keyboardButton')

    letters.forEach(letter => {
      const { innerHTML } = letter

      if (correctLetters.includes(innerHTML)) {
        $addClass(letter, 'correctKeyboardLetter')
      } else if (almostCorrectLetters.includes(innerHTML)) {
        $addClass(letter, 'almostCorrectKeyboardLetter')
      } else if (wrongLetters.includes(innerHTML)) {
        $addClass(letter, 'wrongKeyboardLetter')
      }
    })
  }
}
