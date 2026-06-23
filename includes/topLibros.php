<?php
require_once __DIR__ . '/conexionDB.php';

// Consulta para obtener los 3 libros con más préstamos (mínimo 1 préstamo)
$topQuery = "SELECT Titulo, Autor, Vecesprestado FROM libros WHERE Vecesprestado > 0 ORDER BY Vecesprestado DESC LIMIT 3";
$topResult = mysqli_query($conn, $topQuery);
?>
        <section class="contenedor__top-libros">
            <h2 class="contenedor__top-libros-titulo">Libros más populares</h2>
            <div id="topLibrosLista" class="top-libros-lista">
                <?php
                if (!$topResult || mysqli_num_rows($topResult) === 0) {
                    echo '<div class="top-libros-vacio">
                        Aún no hay préstamos registrados. ¡Presta algún libro de la lista para iniciar el ranking!
                    </div>';
                } else {
                    $rank = 1;
                    while ($libro = mysqli_fetch_assoc($topResult)) {
                        $titulo = htmlspecialchars((string)($libro['Titulo'] ?? ''));
                        $autor = htmlspecialchars((string)($libro['Autor'] ?? ''));
                        $veces = intval($libro['Vecesprestado']);
                        $rankClass = "top-libro-rank--" . $rank;
                        ?>
                        <div class="top-libro-item">
                            <div class="top-libro-rank <?php echo $rankClass; ?>"><?php echo $rank; ?></div>
                            <div class="top-libro-info">
                                <div class="top-libro-titulo" title="<?php echo $titulo; ?>"><?php echo $titulo; ?></div>
                                <div class="top-libro-autor" title="<?php echo $autor; ?>"><?php echo $autor; ?></div>
                            </div>
                            <div class="top-libro-count">
                                <?php echo $veces . ' ' . ($veces === 1 ? 'préstamo' : 'préstamos'); ?>
                            </div>
                        </div>
                        <?php
                        $rank++;
                    }
                }
                ?>
            </div>
        </section>