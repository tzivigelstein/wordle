import dictionary from './dictionary.js'
import Alert from './Alert.js'

export default class Board {
  constructor(params) {
    const { size = 5 } = params
    this.size = size
    this.columnSize = size
    this.rowSize = size + 1
    this.board = []
    this.words = dictionary.filter(word => word.length === this.size)
    this.random = Math.floor(Math.random() * this.words.length)
    this.word = this.words[this.random]

    this.correctLetters = []
    this.almostCorrectLetters = []
    this.wrongLetters = []

    this.alert = new Alert()

    this.pointer = [0, 0]

    this.populateBoard()
  }

  getWord() {
    return this.word
  }

  getBoard() {
    return this.board
  }

  getPointer() {
    return this.pointer
  }

  getLettersStatus() {
    return [this.correctLetters, this.almostCorrectLetters, this.wrongLetters]
  }

  populateBoard() {
    for (let i = 0; i < this.rowSize; i++) {
      const row = []

      for (let j = 0; j < this.columnSize; j++) {
        row.push('')
      }

      this.board.push(row)
    }
  }

  setLetter(letter) {
    const [y, x] = this.getPointer()
    if (x === this.columnSize - 1 && y === this.rowSize) return
    if (x === this.columnSize) return

    this.board[y][x] = letter

    const cells = document.querySelectorAll('.cell')

    for (let cell of cells) {
      if (cell.getAttribute('data-x') === String(x) && cell.getAttribute('data-y') === String(y)) {
        cell.classList.add('activeCell', 'pop')

        const span = document.createElement('span')
        span.innerText = letter
        span.classList.add('cellText')

        cell.appendChild(span)
      }
    }
    this.updatePointer(x => x + 1)
  }

  deleteLetter() {
    const [y, x] = this.getPointer()
    if (x === 0 && y === 0) return
    if (x === 0) return

    const cell = document.querySelector(`[data-x="${x - 1}"][data-y="${y}"]`)

    cell.innerHTML = ''
    cell.classList.remove('activeCell', 'pop')

    this.updatePointer(x => x - 1)
  }

  updatePointer(callback) {
    const [y, x] = this.getPointer()
    if (this.rowSize - 1 >= y) {
      this.pointer = [y, callback(x)]
    }
  }

  nextWord() {
    const [y] = this.getPointer()
    const userWord = this.getBoard()[y].join('')

    //Check that the word has $size letters
    if (userWord.length !== this.size) return

    //Check that the word is in the dictionary
    if (!this.words.includes(userWord)) {
      this.alert.triggerAlert({ message: 'La palabra no está en el diccionario', type: 'error' })
      return
    }

    //Check that the word has the correct letters
    const userWordLetters = userWord.split('')
    const wordLetters = this.word.split('')

    const indexes = []

    for (let i = 0; i < userWordLetters.length; i++) {
      if (userWordLetters[i] === wordLetters[i]) {
        indexes.push(i)
      }
    }

    userWordLetters.forEach((letter, index) => {
      const isIncluded = wordLetters.includes(letter)
      const equalIndex = indexes.includes(index)

      const cell = document.querySelector(`[data-x="${index}"][data-y="${y}"]`)

      if (isIncluded && equalIndex) {
        cell.classList.add('correctCell')
        this.correctLetters.push(letter)
      } else if (isIncluded && !equalIndex) {
        cell.classList.add('almostCorrectCell')
        this.almostCorrectLetters.push(letter)
      } else if (!isIncluded && !equalIndex) {
        cell.classList.add('wrongCell')
        this.wrongLetters.push(letter)
      }
    })

    if (userWord === this.word) {
      this.alert.triggerAlert({ message: 'La palabra es correcta', type: 'success' })
      return
    }

    this.pointer = [y + 1, 0]
  }

  initBoard() {
    const board = document.querySelector('.board')
    const boardFragment = document.createDocumentFragment()

    for (let i = 0; i < this.rowSize; i++) {
      const row = document.createElement('div')
      row.classList.add('boardRow')
      row.setAttribute('data-y', i)

      for (let j = 0; j < this.columnSize; j++) {
        const cell = document.createElement('div')
        cell.classList.add('cell')
        cell.setAttribute('data-x', j)
        cell.setAttribute('data-y', i)
        row.appendChild(cell)
      }

      boardFragment.appendChild(row)
    }

    board.appendChild(boardFragment)
  }
}
