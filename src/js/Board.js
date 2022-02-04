import dictionary from './dictionary.js'
import Alert from './Alert.js'
import utils from './utils/index.js'

const { getWordOfTheDay } = utils

export default class Board {
  constructor(params) {
    const { size = 5 } = params
    this.size = size
    this.columnSize = size
    this.rowSize = size + 1
    this.board = []
    this.words = dictionary.filter(word => word.length === this.size)
    this.word = getWordOfTheDay(this.words)

    this.correctLetters = []
    this.almostCorrectLetters = []
    this.wrongLetters = []

    this.alert = new Alert()

    this.pointer = [0, 0]

    this.finished = false

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
    if (this.finished) return

    const [y, x] = this.getPointer()
    if (x === this.columnSize - 1 && y === this.rowSize) return
    if (x === this.columnSize) return

    this.board[y][x] = letter

    const cells = document.querySelectorAll('.cell')

    for (let cell of cells) {
      if (cell.getAttribute('data-x') === String(x) && cell.getAttribute('data-y') === String(y)) {
        cell.classList.add('activeCell')

        const span = document.createElement('span')
        span.innerText = letter
        span.classList.add('cellText')

        cell.appendChild(span)
      }
    }
    this.updatePointer(x => x + 1)
  }

  deleteLetter() {
    if (this.finished) return
    const [y, x] = this.getPointer()
    if (x === 0 && y === 0) return
    if (x === 0) return

    const previousPosition = x - 1

    this.board[y][previousPosition] = ''

    const cell = document.querySelector(`[data-x="${previousPosition}"][data-y="${y}"]`)

    cell.innerHTML = ''
    cell.classList.remove('activeCell')

    this.updatePointer(x => previousPosition)
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
      const actualRow = document.querySelector(`[data-y="${y}"].boardRow`)

      const WRONG_WORD_ANIMATION_DURATION = 600

      actualRow.classList.add('boardRowWrong')

      setTimeout(() => {
        actualRow.classList.remove('boardRowWrong')
      }, WRONG_WORD_ANIMATION_DURATION)
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

    const ANIMATION_DURATION = 250
    const OVERALL_ANIMATION_DURATION = this.columnSize * ANIMATION_DURATION
    const WIN_ANIMATION_DURATION = 1000
    const FINISH_DELAY_ANIMATION_DURATION = 250

    userWordLetters.forEach((letter, index) => {
      const isIncluded = wordLetters.includes(letter)
      const equalIndex = indexes.includes(index)

      const cell = document.querySelector(`[data-x="${index}"][data-y="${y}"]`)

      if (isIncluded && equalIndex) {
        setTimeout(() => {
          cell.classList.add('correctCell')
        }, ANIMATION_DURATION * index)
        this.correctLetters.push(letter)
      } else if (isIncluded && !equalIndex) {
        setTimeout(() => {
          cell.classList.add('almostCorrectCell')
        }, ANIMATION_DURATION * index)
        this.almostCorrectLetters.push(letter)
      } else if (!isIncluded && !equalIndex) {
        setTimeout(() => {
          cell.classList.add('wrongCell')
        }, ANIMATION_DURATION * index)
        this.wrongLetters.push(letter)
      }
    })

    const hasFinished = this.isBoardComplete()

    if (userWord === this.word) {
      this.finished = true

      setTimeout(() => {
        const actualRow = document.querySelector(`[data-y="${y}"].boardRow`)
        actualRow.classList.add('boardRowCorrect')
      }, OVERALL_ANIMATION_DURATION)

      setTimeout(() => {
        openStats()
      }, OVERALL_ANIMATION_DURATION + WIN_ANIMATION_DURATION)

      return
    }

    if (userWord !== this.word && hasFinished) {
      this.finished = true
      setTimeout(() => {
        openStats()
      }, OVERALL_ANIMATION_DURATION + FINISH_DELAY_ANIMATION_DURATION)
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

  isBoardComplete() {
    const board = this.getBoard()

    let hasFinished = false
    for (let row of board) {
      for (let letter of row) {
        if (letter === '') {
          hasFinished = false
          break
        }
        hasFinished = true
      }
    }

    return hasFinished
  }
}

function openStats() {
  const stats = document.querySelector('.statsContainer')
  stats.classList.add('statsContainerActive')
}
