import Keyboard from './Keyboard.js'
import Board from './Board.js'
import utils from './utils'
import Stats from './Stats.js'
import StatsUI from './StatsUI.js'
import Setting from './Setting.js'
const { $ } = utils

export const settings = {
  accessibility: false
}

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

settingsList.forEach(el => {
  if (el.tagName === LIST_ITEM_TAGNAME && el.id !== 'notoggle') {
    const label = el.firstElementChild

    const setting = new Setting(el.id, label)

    switch (el.id) {
      case 'darkModeItem':
        setting.onLoad(isChecked => isChecked && setDarkMode(isChecked))
        setting.onToggle(setDarkMode)
        break
      case 'colorblindItem':
        setting.onLoad(isChecked => isChecked && setColorblindMode(isChecked))
        setting.onToggle(setColorblindMode)
        break
      case 'accessibilityItem':
        setting.onLoad(isChecked => {
          settings.accessibility = isChecked
          isChecked && setAccessibilityMode(isChecked)
        })
        setting.onToggle(isChecked => {
          settings.accessibility = isChecked
          setAccessibilityMode(isChecked)
        })
        break
    }
  }
})

function setDarkMode(value) {
  const html = document.querySelector('html')
  html.toggleAttribute('data-theme', value)
}

function setColorblindMode(value) {
  const html = document.querySelector('html')
  html.toggleAttribute('data-scheme', value)
}

function setAccessibilityMode(value) {
  const html = document.querySelector('html')
  html.toggleAttribute('data-accessibility', value)
}
