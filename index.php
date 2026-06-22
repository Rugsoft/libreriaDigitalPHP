
<?php
// index.php
    include './includes/cabecera.php';
    include './includes/añadirLibro.php';
?>

        <section class="contenedor__manejo-datos">
            <h2 class="contenedor__manejo-datos-titulo">Manejo de Datos</h2>
            <div class="contenedor__manejo-datos-acciones">
                <button id="btnExportar">
                    <svg class="btn-icono" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    <span>Exportar Datos</span>
                </button>                       
                <button id="btnImportar">
                    <svg class="btn-icono" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                    </svg>
                    <span>Importar Datos</span>
                </button>
                <button id="btnExportarPdf">
                    <svg class="btn-icono" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                    <span>Exportar PDF</span>
                </button>
                <button id="btnExportarExcel">
                    <svg class="btn-icono" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5M7.5 5.25v13.5m9-13.5v13.5" />
                    </svg>
                    <span>Exportar Excel</span>
                </button>
            </div>
        </section>

        <section class="contenedor__top-libros">
            <h2 class="contenedor__top-libros-titulo">Libros más populares</h2>
            <div id="topLibrosLista" class="top-libros-lista">
                <!-- Se cargará dinámicamente desde JS -->
            </div>
        </section>

        <section class="contenedor__listado">
            <h2 class="contenedor__listado-titulo">Listado de libros</h2>
            
            <div class="contenedor__listado-stats">
                <div class="stat-card">
                    <span class="stat-card__numero" id="totalLibros">0</span>
                    <span class="stat-card__etiqueta">Total Libros</span>
                </div>
                <div class="stat-card stat-card--disponible">
                    <span class="stat-card__numero" id="registrosDisponibles">0</span>
                    <span class="stat-card__etiqueta">Disponibles</span>
                </div>
                <div class="stat-card stat-card--prestado">
                    <span class="stat-card__numero" id="registrosNoDisponibles">0</span>
                    <span class="stat-card__etiqueta">Prestados</span>
                </div>
            </div>

            <div class="contenedor__botones">
                <div class="buscar-wrapper">
                    <svg class="buscar-icono" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z" />
                    </svg>
                    <input type="text" id="buscar" placeholder="Buscar por título, autor, género o ISBN...">
                </div>
                <select name="estadoLibros" id="estadoLibros">
                    <option value="todos">Todos los libros</option>
                    <option value="disponibles">Disponibles</option>
                    <option value="noDisponibles">Prestados</option>
                </select>
            </div>

            <div class="contenedor__tabla-wrapper">
                <table class="contenedor__listado-tabla">
                    <thead>
                        <tr>
                            <th>ISBN</th>
                            <th>Portada</th>
                            <th>Título</th>
                            <th>Autor</th>
                            <th>Género</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="tablaLibros">
                    </tbody>
                </table>
            </div>
        </section>

    </div>

    <!-- Toast de Notificaciones -->
    <div id="toastContainer" class="toast-container"></div>

    <!-- Vista previa flotante al pasar el ratón -->
    <div id="portadaHoverPreview" class="portada-hover-preview">
        <img id="portadaHoverPreviewImg" src="" alt="Vista previa ampliada">
    </div>

    <!-- Modal de Confirmación -->
    <div id="modalConfirmacion" class="modal oculto">
        <div class="modal__contenido">
            <div class="modal__cabecera">
                <svg class="modal__icono-alerta" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
                <h3 class="modal__titulo">Confirmar Eliminación</h3>
            </div>
            <p class="modal__mensaje">¿Estás seguro de que deseas eliminar este libro de la colección? Esta acción no se puede deshacer.</p>
            <div class="modal__acciones">
                <button id="modalBtnCancelar" class="btn-secundario">Cancelar</button>
                <button id="modalBtnConfirmar" class="btn-peligro">Eliminar</button>
            </div>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>