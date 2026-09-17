/*Находим все HTML-элементы с классом clue.

querySelectorAll возвращает NodeList — коллекцию, похожую на массив.
Оператор ... разворачивает её в обычный JavaScript-массив.

Массив нужен, поскольку ниже применяются методы: forEach(), filter() и другие методы Array.*/
const clueElements = [...document.querySelectorAll(".clue")];

/*Получаем элементы интерфейса, которые будут изменяться во время игры.
getElementById ищет один элемент по его уникальному id.*/
const foundCountElement = document.getElementById("foundCount");
const totalCountElement = document.getElementById("totalCount");
const hintCountElement = document.getElementById("hintCount");
const hintButton = document.getElementById("hintButton");
const resetButton = document.getElementById("resetButton");
const messageElement = document.getElementById("message");

/*Set — коллекция уникальных значений.
В неё будут добавляться id найденных улик.
Set не хранит одинаковое значение дважды, поэтому повторный клик по уже найденной зоне не увеличит счётчик.*/
let foundClues = new Set();
/* Начальное число доступных игроку подсказок */
let hintsLeft = 3;
/* Выводим настоящее количество улик. Значение берётся из числа кнопок .clue в HTML.*/
totalCountElement.textContent = clueElements.length;

/*Обновляет число найденных улик в интерфейсе и проверяет, завершил ли игрок уровень.*/
function updateCounter() {
    /* Размер Set равен количеству уникальных найденных id */
  foundCountElement.textContent = foundClues.size;
    /*Если найденных уникальных улик столько же, сколько всего зон на изображении, игра завершена.*/
  if (foundClues.size === clueElements.length) {
    messageElement.textContent = "Поздравляем! Все улики найдены.";
  }
}

/*Обрабатывает правильный клик по зоне улики. Параметр clue — HTML-кнопка, по которой нажал пользователь.*/
function findClue(clue) {
    /*Получаем значение data-id из HTML.
    Например: data-id="3" превращается в строку "3".*/
  const clueId = clue.dataset.id;
    /*Если именно эта улика уже найдена, прекращаем выполнение функции.
    Это защищает игру от повторного засчитывания одной зоны.*/
  if (foundClues.has(clueId)) {
    return;
  }
    /* Сохраняем id найденной улики */
  foundClues.add(clueId);
    /*Добавляем класс found. CSS сделает область зелёной и покажет в ней галочку.*/
  clue.classList.add("found");
    /*Отключаем кнопку после нахождения. disabled запрещает повторные клики по ней.*/
  clue.disabled = true;
    /* Обновляем счётчик и проверяем победу */
  updateCounter();
}

/*Назначаем обработчик click каждой зоне.
После клика вызывается findClue() и передаётся именно нажатая кнопка clue.*/
clueElements.forEach((clue) => {
  clue.addEventListener("click", () => {
    findClue(clue);
  });
});

/*Обработчик кнопки «Подсказка».  Он временно показывает одну случайную не найденную улику.*/
hintButton.addEventListener("click", () => {
    /* Проверяем, остались ли подсказки */
  if (hintsLeft <= 0) {
    messageElement.textContent = "Подсказки закончились.";
    return;
  }
    /*Создаём массив только из ещё не найденных зон.
    filter проходит по clueElements и оставляет те кнопки, id которых отсутствует в Set foundClues.*/
  const notFoundClues = clueElements.filter(
    (clue) => !foundClues.has(clue.dataset.id)
  );
    /* Если все улики найдены, подсказка больше не нужна */
  if (notFoundClues.length === 0) {
    messageElement.textContent = "Все ошибки уже найдены.";
    return;
  }
/* Берём случайную не найденную улику
Временно добавляем CSS-класс подсказки.
Он делает зону жёлтой и запускает анимацию.*/
  const randomClue =
    notFoundClues[Math.floor(Math.random() * notFoundClues.length)];
  randomClue.classList.add("hint-visible");
 
/*Через 1800 миллисекунд (1,8 секунды) убираем класс, и зона снова становится невидимой.*/
  setTimeout(() => {
    randomClue.classList.remove("hint-visible");
  }, 1800);
/* Уменьшаем количество доступных подсказок 
    Показываем новое число подсказок в интерфейсе*/
  hintsLeft--;
  hintCountElement.textContent = hintsLeft;
});

/*Обработчик кнопки «Сбросить».
Возвращает игру в исходное состояние,но не перезагружает страницу браузера
Удаляем список найденных улик
Возвращаем исходное число подсказок*/
resetButton.addEventListener("click", () => {
  foundClues.clear();
  hintsLeft = 3;
    /*Возвращаем каждую кнопку к начальному состоянию:
    - удаляем зелёную отметку found;
    - удаляем подсветку подсказки, если она есть;
    - снова разрешаем кликать по кнопке.*/
  clueElements.forEach((clue) => {
    clue.classList.remove("found", "hint-visible");
    clue.disabled = false;
  });
    /* Возвращаем текстовые значения интерфейса */
  hintCountElement.textContent = hintsLeft;
  messageElement.textContent = "";
  /* Счётчик снова станет 0 из общего числа улик */
  updateCounter();
});