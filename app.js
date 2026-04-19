import {
  calculateTaskStats,
  createTask,
  getVisibleTasks,
  loadTasks,
  saveTasks,
  validateTaskMeta,
  validateTaskTitle
} from "./js/task-manager.js";
import {
  buildTaskItem,
  clearFormError,
  showFormError,
  toggleEmptyState
} from "./js/ui.js";

const THEME_KEY = "taskflow_theme";

const state = {
  tasks: loadTasks(),
  selectedFilter: "all",
  searchQuery: "",
  sortBy: "newest",
  lastDeletedTask: null,
  undoTimeoutId: null
};

const dom = {
  taskInput: document.querySelector("#task-input"),
  taskList: document.querySelector("#task-list"),
  taskTemplate: document.querySelector("#task-template"),
  prioritySelect: document.querySelector("#priority-select"),
  dueDateInput: document.querySelector("#due-date-input"),
  searchInput: document.querySelector("#search-input"),
  sortSelect: document.querySelector("#sort-select"),
  filterItems: document.querySelectorAll("[data-filter]"),
  completeAllButton: document.querySelector("#complete-all"),
  clearCompletedButton: document.querySelector("#clear-completed"),
  themeToggleButton: document.querySelector("#theme-toggle"),
  totalCounter: document.querySelector("#total"),
  completedCounter: document.querySelector("#completed"),
  pendingCounter: document.querySelector("#pending"),
  progressCounter: document.querySelector("#progress"),
  progressBar: document.querySelector("progress"),
  progressDetail: document.querySelector("#progress-detail"),
  emptyState: document.querySelector("#empty-state"),
  inputError: document.querySelector("#task-input-error"),
  undoBanner: document.querySelector("#undo-banner"),
  undoMessage: document.querySelector("#undo-message"),
  undoDeleteButton: document.querySelector("#undo-delete")
};

/**
 * Renderiza la lista según filtro y búsqueda.
 */
function renderTaskList() {
  dom.taskList.innerHTML = "";

  const visibleTasks = getVisibleTasks(
    state.tasks,
    state.selectedFilter,
    state.searchQuery,
    state.sortBy
  );

  visibleTasks.forEach(task => {
    const fragment = buildTaskItem(dom.taskTemplate, task, {
      onToggle: toggleTaskStatus,
      onDelete: deleteTask,
      onEdit: editTask
    });

    dom.taskList.appendChild(fragment);
  });
}

/**
 * Actualiza contadores y barra de progreso.
 */
function renderStatistics() {
  const stats = calculateTaskStats(state.tasks);

  dom.totalCounter.textContent = String(stats.total);
  dom.completedCounter.textContent = String(stats.completed);
  dom.pendingCounter.textContent = String(stats.pending);
  dom.progressCounter.textContent = `${stats.progress}%`;
  dom.progressBar.value = stats.progress;
  dom.progressDetail.textContent = `${stats.completed} de ${stats.total} tareas completadas`;
}

/**
 * Persiste y refresca toda la vista.
 */
function syncView() {
  saveTasks(state.tasks);
  renderTaskList();
  renderStatistics();
  toggleEmptyState(dom.emptyState, state.tasks.length);
}

/**
 * Agrega una tarea validando el texto ingresado.
 * @param {string} rawTitle
 */
function addTask(rawTitle) {
  const validation = validateTaskTitle(rawTitle, state.tasks);
  const metaValidation = validateTaskMeta(dom.prioritySelect.value, dom.dueDateInput.value);

  if (!validation.isValid) {
    showFormError(dom.inputError, validation.message);
    return;
  }

  if (!metaValidation.isValid) {
    showFormError(dom.inputError, metaValidation.message);
    return;
  }

  clearFormError(dom.inputError);
  state.tasks.push(
    createTask(validation.normalizedTitle, metaValidation.priority, metaValidation.dueDate)
  );
  syncView();
  dom.taskInput.value = "";
  dom.prioritySelect.value = "medium";
  dom.dueDateInput.value = "";
}

/**
 * Alterna estado completado de una tarea.
 * @param {number} taskId
 */
function toggleTaskStatus(taskId) {
  state.tasks = state.tasks.map(task =>
    task.id === taskId ? { ...task, completed: !task.completed } : task
  );
  syncView();
}

/**
 * Elimina una tarea por id.
 * @param {number} taskId
 */
function deleteTask(taskId) {
  const removedTask = state.tasks.find(task => task.id === taskId);
  state.tasks = state.tasks.filter(task => task.id !== taskId);
  setupUndoDelete(removedTask);
  syncView();
}

/**
 * Edita una tarea existente usando validaciones.
 * @param {number} taskId
 */
function editTask(taskId) {
  const targetTask = state.tasks.find(task => task.id === taskId);
  if (!targetTask) return;

  const draftTitle = prompt("Editar tarea", targetTask.title);
  if (draftTitle === null) return;

  const otherTasks = state.tasks.filter(task => task.id !== taskId);
  const validation = validateTaskTitle(draftTitle, otherTasks);

  if (!validation.isValid) {
    alert(validation.message);
    return;
  }

  if (validation.normalizedTitle === targetTask.title) return;

  state.tasks = state.tasks.map(task =>
    task.id === taskId
      ? { ...task, title: validation.normalizedTitle }
      : task
  );
  syncView();
}

/**
 * Habilita una ventana corta para deshacer una eliminacion.
 * @param {{id:number,title:string}|null} task
 */
function setupUndoDelete(task) {
  if (!task) return;

  state.lastDeletedTask = task;
  dom.undoMessage.textContent = `Tarea eliminada: "${task.title}"`;
  dom.undoBanner.classList.remove("hidden");

  if (state.undoTimeoutId) clearTimeout(state.undoTimeoutId);
  state.undoTimeoutId = window.setTimeout(() => {
    state.lastDeletedTask = null;
    dom.undoBanner.classList.add("hidden");
  }, 5000);
}

/**
 * Restaura la ultima tarea eliminada si aun esta disponible.
 */
function undoDeleteTask() {
  if (!state.lastDeletedTask) return;

  state.tasks.push(state.lastDeletedTask);
  state.lastDeletedTask = null;
  if (state.undoTimeoutId) clearTimeout(state.undoTimeoutId);
  dom.undoBanner.classList.add("hidden");
  syncView();
}

/**
 * Marca todas las tareas como completadas.
 */
function completeAllTasks() {
  if (state.tasks.length === 0) return;
  state.tasks = state.tasks.map(task => ({ ...task, completed: true }));
  syncView();
}

/**
 * Borra todas las tareas completadas.
 */
function clearCompletedTasks() {
  state.tasks = state.tasks.filter(task => !task.completed);
  syncView();
}

/**
 * Aplica el tema guardado previamente en localStorage.
 */
function applySavedTheme() {
  if (localStorage.getItem(THEME_KEY) === "dark") {
    document.documentElement.classList.add("dark");
  }
}

/**
 * Alterna entre modo claro y oscuro persistiendo la seleccion.
 */
function toggleTheme() {
  document.documentElement.classList.toggle("dark");
  localStorage.setItem(
    THEME_KEY,
    document.documentElement.classList.contains("dark") ? "dark" : "light"
  );
}

/**
 * Registra todos los listeners de interaccion de la app.
 */
function bindEvents() {
  dom.taskInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      addTask(dom.taskInput.value);
    }
  });

  dom.taskInput.addEventListener("input", () => {
    if (dom.inputError.textContent) clearFormError(dom.inputError);
  });

  dom.searchInput.addEventListener("input", event => {
    state.searchQuery = event.target.value;
    renderTaskList();
  });

  dom.sortSelect.addEventListener("change", event => {
    state.sortBy = event.target.value;
    renderTaskList();
  });

  dom.filterItems.forEach(item => {
    item.addEventListener("click", () => {
      state.selectedFilter = item.dataset.filter;
      renderTaskList();
    });
  });

  dom.completeAllButton.addEventListener("click", completeAllTasks);
  dom.clearCompletedButton.addEventListener("click", clearCompletedTasks);
  dom.themeToggleButton.addEventListener("click", toggleTheme);
  dom.undoDeleteButton.addEventListener("click", undoDeleteTask);
}

/**
 * Inicializa la aplicacion.
 */
function initApp() {
  applySavedTheme();
  bindEvents();
  syncView();
}

initApp();