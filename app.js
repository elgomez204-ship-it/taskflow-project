/* =========================
   CONSTANTES
========================= */
const STORAGE_KEY = "taskflow_tasks";

/* =========================
   ESTADO GLOBAL
========================= */
let tasks = loadTasks();
let currentFilter = "all";
let searchQuery = "";

/* =========================
   SELECTORES DEL DOM
========================= */
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const taskTemplate = document.querySelector("#task-template");

const searchInput = document.querySelector("#search-input");
const filterItems = document.querySelectorAll("[data-filter]");
const completeAllBtn = document.querySelector("#complete-all");
const clearCompletedBtn = document.querySelector("#clear-completed");

const totalSpan = document.querySelector("#total");
const completedSpan = document.querySelector("#completed");
const pendingSpan = document.querySelector("#pending");
const progressSpan = document.querySelector("#progress");
const progressBar = document.querySelector("progress");

/* =========================
   LOCAL STORAGE
========================= */
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  return JSON.parse(data);
}

/* =========================
   UTILIDADES
========================= */
function createTask(title) {
  return {
    id: Date.now(),
    title: title.trim(),
    completed: false
  };
}

function getFilteredTasks() {
  return tasks
    .filter(task => {
      if (currentFilter === "pending") return !task.completed;
      if (currentFilter === "completed") return task.completed;
      return true;
    })
    .filter(task =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
}

/* =========================
   RENDERIZADO
========================= */
function renderTasks() {
  taskList.innerHTML = "";

  getFilteredTasks().forEach(task => {
    const fragment = taskTemplate.content.cloneNode(true);
    const li = fragment.querySelector("li");
    const checkbox = fragment.querySelector("input");
    const text = fragment.querySelector(".task-text");
    const deleteBtn = fragment.querySelector("button");

    text.textContent = task.title;
    checkbox.checked = task.completed;

    checkbox.addEventListener("change", () => toggleTask(task.id));
    deleteBtn.addEventListener("click", () => deleteTask(task.id));
    text.addEventListener("dblclick", () => editTask(task.id));

    taskList.appendChild(fragment);
  });
}

/* =========================
   ESTADÍSTICAS
========================= */
function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  totalSpan.textContent = total;
  completedSpan.textContent = completed;
  pendingSpan.textContent = pending;
  progressSpan.textContent = `${progress}%`;
  progressBar.value = progress;
}

/* =========================
   ACCIONES
========================= */
function addTask(title) {
  if (!title.trim()) return;
  tasks.push(createTask(title));
  saveAndUpdate();
}

function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveAndUpdate();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveAndUpdate();
}

function editTask(id) {
  const task = tasks.find(t => t.id === id);
  const newTitle = prompt("Editar tarea", task.title);

  if (newTitle && newTitle.trim()) {
    task.title = newTitle.trim();
    saveAndUpdate();
  }
}

function completeAllTasks() {
  tasks = tasks.map(task => ({ ...task, completed: true }));
  saveAndUpdate();
}

function clearCompletedTasks() {
  tasks = tasks.filter(task => !task.completed);
  saveAndUpdate();
}

function saveAndUpdate() {
  saveTasks();
  renderTasks();
  updateStats();
}

/* =========================
   EVENTOS
========================= */

/* ➕ Añadir tarea con ENTER */
taskInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    addTask(taskInput.value);
    taskInput.value = "";
  }
});

/* 🔍 Búsqueda */
searchInput.addEventListener("input", e => {
  searchQuery = e.target.value;
  renderTasks();
});

/* 🧭 Filtros */
filterItems.forEach(item => {
  item.addEventListener("click", () => {
    currentFilter = item.dataset.filter;
    renderTasks();
  });
});

/* Acciones masivas */
completeAllBtn.addEventListener("click", completeAllTasks);
clearCompletedBtn.addEventListener("click", clearCompletedTasks);

/* =========================
   MODO OSCURO
========================= */
const themeToggleBtn = document.querySelector("#theme-toggle");
const THEME_KEY = "taskflow_theme";
const root = document.documentElement;

if (localStorage.getItem(THEME_KEY) === "dark") {
  root.classList.add("dark");
}

themeToggleBtn.addEventListener("click", () => {
  root.classList.toggle("dark");
  localStorage.setItem(
    THEME_KEY,
    root.classList.contains("dark") ? "dark" : "light"
  );
});

/* =========================
   INICIALIZACIÓN
========================= */
renderTasks();
updateStats();