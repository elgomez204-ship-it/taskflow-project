const express = require("express");
const cors = require("cors");
const { PORT } = require("./config/env");
const loggerAcademico = require("./middlewares/logger.middleware");
const taskRoutes = require("./routes/task.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(loggerAcademico);

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/v1/tasks", taskRoutes);

app.use((err, req, res, next) => {
  if (err.message === "NOT_FOUND") {
    return res.status(404).json({ error: "Tarea no encontrada." });
  }

  console.error(err);
  return res.status(500).json({ error: "Error interno del servidor" });
});

app.listen(PORT, () => {
  console.log(`TaskFlow API escuchando en http://localhost:${PORT}`);
});
