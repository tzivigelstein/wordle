import { deleteButtonSVG } from './deleteButtonSVG.js'
import utils from './utils/index.js'
import keyboardLetters from './utils/keyboardLetters.js'
import { $addClassAndRemove } from './utils/dom.js'

const { $, $$ } = utils

const SPECIAL_CHARACTERS = {
  BACKSPACE: {
    id: 28,
    name: "Backspace"
  },
  ENTER: {
    id: 20,
    name: "Enter"
  }
}

export default class Keyboard {
  constructor() {
    this.keyboardElement = $('.keyboardContainer')
    this.initKeyboard()
    this.initListener()
  }

  initKeyboard() {
    keyboardLetters.forEach((row, index) => {
      const keyboardLettersFragment = document.createElement('div')
      keyboardLettersFragment.classList.add('keyboardRow')
      row.forEach((letter) => {
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
      letterButton.name = letter
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

  initListener() {
    window.addEventListener('keydown', (e) => {
      const { BACKSPACE, ENTER } = SPECIAL_CHARACTERS

      const key = e.key
      const lowerCasedKey = key.toLowerCase()
      const letter = document.querySelector(`[name="${lowerCasedKey}"]`)

      if (letter) {
        letter.click()
      } else if (key === BACKSPACE.name && e.ctrlKey) {
        for (let i = 0; i <= 5; i++) {
          document.getElementById(BACKSPACE.id).click()
        }
      } else if (key === BACKSPACE.name) {
        document.getElementById(BACKSPACE.id).click()
      } else if (key === ENTER.name) {
        document.getElementById(ENTER.id).click()
      }
    })
  }

  onClick(callback) {
    const htmlButtons = $$('.keyboardButton')
    htmlButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        callback({ letter: e.target.innerHTML, id: e.target.id })
      })
    })
  }

  updateLettersStatus(keys) {
    const [correctLetters, almostCorrectLetters, wrongLetters] = keys
    const letters = $$('.keyboardButton')

    letters.forEach((letter) => {
      const { innerHTML } = letter

      if (correctLetters.includes(innerHTML)) {
        $addClassAndRemove(letter, ['correctKeyboardLetter'], ["wrongKeyboardLetter", "almostCorrectKeyboardLetter"])
      } else if (almostCorrectLetters.includes(innerHTML)) {
        $addClassAndRemove(letter, ['almostCorrectKeyboardLetter'], ["wrongKeyboardLetter", "correctKeyboardLetter"])
      } else if (wrongLetters.includes(innerHTML)) {
        $addClassAndRemove(letter, ['wrongKeyboardLetter'], ["correctKeyboardLetter", "almostCorrectKeyboardLetter"])
      }
    })
  }
}
