<?php
declare(strict_types=1);

require_once __DIR__ . '/conexionDB.php';

/**
 * Consulta la base de datos de libros y renderiza sus filas en formato HTML.
 *
 * @param mysqli $conn Objeto de conexión a la base de datos.
 * @return void
 */
function mostrarLibros(mysqli $conn): void {
    // Obtener filtro del estado por URL (GET)
    $estado = isset($_GET['estado']) ? trim($_GET['estado']) : 'todos';

    // Construir consulta según el filtro
    $sql = "SELECT * FROM libros";
    if ($estado === 'disponibles') {
        $sql .= " WHERE Disponible = 1";
    } elseif ($estado === 'noDisponibles') {
        $sql .= " WHERE Disponible = 0";
    }

    $result = mysqli_query($conn, $sql);

    // Si ocurre un error en la consulta o no existen registros (colspan = 9 por las nuevas columnas)
    if (!$result || mysqli_num_rows($result) === 0) {
        ?>
        <tr>
            <td colspan="9">
                <div class="empty-state">
                    <svg class="empty-state__icono" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                    </svg>
                    <h4 class="empty-state__titulo">No se encontraron libros</h4>
                    <p class="empty-state__texto">Tu colección está vacía o no hay libros registrados en la base de datos.</p>
                </div>
            </td>
        </tr>
        <?php
        return;
    }

    // Recorrer cada libro e imprimir su respectiva fila
    while ($libro = mysqli_fetch_assoc($result)) {
        // Mapeo exacto de las columnas reales de la base de datos
        $isbn = htmlspecialchars((string)($libro['ISBN'] ?? ''));
        $titulo = htmlspecialchars((string)($libro['Titulo'] ?? ''));
        $autor = htmlspecialchars((string)($libro['Autor'] ?? ''));
        $genero = htmlspecialchars((string)($libro['Genero'] ?? ''));
        $ano = htmlspecialchars((string)($libro['Año'] ?? ''));
        $numpaginas = htmlspecialchars((string)($libro['Numpaginas'] ?? ''));
        $portadaRaw = $libro['Portada'] ?? '';
        
        // Conversión a booleano del estado de disponibilidad (columna 'Disponible')
        $isDisponible = isset($libro['Disponible']) ? (bool)$libro['Disponible'] : true;

        echo "<tr>";
        
        // 1. Columna ISBN
        echo "<td>" . ($isbn !== '' ? $isbn : '—') . "</td>";
        
        // 2. Columna Portada (imagen base64/URL o placeholder SVG)
        echo "<td>";
        if (!empty($portadaRaw)) {
            // Soporta datos binarios puros (BLOB) y cadenas base64 directas
            if (strpos((string)$portadaRaw, 'data:image') === 0) {
                $portadaSrc = $portadaRaw;
            } else {
                $portadaSrc = 'data:image/jpeg;base64,' . base64_encode((string)$portadaRaw);
            }
            echo '<img src="' . htmlspecialchars((string)$portadaSrc) . '" class="tabla-portada" alt="Portada de ' . $titulo . '">';
        } else {
            echo '<div class="tabla-portada-placeholder">
                <svg class="placeholder-icono" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
            </div>';
        }
        echo "</td>";
        
        // 3, 4, 5. Columnas Título, Autor y Género
        echo "<td>" . $titulo . "</td>";
        echo "<td>" . $autor . "</td>";
        echo "<td>" . $genero . "</td>";

        // 6, 7. Columnas Año y Páginas
        echo "<td>" . $ano . "</td>";
        echo "<td>" . $numpaginas . "</td>";
        
        // 8. Columna Estado
        echo "<td>";
        if ($isDisponible) {
            echo '<span class="status-badge status-badge--disponible">Disponible</span>';
        } else {
            echo '<span class="status-badge status-badge--prestado">Prestado</span>';
        }
        echo "</td>";
        
        // 9. Columna Acciones
        echo "<td>";
        echo '<div class="contenedor__listado-acciones">';
        
        // Botón Eliminar
        echo '<button class="boton-eliminar" onclick="eliminarLibro(\'' . $isbn . '\')">
            <svg class="btn-icono" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
            <span>Eliminar</span>
        </button>';
        
        // Botón Modificar
        $attrIsbn = htmlspecialchars((string)($libro['ISBN'] ?? ''), ENT_QUOTES, 'UTF-8');
        $attrTitulo = htmlspecialchars((string)($libro['Titulo'] ?? ''), ENT_QUOTES, 'UTF-8');
        $attrAutor = htmlspecialchars((string)($libro['Autor'] ?? ''), ENT_QUOTES, 'UTF-8');
        $attrGenero = htmlspecialchars((string)($libro['Genero'] ?? ''), ENT_QUOTES, 'UTF-8');
        $attrAno = htmlspecialchars((string)($libro['Año'] ?? ''), ENT_QUOTES, 'UTF-8');
        $attrPaginas = htmlspecialchars((string)($libro['Numpaginas'] ?? ''), ENT_QUOTES, 'UTF-8');
        
        $attrPortada = '';
        if (!empty($portadaRaw)) {
            if (strpos((string)$portadaRaw, 'data:image') === 0) {
                $attrPortada = htmlspecialchars((string)$portadaRaw, ENT_QUOTES, 'UTF-8');
            } else {
                $attrPortada = htmlspecialchars('data:image/jpeg;base64,' . base64_encode((string)$portadaRaw), ENT_QUOTES, 'UTF-8');
            }
        }

        echo '<button class="boton-modificar" onclick="modificarLibro(this)" 
            data-isbn="' . $attrIsbn . '" 
            data-titulo="' . $attrTitulo . '" 
            data-autor="' . $attrAutor . '" 
            data-genero="' . $attrGenero . '" 
            data-ano="' . $attrAno . '" 
            data-paginas="' . $attrPaginas . '" 
            data-portada="' . $attrPortada . '">
            <svg class="btn-icono" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.83 20.082a4.5 4.5 0 0 1-2.054 1.215L2.5 22l.707-2.278a4.5 4.5 0 0 1 1.215-2.054l12.44-12.44Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 7.125 16.862 4.487" />
            </svg>
            <span>Modificar</span>
        </button>';
        
        // Botón Prestar / Devolver
        $prestadoSvg = '<svg class="btn-icono" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" /></svg>';
        $prestarSvg = '<svg class="btn-icono" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 9l6 6m0 0l-6 6m6-6H9a6 6 0 0 1 0-12h3" /></svg>';
        
        echo '<button class="boton-prestar" onclick="prestamoLibro(\'' . $isbn . '\')">';
        if ($isDisponible) {
            echo $prestarSvg . '<span>Prestar</span>';
        } else {
            echo $prestadoSvg . '<span>Devolver</span>';
        }
        echo '</button>';
        
        echo '</div>';
        echo "</td>";
        
        echo "</tr>";
    }
}