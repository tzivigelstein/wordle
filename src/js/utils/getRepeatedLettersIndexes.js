export default function getRepeatedLettersIndexes({ firstWord, secondWord }) {
  const indexes = []

  for (let i = 0; i < firstWord.length; i++) {
    if (firstWord[i] === secondWord[i]) {
      indexes.push(i)
    }
  }

  return indexes
}
