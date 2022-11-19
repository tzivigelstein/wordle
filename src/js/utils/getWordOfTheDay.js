import dictionary from "../dictionary";

export default function getWordOfTheDay(date = new Date()) {
  const now = date;
  const start = new Date(2022, 0, 0);
  const diff = Number(now) - Number(start);
  let day = Math.floor(diff / (1000 * 60 * 60 * 24));
  while (day > dictionary.length) {
    day -= dictionary.length;
  }
  return dictionary.at(day);
}
