let = libros = [];

const inputTitulo = document.getElementById("titulo");
const inputAutor = document.getElementById("autor");
const inputGenero = document.getElementById("genero");

const numeroRegistros = document.querySelector(".contenedor__listado-registros");
const tablaLibros = document.getElementById("tablaLibros");

const btnAñadir = document.getElementById("btnAñadir");

btnAñadir.addEventListener("click", añadirLibro);

function añadirLibro() {

    let titulo = inputTitulo.value.trim();
    let autor = inputAutor.value.trim();
    let genero = inputGenero.value.trim();

    if(titulo === "" || autor === "" || genero === ""){
        alert("Por favor, rellene todos los campos antes de añadir el libro.");
        return;
    }

    const libro = {
        titulo: titulo,
        autor: autor,
        genero: genero
    }

    libros.push(libro);

    limpiarFormulario();
    mostrarLibros();
    guardarLibrosLocalStorage();
}

function limpiarFormulario() {
    inputTitulo.value = "";
    inputAutor.value = "";
    inputGenero.value = "";
    inputTitulo.focus();
}

function mostrarLibros(){

    tablaLibros.innerHTML = "";

    libros.forEach((libro, indice) => {

        const fila = document.createElement("tr");

         // Creamos cada celda y aplicamos .textContent para evitar inyecciones XSS
        const tdTitulo = document.createElement("td");
        tdTitulo.textContent = libro.titulo;
        const tdAutor = document.createElement("td");
        tdAutor.textContent = libro.autor;
        const tdGenero = document.createElement("td");
        tdGenero.textContent = libro.genero;
        const tdAcciones = document.createElement("td");
        const botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";

        // Manejador de eventos dinámico y seguro
        botonEliminar.addEventListener("click", () => eliminarLibro(indice));
        tdAcciones.appendChild(botonEliminar);

        // Añadimos celdas a la fila
        fila.appendChild(tdTitulo);
        fila.appendChild(tdAutor);
        fila.appendChild(tdGenero);
        fila.appendChild(tdAcciones);

        // Añadimos la fila a la tabla
        tablaLibros.appendChild(fila);
    });

    actualizarRegistro();
}

function actualizarRegistro() {

    numeroRegistros.textContent = "Total libros: " + libros.length;

}

function eliminarLibro(indice) {

    libros.splice(indice, 1);
    mostrarLibros();
    guardarLibrosLocalStorage();
}

function guardarLibrosLocalStorage() {

    try{
        localStorage.setItem("libros", JSON.stringify(libros));
    }catch(error){
        window.alert("No se puedo guardar en localStorage", error);
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

cargarLibrosLocalStorage();
mostrarLibros();