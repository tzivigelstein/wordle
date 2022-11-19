import utils from '../../js/utils/index.js'

const { getWordOfTheDay, getRepeatedLettersIndexes } = utils

describe('getRepeatedLettersIndexes', () => {
  test('should return an array of indexes of repeated letters', () => {
    const repeatedLettersIndexes = getRepeatedLettersIndexes('hello', 'helo')
    expect(repeatedLettersIndexes).toEqual([0, 1, 2])
  })

  test('should return an empty array if there are no repeated letters', () => {
    const repeatedLettersIndexes = getRepeatedLettersIndexes('hello', 'world')
    expect(repeatedLettersIndexes).toEqual([3])
  })
})

describe('getWordOfTheDay', () => {
  test('should return the word of the day', () => {
    const wordOfTheDay = getWordOfTheDay(new Date(2022, 9, 18))
    expect(wordOfTheDay).toEqual('cunar')
  })
})
