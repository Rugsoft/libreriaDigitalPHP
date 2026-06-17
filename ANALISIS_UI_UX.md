# Análisis de la interfaz y experiencia de usuario en la biblioteca digital

Este documento presenta un análisis de la interfaz de usuario (UI) y la experiencia de usuario (UX) en la aplicación de la biblioteca digital. Aquí se detallan las decisiones de diseño visual, la organización de los contenidos, los mecanismos de interacción, la prevención de fallos y la correspondencia con las diez heurísticas de usabilidad de Nielsen.

---

## 1. Primer impacto visual y acción principal

La interfaz de la biblioteca digital utiliza una estética oscura con un diseño responsivo que equilibra el espacio disponible en pantalla.

### Lo primero que ve el usuario
Al abrir la aplicación, el usuario percibe los siguientes elementos:
1. El encabezado con el título "Gestión de libros" y un subtítulo explicativo de la aplicación.
2. Tres tarjetas de estadísticas superiores (total de libros, disponibles y prestados) que muestran números grandes sobre fondos oscuros con bordes dorados.
3. Una distribución en dos columnas en pantallas de escritorio. La izquierda contiene el formulario de registro, las acciones de importación y exportación de datos y la lista de libros más populares. La derecha se reserva para la tabla y las herramientas de búsqueda.

### La acción principal
La acción principal depende de lo que el usuario necesite hacer en ese momento:
- Si quiere introducir información, el formulario de la izquierda destaca con el botón "Añadir libro".
- Si quiere buscar o consultar, la barra de búsqueda y el selector de disponibilidad en la derecha guían la interacción.

---

## 2. Proporción entre texto e imágenes

La aplicación controla la densidad del texto para evitar la fatiga visual.

- El texto de los formularios se limita a etiquetas cortas y descriptivas con marcadores de posición claros en cada campo.
- En la tabla, las portadas de los libros aparecen como pequeñas miniaturas. Si un libro no tiene carátula, se muestra un icono SVG de un libro abierto para mantener el diseño limpio y evitar imágenes rotas.
- Al pasar el ratón sobre la portada, aparece una ventana flotante con la imagen ampliada que sigue el movimiento del cursor, lo que permite verificar la carátula al instante sin salir de la vista general.

---

## 3. Uso y psicología del color

Los colores tienen un propósito funcional además del estético:

- El fondo oscuro combina un color base casi negro con un degradado radial verdoso para crear profundidad.
- El color dorado se reserva para títulos, botones de acción y elementos seleccionados, lo que da un toque cuidado al diseño.
- Para las etiquetas de estado se usan tonos apagados: verde para los libros disponibles y rojo para los prestados. Esto permite saber si un libro está libre con un simple vistazo.

---

## 4. Respuestas del sistema y estados de interacción

La interfaz informa al usuario sobre el resultado de sus acciones en todo momento:

- Al realizar cambios, aparecen notificaciones temporales en la esquina inferior derecha. Se usan avisos verdes para confirmar éxitos (como añadir o prestar un libro) y rojos para los errores, que se ocultan solos a los pocos segundos.
- El formulario valida los datos antes de enviar. Si se intenta guardar un ISBN que ya existe, la aplicación cancela el registro, muestra una notificación de error y enfoca el cursor automáticamente en el campo del ISBN.
- Al seleccionar un archivo de imagen, la etiqueta de subida cambia para mostrar una vista previa con una opción para borrarla, confirmando que la imagen se cargó correctamente.
- Los botones y las filas de la tabla cambian de aspecto y muestran el cursor de mano al pasar por encima, indicando claramente qué elementos son interactivos.

---

## 5. Aplicación de las heurísticas de Nielsen

La estructura y el comportamiento de la biblioteca siguen principios básicos de usabilidad:

- Visibilidad del estado del sistema: Las estadísticas de la colección y las notificaciones emergentes reflejan cualquier cambio al instante.
- Lenguaje claro y familiar: Se utilizan términos habituales del mundo de los libros como "colección", "préstamo", "ISBN" o "portada".
- Libertad de acción: El usuario puede cancelar la edición de un libro en cualquier momento o eliminar la portada subida con un solo clic.
- Consistencia: Los colores, la tipografía y los botones se comportan igual en toda la página.
- Prevención de errores: Antes de eliminar un libro se solicita confirmación mediante un cuadro de diálogo flotante. También se impide el registro de identificadores ISBN duplicados.
- Reconocer antes que recordar: El buscador filtra la lista al escribir y la vista previa flotante de las portadas ayuda a identificar los títulos rápidamente.
- Flexibilidad de uso: La barra de búsqueda permite encontrar libros por título, autor, género o ISBN desde el mismo sitio.
- Diseño minimalista: Las fuentes y la distribución eliminan los elementos innecesarios para centrar la atención en el contenido.

---

## 6. Errores y problemas técnicos evitados

Se han implementado soluciones específicas para resolver problemas de rendimiento y usabilidad:

- Límite de almacenamiento local: Guardar imágenes grandes en Base64 llenaría rápidamente el espacio de almacenamiento del navegador (localStorage). Para solucionarlo, el código procesa las imágenes subidas con un canvas invisible, las escala a un tamaño óptimo (máximo 120 por 180 píxeles) y las guarda comprimidas en formato JPEG. Esto permite almacenar cientos de libros sin problemas.
- Desbordamiento de la previsualización: Si la carátula flotante aparece cerca de los límites de la pantalla, la aplicación calcula el espacio disponible y recoloca la ventana al otro lado del cursor para que nunca se corte ni tape la información.
- Pérdida de datos y borrados accidentales: La confirmación en dos pasos para eliminar registros y el guardado automático en local evitan la pérdida de información.

---

## 7. Decisiones de diseño implementadas

| Elemento | Solución | Beneficio |
| :--- | :--- | :--- |
| Estructura responsiva | Distribución en dos columnas que se adapta a móviles | Lectura fluida en cualquier pantalla sin desplazamiento horizontal |
| Vista previa flotante | Tarjeta de portada emergente con control de bordes | Identificación gráfica inmediata sin cambiar de página |
| Portada alternativa | Icono SVG nativo para libros sin imagen | Consistencia visual limpia en la tabla de datos |
| Estadísticas en vivo | Contadores automáticos en la parte superior | Estado general del catálogo visible al instante |
| Compresión de imágenes | Escalado y guardado en JPEG base64 | Almacenamiento eficiente de portadas en el navegador |
| Cuadro de confirmación | Ventana de diálogo modal para borrar libros | Evita la pérdida accidental de registros |
| Exportación múltiple | Descarga de datos en formatos JSON, PDF y Excel | Portabilidad completa de la colección de libros |
