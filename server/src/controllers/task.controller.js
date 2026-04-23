const taskService = require("../services/task.service");

const ALLOWED_PRIORITIES = ["low", "medium", "high"];

function getAllTasks(req, res) {
  const tasks = taskService.obtenerTodas();
  res.status(200).json(tasks);
}

function createTask(req, res) {
  const { title, priority = "medium", dueDate = "" } = req.body;

  if (!title || typeof title !== "string" || title.trim().length < 3) {
    return res.status(400).json({
      error: "El titulo es obligatorio y debe tener al menos 3 caracteres."
    });
  }

  if (!ALLOWED_PRIORITIES.includes(priority)) {
    return res.status(400).json({
      error: "La prioridad debe ser low, medium o high."
    });
  }

  if (typeof dueDate !== "string") {
    return res.status(400).json({
      error: "La fecha limite debe ser texto en formato YYYY-MM-DD o vacia."
    });
  }

  if (dueDate) {
    const parsedDate = new Date(dueDate);
    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: "La fecha limite no es valida." });
    }
  }

  const newTask = taskService.crearTarea({
    title: title.trim(),
    priority,
    dueDate
  });

  return res.status(201).json(newTask);
}

function replaceTask(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { title, completed, priority, dueDate } = req.body;

    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "ID invalido." });
    }

    if (!title || typeof title !== "string" || title.trim().length < 3) {
      return res.status(400).json({
        error: "El titulo es obligatorio y debe tener al menos 3 caracteres."
      });
    }

    if (typeof completed !== "boolean") {
      return res.status(400).json({ error: "completed debe ser boolean." });
    }

    if (!ALLOWED_PRIORITIES.includes(priority)) {
      return res.status(400).json({ error: "La prioridad no es valida." });
    }

    if (typeof dueDate !== "string") {
      return res.status(400).json({ error: "La fecha limite no es valida." });
    }

    const replacedTask = taskService.reemplazarTarea(id, {
      title: title.trim(),
      completed,
      priority,
      dueDate
    });

    return res.status(200).json(replacedTask);
  } catch (error) {
    return next(error);
  }
}

function patchTask(req, res, next) {
  try {
    const id = Number(req.params.id);
    const patch = req.body;

    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "ID invalido." });
    }

    if (typeof patch !== "object" || patch === null) {
      return res.status(400).json({ error: "Body invalido." });
    }

    if ("title" in patch) {
      if (typeof patch.title !== "string" || patch.title.trim().length < 3) {
        return res.status(400).json({
          error: "Si envias title, debe tener al menos 3 caracteres."
        });
      }
      patch.title = patch.title.trim();
    }

    if ("completed" in patch && typeof patch.completed !== "boolean") {
      return res.status(400).json({
        error: "Si envias completed, debe ser boolean."
      });
    }

    if ("priority" in patch && !ALLOWED_PRIORITIES.includes(patch.priority)) {
      return res.status(400).json({
        error: "Si envias priority, debe ser low, medium o high."
      });
    }

    if ("dueDate" in patch) {
      if (typeof patch.dueDate !== "string") {
        return res.status(400).json({
          error: "Si envias dueDate, debe ser string."
        });
      }
      if (patch.dueDate) {
        const parsedDate = new Date(patch.dueDate);
        if (Number.isNaN(parsedDate.getTime())) {
          return res.status(400).json({
            error: "La fecha limite no es valida."
          });
        }
      }
    }

    const updatedTask = taskService.actualizarTarea(id, patch);
    return res.status(200).json(updatedTask);
  } catch (error) {
    return next(error);
  }
}

function deleteTask(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "ID invalido." });
    }

    taskService.eliminarTarea(id);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getAllTasks,
  createTask,
  replaceTask,
  patchTask,
  deleteTask
};
