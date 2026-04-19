# Cursor workflow en TaskFlow

## Contexto

Se trabajo sobre el proyecto `TaskFlow` usando las capacidades principales de Cursor: chat contextual, edicion sobre archivo y cambios asistidos en multiples zonas.

## Atajos de teclado usados con mayor frecuencia

- `Ctrl + L`: abrir el chat de Cursor
- `Ctrl + K`: edicion inline sobre el codigo seleccionado
- `Ctrl + I`: abrir Composer para cambios asistidos en varias partes
- `Ctrl + Shift + P`: abrir la paleta de comandos
- `Ctrl + J`: abrir/cerrar terminal integrada
- `Ctrl + P`: busqueda rapida de archivos

## Ejemplos concretos de mejora de codigo

### 1) Carga de tareas mas robusta en `localStorage`

**Problema:** `loadTasks()` hacia `JSON.parse` directo y podia romper la app si habia datos corruptos o formato invalido.

**Mejora aplicada:** se agrego `try/catch`, validacion de arreglo y filtro de estructura minima de cada tarea.

**Impacto:** la app ya no falla al iniciar por datos malformados y se recupera devolviendo `[]`.

### 2) Edicion de tareas mas segura y limpia

**Problema:** `editTask()` no verificaba si la tarea existia y podia guardar cambios innecesarios.

**Mejora aplicada:** ahora valida la existencia de la tarea, respeta cancelar (`prompt === null`) y solo guarda si el titulo nuevo es valido y realmente cambio.

**Impacto:** menos escrituras innecesarias en estado/localStorage y mejor comportamiento al editar.

## Nota sobre exploracion de interfaz

Flujo recomendado para repetir la practica en Cursor:

1. Abrir `TaskFlow` en Cursor.
2. Recorrer panel de archivos, terminal integrada y chat.
3. Probar autocompletado con comentarios tipo "crear funcion para...".
4. Pedir explicaciones contextuales en chat sobre funciones de `app.js`.
5. Usar edicion inline para ajustes puntuales.
6. Usar Composer cuando el cambio afecte multiples archivos.
