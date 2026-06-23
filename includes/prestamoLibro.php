<?php
declare(strict_types=1);

require_once __DIR__ . '/conexionDB.php';

// Verificar que se haya pasado el ISBN por la URL (GET)
if (isset($_GET['ISBN'])) {
    $isbn = intval($_GET['ISBN']);
    
    if ($isbn > 0) {
        // 1. Consultar el estado actual del libro de forma segura
        $query = "SELECT Disponible, Vecesprestado FROM libros WHERE ISBN = ?";
        $stmt = mysqli_prepare($conn, $query);
        
        if ($stmt) {
            mysqli_stmt_bind_param($stmt, "i", $isbn);
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);
            
            if ($row = mysqli_fetch_assoc($result)) {
                $disponible = intval($row['Disponible']);
                $vecesPrestado = intval($row['Vecesprestado']);
                
                // Determinar el nuevo estado y el contador de préstamos
                if ($disponible === 1) {
                    $nuevoEstado = 0; // Cambiar a prestado (no disponible)
                    $nuevasVeces = $vecesPrestado + 1; // Incrementar número de alquileres
                    $statusMsg = "success_prestamo";
                } else {
                    $nuevoEstado = 1; // Cambiar a disponible
                    $nuevasVeces = $vecesPrestado; // Mantener el mismo número
                    $statusMsg = "success_devolucion";
                }
                
                mysqli_stmt_close($stmt);
                
                // 2. Actualizar el libro con el nuevo estado en la base de datos
                $updateQuery = "UPDATE libros SET Disponible = ?, Vecesprestado = ? WHERE ISBN = ?";
                $updateStmt = mysqli_prepare($conn, $updateQuery);
                
                if ($updateStmt) {
                    mysqli_stmt_bind_param($updateStmt, "iii", $nuevoEstado, $nuevasVeces, $isbn);
                    
                    if (mysqli_stmt_execute($updateStmt)) {
                        mysqli_stmt_close($updateStmt);
                        // Redireccionar con éxito
                        header("Location: ../index.php?status=" . $statusMsg);
                        exit;
                    }
                    mysqli_stmt_close($updateStmt);
                }
            } else {
                mysqli_stmt_close($stmt);
            }
        }
    }
}

// Redireccionar con error si falla
header("Location: ../index.php?status=error_prestamo");
exit;
