export default class Stats {
  constructor() {
    this.played = this.getPlayedMatches()
    this.winRate = this.getWinRate({ played: this.played })
  }

  isTodayGameFinished() {
    const history = this.getHistory()

    if (history.length === 0) return false

    const date = new Date()
    const today = date.toDateString()

    const savedDate = new Date(history[0].date)
    if (today === new Date(savedDate).toDateString()) return true
  }

  getHistory() {
    const HISTORY = 'history'

    return window.localStorage.getItem(HISTORY) ? JSON.parse(window.localStorage.getItem(HISTORY)) : []
  }

  getPlayedMatches() {
    return this.getHistory().length
  }

  getWinRate() {
    const history = this.getHistory()
    const wins = history.filter(match => match.hasWon).length
    const played = history.length

    const winRate = (wins / played) * 100

    const isEven = number => number % 2 === 0

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

    const newHistory = [...history, { id: this.generateId(), date: new Date(), board, wordOfTheDay: word, hasWon }]

    window.localStorage.setItem('history', JSON.stringify(newHistory))
  }

  generateId() {
    return crypto.randomUUID()
  }
}
