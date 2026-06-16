/**
 * Estado de la aplicación: Lista de libros y estado de modificación.
 */
let libros = [];
let isbnModificacion = null; // Almacena el ISBN del libro que se está editando
let isbnParaEliminar = null; // Almacena el ISBN del libro que se desea eliminar mediante el modal
let portadaBase64 = ""; // Almacena la imagen de portada comprimida en base64

const tituloInput = document.querySelector(".contenedor__añadir-titulo");

// Referencias a los elementos del DOM de entrada y formulario
const inputTitulo = document.getElementById("titulo");
const inputAutor = document.getElementById("autor");
const inputGenero = document.getElementById("genero");
const inputIsbn = document.getElementById("ISBN");
const inputBuscar = document.getElementById("buscar");
const inputPortada = document.getElementById("portada");

// Referencias a los elementos de vista previa de portada
const previewContainer = document.getElementById("portadaPreviewContainer");
const previewImg = document.getElementById("portadaPreview");
const btnEliminarPortada = document.getElementById("btnEliminarPortada");
const labelPortada = document.getElementById("portadaLabel");

// Referencias a los elementos de la previsualización flotante hover
const hoverPreview = document.getElementById("portadaHoverPreview");
const hoverPreviewImg = document.getElementById("portadaHoverPreviewImg");

// Referencias a los elementos de visualización de datos y contadores
const numeroRegistros = document.getElementById("totalLibros");
const registroDisponibles = document.getElementById("registrosDisponibles");
const registroNoDisponibles = document.getElementById("registrosNoDisponibles");
const tablaLibros = document.getElementById("tablaLibros");

// Referencias a los botones y elementos de control
const btnAñadir = document.getElementById("btnAñadir");
const btnCancelar = document.getElementById("btnCancelar");
const formularioAñadir = document.getElementById("formularioAñadir");
const estadoLibros = document.getElementById("estadoLibros");
const btnImportar = document.getElementById("btnImportar");
const btnExportar = document.getElementById("btnExportar");
const btnExportarPdf = document.getElementById("btnExportarPdf");

// Registro de manejadores de eventos
formularioAñadir.addEventListener("submit", añadirLibro);
btnCancelar.addEventListener("click", limpiarFormulario);
estadoLibros.addEventListener("change", filtrarYMostrarLibros); // Filtrado instantáneo al cambiar el selector
inputBuscar.addEventListener("input", filtrarYMostrarLibros); // Filtrado reactivo en tiempo real al escribir
btnImportar.addEventListener("click", importarLibros);
btnExportar.addEventListener("click", exportarLibros);
btnExportarPdf.addEventListener("click", exportarPdf);
inputPortada.addEventListener("change", procesarImagenPortada);
btnEliminarPortada.addEventListener("click", eliminarPortadaSeleccionada);

// Registro de eventos para previsualización flotante al hacer hover
tablaLibros.addEventListener("mouseover", mostrarHoverPortada);
tablaLibros.addEventListener("mousemove", moverHoverPortada);
tablaLibros.addEventListener("mouseout", ocultarHoverPortada);

// Registro de eventos para el Modal de Confirmación
document.getElementById("modalBtnCancelar").addEventListener("click", cerrarModalEliminar);
document.getElementById("modalBtnConfirmar").addEventListener("click", () => {
    if (isbnParaEliminar) {
        ejecutarEliminacion(isbnParaEliminar);
    }
    cerrarModalEliminar();
});

/**
 * Muestra una notificación Toast en la pantalla.
 * @param {string} mensaje - El texto a mostrar.
 * @param {string} tipo - El tipo de notificación ('success' o 'error').
 */
function mostrarToast(mensaje, tipo = 'success') {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.classList.add("toast");
    if (tipo === 'success') {
        toast.classList.add("toast--success");
        toast.innerHTML = `
            <svg class="toast-icono" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <span>${mensaje}</span>
        `;
    } else {
        toast.classList.add("toast--error");
        toast.innerHTML = `
            <svg class="toast-icono" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <span>${mensaje}</span>
        `;
    }

    container.appendChild(toast);

    // Activar animación de entrada
    setTimeout(() => {
        toast.classList.add("mostrar");
    }, 10);

    // Auto-desvanecer y eliminar del DOM
    setTimeout(() => {
        toast.classList.remove("mostrar");
        setTimeout(() => {
            toast.remove();
        }, 350);
    }, 3500);
}

/**
 * Abre el modal de confirmación de borrado.
 * @param {string} isbn - El ISBN del libro a eliminar.
 */
function abrirModalEliminar(isbn) {
    isbnParaEliminar = isbn;
    const modal = document.getElementById("modalConfirmacion");
    modal.classList.remove("oculto");
    document.getElementById("modalBtnConfirmar").focus();
}

/**
 * Cierra el modal de confirmación de borrado.
 */
function cerrarModalEliminar() {
    isbnParaEliminar = null;
    const modal = document.getElementById("modalConfirmacion");
    modal.classList.add("oculto");
}

/**
 * Añade un nuevo libro o guarda los cambios de uno existente en el formulario.
 * @param {Event} event - Evento del formulario.
 */
function añadirLibro(event) {
    if (event) event.preventDefault();

    const titulo = inputTitulo.value.trim();
    const autor = inputAutor.value.trim();
    const genero = inputGenero.value.trim();
    const isbn = inputIsbn.value.trim();

    // Validar que todos los campos estén llenos
    if (titulo === "" || autor === "" || genero === "" || isbn === "") {
        mostrarToast("Por favor, rellene todos los campos antes de añadir el libro.", "error");
        return;
    }

    if (isbnModificacion !== null) {
        // Encontrar la posición del libro original por su ISBN previo
        const indice = libros.findIndex(libro => libro.isbn === isbnModificacion);

        if (indice !== -1) {
            // Validar que el nuevo ISBN no esté ya en uso por otro libro diferente
            const isbnDuplicado = libros.some((libro, i) => libro.isbn === isbn && i !== indice);
            if (isbnDuplicado) {
                mostrarToast("Error: Ya existe otro libro registrado con este ISBN.", "error");
                inputIsbn.focus();
                return;
            }

            // Actualizar los datos del libro existente
            libros[indice] = {
                titulo,
                autor,
                genero,
                isbn,
                isDisponible: libros[indice].isDisponible,
                alquiladoCount: libros[indice].alquiladoCount || 0,
                portada: portadaBase64
            };
            mostrarToast(`"${titulo}" se ha actualizado correctamente.`, "success");
        }
        isbnModificacion = null;
        btnAñadir.innerHTML = "<span>Añadir libro</span>";
    } else {
        // Validar que el ISBN del nuevo libro no esté repetido
        const isbnDuplicado = libros.some(libro => libro.isbn === isbn);
        if (isbnDuplicado) {
            mostrarToast("Error: Ya existe un libro registrado con este ISBN.", "error");
            inputIsbn.focus();
            return;
        }

        // Crear y añadir el nuevo objeto de libro
        const nuevoLibro = {
            titulo,
            autor,
            genero,
            isbn,
            isDisponible: true,
            alquiladoCount: 0,
            portada: portadaBase64
        };
        libros.push(nuevoLibro);
        mostrarToast(`"${titulo}" se ha añadido correctamente a la colección.`, "success");
    }

    limpiarFormulario();
    guardarLibrosLocalStorage();
    filtrarYMostrarLibros();
}

/**
 * Limpia los valores de los inputs del formulario y regresa el foco al título.
 */
function limpiarFormulario() {
    inputTitulo.value = "";
    inputAutor.value = "";
    inputGenero.value = "";
    inputIsbn.value = "";
    inputPortada.value = "";
    portadaBase64 = "";
    previewImg.src = "";
    previewContainer.classList.add("oculto");
    labelPortada.classList.remove("oculto");
    inputTitulo.focus();
    btnAñadir.innerHTML = "<span>Añadir libro</span>";
    isbnModificacion = null;
    btnCancelar.classList.add("oculto");
    tituloInput.textContent = "Añadir Libros a la Colección";
}

/**
 * Filtra los libros según el estado del selector y el texto del buscador.
 * Esta función unifica la renderización reactiva de la aplicación.
 */
function filtrarYMostrarLibros() {
    const criterioEstado = estadoLibros.value; // "todos", "disponibles", "noDisponibles"
    const criterioBusqueda = inputBuscar.value.trim().toLowerCase();

    const librosFiltrados = libros.filter(libro => {
        // 1. Filtrar por estado de disponibilidad
        let cumpleEstado = true;
        if (criterioEstado === "disponibles") {
            cumpleEstado = libro.isDisponible;
        } else if (criterioEstado === "noDisponibles") {
            cumpleEstado = !libro.isDisponible;
        }

        // 2. Filtrar por término de búsqueda (Título, Autor, Género o ISBN)
        let cumpleBusqueda = true;
        if (criterioBusqueda !== "") {
            // Asegurar que exista el ISBN antes de buscar sobre él
            const isbnLibro = libro.isbn ? libro.isbn.toLowerCase() : "";
            cumpleBusqueda =
                libro.titulo.toLowerCase().includes(criterioBusqueda) ||
                libro.autor.toLowerCase().includes(criterioBusqueda) ||
                libro.genero.toLowerCase().includes(criterioBusqueda) ||
                isbnLibro.includes(criterioBusqueda);
        }

        return cumpleEstado && cumpleBusqueda;
    });

    mostrarLibros(librosFiltrados);
}

/**
 * Renderiza los libros proporcionados en la tabla HTML del DOM o muestra un empty state.
 * @param {Array} datosLibros - Array de libros a pintar.
 */
function mostrarLibros(datosLibros = libros) {
    tablaLibros.innerHTML = "";

    if (datosLibros.length === 0) {
        // Mostrar Empty State elegante si no hay resultados
        const filaVacia = document.createElement("tr");
        const celdaVacia = document.createElement("td");
        celdaVacia.setAttribute("colspan", "7");
        
        celdaVacia.innerHTML = `
            <div class="empty-state">
                <svg class="empty-state__icono" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
                <h4 class="empty-state__titulo">No se encontraron libros</h4>
                <p class="empty-state__texto">Tu colección está vacía o no hay libros que coincidan con los filtros de búsqueda.</p>
            </div>
        `;
        filaVacia.appendChild(celdaVacia);
        tablaLibros.appendChild(filaVacia);
        actualizarRegistro();
        return;
    }

    datosLibros.forEach((libro) => {
        const fila = document.createElement("tr");

        // Celda del ISBN
        const tdIsbn = document.createElement("td");
        tdIsbn.textContent = libro.isbn || "—";

        // Celda de Portada
        const tdPortada = document.createElement("td");
        if (libro.portada) {
            const imgPortada = document.createElement("img");
            imgPortada.src = libro.portada;
            imgPortada.classList.add("tabla-portada");
            imgPortada.alt = `Portada de ${libro.titulo}`;
            tdPortada.appendChild(imgPortada);
        } else {
            const divPlaceholder = document.createElement("div");
            divPlaceholder.classList.add("tabla-portada-placeholder");
            divPlaceholder.innerHTML = `
                <svg class="placeholder-icono" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
            `;
            tdPortada.appendChild(divPlaceholder);
        }

        // Celda del Título
        const tdTitulo = document.createElement("td");
        tdTitulo.textContent = libro.titulo;

        // Celda del Autor
        const tdAutor = document.createElement("td");
        tdAutor.textContent = libro.autor;

        // Celda del Género
        const tdGenero = document.createElement("td");
        tdGenero.textContent = libro.genero;

        // Celda de Disponibilidad
        const tdDisponibilidad = document.createElement("td");
        const spanEstado = document.createElement("span");
        spanEstado.classList.add("status-badge");
        if (libro.isDisponible) {
            spanEstado.textContent = "Disponible";
            spanEstado.classList.add("status-badge--disponible");
        } else {
            spanEstado.textContent = "Prestado";
            spanEstado.classList.add("status-badge--prestado");
        }
        tdDisponibilidad.appendChild(spanEstado);

        // Celda de Acciones con sus respectivos botones
        const tdAcciones = document.createElement("td");
        const contenedorBotones = document.createElement("div");
        contenedorBotones.classList.add("contenedor__listado-acciones");

        // Botón Eliminar
        const botonEliminar = document.createElement("button");
        botonEliminar.classList.add("boton-eliminar");
        botonEliminar.innerHTML = `
            <svg class="btn-icono" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
            <span>Eliminar</span>
        `;
        botonEliminar.addEventListener("click", () => eliminarLibro(libro.isbn));

        // Botón Modificar
        const botonModificar = document.createElement("button");
        botonModificar.classList.add("boton-modificar");
        botonModificar.innerHTML = `
            <svg class="btn-icono" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.83 20.082a4.5 4.5 0 0 1-2.054 1.215L2.5 22l.707-2.278a4.5 4.5 0 0 1 1.215-2.054l12.44-12.44Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 7.125 16.862 4.487" />
            </svg>
            <span>Modificar</span>
        `;
        botonModificar.addEventListener("click", () => modificarLibro(libro.isbn));

        // Botón Prestar / Devolver
        const botonPrestar = document.createElement("button");
        botonPrestar.classList.add("boton-prestar");
        const prestadoSvg = `<svg class="btn-icono" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" /></svg>`;
        const prestarSvg = `<svg class="btn-icono" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 9l6 6m0 0l-6 6m6-6H9a6 6 0 0 1 0-12h3" /></svg>`;
        botonPrestar.innerHTML = libro.isDisponible ? 
            `${prestarSvg}<span>Prestar</span>` : 
            `${prestadoSvg}<span>Devolver</span>`;
        botonPrestar.addEventListener("click", () => prestamoLibro(libro.isbn));

        contenedorBotones.appendChild(botonEliminar);
        contenedorBotones.appendChild(botonModificar);
        contenedorBotones.appendChild(botonPrestar);
        tdAcciones.appendChild(contenedorBotones);

        // Añadir todas las celdas a la fila
        fila.appendChild(tdIsbn);
        fila.appendChild(tdPortada);
        fila.appendChild(tdTitulo);
        fila.appendChild(tdAutor);
        fila.appendChild(tdGenero);
        fila.appendChild(tdDisponibilidad);
        fila.appendChild(tdAcciones);

        // Insertar la fila en el cuerpo de la tabla
        tablaLibros.appendChild(fila);
    });

    actualizarRegistro();
}

/**
 * Actualiza los contadores de cantidad total y libros disponibles en el DOM.
 */
function actualizarRegistro() {
    numeroRegistros.textContent = libros.length;
    const disponibles = libros.filter(libro => libro.isDisponible).length;
    registroDisponibles.textContent = disponibles;
    registroNoDisponibles.textContent = libros.length - disponibles;
    actualizarTopLibros();
}

/**
 * Elimina un libro de la lista a partir de su ISBN.
 * @param {string} isbn - El ISBN del libro a eliminar.
 */
function eliminarLibro(isbn) {
    abrirModalEliminar(isbn);
}

/**
 * Realiza la eliminación real tras la confirmación en el modal.
 * @param {string} isbn - El ISBN del libro.
 */
function ejecutarEliminacion(isbn) {
    const indice = libros.findIndex(libro => libro.isbn === isbn);
    if (indice !== -1) {
        const tituloEliminado = libros[indice].titulo;
        libros.splice(indice, 1);
        guardarLibrosLocalStorage();
        filtrarYMostrarLibros();
        mostrarToast(`"${tituloEliminado}" se ha eliminado de la colección.`, "success");
    }
}

/**
 * Carga los datos de un libro en el formulario para editarlo.
 * @param {string} isbn - El ISBN del libro a modificar.
 */
function modificarLibro(isbn) {
    const indice = libros.findIndex(libro => libro.isbn === isbn);

    if (indice === -1) return;

    // Poblar los campos del formulario con los valores del libro seleccionado
    inputTitulo.value = libros[indice].titulo;
    inputAutor.value = libros[indice].autor;
    inputGenero.value = libros[indice].genero;
    inputIsbn.value = libros[indice].isbn || "";

    // Cargar la portada si existe
    if (libros[indice].portada) {
        portadaBase64 = libros[indice].portada;
        previewImg.src = portadaBase64;
        previewContainer.classList.remove("oculto");
        labelPortada.classList.add("oculto");
    } else {
        portadaBase64 = "";
        previewImg.src = "";
        previewContainer.classList.add("oculto");
        labelPortada.classList.remove("oculto");
    }

    // Guardar el ISBN actual para poder rastrear el libro original si se cambia su ISBN
    isbnModificacion = isbn;

    btnAñadir.innerHTML = "<span>Guardar Cambios</span>";
    btnCancelar.classList.remove("oculto");
    tituloInput.textContent = "Editar Libro";
    inputTitulo.focus();
}

/**
 * Alterna el estado de disponibilidad de un libro (Prestado / Disponible).
 * @param {string} isbn - El ISBN del libro.
 */
function prestamoLibro(isbn) {
    const indice = libros.findIndex(libro => libro.isbn === isbn);

    if (indice !== -1) {
        const libro = libros[indice];
        libro.isDisponible = !libro.isDisponible;
        if (!libro.isDisponible) {
            libro.alquiladoCount = (libro.alquiladoCount || 0) + 1;
        }
        guardarLibrosLocalStorage();
        filtrarYMostrarLibros();
        const mensaje = libro.isDisponible ? 
            `"${libro.titulo}" ha sido devuelto y está disponible.` : 
            `"${libro.titulo}" ha sido prestado.`;
        mostrarToast(mensaje, "success");
    }
}

/**
 * Guarda la lista actual de libros en el almacenamiento local (localStorage).
 */
function guardarLibrosLocalStorage() {
    try {
        localStorage.setItem("libros", JSON.stringify(libros));
    } catch (error) {
        console.error("No se pudo guardar en localStorage:", error);
        mostrarToast("Ocurrió un error al intentar guardar los datos localmente.", "error");
    }
}

/**
 * Carga los libros desde el almacenamiento local y normaliza los datos.
 */
function cargarLibrosLocalStorage() {
    try {
        const librosLocalStorage = localStorage.getItem("libros");
        if (librosLocalStorage) {
            const cargados = JSON.parse(librosLocalStorage);
            // Normalizar datos viejos agregándoles un ISBN autogenerado si no lo tuvieran
            libros = cargados.map((libro, index) => {
                if (!libro.isbn) {
                    libro.isbn = `MIG-${Date.now()}-${index}`;
                }
                if (libro.alquiladoCount === undefined) {
                    libro.alquiladoCount = 0;
                }
                return libro;
            });
        } else {
            libros = [];
        }
    } catch (error) {
        console.error("No se pudo cargar desde localStorage:", error);
        mostrarToast("Ocurrió un error al intentar cargar los datos guardados.", "error");
        libros = [];
    }
}

/**
 * Exporta la lista de libros actual en formato JSON para su descarga.
 */
function exportarLibros() {
    try {
        const datos = JSON.stringify(libros, null, 4);
        const archivo = new Blob([datos], { type: "application/json" });
        const url = URL.createObjectURL(archivo);
        const enlace = document.createElement("a");
        enlace.href = url;
        enlace.download = "libros.json";
        enlace.click();
        URL.revokeObjectURL(url);
        mostrarToast("Datos exportados correctamente en formato JSON.", "success");
    } catch (error) {
        console.error("Error al exportar libros:", error);
        mostrarToast("No se pudieron exportar los datos.", "error");
    }
}

/**
 * Exporta la lista de libros actual en formato PDF utilizando jsPDF.
 */
function exportarPdf() {
    if (libros.length === 0) {
        mostrarToast("No hay libros en la colección para exportar.", "error");
        return;
    }

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Título del PDF
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(18);
        doc.setTextColor(197, 168, 128); // Color dorado #c5a880
        doc.text("Biblioteca Digital - Colección de Libros", 14, 20);

        // Subtítulo / Fecha
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        const fecha = new Date().toLocaleDateString("es-ES", {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
        doc.text(`Reporte generado el ${fecha}`, 14, 27);

        // Datos de la tabla
        const cabeceras = [["ISBN", "Título", "Autor", "Género", "Estado", "Alquileres"]];
        const filas = libros.map(libro => [
            libro.isbn || "—",
            libro.titulo,
            libro.autor,
            libro.genero,
            libro.isDisponible ? "Disponible" : "Prestado",
            `${libro.alquiladoCount || 0} préstamos`
        ]);

        // Generar la tabla en el PDF usando autotable
        doc.autoTable({
            startY: 32,
            head: cabeceras,
            body: filas,
            theme: 'grid',
            headStyles: {
                fillColor: [197, 168, 128], // Color dorado #c5a880
                textColor: [10, 13, 12], // Oscuro #0a0d0c
                fontStyle: 'bold'
            },
            styles: {
                fontSize: 9,
                cellPadding: 3
            },
            columnStyles: {
                0: { cellWidth: 35 }, // ISBN
                1: { cellWidth: 45 }, // Título
                2: { cellWidth: 35 }, // Autor
                3: { cellWidth: 30 }, // Género
                4: { cellWidth: 22 }, // Estado
                5: { cellWidth: 22 }  // Alquileres
            }
        });

        // Guardar PDF
        doc.save("biblioteca_digital_libros.pdf");
        mostrarToast("Colección exportada a PDF correctamente.", "success");
    } catch (error) {
        console.error("Error al exportar a PDF:", error);
        mostrarToast("No se pudo generar el archivo PDF.", "error");
    }
}

/**
 * Abre un lector de archivos para importar una lista de libros desde un archivo JSON.
 */
function importarLibros() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.click();

    input.addEventListener("change", (event) => {
        const archivo = event.target.files[0];
        if (archivo) {
            const lector = new FileReader();
            lector.onload = () => {
                try {
                    const datosImportados = JSON.parse(lector.result);
                    if (Array.isArray(datosImportados)) {
                        // Normalizar libros importados sin ISBN
                        libros = datosImportados.map((libro, index) => {
                            if (!libro.isbn) {
                                libro.isbn = `IMP-${Date.now()}-${index}`;
                            }
                            if (libro.alquiladoCount === undefined) {
                                libro.alquiladoCount = 0;
                            }
                            return libro;
                        });
                        guardarLibrosLocalStorage();
                        filtrarYMostrarLibros();
                        mostrarToast("Libros importados correctamente.", "success");
                    } else {
                        mostrarToast("El archivo importado debe contener una lista válida de libros.", "error");
                    }
                } catch (error) {
                    console.error("Error al parsear el archivo importado:", error);
                    mostrarToast("El archivo no tiene un formato JSON válido.", "error");
                }
            };
            lector.readAsText(archivo);
        }
    });
}

/**
 * Actualiza y renderiza la sección del Top 3 de libros más prestados.
 */
function actualizarTopLibros() {
    const topListaContenedor = document.getElementById("topLibrosLista");
    if (!topListaContenedor) return;

    topListaContenedor.innerHTML = "";

    // Filtrar libros que se hayan alquilado al menos una vez
    const librosConAlquileres = libros.filter(libro => (libro.alquiladoCount || 0) > 0);

    if (librosConAlquileres.length === 0) {
        topListaContenedor.innerHTML = `
            <div class="top-libros-vacio">
                Aún no hay préstamos registrados. ¡Presta algún libro de la lista para iniciar el ranking!
            </div>
        `;
        return;
    }

    // Ordenar de mayor a menor según el número de alquileres
    const ranking = [...librosConAlquileres]
        .sort((a, b) => b.alquiladoCount - a.alquiladoCount)
        .slice(0, 3);

    ranking.forEach((libro, index) => {
        const item = document.createElement("div");
        item.classList.add("top-libro-item");

        const rankClass = `top-libro-rank--${index + 1}`;
        
        item.innerHTML = `
            <div class="top-libro-rank ${rankClass}">${index + 1}</div>
            <div class="top-libro-info">
                <div class="top-libro-titulo" title="${libro.titulo}">${libro.titulo}</div>
                <div class="top-libro-autor" title="${libro.autor}">${libro.autor}</div>
            </div>
            <div class="top-libro-count">
                ${libro.alquiladoCount} ${libro.alquiladoCount === 1 ? 'préstamo' : 'préstamos'}
            </div>
        `;

        topListaContenedor.appendChild(item);
    });
}

/**
 * Procesa la imagen de portada seleccionada por el usuario, redimensionándola
 * y comprimiéndola mediante un canvas a formato JPEG Base64 de tamaño óptimo.
 * @param {Event} event - Evento de cambio del input file.
 */
function procesarImagenPortada(event) {
    const archivo = event.target.files[0];
    if (!archivo) return;

    // Validar tipo de archivo
    if (!archivo.type.startsWith("image/")) {
        mostrarToast("Por favor, seleccione un archivo de imagen válido.", "error");
        inputPortada.value = "";
        return;
    }

    const lector = new FileReader();
    lector.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            // Dimensiones objetivo para la portada (miniatura premium)
            const anchoMax = 120;
            const altoMax = 180;
            
            let ancho = img.width;
            let alto = img.height;
            
            // Mantener la relación de aspecto
            if (ancho > alto) {
                if (ancho > anchoMax) {
                    alto = Math.round((alto * anchoMax) / ancho);
                    ancho = anchoMax;
                }
            } else {
                if (alto > altoMax) {
                    ancho = Math.round((ancho * altoMax) / alto);
                    alto = altoMax;
                }
            }

            // Crear un canvas invisible para redimensionar y comprimir
            const canvas = document.createElement("canvas");
            canvas.width = ancho;
            canvas.height = alto;
            
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, ancho, alto);
            
            // Obtener la imagen comprimida en JPEG (calidad 70% para ahorrar mucho espacio)
            portadaBase64 = canvas.toDataURL("image/jpeg", 0.7);
            
            // Actualizar vista previa
            previewImg.src = portadaBase64;
            previewContainer.classList.remove("oculto");
            labelPortada.classList.add("oculto");
        };
        img.src = e.target.result;
    };
    lector.readAsDataURL(archivo);
}

/**
 * Elimina la portada seleccionada del formulario actual.
 */
function eliminarPortadaSeleccionada() {
    inputPortada.value = "";
    portadaBase64 = "";
    previewImg.src = "";
    previewContainer.classList.add("oculto");
    labelPortada.classList.remove("oculto");
}

/**
 * Muestra la vista previa flotante de la portada al pasar el ratón por encima.
 * @param {MouseEvent} event - Evento mouseover de la tabla.
 */
function mostrarHoverPortada(event) {
    const targetImg = event.target.closest(".tabla-portada");
    if (targetImg) {
        hoverPreviewImg.src = targetImg.src;
        hoverPreview.classList.add("mostrar");
    }
}

/**
 * Desplaza la vista previa flotante de la portada siguiendo el movimiento del cursor.
 * Incluye lógica de colisiones de pantalla para evitar que se desborde del viewport.
 * @param {MouseEvent} event - Evento mousemove de la tabla.
 */
function moverHoverPortada(event) {
    const targetImg = event.target.closest(".tabla-portada");
    if (targetImg && hoverPreview.classList.contains("mostrar")) {
        const offset = 15; // Distancia del cursor
        let x = event.clientX + offset;
        let y = event.clientY + offset;

        const previewAncho = 160;
        const previewAlto = 240;

        // Comprobación de límites horizontales
        if (x + previewAncho > window.innerWidth) {
            x = event.clientX - previewAncho - offset;
        }

        // Comprobación de límites verticales
        if (y + previewAlto > window.innerHeight) {
            y = event.clientY - previewAlto - offset;
        }

        hoverPreview.style.left = `${x}px`;
        hoverPreview.style.top = `${y}px`;
    }
}

/**
 * Oculta la vista previa flotante cuando el ratón sale de la portada.
 * @param {MouseEvent} event - Evento mouseout de la tabla.
 */
function ocultarHoverPortada(event) {
    const targetImg = event.target.closest(".tabla-portada");
    if (targetImg) {
        hoverPreview.classList.remove("mostrar");
        hoverPreviewImg.src = "";
    }
}

// Inicialización de la aplicación al cargar la página
cargarLibrosLocalStorage();
filtrarYMostrarLibros();