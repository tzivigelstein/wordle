export default function getRepeatedLettersIndexes(firstWord, secondWord) {
  const indexes = []

  for (let i in firstWord) {
    if (firstWord[i] === secondWord[i]) {
      indexes.push(Number(i))
    }
  }

  return indexes
}
