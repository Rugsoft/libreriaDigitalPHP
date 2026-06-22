
<?php

    include './includes/cabecera.php';
    include './includes/añadirLibro.php';
    include './includes/importExport.php';
    include './includes/topLibros.php';
    include './includes/tablaLibros.php';
?>

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

    </div> <!-- Cierre del contenedor principal -->

<?php
    include './includes/footer.php';
?>