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