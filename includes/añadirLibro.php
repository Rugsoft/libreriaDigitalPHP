        <section class="contenedor__añadir">
            <h2 class="contenedor__añadir-titulo">Añadir Libros a la colección</h2>

            <form id="formularioAñadir">
                <label for="titulo">Título del libro</label>
                <input type="text" id="titulo" placeholder="Introduzca el título" required>

                <label for="autor">Autor del libro</label>
                <input type="text" id="autor" placeholder="Introduzca el autor" required>

                <label for="genero">Género del libro</label>
                <input type="text" id="genero" placeholder="Introduzca el género" required>

                <label for="ISBN">ISBN</label>
                <input type="text" id="ISBN" placeholder="Introduzca el ISBN" required>

                <label>Portada del libro</label>
                <div class="portada-upload-container">
                    <input type="file" id="portada" accept="image/*" class="oculto-file">
                    <label for="portada" class="portada-upload-label" id="portadaLabel">
                        <svg class="upload-icono" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.008-.007-.008.008-.008-.008.008-.008Zm0 0v.008" />
                        </svg>
                        <span class="upload-texto">Seleccionar portada</span>
                    </label>
                    <div id="portadaPreviewContainer" class="portada-preview-container oculto">
                        <img id="portadaPreview" src="" alt="Vista previa de la portada">
                        <button type="button" id="btnEliminarPortada" class="btn-eliminar-portada" title="Eliminar portada">✕</button>
                    </div>
                </div>

                <button type="submit" class="contenedor__añadir-boton" id="btnAñadir">
                    <span>Añadir libro</span>
                </button>
                <button type="button" class="contenedor__añadir-boton oculto" id="btnCancelar">Cancelar Edición</button>
            </form>
        </section>