export default class Alert {
  constructor() {
    this.timeoutList = []
  }

  triggerAlert(props) {
    if (this.timeoutList.length > 0) {
      console.log(this.timeoutList)
      this.timeoutList.forEach(timeout => clearTimeout(timeout))
      this.closeAlert()
    }

    this.createAlert(props)

    if (props.type !== 'success') {
      const timeout = setTimeout(() => {
        this.closeAlert()
      }, 2000)

      this.timeoutList.push(timeout)
    }
  }

  closeAlert() {
    const alert = document.querySelector('.alertContainer')
    if (alert !== null) {
      console.log({ alert })
      alert.remove()
    }
  }

  createAlert({ message, type }) {
    const TYPES = {
      success: 'alertSuccess',
      error: 'alertError',
      info: 'alertInfo'
    }

    const alertContainer = document.createElement('div')
    alertContainer.classList.add('alertContainer')
    alertContainer.classList.add(TYPES[type])

    const alertMessage = document.createElement('p')
    alertMessage.innerText = message
    alertMessage.classList.add('alertMessage')

    alertContainer.appendChild(alertMessage)

    document.body.appendChild(alertContainer)
  }
}
