let = libros = []

const inputTitulo = document.getElementById("titulo");
const inputAutor = document.getElementById("autor");
const inputGenero = document.getElementById("genero");

const numeroRegistros = document.querySelector(".contenedor__listado-registros");
const tablaLibros = document.getElementById("tablaLibros");

const btnAñadir = document.getElementById("btnAñadir");

btnAñadir.addEventListener("click", añadirLibro);

function añadirLibro() {

    let titulo = inputTitulo.value;
    let autor = inputAutor.value;
    let genero = inputGenero.value;

    if(titulo === "" || autor === "" || genero === ""){
        alert("Revisa los datos del libro");
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

        fila.innerHTML = `
            <td>${libro.titulo}</td>
            <td>${libro.autor}</td>
            <td>${libro.genero}</td>
            <td>
                <button onclick="eliminarProducto(${indice})">
                    Eliminar
                </button>
            </td>
            `
        tablaLibros.appendChild(fila);
    });
    actualizarRegistro();
}

function actualizarRegistro() {

    numeroRegistros.textContent = "Total libros: " + libros.length;

}

function eliminarProducto(indice) {

    libros.splice(indice, 1);
    mostrarLibros();
    guardarLibrosLocalStorage();
}

function guardarLibrosLocalStorage() {
    localStorage.setItem("libros", JSON.stringify(libros));
}

function cargarLibrosLocalStorage() {
    const librosLocalStorage = localStorage.getItem("libros");
    if (librosLocalStorage) {
        libros = JSON.parse(librosLocalStorage);
    }
}

cargarLibrosLocalStorage();

mostrarLibros();
actualizarRegistro();