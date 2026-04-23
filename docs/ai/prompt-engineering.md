# Prompt Engineering aplicado a TaskFlow

## Objetivo

Definir prompts reutilizables para usar IA de forma mas efectiva al desarrollar `TaskFlow`, incluyendo:

- rol definido
- few-shot prompting 
- razonamiento paso a paso
- restricciones claras de salida

---

## 1) Prompt con rol: desarrollador senior

**Prompt**

```text
Actua como un desarrollador senior frontend. Revisa `app.js` y detecta riesgos de mantenibilidad.
Quiero una respuesta en 3 bloques:
1) problemas criticos
2) mejoras recomendadas
3) plan de refactor en pasos pequenos.
No cambies codigo aun.
```

**Por que funciona bien**

- Fija un nivel de experiencia (senior), lo que eleva criterio tecnico.
- Define formato de salida, reduciendo respuestas desordenadas.
- Separa analisis de implementacion para evitar cambios prematuros.

---

## 2) Prompt con rol: revisor de codigo estricto

**Prompt**

```text
Actua como code reviewer estricto. Revisa los cambios recientes de `app.js`.
Prioriza bugs, regresiones y casos borde.
Entrega hallazgos ordenados por severidad: alta, media, baja.
Para cada hallazgo: impacto + propuesta de correccion.
```

**Por que funciona bien**

- Enfoca la IA en calidad y riesgos, no en estilo superficial.
- Pedir severidad ayuda a priorizar trabajo real.
- El formato impacto/correccion vuelve accionable la salida.

---

## 3) Prompt few-shot para estandar de funciones

**Prompt**

```text
Te doy el estilo esperado:
Ejemplo bueno:
/**
 * Calcula estadisticas de tareas.
 * @param {Array<{completed:boolean}>} tasks
 * @returns {{total:number,completed:number,pending:number,progress:number}}
 */
function calculateTaskStats(tasks) { ... }

Ejemplo malo:
function stats(a){...}

Ahora refactoriza estas funciones en `app.js` al estilo del ejemplo bueno:
- addTask
- editTask
- clearCompletedTasks
```

**Por que funciona bien**

- Los ejemplos alinean rapidamente formato y nivel de detalle.
- Reduce ambiguedad sobre nombres, JSDoc y legibilidad.
- Acelera consistencia sin tener que escribir reglas largas.

---

## 4) Prompt few-shot para mensajes de validacion

**Prompt**

```text
Usa estos ejemplos de tono para validaciones:
- "La tarea no puede estar vacia."
- "La tarea debe tener al menos 3 caracteres."
- "Ya existe una tarea con ese nombre."

Genera validaciones para el input de tarea en `app.js` manteniendo ese tono:
breve, claro, accionable y sin tecnicismos.
```

**Por que funciona bien**

- Pasa de "decir" el tono a "mostrar" el tono (mucho mas efectivo).
- Produce textos de UX uniformes.
- Evita respuestas largas o poco amigables para usuario final.

---

## 5) Prompt con razonamiento paso a paso para refactor

**Prompt**

```text
Antes de cambiar codigo, razona paso a paso:
1) identifica responsabilidades mezcladas en `app.js`
2) propone una separacion por modulos
3) define orden seguro de cambios
4) lista riesgos y como mitigarlos
Luego implementa el refactor.
```

**Por que funciona bien**

- Obliga a planificar antes de editar.
- Reduce errores al tocar muchas partes del sistema.
- Hace explicito el orden de ejecucion y mitigaciones.

---

## 6) Prompt con restricciones de salida estrictas

**Prompt**

```text
Refactoriza `toggleTaskStatus` y `deleteTask` en `app.js` con estas restricciones:
- no cambiar comportamiento funcional
- maximo 25 lineas por funcion
- nombres descriptivos en ingles o espanol consistente
- incluir JSDoc
- no agregar dependencias nuevas
Al final, lista exactamente que cambiaste en 5 bullets maximo.
```

**Por que funciona bien**

- Las restricciones limitan derivas innecesarias.
- Mantiene foco en objetivo puntual.
- Facilita revisar diff porque define limites claros.

---

## 7) Prompt para generar codigo + pruebas manuales

**Prompt**

```text
Implementa validacion de titulo en `addTask`:
- minimo 3 caracteres
- maximo 120
- sin duplicados (case-insensitive)
Despues dame un checklist manual de 8 pruebas (input, accion, resultado esperado).
```

**Por que funciona bien**

- Une implementacion y verificacion en una sola interaccion.
- El checklist permite validar rapido sin framework de testing.
- Asegura calidad funcional, no solo sintaxis.

---

## 8) Prompt para documentar cambios tecnicos

**Prompt**

```text
Documenta en `docs/ai/experiments.md` el experimento de refactor de TaskFlow con esta estructura:
1) objetivo
2) estado antes
3) cambios aplicados
4) resultados observados
5) riesgos/trade-offs
6) siguientes pasos
Mantener tono tecnico, concreto y breve.
```

**Por que funciona bien**

- Define plantilla exacta y evita documentos desordenados.
- Facilita comparar iteraciones de experimentos.
- Mantiene foco en evidencia y decisiones.

---

## 9) Prompt para mejorar arquitectura de archivos

**Prompt**

```text
Analiza la estructura del proyecto TaskFlow y propone una reorganizacion minima.
Reglas:
- no mover mas de 5 archivos
- no romper imports
- priorizar separacion entre logica de negocio y UI
- explicar impacto de cada movimiento en una linea
```

**Por que funciona bien**

- Combina creatividad con limites operativos realistas.
- Evita refactors masivos innecesarios.
- Hace visible el costo/beneficio de cada cambio.

---

## 10) Prompt para respuesta orientada a negocio + tecnica

**Prompt**

```text
Explica los cambios de TaskFlow para dos audiencias:
A) Product Owner (sin detalle tecnico, 6 bullets maximo)
B) Equipo tecnico (detalles de funciones y archivos modificados)
No repitas informacion entre A y B.
```

**Por que funciona bien**

- Fuerza comunicacion adaptada por audiencia.
- Reduce friccion entre negocio y desarrollo.
- Mejora transferibilidad del trabajo realizado.

---


## Recomendaciones practicas de uso

- Combina **rol + restricciones** cuando quieras precision.
- Usa **few-shot** cuando importe el estilo de salida.
- Pide **paso a paso** en tareas de refactor o arquitectura.
- Termina con criterios de verificacion para validar calidad.
- Guarda prompts efectivos por categoria para reutilizarlos en futuros proyectos.
