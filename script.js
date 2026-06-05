let libros = [];

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
        genero: genero,
        isDisponible: true
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
        botonEliminar.addEventListener("click", () => eliminarLibro(indice));
        contenedorBotones.appendChild(botonEliminar);
        botonModificar.addEventListener("click", () => modificarLibro(indice));
        contenedorBotones.appendChild(botonModificar);
        botonPrestar.addEventListener("click", () => prestamoLibro(indice));
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

}

function eliminarLibro(indice) {

    libros.splice(indice, 1);
    mostrarLibros();
    guardarLibrosLocalStorage();
}

function modificarLibro(indice) {

    inputTitulo.value = libros[indice].titulo;
    inputAutor.value = libros[indice].autor;
    inputGenero.value = libros[indice].genero;

    eliminarLibro(indice);
    inputTitulo.focus();

}

function prestamoLibro(indice) {

    if (libros[indice].isDisponible) {
        libros[indice].isDisponible = false;
    } else {
        libros[indice].isDisponible = true;
    }

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