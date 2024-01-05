import dictionary from './dictionary.js'
import Alert from './Alert.js'
import utils from './utils/index.js'
import BoardUI from './BoardUI.js'
import Stats from './Stats.js'
import StatsUI from './StatsUI.js'
import confetti from 'canvas-confetti'

const { getWordOfTheDay, isBoardFull, getRepeatedLettersIndexes } = utils

export default class Board {
  constructor(params) {
    const { size = 5 } = params
    this.size = size
    this.columnSize = size
    this.rowSize = size + 1
    this.board = []
    this.words = dictionary
    this.word = getWordOfTheDay()
    this.pointer = [0, 0]

    this.correctLetters = []
    this.almostCorrectLetters = []
    this.wrongLetters = []

    this.alert = new Alert()
    this.boardUI = new BoardUI({
      columnSize: this.getColumnSize(),
      word: this.word,
    })
    this.statsUI = new StatsUI()

    this.stats = new Stats()
    this.finished = this.stats.isTodayGameFinished()
    this.started = this.stats.hasTodayGameStarted()

    this.boardUI.createBoard({
      columnSize: this.getColumnSize(),
      rowSize: this.getRowSize(),
    })
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
    const history = this.stats.getHistory()
    const lastEntry = history[history.length - 1]
    const lastBoard = lastEntry.board
    this.board = lastBoard

    const currentDate = new Date()
    const boardDateWithoutTime = new Date(lastEntry.date)
    boardDateWithoutTime.setHours(0, 0, 0, 0)

    const boardHasExpired = currentDate.getTime() > boardDateWithoutTime.getTime()

    if (this.finished) {
      this.statsUI.setWordOfTheDay(this.word)
      //TODO refactor to an async interval
      setInterval(() => {
        this.statsUI.setNextWordTimer({ time: this.stats.getNextWordTime() })
      }, 1000)

      this.setKeyboardLettersStatus()

      this.boardUI.populateBoard({ board: lastBoard })
    } else if (!this.finished && this.started && !boardHasExpired) {
      this.boardUI.populateBoard({ board: lastBoard })

      this.setKeyboardLettersStatus()

      this.pointer = this.getFirstIndexPointer(lastBoard)
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

  getFirstIndexPointer(board) {
    const rowIndex = board.findIndex((row) => row.includes(''))
    const columnIndex = board[rowIndex].findIndex((letter) => letter === '')

    return [rowIndex, columnIndex]
  }

  setKeyboardLettersStatus() {
    this.board.forEach((row) => {
      row.forEach((letter) => {
        if (this.isValidLetter(letter)) {
          const repeatedLettersIndexes = getRepeatedLettersIndexes(
            row,
            this.word
          )
          row.forEach((letter, index) => {
            const isIncluded = this.word.split('').includes(letter)
            const equalIndex = repeatedLettersIndexes.includes(index)

            if (
              isIncluded &&
              equalIndex &&
              !this.correctLetters.includes(letter)
            ) {
              this.correctLetters.push(letter)
            } else if (
              isIncluded &&
              !equalIndex &&
              !this.almostCorrectLetters.includes(letter)
            ) {
              this.almostCorrectLetters.push(letter)
            } else if (
              !isIncluded &&
              !equalIndex &&
              !this.wrongLetters.includes(letter)
            ) {
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

    this.boardUI.setLetter({ letter, position: { y, x } })

    this.updatePointer((x) => x + 1)
  }

  deleteLetter() {
    if (this.finished) return
    const [y, x] = this.getPointer()
    if (x === 0 && y === 0) return
    if (x === 0) return

    const previousPosition = x - 1

    this.board[y][previousPosition] = ''

    this.boardUI.removeLetter({ position: { y, x: previousPosition } })

    this.updatePointer((x) => x - 1)
  }

  updatePointer(callback) {
    const [y, x] = this.getPointer()
    if (this.rowSize - 1 >= y) {
      this.pointer = [y, callback(x)]
    }
  }

  isValidLetter(letter) {
    return letter !== ''
  }

  nextWord() {
    if (this.finished) return

    const [y] = this.getPointer()
    const userWord = this.getUserWord({ rowIndex: y })

    //Check that the word has $size letters
    if (this.isProperLength({ userWord })) return

    //Check that the word is in the dictionary
    if (!this.isWordAccepted({ userWord })) {
      const alertConfig = {
        message: 'La palabra no está en el diccionario',
        type: 'error',
      }

      this.alert.triggerAlert(alertConfig)
      this.boardUI.setWrongRow({ position: { y } })

      return
    }

    //Check that the word has the correct letters
    const userWordLetters = userWord.split('')
    const wordLetters = this.word

    const repeatedLettersIndexes = getRepeatedLettersIndexes(
      userWordLetters,
      wordLetters
    )

    userWordLetters.forEach((letter, index) => {
      const isIncluded = wordLetters.includes(letter)
      const hasEqualIndex = repeatedLettersIndexes.includes(index)

      if (isIncluded && hasEqualIndex) {
        this.boardUI.setCellStatus({ x: index, y, className: 'correctCell' })
        this.correctLetters.push(letter)
      } else if (isIncluded && !hasEqualIndex) {
        this.boardUI.setCellStatus({
          x: index,
          y,
          className: 'almostCorrectCell',
        })
        this.almostCorrectLetters.push(letter)
      } else if (!isIncluded && !hasEqualIndex) {
        this.boardUI.setCellStatus({ x: index, y, className: 'wrongCell' })
        this.wrongLetters.push(letter)
      }
    })

    if (
      this.isWordCorrect({ userWord }) ||
      isBoardFull({ board: this.getBoard() })
    ) {
      this.setFinished(true)

      if (this.stats.hasTodayGameStarted()) {
        this.stats.updateMatch({
          board: this.getBoard(),
          hasWon: this.isWordCorrect({ userWord }),
        })
      } else {
        this.stats.setPlayedMatch({
          board: this.getBoard(),
          word: this.getWord(),
          hasWon: this.isWordCorrect({ userWord }),
        })
      }

      this.statsUI.setPlayed(this.stats.getPlayedMatches())
      this.statsUI.setWinRate(this.stats.getWinRate())
      this.statsUI.setWordOfTheDay(this.word)
      this.statsUI.setFavoriteWords(this.stats.getFavoriteWords())

      setInterval(() => {
        this.statsUI.setNextWordTimer({ time: this.stats.getNextWordTime() })
      }, 1000)
    }

    if (this.isWordCorrect({ userWord })) {
      this.boardUI.setCorrectRow({ position: { y } })
      this.boardUI.openStatsPage()
      confetti()

      return
    }

    if (
      !this.isWordCorrect({ userWord }) &&
      isBoardFull({ board: this.getBoard() })
    ) {
      this.boardUI.openStatsPage()

      return
    }

    // Neither finished or full
    if (this.stats.hasTodayGameStarted()) {
      this.stats.updateMatch({
        board: this.getBoard(),
      })
    } else {
      this.stats.setPlayedMatch({
        board: this.getBoard(),
        word: this.getWord(),
        hasWon: this.isWordCorrect({ userWord }),
      })
    }

    this.pointer = [y + 1, 0]
  }

  setFinished(finished) {
    this.finished = finished
  }

  isProperLength({ userWord }) {
    return userWord.length !== this.size
  }

  isWordAccepted({ userWord }) {
    return this.words.includes(userWord)
  }

  getUserWord({ rowIndex }) {
    return this.getBoard()[rowIndex].join('')
  }

  isWordCorrect({ userWord }) {
    return userWord === this.word
  }
}
