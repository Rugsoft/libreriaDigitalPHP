# Gestión de libros en la biblioteca digital

Esta aplicación web te permite organizar tu catálogo de libros favoritos desde un entorno local. Puedes registrar títulos, controlar los préstamos, ver estadísticas en tiempo real y exportar tus datos para no depender de ningún servicio externo. Toda la información se guarda directamente en tu navegador.

## Qué hace la aplicación

El sistema ofrece varias herramientas sencillas para el control de la colección:

Puedes añadir libros nuevos indicando su título, autor, género e ISBN. Si necesitas corregir la información de un libro ya guardado, al pulsar en modificar el formulario volverá a rellenarse con esos datos para que los edites cómodamente.

También puedes añadir imágenes de portada. Para que el almacenamiento de tu navegador no se agote, un canvas interno reduce y comprime las fotos a formato JPEG antes de guardarlas. Si decides dejar un libro sin foto, la aplicación colocará un icono gráfico genérico en su lugar.

El control de los préstamos se gestiona mediante un botón en cada fila que alterna el estado del libro entre disponible y prestado. Cuando marcas un libro como prestado, la aplicación suma un punto a su historial de alquileres. Con esta métrica, se genera una lista con los tres libros más populares en la sección izquierda.

Para encontrar libros rápidamente, el buscador filtra la tabla mientras escribes, contrastando el texto con títulos, autores, géneros e ISBN. También dispones de un filtro rápido para ver únicamente los libros que están prestados o los que siguen disponibles.

Por último, la aplicación facilita la portabilidad de los datos. Puedes descargar todo tu catálogo en formato JSON para recuperarlo en otro dispositivo, o generar informes en PDF y hojas de cálculo Excel con un solo clic.

## Estructura técnica

El desarrollo está resuelto con tecnologías web nativas, por lo que funciona al instante en cualquier navegador sin procesos de compilación previa:

El archivo HTML5 organiza las vistas en dos columnas para ordenadores y en una sola columna para pantallas móviles.

Los estilos en CSS nativo dibujan una estética oscura con acabados en tonos dorados, usando variables CSS para mantener la uniformidad y transiciones suaves en las animaciones de los botones y avisos flotantes.

El script en JavaScript procesa las interacciones de los formularios, las estadísticas reactivas, la renderización de la tabla y la sincronización con el almacenamiento web (localStorage).

Las exportaciones se apoyan en las librerías jsPDF (con su complemento autotable) y SheetJS, que generan los archivos descargables directamente en el cliente.
