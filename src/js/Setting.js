export const TYPES = {
  TOGGLE: "toggle",
  BUTTON: "button"
}

export default class Setting {
  constructor(type, el) {
    this.type = type
    this.el = el
    this.type = type

    if (type === TYPES.TOGGLE) {
      this.isChecked = this.getInitialState()
    }

    window.localStorage.setItem("hasPlayedBefore", true)
  }

  deleteLocalStorage() {
    window.localStorage.removeItem("history")
  }

  getInitialState() {
    return window.localStorage.getItem(this.type) === 'true'
  }

  toggleChecked(isChecked, config = { save: true }) {
    const { save } = config

    this.isChecked = isChecked
    save && this.saveToLocalStorage()
  }

  saveToLocalStorage() {
    window.localStorage.setItem(this.type, this.isChecked)
  }

  setInputActive(params) {
    const input = this.el.querySelector('.hiddenInput')
    const button = this.el.querySelector('.settingButton')
    const buttonCircle = button.firstElementChild

    const isChecked = params?.force || input.checked
    if (isChecked) input.checked = true

    button.classList.toggle('settingButtonActive', isChecked)
    buttonCircle.classList.toggle('settingButtonCircleActive', isChecked)

    return isChecked
  }

  onToggle(callback, config) {
    this.el.addEventListener('click', () => {
      const isCheked = this.setInputActive()
      this.toggleChecked(isCheked, config)
      callback(this.isChecked)
    })
  }

  onClick(callback) {
    this.el.addEventListener("click", () => {
      callback()
    })
  }

  onLoad(callback) {
    this.setInputActive({ force: this.isChecked })
    callback(this.isChecked)
  }
}
