# TaskFlow

TaskFlow es una aplicacion web para gestionar tareas personales con foco en productividad diaria. Incluye estadisticas, filtros, busqueda, prioridades y fecha limite, manteniendo persistencia local para no perder datos al recargar.

## Demo

- [taskflow-project-chi.vercel.app](https://taskflow-project-chi.vercel.app)
- [taskflow-project-2l41c6512-elgomez204-ship-its-projects.vercel.app](https://taskflow-project-2l41c6512-elgomez204-ship-its-projects.vercel.app/)

## Funcionalidades principales

- Crear tareas con validaciones (vacio, longitud minima/maxima, duplicados).
- Marcar tareas como completadas o pendientes.
- Editar titulo de tareas con doble clic.
- Eliminar tareas y deshacer eliminacion (undo temporal).
- Buscar tareas por texto.
- Filtrar por estado: todas, pendientes, completadas.
- Ordenar tareas: recientes, antiguas, A-Z, completadas primero, prioridad alta.
- Definir prioridad por tarea: alta, media, baja.
- Definir fecha limite y resaltar tareas vencidas.
- Ver estadisticas globales: total, completadas, pendientes y progreso.
- Modo oscuro con persistencia.

## Estructura del proyecto

```text
TaskFlow/
  app.js                 # Orquestacion, estado global y eventos
  index.html             # UI principal
  js/
    task-manager.js      # Logica de negocio y persistencia
    ui.js                # Render de items y helpers de interfaz
  docs/ai/               # Evidencias y experimentos con IA
```

## Como ejecutar en local

1. Clona el repositorio.
2. Abre la carpeta en Cursor o VS Code.
3. Ejecuta un servidor estatico (ejemplo con Python):
   - `python -m http.server 5500`
4. Abre `http://localhost:5500` en el navegador.

## Ejemplos de uso

### Ejemplo 1: planificar el dia por prioridad

1. Crear tareas usando `Prioridad alta` para bloques criticos.
2. Elegir orden `Prioridad alta primero`.
3. Revisar progreso en tarjetas y barra para cierre diario.

### Ejemplo 2: seguimiento semanal con fecha limite

1. Crear tareas con fecha en `due date`.
2. Filtrar por `Pendientes`.
3. Identificar tareas vencidas (fecha en rojo) y replanificar.

### Ejemplo 3: limpieza rapida de backlog

1. Buscar por texto (por ejemplo "docs").
2. Marcar varias como completadas.
3. Ejecutar `Borrar completadas` y, si fue accidental, `Deshacer`.

## Calidad y validaciones

- Persistencia en `localStorage` con carga segura ante datos corruptos.
- Validaciones centralizadas de titulo y metadatos de tarea.
- Manejo de estado vacio y mensajes de error de formulario.

## Accesibilidad

- Controles con texto legible y foco visible.
- Contraste compatible con modo claro/oscuro.
- Mensajes de validacion visibles en contexto del formulario.

## Documentacion adicional

- `docs/ai/experiments.md`
- `docs/ai/prompt-engineering.md`
- `docs/ai/cursor-workflow.md`