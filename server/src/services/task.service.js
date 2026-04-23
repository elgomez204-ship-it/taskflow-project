const tasks = [];

function obtenerTodas() {
  return [...tasks];
}

function crearTarea(data) {
  const now = Date.now();
  const newTask = {
    id: now,
    title: data.title,
    completed: false,
    createdAt: now,
    priority: data.priority,
    dueDate: data.dueDate
  };

  tasks.push(newTask);
  return newTask;
}

function reemplazarTarea(id, data) {
  const index = tasks.findIndex(task => task.id === id);
  if (index === -1) {
    throw new Error("NOT_FOUND");
  }

  const replacedTask = {
    id: tasks[index].id,
    createdAt: tasks[index].createdAt,
    title: data.title,
    completed: Boolean(data.completed),
    priority: data.priority,
    dueDate: data.dueDate
  };

  tasks[index] = replacedTask;
  return replacedTask;
}

function actualizarTarea(id, patch) {
  const targetTask = tasks.find(task => task.id === id);
  if (!targetTask) {
    throw new Error("NOT_FOUND");
  }

  if (typeof patch.title === "string") targetTask.title = patch.title;
  if (typeof patch.completed === "boolean") targetTask.completed = patch.completed;
  if (typeof patch.priority === "string") targetTask.priority = patch.priority;
  if (typeof patch.dueDate === "string") targetTask.dueDate = patch.dueDate;

  return targetTask;
}

function eliminarTarea(id) {
  const index = tasks.findIndex(task => task.id === id);
  if (index === -1) {
    throw new Error("NOT_FOUND");
  }

  tasks.splice(index, 1);
}

module.exports = {
  obtenerTodas,
  crearTarea,
  reemplazarTarea,
  actualizarTarea,
  eliminarTarea
};
