const clueElements = [...document.querySelectorAll(".clue")];

const foundCountElement = document.getElementById("foundCount");
const totalCountElement = document.getElementById("totalCount");
const hintCountElement = document.getElementById("hintCount");
const hintButton = document.getElementById("hintButton");
const resetButton = document.getElementById("resetButton");
const messageElement = document.getElementById("message");

let foundClues = new Set();
let hintsLeft = 3;

totalCountElement.textContent = clueElements.length;

function updateCounter() {
  foundCountElement.textContent = foundClues.size;

  if (foundClues.size === clueElements.length) {
    messageElement.textContent = "Поздравляем! Все 4 ошибки найдены.";
  }
}

function findClue(clue) {
  const clueId = clue.dataset.id;

  if (foundClues.has(clueId)) {
    return;
  }

  foundClues.add(clueId);
  clue.classList.add("found");
  clue.disabled = true;

  updateCounter();
}

clueElements.forEach((clue) => {
  clue.addEventListener("click", () => {
    findClue(clue);
  });
});

hintButton.addEventListener("click", () => {
  if (hintsLeft <= 0) {
    messageElement.textContent = "Подсказки закончились.";
    return;
  }

  const notFoundClues = clueElements.filter(
    (clue) => !foundClues.has(clue.dataset.id)
  );

  if (notFoundClues.length === 0) {
    messageElement.textContent = "Все ошибки уже найдены.";
    return;
  }

  const randomClue =
    notFoundClues[Math.floor(Math.random() * notFoundClues.length)];

  randomClue.classList.add("hint-visible");

  setTimeout(() => {
    randomClue.classList.remove("hint-visible");
  }, 1800);

  hintsLeft--;
  hintCountElement.textContent = hintsLeft;
});

resetButton.addEventListener("click", () => {
  foundClues.clear();
  hintsLeft = 3;

  clueElements.forEach((clue) => {
    clue.classList.remove("found", "hint-visible");
    clue.disabled = false;
  });

  hintCountElement.textContent = hintsLeft;
  messageElement.textContent = "";
  updateCounter();
});