export function createElement(props) {
  const { elementType, innerText = '', classes = [] } = props

  const element = document.createElement(elementType)
  element.classList.add(...classes)
  element.innerText = innerText

  return element
}

export const $ = (param) => document.querySelector(param)
export const $$ = (param) => document.querySelectorAll(param)
export const $addClass = (element, classNames) =>
  element.classList.add(...classNames)
export const $addClassAndRemove = (element, addClassNames, removeClassNames) => {
  element.classList.add(...addClassNames)
  element.classList.remove(...removeClassNames)
}
