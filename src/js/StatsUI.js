import utils from './utils'

const { $ } = utils

export default class StatsUI {
  constructor() {}

  setPlayed(played) {
    const playedElement = $('#played')
    playedElement.innerText = played
  }

  setWinRate(winRate) {
    const playedElement = $('#winRate')
    playedElement.innerText = `${winRate}%`
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
    const stats = $('.statsContainer')
    stats.classList.add('statsContainerActive')
  }

  setFavoriteWords(favoriteWords) {
    if (favoriteWords.length === 0) return

    const favoriteWordsWrapper = $('.favoriteWordsWrapper')
    const favoriteWordsContainer = $('.favoriteWordsContainer')
    const statsTitleElement = $('.statsTitle')

    let statsTitle = statsTitleElement
    if (statsTitleElement === null) {
      statsTitle = document.createElement('h3')
    }

    favoriteWordsContainer.innerHTML = ''

    statsTitle.classList.add('statsTitle')
    statsTitle.innerText = 'Palabras favoritas'

    favoriteWords.forEach((word, index) => {
      const favoriteWordElement = this.createFavoriteWordElement({
        word,
        index,
      })
      favoriteWordsContainer.appendChild(favoriteWordElement)
    })

    favoriteWordsWrapper.insertBefore(statsTitle, favoriteWordsContainer)
  }

  createFavoriteWordElement({ word: { word, count }, index }) {
    const favoriteWordElement = document.createElement('li')
    favoriteWordElement.classList.add('favoriteWordElement')

    const favoriteWordContainer = document.createElement('div')
    favoriteWordContainer.classList.add('favoriteWordContainer')

    const listCount = document.createElement('span')
    listCount.classList.add('listCount')
    listCount.innerText = `#${index + 1} `

    const favoriteWord = document.createElement('span')
    favoriteWord.classList.add('favoriteWord')
    favoriteWord.innerText = word

    favoriteWordContainer.appendChild(listCount)
    favoriteWordContainer.appendChild(favoriteWord)

    const usedTimes = document.createElement('span')
    usedTimes.classList.add('usedTimes')
    usedTimes.innerText = count

    favoriteWordElement.appendChild(favoriteWordContainer)
    favoriteWordElement.appendChild(usedTimes)

    return favoriteWordElement
  }

  setNextWordTimer({ time }) {
    const nextWordTimerContainer = $('.nextWordTimerContainer')
    const nextWordTimerElement = $('.nextWordTimer')

    let nextWordTimer = nextWordTimerElement

    if (nextWordTimerElement === null) {
      const title = document.createElement('h3')
      title.classList.add('nextWordTitle')
      title.innerText = 'Siguiente palabra'

      nextWordTimer = document.createElement('span')
      nextWordTimer.classList.add('nextWordTimer')
      nextWordTimerContainer.appendChild(title)
      nextWordTimerContainer.appendChild(nextWordTimer)
    }

    nextWordTimer.innerText = time
  }
}
