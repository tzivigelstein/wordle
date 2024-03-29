import utils from './utils/index.js'

const { isBoardFull } = utils

export default class Stats {
  constructor() {
    this.played = this.getPlayedMatches()
    this.winRate = this.getWinRate({ played: this.played })
  }

  isTodayGameFinished() {
    const history = this.getHistory()

    if (history.length === 0) return false

    const lastIndex = history.length - 1
    const lastGame = history[lastIndex]

    const { board, hasWon, date } = lastGame

    const today = new Date().toLocaleDateString()
    const gameDate = new Date(date).toLocaleDateString()

    if (today !== gameDate) return false

    return isBoardFull({ board }) || hasWon
  }

  hasTodayGameStarted() {
    const history = this.getHistory()

    if (history.length === 0) return false

    const lastIndex = history.length - 1
    const lastGame = history[lastIndex]

    const { board, hasWon, date } = lastGame

    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)
    const boardDateWithoutTime = new Date(date)
    boardDateWithoutTime.setHours(0, 0, 0, 0)

    const boardIsNotFromToday = currentDate.getTime() !== boardDateWithoutTime.getTime()

    if (boardIsNotFromToday) return false

    return !isBoardFull({ board }) && !hasWon
  }

  getHistory() {
    const HISTORY = 'history'

    return window.localStorage.getItem(HISTORY)
      ? JSON.parse(window.localStorage.getItem(HISTORY))
      : []
  }

  getPlayedMatches() {
    const history = this.getHistory()
    const playedMatches = history.filter(
      (match) => match.hasWon || isBoardFull({ board: match.board })
    )
    return playedMatches.length
  }

  getWinRate() {
    const history = this.getHistory()
    const wins = history.filter((match) => match.hasWon).length
    const played = history.length

    const winRate = (wins / played) * 100

    const isEven = (number) => number % 2 === 0

    return isNaN(winRate) ? 0 : winRate.toFixed(isEven(winRate) ? 0 : 1)
  }

  getFavoriteWords() {
    const history = this.getHistory()

    const topFavoriteWords = ({ top, history }) => {
      const allWords = history.reduce((acc, { board }) => {
        const words = board.reduce((acc, row) => {
          if (row.includes('')) return [...acc]

          const word = row.join('')
          return [...acc, word]
        }, [])

        return acc.concat(words)
      }, [])

      const topWords = allWords
        .reduce((acc, word) => {
          const index = acc.findIndex(({ word: w }) => w === word)
          if (index !== -1) {
            acc[index].count++
          } else {
            acc.push({ word, count: 1 })
          }

          return acc
        }, [])
        .sort((a, b) => b.count - a.count)
        .slice(0, top)

      return topWords
    }

    return topFavoriteWords({ top: 3, history })
  }

  setPlayedMatch({ board, word, hasWon }) {
    const history = this.getHistory()

    const newHistory = [
      ...history,
      {
        id: this.generateId(),
        date: new Date(),
        board,
        wordOfTheDay: word,
        hasWon,
      },
    ]

    window.localStorage.setItem('history', JSON.stringify(newHistory))
  }

  updateMatch({ board, hasWon }) {
    const history = this.getHistory()

    const lastIndex = history.length - 1
    const lastGame = history[lastIndex]

    const { id } = lastGame

    const newHistory = history.map((match) => {
      if (match.id === id) {
        const newHasWon = hasWon !== undefined ? hasWon : match.hasWon
        return { ...match, board, hasWon: newHasWon }
      }

      return match
    })

    window.localStorage.setItem('history', JSON.stringify(newHistory))
  }

  generateId() {
    return crypto.randomUUID()
  }

  getNextWordTime() {
    const ONE_DAY = 1
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + ONE_DAY)

    tomorrow.setHours(0, 0, 0, 0)

    const secondsBetweenDays = tomorrow.getTime() - today.getTime()

    const hours = Math.floor(secondsBetweenDays / (1000 * 60 * 60))
    const minutes = Math.floor(
      (secondsBetweenDays % (1000 * 60 * 60)) / (1000 * 60)
    )
    const seconds = Math.floor((secondsBetweenDays % (1000 * 60)) / 1000)

    const time = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes
      }:${seconds < 10 ? '0' + seconds : seconds}`

    return time
  }
}
