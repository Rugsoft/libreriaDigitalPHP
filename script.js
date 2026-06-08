let libros = [];
let indiceModificacion = null;
let tablaDisponible = false;
let tablaFiltrados = false;
let buscar = "";
let librosDisponibles = [];
let librosFiltrados = [];


const inputTitulo = document.getElementById("titulo");
const inputAutor = document.getElementById("autor");
const inputGenero = document.getElementById("genero");
const inputBuscar = document.getElementById("buscar");

const numeroRegistros = document.querySelector(".contenedor__listado-registros");
const registroDisponibles = document.getElementById("registrosDisponibles");
const tablaLibros = document.getElementById("tablaLibros");

const btnAñadir = document.getElementById("btnAñadir");
const formularioAñadir = document.getElementById("formularioAñadir");
const estadoLibros = document.getElementById("estadoLibros");
const btnImportar = document.getElementById("btnImportar");
const btnExportar = document.getElementById("btnExportar");



formularioAñadir.addEventListener("submit", añadirLibro);
estadoLibros.addEventListener("change", mostrarLibros);
inputBuscar.addEventListener("input", mostrarLibros);
btnImportar.addEventListener("click", importarLibros);
btnExportar.addEventListener("click", exportarLibros);


function añadirLibro(event) {
    if (event) event.preventDefault();

    let titulo = inputTitulo.value.trim();
    let autor = inputAutor.value.trim();
    let genero = inputGenero.value.trim();

    if(titulo === "" || autor === "" || genero === ""){
        alert("Por favor, rellene todos los campos antes de añadir el libro.");
        return;
    }

    if (indiceModificacion !== null) {

        libros[indiceModificacion] = {
            titulo: titulo,
            autor: autor,
            genero: genero,
            isDisponible: libros[indiceModificacion].isDisponible
        };

        indiceModificacion = null;
        btnAñadir.textContent = "Añadir Libro";
    } else {

        const libro = {
        titulo: titulo,
        autor: autor,
        genero: genero,
        isDisponible: true
        }
        libros.push(libro);
    }

    if (tablaDisponible) {

        mostrarDisponibles();
    } else if (tablaFiltrados) {

        buscarLibro();
    } else {

        mostrarLibros();
    }


    limpiarFormulario();
    guardarLibrosLocalStorage();
}

function limpiarFormulario() {
    inputTitulo.value = "";
    inputAutor.value = "";
    inputGenero.value = "";
    inputTitulo.focus();
}

function mostrarLibros(datosLibros = libros){

    tablaLibros.innerHTML = "";

    datosLibros.forEach((libro, indice) => {

        const fila = document.createElement("tr");

         // Creamos cada celda y aplicamos .textContent para evitar inyecciones
        const tdTitulo = document.createElement("td");
        tdTitulo.textContent = libro.titulo;
        const tdAutor = document.createElement("td");
        tdAutor.textContent = libro.autor;
        const tdGenero = document.createElement("td");
        tdGenero.textContent = libro.genero;
        const tdDisponibilidad = document.createElement("td");
        tdDisponibilidad.textContent = libro.isDisponible ? "Disponible" : "Prestado";

        const tdAcciones = document.createElement("td");
        const contenedorBotones = document.createElement("div");
        contenedorBotones.classList.add("contenedor__listado-acciones");
        const botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";
        botonEliminar.classList.add("boton-eliminar");
        const botonModificar = document.createElement("button");
        botonModificar.textContent = "Modificar";
        botonModificar.classList.add("boton-modificar");
        const botonPrestar = document.createElement("button");
        botonPrestar.textContent = libro.isDisponible ? "Prestar" : "Devolver";
        botonPrestar.classList.add("boton-prestar");


        // Manejador de eventos dinámico y seguro
        botonEliminar.addEventListener("click", () => eliminarLibro(libro.titulo));
        contenedorBotones.appendChild(botonEliminar);
        botonModificar.addEventListener("click", () => modificarLibro(libro.titulo));
        contenedorBotones.appendChild(botonModificar);
        botonPrestar.addEventListener("click", () => prestamoLibro(libro.titulo));
        contenedorBotones.appendChild(botonPrestar);
        tdAcciones.appendChild(contenedorBotones);



        // Añadimos celdas a la fila
        fila.appendChild(tdTitulo);
        fila.appendChild(tdAutor);
        fila.appendChild(tdGenero);
        fila.appendChild(tdDisponibilidad);
        fila.appendChild(tdAcciones);

        // Añadimos la fila a la tabla
        tablaLibros.appendChild(fila);
    });

    actualizarRegistro();
}

function actualizarRegistro() {

    numeroRegistros.textContent = "Total libros: " + libros.length;
    registroDisponibles.textContent = "Libros disponibles: " + libros.filter(libro => libro.isDisponible).length;

}

function mostrarDisponibles() {

    librosDisponibles = libros.filter(libro => libro.isDisponible);
    tablaDisponible = true;

    if (librosDisponibles.length === 0) {
        window.alert("No hay libros disponibles");
        return;
    }
    mostrarLibros(librosDisponibles);
}

function eliminarLibro(titulo) {

    const confirmar = confirm("¿Seguro que quieres eliminar el libro?");

    if (confirmar) {
        const indice = libros.findIndex(libro => libro.titulo === titulo);
        if (indice !== -1) {

            libros.splice(indice, 1);
            mostrarLibros();
            guardarLibrosLocalStorage();
        }
    } 
}

function modificarLibro(titulo) {

    const indice = libros.findIndex(libro => libro.titulo === titulo);

    if (indice === -1) {
        return;
    }

    inputTitulo.value = libros[indice].titulo;
    inputAutor.value = libros[indice].autor;
    inputGenero.value = libros[indice].genero;

    indiceModificacion = indice;

    btnAñadir.textContent = "Guardar Cambios";

    //eliminarLibro(indice);
    inputTitulo.focus();

}

function prestamoLibro(titulo) {

    const indice = libros.findIndex(libro => libro.titulo === titulo);

    if (indice !== -1) {
        libros[indice].isDisponible = !libros[indice].isDisponible;
        if (tablaDisponible) {

            mostrarDisponibles();
            const isDisponible = libros.filter(libro => libro.isDisponible);
            if (isDisponible.length === 0){

                tablaDisponible = false;
                mostrarLibros();
            }
        } else if (tablaFiltrados) {

            mostrarLibros(librosFiltrados);
        } else {

            mostrarLibros();
        }
        guardarLibrosLocalStorage();
    }
}

function buscarLibro() {

    buscar = inputBuscar.value.trim();

    if (buscar === "") {
        window.alert("Por favor, introduce un término de búsqueda válido.")
        mostrarLibros();
        return;
    }

    librosFiltrados = libros.filter(libro => 
        libro.titulo.toLowerCase().includes(buscar.toLowerCase()) ||
        libro.autor.toLowerCase().includes(buscar.toLowerCase()) ||
        libro.genero.toLowerCase().includes(buscar.toLowerCase())
    );

    if (librosFiltrados.length === 0) {
        
        window.alert("No se encontraron libros con ese término de búsqueda.");
        mostrarLibros();
        inputBuscar.value = "";
        inputBuscar.focus();
        return;
    }
    tablaFiltrados = true;
    mostrarLibros(librosFiltrados);
}

function guardarLibrosLocalStorage() {

    try{
        localStorage.setItem("libros", JSON.stringify(libros));
    }catch(error){
        window.alert("No se pudo guardar en localStorage", error);
    }
    
}

function cargarLibrosLocalStorage() {
    
    try {

        const librosLocalStorage = localStorage.getItem("libros");
        if (librosLocalStorage) {
            libros = JSON.parse(librosLocalStorage);
        }
    } catch (error) {
        window.alert("No se pudo cargar de localStorage", error);
        libros = [];
    }
}

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
                    libros = JSON.parse(lector.result);
                    mostrarLibros();
                    guardarLibrosLocalStorage();
                    window.alert("Libros importados correctamente.");
                } catch (error) {
                    window.alert("El archivo no tiene un formato JSON válido.");
                }
            };
            lector.readAsText(archivo);
        }
    });
}

cargarLibrosLocalStorage();
mostrarLibros();