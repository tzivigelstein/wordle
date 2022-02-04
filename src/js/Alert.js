export default class Alert {
  constructor() {}

  triggerAlert(props) {
    this.createAlert(props)
    if (props.type !== 'success') {
      setTimeout(() => {
        this.closeAlert()
      }, 2000)
    }
  }

  closeAlert() {
    document.querySelector('.alertContainer').remove()
  }

  createAlert({ message, type }) {
    const alertContainer = document.createElement('div')
    alertContainer.classList.add('alertContainer')
    alertContainer.classList.add(type === 'success' ? 'alertSuccess' : 'alertError')

    const alertMessage = document.createElement('p')
    alertMessage.innerText = message
    alertMessage.classList.add('alertMessage')

    alertContainer.appendChild(alertMessage)
    // alertContainer.appendChild(this.createCloseButton())

    document.body.appendChild(alertContainer)
  }
}
