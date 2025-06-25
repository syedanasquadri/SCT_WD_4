let tasks = [];

function AddTodo() {
  const text = document.querySelector("#todoInput").value.trim();
  const datetime = document.querySelector("#dateInput").value;
  const priority = document.querySelector("#priorityInput").value;

  if (!text) return;

  const task = {
    id: Date.now(),
    text,
    completed: false,
    datetime,
    priority
  };

  tasks.push(task);
  saveTasks();
  renderTasks();

  document.querySelector("#todoInput").value = "";
  document.querySelector("#dateInput").value = "";
  document.querySelector("#priorityInput").value = "medium";
}

function renderTasks() {
  const list = document.querySelector("#taskList");
  list.innerHTML = "";

  tasks.forEach(task => {
    const div = document.createElement("div");
    div.className = `task ${task.priority}`;
    div.setAttribute("draggable", "true");
    div.dataset.id = task.id;

    // Drag events
    div.addEventListener("dragstart", dragStart);
    div.addEventListener("dragover", dragOver);
    div.addEventListener("drop", drop);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const span = document.createElement("span");
    span.innerText = task.text;

    const time = document.createElement("small");
    if (task.datetime) time.innerText = `Due: ${new Date(task.datetime).toLocaleString()}`;

    const editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.addEventListener("click", () => {
      const newValue = prompt("Edit task:", task.text);
      if (newValue?.trim()) {
        task.text = newValue.trim();
        saveTasks();
        renderTasks();
      }
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.addEventListener("click", () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
    });

    if (task.completed) div.classList.add("completed");

    div.appendChild(checkbox);
    div.appendChild(span);
    if (task.datetime) div.appendChild(time);
    div.appendChild(editBtn);
    div.appendChild(deleteBtn);

    list.appendChild(div);
  });
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const data = localStorage.getItem("tasks");
  if (data) tasks = JSON.parse(data);
  renderTasks();
}

window.onload = loadTasks;

// Dark mode toggle
function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

// Drag and Drop logic
let draggedTaskId = null;

function dragStart(e) {
  draggedTaskId = e.target.dataset.id;
}

function dragOver(e) {
  e.preventDefault();
}

function drop(e) {
  const targetId = e.target.closest(".task")?.dataset.id;
  if (!targetId || draggedTaskId === targetId) return;

  const fromIndex = tasks.findIndex(t => t.id == draggedTaskId);
  const toIndex = tasks.findIndex(t => t.id == targetId);

  const [moved] = tasks.splice(fromIndex, 1);
  tasks.splice(toIndex, 0, moved);

  saveTasks();
  renderTasks();
}
