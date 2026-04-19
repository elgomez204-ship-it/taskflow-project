/**
 * Crea un elemento de tarea desde un template.
 * @param {HTMLTemplateElement} template
 * @param {{id:number,title:string,completed:boolean,priority:string,dueDate:string}} task
 * @param {{onToggle:(id:number)=>void,onDelete:(id:number)=>void,onEdit:(id:number)=>void}} handlers
 * @returns {DocumentFragment}
 */
export function buildTaskItem(template, task, handlers) {
  const fragment = template.content.cloneNode(true);
  const listItem = fragment.querySelector("li");
  const checkbox = fragment.querySelector("input");
  const textNode = fragment.querySelector(".task-text");
  const deleteButton = fragment.querySelector("button");
  const priorityBadge = fragment.querySelector("[data-role='priority']");
  const dueDateNode = fragment.querySelector("[data-role='due-date']");

  listItem.dataset.taskId = String(task.id);
  textNode.textContent = task.title;
  checkbox.checked = task.completed;
  priorityBadge.textContent = getPriorityLabel(task.priority);
  priorityBadge.className = `text-xs px-2 py-1 rounded-full ${getPriorityClasses(task.priority)}`;
  dueDateNode.textContent = formatDueDate(task.dueDate);

  if (isOverdue(task.dueDate, task.completed)) {
    dueDateNode.classList.add("text-red-500");
  }

  checkbox.addEventListener("change", () => handlers.onToggle(task.id));
  deleteButton.addEventListener("click", () => handlers.onDelete(task.id));
  textNode.addEventListener("dblclick", () => handlers.onEdit(task.id));

  return fragment;
}

function getPriorityLabel(priority) {
  if (priority === "high") return "Alta";
  if (priority === "low") return "Baja";
  return "Media";
}

function getPriorityClasses(priority) {
  if (priority === "high") return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
  if (priority === "low") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300";
  return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";
}

function formatDueDate(dueDate) {
  if (!dueDate) return "Sin fecha limite";
  const parsed = new Date(`${dueDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return "Fecha invalida";
  return `Vence: ${parsed.toLocaleDateString("es-ES")}`;
}

function isOverdue(dueDate, completed) {
  if (!dueDate || completed) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const parsed = new Date(`${dueDate}T00:00:00`);
  return parsed.getTime() < today.getTime();
}

/**
 * Muestra un mensaje de validación al usuario.
 * @param {HTMLElement} node
 * @param {string} message
 */
export function showFormError(node, message) {
  node.textContent = message;
  node.classList.remove("hidden");
}

/**
 * Limpia errores visibles del formulario.
 * @param {HTMLElement} node
 */
export function clearFormError(node) {
  node.textContent = "";
  node.classList.add("hidden");
}

/**
 * Muestra u oculta el estado vacío de la lista.
 * @param {HTMLElement} node
 * @param {number} totalTasks
 */
export function toggleEmptyState(node, totalTasks) {
  node.classList.toggle("hidden", totalTasks > 0);
}
