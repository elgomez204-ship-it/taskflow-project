
TaskFlow utiliza un diseño con barra lateral para facilitar la navegación entre tareas y vistas.
La vista principal de estadísticas muestra un resumen visual del estado de las tareas mediante tarjetas,
una barra de progreso general y un desglose por categorías. Este enfoque permite al usuario entender
rápidamente su carga de trabajo y su progreso.

taskflow-project-chi.vercel.app
https://taskflow-project-2l41c6512-elgomez204-ship-its-projects.vercel.app/
Descripción general
La aplicación de gestión de tareas TaskFlow es una herramienta web completa desarrollada para ayudar a los usuarios a organizar sus tareas personales de forma sencilla e intuitiva. Permite crear nuevas tareas con un título, marcarlas como completadas cuando se finalizan y eliminarlas cuando ya no son necesarias. Toda la información se guarda de forma persistente, lo que significa que los datos se conservan aunque el usuario recargue o cierre la página del navegador.
Pruebas manuales
La aplicación ha superado con éxito la totalidad de las pruebas manuales establecidas. Se verificó que la interfaz se muestra correctamente cuando la lista de tareas está vacía, sin errores ni elementos rotos. Se comprobó que el sistema valida correctamente el formulario e impide crear una tarea si el campo del título está vacío. También se probó que la aplicación maneja sin problemas títulos de gran longitud, adaptándose al diseño sin desbordamientos. Las funciones de marcar tareas como completadas y de eliminar múltiples tareas funcionan de forma fluida y encadenada. Por último, se confirmó que al recargar la página todos los datos permanecen intactos, lo que valida el correcto funcionamiento de la persistencia.
Accesibilidad
La aplicación cumple con los requisitos básicos de accesibilidad web.Todos los botones interactivos cuentan con texto descriptivo o con el atributo aria-label, lo que garantiza su compatibilidad con lectores de pantalla. El contraste de colores ha sido revisado y se ajusta a las directrices de accesibilidad. Además, el indicador de foco es claramente visible al navegar entre los elementos con la tecla Tab, facilitando la orientación del usuario en todo momento.
Despliegue en producción
El proyecto se encuentra desplegado y completamente operativo en Vercel. El repositorio de GitHub fue conectado directamente con Vercel, lo que permitió importar y publicar el proyecto de forma automática. Se realizó una prueba de cambio en el código que fue subida a GitHub, confirmando que Vercel detecta los cambios y ejecuta un redespliegue automático sin intervención manual. La URL pública de la aplicación ha sido documentada en el archivo README del repositorio, quedando el proyecto accesible para cualquier usuario desde cualquier navegador moderno.