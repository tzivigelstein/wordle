import Alert from './Alert'
import { settings } from './main'
import StatsUI from './StatsUI'
import getRepeatedLettersIndexes from './utils/getRepeatedLettersIndexes'
import utils from './utils/index.js'

const { $, $$ } = utils

export default class BoardUI {
  constructor(props) {
    const { columnSize, word } = props

    this.word = word

    this.ANIMATION_DURATION = 200
    this.FINISH_DELAY_ANIMATION_DURATION = 250
    this.OVERALL_ANIMATION_DURATION = columnSize * this.ANIMATION_DURATION
    this.WIN_ANIMATION_DURATION = 1000
    this.WRONG_WORD_ANIMATION_DURATION = 600

    this.alert = new Alert()
  }

  createBoard({ rowSize, columnSize }) {
    const board = $('.board')
    const boardFragment = document.createDocumentFragment()

    for (let rowIndex = 0; rowIndex < rowSize; rowIndex++) {
      const row = document.createElement('div')
      row.classList.add('boardRow')
      row.setAttribute('data-y', rowIndex)

      for (let columnIndex = 0; columnIndex < columnSize; columnIndex++) {
        const cell = document.createElement('div')
        cell.classList.add('cell')
        cell.setAttribute('data-x', columnIndex)
        cell.setAttribute('data-y', rowIndex)
        row.appendChild(cell)
      }

      boardFragment.appendChild(row)
    }

    board.appendChild(boardFragment)
  }

  populateBoard({ board }) {
    board.forEach((row, y) => {
      row.forEach((letter, x) => {
        if (this.isValidLetter(letter)) {
          this.setLetter({ letter, position: { y, x } })
          const compareWords = { firstWord: row, secondWord: this.word.split('') }

          const repeatedLettersIndexes = getRepeatedLettersIndexes(compareWords)
          row.forEach((letter, index) => {
            const isIncluded = this.word.split('').includes(letter)
            const equalIndex = repeatedLettersIndexes.includes(index)

            if (isIncluded && equalIndex) {
              this.setCellStatus({ x: index, y, className: 'correctCell' })
              // this.correctLetters.push(letter)
            } else if (isIncluded && !equalIndex) {
              this.setCellStatus({ x: index, y, className: 'almostCorrectCell' })
              // this.almostCorrectLetters.push(letter)
            } else if (!isIncluded && !equalIndex) {
              this.setCellStatus({ x: index, y, className: 'wrongCell' })
              // this.wrongLetters.push(letter)
            }
          })
        }
      })
    })
  }

  isValidLetter(letter) {
    return letter !== ''
  }

  getAllLetterCells() {
    return $$('.cell')
  }

  setLetter({ letter, position }) {
    const { y, x } = position
    const cells = this.getAllLetterCells()

    for (let cell of cells) {
      if (cell.getAttribute('data-x') == x && cell.getAttribute('data-y') == y) {
        cell.classList.add('activeCell')

        const span = document.createElement('span')
        span.innerText = letter
        span.classList.add('cellText')

        cell.appendChild(span)
      }
    }
  }

  removeLetter({ position }) {
    const { y, x } = position

    const cell = $(`[data-x="${x}"][data-y="${y}"]`)

    cell.innerHTML = ''
    cell.classList.remove('activeCell')
  }

  setCorrectRow({ position }) {
    const { y } = position
    setTimeout(() => {
      const actualRow = $(`[data-y="${y}"].boardRow`)
      actualRow.classList.add('boardRowCorrect')
    }, this.OVERALL_ANIMATION_DURATION)
  }

  setWrongRow({ position }) {
    const { y } = position

    const row = $(`[data-y="${y}"].boardRow`)

    row.classList.add('boardRowWrong')

    setTimeout(() => {
      row.classList.remove('boardRowWrong')
    }, this.WRONG_WORD_ANIMATION_DURATION)
  }

  setCellStatus({ x, y, className }) {
    const cell = $(`[data-x="${x}"][data-y="${y}"]`)

    const MESSAGES = {
      correctCell: letter => `La letra ${letter} está en la palabra y en la posición correcta`,
      almostCorrectCell: letter => `La letra ${letter} está en la palabra pero en la posición incorrecta`,
      wrongCell: letter => `La letra ${letter} no está en la palabra`
    }

    cell.addEventListener('click', () => {
      const letter = cell.innerText
      settings.accessibility &&
        this.alert.triggerAlert({
          message: MESSAGES[className](letter),
          type: 'info'
        })
    })

    setTimeout(() => {
      cell.classList.add(className)
    }, this.ANIMATION_DURATION * x)
  }

  openStatsPage() {
    const statsUI = new StatsUI()
    setTimeout(() => {
      statsUI.openStatsPage()
    }, this.OVERALL_ANIMATION_DURATION + this.WIN_ANIMATION_DURATION)
  }
}
