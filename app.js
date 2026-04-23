import {
  calculateTaskStats,
  getVisibleTasks,
  validateTaskMeta,
  validateTaskTitle
} from "./js/task-manager.js";
import {
  buildTaskItem,
  clearFormError,
  showFormError,
  toggleEmptyState
} from "./js/ui.js";
import {
  createTaskRequest,
  deleteTaskRequest,
  fetchTasks,
  updateTaskRequest
} from "./js/api/client.js";

const state = {
  tasks: [],
  selectedFilter: "all",
  searchQuery: "",
  sortBy: "newest",
  isLoading: false,
  networkError: "",
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
  networkFeedback: document.querySelector("#network-feedback"),
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

function renderNetworkState() {
  if (state.isLoading) {
    dom.networkFeedback.textContent = "Cargando tareas desde el servidor...";
    dom.networkFeedback.className = "text-sm text-blue-600 dark:text-blue-300";
    return;
  }

  if (state.networkError) {
    dom.networkFeedback.textContent = state.networkError;
    dom.networkFeedback.className = "text-sm text-red-500";
    return;
  }

  dom.networkFeedback.textContent = "";
  dom.networkFeedback.className = "hidden";
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
 * Refresca toda la vista.
 */
function syncView() {
  renderTaskList();
  renderStatistics();
  toggleEmptyState(dom.emptyState, state.tasks.length);
  renderNetworkState();
}

async function loadServerTasks() {
  state.isLoading = true;
  state.networkError = "";
  syncView();

  try {
    state.tasks = await fetchTasks();
  } catch (error) {
    state.networkError = error.message;
  } finally {
    state.isLoading = false;
    syncView();
  }
}

/**
 * Agrega una tarea validando el texto ingresado.
 * @param {string} rawTitle
 */
async function addTask(rawTitle) {
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

  try {
    state.isLoading = true;
    state.networkError = "";
    syncView();

    const createdTask = await createTaskRequest({
      title: validation.normalizedTitle,
      priority: metaValidation.priority,
      dueDate: metaValidation.dueDate
    });

    state.tasks.push(createdTask);
    dom.taskInput.value = "";
    dom.prioritySelect.value = "medium";
    dom.dueDateInput.value = "";
  } catch (error) {
    showFormError(dom.inputError, error.message);
  } finally {
    state.isLoading = false;
    syncView();
  }
}

/**
 * Alterna estado completado de una tarea.
 * @param {number} taskId
 */
async function toggleTaskStatus(taskId) {
  const targetTask = state.tasks.find(task => task.id === taskId);
  if (!targetTask) return;

  try {
    state.isLoading = true;
    state.networkError = "";
    syncView();

    const updatedTask = await updateTaskRequest(taskId, {
      completed: !targetTask.completed
    });
    state.tasks = state.tasks.map(task => (task.id === taskId ? updatedTask : task));
  } catch (error) {
    state.networkError = error.message;
  } finally {
    state.isLoading = false;
    syncView();
  }
}

/**
 * Elimina una tarea por id.
 * @param {number} taskId
 */
async function deleteTask(taskId) {
  const removedTask = state.tasks.find(task => task.id === taskId);

  try {
    state.isLoading = true;
    state.networkError = "";
    syncView();

    await deleteTaskRequest(taskId);
    state.tasks = state.tasks.filter(task => task.id !== taskId);
    setupUndoDelete(removedTask);
  } catch (error) {
    state.networkError = error.message;
  } finally {
    state.isLoading = false;
    syncView();
  }
}

/**
 * Edita una tarea existente usando validaciones.
 * @param {number} taskId
 */
async function editTask(taskId) {
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

  try {
    state.isLoading = true;
    state.networkError = "";
    syncView();

    const updatedTask = await updateTaskRequest(taskId, {
      title: validation.normalizedTitle
    });
    state.tasks = state.tasks.map(task => (task.id === taskId ? updatedTask : task));
  } catch (error) {
    alert(error.message);
  } finally {
    state.isLoading = false;
    syncView();
  }
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
async function undoDeleteTask() {
  if (!state.lastDeletedTask) return;

  try {
    state.isLoading = true;
    state.networkError = "";
    syncView();

    const restoredTask = await createTaskRequest({
      title: state.lastDeletedTask.title,
      priority: state.lastDeletedTask.priority,
      dueDate: state.lastDeletedTask.dueDate
    });

    state.tasks.push(restoredTask);
    state.lastDeletedTask = null;
    if (state.undoTimeoutId) clearTimeout(state.undoTimeoutId);
    dom.undoBanner.classList.add("hidden");
  } catch (error) {
    state.networkError = error.message;
  } finally {
    state.isLoading = false;
    syncView();
  }
}

/**
 * Marca todas las tareas como completadas.
 */
async function completeAllTasks() {
  if (state.tasks.length === 0) return;

  try {
    state.isLoading = true;
    state.networkError = "";
    syncView();

    await Promise.all(
      state.tasks
        .filter(task => !task.completed)
        .map(task => updateTaskRequest(task.id, { completed: true }))
    );
    await loadServerTasks();
  } catch (error) {
    state.networkError = error.message;
  } finally {
    state.isLoading = false;
    syncView();
  }
}

/**
 * Borra todas las tareas completadas.
 */
async function clearCompletedTasks() {
  const completedTasks = state.tasks.filter(task => task.completed);
  if (completedTasks.length === 0) return;

  try {
    state.isLoading = true;
    state.networkError = "";
    syncView();

    await Promise.all(completedTasks.map(task => deleteTaskRequest(task.id)));
    await loadServerTasks();
  } catch (error) {
    state.networkError = error.message;
  } finally {
    state.isLoading = false;
    syncView();
  }
}

function toggleTheme() {
  document.documentElement.classList.toggle("dark");
}

/**
 * Registra todos los listeners de interaccion de la app.
 */
function bindEvents() {
  dom.taskInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      void addTask(dom.taskInput.value);
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
  bindEvents();
  void loadServerTasks();
}

initApp();