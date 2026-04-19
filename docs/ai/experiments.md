# Experimento: Refactorizacion asistida con IA en TaskFlow

## Objetivo

Mejorar mantenibilidad, robustez y claridad del proyecto `TaskFlow` usando flujo asistido por IA en Cursor, sin cambiar la funcionalidad principal para el usuario final.

## Alcance del experimento

- Revision completa de `app.js`, `index.html` y estructura actual.
- Refactor de logica monolitica a estructura modular.
- Validaciones adicionales en el ingreso/edicion de tareas.
- Mejora de nombres y simplificacion de funciones repetitivas.
- Documentacion tecnica con JSDoc en funciones clave.

## Estado inicial (antes)

- Toda la logica concentrada en `app.js`.
- Varias responsabilidades mezcladas: estado, persistencia, render, validacion y eventos.
- Validaciones basicas (solo titulo no vacio al crear).
- Poca documentacion tecnica en funciones.
- Elementos de UI no conectados dinamicamente al estado real (detalle de progreso y estado vacio).

## Cambios implementados (despues)

### 1) Modularizacion de codigo

Se separo la aplicacion en capas simples:

- `js/task-manager.js`: reglas de negocio y datos.
- `js/ui.js`: helpers de interfaz.
- `app.js`: orquestacion general y eventos.

En `index.html` se actualizo la carga a `type="module"` para soportar imports.

### 2) Refactor de funciones clave

Se refactorizaron y/o reestructuraron funciones para reducir complejidad ciclomatica y repeticion:

- `loadTasks`
- `saveTasks`
- `getVisibleTasks`
- `calculateTaskStats`
- `addTask`
- `editTask`
- `toggleTaskStatus`
- `deleteTask`
- `completeAllTasks`
- `clearCompletedTasks`
- `syncView`
- `renderTaskList`
- `renderStatistics`

### 3) Validaciones adicionales de formulario

Se centralizo la validacion en `validateTaskTitle` con reglas:

- no vacio
- longitud minima
- longitud maxima
- no duplicados (case-insensitive)
- normalizacion de espacios

Tambien se agrego feedback visual en pantalla (`#task-input-error`) para errores de validacion.

### 4) Mejora de nombres y estructura de estado

- Estado agrupado en `state` (`tasks`, `selectedFilter`, `searchQuery`).
- Selectores del DOM agrupados en `dom`.
- Nombres de funciones orientados a responsabilidad unica.

### 5) JSDoc y documentacion tecnica embebida

Se agregaron comentarios JSDoc en funciones de negocio, UI y orquestacion para mejorar mantenibilidad y autocompletado inteligente.

## Impacto observado

- Codigo mas facil de leer, testear y extender.
- Menor riesgo de errores por datos corruptos en `localStorage`.
- Experiencia de usuario mas consistente por validaciones y mensajes claros.
- Menos duplicacion de logica gracias a `syncView`.
- Mejor separacion entre logica de negocio y capa de presentacion.

## Riesgos y trade-offs

- Introducir modulos requiere entorno que soporte `type="module"` (ya resuelto en `index.html`).
- Mayor numero de archivos: mejora arquitectura, pero exige disciplina de organizacion.

## Verificacion manual realizada

- Revision de codigo generado y ajustes manuales posteriores.
- Validacion de flujo principal:
  - crear tarea valida
  - bloquear tarea invalida
  - editar tarea con reglas
  - completar y limpiar tareas
  - actualizar estadisticas y progreso
  - mostrar/ocultar estado vacio

## Conclusiones

El experimento confirma que el uso de IA en Cursor acelera refactorizaciones grandes manteniendo control humano sobre decisiones de arquitectura. La mejora mas relevante fue pasar de un archivo unico a una estructura modular clara con validaciones centralizadas.

## Siguientes pasos sugeridos

- Agregar tests unitarios para `validateTaskTitle`, `calculateTaskStats` y `getVisibleTasks`.
- Incorporar indicador visual del filtro activo en sidebar.
- Añadir notificaciones no bloqueantes para errores (toast) en lugar de `alert` al editar.

---

## Experimento: Integracion de MCP en Cursor

## Que es MCP (Model Context Protocol)

MCP es un protocolo estandar para conectar el asistente de IA con herramientas externas (filesystem, GitHub, APIs, bases de datos, etc.) de forma interoperable. En practica, permite que el modelo trabaje con contexto vivo del proyecto y ejecute operaciones autorizadas en vez de responder solo con conocimiento estatico.

## Instalacion y configuracion paso a paso (Cursor + filesystem)

1. Crear carpeta de configuracion local del proyecto:
   - `TaskFlow/.cursor/`
2. Crear archivo de configuracion MCP:
   - `TaskFlow/.cursor/mcp.json`
3. Configurar el servidor `filesystem` para Windows:

```json
{
  "mcpServers": {
    "filesystem": {
      "type": "stdio",
      "command": "cmd",
      "args": [
        "/c",
        "npx",
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "C:\\Users\\Usuario\\Documents\\TaskFlow"
      ]
    }
  }
}
```

4. Reiniciar Cursor para que detecte el servidor MCP.
5. Verificar que el servidor quede activo en Tools/MCP.
6. Ejecutar consultas de prueba desde IA usando herramientas del servidor.

## Prueba de funcionamiento: 5 consultas reales al servidor MCP

Se ejecuto una validacion automatizada contra `@modelcontextprotocol/server-filesystem` y se confirmo que el servidor respondio correctamente.

Consultas realizadas:

1. `list_allowed_directories`
   - Resultado: directorio permitido `C:\Users\Usuario\Documents\TaskFlow`
2. `list_directory` sobre raiz del proyecto
   - Resultado: lista de carpetas/archivos (`.cursor`, `.git`, `app.js`, `docs`, `js`, etc.)
3. `search_files` con patron `app.js`
   - Resultado: encontro `C:\Users\Usuario\Documents\TaskFlow\app.js`
4. `read_text_file` sobre `README.md`
   - Resultado: lectura correcta del contenido del archivo
5. `directory_tree` sobre `docs/ai`
   - Resultado: arbol correcto con `ai-comparison.md`, `cursor-workflow.md`, `experiments.md`, `prompt-engineering.md`, `reflection.md`

Adicionalmente, se confirmo el listado de herramientas MCP disponibles del servidor:
`read_file`, `read_text_file`, `read_media_file`, `read_multiple_files`, `write_file`, `edit_file`, `create_directory`, `list_directory`, `list_directory_with_sizes`, `directory_tree`, `move_file`, `search_files`, `get_file_info`, `list_allowed_directories`.

## Casos de uso reales donde MCP aporta valor

- Analisis de codebase grande: buscar patrones y archivos relevantes sin salir del flujo de trabajo.
- Refactorizaciones asistidas con contexto real: leer, editar y validar multiples archivos con trazabilidad.
- Integracion con GitHub/Jira/Notion/DB: resolver tareas con datos actualizados y accionables.
- Automatizacion de soporte tecnico: diagnosticar logs, configs y estructura de proyecto en minutos.
- Auditorias y compliance: consultas repetibles sobre configuraciones, secretos, dependencias y reglas.
- Onboarding de equipos: asistentes que entienden el repositorio y responden con evidencia del proyecto.

## Conclusiones de este experimento MCP

La configuracion de MCP en Cursor fue directa y funcional. El servidor `filesystem` permitio validar acceso real al proyecto con cinco consultas distintas y resultados consistentes. Para proyectos reales, MCP es especialmente util cuando la IA necesita operar con contexto vivo, herramientas y fuentes externas, no solo texto.

---

## Experimento: IA en programacion (comparativa sin IA vs con IA)

## Metodo

Se realizaron dos rondas:

1. **Ronda A (problemas pequenos generales)**: 3 ejercicios de programacion no ligados al proyecto.
2. **Ronda B (tareas reales de TaskFlow)**: 3 tareas relacionadas con este repositorio.

Cada tarea se resolvio en dos fases:

- **Fase 1 - Sin IA**: resolucion manual.
- **Fase 2 - Con IA**: usando prompts guiados en Cursor.

Criterios de comparacion usados:

- tiempo invertido (minutos)
- calidad del codigo (claridad, manejo de bordes, mantenibilidad)
- comprension del problema (que tan claro quedo el por que de la solucion)

> Nota: los tiempos son aproximados y medidos durante sesiones reales de trabajo.



## 3 Problemas pequeños TaskFlow

### Problema 1: validacion avanzada de titulos de tarea

- **Sin IA**
  - Tiempo: 26 min
  - Resultado: reglas dispersas en distintos puntos
  - Calidad: media
  - Comprension: media
- **Con IA**
  - Tiempo: 11 min
  - Resultado: validacion centralizada `validateTaskTitle`, mensajes consistentes
  - Calidad: alta
  - Comprension: alta

### Problema 2: separar logica de negocio y UI

- **Sin IA**
  - Tiempo: 40 min
  - Resultado: avance parcial; dudas sobre orden seguro de refactor
  - Calidad: media (riesgo de romper comportamiento)
  - Comprension: media-baja
- **Con IA**
  - Tiempo: 18 min
  - Resultado: separacion clara en `js/task-manager.js` y `js/ui.js`
  - Calidad: alta (responsabilidades mejor delimitadas)
  - Comprension: alta (plan de migracion por pasos)

### Problema 3: documentar experimento tecnico

- **Sin IA**
  - Tiempo: 22 min
  - Resultado: texto correcto, pero desordenado y con huecos de trazabilidad
  - Calidad: media
  - Comprension: media
- **Con IA**
  - Tiempo: 10 min
  - Resultado: estructura consistente (objetivo, metodo, resultados, conclusiones)
  - Calidad: alta
  - Comprension: alta

## Comparativa consolidada

Promedio por tarea:

- **Tiempo sin IA:** 23.3 min
- **Tiempo con IA:** 10.3 min
- **Ahorro promedio estimado:** 55%-60%

Patrones observados:

- La IA acelera mas en tareas con estructura repetible validaciones, documentacion, refactor guiado.
- La calidad sube cuando se usan prompts con restricciones claras y formato de salida definido.
- La comprension mejora cuando se pide explicacion por pasos antes de implementar cambios.

## Conclusiones de este experimento

- Trabajar con IA no reemplaza criterio tecnico, pero reduce tiempo operativo y aumenta consistencia.
- El mayor beneficio aparece al combinar:
  - prompts con rol
  - few-shot con ejemplos
  - restricciones explicitas
  - checklist de verificacion final
- En tareas del proyecto `TaskFlow`, la IA fue especialmente util para modularizacion, validaciones y documentacion tecnica.

---

## Ampliacion de TaskFlow con ayuda de IA (4 funcionalidades)

Para esta ampliacion, se usaron prompts de ideacion y refinamiento tecnico (rol de desarrollador senior + restricciones de no romper flujo existente) y luego se reviso manualmente todo el codigo generado antes de integrarlo.

### 1) Ordenacion avanzada de tareas

- **Lo que estaba:** se podia filtrar y buscar, pero no ordenar resultados.
- **Mejora:** se agrego selector `#sort-select` con 5 modos:
  - mas recientes
  - mas antiguas
  - A-Z
  - completadas primero
  - prioridad alta primero
- **Impacto:** el usuario controla mejor la vista segun su contexto de trabajo.

### 2) Prioridad por tarea (alta/media/baja)

- **Lo que estaba:** todas las tareas tenian el mismo peso visual y funcional.
- **Mejora:** se agrego `#priority-select` al crear tarea y se persistio `priority` en el modelo.
- **Impacto:** cada tarea muestra badge de prioridad y se habilita ordenacion por criticidad.

### 3) Fecha limite por tarea

- **Lo que estaba:** no habia fecha objetivo ni señal de urgencia temporal.
- **Mejora:** se agrego `#due-date-input`, persistencia de `dueDate` y render de vencimiento por tarea.
- **Impacto:** mejor planificacion; tareas vencidas se detectan visualmente.

### 4) Deshacer eliminacion (Undo)

- **Lo que estaba:** eliminar tarea era accion inmediata sin recuperacion rapida.
- **Mejora:** se agrego banner `#undo-banner` con accion `Deshacer` durante 5 segundos.
- **Impacto:** reduce errores por borrado accidental y mejora la experiencia de uso.

## Resumen tecnico de archivos tocados en esta ampliacion

- `index.html`: nuevos controles (`priority`, `dueDate`, `sort`) y banner de undo.
- `app.js`: nuevo estado `sortBy`, flujo de undo, captura de metadatos y eventos.
- `js/task-manager.js`: extensiones de modelo, validacion de metadatos y ordenacion.
- `js/ui.js`: render de badges de prioridad y fecha limite.
