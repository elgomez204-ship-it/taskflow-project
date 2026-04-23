const MIN_TITLE_LENGTH = 3;
const MAX_TITLE_LENGTH = 120;
const ALLOWED_PRIORITIES = ["low", "medium", "high"];
const ALLOWED_SORTS = ["newest", "oldest", "az", "completed-first", "priority-high"];

/**
 * Valida el título de tarea de forma centralizada.
 * @param {string} rawTitle
 * @param {Array<{title:string}>} existingTasks
 * @returns {{isValid:boolean,message:string,normalizedTitle:string}}
 */
export function validateTaskTitle(rawTitle, existingTasks) {
  const normalizedTitle = normalizeTitle(rawTitle);

  if (!normalizedTitle) {
    return { isValid: false, message: "La tarea no puede estar vacia.", normalizedTitle };
  }

  if (normalizedTitle.length < MIN_TITLE_LENGTH) {
    return {
      isValid: false,
      message: `La tarea debe tener al menos ${MIN_TITLE_LENGTH} caracteres.`,
      normalizedTitle
    };
  }

  if (normalizedTitle.length > MAX_TITLE_LENGTH) {
    return {
      isValid: false,
      message: `La tarea no puede superar los ${MAX_TITLE_LENGTH} caracteres.`,
      normalizedTitle
    };
  }

  if (hasDuplicateTitle(normalizedTitle, existingTasks)) {
    return {
      isValid: false,
      message: "Ya existe una tarea con ese nombre.",
      normalizedTitle
    };
  }

  return { isValid: true, message: "", normalizedTitle };
}

/**
 * Obtiene estadísticas base para render.
 * @param {Array<{completed:boolean}>} tasks
 * @returns {{total:number,completed:number,pending:number,progress:number}}
 */
export function calculateTaskStats(tasks) {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const pending = total - completed;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  return { total, completed, pending, progress };
}

/**
 * Filtra tareas por estado y búsqueda.
 * @param {Array<{title:string,completed:boolean,createdAt:number,priority:string}>} tasks
 * @param {"all"|"pending"|"completed"} selectedFilter
 * @param {string} query
 * @param {"newest"|"oldest"|"az"|"completed-first"|"priority-high"} sortBy
 * @returns {Array<{title:string,completed:boolean,createdAt:number,priority:string}>}
 */
export function getVisibleTasks(tasks, selectedFilter, query, sortBy = "newest") {
  const normalizedQuery = query.trim().toLowerCase();
  const safeSort = ALLOWED_SORTS.includes(sortBy) ? sortBy : "newest";

  const filteredTasks = tasks
    .filter(task => {
      if (selectedFilter === "pending") return !task.completed;
      if (selectedFilter === "completed") return task.completed;
      return true;
    })
    .filter(task => task.title.toLowerCase().includes(normalizedQuery));

  return sortTasks(filteredTasks, safeSort);
}

/**
 * Valida prioridad y fecha para una nueva tarea.
 * @param {string} priority
 * @param {string} dueDate
 * @returns {{isValid:boolean,message:string,priority:string,dueDate:string}}
 */
export function validateTaskMeta(priority, dueDate) {
  const safePriority = ALLOWED_PRIORITIES.includes(priority) ? priority : "medium";
  if (!dueDate) {
    return { isValid: true, message: "", priority: safePriority, dueDate: "" };
  }

  const parsedDate = new Date(dueDate);
  if (Number.isNaN(parsedDate.getTime())) {
    return { isValid: false, message: "La fecha limite no es valida.", priority: safePriority, dueDate: "" };
  }

  return { isValid: true, message: "", priority: safePriority, dueDate };
}

function sortTasks(tasks, sortBy) {
  const tasksCopy = [...tasks];

  if (sortBy === "oldest") {
    return tasksCopy.sort((a, b) => (a.createdAt ?? a.id) - (b.createdAt ?? b.id));
  }

  if (sortBy === "az") {
    return tasksCopy.sort((a, b) => a.title.localeCompare(b.title, "es", { sensitivity: "base" }));
  }

  if (sortBy === "completed-first") {
    return tasksCopy.sort((a, b) => Number(b.completed) - Number(a.completed));
  }

  if (sortBy === "priority-high") {
    const priorityScore = { high: 3, medium: 2, low: 1 };
    return tasksCopy.sort((a, b) => (priorityScore[b.priority] ?? 0) - (priorityScore[a.priority] ?? 0));
  }

  return tasksCopy.sort((a, b) => (b.createdAt ?? b.id) - (a.createdAt ?? a.id));
}

function normalizeTitle(title) {
  return String(title || "").trim().replace(/\s+/g, " ");
}

function hasDuplicateTitle(title, tasks) {
  return tasks.some(task => task.title.toLowerCase() === title.toLowerCase());
}

