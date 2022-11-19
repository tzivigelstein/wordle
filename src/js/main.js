import Keyboard from './Keyboard'
import Board from './Board'
import utils from './utils'
import Stats from './Stats'
import StatsUI from './StatsUI'
import Setting from './Setting'
import {
  loadAccessibilityMode,
  loadColorblindMode,
  loadDarkMode,
} from './utils/loadSettings'
const { $ } = utils

export const settings = {
  accessibility: false,
}

const board = new Board({})
const statsUI = new StatsUI()
const stats = new Stats()

statsUI.setPlayed(stats.getPlayedMatches())
statsUI.setWinRate(stats.getWinRate())
statsUI.setFavoriteWords(stats.getFavoriteWords())

const keyboard = new Keyboard()

keyboard.updateLettersStatus(board.getLettersStatus())

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

const settingsContainer = $('.settingsContainer')
const openSettingsButton = $('#openSettingsButton')
const closeSettingsButton = $('#closeSettingsButton')

openSettingsButton.addEventListener('click', () => {
  settingsContainer.classList.add('settingsContainerActive')
})

closeSettingsButton.addEventListener('click', () => {
  settingsContainer.classList.remove('settingsContainerActive')
})

const settingsList = $('.settingsList').childNodes

const LIST_ITEM_TAGNAME = 'LI'

settingsList.forEach((el) => {
  if (el.tagName === LIST_ITEM_TAGNAME && el.id !== 'notoggle') {
    const label = el.firstElementChild

    const setting = new Setting(el.id, label)
    const CASES = {
      darkModeItem: loadDarkMode,
      colorblindItem: loadColorblindMode,
      accessibilityItem: loadAccessibilityMode,
    }

    CASES[el.id](setting)
  }
})
