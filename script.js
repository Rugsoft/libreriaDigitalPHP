/**
 * Estado de la aplicación: Lista de libros y estado de modificación.
 */
let libros = [];
let isbnModificacion = null; // Almacena el ISBN del libro que se está editando

// Referencias a los elementos del DOM de entrada y formulario
const inputTitulo = document.getElementById("titulo");
const inputAutor = document.getElementById("autor");
const inputGenero = document.getElementById("genero");
const inputIsbn = document.getElementById("ISBN");
const inputBuscar = document.getElementById("buscar");

// Referencias a los elementos de visualización de datos y contadores
const numeroRegistros = document.querySelector(".contenedor__listado-registros");
const registroDisponibles = document.getElementById("registrosDisponibles");
const tablaLibros = document.getElementById("tablaLibros");

// Referencias a los botones y elementos de control
const btnAñadir = document.getElementById("btnAñadir");
const btnCancelar = document.getElementById("btnCancelar");
const formularioAñadir = document.getElementById("formularioAñadir");
const estadoLibros = document.getElementById("estadoLibros");
const btnImportar = document.getElementById("btnImportar");
const btnExportar = document.getElementById("btnExportar");

// Registro de manejadores de eventos
formularioAñadir.addEventListener("submit", añadirLibro);
btnCancelar.addEventListener("click", limpiarFormulario);
estadoLibros.addEventListener("change", filtrarYMostrarLibros); // Filtrado instantáneo al cambiar el selector
inputBuscar.addEventListener("input", filtrarYMostrarLibros); // Filtrado reactivo en tiempo real al escribir
btnImportar.addEventListener("click", importarLibros);
btnExportar.addEventListener("click", exportarLibros);

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
        window.alert("Por favor, rellene todos los campos antes de añadir el libro.");
        return;
    }

    if (isbnModificacion !== null) {
        // Encontrar la posición del libro original por su ISBN previo
        const indice = libros.findIndex(libro => libro.isbn === isbnModificacion);

        if (indice !== -1) {
            // Validar que el nuevo ISBN no esté ya en uso por otro libro diferente
            const isbnDuplicado = libros.some((libro, i) => libro.isbn === isbn && i !== indice);
            if (isbnDuplicado) {
                window.alert("Error: Ya existe otro libro registrado con este ISBN.");
                inputIsbn.focus();
                return;
            }

            // Actualizar los datos del libro existente
            libros[indice] = {
                titulo,
                autor,
                genero,
                isbn,
                isDisponible: libros[indice].isDisponible
            };
        }
        isbnModificacion = null;
        btnAñadir.textContent = "Añadir libro";
    } else {
        // Validar que el ISBN del nuevo libro no esté repetido
        const isbnDuplicado = libros.some(libro => libro.isbn === isbn);
        if (isbnDuplicado) {
            window.alert("Error: Ya existe un libro registrado con este ISBN.");
            inputIsbn.focus();
            return;
        }

        // Crear y añadir el nuevo objeto de libro
        const nuevoLibro = {
            titulo,
            autor,
            genero,
            isbn,
            isDisponible: true
        };
        libros.push(nuevoLibro);
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
    inputTitulo.focus();
    btnAñadir.textContent = "Añadir libro";
    isbnModificacion = null;
    btnCancelar.classList.add("oculto");
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
 * Renderiza los libros proporcionados en la tabla HTML del DOM.
 * @param {Array} datosLibros - Array de libros a pintar.
 */
function mostrarLibros(datosLibros = libros) {
    tablaLibros.innerHTML = "";

    datosLibros.forEach((libro) => {
        const fila = document.createElement("tr");

        // Celda del ISBN
        const tdIsbn = document.createElement("td");
        tdIsbn.textContent = libro.isbn || "—";

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
        tdDisponibilidad.textContent = libro.isDisponible ? "Disponible" : "Prestado";

        // Celda de Acciones con sus respectivos botones
        const tdAcciones = document.createElement("td");
        const contenedorBotones = document.createElement("div");
        contenedorBotones.classList.add("contenedor__listado-acciones");

        // Botón Eliminar
        const botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";
        botonEliminar.classList.add("boton-eliminar");
        botonEliminar.addEventListener("click", () => eliminarLibro(libro.isbn));

        // Botón Modificar
        const botonModificar = document.createElement("button");
        botonModificar.textContent = "Modificar";
        botonModificar.classList.add("boton-modificar");
        botonModificar.addEventListener("click", () => modificarLibro(libro.isbn));

        // Botón Prestar / Devolver
        const botonPrestar = document.createElement("button");
        botonPrestar.textContent = libro.isDisponible ? "Prestar" : "Devolver";
        botonPrestar.classList.add("boton-prestar");
        botonPrestar.addEventListener("click", () => prestamoLibro(libro.isbn));

        contenedorBotones.appendChild(botonEliminar);
        contenedorBotones.appendChild(botonModificar);
        contenedorBotones.appendChild(botonPrestar);
        tdAcciones.appendChild(contenedorBotones);

        // Añadir todas las celdas a la fila
        fila.appendChild(tdIsbn);
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
    numeroRegistros.textContent = `Total libros: ${libros.length}`;
    const disponibles = libros.filter(libro => libro.isDisponible).length;
    registroDisponibles.textContent = `Libros disponibles: ${disponibles}`;
}

/**
 * Elimina un libro de la lista a partir de su ISBN.
 * @param {string} isbn - El ISBN del libro a eliminar.
 */
function eliminarLibro(isbn) {
    const confirmar = window.confirm("¿Seguro que quieres eliminar el libro?");

    if (confirmar) {
        const indice = libros.findIndex(libro => libro.isbn === isbn);
        if (indice !== -1) {
            libros.splice(indice, 1);
            guardarLibrosLocalStorage();
            filtrarYMostrarLibros();
        }
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

    // Guardar el ISBN actual para poder rastrear el libro original si se cambia su ISBN
    isbnModificacion = isbn;

    btnAñadir.textContent = "Guardar Cambios";
    btnCancelar.classList.remove("oculto");
    inputTitulo.focus();
}

/**
 * Alterna el estado de disponibilidad de un libro (Prestado / Disponible).
 * @param {string} isbn - El ISBN del libro.
 */
function prestamoLibro(isbn) {
    const indice = libros.findIndex(libro => libro.isbn === isbn);

    if (indice !== -1) {
        libros[indice].isDisponible = !libros[indice].isDisponible;
        guardarLibrosLocalStorage();
        filtrarYMostrarLibros();
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
        window.alert("Ocurrió un error al intentar guardar los datos localmente.");
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
                return libro;
            });
        } else {
            libros = [];
        }
    } catch (error) {
        console.error("No se pudo cargar desde localStorage:", error);
        window.alert("Ocurrió un error al intentar cargar los datos guardados.");
        libros = [];
    }
}

/**
 * Exporta la lista de libros actual en formato JSON para su descarga.
 */
function exportarLibros() {
    const datos = JSON.stringify(libros, null, 4);
    const archivo = new Blob([datos], { type: "application/json" });
    const url = URL.createObjectURL(archivo);
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = "libros.json";
    enlace.click();
    URL.revokeObjectURL(url);
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
                            return libro;
                        });
                        guardarLibrosLocalStorage();
                        filtrarYMostrarLibros();
                        window.alert("Libros importados correctamente.");
                    } else {
                        window.alert("El archivo importado debe contener una lista válida de libros.");
                    }
                } catch (error) {
                    console.error("Error al parsear el archivo importado:", error);
                    window.alert("El archivo no tiene un formato JSON válido.");
                }
            };
            lector.readAsText(archivo);
        }
    });
}

// Inicialización de la aplicación al cargar la página
cargarLibrosLocalStorage();
filtrarYMostrarLibros();