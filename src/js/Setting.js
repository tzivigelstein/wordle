export default class Setting {
  constructor(id, el) {
    this.id = id
    this.isChecked = this.getInitialState()
    this.el = el
  }

  getInitialState() {
    return window.localStorage.getItem(this.id) === 'true'
  }

  toggleChecked(isChecked, config = { save: true }) {
    const { save } = config

    this.isChecked = isChecked
    save && this.saveToLocalStorage()
  }

  saveToLocalStorage() {
    window.localStorage.setItem(this.id, this.isChecked)
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

  onLoad(callback) {
    this.setInputActive({ force: this.isChecked })
    callback(this.isChecked)
  }
}
