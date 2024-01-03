import { settings } from '../main'
import {
  setDarkMode,
  setColorblindMode,
  setAccessibilityMode,
} from './setSettings'

export const loadDarkMode = (setting) => {
  setting.onLoad(setDarkMode)
  setting.onToggle(setDarkMode)
}

export const loadColorblindMode = (setting) => {
  setting.onLoad(setColorblindMode)
  setting.onToggle(setColorblindMode)
}

export const loadAccessibilityMode = (setting) => {
  setting.onLoad((isChecked) => {
    settings.accessibility = isChecked
    setAccessibilityMode(isChecked)
  })
  setting.onToggle((isChecked) => {
    settings.accessibility = isChecked
    setAccessibilityMode(isChecked)
  })
}

export const deleteLocalStorage = (setting) => {
  setting.onClick(setting.deleteLocalStorage)
}
