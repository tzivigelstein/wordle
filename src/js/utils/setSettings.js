import { $ } from './dom'

export const setDarkMode = (value) => {
  const html = $('html')
  html.toggleAttribute('data-theme', value)
}

export const setColorblindMode = (value) => {
  const html = $('html')
  html.toggleAttribute('data-scheme', value)
}

export const setAccessibilityMode = (value) => {
  const html = $('html')
  html.toggleAttribute('data-accessibility', value)
}
