# TaskFlow - Frontend + Backend Express

TaskFlow ahora funciona con arquitectura cliente-servidor: el frontend consume una API RESTful en Node.js/Express y se elimina la persistencia de tareas en `localStorage`.

## Objetivo tecnico

- Diseñar una API REST con semántica HTTP correcta.
- Separar responsabilidades por capas: rutas, controladores, servicios.
- Validar datos en la frontera de red.
- Centralizar el manejo de errores.
- Configurar el servidor con variables de entorno (`dotenv`).

## Estructura del proyecto

```text
TaskFlow/
  app.js
  index.html
  js/
    api/
      client.js                # Capa de red del frontend (fetch)
    task-manager.js            # Lógica de validación, filtros y estadísticas
    ui.js                      # Render de interfaz
  server/
    .env.example
    src/
      config/
        env.js                 # Carga y validación de variables de entorno
      controllers/
        task.controller.js     # Orquestación HTTP y validación de req.body
      middlewares/
        logger.middleware.js   # Auditoría de peticiones
      routes/
        task.routes.js         # Mapeo de endpoints REST
      services/
        task.service.js        # Lógica de negocio y "persistencia" en memoria
      index.js                 # Bootstrap de Express y middleware de errores
  docs/
    backend-api.md             # Conceptos de Axios, Postman, Sentry, Swagger
```

## Variables de entorno (12-Factor)

1. Copia `server/.env.example` a `server/.env`.
2. Define al menos:
   - `PORT=3000`
3. El archivo `.env` está excluido del control de versiones en `.gitignore`.

`server/src/config/env.js` corta el arranque con `throw new Error(...)` si falta `PORT`.

## Ejecucion local

### 1) Levantar backend

```bash
cd server
npm install
npm run dev
```

Servidor en `http://localhost:3000`.

### 2) Levantar frontend

Desde la raíz del proyecto, usa un servidor estático:

```bash
python -m http.server 5500
```

Abre `http://localhost:5500`.

## API REST de tareas

Base URL: `http://localhost:3000/api/v1/tasks`

- `GET /` - obtener todas las tareas (`200`).
- `POST /` - crear tarea (`201`).
- `PUT /:id` - reemplazo total de tarea (`200`).
- `PATCH /:id` - actualización parcial (`200`).
- `DELETE /:id` - eliminar tarea (`204`).

### Ejemplo de creación

```http
POST /api/v1/tasks
Content-Type: application/json

{
  "title": "Preparar demo",
  "priority": "high",
  "dueDate": "2026-04-25"
}
```

## Middleware y pipeline

- `express.json()` transforma payload JSON de red a `req.body`.
- `cors()` habilita consumo del frontend desde otro origen.
- `loggerAcademico` audita método, ruta, estado HTTP y duración.
- Middleware global de errores:
  - `NOT_FOUND` -> `404`
  - Error no controlado -> `500` con mensaje genérico

## Integración frontend

La capa `js/api/client.js` abstrae la red con `fetch`:

- `fetchTasks()`
- `createTaskRequest(data)`
- `updateTaskRequest(id, patch)`
- `deleteTaskRequest(id)`

La UI ahora maneja estados de red:

- Carga: mensaje "Cargando tareas desde el servidor...".
- Éxito: render normal de lista y estadísticas.
- Error: feedback visual cuando falla una petición.

## Pruebas de integración sugeridas (Postman/Thunder Client)

Prueba tanto escenarios felices como de error:

1. `GET /api/v1/tasks` sobre servidor recién iniciado (debe devolver `[]`).
2. `POST` válido y confirmar `201`.
3. `POST` sin `title` o con `title` corto (debe devolver `400`).
4. `PATCH` de una tarea existente (debe devolver `200`).
5. `DELETE` con ID inexistente (debe devolver `404`).
6. Simular error de servidor para verificar `500` sin filtrar detalles internos.

## Notas de persistencia

En esta fase las tareas se guardan en memoria (`let tasks = []` dentro del servicio). Al reiniciar el servidor, la colección se limpia. Esto es intencional para practicar arquitectura antes de conectar una base de datos real.