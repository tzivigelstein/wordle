import { $, $$ } from './utils/documentSelectors'

export default class UI {
  constructor({ columnSize }) {
    this.ANIMATION_DURATION = 200
    this.FINISH_DELAY_ANIMATION_DURATION = 250
    this.OVERALL_ANIMATION_DURATION = columnSize * this.ANIMATION_DURATION
    this.WIN_ANIMATION_DURATION = 1000
  }

  createBoard({ rowSize, columnSize }) {
    const board = document.querySelector('.board')
    const boardFragment = document.createDocumentFragment()

    for (let i = 0; i < rowSize; i++) {
      const row = document.createElement('div')
      row.classList.add('boardRow')
      row.setAttribute('data-y', i)

      for (let j = 0; j < columnSize; j++) {
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

  getAllLetterCells() {
    return $$('.cell')
  }

  setLetter({ letter, position }) {
    const { y, x } = position
    const cells = this.getAllLetterCells()

    for (let cell of cells) {
      if (cell.getAttribute('data-x') === String(x) && cell.getAttribute('data-y') === String(y)) {
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

    const cell = document.querySelector(`[data-x="${x}"][data-y="${y}"]`)

    cell.innerHTML = ''
    cell.classList.remove('activeCell')
  }

  setCorrectRow({ position }) {
    const { y } = position
    setTimeout(() => {
      const actualRow = document.querySelector(`[data-y="${y}"].boardRow`)
      actualRow.classList.add('boardRowCorrect')
    }, this.OVERALL_ANIMATION_DURATION)
  }

  setWrongRow({ position }) {
    const { y } = position
    const WRONG_WORD_ANIMATION_DURATION = 600

    const row = document.querySelector(`[data-y="${y}"].boardRow`)

    row.classList.add('boardRowWrong')

    setTimeout(() => {
      row.classList.remove('boardRowWrong')
    }, WRONG_WORD_ANIMATION_DURATION)
  }

  setCorrectCell({ x, y }) {
    const cell = document.querySelector(`[data-x="${x}"][data-y="${y}"]`)

    setTimeout(() => {
      cell.classList.add('correctCell')
    }, this.ANIMATION_DURATION * x)
  }

  setAlmostCorrectCell({ x, y }) {
    const cell = document.querySelector(`[data-x="${x}"][data-y="${y}"]`)

    setTimeout(() => {
      cell.classList.add('almostCorrectCell')
    }, this.ANIMATION_DURATION * x)
  }

  setWrongCell({ x, y }) {
    const cell = document.querySelector(`[data-x="${x}"][data-y="${y}"]`)

    setTimeout(() => {
      cell.classList.add('wrongCell')
    }, this.ANIMATION_DURATION * x)
  }

  setWordOfTheDay({ word }) {
    const wordOfTheDayContainer = $('.wordOfTheDayContainer')

    const wordOfTheDayElement = this.createWordOfTheDayElement({ word })

    wordOfTheDayContainer.appendChild(wordOfTheDayElement)
  }

  createWordOfTheDayElement({ word }) {
    const wordOfTheDayParagraph = document.createElement('p')
    wordOfTheDayParagraph.classList.add('wordOfTheDayParagraph')
    wordOfTheDayParagraph.innerText = 'La palabra era: '

    const wordOfTheDay = document.createElement('span')
    wordOfTheDay.classList.add('wordOfTheDay')
    wordOfTheDay.innerText = word

    wordOfTheDayParagraph.appendChild(wordOfTheDay)

    return wordOfTheDayParagraph
  }

  openStatsPage() {
    const stats = document.querySelector('.statsContainer')
    setTimeout(() => {
      stats.classList.add('statsContainerActive')
    }, this.OVERALL_ANIMATION_DURATION + this.WIN_ANIMATION_DURATION)
  }
}
