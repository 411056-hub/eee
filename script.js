const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");
const clearButton = document.getElementById("clear-button");

let tasks = [];

function renderTasks() {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "empty-state";
    emptyItem.textContent = "目前沒有待辦事項，請輸入一個任務並按新增。";
    taskList.appendChild(emptyItem);
  } else {
    tasks.forEach((task, index) => {
      const item = document.createElement("li");
      item.className = `task-item ${task.completed ? "completed" : ""}`;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "task-checkbox";
      checkbox.checked = task.completed;
      checkbox.addEventListener("change", () => toggleTask(index));

      const text = document.createElement("p");
      text.className = "task-text";
      text.textContent = task.text;

      const actions = document.createElement("div");
      actions.className = "task-actions";

      const deleteButton = document.createElement("button");
      deleteButton.className = "task-button";
      deleteButton.textContent = "刪除";
      deleteButton.addEventListener("click", () => removeTask(index));

      actions.appendChild(deleteButton);
      item.appendChild(checkbox);
      item.appendChild(text);
      item.appendChild(actions);
      taskList.appendChild(item);
    });
  }

  updateInfo();
}

function updateInfo() {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  if (total === 0) {
    taskCount.textContent = "目前沒有待辦事項";
  } else {
    taskCount.textContent = `共 ${total} 筆，已完成 ${completed} 筆`;
  }
}

function addTask(text) {
  const trimmed = text.trim();
  if (!trimmed) return;
  tasks = [...tasks, { text: trimmed, completed: false }];
  taskInput.value = "";
  renderTasks();
}

function toggleTask(index) {
  tasks = tasks.map((task, idx) =>
    idx === index ? { ...task, completed: !task.completed } : task
  );
  renderTasks();
}

function removeTask(index) {
  tasks = tasks.filter((_, idx) => idx !== index);
  renderTasks();
}

function clearCompleted() {
  tasks = tasks.filter((task) => !task.completed);
  renderTasks();
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addTask(taskInput.value);
});

clearButton.addEventListener("click", clearCompleted);

renderTasks();
