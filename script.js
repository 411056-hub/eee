const tabCard = document.getElementById("tab-card");
const tabManage = document.getElementById("tab-manage");
const cardView = document.getElementById("card-view");
const manageView = document.getElementById("manage-view");
const flashCard = document.getElementById("flash-card");
const cardWord = document.getElementById("card-word");
const cardTranslation = document.getElementById("card-translation");
const cardPos = document.getElementById("card-pos");
const cardExample = document.getElementById("card-example");
const cardRoot = document.getElementById("card-root");
const currentWordIndex = document.getElementById("current-word-index");
const wordCount = document.getElementById("word-count");
const prevButton = document.getElementById("prev-button");
const flipButton = document.getElementById("flip-button");
const nextButton = document.getElementById("next-button");

const wordForm = document.getElementById("word-form");
const inputWord = document.getElementById("input-word");
const inputTranslation = document.getElementById("input-translation");
const inputPos = document.getElementById("input-pos");
const inputExample = document.getElementById("input-example");
const inputRoot = document.getElementById("input-root");
const resetButton = document.getElementById("reset-button");
const wordList = document.getElementById("word-list");

const STORAGE_KEY = "vocabFlashcardsWords";
let words = [];
let currentIndex = 0;
let isFlipped = false;
let editingIndex = null;

const initialWords = [
  {
    word: "integrate",
    translation: "整合；合併；積分",
    pos: "verb",
    example: "We need to integrate the new ideas into our plan.",
    root: "in- + teg- (完整) -> 表示整合、結合。",
  },
  {
    word: "vital",
    translation: "重要的；生命的",
    pos: "adjective",
    example: "Good sleep is vital for strong memory.",
    root: "vit- (生命) + -al (形容詞尾) -> 重要、必要。",
  },
];

function loadWords() {
  const stored = localStorage.getItem(STORAGE_KEY);
  try {
    return stored ? JSON.parse(stored) : [...initialWords];
  } catch (error) {
    return [...initialWords];
  }
}

function saveWords() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
}

function switchView(view) {
  const activeClass = "active";
  if (view === "card") {
    cardView.classList.add(activeClass);
    manageView.classList.remove(activeClass);
    tabCard.classList.add(activeClass);
    tabManage.classList.remove(activeClass);
  } else {
    cardView.classList.remove(activeClass);
    manageView.classList.add(activeClass);
    tabCard.classList.remove(activeClass);
    tabManage.classList.add(activeClass);
  }
}

function renderCard() {
  if (words.length === 0) {
    cardWord.textContent = "尚無單字";
    cardTranslation.textContent = "請先到管理頁新增單字。";
    cardPos.textContent = "-";
    cardExample.textContent = "-";
    cardRoot.textContent = "-";
    currentWordIndex.textContent = "0 / 0";
    wordCount.textContent = "尚未建立任何單字卡片。";
    return;
  }

  const wordEntry = words[currentIndex];
  cardWord.textContent = wordEntry.word;
  cardTranslation.textContent = wordEntry.translation || "未提供翻譯。";
  cardPos.textContent = wordEntry.pos || "未提供詞性。";
  cardExample.textContent = wordEntry.example || "未提供例句。";
  cardRoot.textContent = wordEntry.root || "未提供分析。";
  currentWordIndex.textContent = `${currentIndex + 1} / ${words.length}`;
  wordCount.textContent = `共 ${words.length} 張卡片`;
}

function renderWordList() {
  wordList.innerHTML = "";

  if (words.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.className = "word-item";
    emptyMessage.innerHTML = "<p class=\"word-item-label\">目前沒有任何單字，請新增一筆。</p>";
    wordList.appendChild(emptyMessage);
    return;
  }

  words.forEach((entry, index) => {
    const item = document.createElement("li");
    item.className = "word-item";

    const header = document.createElement("div");
    header.className = "word-item-header";

    const title = document.createElement("div");
    title.innerHTML = `<p class=\"word-item-title\">${entry.word}</p><p class=\"word-item-label\">${entry.translation}</p>`;

    const actions = document.createElement("div");
    actions.className = "word-item-actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.textContent = "編輯";
    editButton.addEventListener("click", () => startEdit(index));

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.style.color = "var(--danger)";
    deleteButton.textContent = "刪除";
    deleteButton.addEventListener("click", () => deleteWord(index));

    actions.appendChild(editButton);
    actions.appendChild(deleteButton);
    header.appendChild(title);
    header.appendChild(actions);

    const details = document.createElement("div");
    details.className = "word-item-details";
    details.innerHTML = `
      <p><strong>詞性：</strong>${entry.pos || "-"}</p>
      <p><strong>例句：</strong>${entry.example || "-"}</p>
      <p><strong>字根 / 分析：</strong>${entry.root || "-"}</p>
    `;

    item.appendChild(header);
    item.appendChild(details);
    wordList.appendChild(item);
  });
}

function showCard(index) {
  if (words.length === 0) return;
  currentIndex = (index + words.length) % words.length;
  isFlipped = false;
  flashCard.classList.remove("flipped");
  renderCard();
}

function prevWord() {
  showCard(currentIndex - 1);
}

function nextWord() {
  showCard(currentIndex + 1);
}

function flipCard() {
  if (words.length === 0) return;
  isFlipped = !isFlipped;
  flashCard.classList.toggle("flipped", isFlipped);
}

function clearForm() {
  wordForm.reset();
  inputWord.focus();
  editingIndex = null;
}

function startEdit(index) {
  const entry = words[index];
  inputWord.value = entry.word;
  inputTranslation.value = entry.translation;
  inputPos.value = entry.pos;
  inputExample.value = entry.example;
  inputRoot.value = entry.root;
  editingIndex = index;
  switchView("manage");
}

function deleteWord(index) {
  if (!window.confirm("確定要刪除此單字嗎？")) return;
  words.splice(index, 1);
  if (currentIndex >= words.length) {
    currentIndex = Math.max(0, words.length - 1);
  }
  saveWords();
  renderWordList();
  renderCard();
}

function handleSubmit(event) {
  event.preventDefault();
  const entry = {
    word: inputWord.value.trim(),
    translation: inputTranslation.value.trim(),
    pos: inputPos.value.trim(),
    example: inputExample.value.trim(),
    root: inputRoot.value.trim(),
  };

  if (!entry.word || !entry.translation) {
    alert("請輸入英文單字與中文翻譯。\n(詞性、例句與字根分析可選填)");
    return;
  }

  if (editingIndex !== null) {
    words[editingIndex] = entry;
  } else {
    words.push(entry);
    currentIndex = words.length - 1;
  }

  saveWords();
  clearForm();
  renderWordList();
  renderCard();
  switchView("card");
}

function init() {
  words = loadWords();
  renderWordList();
  renderCard();

  tabCard.addEventListener("click", () => switchView("card"));
  tabManage.addEventListener("click", () => switchView("manage"));
  prevButton.addEventListener("click", prevWord);
  nextButton.addEventListener("click", nextWord);
  flipButton.addEventListener("click", flipCard);
  wordForm.addEventListener("submit", handleSubmit);
  resetButton.addEventListener("click", clearForm);
}

init();
