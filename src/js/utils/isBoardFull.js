export default function isBoardFull({ board }) {
  let hasFinished = false
  for (let row of board) {
    for (let letter of row) {
      if (letter === '') {
        hasFinished = false
        break
      }
      hasFinished = true
    }
  }

  return hasFinished
}
