import Keyboard from './Keyboard.js'
import Board from './Board.js'
import utils from './utils'
import Stats from './Stats.js'
import StatsUI from './StatsUI.js'

const { $ } = utils

const board = new Board({})
const statsUI = new StatsUI()
const stats = new Stats()

statsUI.setPlayed({ played: stats.getPlayedMatches() })
statsUI.setWinRate({ winRate: stats.getWinRate() })
statsUI.setFavoriteWords({ favoriteWords: stats.getFavoriteWords() })

const keyboard = new Keyboard()

keyboard.onClick(({ letter, id }) => {
  const intID = parseInt(id)
  const SEND_BUTTON_ID = 20
  const DELETE_BUTTON_ID = 28

  if (intID === SEND_BUTTON_ID) {
    board.nextWord()
    keyboard.updateLettersStatus(board.getLettersStatus())
  } else if (intID === DELETE_BUTTON_ID) {
    board.deleteLetter()
  } else {
    board.setLetter(letter)
  }
})

const rulesContainer = $('.rulesContainer')
const rulesOpenButton = $('#rulesButton')
const rulesCloseButton = $('#closeRulesButton')

const footerButton = $('.footerButton')

const history = stats.getHistory()

if (history.length === 0) {
  rulesContainer.classList.add('rulesContainerActive')
}

rulesOpenButton.addEventListener('click', () => {
  rulesContainer.classList.add('rulesContainerActive')
})

rulesCloseButton.addEventListener('click', () => {
  rulesContainer.classList.remove('rulesContainerActive')
})

footerButton.addEventListener('click', () => {
  rulesContainer.classList.remove('rulesContainerActive')
})

const statsContainer = $('.statsContainer')
const statsOpenButton = $('#statsButton')
const statsCloseButton = $('#closeStatsButton')

statsOpenButton.addEventListener('click', () => {
  statsContainer.classList.add('statsContainerActive')
})

statsCloseButton.addEventListener('click', () => {
  statsContainer.classList.remove('statsContainerActive')
})
