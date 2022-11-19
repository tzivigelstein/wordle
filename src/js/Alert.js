import utils from './utils/index.js'

const { $, createElement } = utils

export default class Alert {
  constructor() {
    this.timeoutList = []
  }

  triggerAlert(props) {
    const { type } = props

    if (this.timeoutList.length > 0) {
      this.timeoutList.forEach((timeout) => clearTimeout(timeout))
      this.closeAlert()
    }

    this.createAlert(props)

    if (type !== 'success') {
      const timeout = setTimeout(() => {
        this.closeAlert()
      }, 2000)

      this.timeoutList.push(timeout)
    }
  }

  closeAlert() {
    const alert = $('.alertContainer')
    if (alert !== null) {
      alert.remove()
    }
  }

  createAlert({ message, type }) {
    const TYPES = {
      success: 'alertSuccess',
      error: 'alertError',
      info: 'alertInfo',
    }

    const alertContainer = createElement({
      elementType: 'div',
      innerText: null,
      classes: ['alertContainer', TYPES[type]],
    })

    const alertMessage = createElement({
      elementType: 'p',
      innerText: message,
      classes: ['alertMessage'],
    })

    alertContainer.appendChild(alertMessage)

    document.body.appendChild(alertContainer)
  }
}
