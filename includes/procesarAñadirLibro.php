<?php
declare(strict_types=1);

require_once __DIR__ . '/conexionDB.php';

// Verificar que se haya enviado por POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Recuperar y limpiar variables recibidas del formulario
    $isbnOriginal = isset($_POST['isbnOriginal']) ? trim($_POST['isbnOriginal']) : '';
    $isbn = isset($_POST['ISBN']) ? intval($_POST['ISBN']) : 0;
    $titulo = isset($_POST['titulo']) ? trim($_POST['titulo']) : '';
    $autor = isset($_POST['autor']) ? trim($_POST['autor']) : '';
    $genero = isset($_POST['genero']) ? trim($_POST['genero']) : '';
    $ano = isset($_POST['año']) ? intval($_POST['año']) : 0;
    $paginas = isset($_POST['paginas']) ? intval($_POST['paginas']) : 0;

    // Validación básica de que todos los campos requeridos tengan contenido válido
    if ($isbn > 0 && !empty($titulo) && !empty($autor) && !empty($genero) && $ano > 0 && $paginas > 0) {
        
        // --- CASO MODIFICAR (UPDATE) ---
        if ($isbnOriginal !== '') {
            $isbnOriginalVal = intval($isbnOriginal);

            // 1. Si cambiaron el ISBN, verificar que el nuevo ISBN no esté en uso por otro libro
            if ($isbnOriginalVal !== $isbn) {
                $checkQuery = "SELECT ISBN FROM libros WHERE ISBN = ?";
                $checkStmt = mysqli_prepare($conn, $checkQuery);
                if ($checkStmt) {
                    mysqli_stmt_bind_param($checkStmt, "i", $isbn);
                    mysqli_stmt_execute($checkStmt);
                    mysqli_stmt_store_result($checkStmt);
                    
                    if (mysqli_stmt_num_rows($checkStmt) > 0) {
                        mysqli_stmt_close($checkStmt);
                        header("Location: ../index.php?status=error&msg=isbn_duplicado");
                        exit;
                    }
                    mysqli_stmt_close($checkStmt);
                }
            }

            // 2. Determinar si se subió una nueva portada para el update
            $portadaNueva = false;
            $portadaData = "";
            if (isset($_FILES['portada']) && $_FILES['portada']['error'] === UPLOAD_ERR_OK) {
                $portadaTmp = $_FILES['portada']['tmp_name'];
                $imageInfo = getimagesize($portadaTmp);
                if ($imageInfo !== false) {
                    $portadaData = file_get_contents($portadaTmp);
                    $portadaNueva = true;
                }
            }

            // 3. Ejecutar UPDATE en base de datos
            if ($portadaNueva) {
                // Actualizar todo, incluyendo la nueva imagen
                $updateQuery = "UPDATE libros SET ISBN = ?, Titulo = ?, Autor = ?, Año = ?, Genero = ?, Numpaginas = ?, Portada = ? WHERE ISBN = ?";
                $updateStmt = mysqli_prepare($conn, $updateQuery);
                if ($updateStmt) {
                    // Mapeo correcto de tipos: issssisi (8 parámetros)
                    mysqli_stmt_bind_param($updateStmt, "issssisi", $isbn, $titulo, $autor, $ano, $genero, $paginas, $portadaData, $isbnOriginalVal);
                }
            } else {
                // Actualizar solo los datos, manteniendo la portada existente intacta
                $updateQuery = "UPDATE libros SET ISBN = ?, Titulo = ?, Autor = ?, Año = ?, Genero = ?, Numpaginas = ? WHERE ISBN = ?";
                $updateStmt = mysqli_prepare($conn, $updateQuery);
                if ($updateStmt) {
                    mysqli_stmt_bind_param($updateStmt, "issssii", $isbn, $titulo, $autor, $ano, $genero, $paginas, $isbnOriginalVal);
                }
            }

            if (isset($updateStmt) && $updateStmt) {
                if (mysqli_stmt_execute($updateStmt)) {
                    mysqli_stmt_close($updateStmt);
                    header("Location: ../index.php?status=success_update");
                    exit;
                } else {
                    mysqli_stmt_close($updateStmt);
                    header("Location: ../index.php?status=error&msg=db_error");
                    exit;
                }
            } else {
                header("Location: ../index.php?status=error&msg=prepare_error");
                exit;
            }

        } else {
            // --- CASO NUEVO LIBRO (INSERT) ---

            // 1. Comprobar si el ISBN ya existe en la base de datos
            $checkQuery = "SELECT ISBN FROM libros WHERE ISBN = ?";
            $checkStmt = mysqli_prepare($conn, $checkQuery);
            if ($checkStmt) {
                mysqli_stmt_bind_param($checkStmt, "i", $isbn);
                mysqli_stmt_execute($checkStmt);
                mysqli_stmt_store_result($checkStmt);
                
                if (mysqli_stmt_num_rows($checkStmt) > 0) {
                    mysqli_stmt_close($checkStmt);
                    header("Location: ../index.php?status=error&msg=isbn_duplicado");
                    exit;
                }
                mysqli_stmt_close($checkStmt);
            }

            // 2. Procesar la subida del archivo de portada
            $portadaData = ""; 
            if (isset($_FILES['portada']) && $_FILES['portada']['error'] === UPLOAD_ERR_OK) {
                $portadaTmp = $_FILES['portada']['tmp_name'];
                $imageInfo = getimagesize($portadaTmp);
                if ($imageInfo !== false) {
                    $portadaData = file_get_contents($portadaTmp);
                }
            }

            // 3. Insertar el nuevo libro
            $insertQuery = "INSERT INTO libros (ISBN, Titulo, Autor, Año, Genero, Numpaginas, Disponible, Vecesprestado, Portada) VALUES (?, ?, ?, ?, ?, ?, 1, 0, ?)";
            $insertStmt = mysqli_prepare($conn, $insertQuery);
            
            if ($insertStmt) {
                mysqli_stmt_bind_param($insertStmt, "issssis", $isbn, $titulo, $autor, $ano, $genero, $paginas, $portadaData);
                
                if (mysqli_stmt_execute($insertStmt)) {
                    mysqli_stmt_close($insertStmt);
                    header("Location: ../index.php?status=success");
                    exit;
                } else {
                    mysqli_stmt_close($insertStmt);
                    header("Location: ../index.php?status=error&msg=db_error");
                    exit;
                }
            } else {
                header("Location: ../index.php?status=error&msg=prepare_error");
                exit;
            }
        }

    } else {
        // Datos del formulario incompletos o inválidos
        header("Location: ../index.php?status=error&msg=datos_incompletos");
        exit;
    }
} else {
    // Redireccionar si no se accede mediante POST
    header("Location: ../index.php");
    exit;
}
