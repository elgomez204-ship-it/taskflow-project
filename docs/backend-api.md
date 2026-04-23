# Backend API - Conceptos clave

## Axios

Axios es una librería cliente HTTP para navegador y Node.js. Se usa para consumir APIs de forma más ergonómica que `fetch`, con ventajas como interceptores, timeout sencillo y transformación automática de JSON.

Se suele usar cuando:
- quieres centralizar autenticación con interceptores;
- necesitas manejo consistente de errores;
- quieres reutilizar una instancia configurada en toda la app.

## Postman

Postman es una herramienta para diseñar, probar y documentar APIs. Permite construir colecciones de peticiones, automatizar tests de respuesta y compartir contratos entre equipos.

Se usa para:
- validar endpoints manualmente en desarrollo;
- probar casos límite (payload inválido, IDs inexistentes, etc.);
- generar evidencia de pruebas de integración.

## Sentry

Sentry es una plataforma de monitoreo de errores en tiempo real. Captura excepciones, traza stack, contexto del usuario y métricas de rendimiento para diagnosticar fallos en producción.

Se usa para:
- detectar errores backend/frontend que no aparecen en local;
- reducir tiempo de diagnóstico;
- priorizar incidencias por impacto real.

## Swagger (OpenAPI)

Swagger es el ecosistema de herramientas alrededor de la especificación OpenAPI. Permite describir formalmente una API (rutas, parámetros, schemas, respuestas) y generar documentación interactiva.

Se usa para:
- mantener contrato de API claro y versionado;
- facilitar integración entre frontend y backend;
- habilitar mock servers o generación de clientes SDK.
