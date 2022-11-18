import { deleteButtonSVG } from "./deleteButtonSVG.js";
import utils from "./utils/index.js";
import keyboardLetters from "./keyboardLetters.js";
import { $addClass } from "./utils/dom.js";

const { $, $$ } = utils;

export default class Keyboard {
  constructor() {
    this.keyboardElement = $(".keyboardContainer");
    this.initKeyboard();
    this.initListener();
  }

  initKeyboard() {
    keyboardLetters.forEach((row, index) => {
      const keyboardLettersFragment = document.createElement("div");
      keyboardLettersFragment.classList.add("keyboardRow");
      row.forEach((letter) => {
        keyboardLettersFragment.appendChild(createKeyboardLetter(letter));
      });

      if (index === 2) {
        const deleteButton = createDeleteButton();
        keyboardLettersFragment.appendChild(deleteButton);
      }

      this.keyboardElement.appendChild(keyboardLettersFragment);
    });

    function createKeyboardLetter({ letter, id }) {
      const letterButton = document.createElement("button");
      letterButton.id = id;
      letterButton.name = letter;
      letterButton.innerText = letter;
      letterButton.classList.add("keyboardButton");

      return letterButton;
    }

    function createDeleteButton() {
      const deleteButton = document.createElement("button");
      deleteButton.id = 28;
      deleteButton.innerHTML = deleteButtonSVG;
      deleteButton.classList.add("keyboardButton");

      return deleteButton;
    }
  }

  initListener() {
    window.addEventListener("keydown", (e) => {
      const key = e.key;
      const letter = document.querySelector(`[name="${key}"]`);
      if (letter) {
        letter.click();
      } else if (key === "Backspace") {
        document.getElementById(28).click();
      } else if (key === "Enter") {
        document.getElementById(20).click();
      }
    });
  }

  onClick(callback) {
    const htmlButtons = $$(".keyboardButton");
    htmlButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        callback({ letter: e.target.innerHTML, id: e.target.id });
      });
    });
  }

  updateLettersStatus(keys) {
    const [correctLetters, almostCorrectLetters, wrongLetters] = keys;
    const letters = $$(".keyboardButton");

    letters.forEach((letter) => {
      const { innerHTML } = letter;

      if (correctLetters.includes(innerHTML)) {
        $addClass(letter, ["correctKeyboardLetter"]);
      } else if (almostCorrectLetters.includes(innerHTML)) {
        $addClass(letter, ["almostCorrectKeyboardLetter"]);
      } else if (wrongLetters.includes(innerHTML)) {
        $addClass(letter, ["wrongKeyboardLetter"]);
      }
    });
  }
}
