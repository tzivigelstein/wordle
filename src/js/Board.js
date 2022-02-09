import dictionary from './dictionary.js'
import Alert from './Alert.js'
import utils from './utils/index.js'
import UI from './UI.js'
import Stats from './Stats.js'
import StatsUI from './StatsUI.js'

const { getWordOfTheDay, getRepeatedLettersIndexes } = utils

export default class Board {
  constructor(params) {
    const { size = 5 } = params
    this.size = size
    this.columnSize = size
    this.rowSize = size + 1
    this.board = []
    this.words = dictionary.filter(word => word.length === this.size)
    this.word = getWordOfTheDay(this.words)
    this.pointer = [0, 0]

    this.correctLetters = []
    this.almostCorrectLetters = []
    this.wrongLetters = []

    this.alert = new Alert()
    this.ui = new UI({ columnSize: this.getColumnSize() })
    this.statsUI = new StatsUI()

    this.stats = new Stats()
    this.finished = this.stats.isTodayGameFinished()

    this.ui.createBoard({ columnSize: this.getColumnSize(), rowSize: this.getRowSize() })
    this.populateBoard()
    this.consoleWord()
  }

  consoleWord() {
    const styles = 'font-size: 1.5rem; font-family: sans-serif; background-color: #09f;'
    console.log(`%cThe word of the day is ${this.word}`, styles)
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

  getColumnSize() {
    return this.columnSize
  }

  getRowSize() {
    return this.rowSize
  }

  getLettersStatus() {
    return [this.correctLetters, this.almostCorrectLetters, this.wrongLetters]
  }

  populateBoard() {
    if (this.finished) {
      const history = this.stats.getHistory()
      const lastBoard = history[history.length - 1].board
      this.board = lastBoard
      this.statsUI.setWordOfTheDay({ word: this.word })
      this.populateUIBoard({ board: lastBoard })
    } else {
      for (let i = 0; i < this.rowSize; i++) {
        const row = []

        for (let j = 0; j < this.columnSize; j++) {
          row.push('')
        }

        this.board.push(row)
      }
    }
  }

  populateUIBoard({ board }) {
    board.forEach((row, y) => {
      row.forEach((letter, x) => {
        if (letter !== '') {
          this.ui.setLetter({ letter, position: { y, x } })
          const compareWords = { firstWord: row, secondWord: this.word.split('') }

          const repeatedLettersIndexes = getRepeatedLettersIndexes(compareWords)
          row.forEach((letter, index) => {
            const isIncluded = this.word.split('').includes(letter)
            const equalIndex = repeatedLettersIndexes.includes(index)

            if (isIncluded && equalIndex) {
              this.ui.setCorrectCell({ x: index, y })
              this.correctLetters.push(letter)
            } else if (isIncluded && !equalIndex) {
              this.ui.setAlmostCorrectCell({ x: index, y })
              this.almostCorrectLetters.push(letter)
            } else if (!isIncluded && !equalIndex) {
              this.ui.setWrongCell({ x: index, y })
              this.wrongLetters.push(letter)
            }
          })
        }
      })
    })
  }

  setLetter(letter) {
    if (this.finished) return

    const [y, x] = this.getPointer()
    if (x === this.columnSize - 1 && y === this.rowSize) return
    if (x === this.columnSize) return

    this.board[y][x] = letter

    this.ui.setLetter({ letter, position: { y, x } })

    this.updatePointer(x => x + 1)
  }

  deleteLetter() {
    if (this.finished) return
    const [y, x] = this.getPointer()
    if (x === 0 && y === 0) return
    if (x === 0) return

    const previousPosition = x - 1

    this.board[y][previousPosition] = ''

    this.ui.removeLetter({ position: { y, x: previousPosition } })

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
      this.ui.setWrongRow({ position: { y } })
      return
    }

    //Check that the word has the correct letters
    const userWordLetters = userWord.split('')
    const wordLetters = this.word.split('')

    const compareWords = { firstWord: userWordLetters, secondWord: wordLetters }

    const repeatedLettersIndexes = getRepeatedLettersIndexes(compareWords)

    userWordLetters.forEach((letter, index) => {
      const isIncluded = wordLetters.includes(letter)
      const equalIndex = repeatedLettersIndexes.includes(index)

      if (isIncluded && equalIndex) {
        this.ui.setCorrectCell({ x: index, y })
        this.correctLetters.push(letter)
      } else if (isIncluded && !equalIndex) {
        this.ui.setAlmostCorrectCell({ x: index, y })
        this.almostCorrectLetters.push(letter)
      } else if (!isIncluded && !equalIndex) {
        this.ui.setWrongCell({ x: index, y })
        this.wrongLetters.push(letter)
      }
    })

    if (this.isWordCorrect({ userWord })) {
      this.finished = true
      this.stats.setPlayedMatch({
        board: this.getBoard(),
        word: this.getWord(),
        hasWon: this.isWordCorrect({ userWord })
      })

      this.ui.setCorrectRow({ position: { y } })
      this.statsUI.setPlayed({ played: this.stats.getPlayedMatches() })
      this.statsUI.setWinRate({ winRate: this.stats.getWinRate() })
      this.statsUI.setWordOfTheDay({ word: this.word })
      this.statsUI.setFavoriteWords({ favoriteWords: this.stats.getFavoriteWords() })
      this.ui.openStatsPage()

      return
    }

    if (!this.isWordCorrect({ userWord }) && this.isBoardFull()) {
      this.finished = true
      this.stats.setPlayedMatch({
        board: this.getBoard(),
        word: this.getWord(),
        hasWon: this.isWordCorrect({ userWord })
      })

      this.statsUI.setPlayed({ played: this.stats.getPlayedMatches() })
      this.statsUI.setWinRate({ winRate: this.stats.getWinRate() })
      this.statsUI.setWordOfTheDay({ word: this.word })
      this.statsUI.setFavoriteWords({ favoriteWords: this.stats.getFavoriteWords() })
      this.ui.openStatsPage()
    }

    this.pointer = [y + 1, 0]
  }

  isWordCorrect({ userWord }) {
    return userWord === this.word
  }

  isBoardFull() {
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
